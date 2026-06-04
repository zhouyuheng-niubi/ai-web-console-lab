<template>
  <Spin :spinning="isAllJudge" tip="AI综合诊断中..." size="large">
    <div class="digital-pro-container pt-[30px] pb-[30px] px-[30px] flex flex-col overflow-hidden  box-border"
      style="font-family: Source Han Sans CN;">
      <!-- 页面标题和操作栏 -->
      <div class="mb-[30px] flex  items-center flex-shrink-0">
        <Button type="primary" class="mr-[10px]" @click="showAddModal">
          <span class="flex items-center">
            <PlusOutlined />
            <span class="ml-1 leading-none">新增预案</span>
          </span>
        </Button>
        <Button type="primary" @click="handleAllJudgeAi">
          <span class="flex items-center">
            <span class="ml-1 leading-none">AI综合诊断</span>
          </span>
        </Button>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex-1 flex gap-[20px] overflow-hidden">
        <!-- 左侧预案类型树 -->
        <div class="bg-white rounded-[12px] p-[20px] shadow-sm w-[280px] flex-shrink-0 flex flex-col">
          <div class="mb-[16px] flex justify-between items-center">
            <div class="font-semibold text-[16px] text-[#454F64]">预案分类</div>
            <Button type="text" size="small" @click="refreshTree">
              <ReloadOutlined />
            </Button>
          </div>
          <div class="flex-1 overflow-auto">
            <Tree v-model:selectedKeys="selectedCategoryKeys" :tree-data="categoryTreeData"
              :field-names="{ title: 'plan_type_name', key: 'plan_type_id', children: 'children' }"
              :default-expand-all="true" :expanded-keys="expandedKeys" @select="handleCategorySelect" @expand="onExpand"
              class="category-tree" />
          </div>
        </div>

        <!-- 右侧预案列表 -->
        <div
          class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
          <SmartTable ref="smartTableRef" :api="apiConfig" :columns="columns" :search-config="searchConfig"
            :responseConfig="responseConfig" :pagination="paginationConfig" :paramsFormatter="paramsFormatter"
            searchLayout="horizontal" @loadSuccess="handleLoadSuccess" @loadError="handleLoadError"
            :searchButtonWrapperSpan="6" :immediateSearch="true" :actionColumn="actionColumn" @action="handleAction">
          </SmartTable>
        </div>
      </div>

      <!-- 新增/编辑预案弹窗 -->
      <Modal v-model:open="modalVisible" :width="modalFullscreen ? '100%' : '800px'" :confirm-loading="modalLoading"
        :wrap-class-name="modalFullscreen ? 'full-modal' : ''"
        @ok="handleModalOk" @cancel="handleModalCancel">
        <template #title>
          <div class="flex items-center justify-between w-full pr-[20px]">
            <span>{{ modalTitle }}</span>
            <Button type="text" size="small" @click="toggleModalFullscreen" class="flex items-center mt-[-6px] text-[30px]">
              <FullscreenExitOutlined v-if="modalFullscreen" />
              <FullscreenOutlined v-else />
            </Button>
          </div>
        </template>
        <AdvancedForm ref="formRef" :schema="formSchema" :model="formState" mode="form" formLayout="horizontal"
          :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <template #plan_content>
            <Spin :spinning="isFetching" :tip="isAiAnalysisMode ? '智能分析中...' : '智能编写中...'" size="large">
              <template v-if="!isAi">
                <div class="flex mb-[10px]">
                  <Button type="primary" size="small" @click="handleAiWrite()">AI写预案</Button>
                  <Upload accept=".doc,.docx" :maxCount="1" :showUploadList="false" class="ml-[10px]" size="small"
                    :customRequest="handleUpload">
                    <Button type="primary" size="small">
                      <span>
                        <UploadOutlined></UploadOutlined>
                        上传附件
                      </span>
                    </Button>
                  </Upload>
                </div>
              </template>

              <template v-else>
                <Button type="primary" class="mb-[10px] mr-[10px]" size="small" @click="handleCancelAi()">{{
                  isAiAnalysisMode ? '取消AI分析' : '取消AI编写' }}</Button>
                <Button @click="refreshAi()" type="primary" size="small">{{ isAiAnalysisMode ? '重新分析' : '重新编写'
                }}</Button>
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
      <Modal v-model:open="deleteModalVisible" title="确认删除" @ok="handleDelete" @cancel="deleteModalVisible = false">
        <p>确定要删除预案 "{{ currentPlan?.plan_name }}" 吗？此操作不可恢复。</p>
      </Modal>

      <!-- AI综合诊断：AI智能分析应急预案体系评估结果-弹窗 -->
      <Modal v-model:open="aiModalVisible" title="AI综合诊断" width="70vw" @ok="cancelAllJudge"
        @cancel="cancelAllJudge">
        <div v-if="!allJudgeContent.length" class="min-h-[200px] flex justify-center items-center">
          AI综合诊断编写中
          <Spin :spinning="true"></Spin>
        </div>
        <div v-else ref="allJudgeRef" class="max-h-[600px] overflow-y-auto"></div>
        <template #footer>
          <Button @click="cancelAllJudge">取消</Button>
          <Button type="primary" @click="cancelAllJudge">确定</Button>
          <Button type="primary" @click="handleAllDownLoad()">导出</Button>
        </template>
      </Modal>
    </div>
  </Spin>

</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch, h } from 'vue';
import {
  Button,
  Tree,
  message,
  Modal,
  Spin,
  Upload
} from 'ant-design-vue';
import {
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons-vue';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import { getAllNodeKeys } from '@/utils/tool';
import { useMainStore } from '@/store';
// 定义 SmartTable 组件需要的类型
interface ColumnItem<T = any> {
  dataIndex: string;
  key?: string;
  title: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  options?: any[];
  slot?: string;
  slotName?: string;
  type?: 'tag' | 'switch' | 'radio' | 'checkbox' | 'badge' | 'rate' | 'progress' | 'date' | 'date-range' | 'select' | 'slot';
  componentProps?: (value: any, record: T) => Record<string, any>;
  edit?: any;
  formatter?: (value: any, record: T) => string;
  render?: (value: any, record: T, index: number) => string;
}

interface SearchItem {
  field: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'date-range' | 'month' | 'year' | 'week' | 'quarter' | 'checkbox' | 'radio' | 'number' | 'switch';
  props?: any;
  rules?: any[];
  advanced?: boolean;
  labelCol?: any;
  wrapperCol?: any;
  colSpan?: number;
  rowSpan?: number;
  style?: Record<string, any>;
  placeholder?: string;
}
import dayjs from 'dayjs'
import { createEditor, createToolbar } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

// 导入静态数据和类型定义
import {
  DigitalPlan, PlanType, Department, accidentType,
  staticPlans, staticPlanTypes, staticDepartments, templatePlans, statusOptions
} from './digital-pro'

// 将树形结构的事故类型转换为平层数据
const flattenAccidentType = (treeData) => {
  const result = [];

  const traverse = (nodes) => {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        // 如果节点有子节点，递归处理子节点
        traverse(node.children);
      } else {
        // 如果是叶子节点，添加到结果中
        result.push({
          value: node.value,
          label: node.label
        });
      }
    });
  };

  traverse(treeData);
  return result;
};

// 表单状态
const formState = reactive({
  plan_id: '',
  plan_name: '',
  plan_type_id: null,
  department_id: null,
  status: 'draft' as 'draft' | 'active' | 'inactive',
  plan_content: '',
  responsible_person: '',
  accident_type: ''
});

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const modalFullscreen = ref(false);
const toggleModalFullscreen = () => {
  modalFullscreen.value = !modalFullscreen.value;
};
const deleteModalVisible = ref(false);
const modalTitle = ref('新增预案');
const currentPlan = ref<DigitalPlan>();
const formRef = ref();
const smartTableRef = ref();
const categoryTreeData = ref<PlanType[]>([]);
const departmentOptions = ref([]);
const selectedCategoryKeys = ref<string[]>([]);
const aiModalVisible = ref(false)

// WangEditor 配置
const editorRef = ref();
const editorToolbarRef = ref();
let editor = null;
let toolbar = null;

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
    editor = createEditor({
      selector: editorRef.value,
      html: preprocessHtml(formState.plan_content || ''),
      config: {
          placeholder: '请输入内容...',
          autoFocus: false,

          // 内容变化时：仅保留有效内容，不生成空白p
          onChange: (editor) => {
              const html = editor.getHtml();
              const processed = preprocessHtml(html);
              // 避免无限循环：仅内容不一致时更新
              if (processed !== html && processed !== '') {
                  editor.setHtml(processed);
              }
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
    setTimeout(() => {
      initEditor()
    }, 100)
  } else {
    destroyEditor()
  }
})

// 可变的静态数据，用于增删改操作
const dynamicPlans = ref<DigitalPlan[]>([...staticPlans]);

// 表格配置
const responseConfig = {
  listKey: 'plans',
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

// 表格列配置
const columns: ColumnItem<DigitalPlan>[] = [
  {
    title: '预案名称',
    dataIndex: 'plan_name',
    key: 'plan_name',
    width: '200px',
    ellipsis: true,
  },
  {
    title: '预案类型',
    dataIndex: 'plan_type_name',
    key: 'plan_type_name',
    width: '150px',
    ellipsis: true,
  },
  {
    title: '事故类型',
    dataIndex: 'accident_type',
    key: 'accident_type',
    width: '150px',
    type: 'select',
    ellipsis: true,
    options: flattenAccidentType(accidentType)
  },
  {
    title: '备案部门',
    dataIndex: 'department_name',
    key: 'department_name',
    width: '150px',
    type: 'slot',
    slotName: 'department_name'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '100px',
    type: 'tag',
    options: statusOptions
  },
  {
    title: '负责人',
    dataIndex: 'responsible_person',
    key: 'responsible_person',
    width: '100px'
  },
  // {
  //   title: '更新时间',
  //   dataIndex: 'update_time',
  //   key: 'update_time',
  //   width: '15%',
  //   formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  // },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    width: '200px',
    ellipsis: true,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'plan_name',
    label: '预案名称',
    type: 'input',
    placeholder: '请输入预案名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'plan_type_id',
    label: '预案类型',
    type: 'select',
    placeholder: '请选择预案类型',
    props: {
      allowClear: true,
      options: staticPlanTypes.flatMap(item => [
        { value: item.plan_type_id, label: item.plan_type_name },
        ...(item.children || []).map(child => ({ value: child.plan_type_id, label: child.plan_type_name }))
      ])
    },
    colSpan: 6
  },
  {
    field: 'accident_type',
    label: '事故类型',
    type: 'select',
    placeholder: '请选择事故类型',
    props: {
      allowClear: true,
      options: flattenAccidentType(accidentType)
    },
    colSpan: 6
  },
  {
    field: 'department_id',
    label: '备案部门',
    type: 'select',
    placeholder: '请选择备案部门',
    props: {
      allowClear: true,
      options: staticDepartments.map(item => ({ value: item.department_id, label: item.department_name }))
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
      options: statusOptions
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: '350px',
  fixed: 'right',
  actions: [
    {
      label: 'AI分析',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'aiAnalysis'
    },
    {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '导出',
      icon: 'ArrowDownOutlined',
      props: { type: 'link', size: 'small' },
      action: 'downLoad'
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete'
    },
  ]
};

// API 配置（使用动态数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;

  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));

  // 过滤数据
  let filteredData = dynamicPlans.value;

  if (rest.plan_name) {
    filteredData = filteredData.filter(item =>
      item.plan_name.includes(rest.plan_name)
    );
  }

  if (rest.plan_type_id) {
    filteredData = filteredData.filter(item =>
      item.plan_type_id === rest.plan_type_id
    );
  }

  if (rest.department_id) {
    filteredData = filteredData.filter(item =>
      item.department_id === rest.department_id
    );
  }

  if (rest.status) {
    filteredData = filteredData.filter(item =>
      item.status === rest.status
    );
  }

  if (rest.accident_type) {
    filteredData = filteredData.filter(item =>
      item.accident_type === rest.accident_type
    );
  }

  if (selectedCategoryKeys.value[0]) {
    // 获取选中分类及其所有子分类的ID
    const selectedCategoryId = selectedCategoryKeys.value[0];
    const selectedCategory = findPlanTypeById(staticPlanTypes, selectedCategoryId);

    if (selectedCategory && selectedCategory.children && selectedCategory.children.length > 0) {
      // 如果选中的是父分类，获取所有子分类的ID
      const childIds = flattenPlanTypeTree([selectedCategory]).map(item => item.plan_type_id);
      filteredData = filteredData.filter(item =>
        childIds.includes(item.plan_type_id)
      );
    } else {
      // 如果选中的是子分类，直接匹配
      filteredData = filteredData.filter(item =>
        item.plan_type_id === selectedCategoryId
      );
    }
  }

  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);

  return {
    plans: pagedData,
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
const typeOptions = computed(() => {

  return categoryTreeData.value.flatMap(item => [
    { value: item.plan_type_id, label: item.plan_type_name },
    ...(item.children || []).map(child => ({ value: child.plan_type_id, label: child.plan_type_name }))
  ])
})
// 表单配置
const formSchema = computed(() => [
  {
    key: 'plan_name',
    type: 'input',
    label: '预案名称',
    placeholder: '请输入预案名称',
    required: true,
    rules: [
      { required: true, message: '请输入预案名称', trigger: 'blur' },
      { min: 2, max: 100, message: '名称长度为2-100个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'plan_type_id',
    type: 'select',
    label: '预案类型',
    placeholder: '请选择预案类型',
    required: true,
    props: {
      options: typeOptions.value,

    },
    rules: [
      { required: true, message: '请选择预案类型', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'accident_type',
    type: 'select',
    label: '事故类型',
    placeholder: '请选择事故类型',
    required: true,
    props: {
      options: flattenAccidentType(accidentType),
      allowClear: true
    },
    rules: [
      { required: true, message: '请选择事故类型', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'department_id',
    type: 'select',
    label: '备案部门',
    placeholder: '请选择备案部门',
    props: {
      options: departmentOptions.value,
      allowClear: true
    },
    colSpan: 12
  },
  {
    key: 'responsible_person',
    type: 'input',
    label: '负责人',
    placeholder: '请输入负责人姓名',
    rules: [
      { min: 2, max: 20, message: '负责人姓名长度为2-20个字符', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'status',
    type: 'radioGroup',
    label: '状态',
    required: true,
    props: {
      options: statusOptions
    },
    rules: [
      { required: true, message: '请选择状态', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'plan_content',
    type: 'input',
    label:isAiAnalysisMode.value? '预案分析':'预案内容',
    placeholder: '请输入预案详细内容',
    props: {
      type: 'textarea',
      rows: 6,
      showCount: true
    },
    colSpan: 24
  }
]);

// 扁平化树形结构
const flattenPlanTypeTree = (tree: PlanType[]): PlanType[] => {
  const result: PlanType[] = [];

  const traverse = (nodes: PlanType[]) => {
    nodes.forEach(node => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };

  traverse(tree);
  return result;
};

// 根据ID查找预案类型
const findPlanTypeById = (tree: PlanType[], id: string): PlanType | undefined => {
  for (const node of tree) {
    if (node.plan_type_id === id) {
      return node;
    }
    if (node.children) {
      const found = findPlanTypeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

// 方法
const showAddModal = () => {
  modalTitle.value = '新增预案';
  resetForm();
  console.log(formState, 'formState')
  modalVisible.value = true;
};

const editPlanFn = async (record: DigitalPlan) => {
  try {
    modalTitle.value = '编辑预案';
    formState.plan_id = record.plan_id;
    formState.plan_name = record.plan_name;
    formState.plan_type_id = record.plan_type_id;
    formState.department_id = record.department_id || '';
    formState.responsible_person = record.responsible_person || '';
    formState.status = record.status;
    formState.accident_type = record.accident_type || '';
    setTimeout(() => {
      formState.plan_content = record.plan_content || '';
      modalVisible.value = true;
    })

  } catch (error) {
    console.error('获取预案详情失败:', error);
    message.error('获取预案详情失败');
  }
};

const confirmDelete = (record: DigitalPlan) => {
  currentPlan.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    const formData = { ...formState };

    // 获取类型名称和部门名称
    const selectedType = findPlanTypeById(categoryTreeData.value, formData.plan_type_id);
    const selectedDept = staticDepartments.find(item => item.department_id === formData.department_id);

    if (modalTitle.value === '新增预案') {
      // 新增操作
      const newPlan: DigitalPlan = {
        plan_id: `plan${Date.now()}`, // 生成唯一ID
        plan_name: formData.plan_name,
        plan_type_id: formData.plan_type_id,
        plan_type_name: selectedType?.plan_type_name || '',
        department_id: formData.department_id || '',
        department_name: selectedDept?.department_name || '',
        status: formData.status,
        responsible_person: formData.responsible_person || '',
        plan_content: formData.plan_content || '',
        accident_type: formData.accident_type || '',
        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };

      dynamicPlans.value.unshift(newPlan);
      message.success('新增预案成功');
    } else {
      // 编辑操作
      const index = dynamicPlans.value.findIndex(item => item.plan_id === formData.plan_id);
      if (index !== -1) {
        dynamicPlans.value[index] = {
          ...dynamicPlans.value[index],
          plan_name: formData.plan_name,
          plan_type_id: formData.plan_type_id,
          plan_type_name: selectedType?.plan_type_name || '',
          department_id: formData.department_id || '',
          department_name: selectedDept?.department_name || '',
          status: formData.status,
          responsible_person: formData.responsible_person || '',
          plan_content: formData.plan_content || '',
          accident_type: formData.accident_type || '',
          update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        message.success('编辑预案成功');
      }
    }

    modalVisible.value = false;
    isFetching.value = false
    isAi.value = false
    isAiAnalysisMode.value = false
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增预案' ? '新增预案失败' : '编辑预案失败');
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  if (controller) controller.abort();
  isFetching.value = false
  isAi.value = false
  isAiAnalysisMode.value = false // 重置AI分析模式
  reponseHtml.value = ''
  resetForm();
};

const handleUpload = () => {
  message.info('功能开发中，敬请期待')
}
const handleDelete = async () => {
  try {
    if (!currentPlan.value) return;

    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 从动态数据中删除对应记录
    const index = dynamicPlans.value.findIndex(item => item.plan_id === currentPlan.value?.plan_id);
    if (index !== -1) {
      dynamicPlans.value.splice(index, 1);
      message.success('删除预案成功');
    } else {
      message.error('未找到要删除的预案');
    }

    deleteModalVisible.value = false;
    currentPlan.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除预案失败:', error);
    message.error('删除预案失败');
  }
};

const resetForm = () => {
  formState.plan_id = '';
  formState.plan_name = '';
  formState.plan_type_id = '';
  formState.department_id = '';
  formState.responsible_person = '';
  formState.status = 'draft';
  formState.accident_type = '';
  formState.plan_content = '';
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
const handleAction = (action: string, record: DigitalPlan, index: number) => {
  switch (action) {
    case 'edit':
      editPlanFn(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    case 'aiAnalysis':
      editPlanFn(record)
      isAiAnalysisMode.value = true; // 设置为AI分析模式
      setTimeout(() => {
        handleAi();
      }, 100);
      
      break;
    case 'downLoad':
      handleDownLoad(record)
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

// 树形结构相关
const handleCategorySelect = (selectedKeys: string[], info: any) => {
  selectedCategoryKeys.value = selectedKeys;
  smartTableRef.value?.refresh();
};
const onExpand = (expandedKeysValue) => {
  expandedKeys.value = expandedKeysValue;
};


const refreshTree = async () => {
  await loadPlanTypes();
  message.success('分类树刷新成功');
};
const expandedKeys = ref([])
// 获取预案类型树（使用静态数据）
const loadPlanTypes = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    categoryTreeData.value = staticPlanTypes;
    expandedKeys.value = getAllNodeKeys(staticPlanTypes);
    // 更新搜索配置中的类型选项
    const typeSearchItem = searchConfig.find(item => item.field === 'plan_type_id');
    if (typeSearchItem) {
      typeSearchItem.props.options = categoryTreeData.value.flatMap((item: PlanType) => [
        { value: item.plan_type_id, label: item.plan_type_name },
        ...(item.children || []).map((child: PlanType) => ({ value: child.plan_type_id, label: child.plan_type_name }))
      ]);
    }
  } catch (error) {
    console.error('加载预案类型失败:', error);
  }
};

// 获取部门列表（使用静态数据）
const loadDepartments = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    departmentOptions.value = staticDepartments.map((department: Department) => ({
      value: department.department_id,
      label: department.department_name
    }));
  } catch (error) {
    console.error('加载部门列表失败:', error);
  }
};

const isfail = ref(false);
// 综合研判
const allJudgeContent = ref('')
const allJudgeRef = ref<HTMLElement | null>(null)

// 使用 Shadow DOM 隔离 AI 综合诊断内容的样式
watch(allJudgeContent, (newVal) => {
  if (allJudgeRef.value && newVal) {
    const shadowRoot = allJudgeRef.value.shadowRoot || allJudgeRef.value.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = newVal
  }
})

const handleAllJudgeAi = async () => {

  if (isFetching.value) return;
  isFetching.value = true;

  // 只有在有活动的controller时才中止
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();

  let reader = null;
  allJudgeContent.value = ''
  const aiAnalysisApi = `${import.meta.env.VITE_NEWAI_API}/ai/analysis/material/jaa`
  isAllJudge.value = true;
  try {
    // 获取所有预案数据
    const response = await apiConfig({ pageNum: 1, pageSize: 100 });
    const allPlans = response.plans;

    // 统计预案类型和数量
    const planTypeStats = {};
    allPlans.forEach(plan => {
      const typeName = plan.plan_type_name || '未知类型';
      if (!planTypeStats[typeName]) {
        planTypeStats[typeName] = 0;
      }
      planTypeStats[typeName]++;
    });
    
    // 构建统计信息字符串
    const statsInfo = Object.entries(planTypeStats)
      .map(([typeName, count]) => `${typeName}：${count}份应急预案`).join('，');
    
    // 准备发送给AI分析的数据
    const materialContent = allPlans.map(plan =>
      `${plan.plan_name}:
${plan.plan_content || ''}
`
    ).join('');

    // 构建请求体
    const analysisData = {
      question: `请对以下企业级应急预案体系进行全面分析，评估每一个预案内容的完整性、可操作性和覆盖范围，并提出改进建议。统计信息：${statsInfo}，注：报告日期:${dayjs().format('YYYY-MM-DD HH:mm:ss')}，总预案数：${allPlans.length}份`,
      material: materialContent,
      session_id: "" // 可选字段，可以留空
    };

    // 调用AI分析接口
    const aiResponse = await fetch(aiAnalysisApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysisData),
      signal: controller.signal,
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`AI分析接口错误: ${aiResponse.status} ${aiResponse.statusText}, details: ${errorText}`);
    }

    console.log('aiResponse:', aiResponse)

    // 处理AI返回的分析结果

    // // 构建诊断结果内容
    // const contentArray = [];

    if (!aiResponse) {
      isFetching.value = false;
      return;
    }
    isAllJudge.value = false;
    aiModalVisible.value = true;

    reader = aiResponse.body.getReader();
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
                allJudgeContent.value += content;
              }
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('解析错误1:', error);
            }
            isfail.value = true;
          }
        }
      }
    }

    // // 添加AI分析结果
    // if (analysisResult && analysisResult.data) {
    //   contentArray.push(h('div', { innerHTML: analysisResult.content }));
    // } else {
    //   // 如果AI接口没有返回内容，使用本地生成的内容
    //   contentArray.push(h('p', {}, '通过对应急预案体系的全面分析，系统识别出以下改进机会：'));

    //   // 显示内容完整的预案
    //   const completePlans = allPlans.filter(plan => plan.plan_content && plan.plan_content.length >= 200);
    //   if (completePlans.length > 0) {
    //     contentArray.push(h('p', { style: { fontWeight: 'bold', marginTop: '10px' } }, `✅ 内容完整预案（${completePlans.length}个）:`));
    //     const completePlanNames = completePlans.map(plan => plan.plan_name).join('、');
    //     contentArray.push(h('p', { style: { marginLeft: '20px', color: '#52c41a' } }, completePlanNames));
    //   }

    //   // 显示需要补充完善的预案
    //   const needImprovePlans = allPlans.filter(plan => plan.plan_content && plan.plan_content.length < 200);
    //   if (needImprovePlans.length > 0) {
    //     contentArray.push(h('p', { style: { fontWeight: 'bold', marginTop: '10px' } }, `⚠️ 需补充完善预案（${needImprovePlans.length}个）:`));
    //     const needImproveNames = needImprovePlans.map(plan => plan.plan_name).join('、');
    //     contentArray.push(h('p', { style: { marginLeft: '20px', color: '#faad14' } }, needImproveNames));
    //   }

    //   // 添加专业建议
    //   contentArray.push(h('p', { style: { fontWeight: 'bold', marginTop: '15px' } }, '专业建议：'));
    //   contentArray.push(h('p', { style: { marginLeft: '20px' } }, '1. 优先完善内容不足的预案，确保涵盖应急响应全流程'));
    //   contentArray.push(h('p', { style: { marginLeft: '20px' } }, '2. 定期评审预案内容，结合实际演练情况持续优化'));
    //   contentArray.push(h('p', { style: { marginLeft: '20px' } }, '3. 加强预案培训，提升应急响应效率'));
    // }

    isAllJudge.value = false;

    // Modal.info({
    //   title: 'AI智能分析应急预案体系评估结果',
    //   width: 600,
    //   content: allJudgeContent.value,//h('div', { style: { maxHeight: '400px', overflow: 'auto' } }, allJudgeContent.value),
    //   okText: '关闭',
    //   onOk() {
    //     console.log('ok');
    //   },
    // });
  } catch (error) {
    // console.error('AI综合诊断失败:', error);
    // message.error('AI综合诊断失败，请稍后重试');

    // 如果是中止错误，不显示错误信息
    if (error.name === 'AbortError') {
      console.log('流读取被中止');
      return;
    }
    console.error('解析错误2:', error);
    isAllJudge.value = false;

    isFetching.value = false;
    isfail.value = true;
  } finally {
    isFetching.value = false;
    // 只有在reader存在时才取消
    if (reader) {
      try {
        await reader.cancel();
      } catch (cancelError) {
        // 忽略取消错误
      }
    }
  }
};
const cancelAllJudge = () => {
  aiModalVisible.value = false
  if (controller) {
    controller.abort();
  }
}




// // 配置docx为新版格式（非兼容模式）
// const docxOptions = {
//   // 关键：设置兼容性级别为 Word 2016（对应 w:compatSetting 中的版本）
//   compatibility: {
//     compatibilityMode: 15, // 15 = Word 2013/2016，14=Word 2010，12=Word 2007
//     overrideTableStyleFontSizeAndJustification: true,
//   },
//   // 可选：设置文档属性为新版
//   document: {
//     title: '危险化学品泄漏应急预案',
//     creator: '系统',
//     lastModifiedBy: '系统',
//     revision: 1,
//     created: new Date(),
//     modified: new Date(),
//   },
//   // 可选：强制使用新版Word的XML命名空间
//   namespace: 'http://schemas.microsoft.com/office/word/2012/wordml',
// };


const handleAllDownLoad =() => {
  handleDownLoad({plan_name:"企业预案综合诊断报告",plan_content:allJudgeContent.value})
}
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
          ${record.plan_content}
        </body>
      </html>
    `;
  // 转换为Word文档并下载
  asBlob(html).then((res: any) => {
    saveAs(
      new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
      `${record.plan_name}${isAiAnalysisMode.value?'（分析报告）':''}${dayjs().format('YYYY-MM-DD HH:mm:ss')}.docx`,
    );
  });
}

// ai分析
let controller: any = null; // 存储 AbortController

// 获取 store 实例
const store = useMainStore();
const isAi = ref(false)
const isFetching = ref(false)
const isAllJudge = ref(false)
const reponseHtml = ref('')
const aiResponseRef = ref<HTMLElement | null>(null)
let currentHtml = ''
const isAiAnalysisMode = ref(false)

// 使用 Shadow DOM 隔离 AI 响应内容的样式
watch(reponseHtml, (newVal) => {
  if (aiResponseRef.value && newVal) {
    const shadowRoot = aiResponseRef.value.shadowRoot || aiResponseRef.value.attachShadow({ mode: 'open' })
    shadowRoot.innerHTML = newVal
  }
})
const handleCancelAi = () => {
  if (controller) {
    controller.abort();
    isFetching.value = false
    isAi.value = false
    isAiAnalysisMode.value = false // 重置AI分析模式
    reponseHtml.value = ''
    formState.plan_content = currentHtml
  }
}

const refreshAi = () => {
  if (controller) {
    controller.abort();
    isFetching.value = false
    reponseHtml.value = ''
    handleAi()
  }
}

const handleAiWrite = async () => {
  isAiAnalysisMode.value = false; // 设置为写预案模式
  handleAi();
}
// 格式要求
const totalFormat = () => {
  const current_date = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return `
    ## 格式规范及强制自验证要求
    ### （一）格式规范细则
    1. 报告标题：
      - 使用'<p>[生成的报告标题]</p>'标签包裹，字体采用黑体加粗，必须居中显示
      - 示例：如果用户已经固定了报告标题就必须使用用户的提供的标题，其他根据内容生成报告标题，如问题是"应急预案体系如何评估"，标题应为"应急预案体系评估结果报告"
    2. 报告日期：固定在报告标题下方，统一格式为"报告日期：${current_date}"，居中显示，字体为小四（12pt）宋体，西文/数字用Times New Roman。
    3. 标题层级格式：
        报告标题:字体采用黑体加粗，必须居中显示
      - 一级标题：段前段后各1行，左对齐；
      - 二级标题：段前段后各0.5行，左对齐；
      - 三级标题：左对齐，段前段后各0.5行（与正文段落间距保持一致）；
      - 四级标题：首行缩进2字符，加粗，左对齐，段前段后各0.5行。
    4. 文档整体格式：
      - 中文字体：宋体；西文/数字字体：Times New Roman；
      - 正文字号：小四（12pt）；行距：1.5倍；
      - 段落间距：段前0.5行，段后0.5行；
      - 对齐方式：全文两端对齐（标题、报告日期除外，按对应要求对齐）；
      - 段落首行缩进：2字符（标题、报告日期、表格内容除外）。
    5. 其他规则：
      - 报告结尾：禁止出现报告单位、"以上报告"等收尾表述；
      - 数据需要排列清晰，确保可以一眼看清、一目了然，无任何格式错误；
      - 图表信息需配备适当的标题和说明文字，确保图表与正文内容相符；
      - 数据表格需要表头清晰，数据对齐，确保可读性。

    ### （二）AI自验证强制流程
    生成报告后，需按以下步骤自动校验格式，确保完全符合要求，未通过校验需重新调整：
    1. 标签校验：检查报告标题是否用'<p>'标签包裹且居中，无多余标签或缺失标签；
    2. 标题层级校验：逐一核对各级标题的字体、字号、加粗状态、对齐方式及段前段后间距，确保与对应层级要求一致；
    3. 文本格式校验：
      - 随机抽取3处正文段落，检查字体、字号、行距、段落间距、首行缩进及对齐方式是否符合规范；
      - 检查所有西文/数字（如日期、数量、百分比等）是否使用Times New Roman字体；
    4. 图表表格校验：
      - 确认所有图表都有对应的标题和说明文字；
      - 检查数据表格表头完整，数据对齐正确；
    5. 整体兼容性校验：确保HTML代码可直接在Word中打开，格式不错乱；
    6. 数据排列校验：确保所有数据排列清晰，确保可以一眼看清、一目了然，无任何格式错误；

    ## 三、输出要求
    最终以HTML格式输出完整报告，输出内容仅包含HTML代码，关于style绑定的属性样式都有添加!important，无任何格式说明、注释等额外文字，确保代码可直接复制使用且格式100%符合上述规范。
  
  `
}
// 封面页
const coverString = `
安全生产事故应急预案发布令
为了贯彻《中华人民共和国安全生产法》及其它法律法
规、规范的要求，保护单位员工的生命安全、减少单位财产
损失，使事故发生后能快速、有效、有序的实施应急救援，
本单位特组织相关部门编制了《XXX有限公司生产安全事故
应急预案》，该预案是实施应急教援的规范性文件，用于指
导本单位生产安全生产事故的应急救援行动。
本安全生产事故应急预案由综合预案、专项预案、现场
处置方案等组成，经专家评审、确认后，于2025年X月X
日批准发布，2025年X月X日正式实施，
本单位内所有员工均应严格遵守执行。
XXX有限公司
主要负责人：
2025年X月X日
`

// 目录结构要求
const directoryString = `
目录
1总则
1.1编制目的
1.2编制依据
1.3适用范围
1.4应急预案体系
1.5应急工作原则
2事故风险描述
2.1生产经营单位的基本情况
2.2危险源与风险评估
2.3重大危险源辨识
2.4重点防护目标
3应急组织机构及职责
3.1指挥机构
3.2主要职责
4预警及信息报告
4.1预警
4.2信息报告
5应急响应
5.1响应分级
5.2响应程序
5.3处置措施
5.4应急结束
6信息公开
6.1信息发布程序
6.2信息发布原则
7后期处置
7.1污染物处理
7.2生产秩序恢复
7.3医疗救治
7.4人员安置
7.5善后赔偿
7.6应急数援预案评估
8保障措施
8.1通信与信息保障
8.2应急队伍保障
8.3物资装备保障
8.4其他保障
9应急预案管理
9.1应急预案培训
9.2应急预案演练
9.3应急预案修订
9.4应急预案各案
9.5应急预案实施
10附件
附件1：应急救援指挥序列图.
附件2：事故应急救援指挥领导小组、事故应急救援专业
附件3：应急通讯
附件4：应急物资装备一览表
附件5：Maintainer边企业可调用应急物资清单
附件6：事故现场处置方案
附件7：公司危险物质主要危险特性
附件8：主要易燃物质适用灭火剂
附件9：厂区平面布置图
附件10：应急设施物资分布图
附件11：报警系统分布图及覆盖范围
附件12：人员撤离、疏散通道
附件13：应急救援指挥部位置及救援队伍行动路线图
附件14：企业位置分布图
`

// 应急预案编写实施方案
const planFlow = `

## 一、前期准备阶段（标准落实的基础）

### 1. 风险评估先行
- **收集资料**：历史事故案例、行业风险特点、脆弱性分析（人员密集区、敏感设施等）
- **风险筛选**：用风险矩阵确定**高概率、高后果**的情景优先级
- **工具建议**：HAZOP分析、德尔菲法专家咨询

### 2. 组建编写团队
| 角色 | 职责 |
|------|------|
| 牵头部门 | 统筹整体流程，协调各方资源 |
| 技术专家 | 提供行业风险分析、情景演化逻辑 |
| 一线人员 | 提供实操经验，验证任务可行性 |
| 法务/合规 | 确保符合法规要求 |


## 二、核心编写流程（"情景—任务—能力"三步法）

### 第一步：情景开发（解决"会发生什么"）

**输出物：情景简表 + 事件演化图**

| 要素 | 具体内容示例（以化工泄漏为例） |
|------|------------------------------|
| 情景名称 | 某储罐区有毒气体泄漏事故 |
| 触发条件 | 设备老化、操作失误、外部撞击 |
| 演化阶段 | 0-15分钟（初期泄漏）→15-60分钟（扩散蔓延）→60分钟后（区域影响） |
| 次生衍生 | 可能引发火灾、人员中毒、环境污染 |
| 关键节点 | 15分钟内完成警戒，30分钟内启动疏散 |

**实操要点**：
- 每个情景都要画出**时间轴事件链**
- 明确每个阶段的**触发条件、影响范围、应对要求**


### 第二步：任务梳理（解决"要做什么"）

**输出物：任务清单 + 职责分工表**

按"预防—监测—预警—响应—处置—恢复"全链条分解：

示例：初期泄漏控制任务
├── 任务名称：初期泄漏控制
├── 责任主体：企业应急队（主导）+ 属地消防站（支援）
├── 协作关系：环保组监测、医疗组待命
├── 启动条件：泄漏报警 + 现场确认无爆炸风险
├── 资源需求：堵漏工具、防护服、泡沫灭火剂、应急车辆
├── 关键节点：30分钟内完成堵漏，60分钟内控制扩散
└── 信息报告：每15分钟向指挥部汇报进展

**实操要点**：
- 采用**"任务—部门—岗位"三级分解**，避免"无人认领"
- 每个任务明确**谁来做、做什么、何时做、资源从哪来**



### 第三步：能力分析（解决"能不能做"）

**输出物：能力评估表 + 提升计划**

| 能力项 | 现有水平 | 缺口分析 | 提升措施 | 完成时限 |
|--------|----------|----------|----------|----------|
| 初期堵漏 | 基础技能具备 | 缺大型堵漏设备 | 采购专业设备/签订外援协议 | 3个月内 |
| 人员疏散 | 每季度演练 | 夜间疏散效率低 | 增加夜间演练频次 | 持续改进 |
| 通信保障 | 常规对讲机 | 无防爆通信设备 | 配备防爆对讲机 | 1个月内 |

**实操要点**：
- 对照任务清单逐项评估
- 提出**可量化的改进目标**（如"泡沫灭火剂储备从2天提升至5天"）

## 三、预案文本编制（将分析转化为条款）

### 预案结构建议
1. 总则（目的、依据、适用范围）
2. 风险分析与情景描述 ← 直接引用情景简表
3. 应急组织体系 ← 对应任务梳理中的职责分工
4. 应急响应程序 ← 按情景阶段细化
   - 4.1 信息报告（明确时限、渠道、内容）
   - 4.2 先期处置（0-30分钟任务清单）
   - 4.3 扩大响应（30分钟后升级机制）
5. 应急保障 ← 对应能力分析结果
   - 队伍保障、物资装备、通信保障、资金保障
6. 培训与演练 ← 明确频次、内容、评估方式
7. 附则（术语、预案管理、修订机制）

**关键转化点**：
- 情景分析结果 → 写入"风险分析与情景描述"章节
- 任务清单 → 转化为"应急响应程序"的操作步骤
- 能力缺口 → 转化为"应急保障"的补充计划


## 四、闭环管理机制（持续改进）

### 1. 演练验证
- **脚本设计**：以情景为依据，模拟真实演化过程
- **评估重点**：任务完成度、时间节点达成率、能力匹配度
- **输出**：演练评估报告（可参照GB/T 46792-2025）

### 2. 事故复盘
- 将实际事故调查结果**反向输入**情景库
- 更新情景假设、优化应对措施

### 3. 定期修订
| 触发条件 | 修订内容 |
|----------|----------|
| 每年例行评估 | 更新联系方式、调整资源清单 |
| 演练/事故后 | 优化任务流程、补充能力短板 |
| 法规变更/工艺调整 | 重新进行情景筛选 |


## 五、快速落地清单

**立即行动项**：
- [ ] 梳理本单位/本区域近5年事故案例
- [ ] 识别3-5个最高优先级情景
- [ ] 绘制第一个情景的事件演化图
- [ ] 召开跨部门研讨会，明确任务分工
- [ ] 对照现有预案，标注需要补充的内容

**工具模板**（可向应急管理部门索取或自制）：
- 情景简表模板
- 任务支撑要素分析表
- 能力评估与提升计划表
`


const handleAi = async () => {
  let reader = null;
  const plan_type_name = typeOptions.value.find(item => item.value === formState.plan_type_id)?.label
  const accident_type_name =flattenAccidentType(accidentType).find(item => item.value === formState.accident_type)?.label
  if (!formState.plan_name) return message.info('请输入预案名称')
  if (!plan_type_name) return message.info('请选择预案类型')
  try {
    isAi.value = true
    isFetching.value = true

    let message = '';
    if (isAiAnalysisMode.value) {
      // AI分析模式：对现有预案内容进行分析和改进建议
      message = `
        依据中华人民共和国国家标准GB/T 46791-2025《应急预案情景构建方法》的核心条款及具体要求、预案实施方案：${planFlow}和基本目录结构：${directoryString}、预案主题，对以下预案内容进行全面分析并提出针对性改进意见：
        预案名称：${formState.plan_name}
        预案类型：${plan_type_name}
        事故类型：${accident_type_name}
        当前内容：${formState.plan_content}
        适用范围：需明确适配的层级：${store.companyInfo.name || '化工材料安全生产企业'}、企业说明：${store.companyInfo.description}、企业规模：${store.companyInfo.scale}、覆盖区域及对应突发事件类型
        报告日期：${dayjs().format('YYYY-MM-DD HH:mm:ss')}
        报告标题：${formState.plan_name}预案分析报告
        场景构建：根据预案名称、预案类型、事故类型，结合GB-T 46791-2025《应急预案情景构建方法》.pdf文件构建场景方法、要素，实现场景构建。
        【GB/T 46791-2025核心参考内容】
        1. 核心逻辑：以"情景-任务-能力"为主线，基于风险评估，通过情景筛选开发、应急任务梳理、能力分析，明确应对流程、职责和措施。
        2. 情景构建要求：
          - 情景筛选需满足代表性/典型性、后果严重性、影响范围与处置难度、任务覆盖面（5.1.1）；
          - 情景开发需包含情景概要、背景信息（主体/地理/社会/假设条件）、演化过程（潜伏期/爆发期/持续期/消退期）、事件后果（人员伤亡/财产损失/服务中断等7类影响）（5.2.1.2）。
        3. 应急任务分类：需覆盖预防与应急准备、监测与预警、应急处置与救援（先期处置/专业救援/协同应急）、事后恢复与重建四阶段（6.1.1），明确主责部门、协同部门及职责（6.1.2）。
        4. 应急能力要素：包括组织架构、运行机制、人员与队伍、物资装备、应急预案和演练培训（7.2.1），需对比需求与现状，制定提升计划（7.4）。
        5. 预案评估6大维度：全面性（覆盖全部任务）、衔接性（任务/信息/资源/响应升级）、任务主体完整性、任务程序可行性、任务可持续性（业务中断备选方案）、支撑资源完备性（8.1.2-8.1.7）。
        6. 实操工具要求：需配套情景简表（附录B）、任务支撑要素分析表（附录C）、应急能力评估与提升计划表（附录D）。

        【分析维度】
        1. 完整性：对照目录结构内容：${directoryString}和上述核心参考内容，分析预案是否涵盖"情景-任务-能力"全链条；是否满足预案评估6大维度要求；是否覆盖四阶段应急任务及7类事件后果。
        2. 可操作性：分析预案是否明确任务分工与执行程序；是否考虑业务中断场景的备选方案；是否配套标准要求的实操表单；是否明确演练与动态改进机制。
        3. 覆盖范围：分析情景筛选是否符合4项要求；是否涵盖次生衍生事件影响；是否适配对应层级及相关组织的应急需求。
        4. 合规性：分析情景开发是否包含全部核心要素；能力分析是否覆盖6大能力要素；与相关预案的衔接是否一致。

        【改进建议要求】
        1. 需结合上述GB/T 46791-2025核心参考内容，提出具体补充/优化方案（如缺失的情景要素、任务清单、表单模板等）；
        2. 针对问题项，可标注对应标准条款或参考内容序号（例如"依据【核心参考内容2】，需补充情景演化过程的爆发期关键节点描述"）；
        3. 建议需落地可行，包括情景优化、任务细化、能力提升、表单完善、衔接机制健全等方向。
        `;
    } else {
      // AI写预案模式：根据预案名称和类型生成新的预案
      message = `
        根据目录结构内容：${directoryString}，结合预案实施方案：${planFlow}、预案主题内容、场景构建内容，生成一份完整的《${formState.plan_name}》应急预案。
        特别注意：编写预案内容之前，必须根据预案名称、预案类型、事故类型要素构建场景，分析场景情况和要素，结合提供的目录结构生成应急预案，其中目录结构部分内容是必须要在预案内容中体现，可以根据预案名称、预案类型等剔除一些不必要的。
        一、预案基础信息
        预案名称：${formState.plan_name}
        预案类型：${plan_type_name}
        事故类型：${accident_type_name}
        报告日期：${dayjs().format('YYYY-MM-DD HH:mm:ss')}
        报告标题：${formState.plan_name}
        适用范围：需明确适配的层级：${store.companyInfo.name || '化工材料安全生产企业'}、企业说明：${store.companyInfo.description}、企业规模：${store.companyInfo.scale}、覆盖区域及对应突发事件类型
        二、场景构建
        根据预案名称、预案类型、事故类型，结合GB-T 46791-2025《应急预案情景构建方法》.pdf文件构建场景方法、要素，实现场景构建。
        三、【GB/T 46791-2025核心参考内容】
        1. 核心逻辑：以"情景-任务-能力"为主线，基于风险评估，通过情景筛选开发、应急任务梳理、能力分析，明确应对流程、职责和措施。
        2. 情景构建要求：
          - 情景筛选需满足代表性/典型性、后果严重性、影响范围与处置难度、任务覆盖面（5.1.1）；
          - 情景开发需包含情景概要、背景信息（主体/地理/社会/假设条件）、演化过程（潜伏期/爆发期/持续期/消退期）、事件后果（人员伤亡/财产损失/服务中断等7类影响）（5.2.1.2）。
        3. 应急任务分类：需覆盖预防与应急准备、监测与预警、应急处置与救援（先期处置/专业救援/协同应急）、事后恢复与重建四阶段（6.1.1），明确主责部门、协同部门及职责（6.1.2）。
        4. 应急能力要素：包括组织架构、运行机制、人员与队伍、物资装备、应急预案和演练培训（7.2.1），需对比需求与现状，制定提升计划（7.4）。
        5. 预案评估6大维度：全面性（覆盖全部任务）、衔接性（任务/信息/资源/响应升级）、任务主体完整性、任务程序可行性、任务可持续性（业务中断备选方案）、支撑资源完备性（8.1.2-8.1.7）。
        6. 实操工具要求：需配套情景简表（附录B）、任务支撑要素分析表（附录C）、应急能力评估与提升计划表（附录D）。
        `
        
    }
    message = message + " "+ totalFormat()

    const response = await getAiData(message);
    if (!response) {
      isFetching.value = false;
      isAi.value = false
      return;
    }
    currentHtml = formState.plan_content
    reponseHtml.value = ''
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
            isAi.value = true
            formState.plan_content = reponseHtml.value
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

  }
}
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


watch(() => formState.plan_type_id, () => {
  formState.plan_content = templatePlans[formState.plan_type_id] || '';
  if (editor) {
    editor.setHtml(formState.plan_content)
  }
});

onMounted(() => {
  loadPlanTypes();
  loadDepartments();
});
</script>

<style scoped>
.digital-pro-container {
  height: 100%;
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

:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.ant-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.ant-tree) {
  background: transparent;
}

:deep(.ant-tree-title) {
  font-size: 14px;
}

:deep(.ant-tree-node-content-wrapper) {
  padding: 4px 8px;
  border-radius: 4px;
}

:deep(.ant-tree-node-content-wrapper:hover) {
  background-color: #f5f5f5;
}

:deep(.ant-tree-node-content-wrapper.ant-tree-node-selected) {
  background-color: #e6f7ff;
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