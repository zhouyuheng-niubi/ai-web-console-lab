import { ref, type Ref, onBeforeUnmount } from 'vue';
import { message,Modal } from 'ant-design-vue';
import { compareRectify, fillRectify } from '@/api/hazard';
import type { OrderDetailData, CompareResultItem } from '../types-list';

/**
 * 使用整改管理
 */
export function useRectification(detailData: Ref<OrderDetailData>) {
  const fillType = ref<'manual' | 'ai'>('manual');
  const rectifyFile = ref<any>([]);
  const isAnalyzing = ref(false);
  const aiAnalyzeController = ref<AbortController | null>(null);
  const aiAnalyzeModalVisible = ref(false);
  const compareList = ref<CompareResultItem[]>([]);
  const currentAnalyzeIndex = ref(0);
  const analysisFailed = ref(false);

  /**
   * AI生成整改说明
   */
  const handleAiDescription = async (onConfirm: () => void) => {
    if (!rectifyFile.value || rectifyFile.value.length === 0) {
      message.error('请上传整改图片');
      return;
    }

    Modal.confirm({
      title: '确认使用AI分析',
      content: '使用AI分析将覆盖当前已填写的整改图片和整改说明，是否继续？',
      onOk: () => {
        onConfirm();
      },
    });
  };

  /**
   * 执行AI分析
   */
  const performAiAnalysis = async () => {
    isAnalyzing.value = true;
    aiAnalyzeController.value = new AbortController();
    analysisFailed.value = false;
    try {
      const result = await fillRectify(
        {
          files: rectifyFile.value,
          hazards: detailData.value.hazardList.map((item, index) => ({
            id: `yh_${index}`,
            hazardDesc: item.hazardDesc,
            hazardName: item.hazardName,
            hazardUrl: item.images[0]?.url || '',
          })),
        },
        aiAnalyzeController.value.signal
      );

      if (result.data) {
        result.data.forEach((item: any) => {
          const index = item.id.split('_')[1];
          detailData.value.hazardList[index].rectifyImages = item.urls.map(
            (url: string) => {
              const name = url.split('/').pop();
              const type = name.split('.').pop();
              return {
                url,
                name,
                type:
                  type === 'jpg'
                    ? 'image/jpeg'
                    : type === 'png'
                    ? 'image/png'
                    : type === 'mp4'
                    ? 'video/mp4'
                    : 'image',
                status: 'done',
              };
            }
          );
          detailData.value.hazardList[index].rectifyDesc = item.content;
        });
        message.success('整改AI分析完成，请确认整改说明和图片');
      }
    } catch (error: any) {
      // 请求被终止时不显示错误
      if (error.name === 'AbortError' || error.name === 'CanceledError') {
        return;
      }
      console.error('AI分析失败:', error);
      message.error('AI分析失败，请重试！');
      analysisFailed.value = true;
    } finally {
      isAnalyzing.value = false;
      aiAnalyzeController.value = null;
    }
  };

  /**
   * 取消AI分析
   */
  const cancelAiAnalysis = () => {
    if (aiAnalyzeController.value) {
      aiAnalyzeController.value.abort();
      aiAnalyzeController.value = null;
      isAnalyzing.value = false;
    }
  };

  /**
   * 整改AI分析
   */
  const handleAiectify = async () => {
    compareList.value = [];
    currentAnalyzeIndex.value = 0;
    aiAnalyzeModalVisible.value = true;
    isAnalyzing.value = true;
    aiAnalyzeController.value = new AbortController();

    for (let i = 0; i < detailData.value.hazardList.length; i++) {
      currentAnalyzeIndex.value = i;
      const hazard = detailData.value.hazardList[i];

      // 检查是否已被终止
      if (aiAnalyzeController.value?.signal.aborted) {
        break;
      }

      try {
        const fileList: any = [...(hazard.rectifyImages || [])];
        const hazardData: any = {
          ...hazard,
          hazardUrl: hazard.images?.length > 0 ? hazard.images[0].url : '',
        };

        delete hazardData.rectifyImages;
        delete hazardData.images;
        delete hazardData.videos;
        delete hazardData.rectifyDesc;
        delete hazardData.area;

        hazardData.fileName = `隐患${i + 1}`;

        const result = await compareRectify({
          files: fileList,
          recognizedHazards: JSON.stringify([hazardData]),
        }, aiAnalyzeController.value.signal);
        if (result.data && result.data) {
          const apiResponse = result.data;
          // Create a new item with the hazard data and API response
          const item: any = {
            fileName: hazardData.fileName,
            hazardName: hazard.hazardName,
            hazardDesc: hazard.hazardDesc,
            images: hazard.images || [],
            rectifyImages: hazard.rectifyImages || [],
            rectifyDesc: hazard.rectifyDesc || '',
            // Add new fields from API response
            rectified: apiResponse?.rectified || false,
            rectificationContent: apiResponse?.rectificationContent || '',
            annotatedHazardImages: apiResponse?.annotatedHazardImages || [],
          };
          compareList.value = [...compareList.value, item];
        }
      } catch (error: any) {
        // 请求被终止时不显示错误
        if (error.name === 'AbortError' || error.name === 'CanceledError') {
          break;
        }
        console.error('AI分析失败:', error);
        // 为失败的隐患添加错误项到compareList
        const errorItem: any = {
          fileName: `隐患${i + 1}`,
          hazardName: hazard.hazardName,
          hazardDesc: hazard.hazardDesc,
          images: hazard.images || [],
          rectifyImages: hazard.rectifyImages || [],
          rectifyDesc: hazard.rectifyDesc || '',
          rectified: false,
          error: 'AI分析失败，请重试',
        };
        compareList.value = [...compareList.value, errorItem];
        message.error(`隐患${i + 1} AI分析失败`);
        // 继续处理其他隐患，不中断整个流程
      }
    }

    isAnalyzing.value = false;
    aiAnalyzeController.value = null;
    currentAnalyzeIndex.value = detailData.value.hazardList.length;
  };

  /**
   * 关闭AI分析弹窗
   */
  const closeAiAnalyzeModal = () => {
    if (isAnalyzing.value) {
      message.warning('分析进行中，请稍候...');
      return;
    }
    aiAnalyzeModalVisible.value = false;
    compareList.value = [];
  };

  /**
   * 强制关闭AI分析弹窗（终止进行中的请求）
   */
  const forceCloseAiAnalyzeModal = () => {
    if (aiAnalyzeController.value) {
      aiAnalyzeController.value.abort();
      aiAnalyzeController.value = null;
    }
    isAnalyzing.value = false;
    aiAnalyzeModalVisible.value = false;
    compareList.value = [];
  };

  /**
   * 重置整改状态
   */
  const resetRectification = () => {
    fillType.value = 'manual';
    rectifyFile.value = [];
    isAnalyzing.value = false;
    aiAnalyzeController.value = null;
    aiAnalyzeModalVisible.value = false;
    compareList.value = [];
    currentAnalyzeIndex.value = 0;
  };

  // 组件卸载时终止进行中的请求
  onBeforeUnmount(() => {
    if (aiAnalyzeController.value) {
      aiAnalyzeController.value.abort();
    }
  });

  return {
    fillType,
    rectifyFile,
    isAnalyzing,
    aiAnalyzeModalVisible,
    compareList,
    currentAnalyzeIndex,
    aiAnalyzeController,
    handleAiDescription,
    performAiAnalysis,
    cancelAiAnalysis,
    handleAiectify,
    closeAiAnalyzeModal,
    forceCloseAiAnalyzeModal,
    resetRectification,
    analysisFailed,
  };
}
