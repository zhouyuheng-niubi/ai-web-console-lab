<template>
  <view class="document-viewer relative flex flex-col p-[16px] 
     box-border w-[100%] h-[100%] bg-[#F8FAFC] flex flex-col">
     <Tabs v-model:activeKey="activeKey">
      <TabPane key="1" tab="报警情况分析"></TabPane>
      <TabPane key="2" tab="历史记录"></TabPane>
    </Tabs>
    <div class="flex-1 flex box-border min-h-0">
      <component :is="activeKey === '1' ? analyze : history"></component>
    </div>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { TabPane,Tabs } from 'ant-design-vue';
import analyze from './analyze.vue'
import history from './history.vue'

const activeKey = ref('1')
</script>
