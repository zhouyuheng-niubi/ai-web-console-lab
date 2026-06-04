<!-- FilePreviewer.vue -->
<template>
  <div class="file-preview-wrapper">
    <slot name="uploader" :handleFile="handleFile" :loading="loading">
      <!-- 默认上传区域 -->
      <div class="default-uploader">
        <input
          type="file"
          @change="handleFileChange"
          :accept="acceptTypes"
          :disabled="loading"
        />
      </div>
    </slot>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="fileInfo" class="file-info">
      当前文件: {{ fileInfo.name }} ({{ formatFileSize(fileInfo.size) }})
    </div>

    <component
      :is="previewComponent"
      v-if="previewComponent && fileBuffer"
      :src="fileBuffer"
      :style="previewStyle"
      @rendered="onRendered"
      @error="onError"
    />

    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      正在加载预览...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

// //引入VueOfficeDocx组件
// import VueOfficeDocx from '@vue-office/docx'
// import VueOfficeExcel from '@vue-office/excel'
// import VueOfficePdf from '@vue-office/pdf'
// //引入相关样式
// import '@vue-office/docx/lib/index.css'
// import '@vue-office/excel/lib/index.css'
// import '@vue-office/docx/lib/index.css'

const props = defineProps({
  // 接受的文件类型
  acceptTypes: {
    type: String,
    default: '.docx,.doc,.xlsx,.xls,.pdf'
  },
  // 预览区域样式
  previewStyle: {
    type: Object,
    default: () => ({ height: '700px', width: '100%' })
  },
  // 是否显示文件信息
  showFileInfo: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['loaded', 'error', 'file-selected'])

const fileBuffer = ref(null)
const fileInfo = ref(null)
const loading = ref(false)
const errorMessage = ref('')

// 文件类型映射
const fileTypeMap = {
  docx: 'docx',
  doc: 'docx',
  xlsx: 'excel',
  xls: 'excel',
  pdf: 'pdf'
}

// 组件映射
const componentMap = {
  docx: VueOfficeDocx,
  excel: VueOfficeExcel,
  pdf: VueOfficePdf
}

// 计算预览组件
const previewComponent = computed(() => {
  if (!fileInfo.value) return null
  const ext = fileInfo.value.name.split('.').pop().toLowerCase()
  const type = fileTypeMap[ext]
  return componentMap[type] || null
})

// 处理文件
const handleFile = async (file) => {
  if (!file) return

  resetState()
  fileInfo.value = {
    name: file.name,
    size: file.size,
    type: file.type
  }

  emit('file-selected', fileInfo.value)

  const ext = file.name.split('.').pop().toLowerCase()
  const type = fileTypeMap[ext]

  if (!type) {
    errorMessage.value = '不支持的文件格式'
    return
  }

  loading.value = true

  try {
    const arrayBuffer = await file.arrayBuffer()
    fileBuffer.value = arrayBuffer
    emit('loaded', { file, buffer: arrayBuffer })
  } catch (error) {
    errorMessage.value = '文件读取失败'
    emit('error', error)
  }
}

// 处理文件选择事件
const handleFileChange = (event) => {
  const file = event.target.files[0]
  handleFile(file)
}

// 重置状态
const resetState = () => {
  fileBuffer.value = null
  errorMessage.value = ''
}

// 渲染完成
const onRendered = () => {
  loading.value = false
  console.log('预览渲染完成')
}

// 错误处理
const onError = (error) => {
  loading.value = false
  errorMessage.value = '预览加载失败'
  emit('error', error)
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.file-preview-wrapper {
  position: relative;
}

.default-uploader input {
  padding: 10px;
  border: 2px dashed #ccc;
  border-radius: 6px;
  width: 100%;
  cursor: pointer;
}

.default-uploader input:hover {
  border-color: #4CAF50;
}

.file-info {
  margin: 10px 0;
  padding: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
}

.error-message {
  color: #f44336;
  padding: 10px;
  background: #ffebee;
  border-radius: 4px;
  margin: 10px 0;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4CAF50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>