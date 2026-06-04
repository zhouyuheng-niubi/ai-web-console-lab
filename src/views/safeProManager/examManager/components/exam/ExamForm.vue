<template>
  <div class="exam-form">
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
import dayjs from 'dayjs'

const props = defineProps({
  formData: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  courseOptions: {
    type: Array,
    default: () => []
  },
  departmentOptions: {
    type: Array,
    default: () => []
  },
  positionOptions: {
    type: Array,
    default: () => []
  },
  personnelOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  exam_name: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
  is_training: [{ required: true, message: '请选择是否为培训项目', trigger: 'change' }],
  exam_type: [{ required: true, message: '请选择考试类型', trigger: 'change' }],
  exam_category: [{ required: true, message: '请选择考试分类', trigger: 'change' }],
  access_permission: [{ required: true, message: '请选择开放权限', trigger: 'change' }],
  start_time: [{ required: true, message: '请选择考试开始时间', trigger: 'change' }],
  end_time: [{ required: true, message: '请选择考试结束时间', trigger: 'change' }],
  total_score: [{ required: true, message: '请输入考试总分', trigger: 'blur' }],
  passing_score: [{ required: true, message: '请输入及格分数', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入考试时长', trigger: 'blur' }],
  max_attempts: [{ required: true, message: '请输入最大考试次数', trigger: 'blur' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 动态显示条件权限选择字段
const showConditionalFields = computed(() => {
  const permission = formData.value.access_permission
  return {
    department: permission === 'department',
    position: permission === 'position',
    specific: permission === 'specific',
    grade_level: permission === 'grade_level'
  }
})

// 表单Schema配置
const formSchema = computed(() => [
  {
    type: 'divider',
    content: '基本信息',
    orientation: 'left'
  },
  {
    key: 'exam_name',
    label: '考试名称',
    type: 'input',
    required: true,
    placeholder: '请输入考试名称，如：2024年安全生产法律法规知识考试',
    props: {
      allowClear: true,
      maxlength: 200
    }
  },
  {
    key: 'is_training',
    label: '培训项目',
    type: 'radioGroup',
    required: true,
    placeholder: '是否为培训项目',
    props: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  },
  {
    key: 'exam_type',
    label: '考试类型',
    type: 'select',
    required: true,
    placeholder: '请选择考试类型',
    props: {
      options: [
        { label: '常规考试', value: 'regular' },
        { label: '模拟考试', value: 'practice' },
        { label: '资格认证', value: 'qualification' },
        { label: '晋升考试', value: 'promotion' },
        { label: '评估测试', value: 'assessment' },
        { label: '随堂测验', value: 'quiz' }
      ],
      showSearch: true
    }
  },
  {
    key: 'exam_category',
    label: '考试分类',
    type: 'select',
    required: true,
    placeholder: '请选择考试分类',
    props: {
      options: [
        { label: '职位晋升考试', value: 'promotion' },
        { label: '初级安全工程师', value: 'primary_engineer' },
        { label: '中级安全工程师', value: 'intermediate_engineer' },
        { label: '高级安全工程师', value: 'advanced_engineer' },
        { label: '安全管理人员', value: 'safety_manager' },
        { label: '模拟考试', value: 'simulation' },
        { label: '资格认证考试', value: 'certification' },
        { label: '培训效果评估', value: 'training_assessment' },
        { label: '安全知识测试', value: 'safety_knowledge' },
        { label: '应急演练考核', value: 'emergency_drill' }
      ],
      showSearch: true
    }
  },
  {
    key: 'course_id',
    label: '关联课程',
    type: 'select',
    placeholder: '请选择关联课程（可选）',
    props: {
      options: props.courseOptions,
      showSearch: true,
      allowClear: true
    }
  },
  {
    key: 'exam_description',
    label: '考试描述',
    type: 'textarea',
    placeholder: '请输入考试描述，说明考试目的、内容等',
    props: {
      rows: 4,
      maxlength: 1000,
      showCount: true
    }
  },
  {
    type: 'divider',
    content: '权限设置',
    orientation: 'left'
  },
  {
    key: 'access_permission',
    label: '开放权限',
    type: 'select',
    required: true,
    placeholder: '请选择开放权限',
    props: {
      options: [
        { label: '完全开放', value: 'full_open' },
        { label: '部门开放', value: 'department' },
        { label: '岗位开放', value: 'position' },
        { label: '指定人员', value: 'specific' },
        { label: '职级开放', value: 'grade_level' }
      ]
    }
  },
  {
    key: 'department_ids',
    label: '选择部门',
    type: 'select',
    mode: 'multiple',
    placeholder: '请选择部门',
    visible: showConditionalFields.value.department,
    props: {
      options: props.departmentOptions,
      showSearch: true
    }
  },
  {
    key: 'position_ids',
    label: '选择岗位',
    type: 'select',
    mode: 'multiple',
    placeholder: '请选择岗位',
    visible: showConditionalFields.value.position,
    props: {
      options: props.positionOptions,
      showSearch: true
    }
  },
  {
    key: 'specific_person_ids',
    label: '选择人员',
    type: 'select',
    mode: 'multiple',
    placeholder: '请选择人员',
    visible: showConditionalFields.value.specific,
    props: {
      options: props.personnelOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'grade_levels',
    label: '选择职级',
    type: 'select',
    mode: 'multiple',
    placeholder: '请选择职级',
    visible: showConditionalFields.value.grade_level,
    props: {
      options: [
        { label: '普通员工', value: 'employee' },
        { label: '班组长', value: 'team_leader' },
        { label: '主管', value: 'supervisor' },
        { label: '经理', value: 'manager' },
        { label: '总监', value: 'director' }
      ]
    }
  },
  {
    type: 'divider',
    content: '时间设置',
    orientation: 'left'
  },
  {
    key: 'start_time',
    label: '开始时间',
    type: 'datePicker',
    required: true,
    placeholder: '请选择考试开始时间',
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: 'YYYY-MM-DD HH:mm',
      style: { width: '100%' }
    }
  },
  {
    key: 'end_time',
    label: '结束时间',
    type: 'datePicker',
    required: true,
    placeholder: '请选择考试结束时间',
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: 'YYYY-MM-DD HH:mm',
      style: { width: '100%' },
      disabledDate: (current) => {
        if (formData.value.start_time) {
          return current && current <= dayjs(formData.value.start_time)
        }
        return false
      }
    }
  },
  {
    key: 'duration',
    label: '考试时长(分钟)',
    type: 'input',
    required: true,
    placeholder: '请输入考试时长',
    props: {
      min: 1,
      max: 480,
      style: { width: '100%' }
    }
  },
  {
    type: 'divider',
    content: '分数设置',
    orientation: 'left'
  },
  {
    key: 'total_score',
    label: '考试总分',
    type: 'input',
    required: true,
    placeholder: '请输入考试总分',
    props: {
      min: 1,
      max: 1000,
      style: { width: '100%' }
    }
  },
  {
    key: 'passing_score',
    label: '及格分数',
    type: 'input',
    required: true,
    placeholder: '请输入及格分数',
    props: {
      min: 0,
      max: (formData.value.total_score || 100),
      style: { width: '100%' }
    }
  },
  {
    key: 'score_rule',
    label: '计分规则',
    type: 'select',
    placeholder: '请选择计分规则',
    props: {
      options: [
        { label: '按最高分', value: 'highest' },
        { label: '按平均分', value: 'average' },
        { label: '按最后一次', value: 'last' },
        { label: '按第一次', value: 'first' }
      ],
      defaultValue: 'highest'
    }
  },
  {
    type: 'divider',
    content: '考试规则',
    orientation: 'left'
  },
  {
    key: 'max_attempts',
    label: '最大考试次数',
    type: 'input',
    required: true,
    placeholder: '请输入最大考试次数',
    props: {
      min: 1,
      max: 10,
      style: { width: '100%' }
    }
  },
  {
    key: 'random_questions',
    label: '随机出题',
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
    key: 'question_order_random',
    label: '题目顺序随机',
    type: 'radioGroup',
    visible: computed(() => formData.value.random_questions !== true),
    props: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      defaultValue: false
    }
  },
  {
    key: 'show_score_after_exam',
    label: '考后立即显示分数',
    type: 'radioGroup',
    props: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      defaultValue: true
    }
  },
  {
    key: 'show_answer_after_exam',
    label: '考后显示答案',
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
    key: 'allow_retake_after_pass',
    label: '及格后允许重考',
    type: 'radioGroup',
    props: {
      options: [
        { label: '允许', value: true },
        { label: '不允许', value: false }
      ],
      defaultValue: false
    }
  },
  {
    type: 'divider',
    content: '防作弊设置',
    orientation: 'left'
  },
  {
    key: 'anti_cheating_enabled',
    label: '启用防作弊',
    type: 'radioGroup',
    props: {
      options: [
        { label: '启用', value: true },
        { label: '不启用', value: false }
      ],
      defaultValue: false
    }
  },
  {
    key: 'require_camera',
    label: '开启摄像头监控',
    type: 'radioGroup',
    visible: computed(() => formData.value.anti_cheating_enabled === true),
    props: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      defaultValue: false
    }
  },
  {
    key: 'allow_switch_tab',
    label: '允许切换标签页',
    type: 'radioGroup',
    visible: computed(() => formData.value.anti_cheating_enabled === true),
    props: {
      options: [
        { label: '允许', value: true },
        { label: '不允许', value: false }
      ],
      defaultValue: true
    }
  },
  {
    key: 'max_switch_tab_count',
    label: '最大标签切换次数',
    type: 'input',
    visible: computed(() => 
      formData.value.anti_cheating_enabled === true && 
      formData.value.allow_switch_tab === true
    ),
    props: {
      min: 0,
      max: 100,
      style: { width: '100%' }
    }
  },
  {
    key: 'require_fullscreen',
    label: '强制全屏考试',
    type: 'radioGroup',
    visible: computed(() => formData.value.anti_cheating_enabled === true),
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
    content: '高级设置',
    orientation: 'left'
  },
  {
    key: 'exam_instructions',
    label: '考试说明',
    type: 'textarea',
    placeholder: '请输入考试说明，包括注意事项、考试规则等',
    props: {
      rows: 4,
      maxlength: 2000,
      showCount: true
    }
  },
  {
    key: 'pass_certificate_template',
    label: '合格证书模板',
    type: 'select',
    placeholder: '请选择合格证书模板',
    props: {
      options: [
        { label: '标准模板', value: 'standard' },
        { label: '企业模板', value: 'enterprise' },
        { label: '专业认证模板', value: 'professional' },
        { label: '无证书', value: 'none' }
      ],
      defaultValue: 'standard'
    }
  },
  {
    key: 'status',
    label: '考试状态',
    type: 'select',
    placeholder: '请选择考试状态',
    visible: props.isEdit,
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '待发布', value: 'pending' },
        { label: '已发布', value: 'published' },
        { label: '已关闭', value: 'closed' }
      ]
    }
  },
  {
    key: 'tags',
    label: '考试标签',
    type: 'select',
    mode: 'tags',
    placeholder: '请输入考试标签，按回车添加',
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

    // 验证时间逻辑
    if (formData.value.start_time && formData.value.end_time) {
      const start = dayjs(formData.value.start_time)
      const end = dayjs(formData.value.end_time)
      
      if (end.isBefore(start)) {
        message.error('结束时间不能早于开始时间')
        return
      }
      
      // 验证考试时长
      if (formData.value.duration) {
        const durationHours = formData.value.duration / 60
        const examHours = end.diff(start, 'hour', true)
        
        if (durationHours > examHours) {
          message.error('考试时长不能超过考试时间范围')
          return
        }
      }
    }

    // 验证分数逻辑
    if (formData.value.passing_score > formData.value.total_score) {
      message.error('及格分数不能超过总分')
      return
    }

    // 权限验证
    const permission = formData.value.access_permission
    if (permission === 'department' && (!formData.value.department_ids || formData.value.department_ids.length === 0)) {
      message.error('请选择至少一个部门')
      return
    }
    if (permission === 'position' && (!formData.value.position_ids || formData.value.position_ids.length === 0)) {
      message.error('请选择至少一个岗位')
      return
    }
    if (permission === 'specific' && (!formData.value.specific_person_ids || formData.value.specific_person_ids.length === 0)) {
      message.error('请选择至少一个人员')
      return
    }
    if (permission === 'grade_level' && (!formData.value.grade_levels || formData.value.grade_levels.length === 0)) {
      message.error('请选择至少一个职级')
      return
    }

    const submitData = { ...formData.value }

    // 如果是新建，设置默认状态
    if (!props.isEdit && !submitData.status) {
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
.exam-form {
  height: 700px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>