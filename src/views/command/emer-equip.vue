<template>
  <div class="emer-equip-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="leading-none ml-1">新增装备</span>
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

    <!-- 新增/编辑装备弹窗 -->
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
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
        mode="form"
        formLayout="horizontal"
      />
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除装备 "{{ currentEquipment?.equip_name }}" 吗？此操作不可恢复。</p>
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
interface EmergencyEquipment {
  equip_id: string;
  team_belong: string;
  equip_name: string;
  performance_params: string;
  purpose: string;
  area_belong: string;
  owner_unit: string;
  legal_person: string;
  legal_person_phone: string;
  operator: string;
  operator_phone: string;
  update_time?: string;
  create_time?: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增装备');
const currentEquipment = ref<EmergencyEquipment>();
const formRef = ref();
const smartTableRef = ref();

// 表单状态
const formState = reactive({
  equip_id: '',
  team_belong: '',
  equip_name: '',
  performance_params: '',
  purpose: '',
  area_belong: '',
  owner_unit: '',
  legal_person: '',
  legal_person_phone: '',
  operator: '',
  operator_phone: ''
});

// 表格配置
const responseConfig = {
  listKey: 'equipments',
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
const columns: ExtendedColumnItem<EmergencyEquipment>[] = [
  {
    title: '所属队伍',
    dataIndex: 'team_belong',
    key: 'team_belong',
    width: '120px',
    ellipsis: true
  },
  {
    title: '装/设备名称',
    dataIndex: 'equip_name',
    key: 'equip_name',
    width: '150px',
    ellipsis: true
  },
  {
    title: '性能参数',
    dataIndex: 'performance_params',
    key: 'performance_params',
    width: '150px',
    ellipsis: true
  },
  {
    title: '用途',
    dataIndex: 'purpose',
    key: 'purpose',
    width: '100px',
    ellipsis: true
  },
  {
    title: '所属区域',
    dataIndex: 'area_belong',
    key: 'area_belong',
    width: '100px',
    ellipsis: true
  },
  {
    title: '权属单位',
    dataIndex: 'owner_unit',
    key: 'owner_unit',
    width: '100px',
    ellipsis: true
  },
  {
    title: '法人',
    dataIndex: 'legal_person',
    key: 'legal_person',
    width: '80px',
    ellipsis: true
  },
  {
    title: '法人电话',
    dataIndex: 'legal_person_phone',
    key: 'legal_person_phone',
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
    field: 'equip_name',
    label: '装/设备名称',
    type: 'input',
    placeholder: '请输入装/设备名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'team_belong',
    label: '所属队伍',
    type: 'input',
    placeholder: '请输入所属队伍',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'legal_person',
    label: '法人',
    type: 'input',
    placeholder: '请输入法人',
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
let emergencyEquipments: EmergencyEquipment[] = [
  {
    equip_id: 'equip001',
    team_belong: '市消防支队',
    equip_name: '消防车',
    performance_params: '载水量10吨，泡沫容量2吨',
    purpose: '灭火救援',
    area_belong: '示例地区市',
    owner_unit: '市消防局',
    legal_person: '张三',
    legal_person_phone: '10000000000',
    operator: '李四',
    operator_phone: '10000000000',
    update_time: '2025-12-01 10:30:00',
    create_time: '2024-11-01 09:00:00'
  },
  {
    equip_id: 'equip002',
    team_belong: '省应急救援队',
    equip_name: '无人机',
    performance_params: '续航时间30分钟，高清摄像',
    purpose: '侦察监测',
    area_belong: '河北省',
    owner_unit: '省应急管理厅',
    legal_person: '王五',
    legal_person_phone: '10000000000',
    operator: '赵六',
    operator_phone: '10000000000',
    update_time: '2025-12-01 11:15:00',
    create_time: '2024-11-02 10:00:00'
  },
  {
    equip_id: 'equip003',
    team_belong: '市医疗急救中心',
    equip_name: '救护车',
    performance_params: '配备呼吸机、心电监护仪',
    purpose: '医疗救护',
    area_belong: '示例地区市',
    owner_unit: '市卫健委',
    legal_person: '孙七',
    legal_person_phone: '10000000000',
    operator: 'Maintainer八',
    operator_phone: '10000000000',
    update_time: '2025-12-01 09:45:00',
    create_time: '2024-11-03 14:00:00'
  }
];

// 生成唯一ID
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `equip${timestamp}${random}`;
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
  let filteredData = [...emergencyEquipments];
  
  if (rest.equip_name) {
    filteredData = filteredData.filter(item => 
      item.equip_name.includes(rest.equip_name)
    );
  }
  
  if (rest.team_belong) {
    filteredData = filteredData.filter(item => 
      item.team_belong.includes(rest.team_belong)
    );
  }
  
  if (rest.legal_person) {
    filteredData = filteredData.filter(item => 
      item.legal_person.includes(rest.legal_person)
    );
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    equipments: pagedData,
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
    key: 'team_belong',
    type: 'input',
    label: '所属队伍',
    placeholder: '请输入所属队伍',
    required: true,
    rules: [
      { required: true, message: '请输入所属队伍', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'equip_name',
    type: 'input',
    label: '装/设备名称',
    placeholder: '请输入装/设备名称',
    required: true,
    rules: [
      { required: true, message: '请输入装/设备名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'performance_params',
    type: 'textarea',
    label: '性能参数',
    placeholder: '请输入性能参数',
    required: true,
    props: {
      rows: 3
    },
    rules: [
      { required: true, message: '请输入性能参数', trigger: 'blur' },
      { min: 5, max: 200, message: '参数描述长度为5-200个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'purpose',
    type: 'input',
    label: '用途',
    placeholder: '请输入用途',
    required: true,
    rules: [
      { required: true, message: '请输入用途', trigger: 'blur' },
      { min: 2, max: 100, message: '用途长度为2-100个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'area_belong',
    type: 'input',
    label: '所属区域',
    placeholder: '请输入所属区域',
    required: true,
    rules: [
      { required: true, message: '请输入所属区域', trigger: 'blur' },
      { min: 2, max: 50, message: '区域长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'owner_unit',
    type: 'input',
    label: '权属单位',
    placeholder: '请输入权属单位',
    required: true,
    rules: [
      { required: true, message: '请输入权属单位', trigger: 'blur' },
      { min: 2, max: 50, message: '单位名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'legal_person',
    type: 'input',
    label: '法人',
    placeholder: '请输入法人',
    required: true,
    rules: [
      { required: true, message: '请输入法人', trigger: 'blur' },
      { min: 2, max: 20, message: '法人姓名长度为2-20个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'legal_person_phone',
    type: 'input',
    label: '法人电话',
    placeholder: '请输入法人电话',
    required: true,
    rules: [
      { required: true, message: '请输入法人电话', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的电话号码', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'operator',
    type: 'input',
    label: '操作人员',
    placeholder: '请输入操作人员',
    required: true,
    rules: [
      { required: true, message: '请输入操作人员', trigger: 'blur' },
      { min: 2, max: 20, message: '操作人员姓名长度为2-20个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'operator_phone',
    type: 'input',
    label: '操作人员电话',
    placeholder: '请输入操作人员电话',
    required: true,
    rules: [
      { required: true, message: '请输入操作人员电话', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/, message: '请输入正确的电话号码', trigger: 'blur' },
    ],
    colSpan: 12
  }
];

// 方法
const showAddModal = () => {
  modalTitle.value = '新增装备';
  resetForm();
  modalVisible.value = true;
};

const editEquipmentFn = async (record: EmergencyEquipment) => {
  try {
    modalTitle.value = '编辑装备';
    formState.equip_id = record.equip_id;
    formState.team_belong = record.team_belong;
    formState.equip_name = record.equip_name;
    formState.performance_params = record.performance_params;
    formState.purpose = record.purpose;
    formState.area_belong = record.area_belong;
    formState.owner_unit = record.owner_unit;
    formState.legal_person = record.legal_person;
    formState.legal_person_phone = record.legal_person_phone;
    formState.operator = record.operator;
    formState.operator_phone = record.operator_phone;

    modalVisible.value = true;
  } catch (error) {
    console.error('获取装备详情失败:', error);
    message.error('获取装备详情失败');
  }
};

const confirmDelete = (record: EmergencyEquipment) => {
  currentEquipment.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增装备') {
      // 新增操作
      const newEquipment: EmergencyEquipment = {
        equip_id: generateId(),
        team_belong: formData.team_belong,
        equip_name: formData.equip_name,
        performance_params: formData.performance_params,
        purpose: formData.purpose,
        area_belong: formData.area_belong,
        owner_unit: formData.owner_unit,
        legal_person: formData.legal_person,
        legal_person_phone: formData.legal_person_phone,
        operator: formData.operator,
        operator_phone: formData.operator_phone,
        create_time: getCurrentTime(),
        update_time: getCurrentTime()
      };
      
      emergencyEquipments.unshift(newEquipment);
      message.success('新增装备成功');
    } else {
      // 编辑操作
      const index = emergencyEquipments.findIndex(item => item.equip_id === formData.equip_id);
      if (index !== -1) {
        emergencyEquipments[index] = {
          ...emergencyEquipments[index],
          team_belong: formData.team_belong,
          equip_name: formData.equip_name,
          performance_params: formData.performance_params,
          purpose: formData.purpose,
          area_belong: formData.area_belong,
          owner_unit: formData.owner_unit,
          legal_person: formData.legal_person,
          legal_person_phone: formData.legal_person_phone,
          operator: formData.operator,
          operator_phone: formData.operator_phone,
          update_time: getCurrentTime()
        };
        message.success('编辑装备成功');
      } else {
        throw new Error('未找到要编辑的装备');
      }
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增装备' ? '新增装备失败' : '编辑装备失败');
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
    if (!currentEquipment.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从数组中删除数据
    const index = emergencyEquipments.findIndex(item => item.equip_id === currentEquipment.value?.equip_id);
    if (index !== -1) {
      emergencyEquipments.splice(index, 1);
      message.success('删除装备成功');
    } else {
      throw new Error('未找到要删除的装备');
    }
    
    deleteModalVisible.value = false;
    currentEquipment.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除装备失败:', error);
    message.error('删除装备失败');
  }
};

const resetForm = () => {
  formState.equip_id = '';
  formState.team_belong = '';
  formState.equip_name = '';
  formState.performance_params = '';
  formState.purpose = '';
  formState.area_belong = '';
  formState.owner_unit = '';
  formState.legal_person = '';
  formState.legal_person_phone = '';
  formState.operator = '';
  formState.operator_phone = '';
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
const handleAction = (action: string, record: EmergencyEquipment, index: number) => {
  switch (action) {
    case 'edit':
      editEquipmentFn(record);
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
.emer-equip-container {
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