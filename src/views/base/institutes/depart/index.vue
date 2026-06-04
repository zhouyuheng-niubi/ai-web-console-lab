<template>
  <div class="depart-container pt-[30px] pb-[30px] px-[30px] box-border flex flex-col overflow-hidden">
    <!-- 页面标题和操作栏 - 固定不滚动 -->
    <div class="pb-[30px] flex justify-between items-center flex-shrink-0">
      <div>
        <div class="font-bold text-[22px] text-[#454F64] leading-1">部门管理</div>
        <div class="font-[400] text-[14px] text-[#717B92] leading-1">管理系统中的组织部门信息</div>
      </div>
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增部门</span>
        </span>
      </Button>
    </div>

    <!-- 部门列表 -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
      <smartTable
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
        <!-- 状态显示插槽 -->
        <template #cell-status="{ record }">
          <Badge 
            :status="record.status === 1 ? 'processing' : 'default'" 
            :text="record.status === 1 ? '启用' : '禁用'"
          />
        </template>
      </smartTable>
    </div>

    <!-- 新增/编辑部门弹窗 -->
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
      <p>确定要删除部门 "{{ currentDepart?.name }}" 吗？此操作不可恢复。</p>
      <p class="text-orange-500 mt-2">
        删除后，该部门将不再可用。
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
interface Depart {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
  sort: number;
  status: number; // 1启用，0禁用
  createTime: string;
  updateTime: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增部门');
const currentDepart = ref<Depart>();
const formRef = ref();
const smartTableRef = ref();

const formState = reactive({
  id: undefined,
  name: '',
  code: '',
  parentId: undefined,
  sort: 0,
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
const columns: ColumnItem<Depart>[] = [
  {
    title: '部门名称',
    dataIndex: 'name',
    key: 'name',
    width: '20%'
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: '10%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: '15%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: '10%',
    type: 'tag',
    options: baseStatus
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'name',
    label: '部门名称',
    type: 'input',
    placeholder: '请输入部门名称',
    props: {
      allowClear: true
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
            name: '研发部',
            code: 'DEV001',
            parentId: null,
            sort: 1,
            status: 1,
            createTime: '2023-01-01 12:00:00',
            updateTime: '2023-01-01 12:00:00'
          },
          {
            id: 2,
            name: '测试部',
            code: 'TEST001',
            parentId: null,
            sort: 2,
            status: 1,
            createTime: '2023-01-02 12:00:00',
            updateTime: '2023-01-02 12:00:00'
          },
          {
            id: 3,
            name: '产品部',
            code: 'PM001',
            parentId: null,
            sort: 3,
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
    label: '部门名称',
    type: 'input',
    required: true,
    props: {
      maxlength: 50,
      placeholder: '请输入部门名称'
    },
    rules: [
      { required: true, message: '请输入部门名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' }
    ]
  },
  {
    key: 'parentId',
    label: '上级部门',
    type: 'select',
    props: {
      placeholder: '请选择上级部门',
      options: [
        { value: 1, label: '研发部' },
        { value: 2, label: '测试部' }
      ]
    }
  },
  {
    key: 'sort',
    label: '排序',
    type: 'inputNumber',
    props: {
      min: 0,
      placeholder: '请输入排序值'
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
  modalTitle.value = '新增部门';
  resetForm();
  modalVisible.value = true;
};

const editDepart = (record: Depart) => {
  modalTitle.value = '编辑部门';
  resetForm();
  modalVisible.value = true;
  
  // 使用 nextTick 确保表单组件已经完全渲染
  nextTick(() => {
    formState.id = record.id;
    formState.name = record.name;
    formState.code = record.code;
    formState.parentId = record.parentId;
    formState.sort = record.sort;
    formState.status = record.status;
  });
};

const toggleStatus = async (record: Depart) => {
  try {
    const newStatus = record.status === 1 ? 0 : 1;
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    message.success(`已${record.status === 1 ? '禁用' : '启用'}部门`);
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    message.error('状态切换失败');
  }
};

const confirmDelete = (record: Depart) => {
  currentDepart.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    modalLoading.value = true;
    
    // 表单验证
    await formRef.value?.validate();
    
    if (modalTitle.value === '新增部门') {
      // 新增部门 - 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('新增部门成功');
    } else {
      // 编辑部门 - 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('编辑部门成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增部门' ? '新增部门失败' : '编辑部门失败');
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
    if (!currentDepart.value) return;
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    message.success('删除部门成功');
    deleteModalVisible.value = false;
    currentDepart.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    message.error('删除部门失败');
  }
};

const resetForm = () => {
  formState.id = undefined;
  formState.name = '';
  formState.code = '';
  formState.parentId = undefined;
  formState.sort = 0;
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
const handleAction = (action: string, record: Depart, index: number) => {
  console.log('操作:', action, '记录:', record, '索引:', index);
  switch (action) {
    case 'edit':
      editDepart(record);
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
.depart-container {
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