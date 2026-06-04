<template>
  <div :class="['flex flex-col h-full w-full rounded-lg overflow-hidden', 
    isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800']">
    <!-- Header -->
    <div :class="['flex items-center justify-between px-6 py-4 border-b', 
      isDarkTheme ? 'border-gray-700' : 'border-gray-200']" v-if="showHeader">
      <h2 :class="['text-lg font-medium', isDarkTheme ? 'text-cyan-400' : 'text-blue-600']">告警详情</h2>
      <div class="flex items-center gap-2">
        <!-- Theme Toggle Button -->
        <!-- <button 
          @click="toggleTheme" 
          :class="['p-1 rounded-full transition-colors', 
            isDarkTheme ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200']"
          title="切换主题"
        >
          <svg v-if="isDarkTheme" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button> -->
        <button 
          @click="closeModal" 
          :class="['transition-colors', 
            isDarkTheme ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800']"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Info Section -->
    <div class="grid grid-cols-2 gap-x-12 px-6 py-4 text-sm">
      <!-- Left Column -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span :class="[isDarkTheme ? 'text-gray-400' : 'text-gray-600']">状态:</span>
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-gray-500"></span>
            <span>{{ alarmData.status || '未处理' }}</span>
          </span>
        </div>
        <div>
          <span :class="[isDarkTheme ? 'text-gray-400' : 'text-gray-600']">监控设备:</span>
          <span class="ml-2">{{ alarmData.stream_name || '未知数据源' }}</span>
        </div>
        <div>
          <span :class="[isDarkTheme ? 'text-gray-400' : 'text-gray-600']">IP:</span>
          <span class="ml-2">{{ alarmData.ip || 'N/A' }}</span>
        </div>
        <div>
          <span :class="[isDarkTheme ? 'text-gray-400' : 'text-gray-600']">告警类型:</span>
          <span class="ml-2">{{ alarmData.scene_name || '未知类型' }}</span>
        </div>
        <div>
          <span :class="[isDarkTheme ? 'text-gray-400' : 'text-gray-600']">算法来源:</span>
          <span class="ml-2">{{ alarmData.algorithm_source || '--' }}</span>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-2">
        <div>
          <span :class="[isDarkTheme ? 'text-gray-400' : 'text-gray-600']">所属区域:</span>
          <span class="ml-2">{{ alarmData.region_name || '--' }}</span>
        </div>
        <div>
          <span :class="[isDarkTheme ? 'text-gray-400' : 'text-gray-600']">危险等级:</span>
          <span class="ml-2">{{ alarmData.level || '未知' }}</span>
        </div>
        <div>
          <span :class="[isDarkTheme ? 'text-gray-400' : 'text-gray-600']">识别时间:</span>
          <span class="ml-2">{{ alarmData?.result?.processing_time? alarmData?.result?.processing_time+'s':'--' }}</span>
        </div>
        <div>
          <span :class="[isDarkTheme ? 'text-gray-400' : 'text-gray-600']">报警时间:</span>
          <span class="ml-2">{{ alarmData.detection_time || '未知时间' }}</span>
        </div>
        <div>
          <span :class="[isDarkTheme ? 'text-gray-400' : 'text-gray-600']">分组名称:</span>
          <span class="ml-2">{{ alarmData.groupName || '未分组' }}</span>
        </div>
      </div>
    </div>

    <!-- Image Display -->
    <div class="flex-1 px-6 pb-4 min-h-0 overflow-hidden">
      <div :class="['w-full h-full rounded-lg overflow-hidden flex items-center justify-center', 
        isDarkTheme ? 'bg-gray-900' : 'bg-gray-100']">
        <Image 
          :src="imageUrl" 
          alt="监控画面" 
          style="height: 400px;width: fit-content;"
        />
      </div>
    </div>

    <!-- Bottom Action Section -->
    <div class="px-6 pb-6">
      <!-- Input Area -->
      <div :class="['border rounded-lg p-3 mb-4', 
        isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200']">
        <div class="flex gap-2 mb-3">
          <!-- <button :class="['px-3 py-1.5 text-xs rounded transition-colors', 
            isDarkTheme ? 'bg-transparent border border-gray-600 text-gray-400 hover:border-gray-500' : 'bg-transparent border border-gray-300 text-gray-600 hover:border-gray-400']">
            处理人
          </button> -->
          <Input 
            v-model:value="handler"
            type="text" 
            placeholder="处理人" 
            :class="['w-[180px] px-3 py-1.5 text-xs rounded focus:outline-none', 
              isDarkTheme ? 
              'bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 focus:border-gray-500' :
              'bg-transparent border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-500']"
          />
          <Input 
            v-model:value="comment"
            type="text" 
            placeholder="处理意见" 
            :class="['flex-1 px-3 py-1.5 text-xs rounded focus:outline-none', 
              isDarkTheme ? 'bg-transparent border border-gray-600 text-gray-300 placeholder-gray-500 focus:border-gray-500' : 'bg-transparent border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-500']"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end">
        <button 
          @click="confirmAction"
          :class="['px-8 py-2.5 rounded transition-colors', 
            isDarkTheme ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white']"
        >
          确认
        </button>
        <button 
          @click="falseAlarmAction"
          :class="['px-8 py-2.5 rounded transition-colors', 
            isDarkTheme ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white']"
        >
          误报
        </button>
        <button 
          @click="resetAction"
          :class="['px-8 py-2.5 rounded transition-colors', 
            isDarkTheme ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800']"
        >
          重置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {Image,Input} from 'ant-design-vue'

const props = defineProps({
  alarmData: {
    type: Object,
    default: () => ({})
  },
  imageUrl: {
    type: String,
    default: '/src/assets/img_error.png'
  },
  isDarkTheme: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits(['close', 'confirm', 'falseAlarm', 'reset'])

// 主题相关
// const isDarkTheme = ref(props.isDarkTheme)

// const toggleTheme = () => {
//   isDarkTheme.value = !isDarkTheme.value
//   // 保存用户偏好到 localStorage
//   localStorage.setItem('alarmDetailTheme', isDarkTheme.value ? 'dark' : 'light')
// }

// 初始化主题
onMounted(() => {
  // 从 localStorage 获取用户偏好，如果没有则根据系统主题设置
//   const savedTheme = localStorage.getItem('alarmDetailTheme')
//   if (savedTheme) {
//     isDarkTheme.value = savedTheme === 'dark'
//   } else {
//     // 可以根据系统主题设置默认值
//     const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
//     isDarkTheme.value = systemPrefersDark
//   }
})

const handler = ref('')
const comment = ref('')

const closeModal = () => {
  emit('close')
}

const confirmAction = () => {
  emit('confirm', { handler: handler.value, comment: comment.value })
}

const falseAlarmAction = () => {
  emit('falseAlarm', { handler: handler.value, comment: comment.value })
}
watch(() => props.imageUrl, (newUrl) => {
  handler.value = ''
  comment.value = ''
})

const resetAction = () => {
  handler.value = ''
  comment.value = ''
  emit('reset')
}
</script>