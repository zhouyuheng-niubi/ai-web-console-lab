<template>
  <div class="review-form h-[700px]">
    <!-- 试卷基本信息 -->
    <div class="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-gray-600">试卷ID：</span>
          <span class="font-medium">{{ gradingData.paper_id }}</span>
        </div>
        <div>
          <span class="text-gray-600">考生姓名：</span>
          <span class="font-medium">{{ gradingData.candidate_name }}</span>
        </div>
        <div>
          <span class="text-gray-600">阅卷人：</span>
          <span class="font-medium">{{ gradingData.grading_person }}</span>
        </div>
        <div>
          <span class="text-gray-600">当前总分：</span>
          <span class="font-medium">{{ gradingData.total_score }}分</span>
        </div>
      </div>
    </div>

    <!-- 题目审阅列表 -->
    <div class="mb-6">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">题目审阅</h3>
      <div class="space-y-4 max-h-[250px] overflow-y-auto pr-2">
        <div v-for="question in questions" :key="question.id" 
          class="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="font-medium mb-1">{{ question.title }}</div>
              <div class="text-sm text-gray-500">题型：{{ question.type }} | 分值：{{ question.full_score }}分</div>
            </div>
            <div>
              <span class="font-medium text-blue-600">{{ question.current_score }}分</span>
            </div>
          </div>
          
          <div class="space-y-2 mb-3">
            <div>
              <span class="text-gray-600 text-sm">考生答案：</span>
              <div class="mt-1 p-2 bg-gray-50 rounded">{{ question.candidate_answer }}</div>
            </div>
            <div>
              <span class="text-gray-600 text-sm">标准答案：</span>
              <div class="mt-1 p-2 bg-blue-50 rounded">{{ question.standard_answer }}</div>
            </div>
            <div>
              <span class="text-gray-600 text-sm">阅卷评语：</span>
              <div class="mt-1 p-2 bg-green-50 rounded">{{ question.grading_comment || '无评语' }}</div>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div>
              <label class="text-sm text-gray-600">调整分数：</label>
              <InputNumber 
                v-model:value="question.adjusted_score"
                :min="0"
                :max="question.full_score"
                size="small"
                style="width: 100px"
              />
            </div>
            <div class="flex-1">
              <label class="text-sm text-gray-600">审阅评语：</label>
              <Input 
                v-model:value="question.review_comment"
                placeholder="请输入审阅评语"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 审阅总结 -->
    <div class="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
      <div class="flex items-center justify-between mb-3">
        <span class="font-medium text-blue-700">分数调整汇总</span>
        <div>
          <span class="text-gray-600 mr-2">原始总分：{{ originalTotalScore }}分</span>
          <span class="text-gray-600 mr-2">调整后总分：{{ adjustedTotalScore }}分</span>
          <span class="font-medium text-blue-600">调整差值：{{ scoreDifference }}分</span>
        </div>
      </div>
      <div>
        <label class="block mb-2 text-gray-600">整体审阅意见：</label>
        <Textarea 
          v-model:value="overallComment"
          placeholder="请输入整体审阅意见"
          :rows="3"
          class="w-full"
        />
      </div>
    </div>

    <!-- 审阅操作 -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <div class="flex items-center gap-3">
        <RadioGroup v-model:value="reviewResult" button-style="solid">
          <RadioButton value="approve">通过审阅</RadioButton>
          <RadioButton value="reject">驳回重阅</RadioButton>
          <RadioButton value="return">退回修改</RadioButton>
        </RadioGroup>
      </div>
      <div class="flex items-center gap-3">
        <Button @click="handleSaveDraft">保存草稿</Button>
        <Button type="primary" @click="handleSubmitReview">提交审阅</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Input, InputNumber, Textarea, RadioGroup, RadioButton, Button, message } from 'ant-design-vue'

const props = defineProps({
  gradingData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save'])

const questions = ref([
  {
    id: 1,
    title: '1. 《安全生产法》规定，生产经营单位的主要负责人对本单位的安全生产工作负有什么责任？',
    type: '单选题',
    full_score: 5,
    current_score: 5,
    adjusted_score: 5,
    candidate_answer: '全面责任',
    standard_answer: '全面负责',
    grading_comment: '答案基本正确，但表述不够准确',
    review_comment: ''
  },
  {
    id: 2,
    title: '2. 危险化学品的储存应符合哪些安全要求？',
    type: '简答题',
    full_score: 15,
    current_score: 12,
    adjusted_score: 12,
    candidate_answer: '应储存在专用仓库，远离火源，配备消防器材',
    standard_answer: '1. 专用仓库储存；2. 远离火源、热源；3. 配备消防设施；4. 定期检查；5. 标识清晰',
    grading_comment: '答案不够完整，缺少部分要点',
    review_comment: ''
  },
  {
    id: 3,
    title: '3. 高处作业的安全防护措施包括哪些？',
    type: '多选题',
    full_score: 10,
    current_score: 8,
    adjusted_score: 8,
    candidate_answer: '安全帽、安全带',
    standard_answer: '安全帽、安全带、安全网、防护栏杆',
    grading_comment: '漏选了安全网和防护栏杆',
    review_comment: ''
  }
])

const overallComment = ref('')
const reviewResult = ref('approve')

// 计算原始总分
const originalTotalScore = computed(() => {
  return questions.value.reduce((sum, q) => sum + q.current_score, 0)
})

// 计算调整后总分
const adjustedTotalScore = computed(() => {
  return questions.value.reduce((sum, q) => sum + (q.adjusted_score || q.current_score), 0)
})

// 计算分数差值
const scoreDifference = computed(() => {
  return adjustedTotalScore.value - originalTotalScore.value
})

// 保存草稿
const handleSaveDraft = () => {
  message.success('草稿保存成功')
}

// 提交审阅
const handleSubmitReview = () => {
  if (!reviewResult.value) {
    message.warning('请选择审阅结果')
    return
  }

  const reviewData = {
    paper_id: props.gradingData.paper_id,
    grading_id: props.gradingData.id,
    questions: questions.value.map(q => ({
      question_id: q.id,
      adjusted_score: q.adjusted_score,
      review_comment: q.review_comment
    })),
    overall_comment: overallComment.value,
    review_result: reviewResult.value,
    final_score: adjustedTotalScore.value
  }

  emit('save', reviewData)
}
</script>