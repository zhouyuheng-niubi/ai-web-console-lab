<template>
  <div class="manual-create-form">
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
  personnelOptions: {
    type: Array,
    default: () => []
  },
  regionOptions: {
    type: Array,
    default: () => []
  },
  violationTypeOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  task_name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  monitor_time: [{ required: true, message: '请选择监控时间', trigger: 'change' }],
  region_id: [{ required: true, message: '请选择监控区域', trigger: 'change' }],
  location: [{ required: true, message: '请输入监控地点', trigger: 'blur' }],
  person_id: [{ required: true, message: '请选择被监控人员', trigger: 'change' }],
  violation_type: [{ required: true, message: '请选择违规类型', trigger: 'change' }],
  violation_desc: [{ required: true, message: '请输入违规行为描述', trigger: 'blur' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 表单Schema配置
const formSchema = computed(() => [
  {
    key: 'task_name',
    label: '任务名称',
    type: 'input',
    required: true,
    placeholder: '请输入任务名称',
    props: {
      allowClear: true,
      maxlength: 200
    }
  },
  {
    key: 'monitor_time',
    label: '监控时间',
    type: 'datePicker',
    required: true,
    placeholder: '请选择监控时间',
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      style: { width: '100%' },
      disabledDate: (current) => {
        return current && current > dayjs().endOf('day')
      }
    }
  },
  {
    key: 'region_id',
    label: '监控区域',
    type: 'select',
    required: true,
    placeholder: '请选择监控区域',
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
    label: '监控地点',
    type: 'input',
    required: true,
    placeholder: '请输入具体监控地点',
    props: {
      allowClear: true,
      maxlength: 200
    }
  },
  {
    key: 'person_id',
    label: '被监控人员',
    type: 'select',
    required: true,
    placeholder: '请选择被监控人员',
    props: {
      options: props.personnelOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'violation_type',
    label: '违规类型',
    type: 'select',
    required: true,
    placeholder: '请选择违规类型',
    props: {
      options: [
        { label: '未戴安全帽', value: 'no_helmet' },
        { label: '未穿工作服', value: 'no_work_clothes' },
        { label: '未穿安全鞋', value: 'no_safety_shoes' },
        { label: '违规操作', value: 'wrong_operation' },
        { label: '未使用防护用品', value: 'no_protection' },
        { label: '酒后上岗', value: 'alcohol' },
        { label: '疲劳作业', value: 'fatigue' },
        { label: '其他违规', value: 'other' }
      ],
      showSearch: true
    }
  },
  {
    key: 'violation_desc',
    label: '违规行为描述',
    type: 'textarea',
    required: true,
    placeholder: '请详细描述违规行为',
    props: {
      rows: 4,
      maxlength: 500,
      showCount: true
    }
  },
  {
    key: 'violation_analysis',
    label: '行为分析',
    type: 'textarea',
    placeholder: '请分析违规原因和可能造成的后果',
    props: {
      rows: 3,
      maxlength: 300,
      showCount: true
    }
  },
  {
    key: 'risk_level',
    label: '风险等级',
    type: 'select',
    placeholder: '请选择风险等级',
    props: {
      options: [
        { label: '高风险', value: 'high' },
        { label: '中风险', value: 'medium' },
        { label: '低风险', value: 'low' }
      ],
      defaultValue: 'medium'
    }
  },
  {
    key: 'monitor_device',
    label: '监控设备',
    type: 'input',
    placeholder: '请输入监控设备信息',
    props: {
      allowClear: true,
      maxlength: 100
    }
  },
  {
    key: 'evidence_files',
    label: '违规证据',
    type: 'upload',
    props: {
      multiple: true,
      maxCount: 10,
      listType: 'picture-card',
      beforeUpload: (file) => {
        const isImage = file.type.startsWith('image/')
        const isVideo = file.type.startsWith('video/')
        
        if (!isImage && !isVideo) {
          message.error('只能上传图片或视频文件')
          return false
        }
        
        const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
        if (file.size > maxSize) {
          message.error(`文件大小不能超过${isVideo ? '100MB' : '10MB'}`)
          return false
        }
        
        return false
      }
    }
  },
  {
    key: 'remark',
    label: '备注',
    type: 'textarea',
    placeholder: '请输入备注信息',
    props: {
      rows: 2,
      maxlength: 200,
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

    // 设置默认值
    const submitData = { 
      ...formData.value,
      handle_result: 'unprocessed' // 手动创建的默认为未处理
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
.manual-create-form {
  height: 700px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>