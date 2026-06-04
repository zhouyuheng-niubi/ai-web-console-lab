<template>
  <div class="course-form">
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
  course_name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择课程分类', trigger: 'change' }],
  development_type: [{ required: true, message: '请选择开放类型', trigger: 'change' }],
  duration: [{ required: true, message: '请输入课时', trigger: 'blur' }],
  instructor: [{ required: true, message: '请输入讲师', trigger: 'blur' }],
  difficulty_level: [{ required: true, message: '请选择难度等级', trigger: 'change' }],
  pass_score: [{ required: true, message: '请输入合格分数', trigger: 'blur' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 表单Schema配置
const formSchema = computed(() => [
//   {
//     type: 'divider',
//     content: '基本信息',
//     orientation: 'left'
//   },
  {
    key: 'course_name',
    label: '课程名称',
    type: 'input',
    required: true,
    placeholder: '请输入课程名称',
    props: {
      allowClear: true,
      maxlength: 200
    }
  },
  {
    key: 'is_training',
    label: '培训项目',
    type: 'radioGroup',
    placeholder: '请选择性别',
    required: true,
    props: {
        allowClear: true,
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    },
    
  },
  {
    key: 'category',
    label: '课程分类',
    type: 'select',
    required: true,
    placeholder: '请选择分类',
    props: {
      options: [
        { label: '企业培训', value: 'enterprise' },
        { label: '国家职业资格认证', value: 'national_certification' }
      ]
    }
  },
  {
    key: 'development_type',
    label: '开放类型',
    type: 'select',
    required: true,
    placeholder: '请选择开放类型',
    props: {
      options: [
        { label: '部分学员', value: 'partial' },
        { label: '完全公开', value: 'public' },
        { label: '内部使用', value: 'internal' },
        { label: '对外培训', value: 'external' }
      ]
    }
  },
  {
    key: 'duration',
    label: '课时(小时)',
    type: 'input',
    required: true,
    placeholder: '请输入课时',
    props: {
      min: 1,
      max: 200,
      style: { width: '100%' }
    }
  },
  {
    key: 'status',
    label: '课程状态',
    type: 'select',
    placeholder: '请选择状态',
    props: {
      options: [
        { label: '正常', value: 'active' },
        { label: '停用', value: 'inactive' },
        { label: '草稿', value: 'draft' }
      ]
    }
  },
//   {
//     type: 'divider',
//     content: '课程内容',
//     orientation: 'left'
//   },
  {
    key: 'description',
    label: '课程描述',
    type: 'textarea',
    placeholder: '请输入课程描述',
    props: {
      rows: 3,
      maxlength: 500,
      showCount: true
    }
  },
  {
    key: 'course_content',
    label: '课程内容',
    type: 'textarea',
    placeholder: '请输入详细课程内容',
    props: {
      rows: 4,
      maxlength: 2000,
      showCount: true
    }
  },
  {
    key: 'target_audience',
    label: '目标受众',
    type: 'input',
    placeholder: '请输入目标受众',
    props: {
      maxlength: 100
    }
  },
  {
    key: 'prerequisites',
    label: '前提条件',
    type: 'input',
    placeholder: '请输入学习前提条件',
    props: {
      maxlength: 200
    }
  },
  {
    key: 'difficulty_level',
    label: '难度等级',
    type: 'select',
    required: true,
    placeholder: '请选择难度等级',
    props: {
      options: [
        { label: '初级', value: 'primary' },
        { label: '中级', value: 'intermediate' },
        { label: '高级', value: 'advanced' }
      ]
    }
  },
//   {
//     type: 'divider',
//     content: '评估设置',
//     orientation: 'left'
//   },
  {
    key: 'evaluation_method',
    label: '评估方式',
    type: 'select',
    placeholder: '请选择评估方式',
    props: {
      options: [
        { label: '在线考试', value: 'online_exam' },
        { label: '实操考核', value: 'practical_assessment' },
        { label: '理论考试', value: 'theory_exam' },
        { label: '在线测试', value: 'online_test' },
        { label: '方案设计', value: 'project_design' },
        { label: '方案评审', value: 'project_review' }
      ]
    }
  },
  {
    key: 'pass_score',
    label: '合格分数',
    type: 'input',
    required: true,
    placeholder: '请输入合格分数',
    props: {
      min: 0,
      max: 150,
      style: { width: '100%' }
    }
  },
  {
    key: 'instructor',
    label: '讲师',
    type: 'input',
    required: true,
    placeholder: '请输入讲师姓名',
    props: {
      maxlength: 50
    }
  },
//   {
//     type: 'divider',
//     content: '标签管理',
//     orientation: 'left'
//   },
  {
    key: 'tags',
    label: '课程标签',
    type: 'select',
    mode: 'tags',
    placeholder: '请输入标签，按回车确认',
    props: {
      maxTagCount: 10,
      style: { width: '100%' }
    }
  },
//   {
//     type: 'divider',
//     content: '课程封面',
//     orientation: 'left'
//   },
//   {
//     key: 'course_cover',
//     label: '封面图片',
//     type: 'upload',
//     props: {
//       listType: 'picture-card',
//       maxCount: 1,
//       beforeUpload: (file) => {
//         const isImage = file.type.startsWith('image/')
//         if (!isImage) {
//           message.error('只能上传图片文件')
//           return false
//         }
//         const isLt2M = file.size / 1024 / 1024 < 2
//         if (!isLt2M) {
//           message.error('图片大小不能超过2MB')
//           return false
//         }
//         return true
//       }
//     }
//   }
])

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    
    if (!valid) {
      message.error('请检查表单填写是否正确')
      return
    }

    // 验证合格分数
    if (formData.value.pass_score < 0 || formData.value.pass_score > 100) {
      message.error('合格分数必须在0-100之间')
      return
    }

    // 验证课时
    if (formData.value.duration < 1 || formData.value.duration > 200) {
      message.error('课时必须在1-200小时之间')
      return
    }

    const submitData = { ...formData.value }

    // 如果是新建，设置默认状态
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
.course-form {
  height: 700px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>