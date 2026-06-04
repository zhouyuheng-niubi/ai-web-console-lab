<template>
  <div class="device-management-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <div class="flex gap-3">
        <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
          <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增感知设备</span>
          </span>
        </Button>
        <Button @click="handleExport">
          <span class="flex items-center">
            <span class="leading-none">导出</span>
          </span>
        </Button>
      </div>
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

    <!-- 新增/编辑设备弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="900px"
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

    <!-- 设备详情弹窗 -->
    <Modal 
      v-model:open="detailModalVisible" 
      title="设备详情" 
      width="800px"
      :footer="null"
    >
      <div v-if="currentDevice" class="device-detail">
        <div class="detail-row">
          <span class="detail-label">感知设备名称：</span>
          <span class="detail-value">{{ currentDevice.device_name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">感知设备编码：</span>
          <span class="detail-value">{{ currentDevice.device_code }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">采集类型：</span>
          <span class="detail-value">{{ getCollectionTypeLabel(currentDevice.collection_type) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">所属区域：</span>
          <span class="detail-value">{{ getLocationLabel(currentDevice.location) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">所属部门：</span>
          <span class="detail-value">{{ getDepartmentLabel(currentDevice.department) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">责任人：</span>
          <span class="detail-value">{{ currentDevice.responsible_person }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">状态：</span>
          <span class="detail-value">
            <Tag :color="currentDevice.status === 'active' ? 'green' : 'red'">
              {{ currentDevice.status === 'active' ? '启用' : '禁用' }}
            </Tag>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">投用日期：</span>
          <span class="detail-value">{{ currentDevice.install_date }}</span>
        </div>
      </div>
    </Modal>

    <!-- 绑定设备弹窗 -->
    <Modal 
      v-model:open="bindModalVisible" 
      title="绑定采集数据列表" 
      width="1000px"
      :confirm-loading="bindLoading"
      @ok="handleBindOk"
      @cancel="bindModalVisible = false"
    >
      <div class="bind-content">

        <!-- 采集数据列表区域 -->
        <div class="collection-data-section">
          <div class="mb-3 flex justify-between items-center">
            <span class="font-medium">设备 "{{ currentDevice?.device_name }}" 的采集数据</span>
            <Button size="small" type="primary" ghost @click="refreshCollectionData">
              刷新数据
            </Button>
          </div>
          
          <Table
            :columns="collectionColumns"
            :data-source="collectionData"
            :pagination="collectionPagination"
            :loading="collectionLoading"
            size="small"
            row-key="data_id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'collection_type'">
                <Tag :color="getCollectionTypeColor(record.collection_type)">
                  {{ getCollectionTypeLabel(record.collection_type) }}
                </Tag>
              </template>
            </template>
          </Table>
        </div>
      </div>
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除设备 "{{ currentDevice?.device_name }}" 吗？此操作不可恢复。</p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { 
  Button, 
  Modal, 
  message,
  Tag,
  Form,
  Input,
  Select,
  Table,
  Divider
} from 'ant-design-vue';
import { 
  PlusOutlined
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
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
interface Device {
  device_id: string;
  device_name: string;
  device_code: string;
  collection_type: string;
  location: string;
  department: string;
  responsible_person: string;
  status: 'active' | 'inactive';
  install_date: string;
  create_time?: string;
  update_time?: string;
}

// 采集数据类型定义
interface CollectionData {
  data_id: string;
  data_name: string;
  unit: string;
  collection_type: string;
  device_id: string;
  last_update: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const detailModalVisible = ref(false);
const bindModalVisible = ref(false);
const bindLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增感知设备');
const currentDevice = ref<Device>();
const formRef = ref();
const smartTableRef = ref();

// 表单状态
const formState = reactive({
  device_id: '',
  device_name: '',
  device_code: '',
  collection_type: '',
  location: '',
  department: '',
  responsible_person: '',
  status: 'active' as 'active' | 'inactive',
  install_date: ''
});

// 绑定表单
const bindForm = reactive({
  bind_type: '',
  bind_target: '',
  remark: ''
});

// 采集数据相关
const collectionData = ref<CollectionData[]>([]);
const collectionLoading = ref(false);
const collectionPagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: false,
  pageSizeOptions: ['5', '10', '20'],
  showTotal: (total: number) => `共 ${total} 条数据`,
});

// 表格配置
const responseConfig = {
  listKey: 'devices',
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

const collectionTypes = [
  { label: '温度传感器', value: 'temperature' },
  { label: '湿度传感器', value: 'humidity' },
  { label: '烟雾传感器', value: 'smoke' },
  { label: '气体传感器', value: 'gas' },
  { label: '压力传感器', value: 'pressure' },
  { label: '振动传感器', value: 'vibration' },
  { label: '红外传感器', value: 'infrared' },
  { label: '光学传感器', value: 'camera' }
];

const locations = [
  { label: '生产车间A', value: 'workshop_a' },
  { label: '生产车间B', value: 'workshop_b' },
  { label: '仓库1号', value: 'warehouse_1' },
  { label: '仓库2号', value: 'warehouse_2' },
  { label: '办公区域', value: 'office_area' },
  { label: '配电室', value: 'power_room' },
  { label: '机房', value: 'server_room' }
];

const departments = [
  { label: '生产部', value: 'production' },
  { label: '仓储部', value: 'warehouse' },
  { label: '安保部', value: 'security' },
  { label: '设备部', value: 'equipment' },
  { label: 'IT部', value: 'it' },
  { label: '行政部', value: 'administration' }
];

// 采集数据表格列配置
const collectionColumns = [
  {
    title: '采集数据名称',
    dataIndex: 'data_name',
    key: 'data_name',
    width: '30%'
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    width: '15%'
  },
  {
    title: '所属采集类型',
    dataIndex: 'collection_type',
    key: 'collection_type',
    width: '25%'
  },
  {
    title: '最后更新',
    dataIndex: 'last_update',
    key: 'last_update',
    width: '30%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
];

// 表格列配置
const columns: ExtendedColumnItem<Device>[] = [
  {
    title: '感知设备名称',
    dataIndex: 'device_name',
    key: 'device_name',
    width: '15%'
  },
  {
    title: '感知设备编码',
    dataIndex: 'device_code',
    key: 'device_code',
    width: '12%'
  },
  {
    title: '采集类型',
    dataIndex: 'collection_type',
    key: 'collection_type',
    width: '12%',
    type: 'tag',
    options: collectionTypes
  },
  {
    title: '所属区域',
    dataIndex: 'location',
    key: 'location',
    width: '8%',
    type: 'tag',
    options: locations
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    key: 'department',
    width: '10%',
    type: 'tag',
    options: departments
  },
  {
    title: '责任人',
    dataIndex: 'responsible_person',
    key: 'responsible_person',
    width: '5%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '8%',
    type: 'tag',
    options: [
      { label: '启用', value: 'active', color: 'green' },
      { label: '禁用', value: 'inactive', color: 'red' }
    ]
  },
  {
    title: '投用日期',
    dataIndex: 'install_date',
    key: 'install_date',
    width: '10%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD')
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'device_name',
    label: '设备名称',
    type: 'input',
    placeholder: '请输入设备名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'device_code',
    label: '设备编码',
    type: 'input',
    placeholder: '请输入设备编码',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'collection_type',
    label: '采集类型',
    type: 'select',
    placeholder: '请选择采集类型',
    props: {
      allowClear: true,
      options: collectionTypes
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
  width: 280,
  actions: [
    {
      label: '详情',
      icon: 'EyeOutlined',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '绑定',
      icon: 'LinkOutlined',
      props: { type: 'link', size: 'small' },
      action: 'bind'
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
const staticDevices: Device[] = [
  {
    device_id: 'device001',
    device_name: '温度传感器01',
    device_code: 'TEMP-2025-001',
    collection_type: 'temperature',
    location: 'workshop_a',
    department: 'production',
    responsible_person: '张三',
    status: 'active',
    install_date: '2025-01-15',
    update_time: '2025-12-01 10:30:00',
    create_time: '2025-01-15 09:00:00'
  },
  {
    device_id: 'device002',
    device_name: '烟雾传感器02',
    device_code: 'SMOKE-2025-002',
    collection_type: 'smoke',
    location: 'warehouse_1',
    department: 'security',
    responsible_person: '李四',
    status: 'active',
    install_date: '2025-02-20',
    update_time: '2025-12-01 11:15:00',
    create_time: '2025-02-20 10:00:00'
  },
  {
    device_id: 'device003',
    device_name: '摄像头03',
    device_code: 'CAM-2025-003',
    collection_type: 'camera',
    location: 'office_area',
    department: 'security',
    responsible_person: '王五',
    status: 'active',
    install_date: '2025-03-10',
    update_time: '2025-12-01 09:45:00',
    create_time: '2025-03-10 14:00:00'
  },
  {
    device_id: 'device004',
    device_name: '湿度传感器04',
    device_code: 'HUMID-2025-004',
    collection_type: 'humidity',
    location: 'warehouse_2',
    department: 'warehouse',
    responsible_person: '赵六',
    status: 'inactive',
    install_date: '2025-04-05',
    update_time: '2025-12-01 12:20:00',
    create_time: '2025-04-05 16:00:00'
  },
  {
    device_id: 'device005',
    device_name: '气体传感器05',
    device_code: 'GAS-2025-005',
    collection_type: 'gas',
    location: 'workshop_b',
    department: 'production',
    responsible_person: '钱七',
    status: 'active',
    install_date: '2025-05-12',
    update_time: '2025-12-01 13:00:00',
    create_time: '2025-05-12 08:00:00'
  },
  {
    device_id: 'device006',
    device_name: '压力传感器06',
    device_code: 'PRESS-2025-006',
    collection_type: 'pressure',
    location: 'power_room',
    department: 'equipment',
    responsible_person: '孙八',
    status: 'active',
    install_date: '2025-06-18',
    update_time: '2025-12-01 14:30:00',
    create_time: '2025-06-18 11:00:00'
  }
];

// 采集数据静态数据
const staticCollectionData: CollectionData[] = [
  {
    data_id: 'data001',
    data_name: '环境温度',
    unit: '°C',
    collection_type: 'temperature',
    device_id: 'device001',
    last_update: '2025-12-05 14:30:00'
  },
  {
    data_id: 'data002',
    data_name: '设备温度',
    unit: '°C',
    collection_type: 'temperature',
    device_id: 'device001',
    last_update: '2025-12-05 14:28:00'
  },
  {
    data_id: 'data003',
    data_name: '烟雾浓度',
    unit: 'ppm',
    collection_type: 'smoke',
    device_id: 'device002',
    last_update: '2025-12-05 14:25:00'
  },
  {
    data_id: 'data004',
    data_name: '火焰检测',
    unit: '级',
    collection_type: 'smoke',
    device_id: 'device002',
    last_update: '2025-12-05 14:22:00'
  },
  {
    data_id: 'data005',
    data_name: '视频流',
    unit: '帧/秒',
    collection_type: 'camera',
    device_id: 'device003',
    last_update: '2025-12-05 14:35:00'
  },
  {
    data_id: 'data006',
    data_name: '运动检测',
    unit: '个/分钟',
    collection_type: 'camera',
    device_id: 'device003',
    last_update: '2025-12-05 14:32:00'
  },
  {
    data_id: 'data007',
    data_name: '相对湿度',
    unit: '%RH',
    collection_type: 'humidity',
    device_id: 'device004',
    last_update: '2025-12-05 14:20:00'
  },
  {
    data_id: 'data008',
    data_name: '绝对湿度',
    unit: 'g/m³',
    collection_type: 'humidity',
    device_id: 'device004',
    last_update: '2025-12-05 14:18:00'
  },
  {
    data_id: 'data009',
    data_name: '甲烷浓度',
    unit: 'ppm',
    collection_type: 'gas',
    device_id: 'device005',
    last_update: '2025-12-05 14:40:00'
  },
  {
    data_id: 'data010',
    data_name: '一氧化碳浓度',
    unit: 'ppm',
    collection_type: 'gas',
    device_id: 'device005',
    last_update: '2025-12-05 14:38:00'
  },
  {
    data_id: 'data011',
    data_name: '管道压力',
    unit: 'MPa',
    collection_type: 'pressure',
    device_id: 'device006',
    last_update: '2025-12-05 14:42:00'
  },
  {
    data_id: 'data012',
    data_name: '气压差',
    unit: 'kPa',
    collection_type: 'pressure',
    device_id: 'device006',
    last_update: '2025-12-05 14:45:00'
  }
];

// API 配置（使用静态数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 过滤数据
  let filteredData = staticDevices;
  
  if (rest.device_name) {
    filteredData = filteredData.filter(item => 
      item.device_name.includes(rest.device_name)
    );
  }
  
  if (rest.device_code) {
    filteredData = filteredData.filter(item => 
      item.device_code.includes(rest.device_code)
    );
  }
  
  if (rest.collection_type) {
    filteredData = filteredData.filter(item => 
      item.collection_type === rest.collection_type
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
    devices: pagedData,
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
    key: 'device_name',
    type: 'input',
    label: '感知设备名称',
    placeholder: '请输入感知设备名称',
    required: true,
    rules: [
      { required: true, message: '请输入感知设备名称', trigger: 'blur' },
      { min: 2, max: 30, message: '名称长度为2-30个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'device_code',
    type: 'input',
    label: '感知设备编码',
    placeholder: '请输入感知设备编码',
    required: true,
    rules: [
      { required: true, message: '请输入感知设备编码', trigger: 'blur' },
      { pattern: /^[A-Z0-9-]+$/, message: '编码只能包含大写字母、数字和连字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'collection_type',
    type: 'select',
    label: '采集类型',
    placeholder: '请选择采集类型',
    required: true,
    props: {
      options: collectionTypes
    },
    rules: [
      { required: true, message: '请选择采集类型', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'location',
    type: 'select',
    label: '所属区域',
    placeholder: '请选择所属区域',
    required: true,
    props: {
      options: locations
    },
    rules: [
      { required: true, message: '请选择所属区域', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'department',
    type: 'select',
    label: '所属部门',
    placeholder: '请选择所属部门',
    required: true,
    props: {
      options: departments
    },
    rules: [
      { required: true, message: '请选择所属部门', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'responsible_person',
    type: 'input',
    label: '责任人',
    placeholder: '请输入责任人',
    required: true,
    rules: [
      { required: true, message: '请输入责任人', trigger: 'blur' },
      { min: 2, max: 10, message: '责任人姓名长度为2-10个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'status',
    type: 'radioGroup',
    label: '状态',
    required: true,
    props: {
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    rules: [
      { required: true, message: '请选择设备状态', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'install_date',
    type: 'datePicker',
    label: '投用日期',
    placeholder: '请选择投用日期',
    required: true,
    props: {
      style: { width: '100%' }
    },
    rules: [
      { required: true, message: '请选择投用日期', trigger: 'change' },
    ],
    colSpan: 12
  }
];

// 工具方法
const getCollectionTypeLabel = (type: string) => {
  const collectionType = collectionTypes.find(item => item.value === type);
  return collectionType ? collectionType.label : type;
};

const getLocationLabel = (location: string) => {
  const loc = locations.find(item => item.value === location);
  return loc ? loc.label : location;
};

const getDepartmentLabel = (department: string) => {
  const dept = departments.find(item => item.value === department);
  return dept ? dept.label : department;
};

const getCollectionTypeColor = (type: string) => {
  const colorMap: { [key: string]: string } = {
    'temperature': 'red',
    'humidity': 'blue',
    'smoke': 'orange',
    'gas': 'purple',
    'pressure': 'green',
    'vibration': 'cyan',
    'infrared': 'magenta',
    'camera': 'geekblue'
  };
  return colorMap[type] || 'default';
};

// 加载采集数据
const loadCollectionData = async (deviceId: string) => {
  try {
    collectionLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 根据设备ID过滤采集数据
    const deviceData = staticCollectionData.filter(item => item.device_id === deviceId);
    
    // 分页处理
    const start = (collectionPagination.current - 1) * collectionPagination.pageSize;
    const end = start + collectionPagination.pageSize;
    const pagedData = deviceData.slice(start, end);
    
    collectionData.value = pagedData;
    collectionPagination.total = deviceData.length;
  } catch (error) {
    console.error('加载采集数据失败:', error);
    message.error('加载采集数据失败');
  } finally {
    collectionLoading.value = false;
  }
};

// 刷新采集数据
const refreshCollectionData = () => {
  if (currentDevice.value) {
    loadCollectionData(currentDevice.value.device_id);
  }
};

// 方法
const showAddModal = () => {
  modalTitle.value = '新增感知设备';
  resetForm();
  modalVisible.value = true;
};

const showDetailModal = (record: Device) => {
  currentDevice.value = record;
  detailModalVisible.value = true;
};

const showBindModal = async (record: Device) => {
  currentDevice.value = record;
  bindForm.bind_type = '';
  bindForm.bind_target = '';
  bindForm.remark = '';
  
  // 重置分页
  collectionPagination.current = 1;
  
  // 加载采集数据
  await loadCollectionData(record.device_id);
  
  bindModalVisible.value = true;
};

const editDeviceFn = async (record: Device) => {
  try {
    modalTitle.value = '编辑设备';
    formState.device_id = record.device_id;
    formState.device_name = record.device_name;
    formState.device_code = record.device_code;
    formState.collection_type = record.collection_type;
    formState.location = record.location;
    formState.department = record.department;
    formState.responsible_person = record.responsible_person;
    formState.status = record.status;
    formState.install_date = record.install_date;

    modalVisible.value = true;
  } catch (error) {
    console.error('获取设备详情失败:', error);
    message.error('获取设备详情失败');
  }
};

const confirmDelete = (record: Device) => {
  currentDevice.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增感知设备') {
      // 模拟新增操作
      message.success('新增感知设备成功');
    } else {
      // 模拟编辑操作
      message.success('编辑设备成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增感知设备' ? '新增感知设备失败' : '编辑设备失败');
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

const handleBindOk = async () => {
  try {
    if (!bindForm.bind_type || !bindForm.bind_target) {
      message.error('请填写绑定类型和绑定目标');
      return;
    }
    
    bindLoading.value = true;
    
    // 模拟绑定操作延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    message.success('设备绑定成功');
    bindModalVisible.value = false;
    currentDevice.value = undefined;
  } catch (error) {
    console.error('绑定失败:', error);
    message.error('设备绑定失败');
  } finally {
    bindLoading.value = false;
  }
};

const handleDelete = async () => {
  try {
    if (!currentDevice.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    deleteModalVisible.value = false;
    currentDevice.value = undefined;
    message.success('删除设备成功');
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除设备失败:', error);
    message.error('删除设备失败');
  }
};

const resetForm = () => {
  formState.device_id = '';
  formState.device_name = '';
  formState.device_code = '';
  formState.collection_type = '';
  formState.location = '';
  formState.department = '';
  formState.responsible_person = '';
  formState.status = 'active';
  formState.install_date = '';
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
const handleAction = (action: string, record: Device, index: number) => {
  switch (action) {
    case 'detail':
      showDetailModal(record);
      break;
    case 'edit':
      editDeviceFn(record);
      break;
    case 'bind':
      showBindModal(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

// 处理导出
const handleExport = () => {
  // 模拟导出操作
  message.loading('正在导出数据...', 2)
  setTimeout(() => {
    const link = document.createElement('a')
    link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQABgAIAAAAIQD1avyxIAEAAH4LAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJyVm07CMBBF9xXfwHYGp7+iyaSgkJhZ2DqQhQ0uToJChuB2sBG0DYhIqCy6Ao+Ky+JSDQnoTnPH+8m393YvpHoeNGL9s/3f6eB9DQG9xQBcP6AC8f8e5D8jvu6Y9Yk1TYqC5GqBTLJaayG5B5DfX/9tG/zJv5H5f8v9tP+9W9f8W8j3Zg+f8uI6B8zQo8jN5P+B8d7P+B8z0p8B8z1p8B8z2p8B8z3p8B8z4p8B8z5p8B8z6p8B8z7p8B8z8p8B8z9p8B8z+p8B8z/p8B8zAp8B8zBp8B8zCp8B8zDp8B8zEp8B8zFp8B8zGp8B8zHp8B8zIp8B8zJp8B8zKp8B8zLp8BzMp8B8zNp8B8zOp8B8zPp8B8zQp8B8zRp8B8zSp8B8zTp8B8zUp8B8zVp8B8zWp8B8zXp8B8zYp8B8zZp8B8z'
    link.download = `感知设备数据_${new Date().toLocaleDateString()}.xlsx`
    link.click()
    message.success('导出成功')
  }, 2000)
}

onMounted(() => {
  // 页面初始化逻辑
});
</script>

<style scoped>
.device-management-container {
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

.device-detail {
  padding: 16px;
}

.detail-row {
  display: flex;
  margin-bottom: 16px;
  align-items: center;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 600;
  color: #666;
  width: 120px;
  flex-shrink: 0;
}

.detail-value {
  color: #333;
  flex: 1;
}

.bind-content {
  max-height: 600px;
  overflow-y: auto;
}

.bind-form-section {
  margin-bottom: 16px;
}

.collection-data-section {
  margin-top: 16px;
}
</style>