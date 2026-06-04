<!-- components/question/QuestionPreview.vue -->
<template>
  <div class="question-preview">
    <!-- 试题基本信息 -->
    <div class="mb-6">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">试题信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[100px] text-gray-600">试题ID:</span>
          <span class="ml-2 font-medium">{{ questionData.id || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[100px] text-gray-600">题型:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getQuestionTypeClass()]">
              {{ getQuestionTypeText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[100px] text-gray-600">难度:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getDifficultyClass()]">
              {{ getDifficultyText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[100px] text-gray-600">分值:</span>
          <span class="ml-2 font-medium">{{ questionData.score || 0 }}分</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[100px] text-gray-600">知识点:</span>
          <span class="ml-2 font-medium">{{ questionData.knowledge_point || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[100px] text-gray-600">章节:</span>
          <span class="ml-2 font-medium">{{ questionData.chapter || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[100px] text-gray-600">人工批阅:</span>
          <span class="ml-2 font-medium">{{ questionData.manual_review ? '是' : '否' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[100px] text-gray-600">创建时间:</span>
          <span class="ml-2 font-medium">{{ formatDateTime(questionData.created_time) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[100px] text-gray-600">试题状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
              {{ getStatusText() }}
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- 试题内容 -->
    <div class="mb-6">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">试题内容</h3>
      <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div class="whitespace-pre-wrap" v-html="questionData.question_content"></div>
      </div>
    </div>

    <!-- 选项（选择题） -->
    <div v-if="questionData.options && questionData.options.length > 0" class="mb-6">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">选项</h3>
      <div class="space-y-3">
        <div v-for="option in questionData.options" :key="option.id" 
          :class="['p-3 border rounded-lg', isCorrectAnswer(option.id) ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white']">
          <div class="flex items-start gap-3">
            <div :class="['w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold', 
              isCorrectAnswer(option.id) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700']">
              {{ option.id }}
            </div>
            <div class="flex-1" v-html="option.content"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 正确答案 -->
    <div v-if="questionData.correct_answer && questionData.correct_answer.length > 0" class="mb-6">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">正确答案</h3>
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="font-medium text-blue-700">
          {{ formatCorrectAnswer() }}
        </div>
      </div>
    </div>

    <!-- 答案解析 -->
    <div v-if="questionData.explanation" class="mb-6">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">答案解析</h3>
      <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="whitespace-pre-wrap">{{ questionData.explanation }}</div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button @click="handleClose"
        class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors">
        关闭
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps({
  questionData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

// 获取题型文本
const getQuestionTypeText = () => {
  const typeMap = {
    'single_choice': '单选题',
    'multiple_choice': '多选题',
    'true_false': '判断题',
    'fill_blank': '填空题',
    'short_answer': '简答题',
    'case_analysis': '案例分析题'
  }
  return typeMap[props.questionData.question_type] || props.questionData.question_type
}

// 获取题型样式类
const getQuestionTypeClass = () => {
  const type = props.questionData.question_type
  const classMap = {
    'single_choice': 'bg-blue-100 text-blue-800',
    'multiple_choice': 'bg-purple-100 text-purple-800',
    'true_false': 'bg-orange-100 text-orange-800',
    'fill_blank': 'bg-cyan-100 text-cyan-800',
    'short_answer': 'bg-green-100 text-green-800',
    'case_analysis': 'bg-red-100 text-red-800'
  }
  return classMap[type] || 'bg-gray-100 text-gray-800'
}

// 获取难度文本
const getDifficultyText = () => {
  const difficultyMap = {
    'easy': '简单',
    'medium': '中等',
    'hard': '困难'
  }
  return difficultyMap[props.questionData.difficulty] || props.questionData.difficulty
}

// 获取难度样式类
const getDifficultyClass = () => {
  const difficulty = props.questionData.difficulty
  const classMap = {
    'easy': 'bg-green-100 text-green-800',
    'medium': 'bg-orange-100 text-orange-800',
    'hard': 'bg-red-100 text-red-800'
  }
  return classMap[difficulty] || 'bg-gray-100 text-gray-800'
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    'active': '启用',
    'inactive': '停用'
  }
  return statusMap[props.questionData.status] || props.questionData.status
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.questionData.status
  const classMap = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// 检查是否是正确答案
const isCorrectAnswer = (optionId: string) => {
  return props.questionData.correct_answer && props.questionData.correct_answer.includes(optionId)
}

// 格式化正确答案
const formatCorrectAnswer = () => {
  if (!props.questionData.correct_answer) return '--'
  
  if (props.questionData.question_type === 'true_false') {
    return props.questionData.correct_answer[0] === 'true' ? '正确' : '错误'
  }
  
  return props.questionData.correct_answer.join('、')
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 关闭弹窗
const handleClose = () => {
  emit('close')
}
</script>