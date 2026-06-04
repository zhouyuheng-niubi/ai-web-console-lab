<template>
  <div class="emer-institution-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="leading-none ml-1">新增机构</span>
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

    <!-- 新增/编辑机构弹窗 -->
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
      <p>确定要删除应急机构 "{{ currentInstitution?.institution_name }}" 吗？此操作不可恢复。</p>
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
interface EmergencyInstitution {
  institution_id: string;
  institution_name: string;
  institution_type: string;
  institution_level: string;
  address: string;
  contact_person: string;
  contact_phone: string;
  update_time?: string;
  create_time?: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增机构');
const currentInstitution = ref<EmergencyInstitution>();
const formRef = ref();
const smartTableRef = ref();

// 表单状态
const formState = reactive({
  institution_id: '',
  institution_name: '',
  institution_type: '',
  institution_level: '',
  address: '',
  contact_person: '',
  contact_phone: ''
});

// 表格配置
const responseConfig = {
  listKey: 'institutions',
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
const columns: ExtendedColumnItem<EmergencyInstitution>[] = [
  {
    title: '机构名称',
    dataIndex: 'institution_name',
    key: 'institution_name',
    width: '150px',
    ellipsis: true
  },
  {
    title: '机构类型',
    dataIndex: 'institution_type',
    key: 'institution_type',
    width: '120px',
    ellipsis: true
  },
  {
    title: '机构等级',
    dataIndex: 'institution_level',
    key: 'institution_level',
    width: '100px',
    ellipsis: true
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width: '200px',
    ellipsis: true
  },
  {
    title: '联系人',
    dataIndex: 'contact_person',
    key: 'contact_person',
    width: '100px',
    ellipsis: true
  },
  {
    title: '联系电话',
    dataIndex: 'contact_phone',
    key: 'contact_phone',
    width: '120px',
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
    field: 'institution_name',
    label: '机构名称',
    type: 'input',
    placeholder: '请输入机构名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'institution_type',
    label: '机构类型',
    type: 'input',
    placeholder: '请输入机构类型',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'contact_person',
    label: '联系人',
    type: 'input',
    placeholder: '请输入联系人',
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
let emergencyInstitutions: EmergencyInstitution[] = [
  {
    institution_id: 'inst001',
    institution_name: '市应急管理局',
    institution_type: '政府部门',
    institution_level: '市级',
    address: '示例地区市朝阳区应急大厦',
    contact_person: '张局长',
    contact_phone: '010-12345678',
    update_time: '2025-12-01 10:30:00',
    create_time: '2024-11-01 09:00:00'
  },
  {
    institution_id: 'inst002',
    institution_name: '省消防总队',
    institution_type: '消防部门',
    institution_level: '省级',
    address: '示例地区市海淀区消防大楼',
    contact_person: '李总队长',
    contact_phone: '010-87654321',
    update_time: '2025-12-01 11:15:00',
    create_time: '2024-11-02 10:00:00'
  },
  {
    institution_id: 'inst003',
    institution_name: '市医疗急救中心',
    institution_type: '医疗机构',
    institution_level: '市级',
    address: '示例地区市西城区急救中心',
    contact_person: '王主任',
    contact_phone: '010-11111111',
    update_time: '2025-12-01 09:45:00',
    create_time: '2024-11-03 14:00:00'
  }
];

// 生成唯一ID
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `inst${timestamp}${random}`;
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
  let filteredData = [...emergencyInstitutions];
  
  if (rest.institution_name) {
    filteredData = filteredData.filter(item => 
      item.institution_name.includes(rest.institution_name)
    );
  }
  
  if (rest.institution_type) {
    filteredData = filteredData.filter(item => 
      item.institution_type.includes(rest.institution_type)
    );
  }
  
  if (rest.contact_person) {
    filteredData = filteredData.filter(item => 
      item.contact_person.includes(rest.contact_person)
    );
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    institutions: pagedData,
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
    key: 'institution_name',
    type: 'input',
    label: '机构名称',
    placeholder: '请输入机构名称',
    required: true,
    rules: [
      { required: true, message: '请输入机构名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'institution_type',
    type: 'input',
    label: '机构类型',
    placeholder: '请输入机构类型',
    required: true,
    rules: [
      { required: true, message: '请输入机构类型', trigger: 'blur' },
      { min: 2, max: 30, message: '类型长度为2-30个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'institution_level',
    type: 'input',
    label: '机构等级',
    placeholder: '请输入机构等级',
    required: true,
    rules: [
      { required: true, message: '请输入机构等级', trigger: 'blur' },
      { min: 2, max: 20, message: '等级长度为2-20个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'address',
    type: 'textarea',
    label: '地址',
    placeholder: '请输入地址',
    required: true,
    props: {
      rows: 3
    },
    rules: [
      { required: true, message: '请输入地址', trigger: 'blur' },
      { min: 5, max: 100, message: '地址长度为5-100个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'contact_person',
    type: 'input',
    label: '联系人',
    placeholder: '请输入联系人',
    required: true,
    rules: [
      { required: true, message: '请输入联系人', trigger: 'blur' },
      { min: 2, max: 20, message: '联系人长度为2-20个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'contact_phone',
    type: 'input',
    label: '联系电话',
    placeholder: '请输入联系电话',
    required: true,
    rules: [
      { required: true, message: '请输入联系电话', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的电话号码', trigger: 'blur' },
    ]
  }
];

// 方法
const showAddModal = () => {
  modalTitle.value = '新增机构';
  resetForm();
  modalVisible.value = true;
};

const editInstitutionFn = async (record: EmergencyInstitution) => {
  try {
    modalTitle.value = '编辑机构';
    formState.institution_id = record.institution_id;
    formState.institution_name = record.institution_name;
    formState.institution_type = record.institution_type;
    formState.institution_level = record.institution_level;
    formState.address = record.address;
    formState.contact_person = record.contact_person;
    formState.contact_phone = record.contact_phone;

    modalVisible.value = true;
  } catch (error) {
    console.error('获取机构详情失败:', error);
    message.error('获取机构详情失败');
  }
};

const confirmDelete = (record: EmergencyInstitution) => {
  currentInstitution.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增机构') {
      // 新增操作
      const newInstitution: EmergencyInstitution = {
        institution_id: generateId(),
        institution_name: formData.institution_name,
        institution_type: formData.institution_type,
        institution_level: formData.institution_level,
        address: formData.address,
        contact_person: formData.contact_person,
        contact_phone: formData.contact_phone,
        create_time: getCurrentTime(),
        update_time: getCurrentTime()
      };
      
      emergencyInstitutions.unshift(newInstitution);
      message.success('新增机构成功');
    } else {
      // 编辑操作
      const index = emergencyInstitutions.findIndex(item => item.institution_id === formData.institution_id);
      if (index !== -1) {
        emergencyInstitutions[index] = {
          ...emergencyInstitutions[index],
          institution_name: formData.institution_name,
          institution_type: formData.institution_type,
          institution_level: formData.institution_level,
          address: formData.address,
          contact_person: formData.contact_person,
          contact_phone: formData.contact_phone,
          update_time: getCurrentTime()
        };
        message.success('编辑机构成功');
      } else {
        throw new Error('未找到要编辑的机构');
      }
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增机构' ? '新增机构失败' : '编辑机构失败');
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
    if (!currentInstitution.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从数组中删除数据
    const index = emergencyInstitutions.findIndex(item => item.institution_id === currentInstitution.value?.institution_id);
    if (index !== -1) {
      emergencyInstitutions.splice(index, 1);
      message.success('删除机构成功');
    } else {
      throw new Error('未找到要删除的机构');
    }
    
    deleteModalVisible.value = false;
    currentInstitution.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除机构失败:', error);
    message.error('删除机构失败');
  }
};

const resetForm = () => {
  formState.institution_id = '';
  formState.institution_name = '';
  formState.institution_type = '';
  formState.institution_level = '';
  formState.address = '';
  formState.contact_person = '';
  formState.contact_phone = '';
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
const handleAction = (action: string, record: EmergencyInstitution, index: number) => {
  switch (action) {
    case 'edit':
      editInstitutionFn(record);
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
.emer-institution-container {
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