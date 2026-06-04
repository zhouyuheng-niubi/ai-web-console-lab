<template>
  <div class="account-container p-[16px] box-border flex flex-col overflow-hidden">
    <!-- 页面标题和操作栏 - 固定不滚动 -->
    <div class="pb-[30px] flex justify-between items-center flex-shrink-0">

      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增账户</span>
        </span>
      </Button>
    </div>

    <!-- 账户列表 -->
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
      </SmartTable>
    </div>

    <!-- 新增/编辑账户弹窗 -->
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
      <p>确定要删除账户 "{{ currentAccount?.real_name }}" 吗？此操作不可恢复。</p>
      <p class="text-orange-500 mt-2">
        删除后，该账户将无法登录系统。
      </p>
    </Modal>

    <!-- 重置密码弹窗 -->
    <Modal 
      v-model:open="resetPasswordModalVisible" 
      title="重置密码"
      @ok="handleResetPassword"
      @cancel="resetPasswordModalVisible = false"
    >
      <div class="py-4">
        <p>确定要重置账户 "{{ currentAccount?.real_name }}" 的密码吗？</p>
        <div class="mt-4">
          <div class="mb-2">新密码：</div>
          <Input 
            v-model:value="newPassword" 
            type="password" 
            placeholder="请输入新密码"
            style="width: 100%;"
          />
        </div>
        <div class="mt-4">
          <div class="mb-2">确认新密码：</div>
          <Input 
            v-model:value="confirmPassword" 
            type="password" 
            placeholder="请再次输入新密码"
            style="width: 100%;"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import { 
  Button, 
  Modal, 
  Badge,
  message,
  Input
} from 'ant-design-vue';
import { 
  PlusOutlined, 
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
// 引入 smartTable 组件需要的类型
import type { ColumnItem, SearchItem } from '@/types/business';
import { baseStatus } from '@/utils/constSeting';
import dayjs from 'dayjs';

// 用户角色类型
type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';

// 类型定义
interface Account {
  id: string;
  username: string;
  real_name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  status: string; // 1启用，0禁用
  last_login_time?: string;
  createTime: string;
  updateTime: string;
  permissions?: string[];
  accountType: string; // 账号类型
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const resetPasswordModalVisible = ref(false);
const modalTitle = ref('新增账户');
const currentAccount = ref<Account>();
const newPassword = ref('');
const confirmPassword = ref('');
const formRef = ref();
const smartTableRef = ref();

const formState = reactive({
  id: undefined,
  username: '',
  real_name: '',
  email: '',
  phone: '',
  role: 'operator' as UserRole,
  departmentId: undefined,
  status: '1', // 默认启用
  password: '',
  permissions: [],
  accountType: '',
});

// 获取角色选项
const getRoleOptions = () => {
  return [
    { label: '系统管理员', value: 'admin' },
    { label: '管理员', value: 'manager' },
    { label: '操作员', value: 'operator' },
    { label: '查看者', value: 'viewer' }
  ];
};

// 获取部门选项
const getDepartmentOptions = () => {
  return [
    { label: '安全管理部', value: '1' },
    { label: '生产运营部', value: '2' },
    { label: '质量检查部', value: '3' },
    { label: '环境保护部', value: '4' },
    { label: '应急救援部', value: '5' },
    { label: '风险评估组', value: '6' },
    { label: '安全检查组', value: '7' },
    { label: '设备维护组', value: '8' }
  ];
};

// 获取权限选项
const getPermissionOptions = () => {
  return [
    { label: '告警管理', value: 'alarm' },
    { label: '视频分析', value: 'video' },
    { label: '设备管理', value: 'device' },
    { label: '用户管理', value: 'user' },
    { label: '系统配置', value: 'system' },
    { label: '报告查看', value: 'report' }
  ];
};

// 账号类型
const accountTypeOptions = [
  { label: '系统管理员', value: 'sysAdmin' },
  { label: '安全保密员', value: 'securityOfficer'},
  { label: '安全审计员', value: 'securityAuditor'},
];



// 表格配置
const responseConfig = {
  listKey: 'records',
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

// 表格列配置
const columns: ColumnItem<Account>[] = [
  {
    title: '账户名称',
    dataIndex: 'username',
    key: 'username',
    width: '8%'
  },
  {
    title: '用户姓名',
    dataIndex: 'real_name',
    key: 'real_name',
    width: '8%'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: '18%',
    ellipsis: true
  },
  // {
  //   title: '手机号',
  //   dataIndex: 'phone',
  //   key: 'phone',
  //   width: '8%'
  // },
  {
    title:'账号类型',
    dataIndex: 'accountType',
    key: 'accountType',
    width: '8%',
    type: 'select',
    options: accountTypeOptions,
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: '8%',
    type: 'select',
    options: [
      { label: '系统管理员', value: 'admin' },
      { label: '管理员', value: 'manager' },
      { label: '操作员', value: 'operator'},
      { label: '查看者', value: 'viewer' }
    ],
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    key: 'departmentName',
    width: '10%'
  },
  {
    title: '最后登录',
    dataIndex: 'last_login_time',
    key: 'last_login_time',
    width: '12%',
    formatter: (value: string) => {
      if (!value) return '从未登录';
      return dayjs(value).format('YYYY-MM-DD HH:mm');
    }
  },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  //   key: 'createTime',
  //   width: '12%',
  //   formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm')
  // },
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
    field: 'username',
    label: '账户名称',
    type: 'input',
    placeholder: '请输入账户名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'real_name',
    label: '用户姓名',
    type: 'input',
    placeholder: '请输入用户姓名',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'role',
    label: '角色',
    type: 'select',
    props: {
      allowClear: true,
      placeholder: '请选择角色',
      options: getRoleOptions()
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
  width: 300,
  fixed: 'right',
  actions: [
    {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '重置密码',
      icon: 'KeyOutlined',
      props: { type: 'link', size: 'small' },
      action: 'resetPassword'
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

// 模拟数据存储
let mockAccountDatabase: Account[] = [
  {
    id: '1',
    username: 'zhangsan',
    real_name: '张三',
    email: 'maintainer@example.com',
    phone: '10000000000',
    role: 'admin',
    departmentId: '1',
    departmentName: '安全管理部',
    status: '1',
    last_login_time: '2025-12-05 09:30:00',
    createTime: '2025-11-01 10:00:00',
    updateTime: '2025-12-05 09:30:00',
    permissions: ['alarm', 'video', 'device', 'user', 'system', 'report'],
    accountType: 'sysAdmin',
  },
  {
    id: '2',
    username: 'lisi',
    real_name: '李四',
    email: 'maintainer@example.com',
    phone: '10000000000',
    role: 'manager',
    departmentId: '2',
    departmentName: '生产运营部',
    status: '1',
    last_login_time: '2025-12-04 14:20:00',
    createTime: '2025-11-02 11:00:00',
    updateTime: '2025-12-04 14:20:00',
    permissions: ['alarm', 'video', 'device', 'report'],
    accountType: 'securityOfficer',
  },
  {
    id: '3',
    username: 'wangwu',
    real_name: '王五',
    email: 'maintainer@example.com',
    phone: '10000000000',
    role: 'operator',
    departmentId: '3',
    departmentName: '质量检查部',
    status: '1',
    last_login_time: '2025-12-03 16:45:00',
    createTime: '2025-11-03 13:30:00',
    updateTime: '2025-12-03 16:45:00',
    permissions: ['alarm', 'video', 'report'],
    accountType: 'securityAuditor',
  },
  {
    id: '4',
    username: 'zhaoliu',
    real_name: '赵六',
    email: 'maintainer@example.com',
    phone: '10000000000',
    role: 'operator',
    departmentId: '4',
    departmentName: '环境保护部',
    status: '0',
    last_login_time: '2025-11-25 08:15:00',
    createTime: '2025-11-04 09:20:00',
    updateTime: '2025-11-25 08:15:00',
    permissions: ['alarm', 'report'],
    accountType: 'securityAuditor',
  },
  {
    id: '5',
    username: 'sunqi',
    real_name: '孙七',
    email: 'maintainer@example.com',
    phone: '10000000000',
    role: 'viewer',
    departmentId: '5',
    departmentName: '应急救援部',
    status: '1',
    last_login_time: '2025-12-02 11:30:00',
    createTime: '2025-11-05 14:40:00',
    updateTime: '2025-12-02 11:30:00',
    permissions: ['report'],
    accountType: 'securityAuditor',
  },
  {
    id: '6',
    username: 'zhouba',
    real_name: 'Maintainer八',
    email: 'maintainer@example.com',
    phone: '10000000000',
    role: 'manager',
    departmentId: '1',
    departmentName: '安全管理部',
    status: '1',
    last_login_time: '2025-12-03 09:20:00',
    createTime: '2025-11-07 16:00:00',
    updateTime: '2025-12-03 09:20:00',
    permissions: ['alarm', 'video', 'device', 'user', 'report'],
    accountType: 'securityOfficer',
  },
  {
    id: '7',
    username: 'wujiu',
    real_name: '吴九',
    email: 'maintainer@example.com',
    phone: '10000000000',
    role: 'operator',
    departmentId: '6',
    departmentName: '风险评估组',
    status: '1',
    last_login_time: '2025-12-04 10:10:00',
    createTime: '2025-11-08 08:50:00',
    updateTime: '2025-12-04 10:10:00',
    permissions: ['alarm', 'video', 'report'],
    accountType: 'securityOfficer',
  }
];

let nextId = 8;

// API 配置 - 模拟数据
const apiConfig = async (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...mockAccountDatabase];
      
      // 按账户名称搜索
      if (params.username) {
        filteredData = filteredData.filter(item => 
          item.username.toLowerCase().includes(params.username.toLowerCase())
        );
      }
      
      // 按用户姓名搜索
      if (params.real_name) {
        filteredData = filteredData.filter(item => 
          item.real_name.toLowerCase().includes(params.real_name.toLowerCase())
        );
      }
      
      // 按角色筛选
      if (params.role) {
        filteredData = filteredData.filter(item => item.role === params.role);
      }
      
      // 按状态筛选
      if (params.status !== undefined && params.status !== null && params.status !== '') {
        filteredData = filteredData.filter(item => item.status === params.status);
      }
      
      // 按创建时间倒序排序
      filteredData.sort((a, b) => dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf());
      
      // 分页处理
      const pageNum = params.pageNum || 1;
      const pageSize = params.pageSize || 10;
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
    formattedParams.pageSize = pagination.pageSize || 10;
  }

  console.log('格式化后的参数:', formattedParams);
  return formattedParams;
};

// AdvancedForm schema配置
const formSchema = [
  {
    key: 'username',
    label: '账户名称',
    type: 'input',
    required: true,
    props: {
      maxlength: 20,
      placeholder: '请输入账户名称',
      allowClear: true
    },
    rules: [
      { required: true, message: '请输入账户名称', trigger: 'blur' },
      { min: 3, max: 20, message: '账户名称长度为3-20个字符', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '账户名称只能包含字母、数字和下划线', trigger: 'blur' }
    ],
    visible: (model) => !model.id, // 编辑时不显示账户名称字段
    colSpan: 12
  },
  {
    key: 'password',
    label: '密码',
    type: 'input',
    required: true,
    props: {
      type: 'password',
      maxlength: 20,
      placeholder: '请输入密码'
    },
    rules: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
    ],
    visible: (model) => !model.id, // 编辑时不显示密码字段
    colSpan: 12
  },
  {
    key: 'real_name',
    label: '用户姓名',
    type: 'input',
    required: true,
    props: {
      maxlength: 20,
      placeholder: '请输入用户姓名',
      allowClear: true
    },
    rules: [
      { required: true, message: '请输入用户姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    props: {
      maxlength: 50,
      placeholder: '请输入邮箱地址',
      allowClear: true
    },
    rules: [
      { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'phone',
    label: '手机号',
    type: 'input',
    props: {
      maxlength: 11,
      placeholder: '请输入手机号',
      allowClear: true
    },
    rules: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    label:'账号类型',
    dataIndex: 'accountType',
    key: 'accountType',
    type: 'select',
    props: {
      options: accountTypeOptions,
    },
    colSpan: 12
    
  },
  {
    key: 'role',
    label: '角色',
    type: 'select',
    required: true,
    props: {
      placeholder: '请选择角色',
      options: getRoleOptions()
    },
    rules: [
      { required: true, message: '请选择角色', trigger: 'change' }
    ],
    colSpan: 12
    
  },
  {
    key: 'departmentId',
    label: '所属部门',
    type: 'select',
    props: {
      placeholder: '请选择所属部门',
      options: getDepartmentOptions(),
      allowClear: true
    },
    colSpan: 12
  },
  // {
  //   key: 'permissions',
  //   label: '权限',
  //   type: 'checkboxGroup',
  //   props: {
  //     options: getPermissionOptions()
  //   }
  // },
  {
    key: 'status',
    label: '状态',
    type: 'radioGroup',
    required: true,
    props: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' }
      ]
    },
    rules: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ],
    colSpan: 12
  }
];

// 方法
const showAddModal = () => {
  modalTitle.value = '新增账户';
  resetForm();
  modalVisible.value = true;
};

const editAccount = (record: Account) => {
  modalTitle.value = '编辑账户';
  resetForm();
  modalVisible.value = true;
  
  // 使用 nextTick 确保表单组件已经完全渲染
  nextTick(() => {
    formState.id = record.id;
    formState.username = record.username;
    formState.real_name = record.real_name;
    formState.email = record.email;
    formState.phone = record.phone;
    formState.role = record.role;
    formState.departmentId = record.departmentId;
    formState.status = record.status;
    formState.permissions = record.permissions || [];
    formState.accountType = record.accountType;
  });
};

// 切换账户状态API
const toggleAccountStatus = async (id: string, status: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const index = mockAccountDatabase.findIndex(item => item.id === id);
        if (index === -1) {
          reject(new Error('账户不存在'));
          return;
        }
        
        mockAccountDatabase[index].status = status;
        mockAccountDatabase[index].updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        resolve(mockAccountDatabase[index]);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

const toggleStatus = async (record: Account) => {
  try {
    const newStatus = record.status === '1' ? '0' : '1';
    
    // 调用状态切换API
    await toggleAccountStatus(record.id, newStatus);
    
    message.success(`已${newStatus === '0' ? '禁用' : '启用'}账户`);
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error: any) {
    console.error('状态切换失败:', error);
    message.error(error.message || '状态切换失败');
  }
};

const confirmResetPassword = (record: Account) => {
  currentAccount.value = record;
  newPassword.value = '';
  confirmPassword.value = '';
  resetPasswordModalVisible.value = true;
};

const handleResetPassword = async () => {
  try {
    if (!currentAccount.value) return;
    
    if (!newPassword.value) {
      message.error('请输入新密码');
      return;
    }
    
    if (newPassword.value !== confirmPassword.value) {
      message.error('两次输入的密码不一致');
      return;
    }
    
    // 密码强度验证
    if (newPassword.value.length < 6) {
      message.error('密码长度至少6位');
      return;
    }
    
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword.value)) {
      message.error('密码必须包含字母和数字');
      return;
    }
    
    // 检查新密码是否与用户名相同
    if (newPassword.value.toLowerCase() === currentAccount.value.username.toLowerCase()) {
      message.error('新密码不能与账户名称相同');
      return;
    }
    
    // 调用重置密码API
    await resetPassword(currentAccount.value.id, newPassword.value);
    
    message.success(`账户 "${currentAccount.value.real_name}" 的密码重置成功，请通知用户新密码`);
    resetPasswordModalVisible.value = false;
    currentAccount.value = undefined;
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error: any) {
    console.error('重置密码失败:', error);
    message.error(error.message || '重置密码失败');
  }
};

const confirmDelete = (record: Account) => {
  currentAccount.value = record;
  deleteModalVisible.value = true;
};

// 新增账户API
const addAccount = async (formData: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 检查账户名称是否重复
        if (mockAccountDatabase.some(item => item.username === formData.username)) {
          reject(new Error('账户名称已存在'));
          return;
        }
        
        // 检查邮箱是否重复
        if (formData.email && mockAccountDatabase.some(item => item.email === formData.email)) {
          reject(new Error('邮箱已存在'));
          return;
        }
        
        // 检查手机号是否重复
        if (formData.phone && mockAccountDatabase.some(item => item.phone === formData.phone)) {
          reject(new Error('手机号已存在'));
          return;
        }
        
        // 检查用户姓名是否重复
        if (mockAccountDatabase.some(item => item.real_name === formData.real_name)) {
          reject(new Error('用户姓名已存在'));
          return;
        }
        
        // 根据角色设置默认权限
        const getDefaultPermissions = (role: UserRole): string[] => {
          switch (role) {
            case 'admin':
              return ['alarm', 'video', 'device', 'user', 'system', 'report'];
            case 'manager':
              return ['alarm', 'video', 'device', 'report'];
            case 'operator':
              return ['alarm', 'video', 'report'];
            case 'viewer':
              return ['report'];
            default:
              return [];
          }
        };
        
        const newAccount: Account = {
          id: `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          username: formData.username,
          real_name: formData.real_name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          departmentId: formData.departmentId,
          departmentName: getDepartmentOptions().find(d => d.value === formData.departmentId)?.label,
          status: formData.status,
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          permissions: formData.permissions && formData.permissions.length > 0 ? formData.permissions : getDefaultPermissions(formData.role)
        };
        
        // 添加到数据库开头，最新的在前
        mockAccountDatabase.unshift(newAccount);
        
        // 增加ID计数器
        nextId++;
        
        resolve({
          ...newAccount,
          message: '账户创建成功，初始密码已设置'
        });
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// 更新账户API
const updateAccount = async (id: string, formData: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const index = mockAccountDatabase.findIndex(item => item.id === id);
        if (index === -1) {
          reject(new Error('账户不存在'));
          return;
        }
        
        // 检查用户姓名是否重复（排除自己）
        if (mockAccountDatabase.some(item => item.id !== id && item.real_name === formData.real_name)) {
          reject(new Error('用户姓名已存在'));
          return;
        }
        
        // 检查邮箱是否重复（排除自己）
        if (formData.email && mockAccountDatabase.some(item => item.id !== id && item.email === formData.email)) {
          reject(new Error('邮箱已存在'));
          return;
        }
        
        // 检查手机号是否重复（排除自己）
        if (formData.phone && mockAccountDatabase.some(item => item.id !== id && item.phone === formData.phone)) {
          reject(new Error('手机号已存在'));
          return;
        }
        
        // 检查是否修改了角色，如果修改了角色且没有提供权限，则使用新角色的默认权限
        let finalPermissions = formData.permissions || mockAccountDatabase[index].permissions;
        if (formData.role !== mockAccountDatabase[index].role && (!formData.permissions || formData.permissions.length === 0)) {
          const getDefaultPermissions = (role: UserRole): string[] => {
            switch (role) {
              case 'admin':
                return ['alarm', 'video', 'device', 'user', 'system', 'report'];
              case 'manager':
                return ['alarm', 'video', 'device', 'report'];
              case 'operator':
                return ['alarm', 'video', 'report'];
              case 'viewer':
                return ['report'];
              default:
                return [];
            }
          };
          finalPermissions = getDefaultPermissions(formData.role);
        }
        
        // 记录旧的角色，用于日志
        const oldRole = mockAccountDatabase[index].role;
        const oldStatus = mockAccountDatabase[index].status;
        
        mockAccountDatabase[index] = {
          ...mockAccountDatabase[index],
          real_name: formData.real_name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          departmentId: formData.departmentId,
          departmentName: getDepartmentOptions().find(d => d.value === formData.departmentId)?.label || mockAccountDatabase[index].departmentName,
          status: formData.status,
          permissions: finalPermissions,
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        
        // 检查是否有重要变更
        const hasImportantChanges = oldRole !== formData.role || oldStatus !== formData.status;
        
        resolve({
          ...mockAccountDatabase[index],
          hasImportantChanges,
          changedFields: {
            role: oldRole !== formData.role ? { old: oldRole, new: formData.role } : null,
            status: oldStatus !== formData.status ? { old: oldStatus, new: formData.status } : null
          }
        });
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// 重置密码API
const resetPassword = async (id: string, newPassword: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const index = mockAccountDatabase.findIndex(item => item.id === id);
        if (index === -1) {
          reject(new Error('账户不存在'));
          return;
        }
        
        const account = mockAccountDatabase[index];
        
        // 检查新密码是否与历史密码相同（模拟检查）
        const isPasswordUsedBefore = false; // 在实际应用中需要与历史密码比较
        if (isPasswordUsedBefore) {
          reject(new Error('新密码不能与最近使用的密码相同'));
          return;
        }
        
        // 模拟密码加密（在实际应用中会使用bcrypt等加密方式）
        const hashedPassword = `encrypted_${btoa(newPassword)}_${Date.now()}`;
        
        // 更新账户信息（在实际应用中会存储加密后的密码）
        mockAccountDatabase[index] = {
          ...account,
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          // 注意：在实际应用中这里会更新密码字段，但为了演示，我们不存储真实密码
        };
        
        // 记录密码重置日志
        const resetLog = {
          accountId: account.id,
          accountName: account.real_name,
          resetTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          resetReason: '管理员重置'
        };
        
        console.log('密码重置日志:', resetLog);
        
        resolve({
          success: true,
          message: `账户 ${account.real_name} 的密码已重置`,
          resetTime: resetLog.resetTime,
          // 在实际应用中不会返回密码，这里仅用于演示
          newPassword: newPassword
        });
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
    
    if (modalTitle.value === '新增账户') {
      // 新增账户
      await addAccount({
        username: formState.username,
        real_name: formState.real_name,
        password: formState.password,
        email: formState.email,
        phone: formState.phone,
        role: formState.role,
        departmentId: formState.departmentId,
        status: formState.status,
        permissions: formState.permissions
      });
      message.success('新增账户成功');
    } else {
      // 编辑账户
      await updateAccount(formState.id!, {
        real_name: formState.real_name,
        email: formState.email,
        phone: formState.phone,
        role: formState.role,
        departmentId: formState.departmentId,
        status: formState.status,
        permissions: formState.permissions
      });
      message.success('编辑账户成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error: any) {
    console.error('操作失败:', error);
    message.error(error.message || (modalTitle.value === '新增账户' ? '新增账户失败' : '编辑账户失败'));
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

// 删除账户API
const deleteAccount = async (id: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 检查账户是否存在
        const accountIndex = mockAccountDatabase.findIndex(item => item.id === id);
        if (accountIndex === -1) {
          reject(new Error('账户不存在'));
          return;
        }
        
        const accountToDelete = mockAccountDatabase[accountIndex];
        
        // 安全检查：不能删除最后一个管理员
        const adminCount = mockAccountDatabase.filter(item => item.role === 'admin').length;
        if (accountToDelete.role === 'admin' && adminCount <= 1) {
          reject(new Error('不能删除最后一个管理员账户'));
          return;
        }
        
        // 记录删除信息
        const deletionInfo = {
          deletedAccount: {
            id: accountToDelete.id,
            username: accountToDelete.username,
            real_name: accountToDelete.real_name,
            role: accountToDelete.role,
            departmentName: accountToDelete.departmentName
          },
          deletionTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        
        // 删除账户
        mockAccountDatabase.splice(accountIndex, 1);
        
        resolve({
          success: true,
          message: `账户 "${accountToDelete.real_name}" (${accountToDelete.username}) 已删除`,
          deletionInfo
        });
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

const handleDelete = async () => {
  try {
    if (!currentAccount.value) return;
    
    // 调用删除API
    await deleteAccount(currentAccount.value.id);
    
    message.success('删除账户成功');
    deleteModalVisible.value = false;
    currentAccount.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error: any) {
    console.error('删除失败:', error);
    message.error(error.message || '删除账户失败');
  }
};

const resetForm = () => {
  formState.id = undefined;
  formState.username = '';
  formState.real_name = '';
  formState.email = '';
  formState.phone = '';
  formState.role = 'operator';
  formState.departmentId = undefined;
  formState.status = '1';
  formState.password = '';
  formState.permissions = [];
};

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
  console.log('数据类型:', typeof data);
  console.log('数据长度:', Array.isArray(data) ? data.length : '不是数组');
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

// 操作列事件处理
const handleAction = (action: string, record: Account, index: number) => {
  console.log('操作:', action, '记录:', record, '索引:', index);
  switch (action) {
    case 'edit':
      editAccount(record);
      break;
    case 'toggleStatus':
      toggleStatus(record);
      break;
    case 'resetPassword':
      confirmResetPassword(record);
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
.account-container {
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