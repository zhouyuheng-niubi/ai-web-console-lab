<template>
  <div class="rule-setting-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <div class="flex gap-3">
        <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
          <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增规则</span>
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
        共 <span class="font-semibold text-blue-600">{{ rulesData.length }}</span> 条规则
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

    <!-- 新增/编辑规则弹窗 -->
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

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除规则 "{{ currentRule?.rule_name }}" 吗？此操作不可恢复。</p>
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
  PlusOutlined,
  DownloadOutlined
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
interface RuleSetting {
  rule_id: string;
  rule_name: string;
  alert_level: string;
  threshold_value: number;
  threshold_range: string;
  severity: string;
  description: string;
  notification_method: string[];
  notification_personnel: string[];
  notification_channel: string[];
  status: 'active' | 'inactive';
  create_time?: string;
  update_time?: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增规则');
const currentRule = ref<RuleSetting>();
const formRef = ref();
const smartTableRef = ref();
const exportLoading = ref(false);

// 表单状态
const formState = reactive({
  rule_id: '',
  rule_name: '',
  alert_level: '',
  threshold_value: 0,
  threshold_range: '',
  severity: '',
  description: '',
  notification_method: [],
  notification_personnel: [],
  notification_channel: [],
  status: 'active' as 'active' | 'inactive'
});

// 表格配置
const responseConfig = {
  listKey: 'rules',
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

const severityType = [
      { label: '轻微', value: 'low',color: 'green'},
      { label: '中等', value: 'medium',color: 'orange'},
      { label: '严重', value: 'high',color: 'red'},
      { label: '紧急', value: 'critical',color: 'red'}
]
const levelType = [
  { label: '低', value: 'low',color: 'green'},
  { label: '中', value: 'medium',color: 'orange'},
  { label: '高', value: 'high',color: 'red'},
  { label: '严重', value: 'critical',color: 'red'}

]

// 表格列配置
const columns: ExtendedColumnItem<RuleSetting>[] = [
  {
    title: '规则名称',
    dataIndex: 'rule_name',
    key: 'rule_name',
    width: '18%'
  },
  {
    title: '告警等级',
    dataIndex: 'alert_level',
    key: 'alert_level',
    width: '10%',
    type:'tag',
    options: levelType
  },
  {
    title: '阈值',
    dataIndex: 'threshold_value',
    key: 'threshold_value',
    width: '10%',
    formatter: (value: number, record: RuleSetting) => {
      // 根据阈值范围获取单位
      const getUnit = (range: string) => {
        if (range.includes('°C')) return '°C';
        if (range.includes('psi')) return 'psi';
        if (range.includes('L/min')) return 'L/min';
        if (range.includes('Hz')) return 'Hz';
        if (range.includes('A')) return 'A';
        if (range.includes('%')) return '%';
        if (range.includes('ppm')) return 'ppm';
        return '';
      };
      const unit = getUnit(record.threshold_range);
      return unit ? `${value}${unit}` : value.toString();
    }
  },
  {
    title: '严重程度',
    dataIndex: 'severity',
    key: 'severity',
    width: '10%',
    type:'tag',
    options: severityType
  },
  {
    title: '通知方式',
    dataIndex: 'notification_method',
    key: 'notification_method',
    width: '12%',
    formatter: (value: string[]) => value.join('、')
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
    field: 'rule_name',
    label: '规则名称',
    type: 'input',
    placeholder: '请输入规则名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'alert_level',
    label: '告警等级',
    type: 'select',
    placeholder: '请选择告警等级',
    props: {
      allowClear: true,
      options: [
        { label: '低', value: 'low' },
        { label: '中', value: 'medium' },
        { label: '高', value: 'high' },
        { label: '严重', value: 'critical' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'severity',
    label: '严重程度',
    type: 'select',
    placeholder: '请选择严重程度',
    props: {
      allowClear: true,
      options:severityType
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
const staticRules: RuleSetting[] = [
  {
    rule_id: 'rule001',
    rule_name: '温度异常监控',
    alert_level: 'high',
    threshold_value: 80,
    threshold_range: '0-100°C',
    severity: 'high',
    description: '当设备温度超过80度时触发告警，防止设备过热损坏',
    notification_method: ['短信', '邮件'],
    notification_personnel: ['张三', '李四', '王五'],
    notification_channel: ['系统通知', '移动端推送'],
    status: 'active',
    update_time: '2025-12-01 10:30:00',
    create_time: '2024-11-01 09:00:00'
  },
  {
    rule_id: 'rule002',
    rule_name: '压力异常监控',
    alert_level: 'critical',
    threshold_value: 150,
    threshold_range: '0-200psi',
    severity: 'critical',
    description: '当管道压力超过150psi时触发紧急告警，防止安全事故',
    notification_method: ['电话', '短信', '邮件'],
    notification_personnel: ['张三', '李四', '赵六'],
    notification_channel: ['系统通知', '移动端推送', '短信平台'],
    status: 'active',
    update_time: '2025-12-01 11:15:00',
    create_time: '2024-11-02 10:00:00'
  },
  {
    rule_id: 'rule003',
    rule_name: '流量监控规则',
    alert_level: 'medium',
    threshold_value: 1000,
    threshold_range: '0-5000L/min',
    severity: 'medium',
    description: '当流量超过1000L/min时触发告警，监控生产流程异常',
    notification_method: ['邮件'],
    notification_personnel: ['李四', '王五'],
    notification_channel: ['系统通知'],
    status: 'active',
    update_time: '2025-12-01 09:45:00',
    create_time: '2024-11-03 14:00:00'
  },
  {
    rule_id: 'rule004',
    rule_name: '振动频率监控',
    alert_level: 'low',
    threshold_value: 50,
    threshold_range: '0-100Hz',
    severity: 'low',
    description: '当设备振动频率超过50Hz时提醒维护，预防设备故障',
    notification_method: ['邮件'],
    notification_personnel: ['王五'],
    notification_channel: ['系统通知'],
    status: 'inactive',
    update_time: '2025-12-01 12:20:00',
    create_time: '2024-11-04 16:00:00'
  },
  {
    rule_id: 'rule005',
    rule_name: '电流异常监控',
    alert_level: 'high',
    threshold_value: 100,
    threshold_range: '0-200A',
    severity: 'high',
    description: '当电流超过100A时触发告警，防止电路过载',
    notification_method: ['短信', '电话'],
    notification_personnel: ['张三', '赵六'],
    notification_channel: ['移动端推送', '短信平台'],
    status: 'active',
    update_time: '2025-12-01 13:00:00',
    create_time: '2024-11-05 08:00:00'
  },
  {
    rule_id: 'rule006',
    rule_name: '氧气浓度监控',
    alert_level: 'critical',
    threshold_value: 19.5,
    threshold_range: '0-21%',
    severity: 'critical',
    description: '当氧气浓度低于19.5%时触发紧急告警，防止缺氧事故',
    notification_method: ['电话', '短信', '系统通知'],
    notification_personnel: ['张三', '李四', '王五', '赵六'],
    notification_channel: ['系统通知', '移动端推送', '短信平台', '电话通知'],
    status: 'active',
    update_time: '2025-12-01 14:00:00',
    create_time: '2024-11-06 09:00:00'
  },
  {
    rule_id: 'rule007',
    rule_name: '氢气浓度监控',
    alert_level: 'critical',
    threshold_value: 4.0,
    threshold_range: '0-4%',
    severity: 'critical',
    description: '当氢气浓度超过4.0%时触发紧急告警，防止爆炸事故',
    notification_method: ['电话', '短信', '邮件'],
    notification_personnel: ['张三', '李四', '赵六'],
    notification_channel: ['系统通知', '移动端推送', '短信平台'],
    status: 'active',
    update_time: '2025-12-01 14:15:00',
    create_time: '2024-11-06 10:00:00'
  },
  {
    rule_id: 'rule008',
    rule_name: '氨气浓度监控',
    alert_level: 'high',
    threshold_value: 25,
    threshold_range: '0-50ppm',
    severity: 'high',
    description: '当氨气浓度超过25ppm时触发告警，防止中毒事故',
    notification_method: ['短信', '邮件', '系统通知'],
    notification_personnel: ['李四', '王五', '赵六'],
    notification_channel: ['系统通知', '移动端推送', '邮件平台'],
    status: 'active',
    update_time: '2025-12-01 14:30:00',
    create_time: '2024-11-06 11:00:00'
  },
  {
    rule_id: 'rule009',
    rule_name: '甲烷浓度监控',
    alert_level: 'critical',
    threshold_value: 5.0,
    threshold_range: '0-5%',
    severity: 'critical',
    description: '当甲烷浓度超过5.0%时触发紧急告警，防止爆炸事故',
    notification_method: ['电话', '短信', '邮件'],
    notification_personnel: ['张三', '李四', '王五', '赵六'],
    notification_channel: ['系统通知', '移动端推送', '短信平台', '电话通知'],
    status: 'active',
    update_time: '2025-12-01 14:45:00',
    create_time: '2024-11-06 12:00:00'
  },
  {
    rule_id: 'rule010',
    rule_name: '二氧化碳浓度监控',
    alert_level: 'medium',
    threshold_value: 5000,
    threshold_range: '0-10000ppm',
    severity: 'medium',
    description: '当二氧化碳浓度超过5000ppm时触发告警，防止健康危害',
    notification_method: ['邮件', '系统通知'],
    notification_personnel: ['李四', '王五'],
    notification_channel: ['系统通知', '移动端推送'],
    status: 'active',
    update_time: '2025-12-01 15:00:00',
    create_time: '2024-11-06 13:00:00'
  }
];

// 响应式静态数据管理
let rulesData: RuleSetting[] = [...staticRules];

// API 配置（使用静态数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 过滤数据
  let filteredData = rulesData;
  
  if (rest.rule_name) {
    filteredData = filteredData.filter(item => 
      item.rule_name.includes(rest.rule_name)
    );
  }
  
  if (rest.alert_level) {
    filteredData = filteredData.filter(item => 
      item.alert_level === rest.alert_level
    );
  }
  
  if (rest.severity) {
    filteredData = filteredData.filter(item => 
      item.severity === rest.severity
    );
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    rules: pagedData,
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
    key: 'rule_name',
    type: 'input',
    label: '规则名称',
    placeholder: '请输入规则名称',
    required: true,
    rules: [
      { required: true, message: '请输入规则名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'alert_level',
    type: 'select',
    label: '告警等级',
    placeholder: '请选择告警等级',
    required: true,
    props: {
      options: [
        { label: '低', value: 'low' },
        { label: '中', value: 'medium' },
        { label: '高', value: 'high' },
        { label: '严重', value: 'critical' }
      ]
    },
    rules: [
      { required: true, message: '请选择告警等级', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'threshold_value',
    type: 'input',
    label: '阈值',
    placeholder: '请输入阈值',
    required: true,
    props: {
      min: 0,
      step: 1,
      type: 'number'
    },
    rules: [
      { required: true, message: '请输入阈值', trigger: 'blur' },
      { type: 'number', min: 0, message: '阈值必须大于等于0', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'threshold_range',
    type: 'input',
    label: '阈值范围',
    placeholder: '例如：0-100°C',
    required: true,
    rules: [
      { required: true, message: '请输入阈值范围', trigger: 'blur' },
      { min: 3, max: 50, message: '范围描述长度为3-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'severity',
    type: 'select',
    label: '严重程度',
    placeholder: '请选择严重程度',
    required: true,
    props: {
      options:severityType
    },
    rules: [
      { required: true, message: '请选择严重程度', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'description',
    type: 'textarea',
    label: '规则描述',
    placeholder: '请输入规则描述',
    required: true,
    props: {
      rows: 3
    },
    rules: [
      { required: true, message: '请输入规则描述', trigger: 'blur' },
      { min: 10, max: 500, message: '描述长度为10-500个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'notification_method',
    type: 'checkboxGroup',
    label: '通知方式',
    required: true,
    props: {
      options: [
        { label: '短信', value: '短信' },
        { label: '邮件', value: '邮件' },
        { label: '电话', value: '电话' },
        { label: '系统通知', value: '系统通知' }
      ]
    },
    rules: [
      { type: 'array', required: true, message: '请至少选择一种通知方式', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'notification_personnel',
    type: 'select',
    label: '通知人员',
    placeholder: '请选择通知人员',
    required: true,
    props: {
      mode: 'multiple',
      options: [
        { label: '张三', value: '张三' },
        { label: '李四', value: '李四' },
        { label: '王五', value: '王五' },
        { label: '赵六', value: '赵六' },
        { label: '钱七', value: '钱七' }
      ]
    },
    rules: [
      { type: 'array', required: true, message: '请至少选择一个通知人员', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'notification_channel',
    type: 'checkboxGroup',
    label: '通知渠道',
    required: true,
    props: {
      options: [
        { label: '系统通知', value: '系统通知' },
        { label: '移动端推送', value: '移动端推送' },
        { label: '短信平台', value: '短信平台' },
        { label: '邮件平台', value: '邮件平台' }
      ]
    },
    rules: [
      { type: 'array', required: true, message: '请至少选择一个通知渠道', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'status',
    type: 'radioGroup',
    label: '规则状态',
    required: true,
    props: {
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
    rules: [
      { required: true, message: '请选择规则状态', trigger: 'change' },
    ],
    colSpan: 12
  }
];

// 方法
const showAddModal = () => {
  modalTitle.value = '新增规则';
  resetForm();
  modalVisible.value = true;
};

const editRuleFn = async (record: RuleSetting) => {
  try {
    modalTitle.value = '编辑规则';
    formState.rule_id = record.rule_id;
    formState.rule_name = record.rule_name;
    formState.alert_level = record.alert_level;
    formState.threshold_value = record.threshold_value;
    formState.threshold_range = record.threshold_range;
    formState.severity = record.severity;
    formState.description = record.description;
    formState.notification_method = [...record.notification_method];
    formState.notification_personnel = [...record.notification_personnel];
    formState.notification_channel = [...record.notification_channel];
    formState.status = record.status;

    modalVisible.value = true;
  } catch (error) {
    console.error('获取规则详情失败:', error);
    message.error('获取规则详情失败');
  }
};

const confirmDelete = (record: RuleSetting) => {
  currentRule.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增规则') {
      // 新增规则操作
      const newRule: RuleSetting = {
        rule_id: `rule${Date.now()}`, // 生成唯一ID
        rule_name: formData.rule_name,
        alert_level: formData.alert_level,
        threshold_value: formData.threshold_value,
        threshold_range: formData.threshold_range,
        severity: formData.severity,
        description: formData.description,
        notification_method: formData.notification_method,
        notification_personnel: formData.notification_personnel,
        notification_channel: formData.notification_channel,
        status: formData.status,
        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      
      // 添加到数据数组
      rulesData.unshift(newRule);
      message.success('新增规则成功');
    } else {
      // 编辑规则操作
      const index = rulesData.findIndex(item => item.rule_id === formData.rule_id);
      if (index !== -1) {
        rulesData[index] = {
          ...rulesData[index],
          rule_name: formData.rule_name,
          alert_level: formData.alert_level,
          threshold_value: formData.threshold_value,
          threshold_range: formData.threshold_range,
          severity: formData.severity,
          description: formData.description,
          notification_method: formData.notification_method,
          notification_personnel: formData.notification_personnel,
          notification_channel: formData.notification_channel,
          status: formData.status,
          update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
      }
      message.success('编辑规则成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增规则' ? '新增规则失败' : '编辑规则失败');
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
    if (!currentRule.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从数据数组中删除指定记录
    const index = rulesData.findIndex(item => item.rule_id === currentRule.value?.rule_id);
    if (index !== -1) {
      rulesData.splice(index, 1);
    }
    
    deleteModalVisible.value = false;
    currentRule.value = undefined;
    message.success('删除规则成功');
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除规则失败:', error);
    message.error('删除规则失败');
  }
};

const resetForm = () => {
  formState.rule_id = '';
  formState.rule_name = '';
  formState.alert_level = '';
  formState.threshold_value = 0;
  formState.threshold_range = '';
  formState.severity = '';
  formState.description = '';
  formState.notification_method = [];
  formState.notification_personnel = [];
  formState.notification_channel = [];
  formState.status = 'active';
};

// 获取告警等级对应的显示文本
const getAlertLevelText = (level: string) => {
  const levelMap: { [key: string]: string } = {
    'low': '低',
    'medium': '中',
    'high': '高',
    'critical': '严重'
  };
  return levelMap[level] || level;
};

// 获取严重程度对应的显示文本
const getSeverityText = (severity: string) => {
  const severityMap: { [key: string]: string } = {
    'low': '轻微',
    'medium': '中等',
    'high': '严重',
    'critical': '紧急'
  };
  return severityMap[severity] || severity;
};

// 获取状态对应的显示文本
const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'active': '启用',
    'inactive': '禁用'
  };
  return statusMap[status] || status;
};

// 导出数据功能
const exportData = async () => {
  try {
    exportLoading.value = true;
    
    // 模拟导出延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 准备导出数据
    const exportData = rulesData.map(item => ({
      '规则名称': item.rule_name,
      '告警等级': getAlertLevelText(item.alert_level),
      '阈值': `${item.threshold_value}${item.threshold_range ? getUnit(item.threshold_range) : ''}`,
      '阈值范围': item.threshold_range,
      '严重程度': getSeverityText(item.severity),
      '规则描述': item.description,
      '通知方式': item.notification_method.join('、'),
      '通知人员': item.notification_personnel.join('、'),
      '通知渠道': item.notification_channel.join('、'),
      '规则状态': getStatusText(item.status),
      '创建时间': item.create_time || '',
      '更新时间': item.update_time || ''
    }));
    
    // 获取单位的辅助函数
    function getUnit(range: string): string {
      if (range.includes('°C')) return '°C';
      if (range.includes('psi')) return 'psi';
      if (range.includes('L/min')) return 'L/min';
      if (range.includes('Hz')) return 'Hz';
      if (range.includes('A')) return 'A';
      if (range.includes('%')) return '%';
      if (range.includes('ppm')) return 'ppm';
      return '';
    }
    
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
    link.setAttribute('download', `规则设置数据_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success(`成功导出 ${rulesData.length} 条规则数据`);
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
  const activeCount = data.filter(item => item.status === 'active').length;
  const inactiveCount = data.filter(item => item.status === 'inactive').length;
  const criticalCount = data.filter(item => item.alert_level === 'critical').length;
  
  console.log(`规则设置统计: 总计 ${totalCount} 条，启用 ${activeCount} 条，禁用 ${inactiveCount} 条，严重告警 ${criticalCount} 条`);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

// 操作列事件处理
const handleAction = (action: string, record: RuleSetting, index: number) => {
  switch (action) {
    case 'edit':
      editRuleFn(record);
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
.rule-setting-container {
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