<template>
  <div class="reject-modal" v-if="visible" @click="handleCancel">
    <div class="reject-modal-content" @click.stop>
      <div class="reject-modal-header">
        <span class="reject-modal-title">拒绝整改</span>
        <button class="close-btn" @click="handleCancel">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="reject-modal-body">
        <p class="reject-modal-label">请输入拒绝原因：</p>
        <Textarea v-model:value="reason" :autoSize="{ minRows: 4, maxRows: 6 }" :maxlength="200" showCount placeholder="请输入拒绝原因" size="large"></Textarea>
      </div>
      <div class="reject-modal-footer">
        <Button size="medium" @click="handleCancel">取消</Button>
        <Button type="primary" danger size="medium" class="border-none" @click="handleConfirm">确认拒绝</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Button, Textarea } from 'ant-design-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const reason = ref('')

watch(() => props.visible, (newVal) => {
  if (newVal) {
    reason.value = ''
  }
})

const handleCancel = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm', reason.value)
}
</script>

<style lang="scss" scoped>
.reject-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  
  .reject-modal-content {
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .reject-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #eee;
      
      .reject-modal-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
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
    
    .reject-modal-body {
      padding: 20px;
      
      .reject-modal-label {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: #666;
      }
    }
    
    .reject-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid #eee;
    }
  }
}

@media (max-width: 480px) {
  .reject-modal {
    padding: 10px;
    
    .reject-modal-content {
      max-width: 95vw;
      
      .reject-modal-header {
        padding: 12px 16px;
        
        .reject-modal-title {
          font-size: 14px;
        }
      }
      
      .reject-modal-body {
        padding: 16px;
      }
      
      .reject-modal-footer {
        padding: 12px 16px;
      }
    }
  }
}
</style>
