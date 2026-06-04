<template>
  <div class="exam-detail">
    <!-- 试卷基本信息 -->
    <div class="mb-6">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">考试基本信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">试卷ID:</span>
          <span class="ml-2 font-medium">{{ examData.paper_id || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">考试名称:</span>
          <span class="ml-2 font-medium">{{ examData.exam_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">开放类型:</span>
          <span class="ml-2 font-medium">{{ examData.candidate_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">应考人数:</span>
          <span class="ml-2 font-medium">{{ examData.exam_person || '未分配' }}</span>
        </div>
             <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">实考人数:</span>
          <span class="ml-2 font-medium">{{ examData.exam_person || '未分配' }}</span>
        </div>
        <!-- <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">阅卷状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getexamStatusClass()]">
              {{ getexamStatusText() }}
            </span>
          </span>
        </div> -->
        <!-- <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">阅卷进度:</span>
          <div class="ml-2 flex items-center gap-2">
            <div class="w-32">
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-blue-500 rounded-full" 
                  :style="{ width: `${examData.exam_progress || 0}%` }"
                ></div>
              </div>
            </div>
            <span class="font-medium">{{ examData.exam_progress || 0 }}%</span>
          </div>
        </div> -->
        <!-- <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">审阅状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getReviewStatusClass()]">
              {{ getReviewStatusText() }}
            </span>
          </span>
        </div> -->
        <!-- <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">审阅人:</span>
          <span class="ml-2 font-medium">{{ examData.reviewer || '--' }}</span>
        </div> -->
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
          <span class="ml-2 font-medium">{{ examData.total_score ? `${examData.total_score}分` : '--' }}</span>
        </div>
      </div>
    </div>

    <!-- 答题详情 -->
 

    <!-- 考试记录 -->
    <div class="mb-6">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">考试记录</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排名</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">考生</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">考试次数</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分数</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">是否通过</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">考试间</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 text-sm text-gray-900">1</td>
              <td class="px-4 py-3 text-sm text-gray-900">李明</td>
              <td class="px-4 py-3 text-sm text-gray-900">1</td>
              <td class="px-4 py-3 text-sm text-gray-900">50</td>
              <td class="px-4 py-3 text-sm text-gray-900">否</td>
              <td class="px-4 py-3 text-sm text-gray-900">2024-01-15 14:30</td>
            </tr>
            <!-- 更多记录... -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button v-if="examData.exam_status === 'graded' && examData.review_status === 'pending'" 
        @click="handleDownload"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
       下载
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
  examData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'review'])

// 获取阅卷状态文本
const getexamStatusText = () => {
  const statusMap = {
    'graded': '已阅卷',
    'pending': '待阅卷',
    'in_progress': '阅卷中'
  }
  return statusMap[props.examData.exam_status] || '--'
}

// 获取阅卷状态样式类
const getexamStatusClass = () => {
  const status = props.examData.exam_status
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
  return statusMap[props.examData.review_status] || '--'
}

// 获取审阅状态样式类
const getReviewStatusClass = () => {
  const status = props.examData.review_status
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
  return statusMap[props.examData.score_status] || '--'
}

// 获取出分状态样式类
const getScoreStatusClass = () => {
  const status = props.examData.score_status
  const classMap = {
    'scored': 'bg-green-100 text-green-800',
    'pending': 'bg-orange-100 text-orange-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// 操作处理
const handleDownload = () => {
    message.warning('下载功能开发中...')
    return

}

const handleClose = () => {
  emit('close')
}
</script>