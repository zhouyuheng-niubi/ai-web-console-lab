<template>
  <div class="phone-simulator">
    <!-- 顶部状态栏 -->
    <div class="phone-status-bar">
      <!-- <div class="status-time">9:41</div>
      <div class="status-icons">
        <span>📶</span><span>🔋</span>
      </div> -->
    </div>
    
    <!-- iframe显示手机页面 -->
    <iframe 
      :src="mobileUrl"
      class="phone-screen"
      ref="mobileFrame"
      allow="fullscreen"
    ></iframe>
    
    <!-- 手机外壳 -->
    <div class="phone-frame"></div>
    
    <!-- 底部操作栏 -->
    <div class="simulator-controls">
      <!-- <input v-model="mobileUrl" placeholder="输入手机页面URL" />
      <button @click="refresh">刷新</button> -->
      <!-- <button @click="toggleRotate">旋转</button>
      <select v-model="deviceType">
        <option value="iphone">iPhone 12</option>
        <option value="samsung">三星 Galaxy</option>
        <option value="generic">通用手机</option>
      </select> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileUrl = ref('/#/all-in-one') // 你的手机页面路由
const deviceType = ref('iphone')
const mobileFrame = ref(null)

const refresh = () => {
  if (mobileFrame.value) {
    mobileFrame.value.src = mobileUrl.value
  }
}


</script>

<style scoped lang="scss">
.phone-simulator {
  position: relative;
  width: 375px; /* iPhone 12宽度 */
  height: 778px;
  margin: 20px auto;
  background: #f0f0f0;
  border-radius: 0px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
//   padding: 20px;
  transition: all 0.3s;
}

.phone-status-bar {
  position: absolute;
  top: 10px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  z-index: 10;
  color: #000;
}

.phone-screen {
  width: 100%;
  height: 100%;
  border: none;
//   border-radius: 0px;
  overflow: hidden;
  background: white;
}

.phone-frame {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
//   border-radius: 40px;
  border: 3px solid #e3e3e3;
//   box-sizing: border-box;
  pointer-events: none;
  z-index: 20;
}

.simulator-controls {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}


</style>