<template>
  <div class="ai-intelligent-container">
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'action-recognition' }"
        @click="switchTab('action-recognition')"
      >
        智能识别
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'process-flow' }"
        @click="switchTab('process-flow')"
      >
        工序流程
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'run-record' }"
        @click="switchTab('run-record')"
      >
        布控管理
      </div>

      <!-- <Tabs v-model:activeKey="activeKey" type="card" @tabClick="switchTab">
        <TabPane key="action-recognition" tab="智能识别">
        </TabPane>
        <TabPane key="process-flow" tab="工序流程">
        </TabPane>
        </Tabs> -->
    </div>
    <div class="tab-content">
      <div v-if="activeTab === 'action-recognition'" class="tab-pane">
        <actionRecognit />
      </div>
      <div v-else-if="activeTab === 'process-flow'" class="tab-pane">
        <iframe 
          src="http://10.0.0.1:18080/video-view" 
          width="100%" 
          height="100%" 
          frameborder="0"
          allowfullscreen
          allow="fullscreen;webkitfullscreen; mozfullscreen; msfullscreen"
          style="min-height: 600px;"
        ></iframe>
      </div>
      <div v-else-if="activeTab === 'run-record'" class="tab-pane">
        <runRecord />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {Tabs, TabPane} from 'ant-design-vue'
import actionRecognit from '../actionRecognit.vue'
import runRecord from './runRecord.vue'

const activeTab = ref('action-recognition')

const switchTab = (tab) => {
  activeTab.value = tab
}
</script>

<style scoped>
.ai-intelligent-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 10px;
}

.tab {
  padding: 8px 20px;
  cursor: pointer;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  margin-right: 5px;
  transition: background-color 0.3s;
  font-size: 14px;
}

.tab:hover {
  background-color: #e0e0e0;
}

.tab.active {
  background-color: #ffffff;
  border-bottom: 1px solid #ffffff;
  margin-bottom: -1px;
  font-weight: bold;
  font-size: 16px;
  color: #4362EF;
}

.tab-content {
  width: 100%;
  height: calc(100% - 50px);
}

.tab-pane {
  width: 100%;
  height: 100%;
}
</style>