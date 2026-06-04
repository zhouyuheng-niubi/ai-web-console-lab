<template>
  <div class="dashboard-container">
    <!-- 主内容区 -->
    <div class="main-content relative flex flex-col h-full pt-[96px]">
      <!-- 头部标题 -->
      <header class="relative flex flex-col items-center w-full dashboard-header">
        <img src="@/assets/home/swiper/logo.png" alt="LOGO" class="company-logo block w-[87px] h-[87px]" />
        <img src="@/assets/home/swiper/title.png" alt="Title" class="company-title mt-[36px] block h-[52px]" />
      </header>

      <!-- 中心内容 -->
      <div class="relative flex flex-col items-center flex-1 w-full center-content">
        <!-- 3D轮播容器 -->
        <div class="swiper-wrapper-container w-[85%] h-[450px] mt-[100px]">
          <!-- 轮播指示器 -->
          <div class="indicators">
            <div v-for="(card, index) in originalCards" :key="card.id" class="indicator-dot"
              :class="{ 'indicator-dot-active': index === currentIndex }" @click="goToCard(index)"></div>
          </div>
          <!-- @mouseenter="pauseOnHover"
            @mouseleave="resumeOnLeave" -->
          <div class="carousel-3d" ref="carouselRef" @mousedown="startDrag" @touchstart="startDrag" @wheel="handleWheel"
            @touchstart.passive="pauseOnHover" @touchend="resumeOnLeave">
            <!-- 3D透视场景 -->
            <div class="scene" :style="{
              'transform-style': 'preserve-3d',
              transition: isAnimating ? `transform ${animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)` : 'none'
            }" ref="sceneRef">
              <!-- 只渲染可见的卡片 -->
              <div v-for="card in visibleCards" :key="card.id" class="card-slide" :class="{
                'card-item-active': card.position === 0,
              }" :style="getCardStyle(card)" @click="handleCardClick(card)" @mousedown.prevent @touchstart.prevent>
                <div class="relative card-item" :style="{ backgroundImage: `url(${card.bg})` }">
                  <div style="user-select: auto;" class="absolute top-[70%] 
                    left-[50%] whitespace-nowrap text-title-border 
                    -translate-x-[50%] font-[500] text-[30px] text-[#FFFFFF] px-[11px]">
                    {{ card.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 导航按钮 -->
          <button class="swiper-navigation swiper-nav-prev" @click="prev" :disabled="isAnimating">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
          <button class="swiper-navigation swiper-nav-next" @click="next" :disabled="isAnimating">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 公司介绍 -->
      <div
        class="font-[400] text-[15px] text-[#0034A2] absolute bottom-[6px] leading-none cursor-pointer left-[50%] -translate-x-[50%] px-[24px] py-[10px] rounded-[8px]"
        @click="toCompany" v-if="isShowCompany">
        ©2025-示例地区银利华应用科技有限责任公司版权所有
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useMenuStore } from '@/store/index';
import { useRouter } from 'vue-router';

// 导入卡片背景图片
import aibg from '@/assets/home/swiper/ai_card.png';
import securitybg from '@/assets/home/swiper/security_card.png';
import emergencybg from '@/assets/home/swiper/commond_card.png';
import riskbg from '@/assets/home/swiper/risk_card.png';
import onemapbg from '@/assets/home/swiper/onemap_card.png';
import messagebg from '@/assets/home/swiper/message_card.png';
import systembg from '@/assets/home/swiper/system_card.png';

/**
 * 原始卡片数据 - 根据图片调整
 * 顺序：系统管理、一张图、应急指挥服务、人工智能服务、生产管理业务、风险管控中心、消息服务
 */
const originalCards = [
  { id: 4, title: '人工智能服务', bg: aibg, path: 'aiMenu' },
  { id: 5, title: '生产管理业务', bg: securitybg, path: 'safetyProMenu' },
  { id: 3, title: '应急指挥服务', bg: emergencybg, path: 'emergencyMenu' },
  { id: 6, title: '风险管控中心', bg: riskbg, path: 'comprehensiveRiskMenu' },
  { id: 2, title: '一张图', bg: onemapbg, path: 'oneMapMenu' },
  { id: 7, title: '消息服务', bg: messagebg, path: 'messageServiceMenu' },
  { id: 1, title: '系统管理', bg: systembg, path: 'systemConfigMenu' },
];
// 是否展示公司信息
const isShowCompany = import.meta.env.VITE_SHOW_COMPANY_INFO === 'true'

// 响应式数据
const currentIndex = ref(0)
const isAnimating = ref(false)
const autoPlayEnabled = ref(true)
const autoPlayTimer = ref(null)
const isHovering = ref(false)
const wasAutoPlayActiveBeforeHover = ref(false)
const animationFrameId = ref(null)

// 拖拽相关
const isDragging = ref(false)
const startX = ref(0)
const dragThreshold = 50
const dragDetected = ref(false)

// 固定配置
const intervalTime = ref(2000)
const autoPlayDirection = ref('right')
const animationDuration = ref(300) // 调整为更平滑的过渡时间

// 计算当前可见的卡片（1+3+3布局）
const visibleCards = computed(() => {
  const result = []
  const totalCards = originalCards.length

  // 添加聚焦卡片
  result.push({
    ...originalCards[currentIndex.value],
    position: 0,
    index: currentIndex.value
  })

  // 添加左侧3张卡片
  for (let i = 1; i <= 3; i++) {
    let leftIndex = currentIndex.value - i
    // 边界处理：如果卡片数量不足，循环补位
    while (leftIndex < 0) {
      leftIndex += totalCards
    }

    result.unshift({
      ...originalCards[leftIndex],
      position: -i,
      index: leftIndex
    })
  }

  // 添加右侧3张卡片
  for (let i = 1; i <= 3; i++) {
    let rightIndex = currentIndex.value + i
    // 边界处理：如果卡片数量不足，循环补位
    while (rightIndex >= totalCards) {
      rightIndex -= totalCards
    }

    result.push({
      ...originalCards[rightIndex],
      position: i,
      index: rightIndex
    })
  }

  return result
})



// 获取卡片样式
const getCardStyle = (card) => {
  const baseZ = 100
  const spacing = 200
  const rotationY = 5

  // 聚焦卡片样式
  if (card.position === 0) {
    return {
      transform: `translateZ(${baseZ + 40}px) scale(0.96)`,
      zIndex: 100,
      opacity: 1,
    }
  }

  // 左侧卡片样式
  if (card.position < 0) {
    const pos = Math.abs(card.position)
    const translateX = -spacing * pos * 0.85 // 调整为与之前Swiper相同的比例
    const translateZ = baseZ - pos * 20
    const rotation = -rotationY * pos * 0.3
    const scale = 1 - pos * 0.05 // 调整缩放比例，减小边缘卡片缩小程度

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotation}deg) scale(${scale})`,
      zIndex: 100 - (pos * 8),
      opacity: pos > 2.5 ? Math.max(0.4, 1 - (pos - 2.5) * 0.4) : 1,
    }
  }

  // 右侧卡片样式
  if (card.position > 0) {
    const pos = card.position
    const translateX = spacing * pos * 0.85 // 调整为与之前Swiper相同的比例
    const translateZ = baseZ - pos * 20
    const rotation = rotationY * pos * 0.3
    const scale = 1 - pos * 0.05 // 调整缩放比例，减小边缘卡片缩小程度

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotation}deg) scale(${scale})`,
      zIndex: 100 - (pos * 8),
      opacity: pos > 2.5 ? Math.max(0.4, 1 - (pos - 2.5) * 0.4) : 1,
    }
  }
}

// 切换卡片
const goToCard = (index) => {
  if (isAnimating.value || index === currentIndex.value) return

  const totalCards = originalCards.length
  const targetIndex = (index + totalCards) % totalCards

  // 触发动画
  isAnimating.value = true

  // 使用requestAnimationFrame确保动画开始前DOM已更新
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }

  animationFrameId.value = requestAnimationFrame(() => {
    // 更新当前索引
    currentIndex.value = targetIndex

    // 动画结束后重置状态
    setTimeout(() => {
      isAnimating.value = false
      animationFrameId.value = null

      // 如果悬停中不恢复自动播放
      if (!isHovering.value && autoPlayEnabled.value) {
        startAutoPlay()
      }
    }, animationDuration.value)
  })
}

// 下一张卡片
const next = () => {
  const totalCards = originalCards.length
  const nextIndex = (currentIndex.value + 1) % totalCards
  goToCard(nextIndex)
}

// 上一张卡片
const prev = () => {
  const totalCards = originalCards.length
  const prevIndex = (currentIndex.value - 1 + totalCards) % totalCards
  goToCard(prevIndex)
}

// 处理卡片点击
const menuStore = useMenuStore();
const router = useRouter();
const handleCardClick = (card) => {
  // 如果检测到拖拽操作，则不执行点击逻辑
  if (dragDetected.value) {
    return;
  }

  // if (card.position === 0) { // 仅当卡片居中时触发点击
  console.log('Card clicked:', card.title, card.path); // 调试日志

  // 设置当前菜单并导航
  menuStore.setCurrentKey(card.path)
  switch (card.path) {
    case 'safetyProMenu':
    case 'aiMenu':
    case 'emergencyMenu':
    case 'comprehensiveRiskMenu':
    case 'oneMapMenu':
    case 'messageServiceMenu':
    case 'systemConfigMenu':

      const path = menuStore.toSystem(card.path)
      if (path) {
        router.replace(path);
      } else {
        console.warn('No path found for card.path:', card.path);
      }
      break;
    default:
      console.warn('Unknown card.path:', card.path);
      break;
  }
  // } 
  // else {
  //   // 如果点击非居中卡片，将其切换到居中位置
  //   goToCard(card.index)
  // }
}

// 悬停时暂停自动播放
const pauseOnHover = () => {
  if (autoPlayEnabled.value && !isHovering.value) {
    wasAutoPlayActiveBeforeHover.value = autoPlayTimer.value !== null
    stopAutoPlay()
    isHovering.value = true
  }
}

// 离开时恢复自动播放
const resumeOnLeave = () => {
  if (isHovering.value && autoPlayEnabled.value && wasAutoPlayActiveBeforeHover.value) {
    isHovering.value = false
    startAutoPlay()
  } else {
    isHovering.value = false
  }
}

// 开始拖拽
const startDrag = (e) => {
  isDragging.value = true
  startX.value = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX

  // 重置拖拽检测标志
  dragDetected.value = false

  stopAutoPlay()

  if (e.type === 'mousedown') {
    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('mouseup', endDrag)
  } else {
    window.addEventListener('touchmove', handleDragMove)
    window.addEventListener('touchend', endDrag)
  }
}

// 处理拖拽移动
const handleDragMove = (e) => {
  if (!isDragging.value || isAnimating.value) return

  const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  const deltaX = currentX - startX.value

  // 如果拖拽距离超过阈值，标记为拖拽操作
  if (Math.abs(deltaX) > dragThreshold && !dragDetected.value) {
    dragDetected.value = true
  }

  // 如果拖拽距离超过阈值，触发切换
  if (Math.abs(deltaX) > dragThreshold) {
    if (deltaX > 0) {
      prev()
    } else {
      next()
    }
    endDrag()
  }
}

// 结束拖拽
const endDrag = () => {
  isDragging.value = false

  window.removeEventListener('mousemove', handleDragMove)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', handleDragMove)
  window.removeEventListener('touchend', endDrag)

  // 在拖拽结束后短暂延迟重置拖拽检测标志，防止点击事件触发
  setTimeout(() => {
    dragDetected.value = false
  }, 150)

  if (autoPlayEnabled.value && !isHovering.value) {
    startAutoPlay()
  }
}

// 处理滚轮事件
const handleWheel = (e) => {
  e.preventDefault()

  if (isAnimating.value) return

  if (e.deltaY > 0) {
    next()
  } else {
    prev()
  }
}

// 开始自动轮播
const startAutoPlay = () => {
  stopAutoPlay()

  if (autoPlayEnabled.value && !isHovering.value) {
    autoPlayTimer.value = setInterval(() => {
      if (autoPlayDirection.value === 'right') {
        next()
      } else {
        prev()
      }
    }, intervalTime.value)
  }
}

// 停止自动轮播
const stopAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
}

/**
 * 跳转到公司网站
 */
const toCompany = () => {
  window.open('https://www.yinlihua.cn/PCH5/index.html', '_blank');
};

// 窗口大小变化时重新计算
const handleResize = () => {
  // 在窗口大小改变时，强制重新计算和渲染
  const tempIndex = currentIndex.value;
  currentIndex.value = (tempIndex + 1) % originalCards.length;
  nextTick(() => {
    currentIndex.value = tempIndex;
  });
};

/**
 * 组件挂载时开始自动轮播
 */
onMounted(() => {
  // 添加防抖函数，避免频繁触发resize事件
  let resizeTimeout;
  const debouncedResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      handleResize();
    }, 150);
  };

  window.addEventListener('resize', debouncedResize);

  // 组件卸载时移除事件监听器
  const cleanup = () => {
    window.removeEventListener('resize', debouncedResize);
  };

  // 在组件挂载后立即执行一次，确保初始渲染
  nextTick(() => {
    // 强制触发一次重绘以确保初始状态正确
    const tempIndex = currentIndex.value;
    currentIndex.value = (tempIndex + 1) % originalCards.length;
    nextTick(() => {
      currentIndex.value = tempIndex;
    });

    if (autoPlayEnabled.value) {
      startAutoPlay()
    }
  });

  // 在组件卸载时清理
  onUnmounted(() => {
    cleanup();
    stopAutoPlay()
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value)
    }
  });
})

/**
 * 组件卸载时停止自动轮播
 */
onUnmounted(() => {
  stopAutoPlay()
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>

<style scoped lang="scss">
.dashboard-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #DDEDFF;
  background-image: url('@/assets/home/swiper/home_bg.png');
  background-size: 100% auto;
  background-position: top left;
  background-repeat: no-repeat;
}

/* 主内容区 */
.main-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.dashboard-header {
  z-index: 2;
}

.company-logo {
  z-index: 2;
}

.company-title {
  z-index: 2;
}

.swiper-wrapper-container {
  width: 100%;
  height: 450px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-swiper {
  width: 100%;
  height: 100%;
  padding: 40px 0;
  overflow: visible;
  pointer-events: none; // 容器不阻止点击
}

.card-slide {
  width: fit-content !important;
  height: 450px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  padding: 0;
  backface-visibility: hidden;
  transform-style: preserve-3d; // 确保3D变换生效
  pointer-events: auto !important; // 确保所有slide都可以点击
  cursor: pointer !important;
  will-change: transform;
  transform: translateZ(0);
  /* 启用硬件加速 */
  -webkit-backface-visibility: hidden;
  -webkit-transform: translateZ(0);
  -webkit-transform-style: preserve-3d;
}

.card-item {
  box-sizing: border-box;
  background-size: 100% 100%;
  width: 310px;
  height: 430px;
  position: relative;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  pointer-events: auto !important; // 强制设置为可点击
  z-index: 10; // 确保有足够的层级

  // 文本标题样式
  .text-title-border {
    background-image: url('@/assets/home/swiper/text-border_short.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    min-width: 230px;
    text-align: center;
  }

  // 激活状态
  &.card-item-active {
    z-index: 100;
    opacity: 1;

    // 激活状态下的标题使用长边框
    .text-title-border {
      background-image: url('@/assets/home/swiper/text-border_long.png');
    }
  }

}





/* 导航按钮样式 */
.swiper-navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: 2px solid #008aa2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  color: #008aa2;

  &:hover {
    border-color: #008aa2;
    transform: translateY(-50%) scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.5;
  }
}

.swiper-nav-prev {
  left: 100px;
}

.swiper-nav-next {
  right: 100px;
}

// 指示器样式
.indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  z-index: 10;
  position: absolute;
  bottom: 0px;
  width: 100%;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid #0034A2;
  cursor: pointer;
  transition: all 0.3s ease;

  &.indicator-dot-active {
    background: #0034A2;
    border-color: #0034A2;
    transform: scale(1.2);
  }

  &:hover {
    background: rgba(0, 52, 162, 0.2);
    transform: scale(1.1);
  }
}

// 3D轮播容器
.carousel-3d {
  width: 100%;
  height: 100%;
  perspective: 1200px;
  position: relative;
  // overflow: hidden;
  cursor: pointer;
}

.scene {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-slide {
  position: absolute;
  width: 310px;
  height: 430px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    z-index 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  will-change: transform, z-index, filter, opacity;
}


// 基础样式
.swiper-wrapper-container {
  height: 450px;
}



// 响应式设计
@media (max-width: 1500px) {
  .swiper-wrapper-container {
    height: 400px;
  }

  .card-slide {
    height: 380px;
  }

  .card-item {
    width: 280px;
    height: 380px;
  }

  .card-item .text-title-border {
    font-size: 26px;
  }
}

@media (max-width: 1400px) {
  .swiper-wrapper-container {
    height: 400px;
  }

  .swiper-navigation {
    width: 45px;
    height: 45px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .card-slide {
    height: 400px;
  }

  .card-item {
    width: 300px;
    height: 400px;
  }

  .card-item .text-title-border {
    font-size: 26px;
  }

  // 指示器响应式调整
  .indicator-dot {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 1200px) {
  .swiper-wrapper-container {
    height: 360px;
  }

  .swiper-navigation {
    width: 40px;
    height: 40px;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .card-slide {
    height: 360px;
  }

  .card-item {
    width: 270px;
    height: 360px;
  }

  .card-item .text-title-border {
    font-size: 24px;
  }

  // 指示器响应式调整
  .indicator-dot {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 60px;
  }

  .swiper-navigation {
    width: 35px;
    height: 35px;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  .swiper-nav-prev {
    left: 10px;
  }

  .swiper-nav-next {
    right: 10px;
  }

  .swiper-wrapper-container {
    height: 320px;
  }

  .card-slide {
    height: 320px;
  }

  .card-item {
    width: 220px;
    height: 320px;
  }

  .card-item .text-title-border {
    font-size: 20px;
    top: 65%;
  }

  // 指示器响应式调整
  .indicators {
    gap: 8px;
  }

  .indicator-dot {
    width: 10px;
    height: 10px;
  }
}
</style>