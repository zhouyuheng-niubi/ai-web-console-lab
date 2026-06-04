import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { uploadFile } from '@/api/upload';
import type { FileItem, UploadedFileObject } from '../types';

/**
 * 文件上传配置
 */
interface UploadConfig {
  maxImageCount?: number;
  maxVideoCount?: number;
  maxImageSize?: number; // MB
  maxVideoSize?: number; // MB
  allowedImageTypes?: string[];
  allowedVideoTypes?: string[];
}

/**
 * 使用文件上传
 */
export function useFileUpload(config: UploadConfig = {}) {
  const {
    maxImageCount = 5,
    maxVideoCount = 1,
    maxImageSize = 10,
    maxVideoSize = 50,
    allowedImageTypes = ['image/jpeg', 'image/png', 'image/bmp'],
    allowedVideoTypes = ['video/mp4', 'video/avi'],
  } = config;

  const uploadedFiles = reactive<{
    images: UploadedFileObject[];
    videos: UploadedFileObject[];
  }>({
    images: [],
    videos: [],
  });

  /**
   * 格式化文件大小
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  /**
   * 验证文件类型和大小
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return { valid: false, error: '只能上传图片或视频文件！' };
    }

    if (isImage) {
      if (file.size / 1024 / 1024 > maxImageSize) {
        return { valid: false, error: `图片大小不能超过${maxImageSize}MB！` };
      }
      if (!allowedImageTypes.includes(file.type)) {
        return {
          valid: false,
          error: `图片格式只支持 ${allowedImageTypes.map(t => t.split('/')[1].toUpperCase()).join('、')}！`,
        };
      }
      if (uploadedFiles.images.length >= maxImageCount) {
        return { valid: false, error: `图片数量已达上限（${maxImageCount}张）` };
      }
    }

    if (isVideo) {
      if (file.size / 1024 / 1024 > maxVideoSize) {
        return { valid: false, error: `视频大小不能超过${maxVideoSize}MB！` };
      }
      if (!allowedVideoTypes.includes(file.type)) {
        return {
          valid: false,
          error: `视频格式只支持 ${allowedVideoTypes.map(t => t.split('/')[1].toUpperCase()).join('、')}！`,
        };
      }
      if (uploadedFiles.videos.length >= maxVideoCount) {
        return { valid: false, error: `视频数量已达上限（${maxVideoCount}个）` };
      }
    }

    return { valid: true };
  };

  /**
   * 上传文件
   */
  const uploadSingleFile = async (
    file: File,
    description: string
  ): Promise<FileItem | null> => {
    try {
      const result = await uploadFile({
        file,
        description,
        is_public: true,
        wait_for_completion: true,
      });

      return {
        url: result.data?.download_url || file.url,
        name: result.data?.original_filename || file.name,
        uid: result.data?.id || Date.now() + Math.random().toString(36).substr(2, 9),
        status: 'done',
        type: file.type,
        size: file.size,
      };
    } catch (error) {
      console.error('文件上传失败:', error);
      return null;
    }
  };

  /**
   * 处理文件上传（用于AI识别）
   */
  const handleAIFileUpload = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      message.error(validation.error);
      return null;
    }

    const loadingMessage = message.loading('文件上传中...', 0);
    const fileData = await uploadSingleFile(
      file,
      file.type.startsWith('image/') ? 'AI识别图片' : 'AI识别视频'
    );
    message.destroy();

    if (!fileData) {
      message.error('文件上传失败，请重试！');
      return null;
    }

    const fileType = file.type.startsWith('image/') ? 'image' : 'video';
    const fileObj: UploadedFileObject = { file, fileData };

    if (fileType === 'image') {
      uploadedFiles.videos = []; // 上传图片时清空视频
      uploadedFiles.images.push(fileObj);
    } else {
      uploadedFiles.images = []; // 上传视频时清空图片
      uploadedFiles.videos.push(fileObj);
    }

    return fileObj;
  };

  /**
   * 批量上传文件
   */
  const uploadMultipleFiles = async (files: File[]): Promise<UploadedFileObject[]> => {
    const results: UploadedFileObject[] = [];

    for (const file of files) {
      const fileObj = await handleAIFileUpload(file);
      if (fileObj) {
        results.push(fileObj);
      }
    }

    return results;
  };

  /**
   * 格式化文件列表
   */
  const formatFileList = (files: FileItem[]) => {
    if (!files || files.length === 0) return [];
    return files.map((file) => ({
      url: file.response?.url || file.url,
      name: file.response?.name || file.name,
      type: file.type,
    }));
  };

  /**
   * 清空上传的文件
   */
  const clearUploadedFiles = () => {
    uploadedFiles.images = [];
    uploadedFiles.videos = [];
  };

  return {
    uploadedFiles,
    formatFileSize,
    validateFile,
    uploadSingleFile,
    handleAIFileUpload,
    uploadMultipleFiles,
    formatFileList,
    clearUploadedFiles,
  };
}
