<template>
  <div class="emer-group-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="leading-none ml-1">新增小组</span>
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

    <!-- 新增/编辑小组弹窗 -->
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
      />
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除应急小组 "{{ currentGroup?.group_name }}" 吗？此操作不可恢复。</p>
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
import AdvancedForm from '@/components/advancedForm/index.vue';
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
interface EmergencyGroup {
  group_id: string;
  group_name: string;
  main_duty: string;
  update_time?: string;
  create_time?: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增小组');
const currentGroup = ref<EmergencyGroup>();
const formRef = ref();
const smartTableRef = ref();

// 表单状态
const formState = reactive({
  group_id: '',
  group_name: '',
  main_duty: ''
});

// 表格配置
const responseConfig = {
  listKey: 'groups',
  totalKey: 'total',
};

const paginationConfig = {
  pageSize: 5,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['5', '10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
};

// 表格列配置
const columns: ExtendedColumnItem<EmergencyGroup>[] = [
  {
    title: '小组名称',
    dataIndex: 'group_name',
    key: 'group_name',
    width: '200px',
    ellipsis: true
  },
  {
    title: '主要职责',
    dataIndex: 'main_duty',
    key: 'main_duty',
    width: '400px',
    ellipsis: true
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: '160px',
    ellipsis: true,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'group_name',
    label: '小组名称',
    type: 'input',
    placeholder: '请输入小组名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'main_duty',
    label: '主要职责',
    type: 'input',
    placeholder: '请输入主要职责',
    props: {
      allowClear: true
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: '150px',
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

// 模拟数据存储（响应式）
let emergencyGroups: EmergencyGroup[] = [
  {
    group_id: 'group001',
    group_name: '消防应急小组',
    main_duty: '负责火灾事故的应急处置、人员疏散和现场救援工作',
    update_time: '2025-12-01 10:30:00',
    create_time: '2024-11-01 09:00:00'
  },
  {
    group_id: 'group002',
    group_name: '医疗救护小组',
    main_duty: '负责伤员救治、卫生防疫和医疗保障工作',
    update_time: '2025-12-01 11:15:00',
    create_time: '2024-11-02 10:00:00'
  },
  {
    group_id: 'group003',
    group_name: '安全警戒小组',
    main_duty: '负责现场警戒、秩序维护和交通管制工作',
    update_time: '2025-12-01 09:45:00',
    create_time: '2024-11-03 14:00:00'
  },
  {
    group_id: 'group004',
    group_name: '后勤保障小组',
    main_duty: '负责应急物资供应、食宿安排和后勤支持工作',
    update_time: '2025-12-01 12:20:00',
    create_time: '2024-11-04 16:00:00'
  },
  {
    group_id: 'group005',
    group_name: '通信联络小组',
    main_duty: '负责应急通信保障、信息传递和对外联络工作',
    update_time: '2025-12-01 13:00:00',
    create_time: '2024-11-05 08:00:00'
  }
];

// 生成唯一ID
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `group${timestamp}${random}`;
};

// 获取当前时间
const getCurrentTime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
};

// API 配置（使用模拟数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 过滤数据
  let filteredData = [...emergencyGroups];
  
  if (rest.group_name) {
    filteredData = filteredData.filter(item => 
      item.group_name.includes(rest.group_name)
    );
  }
  
  if (rest.main_duty) {
    filteredData = filteredData.filter(item => 
      item.main_duty.includes(rest.main_duty)
    );
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    groups: pagedData,
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
    formattedParams.pageSize = pagination.pageSize || 5;
  }

  return formattedParams;
};

// 表单配置
const formSchema = [
  {
    key: 'group_name',
    type: 'input',
    label: '小组名称',
    placeholder: '请输入小组名称',
    required: true,
    rules: [
      { required: true, message: '请输入小组名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'main_duty',
    type: 'textarea',
    label: '主要职责',
    placeholder: '请输入主要职责',
    required: true,
    props: {
      rows: 4
    },
    rules: [
      { required: true, message: '请输入主要职责', trigger: 'blur' },
      { min: 5, max: 500, message: '职责描述长度为5-500个字符', trigger: 'blur' },
    ]
  }
];

// 方法
const showAddModal = () => {
  modalTitle.value = '新增小组';
  resetForm();
  modalVisible.value = true;
};

const editGroupFn = async (record: EmergencyGroup) => {
  try {
    modalTitle.value = '编辑小组';
    formState.group_id = record.group_id;
    formState.group_name = record.group_name;
    formState.main_duty = record.main_duty;

    modalVisible.value = true;
  } catch (error) {
    console.error('获取小组详情失败:', error);
    message.error('获取小组详情失败');
  }
};

const confirmDelete = (record: EmergencyGroup) => {
  currentGroup.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增小组') {
      // 新增操作
      const newGroup: EmergencyGroup = {
        group_id: generateId(),
        group_name: formData.group_name,
        main_duty: formData.main_duty,
        create_time: getCurrentTime(),
        update_time: getCurrentTime()
      };
      
      emergencyGroups.unshift(newGroup);
      message.success('新增小组成功');
    } else {
      // 编辑操作
      const index = emergencyGroups.findIndex(item => item.group_id === formData.group_id);
      if (index !== -1) {
        emergencyGroups[index] = {
          ...emergencyGroups[index],
          group_name: formData.group_name,
          main_duty: formData.main_duty,
          update_time: getCurrentTime()
        };
        message.success('编辑小组成功');
      } else {
        throw new Error('未找到要编辑的小组');
      }
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增小组' ? '新增小组失败' : '编辑小组失败');
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
    if (!currentGroup.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从数组中删除数据
    const index = emergencyGroups.findIndex(item => item.group_id === currentGroup.value?.group_id);
    if (index !== -1) {
      emergencyGroups.splice(index, 1);
      message.success('删除小组成功');
    } else {
      throw new Error('未找到要删除的小组');
    }
    
    deleteModalVisible.value = false;
    currentGroup.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除小组失败:', error);
    message.error('删除小组失败');
  }
};

const resetForm = () => {
  formState.group_id = '';
  formState.group_name = '';
  formState.main_duty = '';
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
const handleAction = (action: string, record: EmergencyGroup, index: number) => {
  switch (action) {
    case 'edit':
      editGroupFn(record);
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
.emer-group-container {
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