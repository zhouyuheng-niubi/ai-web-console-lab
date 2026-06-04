<template>
  <div class="file-upload-with-source">
    <Upload
      v-model:file-list="fileList"
      :list-type="listType"
      :max-count="maxCount"
      :multiple="true"
      :before-upload="beforeUpload"
      :custom-request="() => {}"
      :open-file-dialog-on-click="false"
      @preview="handlePreview"
      @change="handleChange"
      :disabled="disabled"
    >
      <div v-if="fileList.length < maxCount" @click.stop="handleUploadClick">
        <PlusOutlined />
        <div style="margin-top: 8px">{{ uploadText }}</div>
      </div>
    </Upload>

    <Drawer
      v-model:open="showActionSheet"
      :title="drawerTitle"
      placement="bottom"
      :closable="false"
      :mask-closable="true"
      height="auto"
      class="action-sheet-drawer"
    >
      <div class="action-sheet-content">
        <div v-if="showAlbum" class="action-item" @click="handleSelectFromAlbum">
          <div class="action-icon">
            <img src="@/assets/h5/album.svg" alt="相册图标" class="icon" />
          </div>
          <div class="action-text">相册</div>
        </div>
        <div v-if="showCamera" class="action-item" @click="handleTakePhoto">
          <div class="action-icon">
            <img src="@/assets/h5/camera.svg" alt="拍照图标" class="icon" />
          </div>
          <div class="action-text">拍照</div>
        </div>
        <div v-if="showVideo" class="action-item" @click="handleTakeVideo">
          <div class="action-icon">
            <img src="@/assets/h5/video.svg" alt="拍视频图标" class="icon" />
          </div>
          <div class="action-text">拍视频</div>
        </div>
        <div class="format-size-tip text-[#999] text-[12px]">
          注：{{ sizeTip }}
        </div>
      </div>
      <div class="action-sheet-footer">
        <Button block size="large" @click="showActionSheet = false">取消</Button>
      </div>
    </Drawer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Upload, Button, Drawer, message, Modal } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { uploadFile } from '@/api/upload';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  uploadType: {
    type: String,
    default: 'image',
    validator: (value) => ['image', 'video', 'both'].includes(value)
  },
  maxCount: {
    type: Number,
    default: 5
  },
  maxSize: {
    type: Number,
    default: 10
  },
  listType: {
    type: String,
    default: 'picture-card'
  },
  uploadText: {
    type: String,
    default: '上传图片'
  },
  drawerTitle: {
    type: String,
    default: '选择上传方式'
  },
  description: {
    type: String,
    default: '文件上传'
  },
  autoUpload: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change', 'preview']);

const fileList = ref([...props.modelValue]);
const showActionSheet = ref(false);

const showAlbum = computed(() => {
  return props.uploadType === 'image' || props.uploadType === 'both';
});

const showCamera = computed(() => {
  return props.uploadType === 'image' || props.uploadType === 'both';
});

const showVideo = computed(() => {
  return props.uploadType === 'video' || props.uploadType === 'both';
});

const sizeTip = computed(() => {
  if (props.uploadType === 'image') {
    return `图片大小不能超过${props.maxSize}MB，格式支持 JPG、PNG、BMP`;
  } else if (props.uploadType === 'video') {
    return `视频大小不能超过${props.maxSize}MB，格式支持 MP4、AVI`;
  } else {
    return `图片大小不能超过10MB，视频大小不能超过50MB\n图片格式支持 JPG、PNG、BMP，视频格式支持 MP4、AVI`;
  }
});

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (props.uploadType === 'image' && !isImage) {
    message.error('只能上传图片文件!');
    return false;
  }

  if (props.uploadType === 'video' && !isVideo) {
    message.error('只能上传视频文件!');
    return false;
  }

  if (props.uploadType === 'both' && !isImage && !isVideo) {
    message.error('只能上传图片或视频文件!');
    return false;
  }

  const maxSize = isVideo ? 50 : props.maxSize;
  const isLtMaxSize = file.size / 1024 / 1024 <= maxSize;
  if (!isLtMaxSize) {
    message.error(`${isVideo ? '视频' : '图片'}大小不能超过 ${maxSize}MB!`);
    return false;
  }

  return false;
};

const handlePreview = (file) => {
  emit('preview', file);
};

const handleChange = (info) => {
  const file = info.file;
  
  if (file.status === 'uploading') {
    if (!props.autoUpload) {
      const fileData = {
        name: file.name,
        url: URL.createObjectURL(file.originFileObj || file),
        uid: file.uid,
        status: 'done',
        type: file.type,
        size: file.size,
        originFile: file.originFileObj || file
      };
      fileList.value.push(fileData);
      emit('update:modelValue', fileList.value);
      emit('change', info);
      return;
    }

    handleFileUpload({
      file: file,
      onSuccess: (fileData) => {
        const existingIndex = fileList.value.findIndex(f => f.uid === file.uid);
        if (existingIndex >= 0) {
          fileList.value[existingIndex] = { ...fileList.value[existingIndex], ...fileData };
        } else {
          fileList.value.push({ ...fileData, uid: file.uid });
        }
        emit('update:modelValue', fileList.value);
        emit('change', info);
      },
      onError: () => {
        const existingIndex = fileList.value.findIndex(f => f.uid === file.uid);
        if (existingIndex >= 0) {
          fileList.value[existingIndex].status = 'error';
        }
      }
    });
  }
};

const handleFileUpload = async (options) => {
  const { file, onSuccess, onError } = options;
  
  try {
    const result = await uploadFile({
      file: file,
      description: props.description,
      is_public: true,
      wait_for_completion: true
    });

    const fileData = {
      url: result.download_url,
      name: result.original_filename,
      status: 'done',
      type: file.type,
      size: file.size
    };

    onSuccess(fileData, file);
  } catch (error) {
    console.error('文件上传失败:', error);
    message.error('文件上传失败，请重试！');
    onError(error);
  }
};

const handleUploadClick = () => {
  showActionSheet.value = true;
};

const handleSelectFromAlbum = () => {
  const input = document.createElement('input');
  input.type = 'file';
  
  if (props.uploadType === 'video') {
    input.accept = '.mp4,.avi';
    input.multiple = false;
  } else if (props.uploadType === 'image') {
    input.accept = '.jpg,.jpeg,.png';
    input.multiple = true;
  } else {
    input.accept = '.jpg,.jpeg,.png,.bmp,.mp4,.avi';
    input.multiple = true;
  }
  
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach(file => {
        if (fileList.value.length < props.maxCount) {
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');

          if (props.uploadType === 'image' && !isImage) return;
          if (props.uploadType === 'video' && !isVideo) return;
          if (props.uploadType === 'both' && !isImage && !isVideo) return;

          if (isVideo) {
            fileList.value = [];
          } else {
            fileList.value = fileList.value.filter(f => !f.type?.startsWith('video/'));
          }

          processFile(file);
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
      fileList.value = fileList.value.filter(f => !f.type?.startsWith('video/'));
      files.forEach(file => {
        if (fileList.value.length < props.maxCount) {
          processFile(file);
        }
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
    if (file && fileList.value.length < props.maxCount) {
      fileList.value = [];
      processFile(file);
    }
  };
  input.click();
  showActionSheet.value = false;
};

const processFile = async (file) => {
  if (!props.autoUpload) {
    const fileData = {
      name: file.name,
      url: URL.createObjectURL(file),
      uid: Date.now() + Math.random().toString(36).substr(2, 9),
      status: 'done',
      type: file.type,
      size: file.size,
      originFile: file
    };
    fileList.value.push(fileData);
    emit('update:modelValue', fileList.value);
    return;
  }

  try {
    message.loading('文件上传中...', 0);
    
    const result = await uploadFile({
      file: file,
      description: props.description,
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

    fileList.value.push(fileData);
    emit('update:modelValue', fileList.value);
  } catch (error) {
    message.destroy();
    console.error('文件上传失败:', error);
    message.error('文件上传失败，请重试！');
  }
};

watch(() => props.modelValue, (newVal) => {
  fileList.value = [...newVal];
}, { deep: true });
</script>

<style lang="scss" scoped>
.file-upload-with-source {
  :deep(.ant-upload-picture-card-wrapper) {
    .ant-upload-list {
      .ant-upload-list-item {
        border-radius: 8px;
      }
    }

    .ant-upload {
      border-radius: 8px;
      border: 2px dashed #d9d9d9;
      transition: all 0.3s ease;

      &:hover {
        border-color: #1890ff;
      }
    }
  }
}

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
