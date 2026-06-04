<template>
  <div class="attachment-item" >
    <div class="attachment-preview">
      <Image v-if="file.type === 'image'" :src="file.url" alt="附件预览" />
      <div v-else-if="file.type === 'video'" class="video-placeholder" @click="handleClick">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span>视频</span>
      </div>
      <div v-else class="file-placeholder" @click="handleClick">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
        <span>{{ file.name }}</span>
      </div>
    </div>
    <div class="attachment-info">
      <span class="attachment-name">{{ file.name }}</span>
      <span class="attachment-size">{{ file.size }}</span>
    </div>
  </div>
</template>

<script setup>
import { Image } from 'ant-design-vue'

defineProps({
  file: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.attachment-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e6f7ff;
    border-color: #1890ff;
  }
  
  &:active {
    transform: scale(0.98);
  }
}

.attachment-preview {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .video-placeholder,
  .file-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 12px;
    
    svg {
      margin-bottom: 4px;
    }
  }
}

.attachment-info {
  flex: 1;
  
  .attachment-name {
    display: block;
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
    word-break: break-all;
  }
  
  .attachment-size {
    font-size: 12px;
    color: #999;
  }
}
</style>
