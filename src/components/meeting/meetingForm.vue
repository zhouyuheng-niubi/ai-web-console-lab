<!-- components/meeting/meetingForm.vue -->
<template>
  <div class="meeting-form">
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
  teamOptions: {
    type: Array,
    default: () => []
  },
  personnelOptions: {
    type: Array,
    default: () => []
  },
  areaOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  meeting_name: [{ required: true, message: '请输入会议名称', trigger: 'blur' }],
  team_id: [{ required: true, message: '请选择发起班组', trigger: 'change' }],
  host_id: [{ required: true, message: '请选择主持人', trigger: 'change' }],
  start_time: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  area_id: [{ required: true, message: '请选择会议地点', trigger: 'change' }],
  risk_level: [{ required: true, message: '请选择风险等级', trigger: 'change' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 表单Schema配置
const formSchema = computed(() => [
  {
    key: 'meeting_name',
    label: '会议名称',
    type: 'input',
    required: true,
    placeholder: '请输入会议名称',
    props: {
      allowClear: true,
      maxlength: 200
    }
  },
  {
    key: 'team_id',
    label: '发起班组',
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
    key: 'host_id',
    label: '主持人',
    type: 'select',
    required: true,
    placeholder: '请选择主持人',
    props: {
      options: props.personnelOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'start_time',
    label: '会议时间',
    type: 'datePicker',
    required: true,
    placeholder: '请选择会议时间',
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: 'YYYY-MM-DD HH:mm',
      style: { width: '100%' },
      disabledDate: (current) => {
        return current && current < dayjs().startOf('day')
      }
    }
  },
  {
    key: 'area_id',
    label: '会议地点',
    type: 'select',
    required: true,
    placeholder: '请选择会议地点',
    props: {
      options: props.areaOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'risk_level',
    label: '风险等级',
    type: 'select',
    required: true,
    placeholder: '请选择风险等级',
    props: {
      options: [
        { label: '低风险', value: 'low' },
        { label: '中风险', value: 'medium' },
        { label: '高风险', value: 'high' }
      ]
    }
  },
  {
    key: 'expected_attendees',
    label: '应到人数',
    type: 'input',
    placeholder: '请输入应到人数',
    props: {
      min: 1,
      max: 100,
      style: { width: '100%' }
    }
  },
  {
    key: 'description',
    label: '会议描述',
    type: 'textarea',
    placeholder: '请输入会议详细描述和议程',
    props: {
      rows: 4,
      maxlength: 1000,
      showCount: true
    }
  },
  {
    type: 'divider',
    content: '参会人员',
    orientation: 'left'
  },
  {
    key: 'attendee_ids',
    label: '参会人员',
    type: 'treeSelect',
    mode: 'multiple',
    placeholder: '请选择参会人员',
    // props: {
    //   options: props.personnelOptions,
    //   showSearch: true,
     
    //   // filterOption: (input, option) => {
    //   //   return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
    //   // }
    // },
       props: {
      treeData: props.personnelOptions,
      treeCheckable: true,
      fieldNames:{
        children: 'children',
        label: 'name',
        value: 'id',
      }
    },
  },
  {
    type: 'divider',
    content: '会议准备',
    orientation: 'left'
  },
  {
    key: 'agenda',
    label: '会议议程',
    type: 'textarea',
    placeholder: '请输入详细的会议议程安排',
    props: {
      rows: 4,
      maxlength: 2000,
      showCount: true
    }
  },
  {
    key: 'preparation',
    label: '准备工作',
    type: 'textarea',
    placeholder: '请输入需要提前准备的物品、资料等',
    props: {
      rows: 3,
      maxlength: 500,
      showCount: true
    }
  },
  {
    key: 'notes',
    label: '注意事项',
    type: 'textarea',
    placeholder: '请输入会议注意事项',
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

    // 验证时间逻辑
    if (formData.value.start_time) {
      const startTime = dayjs(formData.value.start_time)
      
      if (startTime.isBefore(dayjs())) {
        message.error('会议时间不能早于当前时间')
        return
      }

      // 如果是新建会议，根据会议时间设置状态
      if (!props.isEdit) {
        const timeDiff = startTime.diff(dayjs(), 'hour')
        if (timeDiff <= 1) {
          formData.value.status = 'in_progress'
        } else {
          formData.value.status = 'pending'
        }
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
.meeting-form {
  height: 700px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>