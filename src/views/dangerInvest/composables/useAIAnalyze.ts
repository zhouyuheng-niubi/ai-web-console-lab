import { ref, nextTick, onBeforeUnmount } from 'vue';
import { message } from 'ant-design-vue';
import { detectHazard } from '@/api/hazard';
import type { RecognizedHazard, UploadedFileObject } from '../types';

/**
 * 使用AI识别
 */
export function useAIAnalyze() {
  const isAnalyzing = ref(false);
  const aiAnalyzeController = ref<AbortController | null>(null);
  const aiRecognizedHazards = ref<RecognizedHazard[]>([]);
  const selectedHazardIndex = ref(-1);
  const hazardRefs = ref<Record<number, HTMLElement>>({});

  /**
   * 检查图片是否已被识别
   */
  const isRecognizedImage = (file: any, recognizedHazards: RecognizedHazard[]): boolean => {
    if (!recognizedHazards.length) return false;

    for (const hazard of recognizedHazards) {
      if (hazard.images && hazard.images.length > 0) {
        const recognizedImage = hazard.images.find((recognizedImg) => recognizedImg.name === file.name);
        if (recognizedImage) return true;
      }
    }
    return false;
  };

  /**
   * 处理文件点击（关联识别结果）
   */
  const handleFileClick = (
    fileObj: UploadedFileObject,
    recognizedHazards: RecognizedHazard[],
    onFileSelect: (file: any) => void,
    onHazardSelect: (index: number, element: HTMLElement) => void
  ) => {
    const img = fileObj.fileData;

    if (recognizedHazards.length > 0) {
      for (let index = 0; index < recognizedHazards.length; index++) {
        const hazard = recognizedHazards[index];
        if (hazard.images && hazard.images.length > 0) {
          const recognizedImage = hazard.images.find((recognizedImg) => recognizedImg.name === img.name);
          if (recognizedImage) {
            const selectedFile = {
              ...img,
              url: recognizedImage.url,
            };
            onFileSelect(selectedFile);
            selectedHazardIndex.value = index;
            nextTick(() => {
              const hazardElement = hazardRefs.value[index];
              if (hazardElement) {
                hazardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                onHazardSelect(index, hazardElement);
              }
            });
            return;
          }
        }
      }
    }

    onFileSelect(img);
    selectedHazardIndex.value = -1;
  };

  /**
   * 执行AI分析
   */
  const performAIAnalyze = async (
    uploadedFiles: { images: UploadedFileObject[]; videos: UploadedFileObject[] },
    isReAnalyze: boolean = false
  ): Promise<boolean> => {
    try {
      isAnalyzing.value = true;
      selectedHazardIndex.value = -1;
      hazardRefs.value = {};

      const allFiles = [
        ...uploadedFiles.images.map((item) => item.file),
        ...uploadedFiles.videos.map((item) => item.file)
      ];

      if (allFiles.length === 0) {
        message.error('请先上传图片或视频！');
        return false;
      }

      aiAnalyzeController.value = new AbortController();

      const detectResult = await detectHazard(
        {
          files: allFiles,
          description: 'AI隐患识别',
        },
        aiAnalyzeController.value.signal
      );

      // 处理有隐患结果的
      const recognizedHazards = (detectResult.data && detectResult.data.length > 0)
        ? detectResult.data
            .filter((item: any) => item.hazardUrl)
            .map((item: any) => ({
              images: item.hazardUrl
                ? [
                    {
                      url: item.hazardUrl,
                      name: item.fileName || '隐患图片',
                      status: 'done',
                    },
                  ]
                : [],
              videos: [],
              hazardName: item.hazardName || '',
              hazardDesc: item.hazardDesc || '',
              area: '',
              hazardLevel: item.hazardLevel || '一般隐患',
              hazardType: item.hazardType || '',
              basisRule: item.basisRule || '',
              rectifySuggestion: item.rectifySuggestion || '',
              penaltyStandard: item.penaltyStandard || '',
              expanded: true,
            }))
        : [];

      // 添加未识别到隐患的图片
      const unrecognizeImages = uploadedFiles.images.filter(
        (item) => !isRecognizedImage(item.fileData, recognizedHazards)
      );
      aiRecognizedHazards.value = [
        ...recognizedHazards,
        ...unrecognizeImages.map((item) => ({
          images: [item.fileData],
          videos: [],
          hazardName: '',
          hazardDesc: '',
          area: '',
          hazardLevel: '',
          hazardType: '',
          basisRule: '',
          rectifySuggestion: '',
          penaltyStandard: '',
          expanded: true,
        })),
      ];

      message.success(isReAnalyze ? 'AI重新识别完成！' : 'AI识别完成！');
      return true;
    } catch (error: any) {
      if (error.name === 'AbortError' || error.name === 'CanceledError') {
        // 请求被终止，不提示任何信息
      } else {
        console.error('AI识别失败:', error);
        message.error('AI识别失败，请重试！');
      }
      return false;
    } finally {
      isAnalyzing.value = false;
      aiAnalyzeController.value = null;
    }
  };

  /**
   * 取消AI分析
   */
  const cancelAIAnalyze = () => {
    if (aiAnalyzeController.value) {
      aiAnalyzeController.value.abort();
      message.info('正在取消AI识别...');
    }
  };

  /**
   * 删除识别到的隐患
   */
  const removeRecognizedHazard = (index: number) => {
    aiRecognizedHazards.value.splice(index, 1);
  };

  /**
   * 重置AI识别状态
   */
  const resetAIState = () => {
    aiRecognizedHazards.value = [];
    selectedHazardIndex.value = -1;
    hazardRefs.value = {};
    aiAnalyzeController.value = null;
  };

  // 组件卸载时终止进行中的AI识别请求
  onBeforeUnmount(() => {
    if (aiAnalyzeController.value) {
      aiAnalyzeController.value.abort();
    }
  });

  return {
    isAnalyzing,
    aiRecognizedHazards,
    selectedHazardIndex,
    hazardRefs,
    isRecognizedImage,
    handleFileClick,
    performAIAnalyze,
    cancelAIAnalyze,
    removeRecognizedHazard,
    resetAIState,
  };
}
