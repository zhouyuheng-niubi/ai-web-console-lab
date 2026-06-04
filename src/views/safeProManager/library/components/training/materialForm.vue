<template>
  <div class="material-form">
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
  materialTypeOptions: {
    type: Array,
    default: () => []
  },
  sceneOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save'])

const formRef = ref()
const formData = ref({ ...props.formData })

// 表单验证规则
const rules = {
  material_name: [{ required: true, message: '请输入资料名称', trigger: 'blur' }],
  material_type: [{ required: true, message: '请选择资料类型', trigger: 'change' }],
  scene_id: [{ required: true, message: '请选择使用场景', trigger: 'change' }],
  file: [{ required: !props.isEdit, message: '请上传文件', trigger: 'change' }]
}

// 监听formData变化
watch(() => props.formData, (newVal) => {
  formData.value = { ...newVal }
}, { immediate: true, deep: true })

// 表单Schema配置
const formSchema = computed(() => [
  {
    key: 'material_name',
    label: '资料名称',
    type: 'input',
    required: true,
    placeholder: '请输入资料名称',
    props: {
      allowClear: true,
      maxlength: 100
    }
  },
  {
    key: 'material_type',
    label: '资料类型',
    type: 'select',
    required: true,
    placeholder: '请选择资料类型',
    props: {
      options: props.materialTypeOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'scene_id',
    label: '使用场景',
    type: 'select',
    required: true,
    placeholder: '请选择使用场景',
    props: {
      options: props.sceneOptions,
      showSearch: true,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  },
  {
    key: 'file',
    label: '主文件',
    type: 'upload',
    required: !props.isEdit,
    props: {
      multiple: false,
      beforeUpload: (file) => {
        const maxSize = 500 * 1024 * 1024 // 500MB
        
        if (file.size > maxSize) {
          message.error('文件大小不能超过500MB')
          return false
        }
        
        const allowedTypes = [
          'video/mp4', 'video/avi',
          'application/pdf', 
          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/jpeg', 'image/png', 'image/gif',
          'audio/mpeg', 'audio/mp3', 'audio/wav'
        ]
        
        if (!allowedTypes.includes(file.type)) {
          message.error('不支持的文件类型')
          return false
        }
        
        // 如果是视频文件，自动计算时长
        if (file.type.startsWith('video/')) {
          getVideoDuration(file).then(duration => {
            formData.value.duration = Math.round(duration)
          }).catch(() => {
            formData.value.duration = 0
          })
        } else {
          formData.value.duration = 0
        }
        
        // 记录文件大小
        formData.value.file_size = file.size
        
        return false // 阻止自动上传
      }
    }
  },
  {
    key: 'duration',
    label: '素材时长',
    type: 'input',
    placeholder: '自动计算或手动输入（秒）',
    props: {
      type: 'number',
      min: 0,
      addonAfter: '秒'
    }
  },
  {
    key: 'description',
    label: '资料描述',
    type: 'textarea',
    placeholder: '请输入资料描述',
    props: {
      rows: 4,
      maxlength: 500,
      showCount: true
    }
  },
  {
    key: 'attachments',
    label: '相关附件',
    type: 'upload',
    props: {
      multiple: true,
      maxCount: 10,
      beforeUpload: (file) => {
        const maxSize = 100 * 1024 * 1024 // 100MB
        
        if (file.size > maxSize) {
          message.error('附件大小不能超过100MB')
          return false
        }
        
        return false
      }
    }
  },
  {
    key: 'tags',
    label: '标签',
    type: 'select',
    mode: 'tags',
    placeholder: '请输入标签，按回车添加',
    props: {
      allowCreate: true
    }
  },
  {
    key: 'status',
    label: '发布状态',
    type: 'select',
    props: {
      options: [
        { label: '未发布', value: 'unpublished' },
        { label: '已发布', value: 'published' },
        { label: '已下架', value: 'unlisted' }
      ],
      defaultValue: 'unpublished'
    },
    visible: props.isEdit
  }
])

// 获取视频时长
const getVideoDuration = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve(video.duration)
    }
    
    video.onerror = () => {
      resolve(0)
    }
    
    video.src = URL.createObjectURL(file)
  })
}

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
.material-form {
  height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>