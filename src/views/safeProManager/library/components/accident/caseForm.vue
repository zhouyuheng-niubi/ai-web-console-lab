<template>
  <div class="case-form">
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
  accidentTypeOptions: {
    type: Array,
    default: () => []
  },
  sceneOptions: {
    type: Array,
    default: () => []
  },
  regionOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  case_name: [{ required: true, message: '请输入案例名称', trigger: 'blur' }],
  accident_type: [{ required: true, message: '请选择事故类型', trigger: 'change' }],
  scene_ids: [{ required: true, message: '请选择适用场景', trigger: 'change' }],
  occurrence_unit: [{ required: true, message: '请输入事故发生单位', trigger: 'blur' }],
  region_id: [{ required: true, message: '请选择所在区域', trigger: 'change' }],
  location: [{ required: true, message: '请输入发生地点', trigger: 'blur' }],
  occurrence_time: [{ required: true, message: '请选择发生时间', trigger: 'change' }],
  accident_overview: [{ required: true, message: '请输入事故概况', trigger: 'blur' }],
  cause_analysis: [{ required: true, message: '请输入原因分析', trigger: 'blur' }],
  corrective_measures: [{ required: true, message: '请输入整改措施', trigger: 'blur' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 表单Schema配置
const formSchema = computed(() => [
  {
    key: 'case_name',
    label: '案例名称',
    type: 'input',
    required: true,
    placeholder: '请输入案例名称，如：2023年XX项目高空坠落事故案例',
    props: {
      allowClear: true,
      maxlength: 200
    }
  },
  {
    key: 'accident_type',
    label: '事故类型',
    type: 'select',
    required: true,
    placeholder: '请选择事故类型',
    props: {
      options: [
        { label: '高处坠落', value: 'fall' },
        { label: '火灾爆炸', value: 'fire_explosion' },
        { label: '机械伤害', value: 'mechanical' },
        { label: '中毒窒息', value: 'poisoning' },
        { label: '坍塌', value: 'collapse' },
        { label: '触电', value: 'electric' },
        { label: '其他', value: 'other' }
      ],
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'scene_ids',
    label: '适用场景',
    type: 'select',
    mode: 'multiple',
    required: true,
    placeholder: '请选择适用场景',
    props: {
      options: props.sceneOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'occurrence_unit',
    label: '事故发生单位',
    type: 'input',
    required: true,
    placeholder: '请输入事故发生单位名称',
    props: {
      allowClear: true,
      maxlength: 100
    }
  },
  {
    key: 'region_id',
    label: '所在区域',
    type: 'select',
    required: true,
    placeholder: '请选择所在区域',
    props: {
      options: props.regionOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'location',
    label: '发生地点',
    type: 'input',
    required: true,
    placeholder: '请输入具体发生地点',
    props: {
      allowClear: true,
      maxlength: 200
    }
  },
  {
    key: 'occurrence_time',
    label: '发生时间',
    type: 'datePicker',
    required: true,
    placeholder: '请选择发生时间',
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: 'YYYY-MM-DD HH:mm',
      style: { width: '100%' },
      disabledDate: (current) => {
        return current && current > dayjs().endOf('day')
      }
    }
  },
  {
    key: 'accident_overview',
    label: '事故概况',
    type: 'textarea',
    required: true,
    placeholder: '请详细描述事故经过、人员伤亡、经济损失等情况',
    props: {
      rows: 6,
      maxlength: 2000,
      showCount: true
    }
  },
  {
    key: 'cause_analysis',
    label: '原因分析',
    type: 'textarea',
    required: true,
    placeholder: '请从直接原因、间接原因、管理原因等方面进行分析',
    props: {
      rows: 6,
      maxlength: 2000,
      showCount: true
    }
  },
  {
    key: 'corrective_measures',
    label: '整改措施',
    type: 'textarea',
    required: true,
    placeholder: '请提出具体的整改措施和预防建议',
    props: {
      rows: 6,
      maxlength: 2000,
      showCount: true
    }
  },
  {
    key: 'lessons_learned',
    label: '经验教训',
    type: 'textarea',
    placeholder: '请总结事故经验教训',
    props: {
      rows: 4,
      maxlength: 1000,
      showCount: true
    }
  },
  {
    key: 'attachments',
    label: '案例附件',
    type: 'upload',
    props: {
      multiple: true,
      maxCount: 10,
      beforeUpload: (file) => {
        const maxSize = 50 * 1024 * 1024 // 50MB
        
        if (file.size > maxSize) {
          message.error('文件大小不能超过50MB')
          return false
        }
        
        const allowedTypes = [
          'image/jpeg', 'image/png', 'image/gif', 'image/bmp',
          'application/pdf', 
          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'video/mp4', 'video/avi'
        ]
        
        if (!allowedTypes.includes(file.type)) {
          message.error('不支持的文件类型')
          return false
        }
        
        return false
      }
    }
  },
  {
    key: 'tags',
    label: '关键词标签',
    type: 'select',
    mode: 'tags',
    placeholder: '请输入关键词，按回车添加',
    props: {
      allowCreate: true
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
.case-form {
  height: 700px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>