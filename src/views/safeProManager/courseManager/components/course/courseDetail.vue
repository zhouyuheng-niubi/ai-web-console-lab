<template>
  <div class="course-detail h-[700px] overflow-auto">
    <!-- 课程基本信息 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">课程基本信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">课程名称:</span>
          <span class="ml-2 font-medium text-lg">{{ courseData.course_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">培训项目:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', courseData.is_training ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600']">
              {{ courseData.is_training ? '是' : '否' }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">课程分类:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getCategoryClass()]">
              {{ getCategoryText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">开放类型:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getDevTypeClass()]">
              {{ getDevTypeText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">课时:</span>
          <span class="ml-2 font-medium">{{ courseData.duration }}小时</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">创建时间:</span>
          <span class="ml-2 font-medium">{{ formatDateTime(courseData.created_time) }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">课程状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
              {{ getStatusText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">学习人数:</span>
          <span class="ml-2 font-medium">{{ courseData.learner_count || 0 }}人</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">完成率:</span>
          <div class="ml-2 flex items-center gap-2">
            <div class="w-32">
              <Progress 
                :percent="courseData.completion_rate || 0" 
                size="small" 
                :stroke-color="getProgressColor()"
              />
            </div>
            <span class="font-medium">{{ courseData.completion_rate || 0 }}%</span>
          </div>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">讲师:</span>
          <span class="ml-2 font-medium">{{ courseData.instructor || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">难度等级:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getDifficultyClass()]">
              {{ getDifficultyText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">评估方式:</span>
          <span class="ml-2 font-medium">{{ courseData.evaluation_method || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">合格分数:</span>
          <span class="ml-2 font-medium">{{ courseData.pass_score || 0 }}分</span>
        </div>
      </div>
    </div>

    <!-- 课程描述 -->
    <div class="mb-8" v-if="courseData.description">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">课程描述</h3>
      <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="whitespace-pre-wrap">{{ courseData.description }}</div>
      </div>
    </div>

    <!-- 课程内容 -->
    <div class="mb-8" v-if="courseData.course_content">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">课程内容</h3>
      <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="whitespace-pre-wrap">{{ courseData.course_content }}</div>
      </div>
    </div>

    <!-- 目标受众 -->
    <div class="mb-8" v-if="courseData.target_audience">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">目标受众</h3>
      <div class="p-3 bg-green-50 rounded-lg border border-green-200">
        <div class="font-medium text-green-700">{{ courseData.target_audience }}</div>
      </div>
    </div>

    <!-- 前提条件 -->
    <div class="mb-8" v-if="courseData.prerequisites">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">前提条件</h3>
      <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div class="text-yellow-700">{{ courseData.prerequisites }}</div>
      </div>
    </div>

    <!-- 标签 -->
    <div class="mb-8" v-if="courseData.tags && courseData.tags.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">课程标签</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in courseData.tags" :key="tag" 
          class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 学习统计概览 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">学习统计概览</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-blue-700">总学习人数</span>
            <span class="text-2xl font-bold text-blue-600">{{ courseData.learner_count || 0 }}</span>
          </div>
          <div class="text-sm text-blue-600">累计学习人数</div>
        </div>
        <div class="p-4 border border-green-200 rounded-lg bg-green-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-green-700">完成率</span>
            <span class="text-2xl font-bold text-green-600">{{ courseData.completion_rate || 0 }}%</span>
          </div>
          <div class="text-sm text-green-600">课程完成比例</div>
        </div>
        <div class="p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-orange-700">平均分</span>
            <span class="text-2xl font-bold text-orange-600">85.6</span>
          </div>
          <div class="text-sm text-orange-600">学员平均成绩</div>
        </div>
        <div class="p-4 border border-purple-200 rounded-lg bg-purple-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-purple-700">平均学习时间</span>
            <span class="text-2xl font-bold text-purple-600">6.8h</span>
          </div>
          <div class="text-sm text-purple-600">人均学习时长</div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button @click="handleEdit"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
        编辑
      </button>
      <button @click="handleClose"
        class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors">
        关闭
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Progress } from 'ant-design-vue'
import dayjs from 'dayjs'

const props = defineProps({
  courseData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'edit'])

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 获取分类文本
const getCategoryText = () => {
  const categoryMap = {
    'enterprise': '企业培训',
    'national_certification': '国家职业资格认证'
  }
  return categoryMap[props.courseData.category] || props.courseData.category
}

// 获取分类样式类
const getCategoryClass = () => {
  const category = props.courseData.category
  const classMap = {
    'enterprise': 'bg-blue-100 text-blue-800',
    'national_certification': 'bg-purple-100 text-purple-800'
  }
  return classMap[category] || 'bg-gray-100 text-gray-800'
}

// 获取开放类型文本
const getDevTypeText = () => {
  const typeMap = {
    'partial': '部分学员',
    'public': '完全公开',
    'internal': '内部使用',
    'external': '对外培训'
  }
  return typeMap[props.courseData.development_type] || props.courseData.development_type
}

// 获取开放类型样式类
const getDevTypeClass = () => {
  const type = props.courseData.development_type
  const classMap = {
    'partial': 'bg-green-100 text-green-800',
    'public': 'bg-blue-100 text-blue-800',
    'internal': 'bg-orange-100 text-orange-800',
    'external': 'bg-purple-100 text-purple-800'
  }
  return classMap[type] || 'bg-gray-100 text-gray-800'
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    'active': '正常',
    'inactive': '停用',
    'draft': '草稿'
  }
  return statusMap[props.courseData.status] || '未知'
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.courseData.status
  const classMap = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-orange-100 text-orange-800',
    'draft': 'bg-gray-100 text-gray-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// 获取难度等级文本
const getDifficultyText = () => {
  const difficultyMap = {
    'primary': '初级',
    'intermediate': '中级',
    'advanced': '高级'
  }
  return difficultyMap[props.courseData.difficulty_level] || props.courseData.difficulty_level
}

// 获取难度等级样式类
const getDifficultyClass = () => {
  const difficulty = props.courseData.difficulty_level
  const classMap = {
    'primary': 'bg-green-100 text-green-800',
    'intermediate': 'bg-orange-100 text-orange-800',
    'advanced': 'bg-red-100 text-red-800'
  }
  return classMap[difficulty] || 'bg-gray-100 text-gray-800'
}

// 获取进度条颜色
const getProgressColor = () => {
  const progress = props.courseData.completion_rate || 0
  if (progress >= 90) return '#52c41a'
  if (progress >= 70) return '#1890ff'
  if (progress >= 50) return '#faad14'
  return '#ff4d4f'
}

// 操作处理
const handleEdit = () => {
  if (props.courseData.status === 'inactive') {
    message.warning('已停用的课程不能编辑')
    return
  }
  emit('edit', props.courseData)
}

const handleClose = () => {
  emit('close')
}
</script>