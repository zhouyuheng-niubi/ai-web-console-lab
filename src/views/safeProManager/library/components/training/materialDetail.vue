<template>
  <div class="material-detail">
    <!-- 资料基本信息 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">资料基本信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">资料名称:</span>
          <span class="ml-2 font-medium">{{ materialData.material_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">资料类型:</span>
          <span class="ml-2 font-medium">{{ getMaterialTypeText(materialData.material_type) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">使用场景:</span>
          <span class="ml-2 font-medium">{{ materialData.scene_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">素材时长:</span>
          <span class="ml-2 font-medium">{{ formatDuration(materialData.duration) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">素材大小:</span>
          <span class="ml-2 font-medium">{{ formatFileSize(materialData.file_size) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">上传人:</span>
          <span class="ml-2 font-medium">{{ materialData.uploader_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">上传时间:</span>
          <span class="ml-2 font-medium">{{ formatDateTime(materialData.upload_time) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">最后更新:</span>
          <span class="ml-2 font-medium">{{ formatDateTime(materialData.update_time) || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">资料状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
              {{ getStatusText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">观看次数:</span>
          <span class="ml-2 font-medium">{{ materialData.view_count || 0 }}次</span>
        </div>
      </div>
    </div>

    <!-- 资料描述 -->
    <div class="mb-8" v-if="materialData.description">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">资料描述</h3>
      <div class="p-4 bg-gray-50 rounded-lg">
        {{ materialData.description }}
      </div>
    </div>

    <!-- 资料预览 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 class="text-base font-medium">资料预览</h3>
        <button 
          v-if="materialData.file_url"
          @click="downloadFile"
          class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
        >
          下载文件
        </button>
      </div>
      
      <div v-if="materialData.file_url">
        <div v-if="isVideoFile(materialData.file_type)" class="relative">
          <video 
            :src="materialData.file_url" 
            controls 
            class="w-full max-h-[400px] rounded-lg border border-gray-300"
          >
            您的浏览器不支持视频播放
          </video>
        </div>
        
        <div v-else-if="isImageFile(materialData.file_type)" class="flex justify-center">
          <img 
            :src="materialData.file_url" 
            :alt="materialData.material_name"
            class="max-w-full max-h-[400px] rounded-lg border border-gray-300 object-contain"
          />
        </div>
        
        <div v-else-if="materialData.file_type === 'application/pdf'" class="flex flex-col items-center">
          <div class="mb-4">
            <div class="p-4 bg-red-100 rounded-lg">
              <svg class="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <p class="text-gray-600">PDF文件，请下载后查看</p>
        </div>
        
        <div v-else class="flex flex-col items-center">
          <div class="mb-4">
            <div class="p-4 bg-blue-100 rounded-lg">
              <svg class="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <p class="text-gray-600">{{ materialData.file_name || '文件' }}</p>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        暂无文件
      </div>
    </div>

    <!-- 附件列表 -->
    <div class="mb-8" v-if="materialData.attachments && materialData.attachments.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">相关附件</h3>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="file in materialData.attachments" :key="file.id" 
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
          <div class="flex justify-end gap-2">
            <button @click="previewFile(file)" 
              class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors">
              预览
            </button>
            <button @click="downloadAttachment(file)" 
              class="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors">
              下载
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button @click="handleEdit"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
        编辑
      </button>
      <button @click="handleUpdateFile"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
        上传更新
      </button>
      <button v-if="materialData.status === 'unpublished'" @click="handlePublish"
        class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors">
        发布
      </button>
      <button v-if="materialData.status === 'published'" @click="handleUnpublish"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
        下架
      </button>
      <button v-if="materialData.status !== 'published'" @click="handleDelete"
        class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors">
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
  materialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'edit', 'updateFile', 'publish', 'unpublish', 'delete'])

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化时长
const formatDuration = (seconds) => {
  if (!seconds) return '--'
  if (seconds < 60) return `${seconds}秒`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟`
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}小时${minutes}分钟`
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '--'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

// 获取资料类型文本
const getMaterialTypeText = (type) => {
  const typeMap = {
    'video': '视频',
    'document': '文档',
    'pdf': 'PDF',
    'image': '图片',
    'audio': '音频',
    'course': '课程',
    'other': '其他'
  }
  return typeMap[type] || type || '--'
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    'published': '已发布',
    'unpublished': '未发布',
    'unlisted': '已下架'
  }
  return statusMap[props.materialData.status] || '未知'
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.materialData.status
  const classMap = {
    'published': 'bg-green-100 text-green-800',
    'unpublished': 'bg-orange-100 text-orange-800',
    'unlisted': 'bg-red-100 text-red-800'
  }
  return classMap[status] || classMap.unpublished
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

// 判断是否为视频文件
const isVideoFile = (fileType) => {
  return fileType?.startsWith('video/')
}

// 判断是否为图片文件
const isImageFile = (fileType) => {
  return fileType?.startsWith('image/')
}

// 下载主文件
const downloadFile = () => {
  if (!props.materialData.file_url) {
    message.warning('文件不存在')
    return
  }
  
  const link = document.createElement('a')
  link.href = props.materialData.file_url
  link.download = props.materialData.file_name || 'file'
  link.click()
}

// 预览文件
const previewFile = (file) => {
  if (isImageFile(file.type)) {
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

// 下载附件
const downloadAttachment = (file) => {
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.name
  link.click()
}

// 操作处理
const handleEdit = () => {
  if (props.materialData.status === 'published') {
    message.warning('已发布的资料不能编辑，请先下架')
    return
  }
  emit('edit', props.materialData)
}

const handleUpdateFile = () => {
  emit('updateFile', props.materialData)
}

const handlePublish = () => {
  emit('publish', props.materialData)
}

const handleUnpublish = () => {
  Modal.confirm({
    title: '确认下架',
    content: '确定要下架该资料吗？下架后用户将无法查看。',
    onOk() {
      emit('unpublish', props.materialData)
    }
  })
}

const handleDelete = () => {
  if (props.materialData.status === 'published') {
    message.warning('已发布的资料不能删除，请先下架')
    return
  }
  
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除该资料吗？删除后将无法恢复。',
    onOk() {
      emit('delete', props.materialData)
    }
  })
}
</script>