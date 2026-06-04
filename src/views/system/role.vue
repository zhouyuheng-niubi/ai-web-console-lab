<template>
  <div class="role-management-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="leading-none ml-1">新增角色</span>
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

    <!-- 新增/编辑角色弹窗 -->
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
      <p>确定要删除角色 "{{ currentRole?.role_name }}" 吗？此操作不可恢复。</p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted,computed } from 'vue';
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
import { useMenuStore } from '@/store';
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
interface Role {
  role_id: string;
  role_name: string;
  role_type: string;
  role_description: string;
  permissions: string[];
  user_count: number;
  status: 'active' | 'inactive';
  create_time?: string;
  update_time?: string;
}

// 响应式数据
const menuStore = useMenuStore();
const formatMenu = computed(() => {
  return menuStore.formatMenu
})
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增角色');
const currentRole = ref<Role>();
const formRef = ref();
const smartTableRef = ref();

// 表单状态
const formState = reactive({
  role_id: '',
  role_name: '',
  role_type: '',
  role_description: '',
  permissions: [],
  status: 'active' as 'active' | 'inactive'
});

// 表格配置
const responseConfig = {
  listKey: 'roles',
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

const roleTypes = [
  { label: '管理员', value: 'admin', color: 'red' },
  { label: '普通用户', value: 'user', color: 'blue' },
  { label: '访客', value: 'guest', color: 'green' },
  { label: '审核员', value: 'auditor', color: 'orange' }
];

// 表格列配置
const columns: ExtendedColumnItem<Role>[] = [
  {
    title: '角色名称',
    dataIndex: 'role_name',
    key: 'role_name',
    width: '10%'
  },
  {
    title: '类型',
    dataIndex: 'role_type',
    key: 'role_type',
    width: '5%',
    type: 'tag',
    options: roleTypes
  },
  {
    title: '角色描述',
    dataIndex: 'role_description',
    key: 'role_description',
    width: '30%',
    ellipsis: true
  },
  {
    title: '权限数量',
    dataIndex: 'permissions',
    key: 'permissions',
    width: '8%',
    formatter: (value: string[]) => value.length.toString()
  },
  {
    title: '用户数量',
    dataIndex: 'user_count',
    key: 'user_count',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    type: 'tag',
    options: [
      { label: '启用', value: 'active', color: 'green' },
      { label: '禁用', value: 'inactive', color: 'red' }
    ]
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: '15%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'role_name',
    label: '角色名称',
    type: 'input',
    placeholder: '请输入角色名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'role_type',
    label: '角色类型',
    type: 'select',
    placeholder: '请选择角色类型',
    props: {
      allowClear: true,
      options: roleTypes
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    props: {
      allowClear: true,
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    colSpan: 6
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
let staticRoles: Role[] = [
  {
    role_id: 'role001',
    role_name: '系统管理员',
    role_type: 'admin',
    role_description: '拥有系统所有权限，负责系统配置和用户管理',
    permissions: ['人工智能服务能力', '安全生产管理业务', '应急指挥服务中心', '综合风险管控中心', '系统配置管理'],
    user_count: 2,
    status: 'active',
    update_time: '2025-12-01 10:30:00',
    create_time: '2024-11-01 09:00:00'
  },
  {
    role_id: 'role002',
    role_name: '操作员',
    role_type: 'user',
    role_description: '负责日常操作和数据录入，具备基础业务处理权限',
    permissions: ['人工智能服务能力', '安全生产管理业务', '应急指挥服务中心', '综合风险管控中心',],
    user_count: 15,
    status: 'active',
    update_time: '2025-12-01 11:15:00',
    create_time: '2024-11-02 10:00:00'
  },
  {
    role_id: 'role003',
    role_name: '审核员',
    role_type: 'auditor',
    role_description: '负责数据审核和质量控制，确保数据准确性',
    permissions: ['应急指挥服务中心', '综合风险管控中心',],
    user_count: 8,
    status: 'active',
    update_time: '2025-12-01 09:45:00',
    create_time: '2024-11-03 14:00:00'
  },
  {
    role_id: 'role004',
    role_name: '访客用户',
    role_type: 'guest',
    role_description: '只读权限，可以查看基础信息但不能进行操作',
    permissions: ['人工智能服务能力',],
    user_count: 25,
    status: 'active',
    update_time: '2025-12-01 12:20:00',
    create_time: '2024-11-04 16:00:00'
  },
  {
    role_id: 'role005',
    role_name: '维护人员',
    role_type: 'user',
    role_description: '负责设备维护和故障处理，具备设备管理权限',
    permissions: [ '安全生产管理业务'],
    user_count: 6,
    status: 'inactive',
    update_time: '2025-12-01 13:00:00',
    create_time: '2024-11-05 08:00:00'
  }
];

// 辅助函数：递归查找菜单项的id
const findMenuIdByLabel = (menuList: any[], targetLabel: string): string | null => {
  for (const item of menuList) {
    if (item.label === targetLabel) {
      return item.id;
    }
    if (item.children && item.children.length > 0) {
      const foundId = findMenuIdByLabel(item.children, targetLabel);
      if (foundId) {
        return foundId;
      }
    }
  }
  return null;
};

// 将权限标签转换为id的函数
const convertPermissionsToIds = (role: Role): Role => {
  const convertedPermissions: string[] = [];
  
  for (const permissionLabel of role.permissions) {
    const permissionId = findMenuIdByLabel(formatMenu.value, permissionLabel);
    if (permissionId) {
      convertedPermissions.push(permissionId);
    } else {
      // 如果找不到对应的id，保留原始标签（或者可以选择跳过）
      convertedPermissions.push(permissionLabel);
    }
  }
  
  return {
    ...role,
    permissions: convertedPermissions
  };
};

// API 配置（使用静态数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 转换权限为id值
  const rolesWithIds = staticRoles.map(role => convertPermissionsToIds(role));
  
  // 过滤数据
  let filteredData = rolesWithIds;
  if (rest.role_name) {
    filteredData = filteredData.filter(item => 
      item.role_name.includes(rest.role_name)
    );
  }
  
  if (rest.role_type) {
    filteredData = filteredData.filter(item => 
      item.role_type === rest.role_type
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
    roles: pagedData,
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
const formSchema = computed(() => [
  {
    key: 'role_name',
    type: 'input',
    label: '角色名称',
    placeholder: '请输入角色名称',
    required: true,
    rules: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 2, max: 20, message: '名称长度为2-20个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'role_type',
    type: 'select',
    label: '角色类型',
    placeholder: '请选择角色类型',
    required: true,
    props: {
      options: roleTypes
    },
    rules: [
      { required: true, message: '请选择角色类型', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'status',
    type: 'radioGroup',
    label: '角色状态',
    required: true,
    props: {
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    rules: [
      { required: true, message: '请选择角色状态', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'role_description',
    type: 'textarea',
    label: '角色描述',
    placeholder: '请输入角色描述',
    required: true,
    props: {
      rows: 4
    },
    rules: [
      { required: true, message: '请输入角色描述', trigger: 'blur' },
      { min: 10, max: 200, message: '描述长度为10-200个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'permissions',
    type: 'treeSelect',
    label: '权限配置',
    required: true,
    props: {
      treeData: formatMenu.value,
      treeCheckable: true,
      fieldNames:{
        children: 'children',
        label: 'label',
        value: 'id',
      }
    },
    rules: [
      { type: 'array', required: true, message: '请至少选择一项权限', trigger: 'change' },
    ],
    colSpan: 24
  }
])

// 方法
const showAddModal = () => {
  modalTitle.value = '新增角色';
  resetForm();
  modalVisible.value = true;
};

const editRoleFn = async (record: Role) => {
  try {
    modalTitle.value = '编辑角色';
    formState.role_id = record.role_id;
    formState.role_name = record.role_name;
    formState.role_type = record.role_type;
    formState.role_description = record.role_description;
    formState.permissions = [...record.permissions];
    formState.status = record.status;

    modalVisible.value = true;
  } catch (error) {
    console.error('获取角色详情失败:', error);
    message.error('获取角色详情失败');
  }
};

const confirmDelete = (record: Role) => {
  currentRole.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增角色') {
      // 新增角色操作
      const newRole: Role = {
        role_id: `role${Date.now()}`,
        role_name: formData.role_name,
        role_type: formData.role_type,
        role_description: formData.role_description,
        permissions: formData.permissions,
        user_count: 0,
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
      
      staticRoles.unshift(newRole);
      message.success('新增角色成功');
    } else {
      // 编辑角色操作
      const roleIndex = staticRoles.findIndex(role => role.role_id === formData.role_id);
      if (roleIndex !== -1) {
        staticRoles[roleIndex] = {
          ...staticRoles[roleIndex],
          role_name: formData.role_name,
          role_type: formData.role_type,
          role_description: formData.role_description,
          permissions: formData.permissions,
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
        message.success('编辑角色成功');
      }
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增角色' ? '新增角色失败' : '编辑角色失败');
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
    if (!currentRole.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从静态数据中删除角色
    const roleIndex = staticRoles.findIndex(role => role.role_id === currentRole.value?.role_id);
    if (roleIndex !== -1) {
      staticRoles.splice(roleIndex, 1);
    }
    
    deleteModalVisible.value = false;
    currentRole.value = undefined;
    message.success('删除角色成功');
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除角色失败:', error);
    message.error('删除角色失败');
  }
};

const resetForm = () => {
  formState.role_id = '';
  formState.role_name = '';
  formState.role_type = '';
  formState.role_description = '';
  formState.permissions = [];
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
const handleAction = (action: string, record: Role, index: number) => {
  switch (action) {
    case 'edit':
      editRoleFn(record);
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
  menuStore.initFormatMenu()
  console.log(formatMenu.value,'formatMenu.value');

});
</script>

<style scoped>
.role-management-container {
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