<template>
  <div class="certificate-detail">
    <!-- 证书基本信息 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">证书基本信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">人员名称:</span>
          <span class="ml-2 font-medium">{{ certificateData.person_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">证书名称:</span>
          <span class="ml-2 font-medium">{{ certificateData.certificate_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">证书编号:</span>
          <span class="ml-2 font-medium">{{ certificateData.certificate_no || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">证书类型:</span>
          <span class="ml-2 font-medium">{{ getCertificateTypeText(certificateData.certificate_type) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">发证机构:</span>
          <span class="ml-2 font-medium">{{ certificateData.issuing_institution || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">发证日期:</span>
          <span class="ml-2 font-medium">{{ formatDate(certificateData.issue_date) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">有效期:</span>
          <span class="ml-2 font-medium">
            {{ formatDate(certificateData.valid_start) }} 至 {{ formatDate(certificateData.valid_end) }}
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">证书状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
              {{ getStatusText() }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- 核验信息 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">核验信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">上次核验日期:</span>
          <span class="ml-2 font-medium">{{ formatDate(certificateData.last_verify_date) || '未核验' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">核验结果:</span>
          <span class="ml-2">
            <span v-if="certificateData.last_verify_result" :class="['px-2 py-1 rounded text-xs font-medium', getVerifyResultClass()]">
              {{ getVerifyResultText() }}
            </span>
            <span v-else class="text-gray-500">--</span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">核验人:</span>
          <span class="ml-2 font-medium">{{ certificateData.last_verify_by || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">创建时间:</span>
          <span class="ml-2 font-medium">{{ formatDateTime(certificateData.created_time) }}</span>
        </div>
        <div v-if="certificateData.last_verify_remark" class="col-span-2">
          <span class="min-w-[120px] text-gray-600">核验说明:</span>
          <span class="ml-2">{{ certificateData.last_verify_remark }}</span>
        </div>
      </div>
    </div>

    <!-- 证书附件 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 class="text-base font-medium">证书附件</h3>
        <span class="text-gray-500">{{ certificateData.attachments?.length || 0 }} 个文件</span>
      </div>
      
      <div v-if="certificateData.attachments && certificateData.attachments.length > 0" 
        class="grid grid-cols-2 gap-4">
        <div v-for="file in certificateData.attachments" :key="file.id" 
          class="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-blue-100 rounded">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
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
            <button @click="downloadFile(file)" 
              class="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors">
              下载
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        暂无附件
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button @click="handleEdit"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
        编辑
      </button>
      <button @click="handleVerify"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
        核验
      </button>
      <button @click="handleInvalidate"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
        作废
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Modal, message } from 'ant-design-vue'
import dayjs from 'dayjs'

const props = defineProps({
  certificateData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'edit', 'verify', 'invalidate'])

// 格式化日期
const formatDate = (date) => {
  if (!date) return '--'
  return dayjs(date).format('YYYY-MM-DD')
}

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

// 获取证书类型文本
const getCertificateTypeText = (type) => {
  const typeMap = {
    'safety': '安全证书',
    'professional': '职业资格证书',
    'training': '培训证书',
    'education': '学历证书',
    'other': '其他'
  }
  return typeMap[type] || type || '--'
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    'valid': '有效',
    'expired': '已过期',
    'invalid': '已作废',
    'verifying': '核验中'
  }
  return statusMap[props.certificateData.status] || '未知'
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.certificateData.status
  const classMap = {
    'valid': 'bg-green-100 text-green-800',
    'expired': 'bg-red-100 text-red-800',
    'invalid': 'bg-gray-100 text-gray-800',
    'verifying': 'bg-orange-100 text-orange-800'
  }
  return classMap[status] || classMap.valid
}

// 获取核验结果文本
const getVerifyResultText = () => {
  const resultMap = {
    'valid': '有效',
    'invalid': '无效',
    'questionable': '存疑'
  }
  return resultMap[props.certificateData.last_verify_result] || '未知'
}

// 获取核验结果样式类
const getVerifyResultClass = () => {
  const result = props.certificateData.last_verify_result
  const classMap = {
    'valid': 'bg-green-100 text-green-800',
    'invalid': 'bg-red-100 text-red-800',
    'questionable': 'bg-orange-100 text-orange-800'
  }
  return classMap[result] || classMap.valid
}

// 预览文件
const previewFile = (file) => {
  if (file.type.startsWith('image/')) {
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
  if (props.certificateData.status === 'invalid') {
    message.warning('已作废的证书不能编辑')
    return
  }
  emit('edit', props.certificateData)
}

const handleVerify = () => {
  if (props.certificateData.status === 'invalid') {
    message.warning('已作废的证书不需要核验')
    return
  }
  emit('verify', props.certificateData)
}

const handleInvalidate = () => {
  if (props.certificateData.status !== 'valid') {
    message.warning('只能作废有效的证书')
    return
  }
  
  Modal.confirm({
    title: '确认作废证书',
    content: '确定要作废该证书吗？此操作不可逆。',
    onOk() {
      emit('invalidate', props.certificateData)
    }
  })
}
</script>