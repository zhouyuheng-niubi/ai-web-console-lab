<template>
  <div class="model-setting-container pt-[30px] pb-[30px] px-[30px] flex flex-col overflow-hidden  box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增算法场景</span>
        </span>
      </Button>
    </div>

    <!-- 算法场景列表 (使用 smartTable) -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
      <SmartTable
        ref="smartTableRef"
        :api="apiConfig"
        :columns="columns"
        :search-config="searchConfig"
        :responseConfig="responseConfig"
        :pagination="paginationConfig"
        :paramsFormatter="paramsFormatter"
        searchLayout="horizontal"
        @loadSuccess="handleLoadSuccess"
        @loadError="handleLoadError"
        :searchButtonWrapperSpan="6"
        :immediateSearch="true"
        :actionColumn="actionColumn"
        @action="handleAction"
      >
      </smartTable>
    </div>

    <!-- 新增/编辑算法场景弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="75%"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <AdvancedForm 
        ref="formRef"
        :schema="formSchema" 
        :model="formState" 
        mode="form"
        formLayout="horizontal"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
      >
        <template #detection_rules>
          <div class="detection-rules-container flex flex-wrap gap-[10px] w-full bg-[#F5F5F5] min-h-[50px] p-[10px] rounded-[10px]">
            
            <div class="w-full flex items-center justify-center h-[50px] text-[#515A6E] text-[14px] rounded-[10px]"
             v-if="JSON.stringify(formState.detection_rules) === '{}'">请配置检测规则</div>
          </div>
        </template>    
      </AdvancedForm>
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除算法场景 "{{ currentModel?.name }}" 吗？此操作不可恢复。</p>
      <p class="text-orange-500 mt-2">
        删除后，该算法场景的所有配置将一并清除。
      </p>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { 
  Button, 
  Modal, 
  Tag,
  message,
  Input
} from 'ant-design-vue';
import { 
  PlusOutlined
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
import SmartTable from '@/components/smartTable/index.vue';
import { getModelList, addModel, editModel, removeModel } from '@/api/system/model';
// 引入 smartTable 组件需要的类型
import type { ColumnItem, SearchItem } from '@/types/business';
import {modelOrigin} from '@/utils/constSeting'
// 类型定义
interface DetectionRules {
  fire?: string;
  no_fire?: string;
}

interface Model {
  _id?: string;
  name: string;
  description: string;
  models: string[];
  prompt: string;
  detection_rules: DetectionRules;
  detection_engine: string;
  created_at?: string;
  updated_at?: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增算法场景');
const currentModel = ref<Model>();
const formRef = ref();
const smartTableRef = ref();

// 表单状态
const formState = reactive<Model>({
  _id: undefined,
  name: '',
  description: '',
  models: [],
  prompt: '',
  detection_rules: {},
  detection_engine: 'BOTH',
});

// 表格配置
const responseConfig = {
  listKey: 'detection_types',
  totalKey: 'total',
};

const paginationConfig = {
  pageSize: 7,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['7','10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
};

// 检测模型选项
const detectionEngineOptions = [
  { value: 'YOLO', label: '大模型识别' },
  { value: 'EDGE_BOX', label: '边缘计算' },
];

// 表格列配置
const engineFilter = [{ value: 'BOTH', label: '边缘计算、大模型' }, ...modelOrigin]
const columns: ColumnItem<Model>[] = [
  {
    title: '场景名称',
    dataIndex: 'name',
    key: 'name',
    width: '15%'
  },
  {
    title: '场景描述',
    dataIndex: 'description',
    key: 'description',
    width: '20%',
    ellipsis: true
  },
  {
    title: '检测提示词',
    dataIndex: 'prompt',
    key: 'prompt',
    width: '20%',
    ellipsis: true
  },
  {
    title: '检测模型',
    dataIndex: 'detection_engine',
    key: 'detection_engine',
    width: '12%',
    type:'tag',
    options:engineFilter
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '10%',
    formatter: (value: string) => value ? new Date(value).toLocaleString('zh-CN') : ''
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at',
    key: 'updated_at',
    width: '10%',
    formatter: (value: string) => value ? new Date(value).toLocaleString('zh-CN') : ''
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'name',
    label: '场景名称',
    type: 'input',
    placeholder: '请输入场景名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'detection_engine',
    label: '检测模型',
    type: 'select',
    placeholder: '请选择检测模型',
    props: {
      options: detectionEngineOptions
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 200,
  fixed: 'right',
  actions: [
    {
      label: '编辑',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '删除',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete'
    }
  ]
};

// API 配置
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  const res = await getModelList({
    page: pageNum,
    page_size: pageSize,
    ...rest
  });
  
  return res.data;
};

// 参数格式化函数
const paramsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params
  };

  if (pagination) {
    formattedParams.pageNum = pagination.current || 1;
    formattedParams.pageSize = pagination.pageSize || 10;
  }

  return formattedParams;
};

// 表单配置
const formSchema = computed(() => [
  {
    key: 'name',
    type: 'input',
    label: '场景名称',
    placeholder: '请输入场景名称',
    required: true,
    rules: [
      { required: true, message: '请输入场景名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'description',
    type: 'input',
    label: '场景描述',
    placeholder: '请输入场景描述信息',
    props: {
      type: 'textarea',
      rows: 2,
      maxlength: 200,
      showCount: true
    },
    colSpan: 12
  },
  {
    key: 'models',
    type: 'input',
    label: '使用的模型列表',
    placeholder: '请输入模型列表，以逗号分隔',
    props: {
      placeholder: '请输入模型列表，以逗号分隔'
    },
    formatter: (value: string) => {
      if (!value) return [];
      return value.split(',').map(item => item.trim()).filter(item => item);
    },
    parser: (value: string[]) => {
      if (!value || !Array.isArray(value)) return '';
      return value.join(',');
    },
    colSpan: 12
  },
  {
    key: 'prompt',
    type: 'input',
    label: '检测提示词',
    placeholder: '请输入检测提示词',
    props: {
      type: 'textarea',
      rows: 3
    },
    colSpan: 12
  },
  {
    key: 'detection_engine',
    type: 'checkboxGroup',
    label: '检测模型',
    required: true,
    props: {
      options: detectionEngineOptions
    },
    rules: [
      { required: true, message: '请选择检测模型', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'detection_rules',
    label: '检测规则',
    colSpan: 24,
  }
]);

// 方法
const showAddModal = () => {
  modalTitle.value = '新增算法场景';
  resetForm();
  modalVisible.value = true;
};

const editModelFn = async (record: Model) => {
  try {
    const modelDetail = record;
    modalTitle.value = '编辑算法场景';
    
    Object.assign(formState, {
      _id: modelDetail._id,
      name: modelDetail.name,
      description: modelDetail.description,
      models: modelDetail.models || [],
      prompt: modelDetail.prompt,
      detection_rules: modelDetail.detection_rules || {},
      detection_engine: modelDetail.detection_engine,
    });
    
    modalVisible.value = true;
  } catch (error) {
    console.error('获取算法场景详情失败:', error);
    message.error('获取算法场景详情失败');
  }
};

const confirmDelete = (record: Model) => {
  currentModel.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    
    modalLoading.value = true;
    
    // 格式化models字段
    const formData = { ...formState };
    if (typeof formData.models === 'string') {
      formData.models = formData.models.split(',').map(item => item.trim()).filter(item => item);
    }
    
    if (modalTitle.value === '新增算法场景') {
      // 新增算法场景
      await addModel(formData);
      message.success('新增算法场景成功');
    } else {
      // 编辑算法场景
      await editModel({ _id: formState._id, ...formData });
      message.success('编辑算法场景成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增算法场景' ? '新增算法场景失败' : '编辑算法场景失败');
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

const handleDelete = async () => {
  try {
    if (!currentModel.value) return;
    
    await removeModel(currentModel.value._id);
    
    deleteModalVisible.value = false;
    currentModel.value = undefined;
    message.success('删除算法场景成功');
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除算法场景失败:', error);
    message.error('删除算法场景失败');
  }
};

const resetForm = () => {
  formState._id = undefined;
  formState.name = '';
  formState.description = '';
  formState.models = [];
  formState.prompt = '';
  formState.detection_rules = {};
  formState.detection_engine = 'BOTH';
};

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

// 操作列事件处理
const handleAction = (action: string, record: Model, index: number) => {
  switch (action) {
    case 'edit':
      editModelFn(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

// 检测模型显示配置
const getDetectionEngineColor = (engine: string) => {
  switch (engine) {
    case 'YOLO': return 'blue';
    case 'EDGE_BOX': return 'green';
    case 'BOTH': return 'orange';
    default: return 'default';
  }
};

const getDetectionEngineText = (engine: string) => {
  switch (engine) {
    case 'YOLO': return '大模型识别';
    case 'EDGE_BOX': return '边缘计算';
    case 'BOTH': return '两种方式';
    default: return engine;
  }
};
</script>

<style scoped>
.model-setting-container {
  height: 100%;
  overflow: hidden;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.ant-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.ant-checkbox-wrapper) {
  margin-right: 0;
}

:deep(.ant-checkbox-group) {
  width: 100%;
}

.required-label {
  &::before {
    content: '*';
    color: red;
    margin-right: 2px;
  }
}
</style>
