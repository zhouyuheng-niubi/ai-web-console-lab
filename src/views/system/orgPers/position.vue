<template>
  <div class="job-management-container p-[16px] flex flex-col overflow-hidden box-border"
    style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <div class="flex items-center">
        <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
          <span class="flex items-center">
            <PlusOutlined />
            <span class="ml-1 leading-none">新增岗位</span>
          </span>
        </Button>
        <Button class="ml-[16px]" @click="showCategoryModal" style="border-color: #4362EF; color: #4362EF;">
          <span class="flex items-center">
            <FolderOpenOutlined />
            <span class="ml-1 leading-none">岗位分类管理</span>
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

    <!-- 新增/编辑岗位弹窗 -->
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
        <TabPane key="duty" tab="岗位职责">
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

    <!-- 岗位分类管理弹窗 -->
    <Modal v-model:open="categoryModalVisible" title="岗位分类管理" width="800px" @ok="handleCategoryModalOk"
      @cancel="handleCategoryModalCancel">
      <div class="mb-[16px]">
        <Button type="primary" style="background-color: #4362EF;" @click="addCategory">
          <span class="flex items-center">
            <PlusOutlined />
            <span class="ml-1 leading-none">新增岗位类别</span>
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
              <Input v-model:value="position.name" placeholder="请输入岗位名称" />
              <Button type="link" danger class="ml-[8px]" @click="removePositionFromCategory(category, posIndex)">
                <DeleteOutlined />
              </Button>
            </div>
          </div>

          <div class="mt-[8px]">
            <Button size="small" @click="addPositionToCategory(category)">
              <PlusOutlined />
              添加岗位
            </Button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- 岗位详情弹窗 -->
    <Modal v-model:open="detailModalVisible" title="岗位详情" width="1000px" :footer="null" @cancel="closeDetailModal">
      <Tabs v-model:activeKey="detailActiveTab">
        <!-- 基本信息 -->
        <TabPane key="basic" tab="基本信息">
          <AdvancedForm :schema="basicDetailSchema" :model="selectedJob" mode="descriptions" />
        </TabPane>

        <!-- 岗位职责 -->
        <TabPane key="duty" tab="岗位职责">
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

// 定义岗位类型
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
  status: string;
  create_time?: string;
  update_time?: string;
}

// 定义岗位类别类型
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
const modalTitle = ref('新增岗位');
const smartTableRef = ref();
const formRef = ref();
const activeTab = ref('basic');
const detailActiveTab = ref('basic');

// 分类管理相关
const categoryList = ref<JobCategory[]>([
  {
    id: 'cat001',
    name: '科研序列',
    positions: [
      { id: 'pos001', name: '研究员' },
      { id: 'pos002', name: '副研' },
      { id: 'pos003', name: '助研' },
      { id: 'pos004', name: '实验员' }
    ]
  },
  {
    id: 'cat002',
    name: '管理序列',
    positions: [
      { id: 'pos005', name: '所长' },
      { id: 'pos006', name: '处长' },
      { id: 'pos007', name: '科长' },
      { id: 'pos008', name: '科员' }
    ]
  },
  {
    id: 'cat003',
    name: '技术序列',
    positions: [
      { id: 'pos009', name: '高工' },
      { id: 'pos010', name: '工程师' },
      { id: 'pos011', name: '技师' }
    ]
  },
  {
    id: 'cat004',
    name: '生产序列',
    positions: [
      { id: 'pos012', name: '班组长' },
      { id: 'pos013', name: '操作员' },
      { id: 'pos014', name: '检验员' }
    ]
  },
  {
    id: 'cat005',
    name: '保障序列',
    positions: [
      { id: 'pos015', name: '设备员' },
      { id: 'pos016', name: '安全员' },
      { id: 'pos017', name: '保密员' }
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

// 选中的岗位
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
  status: '1'
});

// 岗位类别选项
const categoryOptions = categoryList.value.map(cat => ({
  label: cat.name,
  value: cat.name
}));

// 表格列配置
const columns = [
  {
    title: '岗位编码',
    dataIndex: 'code',
    key: 'code',
    width: 150,
  },
  {
    title: '岗位名称',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: '所属序列',
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
    label: '岗位名称',
    type: 'input',
    placeholder: '请输入岗位名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'category',
    label: '所属序列',
    type: 'select',
    placeholder: '请选择所属序列',
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
    label: '岗位编码',
    placeholder: '请输入岗位编码',
    required: true,
    rules: [
      { required: true, message: '请输入岗位编码', trigger: 'blur' },
      { min: 2, max: 50, message: '岗位编码长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'name',
    type: 'input',
    label: '岗位名称',
    placeholder: '请输入岗位名称',
    required: true,
    rules: [
      { required: true, message: '请输入岗位名称', trigger: 'blur' },
      { min: 2, max: 50, message: '岗位名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'category',
    type: 'select',
    label: '所属序列',
    placeholder: '请选择所属序列',
    props: {
      options: categoryOptions
    },
    required: true,
    rules: [
      { required: true, message: '请选择所属序列', trigger: 'change' }
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
    type: 'slider',
    label: '风险等级',
    props: {
      min: 1,
      max: 5,
      marks: { 1: '1级', 2: '2级', 3: '3级', 4: '4级', 5: '5级' }
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
    label: '岗位编码',
    colSpan: 12
  },
  {
    key: 'name',
    type: 'text',
    label: '岗位名称',
    colSpan: 12
  },
  {
    key: 'category',
    type: 'text',
    label: '所属序列',
    colSpan: 12
  },
  {
    key: 'standardCount',
    type: 'text',
    label: '标准编制人数',
    colSpan: 12
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
    type: 'text',
    label: '风险等级',
    colSpan: 12,
    formatter: (value: number) => {
      const levelTexts = {
        1: '一级风险',
        2: '二级风险',
        3: '三级风险',
        4: '四级风险',
        5: '五级风险'
      };
      return levelTexts[value] || `未知(${value})`;
    }
  },
  {
    key: 'chemicalHandling',
    type: 'text',
    label: '危险化学品操作权限',
    colSpan: 12,
    formatter: (value: boolean) => value ? '是' : '否'
  },
  {
    key: 'specialEquipment',
    type: 'text',
    label: '特种设备操作权限',
    colSpan: 12,
    formatter: (value: boolean) => value ? '是' : '否'
  },
  {
    key: 'maxExperimentScale',
    type: 'text',
    label: '最大实验规模限制',
    colSpan: 12
  }
];

// 模拟数据存储
let jobs: Job[] = [
  {
    id: 'job001',
    code: 'POS-RESEARCH-001',
    name: '高级研究员',
    category: '科研序列',
    standardCount: 1,
    responsibilities: '负责科研项目的整体规划与实施，制定研究方案，指导团队完成科研任务',
    safetyDuties: '负责实验室安全管理，制定安全操作规程，定期组织安全检查',
    emergencyDuties: '在突发事件中负责应急指挥和处置，组织应急演练',
    systemPermissions: '系统管理、数据管理、用户管理',
    dataPermissions: '全部数据访问权限',
    approvalPermissions: '项目审批、预算审批、人员调配审批',
    educationRequirements: '博士学历，相关专业背景',
    experienceRequirements: '10年以上相关工作经验',
    qualificationRequirements: '高级职称，相关资质证书',
    safetyTrainingRequirements: '安全培训证书，应急处理培训',
    riskLevel: 3,
    chemicalHandling: true,
    specialEquipment: true,
    maxExperimentScale: '大型实验设备操作',
    status: '1',
    create_time: '2025-12-01 09:30:00',
    update_time: '2025-12-01 09:30:00'
  },
  {
    id: 'job002',
    code: 'POS-MGT-001',
    name: '安全主管',
    category: '管理序列',
    standardCount: 1,
    responsibilities: '负责企业安全管理制度制定与实施，组织安全培训和检查',
    safetyDuties: '监督各项安全制度的执行，排查安全隐患，制定安全改进措施',
    emergencyDuties: '组织应急预案制定和演练，负责事故应急响应和处置',
    systemPermissions: '安全管理模块、培训管理模块',
    dataPermissions: '安全相关数据访问权限',
    approvalPermissions: '安全审批、培训审批',
    educationRequirements: '本科及以上学历，安全工程相关专业',
    experienceRequirements: '5年以上安全管理经验',
    qualificationRequirements: '注册安全工程师',
    safetyTrainingRequirements: '安全培训师资格，应急处理培训',
    riskLevel: 4,
    chemicalHandling: false,
    specialEquipment: false,
    maxExperimentScale: '中型设备操作',
    status: '1',
    create_time: '2025-12-01 10:15:00',
    update_time: '2025-12-01 10:15:00'
  },
  {
    id: 'job003',
    code: 'POS-TECH-001',
    name: '高级工程师',
    category: '技术序列',
    standardCount: 2,
    responsibilities: '负责技术方案设计与实施，解决复杂技术问题，指导团队技术工作',
    safetyDuties: '确保技术方案符合安全要求，进行安全技术评估',
    emergencyDuties: '提供技术应急支持，参与技术事故分析',
    systemPermissions: '技术管理模块、设备管理模块',
    dataPermissions: '技术数据访问权限',
    approvalPermissions: '技术方案审批、设备采购审批',
    educationRequirements: '本科及以上学历，相关工程专业',
    experienceRequirements: '8年以上相关技术经验',
    qualificationRequirements: '高级工程师职称',
    safetyTrainingRequirements: '安全技术培训，应急处理培训',
    riskLevel: 2,
    chemicalHandling: false,
    specialEquipment: true,
    maxExperimentScale: '中型实验设备操作',
    status: '1',
    create_time: '2025-12-01 11:00:00',
    update_time: '2025-12-01 11:00:00'
  },
  {
    id: 'job004',
    code: 'POS-PROD-001',
    name: '班组长',
    category: '生产序列',
    standardCount: 5,
    responsibilities: '负责班组日常生产管理，确保生产任务按时完成',
    safetyDuties: '执行安全操作规程，监督班组成员安全作业',
    emergencyDuties: '组织班组应急响应，上报安全事故',
    systemPermissions: '生产管理模块',
    dataPermissions: '班组生产数据访问权限',
    approvalPermissions: '班组内一般事务审批',
    educationRequirements: '大专及以上学历，相关专业',
    experienceRequirements: '3年以上生产经验',
    qualificationRequirements: '相关岗位证书',
    safetyTrainingRequirements: '安全生产培训，应急处理培训',
    riskLevel: 3,
    chemicalHandling: true,
    specialEquipment: true,
    maxExperimentScale: '常规设备操作',
    status: '1',
    create_time: '2025-12-01 11:45:00',
    update_time: '2025-12-01 11:45:00'
  },
  {
    id: 'job005',
    code: 'POS-SUPPORT-001',
    name: '安全员',
    category: '保障序列',
    standardCount: 2,
    responsibilities: '负责日常安全检查，隐患排查，安全培训组织',
    safetyDuties: '监督安全制度执行，检查安全设施，记录安全状况',
    emergencyDuties: '参与应急响应，协助事故调查',
    systemPermissions: '安全检查模块、培训模块',
    dataPermissions: '安全检查数据访问权限',
    approvalPermissions: '安全检查报告审批',
    educationRequirements: '大专及以上学历，安全相关专业',
    experienceRequirements: '2年以上安全工作经验',
    qualificationRequirements: '安全员证书',
    safetyTrainingRequirements: '安全员培训，应急处理培训',
    riskLevel: 2,
    chemicalHandling: false,
    specialEquipment: false,
    maxExperimentScale: '常规设备操作',
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
  modalTitle.value = '新增岗位';
  resetForm();
  modalVisible.value = true;
  activeTab.value = 'basic';
};

const showCategoryModal = () => {
  categoryModalVisible.value = true;
};

const editJobFn = (record: Job) => {
  modalTitle.value = '编辑岗位';

  // 基本信息
  formState.id = record.id;
  formState.code = record.code;
  formState.name = record.name;
  formState.category = record.category;
  formState.standardCount = record.standardCount;
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
    content: `确定要删除岗位"${record.name}"吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        // 模拟删除操作延迟
        await new Promise(resolve => setTimeout(resolve, 300));

        // 从数组中删除数据
        const index = jobs.findIndex(item => item.id === record.id);
        if (index !== -1) {
          jobs.splice(index, 1);
          message.success('删除岗位成功');

          // 重新加载数据
          smartTableRef.value?.refresh();
        } else {
          throw new Error('未找到要删除的岗位');
        }
      } catch (error) {
        console.error('删除岗位失败:', error);
        message.error('删除岗位失败');
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

    if (modalTitle.value === '新增岗位') {
      // 新增操作
      const newJob: Job = {
        id: generateId(),
        code: formData.code,
        name: formData.name,
        category: formData.category,
        standardCount: formData.standardCount,
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
      message.success('新增岗位成功');
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
        message.success('编辑岗位成功');
      } else {
        throw new Error('未找到要编辑的岗位');
      }
    }

    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增岗位' ? '新增岗位失败' : '编辑岗位失败');
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
    status: '1'
  };
};

// 岗位分类管理相关方法
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
  message.success('岗位分类更新成功');
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