<template>
  <div class="equipment-container p-[16px] flex flex-col overflow-hidden box-border"
    style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="ml-1 leading-none">新增设备</span>
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

    <!-- 新增/编辑设备弹窗 -->
    <Modal v-model:open="modalVisible" :title="modalTitle" width="1200px" :confirm-loading="modalLoading"
      @ok="handleModalOk" @cancel="handleModalCancel">
      <AdvancedForm ref="formRef" :schema="formSchema" :model="formState" mode="form" formLayout="horizontal"
        :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
        <template #title>
          <div class="w-full text-base text-[#4362EF] bg-[#F1F7FD] px-4 py-2 my-2 font-semibold">设备基础配置</div>
        </template>
        <template #equipmentParameter>
          <div class="w-full text-base text-[#4362EF] bg-[#F1F7FD] px-4 py-2  my-4 font-semibold">设备参数配置</div>
          <!-- 新增设备参数按钮 -->
          <Button class="ml-[20px]" type="primary" style="background-color: #4362EF;" @click="showAddParameterModal">
            <span class="flex items-center">
              <PlusOutlined />
              <span class="ml-1 leading-none">新增设备参数</span>
            </span>
          </Button>
          <!-- 设备参数表格 -->
          <SmartTable :data-source="formState.equipmentParameter" :columns="parameterColumns" :pagination="false"
            rowKey="id" :action-column="parameterActionColumn" @action="handleParameterAction" />
        </template>
      </AdvancedForm>

    </Modal>

    <!-- 设备- 新增/编辑设备参数弹窗 -->
    <Modal v-model:open="parameterModalVisible" :title="parameterModalTitle" width="800px"
      :confirm-loading="parameterModalLoading" @ok="handleParameterModalOk" @cancel="handleParameterModalCancel">
      <AdvancedForm ref="parameterFormRef" :schema="parameterFormSchema" :model="parameterFormState" mode="form"
        :column="2" />
    </Modal>

    <!-- 设备-详情弹窗 -->
    <Modal v-model:open="detailModalVisible" title="设备详情" width="1200px" :footer="null" @cancel="closeDetailModal">
      <Tabs v-model:activeKey="activeTabKey" type="card">
        <!-- 设备档案标签页 -->
        <TabPane key="archive" tab="设备档案">
          <div class="flex justify-between items-center mb-[16px]">
            <h3 class="text-[18px] font-semibold">基础信息</h3>
          </div>
          <AdvancedForm :schema="detailFormSchema" :model="selectedEquipment" mode="descriptions" />

          <div class="mt-[24px]">
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">技术参数</h3>
            </div>
            <SmartTable :data-source="selectedEquipment.equipmentParameter || []" :columns="parameterColumns"
              :pagination="false" rowKey="id" />
          </div>

          <div class="mt-[24px]">
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">关联信息</h3>
            </div>
            <AdvancedForm :schema="relatedInfoSchema" :model="selectedEquipment" mode="descriptions" />
          </div>

          <div class="mt-[24px]">
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">附件</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <Tag v-for="doc in selectedEquipment.documents || []" :key="doc" color="blue">
                {{ doc }}
              </Tag>
            </div>
          </div>
        </TabPane>

        <!-- 实时状态与监测标签页 -->
        <TabPane key="monitoring" tab="实时状态与监测">
          <div class="flex justify-between items-center mb-[16px]">
            <h3 class="text-[18px] font-semibold">AI视频监测面板</h3>
          </div>
          <div class="p-4 mb-4 bg-gray-100 rounded-lg">
            <div class="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
              <span class="text-gray-500">视频监控画面</span>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-[16px] font-medium mb-2">监测项目列表</h4>
            <div class="space-y-2">
              <div class="p-2 border rounded bg-blue-50">
                <span class="font-medium">泄漏检测：</span>
                <span class="text-green-600">正常</span>
              </div>
              <div class="p-2 border rounded bg-blue-50">
                <span class="font-medium">反应釜压力表读数：</span>
                <span class="text-green-600">0.8MPa (正常范围:0.5-1.0MPa)</span>
              </div>
              <div class="p-2 border rounded bg-blue-50">
                <span class="font-medium">电机震动：</span>
                <span class="text-yellow-600">轻微异常 (持续10s)</span>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-[16px] font-medium mb-2">最新报警快照</h4>
            <div class="flex items-center justify-center h-40 bg-gray-200 rounded-lg">
              <span class="text-gray-500">最近一次报警的抓图或短视频</span>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-[16px] font-medium mb-2">传感器数据</h4>
            <div class="flex items-center justify-center h-40 bg-gray-200 rounded-lg">
              <span class="text-gray-500">温度、压力、流量等实时数据曲线图</span>
            </div>
          </div>

          <div>
            <h4 class="text-[16px] font-medium mb-2">当前任务</h4>
            <div class="p-2 border rounded bg-blue-50">
              <span class="font-medium">当前实验任务：</span>
              <span>化学合成反应实验 #R2025122701</span>
            </div>
          </div>
        </TabPane>

        <!-- 运维记录标签页 -->
        <TabPane key="maintenance" tab="运维记录">
          <div class="mb-4">
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">维修记录</h3>
            </div>
            <SmartTable :data-source="selectedEquipment.maintenanceRecords || []" :columns="maintenanceColumns"
              :pagination="false" rowKey="id" />
          </div>

          <div class="mb-4">
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">保养记录</h3>
            </div>
            <SmartTable :data-source="selectedEquipment.maintenanceRecords || []" :columns="maintenanceColumns"
              :pagination="false" rowKey="id" />
          </div>

          <div class="mb-4">
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">计量校准记录</h3>
            </div>
            <SmartTable :data-source="selectedEquipment.calibrationRecords || []" :columns="calibrationColumns"
              :pagination="false" rowKey="id" />
          </div>

          <div class="mb-4">
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">点巡检记录</h3>
            </div>
            <SmartTable :data-source="selectedEquipment.inspectionRecords || []" :columns="inspectionColumns"
              :pagination="false" rowKey="id" />
          </div>

          <div>
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">报警历史</h3>
            </div>
            <SmartTable :data-source="selectedEquipment.alarmHistory || []" :columns="alarmHistoryColumns"
              :pagination="false" rowKey="id" />
          </div>
        </TabPane>

        <!-- 关联与统计标签页 -->
        <TabPane key="related" tab="关联与统计">
          <div class="mb-4">
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">关联备件</h3>
            </div>
            <SmartTable :data-source="selectedEquipment.relatedSpares || []" :columns="sparesColumns"
              :pagination="false" rowKey="id" />
          </div>

          <div class="mb-4">
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">关联文档</h3>
            </div>
            <SmartTable :data-source="selectedEquipment.relatedDocuments || []" :columns="documentColumns"
              :pagination="false" rowKey="id" />
          </div>

          <div>
            <div class="flex justify-between items-center mb-[16px]">
              <h3 class="text-[18px] font-semibold">统计信息</h3>
            </div>
            <AdvancedForm :schema="statisticsSchema" :model="selectedEquipment" mode="descriptions" />
          </div>
        </TabPane>
      </Tabs>
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
  Divider,
  Progress,
  Tabs,
  TabPane
} from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import AdvancedForm from '@/components/advancedForm/index.vue';
import { equipmentData } from "./data.ts"

// 类型定义
interface Equipment {
  id: string;
  name: string;
  equipment_code: string;
  equipment_category: string;
  equipment_type: string;
  equipment_level: string;
  manufacturer: string;
  description: string;
  status: string;
  health_index: number;
  department: string;
  location: string;
  responsible_person: string;
  last_alarm_time?: string;
  last_alarm_type?: string;
  create_time?: string;
  update_time?: string;
  equipmentParameter?: EquipmentParameter[];
  factory_number?: string;
  model?: string;
  supplier?: string;
  purchase_date?: string;
  use_date?: string;
  expected_life?: number;
  original_value?: number;
  security_level?: string;
  contact_mediums?: string[];
  related_processes?: string[];
  documents?: string[];
  maintenanceRecords?: MaintenanceRecord[];
  calibrationRecords?: CalibrationRecord[];
  inspectionRecords?: InspectionRecord[];
  alarmHistory?: AlarmRecord[];
  relatedSpares?: SparePart[];
  relatedDocuments?: Document[];
}

interface EquipmentParameter {
  id: string;
  name: string;
  type: string;
  value: string;
  unit: string;
  status: string;
}

interface MaintenanceRecord {
  id: string;
  repair_time: string;
  fault_description: string;
  repair_person: string;
  replaced_parts: string;
  result: string;
  duration: string;
  cost: number;
  operator: string; // 操作员
}

interface CalibrationRecord {
  id: string;
  instrument_id: string;
  last_calibration: string;
  next_calibration: string;
  result: string;
  certificate_id: string;
  operator: string; // 操作员
}

interface InspectionRecord {
  id: string;
  inspection_time: string;
  inspector: string;
  items: string;
  result: string;
  operator: string; // 操作员
}

interface AlarmRecord {
  id: string;
  time: string;
  type: string;
  level: string;
  status: string;
  snapshot: string;
  source: string; // 报警来源: AI, SENSOR, MANUAL
  operator: string; // 操作员
}

interface SparePart {
  id: string;
  name: string;
  code: string;
  inventory: number;
  min_inventory: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  update_time: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const detailModalVisible = ref(false);
const modalTitle = ref('新增设备');
const smartTableRef = ref();
const formRef = ref();
const activeTabKey = ref('archive');

// 表单状态
const formState = reactive({
  id: '',
  name: '',
  equipment_code: '',
  equipment_category: '',
  equipment_type: '',
  equipment_level: '',
  manufacturer: '',
  description: '',
  status: '',
  health_index: 100,
  department: '',
  location: '',
  responsible_person: '',
  last_alarm_time: '',
  last_alarm_type: '',
  equipmentParameter: [], // 初始化为空数组
  // 添加设备档案相关字段
  factory_number: '',
  model: '',
  supplier: '',
  purchase_date: '',
  use_date: '',
  expected_life: 10,
  original_value: 0,
  security_level: '',
  contact_mediums: [],
  related_processes: [],
  documents: []
});

// 设备参数表格列定义
const parameterColumns = [
  {
    title: '参数名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '参数类型',
    dataIndex: 'type',
    key: 'type',
    customRender: ({ record }) => {
      const typeOptions = [
        { label: '运行参数', value: 'operation' },
        { label: '监测参数', value: 'monitoring' },
        { label: '安全参数', value: 'safety' },
        { label: '控制参数', value: 'control' }
      ];
      const option = typeOptions.find(item => item.value === record.type);
      return option ? option.label : record.type;
    }
  },
  {
    title: '参数值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '是否启用',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }) => {
      const statusOptions = [
        { label: '启用', value: '1', color: 'green' },
        { label: '禁用', value: '0', color: 'red' }
      ];
      const option = statusOptions.find(item => item.value === record.status);
      return option ? option.label : record.status;
    }
  }
];

// 设备参数操作列配置
const parameterActionColumn = {
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

// 维修记录表格列定义
const maintenanceColumns = [
  {
    title: '报修时间',
    dataIndex: 'repair_time',
    key: 'repair_time',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
  },
  {
    title: '故障现象',
    dataIndex: 'fault_description',
    key: 'fault_description'
  },
  {
    title: '维修人员',
    dataIndex: 'repair_person',
    key: 'repair_person'
  },
  {
    title: '更换备件',
    dataIndex: 'replaced_parts',
    key: 'replaced_parts'
  },
  {
    title: '维修结果',
    dataIndex: 'result',
    key: 'result'
  },
  {
    title: '耗时',
    dataIndex: 'duration',
    key: 'duration'
  },
  {
    title: '费用',
    dataIndex: 'cost',
    key: 'cost'
  },
  {
    title: '操作员',
    dataIndex: 'operator',
    key: 'operator'
  }
];

// 计量校准记录表格列定义
const calibrationColumns = [
  {
    title: '计量器具编号',
    dataIndex: 'instrument_id',
    key: 'instrument_id'
  },
  {
    title: '上次校准日期',
    dataIndex: 'last_calibration',
    key: 'last_calibration',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD') : '-'
  },
  {
    title: '下次校准日期',
    dataIndex: 'next_calibration',
    key: 'next_calibration',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD') : '-'
  },
  {
    title: '校准结果',
    dataIndex: 'result',
    key: 'result'
  },
  {
    title: '证书编号',
    dataIndex: 'certificate_id',
    key: 'certificate_id'
  },
  {
    title: '操作员',
    dataIndex: 'operator',
    key: 'operator'
  }
];

// 点巡检记录表格列定义
const inspectionColumns = [
  {
    title: '巡检时间',
    dataIndex: 'inspection_time',
    key: 'inspection_time',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
  },
  {
    title: '巡检人',
    dataIndex: 'inspector',
    key: 'inspector'
  },
  {
    title: '巡检项目',
    dataIndex: 'items',
    key: 'items'
  },
  {
    title: '巡检结果',
    dataIndex: 'result',
    key: 'result'
  },
  {
    title: '操作员',
    dataIndex: 'operator',
    key: 'operator'
  }
];

// 报警历史记录表格列定义
const alarmHistoryColumns = [
  {
    title: '报警时间',
    dataIndex: 'time',
    key: 'time',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
  },
  {
    title: '报警类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '报警等级',
    dataIndex: 'level',
    key: 'level'
  },
  {
    title: '处置状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '报警来源',
    dataIndex: 'source',
    key: 'source',
    type: 'tag',
    customRender: ({ record }) => {
      const sourceMap = [
        { label: 'AI监测', value: 'AI', color: 'blue' },
        { label: '传感器', value: 'SENSOR', color: 'orange' },
        { label: '人工填报', value: 'MANUAL', color: 'green' }
      ];
      const option = sourceMap.find(item => item.value === record.source);
      return option ? option.label : record.source;
    }
    // customRender: ({ text }) => {
    //   const sourceMap = {
    //     'AI': { text: 'AI监测', color: 'blue' },
    //     'SENSOR': { text: '传感器', color: 'orange' },
    //     'MANUAL': { text: '人工填报', color: 'green' }
    //   };
    //   const source = sourceMap[text] || { text, color: 'default' };
    //   return <Tag color={ source.color }> { source.text } </Tag>;
    // }
  },
  {
    title: '操作员',
    dataIndex: 'operator',
    key: 'operator'
  }
];

// 关联备件表格列定义
const sparesColumns = [
  {
    title: '备件名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '备件编码',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '库存数量',
    dataIndex: 'inventory',
    key: 'inventory'
  },
  {
    title: '最低库存',
    dataIndex: 'min_inventory',
    key: 'min_inventory'
  }
];

// 关联文档表格列定义
const documentColumns = [
  {
    title: '文档名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '文档类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
  }
];

// 选中的设备
const selectedEquipment = ref<Equipment>({
  id: '',
  name: '',
  equipment_code: '',
  equipment_category: '',
  equipment_type: '',
  equipment_level: '',
  manufacturer: '',
  description: '',
  status: '',
  health_index: 100,
  department: '',
  location: '',
  responsible_person: '',
  last_alarm_time: '',
  last_alarm_type: '',
  factory_number: '',
  model: '',
  supplier: '',
  purchase_date: '',
  use_date: '',
  expected_life: 10,
  original_value: 0,
  security_level: '',
  contact_mediums: [],
  related_processes: [],
  documents: [],
  maintenanceRecords: [],
  calibrationRecords: [],
  inspectionRecords: [],
  alarmHistory: [],
  relatedSpares: [],
  relatedDocuments: []
});

// 关联信息表单配置
const relatedInfoSchema = [
  {
    key: 'contact_mediums',
    type: 'text',
    label: '关联危险化学品',
    formatter: (value: string[]) => value ? value.join(', ') : '-',
    colSpan: 24
  },
  {
    key: 'related_processes',
    type: 'text',
    label: '关联工艺流程图或SOP编号',
    formatter: (value: string[]) => value ? value.join(', ') : '-',
    colSpan: 24
  },
  {
    key: 'related_processes',
    type: 'text',
    label: '所属生产线/实验装置',
    colSpan: 24
  }
];

// 统计信息表单配置
const statisticsSchema = [
  {
    key: 'monthly_faults',
    type: 'text',
    label: '本月故障次数',
    formatter: (value: number) => value ? value.toString() : '0',
    colSpan: 12
  },
  {
    key: 'yearly_faults',
    type: 'text',
    label: '本年故障次数',
    formatter: (value: number) => value ? value.toString() : '0',
    colSpan: 12
  },
  {
    key: 'mttr',
    type: 'text',
    label: '平均维修时间(MTTR)',
    formatter: (value: number) => value ? `${value}小时` : '0小时',
    colSpan: 12
  },
  {
    key: 'mtbf',
    type: 'text',
    label: '平均无故障时间(MTBF)',
    formatter: (value: number) => value ? `${value}小时` : '0小时',
    colSpan: 12
  },
  {
    key: 'total_repair_cost',
    type: 'text',
    label: '累计维修费用',
    formatter: (value: number) => value ? `¥${value}` : '¥0',
    colSpan: 12
  }
];

// 设备状态选项
const equipmentStatuses = [
  { label: '正常', value: 'normal', color: 'blue', icon: '🔵' },
  { label: '运行中', value: 'running', color: 'green', icon: '🟢' },
  { label: '预警', value: 'warning', color: 'gold', icon: '🟡' },
  { label: '报警', value: 'alert', color: 'orange', icon: '🟠' },
  { label: '紧急', value: 'emergency', color: 'red', icon: '🔴' },
  { label: '停机/维修', value: 'maintenance', color: 'gray', icon: '⚫' },
  { label: '报废', value: 'scrap', color: 'default', icon: '⚪' }
];

const equipmentLevels = [
  { label: '关键设备', value: '关键设备', color: 'red' },
  { label: '重要设备', value: '重要设备', color: 'orange' },
  { label: '一般设备', value: '一般设备', color: 'blue' }
]

const manufacturers = [
  { label: '示例地区九院设备厂', value: '示例地区九院设备厂' },
  { label: '中核设备制造有限公司', value: '中核设备制造有限公司' },
  { label: '国机集团设备有限公司', value: '国机集团设备有限公司' },
  { label: '自研设备', value: '自研设备' }
]

// 表格列配置
const columns = [
  {
    title: '设备编号',
    dataIndex: 'equipment_code',
    key: 'equipment_code',
    width: 150,
    slots: { customRender: 'equipmentCode' }
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '所属部门',// '所属部门/课题组',
    dataIndex: 'department',
    key: 'department',
    width: 120,
  },
  {
    title: '安装位置',
    dataIndex: 'location',
    key: 'location',
    width: 150,
  },
  {
    title: '设备分类',
    dataIndex: 'equipment_category',
    key: 'equipment_category',
    width: 120,
    type: 'tag',
    options: [
      { label: '反应设备', value: '反应设备', color: 'blue' },
      { label: '分离设备', value: '分离设备', color: 'green' },
      { label: '分析仪器', value: '分析仪器', color: 'orange' },
      { label: '动力设备', value: '动力设备', color: 'purple' },
      { label: '辅助设备', value: '辅助设备', color: 'cyan' }
    ]
  },
  // {
  //   title: '设备状态',
  //   dataIndex: 'status',
  //   key: 'status',
  //   width: 120,
  //   type: 'tag',
  //   options: equipmentStatuses,
  // },
  {
    title: '健康度指数',
    dataIndex: 'health_index',
    key: 'health_index',
    width: 280,
    type: 'progress',
  },
  {
    title: '责任人',
    dataIndex: 'responsible_person',
    key: 'responsible_person',
    width: 100,
  },
  {
    title: '最后报警时间',
    dataIndex: 'last_alarm_time',
    key: 'last_alarm_time',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-',
    width: 180,
  },
  {
    title: '最后报警类型',
    dataIndex: 'last_alarm_type',
    key: 'last_alarm_type',
    type: 'tag',
    // customRender: ({ text }) => {
    //   if (!text) return <span>-</span>;
    //   return <Tag color="red" > { text } </Tag>;
    // },
    width: 120,
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
  width: 380,
  ellipsis: true,
  actions: [
    {
      label: '详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label: '编辑',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '快速报修',
      props: { type: 'link', size: 'small', danger: true },
      action: 'repair'
    },
    {
      label: '生成二维码',
      props: { type: 'link', size: 'small' },
      action: 'qrcode'
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
    field: 'equipment_code',
    label: '设备编号',
    type: 'input',
    placeholder: '请输入设备编号',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'name',
    label: '设备名称',
    type: 'input',
    placeholder: '请输入设备名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'department',
    label: '所属部门',
    type: 'select',
    placeholder: '请选择所属部门',
    props: {
      allowClear: true,
      options: [
        { label: '化学合成部', value: '化学合成部' },
        { label: '分析检测部', value: '分析检测部' },
        { label: '安全环保部', value: '安全环保部' },
        { label: '设备维护部', value: '设备维护部' },
        { label: '综合管理部', value: '综合管理部' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'location',
    label: '安装位置',
    type: 'input',
    placeholder: '请输入安装位置',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'equipment_category',
    label: '设备分类',
    type: 'select',
    placeholder: '请选择设备分类',
    props: {
      allowClear: true,
      options: [
        { label: '反应设备', value: '反应设备' },
        { label: '分离设备', value: '分离设备' },
        { label: '分析仪器', value: '分析仪器' },
        { label: '动力设备', value: '动力设备' },
        { label: '辅助设备', value: '辅助设备' }
      ]
    },
    colSpan: 6
  },
  // {
  //   field: 'status',
  //   label: '设备状态',
  //   type: 'select',
  //   placeholder: '请选择设备状态',
  //   props: {
  //     allowClear: true,
  //     options: equipmentStatuses
  //   },
  //   colSpan: 6
  // },
  {
    field: 'equipment_level',
    label: '设备等级',
    type: 'select',
    placeholder: '请选择设备等级',
    props: {
      allowClear: true,
      options: equipmentLevels
    },
    colSpan: 6
  }
]);

// 响应配置
const responseConfig = {
  listKey: 'equipments',
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
    label: '设备名称',
    placeholder: '请输入设备名称',
    required: true,
    rules: [
      { required: true, message: '请输入设备名称', trigger: 'blur' },
      { min: 2, max: 50, message: '设备名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'equipment_code',
    type: 'input',
    label: '设备编号',
    placeholder: '请输入设备编号',
    required: true,
    rules: [
      { required: true, message: '请输入设备编号', trigger: 'blur' },
      { min: 1, max: 50, message: '设备编号长度为1-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'factory_number',
    type: 'input',
    label: '出厂编号',
    placeholder: '请输入出厂编号',
    colSpan: 12
  },
  {
    key: 'model',
    type: 'input',
    label: '型号规格',
    placeholder: '请输入型号规格',
    colSpan: 12
  },
  {
    key: 'department',
    type: 'select',
    label: '所属部门',
    placeholder: '请选择所属部门',
    props: {
      options: [
        { label: '化学合成部', value: '化学合成部' },
        { label: '分析检测部', value: '分析检测部' },
        { label: '安全环保部', value: '安全环保部' },
        { label: '设备维护部', value: '设备维护部' },
        { label: '综合管理部', value: '综合管理部' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择所属部门', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'location',
    type: 'input',
    label: '安装位置',
    placeholder: '请输入安装位置',
    required: true,
    rules: [
      { required: true, message: '请输入安装位置', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'manufacturer',
    type: 'select',
    label: '品牌厂商',
    placeholder: '请选择品牌厂商',
    props: {
      options: manufacturers
    },
    required: true,
    rules: [
      { required: true, message: '请选择品牌厂商', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'supplier',
    type: 'input',
    label: '供应商',
    placeholder: '请输入供应商',
    colSpan: 12
  },
  {
    key: 'purchase_date',
    type: 'datePicker',
    label: '购置日期',
    colSpan: 12
  },
  {
    key: 'use_date',
    type: 'datePicker',
    label: '投入使用日期',
    colSpan: 12
  },
  {
    key: 'expected_life',
    type: 'inputNumber',
    label: '预计使用寿命',
    placeholder: '请输入预计使用寿命',
    props: {
      min: 0,
      max: 50,
      precision: 0,
      formatter: (value) => `${value}年`,
      parser: (value) => value.replace('年', '')
    },
    colSpan: 12
  },
  {
    key: 'original_value',
    type: 'inputNumber',
    label: '原值',
    placeholder: '请输入原值',
    props: {
      min: 0,
      step: 0.1,
      formatter: (value) => `¥${value}万元`,
      parser: (value) => value.replace('¥|万元', '')
    },
    colSpan: 12
  },
  {
    key: 'security_level',
    type: 'select',
    label: '密级',
    placeholder: '请选择密级',
    props: {
      options: [
        { label: '公开', value: '公开' },
        { label: '内部', value: '内部' },
        { label: '秘密', value: '秘密' },
        { label: '机密', value: '机密' },
        { label: '绝密', value: '绝密' }
      ]
    },
    colSpan: 12
  },
  {
    key: 'equipment_type',
    type: 'select',
    label: '设备类型',
    placeholder: '请选择设备类型',
    props: {
      options: [
        { label: '反应釜', value: '反应釜' },
        { label: '离心机', value: '离心机' },
        { label: '蒸馏塔', value: '蒸馏塔' },
        { label: '换热器', value: '换热器' },
        { label: '储罐', value: '储罐' },
        { label: '泵', value: '泵' },
        { label: '压缩机', value: '压缩机' },
        { label: '过滤器', value: '过滤器' },
        { label: '干燥器', value: '干燥器' },
        { label: '分析仪器', value: '分析仪器' },
        { label: '光谱仪', value: '光谱仪' },
        { label: '色谱仪', value: '色谱仪' },
        { label: '质谱仪', value: '质谱仪' },
        { label: '高压液相色谱', value: '高压液相色谱' },
        { label: '核磁共振仪', value: '核磁共振仪' },
        { label: 'X射线衍射仪', value: 'X射线衍射仪' },
        { label: '电子显微镜', value: '电子显微镜' },
        { label: '安全监测设备', value: '安全监测设备' },
        { label: '温控系统', value: '温控系统' },
        { label: '气体处理系统', value: '气体处理系统' },
        { label: '废气处理设备', value: '废气处理设备' },
        { label: '废水处理设备', value: '废水处理设备' },
        { label: '通风系统', value: '通风系统' },
        { label: '防护设备', value: '防护设备' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择设备类型', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'equipment_category',
    type: 'select',
    label: '设备分类',
    placeholder: '请选择设备分类',
    props: {
      options: [
        { label: '反应设备', value: '反应设备' },
        { label: '分离设备', value: '分离设备' },
        { label: '分析仪器', value: '分析仪器' },
        { label: '动力设备', value: '动力设备' },
        { label: '辅助设备', value: '辅助设备' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择设备分类', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'equipment_level',
    type: 'select',
    label: '设备等级',
    placeholder: '请选择设备等级',
    props: {
      options: equipmentLevels
    },
    required: true,
    rules: [
      { required: true, message: '请选择设备等级', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'status',
    type: 'select',
    label: '设备状态',
    placeholder: '请选择设备状态',
    props: {
      options: equipmentStatuses
    },
    required: true,
    rules: [
      { required: true, message: '请选择设备状态', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'health_index',
    type: 'slider',
    label: '健康度指数',
    props: {
      min: 0,
      max: 100,
      marks: { 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }
    },
    required: true,
    rules: [
      { required: true, message: '请设置健康度指数', trigger: 'change' }
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
    ],
    colSpan: 12
  },
  {
    key: 'contact_mediums',
    type: 'select',
    label: '关联危险化学品',
    placeholder: '请选择关联危险化学品',
    props: {
      mode: 'tags',
      options: [
        { label: '盐酸', value: '盐酸' },
        { label: '丙酮', value: '丙酮' },
        { label: '氢氧化钠', value: '氢氧化钠' },
        { label: '乙醇', value: '乙醇' },
        { label: '甲醇', value: '甲醇' },
        { label: '有机溶剂', value: '有机溶剂' },
        { label: '载气', value: '载气' },
        { label: '实验气体', value: '实验气体' },
        { label: '有机溶剂蒸汽', value: '有机溶剂蒸汽' },
        { label: '有机废气', value: '有机废气' },
        { label: '酸性气体', value: '酸性气体' },
        { label: '碱性气体', value: '碱性气体' }
      ]
    },
    colSpan: 24
  },
  {
    key: 'related_processes',
    type: 'select',
    label: '关联工艺流程图或SOP编号',
    placeholder: '请选择关联工艺流程图或SOP编号',
    props: {
      mode: 'tags',
      options: [
        { label: 'SOP-001', value: 'SOP-001' },
        { label: 'SOP-002', value: 'SOP-002' },
        { label: 'SOP-003', value: 'SOP-003' },
        { label: 'SOP-004', value: 'SOP-004' },
        { label: 'SOP-005', value: 'SOP-005' },
        { label: 'SOP-006', value: 'SOP-006' },
        { label: 'SOP-007', value: 'SOP-007' }
      ]
    },
    colSpan: 24
  },
  {
    key: 'last_alarm_time',
    type: 'datePicker',
    label: '最后报警时间',
    colSpan: 12
  },
  {
    key: 'last_alarm_type',
    type: 'input',
    label: '最后报警类型',
    placeholder: '请输入最后报警类型',
    colSpan: 12
  },
  {
    key: 'description',
    type: 'textarea',
    label: '设备描述',
    placeholder: '请输入设备描述',
    props: {
      rows: 4
    },
    required: true,
    rules: [
      { required: true, message: '请输入设备描述', trigger: 'blur' },
      { min: 10, max: 500, message: '设备描述长度为10-500个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'equipmentParameter',
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
    label: '设备名称',
    colSpan: 12
  },
  {
    key: 'equipment_code',
    type: 'text',
    label: '设备编号',
    colSpan: 12
  },
  {
    key: 'factory_number',
    type: 'text',
    label: '出厂编号',
    colSpan: 12
  },
  {
    key: 'model',
    type: 'text',
    label: '型号规格',
    colSpan: 12
  },
  {
    key: 'department',
    type: 'text',
    label: '所属部门',
    colSpan: 12
  },
  {
    key: 'location',
    type: 'text',
    label: '安装位置',
    colSpan: 12
  },
  {
    key: 'manufacturer',
    type: 'text',
    label: '品牌厂商',
    colSpan: 12
  },
  {
    key: 'supplier',
    type: 'text',
    label: '供应商',
    colSpan: 12
  },
  {
    key: 'purchase_date',
    type: 'text',
    label: '购置日期',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD') : '-',
    colSpan: 12
  },
  {
    key: 'use_date',
    type: 'text',
    label: '投入使用日期',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD') : '-',
    colSpan: 12
  },
  {
    key: 'expected_life',
    type: 'text',
    label: '预计使用寿命',
    formatter: (value: number) => value ? `${value}年` : '-',
    colSpan: 12
  },
  {
    key: 'original_value',
    type: 'text',
    label: '原值',
    formatter: (value: number) => value ? `¥${value}万元` : '-',
    colSpan: 12
  },
  {
    key: 'equipment_category',
    type: 'text',
    label: '设备分类',
    colSpan: 12
  },
  {
    key: 'equipment_type',
    type: 'text',
    label: '设备类型',
    colSpan: 12
  },
  {
    key: 'equipment_level',
    type: 'text',
    label: '设备等级',
    colSpan: 12
  },
  {
    key: 'security_level',
    type: 'text',
    label: '密级',
    colSpan: 12
  },
  {
    key: 'status',
    type: 'text',
    label: '设备状态',
    formatter: (value: string) => {
      const status = equipmentStatuses.find(s => s.value === value);
      return status ? `${status.icon} ${status.label}` : value;
    },
    colSpan: 12
  },
  {
    key: 'health_index',
    type: 'text',
    label: '健康度指数',
    formatter: (value: number) => `${value}%`,
    colSpan: 12
  },
  {
    key: 'responsible_person',
    type: 'text',
    label: '责任人',
    colSpan: 12
  },
  {
    key: 'description',
    type: 'text',
    label: '设备描述',
    colSpan: 24
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

// 新增设备参数相关数据
const parameterModalVisible = ref(false);
const parameterModalLoading = ref(false);
const parameterModalTitle = ref('新增设备参数');
const parameterFormRef = ref();

// 设备参数表单状态
const parameterFormState = reactive({
  id: '',
  name: '',
  type: '',
  value: '',
  unit: '',
  status: ''
});

// 设备参数表单配置
const parameterFormSchema = [
  {
    key: 'name',
    type: 'input',
    label: '参数名称',
    placeholder: '请输入参数名称',
    required: true,
    rules: [
      { required: true, message: '请输入参数名称', trigger: 'blur' },
      { min: 2, max: 50, message: '参数名称长度为2-50个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'type',
    type: 'radioGroup',
    label: '参数类型',
    placeholder: '请选择参数类型',
    props: {
      options: [
        { label: '运行参数', value: 'operation' },
        { label: '监测参数', value: 'monitoring' },
        { label: '安全参数', value: 'safety' },
        { label: '控制参数', value: 'control' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择参数类型', trigger: 'change' }
    ]
  },
  {
    key: 'value',
    type: 'input',
    label: '参数值',
    placeholder: '请输入参数值',
    required: true,
    rules: [
      { required: true, message: '请输入参数值', trigger: 'blur' },
    ]
  },
  {
    key: 'unit',
    type: 'input',
    label: '单位',
    placeholder: '请输入单位',
    required: true,
    rules: [
      { required: true, message: '请输入单位', trigger: 'blur' },
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
  }
];

// 显示新增设备参数弹窗
const showAddParameterModal = () => {
  resetParameterForm();
  parameterModalTitle.value = '新增设备参数';
  parameterModalVisible.value = true;
};

// 设备-处理新增或编辑设备参数确认
const handleParameterModalOk = async () => {
  try {
    const valid = await parameterFormRef.value?.validate();
    if (!valid) return;

    if (parameterModalTitle.value === '新增设备参数') {
      // 添加新参数
      const newParameter = {
        ...parameterFormState,
        id: `parameter_${Date.now()}` // 生成唯一ID
      };
      formState.equipmentParameter.push(newParameter);
      message.success('新增设备参数成功');
    } else {
      // 编辑现有参数
      const index = formState.equipmentParameter.findIndex(item => item.id === parameterFormState.id);
      if (index !== -1) {
        formState.equipmentParameter[index] = { ...parameterFormState };
        message.success('编辑设备参数成功');
      } else {
        message.error('未找到要编辑的设备参数');
        return;
      }
    }

    parameterModalVisible.value = false;
    resetParameterForm();
  } catch (error) {
    console.error(error);
    message.error(parameterModalTitle.value === '新增设备参数' ? '新增设备参数失败' : '编辑设备参数失败');
  }
};

// 取消新增或编辑设备参数
const handleParameterModalCancel = () => {
  parameterModalVisible.value = false;
  resetParameterForm();
};

// 重置设备参数表单
const resetParameterForm = () => {
  Object.assign(parameterFormState, {
    id: '',
    name: '',
    type: '',
    value: '',
    unit: '',
    status: ''
  });
};

// 编辑设备参数
const editParameter = (index: number) => {
  const parameter = formState.equipmentParameter[index];
  Object.assign(parameterFormState, { ...parameter });
  parameterModalTitle.value = '编辑设备参数';
  parameterModalVisible.value = true;
};

// 删除设备参数
const deleteParameter = (index: number) => {
  formState.equipmentParameter.splice(index, 1);
  message.success('删除设备参数成功');
};

// 处理设备参数表格操作
const handleParameterAction = (action: string, record: any) => {
  const index = formState.equipmentParameter.findIndex(item => item.id === record.id);
  if (index === -1) {
    message.error('未找到对应的设备参数');
    return;
  }

  switch (action) {
    case 'edit':
      editParameter(index);
      break;
    case 'delete':
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除参数"${record.name}"吗？此操作不可恢复。`,
        onOk: () => {
          deleteParameter(index);
        }
      });
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

// 模拟数据存储 
let equipments = equipmentData


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
  let filteredData = [...equipments];

  // 遍历过滤条件
  Object.keys(rest).forEach(key => {
    if (rest[key]) {
      filteredData = filteredData.filter(item => {
        if (key === 'equipment_code' || key === 'name' || key === 'location') {
          return item[key].includes(rest[key]);
        } else if (key === 'contact_mediums' || key === 'related_processes') {
          // 特殊处理数组字段的过滤
          return Array.isArray(item[key]) && item[key].some(val => val.includes(rest[key]));
        }
        return item[key] === rest[key];
      });
    }
  });

  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);

  return {
    equipments: pagedData,
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
  modalTitle.value = '新增设备';
  resetForm();
  modalVisible.value = true;
};

const editEquipmentFn = (record: Equipment) => {
  modalTitle.value = '编辑设备';
  // 更新表单状态，包括新增的字段
  formState.id = record.id;
  formState.name = record.name;
  formState.equipment_code = record.equipment_code;
  formState.equipment_category = record.equipment_category;
  formState.equipment_type = record.equipment_type;
  formState.equipment_level = record.equipment_level;
  formState.manufacturer = record.manufacturer;
  formState.description = record.description;
  formState.status = record.status;
  formState.health_index = record.health_index || 100;
  formState.department = record.department;
  formState.location = record.location;
  formState.responsible_person = record.responsible_person;
  formState.last_alarm_time = record.last_alarm_time;
  formState.last_alarm_type = record.last_alarm_type;
  // 确保设备参数数据正确回显
  formState.equipmentParameter = record.equipmentParameter ? [...record.equipmentParameter] : [];
  // 添加设备档案相关字段
  formState.factory_number = record.factory_number || '';
  formState.model = record.model || '';
  formState.supplier = record.supplier || '';
  formState.purchase_date = record.purchase_date || '';
  formState.use_date = record.use_date || '';
  formState.expected_life = record.expected_life || 10;
  formState.original_value = record.original_value || 0;
  formState.security_level = record.security_level || '';
  formState.contact_mediums = record.contact_mediums || [];
  formState.related_processes = record.related_processes || [];
  formState.documents = record.documents || [];
  modalVisible.value = true;
};

const showEquipmentDetail = (record: Equipment) => {
  selectedEquipment.value = { ...record };
  detailModalVisible.value = true;
  activeTabKey.value = 'archive'; // 默认显示设备档案标签页
};

const confirmDelete = (record: Equipment) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除设备"${record.name}"吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // 模拟删除操作延迟
        await new Promise(resolve => setTimeout(resolve, 300));

        // 从数组中删除数据
        const index = equipments.findIndex(item => item.id === record.id);
        if (index !== -1) {
          equipments.splice(index, 1);
          message.success('删除设备成功');

          // 重新加载数据
          smartTableRef.value?.refresh();
        } else {
          throw new Error('未找到要删除的设备');
        }
      } catch (error) {
        console.error('删除设备失败:', error);
        message.error('删除设备失败');
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

    if (modalTitle.value === '新增设备') {
      // 新增操作
      const newEquipment: Equipment = {
        id: generateId(),
        name: formData.name,
        equipment_code: formData.equipment_code,
        equipment_category: formData.equipment_category,
        equipment_type: formData.equipment_type,
        equipment_level: formData.equipment_level,
        manufacturer: formData.manufacturer,
        description: formData.description,
        status: formData.status,
        health_index: formData.health_index,
        department: formData.department,
        location: formData.location,
        responsible_person: formData.responsible_person,
        last_alarm_time: formData.last_alarm_time,
        last_alarm_type: formData.last_alarm_type,
        create_time: getCurrentTime(),
        update_time: getCurrentTime(),
        // 添加设备档案相关字段
        factory_number: formData.factory_number,
        model: formData.model,
        supplier: formData.supplier,
        purchase_date: formData.purchase_date,
        use_date: formData.use_date,
        expected_life: formData.expected_life,
        original_value: formData.original_value,
        security_level: formData.security_level,
        contact_mediums: formData.contact_mediums,
        related_processes: formData.related_processes,
        documents: formData.documents,
        equipmentParameter: formData.equipmentParameter,
        // 初始化其他相关数据
        maintenanceRecords: [],
        calibrationRecords: [],
        inspectionRecords: [],
        alarmHistory: [],
        relatedSpares: [],
        relatedDocuments: []
      };

      equipments.unshift(newEquipment);
      message.success('新增设备成功');
    } else {
      // 编辑操作
      const index = equipments.findIndex(item => item.id === formData.id);
      if (index !== -1) {
        equipments[index] = {
          ...equipments[index],
          name: formData.name,
          equipment_code: formData.equipment_code,
          equipment_category: formData.equipment_category,
          equipment_type: formData.equipment_type,
          equipment_level: formData.equipment_level,
          manufacturer: formData.manufacturer,
          description: formData.description,
          status: formData.status,
          health_index: formData.health_index,
          department: formData.department,
          location: formData.location,
          responsible_person: formData.responsible_person,
          last_alarm_time: formData.last_alarm_time,
          last_alarm_type: formData.last_alarm_type,
          update_time: getCurrentTime(),
          // 添加设备档案相关字段
          factory_number: formData.factory_number,
          model: formData.model,
          supplier: formData.supplier,
          purchase_date: formData.purchase_date,
          use_date: formData.use_date,
          expected_life: formData.expected_life,
          original_value: formData.original_value,
          security_level: formData.security_level,
          contact_mediums: formData.contact_mediums,
          related_processes: formData.related_processes,
          documents: formData.documents,
          equipmentParameter: formData.equipmentParameter
        };
        message.success('编辑设备成功');
      } else {
        throw new Error('未找到要编辑的设备');
      }
    }

    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增设备' ? '新增设备失败' : '编辑设备失败');
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
  formState.equipment_code = '';
  formState.equipment_category = '';
  formState.equipment_type = '';
  formState.equipment_level = '';
  formState.manufacturer = '';
  formState.description = '';
  formState.status = '';
  formState.health_index = 100;
  formState.department = '';
  formState.location = '';
  formState.responsible_person = '';
  formState.last_alarm_time = '';
  formState.last_alarm_type = '';
  // 重置设备档案相关字段
  formState.factory_number = '';
  formState.model = '';
  formState.supplier = '';
  formState.purchase_date = '';
  formState.use_date = '';
  formState.expected_life = 10;
  formState.original_value = 0;
  formState.security_level = '';
  formState.contact_mediums = [];
  formState.related_processes = [];
  formState.documents = [];
  formState.equipmentParameter = [];
};

const closeDetailModal = () => {
  detailModalVisible.value = false;
  selectedEquipment.value = {
    id: '',
    name: '',
    equipment_code: '',
    equipment_category: '',
    equipment_type: '',
    equipment_level: '',
    manufacturer: '',
    description: '',
    status: '',
    health_index: 100,
    department: '',
    location: '',
    responsible_person: '',
    last_alarm_time: '',
    last_alarm_type: '',
    factory_number: '',
    model: '',
    supplier: '',
    purchase_date: '',
    use_date: '',
    expected_life: 10,
    original_value: 0,
    security_level: '',
    contact_mediums: [],
    related_processes: [],
    documents: [],
    maintenanceRecords: [],
    calibrationRecords: [],
    inspectionRecords: [],
    alarmHistory: [],
    relatedSpares: [],
    relatedDocuments: []
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
const handleTableAction = (action: string, record: Equipment) => {
  switch (action) {
    case 'edit':
      editEquipmentFn(record);
      break;
    case 'detail':
      showEquipmentDetail(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    case 'repair':
      message.info(`已提交设备 ${record.name} 的报修申请`);
      break;
    case 'qrcode':
      message.info(`已生成设备 ${record.name} 的二维码`);
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
.equipment-container {
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