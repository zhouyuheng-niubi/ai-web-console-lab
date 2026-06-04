<!-- components/question/QuestionBankForm.vue -->
<template>
  <div class="question-bank-form">
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
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  bank_name: [{ required: true, message: '请输入题库名称', trigger: 'blur' }],
  access_type: [{ required: true, message: '请选择开放类型', trigger: 'change' }],
  bank_category: [{ required: true, message: '请选择题库分类', trigger: 'change' }],
  root_knowledge: [{ required: true, message: '请输入根知识点', trigger: 'blur' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 表单Schema配置
const formSchema = computed(() => [
  {
    type: 'divider',
    content: '基本信息',
    orientation: 'left'
  },
  {
    key: 'bank_name',
    label: '题库名称',
    type: 'input',
    required: true,
    placeholder: '请输入题库名称',
    props: {
      allowClear: true,
      maxlength: 200
    }
  },
  {
    key: 'access_type',
    label: '开放类型',
    type: 'select',
    required: true,
    placeholder: '请选择开放类型',
    props: {
      options: [
        { label: '完全开放', value: 'full_open' },
        { label: '部分学员', value: 'partial_student' }
      ]
    }
  },
  {
    key: 'bank_category',
    label: '题库分类',
    type: 'select',
    required: true,
    placeholder: '请选择题库分类',
    props: {
      options: [
        { label: '职位晋升考试', value: 'promotion_exam' },
        { label: '安全知识学习', value: 'safety_knowledge' },
        { label: '法规政策考试', value: 'regulation_exam' },
        { label: '资格认证考试', value: 'certification_exam' },
        { label: '应急演练考核', value: 'emergency_drill' },
        { label: '技能评估测试', value: 'skill_assessment' }
      ]
    }
  },
  {
    key: 'root_knowledge',
    label: '根知识点',
    type: 'input',
    required: true,
    placeholder: '请输入根知识点（如：安全生产法律法规体系）',
    props: {
      allowClear: true,
      maxlength: 100
    }
  },
  {
    key: 'description',
    label: '题库描述',
    type: 'textarea',
    placeholder: '请输入题库描述',
    props: {
      rows: 4,
      maxlength: 500,
      showCount: true
    }
  },
  {
    type: 'divider',
    content: '题库设置',
    orientation: 'left'
  },
  {
    key: 'for_exam',
    label: '用于考试',
    type: 'radioGroup',
    props: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  },
  {
    key: 'for_training',
    label: '用于训练',
    type: 'radioGroup',
    props: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  },
  {
    key: 'default_difficulty',
    label: '默认难度',
    type: 'select',
    placeholder: '请选择默认难度',
    props: {
      options: [
        { label: '简单', value: 'easy' },
        { label: '中等', value: 'medium' },
        { label: '困难', value: 'hard' }
      ]
    }
  },
  {
    type: 'divider',
    content: '统计信息',
    orientation: 'left'
  },
  {
    key: 'total_questions',
    label: '总题数',
    type: 'input',
    visible: props.isEdit,
    props: {
      min: 0,
      style: { width: '100%' },
      disabled: true
    }
  },
  {
    key: 'objective_questions',
    label: '客观题数',
    type: 'input',
    visible: props.isEdit,
    props: {
      min: 0,
      style: { width: '100%' },
      disabled: true
    }
  },
  {
    key: 'subjective_questions',
    label: '主观题数',
    type: 'input',
    visible: props.isEdit,
    props: {
      min: 0,
      style: { width: '100%' },
      disabled: true
    }
  },
  {
    type: 'divider',
    content: '状态设置',
    orientation: 'left'
  },
  {
    key: 'status',
    label: '题库状态',
    type: 'select',
    placeholder: '请选择题库状态',
    visible: props.isEdit,
    props: {
      options: [
        { label: '启用', value: 'active' },
        { label: '停用', value: 'inactive' },
        { label: '草稿', value: 'draft' }
      ]
    }
  },
  {
    key: 'tags',
    label: '题库标签',
    type: 'select',
    mode: 'tags',
    placeholder: '请输入题库标签，按回车添加',
    props: {
      allowCreate: true,
      maxTagCount: 10
    }
  }
])

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    
    if (!valid) {
      message.error('请检查表单填写是否正确')
      return
    }

    const submitData = { ...formData.value }

    // 如果是新建，设置默认值
    if (!props.isEdit) {
      submitData.total_questions = 0
      submitData.objective_questions = 0
      submitData.subjective_questions = 0
      submitData.status = 'draft'
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
.question-bank-form {
  height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>