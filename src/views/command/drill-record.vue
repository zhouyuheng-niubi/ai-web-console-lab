
<template>
  <div class="drill-record-container">
    <!-- 头部操作区域 -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm mb-[16px] flex justify-between items-center">
      <div class="flex gap-3">
        <Button 
          type="primary" 
          style="background-color: #4362EF;"
          @click="showAddModal"
          :icon="h(PlusOutlined)"
        >
          新增记录
        </Button>
        <Button @click="exportData" :loading="exportLoading">
          <span class="flex items-center">
            <DownloadOutlined />
            <span class="leading-none ml-1">导出数据</span>
          </span>
        </Button>
      </div>
      <div class="flex items-center gap-4">
        <h2 class="text-[18px] font-semibold text-[#1f2937]">演练记录管理</h2>
        <div class="text-sm text-gray-600">
          共 <span class="font-semibold text-blue-600">{{ drillRecordsData.length }}</span> 条记录
        </div>
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

    <!-- 新增/编辑记录弹窗 -->
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
      <p>确定要删除演练记录 "{{ currentRecord?.record_name }}" 吗？此操作不可恢复。</p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, h } from 'vue';
import { 
  Button, 
  Modal, 
  message
} from 'ant-design-vue';
import { 
  PlusOutlined,
  DownloadOutlined
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
interface DrillRecord {
  record_id: string;
  record_name: string;
  drill_plan_id: string; // 关联演练计划ID
  drill_type: string;
  drill_level: string;
  drill_time: string;
  drill_location: string;
  participants_count: number;
  plan_attachment?: string;
  update_time?: string;
  create_time?: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增记录');
const currentRecord = ref<DrillRecord>();
const formRef = ref();
const smartTableRef = ref();
const exportLoading = ref(false);

// 表单状态
const formState = reactive({
  record_id: '',
  record_name: '',
  drill_plan_id: '', // 关联演练计划ID
  drill_type: '',
  drill_level: '',
  drill_time: '',
  drill_location: '',
  participants_count: 0,
  plan_attachment: ''
});

// 表格配置
const responseConfig = {
  listKey: 'records',
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

// 演练类型选项
const drillTypeOptions = [
  { label: '实验室安全演练', value: 'lab_safety_drill' },
  { label: '化学品泄漏演练', value: 'chemical_spill_drill' },
  { label: '辐射防护演练', value: 'radiation_protection_drill' },
  { label: '生物安全演练', value: 'biosafety_drill' },
  { label: '特种设备应急演练', value: 'special_equipment_drill' },
  { label: '消防安全演练', value: 'fire_safety_drill' },
  { label: '综合应急演练', value: 'comprehensive_drill' }
];

// 演练级别选项
const drillLevelOptions = [
  { label: '研究所级', value: 'institute' },
  { label: '部门级', value: 'department' },
  { label: '实验室级', value: 'laboratory' },
  { label: '项目级', value: 'project' }
];

// 演练计划选项（从演练计划页面获取）
const drillPlanOptions = [
  { label: '2025年Q1实验室化学品泄漏应急演练', value: 'drill001' },
  { label: '生物安全三级实验室应急演练', value: 'drill002' },
  { label: '辐射防护应急演练', value: 'drill003' },
  { label: '精密仪器设备故障应急演练', value: 'drill004' },
  { label: '综合安全生产事故应急演练', value: 'drill005' },
  { label: '高压容器安全应急演练', value: 'drill006' },
  { label: '实验室消防安全专项演练', value: 'drill007' }
];

// 表格列配置
const columns: ExtendedColumnItem<DrillRecord>[] = [
  {
    title: '演练计划',
    dataIndex: 'drill_plan_id',
    key: 'drill_plan_id',
    width: '150px',
    ellipsis: true,
    formatter: (value: string) => {
      const plan = drillPlanOptions.find(option => option.value === value);
      return plan ? plan.label : value;
    }
  },
  {
    title: '记录名称',
    dataIndex: 'record_name',
    key: 'record_name',
    width: '200px',
    ellipsis: true
  },
  {
    title: '演练类型',
    dataIndex: 'drill_type',
    key: 'drill_type',
    width: '120px',
    ellipsis: true,
    type: 'select',
    options: drillTypeOptions
  },
  {
    title: '演练级别',
    dataIndex: 'drill_level',
    key: 'drill_level',
    width: '100px',
    ellipsis: true,
    type: 'select',
    options: drillLevelOptions
  },
  {
    title: '演练时间',
    dataIndex: 'drill_time',
    key: 'drill_time',
    width: '160px',
    ellipsis: true,
    formatter: (value: string) => {
      try {
        return value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '--'
      } catch (error) {
        return value || '--';
      }
    }
  },
  {
    title: '演练地点',
    dataIndex: 'drill_location',
    key: 'drill_location',
    width: '150px',
    ellipsis: true
  },
  {
    title: '参与人数',
    dataIndex: 'participants_count',
    key: 'participants_count',
    width: '100px',
    ellipsis: true,
    formatter: (value: number) => {
      return value !== undefined && value !== null ? value.toString() : '--'
    }
  },
  // {
  //   title: '演练方案附件',
  //   dataIndex: 'plan_attachment',
  //   key: 'plan_attachment',
  //   width: '12%',
  //   formatter: (value: string) => {
  //     return value || '--'
  //   }
  // },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: '160px',
    ellipsis: true,
    formatter: (value: string) => {
      try {
        return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '--'
      } catch (error) {
        return value || '--';
      }
    }
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'drill_plan_id',
    label: '演练计划',
    type: 'select',
    placeholder: '请选择演练计划',
    props: {
      allowClear: true,
      options: drillPlanOptions
    },
    colSpan: 6
  },
  {
    field: 'record_name',
    label: '记录名称',
    type: 'input',
    placeholder: '请输入记录名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'drill_type',
    label: '演练类型',
    type: 'select',
    placeholder: '请选择演练类型',
    props: {
      allowClear: true,
      options: drillTypeOptions
    },
    colSpan: 6
  },
  {
    field: 'drill_level',
    label: '演练级别',
    type: 'select',
    placeholder: '请选择演练级别',
    props: {
      allowClear: true,
      options: drillLevelOptions
    },
    colSpan: 6
  },
  {
    field: 'drill_location',
    label: '演练地点',
    type: 'input',
    placeholder: '请输入演练地点',
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

// 静态数据（基于演练计划生成的演练记录）
const staticDrillRecords: DrillRecord[] = [
  {
    record_id: 'record001',
    record_name: '2025年Q1实验室化学品泄漏应急演练记录',
    drill_plan_id: 'drill001', // 关联演练计划ID
    drill_type: 'chemical_spill_drill',
    drill_level: 'institute',
    drill_time: '2025-03-15 14:00:00',
    drill_location: 'A栋实验室101室',
    participants_count: 35,
    plan_attachment: '',
    update_time: '2025-03-15 18:30:00',
    create_time: '2025-03-15 16:30:00'
  },
  {
    record_id: 'record002',
    record_name: '生物安全三级实验室应急演练记录',
    drill_plan_id: 'drill002', // 关联演练计划ID
    drill_type: 'biosafety_drill',
    drill_level: 'institute',
    drill_time: '2025-11-28 10:00:00',
    drill_location: '生物安全实验室B区',
    participants_count: 28,
    plan_attachment: '',
    update_time: '2025-11-28 15:20:00',
    create_time: '2025-11-28 10:30:00'
  },
  {
    record_id: 'record003',
    record_name: '辐射防护应急演练记录',
    drill_plan_id: 'drill003', // 关联演练计划ID
    drill_type: 'radiation_protection_drill',
    drill_level: 'department',
    drill_time: '2025-12-10 09:00:00',
    drill_location: '辐射防护中心',
    participants_count: 22,
    plan_attachment: '',
    update_time: '2025-12-10 12:45:00',
    create_time: '2025-12-10 09:15:00'
  },
  {
    record_id: 'record004',
    record_name: '精密仪器设备故障应急演练记录',
    drill_plan_id: 'drill004', // 关联演练计划ID
    drill_type: 'special_equipment_drill',
    drill_level: 'laboratory',
    drill_time: '2025-11-25 13:00:00',
    drill_location: '精密仪器实验室C302',
    participants_count: 18,
    plan_attachment: '',
    update_time: '2025-11-25 17:30:00',
    create_time: '2025-11-25 13:30:00'
  },
  {
    record_id: 'record005',
    record_name: '综合安全生产事故应急演练记录',
    drill_plan_id: 'drill005', // 关联演练计划ID
    drill_type: 'comprehensive_drill',
    drill_level: 'institute',
    drill_time: '2025-11-20 14:00:00',
    drill_location: '研究所主广场',
    participants_count: 85,
    plan_attachment: '',
    update_time: '2025-11-20 18:00:00',
    create_time: '2025-11-20 14:30:00'
  },
  {
    record_id: 'record006',
    record_name: '高压容器安全应急演练记录',
    drill_plan_id: 'drill006', // 关联演练计划ID
    drill_type: 'special_equipment_drill',
    drill_level: 'project',
    drill_time: '2025-10-18 10:30:00',
    drill_location: 'D栋设备间',
    participants_count: 15,
    plan_attachment: '',
    update_time: '2025-10-18 14:20:00',
    create_time: '2025-10-18 11:00:00'
  },
  {
    record_id: 'record007',
    record_name: '实验室消防安全专项演练记录',
    drill_plan_id: 'drill007', // 关联演练计划ID
    drill_type: 'fire_safety_drill',
    drill_level: 'department',
    drill_time: '2025-11-15 15:00:00',
    drill_location: '实验楼E座消防通道',
    participants_count: 42,
    plan_attachment: '',
    update_time: '2025-11-15 18:15:00',
    create_time: '2025-11-15 15:30:00'
  }
];

// 响应式静态数据管理
let drillRecordsData: DrillRecord[] = [...staticDrillRecords];

// API 配置（使用静态数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 过滤数据
  let filteredData = drillRecordsData;
  
  if (rest.record_name) {
    filteredData = filteredData.filter(item => 
      item.record_name.includes(rest.record_name)
    );
  }
  
  if (rest.drill_plan_id) {
    filteredData = filteredData.filter(item => 
      item.drill_plan_id === rest.drill_plan_id
    );
  }
  
  if (rest.drill_type) {
    filteredData = filteredData.filter(item => 
      item.drill_type === rest.drill_type
    );
  }
  
  if (rest.drill_level) {
    filteredData = filteredData.filter(item => 
      item.drill_level === rest.drill_level
    );
  }
  
  if (rest.drill_location) {
    filteredData = filteredData.filter(item => 
      item.drill_location.includes(rest.drill_location)
    );
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    records: pagedData,
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
    key: 'drill_plan_id',
    type: 'select',
    label: '关联演练计划',
    placeholder: '请选择关联的演练计划',
    required: true,
    props: {
      options: drillPlanOptions
    },
    rules: [
      { required: true, message: '请选择关联的演练计划', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'record_name',
    type: 'input',
    label: '记录名称',
    placeholder: '请输入演练记录名称',
    required: true,
    rules: [
      { required: true, message: '请输入演练记录名称', trigger: 'blur' },
      { min: 2, max: 100, message: '名称长度为2-100个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'drill_type',
    type: 'select',
    label: '演练类型',
    placeholder: '请选择演练类型',
    required: true,
    props: {
      options: drillTypeOptions
    },
    rules: [
      { required: true, message: '请选择演练类型', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'drill_level',
    type: 'select',
    label: '演练级别',
    placeholder: '请选择演练级别',
    required: true,
    props: {
      options: drillLevelOptions
    },
    rules: [
      { required: true, message: '请选择演练级别', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'drill_time',
    type: 'datePicker',
    label: '演练时间',
    placeholder: '请选择演练时间',
    required: true,
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm'
    },
    rules: [
      { required: true, message: '请选择演练时间', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'drill_location',
    type: 'input',
    label: '演练地点',
    placeholder: '请输入演练地点',
    required: true,
    rules: [
      { required: true, message: '请输入演练地点', trigger: 'blur' },
      { min: 2, max: 100, message: '地点长度为2-100个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'participants_count',
    type: 'inputNumber',
    label: '参与人数',
    placeholder: '请输入参与人数',
    required: true,
    props: {
      min: 1,
      max: 1000
    },
    rules: [
      { required: true, message: '请输入参与人数', trigger: 'blur' },
      { type: 'number', min: 1, max: 1000, message: '参与人数在1-1000之间', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'plan_attachment',
    type: 'upload',
    label: '演练方案附件',
    placeholder: '请输入附件名称或上传文件',
    required: false,
    props: {
      name: 'file',
      action: '/upload', // 这里应该是实际的上传接口地址
      multiple: true,
      accept: '.pdf,.doc,.docx,.xls,.xlsx',
      maxCount: 5,
    },
    // rules: [
    //   { max: 200, message: '附件名称长度不超过200个字符', trigger: 'blur' },
    // ],
    colSpan: 24
  }
];

// 方法
const showAddModal = () => {
  modalTitle.value = '新增记录';
  resetForm();
  modalVisible.value = true;
};

const editRecordFn = async (record: DrillRecord) => {
  try {
    modalTitle.value = '编辑记录';
    formState.record_id = record.record_id;
    formState.record_name = record.record_name;
    formState.drill_plan_id = record.drill_plan_id;
    formState.drill_type = record.drill_type;
    formState.drill_level = record.drill_level;
    formState.drill_time = record.drill_time;
    formState.drill_location = record.drill_location;
    formState.participants_count = record.participants_count;
    
    // 处理附件字段，如果已有附件则转换为Upload组件需要的格式
    if (record.plan_attachment) {
      // 如果plan_attachment是字符串，则转换为包含文件信息的数组
      if (typeof record.plan_attachment === 'string') {
        // 简单处理，实际项目中可能需要根据具体需求调整
        formState.plan_attachment = [{
          uid: '-1',
          name: record.plan_attachment,
          status: 'done',
          url: record.plan_attachment
        }];
      } else {
        formState.plan_attachment = record.plan_attachment;
      }
    } else {
      formState.plan_attachment = [];
    }

    modalVisible.value = true;
  } catch (error) {
    console.error('获取记录详情失败:', error);
    message.error('获取记录详情失败');
  }
};

const confirmDelete = (record: DrillRecord) => {
  currentRecord.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增记录') {
      // 新增演练记录操作
      const newRecord: DrillRecord = {
        record_id: `record${Date.now()}`, // 生成唯一ID
        record_name: formData.record_name,
        drill_plan_id: formData.drill_plan_id, // 关联演练计划ID
        drill_type: formData.drill_type,
        drill_level: formData.drill_level,
        drill_time: formData.drill_time,
        drill_location: formData.drill_location,
        participants_count: formData.participants_count,
        plan_attachment: Array.isArray(formData.plan_attachment) 
          ? formData.plan_attachment.map(file => file.name || file.url).join(',')
          : formData.plan_attachment || '',
        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      
      // 添加到数据数组
      drillRecordsData.unshift(newRecord);
      message.success('新增记录成功');
    } else {
      // 编辑演练记录操作
      const index = drillRecordsData.findIndex(item => item.record_id === formData.record_id);
      if (index !== -1) {
        drillRecordsData[index] = {
          ...drillRecordsData[index],
          record_name: formData.record_name,
          drill_plan_id: formData.drill_plan_id, // 关联演练计划ID
          drill_type: formData.drill_type,
          drill_level: formData.drill_level,
          drill_time: formData.drill_time,
          drill_location: formData.drill_location,
          participants_count: formData.participants_count,
          plan_attachment: Array.isArray(formData.plan_attachment) 
            ? formData.plan_attachment.map(file => file.name || file.url).join(',')
            : formData.plan_attachment || '',
          update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
      }
      message.success('编辑记录成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增记录' ? '新增记录失败' : '编辑记录失败');
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
    if (!currentRecord.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从数据数组中删除指定记录
    const index = drillRecordsData.findIndex(item => item.record_id === currentRecord.value?.record_id);
    if (index !== -1) {
      drillRecordsData.splice(index, 1);
    }
    
    deleteModalVisible.value = false;
    currentRecord.value = undefined;
    message.success('删除记录成功');
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除记录失败:', error);
    message.error('删除记录失败');
  }
};

const resetForm = () => {
  formState.record_id = '';
  formState.record_name = '';
  formState.drill_plan_id = '';
  formState.drill_type = '';
  formState.drill_level = '';
  formState.drill_time = '';
  formState.drill_location = '';
  formState.participants_count = 0;
  formState.plan_attachment = [];
};

// 获取演练类型对应的显示文本
const getDrillTypeText = (type: string) => {
  const typeMap: { [key: string]: string } = {
    'lab_safety_drill': '实验室安全演练',
    'chemical_spill_drill': '化学品泄漏演练',
    'radiation_protection_drill': '辐射防护演练',
    'biosafety_drill': '生物安全演练',
    'special_equipment_drill': '特种设备应急演练',
    'fire_safety_drill': '消防安全演练',
    'comprehensive_drill': '综合应急演练'
  };
  return typeMap[type] || type;
};

// 获取演练级别对应的显示文本
const getDrillLevelText = (level: string) => {
  const levelMap: { [key: string]: string } = {
    'institute': '研究所级',
    'department': '部门级',
    'laboratory': '实验室级',
    'project': '项目级'
  };
  return levelMap[level] || level;
};

// 导出数据功能
const exportData = async () => {
  try {
    exportLoading.value = true;
    
    // 模拟导出延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 准备导出数据
    const exportData = drillRecordsData.map(item => ({
      '记录名称': item.record_name,
      '演练类型': getDrillTypeText(item.drill_type),
      '演练级别': getDrillLevelText(item.drill_level),
      '演练时间': item.drill_time,
      '演练地点': item.drill_location,
      '参与人数': item.participants_count,
      '演练方案附件': item.plan_attachment || '',
      '创建时间': item.create_time || '',
      '更新时间': item.update_time || ''
    }));
    
    // 创建CSV内容
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // 如果包含逗号或引号，需要用引号包围
          return typeof value === 'string' && (value.includes(',') || value.includes('"') )
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
    link.setAttribute('download', `演练记录数据_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success(`成功导出 ${drillRecordsData.length} 条演练记录`);
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
  // 数据统计
  const totalCount = data.length;
  const instituteCount = data.filter(item => item.drill_level === 'institute').length;
  const departmentCount = data.filter(item => item.drill_level === 'department').length;
  const laboratoryCount = data.filter(item => item.drill_level === 'laboratory').length;
  
  console.log(`演练记录统计: 总计 ${totalCount} 条，研究所级 ${instituteCount} 条，部门级 ${departmentCount} 条，实验室级 ${laboratoryCount} 条`);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

// 操作列事件处理
const handleAction = (action: string, record: DrillRecord, index: number) => {
  switch (action) {
    case 'edit':
      if (record) {
        editRecordFn(record);
      }
      break;
    case 'delete':
      if (record) {
        confirmDelete(record);
      }
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
.drill-record-container {
  height: 100%;
 
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