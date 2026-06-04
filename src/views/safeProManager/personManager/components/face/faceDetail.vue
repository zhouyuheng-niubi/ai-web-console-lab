<template>
  <div :class="['flex flex-col h-[700px] w-full rounded-lg overflow-hidden h-[700px]', 
    isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800']">
    <!-- Header -->
    

    <!-- Content -->
    <div class="flex-1 overflow-auto p-6">
      <!-- 人员信息 -->
      <div class="mb-8">
        <h3 :class="['text-base font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700']">
          人员信息
        </h3>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4">
          <div class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">姓名:</span>
            <span class="ml-2 font-medium">{{ faceData.name || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">工号:</span>
            <span class="ml-2 font-medium">{{ faceData.employee_id || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">所属班组:</span>
            <span class="ml-2 font-medium">{{ faceData.team_name || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">状态:</span>
            <span class="ml-2">
              <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
                {{ getStatusText() }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- 人脸图片 -->
      <div class="mb-8">
        <h3 :class="['text-base font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700']">
          人脸图片
        </h3>
        <div class="flex flex-col items-center">
          <div :class="['w-48 h-48 rounded-lg overflow-hidden border-4', 
            faceData.face_image ? 
            (isDarkTheme ? 'border-cyan-600' : 'border-blue-500') :
            (isDarkTheme ? 'border-gray-700' : 'border-gray-300')]">
            <img v-if="faceData.face_image" 
              :src="faceData.face_image" 
              alt="人脸图片" 
              class="w-full h-full object-cover"
              @click="previewImage(faceData.face_image, '人脸图片')">
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
              <span :class="['text-lg', isDarkTheme ? 'text-gray-500' : 'text-gray-500']">暂无图片</span>
            </div>
          </div>
          <div class="mt-4 text-center">
            <p :class="['text-sm', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">
              图片质量: {{ getImageQuality() }}
            </p>
            <p v-if="faceData.face_score" :class="['text-sm mt-1', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">
              识别分数: {{ faceData.face_score }}
            </p>
          </div>
        </div>
      </div>

      <!-- 签字签名 -->
      <div class="mb-8">
        <h3 :class="['text-base font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700']">
          签字签名
        </h3>
        <div class="flex flex-col items-center">
          <div :class="['w-64 h-32 rounded-lg overflow-hidden border', 
            faceData.signature_image ? 
            (isDarkTheme ? 'border-cyan-600' : 'border-blue-500') :
            (isDarkTheme ? 'border-gray-700' : 'border-gray-300')]">
            <img v-if="faceData.signature_image" 
              :src="faceData.signature_image" 
              alt="签字签名" 
              class="w-full h-full object-contain bg-white p-2"
              @click="previewImage(faceData.signature_image, '签字签名')">
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
              <span :class="['text-lg', isDarkTheme ? 'text-gray-500' : 'text-gray-500']">暂无签名</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间信息 -->
      <div class="mb-8">
        <h3 :class="['text-base font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700']">
          时间信息
        </h3>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4">
          <div class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">录入时间:</span>
            <span class="ml-2 font-medium">{{ formatDateTime(faceData.created_time) }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">最后更新时间:</span>
            <span class="ml-2 font-medium">{{ formatDateTime(faceData.updated_time) }}</span>
          </div>
          <div v-if="faceData.last_recognize_time" class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">最近识别时间:</span>
            <span class="ml-2 font-medium">{{ formatDateTime(faceData.last_recognize_time) }}</span>
          </div>
          <div v-if="faceData.recognize_count" class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">识别次数:</span>
            <span class="ml-2 font-medium">{{ faceData.recognize_count }} 次</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t" 
        :class="isDarkTheme ? 'border-gray-700' : 'border-gray-200'">
        <button @click="handleEdit"
          :class="['px-4 py-2 rounded transition-colors', 
            isDarkTheme ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white']">
          编辑信息
        </button>
        <button @click="handleUpdateFace"
          :class="['px-4 py-2 rounded transition-colors', 
            isDarkTheme ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white']">
          更新图片
        </button>
        <button @click="handleDelete"
          :class="['px-4 py-2 rounded transition-colors', 
            isDarkTheme ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white']">
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Modal, message } from 'ant-design-vue'
import dayjs from 'dayjs'

const props = defineProps({
  faceData: {
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

const emit = defineEmits(['close', 'edit', 'updateFace', 'delete'])

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    'active': '已激活',
    'inactive': '未激活',
    'expired': '已过期'
  }
  return statusMap[props.faceData.status] || '未知'
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.faceData.status
  if (props.isDarkTheme) {
    const darkClasses = {
      'active': 'bg-green-900 text-green-300',
      'inactive': 'bg-orange-900 text-orange-300',
      'expired': 'bg-red-900 text-red-300'
    }
    return darkClasses[status] || darkClasses.active
  } else {
    const lightClasses = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-orange-100 text-orange-800',
      'expired': 'bg-red-100 text-red-800'
    }
    return lightClasses[status] || lightClasses.active
  }
}

// 获取图片质量
const getImageQuality = () => {
  if (!props.faceData.face_image) return '无图片'
  
  if (props.faceData.face_quality) {
    const quality = props.faceData.face_quality
    if (quality >= 80) return '优'
    if (quality >= 60) return '良'
    if (quality >= 40) return '中'
    return '差'
  }
  return '未知'
}

// 预览图片
const previewImage = (url: string, title: string) => {
  if (!url) return
  
  Modal.info({
    title,
    width: 800,
    icon: null,
    maskClosable: true,
    content: () => h('div', { 
      style: { 
        textAlign: 'center',
        padding: '20px 0'
      } 
    }, [
      h('img', {
        src: url,
        style: {
          maxWidth: '100%',
          maxHeight: '500px',
          objectFit: 'contain',
          borderRadius: '8px'
        },
        alt: title
      })
    ]),
    onOk() {},
    onCancel() {}
  })
}

// 操作处理
const handleEdit = () => {
  emit('edit', props.faceData)
}

const handleUpdateFace = () => {
  emit('updateFace', props.faceData)
}

const handleDelete = () => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除该人脸信息吗？删除后无法恢复。',
    onOk() {
      emit('delete', props.faceData)
    }
  })
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}
</script>