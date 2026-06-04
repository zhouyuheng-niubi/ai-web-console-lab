<template>
  <div :class="['flex flex-col h-full w-full rounded-lg overflow-hidden', 
    isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-800']">
    <!-- Header -->
    <!-- <div :class="['flex items-center justify-between px-6 py-4 border-b', 
      isDarkTheme ? 'border-gray-700' : 'border-gray-200']" v-if="showHeader">
      <h2 :class="['text-lg font-medium', isDarkTheme ? 'text-cyan-400' : 'text-blue-600']">
        人员详情 - {{ personnelData.name || '员工信息' }}
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
    </div> -->

    <!-- Content -->
    <div class="flex-1 overflow-auto p-6">
      <!-- 基本信息 -->
      <div class="mb-8">
        <h3 :class="['text-base font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700']">
          基本信息
        </h3>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4">
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">姓名:</span>
            <span class="ml-2 font-medium">{{ personnelData.name || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">性别:</span>
            <span class="ml-2 font-medium">{{ formatGender(personnelData.gender) }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">联系电话:</span>
            <span class="ml-2 font-medium">{{ personnelData.phone || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">身份证号:</span>
            <span class="ml-2 font-medium">{{ personnelData.id_card || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">所属班组:</span>
            <span class="ml-2 font-medium">{{ personnelData.team_name || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">岗位:</span>
            <span class="ml-2 font-medium">{{ formatPosition(personnelData.position) || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">入职时间:</span>
            <span class="ml-2 font-medium">{{ formatDate(personnelData.entry_date) }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[100px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">状态:</span>
            <span class="ml-2">
              <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
                {{ getStatusText() }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- 应急联系人信息 -->
      <div class="mb-8">
        <h3 :class="['text-base font-medium mb-4 pb-2 border-b', 
          isDarkTheme ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700']">
          应急联系人信息
        </h3>
        <div class="grid grid-cols-2 gap-x-8 gap-y-4">
          <div class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">联系人姓名:</span>
            <span class="ml-2 font-medium">{{ personnelData.emergency_contact?.name || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">联系人电话:</span>
            <span class="ml-2 font-medium">{{ personnelData.emergency_contact?.phone || '--' }}</span>
          </div>
          <div class="flex items-start">
            <span :class="['min-w-[120px]', isDarkTheme ? 'text-gray-400' : 'text-gray-600']">与本人关系:</span>
            <span class="ml-2 font-medium">{{ personnelData.emergency_contact?.relationship || '--' }}</span>
          </div>
        </div>
      </div>

      <!-- 健康档案信息 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4 pb-2 border-b" 
          :class="isDarkTheme ? 'border-gray-700' : 'border-gray-200'">
          <h3 :class="['text-base font-medium', isDarkTheme ? 'text-gray-300' : 'text-gray-700']">
            健康档案
          </h3>
          <span :class="['text-sm', isDarkTheme ? 'text-gray-500' : 'text-gray-500']">
            共 {{ personnelData.health_record_count || 0 }} 份档案
          </span>
        </div>
        
        <div v-if="personnelData.health_records && personnelData.health_records.length > 0" 
          :class="['rounded-lg border p-4', 
            isDarkTheme ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50']">
          <div class="space-y-3">
            <div v-for="record in personnelData.health_records" :key="record.id" 
              :class="['flex items-center justify-between p-3 rounded', 
                isDarkTheme ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300']">
              <div class="flex items-center gap-3">
                <div :class="['p-2 rounded-full', 
                  isDarkTheme ? 'bg-blue-900' : 'bg-blue-100']">
                  <svg class="w-4 h-4" :class="isDarkTheme ? 'text-blue-300' : 'text-blue-600'" 
                       fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">{{ record.type_name || '健康档案' }}</div>
                  <div class="text-xs mt-1" :class="isDarkTheme ? 'text-gray-500' : 'text-gray-500'">
                    检查日期: {{ formatDate(record.check_date) }}
                  </div>
                </div>
              </div>
              <button @click="viewHealthRecord(record)"
                :class="['px-3 py-1 text-xs rounded transition-colors', 
                  isDarkTheme ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800']">
                查看
              </button>
            </div>
          </div>
        </div>
        <div v-else :class="['text-center py-8 rounded-lg border', 
          isDarkTheme ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500']">
          暂无健康档案记录
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
        <button v-if="personnelData.status === '1'" @click="handleResign"
          :class="['px-4 py-2 rounded transition-colors', 
            isDarkTheme ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white']">
          离职登记
        </button>
        <button v-if="personnelData.status === '1'" @click="handleResetPassword"
          :class="['px-4 py-2 rounded transition-colors', 
            isDarkTheme ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800']">
          重置密码
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  personnelData: {
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

const emit = defineEmits(['close', 'edit', 'resign', 'resetPassword', 'viewHealthRecord'])

// 格式化日期
const formatDate = (date) => {
  if (!date) return '--'
  return dayjs(date).format('YYYY-MM-DD')
}

// 格式化性别
const formatGender = (gender) => {
  const genderMap = {
    '1': '男',
    '2': '女'
  }
  return genderMap[gender] || '--'
}

// 格式化岗位
const formatPosition = (positionCode) => {
  const positionMap = {
    'manager': '经理',
    'supervisor': '主管',
    'operator': '操作员',
    'technician': '技术员',
    'inspector': '检验员',
    'safety_officer': '安全员'
  }
  return positionMap[positionCode] || positionCode || '--'
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    '1': '在职',
    '2': '离职'
  }
  return statusMap[props.personnelData.status] || '未知'
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.personnelData.status
  if (props.isDarkTheme) {
    const darkClasses = {
      '1': 'bg-green-900 text-green-300',
      '2': 'bg-red-900 text-red-300'
    }
    return darkClasses[status] || darkClasses['1']
  } else {
    const lightClasses = {
      '1': 'bg-green-100 text-green-800',
      '2': 'bg-red-100 text-red-800'
    }
    return lightClasses[status] || lightClasses['1']
  }
}

// 查看健康档案
const viewHealthRecord = (record) => {
  emit('viewHealthRecord', record)
}

// 操作处理
const handleEdit = () => {
  emit('edit', props.personnelData)
}

const handleResign = () => {
  emit('resign', props.personnelData)
}

const handleResetPassword = () => {
  emit('resetPassword', props.personnelData)
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}
</script>