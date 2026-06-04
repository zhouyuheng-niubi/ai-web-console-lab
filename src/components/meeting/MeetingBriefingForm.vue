<template>
  <div class="meeting-briefing-form">
    <AdvancedForm
      :schema="formSchema"
      :model="formData"
      mode="form"
      :colon="false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import AdvancedForm from '@/components/advancedForm/index.vue';

const props = defineProps({
  meetingData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'close'])



// 表单数据
const formData = ref({
  briefing_type: 'standard',
  briefing_content: '',
  risks: [],
  measures: '',
  materials: [],
  remark: ''
})

// 表单Schema配置
const formSchema = computed(() => [
  {
    key: 'briefing_type',
    label: '交底类型',
    type: 'select',
    required: true,
    placeholder: '请选择交底类型',
    props: {
      options: [
        { label: '标准安全交底', value: 'standard' },
        { label: '专项安全交底', value: 'special' },
        { label: '季节性安全交底', value: 'seasonal' },
        { label: '新员工安全交底', value: 'new_employee' }
      ]
    }
  },
  {
    key: 'briefing_content',
    label: '交底内容',
    type: 'textarea',
    required: true,
    placeholder: '请输入安全交底内容...',
    props: {
      rows: 6,
      showCount: true,
      maxlength: 1000
    }
  },
  {
    key: 'risks',
    label: '主要风险',
    type: 'select',
    mode: 'multiple',
    required: true,
    placeholder: '请选择主要风险',
    props: {
      options: [
        { label: '高处坠落', value: 'fall' },
        { label: '物体打击', value: 'hit' },
        { label: '机械伤害', value: 'mechanical' },
        { label: '触电事故', value: 'electric' },
        { label: '火灾爆炸', value: 'fire' },
        { label: '中毒窒息', value: 'poison' },
        { label: '坍塌事故', value: 'collapse' }
      ]
    }
  },
  {
    key: 'measures',
    label: '防范措施',
    type: 'textarea',
    required: true,
    placeholder: '请输入安全防范措施...',
    props: {
      rows: 4,
      showCount: true,
      maxlength: 500
    }
  },
  {
    key: 'materials',
    label: '交底材料',
    type: 'upload',
    props: {
      multiple: true,
      listType: 'text',
      beforeUpload: (file) => {
        // 文件验证逻辑
        return false // 阻止自动上传
      },
      onRemove: (file) => {
        // 移除文件逻辑
      }
    }
  },
  {
    key: 'remark',
    label: '备注',
    type: 'textarea',
    placeholder: '请输入备注信息（可选）...',
    props: {
      rows: 2,
      showCount: true,
      maxlength: 200
    }
  }
])

// 提交表单
const handleSubmit = async () => {
  try {
    // 验证表单数据
    if (!formData.value.briefing_content.trim()) {
      message.error('请填写安全交底内容')
      return
    }

    if (!formData.value.risks || formData.value.risks.length === 0) {
      message.error('请选择主要风险')
      return
    }

    if (!formData.value.measures.trim()) {
      message.error('请填写防范措施')
      return
    }

    // 准备提交数据
    const submitData = {
      meeting_id: props.meetingData.id,
      ...formData.value
    }

    // 调用API提交
    // await submitSafetyBriefing(submitData)
    
    message.success('安全交底提交成功')
    emit('save', submitData)
    
  } catch (error) {
    console.error('提交失败:', error)
    message.error('提交失败，请重试')
  }
}

// 暴露方法给父组件
defineExpose({
  handleSubmit
})
</script>

<style scoped>
.meeting-briefing-form {
   height: 600px;
  overflow: auto;
}
:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.ant-table) {
  border-radius: 8px;
  overflow: hidden;
}

.evaluation-record-content {
  max-height: 500px;
  overflow-y: auto;
}
</style>