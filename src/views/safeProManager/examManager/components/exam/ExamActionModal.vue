<template>
  <Modal 
    :title="getModalTitle()" 
    v-model:open="props.visible" 
    width="500px" 
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <div style="padding: 20px 0;">
      <div v-if="props.examData" class="mb-4">
        <p class="text-gray-600 mb-2">考试名称：<strong>{{ props.examData.exam_name }}</strong></p>
        <p class="text-gray-600 mb-2">考试时间：{{ formatDateTime(props.examData.start_time) }} - {{ formatDateTime(props.examData.end_time) }}</p>
      </div>
      
      <div v-if="getActionContent()" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="text-blue-700">{{ getActionContent() }}</div>
      </div>
      
      <div v-if="needsReasonInput()" class="mb-4">
        <label class="block mb-2 font-medium">操作原因：</label>
        <Textarea 
          v-model:value="reason" 
          :placeholder="getReasonPlaceholder()" 
          :maxlength="200" 
          :rows="3" 
          class="w-full"
        />
      </div>
      
      <div v-if="getActionConsequences().length > 0" class="mb-4">
        <label class="block mb-2 font-medium">操作后果：</label>
        <ul class="list-disc pl-5 space-y-1 text-gray-600">
          <li v-for="(consequence, index) in getActionConsequences()" :key="index">{{ consequence }}</li>
        </ul>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Modal, Textarea, message } from 'ant-design-vue'
import dayjs from 'dayjs'

const props = defineProps({
  visible: Boolean,
  examData: Object,
  actionType: String
})

const emit = defineEmits(['close', 'confirm'])

const reason = ref('')

// 获取模态框标题
const getModalTitle = () => {
  const actionMap: Record<string, string> = {
    'publish': '发布考试确认',
    'start': '开始考试确认',
    'pause': '暂停考试确认',
    'end': '结束考试确认',
    'delete': '删除考试确认'
  }
  return actionMap[props.actionType || ''] || '操作确认'
}

// 获取操作内容
const getActionContent = () => {
  const actionMap: Record<string, string> = {
    'publish': '确定要发布此考试吗？发布后考生将可以开始参加考试。',
    'start': '确定要开始此考试吗？开始后考生将可以正式答题。',
    'pause': '确定要暂停此考试吗？暂停后考生将无法继续答题。',
    'end': '确定要结束此考试吗？结束后考生将无法继续答题，系统将自动收卷。',
    'delete': '确定要删除此考试吗？删除后所有考试数据将被清除，此操作不可恢复。'
  }
  return actionMap[props.actionType || ''] || ''
}

// 是否需要原因输入
const needsReasonInput = () => {
  return ['pause', 'end', 'delete'].includes(props.actionType || '')
}

// 获取原因占位符
const getReasonPlaceholder = () => {
  const placeholderMap: Record<string, string> = {
    'pause': '请输入暂停原因（如：系统维护、异常情况等）',
    'end': '请输入结束原因（如：提前结束、异常终止等）',
    'delete': '请输入删除原因'
  }
  return placeholderMap[props.actionType || ''] || '请输入操作原因'
}

// 获取操作后果
const getActionConsequences = () => {
  const consequencesMap: Record<string, string[]> = {
    'publish': [
      '考试状态将变更为"考试中"',
      '考生将可以进入考试',
      '考试计时开始',
      '监考功能启用'
    ],
    'start': [
      '考试正式开始计时',
      '考生可以开始答题',
      '考试倒计时开始',
      '自动保存答案功能启用'
    ],
    'pause': [
      '考试将暂停计时',
      '考生无法继续答题',
      '已作答的内容会保存',
      '需要手动恢复考试'
    ],
    'end': [
      '考试将立即结束',
      '考生无法继续答题',
      '系统自动收卷',
      '进入阅卷流程'
    ],
    'delete': [
      '考试将被永久删除',
      '所有考试数据将清除',
      '考生成绩将被删除',
      '此操作不可恢复'
    ]
  }
  return consequencesMap[props.actionType || ''] || []
}

// 确认操作
const handleConfirm = () => {
  if (needsReasonInput() && !reason.value.trim()) {
    message.warning('请输入操作原因')
    return
  }
  
  emit('confirm', {
    action: props.actionType,
    data: {
      reason: reason.value,
      examId: props.examData?.id
    }
  })
  
  resetForm()
}

// 取消操作
const handleCancel = () => {
  resetForm()
  emit('close')
}

// 重置表单
const resetForm = () => {
  reason.value = ''
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}
</script>