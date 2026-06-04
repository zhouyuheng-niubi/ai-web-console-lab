<template>
  <div class="h-[600px]" :class="['flex flex-col h-full w-full rounded-lg overflow-hidden', 
    isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800']">
    <!-- Header -->
    <div :class="['flex items-center justify-between px-6 py-4 border-b', 
      isDarkTheme ? 'border-gray-700' : 'border-gray-200']" v-if="showHeader">
      <div>
        <h2 :class="['text-lg font-medium', isDarkTheme ? 'text-cyan-400' : 'text-blue-600']">
          审批详情 - {{ getApprovalTypeText() }}
        </h2>
        <div :class="['text-sm mt-1', isDarkTheme ? 'text-gray-400' : 'text-gray-500']">
          申请编号: {{ approvalData.id }}
        </div>
      </div>
      <div class="flex items-center gap-2">
        <template v-if="approvalData.status === 'pending'">
          <button 
            @click="handleReject"
            :class="['px-4 py-1.5 text-sm rounded transition-colors', 
              isDarkTheme ? 'bg-transparent border border-gray-600 text-gray-400 hover:border-red-600 hover:text-red-400' : 'bg-transparent border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500']"
          >
            驳回
          </button>
          <button 
            @click="handleApprove"
            :class="['px-4 py-1.5 text-sm rounded transition-colors', 
              isDarkTheme ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white']"
          >
            通过
          </button>
        </template>
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
      <div class="mb-6">
        <h3 :class="['text-sm font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200']">
          基本信息
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-3">
            <div class="flex items-start">
              <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">审批事项:</span>
              <div class="ml-2">
                <span class="font-medium">{{ getApprovalTypeText() }}</span>
                <div class="mt-1">
                  <span :class="['px-2 py-1 rounded text-xs font-medium', getUrgencyClass()]">
                    {{ getUrgencyText() }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-start">
              <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">申请人:</span>
              <div class="ml-2">
                <span class="font-medium">{{ approvalData.applicant_name || '--' }}</span>
                <div class="text-sm mt-1" :class="isDarkTheme ? 'text-gray-500' : 'text-gray-500'">
                  {{ approvalData.department || '' }} {{ approvalData.position ? `· ${approvalData.position}` : '' }}
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex items-start">
              <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">申请时间:</span>
              <span class="ml-2 font-medium">{{ formatDateTime(approvalData.apply_time) || '--' }}</span>
            </div>
            <div class="flex items-start">
              <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">相关会议:</span>
              <span class="ml-2 font-medium">{{ approvalData.meeting_name || '--' }}</span>
            </div>
            <div class="flex items-start">
              <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">审批状态:</span>
              <span class="ml-2">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
                  {{ getStatusText() }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 申请内容 -->
      <div class="mb-6">
        <h3 :class="['text-sm font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200']">
          申请内容
        </h3>
        <div :class="['p-4 rounded-lg whitespace-pre-wrap', 
          isDarkTheme ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200']">
          {{ approvalData.apply_content || '暂无申请内容' }}
        </div>
      </div>

      <!-- 相关附件 -->
      <div class="mb-6" v-if="approvalData.attachments && approvalData.attachments.length > 0">
        <h3 :class="['text-sm font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200']">
          相关附件 ({{ approvalData.attachments.length }}个)
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="attachment in approvalData.attachments" :key="attachment.id"
               :class="['flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-90', 
                 isDarkTheme ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200']"
               @click="downloadAttachment(attachment)">
            <div class="flex items-center gap-3">
              <div :class="['p-2 rounded', getFileTypeClass(attachment)]">
                <!-- <FileIcon :type="getFileType(attachment)" :isDarkTheme="isDarkTheme" /> -->
              </div>
              <div>
                <div class="font-medium">{{ attachment.name || '未命名文件' }}</div>
                <div class="text-xs mt-1" :class="isDarkTheme ? 'text-gray-500' : 'text-gray-500'">
                  {{ attachment.size || '未知大小' }}
                </div>
              </div>
            </div>
            <button @click.stop="downloadAttachment(attachment)" 
                    :class="['p-2 rounded-full transition-colors', 
                      isDarkTheme ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-800']">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 审批流程 -->
      <div class="mb-6" v-if="approvalData.approval_flow && approvalData.approval_flow.length > 0">
        <h3 :class="['text-sm font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200']">
          审批流程
        </h3>
        <div class="relative">
          <!-- 进度线 -->
          <div class="absolute left-4 top-0 bottom-0 w-0.5" 
               :class="isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'"></div>
          
          <div class="space-y-6 relative z-10">
            <div v-for="(step, index) in approvalData.approval_flow" :key="step.id"
                 class="flex items-start">
              <!-- 进度点 -->
              <div class="relative z-20 mr-6">
                <div :class="['w-8 h-8 rounded-full flex items-center justify-center border-2', 
                  getStepStatusClass(step.status)]">
                  <span class="text-sm font-medium">
                    {{ index + 1 }}
                  </span>
                </div>
              </div>
              
              <!-- 步骤内容 -->
              <div class="flex-1">
                <div :class="['p-4 rounded-lg', 
                  isDarkTheme ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200']">
                  <div class="flex items-center justify-between mb-2">
                    <div class="font-medium">{{ step.approver }}</div>
                    <div class="text-xs" :class="getStepStatusTextClass(step.status)">
                      {{ getStepStatusText(step.status) }}
                    </div>
                  </div>
                  
                  <div v-if="step.time" class="text-xs mb-2" :class="isDarkTheme ? 'text-gray-500' : 'text-gray-500'">
                    {{ formatDateTime(step.time) }}
                  </div>
                  
                  <div v-if="step.remark" class="text-sm" :class="isDarkTheme ? 'text-gray-400' : 'text-gray-600'">
                    {{ step.remark }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作历史 -->
      <div class="mb-6" v-if="approvalData.history && approvalData.history.length > 0">
        <h3 :class="['text-sm font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'text-gray-300 border-gray-700' : 'text-gray-700 border-gray-200']">
          操作历史
        </h3>
        <div class="space-y-3">
          <div v-for="(record, index) in approvalData.history" :key="index"
               :class="['p-3 rounded-lg', 
                 isDarkTheme ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200']">
            <div class="flex items-start justify-between">
              <div>
                <div class="font-medium">{{ record.user }}</div>
                <div class="text-xs mt-1" :class="isDarkTheme ? 'text-gray-500' : 'text-gray-500'">
                  {{ formatDateTime(record.time) }}
                </div>
              </div>
              <div>
                <span :class="['px-2 py-1 rounded text-xs', getHistoryTypeClass(record.type)]">
                  {{ getHistoryTypeText(record.type) }}
                </span>
              </div>
            </div>
            <div v-if="record.content" class="mt-2 text-sm" :class="isDarkTheme ? 'text-gray-400' : 'text-gray-600'">
              {{ record.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
// import FileIcon from '@/components/FileIcon.vue'

const props = defineProps({
  approvalData: {
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

const emit = defineEmits(['close', 'approve', 'reject'])

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 获取审批事项文本
const getApprovalTypeText = () => {
  const typeMap = {
    'equipment_compliance': '设备合规性审批',
    'qualification_extension': '资质延期审批',
    'safety_training': '安全培训审批',
    'equipment_maintenance': '设备维修审批'
  }
  return typeMap[props.approvalData.approval_type] || props.approvalData.approval_type_name || '未知审批'
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    'pending': '待审批',
    'approved': '已通过',
    'rejected': '已驳回',
    'withdrawn': '已撤回'
  }
  return statusMap[props.approvalData.status] || '未知状态'
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.approvalData.status
  if (props.isDarkTheme) {
    const darkClasses = {
      'pending': 'bg-orange-900 text-orange-300',
      'approved': 'bg-green-900 text-green-300',
      'rejected': 'bg-red-900 text-red-300',
      'withdrawn': 'bg-gray-700 text-gray-300'
    }
    return darkClasses[status] || darkClasses.pending
  } else {
    const lightClasses = {
      'pending': 'bg-orange-100 text-orange-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-gray-100 text-gray-600'
    }
    return lightClasses[status] || lightClasses.pending
  }
}

// 获取紧急程度文本
const getUrgencyText = () => {
  const levelMap = {
    'normal': '一般',
    'urgent': '紧急',
    'emergency': '特紧急'
  }
  return levelMap[props.approvalData.urgency_level] || '未知'
}

// 获取紧急程度样式类
const getUrgencyClass = () => {
  const level = props.approvalData.urgency_level
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

// 获取步骤状态文本
const getStepStatusText = (status) => {
  const statusMap = {
    'completed': '已完成',
    'current': '当前步骤',
    'pending': '待处理'
  }
  return statusMap[status] || '未知'
}

// 获取步骤状态文本样式类
const getStepStatusTextClass = (status) => {
  if (props.isDarkTheme) {
    const darkClasses = {
      'completed': 'text-green-400',
      'current': 'text-blue-400',
      'pending': 'text-gray-400'
    }
    return darkClasses[status] || darkClasses.pending
  } else {
    const lightClasses = {
      'completed': 'text-green-600',
      'current': 'text-blue-600',
      'pending': 'text-gray-600'
    }
    return lightClasses[status] || lightClasses.pending
  }
}

// 获取步骤状态样式类
const getStepStatusClass = (status) => {
  if (props.isDarkTheme) {
    const darkClasses = {
      'completed': 'bg-green-900 border-green-700 text-green-300',
      'current': 'bg-blue-900 border-blue-700 text-blue-300',
      'pending': 'bg-gray-800 border-gray-700 text-gray-400'
    }
    return darkClasses[status] || darkClasses.pending
  } else {
    const lightClasses = {
      'completed': 'bg-green-100 border-green-300 text-green-800',
      'current': 'bg-blue-100 border-blue-300 text-blue-800',
      'pending': 'bg-gray-100 border-gray-300 text-gray-600'
    }
    return lightClasses[status] || lightClasses.pending
  }
}

// 获取历史类型文本
const getHistoryTypeText = (type) => {
  const typeMap = {
    'apply': '提交申请',
    'approve': '审批通过',
    'reject': '审批驳回',
    'withdraw': '撤回申请',
    'comment': '添加备注'
  }
  return typeMap[type] || '操作'
}

// 获取历史类型样式类
const getHistoryTypeClass = (type) => {
  if (props.isDarkTheme) {
    const darkClasses = {
      'apply': 'bg-blue-900 text-blue-300',
      'approve': 'bg-green-900 text-green-300',
      'reject': 'bg-red-900 text-red-300',
      'withdraw': 'bg-gray-700 text-gray-300',
      'comment': 'bg-gray-800 text-gray-400'
    }
    return darkClasses[type] || darkClasses.comment
  } else {
    const lightClasses = {
      'apply': 'bg-blue-100 text-blue-800',
      'approve': 'bg-green-100 text-green-800',
      'reject': 'bg-red-100 text-red-800',
      'withdraw': 'bg-gray-100 text-gray-600',
      'comment': 'bg-gray-200 text-gray-700'
    }
    return lightClasses[type] || lightClasses.comment
  }
}

// 获取文件类型
const getFileType = (attachment) => {
  const name = attachment.name || ''
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'word'
  if (name.endsWith('.xls') || name.endsWith('.xlsx')) return 'excel'
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif')) return 'image'
  return 'file'
}

// 获取文件类型样式类
const getFileTypeClass = (attachment) => {
  const type = getFileType(attachment)
  if (props.isDarkTheme) {
    const darkClasses = {
      'pdf': 'bg-red-900',
      'word': 'bg-blue-900',
      'excel': 'bg-green-900',
      'image': 'bg-purple-900',
      'file': 'bg-gray-700'
    }
    return darkClasses[type] || darkClasses.file
  } else {
    const lightClasses = {
      'pdf': 'bg-red-100',
      'word': 'bg-blue-100',
      'excel': 'bg-green-100',
      'image': 'bg-purple-100',
      'file': 'bg-gray-100'
    }
    return lightClasses[type] || lightClasses.file
  }
}

// 下载附件
const downloadAttachment = (attachment) => {
  console.log('下载附件:', attachment)
  // 这里可以实现附件下载逻辑
  const link = document.createElement('a')
  link.href = attachment.url
  link.download = attachment.name
  link.click()
}

// 事件处理
const closeModal = () => {
  emit('close')
}

const handleApprove = () => {
  emit('approve')
}

const handleReject = () => {
  emit('reject')
}
</script>