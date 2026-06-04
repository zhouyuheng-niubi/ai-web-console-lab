<template>
  <div class="monitor-detail">
    <!-- 监控基本信息 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">监控基本信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">任务名称:</span>
          <span class="ml-2 font-medium">{{ monitorData.task_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">监控时间:</span>
          <span class="ml-2 font-medium">{{ formatDateTime(monitorData.monitor_time) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">监控区域:</span>
          <span class="ml-2 font-medium">{{ monitorData.region_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">监控地点:</span>
          <span class="ml-2 font-medium">{{ monitorData.location || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">被监控人员:</span>
          <span class="ml-2 font-medium">{{ monitorData.person_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">人员岗位:</span>
          <span class="ml-2 font-medium">{{ monitorData.person_position || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">所属班组:</span>
          <span class="ml-2 font-medium">{{ monitorData.team_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">监控设备:</span>
          <span class="ml-2 font-medium">{{ monitorData.monitor_device || '--' }}</span>
        </div>
      </div>
    </div>

    <!-- 违规行为详情 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">违规行为详情</h3>
      <div class="space-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">违规类型:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getViolationTypeClass()]">
              {{ getViolationTypeText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">违规行为描述:</span>
          <div class="ml-2 flex-1">
            <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
              {{ monitorData.violation_desc || '--' }}
            </div>
          </div>
        </div>
        <div v-if="monitorData.violation_analysis" class="flex items-start">
          <span class="min-w-[120px] text-gray-600">行为分析:</span>
          <div class="ml-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex-1">
            {{ monitorData.violation_analysis }}
          </div>
        </div>
        <div v-if="monitorData.risk_level" class="flex items-start">
          <span class="min-w-[120px] text-gray-600">风险等级:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getRiskLevelClass()]">
              {{ getRiskLevelText() }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- 违规证据 -->
    <div class="mb-8" v-if="monitorData.evidence_files && monitorData.evidence_files.length > 0">
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 class="text-base font-medium">违规证据</h3>
        <span class="text-gray-500">{{ monitorData.evidence_files.length }} 个文件</span>
      </div>
      
      <div class="grid grid-cols-3 gap-4">
        <div v-for="file in monitorData.evidence_files" :key="file.id" 
          class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div v-if="file.type?.startsWith('image/')" class="aspect-video overflow-hidden bg-gray-100">
            <img 
              :src="file.url" 
              :alt="file.name"
              class="w-full h-full object-cover cursor-pointer"
              @click="previewImage(file)"
            />
          </div>
          <div v-else-if="file.type?.startsWith('video/')" class="aspect-video relative bg-gray-900">
            <video 
              :src="file.url" 
              class="w-full h-full object-contain"
              controls
              preload="metadata"
            ></video>
          </div>
          <div v-else class="aspect-square flex items-center justify-center bg-blue-50">
            <div class="text-center p-4">
              <div class="mb-2">
                <svg class="w-12 h-12 text-blue-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="text-sm font-medium text-gray-700 truncate">{{ file.name }}</div>
            </div>
          </div>
          <div class="p-2 bg-white">
            <div class="flex items-center justify-between">
              <span class="text-sm truncate">{{ file.name }}</span>
              <button @click="downloadFile(file)" 
                class="text-blue-600 hover:text-blue-800 text-sm">
                下载
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 处理情况 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">处理情况</h3>
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-start">
            <span class="min-w-[120px] text-gray-600">处理结果:</span>
            <span class="ml-2">
              <span :class="['px-2 py-1 rounded text-xs font-medium', getResultClass()]">
                {{ getResultText() }}
              </span>
            </span>
          </div>
          <div class="flex items-start">
            <span class="min-w-[120px] text-gray-600">处理人员:</span>
            <span class="ml-2 font-medium">{{ monitorData.handle_person_name || '未分配' }}</span>
          </div>
          <div v-if="monitorData.handle_time" class="flex items-start">
            <span class="min-w-[120px] text-gray-600">处理时间:</span>
            <span class="ml-2 font-medium">{{ formatDateTime(monitorData.handle_time) }}</span>
          </div>
          <div v-if="monitorData.handle_deadline" class="flex items-start">
            <span class="min-w-[120px] text-gray-600">处理期限:</span>
            <span class="ml-2 font-medium">{{ formatDate(monitorData.handle_deadline) }}</span>
          </div>
        </div>
        
        <div v-if="monitorData.handle_measures" class="flex items-start">
          <span class="min-w-[120px] text-gray-600">处理措施:</span>
          <div class="ml-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex-1">
            {{ monitorData.handle_measures }}
          </div>
        </div>
        
        <div v-if="monitorData.handle_situation" class="flex items-start">
          <span class="min-w-[120px] text-gray-600">处理情况:</span>
          <div class="ml-2 p-3 bg-green-50 border border-green-200 rounded-lg flex-1">
            {{ monitorData.handle_situation }}
          </div>
        </div>
        
        <div v-if="monitorData.handle_remark" class="flex items-start">
          <span class="min-w-[120px] text-gray-600">处理备注:</span>
          <div class="ml-2 p-3 bg-gray-50 border border-gray-200 rounded-lg flex-1">
            {{ monitorData.handle_remark }}
          </div>
        </div>
      </div>
    </div>

    <!-- 整改复查记录 -->
    <div class="mb-8" v-if="monitorData.recheck_records && monitorData.recheck_records.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">整改复查记录</h3>
      <div class="space-y-4">
        <div v-for="record in monitorData.recheck_records" :key="record.id" 
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span class="text-green-600 font-medium">{{ record.checker_name?.charAt(0) }}</span>
              </div>
              <div>
                <div class="font-medium">{{ record.checker_name }}</div>
                <div class="text-sm text-gray-500">{{ formatDateTime(record.check_time) }}</div>
              </div>
            </div>
            <span :class="['px-2 py-1 rounded text-xs font-medium', getRecheckResultClass(record.result)]">
              {{ getRecheckResultText(record.result) }}
            </span>
          </div>
          
          <div class="mb-2">
            <span class="text-gray-600">复查结果:</span>
            <span class="ml-2">{{ record.result_desc }}</span>
          </div>
          
          <div v-if="record.remark" class="mb-2">
            <span class="text-gray-600">复查说明:</span>
            <span class="ml-2">{{ record.remark }}</span>
          </div>
          
          <div v-if="record.files && record.files.length > 0" class="mt-3">
            <div class="text-sm text-gray-500 mb-1">复查附件:</div>
            <div class="flex flex-wrap gap-2">
              <div v-for="file in record.files" :key="file.id" 
                class="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                @click="previewFile(file)">
                <PaperClipOutlined />
                <span>{{ file.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button v-if="monitorData.handle_result === 'unprocessed'" @click="handleAssignHandle"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
        分配处理
      </button>
      <button v-if="['unprocessed', 'processing'].includes(monitorData.handle_result)" @click="handleUpdateResult"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
        更新结果
      </button>
      <button v-if="['processing', 'rectified'].includes(monitorData.handle_result)" @click="handleCloseCase"
        class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors">
        结案
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { PaperClipOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const props = defineProps({
  monitorData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'assignHandle', 'updateResult', 'closeCase'])

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '--'
  return dayjs(date).format('YYYY-MM-DD')
}

// 获取违规类型文本
const getViolationTypeText = () => {
  const typeMap = {
    'no_helmet': '未戴安全帽',
    'no_work_clothes': '未穿工作服',
    'no_safety_shoes': '未穿安全鞋',
    'wrong_operation': '违规操作',
    'no_protection': '未使用防护用品',
    'alcohol': '酒后上岗',
    'fatigue': '疲劳作业',
    'other': '其他违规'
  }
  return typeMap[props.monitorData.violation_type] || '未知'
}

// 获取违规类型样式类
const getViolationTypeClass = () => {
  const type = props.monitorData.violation_type
  const classMap = {
    'no_helmet': 'bg-red-100 text-red-800',
    'no_work_clothes': 'bg-orange-100 text-orange-800',
    'no_safety_shoes': 'bg-yellow-100 text-yellow-800',
    'wrong_operation': 'bg-purple-100 text-purple-800',
    'no_protection': 'bg-pink-100 text-pink-800',
    'alcohol': 'bg-red-100 text-red-800',
    'fatigue': 'bg-gray-100 text-gray-800',
    'other': 'bg-gray-100 text-gray-800'
  }
  return classMap[type] || classMap.other
}

// 获取风险等级文本
const getRiskLevelText = () => {
  const levelMap = {
    'high': '高风险',
    'medium': '中风险',
    'low': '低风险'
  }
  return levelMap[props.monitorData.risk_level] || '--'
}

// 获取风险等级样式类
const getRiskLevelClass = () => {
  const level = props.monitorData.risk_level
  const classMap = {
    'high': 'bg-red-100 text-red-800',
    'medium': 'bg-orange-100 text-orange-800',
    'low': 'bg-green-100 text-green-800'
  }
  return classMap[level] || classMap.medium
}

// 获取处理结果文本
const getResultText = () => {
  const resultMap = {
    'unprocessed': '未处理',
    'processing': '处理中',
    'rectified': '已整改',
    'closed': '已结案'
  }
  return resultMap[props.monitorData.handle_result] || '未知'
}

// 获取处理结果样式类
const getResultClass = () => {
  const result = props.monitorData.handle_result
  const classMap = {
    'unprocessed': 'bg-red-100 text-red-800',
    'processing': 'bg-orange-100 text-orange-800',
    'rectified': 'bg-blue-100 text-blue-800',
    'closed': 'bg-green-100 text-green-800'
  }
  return classMap[result] || classMap.unprocessed
}

// 获取复查结果文本
const getRecheckResultText = (result) => {
  const resultMap = {
    'qualified': '合格',
    'unqualified': '不合格',
    'partial_qualified': '部分合格'
  }
  return resultMap[result] || '--'
}

// 获取复查结果样式类
const getRecheckResultClass = (result) => {
  const classMap = {
    'qualified': 'bg-green-100 text-green-800',
    'unqualified': 'bg-red-100 text-red-800',
    'partial_qualified': 'bg-yellow-100 text-yellow-800'
  }
  return classMap[result] || classMap.unqualified
}

// 预览图片
const previewImage = (file) => {
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
}

// 预览文件
const previewFile = (file) => {
  if (file.type?.startsWith('image/')) {
    previewImage(file)
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
const handleAssignHandle = () => {
  if (props.monitorData.handle_result !== 'unprocessed') {
    message.warning('只有未处理的记录可以分配')
    return
  }
  emit('assignHandle', props.monitorData)
}

const handleUpdateResult = () => {
  if (!['unprocessed', 'processing'].includes(props.monitorData.handle_result)) {
    message.warning('该记录状态无法更新处理结果')
    return
  }
  emit('updateResult', props.monitorData)
}

const handleCloseCase = () => {
  if (!['processing', 'rectified'].includes(props.monitorData.handle_result)) {
    message.warning('只有处理中或已整改的记录可以结案')
    return
  }
  emit('closeCase', props.monitorData)
}
</script>