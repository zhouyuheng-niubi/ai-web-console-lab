<template>
  <div class="personnel-form">
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
import { ref, computed, watch, nextTick } from 'vue'
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
  },
  positionOptions: {
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
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  id_card: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    { pattern: /^\d{17}[\dXx]$/, message: '请输入正确的身份证号码', trigger: 'blur' }
  ],
  team_id: [{ required: true, message: '请选择所属班组', trigger: 'change' }],
  position: [{ required: true, message: '请选择岗位', trigger: 'change' }],
  entry_date: [{ required: true, message: '请选择入职时间', trigger: 'change' }],
  emergency_contact_name: [{ required: true, message: '请输入应急联系人姓名', trigger: 'blur' }],
  emergency_contact_phone: [
    { required: true, message: '请输入应急联系人电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  emergency_contact_relationship: [{ required: true, message: '请输入与本人关系', trigger: 'blur' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 表单Schema配置
const formSchema = computed(() => [
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
    key: 'gender',
    label: '性别',
    type: 'select',
    required: true,
    placeholder: '请选择性别',
    props: {
      options: [
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ]
    }
  },
  {
    key: 'phone',
    label: '联系电话',
    type: 'input',
    required: true,
    placeholder: '请输入联系电话',
    props: {
      allowClear: true,
      maxlength: 11
    }
  },
  {
    key: 'id_card',
    label: '身份证号',
    type: 'input',
    required: true,
    placeholder: '请输入身份证号',
    props: {
      allowClear: true,
      maxlength: 18
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
    key: 'position',
    label: '岗位',
    type: 'select',
    required: true,
    placeholder: '请选择岗位',
    props: {
      options: props.positionOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'entry_date',
    label: '入职时间',
    type: 'datePicker',
    required: true,
    placeholder: '请选择入职时间',
    props: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      style: { width: '100%' }
    }
  },
  {
    type: 'divider',
    content: '应急联系人信息',
    orientation: 'left'
  },
  {
    key: 'emergency_contact_name',
    label: '联系人姓名',
    type: 'input',
    required: true,
    placeholder: '请输入应急联系人姓名',
    props: {
      allowClear: true,
      maxlength: 20
    }
  },
  {
    key: 'emergency_contact_phone',
    label: '联系人电话',
    type: 'input',
    required: true,
    placeholder: '请输入应急联系人电话',
    props: {
      allowClear: true,
      maxlength: 11
    }
  },
  {
    key: 'emergency_contact_relationship',
    label: '与本人关系',
    type: 'input',
    required: true,
    placeholder: '请输入与本人关系（如：父亲、母亲等）',
    props: {
      allowClear: true,
      maxlength: 20
    }
  },
  {
    type: 'divider',
    content: '账号信息',
    orientation: 'left'
  },
  {
    key: 'username',
    label: '登录账号',
    type: 'input',
    required: !props.isEdit,
    placeholder: '请输入登录账号',
    props: {
      allowClear: true,
      maxlength: 50,
      disabled: props.isEdit
    },
    visible: !props.isEdit
  },
  {
    key: 'password',
    label: '登录密码',
    type: 'input',
    required: !props.isEdit,
    placeholder: '请输入登录密码',
    props: {
      allowClear: true,
      maxlength: 50,
      disabled: props.isEdit
    },
    visible: !props.isEdit
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
    const submitData = {
      ...formData.value,
      emergency_contact: {
        name: formData.value.emergency_contact_name,
        phone: formData.value.emergency_contact_phone,
        relationship: formData.value.emergency_contact_relationship
      }
    }

    // 移除临时的字段
    delete submitData.emergency_contact_name
    delete submitData.emergency_contact_phone
    delete submitData.emergency_contact_relationship

    // 如果是编辑模式且密码为空，则移除密码字段
    if (props.isEdit && !submitData.password) {
      delete submitData.password
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
.personnel-form {
  height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.personnel-form::-webkit-scrollbar {
  width: 6px;
}

.personnel-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.personnel-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.personnel-form::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

:deep(.ant-divider) {
  margin: 24px 0 !important;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
}
</style>