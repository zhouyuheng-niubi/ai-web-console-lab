<template>
  <div class="factory-area-map-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="leading-none ml-1">新增厂区图</span>
        </span>
      </Button>
    </div>

    <!-- 主要内容区域 -->
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
      </SmartTable>
    </div>

    <!-- 新增/编辑厂区图弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="800px"
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
      />
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除厂区图 "{{ currentArea?.area_name }}" 吗？此操作不可恢复。</p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { 
  Button, 
  Modal, 
  message
} from 'ant-design-vue';
import { 
  PlusOutlined
} from '@ant-design/icons-vue';
// 引入 smartTable 组件需要的类型
import type { ExtendedColumnItem } from '@/types/business';
import dayjs from 'dayjs'
// 定义搜索项类型
interface SearchItem {
  field: string;
  label: string;
  type: string;
  placeholder?: string;
  props?: any;
  colSpan?: number;
}

// 类型定义
interface FactoryAreaMap {
  area_id: string;
  area_name: string;
  area_image: string;
  status: 'active' | 'inactive';
  create_time?: string;
  update_time?: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增厂区图');
const currentArea = ref<FactoryAreaMap>();
const formRef = ref();
const smartTableRef = ref();

// 表单状态
const formState = reactive({
  area_id: '',
  area_name: '',
  area_image: null,
  status: 'active' as 'active' | 'inactive'
});

// 表格配置
const responseConfig = {
  listKey: 'areas',
  totalKey: 'total',
};

const paginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
};

// 状态选项
const statusOptions = [
  { label: '启用', value: 'active', color: 'green' },
  { label: '禁用', value: 'inactive', color: 'red' }
];

// 表格列配置
const columns: ExtendedColumnItem<FactoryAreaMap>[] = [
  {
    title: '厂区名称',
    dataIndex: 'area_name',
    key: 'area_name',
    width: '25%'
  },
  {
    title: '厂区图片',
    dataIndex: 'area_image',
    key: 'area_image',
    width: '25%',
    type:'image'
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    width: '20%',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '15%',
    type: 'tag',
    options: statusOptions
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'area_name',
    label: '厂区名称',
    type: 'input',
    placeholder: '请输入厂区名称',
    props: {
      allowClear: true
    },
    colSpan: 8
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    props: {
      allowClear: true,
      options: statusOptions
    },
    colSpan: 8
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 180,
  actions: [
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

// 静态数据
let staticAreas: FactoryAreaMap[] = [
  {
    area_id: 'area001',
    area_name: '厂区平面图',
    area_image: 'https://mp-cd7e9fd2-b8d1-443f-8a1a-5831bad30d98.cdn.bspapp.com/project/point_map.jpg',
    status: 'active',
    create_time: '2025-11-01 09:00:00',
    update_time: '2025-12-01 10:30:00'
  },
];

// API 配置（使用静态数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 过滤数据
  let filteredData = staticAreas;
  if (rest.area_name) {
    filteredData = filteredData.filter(item => 
      item.area_name.includes(rest.area_name)
    );
  }
  
  if (rest.status) {
    filteredData = filteredData.filter(item => 
      item.status === rest.status
    );
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    areas: pagedData,
    total: filteredData.length
  };
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
const formSchema = [
  {
    key: 'area_name',
    type: 'input',
    label: '厂区名称',
    placeholder: '请输入厂区名称',
    required: true,
    rules: [
      { required: true, message: '请输入厂区名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'area_image',
    type: 'upload',
    label: '厂区图片',
    props: {
      multiple: false,
      listType: 'picture-card',
      maxCount: 1,
      accept: 'image/*',
      beforeUpload: (file) => {
        const isImage = file.type.startsWith('image/')
        if (!isImage) {
          message.error('只能上传图片文件')
          return false
        }
        
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          message.error('图片大小不能超过2MB')
          return false
        }
        return false // 阻止自动上传
      },
      onRemove: () => {
        formState.area_image = null
      }
    }
  },
  {
    key: 'status',
    type: 'radioGroup',
    label: '状态',
    required: true,
    props: {
      options: statusOptions
    },
    rules: [
      { required: true, message: '请选择状态', trigger: 'change' },
    ],
    colSpan: 24
  }
]

// 方法
const showAddModal = () => {
  modalTitle.value = '新增厂区图';
  resetForm();
  modalVisible.value = true;
};

const editAreaFn = async (record: FactoryAreaMap) => {
  try {
    modalTitle.value = '编辑厂区图';
    formState.area_id = record.area_id;
    formState.area_name = record.area_name;
    formState.area_image = record.area_image;
    formState.status = record.status;

    modalVisible.value = true;
  } catch (error) {
    console.error('获取厂区图详情失败:', error);
    message.error('获取厂区图详情失败');
  }
};

const confirmDelete = (record: FactoryAreaMap) => {
  currentArea.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增厂区图') {
      // 新增厂区图操作
      const newArea: FactoryAreaMap = {
        area_id: `area${Date.now()}`,
        area_name: formData.area_name,
        area_image: formData.area_image,
        status: formData.status,
        create_time: new Date().toLocaleString('zh-CN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }).replace(/\//g, '-'),
        update_time: new Date().toLocaleString('zh-CN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }).replace(/\//g, '-')
      };
      
      staticAreas.unshift(newArea);
      message.success('新增厂区图成功');
    } else {
      // 编辑厂区图操作
      const areaIndex = staticAreas.findIndex(area => area.area_id === formData.area_id);
      if (areaIndex !== -1) {
        staticAreas[areaIndex] = {
          ...staticAreas[areaIndex],
          area_name: formData.area_name,
          area_image: formData.area_image,
          status: formData.status,
          update_time: new Date().toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          }).replace(/\//g, '-')
        };
        message.success('编辑厂区图成功');
      }
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增厂区图' ? '新增厂区图失败' : '编辑厂区图失败');
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
    if (!currentArea.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从静态数据中删除厂区图
    const areaIndex = staticAreas.findIndex(area => area.area_id === currentArea.value?.area_id);
    if (areaIndex !== -1) {
      staticAreas.splice(areaIndex, 1);
    }
    
    deleteModalVisible.value = false;
    currentArea.value = undefined;
    message.success('删除厂区图成功');
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除厂区图失败:', error);
    message.error('删除厂区图失败');
  }
};

const resetForm = () => {
  formState.area_id = '';
  formState.area_name = '';
  formState.area_image = '';
  formState.status = 'active';
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
const handleAction = (action: string, record: FactoryAreaMap, index: number) => {
  switch (action) {
    case 'edit':
      editAreaFn(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

onMounted(() => {
  // 页面初始化逻辑
});
</script>

<style scoped>
.factory-area-map-container {
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
</style>
