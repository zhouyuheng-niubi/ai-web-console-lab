<template>
  <div class="emer-drill-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <div class="flex gap-3">
        <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
          <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增演练</span>
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
        共 <span class="font-semibold text-blue-600">{{ emergencyDrillsData.length }}</span> 条演练记录
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

    <!-- 新增/编辑演练弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :width="modalFullscreen ? '100%' : '800px'"
      :confirm-loading="modalLoading"
      :wrap-class-name="modalFullscreen ? 'full-modal' : ''"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <template #title>
        <div class="flex items-center justify-between w-full pr-[20px]">
          <span>{{ modalTitle }}</span>
          <Button type="text" size="small" @click="toggleModalFullscreen" class="flex items-center mt-[-6px] text-[30px]">
            <FullscreenExitOutlined v-if="modalFullscreen" />
            <FullscreenOutlined v-else />
          </Button>
        </div>
      </template>
      <AdvancedForm 
        ref="formRef"
        :schema="formSchema" 
        :model="formState" 
        mode="form"
        formLayout="horizontal"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
      >
        <template #drill_content>
          <Spin :spinning="isFetching" tip="智能分析中..." size="large">
            <template v-if="!isAi">
              <div class="flex mb-[10px]">
                <Button type="primary" size="small" 
                @click="handleAiWrite()">AI写演练</Button>
              </div>
            </template>

            <template v-else>
              <Button type="primary" class="mb-[10px] mr-[10px]" size="small" 
                @click="handleCancelAi()"
              >{{ isAiAnalysisMode ? '取消AI分析' : '取消AI编写' }}</Button>
              <Button @click="refreshAi()" type="primary" size="small" >{{ isAiAnalysisMode ? '重新分析' : '重新编写' }}</Button>
            </template>
            <div v-if="!isAi && modalVisible" class="editor-container">
              <div ref="editorToolbarRef" class="editor-toolbar"></div>
              <div ref="editorRef" class="editor-content" :style="modalFullscreen ? 'min-height: 500px; max-height: 70vh;' : 'min-height: 300px; max-height: 400px;'" style="overflow-y: auto;"></div>
            </div>
            <div ref="aiResponseRef" v-else-if="isAi && modalVisible"
            :class="modalFullscreen ? 'border-[1px] border-[#eee] p-[10px] min-h-[500px] max-h-[75vh] overflow-y-auto' : 'border-[1px] border-[#eee] p-[10px] min-h-[300px] max-h-[520px] overflow-y-auto'"></div>           
          </Spin>
        </template>
      </AdvancedForm>
      <template #footer>
          <Button @click="handleModalCancel">取消</Button>
          <Button type="primary" @click="handleModalOk">确定</Button>
          <Button type="primary" @click="handleDownLoad(formState)">导出</Button>
        </template>
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除演练 "{{ currentDrill?.drill_name }}" 吗？此操作不可恢复。</p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { 
  Button, 
  Modal, 
  message,
  Spin
} from 'ant-design-vue';
import { 
  PlusOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons-vue';
import { createEditor, createToolbar } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import AdvancedForm from '@/components/advancedForm/index.vue';
import type { ExtendedColumnItem } from '@/types/business';
import dayjs from 'dayjs'
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import { useMainStore } from '@/store';
// 定义搜索项类型
interface SearchItem {
  field: string;
  label: string;
  type: string;
  placeholder?: string | string[];
  props?: any;
  colSpan?: number;
}

// 类型定义
interface EmergencyDrill {
  drill_id: string;
  drill_name: string;
  drill_type: string;
  responsible_person: string;
  mobile_phone: string;
  plan_status: string;
  drill_level: string;
  plan_time: [string, string]; // 时间段 [开始时间, 结束时间]
  drill_content?: string; // 演练内容
  plan_attachment?: string | any[];
  update_time?: string;
  create_time?: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const modalFullscreen = ref(false);
const toggleModalFullscreen = () => {
  modalFullscreen.value = !modalFullscreen.value;
};
const deleteModalVisible = ref(false);
const modalTitle = ref('新增演练');
const currentDrill = ref<EmergencyDrill>();
const formRef = ref();
const smartTableRef = ref();
const exportLoading = ref(false);

// AI相关响应式变量
let controller: any = null; // 存储 AbortController
const isAi = ref(false);
const isFetching = ref(false);
const reponseHtml = ref('');
const aiResponseRef = ref<HTMLElement | null>(null);
let currentHtml = '';
const isAiAnalysisMode = ref(false);

// 使用 Shadow DOM 隔离 AI 响应内容的样式
watch(reponseHtml, (newVal) => {
  if (aiResponseRef.value && newVal) {
    const shadowRoot = aiResponseRef.value.shadowRoot || aiResponseRef.value.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = newVal;
  }
});

// WangEditor 配置
const editorRef = ref();
const editorToolbarRef = ref();
let editor = null;
let toolbar = null;
const store = useMainStore();

// 表单状态
const formState = reactive({
  drill_id: '',
  drill_name: '',
  drill_type: '',
  responsible_person: '',
  mobile_phone: '',
  plan_status: '',
  drill_level: '',
  plan_time: [], // 时间段 [开始时间, 结束时间]
  drill_content: '', // 演练内容
  plan_attachment: []
});

// 表格配置
const responseConfig = {
  listKey: 'drills',
  totalKey: 'total',
};

const paginationConfig = {
  pageSize: 5,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
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

// 计划状态选项
const planStatusOptions = [
  { label: '计划中', value: 'planning' },
  { label: '进行中', value: 'in_progress' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
  { label: '延期', value: 'postponed' }
];

// 演练级别选项
const drillLevelOptions = [
  { label: '研究所级', value: 'institute' },
  { label: '部门级', value: 'department' },
  { label: '实验室级', value: 'laboratory' },
  { label: '项目级', value: 'project' }
];

// 表格列配置
const columns: ExtendedColumnItem<EmergencyDrill>[] = [
  {
    title: '演练计划',
    dataIndex: 'drill_name',
    key: 'drill_name',
    width: '200px',
    ellipsis: true,
  },
  {
    title: '演练类型',
    dataIndex: 'drill_type',
    key: 'drill_type',
    width: '140px',
    ellipsis: true,
    type: 'select',
    options: drillTypeOptions
  },
  {
    title: '负责人',
    dataIndex: 'responsible_person',
    key: 'responsible_person',
    width: '100px',
    ellipsis: true,
  },
  {
    title: '移动电话',
    dataIndex: 'mobile_phone',
    key: 'mobile_phone',
    width: '120px',
    ellipsis: true,
  },
  {
    title: '计划状态',
    dataIndex: 'plan_status',
    key: 'plan_status',
    width: '100px',
    ellipsis: true,
    type: 'tag',
    options: [
      { label: '计划中', value: 'planning', color: 'processing' },
      { label: '进行中', value: 'in_progress', color: 'warning' },
      { label: '已完成', value: 'completed', color: 'success' },
      { label: '已取消', value: 'cancelled', color: 'error' },
      { label: '延期', value: 'postponed', color: 'orange' }
    ]
  },
  {
    title: '演练级别',
    dataIndex: 'drill_level',
    key: 'drill_level',
    width: '6%',
    type: 'select',
    options: drillLevelOptions
  },
  {
    title: '计划时间',
    dataIndex: 'plan_time',
    key: 'plan_time',
    width: '300px',
    ellipsis: true,
    formatter: (value: [string, string]) => {
      try {
        if (!value || !Array.isArray(value) || value.length < 2) return '--';
        const [startTime, endTime] = value;
        return startTime && endTime 
          ? `${dayjs(startTime).format('YYYY-MM-DD HH:mm')} ~ ${dayjs(endTime).format('YYYY-MM-DD HH:mm')}`
          : '--';
      } catch (error) {
        return value ? `${value[0]} ~ ${value[1]}` : '--';
      }
    }
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: '200px',
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
    field: 'drill_name',
    label: '演练计划',
    type: 'input',
    placeholder: '请输入演练计划',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'drill_content',
    label: '演练内容',
    type: 'input',
    placeholder: '请输入演练内容',
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
    field: 'responsible_person',
    label: '负责人',
    type: 'input',
    placeholder: '请输入负责人',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'plan_status',
    label: '计划状态',
    type: 'select',
    placeholder: '请选择计划状态',
    props: {
      allowClear: true,
      options: planStatusOptions
    },
    colSpan: 6
  },
  {
    field: 'plan_time',
    label: '计划时间',
    type: 'rangePicker',
    placeholder: ['开始时间', '结束时间'],
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      allowClear: true
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: '360px',
  actions: [
    {
      label: 'AI分析',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'aiAnalysis'
    },
    {
      label: '导出',
      icon: 'ArrowDownOutlined',
      props: { type: 'link', size: 'small' },
      action: 'downLoad'
    },
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
const staticEmergencyDrills: EmergencyDrill[] = [
  {
    drill_id: 'drill001',
    drill_name: '2025年Q1实验室化学品泄漏应急演练',
    drill_type: 'chemical_spill_drill',
    responsible_person: '张建国',
    mobile_phone: '10000000000',
    plan_status: 'completed',
    drill_level: 'institute',
    plan_time: ['2025-03-15 14:00', '2025-03-15 16:00'],
    drill_content: '模拟实验室化学品泄漏事故应急处理流程，包括人员疏散、泄漏控制、应急救援等环节', // 演练内容
    plan_attachment: '',
    update_time: '2025-03-15 16:30:00',
    create_time: '2025-02-20 09:00:00'
  },
  {
    drill_id: 'drill002',
    drill_name: '生物安全三级实验室应急演练',
    drill_type: 'biosafety_drill',
    responsible_person: '李明华',
    mobile_phone: '10000000000',
    plan_status: 'planning',
    drill_level: 'institute',
    plan_time: ['2025-12-20 10:00', '2025-12-20 12:00'],
    drill_content: '模拟生物安全实验室突发安全事故应急处置，包括生物污染控制、人员防护、应急报告等流程', // 演练内容
    plan_attachment: '',
    update_time: '2025-12-01 10:30:00',
    create_time: '2025-11-15 14:00:00'
  },
  {
    drill_id: 'drill003',
    drill_name: '辐射防护应急演练',
    drill_type: 'radiation_protection_drill',
    responsible_person: '王志强',
    mobile_phone: '10000000000',
    plan_status: 'in_progress',
    drill_level: 'department',
    plan_time: ['2025-12-10 09:00', '2025-12-10 11:00'],
    drill_content: '模拟辐射事故应急响应，包括辐射监测、人员撤离、现场管控、辐射源处置等环节', // 演练内容
    plan_attachment: '',
    update_time: '2025-12-02 15:20:00',
    create_time: '2025-11-20 10:00:00'
  },
  {
    drill_id: 'drill004',
    drill_name: '精密仪器设备故障应急演练',
    drill_type: 'special_equipment_drill',
    responsible_person: '赵文博',
    mobile_phone: '10000000000',
    plan_status: 'completed',
    drill_level: 'laboratory',
    plan_time: ['2025-11-25 13:00', '2025-11-25 15:00'],
    drill_content: '模拟精密仪器设备突发故障应急处理，包括故障诊断、应急维修、备用设备启用等流程', // 演练内容
    plan_attachment: '',
    update_time: '2025-11-25 17:00:00',
    create_time: '2025-11-10 08:30:00'
  },
  {
    drill_id: 'drill005',
    drill_name: '综合安全生产事故应急演练',
    drill_type: 'comprehensive_drill',
    responsible_person: '孙德明',
    mobile_phone: '10000000000',
    plan_status: 'planning',
    drill_level: 'institute',
    plan_time: ['2025-12-25 14:00', '2025-12-25 16:00'],
    drill_content: '模拟综合安全生产事故应急响应，涵盖事故报告、应急指挥、人员疏散、现场救援、后期处置等全过程', // 演练内容
    plan_attachment: '',
    update_time: '2025-12-01 09:45:00',
    create_time: '2025-11-25 16:00:00'
  },
  {
    drill_id: 'drill006',
    drill_name: '高压容器安全应急演练',
    drill_type: 'special_equipment_drill',
    responsible_person: 'Maintainer建华',
    mobile_phone: '10000000000',
    plan_status: 'completed',
    drill_level: 'project',
    plan_time: ['2025-10-18 10:30', '2025-10-18 12:30'],
    drill_content: '模拟高压容器突发安全事故应急处置，包括压力释放、泄漏控制、人员防护、设备停运等环节', // 演练内容
    plan_attachment: '',
    update_time: '2025-10-18 12:45:00',
    create_time: '2025-09-25 09:15:00'
  },
  {
    drill_id: 'drill007',
    drill_name: '实验室消防安全专项演练',
    drill_type: 'fire_safety_drill',
    responsible_person: '吴晓明',
    mobile_phone: '10000000000',
    plan_status: 'postponed',
    drill_level: 'department',
    plan_time: ['2025-12-08 15:00', '2025-12-08 17:00'],
    drill_content: '模拟实验室火灾事故应急响应，包括火警报警、人员疏散、初期火灾扑救、消防联动等环节', // 演练内容
    plan_attachment: '',
    update_time: '2025-12-01 11:20:00',
    create_time: '2025-11-05 13:40:00'
  }
];

// 响应式静态数据管理
let emergencyDrillsData: EmergencyDrill[] = [...staticEmergencyDrills];

// API 配置（使用静态数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 过滤数据
  let filteredData = emergencyDrillsData;
  
  if (rest.drill_name) {
    filteredData = filteredData.filter(item => 
      item.drill_name.includes(rest.drill_name)
    );
  }
  
  if (rest.drill_content) {
    filteredData = filteredData.filter(item => 
      item.drill_content && item.drill_content.includes(rest.drill_content)
    );
  }
  
  if (rest.drill_type) {
    filteredData = filteredData.filter(item => 
      item.drill_type === rest.drill_type
    );
  }
  
  if (rest.responsible_person) {
    filteredData = filteredData.filter(item => 
      item.responsible_person.includes(rest.responsible_person)
    );
  }
  
  if (rest.plan_status) {
    filteredData = filteredData.filter(item => 
      item.plan_status === rest.plan_status
    );
  }
  
  // 时间段过滤
  if (rest.plan_time && Array.isArray(rest.plan_time) && rest.plan_time.length === 2) {
    const [startTime, endTime] = rest.plan_time;
    if (startTime && endTime) {
      filteredData = filteredData.filter(item => {
        if (!item.plan_time || !Array.isArray(item.plan_time) || item.plan_time.length < 2) {
          return false;
        }
        const [itemStartTime, itemEndTime] = item.plan_time;
        // 检查时间段是否有重叠
        return itemStartTime <= endTime && itemEndTime >= startTime;
      });
    }
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    drills: pagedData,
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
    key: 'drill_name',
    type: 'input',
    label: '演练计划',
    placeholder: '请输入演练计划',
    required: true,
    rules: [
      { required: true, message: '请输入演练计划', trigger: 'blur' },
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
    key: 'responsible_person',
    type: 'input',
    label: '负责人',
    placeholder: '请输入负责人姓名',
    required: true,
    rules: [
      { required: true, message: '请输入负责人姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'mobile_phone',
    type: 'input',
    label: '移动电话',
    placeholder: '请输入移动电话号码',
    required: true,
    rules: [
      { required: true, message: '请输入移动电话号码', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'plan_status',
    type: 'select',
    label: '计划状态',
    placeholder: '请选择计划状态',
    required: true,
    props: {
      options: planStatusOptions
    },
    rules: [
      { required: true, message: '请选择计划状态', trigger: 'change' },
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
    key: 'plan_time',
    type: 'rangePicker',
    label: '计划时间',
    placeholder: ['开始时间', '结束时间'],
    required: true,
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm'
    },
    rules: [
      { required: true, message: '请选择计划时间', trigger: 'change' },
    ],
    colSpan: 24
  },
  {
    key: 'drill_content',
    type: 'textarea',
    label: '演练内容',
    placeholder: '请输入演练具体内容',
    required: false,
    props: {
      rows: 6,
      // maxLength: 10000,
      showCount: true
    },
    // rules: [
    //   { max: 10000, message: '演练内容不能超过10000个字符', trigger: 'blur' },
    // ],
    colSpan: 24
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
  modalTitle.value = '新增演练';
  resetForm();
  modalVisible.value = true;
};

const editDrillFn = async (record: EmergencyDrill) => {
  try {
    modalTitle.value = '编辑演练';
    formState.drill_id = record.drill_id;
    formState.drill_name = record.drill_name;
    formState.drill_type = record.drill_type;
    formState.responsible_person = record.responsible_person;
    formState.mobile_phone = record.mobile_phone;
    formState.plan_status = record.plan_status;
    formState.drill_level = record.drill_level;
    formState.plan_time = record.plan_time;
    formState.drill_content = record.drill_content || '';
    
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
    console.error('获取演练详情失败:', error);
    message.error('获取演练详情失败');
  }
};

const confirmDelete = (record: EmergencyDrill) => {
  currentDrill.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增演练') {
      // 新增演练操作
      const newDrill: EmergencyDrill = {
        drill_id: `drill${Date.now()}`, // 生成唯一ID
        drill_name: formData.drill_name,
        drill_type: formData.drill_type,
        responsible_person: formData.responsible_person,
        mobile_phone: formData.mobile_phone,
        plan_status: formData.plan_status,
        drill_level: formData.drill_level,
        plan_time: formData.plan_time as [string, string],
        drill_content: formData.drill_content, // 演练内容
        plan_attachment: Array.isArray(formData.plan_attachment) 
          ? formData.plan_attachment.map(file => file.name || file.url).join(',')
          : formData.plan_attachment || '',
        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      
      // 添加到数据数组
      emergencyDrillsData.unshift(newDrill);
      message.success('新增演练成功');
    } else {
      // 编辑演练操作
      const index = emergencyDrillsData.findIndex(item => item.drill_id === formData.drill_id);
      if (index !== -1) {
        emergencyDrillsData[index] = {
          ...emergencyDrillsData[index],
          drill_name: formData.drill_name,
          drill_type: formData.drill_type,
          responsible_person: formData.responsible_person,
          mobile_phone: formData.mobile_phone,
          plan_status: formData.plan_status,
          drill_level: formData.drill_level,
          plan_time: formData.plan_time as [string, string],
          drill_content: formData.drill_content, // 演练内容
          plan_attachment: Array.isArray(formData.plan_attachment) 
            ? formData.plan_attachment.map(file => file.name || file.url).join(',')
            : formData.plan_attachment || '',
          update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
      }
      message.success('编辑演练成功');
    }
    
    modalVisible.value = false;
    isFetching.value = false
    isAi.value = false
    isAiAnalysisMode.value = false
    destroyEditor(); // 销毁编辑器
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增演练' ? '新增演练失败' : '编辑演练失败');
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  if (controller) controller.abort();
  isFetching.value = false;
  isAi.value = false;
  isAiAnalysisMode.value = false; // 重置AI分析模式
  reponseHtml.value = '';
  destroyEditor(); // 销毁编辑器
  resetForm();
};

const handleDelete = async () => {
  try {
    if (!currentDrill.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从数据数组中删除指定记录
    const index = emergencyDrillsData.findIndex(item => item.drill_id === currentDrill.value?.drill_id);
    if (index !== -1) {
      emergencyDrillsData.splice(index, 1);
    }
    
    deleteModalVisible.value = false;
    currentDrill.value = undefined;
    message.success('删除演练成功');
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除演练失败:', error);
    message.error('删除演练失败');
  }
};

// 步骤1：初始化前的HTML预处理（仅保留有效内容，剔除触发解析的空白）
function preprocessHtml(rawHtml) {
    if (!rawHtml) return '';
    // 1. 剔除HTML字符串首尾的所有空白（换行/空格/制表符）
    let processed = rawHtml.trim();
    // 2. 剔除标签之间的无效空白（避免编辑器把标签间空白转p）
    processed = processed.replace(/>\s+</g, '><');
    // 3. 仅保留文本内的单个空格（剔除连续空白，避免触发解析）
    processed = processed.replace(/([^>])\s+([^<])/g, '$1 $2');
    return processed;
}

const initEditor = () => {
  if (editorRef.value && editorToolbarRef.value) {
    // 销毁之前的编辑器实例（如果存在）
    if (editor) {
      editor.destroy();
    }
    if (toolbar) {
      toolbar.destroy();
    }
    
    editor = createEditor({
      selector: editorRef.value,
      html: preprocessHtml(formState.drill_content || ''),
      config: {
          placeholder: '请输入演练内容...',
          autoFocus: false,
          // 内容变化时：仅保留有效内容，不生成空白p
          onChange: (editor) => {
              const html = editor.getHtml();
              const processed = preprocessHtml(html);
              formState.drill_content = processed;
          }
      }
    })

    toolbar = createToolbar({
      editor,
      selector: editorToolbarRef.value,
      config: {
        toolbarKeys: [
          'headerSelect',
          'bold',
          'italic',
          'underline',
          'through',
          'color',
          'bgColor',
          'fontSize',
          'fontFamily',
          'lineHeight',
          'bulletedList',
          'numberedList',
          'todo',
          'emotion',
          'insertLink',
          'uploadVideo',
          'insertTable',
          'codeBlock',
          'divider',
          '|',
          'undo',
          'redo',
          'fullScreen'
        ]
      }
    })
  }
}

const destroyEditor = () => {
  if (editor) {
    editor.destroy()
    editor = null
  }
  if (toolbar) {
    toolbar.destroy()
    toolbar = null
  }
}

watch(modalVisible, (newVal) => {
  if (newVal) {
    // 模态框打开时，稍后初始化编辑器
    setTimeout(() => {
      initEditor();
    }, 100);
  } else {
    // 模态框关闭时，销毁编辑器
    destroyEditor();
  }
});

const resetForm = () => {
  formState.drill_id = '';
  formState.drill_name = '';
  formState.drill_type = '';
  formState.responsible_person = '';
  formState.mobile_phone = '';
  formState.plan_status = '';
  formState.drill_level = '';
  formState.plan_time = [];
  formState.drill_content = '';
  formState.plan_attachment = [];
};

// 获取演练状态对应的显示文本
const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'planning': '计划中',
    'in_progress': '进行中',
    'completed': '已完成',
    'cancelled': '已取消',
    'postponed': '延期'
  };
  return statusMap[status] || status;
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
    const exportData = emergencyDrillsData.map(item => ({
      '演练计划': item.drill_name,
      '演练类型': getDrillTypeText(item.drill_type),
      '负责人': item.responsible_person,
      '移动电话': item.mobile_phone,
      '计划状态': getStatusText(item.plan_status),
      '演练级别': getDrillLevelText(item.drill_level),
      '计划时间': Array.isArray(item.plan_time) && item.plan_time.length === 2 
        ? `${dayjs(item.plan_time[0]).format('YYYY-MM-DD HH:mm')} ~ ${dayjs(item.plan_time[1]).format('YYYY-MM-DD HH:mm')}` 
        : '--',
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
    link.setAttribute('download', `应急演练数据_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success(`成功导出 ${emergencyDrillsData.length} 条演练数据`);
  } catch (error) {
    console.error('导出数据失败:', error);
    message.error('导出数据失败');
  } finally {
    exportLoading.value = false;
  }
};

// AI写演练相关方法
const handleCancelAi = () => {
  if (controller) {
    controller.abort();
    isFetching.value = false;
    isAi.value = false;
    isAiAnalysisMode.value = false; // 重置AI分析模式
    reponseHtml.value = '';
    formState.drill_content = currentHtml;
  }
};

const refreshAi = () => {
  if (controller) {
    controller.abort();
    isFetching.value = false;
    reponseHtml.value = '';
    handleAi();
  }
};

const handleAiWrite = async () => {
  isAiAnalysisMode.value = false; // 设置为写演练模式
  handleAi();
};

const handleAi = async () => {
  let reader = null;
  const drillTypeText = drillTypeOptions.find(item => item.value === formState.drill_type)?.label;
  const drill_level_name = drillLevelOptions.find(item => item.value === formState.drill_level)?.label;
  if (!formState.drill_name) return message.info('请输入演练计划');
  if (!drillTypeText) return message.info('请选择演练类型');
  if( !drill_level_name) return message.info('请选择演练级别');
  if(formState.plan_time?.length !== 2) return message.info('请选择计划时间');

  try {
    isAi.value = true;
    isFetching.value = true;
    
    let promptMessage = '';
    if (isAiAnalysisMode.value) {
      // AI分析模式：对现有演练内容进行分析和改进建议
      promptMessage = `
        请对以下演练内容进行分析并提出改进意见：
        演练计划：${formState.drill_name}
        演练类型：${drillTypeText}
        演练级别：${drill_level_name}
        企业性质：化工材料研究所安全生产企业
        当前内容：${formState.drill_content}
        演练计划时间：${formState.plan_time[0]} 至 ${formState.plan_time[1]}
        请从专业角度分析该演练的完整性、可操作性、覆盖范围等方面，并提出具体的改进建议和补充内容。
        请使用HTML格式输出分析结果和建议，确保格式规范，使用适当的标题和段落标签。
      `;
    } else {
      // AI写演练模式：根据演练计划和类型生成新的演练内容
      promptMessage = `
        请生成一份演练计划为：${formState.drill_name}，
        演练类型为：${drillTypeText}，
        演练计划时间：${formState.plan_time[0]} 至 ${formState.plan_time[1]}
        演练级别：${drill_level_name}
        企业性质：${store.companyInfo.name || '化工材料研究所安全生产企业'}
        演练内容：
        ## 格式规范及强制自验证要求
        ### （一）格式规范细则
        1. 标题层级格式：
            报告标题:字体采用黑体加粗，必须居中显示
          - 一级标题：段前段后各1行，左对齐；
          - 二级标题：段前段后各0.5行，左对齐；
          - 三级标题：左对齐，段前段后各0.5行（与正文段落间距保持一致）；
          - 四级标题：首行缩进2字符，加粗，左对齐，段前段后各0.5行。
        2. 文档整体格式：
          - 中文字体：宋体；西文/数字字体：Times New Roman；
          - 正文字号：小四（12pt）；行距：1.5倍；
          - 段落间距：段前0.5行，段后0.5行；
          - 对齐方式：全文两端对齐（标题、报告日期除外，按对应要求对齐）；
          - 段落首行缩进：2字符（标题、报告日期、表格内容除外）。
        3. 其他规则：
          - 报告结尾：禁止出现报告单位、"以上报告"等收尾表述；
        ### （二）AI自验证强制流程
        生成报告后，需按以下步骤自动校验格式，确保完全符合要求，未通过校验需重新调整：
        1. 标签校验：检查报告标题是否用'<p>'标签包裹且居中，无多余标签或缺失标签；
        2. 标题层级校验：逐一核对各级标题的字体、字号、加粗状态、对齐方式及段前段后间距，确保与对应层级要求一致；
        3. 文本格式校验：
          - 随机抽取3处正文段落，检查字体、字号、行距、段落间距、首行缩进及对齐方式是否符合规范；
          - 检查所有西文/数字（如日期、气温、数量等）是否使用Times New Roman字体；
        4. 特殊内容校验：
          - 确认报告日期格式正确，无格式错误；
          - 检查报告结尾是否无违规收尾表述；
        5. 整体兼容性校验：确保HTML代码可直接在Word中打开，格式不错乱（核心校验标签使用、样式设置的规范性，避免出现Word不兼容的代码；
        ## 三、输出要求
        最终以HTML格式输出完整报告，输出内容仅包含HTML代码,关于style绑定的属性样式都有添加!important，无任何格式说明、注释等额外文字，确保代码可直接复制使用且格式100%符合上述规范。
      `;
    }
    
    const response = await getAiData(promptMessage);
    if (!response) {
      isFetching.value = false;
      isAi.value = false;
      return;
    }
    
    currentHtml = formState.drill_content;
    reponseHtml.value = '';
    reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      while (true) {
        const lineEnd = buffer.indexOf('\n');
        if (lineEnd === -1) break;
        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 1);
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            isFetching.value = false;
            isAi.value = true;
            formState.drill_content = reponseHtml.value;
            break;
          }
          try {
            const parsed = JSON.parse(data);
            const extra = parsed.choices[0]?.delta?.extra;
            if (extra) {
              console.log(extra);
              continue;
            }
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              if (content != null) {
                isFetching.value = false;
                reponseHtml.value += content;
              }
            }
          } catch (error) {
            
          }
        }
      }
    }
  } catch (error) {
    console.error('AI处理错误:', error);
  }
};

const getAiData = async (messages: string) => {
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();
  try {
    const response = await fetch(
        `${import.meta.env.VITE_NEWAI_API}/ai/chat/jaa`,
        {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: messages
              }
            ],
          }),
          signal: controller.signal,
        },
      )
      return response;
    }
   catch (error) {
      // 如果是中止错误，不抛出异常
      if (error.name === 'AbortError') {
        console.log('请求被用户取消');
        return null;
      }
      throw error;
    }
}

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
  // 可以在这里添加数据统计逻辑
  const totalCount = data.length;
  const completedCount = data.filter(item => item.plan_status === 'completed').length;
  const inProgressCount = data.filter(item => item.plan_status === 'in_progress').length;
  const planningCount = data.filter(item => item.plan_status === 'planning').length;
  
  console.log(`数据统计: 总计 ${totalCount} 条，已完成 ${completedCount} 条，进行中 ${inProgressCount} 条，计划中 ${planningCount} 条`);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

// 操作列事件处理
const handleAction = (action: string, record: EmergencyDrill, index: number) => {
  switch (action) {
    case 'edit':
      if (record) {
        editDrillFn(record);
      }
      break;
    case 'delete':
      if (record) {
        confirmDelete(record);
      }
      break;
    case 'aiAnalysis':
      if (record) {
        editDrillFn(record);
        setTimeout(() => {
          isAiAnalysisMode.value = true; // 设置为AI分析模式
          handleAi();
        }, 100);
      }
      break;
      case 'downLoad':
      handleDownLoad(record)
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

const handleDownLoad = (record: any) => {
  const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
        xmlns:w="urn:schemas-microsoft-com:office:word" 
        xmlns="http://www.w3.org/TR/REC-html40">
         <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: "仿宋_GB2312", "FangSong_GB2312", serif;
                    font-size: 16pt;
                }
                h1 {
                    font-family: "黑体", "SimHei", sans-serif;
                    font-size: 16pt;
                    font-weight: bold;
                    text-align: center;
                    line-height: 40px;
                    margin-bottom: 20px;
                }
                h2 {
                    font-family: "黑体", "SimHei", sans-serif;
                    font-size: 16pt;
                    font-weight: bold;
                    text-align: left;
                    line-height: 40px;
                    margin-bottom: 20px;
                    margin-top: 30px;
                }
                p {
                    font-family: "仿宋_GB2312", "FangSong_GB2312", serif;
                    font-size: 16pt;
                    text-align: justify;
                    text-justify: inter-ideograph;
                    text-indent: 2em;
                    line-height: 40px;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
          ${record.drill_content}
        </body>
      </html>
    `;
  // 转换为Word文档并下载
  asBlob(html).then((res: any) => {
    saveAs(
      new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      `${record.drill_name}${isAiAnalysisMode.value?'（分析报告）':''}${dayjs().format('YYYY-MM-DD HH:mm:ss')}.docx`,
    );
  });
}


onMounted(() => {
  // 页面初始化逻辑
});
</script>

<style scoped>
.emer-drill-container {
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

:deep(.full-modal) .ant-modal {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}

:deep(.full-modal) .ant-modal-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
}

:deep(.full-modal) .ant-modal-body {
  flex: 1;
}

.editor-container {
  border: 1px solid #ccc;
}

.editor-toolbar {
  border-bottom: 1px solid #ccc;
}

.editor-content {
  overflow-y: auto;
}
</style>