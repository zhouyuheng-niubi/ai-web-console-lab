<template>
  <div class="question-form">
    <AdvancedForm
      ref="formRef"
      :schema="formSchema"
      :model="formData"
      :rules="rules"
      mode="form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import AdvancedForm from '@/components/advancedForm/index.vue'

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  bankOptions: {
    type: Array,
    default: () => []
  },
  chapterOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  bank_id: [{ required: true, message: '请选择题库', trigger: 'change' }],
  question_content: [{ required: true, message: '请输入试题内容', trigger: 'blur' }],
  question_type: [{ required: true, message: '请选择题型', trigger: 'change' }],
  difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }],
  knowledge_point: [{ required: true, message: '请输入知识点', trigger: 'blur' }],
  chapter: [{ required: true, message: '请选择章节', trigger: 'change' }],
  score: [{ required: true, message: '请输入分值', trigger: 'blur' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
  // 初始化选项数组（针对选择题）
  if (newVal.question_type && ['single_choice', 'multiple_choice'].includes(newVal.question_type)) {
    if (!formData.value.options || formData.value.options.length === 0) {
      formData.value.options = [
        { id: 'A', content: '' },
        { id: 'B', content: '' },
        { id: 'C', content: '' },
        { id: 'D', content: '' }
      ]
    }
  }
}, { immediate: true, deep: true })

// 动态条件计算属性
const isChoiceQuestion = computed(() => {
  return ['single_choice', 'multiple_choice'].includes(formData.value.question_type)
})

const isTrueFalseQuestion = computed(() => {
  return formData.value.question_type === 'true_false'
})

const isFillBlankQuestion = computed(() => {
  return formData.value.question_type === 'fill_blank'
})

const isSubjectiveQuestion = computed(() => {
  return ['short_answer', 'case_analysis'].includes(formData.value.question_type)
})

const showOptionsSection = computed(() => {
  return isChoiceQuestion.value || isTrueFalseQuestion.value
})

const showCorrectAnswerSection = computed(() => {
  return isChoiceQuestion.value || isTrueFalseQuestion.value || isFillBlankQuestion.value
})

const showSubjectiveAnswerSection = computed(() => {
  return isSubjectiveQuestion.value
})

// 表单Schema配置
const formSchema = computed(() => [
  {
    type: 'divider',
    content: '基本信息',
    orientation: 'left'
  },
  {
    key: 'bank_id',
    label: '所属题库',
    type: 'select',
    required: true,
    placeholder: '请选择题库',
    props: {
      options: props.bankOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'question_content',
    label: '试题内容',
    type: 'textarea',
    required: true,
    placeholder: '请输入试题内容，可以使用HTML格式',
    props: {
      rows: 4,
      maxlength: 2000,
      showCount: true
    }
  },
  {
    key: 'question_type',
    label: '题型',
    type: 'select',
    required: true,
    placeholder: '请选择题型',
    props: {
      options: [
        { label: '单选题', value: 'single_choice' },
        { label: '多选题', value: 'multiple_choice' },
        { label: '判断题', value: 'true_false' },
        { label: '填空题', value: 'fill_blank' },
        { label: '简答题', value: 'short_answer' },
        { label: '案例分析题', value: 'case_analysis' }
      ],
      onChange: handleQuestionTypeChange
    }
  },
  {
    key: 'difficulty',
    label: '难度',
    type: 'select',
    required: true,
    placeholder: '请选择难度',
    props: {
      options: [
        { label: '简单', value: 'easy' },
        { label: '中等', value: 'medium' },
        { label: '困难', value: 'hard' }
      ]
    }
  },
  {
    key: 'knowledge_point',
    label: '知识点',
    type: 'input',
    required: true,
    placeholder: '请输入知识点',
    props: {
      allowClear: true,
      maxlength: 200
    }
  },
  {
    key: 'chapter',
    label: '章节',
    type: 'select',
    required: true,
    placeholder: '请选择章节',
    props: {
      options: props.chapterOptions,
      showSearch: true,
      allowCreate: true
    }
  },
  {
    key: 'score',
    label: '分值',
    type: 'input',
    required: true,
    placeholder: '请输入分值',
    props: {
      min: 0.5,
      max: 100,
      step: 0.5,
      style: { width: '100%' }
    }
  },
  {
    key: 'manual_review',
    label: '人工批阅',
    type: 'radioGroup',
    props: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      defaultValue: false
    }
  },
  {
    type: 'divider',
    content: '选项设置',
    orientation: 'left',
    visible: showOptionsSection.value
  },
  // 判断题选项
  {
    key: 'true_false_options',
    label: '判断题选项',
    type: 'radioGroup',
    visible: isTrueFalseQuestion.value,
    props: {
      options: [
        { label: '正确', value: 'true' },
        { label: '错误', value: 'false' }
      ]
    }
  },
  // 选择题选项（动态生成）
  ...(isChoiceQuestion.value ? generateChoiceOptions() : []),
  {
    type: 'divider',
    content: '正确答案',
    orientation: 'left',
    visible: showCorrectAnswerSection.value
  },
  {
    key: 'correct_answer',
    label: '正确答案',
    type: 'select',
    mode: isChoiceQuestion.value ? 'multiple' : 'default',
    required: showCorrectAnswerSection.value,
    placeholder: '请选择正确答案',
    visible: showCorrectAnswerSection.value && !isFillBlankQuestion.value,
    props: {
      options: getCorrectAnswerOptions(),
      style: { width: '100%' }
    }
  },
  {
    key: 'fill_blank_answers',
    label: '填空答案',
    type: 'textarea',
    required: true,
    placeholder: '请输入填空答案，多个答案用分号(;)分隔',
    visible: isFillBlankQuestion.value,
    props: {
      rows: 3,
      maxlength: 500,
      showCount: true
    }
  },
  {
    type: 'divider',
    content: '参考答案',
    orientation: 'left',
    visible: showSubjectiveAnswerSection.value
  },
  {
    key: 'reference_answer',
    label: '参考答案',
    type: 'textarea',
    required: true,
    placeholder: '请输入参考答案或评分要点',
    visible: showSubjectiveAnswerSection.value,
    props: {
      rows: 6,
      maxlength: 2000,
      showCount: true
    }
  },
  {
    type: 'divider',
    content: '答案解析',
    orientation: 'left'
  },
  {
    key: 'explanation',
    label: '答案解析',
    type: 'textarea',
    placeholder: '请输入试题解析，帮助学员理解题目',
    props: {
      rows: 4,
      maxlength: 1000,
      showCount: true
    }
  },
  {
    type: 'divider',
    content: '高级设置',
    orientation: 'left'
  },
  {
    key: 'tags',
    label: '试题标签',
    type: 'select',
    mode: 'tags',
    placeholder: '请输入试题标签，按回车添加',
    props: {
      allowCreate: true,
      maxTagCount: 10
    }
  },
  {
    key: 'status',
    label: '试题状态',
    type: 'select',
    placeholder: '请选择试题状态',
    visible: props.isEdit,
    props: {
      options: [
        { label: '启用', value: 'active' },
        { label: '停用', value: 'inactive' },
        { label: '草稿', value: 'draft' }
      ]
    }
  }
])

// 生成选择题选项字段
const generateChoiceOptions = () => {
  const options = []
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  
  // 确保选项数组存在且有足够的元素
  if (!formData.value.options || formData.value.options.length === 0) {
    formData.value.options = optionLetters.slice(0, 4).map(letter => ({ 
      id: letter, 
      content: '' 
    }))
  }
  
  // 生成每个选项的输入框
  formData.value.options.forEach((option, index) => {
    if (index < 7) { // 最多支持7个选项
      options.push({
        key: `option_${option.id}`,
        label: `选项${option.id}`,
        type: 'textarea',
        required: index < 2, // 前两个选项必填
        placeholder: `请输入选项${option.id}的内容`,
        props: {
          rows: 2,
          maxlength: 500,
          showCount: true,
          allowClear: true
        },
        getter: () => formData.value.options[index]?.content || '',
        setter: (value) => {
          if (!formData.value.options) formData.value.options = []
          if (!formData.value.options[index]) {
            formData.value.options[index] = { id: optionLetters[index], content: '' }
          }
          formData.value.options[index].content = value
        }
      })
    }
  })
  
  // 添加选项管理按钮
  options.push({
    type: 'component',
    render: () => ({
      type: 'div',
      children: [
        {
          type: 'button',
          props: {
            type: 'link',
            onClick: addOption
          },
          children: '添加选项'
        },
        {
          type: 'button',
          props: {
            type: 'link',
            onClick: removeOption,
            style: { marginLeft: '10px' }
          },
          children: '删除最后一个选项'
        }
      ]
    })
  })
  
  return options
}

// 获取正确答案选项
const getCorrectAnswerOptions = () => {
  if (isTrueFalseQuestion.value) {
    return [
      { label: '正确', value: 'true' },
      { label: '错误', value: 'false' }
    ]
  }
  
  if (isChoiceQuestion.value && formData.value.options) {
    return formData.value.options
      .filter(option => option.id && option.content)
      .map(option => ({ 
        label: `${option.id}. ${option.content.substring(0, 50)}${option.content.length > 50 ? '...' : ''}`, 
        value: option.id 
      }))
  }
  
  return []
}

// 添加选项
const addOption = () => {
  if (!formData.value.options) formData.value.options = []
  
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const nextLetter = optionLetters[formData.value.options.length]
  
  if (nextLetter && formData.value.options.length < 7) {
    formData.value.options.push({ id: nextLetter, content: '' })
    // 触发重新渲染
    formData.value = { ...formData.value }
  } else {
    message.warning('最多只能添加7个选项')
  }
}

// 删除选项
const removeOption = () => {
  if (!formData.value.options || formData.value.options.length <= 2) {
    message.warning('至少需要保留2个选项')
    return
  }
  
  formData.value.options.pop()
  // 触发重新渲染
  formData.value = { ...formData.value }
}

// 处理题型变化
const handleQuestionTypeChange = (value) => {
  // 重置相关字段
  if (!['single_choice', 'multiple_choice'].includes(value)) {
    formData.value.options = undefined
  }
  if (!['single_choice', 'multiple_choice', 'true_false', 'fill_blank'].includes(value)) {
    formData.value.correct_answer = undefined
  }
  if (value !== 'fill_blank') {
    formData.value.fill_blank_answers = undefined
  }
  if (!['short_answer', 'case_analysis'].includes(value)) {
    formData.value.reference_answer = undefined
  }
  
  // 根据题型设置默认值
  switch (value) {
    case 'single_choice':
    case 'multiple_choice':
      if (!formData.value.options || formData.value.options.length === 0) {
        formData.value.options = [
          { id: 'A', content: '' },
          { id: 'B', content: '' },
          { id: 'C', content: '' },
          { id: 'D', content: '' }
        ]
      }
      break
    case 'true_false':
      formData.value.true_false_options = 'true'
      break
    case 'short_answer':
    case 'case_analysis':
      formData.value.manual_review = true
      break
  }
  
  // 触发重新渲染
  formData.value = { ...formData.value }
}

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    
    if (!valid) {
      message.error('请检查表单填写是否正确')
      return
    }

    // 验证选择题选项
    if (isChoiceQuestion.value) {
      const validOptions = formData.value.options?.filter(opt => 
        opt.content && opt.content.trim().length > 0
      )
      
      if (!validOptions || validOptions.length < 2) {
        message.error('至少需要填写两个有效的选项')
        return
      }
      
      // 更新选项数组，只保留有效的选项
      formData.value.options = validOptions
      
      // 验证正确答案
      if (!formData.value.correct_answer || 
          (Array.isArray(formData.value.correct_answer) && formData.value.correct_answer.length === 0) ||
          (!Array.isArray(formData.value.correct_answer) && !formData.value.correct_answer)) {
        message.error('请选择正确答案')
        return
      }
      
      // 验证多选题至少两个答案
      if (formData.value.question_type === 'multiple_choice' && 
          formData.value.correct_answer.length < 2) {
        message.error('多选题至少需要两个正确答案')
        return
      }
    }
    
    // 验证填空题
    if (isFillBlankQuestion.value) {
      if (!formData.value.fill_blank_answers || formData.value.fill_blank_answers.trim().length === 0) {
        message.error('请输入填空答案')
        return
      }
    }
    
    // 验证主观题
    if (isSubjectiveQuestion.value) {
      if (!formData.value.reference_answer || formData.value.reference_answer.trim().length === 0) {
        message.error('请输入参考答案')
        return
      }
    }
    
    // 验证分值
    if (formData.value.score <= 0) {
      message.error('分值必须大于0')
      return
    }

    // 构建最终数据
    const submitData = { ...formData.value }
    
    // 处理判断题答案
    if (isTrueFalseQuestion.value) {
      submitData.correct_answer = [submitData.true_false_options]
      delete submitData.true_false_options
    }
    
    // 处理填空题答案
    if (isFillBlankQuestion.value) {
      submitData.correct_answer = submitData.fill_blank_answers
        .split(';')
        .map(answer => answer.trim())
        .filter(answer => answer.length > 0)
      delete submitData.fill_blank_answers
    }
    
    // 处理主观题答案
    if (isSubjectiveQuestion.value) {
      submitData.correct_answer = submitData.reference_answer
      delete submitData.reference_answer
    }
    
    // 清理空选项
    if (submitData.options) {
      submitData.options = submitData.options.filter(opt => opt.content && opt.content.trim().length > 0)
    }
    
    // 设置默认状态
    if (!props.isEdit && !submitData.status) {
      submitData.status = 'active'
    }

    emit('save', submitData)
    
  } catch (error) {
    console.error('表单提交失败:', error)
    message.error('提交失败，请重试')
  }
}

// 暴露方法给父组件
defineExpose({
  handleSubmit,
  validate: () => formRef.value?.validate()
})
</script>

<style scoped>
.question-form {
  height: 700px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>