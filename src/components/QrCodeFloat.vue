<template>
  <div
    class="qr-code-float"
    :class="{ 'is-collapsed': isCollapsed, 'is-dragging': isDragging }"
    :style="floatStyle"
    @mousedown="handleDragStart"
    @touchstart="handleDragStart"
  >
    <!-- 收缩状态 -->
    <div v-if="isCollapsed" class="qr-collapsed" @click="toggleCollapse">
      <div class="qr-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </div>
      <span v-if="showTitle" class="qr-title-collapsed">{{ title }}</span>
    </div>

    <!-- 展开状态 -->
    <div v-else class="qr-expanded">
      <div class="qr-header">
        <span class="qr-title">{{ title }}</span>
        <button class="qr-close-btn" @click="toggleCollapse" aria-label="收起">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="qr-content">
        <img
          v-if="qrCodeUrl"
          :src="qrCodeUrl"
          :alt="title"
          class="qr-image"
          @error="handleImageError"
        />
        <div v-else class="qr-placeholder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>暂无二维码</span>
        </div>
        <p v-if="description" class="qr-description">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // 二维码图片URL
  qrCodeUrl: {
    type: String,
    default: ''
  },
  // 标题
  title: {
    type: String,
    default: '扫码查看'
  },
  // 描述文字
  description: {
    type: String,
    default: ''
  },
  // 是否默认展开
  defaultExpanded: {
    type: Boolean,
    default: false
  },
  // 是否在收缩状态显示标题
  showTitle: {
    type: Boolean,
    default: true
  },
  // 位置配置
  position: {
    type: Object,
    default: () => ({
      top: 'auto',
      right: '20px',
      bottom: '20px',
      left: 'auto'
    })
  },
  // 展开状态下的宽度
  expandedWidth: {
    type: String,
    default: '280px'
  },
  // 展开状态下的最小高度
  expandedMinHeight: {
    type: String,
    default: '320px'
  },
  // 层级
  zIndex: {
    type: Number,
    default: 9999
  }
})

const emit = defineEmits(['toggle', 'error'])

const isCollapsed = ref(!props.defaultExpanded)

// 拖拽相关状态
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const currentPos = ref({ x: null, y: null })
const dragStartPos = ref({ x: 0, y: 0 })
const hasDragged = ref(false) // 是否发生了实际拖拽

// 计算浮动样式
const floatStyle = computed(() => {
  const style = {
    position: 'fixed',
    zIndex: props.zIndex,
    '--expanded-width': props.expandedWidth,
    '--expanded-min-height': props.expandedMinHeight
  }

  // 如果有拖拽后的位置，使用计算后的位置
  if (currentPos.value.x !== null && currentPos.value.y !== null) {
    style.left = `${currentPos.value.x}px`
    style.top = `${currentPos.value.y}px`
    style.right = 'auto'
    style.bottom = 'auto'
  } else {
    const { top, right, bottom, left } = props.position
    style.top = top || 'auto'
    style.right = right || 'auto'
    style.bottom = bottom || 'auto'
    style.left = left || 'auto'
  }

  return style
})

// 获取触摸/鼠标事件坐标
const getEventPos = (e) => {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  return { x: e.clientX, y: e.clientY }
}

// 拖拽开始
const handleDragStart = (e) => {
  // 忽略按钮、链接等可交互元素的拖拽
  const target = e.target
  if (target.closest('button') || target.closest('a') || target.closest('input')) {
    return
  }

  e.preventDefault()
  isDragging.value = true
  hasDragged.value = false // 重置拖拽标志

  const pos = getEventPos(e)
  const rect = e.currentTarget.getBoundingClientRect()

  dragStartPos.value = { x: pos.x, y: pos.y }
  dragOffset.value = {
    x: pos.x - rect.left,
    y: pos.y - rect.top
  }

  // 初始化当前位置
  if (currentPos.value.x === null) {
    currentPos.value = {
      x: rect.left,
      y: rect.top
    }
  }
}

// 拖拽中
const handleDragMove = (e) => {
  if (!isDragging.value) return

  e.preventDefault()
  const pos = getEventPos(e)

  // 检测是否发生了实际拖拽（移动距离超过5px）
  const moveDistance = Math.sqrt(
    Math.pow(pos.x - dragStartPos.value.x, 2) +
    Math.pow(pos.y - dragStartPos.value.y, 2)
  )
  if (moveDistance > 5) {
    hasDragged.value = true
  }

  // 计算新位置，限制在视口范围内
  const newX = Math.max(0, Math.min(pos.x - dragOffset.value.x, window.innerWidth - 100))
  const newY = Math.max(0, Math.min(pos.y - dragOffset.value.y, window.innerHeight - 50))

  currentPos.value = { x: newX, y: newY }
}

// 拖拽结束
const handleDragEnd = () => {
  isDragging.value = false
  // 延迟重置拖拽标志，确保 click 事件能正确判断
  setTimeout(() => {
    hasDragged.value = false
  }, 100)
}

// 切换展开/收缩状态
const toggleCollapse = () => {
  // 如果发生了拖拽，不触发展开
  if (hasDragged.value) {
    return
  }
  isCollapsed.value = !isCollapsed.value
  emit('toggle', isCollapsed.value)
}

// 图片加载错误处理
const handleImageError = (e) => {
  console.error('二维码图片加载失败:', props.qrCodeUrl)
  emit('error', e)
}

// 添加全局事件监听
onMounted(() => {
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('touchmove', handleDragMove, { passive: false })
  document.addEventListener('touchend', handleDragEnd)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)
})
</script>

<style scoped>
.qr-code-float {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  cursor: grab;
  user-select: none;
}

.qr-code-float:active {
  cursor: grabbing;
}

.qr-code-float.is-dragging {
  cursor: grabbing;
  transition: none;
}

/* 收缩状态样式 */
.qr-collapsed {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #4362EF 0%, #3451d1 100%);
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(67, 98, 239, 0.4);
  transition: all 0.3s ease;
  user-select: none;
}

.qr-collapsed:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(67, 98, 239, 0.5);
}

.qr-collapsed:active {
  transform: translateY(0);
}

.qr-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.qr-title-collapsed {
  color: white;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

/* 展开状态样式 */
.qr-expanded {
  width: var(--expanded-width);
  min-height: var(--expanded-min-height);
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  animation: expandIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes expandIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.qr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #4362EF 0%, #3451d1 100%);
  border-bottom: 1px solid #f0f0f0;
}

.qr-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.qr-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qr-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.qr-close-btn:active {
  background: rgba(255, 255, 255, 0.4);
}

.qr-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.qr-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  background: #fafafa;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 8px;
  border: 2px dashed #d9d9d9;
  background: #fafafa;
  color: #8c8c8c;
}

.qr-placeholder span {
  font-size: 14px;
}

.qr-description {
  margin: 0;
  padding: 12px;
  width: 100%;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #595959;
  text-align: center;
}
</style>
