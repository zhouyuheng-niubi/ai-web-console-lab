<!-- components/question/ImportQuestionForm.vue -->
<template>
  <div class="import-question-form">
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
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import AdvancedForm from '@/components/advancedForm/index.vue'

const emit = defineEmits(['import'])

const formRef = ref()
const formData = ref({
  import_type: 'file',
  target_bank_id: '',
  import_file: null,
  question_format: 'standard',
  duplicate_handling: 'skip'
})

// 表单验证规则
const rules = {
  target_bank_id: [{ required: true, message: '请选择题库', trigger: 'change' }],
  import_file: [{ required: true, message: '请选择导入文件', trigger: 'change' }]
}

// 表单Schema配置
const formSchema = computed(() => [
  {
    key: 'import_type',
    label: '导入方式',
    type: 'radio-group',
    props: {
      options: [
        { label: '文件导入', value: 'file' },
        { label: '文本导入', value: 'text' }
      ]
    }
  },
  {
    key: 'target_bank_id',
    label: '目标题库',
    type: 'select',
    required: true,
    placeholder: '请选择目标题库',
    props: {
      options: [
        { label: '安全生产法律法规题库', value: '1' },
        { label: '危险化学品安全管理题库', value: '2' },
        { label: '消防安全知识题库', value: '3' },
        { label: '高处作业安全技术题库', value: '4' },
        { label: '电气安全技术题库', value: '5' }
      ]
    }
  },
  {
    key: 'import_file',
    label: '导入文件',
    type: 'upload',
    required: true,
    visible: formData.value.import_type === 'file',
    props: {
      accept: '.xlsx,.xls,.doc,.docx,.txt',
      maxCount: 1,
      beforeUpload: (file) => {
        const maxSize = 10 * 1024 * 1024 // 10MB
        
        if (file.size > maxSize) {
          message.error('文件大小不能超过10MB')
          return false
        }
        
        const allowedTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ]
        
        if (!allowedTypes.includes(file.type)) {
          message.error('不支持的文件类型')
          return false
        }
        
        formData.value.import_file = file
        return false
      }
    }
  },
  {
    key: 'import_text',
    label: '试题文本',
    type: 'textarea',
    visible: formData.value.import_type === 'text',
    props: {
      rows: 10,
      placeholder: '请按格式输入试题文本，每道试题以空行分隔',
      maxlength: 10000
    }
  },
  {
    key: 'question_format',
    label: '试题格式',
    type: 'select',
    placeholder: '请选择题库格式',
    props: {
      options: [
        { label: '标准格式', value: 'standard' },
        { label: 'Word格式', value: 'word' },
        { label: 'Excel格式', value: 'excel' },
        { label: '自定义格式', value: 'custom' }
      ]
    }
  },
  {
    key: 'duplicate_handling',
    label: '重复处理',
    type: 'select',
    placeholder: '请选择重复试题处理方式',
    props: {
      options: [
        { label: '跳过重复试题', value: 'skip' },
        { label: '覆盖重复试题', value: 'overwrite' },
        { label: '创建新试题', value: 'create_new' }
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
    key: 'default_score',
    label: '默认分值',
    type: 'input-number',
    placeholder: '请输入默认分值',
    props: {
      min: 1,
      max: 100,
      style: { width: '100%' }
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

    // 模拟解析导入数据
    const importData = {
      target_bank_id: formData.value.target_bank_id,
      questions: generateSampleQuestions(),
      settings: {
        format: formData.value.question_format,
        duplicate_handling: formData.value.duplicate_handling,
        default_difficulty: formData.value.default_difficulty,
        default_score: formData.value.default_score
      }
    }

    emit('import', importData)
    
  } catch (error) {
    console.error('表单提交失败:', error)
    message.error('提交失败，请重试')
  }
}

// 生成示例试题数据
const generateSampleQuestions = () => {
  return [
    {
      question_content: '安全生产"三同时"原则是指什么？',
      question_type: 'single_choice',
      difficulty: 'medium',
      knowledge_point: '安全生产管理',
      chapter: '第一章 安全生产管理基础',
      manual_review: false,
      score: 5,
      options: [
        { id: 'A', content: '同时设计、同时施工、同时验收' },
        { id: 'B', content: '同时规划、同时建设、同时投产' },
        { id: 'C', content: '同时设计、同时施工、同时投入生产和使用' },
        { id: 'D', content: '同时规划、同时设计、同时施工' }
      ],
      correct_answer: ['C'],
      explanation: '安全生产"三同时"原则是指生产经营单位新建、改建、扩建工程项目的安全设施，必须与主体工程同时设计、同时施工、同时投入生产和使用。'
    },
    {
      question_content: '危险化学品泄漏应急处理措施包括哪些？',
      question_type: 'multiple_choice',
      difficulty: 'hard',
      knowledge_point: '危险化学品应急处理',
      chapter: '第二章 应急管理',
      manual_review: false,
      score: 10,
      options: [
        { id: 'A', content: '立即报警' },
        { id: 'B', content: '疏散人员' },
        { id: 'C', content: '切断电源' },
        { id: 'D', content: '使用适当的吸收材料' },
        { id: 'E', content: '穿戴防护装备' }
      ],
      correct_answer: ['A', 'B', 'C', 'D', 'E'],
      explanation: '危险化学品泄漏应急处理包括报警、疏散、切断电源、使用吸收材料、穿戴防护装备等措施。'
    }
  ]
}

// 暴露方法给父组件
defineExpose({
  handleSubmit,
  validate: () => formRef.value?.validate()
})
</script>

<style scoped>
.import-question-form {
  height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>