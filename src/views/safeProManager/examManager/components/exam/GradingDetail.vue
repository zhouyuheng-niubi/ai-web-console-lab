<template>
  <div class="grading-detail">
    <!-- 试卷基本信息 -->
    <div class="mb-6">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">试卷基本信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">试卷ID:</span>
          <span class="ml-2 font-medium">{{ gradingData.paper_id || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">考试名称:</span>
          <span class="ml-2 font-medium">{{ gradingData.exam_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">考生姓名:</span>
          <span class="ml-2 font-medium">{{ gradingData.candidate_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">阅卷人:</span>
          <span class="ml-2 font-medium">{{ gradingData.grading_person || '未分配' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">阅卷状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getGradingStatusClass()]">
              {{ getGradingStatusText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">阅卷进度:</span>
          <div class="ml-2 flex items-center gap-2">
            <div class="w-32">
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-blue-500 rounded-full" 
                  :style="{ width: `${gradingData.grading_progress || 0}%` }"
                ></div>
              </div>
            </div>
            <span class="font-medium">{{ gradingData.grading_progress || 0 }}%</span>
          </div>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">审阅状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getReviewStatusClass()]">
              {{ getReviewStatusText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">审阅人:</span>
          <span class="ml-2 font-medium">{{ gradingData.reviewer || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">出分状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getScoreStatusClass()]">
              {{ getScoreStatusText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">总分:</span>
          <span class="ml-2 font-medium">{{ gradingData.total_score ? `${gradingData.total_score}分` : '--' }}</span>
        </div>
      </div>
    </div>

    <!-- 答题详情 -->
    <div class="mb-6">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">答题详情</h3>
      <div class="space-y-4">
        <!-- 这里可以添加具体的题目和答案展示 -->
        <div class="p-4 border border-gray-200 rounded-lg">
          <div class="text-gray-500 text-center my-4">
            试卷内容加载中...
           
          </div>
        </div>
      </div>
    </div>

    <!-- 阅卷记录 -->
    <div class="mb-6" v-if="gradingData.grading_status === 'graded'">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">阅卷记录</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">题目</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">考生答案</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标准答案</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">得分</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">阅卷人</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">阅卷时间</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 text-sm text-gray-900">单选题1</td>
              <td class="px-4 py-3 text-sm text-gray-900">A</td>
              <td class="px-4 py-3 text-sm text-gray-900">A</td>
              <td class="px-4 py-3 text-sm text-gray-900">5分</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ gradingData.grading_person }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">2024-01-15 14:30</td>
            </tr>
            <!-- 更多记录... -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button v-if="gradingData.grading_status === 'graded' && gradingData.review_status === 'pending'" 
        @click="handleReview"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
        审阅&改分
      </button>
      <button @click="handleClose"
        class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors">
        关闭
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

const props = defineProps({
  gradingData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'review'])

// 获取阅卷状态文本
const getGradingStatusText = () => {
  const statusMap = {
    'graded': '已阅卷',
    'pending': '待阅卷',
    'in_progress': '阅卷中'
  }
  return statusMap[props.gradingData.grading_status] || '--'
}

// 获取阅卷状态样式类
const getGradingStatusClass = () => {
  const status = props.gradingData.grading_status
  const classMap = {
    'graded': 'bg-green-100 text-green-800',
    'pending': 'bg-orange-100 text-orange-800',
    'in_progress': 'bg-blue-100 text-blue-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// 获取审阅状态文本
const getReviewStatusText = () => {
  const statusMap = {
    'reviewed': '已审阅',
    'pending': '待审阅',
    'rejected': '驳回'
  }
  return statusMap[props.gradingData.review_status] || '--'
}

// 获取审阅状态样式类
const getReviewStatusClass = () => {
  const status = props.gradingData.review_status
  const classMap = {
    'reviewed': 'bg-green-100 text-green-800',
    'pending': 'bg-orange-100 text-orange-800',
    'rejected': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// 获取出分状态文本
const getScoreStatusText = () => {
  const statusMap = {
    'scored': '已出分',
    'pending': '待出分'
  }
  return statusMap[props.gradingData.score_status] || '--'
}

// 获取出分状态样式类
const getScoreStatusClass = () => {
  const status = props.gradingData.score_status
  const classMap = {
    'scored': 'bg-green-100 text-green-800',
    'pending': 'bg-orange-100 text-orange-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// 操作处理
const handleReview = () => {
  if (props.gradingData.grading_status !== 'graded') {
    message.warning('只有已阅卷的试卷可以进行审阅')
    return
  }
  if (props.gradingData.review_status === 'reviewed') {
    message.warning('该试卷已完成审阅')
    return
  }
  emit('review', props.gradingData)
}

const handleClose = () => {
  emit('close')
}
</script>