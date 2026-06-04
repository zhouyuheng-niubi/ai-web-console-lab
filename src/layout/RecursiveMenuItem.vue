<template>
  <div class="menu-item-wrapper">
    <!-- 菜单项 -->
    <div 
      class="flex items-center w-full pl-[33px] pr-[27px] mb-[10px] cursor-pointer h-[50px] leading-1 text-[#717B92] menu-item"
      :class="{ 
        'active-menu-item': isMenuItemActive,
        'active-menu-item-with-dot': isActive && !hasChildren,
        '!border-none !px-[20px]': collapsed,
        'menu-item-has-children': hasChildren,
        '!hidden': item.hide
      }"
      :style="level > 0 ? { 'padding-left': 33 + level * 20 + 'px' } : {}"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @click="onMenuClick"
    >
      <img :src="iconSrc" class="w-[22px] h-[20px] block shrink-0" :class="{ 'active-icon': isMenuItemActive }" v-if="iconSrc" />
      
      <div 
        class="text-[16px] ml-[8px] transition-opacity duration-300 flex-1"
        :class="{ 'opacity-0': collapsed, 'opacity-100': !collapsed, 'active-text': isMenuItemActive }"
      >
        {{ item.label }}
      </div>

      <!-- 子菜单展开/收起箭头 -->
      <div 
        v-if="hasChildren && !collapsed" 
        class="arrow-icon transition-transform duration-300"
        :class="{ 'arrow-rotate': isExpanded, 'active-arrow': isMenuItemActive }"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <!-- 图标提示区分是否完成 -->
      <CheckOutlined class="text-[12px]"  v-else-if="item.finished && !isMenuItemActive && !collapsed" />
      <!-- Tooltip -->
      <!-- 移除原来的 Tooltip，因为我们现在使用全局 Tooltip -->
    </div>

    <!-- 子菜单 -->
    <div 
      v-if="hasChildren && isExpanded && !collapsed" 
      class="submenu-container"
    >
      <RecursiveMenuItem
        v-for="(child, childIndex) in item.children"
        :key="childIndex"
        :item="child"
        :level="level + 1"
        :collapsed="collapsed"
        :active-path="activePath"
        :expanded-mens="expandedMens"
        :menu-path="`${menuPath}-${childIndex}`"
        @menu-click="handleChildMenuClick"
        @expand-change="handleExpandChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
// 定义属性
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  activePath: {
    type: String,
    required: true
  },
  expandedMens: {
    type: Object,
    required: true
  },
  menuPath: {
    type: String,
    required: true
  }
})

// 定义事件
const emit = defineEmits(['menuClick', 'expandChange'])

// 状态
const isHovered = ref(false)
const tooltipElement = ref<HTMLElement | null>(null)
let hideTooltipTimer = null
let showTooltipTimer = null // 用于防抖显示
let clickToShowTooltip = false // 标记是否因点击而显示
let isMouseClicked = false // 标记是否发生了鼠标点击事件
let preventHideOnNextLeave = false // 防止下次mouseleave时隐藏Tooltip

// 计算属性
const hasChildren = computed(() => props.item.children && props.item.children.length > 0)
const isExpanded = computed(() => props.expandedMens[props.menuPath] || false)
const isActive = computed(() => props.activePath === props.item.path)

// 检查是否有激活的子孙菜单项
const hasActiveDescendant = computed(() => {
  if (!props.item.children || props.item.children.length === 0) {
    return false
  }
  
  const checkActive = (children) => {
    for (const child of children) {
      if (props.activePath === child.path) {
        return true
      }
      if (child.children && checkActive(child.children)) {
        return true
      }
    }
    return false
  }
  
  return checkActive(props.item.children)
})

//是否为激活状态
const isMenuItemActive = computed(() => {
  return isActive.value || hasActiveDescendant.value
})

const iconSrc = computed(() => {
  if (isMenuItemActive.value) {
    return props.item.activeIcon || props.item.icon
  }
  if (isHovered.value) {
    return props.item.activeIcon || props.item.icon
  }
  return props.item.icon
})

// 方法
const onMouseEnter = (event) => {
  isHovered.value = true
  if (hideTooltipTimer) {
    clearTimeout(hideTooltipTimer)
    hideTooltipTimer = null
  }
  
  if (showTooltipTimer) {
    clearTimeout(showTooltipTimer)
  }
  if (isMouseClicked) {
    return
  }
  showTooltipTimer = setTimeout(() => {
    // 创建全局 Tooltip
    if (props.collapsed) {
      createGlobalTooltip(event.target, props.item.label, props.item.children)
    }
  }, 200) // 200ms 防抖延迟
}

const onMouseLeave = () => {
  isHovered.value = false
  if (showTooltipTimer) {
    clearTimeout(showTooltipTimer)
    showTooltipTimer = null
  }
  
  // 如果标记了防止隐藏，则不清除
  if (preventHideOnNextLeave) {
    preventHideOnNextLeave = false // 重置标记
    return
  }
  
  if (!clickToShowTooltip) {
    hideTooltipTimer = setTimeout(() => {
      // 检查鼠标是否在 Tooltip 上
      if (tooltipElement.value && !isMouseOnTooltip()) {
        removeGlobalTooltip()
      }
    }, 300)
  }
}

// 添加点击事件处理函数
const onMenuClick = (event) => {
  isMouseClicked = true
  if (props.collapsed) {
    if (hasChildren.value) {
      clickToShowTooltip = true
      preventHideOnNextLeave = true
      
      if (hideTooltipTimer) {
        clearTimeout(hideTooltipTimer)
        hideTooltipTimer = null
      }
      
      if (showTooltipTimer) {
        clearTimeout(showTooltipTimer)
        showTooltipTimer = null
      }
      
      createGlobalTooltip(event.target, props.item.label, props.item.children)
      
      setTimeout(() => {
        clickToShowTooltip = false
        isMouseClicked = false
        preventHideOnNextLeave = false
      }, 1000)
    } else {
      handleClick()
    }
  } else {
    handleClick()
    setTimeout(() => {
      isMouseClicked = false
    }, 100)
  }
}

// 检查鼠标是否在 Tooltip 上
const isMouseOnTooltip = () => {
  if (!tooltipElement.value) return false;
  
  // 通过检查鼠标悬停标志来判断
  return tooltipElement.value.getAttribute('data-mouse-hover') === 'true';
}

// 全局点击事件处理器，用于关闭 Tooltip
const handleGlobalClick = (event) => {
  // 如果是点击显示的Tooltip，短时间内不处理全局点击
  if (clickToShowTooltip) {
    return;
  }
  
  // 如果点击的不是 Tooltip 或其子元素，则移除 Tooltip
  if (tooltipElement.value && !tooltipElement.value.contains(event.target)) {
    removeGlobalTooltip()
  }
}

// 组件挂载时添加全局点击事件监听器
onMounted(() => {
  document.addEventListener('click', handleGlobalClick)
})

// 组件卸载时移除全局点击事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick)
  // 确保清理 Tooltip
  removeGlobalTooltip()
  // 清除定时器
  if (hideTooltipTimer) {
    clearTimeout(hideTooltipTimer)
  }
  if (showTooltipTimer) {
    clearTimeout(showTooltipTimer)
  }
  // 重置标记
  isMouseClicked = false
  clickToShowTooltip = false
  preventHideOnNextLeave = false
})

const createGlobalTooltip = (targetElement, text, children = []) => {
  // 移除已存在的 Tooltip
  removeGlobalTooltip()
  
  // 创建新的 Tooltip 元素
  const tooltip = document.createElement('div')
  tooltip.className = 'global-tooltip'
  
  // 创建标题部分
  const titleDiv = document.createElement('div')
  titleDiv.className = 'tooltip-title'
  titleDiv.textContent = text
  tooltip.appendChild(titleDiv)
  
  // 如果有子菜单，创建子菜单列表
  if (children && children.length > 0) {
    titleDiv.style.borderBottom = '1px solid #ddd'
    titleDiv.style.marginBottom = '4px'
    titleDiv.style.paddingBottom = '4px'
    
    const listDiv = document.createElement('div')
    listDiv.className = 'tooltip-list'
    
    // 递归创建子菜单项
    const createMenuItem = (child, level = 0) => {
      const itemDiv = document.createElement('div')
      itemDiv.className = 'tooltip-item'
      
      // 根据层级设置缩进
      if (level > 0) {
        itemDiv.style.paddingLeft = (level * 12) + 'px'
      }
      
      // 设置内容
      itemDiv.textContent = child.label
      
      // 检查子菜单项是否为激活状态（根据当前路由地址进行匹配）
      // 使用更灵活的匹配方式，支持路径前缀匹配
      const isChildActive = checkRouteMatch(child.path, props.activePath);
      if (isChildActive) {
        itemDiv.style.color = '#0058FD' // 激活文本颜色
        itemDiv.style.fontWeight = 'bold'
      } else {
        // 非激活项使用默认颜色
        itemDiv.style.color = '#333'
      }
      
      // 为子菜单项添加点击事件
      itemDiv.addEventListener('click', (event) => {
        event.stopPropagation();
        // 调用菜单点击处理函数
        handleChildMenuClick(child);
        // 移除 Tooltip
        removeGlobalTooltip();
      });
      
      // 添加悬停样式
      itemDiv.addEventListener('mouseenter', () => {
        itemDiv.style.backgroundColor = '#f0f0f0';
        itemDiv.style.cursor = 'pointer';
      });
      
      itemDiv.addEventListener('mouseleave', () => {
        // 恢复激活状态的特殊颜色
        const isChildActive = checkRouteMatch(child.path, props.activePath);
        if (isChildActive) {
          itemDiv.style.backgroundColor = 'transparent';
          itemDiv.style.color = '#0058FD';
          itemDiv.style.fontWeight = 'bold';
        } else {
          itemDiv.style.backgroundColor = 'transparent';
          itemDiv.style.color = '#333';
          itemDiv.style.fontWeight = 'normal';
        }
        itemDiv.style.cursor = 'pointer';
      });
      
      // 设置基础样式
      itemDiv.style.paddingTop = '2px'
      itemDiv.style.paddingBottom = '2px'
      itemDiv.style.fontSize = '12px'
      
      listDiv.appendChild(itemDiv)
      
      // 如果子菜单项还有自己的子菜单，递归创建
      if (child.children && child.children.length > 0) {
        child.children.forEach(subChild => {
          const subItem = createMenuItem(subChild, level + 1)
          listDiv.appendChild(subItem)
        })
      }
      
      return itemDiv
    }
    
    // 为每个子菜单项创建DOM元素
    children.forEach((child) => {
      createMenuItem(child, 0)
    })
    
    tooltip.appendChild(listDiv)
    
    // 添加列表样式
    listDiv.style.marginTop = '4px'
  } else {
    // 如果没有子菜单，为标题添加点击事件
    titleDiv.addEventListener('click', (event) => {
      event.stopPropagation();
      // 调用菜单点击处理函数
      handleClick();
      // 移除 Tooltip
      removeGlobalTooltip();
    });
    
    // 添加悬停样式
    titleDiv.addEventListener('mouseenter', () => {
      titleDiv.style.backgroundColor = '#f0f0f0';
      titleDiv.style.cursor = 'pointer';
    });
    
    titleDiv.addEventListener('mouseleave', () => {
      titleDiv.style.backgroundColor = 'transparent';
      titleDiv.style.cursor = 'pointer';
    });
  }
  tooltip.style.position = 'fixed';
  tooltip.style.background = '#fff'; // 浅色背景
  tooltip.style.color = '#333'; // 深色文字
  tooltip.style.padding = '8px 12px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.fontSize = '14px';
  tooltip.style.zIndex = '9999';
  tooltip.style.pointerEvents = 'auto'; // 允许鼠标事件
  tooltip.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
  tooltip.style.minWidth = '120px';
  tooltip.style.border = '1px solid #ddd';
  tooltip.style.maxHeight = '300px';
  tooltip.style.overflow = 'auto';
  
  titleDiv.style.fontWeight = 'bold';
  titleDiv.style.color = '#333';
  
  tooltip.addEventListener('mouseenter', () => {
    if (hideTooltipTimer) {
      clearTimeout(hideTooltipTimer);
      hideTooltipTimer = null;
    }
    tooltip.setAttribute('data-mouse-hover', 'true');
  });
  
  tooltip.addEventListener('mouseleave', () => {
    tooltip.setAttribute('data-mouse-hover', 'false');
    hideTooltipTimer = setTimeout(() => {
      removeGlobalTooltip();
    }, 300); // 300ms 延迟隐藏
  });
  
  tooltip.setAttribute('data-mouse-hover', 'false');
  
  // 添加到 body
  document.body.appendChild(tooltip);
  tooltipElement.value = tooltip;
  
  // 定位 Tooltip
  const rect = targetElement.getBoundingClientRect();
  tooltip.style.left = rect.right + 12 + 'px';
  tooltip.style.top = rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2) + 'px';
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  if (tooltipRect.bottom > viewportHeight) {
    tooltip.style.top = rect.top - tooltip.offsetHeight + rect.height + 'px';
  }
  
  if (tooltipRect.top < 0) {
    tooltip.style.top = '10px';
  }
}

// 检查路由是否匹配的
const checkRouteMatch = (menuItemPath, activePath) => {
  if (!menuItemPath || !activePath) return false;
  
  if (menuItemPath === activePath) return true;
  
  // 前缀匹配
  if (activePath.startsWith(menuItemPath)) {
    return activePath.charAt(menuItemPath.length) === '/' || 
           menuItemPath.length === activePath.length;
  }
  
  return false;
}

const removeGlobalTooltip = () => {
  if (tooltipElement.value) {
    if (tooltipElement.value.parentNode) {
      tooltipElement.value.parentNode.removeChild(tooltipElement.value)
    }
    tooltipElement.value = null
  }
}

const handleClick = () => {
  if (hasChildren.value) {
    // 切换展开状态
    emit('expandChange', props.menuPath, !isExpanded.value)
  } else {
    // 跳转页面
    emit('menuClick', props.item)
  }
}

const handleChildMenuClick = (item) => {
  emit('menuClick', item)
}

const handleExpandChange = (path, expanded) => {
  emit('expandChange', path, expanded)
}
</script>

<style scoped lang="scss">
.menu-item-wrapper {
  position: relative;
}

.menu-item {
  transition: all 0.3s ease;
  position: relative;
  // 确保菜单项不会隐藏Tooltip
  overflow: visible;

  &:hover {
    color: #0058FD;
    background-color: #F1F7FD;
    border: 1px solid #9CB0F6;
  }

  .arrow-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: #717B92;
    transition: all 0.3s ease;

    &.arrow-rotate {
      transform: rotate(90deg);
    }
    &.active-arrow {
      color: #0058FD;
    }
  }
}

.active-icon {
  filter: brightness(0) saturate(100%) invert(25%) sepia(98%) saturate(2477%) hue-rotate(214deg) brightness(99%) contrast(99%);
}

.active-text {
  color: #0058FD;
}

// 子菜单容器
.submenu-container {
  overflow: hidden;
  animation: slideDown 0.3s ease-out;
}

// Tooltip样式
.tooltip {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 9999;
  margin-left: 12px;
  opacity: 1;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.active-menu-item {
  color: #0058FD;
}

.active-menu-item-with-dot {
  color: #0058FD;
  border: 1px solid #9CB0F6;
  background-color: #F1F7FD;
  
  ::after {
    content: '';
    position: absolute;
    right: 27px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background-color: #0058FD;
    border-radius: 50%;
  }
}

// 旋转动画
.rotate-180 {
  transform: rotate(180deg);
}

// 子菜单展开动画
@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 200px;
    transform: translateY(0);
  }
}

// 响应式调整
@media (max-width: 768px) {
  .menu-item {
    height: 45px;
    font-size: 14px;
  }
}
</style>