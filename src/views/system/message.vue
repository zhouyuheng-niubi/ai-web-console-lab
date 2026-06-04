<template>
  <div class="message-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <!-- <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="leading-none ml-1">新增消息</span>
        </span>
      </Button>
    </div> -->

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
        @action="handleTableAction"
      >
      </SmartTable>
    </div>

    <!-- 新增/编辑消息弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="1200px"
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

    <!-- 详情弹窗 -->
    <Modal 
      v-model:open="detailModalVisible" 
      title="消息详情"
      width="1200px"
      :footer="null"
      @cancel="closeDetailModal"
    >
      <AdvancedForm
        :schema="formSchema"
        :model="selectedMessage"
        mode="descriptions"
        :column="2"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import { 
  Button, 
  Modal, 
  message, 
  Descriptions,
  Tag
} from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import AdvancedForm from '@/components/advancedForm/index.vue';

// 类型定义
interface Message {
  id: string;
  business_id: string;
  category: string;
  company_name: string;
  sender_name: string;
  sender_phone: string;
  message_type: string;
  title: string;
  content: string;
  status: string;
  send_time: string;
  create_time?: string;
  update_time?: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const detailModalVisible = ref(false);
const modalTitle = ref('新增消息');
const smartTableRef = ref();
const formRef = ref();

// 表单状态
const formState = reactive({
  id: '',
  business_id: '',
  category: '',
  company_name: '',
  sender_name: '',
  sender_phone: '',
  message_type: '',
  title: '',
  content: '',
  status: ''
});

// 选中的消息
const selectedMessage = ref<Message>({
  id: '',
  business_id: '',
  category: '',
  company_name: '',
  sender_name: '',
  sender_phone: '',
  message_type: '',
  title: '',
  content: '',
  status: '',
  send_time: ''
});
const messageTypes =  [
    { label: '紧急', value: '紧急', color: 'red' },
    { label: '重要', value: '重要', color: 'orange' },
    { label: '一般', value: '一般', color: 'green' }
]
const lookStatus = [
  { label: '已读', value: '1', color: 'green' },
  { label: '未读', value: '0', color: 'orange' }
]

// 表格列配置
const columns = [
  {
    title: '消息分类',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: '单位名称',
    dataIndex: 'company_name',
    key: 'company_name',
    width: 150,
  },
  {
    title: '发送人姓名',
    dataIndex: 'sender_name',
    key: 'sender_name',
    width: 120,
  },
  {
    title: '发送人电话',
    dataIndex: 'sender_phone',
    key: 'sender_phone',
    width: 120,
  },
  {
    title: '消息类型',
    dataIndex: 'message_type',
    key: 'message_type',
    width: 120,
    type:'tag',
    options: messageTypes,
  },
  {
    title: '消息标题',
    dataIndex: 'title',
    key: 'title',
    width: 150,
    ellipsis: true
  },
  {
    title: '查阅状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    type: 'tag',
    options: lookStatus,
  },
  {
    title: '发送时间',
    dataIndex: 'send_time',
    key: 'send_time',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
    width: 180,
  }
];


// 操作列配置
const actionColumn = {
  title: '操作',
  width: 150,
  fixed: 'right',
  actions: [
    // {
    //   label: '编辑',
    //   props: { type: 'link', size: 'small' },
    //   action: 'edit'
    // },
    {
      label: '详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    // {
    //   label: '删除',
    //   props: { type: 'link', size: 'small', danger: true },
    //   action: 'delete'
    // }
  ]
};

// 搜索配置
const searchConfig = ref([
  {
    field: 'category',
    label: '消息分类',
    type: 'select',
    placeholder: '请选择消息分类',
    props: {
      allowClear: true,
      options: [
        { label: '通知公告', value: '通知公告' },
        { label: '系统提醒', value: '系统提醒' },
        { label: '预警信息', value: '预警信息' },
        { label: '工作安排', value: '工作安排' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'company_name',
    label: '单位名称',
    type: 'input',
    placeholder: '请输入单位名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'sender_name',
    label: '发送人姓名',
    type: 'input',
    placeholder: '请输入发送人姓名',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'message_type',
    label: '消息类型',
    type: 'select',
    placeholder: '请选择消息类型',
    props: {
      allowClear: true,
      options: messageTypes
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '查阅状态',
    type: 'select',
    placeholder: '请选择查阅状态',
    props: {
      allowClear: true,
      options: [
        { label: '已读', value: '1' },
        { label: '未读', value: '0' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'timeRange',
    label: '发送时间',
    type: 'date-range',
    placeholder: ['开始时间', '结束时间'],
    props: {
      showTime: { format: 'HH:mm:ss' },
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: "YYYY-MM-DD HH:mm:ss"
    },
    colSpan: 6
  }
]);

// 响应配置
const responseConfig = {
  listKey: 'messages',
  totalKey: 'pagination.total_count',
};

// 分页配置
const paginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
  pageSizeKey: 'pageSize',
  currentKey: 'pageNum'
};

// 表单配置
const formSchema = [
  {
    key: 'business_id',
    type: 'input',
    label: '业务ID',
    placeholder: '请输入业务ID',
    required: true,
    rules: [
      { required: true, message: '请输入业务ID', trigger: 'blur' },
      { min: 1, max: 50, message: '业务ID长度为1-50个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'category',
    type: 'select',
    label: '消息分类',
    placeholder: '请选择消息分类',
    props: {
      options: [
        { label: '通知公告', value: '通知公告' },
        { label: '系统提醒', value: '系统提醒' },
        { label: '预警信息', value: '预警信息' },
        { label: '工作安排', value: '工作安排' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择消息分类', trigger: 'change' }
    ]
  },
  {
    key: 'company_name',
    type: 'input',
    label: '单位名称',
    placeholder: '请输入单位名称',
    required: true,
    rules: [
      { required: true, message: '请输入单位名称', trigger: 'blur' },
      { min: 2, max: 100, message: '单位名称长度为2-100个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'sender_name',
    type: 'input',
    label: '发送人姓名',
    placeholder: '请输入发送人姓名',
    required: true,
    rules: [
      { required: true, message: '请输入发送人姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '发送人姓名长度为2-20个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'sender_phone',
    type: 'input',
    label: '发送人电话',
    placeholder: '请输入发送人电话',
    required: true,
    rules: [
      { required: true, message: '请输入发送人电话', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
  },
  {
    key: 'message_type',
    type: 'select',
    label: '消息类型',
    placeholder: '请选择消息类型',
    props: {
      options: [
        { label: '紧急', value: '紧急' },
        { label: '重要', value: '重要' },
        { label: '一般', value: '一般' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择消息类型', trigger: 'change' }
    ]
  },
  {
    key: 'title',
    type: 'input',
    label: '消息标题',
    placeholder: '请输入消息标题',
    required: true,
    rules: [
      { required: true, message: '请输入消息标题', trigger: 'blur' },
      { min: 5, max: 100, message: '消息标题长度为5-100个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'content',
    type: 'textarea',
    label: '消息内容',
    placeholder: '请输入消息内容',
    props: {
      rows: 4
    },
    required: true,
    rules: [
      { required: true, message: '请输入消息内容', trigger: 'blur' },
      { min: 10, max: 1000, message: '消息内容长度为10-1000个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'status',
    type: 'radio-group',
    label: '查阅状态',
    props: {
      options: [
        { label: '已读', value: '1' },
        { label: '未读', value: '0' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择查阅状态', trigger: 'change' }
    ]
  }
];

// 模拟数据存储
let messages: Message[] = [
  {
    id: 'msg001',
    business_id: 'BUS20251201001',
    category: '通知公告',
    company_name: '安全生产监督管理局',
    sender_name: '张主任',
    sender_phone: '10000000000',
    message_type: '重要',
    title: '关于开展冬季安全生产大检查的通知',
    content: '各相关单位：为确保冬季安全生产形势稳定，决定在全市范围内开展冬季安全生产大检查，请各单位认真组织落实。',
    status: '1',
    send_time: '2025-12-01 09:30:00',
    create_time: '2025-12-01 09:30:00',
    update_time: '2025-12-01 09:30:00'
  },
  {
    id: 'msg002',
    business_id: 'BUS20251201002',
    category: '预警信息',
    company_name: '气象局',
    sender_name: '李预报员',
    sender_phone: '10000000000',
    message_type: '紧急',
    title: '寒潮蓝色预警信号',
    content: '预计未来48小时内，我市将出现强降温天气，日平均气温将下降8℃以上，请注意防范。',
    status: '0',
    send_time: '2025-12-01 14:15:00',
    create_time: '2025-12-01 14:15:00',
    update_time: '2025-12-01 14:15:00'
  },
  {
    id: 'msg003',
    business_id: 'BUS20251201003',
    category: '系统提醒',
    company_name: '系统管理员',
    sender_name: '王管理员',
    sender_phone: '10000000000',
    message_type: '一般',
    title: '系统维护通知',
    content: '系统将于今晚23:00-次日凌晨2:00进行例行维护，届时将暂停服务，请提前做好相关准备。',
    status: '1',
    send_time: '2025-12-01 16:45:00',
    create_time: '2025-12-01 16:45:00',
    update_time: '2025-12-01 16:45:00'
  }
];

// 生成唯一ID
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `msg${timestamp}${random}`;
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
  let filteredData = [...messages];
  
  if (rest.business_id) {
    filteredData = filteredData.filter(item => 
      item.business_id.includes(rest.business_id)
    );
  }
  
  if (rest.category) {
    filteredData = filteredData.filter(item => 
      item.category === rest.category
    );
  }
  
  if (rest.company_name) {
    filteredData = filteredData.filter(item => 
      item.company_name.includes(rest.company_name)
    );
  }
  
  if (rest.sender_name) {
    filteredData = filteredData.filter(item => 
      item.sender_name.includes(rest.sender_name)
    );
  }
  
  if (rest.message_type) {
    filteredData = filteredData.filter(item => 
      item.message_type === rest.message_type
    );
  }
  
  if (rest.status) {
    filteredData = filteredData.filter(item => 
      item.status === rest.status
    );
  }
  
  // 处理时间范围
  if (rest.start_time && rest.end_time) {
    filteredData = filteredData.filter(item => {
      const itemTime = new Date(item.send_time).getTime();
      const startTime = new Date(rest.start_time).getTime();
      const endTime = new Date(rest.end_time).getTime();
      return itemTime >= startTime && itemTime <= endTime;
    });
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    messages: pagedData,
    pagination: {
      total_count: filteredData.length
    }
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
  
  // 处理时间范围参数
  if (params.timeRange && Array.isArray(params.timeRange) && params.timeRange.length === 2) {
    formattedParams.start_time = params.timeRange[0];
    formattedParams.end_time = params.timeRange[1];
  }
  
  delete formattedParams.timeRange;
  
  return formattedParams;
};

// 方法
const showAddModal = () => {
  modalTitle.value = '新增消息';
  resetForm();
  modalVisible.value = true;
};

const editMessageFn = (record: Message) => {
  modalTitle.value = '编辑消息';
  formState.id = record.id;
  formState.business_id = record.business_id;
  formState.category = record.category;
  formState.company_name = record.company_name;
  formState.sender_name = record.sender_name;
  formState.sender_phone = record.sender_phone;
  formState.message_type = record.message_type;
  formState.title = record.title;
  formState.content = record.content;
  formState.status = record.status;
  modalVisible.value = true;
};

const showMessageDetail = (record: Message) => {
  record.status = record.status === '0' ?'未读':'已读'
  selectedMessage.value = { ...record };

  detailModalVisible.value = true;
};

const confirmDelete = (record: Message) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除消息"${record.title}"吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // 模拟删除操作延迟
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 从数组中删除数据
        const index = messages.findIndex(item => item.id === record.id);
        if (index !== -1) {
          messages.splice(index, 1);
          message.success('删除消息成功');
          
          // 重新加载数据
          smartTableRef.value?.refresh();
        } else {
          throw new Error('未找到要删除的消息');
        }
      } catch (error) {
        console.error('删除消息失败:', error);
        message.error('删除消息失败');
      }
    }
  });
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增消息') {
      // 新增操作
      const newMessage: Message = {
        id: generateId(),
        business_id: formData.business_id,
        category: formData.category,
        company_name: formData.company_name,
        sender_name: formData.sender_name,
        sender_phone: formData.sender_phone,
        message_type: formData.message_type,
        title: formData.title,
        content: formData.content,
        status: formData.status,
        send_time: getCurrentTime(),
        create_time: getCurrentTime(),
        update_time: getCurrentTime()
      };
      
      messages.unshift(newMessage);
      message.success('新增消息成功');
    } else {
      // 编辑操作
      const index = messages.findIndex(item => item.id === formData.id);
      if (index !== -1) {
        messages[index] = {
          ...messages[index],
          business_id: formData.business_id,
          category: formData.category,
          company_name: formData.company_name,
          sender_name: formData.sender_name,
          sender_phone: formData.sender_phone,
          message_type: formData.message_type,
          title: formData.title,
          content: formData.content,
          status: formData.status,
          update_time: getCurrentTime()
        };
        message.success('编辑消息成功');
      } else {
        throw new Error('未找到要编辑的消息');
      }
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增消息' ? '新增消息失败' : '编辑消息失败');
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

const resetForm = () => {
  formState.id = '';
  formState.business_id = '';
  formState.category = '';
  formState.company_name = '';
  formState.sender_name = '';
  formState.sender_phone = '';
  formState.message_type = '';
  formState.title = '';
  formState.content = '';
  formState.status = '';
};

const closeDetailModal = () => {
  detailModalVisible.value = false;
  selectedMessage.value = {
    id: '',
    business_id: '',
    category: '',
    company_name: '',
    sender_name: '',
    sender_phone: '',
    message_type: '',
    title: '',
    content: '',
    status: '',
    send_time: ''
  };
};

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

// 表格操作事件处理
const handleTableAction = (action: string, record: Message) => {
  switch (action) {
    case 'edit':
      editMessageFn(record);
      break;
    case 'detail':
      showMessageDetail(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

onBeforeMount(() => {
  // 页面初始化逻辑
});
</script>

<style scoped>
.message-container {
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

.detail-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>