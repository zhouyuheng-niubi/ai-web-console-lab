<!-- components/meeting/meetingDetail.vue -->
<template>
  <div class="meeting-detail">
    <!-- 会议基本信息 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">会议基本信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">会议名称:</span>
          <span class="ml-2 font-medium">{{ meetingData.meeting_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">发起班组:</span>
          <span class="ml-2 font-medium">{{ meetingData.team_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">会议时间:</span>
          <span class="ml-2 font-medium">{{ formatDateTime(meetingData.start_time) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">会议地点:</span>
          <span class="ml-2 font-medium">{{ meetingData.area_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">主持人:</span>
          <span class="ml-2 font-medium">{{ meetingData.host_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">参会人数:</span>
          <span class="ml-2 font-medium">{{ meetingData.actual_attendees || 0 }}/{{ meetingData.expected_attendees || 0 }}人</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">会议状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
              {{ getStatusText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">风险等级:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getRiskClass()]">
              {{ getRiskText() }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- 会议描述 -->
    <div class="mb-8" v-if="meetingData.description">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">会议描述</h3>
      <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="whitespace-pre-wrap">{{ meetingData.description }}</div>
      </div>
    </div>

    <!-- 参会人员 -->
    <div class="mb-8" v-if="meetingData.attendees && meetingData.attendees.length > 0">
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 class="text-base font-medium">参会人员</h3>
        <span class="text-sm text-gray-500">{{ meetingData.attendees.length }}人</span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div v-for="person in meetingData.attendees" :key="person.id" 
          class="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="text-blue-600 font-medium">{{ person.name?.charAt(0) }}</span>
            </div>
            <div>
              <div class="font-medium">{{ person.name }}</div>
              <div class="text-sm text-gray-600">{{ person.position }}</div>
              <div class="text-xs mt-1">
                <span :class="['px-1 py-0.5 rounded', person.attended ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600']">
                  {{ person.attended ? '已签到' : '未签到' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 相关资料 -->
    <div class="mb-8" v-if="meetingData.documents && meetingData.documents.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">相关资料</h3>
      <div class="space-y-2">
        <div v-for="file in meetingData.documents" :key="file.id" 
          class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div class="flex items-center gap-3">
            <FileTextOutlined class="text-blue-600 text-lg" />
            <div>
              <div class="font-medium">{{ file.name }}</div>
              <div class="text-sm text-gray-500">
                {{ getFileTypeText(file.type) }} • {{ formatFileSize(file.size) }} • {{ formatDateTime(file.upload_time) }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Button type="link" size="small" @click="handlePreviewFile(file)">
              预览
            </Button>
            <Button type="link" size="small" @click="handleDownloadFile(file)">
              下载
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button v-if="['draft', 'pending'].includes(meetingData.status)" @click="handleEdit"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
        编辑
      </button>
      <button v-if="meetingData.status === 'pending'" @click="handleLaunch"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
        发起会议
      </button>
      <button v-if="['draft', 'pending'].includes(meetingData.status)" @click="handleCancel"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
        取消
      </button>
      <button v-if="['pending', 'in_progress', 'completed'].includes(meetingData.status)" @click="handleUpload"
        class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors">
        上传资料
      </button>
      <button v-if="meetingData.status === 'completed'" @click="handleViewMinutes"
        class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors">
        会议纪要
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileTextOutlined } from '@ant-design/icons-vue'
import { Button, message } from 'ant-design-vue'
import dayjs from 'dayjs'

const props = defineProps({
  meetingData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'edit', 'launch', 'cancel', 'upload', 'viewMinutes'])

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取文件类型文本
const getFileTypeText = (type) => {
  const typeMap = {
    'agenda': '会议议程',
    'notice': '会议通知',
    'material': '会议材料',
    'attendance': '签到表',
    'record': '会议记录',
    'resolution': '决议文件',
    'other': '其他文件'
  }
  return typeMap[type] || type
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    'draft': '未发起',
    'pending': '待召开',
    'in_progress': '进行中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[props.meetingData.status] || '未知'
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.meetingData.status
  const classMap = {
    'draft': 'bg-gray-100 text-gray-800',
    'pending': 'bg-orange-100 text-orange-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classMap[status] || classMap.draft
}

// 获取风险等级文本
const getRiskText = () => {
  const riskMap = {
    'low': '低风险',
    'medium': '中风险',
    'high': '高风险'
  }
  return riskMap[props.meetingData.risk_level] || '--'
}

// 获取风险等级样式类
const getRiskClass = () => {
  const risk = props.meetingData.risk_level
  const classMap = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-orange-100 text-orange-800',
    'high': 'bg-red-100 text-red-800'
  }
  return classMap[risk] || classMap.low
}

// 预览文件
const handlePreviewFile = (file) => {
  message.info('文件预览功能开发中...')
}

// 下载文件
const handleDownloadFile = (file) => {
  message.info('文件下载功能开发中...')
}

// 操作处理
const handleEdit = () => {
  if (!['draft', 'pending'].includes(props.meetingData.status)) {
    message.warning('只有未发起或待召开的会议可以编辑')
    return
  }
  emit('edit', props.meetingData)
}

const handleLaunch = () => {
  if (props.meetingData.status !== 'pending') {
    message.warning('只有待召开的会议可以发起')
    return
  }
  emit('launch', props.meetingData)
}

const handleCancel = () => {
  if (!['draft', 'pending'].includes(props.meetingData.status)) {
    message.warning('只有未发起或待召开的会议可以取消')
    return
  }
  emit('cancel', props.meetingData)
}

const handleUpload = () => {
  if (!['pending', 'in_progress', 'completed'].includes(props.meetingData.status)) {
    message.warning('只有待召开、进行中或已完成的会议可以上传资料')
    return
  }
  emit('upload', props.meetingData)
}

const handleViewMinutes = () => {
  if (props.meetingData.status !== 'completed') {
    message.warning('只有已完成的会议可以查看会议纪要')
    return
  }
  emit('viewMinutes', props.meetingData)
}
</script>