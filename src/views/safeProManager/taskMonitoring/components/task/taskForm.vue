<template>
  <div class="task-form">
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
  meetingOptions: {
    type: Array,
    default: () => []
  },
  taskTypeOptions: {
    type: Array,
    default: () => []
  },
  teamOptions: {
    type: Array,
    default: () => []
  },
  personnelOptions: {
    type: Array,
    default: () => []
  },
  equipmentOptions: {
    type: Array,
    default: () => []
  },
  materialOptions: {
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
  meeting_id: [{ required: true, message: '请选择会议', trigger: 'change' }],
  task_type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  team_id: [{ required: true, message: '请选择分配班组', trigger: 'change' }],
  start_time: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  end_time: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 表单Schema配置
const formSchema = computed(() => [
  {
    key: 'meeting_id',
    label: '会议名称',
    type: 'select',
    required: true,
    placeholder: '请选择会议',
    props: {
      options: props.meetingOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
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
    key: 'task_type',
    label: '任务类型',
    type: 'select',
    required: true,
    placeholder: '请选择任务类型',
    props: {
      options: [
        { label: '设备维护', value: 'maintenance' },
        { label: '设备维修', value: 'repair' },
        { label: '安全检查', value: 'inspection' },
        { label: '设备安装', value: 'installation' },
        { label: '培训任务', value: 'training' },
        { label: '文档整理', value: 'documentation' },
        { label: '其他任务', value: 'other' }
      ],
      showSearch: true
    }
  },
  {
    key: 'team_id',
    label: '分配班组',
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
    key: 'responsible_person_id',
    label: '负责人',
    type: 'select',
    placeholder: '请选择负责人',
    props: {
      options: props.personnelOptions.filter((p: any) => p.can_be_responsible),
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'collaborative_person_ids',
    label: '协同人员',
    type: 'select',
    mode: 'multiple',
    placeholder: '请选择协同人员',
    props: {
      options: props.personnelOptions.filter((p: any) => p.can_collaborate),
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'start_time',
    label: '开始时间',
    type: 'datePicker',
    required: true,
    placeholder: '请选择开始时间',
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
    placeholder: '请选择结束时间',
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
    key: 'description',
    label: '任务描述',
    type: 'textarea',
    placeholder: '请输入任务详细描述',
    props: {
      rows: 4,
      maxlength: 1000,
      showCount: true
    }
  },
  {
    type: 'divider',
    content: '资源清单',
    orientation: 'left'
  },
  {
    key: 'equipment_list',
    label: '所需设备',
    type: 'select',
    props: {
      items: formData.value.equipment_list || [],
      columns: [
        {
          title: '设备名称',
          dataIndex: 'equipment_id',
          type: 'select',
          props: {
            options: props.equipmentOptions,
            placeholder: '选择设备',
            style: { width: '200px' }
          }
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          type: 'input-number',
          props: {
            min: 1,
            style: { width: '100px' }
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          type: 'input',
          props: {
            placeholder: '备注',
            style: { width: '150px' }
          }
        }
      ],
      addText: '添加设备'
    }
  },
  {key: 'material_id',
          label: '物料名称',
          dataIndex: 'material_id',
          type: 'select',
          props: {
            options: props.materialOptions,
            placeholder: '选择物料',
            style: { width: '200px' }
          }
        },
  {
    key: 'material_list',
    label: '所需物料',
    type: 'select',
    props: {
      items: formData.value.material_list || [],
      columns: [
        {
          title: '物料名称',
          dataIndex: 'material_id',
          type: 'select',
          props: {
            options: props.materialOptions,
            placeholder: '选择物料',
            style: { width: '200px' }
          }
        },
        {
          title: '数量',
          dataIndex: 'quantity',
          type: 'input-number',
          props: {
            min: 1,
            style: { width: '100px' }
          }
        },
        {
          title: '规格',
          dataIndex: 'specification',
          type: 'input',
          props: {
            placeholder: '规格',
            style: { width: '120px' }
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          type: 'input',
          props: {
            placeholder: '备注',
            style: { width: '150px' }
          }
        }
      ],
      addText: '添加物料'
    }
  },
  {
    type: 'divider',
    content: '安全要求',
    orientation: 'left'
  },
  {
    key: 'safety_requirements',
    label: '安全要求',
    type: 'textarea',
    placeholder: '请输入安全注意事项和防护要求',
    props: {
      rows: 4,
      maxlength: 500,
      showCount: true
    }
  },
  {
    key: 'precautions',
    label: '特别注意事项',
    type: 'textarea',
    placeholder: '请输入特别注意事项',
    props: {
      rows: 3,
      maxlength: 300,
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
    if (formData.value.start_time && formData.value.end_time) {
      const start = dayjs(formData.value.start_time)
      const end = dayjs(formData.value.end_time)
      
      if (end.isBefore(start)) {
        message.error('结束时间不能早于开始时间')
        return
      }
      
      // 如果是新建任务且未开始时间晚于当前时间，设置状态为未开始
      if (!props.isEdit && start.isAfter(dayjs())) {
        formData.value.status = 'not_started'
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
.task-form {
  height: 700px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>