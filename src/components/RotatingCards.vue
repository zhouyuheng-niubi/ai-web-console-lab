<template>
  <!-- 3D舞台：适配父级容器 -->
  <div class="rotating-cards-container w-full h-full relative" style="perspective: 1800px;">
    <!-- 旋转容器：3D空间 + 自动旋转（核心） -->
    <div 
      ref="rotateContainer" 
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full preserve-3d"
      :style="{ transform: `translate(-50%, -50%) rotateY(${currentRotateY}deg)` }"
    >
      <!-- 卡片：根据容器大小动态计算位置 -->
      <div 
        v-for="(card, index) in cards"
        :key="index"
        class="card" 
        :style="getCardStyle(index * 60)"
        @mouseenter="() => handleCardMouseEnter(index)"
        @mouseleave="() => handleCardMouseLeave(index)"
        @mousedown="handleMouseDown"
      >
        
        <h3 class="text-white text-[14px] mb-[10px] font-medium">{{ card.title }}</h3>
        <p class="text-white text-[12px] mb-[5px]">年度发现隐患数：{{ card.annualConsumption }}</p>
        <p class="text-white text-[12px] mb-[5px]">年度整改完成率：{{ card.annualSupply }}</p>
        <p class="text-white text-[12px]">年度安全运行稳定度：{{ card.completionRate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// 定义props
const props = defineProps({
  cards: {
    type: Array,
    default: () => [
      {
        title: '能源类型1',
        annualConsumption: 436,
        annualSupply: 450,
        completionRate: '96.89%'
      },
      {
        title: '能源类型2',
        annualConsumption: 89,
        annualSupply: 100,
        completionRate: '89.00%'
      },
      {
        title: '能源类型3',
        annualConsumption: 120,
        annualSupply: 150,
        completionRate: '80.00%'
      },
      {
        title: '能源类型4',
        annualConsumption: 350,
        annualSupply: 380,
        completionRate: '92.11%'
      },
      {
        title: '能源类型5',
        annualConsumption: 210,
        annualSupply: 230,
        completionRate: '91.30%'
      },
      {
        title: '能源类型6',
        annualConsumption: 180,
        annualSupply: 200,
        completionRate: '90.00%'
      }
    ]
  }
})

// 响应式变量
const rotateContainer = ref(null)
const hoveredCardIndex = ref(-1) // -1表示没有悬停在任何卡片上
const isDragging = ref(false)
let startX = 0
const currentRotateY = ref(0) // 当前旋转角度
let animationFrameId = null // 动画帧ID

// 鼠标悬停控制变量
let hoverTimeout = null
const HOVER_DELAY = 100 // 悬停延迟时间(ms)

// 计算卡片样式的方法
const getCardStyle = (angle) => {
  // 获取容器尺寸
  const container = rotateContainer.value?.parentElement
  if (!container) {
    // 默认样式
    return {
      transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(400px)`
    }
  }
  
  // 根据容器大小动态计算translateZ距离
  const containerWidth = container.offsetWidth
  const containerHeight = container.offsetHeight
  const minDimension = Math.min(containerWidth, containerHeight)
  const translateZ = minDimension * 0.6 // 调整系数以适应不同尺寸，从0.3增大到0.5
  
  // 卡片尺寸也根据容器大小调整，保持3:2宽高比
  const cardWidth = Math.min(minDimension * 0.3, 360) // 进一步增加宽度，最大不超过360px
  const cardHeight = cardWidth * 2 / 3 // 根据宽度计算高度，保持3:2宽高比
  
  return {
    transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${translateZ}px)`,
    width: `${cardWidth}px`,
    height: `${cardHeight}px`
  }
}

// 动画帧回调函数
const animate = () => {
  // 只有在没有悬停且没有拖拽时才自动旋转
  if (hoveredCardIndex.value === -1 && !isDragging.value) {
    currentRotateY.value += 0.2 // 每帧旋转0.2度（从0.5调整为0.2，减慢旋转速度）
    if (currentRotateY.value >= 360) {
      currentRotateY.value -= 360
    }
  }
  animationFrameId = requestAnimationFrame(animate)
}

// 卡片鼠标进入：暂停动画
const handleCardMouseEnter = (index) => {
  console.log(`Mouse entered card ${index}`)
  // 清除之前的离开定时器
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  // 设置悬停卡片索引
  hoveredCardIndex.value = index
}

// 卡片鼠标离开：恢复动画
const handleCardMouseLeave = (index) => {
  console.log(`Mouse left card ${index}`)
  // 设置延迟离开，避免快速切换时的抖动
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
  hoverTimeout = setTimeout(() => {
    hoveredCardIndex.value = -1
    hoverTimeout = null
  }, HOVER_DELAY)
}

// 鼠标按下：开始拖动，暂停动画
const handleMouseDown = (e) => {
  console.log('Mouse down on card')
  // 清除悬停定时器
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  
  isDragging.value = true
  startX = e.clientX
  
  // 添加全局事件监听器
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  
  // 阻止事件冒泡
  e.stopPropagation()
  // 阻止默认行为
  e.preventDefault()
}

// 鼠标移动：控制旋转
const handleMouseMove = (e) => {
  if (!isDragging.value) return
  const moveX = e.clientX - startX
  currentRotateY.value += moveX * 0.5
  // 保持角度在0-360范围内
  if (currentRotateY.value >= 360) {
    currentRotateY.value -= 360
  } else if (currentRotateY.value < 0) {
    currentRotateY.value += 360
  }
  startX = e.clientX
}

// 鼠标松开：结束拖动
const handleMouseUp = (e) => {
  console.log('Mouse up')
  isDragging.value = false
  // 移除全局事件监听器
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  
  // 阻止事件冒泡
  e.stopPropagation()
}

// 生命Maintainer期：监听全局事件
onMounted(async () => {
  // 等待DOM更新完成后添加动画类
  await nextTick()
  // 开始动画循环
  animate()
  
  // 监听窗口大小变化，重新计算卡片位置
  window.addEventListener('resize', () => {
    // 触发重新渲染
  })
})

onUnmounted(() => {
  // 清除定时器
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
  // 取消动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<style scoped>
/* 3D空间必备：保持子元素3D效果 */
.preserve-3d {
  transform-style: preserve-3d !important;
}

.rotating-cards-container {
  min-height: 300px;
}

.card {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white p-[10px] flex flex-col items-center justify-center;
  cursor: grab;
  pointer-events: auto;
  z-index: 10;
  /* 添加以下属性解决3D环境下的事件问题 */
  will-change: transform;
  transition: width 0.3s ease, height 0.3s ease;
  background-image:url('@/assets/risk-banner/circle_card.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  
}

.card:active {
  cursor: grabbing;
}
</style>