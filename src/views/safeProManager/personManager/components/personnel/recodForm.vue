<template>
  <div class="record-form">
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
  recordTypes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  type: [{ required: true, message: '请选择档案类型', trigger: 'change' }],
  check_date: [{ required: true, message: '请选择检查日期', trigger: 'change' }],
  institution: [{ required: true, message: '请输入体检机构', trigger: 'blur' }],
  expire_date: [{ required: true, message: '请选择有效期至', trigger: 'change' }],
  conclusion: [{ required: true, message: '请输入检查结论', trigger: 'blur' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 计算有效期选项
const expireDateOptions = computed(() => {
  if (!formData.value.check_date) return []
  
  const checkDate = dayjs(formData.value.check_date)
  const options = []
  
  for (let i = 6; i <= 36; i += 6) {
    const date = checkDate.add(i, 'month').format('YYYY-MM-DD')
    const label = `${i}个月 (${date})`
    options.push({ label, value: date })
  }
  
  return options
})

// 表单Schema配置
const formSchema = computed(() => [
  {
    key: 'type',
    label: '档案类型',
    type: 'select',
    required: true,
    placeholder: '请选择档案类型',
    props: {
      options: props.recordTypes,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'check_date',
    label: '检查日期',
    type: 'datePicker',
    required: true,
    placeholder: '请选择检查日期',
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
    key: 'institution',
    label: '体检机构',
    type: 'input',
    required: true,
    placeholder: '请输入体检机构名称',
    props: {
      allowClear: true,
      maxlength: 100
    }
  },
  {
    key: 'expire_date',
    label: '有效期至',
    type: 'select',
    required: true,
    placeholder: '请选择有效期',
    props: {
      options: expireDateOptions.value,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    },
    visible: !!formData.value.check_date
  },
  {
    key: 'expire_date_custom',
    label: '有效期至',
    type: 'datePicker',
    required: true,
    placeholder: '请选择有效期',
    props: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      style: { width: '100%' },
      disabledDate: (current) => {
        const checkDate = dayjs(formData.value.check_date)
        return current && current <= checkDate
      }
    },
    visible: !formData.value.check_date
  },
  {
    key: 'conclusion',
    label: '检查结论',
    type: 'textarea',
    required: true,
    placeholder: '请输入检查结论',
    props: {
      rows: 4,
      showCount: true,
      maxlength: 500
    }
  },
  {
    key: 'doctor',
    label: '检查医生',
    type: 'input',
    placeholder: '请输入检查医生姓名',
    props: {
      allowClear: true,
      maxlength: 50
    }
  },
  {
    key: 'note',
    label: '备注',
    type: 'textarea',
    placeholder: '请输入备注信息',
    props: {
      rows: 3,
      showCount: true,
      maxlength: 200
    }
  },
  {
    key: 'files',
    label: '附件资料',
    type: 'upload',
    props: {
      multiple: true,
      listType: 'picture-card',
      maxCount: 10,
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
        
        return false // 阻止自动上传
      },
      onRemove: (file) => {
        console.log('移除文件:', file)
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

    // 处理表单数据
    const submitData = { ...formData.value }
    
    // 如果没有选择预定义的有效期，使用自定义日期
    if (!submitData.expire_date && submitData.expire_date_custom) {
      submitData.expire_date = submitData.expire_date_custom
      delete submitData.expire_date_custom
    }

    emit('save', submitData)
    
  } catch (error) {
    console.error('表单提交失败:', error)
    message.error('提交失败，请重试')
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
}

// 暴露方法给父组件
defineExpose({
  handleSubmit,
  resetForm,
  validate: () => formRef.value?.validate()
})
</script>

<style scoped>
.record-form {
  height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}

.record-form::-webkit-scrollbar {
  width: 6px;
}

.record-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.record-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.record-form::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

:deep(.ant-upload-list-picture-card .ant-upload-list-item) {
  width: 80px;
  height: 80px;
}

:deep(.ant-upload.ant-upload-select-picture-card) {
  width: 80px;
  height: 80px;
}
</style>