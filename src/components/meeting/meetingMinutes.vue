<!-- components/meeting/meetingMinutes.vue -->
<template>
  <div class="meeting-minutes">
    <!-- 会议纪要基本信息 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">会议纪要</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-x-8 gap-y-3">
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
            <span class="min-w-[120px] text-gray-600">主持人:</span>
            <span class="ml-2 font-medium">{{ meetingData.host_name || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span class="min-w-[120px] text-gray-600">纪要生成时间:</span>
            <span class="ml-2 font-medium">{{ formatDateTime(meetingData.minutes_time) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 参会人员清单 -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 class="text-base font-medium">参会人员清单</h3>
        <span class="text-sm text-gray-500">{{ meetingData.attendees?.length || 0 }}人</span>
      </div>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">岗位</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">签到状态</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">签到时间</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="person in meetingData.attendees" :key="person.id">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ person.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ person.position }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', person.attended ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600']">
                  {{ person.attended ? '已签到' : '未签到' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ person.attended ? formatDateTime(person.sign_time) : '--' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 风险点明细 -->
    <div class="mb-8" v-if="meetingData.risk_details && meetingData.risk_details.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">风险点明细</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">风险点</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">风险等级</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">责任人</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">处理措施</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">完成时限</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="risk in meetingData.risk_details" :key="risk.id">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ risk.description }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getRiskClass(risk.level)]">
                  {{ getRiskText(risk.level) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ risk.responsible_person }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ risk.measure }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDateTime(risk.deadline) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 设备合规检查结果 -->
    <div class="mb-8" v-if="meetingData.equipment_checks && meetingData.equipment_checks.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">设备合规检查结果</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">设备名称</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型号</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">检查结果</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">检查人</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">备注</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="equipment in meetingData.equipment_checks" :key="equipment.id">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ equipment.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ equipment.model }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getCheckResultClass(equipment.result)]">
                  {{ getCheckResultText(equipment.result) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ equipment.checker }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ equipment.remark || '--' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 安全承诺书签署 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">安全承诺书签署</h3>
      <div class="grid grid-cols-2 gap-6">
        <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-blue-700">已签署</span>
            <span class="text-2xl font-bold text-blue-600">{{ meetingData.signed_count || 0 }}</span>
          </div>
          <div class="text-sm text-blue-600">已签署安全承诺书</div>
        </div>
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-gray-700">未签署</span>
            <span class="text-2xl font-bold text-gray-600">{{ meetingData.unsigned_count || 0 }}</span>
          </div>
          <div class="text-sm text-gray-600">未签署安全承诺书</div>
        </div>
      </div>
    </div>

    <!-- 异议反馈及处理 -->
    <div class="mb-8" v-if="meetingData.objections && meetingData.objections.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">异议反馈及处理</h3>
      <div class="space-y-4">
        <div v-for="objection in meetingData.objections" :key="objection.id" 
          class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span class="text-blue-600 font-medium">{{ objection.person_name?.charAt(0) }}</span>
              </div>
              <div>
                <div class="font-medium">{{ objection.person_name }}</div>
                <div class="text-sm text-gray-500">{{ objection.position }}</div>
              </div>
            </div>
            <span class="text-sm text-gray-500">{{ formatDateTime(objection.created_time) }}</span>
          </div>
          <div class="mb-3">
            <div class="text-gray-600">{{ objection.content }}</div>
          </div>
          <div v-if="objection.response" class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-start gap-2 mb-1">
              <span class="font-medium text-green-700">处理回复:</span>
              <span class="text-green-600">{{ objection.response }}</span>
            </div>
            <div class="text-sm text-green-500">回复人: {{ objection.responder }} • {{ formatDateTime(objection.response_time) }}</div>
          </div>
          <div v-else class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="text-yellow-600">待处理</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 附件 -->
    <div class="mb-8" v-if="meetingData.attachments && meetingData.attachments.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">附件</h3>
      <div class="space-y-2">
        <div v-for="file in meetingData.attachments" :key="file.id" 
          class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div class="flex items-center gap-3">
            <FileTextOutlined class="text-blue-600 text-lg" />
            <div>
              <div class="font-medium">{{ file.name }}</div>
              <div class="text-sm text-gray-500">
                {{ formatFileSize(file.size) }} • {{ formatDateTime(file.upload_time) }}
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
      <Button @click="handleClose">关闭</Button>
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

const emit = defineEmits(['close'])

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

// 获取风险等级文本
const getRiskText = (level) => {
  const riskMap = {
    'low': '低风险',
    'medium': '中风险',
    'high': '高风险'
  }
  return riskMap[level] || '--'
}

// 获取风险等级样式类
const getRiskClass = (level) => {
  const classMap = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-orange-100 text-orange-800',
    'high': 'bg-red-100 text-red-800'
  }
  return classMap[level] || classMap.low
}

// 获取检查结果文本
const getCheckResultText = (result) => {
  const resultMap = {
    'passed': '合格',
    'failed': '不合格',
    'pending': '待检查'
  }
  return resultMap[result] || '--'
}

// 获取检查结果样式类
const getCheckResultClass = (result) => {
  const classMap = {
    'passed': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800',
    'pending': 'bg-gray-100 text-gray-800'
  }
  return classMap[result] || classMap.pending
}

// 预览文件
const handlePreviewFile = (file) => {
  message.info('文件预览功能开发中...')
}

// 下载文件
const handleDownloadFile = (file) => {
  message.info('文件下载功能开发中...')
}

// 关闭弹窗
const handleClose = () => {
  emit('close')
}
</script>