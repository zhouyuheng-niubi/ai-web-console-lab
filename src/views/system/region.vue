<template>
  <div class="camera-container pt-[30px] pb-[30px] px-[30px] flex flex-col overflow-hidden  box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增区域</span>
        </span>
      </Button>
    </div>

    <!-- 区域列表 (使用 smartTable) -->
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
        :showPagination="false"
        rowKey="region_id"
      >
        <!-- 摄像头数量显示插槽 -->
        <template #cell-camera_list="{ record }">
          <Tag v-if="record.camera_list && record.camera_list.length > 0" color="blue">{{ record.camera_list.length }}个摄像头</Tag>
          <span v-else class="text-[#8C8C8C]">未绑定摄像头</span>
        </template>
      </smartTable>
    </div>

    <!-- 新增/编辑区域弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="700px"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <AdvancedForm 
        ref="formRef"
        :schema="formSchema" 
        :model="formState" 
        mode="form"
      />
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除区域 "{{ currentRegion?.region_name }}" 吗？此操作不可恢复。</p>
      <p v-if="currentRegion?.camera_list && currentRegion.camera_list.length > 0" class="text-orange-500 mt-2">
        该区域下绑定了 {{ currentRegion.camera_list.length }} 个摄像头，删除后相关绑定关系将被解除。
      </p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { 
  Button, 
  Modal, 
  Tag,
  message
} from 'ant-design-vue';
import { 
  PlusOutlined
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
import { getRegionList, addRegion, editRegion, removeRegion } from '@/api/system/region';
import { getCameraList } from '@/api/system/camera';
// 引入 smartTable 组件需要的类型
import type { ColumnItem, SearchItem } from '@/types/business';
import dayjs from 'dayjs'
// 类型定义
interface Region {
  region_id: string;
  region_name: string;
  region_desc?: string;
  camera_list?: string[];
  createTime?: string;
  updateTime?: string;
  location?: string;
  is_forbidden?: boolean;
  
}

interface Camera {
  camera_id: string;
  camera_name: string;
  camera_desc?: string;
  location: string;
  status: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增区域');
const currentRegion = ref<Region>();
const formRef = ref();
const smartTableRef = ref();
const camerasOptions = ref([]);

// 表单状态
const formState = reactive({
  parent_region_id: '',
  region_id: '',
  region_name: '',
  region_desc: '',
  camera_list: [],
  location: '',
  is_forbidden: false,
});

// 表格配置
const responseConfig = {
  listKey: 'hierarchy',
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
const columns: ColumnItem<Region>[] = [
  {
    title: '区域名称',
    dataIndex: 'region_name',
    key: 'region_name',
    width: '20%'
  },
  {
    title: '区域描述',
    dataIndex: 'region_desc',
    key: 'region_desc',
    ellipsis: true
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
  },
  // {
  //   title: '绑定摄像头',
  //   dataIndex: 'camera_list',
  //   key: 'camera_list',
  //   width: '15%',
  //   type: 'tag',
  //   options: camerasOptions
  // },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '12%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'search_keyword',
    label: '区域名称',
    type: 'input',
    placeholder: '请输入区域名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 300,
  actions: [
    {
      label: '新增子区域',
      icon: 'PlusOutlined',
      props: { type: 'link', size: 'small' },
      action: 'addChild'
    },
    {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete'
    }
  ]
};


// API 配置
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  const res = await getRegionList({
    include_hierarchy: true,
    ...rest
  });
  return res.data
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
    key:'parent_region_id',
    type: 'treeSelect',
    label: '父区域',
    placeholder: '请选择父区域',
    props: {
      treeData: treeSelectList.value,
      allowClear: true,
      showSearch: true,
      fieldNames:{
        children: 'children',
        label: 'region_name',
        value: 'region_id',
      }
    }
  },
  {
    key: 'region_name',
    type: 'input',
    label: '区域名称',
    placeholder: '请输入区域名称',
    required: true,
    rules: [
      { required: true, message: '请输入区域名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'region_desc',
    type: 'input',
    label: '区域描述',
    placeholder: '请输入区域描述信息',
    props: {
      type: 'textarea',
      rows: 3,
      maxlength: 200,
      showCount: true
    },
    rules: [
      { required: true, message: '请输入区域描述', trigger: 'blur' },
    ]
  },
  {
    key: 'location',
    type: 'input',
    label: '位置',
    placeholder: '请输入区域位置',
  },
  // 是否禁区
  {
    key: 'is_forbidden',
    type: 'radioGroup',
    label: '是否是禁区',
    required: true,
    props: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    },
  }
  // {
  //   key: 'camera_list',
  //   type: 'checkboxGroup',
  //   label: '关联摄像头',
  //   props: {
  //     options: camerasOptions.value
  //   }
  // }
]);

// 方法
const showAddModal = () => {
  modalTitle.value = '新增区域';
  resetForm();
  modalVisible.value = true;
};

const showAddChildModal = (parentRegion: Region) => {
  modalTitle.value = `新增子区域`;
  resetForm();
  // 设置父区域ID
  formState.parent_region_id = parentRegion.region_id;
  modalVisible.value = true;
};

const editRegionFn = async (record: Region) => {
  try {
    const regionDetail = record;
    modalTitle.value = '编辑区域';
    formState.region_id = regionDetail.region_id;
    formState.parent_region_id = regionDetail?.parent_region_id || null;
    formState.region_name = regionDetail.region_name;
    formState.region_desc = regionDetail.region_desc || '';
    formState.camera_list = regionDetail.camera_list || [];
    formState.location = regionDetail.location || '';
    formState.is_forbidden = regionDetail.is_forbidden || false;
    modalVisible.value = true;
  } catch (error) {
    console.error('获取区域详情失败:', error);
    message.error('获取区域详情失败');
  }
};

const confirmDelete = (record: Region) => {
  currentRegion.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    const formData = { ...formState };
    if(!formData?.parent_region_id) {
      formData.parent_region_id = ''
    }
    if (!formData?.region_id) {
      // 新增区域或新增子区域
      await addRegion(formData);
      message.success('新增区域成功');
    } else {
      await editRegion({ 
        id: formState.region_id, 
        ...formData 
      });
      message.success('编辑区域成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
    loadRegionTree()
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value.startsWith('新增区域') ? '新增区域失败' : '编辑区域失败');
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
    if (!currentRegion.value) return;
    
    await removeRegion(currentRegion.value.region_id);
    
    deleteModalVisible.value = false;
    currentRegion.value = undefined;
    message.success('删除区域成功');
    // 重新加载数据
    smartTableRef.value?.refresh();
    loadRegionTree()
  } catch (error) {
    console.error('删除区域失败:', error);
    message.error('删除区域失败');
  }
};

const resetForm = () => {
  formState.parent_region_id = '';
  formState.region_id = '';
  formState.region_name = '';
  formState.region_desc = '';
  formState.camera_list = [];
  formState.is_forbidden = false;
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
const handleAction = (action: string, record: Region, index: number) => {
  switch (action) {
    case 'addChild':
      showAddChildModal(record);
      break;
    case 'edit':
      editRegionFn(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

// 获取摄像头列表
const loadCameras = async () => {
  try {
    const res = await getCameraList({
      page: 1,
      page_size: 9999
    });
    
    if (res.data?.cameras) {
      camerasOptions.value = res.data.cameras.map((camera: Camera) => ({
        value: camera.camera_id,
        label: `${camera.camera_name}`
      }));
    }
  } catch (error) {
    console.error('加载摄像头列表失败:', error);
  }
};

// 获取所有区域树型列表
const treeSelectList = ref<Region[]>([]);
const loadRegionTree = async () => {
  const res = await apiConfig({})
  treeSelectList.value  = res.hierarchy
  // .map((region: Region) => ({
  //   value: region.region_id,
  //   label: region.region_name,
  //   children: region.children ? region.children.map((child: Region) => ({
  //     value: child.region_id,
  //     label: child.region_name
  //   })) : []
  // }));
  console.log('loadRegionTree', treeSelectList.value)
};

onMounted(() => {
  loadCameras();
  loadRegionTree();
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
</style>