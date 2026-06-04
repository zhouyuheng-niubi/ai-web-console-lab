<template>
  <div class="course-analysis h-[700px] overflow-y-auto">
    <!-- 统计分析标题 -->
    <div class="mb-6">
      <h3 class="text-xl font-medium text-gray-800">
        {{ props.courseData?.overall ? '整体课程统计分析' : props.courseData.course?.course_name + ' 统计分析' }}
      </h3>
      <p v-if="!props.courseData.overall" class="text-gray-500 mt-1">
        讲师：{{ props.courseData.course?.instructor }} • 课时：{{ props.courseData.course?.duration }}小时
      </p>
    </div>

    <!-- 整体概览 -->
    <div v-if="props.courseData.overall" class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">整体概览</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-blue-700">总课程数</span>
            <span class="text-2xl font-bold text-blue-600">{{ props.courseData.statistics.overview.total_courses }}</span>
          </div>
          <div class="text-sm text-blue-600">全部课程数量</div>
        </div>
        <div class="p-4 border border-green-200 rounded-lg bg-green-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-green-700">活跃课程</span>
            <span class="text-2xl font-bold text-green-600">{{ props.courseData.statistics.overview.active_courses }}</span>
          </div>
          <div class="text-sm text-green-600">正常状态课程</div>
        </div>
        <div class="p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-orange-700">总学习人数</span>
            <span class="text-2xl font-bold text-orange-600">{{ props.courseData.statistics.overview.total_learners }}</span>
          </div>
          <div class="text-sm text-orange-600">累计学习人数</div>
        </div>
        <div class="p-4 border border-purple-200 rounded-lg bg-purple-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-purple-700">平均完成率</span>
            <span class="text-2xl font-bold text-purple-600">{{ props.courseData.statistics.overview.average_completion_rate }}%</span>
          </div>
          <div class="text-sm text-purple-600">课程平均完成比例</div>
        </div>
      </div>
    </div>

    <!-- 单课程学习统计 -->
    <div v-else class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">学习统计</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-blue-700">总学习人数</span>
            <span class="text-2xl font-bold text-blue-600">{{ props.courseData.statistics?.learning_statistics?.total_learners }}</span>
          </div>
          <div class="text-sm text-blue-600">累计学习人数</div>
        </div>
        <div class="p-4 border border-green-200 rounded-lg bg-green-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-green-700">已完成</span>
            <span class="text-2xl font-bold text-green-600">{{ props.courseData.statistics.learning_statistics.completed }}</span>
          </div>
          <div class="text-sm text-green-600">完成学习人数</div>
        </div>
        <div class="p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-orange-700">进行中</span>
            <span class="text-2xl font-bold text-orange-600">{{ props.courseData.statistics.learning_statistics.in_progress }}</span>
          </div>
          <div class="text-sm text-orange-600">正在学习人数</div>
        </div>
        <div class="p-4 border border-purple-200 rounded-lg bg-purple-50">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-purple-700">平均分</span>
            <span class="text-2xl font-bold text-purple-600">{{ props.courseData.statistics.learning_statistics.average_score }}</span>
          </div>
          <div class="text-sm text-purple-600">学员平均成绩</div>
        </div>
      </div>
    </div>

    <!-- 课程类型分布（整体） -->
    <div v-if="props.courseData.overall" class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">课程类型分布</h3>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <div class="space-y-3">
            <div v-for="item in props.courseData.statistics.course_type_distribution" :key="item.type" 
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div class="flex items-center gap-2">
                <div :class="['w-3 h-3 rounded-full', getTypeColor(item.type)]"></div>
                <span>{{ item.type }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ item.count }}门</span>
                <span class="text-gray-500">({{ item.percentage }}%)</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">
                {{ props.courseData.statistics.course_type_distribution.find(d => d.type === '企业培训')?.percentage || 0 }}%
              </div>
              <div class="text-gray-600">企业培训占比</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 培训项目统计（整体） -->
    <div v-if="props.courseData.overall" class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">培训项目统计</h3>
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-blue-700">培训项目课程</span>
              <span class="text-2xl font-bold text-blue-600">{{ props.courseData.statistics.training_project_stats.training_courses }}</span>
            </div>
            <div class="text-sm text-blue-600">标记为培训项目的课程数</div>
          </div>
          <div class="p-4 border border-green-200 rounded-lg bg-green-50">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-green-700">培训项目学习人数</span>
              <span class="text-2xl font-bold text-green-600">{{ props.courseData.statistics.training_project_stats.training_learner_count }}</span>
            </div>
            <div class="text-sm text-green-600">培训项目累计学习人数</div>
          </div>
        </div>
        <div class="p-4 border border-purple-200 rounded-lg bg-purple-50">
          <div class="text-center flex flex-col items-center justify-center h-full">
            <div class="text-4xl font-bold text-purple-600 mb-2">
              {{ props.courseData.statistics.training_project_stats.training_completion_rate }}%
            </div>
            <div class="text-gray-600">培训项目平均完成率</div>
            <div class="mt-4 text-sm text-gray-500">
              培训项目完成率比非培训项目高约 {{ (props.courseData.statistics.training_project_stats.training_completion_rate - 80).toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习进度趋势（单课程） -->
    <div v-if="!props.courseData.overall" class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">学习进度趋势</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-4">
          <div class="space-y-3">
            <div v-for="item in props.courseData.statistics.progress_trend" :key="item.date" 
              class="flex items-center justify-between">
              <span class="text-gray-600">{{ item.date }}</span>
              <div class="flex items-center gap-3">
                <div class="w-48 bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" 
                    :style="{ width: `${(item.learners / props.courseData.statistics.learning_statistics.total_learners) * 100}%` }">
                  </div>
                </div>
                <span class="font-medium w-12 text-right">{{ item.learners }}人</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成绩分布（单课程） -->
    <div v-if="!props.courseData.overall" class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">成绩分布</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="p-4">
          <div class="space-y-3">
            <div v-for="item in props.courseData.statistics.score_distribution" :key="item.range" 
              class="flex items-center justify-between">
              <span class="text-gray-600">{{ item.range }}</span>
              <div class="flex items-center gap-3">
                <div class="w-48 bg-gray-200 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" 
                    :style="{ width: `${(item.count / props.courseData.statistics.learning_statistics?.total_learners) * 100}%` }">
                  </div>
                </div>
                <span class="font-medium w-12 text-right">{{ item.count }}人</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 部门统计（单课程） -->
    <div v-if="!props.courseData.overall" class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">学习情况</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">已学课件</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总课件</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总学习时长/分钟</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学习表现</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in props.courseData.statistics.department_statistics" :key="item.department">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ item.department }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.learners }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.learners }}</td>
              <td class="px-4 py-3 text-sm font-medium">{{ item.totalStduyMinutes }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getPerformanceClass(item.average_score)]">
                  {{ getPerformanceText(item.average_score) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 热门课程排行（整体） -->
    <div v-if="props.courseData.overall" class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">热门课程排行</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排名</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程名称</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学习人数</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">完成率</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">受欢迎度</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(course, index) in props.courseData.statistics.top_courses" :key="course.course_name">
              <td class="px-4 py-3">
                <div :class="['w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold', getRankClass(index)]">
                  {{ index + 1 }}
                </div>
              </td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ course.course_name }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ course.learners }}人</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getCompletionClass(course.completion_rate)]">
                  {{ course.completion_rate }}%
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                  <span v-for="n in 5" :key="n" 
                    :class="['w-2 h-4', n <= Math.ceil(course.learners / 50) ? 'bg-yellow-400' : 'bg-gray-200']"></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 月度趋势（整体） -->
    <div v-if="props.courseData.overall" class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">月度增长趋势</h3>
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="space-y-4">
          <div v-for="item in props.courseData.statistics.monthly_trend" :key="item.month" 
            class="flex items-center justify-between">
            <div>
              <div class="font-medium">{{ item.month }}</div>
              <div class="text-sm text-gray-500">新增{{ item.new_courses }}门课程</div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="font-medium text-blue-600">{{ item.new_learners }}人</div>
                <div class="text-sm text-gray-500">新增学员</div>
              </div>
              <div class="w-32 bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" 
                  :style="{ width: `${(item.new_learners / 500) * 100}%` }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计分析结论 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">分析结论</h3>
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="space-y-2">
          <div v-if="props.courseData.overall" class="text-blue-700">
            <p>• 企业培训课程占比70%，是企业安全生产培训的主要形式</p>
            <p>• 培训项目课程学习完成率普遍高于非培训项目课程</p>
            <p>• 消防安全、法律法规等基础课程最受欢迎</p>
            <p>• 课程数量和学习人数呈现逐月增长趋势</p>
          </div>
          <div v-else class="text-blue-700">
            <p>• 课程完成率较高，达到{{ props.courseData.course?.completion_rate || 0 }}%，说明课程设计合理</p>
            <p>• 安全部门学员平均分最高，达到91.8分</p>
            <p>• 成绩分布呈正态分布，大部分学员成绩在80-90分之间</p>
            <p>• 学员学习热情较高，课程参与度良好</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <Button @click="handleExportAnalysis" type="primary">
        导出分析报告
      </Button>
      <Button @click="handleClose">
        关闭
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, message } from 'ant-design-vue'

const props = defineProps({
  courseData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

// 获取类型颜色
const getTypeColor = (type: string) => {
  const colorMap = {
    '企业培训': 'bg-blue-500',
    '国家认证': 'bg-purple-500'
  }
  return colorMap[type] || 'bg-gray-500'
}

// 获取排名样式类
const getRankClass = (index: number) => {
  if (index === 0) return 'bg-yellow-500 text-white'
  if (index === 1) return 'bg-gray-400 text-white'
  if (index === 2) return 'bg-orange-500 text-white'
  return 'bg-gray-200 text-gray-600'
}

// 获取完成率样式类
const getCompletionClass = (rate: number) => {
  if (rate >= 90) return 'bg-green-100 text-green-800'
  if (rate >= 80) return 'bg-blue-100 text-blue-800'
  if (rate >= 70) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

// 获取学习表现文本
const getPerformanceText = (score: number) => {
  if (score >= 90) return '优秀'
  if (score >= 85) return '良好'
  if (score >= 80) return '中等'
  return '需提升'
}

// 获取学习表现样式类
const getPerformanceClass = (score: number) => {
  if (score >= 90) return 'bg-green-100 text-green-800'
  if (score >= 85) return 'bg-blue-100 text-blue-800'
  if (score >= 80) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

// 导出分析报告
const handleExportAnalysis = () => {
  message.info('导出分析报告功能开发中...')
}

// 关闭弹窗
const handleClose = () => {
  emit('close')
}
</script>