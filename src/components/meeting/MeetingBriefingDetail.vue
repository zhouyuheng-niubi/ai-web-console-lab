<template>
  <div :class="['flex flex-col h-full w-full rounded-lg overflow-hidden', 
    isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800']">
    <!-- Header -->
    <div :class="['flex items-center justify-between px-6 py-4 border-b', 
      isDarkTheme ? 'border-gray-700' : 'border-gray-200']" v-if="showHeader">
      <h2 :class="['text-lg font-medium', isDarkTheme ? 'text-cyan-400' : 'text-blue-600']">
        会议详情 - {{ meetingData.meeting_name || '安全交底会议' }}
      </h2>
      <div class="flex items-center gap-2">
        <button 
          @click="closeModal" 
          :class="['p-1 rounded-full transition-colors', 
            isDarkTheme ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200']"
          title="关闭"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto p-6">
      <!-- 基本信息 -->
      <div class="grid grid-cols-2 gap-x-12 gap-y-4 mb-6">
        <div class="space-y-3">
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">会议名称:</span>
            <span class="ml-2 font-medium">{{ meetingData.meeting_name || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">发起班组:</span>
            <span class="ml-2 font-medium">{{ meetingData.team_name || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">会议时间:</span>
            <span class="ml-2 font-medium">{{ formatDateTime(meetingData.meeting_time) || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">紧急程度:</span>
            <span class="ml-2">
              <span :class="['px-2 py-1 rounded text-xs font-medium', getUrgencyClass()]">
                {{ getUrgencyText() }}
              </span>
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">会议地点:</span>
            <span class="ml-2 font-medium">{{ meetingData.region_name || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">主持人:</span>
            <span class="ml-2 font-medium">{{ meetingData.host_name || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">参会人数:</span>
            <span class="ml-2 font-medium">{{ meetingData.attendance?.actual || 0 }}/{{ meetingData.attendance?.total || 0 }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">交底状态:</span>
            <span class="ml-2">
              <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
                {{ getStatusText() }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- 待办事项 -->
      <div class="mb-6">
        <h3 :class="['text-sm font-medium mb-2', isDarkTheme ? 'text-gray-300' : 'text-gray-700']">
          待办事项
        </h3>
        <div :class="['rounded-lg border', 
          isDarkTheme ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50']">
          <div class="grid grid-cols-2 gap-4 p-4">
            <div v-for="todo in getTodoList()" :key="todo.type" 
                 :class="['flex items-center justify-between p-3 rounded', 
                   todo.completed ? 
                   (isDarkTheme ? 'bg-green-900 border border-green-700' : 'bg-green-100 border border-green-300') :
                   (isDarkTheme ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300')]">
              <div class="flex items-center gap-3">
                <div :class="['p-2 rounded-full', 
                  todo.completed ? 
                  (isDarkTheme ? 'bg-green-800' : 'bg-green-200') :
                  (isDarkTheme ? 'bg-gray-700' : 'bg-gray-200')]">
                  <svg class="w-4 h-4" :class="todo.completed ? 'text-green-300' : 'text-gray-500'" 
                       fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="todo.completed" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    <path v-else d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">{{ todo.label }}</div>
                  <div class="text-xs mt-1" :class="isDarkTheme ? 'text-gray-500' : 'text-gray-500'">
                    {{ todo.completed ? '已完成' : '未完成' }}
                  </div>
                </div>
              </div>
              <button v-if="!todo.completed" 
                      @click="handleTodoAction(todo.type)"
                      :class="['px-3 py-1 text-xs rounded transition-colors', 
                        isDarkTheme ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white']">
                处理
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全交底内容 -->
      <div class="mb-6">
        <h3 :class="['text-sm font-medium mb-2', isDarkTheme ? 'text-gray-300' : 'text-gray-700']">
          安全交底内容
        </h3>
        <div :class="['p-4 rounded-lg whitespace-pre-wrap', 
          isDarkTheme ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200']">
          {{ meetingData.briefing_content || '暂无安全交底内容' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  meetingData: {
    type: Object,
    default: () => ({})
  },
  isDarkTheme: {
    type: Boolean,
    default: false
  },
  showHeader: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'sign', 'confirmMeasures', 'signPromise'])

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 获取紧急程度文本
const getUrgencyText = () => {
  const urgencyMap = {
    'normal': '一般',
    'urgent': '紧急',
    'emergency': '特紧急'
  }
  return urgencyMap[props.meetingData.urgency_level] || '未知'
}

// 获取紧急程度样式类
const getUrgencyClass = () => {
  const level = props.meetingData.urgency_level
  if (props.isDarkTheme) {
    const darkClasses = {
      'normal': 'bg-gray-700 text-gray-300',
      'urgent': 'bg-orange-900 text-orange-300',
      'emergency': 'bg-red-900 text-red-300'
    }
    return darkClasses[level] || darkClasses.normal
  } else {
    const lightClasses = {
      'normal': 'bg-gray-100 text-gray-600',
      'urgent': 'bg-orange-100 text-orange-800',
      'emergency': 'bg-red-100 text-red-800'
    }
    return lightClasses[level] || lightClasses.normal
  }
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    'not_started': '未开始',
    'in_progress': '进行中',
    'completed': '已完成'
  }
  return statusMap[props.meetingData.briefing_status] || '未知'
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.meetingData.briefing_status
  if (props.isDarkTheme) {
    const darkClasses = {
      'not_started': 'bg-gray-700 text-gray-300',
      'in_progress': 'bg-blue-900 text-blue-300',
      'completed': 'bg-green-900 text-green-300'
    }
    return darkClasses[status] || darkClasses.not_started
  } else {
    const lightClasses = {
      'not_started': 'bg-gray-100 text-gray-600',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800'
    }
    return lightClasses[status] || lightClasses.not_started
  }
}

// 获取待办列表
const getTodoList = () => {
  const todoTypes = props.meetingData.todo_type || []
  const todoMap = {
    'sign': { label: '待签到', type: 'sign' },
    'confirm_measures': { label: '待确认安全措施', type: 'confirm_measures' },
    'sign_promise': { label: '待签署承诺书', type: 'sign_promise' },
    'briefing': { label: '待参与交底', type: 'briefing' }
  }
  
  return Object.values(todoMap)
    .filter(todo => todoTypes.includes(todo.type))
    .map(todo => ({
      ...todo,
      completed: false // 这里应该从实际数据中获取完成状态
    }))
}

// 处理待办事项操作
const handleTodoAction = (type) => {
  switch (type) {
    case 'sign':
      emit('sign')
      break
    case 'confirm_measures':
      emit('confirmMeasures')
      break
    case 'sign_promise':
      emit('signPromise')
      break
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}
</script>