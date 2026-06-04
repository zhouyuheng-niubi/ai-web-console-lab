<template>
    <div class="sider-container bg-[#fff] pt-[20px] transition-all duration-300 flex flex-col h-full" v-if="currentMenu?.length > 0"
        :style="{ width: collapsed ? '80px' : '240px' }" :class="{ 'collapsed': collapsed }">
        <div class="flex-1 overflow-y-auto overflow-x-hidden">
          <!-- 菜单项 -->
          <RecursiveMenuItem
            v-for="(item, index) in currentMenu"
            :key="index"
            :item="item"
            :level="0"
            :collapsed="collapsed"
            :active-path="activePath"
            :expanded-mens="expandedMens"
            :menu-path="`${index}`"
            @menu-click="toPage"
            @expand-change="handleExpandChange"
          />
        </div>
        <!-- 收缩展开按钮 -->
        <div class="flex justify-between pl-[20px] pr-[20px] mb-[20px] flex-shrink-0">
            <!-- <Button type="primary" size="small" v-if="!collapsed 
            && currentKey !== 'systemConfigMenu' && currentKey !== 'safetyProMenu'" @click="backPre(currentKey)">返回</Button> -->
            <div class="toggle-btn w-[32px] h-[32px] rounded-full
             bg-[#F1F7FD] flex items-center justify-center cursor-pointer hover:bg-[#E1E9F9] transition-colors relative"
                @click="toggleCollapse" @mouseenter="toggleHover = true" @mouseleave="toggleHover = false">
                <svg :class="{ 'rotate-180': collapsed }" class="w-[16px] h-[16px] transition-transform" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>

                <!-- 收缩展开按钮的Tooltip -->
                <!-- <div v-if="toggleHover" class="toggle-tooltip">
                    {{ collapsed ? '展开边栏' : '收起边栏' }}
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/store'
import {message,Button} from 'ant-design-vue'
import { useRouter } from 'vue-router';
import { computed, ref, watch} from 'vue';
import RecursiveMenuItem from './RecursiveMenuItem.vue';
import {menuSetting,isoutpageLink} from './menu'
const router = useRouter()
const collapsed = ref(false)
const toggleHover = ref(false)
const menuStore = useMenuStore()
const currentKey = computed(() => menuStore.currentKey)
const currentMenu = computed(() => menuStore.currentMenu)
// 菜单列表定义
// 子菜单展开状态管理
const expandedMens = ref({})

const toggleCollapse = () => {
    collapsed.value = !collapsed.value
    // 边栏收起时，自动收起所有子菜单
    if (collapsed.value) {
        expandedMens.value = {}
    }
}

const activePath = computed(() => {
    return router.currentRoute.value.fullPath
})

// 监听路由变化，自动展开当前路径对应的菜单
watch(activePath, (newPath) => {
  expandedMens.value = {}
  // 通过查找menuSetting，匹配对应的currentMenu和currentKey
  let matchedKey = '';
  let matchedMenu = [];

  // 处理特殊路径
  // if(newPath === '/other-module?type=emergency-map&system=true'){
  //   menuStore.setCurrentKey('emergencyMenu');
  //   return
  // }
  // if(newPath === '/aiInteligent'){
  //   menuStore.setCurrentKey('aiMenu');
  //   return
  // }
  // if(newPath === '/dataCockpit'){
  //   menuStore.setCurrentKey('comprehensiveRiskMenu');
  //   return
  // }
  // end

  // if(['/other-module?type=emergency-map&system=true', '/aiInteligent/databoard', '/dataCockpit'].includes(newPath)){
  //   collapsed.value = true
  // }
  // else{
  //   collapsed.value = false
  // }



  // 遍历menuSetting查找匹配的菜单
  for (const key in menuSetting) {
    const menus = menuSetting[key];
    let found = false;
    const checkMenu = (items) => {
      if (!items) return false;
      for (const item of items) {
        if (item.path === newPath) {
          return true;
        }
        if (item.children && checkMenu(item.children)) {
          return true;
        }
      }
      return false;
    };
    
    if (checkMenu(menus)) {
      matchedKey = key;
      matchedMenu = menus;
      found = true;
    }
    
    if (found) break;
  }
  
  // 如果找到了匹配的菜单，更新store中的currentKey和currentMenu
  if (matchedKey) {
    menuStore.setCurrentKey(matchedKey);
    menuStore.setCurrentMenu(matchedMenu);
  }

  // 递归查找匹配的菜单项并展开父级
  const expandParentMenus = (items, parentPath = '') => {
    items.forEach((item, index) => {
      const currentPath = parentPath ? `${parentPath}-${index}` : `${index}`
      
      if (item.children && item.children.length > 0) {
        let hasActiveDescendant = false;
        const dfsCheck = (menuItems) => {
          if (!menuItems) return false;
          
          for (const menuItem of menuItems) {
            if (newPath === menuItem.path) {
              return true;
            }
            if (menuItem.children && dfsCheck(menuItem.children)) {
              return true;
            }
          }
          return false;
        };
        
        hasActiveDescendant = dfsCheck(item.children);
        
        // 如果当前菜单项有激活的后代，则展开当前菜单
        if (hasActiveDescendant) {
          expandedMens.value[currentPath] = true
        }
        
        // 递归处理子菜单
        expandParentMenus(item.children, currentPath)
      } else {
        if (newPath === item.path) {
          // 如果是叶子节点匹配，那么它的所有父节点都应该展开
          let tempPath = parentPath;
          while (tempPath) {
            expandedMens.value[tempPath] = true;
            const lastDashIndex = tempPath.lastIndexOf('-');
            if (lastDashIndex !== -1) {
              tempPath = tempPath.substring(0, lastDashIndex);
            } else {
              tempPath = '';
            }
          }
        }
      }
    })
  }
  
  if (matchedMenu.length > 0) {
    expandParentMenus(matchedMenu)
  } else {
    // 如果没找到匹配的菜单，尝试使用currentMenu
    expandParentMenus(currentMenu.value || [])
  }
  if(isoutpageLink(newPath, false)){
    router.replace({
      path:'/function-introduce',
      query: {
        menu: matchedKey,
      },
    });
  }

}, { immediate: true })

// 处理菜单展开/收起
const handleExpandChange = (menuPath, expanded) => {
  if (expanded) {
    // 获取当前展开项的所有祖先路径
    const getCurrentAncestors = (path) => {
      const ancestors = [];
      const parts = path.split('-');
      let currentPath = '';
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (i === 0) {
          currentPath = parts[0];
        } else {
          currentPath += '-' + parts[i];
        }
        ancestors.push(currentPath);
      }
      
      return ancestors;
    };
    
    // 获取新展开项的祖先路径
    const newAncestors = getCurrentAncestors(menuPath);
    
    // 检查现有的展开项是否与新展开项有共同的祖先
    const hasCommonAncestor = Object.keys(expandedMens.value).some(existingPath => {
      // 如果是同一个菜单项，跳过检查
      if (existingPath === menuPath) return false;
      
      // 获取已有展开项的祖先路径
      const existingAncestors = getCurrentAncestors(existingPath);
      
      // 检查是否有共同祖先
      return newAncestors.some(ancestor => existingAncestors.includes(ancestor)) ||
             existingAncestors.some(ancestor => newAncestors.includes(ancestor));
    });
    
    // 如果没有共同祖先，则关闭其他所有展开项
    if (!hasCommonAncestor) {
      // 只保留当前路径及其祖先路径
      const toKeep = [...newAncestors, menuPath];
      const newExpandedMens = {};
      
      toKeep.forEach(path => {
        newExpandedMens[path] = true;
      });
      
      expandedMens.value = newExpandedMens;
    }
    
    // 设置当前菜单的展开状态
    expandedMens.value[menuPath] = expanded;
  } else {
    // 收起菜单时直接设置状态
    expandedMens.value[menuPath] = expanded;
  }
}
const backPre = (key:string) => {
  switch (key) {
    case 'aiMenu':
      router.replace('/aiInteligent');
      break;
    case 'safetyProMenu':
      router.replace('/');
      break;
    case 'emergencyMenu':
      router.replace('/other-module?type=emergency-map&system=true');
      break;
    case 'comprehensiveRiskMenu':
      router.replace('/dataCockpit');
      break;
    // case 'systemConfigMenu':
    //   if(menuStore.preKey) backPre(menuStore.preKey)
    //   else router.replace('/');
    //   break;
    default:
      router.replace('/');
      break;
  }
}

const toPage = (item) => {
    isoutpageLink(item.path)
    router.replace(item.path)
}
</script>

<style scoped lang="scss">
.sider-container {
    position: relative;
    // 防止Tooltip被裁剪
    overflow: visible;

    .toggle-btn {
        transition: all 0.3s ease;

        &:hover {
            transform: scale(1.05);
        }
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
    .sider-container {
        .menu-item {
            height: 45px;
            font-size: 14px;
        }
        
        .submenu-item {
            height: 38px;
            font-size: 13px;
        }
    }
}
</style>