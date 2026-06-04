<template>
  <div class="depart-container p-[16px] box-border flex flex-col overflow-hidden">
    
    <!-- 页面标题和操作栏 - 固定不滚动 -->
    <div class="pb-[30px] flex justify-between items-center flex-shrink-0">
      <div class="flex gap-3">
        <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
          <span class="flex items-center">
              <PlusOutlined />
              <span class="leading-none ml-1">新增部门</span>
          </span>
        </Button>
        <Button @click="exportData" :loading="exportLoading">
          <span class="flex items-center">
            <DownloadOutlined />
            <span class="leading-none ml-1">导出数据</span>
          </span>
        </Button>
      </div>
      <div class="text-sm text-gray-600">
        共 <span class="font-semibold text-blue-600">{{ mockDepartDatabase.length }}</span> 个部门
      </div>
    </div>



    <!-- 部门列表 -->
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
import { ref, reactive, nextTick, computed } from 'vue';
import { 
  Button, 
  Modal, 
  Badge,
  message,
  Breadcrumb
} from 'ant-design-vue';
import { 
  PlusOutlined,
  DownloadOutlined
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
  status: string; // 1启用，0禁用
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
const exportLoading = ref(false);

const formState = reactive({
  id: undefined,
  name: '',
  code: '',
  parentId: undefined,
  sort: 0,
  status: '1' // 默认启用
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
    title: '部门编码',
    dataIndex: 'code',
    key: 'code',
    width: '15%'
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
      icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete',
    }
  ]
};

// 模拟数据存储 - 安全生产相关部门
let mockDepartDatabase: Depart[] = [
  {
    id: 1,
    name: '安全管理部',
    code: 'SAFE001',
    parentId: null,
    sort: 1,
    status: '1',
    createTime: '2025-11-01 09:00:00',
    updateTime: '2025-11-01 09:00:00'
  },
  {
    id: 2,
    name: '生产运营部',
    code: 'PROD001',
    parentId: null,
    sort: 2,
    status: '1',
    createTime: '2025-11-02 10:00:00',
    updateTime: '2025-11-02 10:00:00'
  },
  {
    id: 3,
    name: '质量检查部',
    code: 'QUAL001',
    parentId: null,
    sort: 3,
    status: '1',
    createTime: '2025-11-03 11:00:00',
    updateTime: '2025-11-03 11:00:00'
  },
  {
    id: 4,
    name: '环境保护部',
    code: 'ENV001',
    parentId: null,
    sort: 4,
    status: '0',
    createTime: '2025-11-04 14:00:00',
    updateTime: '2025-11-04 14:00:00'
  },
  {
    id: 5,
    name: '应急救援部',
    code: 'EMER001',
    parentId: null,
    sort: 5,
    status: '1',
    createTime: '2025-11-05 08:30:00',
    updateTime: '2025-11-05 08:30:00'
  },
  {
    id: 6,
    name: '风险评估组',
    code: 'RISK001',
    parentId: 1,
    sort: 1,
    status: '1',
    createTime: '2025-11-06 09:00:00',
    updateTime: '2025-11-06 09:00:00'
  },
  {
    id: 7,
    name: '安全检查组',
    code: 'INSP001',
    parentId: 1,
    sort: 2,
    status: '1',
    createTime: '2025-11-07 10:00:00',
    updateTime: '2025-11-07 10:00:00'
  },
  {
    id: 8,
    name: '设备维护组',
    code: 'EQUIP001',
    parentId: 2,
    sort: 1,
    status: '1',
    createTime: '2025-11-08 13:00:00',
    updateTime: '2025-11-08 13:00:00'
  },
  {
    id: 9,
    name: '隐患排查组',
    code: 'HAZARD001',
    parentId: 6,
    sort: 1,
    status: '1',
    createTime: '2025-11-09 14:30:00',
    updateTime: '2025-11-09 14:30:00'
  },
  {
    id: 10,
    name: '教育培训组',
    code: 'TRAIN001',
    parentId: 1,
    sort: 3,
    status: '1',
    createTime: '2025-11-10 15:00:00',
    updateTime: '2025-11-10 15:00:00'
  }
];

let nextId = 11;

// API 配置 - 模拟数据
const apiConfig = async (params: any) => {
  
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockDepartDatabase];
      
      // 按名称搜索
      if (params.name) {
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(params.name.toLowerCase())
        );
      }
      
      // 按状态筛选
      if (params.status !== undefined && params.status !== null && params.status !== '') {
        filteredData = filteredData.filter(item => item.status === params.status);
      }
      
      // 排序
      filteredData.sort((a, b) => a.sort - b.sort);
      
      // 分页处理
      const pageNum = params.pageNum || 1;
      const pageSize = params.pageSize || 7;
      const startIndex = (pageNum - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      const mockData = {
        records: paginatedData,
        total: filteredData.length
      };
      
      console.log('返回数据:', mockData);
      
      // 直接返回符合SmartTable期望格式的数据
      resolve(mockData);
    }, 300);
  });
};

// 参数格式化函数
const paramsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params
  };

  if (pagination) {
    formattedParams.pageNum = pagination.current || 1;
    formattedParams.pageSize = pagination.pageSize || 7;
  }

  console.log('格式化后的参数:', formattedParams);
  return formattedParams;
};

// 获取上级部门选项
const getParentDepartmentOptions = () => {
  const parentOptions = mockDepartDatabase
    .filter(item => !item.parentId) // 只显示顶级部门
    .map(item => ({
      value: item.id,
      label: item.name
    }));
  
  return parentOptions;
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
    key: 'code',
    label: '部门编码',
    type: 'input',
    props: {
      maxlength: 20,
      placeholder: '请输入部门编码（自动生成）',
      allowClear: true
    },
    rules: [
      { max: 20, message: '编码长度不超过20个字符', trigger: 'blur' }
    ]
  },
  {
    key: 'parentId',
    label: '上级部门',
    type: 'select',
    props: {
      placeholder: '请选择上级部门',
      options: getParentDepartmentOptions(),
      allowClear: true
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
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' }
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

// 切换部门状态API
const toggleDepartmentStatus = async (id: number, status: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const index = mockDepartDatabase.findIndex(item => item.id === id);
        if (index === -1) {
          reject(new Error('部门不存在'));
          return;
        }
        
        mockDepartDatabase[index].status = status;
        mockDepartDatabase[index].updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        resolve(mockDepartDatabase[index]);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

const toggleStatus = async (record: Depart) => {
  try {
    const newStatus = record.status === '1' ? '0' : '1';
    
    // 调用状态切换API
    await toggleDepartmentStatus(record.id, newStatus);
    
    message.success(`已${newStatus === '0' ? '禁用' : '启用'}部门`);
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error: any) {
    console.error('状态切换失败:', error);
    message.error(error.message || '状态切换失败');
  }
};

const confirmDelete = (record: Depart) => {
  currentDepart.value = record;
  deleteModalVisible.value = true;
};

// 新增部门API
const addDepartment = async (formData: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 检查部门名称是否重复
        if (mockDepartDatabase.some(item => item.name === formData.name)) {
          reject(new Error('部门名称已存在'));
          return;
        }
        
        // 检查部门编码是否重复
        if (formData.code && mockDepartDatabase.some(item => item.code === formData.code)) {
          reject(new Error('部门编码已存在'));
          return;
        }
        
        const newDepartment: Depart = {
          id: nextId++,
          name: formData.name,
          code: formData.code || `DEP${String(nextId).padStart(3, '0')}`,
          parentId: formData.parentId || null,
          sort: formData.sort || nextId,
          status: formData.status || '1',
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        
        mockDepartDatabase.unshift(newDepartment);
        resolve(newDepartment);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// 更新部门API
const updateDepartment = async (id: number, formData: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const index = mockDepartDatabase.findIndex(item => item.id === id);
        if (index === -1) {
          reject(new Error('部门不存在'));
          return;
        }
        
        // 检查部门名称是否重复（排除自己）
        if (mockDepartDatabase.some(item => item.id !== id && item.name === formData.name)) {
          reject(new Error('部门名称已存在'));
          return;
        }
        
        // 检查部门编码是否重复（排除自己）
        if (formData.code && mockDepartDatabase.some(item => item.id !== id && item.code === formData.code)) {
          reject(new Error('部门编码已存在'));
          return;
        }
        
        mockDepartDatabase[index] = {
          ...mockDepartDatabase[index],
          name: formData.name,
          code: formData.code || mockDepartDatabase[index].code,
          parentId: formData.parentId || null,
          sort: formData.sort || mockDepartDatabase[index].sort,
          status: formData.status ?? mockDepartDatabase[index].status,
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        
        resolve(mockDepartDatabase[index]);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

const handleModalOk = async () => {
  try {
    modalLoading.value = true;
    
    // 表单验证
    await formRef.value?.validate();
    
    if (modalTitle.value === '新增部门') {
      // 新增部门
      await addDepartment({
        name: formState.name,
        code: formState.code,
        parentId: formState.parentId,
        sort: formState.sort,
        status: formState.status
      });
      message.success('新增部门成功');
    } else {
      // 编辑部门
      await updateDepartment(formState.id!, {
        name: formState.name,
        code: formState.code,
        parentId: formState.parentId,
        sort: formState.sort,
        status: formState.status
      });
      message.success('编辑部门成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error: any) {
    console.error('操作失败:', error);
    message.error(error.message || (modalTitle.value === '新增部门' ? '新增部门失败' : '编辑部门失败'));
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

// 删除部门API
const deleteDepartment = async (id: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 检查部门是否存在
        const index = mockDepartDatabase.findIndex(item => item.id === id);
        if (index === -1) {
          reject(new Error('部门不存在'));
          return;
        }
        
        // 检查是否有子部门
        const hasChildren = mockDepartDatabase.some(item => item.parentId === id);
        if (hasChildren) {
          reject(new Error('存在子部门，无法删除'));
          return;
        }
        
        // 删除部门
        mockDepartDatabase.splice(index, 1);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

const handleDelete = async () => {
  try {
    if (!currentDepart.value) return;
    
    // 调用删除API
    await deleteDepartment(currentDepart.value.id);
    
    message.success('删除部门成功');
    deleteModalVisible.value = false;
    currentDepart.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error: any) {
    console.error('删除失败:', error);
    message.error(error.message || '删除部门失败');
  }
};

const resetForm = () => {
  formState.id = undefined;
  formState.name = '';
  formState.code = '';
  formState.parentId = undefined;
  formState.sort = 0;
  formState.status = '1';
};

// 获取状态对应的显示文本
const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    '1': '启用',
    '0': '禁用'
  };
  return statusMap[status] || status;
};

// 获取上级部门名称
const getParentDepartmentName = (parentId: number | null) => {
  if (!parentId) return '无';
  const parent = mockDepartDatabase.find(item => item.id === parentId);
  return parent ? parent.name : '无';
};

// 导出数据功能
const exportData = async () => {
  try {
    return message.info('功能对接中,敬请期待')
    exportLoading.value = true;
    
    // 模拟导出延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 准备导出数据
    const exportData = mockDepartDatabase.map(item => ({
      '部门名称': item.name,
      '部门编码': item.code,
      '上级部门': getParentDepartmentName(item.parentId),
      '排序': item.sort,
      '状态': getStatusText(item.status),
      '创建时间': item.createTime,
      '更新时间': item.updateTime
    }));
    
    // 创建CSV内容
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // 如果包含逗号或引号，需要用引号包围
          return value.includes(',') || value.includes('"') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `部门数据_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success(`成功导出 ${mockDepartDatabase.length} 个部门数据`);
  } catch (error) {
    console.error('导出数据失败:', error);
    message.error('导出数据失败');
  } finally {
    exportLoading.value = false;
  }
};

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
  console.log('数据类型:', typeof data);
  console.log('数据长度:', Array.isArray(data) ? data.length : '不是数组');
  
  // 数据统计
  if (Array.isArray(data)) {
    const totalCount = data.length;
    const activeCount = data.filter(item => item.status === '1').length;
    const inactiveCount = data.filter(item => item.status === '0').length;
    const topLevelCount = data.filter(item => !item.parentId).length;
    const childDepartmentCount = data.filter(item => item.parentId).length;
    
    console.log(`部门数据统计: 总计 ${totalCount} 个，启用 ${activeCount} 个，禁用 ${inactiveCount} 个，顶级部门 ${topLevelCount} 个，子部门 ${childDepartmentCount} 个`);
  }
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