<template>
  <div class="warning-record-container p-[16px] flex flex-col overflow-hidden box-border"
    style="font-family: Source Han Sans CN;">

    <!-- 主要内容区域 -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
      <SmartTable ref="smartTableRef" :api="apiConfig" :columns="columns" :search-config="searchConfig"
        :responseConfig="responseConfig" :pagination="paginationConfig" :paramsFormatter="paramsFormatter"
        searchLayout="horizontal" @loadSuccess="handleLoadSuccess" @loadError="handleLoadError"
        :searchButtonWrapperSpan="6" :immediateSearch="true" :actionColumn="actionColumn" @action="handleTableAction">
      </SmartTable>
    </div>

    <!-- 预警记录详情弹窗 -->
    <Modal v-model:open="detailModalVisible" title="预警详情" width="1200px" :footer="null" @cancel="closeDetailModal">
      <div class="flex justify-between items-center mb-[16px]">
        <h3 class="text-[18px] font-semibold">基础信息</h3>
      </div>
      <AdvancedForm :schema="detailFormSchema" :model="selectedWarning" mode="descriptions" />

      <!-- 接收人员表格 -->
      <div class="mt-[24px]">
        <div class="flex justify-between items-center mb-[16px]">
          <h3 class="text-[18px] font-semibold">接收人员</h3>
        </div>
        <SmartTable :data-source="selectedWarning.receivers || []" :columns="receiverColumns" :pagination="false"
          rowKey="id" />
      </div>

      <!-- 传感数据源表格 -->
      <div class="mt-[24px]">
        <div class="flex justify-between items-center mb-[16px]">
          <h3 class="text-[18px] font-semibold">传感数据源</h3>
        </div>
        <SmartTable :data-source="selectedWarning.sensorData || []" :columns="sensorColumns" :pagination="false"
          rowKey="id" />
      </div>

      <!-- 摄像头数据源表格 -->
      <div class="mt-[24px]">
        <div class="flex justify-between items-center mb-[16px]">
          <h3 class="text-[18px] font-semibold">摄像头数据源</h3>
        </div>
        <SmartTable :data-source="selectedWarning.cameraData || []" :columns="cameraColumns" :pagination="false"
          rowKey="id" />
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue';
import {
  Modal,
  message
} from 'ant-design-vue';
import dayjs from 'dayjs';
import AdvancedForm from '@/components/advancedForm/index.vue';

// 类型定义
interface WarningRecord {
  id: string;
  category: string;
  level: string;
  impact: string;
  item: string;
  scope: string;
  address: string;
  protectionMeasures: string;
  status: string;
  publishTime: string;
  detectTime?: string;
  placeName?: string;
  warningMatter?: string;
  warningImage?: string;
  receivers?: Receiver[];
  sensorData?: SensorData[];
  cameraData?: CameraData[];  // 添加摄像头数据
}

interface Receiver {
  id: string;
  name: string;
  phone: string;
}

interface SensorData {
  id: string;
  name: string;
  type: string;
  value: string;
}

interface CameraData {
  id: string;
  name: string;
  status: string;
}

// 响应式数据
const detailModalVisible = ref(false);
const smartTableRef = ref();

// 选中的预警记录
const selectedWarning = ref<WarningRecord>({
  id: '',
  category: '',
  level: '',
  impact: '',
  item: '',
  scope: '',
  address: '',
  protectionMeasures: '',
  status: '',
  publishTime: '',
  detectTime: '',
  placeName: '',
  warningMatter: '',
  warningImage: '',
  receivers: [],
  sensorData: [],
  cameraData: []  // 添加摄像头数据初始化
});

// 接收人员表格列定义
const receiverColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
  }
];

// 传感数据源表格列定义
const sensorColumns = [
  {
    title: '传感器名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '监测类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '监测值',
    dataIndex: 'value',
    key: 'value',
  }
];

// 摄像头数据源表格列定义
const cameraColumns = [
  {
    title: '摄像头名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  }
];

// 预警级别选项
const warningLevels = [
  { label: '一级', value: '一级', color: 'red' },
  { label: '二级', value: '二级', color: 'orange' },
  { label: '三级', value: '三级', color: 'yellow' },
  { label: '四级', value: '四级', color: 'blue' }
]

// 处理状态选项
const processStatusOptions = [
  { label: '未处理', value: '0', color: 'red' },
  { label: '已处理', value: '1', color: 'green' }
]

// 预警类别选项
const warningCategories = [
  { label: '火灾预警', value: '火灾预警' },
  { label: '气体泄漏', value: '气体泄漏' },
  { label: '设备故障', value: '设备故障' },
  { label: '环境异常', value: '环境异常' },
  { label: '人员安全', value: '人员安全' },
  { label: '结构安全', value: '结构安全' },
  { label: '自然灾害', value: '自然灾害' }
]

// 表格列配置
const columns = [
  {
    title: '预警类别',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: '预警级别',
    dataIndex: 'level',
    key: 'level',
    width: 100,
    type: 'tag',
    options: warningLevels,
  },
  {
    title: '影响程度',
    dataIndex: 'impact',
    key: 'impact',
    width: 100,
  },
  {
    title: '预警事项',
    dataIndex: 'item',
    key: 'item',
    width: 150,
  },
  {
    title: '可能影响范围',
    dataIndex: 'scope',
    key: 'scope',
    width: 150,
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width: 200,
    ellipsis: true
  },
  {
    title: '公众应该采取的防护措施',
    dataIndex: 'protectionMeasures',
    key: 'protectionMeasures',
    width: 200,
    ellipsis: true
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    type: 'tag',
    options: processStatusOptions,
  },
  {
    title: '发布时间',
    dataIndex: 'publishTime',
    key: 'publishTime',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
    width: 160,
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 150,
  fixed: 'right',
  actions: [
    {
      label: '详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label: '去处理',
      props: { type: 'link', size: 'small', danger: true },
      action: 'process'
    }
  ]
};

// 搜索配置
const searchConfig = ref([
  {
    field: 'category',
    label: '预警类别',
    type: 'select',
    placeholder: '请选择预警类别',
    props: {
      allowClear: true,
      options: warningCategories
    },
    colSpan: 6
  },
  {
    field: 'level',
    label: '预警级别',
    type: 'select',
    placeholder: '请选择预警级别',
    props: {
      allowClear: true,
      options: warningLevels
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '处理状态',
    type: 'select',
    placeholder: '请选择处理状态',
    props: {
      allowClear: true,
      options: [
        { label: '全部', value: '' },
        ...processStatusOptions
      ]
    },
    colSpan: 6
  },
  {
    field: 'timeRange',
    label: '发布时间',
    type: 'date-range',
    placeholder: ['开始日期', '结束日期'],
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
  listKey: 'warnings',
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

// 详情表单配置
const detailFormSchema = [
  {
    key: 'placeName',
    type: 'text',
    label: '场所名称',
    colSpan: 12
  },
  {
    key: 'category',
    type: 'text',
    label: '预警类别',
    colSpan: 12
  },
  {
    key: 'level',
    type: 'text',
    label: '预警级别',
    colSpan: 12,
    formatter: (value: string) => {
      const option = warningLevels.find(item => item.value === value);
      return option ? option.label : value;
    }
  },
  {
    key: 'detectTime',
    type: 'text',
    label: '检测时间',
    colSpan: 12
  },
  {
    key: 'publishTime',
    type: 'text',
    label: '发布时间',
    colSpan: 12
  },
  {
    key: 'address',
    type: 'text',
    label: '地址',
    colSpan: 24
  },
  {
    key: 'scope',
    type: 'text',
    label: '可能影响范围',
    colSpan: 24
  },
  {
    key: 'warningMatter',
    type: 'text',
    label: '警示事项',
    colSpan: 24
  },
  {
    key: 'protectionMeasures',
    type: 'text',
    label: '公众应该采取的防护措施',
    colSpan: 24
  },
  {
    key: 'warningImage',
    type: 'image',
    label: '警示图片',
    colSpan: 24
  }
];

// 模拟数据存储
let warnings: WarningRecord[] = [
  {
    id: 'warning001',
    category: '火灾预警',
    level: '一级',
    impact: '严重',
    item: '火焰检测',
    scope: '整个实验区域',
    address: '科研大楼A栋1楼实验区',
    protectionMeasures: '立即疏散附近人员，启动消防应急预案',
    status: '0',
    publishTime: '2025-12-01 09:30:00',
    detectTime: '2025-12-01 09:25:00',
    placeName: '科研大楼A栋1楼实验区',
    warningMatter: '检测到实验区域火焰，可能存在火灾隐患',
    warningImage: 'https://via.placeholder.com/400x200/FF0000/FFFFFF?text=Fire+Warning',
    receivers: [
      {
        id: 'recv001',
        name: '张主任',
        phone: '10000000000'
      },
      {
        id: 'recv002',
        name: '李工程师',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor001',
        name: '温度传感器001',
        type: '温度',
        value: '45°C'
      },
      {
        id: 'sensor002',
        name: '烟雾传感器001',
        type: '烟雾浓度',
        value: '0.3ppm'
      }
    ],
    cameraData: [
      {
        id: 'cam001',
        name: '实验区入口摄像头',
        status: '正常'
      },
      {
        id: 'cam002',
        name: '实验区内部摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning002',
    category: '人员安全',
    level: '二级',
    impact: '中等',
    item: '未佩戴安全帽',
    scope: 'A区实验室',
    address: '科研大楼B栋2楼A区实验室',
    protectionMeasures: '立即通知相关人员佩戴安全帽',
    status: '1',
    publishTime: '2025-12-01 14:15:00',
    detectTime: '2025-12-01 14:10:00',
    placeName: '科研大楼B栋2楼A区实验室',
    warningMatter: '检测到实验室人员未佩戴安全帽',
    warningImage: 'https://via.placeholder.com/400x200/FFA500/FFFFFF?text=Hat+Not+Worn',
    receivers: [
      {
        id: 'recv003',
        name: '王研究员',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor003',
        name: '区域传感器001',
        type: '区域状态',
        value: '异常'
      }
    ],
    cameraData: [
      {
        id: 'cam003',
        name: 'A区实验室监控摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning003',
    category: '环境异常',
    level: '三级',
    impact: '一般',
    item: '辐射检测异常',
    scope: '研究室A段',
    address: '科研大楼C栋3楼研究室A段',
    protectionMeasures: '调节辐射防护系统，确保辐射水平正常',
    status: '0',
    publishTime: '2025-12-02 10:20:00',
    detectTime: '2025-12-02 10:15:00',
    placeName: '科研大楼C栋3楼研究室A段',
    warningMatter: '检测到辐射水平异常',
    warningImage: 'https://via.placeholder.com/400x200/FFFF00/000000?text=Radiation+Abnormal',
    receivers: [
      {
        id: 'recv004',
        name: '赵高工',
        phone: '10000000000'
      },
      {
        id: 'recv005',
        name: '钱助理',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor004',
        name: '辐射传感器001',
        type: '辐射剂量',
        value: '1.5mSv/h'
      },
      {
        id: 'sensor005',
        name: '辐射传感器002',
        type: '辐射类型',
        value: 'γ射线'
      }
    ],
    cameraData: [
      {
        id: 'cam004',
        name: '研究室监控摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning004',
    category: '设备故障',
    level: '四级',
    impact: '轻微',
    item: '设备振动异常',
    scope: '设备测试区域',
    address: '科研大楼D栋1楼设备测试区域',
    protectionMeasures: '检查设备运行状态，安排维护',
    status: '1',
    publishTime: '2025-12-02 15:30:00',
    detectTime: '2025-12-02 15:25:00',
    placeName: '科研大楼D栋1楼设备测试区域',
    warningMatter: '检测到设备振动异常',
    warningImage: 'https://via.placeholder.com/400x200/0000FF/FFFFFF?text=Device+Abnormal',
    receivers: [
      {
        id: 'recv006',
        name: '孙技术员',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor006',
        name: '振动传感器001',
        type: '振动',
        value: '7.1mm/s'
      }
    ],
    cameraData: [
      {
        id: 'cam005',
        name: '设备测试区域监控摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning005',
    category: '人员安全',
    level: '一级',
    impact: '严重',
    item: '人员跌倒',
    scope: '实验通道',
    address: '科研大楼E栋1楼实验通道',
    protectionMeasures: '立即救助跌倒人员，检查Maintainer围环境安全',
    status: '1',
    publishTime: '2025-12-03 09:15:00',
    detectTime: '2025-12-03 09:10:00',
    placeName: '科研大楼E栋1楼实验通道',
    warningMatter: '检测到实验通道人员跌倒事件',
    warningImage: 'https://via.placeholder.com/400x200/FF0000/FFFFFF?text=Person+Fall',
    receivers: [
      {
        id: 'recv007',
        name: 'Maintainer安全员',
        phone: '10000000000'
      },
      {
        id: 'recv008',
        name: '吴管理员',
        phone: '10000000000'
      }
    ],
    sensorData: [],
    cameraData: [
      {
        id: 'cam006',
        name: '实验通道监控摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning006',
    category: '结构安全',
    level: '二级',
    impact: '中等',
    item: '非法闯入',
    scope: 'A区机房',
    address: '科研大楼F栋机房A区',
    protectionMeasures: '限制人员进入，加强安全监控',
    status: '0',
    publishTime: '2025-12-03 11:45:00',
    detectTime: '2025-12-03 11:40:00',
    placeName: '科研大楼F栋机房A区',
    warningMatter: '检测到未经授权人员进入机房',
    warningImage: 'https://via.placeholder.com/400x200/FFA500/FFFFFF?text=Intrusion',
    receivers: [
      {
        id: 'recv009',
        name: '郑安保',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor007',
        name: '红外传感器001',
        type: '红外',
        value: '异常'
      }
    ],
    cameraData: [
      {
        id: 'cam007',
        name: '机房入口摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning007',
    category: '结构安全',
    level: '三级',
    impact: '一般',
    item: '网络异常',
    scope: '全院区域',
    address: '全院网络系统',
    protectionMeasures: '检查网络设备，恢复网络连接',
    status: '1',
    publishTime: '2025-12-04 08:30:00',
    detectTime: '2025-12-04 08:20:00',
    placeName: '全院网络系统',
    warningMatter: '检测到核心网络连接异常',
    warningImage: 'https://via.placeholder.com/400x200/FFFF00/000000?text=Network+Issue',
    receivers: [
      {
        id: 'recv010',
        name: '王网络工程师',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor008',
        name: '网络监控传感器001',
        type: '网络状态',
        value: '断开'
      }
    ],
    cameraData: [
      {
        id: 'cam008',
        name: '网络机房监控摄像头',
        status: '异常'
      }
    ]
  },
  {
    id: 'warning008',
    category: '气体泄漏',
    level: '一级',
    impact: '严重',
    item: '气体泄漏',
    scope: '化学实验室',
    address: '科研大楼G栋4楼化学实验室',
    protectionMeasures: '立即疏散实验室人员，启动气体泄漏应急预案',
    status: '0',
    publishTime: '2025-12-04 13:45:00',
    detectTime: '2025-12-04 13:40:00',
    placeName: '科研大楼G栋4楼化学实验室',
    warningMatter: '检测到有毒气体泄漏',
    warningImage: 'https://via.placeholder.com/400x200/FF0000/FFFFFF?text=Gas+Leakage',
    receivers: [
      {
        id: 'recv011',
        name: '刘安全主任',
        phone: '10000000000'
      },
      {
        id: 'recv012',
        name: '陈实验员',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor009',
        name: '气体传感器001',
        type: '气体浓度',
        value: '25ppm'
      },
      {
        id: 'sensor010',
        name: '气体传感器002',
        type: '气体类型',
        value: '氯气'
      }
    ],
    cameraData: [
      {
        id: 'cam009',
        name: '化学实验室入口摄像头',
        status: '正常'
      },
      {
        id: 'cam010',
        name: '化学实验室内部摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning009',
    category: '环境异常',
    level: '二级',
    impact: '中等',
    item: '温湿度异常',
    scope: '精密仪器室',
    address: '科研大楼H栋2楼精密仪器室',
    protectionMeasures: '调整环境控制系统，确保仪器运行环境稳定',
    status: '1',
    publishTime: '2025-12-05 10:15:00',
    detectTime: '2025-12-05 10:10:00',
    placeName: '科研大楼H栋2楼精密仪器室',
    warningMatter: '检测到精密仪器室温湿度超出安全范围',
    warningImage: 'https://via.placeholder.com/400x200/FFA500/FFFFFF?text=Temp+Humidity',
    receivers: [
      {
        id: 'recv013',
        name: '杨工程师',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor011',
        name: '温湿度传感器001',
        type: '温度',
        value: '35°C'
      },
      {
        id: 'sensor012',
        name: '温湿度传感器002',
        type: '湿度',
        value: '85%'
      }
    ],
    cameraData: [
      {
        id: 'cam011',
        name: '精密仪器室监控摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning010',
    category: '设备故障',
    level: '三级',
    impact: '一般',
    item: '压力异常',
    scope: '高压实验区',
    address: '科研大楼I栋5楼高压实验区',
    protectionMeasures: '暂停相关实验，检查压力系统',
    status: '0',
    publishTime: '2025-12-05 16:20:00',
    detectTime: '2025-12-05 16:15:00',
    placeName: '科研大楼I栋5楼高压实验区',
    warningMatter: '检测到实验设备压力异常',
    warningImage: 'https://via.placeholder.com/400x200/FFFF00/000000?text=Pressure+Abnormal',
    receivers: [
      {
        id: 'recv014',
        name: '马实验师',
        phone: '10000000000'
      },
      {
        id: 'recv015',
        name: '胡技术员',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor013',
        name: '压力传感器001',
        type: '压力',
        value: '1.8MPa'
      }
    ],
    cameraData: [
      {
        id: 'cam012',
        name: '高压实验区监控摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning011',
    category: '人员安全',
    level: '四级',
    impact: '轻微',
    item: '睡岗检测',
    scope: '监控中心',
    address: '科研大楼J栋1楼监控中心',
    protectionMeasures: '提醒值班人员保持警觉',
    status: '1',
    publishTime: '2025-12-06 02:30:00',
    detectTime: '2025-12-06 02:25:00',
    placeName: '科研大楼J栋1楼监控中心',
    warningMatter: '检测到监控中心值班人员睡岗',
    warningImage: 'https://via.placeholder.com/400x200/0000FF/FFFFFF?text=Sleep+Detection',
    receivers: [
      {
        id: 'recv016',
        name: '冯值班长',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor014',
        name: '行为检测传感器001',
        type: '行为状态',
        value: '睡岗'
      }
    ],
    cameraData: [
      {
        id: 'cam013',
        name: '监控中心摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning012',
    category: '人员安全',
    level: '二级',
    impact: '中等',
    item: '人员超限',
    scope: '危险品仓库',
    address: '科研大楼K栋地下1层危险品仓库',
    protectionMeasures: '立即疏散多余人员，确保仓库人员数量符合安全规定',
    status: '0',
    publishTime: '2025-12-06 14:45:00',
    detectTime: '2025-12-06 14:40:00',
    placeName: '科研大楼K栋地下1层危险品仓库',
    warningMatter: '检测到危险品仓库人员数量超限',
    warningImage: 'https://via.placeholder.com/400x200/FFA500/FFFFFF?text=Over+Capacity',
    receivers: [
      {
        id: 'recv017',
        name: '田安全员',
        phone: '10000000000'
      },
      {
        id: 'recv018',
        name: '杜管理员',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor015',
        name: '人数统计传感器001',
        type: '人员数量',
        value: '8人'
      }
    ],
    cameraData: [
      {
        id: 'cam014',
        name: '危险品仓库入口摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning013',
    category: '设备故障',
    level: '一级',
    impact: '严重',
    item: '电力故障',
    scope: '全院供电系统',
    address: '全院电力系统',
    protectionMeasures: '启动备用电源，联系电力维修部门',
    status: '1',
    publishTime: '2025-12-07 09:05:00',
    detectTime: '2025-12-07 09:00:00',
    placeName: '全院电力系统',
    warningMatter: '检测到全院电力系统故障',
    warningImage: 'https://via.placeholder.com/400x200/FF0000/FFFFFF?text=Power+Failure',
    receivers: [
      {
        id: 'recv019',
        name: '梁电工',
        phone: '10000000000'
      },
      {
        id: 'recv020',
        name: '宋工程师',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor016',
        name: '电力监控传感器001',
        type: '电压',
        value: '0V'
      },
      {
        id: 'sensor017',
        name: '电力监控传感器002',
        type: '电流',
        value: '0A'
      }
    ],
    cameraData: [
      {
        id: 'cam015',
        name: '配电室监控摄像头',
        status: '异常'
      }
    ]
  },
  {
    id: 'warning014',
    category: '环境异常',
    level: '二级',
    impact: '中等',
    item: '噪音超标',
    scope: '机械加工区',
    address: '科研大楼L栋3楼机械加工区',
    protectionMeasures: '检查噪音源，采取降噪措施',
    status: '0',
    publishTime: '2025-12-07 11:30:00',
    detectTime: '2025-12-07 11:25:00',
    placeName: '科研大楼L栋3楼机械加工区',
    warningMatter: '检测到机械加工区噪音超标',
    warningImage: 'https://via.placeholder.com/400x200/FFA500/FFFFFF?text=Noise+High',
    receivers: [
      {
        id: 'recv021',
        name: '蒋技术员',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor018',
        name: '噪音传感器001',
        type: '噪音等级',
        value: '95dB'
      }
    ],
    cameraData: [
      {
        id: 'cam016',
        name: '机械加工区监控摄像头',
        status: '正常'
      }
    ]
  },
  {
    id: 'warning015',
    category: '设备故障',
    level: '三级',
    impact: '一般',
    item: '液位异常',
    scope: '冷却水系统',
    address: '科研大楼M栋地下室冷却水系统',
    protectionMeasures: '检查进出水系统，调整液位至正常范围',
    status: '1',
    publishTime: '2025-12-08 15:20:00',
    detectTime: '2025-12-08 15:15:00',
    placeName: '科研大楼M栋地下室冷却水系统',
    warningMatter: '检测到冷却水系统液位异常',
    warningImage: 'https://via.placeholder.com/400x200/FFFF00/000000?text=Liquid+Level',
    receivers: [
      {
        id: 'recv022',
        name: '魏维护员',
        phone: '10000000000'
      }
    ],
    sensorData: [
      {
        id: 'sensor019',
        name: '液位传感器001',
        type: '液位高度',
        value: '15%'
      }
    ],
    cameraData: [
      {
        id: 'cam017',
        name: '冷却水系统监控摄像头',
        status: '正常'
      }
    ]
  }
];

// API 配置（使用模拟数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;

  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));

  // 过滤数据
  let filteredData = [...warnings];

  if (rest.category) {
    filteredData = filteredData.filter(item =>
      item.category === rest.category
    );
  }

  if (rest.level) {
    filteredData = filteredData.filter(item =>
      item.level === rest.level
    );
  }

  if (rest.status) {
    filteredData = filteredData.filter(item =>
      item.status === rest.status
    );
  }

  if (rest.publishTimeRange && Array.isArray(rest.publishTimeRange) && rest.publishTimeRange.length === 2) {
    const [startDate, endDate] = rest.publishTimeRange;
    // 确保日期包含完整的当天（从00:00:00到23:59:59）
    const startOfDay = dayjs(startDate).startOf('day');
    const endOfDay = dayjs(endDate).endOf('day');

    filteredData = filteredData.filter(item =>
      dayjs(item.publishTime).isBetween(startOfDay, endOfDay, null, '[]')
    );
  }

  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);

  return {
    warnings: pagedData,
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

  // 处理日期范围参数
  if (params.publishTimeRange && Array.isArray(params.publishTimeRange) && params.publishTimeRange.length === 2) {
    formattedParams.publishTimeRange = [
      dayjs(params.publishTimeRange[0]).format('YYYY-MM-DD'),
      dayjs(params.publishTimeRange[1]).format('YYYY-MM-DD')
    ];
  } else if (params.publishTimeRange) {
    // 如果日期范围格式不正确，删除该参数
    delete formattedParams.publishTimeRange;
  }

  if (pagination) {
    formattedParams.pageNum = pagination.current || 1;
    formattedParams.pageSize = pagination.pageSize || 10;
  }

  return formattedParams;
};

// 方法
const showWarningDetail = (record: WarningRecord) => {
  selectedWarning.value = { ...record };
  detailModalVisible.value = true;
};

const processWarning = (record: WarningRecord) => {
  Modal.confirm({
    title: '确认处理',
    content: `确定要处理预警"${record.item}"吗？`,
    onOk: async () => {
      try {
        // 模拟处理操作延迟
        await new Promise(resolve => setTimeout(resolve, 300));

        // 更新记录状态
        const index = warnings.findIndex(item => item.id === record.id);
        if (index !== -1) {
          warnings[index].status = '1';
          message.success('处理预警成功');

          // 重新加载数据
          smartTableRef.value?.refresh();
        } else {
          throw new Error('未找到要处理的预警');
        }
      } catch (error) {
        console.error('处理预警失败:', error);
        message.error('处理预警失败');
      }
    }
  });
};

const closeDetailModal = () => {
  detailModalVisible.value = false;
  selectedWarning.value = {
    id: '',
    category: '',
    level: '',
    impact: '',
    item: '',
    scope: '',
    address: '',
    protectionMeasures: '',
    status: '',
    publishTime: '',
    detectTime: '',
    placeName: '',
    warningMatter: '',
    warningImage: '',
    receivers: [],
    sensorData: [],
    cameraData: []  // 添加摄像头数据初始化
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
const handleTableAction = (action: string, record: WarningRecord) => {
  switch (action) {
    case 'detail':
      showWarningDetail(record);
      break;
    case 'process':
      processWarning(record);
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
.warning-record-container {
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