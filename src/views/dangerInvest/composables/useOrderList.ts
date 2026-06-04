import { ref, type Ref } from 'vue';
import { message } from 'ant-design-vue';
import { updateHazard, deleteHazard, compareRectify } from '@/api/hazard';
import type { OrderDetailData, HazardListItem, CompareResultItem, AIAnalysisState } from '../types-list';

/**
 * 使用工单列表
 */
export function useOrderList(smartTableRef: Ref<any>) {
  const loading = ref(false);
  const detailData = ref<OrderDetailData>({} as any);
  const detailModalVisible = ref(false);
  const isDetail = ref(false);

  /**
   * 删除工单
   */
  const deleteOrder = async (id: string | number) => {
    try {
      await deleteHazard(id);
      message.success('删除工单成功');
      smartTableRef.value?.refresh();
    } catch (error) {
      console.error('删除工单失败:', error);
      message.error('删除工单失败');
    }
  };

  /**
   * 更新工单数据
   */
  const updateOrderData = async (options: {
    data: OrderDetailData;
    status?: string;
    successMessage?: string;
    errorMessage?: string;
    closeModal?: boolean;
    refreshTable?: boolean;
    additionalFields?: Record<string, any>;
  }): Promise<boolean> => {
    const {
      data,
      status,
      successMessage = '更新成功',
      errorMessage = '更新失败，请重试！',
      closeModal = true,
      refreshTable = true,
      additionalFields = {},
    } = options;

    loading.value = true;
    try {
      const updateData: any = { ...data, ...additionalFields };
      if (status) {
        updateData.status = status;
      }

      const result = await updateHazard(updateData);
      if (result.code === 200) {
        message.success(successMessage);
        if (closeModal) {
          detailModalVisible.value = false;
        }
        if (refreshTable) {
          smartTableRef.value?.refresh();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error(errorMessage, error);
      message.error(errorMessage);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 打开详情弹窗
   */
  const openDetailModal = (record: OrderDetailData, isDetailView: boolean = false) => {
    detailData.value = { ...record };
    isDetail.value = isDetailView;
    detailModalVisible.value = true;
  };

  /**
   * 关闭详情弹窗
   */
  const closeDetailModal = () => {
    detailModalVisible.value = false;
    detailData.value = {} as any;
  };

  return {
    loading,
    detailData,
    detailModalVisible,
    isDetail,
    deleteOrder,
    updateOrderData,
    openDetailModal,
    closeDetailModal,
  };
}
