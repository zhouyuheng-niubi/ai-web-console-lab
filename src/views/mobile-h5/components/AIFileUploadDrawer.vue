<template>
  <Drawer
    v-model:open="showActionSheet"
    title="选择上传方式"
    placement="bottom"
    :closable="false"
    :mask-closable="true"
    height="auto"
    class="action-sheet-drawer"
  >
    <div class="action-sheet-content">
      <div class="action-item" @click="handleSelectFromAlbum">
        <div class="action-icon">
          <img src="@/assets/h5/album.svg" alt="相册图标" class="icon" />
        </div>
        <div class="action-text">相册</div>
      </div>
      <div class="action-item" @click="handleTakePhoto">
        <div class="action-icon">
          <img src="@/assets/h5/camera.svg" alt="拍照图标" class="icon" />
        </div>
        <div class="action-text">拍照</div>
      </div>
      <div class="action-item" @click="handleTakeVideo">
        <div class="action-icon">
          <img src="@/assets/h5/video.svg" alt="拍视频图标" class="icon" />
        </div>
        <div class="action-text">拍视频</div>
      </div>
      <div class="format-size-tip text-[#999] text-[12px]">
        注：图片大小不能超过10MB，视频大小不能超过50MB<br>
        图片格式支持 JPG、PNG、GIF、BMP，视频格式支持 MP4、AVI、MOV、WMV<br>
      </div>
    </div>
    <div class="action-sheet-footer">
      <Button block size="large" @click="showActionSheet = false">取消</Button>
    </div>
  </Drawer>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Drawer, Button, message } from 'ant-design-vue';
import { uploadFile } from '@/api/upload';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'file-uploaded']);

const showActionSheet = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  showActionSheet.value = newVal;
});

watch(showActionSheet, (newVal) => {
  emit('update:modelValue', newVal);
});

const processFile = async (file, type = 'auto') => {
  try {
    message.loading('文件上传中...', 0);
    
    const result = await uploadFile({
      file: file,
      description: type === 'auto' ? (file.type.startsWith('image/') ? 'AI分析图片' : 'AI分析视频') : (type === 'image' ? 'AI分析图片' : 'AI分析视频'),
      is_public: true,
      wait_for_completion: true
    });
    message.destroy();

    const fileData = {
      name: result.data?.original_filename || file.name,
      url: result.data?.download_url || file.url,
      uid: result.data?.id || Date.now() + Math.random().toString(36).substr(2, 9),
      status: 'done',
      type: file.type,
      size: file.size
    };

    emit('file-uploaded', fileData, file);
  } catch (error) {
    message.destroy();
    console.error('文件上传失败:', error);
    message.error('文件上传失败，请重试！');
  }
};

const handleSelectFromAlbum = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.jpg,.jpeg,.png,.bmp,.mp4,.avi';
  input.multiple = true;
  
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          processFile(file, 'image');
        } else if (file.type.startsWith('video/')) {
          processFile(file, 'video');
        }
      });
    }
  };
  input.click();
  showActionSheet.value = false;
};

const handleTakePhoto = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.multiple = true;
  
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach(file => {
        processFile(file, 'image');
      });
    }
  };
  input.click();
  showActionSheet.value = false;
};

const handleTakeVideo = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*';
  input.capture = 'environment';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file, 'video');
    }
  };
  input.click();
  showActionSheet.value = false;
};
</script>

<style lang="scss" scoped>
.action-sheet-drawer {
  :deep(.ant-drawer-content) {
    border-radius: 20px 20px 0 0;
  }

  :deep(.ant-drawer-header) {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;

    .ant-drawer-title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  :deep(.ant-drawer-body) {
    padding: 0;
  }

  .action-sheet-content {
    padding: 20px 24px;

    .action-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-radius: 12px;
      background: #f5f7fa;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:last-child {
        margin-bottom: 0;
      }

      &:active {
        transform: scale(0.98);
        background: #e8eaf0;
      }

      .action-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;

        img {
          width: 24px;
          height: 24px;
        }
      }

      .action-text {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
    }
  }

  .action-sheet-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
