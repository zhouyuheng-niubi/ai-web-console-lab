<template>
  <div class="preview-modal" v-if="visible" @click="handleClose">
    <div class="preview-content" @click.stop>
      <div class="preview-header">
        <span class="preview-title">{{ file?.name }}</span>
        <button class="close-btn" @click="handleClose">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="preview-body">
        <Image v-if="file?.type.includes('image')" :src="file?.url" alt="预览图片" />
        <video v-else-if="file?.type.includes('video')" :src="file?.url" controls autoplay></video>
        <div v-else class="file-preview">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          <p>该文件类型不支持预览</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Image } from 'ant-design-vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  file: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  
  .preview-content {
    background: white;
    border-radius: 12px;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #eee;
      
      .preview-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        transition: color 0.3s ease;
        
        &:hover {
          color: #333;
        }
      }
    }
    
    .preview-body {
      flex: 1;
      overflow: auto;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
      
      img,
      image {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
        border-radius: 4px;
      }
      
      video {
        max-width: 100%;
        max-height: 70vh;
        border-radius: 4px;
      }
      
      .file-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #999;
        
        svg {
          margin-bottom: 12px;
        }
        
        p {
          margin: 0;
          font-size: 14px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .preview-modal {
    padding: 10px;
    
    .preview-content {
      max-width: 95vw;
      max-height: 95vh;
      
      .preview-header {
        padding: 12px;
        
        .preview-title {
          font-size: 14px;
        }
      }
      
      .preview-body {
        padding: 12px;
        min-height: 200px;
      }
    }
  }
}
</style>
