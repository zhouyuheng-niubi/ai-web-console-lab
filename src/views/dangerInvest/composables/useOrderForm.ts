import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import { saveHazard, updateHazard } from '@/api/hazard';
import { uploadFile } from '@/api/upload';
import dayjs from 'dayjs';
import type { FileItem, HazardItem, OrderFormState, RecognizedHazard, InitialOrderData } from '../types';

/**
 * 使用工单表单
 */
export function useOrderForm(userInfo: any) {
  const formRef = ref<any>(null);

  const formState = reactive<OrderFormState>({
    images: [],
    videos: [],
    hazardList: [],
    orderName: '',
    registerTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    registerPerson: userInfo?.name || 'admin',
    registerPersonId: userInfo?.id || 2,
    deadline: '',
    fillType:'manual',//填写方式 manual手动填写 ai分析填写
  });

  /**
   * 创建空隐患项
   */
  const createEmptyHazard = (): HazardItem => ({
    images: [],
    videos: [],
    hazardName: '',
    hazardDesc: '',
    area: '',
    hazardLevel: '一般隐患',
    hazardType: '',
    basisRule: '',
    rectifySuggestion: '',
    penaltyStandard: '',
    expanded: true,
  });

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
   * 格式化图片上传结果
   */
  const formatUploadResponse = (result: any, file: any): FileItem => ({
    url: result.data?.download_url || file.url,
    name: result.data?.original_filename || file.name,
    uid: result.data?.id || file.uid,
    status: 'done',
  });

  /**
   * 处理图片上传
   */
  const handleImageUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const result = await uploadFile({
        file,
        description: '隐患图片',
        is_public: true,
        wait_for_completion: true,
      });

      onSuccess(formatUploadResponse(result, file), file);
    } catch (error) {
      console.error('图片上传失败:', error);
      onError(error);
      message.error('图片上传失败，请重试！');
    }
  };

  /**
   * 处理视频上传
   */
  const handleVideoUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const result = await uploadFile({
        file,
        description: '隐患视频',
        is_public: true,
        wait_for_completion: true,
      });

      onSuccess(formatUploadResponse(result, file), file);
    } catch (error) {
      console.error('视频上传失败:', error);
      onError(error);
      message.error('视频上传失败，请重试！');
    }
  };

  /**
   * 初始化表单数据
   */
  const initFormData = (data: InitialOrderData | null) => {
    if (data) {
      formState.id = data.id;
      formState.orderName = data.orderName || '';
      formState.deadline = data.deadline || '';
      formState.registerPerson = data.registerPerson || userInfo?.name || '';
      formState.registerPersonId = data.registerPersonId || userInfo?.id || '';
      formState.registerTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

      formState.images = (data.images || []).map((img) => ({
        url: img.url,
        name: img.name,
        uid: img.uid || Date.now() + Math.random(),
        status: 'done',
        response: { url: img.url },
      }));

      formState.videos = (data.videos || []).map((video) => ({
        url: video.url,
        name: video.name,
        uid: video.uid || Date.now() + Math.random(),
        status: 'done',
        response: { url: video.url },
      }));

      if (data.hazardList && data.hazardList.length > 0) {
        formState.hazardList = data.hazardList.map((hazard) => ({
          ...hazard,
          images: (hazard.images || []).map((img) => ({
            url: img.url,
            name: img.name,
            uid: img.uid || Date.now() + Math.random(),
            status: 'done',
            response: { url: img.url },
          })),
          videos: (hazard.videos || []).map((video) => ({
            url: video.url,
            name: video.name,
            uid: video.uid || Date.now() + Math.random(),
            status: 'done',
            response: { url: video.url },
          })),
          expanded: true,
        }));
      } else {
        formState.hazardList = [createEmptyHazard()];
      }
    } else {
      delete formState.id;
      formState.images = [];
      formState.videos = [];
      formState.hazardList = [createEmptyHazard()];
      formState.orderName = '';
      formState.deadline = '';
      formState.registerTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
      formState.registerPerson = userInfo?.name || '';
      formState.registerPersonId = userInfo?.id || '';
    }
  };

  /**
   * 重置表单
   */
  const resetForm = () => {
    formRef.value?.resetFields();
    formState.images = [];
    formState.videos = [];
    formState.hazardList = [createEmptyHazard()];
    formState.orderName = '';
    formState.deadline = '';
    formState.registerTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    formState.registerPerson = userInfo?.name || '';
    formState.registerPersonId = userInfo?.id || '';
    formState.fillType = 'manual';
  };

  /**
   * 添加隐患
   */
  const addHazard = () => {
    formState.hazardList.unshift(createEmptyHazard());
  };

  /**
   * 删除隐患
   */
  const removeHazard = (index: number) => {
    formState.hazardList.splice(index, 1);
  };

  /**
   * 切换隐患展开状态
   */
  const toggleHazard = (index: number) => {
    formState.hazardList[index].expanded = !formState.hazardList[index].expanded;
  };

  /**
   * 确认AI识别结果
   */
  const confirmAIResults = (recognizedHazards: RecognizedHazard[]) => {
    const finalHazardList = recognizedHazards.filter((item) => item.hazardName && item.hazardLevel);

    if (finalHazardList.length > 0) {
      const firstHazard = formState.hazardList[0];
      const isFirstHazardEmpty =
        !firstHazard.hazardName &&
        !firstHazard.hazardDesc &&
        !firstHazard.hazardType &&
        firstHazard.images.length === 0;

      if (isFirstHazardEmpty) {
        formState.hazardList = [...finalHazardList, ...formState.hazardList.slice(1)];
      } else {
        formState.hazardList = [...finalHazardList, ...formState.hazardList];
      }
      formState.fillType = 'ai';
    }

    message.success('已确认识别结果，请补充隐患信息');
  };

  /**
   * 转换为人工填写
   */
  const convertToManual = (uploadedFiles: { images: any[]; videos: any[] }) => {
    // 处理图片
    if (uploadedFiles.images.length > 0) {
      const imageFiles = uploadedFiles.images.map((item) => ({
        url: item.fileData.url,
        name: item.fileData.name,
        uid: item.fileData.uid,
        status: 'done',
        response: { url: item.fileData.url },
      }));

      if (formState.hazardList.length > 0) {
        formState.hazardList[0].images = imageFiles;
      } else {
        formState.hazardList = [
          {
            ...createEmptyHazard(),
            images: imageFiles,
            expanded: true,
          },
        ];
      }
    }

    // 处理视频
    if (uploadedFiles.videos.length > 0) {
      const videoFiles = uploadedFiles.videos.map((item) => ({
        url: item.fileData.url,
        name: item.fileData.name,
        uid: item.fileData.uid,
        status: 'done',
        response: { url: item.fileData.url },
      }));

      if (formState.hazardList.length > 0) {
        formState.hazardList[0].videos = videoFiles;
      } else {
        formState.hazardList = [
          {
            ...createEmptyHazard(),
            videos: videoFiles,
            expanded: true,
          },
        ];
      }
    }
  };

  /**
   * 验证表单
   */
  const validateForm = async (): Promise<boolean> => {
    if (!formRef.value) return false;

    try {
      await formRef.value.validate();

      if (formState.hazardList.length === 0) {
        message.error('请至少添加一个隐患信息！');
        return false;
      }

      // 验证每个隐患
      for (let i = 0; i < formState.hazardList.length; i++) {
        const hazard = formState.hazardList[i];

        if (!hazard.hazardName) {
          message.error(`隐患 ${i + 1} 的隐患名称不能为空！`);
          return false;
        }
        if (!hazard.hazardDesc) {
          message.error(`隐患 ${i + 1} 的隐患描述不能为空！`);
          return false;
        }

        if (!hazard.area) {
          message.error(`隐患 ${i + 1} 的隐患地点不能为空！`);
          return false;
        }

        if (!hazard.hazardLevel) {
          message.error(`隐患 ${i + 1} 的隐患等级不能为空！`);
          return false;
        }

        if (!hazard.hazardType) {
          message.error(`隐患 ${i + 1} 的隐患类型不能为空！`);
          return false;
        }

        if (hazard.images.length === 0 && hazard.videos.length === 0) {
          message.error(`隐患 ${i + 1} 必须上传图片或视频！`);
          return false;
        }
      }

      // 验证工单信息
      if (!formState.orderName) {
        message.error('请输入工单名称！');
        return false;
      }

      if (!formState.registerTime) {
        message.error('请选择填报时间！');
        return false;
      }

      // if (!formState.deadline) {
      //   message.error('请选择整改期限！');
      //   return false;
      // }

      if (!formState.registerPerson) {
        message.error('请输入填报人员！');
        return false;
      }

      return true;
    } catch (error: any) {
      console.error('表单验证失败:', error);
      if (error && formRef.value) {
        for (let i = 0; i < error.errorFields.length; i++) {
          const field = error.errorFields[i].name;
          formRef.value.scrollToField(field[0], { block: 'center' });
          break;
        }
      }
      return false;
    }
  };

  /**
   * 保存工单
   */
  const saveOrder = async (isEdit: boolean, editId?: string | number) => {
    formState.registerTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const formattedImages = formatFileList(formState.images);
    const formattedVideos = formatFileList(formState.videos);
    const formattedHazardList = formState.hazardList.map((hazard) => ({
      ...hazard,
      images: formatFileList(hazard.images),
      videos: formatFileList(hazard.videos),
    }));

    const hiddenDanger = {
      status: 'hazard_auditing',
      ...formState,
      images: formattedImages,
      videos: formattedVideos,
      hazardList: formattedHazardList,
    };

    try {
      let result;
      if (isEdit && editId) {
        hiddenDanger.id = editId;
        result = await updateHazard(hiddenDanger);
        if (result.code === 200) {
          message.success('工单修改成功！');
        }
      } else {
        result = await saveHazard(hiddenDanger);
        if (result.code === 200) {
          message.success('工单创建成功！');
        }
      }

      return result;
    } catch (error) {
      console.error('保存工单失败:', error);
      message.error('保存工单失败，请重试！');
      return null;
    }
  };

  /**
   * 删除附件
   */
  const removeAttachment = (type: 'image' | 'video', index: number) => {
    if (type === 'image') {
      formState.images.splice(index, 1);
    } else if (type === 'video') {
      formState.videos.splice(index, 1);
    }
  };

  return {
    formRef,
    formState,
    createEmptyHazard,
    initFormData,
    resetForm,
    addHazard,
    removeHazard,
    toggleHazard,
    confirmAIResults,
    convertToManual,
    validateForm,
    saveOrder,
    removeAttachment,
    handleImageUpload,
    handleVideoUpload,
    formatFileList,
  };
}
