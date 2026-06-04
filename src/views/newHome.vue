<template>
  <div class="dashboard-container">
    <!-- 主内容区 -->
    <div class="main-content relative flex flex-col h-full">
      <!-- 头部标题 -->
      <header class="dashboard-header w-full h-[75px] relative">
        <img src="@/assets/home/new/light_title.png" alt="Background Title" class="main-title" />
      </header>

      <!-- 中心内容 -->
      <div class="center-content  relative flex-1 pb-[40px] ">
        <!-- 功能卡片区域 -->
        <div class="feature-cards flex flex-wrap justify-center gap-[27px]" >
          <div v-for="card in featureCards" :key="card.id" class="flex justify-center items-center">
            <div 
              :style="{ backgroundImage: `url(${card.bg})` }"
              class="feature-card relative flex flex-col items-center justify-center cursor-pointer"
              :class="{ 'feature-card-active': activeCard === card.id }"
              @click="handleCardClick(card)"
              @mouseenter="handleMouseEnter(card)"
              @mouseleave="handleMouseLeave"
            >
              <div class="text-[22px] text-[#fff] mt-[42px]"
              style="text-shadow: 0px 3px 3px rgba(7,154,108,0.7);"
              >{{ card.title }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 公司介绍 -->
      <div class="font-[400] text-[15px] text-[#393987] absolute bottom-[23px] leading-none cursor-pointer
      left-[50%] -translate-x-[50%]  px-[24px] py-[10px] rounded-[8px]" v-if="isShowCompany" @click="toCompany">
          ©2025-示例地区银利华应用科技有限责任公司版权所有
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import aibg from '@/assets/home/new/menu_light_ai.png'
import securitybg from '@/assets/home/new/menu_light_safe.png'
import emergencybg from '@/assets/home/new/menu_light_command.png'
import riskbg from '@/assets/home/new/menu_light_risk.png'
import onemapbg from '@/assets/home/new/menu_light_map.png'
import messagebg from '@/assets/home/new/menu_light_message.png'
import systembg from '@/assets/home/new/menu_light_sys.png'

import { useMenuStore } from '@/store/index';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
// 是否展示公司信息
const isShowCompany = import.meta.env.VITE_SHOW_COMPANY_INFO === 'true'
const featureCards = [
  { id: 1, title: '人工智能服务', bg: aibg,path:'aiMenu', },
  { id: 2, title: '安全生产管理业务', bg: securitybg,path:'safetyProMenu', },
  { id: 3, title: '应急指挥服务', bg: emergencybg,path:'emergencyMenu', },
  { id: 4, title: '综合风险管控中心', bg: riskbg,path:'comprehensiveRiskMenu', },
  { id: 5, title: '一张图', bg: onemapbg,path:'oneMapMenu', },
  { id: 6, title: '消息服务', bg: messagebg,path:'messageServiceMenu', },
  { id: 7, title: '系统管理', bg: systembg,path:'systemConfigMenu', },
]

const activeCard = ref(null);
const menuStore = useMenuStore()
const router = useRouter()
const handleSystemConfig = () => {
    menuStore.setCurrentKey('systemConfigMenu')
    const path = menuStore.toSystem('systemConfigMenu')
    if (path) router.replace(path);
}
const handleCardClick = (card) => {
  activeCard.value = card.id;
  menuStore.setCurrentKey(card.path)
   switch (card.path) {
    case 'safetyProMenu':
    // const path = menuStore.toSystem('safetyProMenu')
    // if (path) router.replace(path);
    // window.open(import.meta.env.VITE_TQLY_PLATFORM, '_blank')
    // break;
    case 'aiMenu':
      // router.replace('/aiInteligent');
      // break;
    case 'emergencyMenu':
      // router.replace('/other-module?type=emergency-map&system=true');
      // break;
    case 'comprehensiveRiskMenu':
      // router.replace('/dataCockpit');
      // break;
    case 'oneMapMenu':
    case 'messageServiceMenu':
    case 'systemConfigMenu':
    
      const path = menuStore.toSystem(card.path)
      console.log(path)
      if (path) router.replace(path);
       break;
    default:
      break;
  }
}


const handleMouseEnter = (card) => {
  activeCard.value = card.id;
}

const handleMouseLeave = () => {
  activeCard.value = null;
}

const toCompany = () => {
    window.open('https://www.yinlihua.cn/PCH5/index.html', '_blank')
}
</script>

<style scoped>
.dashboard-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-image: url('@/assets/home/new/light_bg.jpg');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

/* 背景层 */
.background-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}


@keyframes gridMove {
  0% { transform: perspective(800px) rotateX(60deg) translateY(0); }
  100% { transform: perspective(800px) rotateX(60deg) translateY(60px); }
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f0ff, transparent);
  top: 0;
  animation: scan 4s linear infinite;
  box-shadow: 0 0 20px #00f0ff;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
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

/* 头部 */
.dashboard-header {
  padding: 2vh 4vw;
  position: relative;
  background-image: url('@/assets/home/new/light_top_bg.png');
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
}

.main-title {
  width: 22vw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -75%) ;
}

.system-config{
  width: 118px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('@/assets/home/new/system_btn_bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}


/* 中心内容 */
.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2vh 4vw;
  position: relative;
}

/* 功能卡片 */
.feature-cards {
  width: 100%;
  margin: 0 auto;
}

.feature-card {
  position: relative;
  aspect-ratio: 1;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 290px;
  height: 320px;
  background-size: 100% 100%;
  background-position: center;
}


.feature-card:hover {
  transform: translateY(-12px) scale(1.05);
}


@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.icon-platform {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 162, 255, 0.2), rgba(0, 240, 255, 0.1));
  border: 2px solid rgba(0, 162, 255, 0.4);
  border-radius: 12px;
  transform-style: preserve-3d;
  box-shadow: 
    0 10px 30px rgba(0, 162, 255, 0.3),
    inset 0 0 20px rgba(0, 162, 255, 0.1);
}

.feature-card:hover .icon-platform {
  animation: float 3s ease-in-out infinite;
  border-color: rgba(0, 162, 255, 0.8);
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotateX(0deg); }
  50% { transform: translateY(-10px) rotateX(5deg); }
}

.custom-icon {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: bold;
  color: #00f0ff;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.8);
}

.card-title {
  font-size: clamp(16px, 2vw, 24px);
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.2em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  margin: 0;
}



/* 响应式适配 */
@media (max-width: 1200px) {
  .feature-cards {
    max-width: 900px;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 24px;
  }
  
  .side-decoration {
    width: 100px;
  }
}

/* 大屏优化 */
@media (min-width: 1920px) {
  .dashboard-header {
    padding: 3vh 6vw;
  }
  
  .center-content {
    padding: 6vh 8vw;
  }
  
  .feature-cards {
    max-width: 1400px;
  }
}
</style>
