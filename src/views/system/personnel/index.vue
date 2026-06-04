<template>
  <div class="personnel-container pt-[30px] pb-[30px] px-[30px] box-border flex flex-col overflow-hidden">
    <!-- 页面标题和操作栏 - 固定不滚动 -->
    <div class="pb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增人员</span>
        </span>
      </Button>
    </div>

    <!-- 人员列表 -->
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
        @action="handleAction"
        :searchButtonWrapperSpan="6"
        :immediateSearch="true"
        :actionColumn="actionColumn"
      >
        <!-- 性别显示插槽 -->
        <template #cell-gender="{ record }">
          <span>{{ record.gender === 1 ? '男' : '女' }}</span>
        </template>
        
        <!-- 状态显示插槽 -->
        <template #cell-status="{ record }">
          <Badge 
            :status="record.status === 1 ? 'processing' : 'default'" 
            :text="record.status === 1 ? '启用' : '禁用'"
          />
        </template>
      </smartTable>
    </div>

    <!-- 新增/编辑人员弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="600px"
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
      <p>确定要删除人员 "{{ currentPerson?.name }}" 吗？此操作不可恢复。</p>
      <p class="text-orange-500 mt-2">
        删除后，该人员将不再可用。
      </p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import { 
  Button, 
  Modal, 
  Badge,
  message
} from 'ant-design-vue';
import { 
  PlusOutlined, 
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
// 引入 smartTable 组件需要的类型
import type { ColumnItem, SearchItem } from '@/types/business';
import { baseStatus } from '@/utils/constSeting';
import dayjs from 'dayjs';

// 类型定义
interface Personnel {
  id: number;
  name: string;
  code: string;
  gender: number; // 1男，2女
  phone: string;
  email: string;
  departId: number;
  position: string;
  status: number; // 1启用，0禁用
  createTime: string;
  updateTime: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增人员');
const currentPerson = ref<Personnel>();
const formRef = ref();
const smartTableRef = ref();

const formState = reactive({
  id: undefined,
  name: '',
  code: '',
  gender: 1,
  phone: '',
  email: '',
  departId: undefined,
  position: '',
  status: 1 // 默认启用
});

// 表格配置
const responseConfig = {
  listKey: 'records',
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
const columns: ColumnItem<Personnel>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '12%'
  },
  {
    title: '性别',
    key: 'gender',
    dataIndex: 'gender',
    width: '8%'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: '12%'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: '15%'
  },
  {
    title: '所属部门',
    dataIndex: 'departName',
    key: 'departName',
    width: '12%'
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
    width: '10%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: '12%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: '8%',
    type: 'tag',
    options: baseStatus
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '请输入姓名',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'phone',
    label: '手机号',
    type: 'input',
    placeholder: '请输入手机号',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'departId',
    label: '所属部门',
    type: 'select',
    props: {
      allowClear: true,
      placeholder: '请选择部门',
      options: [
        { value: 1, label: '研发部' },
        { value: 2, label: '测试部' },
        { value: 3, label: '产品部' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    props: {
      allowClear: true,
      placeholder: '请选择状态',
      options: baseStatus
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 200,
  actions: [
    {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '启用',
      props: { type: 'link', size: 'small' },
      action: 'toggleStatus',
      visible: (record) => {
        return record.status === 0;
      }
    },
    {
      label: '禁用',
      props: { type: 'link', size: 'small', danger: true },
      action: 'toggleStatus',
      visible: (record) => {
        return record.status === 1;
      }
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete',
    }
  ]
};

// API 配置 - 模拟数据
const apiConfig = async (params: any) => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = {
        records: [
          {
            id: 1,
            name: '张三',
            code: 'EMP001',
            gender: 1,
            phone: '10000000000',
            email: 'maintainer@example.com',
            departId: 1,
            departName: '研发部',
            position: '前端工程师',
            status: 1,
            createTime: '2023-01-01 12:00:00',
            updateTime: '2023-01-01 12:00:00'
          },
          {
            id: 2,
            name: '李四',
            code: 'EMP002',
            gender: 2,
            phone: '10000000000',
            email: 'maintainer@example.com',
            departId: 2,
            departName: '测试部',
            position: '测试工程师',
            status: 1,
            createTime: '2023-01-02 12:00:00',
            updateTime: '2023-01-02 12:00:00'
          },
          {
            id: 3,
            name: '王五',
            code: 'EMP003',
            gender: 1,
            phone: '10000000000',
            email: 'maintainer@example.com',
            departId: 3,
            departName: '产品部',
            position: '产品经理',
            status: 0,
            createTime: '2023-01-03 12:00:00',
            updateTime: '2023-01-03 12:00:00'
          }
        ],
        total: 3
      };
      resolve({
        data: mockData
      });
    }, 500);
  });
};

// 参数格式化函数
const paramsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params
  };

  if (pagination) {
    formattedParams.pageNum = pagination.current || 1;
    formattedParams.pageSize = pagination.pageSize || 8;
  }

  return formattedParams;
};

// AdvancedForm schema配置
const formSchema = [
  {
    key: 'name',
    label: '姓名',
    type: 'input',
    required: true,
    props: {
      maxlength: 20,
      placeholder: '请输入姓名'
    },
    rules: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' }
    ]
  },
  {
    key: 'gender',
    label: '性别',
    type: 'radioGroup',
    required: true,
    props: {
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ]
    },
    rules: [
      { required: true, message: '请选择性别', trigger: 'change' }
    ]
  },
  {
    key: 'phone',
    label: '手机号',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入手机号'
    },
    rules: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ]
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    props: {
      placeholder: '请输入邮箱'
    },
    rules: [
      { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  },
  {
    key: 'departId',
    label: '所属部门',
    type: 'select',
    required: true,
    props: {
      placeholder: '请选择部门',
      options: [
        { value: 1, label: '研发部' },
        { value: 2, label: '测试部' },
        { value: 3, label: '产品部' }
      ]
    },
    rules: [
      { required: true, message: '请选择部门', trigger: 'change' }
    ]
  },
  {
    key: 'position',
    label: '职位',
    type: 'input',
    props: {
      placeholder: '请输入职位'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'radioGroup',
    props: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  }
];

// 方法
const showAddModal = () => {
  modalTitle.value = '新增人员';
  resetForm();
  modalVisible.value = true;
};

const editPerson = (record: Personnel) => {
  modalTitle.value = '编辑人员';
  resetForm();
  modalVisible.value = true;
  
  // 使用 nextTick 确保表单组件已经完全渲染
  nextTick(() => {
    formState.id = record.id;
    formState.name = record.name;
    formState.code = record.code;
    formState.gender = record.gender;
    formState.phone = record.phone;
    formState.email = record.email;
    formState.departId = record.departId;
    formState.position = record.position;
    formState.status = record.status;
  });
};

const toggleStatus = async (record: Personnel) => {
  try {
    const newStatus = record.status === 1 ? 0 : 1;
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    message.success(`已${record.status === 1 ? '禁用' : '启用'}人员`);
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    message.error('状态切换失败');
  }
};

const confirmDelete = (record: Personnel) => {
  currentPerson.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    modalLoading.value = true;
    
    // 表单验证
    await formRef.value?.validate();
    
    if (modalTitle.value === '新增人员') {
      // 新增人员 - 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('新增人员成功');
    } else {
      // 编辑人员 - 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('编辑人员成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error: any) {
    console.error('操作失败:', error);
    message.error(error.message || (modalTitle.value === '新增人员' ? '新增人员失败' : '编辑人员失败'));
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
    if (!currentPerson.value) return;
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    message.success('删除人员成功');
    deleteModalVisible.value = false;
    currentPerson.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    message.error('删除人员失败');
  }
};

const resetForm = () => {
  formState.id = undefined;
  formState.name = '';
  formState.code = '';
  formState.gender = 1;
  formState.phone = '';
  formState.email = '';
  formState.departId = undefined;
  formState.position = '';
  formState.status = 1;
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
const handleAction = (action: string, record: Personnel, index: number) => {
  console.log('操作:', action, '记录:', record, '索引:', index);
  switch (action) {
    case 'edit':
      editPerson(record);
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

// 暴露方法给父组件
defineExpose({
  refresh: () => smartTableRef.value?.refresh()
});
</script>

<style scoped>
.personnel-container {
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

:deep(.ant-table-container) {
  border-radius: 8px;
}
</style>