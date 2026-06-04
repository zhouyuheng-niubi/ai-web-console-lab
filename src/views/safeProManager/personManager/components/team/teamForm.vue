<template>
  <div class="team-form">
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
  instituteOptions: {
    type: Array,
    default: () => []
  },
  regionOptions: {
    type: Array,
    default: () => []
  },
  leaderOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  team_name: [{ required: true, message: '请输入班组名称', trigger: 'blur' }],
  institute_id: [{ required: true, message: '请选择所属研究所', trigger: 'change' }],
  leader_id: [{ required: true, message: '请选择班组长', trigger: 'change' }],
  region_ids: [{ required: true, message: '请选择作业区域', trigger: 'change' }],
  status: [{ required: true, message: '请选择班组状态', trigger: 'change' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 表单Schema配置
const formSchema = computed(() => [
  {
    key: 'team_name',
    label: '班组名称',
    type: 'input',
    required: true,
    placeholder: '请输入班组名称',
    props: {
      allowClear: true,
      maxlength: 50
    }
  },
  {
    key: 'institute_id',
    label: '所属研究所',
    type: 'select',
    required: true,
    placeholder: '请选择研究所',
    props: {
      options: props.instituteOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'leader_id',
    label: '班组长',
    type: 'select',
    required: true,
    placeholder: '请选择班组长',
    props: {
      options: props.leaderOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'region_ids',
    label: '主要作业区域',
    type: 'select',
    mode: 'multiple',
    required: true,
    placeholder: '请选择作业区域',
    props: {
      options: props.regionOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'status',
    label: '班组状态',
    type: 'select',
    required: true,
    placeholder: '请选择状态',
    props: {
      options: [
        { label: '正常', value: 'normal' },
        { label: '暂停作业', value: 'paused' },
        { label: '已解散', value: 'disbanded' }
      ]
    }
  },
  {
    key: 'description',
    label: '班组描述',
    type: 'textarea',
    placeholder: '请输入班组描述',
    props: {
      rows: 3,
      maxlength: 500,
      showCount: true
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
.team-form {
  height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>