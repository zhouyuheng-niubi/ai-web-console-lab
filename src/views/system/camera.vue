<template>
  <div class="camera-container pt-[30px] pb-[30px] px-[30px] flex flex-col overflow-hidden  box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增摄像头</span>
        </span>
      </Button>
    </div>

    <!-- 摄像头列表 (使用 smartTable) -->
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
        <!-- 状态显示插槽 -->
        <template #cell-status="{ record }">
          <Badge 
            :status="getStatusConfig(record.status).badgeStatus" 
            :text="getStatusConfig(record.status).text"
          />
        </template>
      </smartTable>
    </div>

    <!-- 新增/编辑摄像头弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="75%"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <CameraForm 
        ref="formRef"
        :initialData="currentCamera"
        :regionTree="regionTree"
        :riskFactorsOptions="riskFactorsOptions"
        :sceneTypesOptions="sceneTypesOptions"
        :modelParams="modelParams"
      />
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除摄像头 "{{ currentCamera?.camera_name }}" 吗？此操作不可恢复。</p>
      <p class="text-orange-500 mt-2">
        删除后，该摄像头的所有检测记录和配置将一并清除。
      </p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { 
  Button, 
  Modal, 
  Badge,
  message
} from 'ant-design-vue';
import { 
  PlusOutlined
} from '@ant-design/icons-vue';
import CameraForm from '@/components/CameraForm/index.vue';
import { getCameraList, addCamera, editCamera, removeCamera } from '@/api/system/camera';
import {getDangerList} from '@/api/system/trigger'
// 定义表格列配置类型
interface ColumnItem<T = any> {
  dataIndex: string;
  key?: string;
  title: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  options?: any[];
  // SmartTable扩展属性
  slot?: string;
  type?: 'tag' | 'switch' | 'radio' | 'checkbox' | 'badge' | 'rate' | 'progress' | 'date' | 'date-range' | 'select' | 'image' | 'text';
  componentProps?: (value: any, record: T) => Record<string, any>;
  edit?: any;
  formatter?: (value: any, record: T) => string;
  render?: (value: any, record: T, index: number) => string;
}

// 定义搜索项类型
interface SearchItem {
  field: string;
  label: string;
  type: string;
  placeholder?: string;
  props?: any;
  colSpan?: number;
}
import {baseStatus,cameraTypes,getAllTypeList} from '../../utils/constSeting'
import dayjs from 'dayjs'
import { getRegionList } from '@/api/system/region';
import { getModelConfig } from '@/api/system/model';

// 类型定义
interface Camera {
  _id: string;
  camera_name: string;
  camera_desc?: string;
  region_id: string;
  stream_url: string;
  status: string;
  camera_type: string;
  location: string;
  algorithms?: string[];
  createTime?: string;
  updateTime?: string;
  scene_engines?: any;
  scene_configs?: any;
  auto_switch_model?: boolean;
  risk_factors?: string[];
  scenes?: string[];
  camera_id?: string;
  modal_origin?: string;
  business_type?: string;
}


// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增摄像头');
const currentCamera = ref<any>({});
const formRef = ref();
const smartTableRef = ref();
const regionTree = ref<any[]>([]);
const regionList = ref<any[]>([]);
const modelParams = ref<any>({});
const riskFactorsOptions = ref([]);
const sceneTypesOptions = ref([]);

// 表格配置
const responseConfig = {
  listKey: 'cameras',
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

// 表格列配置
const columns: ColumnItem<Camera>[] = [
  {
    title: '摄像头名称',
    dataIndex: 'camera_name',
    key: 'camera_name',
    width: '25%'
  },
  {
    title: '所属区域',
    dataIndex: 'region_id',
    key: 'region_id',
    width: '15%',
    ellipsis: true,
    formatter: (value: string) => {
     return regionList.value.find(item => item.value === value)?.label
    }
  },
  // {
  //   title: '摄像头描述',
  //   dataIndex: 'camera_desc',
  //   key: 'camera_desc',
  //   ellipsis: true
  // },
  // {
  //   title: '流地址',
  //   dataIndex: 'stream_url',
  //   key: 'stream_url',
  //   ellipsis: true
  // },
  {
    title: '摄像头类型',
    dataIndex: 'camera_type',
    key: 'camera_type',
    width: '10%'
  },
  {
    title: '业务类型',
    dataIndex: 'business_type',
    key: 'business_type',
    width: '10%',
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '15%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 180,
    type:'tag',
    options:baseStatus
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'camera_name',
    label: '摄像头名称',
    type: 'input',
    placeholder: '请输入摄像头名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field:'camera_type',
    label:'摄像头类型',
    type:'radio',
    props:{
      options:cameraTypes
    },
    colSpan: 8
  },
  {
    field: 'status',
    label: '状态',
    type: 'radio',
    props: {
      allowClear: true,
      placeholder: '请选择状态',
      options: [
        { value: '1', label: '启用' },
        { value: '0', label: '禁用' }
      ],
      
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 350,
  actions: [
    {
      label: '编辑',
      // icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '启用',
      props: { type: 'link', size: 'small' },
      action: 'toggleStatus',
      visible: (record) => {
        return record.status === '0';
      }
    },
    {
      label: '禁用',
      props: { type: 'link', size: 'small', danger: true },
      action: 'toggleStatus',
      visible: (record) => {
        return record.status === '1';
      }
    },
    {
      label: '删除',
      // icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete'
    }
  ]
};

// API 配置
const  field_descriptions = ref({})
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  // 处理状态参数，使其符合后端要求
  if (rest.status) {
    rest.status = rest.status === '1' ? 1 : 0;
  }
  
  const res: any = await getCameraList({
    page: pageNum,
    page_size: pageSize,
    ...rest
  });
  field_descriptions.value = (res as any).data?.field_descriptions || {}
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

// 方法
const showAddModal = () => {
  modalTitle.value = '新增摄像头';
  currentCamera.value = {};
  modalVisible.value = true;
};

const editCameraFn = async (record: Camera) => {
  modalTitle.value = '编辑摄像头';
  currentCamera.value = record;
  modalVisible.value = true;
};

const toggleStatus = async (record: Camera) => {
  try {
    const newStatus = record.status === '1' ? '0' : '1';
    
    await editCamera({
      ...record,
      status: newStatus
    });
    
    message.success(`已${record.status === '1' ? '禁用' : '启用'}摄像头`);
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    message.error('状态切换失败');
  }
};

const confirmDelete = (record: Camera) => {
  currentCamera.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    const formData = formRef.value?.getFormData();
    
    modalLoading.value = true;
    
    if (modalTitle.value === '新增摄像头') {
      await addCamera(formData);
      message.success('新增摄像头成功');
    } else {
      await editCamera({ camera_id: formData.camera_id, ...formData });
      message.success('编辑摄像头成功');
    }
    
    modalVisible.value = false;
    currentCamera.value = {};
    smartTableRef.value?.refresh();
  } catch (error: any) {
    if (error?.message) {
      message.error(error.message);
    } else {
      message.error(modalTitle.value === '新增摄像头' ? '新增摄像头失败' : '编辑摄像头失败');
    }
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  currentCamera.value = {};
};

const handleDelete = async () => {
  try {
    if (!currentCamera.value) return;
    
    const res =  await removeCamera(currentCamera.value.camera_id);
    deleteModalVisible.value = false;
    currentCamera.value = {};
    if((res as any)?.code === 200) message.success('删除摄像头成功');
    else message.error(`删除摄像头失败:${(res as any)?.message}`);
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除摄像头失败:', error);
    message.error('删除摄像头失败');
  }
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
const handleAction = (action: string, record: Camera, index: number) => {
  switch (action) {
    case 'edit':
      editCameraFn(record);
      break;
    case 'toggleStatus':
      toggleStatus(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

// 状态配置
const getStatusConfig = (status: string) => {
  const configs = {
    '1': { badgeStatus: 'processing', text: '启用', color: 'green' },
    '0': { badgeStatus: 'default', text: '禁用', color: 'gray' }
  };
  return configs[status] || { badgeStatus: 'default', text: '未知', color: 'gray' };
};

onMounted(() => {
  getDangerList({
    page: 1,
    page_size: 9999,
    search_keyword: ''
  }).then((res: any) => {
    riskFactorsOptions.value = (res as any).data?.risk_factors.map((item: any) => ({ value: item.factor_id, label: item.factor_name }));
  });
  
  getAllTypeList().then(res => {
    sceneTypesOptions.value = res;
  });
  
  getRegionList({
    include_hierarchy: true
  }).then((res: any) => {
    regionTree.value = (res as any).data.hierarchy || [];
    regionList.value = (res as any).data?.regions?.map((item: any) => ({ value: item.region_id, label: item.region_name })) || [];
  });
  
  getModelConfig().then((res: any) => {
    modelParams.value = (res as any).data || {};
  });
});

</script>

<style scoped>
.camera-container {
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