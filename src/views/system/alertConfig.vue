<template>
  <div class="alarm-config-container p-[16px] flex flex-col overflow-hidden box-border"
    style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="ml-1 leading-none">新增告警</span>
        </span>
      </Button>
    </div>



    <!-- 主要内容区域 -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
      <SmartTable ref="smartTableRef" :api="apiConfig" :columns="columns" :search-config="searchConfig"
        :responseConfig="responseConfig" :pagination="paginationConfig" :paramsFormatter="paramsFormatter"
        searchLayout="horizontal" @loadSuccess="handleLoadSuccess" @loadError="handleLoadError"
        :searchButtonWrapperSpan="6" :immediateSearch="true" :actionColumn="actionColumn" @action="handleTableAction">
      </SmartTable>
    </div>

    <!-- 新增/编辑告警弹窗 -->
    <Modal v-model:open="modalVisible" :title="modalTitle" width="1200px" :confirm-loading="modalLoading"
      @ok="handleModalOk" @cancel="handleModalCancel">
      <AdvancedForm ref="formRef" :schema="formSchema" :model="formState" mode="form" formLayout="horizontal"
        :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
        <template #title>
          <div class="w-full text-base text-[#4362EF] bg-[#F1F7FD] px-4 py-2 my-2 font-semibold">报警基础配置</div>
        </template>
        <template #alarmIndicator>
          <div class="w-full text-base text-[#4362EF] bg-[#F1F7FD] px-4 py-2  my-4 font-semibold">报警指标值配置</div>
          <!-- 新增报警指标按钮 -->
          <Button class="ml-[20px]" type="primary" style="background-color: #4362EF;" @click="showAddIndicatorModal">
            <span class="flex items-center">
              <PlusOutlined />
              <span class="ml-1 leading-none">新增报警指标</span>
            </span>
          </Button>
          <!-- 报警指标表格 -->
          <SmartTable :data-source="formState.alarmIndicator" :columns="indicatorColumns" :pagination="false"
            rowKey="id" :action-column="indicatorActionColumn" @action="handleIndicatorAction" />
        </template>
      </AdvancedForm>

    </Modal>

    <!-- 告警 - 新增/编辑报警指标弹窗 -->
    <Modal v-model:open="indicatorModalVisible" :title="indicatorModalTitle" width="800px"
      :confirm-loading="indicatorModalLoading" @ok="handleIndicatorModalOk" @cancel="handleIndicatorModalCancel">
      <AdvancedForm ref="indicatorFormRef" :schema="indicatorFormSchema" :model="indicatorFormState" mode="form"
        :column="2" />
    </Modal>

    <!-- 告警-详情弹窗 -->
    <Modal v-model:open="detailModalVisible" title="告警详情" width="1200px" :footer="null" @cancel="closeDetailModal">
      <div class="flex justify-between items-center mb-[16px]">
        <h3 class="text-[18px] font-semibold">报警基础配置</h3>
      </div>
      <AdvancedForm :schema="detailFormSchema" :model="selectedAlarm" mode="descriptions" />
      <!-- 报警指标详情表格 -->
      <div class="mt-[24px]">
        <div class="flex justify-between items-center mb-[16px]">
          <h3 class="text-[18px] font-semibold">报警指标详情</h3>
        </div>
        <SmartTable :data-source="selectedAlarm.alarmIndicator || []" :columns="indicatorColumns" :pagination="false"
          rowKey="id" />
      </div>
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
  Tag,
  Divider
} from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import AdvancedForm from '@/components/advancedForm/index.vue';

// 类型定义
interface AlarmConfig {
  id: string;
  name: string;
  alarm_code: string;
  alarm_category: string;
  alarm_type: string;
  alarm_level: string;
  push_method: string;
  description: string;
  status: string;
  create_time?: string;
  update_time?: string;
  alarmIndicator?: AlarmIndicator[];
}

interface AlarmIndicator {
  id: string;
  name: string;
  type: string;
  value: string;
  receiverType: string;
  receivers: string;
  status: string;
  escalationTime?: string;  // 升级时间
  escalationLevel?: string; // 升级风险等级
  escalationReceiver?: string; // 升级后的负责人
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const detailModalVisible = ref(false);
const modalTitle = ref('新增告警');
const smartTableRef = ref();
const formRef = ref();

// 表单状态
const formState = reactive({
  id: '',
  name: '',
  alarm_code: '',
  alarm_category: '',
  alarm_type: '',
  alarm_level: '',
  push_method: '',
  description: '',
  status: '',
  alarmIndicator: [] // 初始化为空数组
});

// 报警指标表格列定义
const indicatorColumns = [
  {
    title: '指标名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '指标类型',
    dataIndex: 'type',
    key: 'type',
    type: 'tag',
    options: [
      { label: '正常值', value: 'normal', color: 'green' },
      { label: '报警', value: 'abnormal', color: 'red' }
    ]
  },
  {
    title: '指标值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '接收人员类型',
    dataIndex: 'receiverType',
    key: 'receiverType',
    type: 'select',
    options: [
      { label: '平台人员', value: 'platform' },
      { label: '指定人员', value: 'specific' }
    ]
  },
  {
    title: '接收人员',
    dataIndex: 'receivers',
    key: 'receivers',
  },
  {
    title: '未处理升级时长',
    dataIndex: 'escalationTime',
    key: 'escalationTime',
  },
  {
    title: '升级风险等级',
    dataIndex: 'escalationLevel',
    key: 'escalationLevel',
    type: 'tag',
    options: [
      { label: '一级报警', value: '一级报警', color: 'red' },
      { label: '二级报警', value: '二级报警', color: 'orange' },
      { label: '三级报警', value: '三级报警', color: 'yellow' }
    ]
  },
  {
    title: '升级负责人',
    dataIndex: 'escalationReceiver',
    key: 'escalationReceiver',
  },
  {
    title: '是否启用',
    dataIndex: 'status',
    key: 'status',
    type: 'tag',
    options: [
      { label: '启用', value: '1', color: 'green' },
      { label: '禁用', value: '0', color: 'red' }
    ]
  }
];

// 报警指标操作列配置
const indicatorActionColumn = {
  title: '操作',
  width: 120,
  fixed: 'right',
  actions: [
    {
      label: '编辑',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '删除',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete'
    }
  ]
};

// 选中的告警
const selectedAlarm = ref<AlarmConfig>({
  id: '',
  name: '',
  alarm_code: '',
  alarm_category: '',
  alarm_type: '',
  alarm_level: '',
  push_method: '',
  description: '',
  status: '',
});

const alarmLevels = [
  { label: '一级报警', value: '一级报警', color: 'red' },
  { label: '二级报警', value: '二级报警', color: 'orange' },
  { label: '三级报警', value: '三级报警', color: 'yellow' }
]

const pushMethods = [
  { label: '短信', value: '短信' },
  { label: '邮件', value: '邮件' },
  { label: 'APP推送', value: 'APP推送' },
  { label: '微信', value: '微信' }
]

// 表格列配置
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '报警编码',
    dataIndex: 'alarm_code',
    key: 'alarm_code',
    width: 120,
  },
  {
    title: '报警类别',
    dataIndex: 'alarm_category',
    key: 'alarm_category',
    width: 120,
  },
  {
    title: '报警类型',
    dataIndex: 'alarm_type',
    key: 'alarm_type',
    width: 120,
  },
  {
    title: '报警等级',
    dataIndex: 'alarm_level',
    key: 'alarm_level',
    width: 120,
    type: 'tag',
    options: alarmLevels,
  },
  {
    title: '推送方式',
    dataIndex: 'push_method',
    key: 'push_method',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    type: 'tag',
    options: [
      { label: '启用', value: '1', color: 'green' },
      { label: '禁用', value: '0', color: 'red' }
    ]
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
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
    {
      label: '编辑',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label: '删除',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete'
    }
  ]
};

// 搜索配置
const searchConfig = ref([
  {
    field: 'name',
    label: '名称',
    type: 'input',
    placeholder: '请输入名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'alarm_level',
    label: '报警等级',
    type: 'select',
    placeholder: '请选择报警等级',
    props: {
      allowClear: true,
      options: alarmLevels
    },
    colSpan: 6
  },
  {
    field: 'alarm_type',
    label: '报警类型',
    type: 'select',
    placeholder: '请选择报警类型',
    props: {
      allowClear: true,
      options: [
        { label: '火焰检测', value: '火焰检测' },
        { label: '烟雾检测', value: '烟雾检测' },
        { label: '未穿工作服检测', value: '未穿工作服检测' },
        { label: '未带安全帽检测', value: '未带安全帽检测' },
        { label: '跌倒检测', value: '跌倒检测' },
        { label: '高温检测', value: '高温检测' },
        { label: '睡岗检测', value: '睡岗检测' },
        { label: '使用手机检测', value: '使用手机检测' },
        { label: '闯入检测', value: '闯入检测' },
        { label: '人员计数', value: '人员计数' },
        { label: '温度', value: '温度' },
        { label: '湿度', value: '湿度' },
        { label: '二氧化碳', value: '二氧化碳' },
        { label: '设备故障', value: '设备故障' },
        { label: '安全隐患', value: '安全隐患' },
        { label: '环境异常', value: '环境异常' },
        { label: '违规操作', value: '违规操作' },
        { label: '系统异常', value: '系统异常' },
        { label: '可燃气体', value: '可燃气体' },
        { label: '有毒气体', value: '有毒气体' },
        { label: '水浸检测', value: '水浸检测' },
        { label: '噪音检测', value: '噪音检测' },
        { label: '粉尘浓度', value: '粉尘浓度' },
        { label: '电压异常', value: '电压异常' },
        { label: '电流异常', value: '电流异常' },
        { label: '压力异常', value: '压力异常' },
        { label: '液位异常', value: '液位异常' },
        { label: '振动异常', value: '振动异常' },
        { label: '转速异常', value: '转速异常' }
      ]
    },
    colSpan: 6
  }
]);

// 响应配置
const responseConfig = {
  listKey: 'alarms',
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
    key: 'title',
    label: "",
    colSpan: 24,
  },
  {
    key: 'name',
    type: 'input',
    label: '名称',
    placeholder: '请输入告警名称',
    required: true,
    rules: [
      { required: true, message: '请输入告警名称', trigger: 'blur' },
      { min: 2, max: 50, message: '告警名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'alarm_type',
    type: 'select',
    label: '报警类型',
    placeholder: '请选择报警类型',
    props: {
      options: [
        { label: '火焰检测', value: '火焰检测' },
        { label: '烟雾检测', value: '烟雾检测' },
        { label: '未穿工作服检测', value: '未穿工作服检测' },
        { label: '未带安全帽检测', value: '未带安全帽检测' },
        { label: '跌倒检测', value: '跌倒检测' },
        { label: '高温检测', value: '高温检测' },
        { label: '睡岗检测', value: '睡岗检测' },
        { label: '使用手机检测', value: '使用手机检测' },
        { label: '闯入检测', value: '闯入检测' },
        { label: '人员计数', value: '人员计数' },
        { label: '温度', value: '温度' },
        { label: '湿度', value: '湿度' },
        { label: '二氧化碳', value: '二氧化碳' },
        { label: '设备故障', value: '设备故障' },
        { label: '安全隐患', value: '安全隐患' },
        { label: '环境异常', value: '环境异常' },
        { label: '违规操作', value: '违规操作' },
        { label: '系统异常', value: '系统异常' },
        { label: '可燃气体', value: '可燃气体' },
        { label: '有毒气体', value: '有毒气体' },
        { label: '水浸检测', value: '水浸检测' },
        { label: '噪音检测', value: '噪音检测' },
        { label: '粉尘浓度', value: '粉尘浓度' },
        { label: '电压异常', value: '电压异常' },
        { label: '电流异常', value: '电流异常' },
        { label: '压力异常', value: '压力异常' },
        { label: '液位异常', value: '液位异常' },
        { label: '振动异常', value: '振动异常' },
        { label: '转速异常', value: '转速异常' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择报警类型', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'alarm_level',
    type: 'select',
    label: '报警等级',
    placeholder: '请选择报警等级',
    props: {
      options: alarmLevels
    },
    required: true,
    rules: [
      { required: true, message: '请选择报警等级', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'alarm_code',
    type: 'input',
    label: '报警编码',
    placeholder: '请输入报警编码',
    required: true,
    rules: [
      { required: true, message: '请输入报警编码', trigger: 'blur' },
      { min: 1, max: 50, message: '报警编码长度为1-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'alarm_category',
    type: 'select',
    label: '报警类别',
    placeholder: '请选择报警类别',
    props: {
      options: [
        { label: '安全监控', value: '安全监控' },
        { label: '行为识别', value: '行为识别' },
        { label: '环境监测', value: '环境监测' },
        { label: '设备监控', value: '设备监控' },
        { label: '人员管理', value: '人员管理' },
        { label: '系统监控', value: '系统监控' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择报警类别', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'push_method',
    type: 'select',
    label: '推送方式',
    placeholder: '请选择推送方式',
    props: {
      options: pushMethods
    },
    required: true,
    rules: [
      { required: true, message: '请选择推送方式', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'description',
    type: 'textarea',
    label: '描述',
    placeholder: '请输入告警描述',
    props: {
      rows: 4
    },
    required: true,
    rules: [
      { required: true, message: '请输入告警描述', trigger: 'blur' },
      { min: 10, max: 500, message: '告警描述长度为10-500个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'status',
    type: 'radioGroup',
    label: '状态',
    props: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'alarmIndicator',
    label: "",
    type: 'table',
    colSpan: 24,
  }
];

// 详情表单配置
const detailFormSchema = [
  {
    key: 'name',
    type: 'text',
    label: '名称',
    colSpan: 12
  },
  {
    key: 'alarm_type',
    type: 'text',
    label: '报警类型',
    colSpan: 12
  },
  {
    key: 'alarm_level',
    type: 'text',
    label: '报警等级',
    colSpan: 12
  },
  {
    key: 'alarm_code',
    type: 'text',
    label: '报警编码',
    colSpan: 12
  },
  {
    key: 'alarm_category',
    type: 'text',
    label: '报警类别',
    colSpan: 12
  },
  {
    key: 'push_method',
    type: 'text',
    label: '推送方式',
    colSpan: 12
  },
  {
    key: 'description',
    type: 'text',
    label: '描述',
    colSpan: 24
  },
  {
    key: 'status',
    type: 'text',
    label: '状态',
    colSpan: 12,
    formatter: (value: string) => {
      const statusOptions = [
        { label: '启用', value: '1', color: 'green' },
        { label: '禁用', value: '0', color: 'red' }
      ];
      const option = statusOptions.find(item => item.value === value);
      return option ? option.label : value;
    }
  },
  {
    key: 'create_time',
    type: 'text',
    label: '创建时间',
    colSpan: 12
  },
  {
    key: 'update_time',
    type: 'text',
    label: '更新时间',
    colSpan: 12
  }
];

// 新增报警指标相关数据
const indicatorModalVisible = ref(false);
const indicatorModalLoading = ref(false);
const indicatorModalTitle = ref('新增报警指标');
const indicatorFormRef = ref();

// 报警指标表单状态
const indicatorFormState = reactive({
  id: '',
  name: '',
  type: '',
  value: '',
  receiverType: '',
  receivers: '',
  status: '',
  escalationTime: '',  // 升级时间
  escalationLevel: '', // 升级风险等级
  escalationReceiver: '' // 升级后的负责人
});

// 报警指标表单配置
const indicatorFormSchema = [
  {
    key: 'name',
    type: 'input',
    label: '指标名称',
    placeholder: '请输入指标名称',
    required: true,
    rules: [
      { required: true, message: '请输入指标名称', trigger: 'blur' },
      { min: 2, max: 50, message: '指标名称长度为2-50个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'type',
    type: 'radioGroup',
    label: '指标类型',
    placeholder: '请选择指标类型',
    props: {
      options: [
        { label: '正常值', value: 'normal' },
        { label: '报警', value: 'abnormal' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择指标类型', trigger: 'change' }
    ]
  },
  {
    key: 'value',
    type: 'input',
    label: '指标值(x)',
    placeholder: '请输入指标值',
    required: true,
    rules: [
      { required: true, message: '请输入指标值', trigger: 'blur' },
    ]
  },
  {
    key: 'receiverType',
    type: 'select',
    label: '接收人员类型',
    placeholder: '请选择接收人员类型',
    props: {
      options: [
        { label: '平台人员', value: 'platform' },
        { label: '指定人员', value: 'specific' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择接收人员类型', trigger: 'change' }
    ]
  },
  {
    key: 'receivers',
    type: 'input',
    label: '接收人员',
    placeholder: '请输入接收人员',
    required: true,
    rules: [
      { required: true, message: '请输入接收人员', trigger: 'blur' },
    ]
  },
  {
    key: 'status',
    type: 'radioGroup',
    label: '是否启用',
    props: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择是否启用', trigger: 'change' }
    ]
  },
  {
    key: 'escalationTime',
    type: 'input',
    label: '未处理升级时长',
    placeholder: '例如：30分钟、1小时',
    props: {
      addonAfter: '未处理则升级'
    }
  },
  {
    key: 'escalationLevel',
    type: 'select',
    label: '升级风险等级',
    placeholder: '请选择升级后的风险等级',
    props: {
      options: [
        { label: '一级报警', value: '一级报警', color: 'red' },
        { label: '二级报警', value: '二级报警', color: 'orange' },
        { label: '三级报警', value: '三级报警', color: 'yellow' }
      ]
    }
  },
  {
    key: 'escalationReceiver',
    type: 'input',
    label: '升级负责人',
    placeholder: '请输入升级后的负责人'
  }
];

// 显示新增报警指标弹窗
const showAddIndicatorModal = () => {
  resetIndicatorForm();
  indicatorModalTitle.value = '新增报警指标';
  indicatorModalVisible.value = true;
};

// 告警-处理新增或编辑报警指标确认
const handleIndicatorModalOk = async () => {
  try {
    const valid = await indicatorFormRef.value?.validate();
    if (!valid) return;

    if (indicatorModalTitle.value === '新增报警指标') {
      // 添加新指标
      const newIndicator = {
        ...indicatorFormState,
        id: `indicator_${Date.now()}` // 生成唯一ID
      };
      formState.alarmIndicator.push(newIndicator);
      message.success('新增报警指标成功');
    } else {
      // 编辑现有指标
      const index = formState.alarmIndicator.findIndex(item => item.id === indicatorFormState.id);
      if (index !== -1) {
        formState.alarmIndicator[index] = { ...indicatorFormState };
        message.success('编辑报警指标成功');
      } else {
        message.error('未找到要编辑的报警指标');
        return;
      }
    }

    indicatorModalVisible.value = false;
    resetIndicatorForm();
  } catch (error) {
    console.error(error);
    message.error(indicatorModalTitle.value === '新增报警指标' ? '新增报警指标失败' : '编辑报警指标失败');
  }
};

// 取消新增或编辑报警指标
const handleIndicatorModalCancel = () => {
  indicatorModalVisible.value = false;
  resetIndicatorForm();
};

// 重置报警指标表单
const resetIndicatorForm = () => {
  Object.assign(indicatorFormState, {
    id: '',
    name: '',
    type: '',
    value: '',
    receiverType: '',
    receivers: '',
    status: '',
    escalationTime: '',
    escalationLevel: '',
    escalationReceiver: ''
  });
};

// 编辑报警指标
const editIndicator = (index: number) => {
  const indicator = formState.alarmIndicator[index];
  Object.assign(indicatorFormState, { ...indicator });
  indicatorModalTitle.value = '编辑报警指标';
  indicatorModalVisible.value = true;
};

// 删除报警指标
const deleteIndicator = (index: number) => {
  formState.alarmIndicator.splice(index, 1);
  message.success('删除报警指标成功');
};

// 处理报警指标表格操作
const handleIndicatorAction = (action: string, record: any) => {
  const index = formState.alarmIndicator.findIndex(item => item.id === record.id);
  if (index === -1) {
    message.error('未找到对应的报警指标');
    return;
  }

  switch (action) {
    case 'edit':
      editIndicator(index);
      break;
    case 'delete':
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除指标"${record.name}"吗？此操作不可恢复。`,
        onOk: () => {
          deleteIndicator(index);
        }
      });
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

// 模拟数据存储
let alarms: AlarmConfig[] = [
  {
    id: 'alarm001',
    name: '火焰检测告警',
    alarm_code: 'ALM001',
    alarm_category: '安全监控',
    alarm_type: '火焰检测',
    alarm_level: '一级报警',
    push_method: '短信,APP推送',
    description: '检测到火焰时触发告警，需要立即处理以防止火灾发生',
    status: '1',
    create_time: '2025-12-01 09:30:00',
    update_time: '2025-12-01 09:30:00',
    alarmIndicator: [
      {
        id: 'ind001',
        name: '火焰检测阈值',
        type: 'abnormal',
        value: 'x≥0.5',
        receiverType: 'platform',
        receivers: '值班人员',
        status: '1',
        escalationTime: '30分钟',
        escalationLevel: '一级报警',
        escalationReceiver: '安全主管'
      },
      {
        id: 'ind002',
        name: '火焰检测高阈值',
        type: 'abnormal',
        value: 'x≥0.8',
        receiverType: 'specific',
        receivers: '张三,李四',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '一级报警',
        escalationReceiver: '应急响应组'
      }
    ]
  },
  {
    id: 'alarm002',
    name: '烟雾检测告警',
    alarm_code: 'ALM002',
    alarm_category: '安全监控',
    alarm_type: '烟雾检测',
    alarm_level: '一级报警',
    push_method: '短信,APP推送,微信',
    description: '检测到烟雾时触发告警，需要立即检查是否发生火灾',
    status: '1',
    create_time: '2025-12-01 14:15:00',
    update_time: '2025-12-01 14:15:00',
    alarmIndicator: [
      {
        id: 'ind003',
        name: '烟雾浓度阈值',
        type: 'abnormal',
        value: 'x≥0.3',
        receiverType: 'platform',
        receivers: '值班人员',
        status: '1',
        escalationTime: '45分钟',
        escalationLevel: '二级报警',
        escalationReceiver: '环境监测员'
      }
    ]
  },
  {
    id: 'alarm003',
    name: '高温检测告警',
    alarm_code: 'ALM003',
    alarm_category: '环境监测',
    alarm_type: '高温检测',
    alarm_level: '一级报警',
    push_method: '短信,邮件,APP推送',
    description: '检测到环境温度过高时触发告警，需要检查设备和人员安全',
    status: '1',
    create_time: '2025-12-01 16:45:00',
    update_time: '2025-12-01 16:45:00',
    alarmIndicator: [
      {
        id: 'ind004',
        name: '温度阈值',
        type: 'abnormal',
        value: 'x≥38°C',
        receiverType: 'platform',
        receivers: '环境监测员',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '二级报警',
        escalationReceiver: '设备管理员'
      },
      {
        id: 'ind005',
        name: '温度高阈值',
        type: 'abnormal',
        value: 'x≥45°C',
        receiverType: 'specific',
        receivers: '张主任,李工程师',
        status: '1',
        escalationTime: '30分钟',
        escalationLevel: '一级报警',
        escalationReceiver: '技术主管'
      }
    ]
  },
  {
    id: 'alarm004',
    name: '跌倒检测告警',
    alarm_code: 'ALM004',
    alarm_category: '行为识别',
    alarm_type: '跌倒检测',
    alarm_level: '一级报警',
    push_method: '邮件,APP推送',
    description: '检测到人员跌倒时触发告警，需要立即关注人员安全',
    status: '1',
    create_time: '2025-12-02 10:20:00',
    update_time: '2025-12-02 10:20:00',
    alarmIndicator: [
      {
        id: 'ind006',
        name: '跌倒检测阈值',
        type: 'abnormal',
        value: 'x≤30°',
        receiverType: 'platform',
        receivers: '安全员',
        status: '1',
        escalationTime: '20分钟',
        escalationLevel: '二级报警',
        escalationReceiver: '安全主管'
      }
    ]
  },
  {
    id: 'alarm005',
    name: '闯入检测告警',
    alarm_code: 'ALM005',
    alarm_category: '安全监控',
    alarm_type: '闯入检测',
    alarm_level: '一级报警',
    push_method: '短信,APP推送,微信',
    description: '检测到未经授权人员进入禁入区域时触发告警，需要立即响应',
    status: '1',
    create_time: '2025-12-02 13:55:00',
    update_time: '2025-12-02 13:55:00',
    alarmIndicator: [
      {
        id: 'ind007',
        name: '区域闯入检测',
        type: 'abnormal',
        value: 'x≥1',
        receiverType: 'platform',
        receivers: '保安人员',
        status: '1',
        escalationTime: '15分钟',
        escalationLevel: '一级报警',
        escalationReceiver: '安保主管'
      }
    ]
  },
  {
    id: 'alarm006',
    name: '未带安全帽检测告警',
    alarm_code: 'ALM006',
    alarm_category: '行为识别',
    alarm_type: '未带安全帽检测',
    alarm_level: '二级报警',
    push_method: 'APP推送,微信',
    description: '检测到人员未佩戴安全帽时触发告警，需要及时提醒以确保安全',
    status: '1',
    create_time: '2025-12-02 15:30:00',
    update_time: '2025-12-02 15:30:00',
    alarmIndicator: [
      {
        id: 'ind008',
        name: '安全帽佩戴检测',
        type: 'abnormal',
        value: 'x≥0.8',
        receiverType: 'platform',
        receivers: '现场管理员',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '安全员'
      }
    ]
  },
  {
    id: 'alarm007',
    name: '未穿工作服检测告警',
    alarm_code: 'ALM007',
    alarm_category: '行为识别',
    alarm_type: '未穿工作服检测',
    alarm_level: '二级报警',
    push_method: 'APP推送,微信',
    description: '检测到人员未按规定穿着工作服时触发告警，需要及时提醒改正',
    status: '1',
    create_time: '2025-12-02 16:45:00',
    update_time: '2025-12-02 16:45:00',
    alarmIndicator: [
      {
        id: 'ind009',
        name: '工作服穿着检测',
        type: 'abnormal',
        value: 'x≥0.8',
        receiverType: 'platform',
        receivers: '现场管理员',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '安全员'
      }
    ]
  },
  {
    id: 'alarm008',
    name: '睡岗检测告警',
    alarm_code: 'ALM008',
    alarm_category: '行为识别',
    alarm_type: '睡岗检测',
    alarm_level: '二级报警',
    push_method: '邮件,APP推送',
    description: '检测到工作人员在值班期间睡觉时触发告警，需要及时处理',
    status: '1',
    create_time: '2025-12-03 09:15:00',
    update_time: '2025-12-03 09:15:00',
    alarmIndicator: [
      {
        id: 'ind010',
        name: '睡岗检测阈值',
        type: 'abnormal',
        value: 'x≥5分钟',
        receiverType: 'platform',
        receivers: '值班主管',
        status: '1',
        escalationTime: '30分钟',
        escalationLevel: '三级报警',
        escalationReceiver: '部门主管'
      }
    ]
  },
  {
    id: 'alarm009',
    name: '使用手机检测告警',
    alarm_code: 'ALM009',
    alarm_category: '行为识别',
    alarm_type: '使用手机检测',
    alarm_level: '三级报警',
    push_method: 'APP推送',
    description: '检测到在禁止使用手机的区域使用手机时触发告警，需要提醒注意',
    status: '1',
    create_time: '2025-12-03 10:30:00',
    update_time: '2025-12-03 10:30:00',
    alarmIndicator: [
      {
        id: 'ind011',
        name: '手机使用检测',
        type: 'abnormal',
        value: 'x≥1',
        receiverType: 'platform',
        receivers: '安全员',
        status: '1',
        escalationTime: '2小时',
        escalationLevel: '二级报警',
        escalationReceiver: '现场管理员'
      }
    ]
  },
  {
    id: 'alarm010',
    name: '人员计数告警',
    alarm_code: 'ALM010',
    alarm_category: '人员管理',
    alarm_type: '人员计数',
    alarm_level: '三级报警',
    push_method: 'APP推送,邮件',
    description: '检测到区域内人员数量超限或缺员时触发告警，需要进行人员管理',
    status: '1',
    create_time: '2025-12-03 11:45:00',
    update_time: '2025-12-03 11:45:00',
    alarmIndicator: [
      {
        id: 'ind012',
        name: '人员超限阈值',
        type: 'abnormal',
        value: 'x>10人',
        receiverType: 'platform',
        receivers: '人事管理员',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '二级报警',
        escalationReceiver: '部门主管'
      },
      {
        id: 'ind013',
        name: '人员缺员阈值',
        type: 'abnormal',
        value: 'x<3人',
        receiverType: 'platform',
        receivers: '人事管理员',
        status: '1',
        escalationTime: '2小时',
        escalationLevel: '二级报警',
        escalationReceiver: '部门主管'
      }
    ]
  },
  {
    id: 'alarm011',
    name: '温度异常告警',
    alarm_code: 'ALM011',
    alarm_category: '环境监测',
    alarm_type: '温度',
    alarm_level: '二级报警',
    push_method: '短信,邮件',
    description: '检测到温度超出安全范围时触发告警，需要调整环境温度',
    status: '1',
    create_time: '2025-12-03 13:20:00',
    update_time: '2025-12-03 13:20:00',
    alarmIndicator: [
      {
        id: 'ind014',
        name: '温度低阈值',
        type: 'abnormal',
        value: 'x<16°C',
        receiverType: 'platform',
        receivers: '设备管理员',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '技术主管'
      },
      {
        id: 'ind015',
        name: '温度高阈值',
        type: 'abnormal',
        value: 'x>28°C',
        receiverType: 'platform',
        receivers: '设备管理员',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '技术主管'
      }
    ]
  },
  {
    id: 'alarm012',
    name: '湿度过高告警',
    alarm_code: 'ALM012',
    alarm_category: '环境监测',
    alarm_type: '湿度',
    alarm_level: '二级报警',
    push_method: '邮件,APP推送',
    description: '检测到环境湿度过高可能影响设备运行时触发告警，需要启动除湿设备',
    status: '1',
    create_time: '2025-12-03 14:10:00',
    update_time: '2025-12-03 14:10:00',
    alarmIndicator: [
      {
        id: 'ind016',
        name: '湿度阈值',
        type: 'abnormal',
        value: 'x>70%',
        receiverType: 'platform',
        receivers: '环境管理员',
        status: '1',
        escalationTime: '2小时',
        escalationLevel: '三级报警',
        escalationReceiver: '设备主管'
      }
    ]
  },
  {
    id: 'alarm013',
    name: '二氧化碳浓度超标告警',
    alarm_code: 'ALM013',
    alarm_category: '环境监测',
    alarm_type: '二氧化碳',
    alarm_level: '二级报警',
    push_method: '短信,APP推送',
    description: '检测到二氧化碳浓度超过安全限值时触发告警，需要启动通风设备',
    status: '1',
    create_time: '2025-12-03 15:05:00',
    update_time: '2025-12-03 15:05:00',
    alarmIndicator: [
      {
        id: 'ind017',
        name: 'CO2浓度阈值',
        type: 'abnormal',
        value: 'x>1000ppm',
        receiverType: 'platform',
        receivers: '环境监测员',
        status: '1',
        escalationTime: '30分钟',
        escalationLevel: '一级报警',
        escalationReceiver: '安全主管'
      }
    ]
  },
  {
    id: 'alarm014',
    name: '可燃气体泄漏告警',
    alarm_code: 'ALM014',
    alarm_category: '安全监控',
    alarm_type: '可燃气体',
    alarm_level: '一级报警',
    push_method: '短信,邮件,APP推送,微信',
    description: '检测到可燃气体浓度超过安全限值时触发告警，需要立即疏散并检查泄漏源',
    status: '1',
    create_time: '2025-12-03 16:30:00',
    update_time: '2025-12-03 16:30:00',
    alarmIndicator: [
      {
        id: 'ind018',
        name: '可燃气体低阈值',
        type: 'abnormal',
        value: 'x>20%LEL',
        receiverType: 'platform',
        receivers: '安全工程师',
        status: '1',
        escalationTime: '15分钟',
        escalationLevel: '一级报警',
        escalationReceiver: '应急响应组'
      },
      {
        id: 'ind019',
        name: '可燃气体高阈值',
        type: 'abnormal',
        value: 'x>50%LEL',
        receiverType: 'platform',
        receivers: '应急响应组',
        status: '1',
        escalationTime: '10分钟',
        escalationLevel: '一级报警',
        escalationReceiver: '总工程师'
      }
    ]
  },
  {
    id: 'alarm015',
    name: '有毒气体超标告警',
    alarm_code: 'ALM015',
    alarm_category: '安全监控',
    alarm_type: '有毒气体',
    alarm_level: '一级报警',
    push_method: '短信,邮件,APP推送',
    description: '检测到有毒气体浓度超过安全限值时触发告警，需要立即启动应急响应',
    status: '1',
    create_time: '2025-12-03 17:15:00',
    update_time: '2025-12-03 17:15:00',
    alarmIndicator: [
      {
        id: 'ind020',
        name: '有毒气体阈值',
        type: 'abnormal',
        value: 'x>25ppm',
        receiverType: 'platform',
        receivers: '安全主管',
        status: '1',
        escalationTime: '15分钟',
        escalationLevel: '一级报警',
        escalationReceiver: '应急小组'
      }
    ]
  },
  {
    id: 'alarm016',
    name: '水浸检测告警',
    alarm_code: 'ALM016',
    alarm_category: '环境监测',
    alarm_type: '水浸检测',
    alarm_level: '二级报警',
    push_method: '短信,邮件',
    description: '检测到不应有水的区域出现积水时触发告警，需要检查管道或排水系统',
    status: '1',
    create_time: '2025-12-04 08:45:00',
    update_time: '2025-12-04 08:45:00',
    alarmIndicator: [
      {
        id: 'ind021',
        name: '水浸检测阈值',
        type: 'abnormal',
        value: 'x≥1',
        receiverType: 'platform',
        receivers: '维修人员',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '设备主管'
      }
    ]
  },
  {
    id: 'alarm017',
    name: '噪音超标告警',
    alarm_code: 'ALM017',
    alarm_category: '环境监测',
    alarm_type: '噪音检测',
    alarm_level: '三级报警',
    push_method: 'APP推送',
    description: '检测到噪音超过规定限值时触发告警，需要检查噪音源并采取措施',
    status: '1',
    create_time: '2025-12-04 09:30:00',
    update_time: '2025-12-04 09:30:00',
    alarmIndicator: [
      {
        id: 'ind022',
        name: '噪音阈值',
        type: 'abnormal',
        value: 'x>85dB',
        receiverType: 'platform',
        receivers: '环境管理员',
        status: '1',
        escalationTime: '2小时',
        escalationLevel: '二级报警',
        escalationReceiver: '安全主管'
      }
    ]
  },
  {
    id: 'alarm018',
    name: '粉尘浓度过高告警',
    alarm_code: 'ALM018',
    alarm_category: '环境监测',
    alarm_type: '粉尘浓度',
    alarm_level: '二级报警',
    push_method: '短信,APP推送',
    description: '检测到空气中粉尘浓度超过安全标准时触发告警，需要启动除尘设备',
    status: '1',
    create_time: '2025-12-04 10:20:00',
    update_time: '2025-12-04 10:20:00',
    alarmIndicator: [
      {
        id: 'ind023',
        name: '粉尘浓度阈值',
        type: 'abnormal',
        value: 'x>10mg/m³',
        receiverType: 'platform',
        receivers: '环境监测员',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '安全主管'
      }
    ]
  },
  {
    id: 'alarm019',
    name: '电压异常告警',
    alarm_code: 'ALM019',
    alarm_category: '设备监控',
    alarm_type: '电压异常',
    alarm_level: '二级报警',
    push_method: '邮件,APP推送',
    description: '检测到电压超出正常范围可能影响设备运行时触发告警，需要检查供电系统',
    status: '1',
    create_time: '2025-12-04 11:05:00',
    update_time: '2025-12-04 11:05:00',
    alarmIndicator: [
      {
        id: 'ind024',
        name: '电压低阈值',
        type: 'abnormal',
        value: 'x<342V',
        receiverType: 'platform',
        receivers: '电气工程师',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '电气主管'
      },
      {
        id: 'ind025',
        name: '电压高阈值',
        type: 'abnormal',
        value: 'x>418V',
        receiverType: 'platform',
        receivers: '电气工程师',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '电气主管'
      }
    ]
  },
  {
    id: 'alarm020',
    name: '电流异常告警',
    alarm_code: 'ALM020',
    alarm_category: '设备监控',
    alarm_type: '电流异常',
    alarm_level: '二级报警',
    push_method: '短信,邮件',
    description: '检测到电流异常可能预示设备故障时触发告警，需要检查设备运行状态',
    status: '1',
    create_time: '2025-12-04 13:40:00',
    update_time: '2025-12-04 13:40:00',
    alarmIndicator: [
      {
        id: 'ind026',
        name: '电流阈值',
        type: 'abnormal',
        value: 'x>额定值×1.2',
        receiverType: 'platform',
        receivers: '设备维护员',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '设备主管'
      }
    ]
  },
  {
    id: 'alarm021',
    name: '压力异常告警',
    alarm_code: 'ALM021',
    alarm_category: '设备监控',
    alarm_type: '压力异常',
    alarm_level: '二级报警',
    push_method: '短信,APP推送',
    description: '检测到管道或容器压力超出安全范围时触发告警，需要检查压力调节系统',
    status: '1',
    create_time: '2025-12-04 14:25:00',
    update_time: '2025-12-04 14:25:00',
    alarmIndicator: [
      {
        id: 'ind027',
        name: '压力低阈值',
        type: 'abnormal',
        value: 'x<0.2MPa',
        receiverType: 'platform',
        receivers: '设备操作员',
        status: '1',
        escalationTime: '30分钟',
        escalationLevel: '三级报警',
        escalationReceiver: '设备主管'
      },
      {
        id: 'ind028',
        name: '压力高阈值',
        type: 'abnormal',
        value: 'x>1.0MPa',
        receiverType: 'platform',
        receivers: '设备操作员',
        status: '1',
        escalationTime: '30分钟',
        escalationLevel: '三级报警',
        escalationReceiver: '设备主管'
      }
    ]
  },
  {
    id: 'alarm022',
    name: '液位异常告警',
    alarm_code: 'ALM022',
    alarm_category: '设备监控',
    alarm_type: '液位异常',
    alarm_level: '二级报警',
    push_method: '邮件,APP推送',
    description: '检测到储罐或容器液位超出安全范围时触发告警，需要检查进出料系统',
    status: '1',
    create_time: '2025-12-04 15:10:00',
    update_time: '2025-12-04 15:10:00',
    alarmIndicator: [
      {
        id: 'ind029',
        name: '液位低阈值',
        type: 'abnormal',
        value: 'x<20%',
        receiverType: 'platform',
        receivers: '工艺工程师',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '工艺主管'
      },
      {
        id: 'ind030',
        name: '液位高阈值',
        type: 'abnormal',
        value: 'x>80%',
        receiverType: 'platform',
        receivers: '工艺工程师',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '工艺主管'
      }
    ]
  },
  {
    id: 'alarm023',
    name: '振动异常告警',
    alarm_code: 'ALM023',
    alarm_category: '设备监控',
    alarm_type: '振动异常',
    alarm_level: '二级报警',
    push_method: '短信,邮件,APP推送',
    description: '检测到设备振动超出正常范围可能预示故障时触发告警，需要检查设备状态',
    status: '1',
    create_time: '2025-12-04 16:00:00',
    update_time: '2025-12-04 16:00:00',
    alarmIndicator: [
      {
        id: 'ind031',
        name: '振动阈值',
        type: 'abnormal',
        value: 'x>7.1mm/s',
        receiverType: 'platform',
        receivers: '设备维护员',
        status: '1',
        escalationTime: '1小时',
        escalationLevel: '三级报警',
        escalationReceiver: '设备主管'
      }
    ]
  },
  {
    id: 'alarm024',
    name: '转速异常告警',
    alarm_code: 'ALM024',
    alarm_category: '设备监控',
    alarm_type: '转速异常',
    alarm_level: '二级报警',
    push_method: '短信,APP推送',
    description: '检测到旋转设备转速超出设定范围时触发告警，需要检查驱动系统',
    status: '1',
    create_time: '2025-12-04 16:45:00',
    update_time: '2025-12-04 16:45:00',
    alarmIndicator: [
      {
        id: 'ind032',
        name: '转速低阈值',
        type: 'abnormal',
        value: 'x<额定값×0.8',
        receiverType: 'platform',
        receivers: '设备操作员',
        status: '1',
        escalationTime: '30分钟',
        escalationLevel: '三级报警',
        escalationReceiver: '设备主管'
      },
      {
        id: 'ind033',
        name: '转速高阈值',
        type: 'abnormal',
        value: 'x>额定값×1.2',
        receiverType: 'platform',
        receivers: '设备操作员',
        status: '1',
        escalationTime: '30分钟',
        escalationLevel: '三级报警',
        escalationReceiver: '设备主管'
      }
    ]
  }
];

// 生成唯一ID
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `alarm${timestamp}${random}`;
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
  let filteredData = [...alarms];

  if (rest.name) {
    filteredData = filteredData.filter(item =>
      item.name.includes(rest.name)
    );
  }

  if (rest.alarm_level) {
    filteredData = filteredData.filter(item =>
      item.alarm_level === rest.alarm_level
    );
  }

  if (rest.alarm_type) {
    filteredData = filteredData.filter(item =>
      item.alarm_type === rest.alarm_type
    );
  }

  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);

  return {
    alarms: pagedData,
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

  return formattedParams;
};

// 方法
const showAddModal = () => {
  modalTitle.value = '新增告警';
  resetForm();
  modalVisible.value = true;
};

const editAlarmFn = (record: AlarmConfig) => {
  modalTitle.value = '编辑告警';
  formState.id = record.id;
  formState.name = record.name;
  formState.alarm_code = record.alarm_code;
  formState.alarm_category = record.alarm_category;
  formState.alarm_type = record.alarm_type;
  formState.alarm_level = record.alarm_level;
  formState.push_method = record.push_method;
  formState.description = record.description;
  formState.status = record.status;
  // 确保报警指标数据正确回显
  formState.alarmIndicator = record.alarmIndicator ? [...record.alarmIndicator] : [];
  modalVisible.value = true;
};

const showAlarmDetail = (record: AlarmConfig) => {
  selectedAlarm.value = { ...record };
  detailModalVisible.value = true;
};

const confirmDelete = (record: AlarmConfig) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除告警"${record.name}"吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // 模拟删除操作延迟
        await new Promise(resolve => setTimeout(resolve, 300));

        // 从数组中删除数据
        const index = alarms.findIndex(item => item.id === record.id);
        if (index !== -1) {
          alarms.splice(index, 1);
          message.success('删除告警成功');

          // 重新加载数据
          smartTableRef.value?.refresh();
        } else {
          throw new Error('未找到要删除的告警');
        }
      } catch (error) {
        console.error('删除告警失败:', error);
        message.error('删除告警失败');
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

    if (modalTitle.value === '新增告警') {
      // 新增操作
      const newAlarm: AlarmConfig = {
        id: generateId(),
        name: formData.name,
        alarm_code: formData.alarm_code,
        alarm_category: formData.alarm_category,
        alarm_type: formData.alarm_type,
        alarm_level: formData.alarm_level,
        push_method: formData.push_method,
        description: formData.description,
        status: formData.status,
        create_time: getCurrentTime(),
        update_time: getCurrentTime()
      };

      alarms.unshift(newAlarm);
      message.success('新增告警成功');
    } else {
      // 编辑操作
      const index = alarms.findIndex(item => item.id === formData.id);
      if (index !== -1) {
        alarms[index] = {
          ...alarms[index],
          name: formData.name,
          alarm_code: formData.alarm_code,
          alarm_category: formData.alarm_category,
          alarm_type: formData.alarm_type,
          alarm_level: formData.alarm_level,
          push_method: formData.push_method,
          description: formData.description,
          status: formData.status,
          update_time: getCurrentTime()
        };
        message.success('编辑告警成功');
      } else {
        throw new Error('未找到要编辑的告警');
      }
    }

    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增告警' ? '新增告警失败' : '编辑告警失败');
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
  formState.name = '';
  formState.alarm_code = '';
  formState.alarm_category = '';
  formState.alarm_type = '';
  formState.alarm_level = '';
  formState.push_method = '';
  formState.description = '';
  formState.status = '';
};

const closeDetailModal = () => {
  detailModalVisible.value = false;
  selectedAlarm.value = {
    id: '',
    name: '',
    alarm_code: '',
    alarm_category: '',
    alarm_type: '',
    alarm_level: '',
    push_method: '',
    description: '',
    status: '',
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
const handleTableAction = (action: string, record: AlarmConfig) => {
  switch (action) {
    case 'edit':
      editAlarmFn(record);
      break;
    case 'detail':
      showAlarmDetail(record);
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
.alarm-config-container {
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