<template>
  <div class="certificate-form">
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
  personOptions: {
    type: Array,
    default: () => []
  },
  certificateTypeOptions: {
    type: Array,
    default: () => []
  },
  institutionOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  person_id: [{ required: true, message: '请选择人员', trigger: 'change' }],
  certificate_name: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
  certificate_no: [{ required: true, message: '请输入证书编号', trigger: 'blur' }],
  certificate_type: [{ required: true, message: '请选择证书类型', trigger: 'change' }],
  issuing_institution: [{ required: true, message: '请输入发证机构', trigger: 'blur' }],
  valid_start: [{ required: true, message: '请选择有效期起始', trigger: 'change' }],
  valid_end: [{ required: true, message: '请选择有效期截止', trigger: 'change' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 表单Schema配置
const formSchema = computed(() => [
  {
    key: 'person_id',
    label: '人员名称',
    type: 'select',
    required: true,
    placeholder: '请选择人员',
    props: {
      options: props.personOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'certificate_name',
    label: '证书名称',
    type: 'input',
    required: true,
    placeholder: '请输入证书名称',
    props: {
      allowClear: true,
      maxlength: 100
    }
  },
  {
    key: 'certificate_no',
    label: '证书编号',
    type: 'input',
    required: true,
    placeholder: '请输入证书编号',
    props: {
      allowClear: true,
      maxlength: 50
    }
  },
  {
    key: 'certificate_type',
    label: '证书类型',
    type: 'select',
    required: true,
    placeholder: '请选择证书类型',
    props: {
      options: props.certificateTypeOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'issuing_institution',
    label: '发证机构',
    type: 'select',
    required: true,
    placeholder: '请选择或输入发证机构',
    props: {
      options: props.institutionOptions,
      showSearch: true,
      allowCreate: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'issue_date',
    label: '发证日期',
    type: 'datePicker',
    placeholder: '请选择发证日期',
    props: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      style: { width: '100%' },
      disabledDate: (current) => {
        return current && current > dayjs().endOf('day')
      }
    }
  },
  {
    key: 'valid_start',
    label: '有效期起始',
    type: 'datePicker',
    required: true,
    placeholder: '请选择有效期起始',
    props: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      style: { width: '100%' },
      disabledDate: (current) => {
        if (formData.value.issue_date) {
          return current && current < dayjs(formData.value.issue_date)
        }
        return false
      }
    }
  },
  {
    key: 'valid_end',
    label: '有效期截止',
    type: 'datePicker',
    required: true,
    placeholder: '请选择有效期截止',
    props: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      style: { width: '100%' },
      disabledDate: (current) => {
        if (formData.value.valid_start) {
          return current && current <= dayjs(formData.value.valid_start)
        }
        return false
      }
    }
  },
  {
    key: 'description',
    label: '证书描述',
    type: 'textarea',
    placeholder: '请输入证书描述',
    props: {
      rows: 3,
      maxlength: 500,
      showCount: true
    }
  },
  {
    key: 'attachments',
    label: '证书附件',
    type: 'upload',
    props: {
      multiple: true,
      listType: 'picture-card',
      maxCount: 5,
      beforeUpload: (file) => {
        const isImage = file.type.startsWith('image/')
        const isPDF = file.type === 'application/pdf'
        if (!isImage && !isPDF) {
          message.error('只能上传图片或PDF文件')
          return false
        }
        
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isLt10M) {
          message.error('文件大小不能超过10MB')
          return false
        }
        
        return false
      }
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

    // 验证有效期逻辑
    if (formData.value.valid_start && formData.value.valid_end) {
      const start = dayjs(formData.value.valid_start)
      const end = dayjs(formData.value.valid_end)
      
      if (end.isBefore(start)) {
        message.error('有效期截止日期不能早于起始日期')
        return
      }
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
.certificate-form {
  height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>