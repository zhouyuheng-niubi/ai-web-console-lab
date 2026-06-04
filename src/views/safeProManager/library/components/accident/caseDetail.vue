<template>
  <div class="case-detail h-[700px] overflow-y-auto">
    <!-- 案例基本信息 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">案例基本信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">案例名称:</span>
          <span class="ml-2 font-medium">{{ caseData.case_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">事故类型:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getAccidentTypeClass()]">
              {{ getAccidentTypeText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">适用场景:</span>
          <span class="ml-2 font-medium">{{ caseData.scene_names?.join('、') || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">事故发生单位:</span>
          <span class="ml-2 font-medium">{{ caseData.occurrence_unit || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">所在区域:</span>
          <span class="ml-2 font-medium">{{ caseData.region_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">发生地点:</span>
          <span class="ml-2 font-medium">{{ caseData.location || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">发生时间:</span>
          <span class="ml-2 font-medium">{{ formatDateTime(caseData.occurrence_time) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">上传人:</span>
          <span class="ml-2 font-medium">{{ caseData.uploader_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">上传时间:</span>
          <span class="ml-2 font-medium">{{ formatDateTime(caseData.upload_time) }}</span>
        </div>
      </div>
    </div>

    <!-- 事故概况 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">事故概况</h3>
      <div class="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap min-h-[100px]">
        {{ caseData.accident_overview || '暂无事故概况' }}
      </div>
    </div>

    <!-- 原因分析 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">原因分析</h3>
      <div class="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap min-h-[100px]">
        {{ caseData.cause_analysis || '暂无原因分析' }}
      </div>
    </div>

    <!-- 整改措施 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">整改措施</h3>
      <div class="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap min-h-[100px]">
        {{ caseData.corrective_measures || '暂无整改措施' }}
      </div>
    </div>

    <!-- 案例附件 -->
    <div class="mb-8" v-if="caseData.attachments && caseData.attachments.length > 0">
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 class="text-base font-medium">案例附件</h3>
        <span class="text-gray-500">{{ caseData.attachments.length }} 个文件</span>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div v-for="file in caseData.attachments" :key="file.id" 
          class="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-2">
            <div :class="['p-2 rounded', getFileIconClass(file.type)]">
              <svg class="w-6 h-6" :class="getFileIconColor(file.type)" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-medium truncate">{{ file.name }}</div>
              <div class="text-xs text-gray-500">
                {{ formatFileSize(file.size) }} • {{ dayjs(file.created_time).format('YYYY-MM-DD') }}
              </div>
            </div>
          </div>
          <div v-if="file.remark" class="mb-2 text-sm text-gray-600">
            {{ file.remark }}
          </div>
          <div class="flex justify-end gap-2">
            <button @click="previewFile(file)" 
              class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors">
              预览
            </button>
            <button @click="downloadFile(file)" 
              class="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors">
              下载
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 ">
      <button @click="handleEdit"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
        编辑
      </button>
      <button @click="handleUploadAttachment"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
        上传附件
      </button>
      <button @click="handleDelete"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
        删除
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Modal, message } from 'ant-design-vue'
import dayjs from 'dayjs'

const props = defineProps({
  caseData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'edit', 'uploadAttachment', 'delete'])

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '--'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

// 获取事故类型文本
const getAccidentTypeText = () => {
  const typeMap = {
    'fall': '高处坠落',
    'fire_explosion': '火灾爆炸',
    'mechanical': '机械伤害',
    'poisoning': '中毒窒息',
    'collapse': '坍塌',
    'electric': '触电',
    'other': '其他'
  }
  return typeMap[props.caseData.accident_type] || '未知'
}

// 获取事故类型样式类
const getAccidentTypeClass = () => {
  const type = props.caseData.accident_type
  const classMap = {
    'fall': 'bg-red-100 text-red-800',
    'fire_explosion': 'bg-orange-100 text-orange-800',
    'mechanical': 'bg-yellow-100 text-yellow-800',
    'poisoning': 'bg-purple-100 text-purple-800',
    'collapse': 'bg-gray-100 text-gray-800',
    'electric': 'bg-blue-100 text-blue-800',
    'other': 'bg-gray-100 text-gray-800'
  }
  return classMap[type] || classMap.other
}

// 获取文件图标样式
const getFileIconClass = (fileType) => {
  if (fileType?.startsWith('image/')) return 'bg-blue-100'
  if (fileType?.startsWith('video/')) return 'bg-purple-100'
  if (fileType === 'application/pdf') return 'bg-red-100'
  return 'bg-gray-100'
}

// 获取文件图标颜色
const getFileIconColor = (fileType) => {
  if (fileType?.startsWith('image/')) return 'text-blue-600'
  if (fileType?.startsWith('video/')) return 'text-purple-600'
  if (fileType === 'application/pdf') return 'text-red-600'
  return 'text-gray-600'
}

// 预览文件
const previewFile = (file) => {
  if (file.type?.startsWith('image/')) {
    Modal.info({
      title: file.name,
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
          src: file.url,
          style: {
            maxWidth: '100%',
            maxHeight: '500px',
            objectFit: 'contain',
            borderRadius: '8px'
          },
          alt: file.name
        })
      ]),
      onOk() {}
    })
  } else {
    window.open(file.url, '_blank')
  }
}

// 下载文件
const downloadFile = (file) => {
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.name
  link.click()
}

// 操作处理
const handleEdit = () => {
  emit('edit', props.caseData)
}

const handleUploadAttachment = () => {
  emit('uploadAttachment', props.caseData)
}

const handleDelete = () => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除该事故案例吗？删除后将无法恢复。',
    onOk() {
      emit('delete', props.caseData)
    }
  })
}
</script>