<template>
  <div class="emer-expert-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="leading-none ml-1">新增专家</span>
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

    <!-- 新增/编辑专家弹窗 -->
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
      />
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除应急专家 "{{ currentExpert?.name }}" 吗？此操作不可恢复。</p>
    </Modal>

    <!-- 新增/编辑评估记录弹窗 -->
    <Modal 
      v-model:open="evaluationRecordFormModalVisible" 
      :title="evaluationRecordModalTitle"
      width="600px"
      :confirm-loading="evaluationRecordModalLoading"
      @ok="handleEvaluationRecordModalOk"
      @cancel="handleEvaluationRecordModalCancel"
    >
      <AdvancedForm 
        ref="evaluationRecordFormRef"
        :schema="evaluationRecordFormSchema" 
        :model="evaluationRecordFormState" 
        mode="form"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { 
  Button, 
  Modal, 
  message
} from 'ant-design-vue';
import { 
  PlusOutlined
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
import SmartTable from '@/components/smartTable/index.vue';
// 引入 smartTable 组件需要的类型
import type { ExtendedColumnItem, ActionColumn } from '@/types/business';
import dayjs from 'dayjs'

// 定义搜索项类型
interface SearchItem {
  field: string;
  label: string;
  type: "number" | "month" | "year" | "date" | "week" | "quarter" | "input" | "select" | "switch" | "checkbox" | "radio" | "date-range";
  placeholder?: string;
  props?: any;
  colSpan?: number;
}

// 类型定义
interface EmergencyExpert {
  expert_id: string;
  name: string;
  gender: string;
  major: string;
  business_area: string;
  mobile: string;
  company: string;
  evaluation_result: string;
  evaluation_time?: string;
  update_time?: string;
  create_time?: string;
}

// 评估记录类型定义
interface EvaluationRecord {
  id: string;
  serial_number: number;
  content: string;
  result: string;
  date: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const evaluationRecordModalVisible = ref(false);
const evaluationRecordFormModalVisible = ref(false);
const evaluationRecordModalLoading = ref(false);
const modalTitle = ref('新增专家');
const evaluationRecordModalTitle = ref('新增评估记录');
const currentExpert = ref<EmergencyExpert>();
const formRef = ref();
const evaluationRecordFormRef = ref();
const smartTableRef = ref();
const evaluationRecordTableRef = ref();

// 评估记录数据
const evaluationRecords = ref<EvaluationRecord[]>([]);
const evaluationRecordPagination = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
};

// 表单状态
const formState = reactive({
  expert_id: '',
  name: '',
  gender: '',
  major: '',
  business_area: '',
  mobile: '',
  company: '',
  evaluation_result: ''
});

// 评估记录表单状态
const evaluationRecordFormState = reactive({
  id: '',
  serial_number: 0,
  content: '',
  result: '',
  date: ''
});

// 表格配置
const responseConfig = {
  listKey: 'experts',
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
const columns: ExtendedColumnItem<EmergencyExpert>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    width: '5%'
  },
  {
    title: '专业',
    dataIndex: 'major',
    key: 'major',
    width: '7%'
  },
  {
    title: '业务领域',
    dataIndex: 'business_area',
    key: 'business_area',
    width: '8%'
  },
  {
    title: '移动电话',
    dataIndex: 'mobile',
    key: 'mobile',
    width: '10%'
  },
  {
    title: '工作单位',
    dataIndex: 'company',
    key: 'company',
    width: '12%'
  },
  {
    title: '评估结果',
    dataIndex: 'evaluation_result',
    key: 'evaluation_result',
    width: '7%'
  },
  {
    title: '评估时间',
    dataIndex: 'evaluation_time',
    key: 'evaluation_time',
    width: '12%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: '12%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
];

// 评估记录表格列配置
const evaluationRecordColumns: ExtendedColumnItem<EvaluationRecord>[] = [
  {
    title: '序号',
    dataIndex: 'serial_number',
    key: 'serial_number',
    width: '10%'
  },
  {
    title: '评估内容',
    dataIndex: 'content',
    key: 'content',
    width: '35%'
  },
  {
    title: '评估结果',
    dataIndex: 'result',
    key: 'result',
    width: '15%'
  },
  {
    title: '评估日期',
    dataIndex: 'date',
    key: 'date',
    width: '25%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
];

const recordActions: ActionColumn = {
  title: '操作',
  key: 'action',
  width: 150,
  fixed: 'right',
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
}

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '请输入姓名',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'gender',
    label: '性别',
    type: 'radio',
    placeholder: '请选择性别',
    props: {
      allowClear: true,
      options: [
        { label: '男', value: '男' },
        { label: '女', value: '女' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'major',
    label: '专业',
    type: 'input',
    placeholder: '请输入专业',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'business_area',
    label: '业务领域',
    type: 'input',
    placeholder: '请输入业务领域',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'company',
    label: '工作单位',
    type: 'input',
    placeholder: '请输入工作单位',
    props: {
      allowClear: true
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn: ActionColumn = {
  title: '操作',
  width: '150px',
  fixed: 'right',
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
let emergencyExperts: EmergencyExpert[] = [
  {
    expert_id: 'expert001',
    name: '张三',
    gender: '男',
    major: '安全工程',
    business_area: '化工安全',
    mobile: '10000000000',
    company: '国家安全科学研究院',
    evaluation_result: '优秀',
    evaluation_time: '2025-12-01 10:30:00',
    update_time: '2025-12-01 10:30:00',
    create_time: '2024-11-01 09:00:00'
  },
  {
    expert_id: 'expert002',
    name: '李四',
    gender: '女',
    major: '应急管理',
    business_area: '公共卫生事件',
    mobile: '10000000000',
    company: '国家应急研究院',
    evaluation_result: '良好',
    evaluation_time: '2025-12-01 11:15:00',
    update_time: '2025-12-01 11:15:00',
    create_time: '2024-11-02 10:00:00'
  },
  {
    expert_id: 'expert003',
    name: '王五',
    gender: '男',
    major: '消防工程',
    business_area: '消防安全',
    mobile: '10000000000',
    company: '消防科学研究院',
    evaluation_result: '优秀',
    evaluation_time: '2025-12-01 09:45:00',
    update_time: '2025-12-01 09:45:00',
    create_time: '2024-11-03 14:00:00'
  }
];

// 模拟评估记录数据
const mockEvaluationRecords: Record<string, EvaluationRecord[]> = {
  'expert001': [
    {
      id: 'record001',
      serial_number: 1,
      content: '化工安全风险评估',
      result: '优秀',
      date: '2025-11-15 09:30:00'
    },
    {
      id: 'record002',
      serial_number: 2,
      content: '危险品存储安全检查',
      result: '良好',
      date: '2025-10-20 14:15:00'
    },
    {
      id: 'record003',
      serial_number: 3,
      content: '应急预案有效性评估',
      result: '优秀',
      date: '2025-09-05 11:20:00'
    }
  ],
  'expert002': [
    {
      id: 'record004',
      serial_number: 1,
      content: '公共卫生事件应对能力评估',
      result: '良好',
      date: '2025-11-10 10:00:00'
    },
    {
      id: 'record005',
      serial_number: 2,
      content: '疫情防护措施有效性评估',
      result: '优秀',
      date: '2025-08-15 16:30:00'
    }
  ],
  'expert003': [
    {
      id: 'record006',
      serial_number: 1,
      content: '建筑消防设施检测',
      result: '优秀',
      date: '2025-12-01 09:45:00'
    },
    {
      id: 'record007',
      serial_number: 2,
      content: '消防应急预案演练评估',
      result: '良好',
      date: '2025-11-05 13:20:00'
    },
    {
      id: 'record008',
      serial_number: 3,
      content: '人员消防安全培训效果评估',
      result: '优秀',
      date: '2025-10-12 15:45:00'
    },
    {
      id: 'record009',
      serial_number: 4,
      content: '消防设备维护情况检查',
      result: '合格',
      date: '2025-09-18 11:10:00'
    }
  ]
};

// 评估记录表单配置
const evaluationRecordFormSchema = [
  {
    key: 'content',
    type: 'textarea',
    label: '评估内容',
    placeholder: '请输入评估内容',
    required: true,
    props: {
      rows: 4
    },
    rules: [
      { required: true, message: '请输入评估内容', trigger: 'blur' },
      { min: 5, max: 500, message: '评估内容长度为5-500个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'result',
    type: 'select',
    label: '评估结果',
    placeholder: '请选择评估结果',
    props: {
      options: [
        { label: '优秀', value: '优秀' },
        { label: '良好', value: '良好' },
        { label: '合格', value: '合格' },
        { label: '不合格', value: '不合格' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择评估结果', trigger: 'change' }
    ]
  },
  {
    key: 'date',
    type: 'datePicker',
    label: '评估日期',
    placeholder: '请选择评估日期',
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss'
    },
    required: true,
    rules: [
      { required: true, message: '请选择评估日期', trigger: 'change' }
    ]
  }
];

// 生成唯一ID
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `expert${timestamp}${random}`;
};

// 生成评估记录ID
const generateRecordId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `record${timestamp}${random}`;
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
  let filteredData = [...emergencyExperts];
  
  if (rest.name) {
    filteredData = filteredData.filter(item => 
      item.name.includes(rest.name)
    );
  }
  
  if (rest.gender) {
    filteredData = filteredData.filter(item => 
      item.gender === rest.gender
    );
  }
  
  if (rest.major) {
    filteredData = filteredData.filter(item => 
      item.major.includes(rest.major)
    );
  }
  
  if (rest.business_area) {
    filteredData = filteredData.filter(item => 
      item.business_area.includes(rest.business_area)
    );
  }
  
  if (rest.company) {
    filteredData = filteredData.filter(item => 
      item.company.includes(rest.company)
    );
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    experts: pagedData,
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
    key: 'name',
    type: 'input',
    label: '姓名',
    placeholder: '请输入姓名',
    required: true,
    rules: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'gender',
    type: 'radioGroup',
    label: '性别',
    required: true,
    props: {
      options: [
        { label: '男', value: '男' },
        { label: '女', value: '女' }
      ]
    },
    rules: [
      { required: true, message: '请选择性别', trigger: 'change' }
    ]
  },
  {
    key: 'major',
    type: 'input',
    label: '专业',
    placeholder: '请输入专业',
    required: true,
    rules: [
      { required: true, message: '请输入专业', trigger: 'blur' },
      { min: 2, max: 50, message: '专业长度为2-50个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'business_area',
    type: 'input',
    label: '业务领域',
    placeholder: '请输入业务领域',
    required: true,
    rules: [
      { required: true, message: '请输入业务领域', trigger: 'blur' },
      { min: 2, max: 100, message: '业务领域长度为2-100个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'mobile',
    type: 'input',
    label: '移动电话',
    placeholder: '请输入移动电话',
    required: true,
    rules: [
      { required: true, message: '请输入移动电话', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
  },
  {
    key: 'company',
    type: 'input',
    label: '工作单位',
    placeholder: '请输入工作单位',
    required: true,
    rules: [
      { required: true, message: '请输入工作单位', trigger: 'blur' },
      { min: 2, max: 100, message: '工作单位长度为2-100个字符', trigger: 'blur' },
    ]
  },
  {
    key: 'evaluation_result',
    type: 'select',
    label: '评估结果',
    placeholder: '请选择评估结果',
    props: {
      options: [
        { label: '优秀', value: '优秀' },
        { label: '良好', value: '良好' },
        { label: '合格', value: '合格' },
        { label: '不合格', value: '不合格' }
      ]
    },
    required: true,
    rules: [
      { required: true, message: '请选择评估结果', trigger: 'change' }
    ]
  }
];

// 方法
const showAddModal = () => {
  modalTitle.value = '新增专家';
  resetForm();
  modalVisible.value = true;
};

const editExpertFn = async (record: EmergencyExpert) => {
  try {
    modalTitle.value = '编辑专家';
    formState.expert_id = record.expert_id;
    formState.name = record.name;
    formState.gender = record.gender;
    formState.major = record.major;
    formState.business_area = record.business_area;
    formState.mobile = record.mobile;
    formState.company = record.company;
    formState.evaluation_result = record.evaluation_result;

    modalVisible.value = true;
  } catch (error) {
    console.error('获取专家详情失败:', error);
    message.error('获取专家详情失败');
  }
};


const confirmDeleteEvaluationRecord = (record: EvaluationRecord) => {
  // 确认删除评估记录
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除评估记录 "${record.content}" 吗？此操作不可恢复。`,
    onOk: () => {
      // 从数组中删除数据
      const index = evaluationRecords.value.findIndex(item => item.id === record.id);
      if (index !== -1) {
        evaluationRecords.value.splice(index, 1);
        // 更新序号
        evaluationRecords.value.forEach((item, idx) => {
          item.serial_number = idx + 1;
        });
        message.success('删除评估记录成功');
      }
    }
  });
};

const confirmDelete = (record: EmergencyExpert) => {
  currentExpert.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增专家') {
      // 新增操作
      const newExpert: EmergencyExpert = {
        expert_id: generateId(),
        name: formData.name,
        gender: formData.gender,
        major: formData.major,
        business_area: formData.business_area,
        mobile: formData.mobile,
        company: formData.company,
        evaluation_result: formData.evaluation_result,
        evaluation_time: getCurrentTime(),
        create_time: getCurrentTime(),
        update_time: getCurrentTime()
      };
      
      emergencyExperts.unshift(newExpert);
      message.success('新增专家成功');
    } else {
      // 编辑操作
      const index = emergencyExperts.findIndex(item => item.expert_id === formData.expert_id);
      if (index !== -1) {
        emergencyExperts[index] = {
          ...emergencyExperts[index],
          name: formData.name,
          gender: formData.gender,
          major: formData.major,
          business_area: formData.business_area,
          mobile: formData.mobile,
          company: formData.company,
          evaluation_result: formData.evaluation_result,
          evaluation_time: getCurrentTime(),
          update_time: getCurrentTime()
        };
        message.success('编辑专家成功');
      } else {
        throw new Error('未找到要编辑的专家');
      }
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增专家' ? '新增专家失败' : '编辑专家失败');
  } finally {
    modalLoading.value = false;
  }
};

const handleEvaluationRecordModalOk = async () => {
  try {
    await evaluationRecordFormRef.value?.validate();
    evaluationRecordModalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...evaluationRecordFormState };
    
    if (evaluationRecordModalTitle.value === '新增评估记录') {
      // 新增操作
      const maxSerialNumber = evaluationRecords.value.reduce((max, item) => 
        item.serial_number > max ? item.serial_number : max, 0);
      
      const newRecord: EvaluationRecord = {
        id: generateRecordId(),
        serial_number: maxSerialNumber + 1,
        content: formData.content,
        result: formData.result,
        date: formData.date || getCurrentTime()
      };
      
      evaluationRecords.value.push(newRecord);
      message.success('新增评估记录成功');
    } else {
      // 编辑操作
      const index = evaluationRecords.value.findIndex(item => item.id === formData.id);
      if (index !== -1) {
        evaluationRecords.value[index] = {
          ...evaluationRecords.value[index],
          content: formData.content,
          result: formData.result,
          date: formData.date || getCurrentTime()
        };
        message.success('编辑评估记录成功');
      } else {
        throw new Error('未找到要编辑的评估记录');
      }
    }
    
    evaluationRecordFormModalVisible.value = false;
    resetEvaluationRecordForm();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(evaluationRecordModalTitle.value === '新增评估记录' ? '新增评估记录失败' : '编辑评估记录失败');
  } finally {
    evaluationRecordModalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

const handleEvaluationRecordModalCancel = () => {
  evaluationRecordFormModalVisible.value = false;
  resetEvaluationRecordForm();
};

const handleDelete = async () => {
  try {
    if (!currentExpert.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从数组中删除数据
    const index = emergencyExperts.findIndex(item => item.expert_id === currentExpert.value?.expert_id);
    if (index !== -1) {
      emergencyExperts.splice(index, 1);
      message.success('删除专家成功');
    } else {
      throw new Error('未找到要删除的专家');
    }
    
    deleteModalVisible.value = false;
    currentExpert.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除专家失败:', error);
    message.error('删除专家失败');
  }
};

const resetForm = () => {
  formState.expert_id = '';
  formState.name = '';
  formState.gender = '';
  formState.major = '';
  formState.business_area = '';
  formState.mobile = '';
  formState.company = '';
  formState.evaluation_result = '';
};

const resetEvaluationRecordForm = () => {
  evaluationRecordFormState.id = '';
  evaluationRecordFormState.serial_number = 0;
  evaluationRecordFormState.content = '';
  evaluationRecordFormState.result = '';
  evaluationRecordFormState.date = '';
};

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

// 专家列表操作列事件处理
const handleAction = (action: string, record: EmergencyExpert, index: number) => {
  switch (action) {
    case 'edit':
      editExpertFn(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

</script>

<style scoped>
.emer-expert-container {
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

.evaluation-record-content {
  max-height: 500px;
  overflow-y: auto;
}
</style>