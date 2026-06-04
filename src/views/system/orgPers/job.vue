<template>
  <div class="job-management-container p-[16px] flex flex-col overflow-hidden box-border"
    style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <div class="flex items-center">
        <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
          <span class="flex items-center">
            <PlusOutlined />
            <span class="ml-1 leading-none">新增职务</span>
          </span>
        </Button>
        <Button class="ml-[16px]" @click="showCategoryModal" style="border-color: #4362EF; color: #4362EF;">
          <span class="flex items-center">
            <FolderOpenOutlined />
            <span class="ml-1 leading-none">职务分类管理</span>
          </span>
        </Button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
      <SmartTable ref="smartTableRef" :api="apiConfig" :columns="columns" :search-config="searchConfig"
        :responseConfig="responseConfig" :pagination="paginationConfig" :paramsFormatter="paramsFormatter"
        searchLayout="horizontal" @loadSuccess="handleLoadSuccess" @loadError="handleLoadError"
        :searchButtonWrapperSpan="6" :immediateSearch="true" :actionColumn="actionColumn" @action="handleTableAction">
      </SmartTable>
    </div>

    <!-- 新增/编辑职务弹窗 -->
    <Modal v-model:open="modalVisible" :title="modalTitle" width="1000px" :confirm-loading="modalLoading"
      @ok="handleModalOk" @cancel="handleModalCancel">
      <Tabs v-model:activeKey="activeTab">
        <!-- 基本信息 -->
        <TabPane key="basic" tab="基本信息">
          <AdvancedForm ref="formRef" :schema="basicFormSchema" :model="formState" mode="form" formLayout="horizontal"
            :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
          </AdvancedForm>
        </TabPane>

        <!-- 岗位职责 -->
        <TabPane key="duty" tab="职务职责">
          <AdvancedForm ref="dutyFormRef" :schema="dutyFormSchema" :model="dutyFormState" mode="form"
            formLayout="horizontal" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
          </AdvancedForm>
        </TabPane>

        <!-- 权限配置 -->
        <TabPane key="permission" tab="权限配置">
          <AdvancedForm ref="permissionFormRef" :schema="permissionFormSchema" :model="permissionFormState" mode="form"
            formLayout="horizontal" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
          </AdvancedForm>
        </TabPane>

        <!-- 任职资格 -->
        <TabPane key="qualification" tab="任职资格">
          <AdvancedForm ref="qualificationFormRef" :schema="qualificationFormSchema" :model="qualificationFormState"
            mode="form" formLayout="horizontal" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
          </AdvancedForm>
        </TabPane>

        <!-- 风险评估 -->
        <TabPane key="risk" tab="风险评估">
          <AdvancedForm ref="riskFormRef" :schema="riskFormSchema" :model="riskFormState" mode="form"
            formLayout="horizontal" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
          </AdvancedForm>
        </TabPane>
      </Tabs>
    </Modal>

    <!-- 职务分类管理弹窗 -->
    <Modal v-model:open="categoryModalVisible" title="职务分类管理" width="800px" @ok="handleCategoryModalOk"
      @cancel="handleCategoryModalCancel">
      <div class="mb-[16px]">
        <Button type="primary" style="background-color: #4362EF;" @click="addCategory">
          <span class="flex items-center">
            <PlusOutlined />
            <span class="ml-1 leading-none">新增职务类别</span>
          </span>
        </Button>
      </div>

      <div class="space-y-4">
        <div v-for="(category, index) in categoryList" :key="index" class="border rounded p-[16px]">
          <div class="flex justify-between items-center mb-[8px]">
            <h3 class="text-lg font-semibold">{{ category.name }}</h3>
            <Button type="link" danger @click="removeCategory(index)">
              <DeleteOutlined />
            </Button>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div v-for="(position, posIndex) in category.positions" :key="posIndex" class="flex items-center">
              <Input v-model:value="position.name" placeholder="请输入职务名称" />
              <Button type="link" danger class="ml-[8px]" @click="removePositionFromCategory(category, posIndex)">
                <DeleteOutlined />
              </Button>
            </div>
          </div>

          <div class="mt-[8px]">
            <Button size="small" @click="addPositionToCategory(category)">
              <PlusOutlined />
              添加职务
            </Button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- 职务详情弹窗 -->
    <Modal v-model:open="detailModalVisible" title="职务详情" width="1000px" :footer="null" @cancel="closeDetailModal">
      <Tabs v-model:activeKey="detailActiveTab">
        <!-- 基本信息 -->
        <TabPane key="basic" tab="基本信息">
          <AdvancedForm :schema="basicDetailSchema" :model="selectedJob" mode="descriptions" />
        </TabPane>

        <!-- 岗位职责 -->
        <TabPane key="duty" tab="职务职责">
          <AdvancedForm :schema="dutyDetailSchema" :model="selectedJob" mode="descriptions" />
        </TabPane>

        <!-- 权限配置 -->
        <TabPane key="permission" tab="权限配置">
          <AdvancedForm :schema="permissionDetailSchema" :model="selectedJob" mode="descriptions" />
        </TabPane>

        <!-- 任职资格 -->
        <TabPane key="qualification" tab="任职资格">
          <AdvancedForm :schema="qualificationDetailSchema" :model="selectedJob" mode="descriptions" />
        </TabPane>

        <!-- 风险评估 -->
        <TabPane key="risk" tab="风险评估">
          <AdvancedForm :schema="riskDetailSchema" :model="selectedJob" mode="descriptions" />
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
  Tabs,
  TabPane,
  Input
} from 'ant-design-vue';
import { PlusOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import AdvancedForm from '@/components/advancedForm/index.vue';

// 定义职务类型
interface Job {
  id: string;
  code: string;
  name: string;
  category: string;
  standardCount: number;
  responsibilities: string;
  safetyDuties: string;
  emergencyDuties: string;
  systemPermissions: string;
  dataPermissions: string;
  approvalPermissions: string;
  educationRequirements: string;
  experienceRequirements: string;
  qualificationRequirements: string;
  safetyTrainingRequirements: string;
  riskLevel: number;
  chemicalHandling: boolean;
  specialEquipment: boolean;
  maxExperimentScale: string;
  securityLevel: string; // 密级要求
  dualPersonRequired: boolean; // 是否必需双人担任
  status: string;
  create_time?: string;
  update_time?: string;
}

// 定义职务类别类型
interface JobCategory {
  id: string;
  name: string;
  positions: { id: string, name: string }[];
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const detailModalVisible = ref(false);
const categoryModalVisible = ref(false);
const modalTitle = ref('新增职务');
const smartTableRef = ref();
const formRef = ref();
const activeTab = ref('basic');
const detailActiveTab = ref('basic');

// 分类管理相关
const categoryList = ref<JobCategory[]>([
  {
    id: 'cat001',
    name: '行政管理类',
    positions: [
      { id: 'pos001', name: '所长' },
      { id: 'pos002', name: '副所长' },
      { id: 'pos003', name: '处长' },
      { id: 'pos004', name: '科长' },
      { id: 'pos005', name: '班组长' },
      { id: 'pos006', name: '工段长' }
    ]
  },
  {
    id: 'cat002',
    name: '技术职务类',
    positions: [
      { id: 'pos007', name: '总工程师' },
      { id: 'pos008', name: '技术负责人' },
      { id: 'pos009', name: '项目负责人' }
    ]
  },
  {
    id: 'cat003',
    name: '安全监督类',
    positions: [
      { id: 'pos010', name: '安全总监' },
      { id: 'pos011', name: '安全监察员' },
      { id: 'pos012', name: '实验室安全员' }
    ]
  },
  {
    id: 'cat014',
    name: '应急指挥类',
    positions: [
      { id: 'pos013', name: '应急总指挥' },
      { id: 'pos014', name: '现场指挥官' },
      { id: 'pos015', name: '救援小组长' }
    ]
  },
  {
    id: 'cat015',
    name: '特殊授权类',
    positions: [
      { id: 'pos016', name: '特种设备操作负责人' },
      { id: 'pos017', name: '危险化学品保管员' },
      { id: 'pos018', name: '辐射防护负责人' }
    ]
  }
]);

// 表单状态
const formState = reactive({
  id: '',
  code: '',
  name: '',
  category: '',
  standardCount: 1,
  securityLevel: '一般',
  dualPersonRequired: false,
  status: '1'
});

const dutyFormState = reactive({
  responsibilities: '',
  safetyDuties: '',
  emergencyDuties: ''
});

const permissionFormState = reactive({
  systemPermissions: '',
  dataPermissions: '',
  approvalPermissions: ''
});

const qualificationFormState = reactive({
  educationRequirements: '',
  experienceRequirements: '',
  qualificationRequirements: '',
  safetyTrainingRequirements: ''
});

const riskFormState = reactive({
  riskLevel: 1,
  chemicalHandling: false,
  specialEquipment: false,
  maxExperimentScale: ''
});

// 选中的职务
const selectedJob = ref<Job>({
  id: '',
  code: '',
  name: '',
  category: '',
  standardCount: 1,
  responsibilities: '',
  safetyDuties: '',
  emergencyDuties: '',
  systemPermissions: '',
  dataPermissions: '',
  approvalPermissions: '',
  educationRequirements: '',
  experienceRequirements: '',
  qualificationRequirements: '',
  safetyTrainingRequirements: '',
  riskLevel: 1,
  chemicalHandling: false,
  specialEquipment: false,
  maxExperimentScale: '',
  securityLevel: '一般',
  dualPersonRequired: false,
  status: '1'
});

// 职务类别选项
const categoryOptions = categoryList.value.map(cat => ({
  label: cat.name,
  value: cat.name
}));

// 密级要求选项
const securityLevelOptions = [
  { label: '绝密', value: '绝密' },
  { label: '机密', value: '机密' },
  { label: '秘密', value: '秘密' },
  { label: '内部', value: '内部' },
  { label: '一般', value: '一般' }
];

// 表格列配置
const columns = [
  {
    title: '职务编码',
    dataIndex: 'code',
    key: 'code',
    width: 150,
  },
  {
    title: '职务名称',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: '所属分类',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: '标准编制人数',
    dataIndex: 'standardCount',
    key: 'standardCount',
    width: 120,
  },
  {
    title: '密级要求',
    dataIndex: 'securityLevel',
    key: 'securityLevel',
    width: 100,
  },
  {
    title: '风险等级',
    dataIndex: 'riskLevel',
    key: 'riskLevel',
    width: 100,
    type: 'tag',
    options: [{
      label: '一级风险',
      value: 1,
      color: 'green'
    }, {
      label: '二级风险',
      value: 2,
      color: 'blue'
    }, {
      label: '三级风险',
      value: 3,
      color: 'orange'
    }, {
      label: '四级风险',
      value: 4,
      color: 'red'
    }, {
      label: '五级风险',
      value: 5,
      color: 'red'
    }],
  },
  {
    title: '双人担任',
    dataIndex: 'dualPersonRequired',
    key: 'dualPersonRequired',
    width: 80,
    type: 'tag',
    options: [
      { label: '是', value: true, color: 'green' },
      { label: '否', value: false, color: 'blue' }
    ],
    // custom_render: ({ record }) => record.dualPersonRequired ? '是' : '否'
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
  width: 200,
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
    label: '职务名称',
    type: 'input',
    placeholder: '请输入职务名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'category',
    label: '所属分类',
    type: 'select',
    placeholder: '请选择所属分类',
    props: {
      allowClear: true,
      options: categoryOptions
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
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' }
      ]
    },
    colSpan: 6
  }
]);

// 响应配置
const responseConfig = {
  listKey: 'jobs',
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

// 基本信息表单配置
const basicFormSchema = [
  {
    key: 'code',
    type: 'input',
    label: '职务编码',
    placeholder: '请输入职务编码',
    required: true,
    rules: [
      { required: true, message: '请输入职务编码', trigger: 'blur' },
      { min: 2, max: 50, message: '职务编码长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'name',
    type: 'input',
    label: '职务名称',
    placeholder: '请输入职务名称',
    required: true,
    rules: [
      { required: true, message: '请输入职务名称', trigger: 'blur' },
      { min: 2, max: 50, message: '职务名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'category',
    type: 'select',
    label: '所属分类',
    placeholder: '请选择所属分类',
    props: {
      options: categoryOptions
    },
    required: true,
    rules: [
      { required: true, message: '请选择所属分类', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'standardCount',
    type: 'inputNumber',
    label: '标准编制人数',
    placeholder: '请输入标准编制人数',
    props: {
      min: 1,
      max: 999
    },
    required: true,
    rules: [
      { required: true, message: '请输入标准编制人数', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'securityLevel',
    type: 'select',
    label: '密级要求',
    placeholder: '请选择密级要求',
    props: {
      options: securityLevelOptions
    },
    required: true,
    rules: [
      { required: true, message: '请选择密级要求', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'dualPersonRequired',
    type: 'switch',
    label: '是否必需双人担任',
    props: {
      checkedChildren: '是',
      unCheckedChildren: '否'
    },
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
  }
];

// 岗位职责表单配置
const dutyFormSchema = [
  {
    key: 'responsibilities',
    type: 'textarea',
    label: '主要工作职责',
    placeholder: '请输入主要工作职责',
    props: {
      rows: 4
    },
    required: true,
    rules: [
      { required: true, message: '请输入主要工作职责', trigger: 'blur' },
      { min: 10, max: 500, message: '主要工作职责长度为10-500个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'safetyDuties',
    type: 'textarea',
    label: '安全管理职责',
    placeholder: '请输入安全管理职责',
    props: {
      rows: 4
    },
    required: true,
    rules: [
      { required: true, message: '请输入安全管理职责', trigger: 'blur' },
      { min: 10, max: 500, message: '安全管理职责长度为10-500个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'emergencyDuties',
    type: 'textarea',
    label: '应急响应职责',
    placeholder: '请输入应急响应职责',
    props: {
      rows: 4
    },
    required: true,
    rules: [
      { required: true, message: '请输入应急响应职责', trigger: 'blur' },
      { min: 10, max: 500, message: '应急响应职责长度为10-500个字符', trigger: 'blur' },
    ],
    colSpan: 24
  }
];

// 权限配置表单配置
const permissionFormSchema = [
  {
    key: 'systemPermissions',
    type: 'textarea',
    label: '系统功能权限',
    placeholder: '请输入系统功能权限',
    props: {
      rows: 4
    },
    required: true,
    rules: [
      { required: true, message: '请输入系统功能权限', trigger: 'blur' },
      { min: 10, max: 500, message: '系统功能权限长度为10-500个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'dataPermissions',
    type: 'textarea',
    label: '数据访问权限',
    placeholder: '请输入数据访问权限',
    props: {
      rows: 4
    },
    required: true,
    rules: [
      { required: true, message: '请输入数据访问权限', trigger: 'blur' },
      { min: 10, max: 500, message: '数据访问权限长度为10-500个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'approvalPermissions',
    type: 'textarea',
    label: '审批权限',
    placeholder: '请输入审批权限',
    props: {
      rows: 4
    },
    required: true,
    rules: [
      { required: true, message: '请输入审批权限', trigger: 'blur' },
      { min: 10, max: 500, message: '审批权限长度为10-500个字符', trigger: 'blur' },
    ],
    colSpan: 24
  }
];

// 任职资格表单配置
const qualificationFormSchema = [
  {
    key: 'educationRequirements',
    type: 'textarea',
    label: '学历专业要求',
    placeholder: '请输入学历专业要求',
    props: {
      rows: 3
    },
    required: true,
    rules: [
      { required: true, message: '请输入学历专业要求', trigger: 'blur' },
      { min: 5, max: 300, message: '学历专业要求长度为5-300个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'experienceRequirements',
    type: 'textarea',
    label: '工作经验要求',
    placeholder: '请输入工作经验要求',
    props: {
      rows: 3
    },
    required: true,
    rules: [
      { required: true, message: '请输入工作经验要求', trigger: 'blur' },
      { min: 5, max: 300, message: '工作经验要求长度为5-300个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'qualificationRequirements',
    type: 'textarea',
    label: '必需资质证书',
    placeholder: '请输入必需资质证书',
    props: {
      rows: 3
    },
    required: true,
    rules: [
      { required: true, message: '请输入必需资质证书', trigger: 'blur' },
      { min: 5, max: 300, message: '必需资质证书长度为5-300个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'safetyTrainingRequirements',
    type: 'textarea',
    label: '安全培训要求',
    placeholder: '请输入安全培训要求',
    props: {
      rows: 3
    },
    required: true,
    rules: [
      { required: true, message: '请输入安全培训要求', trigger: 'blur' },
      { min: 5, max: 300, message: '安全培训要求长度为5-300个字符', trigger: 'blur' },
    ],
    colSpan: 24
  }
];

// 风险评估表单配置
const riskFormSchema = [
  {
    key: 'riskLevel',
    type: 'select',
    label: '风险等级',
    props: {
      options: [{
        label: '一级风险',
        value: 1,
        color: 'green'
      }, {
        label: '二级风险',
        value: 2,
        color: 'blue'
      }, {
        label: '三级风险',
        value: 3,
        color: 'orange'
      }, {
        label: '四级风险',
        value: 4,
        color: 'red'
      }, {
        label: '五级风险',
        value: 5,
        color: 'red'
      }],
    },
    required: true,
    rules: [
      { required: true, message: '请选择风险等级', trigger: 'change' }
    ],
    colSpan: 24
  },
  {
    key: 'chemicalHandling',
    type: 'switch',
    label: '危险化学品操作权限',
    props: {
      checkedChildren: '是',
      unCheckedChildren: '否'
    },
    colSpan: 12
  },
  {
    key: 'specialEquipment',
    type: 'switch',
    label: '特种设备操作权限',
    props: {
      checkedChildren: '是',
      unCheckedChildren: '否'
    },
    colSpan: 12
  },
  {
    key: 'maxExperimentScale',
    type: 'input',
    label: '最大实验规模限制',
    placeholder: '请输入最大实验规模限制',
    colSpan: 24
  }
];

// 基本信息详情配置
const basicDetailSchema = [
  {
    key: 'code',
    type: 'text',
    label: '职务编码',
    colSpan: 12
  },
  {
    key: 'name',
    type: 'text',
    label: '职务名称',
    colSpan: 12
  },
  {
    key: 'category',
    type: 'text',
    label: '所属分类',
    colSpan: 12
  },
  {
    key: 'standardCount',
    type: 'text',
    label: '标准编制人数',
    colSpan: 12
  },
  {
    key: 'securityLevel',
    type: 'text',
    label: '密级要求',
    colSpan: 12
  },
  {
    key: 'dualPersonRequired',
    type: 'select',
    label: '是否必需双人担任',
    colSpan: 12,
    props: {
      options: [
        { label: '是', value: true, color: 'green' },
        { label: '否', value: false, color: 'red' }
      ]
    },
  },
  {
    key: 'status',
    type: 'select',
    label: '状态',
    colSpan: 12,
    props: {
      options: [
        { label: '启用', value: '1', color: 'green' },
        { label: '禁用', value: '0', color: 'red' }
      ]
    },
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

// 岗位职责详情配置
const dutyDetailSchema = [
  {
    key: 'responsibilities',
    type: 'text',
    label: '主要工作职责',
    colSpan: 24
  },
  {
    key: 'safetyDuties',
    type: 'text',
    label: '安全管理职责',
    colSpan: 24
  },
  {
    key: 'emergencyDuties',
    type: 'text',
    label: '应急响应职责',
    colSpan: 24
  }
];

// 权限配置详情配置
const permissionDetailSchema = [
  {
    key: 'systemPermissions',
    type: 'text',
    label: '系统功能权限',
    colSpan: 24
  },
  {
    key: 'dataPermissions',
    type: 'text',
    label: '数据访问权限',
    colSpan: 24
  },
  {
    key: 'approvalPermissions',
    type: 'text',
    label: '审批权限',
    colSpan: 24
  }
];

// 任职资格详情配置
const qualificationDetailSchema = [
  {
    key: 'educationRequirements',
    type: 'text',
    label: '学历专业要求',
    colSpan: 24
  },
  {
    key: 'experienceRequirements',
    type: 'text',
    label: '工作经验要求',
    colSpan: 24
  },
  {
    key: 'qualificationRequirements',
    type: 'text',
    label: '必需资质证书',
    colSpan: 24
  },
  {
    key: 'safetyTrainingRequirements',
    type: 'text',
    label: '安全培训要求',
    colSpan: 24
  }
];

// 风险评估详情配置
const riskDetailSchema = [
  {
    key: 'riskLevel',
    type: 'select',
    label: '风险等级',
    colSpan: 12,
    props: {
      options: [{
        label: '一级风险',
        value: 1,
        color: 'green'
      }, {
        label: '二级风险',
        value: 2,
        color: 'blue'
      }, {
        label: '三级风险',
        value: 3,
        color: 'orange'
      }, {
        label: '四级风险',
        value: 4,
        color: 'red'
      }, {
        label: '五级风险',
        value: 5,
        color: 'red'
      }],
    },
  },
  {
    key: 'chemicalHandling',
    type: 'select',
    label: '危险化学品操作权限',
    colSpan: 12,
    props: {
      options: [{
        label: '是',
        value: true,
        color: 'green'
      }, {
        label: '否',
        value: false,
        color: 'blue'
      }],
    },
  },
  {
    key: 'specialEquipment',
    type: 'select',
    label: '特种设备操作权限',
    colSpan: 12,
    props: {
      options: [{
        label: '是',
        value: true,
        color: 'green'
      }, {
        label: '否',
        value: false,
        color: 'blue'
      }],
    },
  },
  {
    key: 'maxExperimentScale',
    type: 'text',
    label: '最大实验规模限制',
    colSpan: 12
  }
];

// 模拟数据存储 - 示例地区九院化学所职务数据
let jobs: Job[] = [
  {
    id: 'job001',
    code: 'DUTY-SAFETY-001',
    name: '安全总监',
    category: '安全监督类',
    standardCount: 1,
    securityLevel: '机密',
    dualPersonRequired: false,
    responsibilities: '负责全所安全管理体系的建立与实施，制定安全政策和标准，组织安全审计，监督安全制度执行情况，协调内外部安全事务。',
    safetyDuties: '制定全所安全标准，审核高风险实验方案，定期组织安全检查，对重大安全事故进行调查分析，建立完善的安全管理体系。',
    emergencyDuties: '在重大突发事件中担任应急指挥，组织应急预案制定和演练，负责事故应急响应和处置，协调外部应急资源。',
    systemPermissions: '系统管理、数据管理、安全模块管理',
    dataPermissions: '安全相关数据访问权限、事故记录、人员安全档案',
    approvalPermissions: '安全审批、应急预案审批、安全设备采购审批',
    educationRequirements: '硕士及以上学历，安全工程、化学相关专业，正高级职称',
    experienceRequirements: '10年以上安全管理工作经验，持有注册安全工程师证书',
    qualificationRequirements: '安全总监资格证、危化品安全管理资格证',
    safetyTrainingRequirements: '安全培训证书，应急处理培训，辐射安全证书',
    riskLevel: 5,
    chemicalHandling: false,
    specialEquipment: false,
    maxExperimentScale: '大型综合实验',
    status: '1',
    create_time: '2025-12-01 09:30:00',
    update_time: '2025-12-01 09:30:00'
  },
  {
    id: 'job002',
    code: 'DUTY-EMERGENCY-001',
    name: '应急总指挥',
    category: '应急指挥类',
    standardCount: 1,
    securityLevel: '机密',
    dualPersonRequired: false,
    responsibilities: '负责全所应急管理体系的建立与运行，制定应急预案，组织应急演练，指挥突发事件处置，协调内外部应急资源。',
    safetyDuties: '审核应急预案，评估应急资源配备，组织应急培训，检查应急设施状态，确保应急响应体系有效运行。',
    emergencyDuties: '在突发事件中担任总指挥，启动应急预案，组织应急响应，协调各部门行动，对外联络和信息通报。',
    systemPermissions: '应急管理系统、人员调度系统、设备控制系统',
    dataPermissions: '应急预案、应急资源数据、应急演练记录',
    approvalPermissions: '应急预案审批、应急演练方案审批、应急物资调配审批',
    educationRequirements: '本科及以上学历，安全工程、应急管理相关专业，高级职称',
    experienceRequirements: '8年以上应急管理工作经验，参与过重大应急事件处置',
    qualificationRequirements: '应急指挥资格证、危化品事故处置证书',
    safetyTrainingRequirements: '应急指挥培训、危险化学品应急处置培训',
    riskLevel: 5,
    chemicalHandling: false,
    specialEquipment: true,
    maxExperimentScale: '应急指挥',
    status: '1',
    create_time: '2025-12-01 10:15:00',
    update_time: '2025-12-01 10:15:00'
  },
  {
    id: 'job003',
    code: 'DUTY-ADMIN-001',
    name: '所长',
    category: '行政管理类',
    standardCount: 1,
    securityLevel: '绝密',
    dualPersonRequired: true,
    responsibilities: '负责化学所全面工作，制定发展战略，管理重大事务，对外代表化学所，确保各项工作符合上级要求。',
    safetyDuties: '对全所安全工作负总责，审批重大安全事项，确保安全投入，处理重大安全事故。',
    emergencyDuties: '在重大突发事件中担任最高指挥，决定应急响应级别，协调外部资源，对外发布信息。',
    systemPermissions: '系统管理、人员管理、数据管理、科研项目管理',
    dataPermissions: '全部数据访问权限',
    approvalPermissions: '重大项目审批、预算审批、人事任免审批、设备采购审批',
    educationRequirements: '博士学历，相关专业背景，正高级职称',
    experienceRequirements: '15年以上科研或管理工作经验，担任过重要领导职务',
    qualificationRequirements: '院士或相当级别专家，相关领域权威认证',
    safetyTrainingRequirements: '安全管理培训，应急处理培训，保密培训',
    riskLevel: 5,
    chemicalHandling: false,
    specialEquipment: false,
    maxExperimentScale: '管理决策',
    status: '1',
    create_time: '2025-12-01 11:00:00',
    update_time: '2025-12-01 11:00:00'
  },
  {
    id: 'job004',
    code: 'DUTY-TECH-001',
    name: '总工程师',
    category: '技术职务类',
    standardCount: 1,
    securityLevel: '机密',
    dualPersonRequired: false,
    responsibilities: '负责全所技术工作规划与实施，指导重大科研项目，审核技术方案，推动技术创新，解决关键技术问题。',
    safetyDuties: '确保技术方案符合安全要求，审核技术安全措施，组织技术安全评估，指导技术安全工作。',
    emergencyDuties: '在技术类突发事件中提供技术支持，参与技术事故分析，制定技术类应急措施。',
    systemPermissions: '技术管理模块、设备管理模块、数据分析模块',
    dataPermissions: '技术数据访问权限、实验数据访问权限',
    approvalPermissions: '技术方案审批、设备技术参数审批、技术报告审批',
    educationRequirements: '博士学历，化学、化工相关专业，正高级职称',
    experienceRequirements: '12年以上技术工作经验，主持过重大科研项目',
    qualificationRequirements: '正高级职称，相关技术领域专家认证',
    safetyTrainingRequirements: '技术安全培训，应急处理培训，保密培训',
    riskLevel: 4,
    chemicalHandling: false,
    specialEquipment: true,
    maxExperimentScale: '技术指导',
    status: '1',
    create_time: '2025-12-01 11:45:00',
    update_time: '2025-12-01 11:45:00'
  },
  {
    id: 'job005',
    code: 'DUTY-SPECIAL-001',
    name: '危险化学品保管员',
    category: '特殊授权类',
    standardCount: 2,
    securityLevel: '秘密',
    dualPersonRequired: true,
    responsibilities: '负责危险化学品的采购、入库、存储、发放、回收等全流程管理，确保化学品安全管理规范。',
    safetyDuties: '严格执行化学品安全管理制度，定期检查存储设施，监控化学品状态，及时报告安全隐患。',
    emergencyDuties: '在化学品泄漏等事故中参与应急处置，提供化学品特性信息，协助事故处理。',
    systemPermissions: '化学品管理系统、库存管理系统',
    dataPermissions: '化学品库存数据、使用记录、安全数据表',
    approvalPermissions: '化学品采购申请审批、化学品发放审批',
    educationRequirements: '大专及以上学历，化学、化工相关专业',
    experienceRequirements: '3年以上化学品管理工作经验',
    qualificationRequirements: '危化品安全管理资格证、危化品操作证',
    safetyTrainingRequirements: '化学品安全培训，应急处置培训，辐射防护培训',
    riskLevel: 4,
    chemicalHandling: true,
    specialEquipment: false,
    maxExperimentScale: '化学品管理',
    status: '1',
    create_time: '2025-12-01 12:30:00',
    update_time: '2025-12-01 12:30:00'
  }
];

// 生成唯一ID
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `job${timestamp}${random}`;
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
  let filteredData = [...jobs];

  if (rest.name) {
    filteredData = filteredData.filter(item =>
      item.name.includes(rest.name)
    );
  }

  if (rest.category) {
    filteredData = filteredData.filter(item =>
      item.category === rest.category
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
    jobs: pagedData,
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
  modalTitle.value = '新增职务';
  resetForm();
  modalVisible.value = true;
  activeTab.value = 'basic';
};

const showCategoryModal = () => {
  categoryModalVisible.value = true;
};

const editJobFn = (record: Job) => {
  modalTitle.value = '编辑职务';

  // 基本信息
  formState.id = record.id;
  formState.code = record.code;
  formState.name = record.name;
  formState.category = record.category;
  formState.standardCount = record.standardCount;
  formState.securityLevel = record.securityLevel;
  formState.dualPersonRequired = record.dualPersonRequired;
  formState.status = record.status;

  // 岗位职责
  dutyFormState.responsibilities = record.responsibilities;
  dutyFormState.safetyDuties = record.safetyDuties;
  dutyFormState.emergencyDuties = record.emergencyDuties;

  // 权限配置
  permissionFormState.systemPermissions = record.systemPermissions;
  permissionFormState.dataPermissions = record.dataPermissions;
  permissionFormState.approvalPermissions = record.approvalPermissions;

  // 任职资格
  qualificationFormState.educationRequirements = record.educationRequirements;
  qualificationFormState.experienceRequirements = record.experienceRequirements;
  qualificationFormState.qualificationRequirements = record.qualificationRequirements;
  qualificationFormState.safetyTrainingRequirements = record.safetyTrainingRequirements;

  // 风险评估
  riskFormState.riskLevel = record.riskLevel;
  riskFormState.chemicalHandling = record.chemicalHandling;
  riskFormState.specialEquipment = record.specialEquipment;
  riskFormState.maxExperimentScale = record.maxExperimentScale;

  modalVisible.value = true;
  activeTab.value = 'basic';
};

const showJobDetail = (record: Job) => {
  selectedJob.value = { ...record };
  detailModalVisible.value = true;
  detailActiveTab.value = 'basic';
};

const confirmDelete = (record: Job) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除职务"${record.name}"吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // 模拟删除操作延迟
        await new Promise(resolve => setTimeout(resolve, 300));

        // 从数组中删除数据
        const index = jobs.findIndex(item => item.id === record.id);
        if (index !== -1) {
          jobs.splice(index, 1);
          message.success('删除职务成功');

          // 重新加载数据
          smartTableRef.value?.refresh();
        } else {
          throw new Error('未找到要删除的职务');
        }
      } catch (error) {
        console.error('删除职务失败:', error);
        message.error('删除职务失败');
      }
    }
  });
};

const handleModalOk = async () => {
  try {
    // 验证所有表单
    await formRef.value?.validate();

    const formData = { ...formState };
    const dutyData = { ...dutyFormState };
    const permissionData = { ...permissionFormState };
    const qualificationData = { ...qualificationFormState };
    const riskData = { ...riskFormState };

    if (modalTitle.value === '新增职务') {
      // 新增操作
      const newJob: Job = {
        id: generateId(),
        code: formData.code,
        name: formData.name,
        category: formData.category,
        standardCount: formData.standardCount,
        securityLevel: formData.securityLevel,
        dualPersonRequired: formData.dualPersonRequired,
        responsibilities: dutyData.responsibilities,
        safetyDuties: dutyData.safetyDuties,
        emergencyDuties: dutyData.emergencyDuties,
        systemPermissions: permissionData.systemPermissions,
        dataPermissions: permissionData.dataPermissions,
        approvalPermissions: permissionData.approvalPermissions,
        educationRequirements: qualificationData.educationRequirements,
        experienceRequirements: qualificationData.experienceRequirements,
        qualificationRequirements: qualificationData.qualificationRequirements,
        safetyTrainingRequirements: qualificationData.safetyTrainingRequirements,
        riskLevel: riskData.riskLevel,
        chemicalHandling: riskData.chemicalHandling,
        specialEquipment: riskData.specialEquipment,
        maxExperimentScale: riskData.maxExperimentScale,
        status: formData.status,
        create_time: getCurrentTime(),
        update_time: getCurrentTime()
      };

      jobs.unshift(newJob);
      message.success('新增职务成功');
    } else {
      // 编辑操作
      const index = jobs.findIndex(item => item.id === formData.id);
      if (index !== -1) {
        jobs[index] = {
          ...jobs[index],
          code: formData.code,
          name: formData.name,
          category: formData.category,
          standardCount: formData.standardCount,
          securityLevel: formData.securityLevel,
          dualPersonRequired: formData.dualPersonRequired,
          responsibilities: dutyData.responsibilities,
          safetyDuties: dutyData.safetyDuties,
          emergencyDuties: dutyData.emergencyDuties,
          systemPermissions: permissionData.systemPermissions,
          dataPermissions: permissionData.dataPermissions,
          approvalPermissions: permissionData.approvalPermissions,
          educationRequirements: qualificationData.educationRequirements,
          experienceRequirements: qualificationData.experienceRequirements,
          qualificationRequirements: qualificationData.qualificationRequirements,
          safetyTrainingRequirements: qualificationData.safetyTrainingRequirements,
          riskLevel: riskData.riskLevel,
          chemicalHandling: riskData.chemicalHandling,
          specialEquipment: riskData.specialEquipment,
          maxExperimentScale: riskData.maxExperimentScale,
          status: formData.status,
          update_time: getCurrentTime()
        };
        message.success('编辑职务成功');
      } else {
        throw new Error('未找到要编辑的职务');
      }
    }

    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增职务' ? '新增职务失败' : '编辑职务失败');
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

const resetForm = () => {
  formState.id = '';
  formState.code = '';
  formState.name = '';
  formState.category = '';
  formState.standardCount = 1;
  formState.securityLevel = '一般';
  formState.dualPersonRequired = false;
  formState.status = '1';

  dutyFormState.responsibilities = '';
  dutyFormState.safetyDuties = '';
  dutyFormState.emergencyDuties = '';

  permissionFormState.systemPermissions = '';
  permissionFormState.dataPermissions = '';
  permissionFormState.approvalPermissions = '';

  qualificationFormState.educationRequirements = '';
  qualificationFormState.experienceRequirements = '';
  qualificationFormState.qualificationRequirements = '';
  qualificationFormState.safetyTrainingRequirements = '';

  riskFormState.riskLevel = 1;
  riskFormState.chemicalHandling = false;
  riskFormState.specialEquipment = false;
  riskFormState.maxExperimentScale = '';
};

const closeDetailModal = () => {
  detailModalVisible.value = false;
  selectedJob.value = {
    id: '',
    code: '',
    name: '',
    category: '',
    standardCount: 1,
    responsibilities: '',
    safetyDuties: '',
    emergencyDuties: '',
    systemPermissions: '',
    dataPermissions: '',
    approvalPermissions: '',
    educationRequirements: '',
    experienceRequirements: '',
    qualificationRequirements: '',
    safetyTrainingRequirements: '',
    riskLevel: 1,
    chemicalHandling: false,
    specialEquipment: false,
    maxExperimentScale: '',
    securityLevel: '一般',
    dualPersonRequired: false,
    status: '1'
  };
};

// 职务分类管理相关方法
const addCategory = () => {
  const newCategory = {
    id: `cat${Date.now()}`,
    name: '',  // 空字符串，让用户输入新序列名称
    positions: []
  };
  categoryList.value.push(newCategory);

  // 如果需要自动聚焦到新添加的输入框，可以使用 nextTick
  // 但由于组件结构复杂，这里仅添加数据，让用户手动编辑
};

const removeCategory = (index: number) => {
  categoryList.value.splice(index, 1);
};

const addPositionToCategory = (category: JobCategory) => {
  category.positions.push({
    id: `pos${Date.now()}`,
    name: ''
  });
};

const removePositionFromCategory = (category: JobCategory, posIndex: number) => {
  category.positions.splice(posIndex, 1);
};

const handleCategoryModalOk = () => {
  categoryModalVisible.value = false;
  message.success('职务分类更新成功');
};

const handleCategoryModalCancel = () => {
  categoryModalVisible.value = false;
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
const handleTableAction = (action: string, record: Job) => {
  switch (action) {
    case 'edit':
      editJobFn(record);
      break;
    case 'detail':
      showJobDetail(record);
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
.job-management-container {
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