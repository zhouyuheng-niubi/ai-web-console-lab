<template>
  <div class="face-form">
    <AdvancedForm
      ref="formRef"
      :schema="formSchema"
      :model="formData"
      :rules="rules"
      mode="form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      @validate="handleValidate"
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
  teamOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  employee_id: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  team_id: [{ required: true, message: '请选择所属班组', trigger: 'change' }],
  face_image: [{ required: !props.isEdit, message: '请上传人脸图片', trigger: 'change' }]
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
    key: 'name',
    label: '姓名',
    type: 'input',
    required: true,
    placeholder: '请输入姓名',
    props: {
      allowClear: true,
      maxlength: 20
    }
  },
  {
    key: 'employee_id',
    label: '工号',
    type: 'input',
    required: true,
    placeholder: '请输入工号',
    props: {
      allowClear: true,
      maxlength: 20
    }
  },
  {
    key: 'team_id',
    label: '所属班组',
    type: 'select',
    required: true,
    placeholder: '请选择班组',
    props: {
      options: props.teamOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    type: 'divider',
    content: '人脸图片',
    orientation: 'left'
  },
  {
    key: 'face_image',
    label: '人脸图片',
    type: 'upload',
    required: !props.isEdit,
    props: {
      multiple: false,
      listType: 'picture-card',
      maxCount: 1,
      beforeUpload: (file) => {
        const isImage = file.type.startsWith('image/')
        if (!isImage) {
          message.error('只能上传图片文件')
          return false
        }
        
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          message.error('图片大小不能超过2MB')
          return false
        }
        
        // 验证图片尺寸
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
              const minSize = 200
              if (img.width < minSize || img.height < minSize) {
                message.error(`图片尺寸过小，建议最小 ${minSize}×${minSize}px`)
                reject(false)
              } else {
                resolve(false) // 阻止自动上传
              }
            }
            img.src = e.target.result
          }
          reader.readAsDataURL(file)
        })
      },
      onRemove: () => {
        formData.value.face_image = null
      },
      onChange: (info) => {
        if (info.file.status === 'done') {
          // 处理上传成功
          formData.value.face_image = info.file.response?.url || info.file.thumbUrl
        }
      }
    }
  },
  {
    key: 'signature_image',
    label: '签字签名',
    type: 'upload',
    props: {
      multiple: false,
      listType: 'picture-card',
      maxCount: 1,
      accept: 'image/*',
      beforeUpload: (file) => {
        const isImage = file.type.startsWith('image/')
        if (!isImage) {
          message.error('只能上传图片文件')
          return false
        }
        
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          message.error('图片大小不能超过2MB')
          return false
        }
        return false // 阻止自动上传
      },
      onRemove: () => {
        formData.value.signature_image = null
      }
    }
  },
  {
    type: 'divider',
    content: '其他信息',
    orientation: 'left'
  },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    props: {
      options: [
        { label: '已激活', value: 'active' },
        { label: '未激活', value: 'inactive' },
        { label: '已过期', value: 'expired' }
      ],
      defaultValue: 'active'
    }
  },
  {
    key: 'remark',
    label: '备注',
    type: 'textarea',
    props: {
      rows: 3,
      maxlength: 200,
      showCount: true
    }
  }
])

// 表单验证
const handleValidate = (valid, errors) => {
  if (!valid) {
    console.log('表单验证错误:', errors)
  }
}

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

    // 如果是编辑模式且人脸图片没有变化，移除图片字段
    if (props.isEdit && typeof submitData.face_image === 'string' && submitData.face_image.startsWith('http')) {
      delete submitData.face_image
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
.face-form {
  height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.face-form::-webkit-scrollbar {
  width: 6px;
}

.face-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.face-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.face-form::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

:deep(.ant-divider) {
  margin: 24px 0 !important;
}

:deep(.ant-upload-list-picture-card .ant-upload-list-item) {
  width: 100px;
  height: 100px;
}

:deep(.ant-upload.ant-upload-select-picture-card) {
  width: 100px;
  height: 100px;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
}
</style>