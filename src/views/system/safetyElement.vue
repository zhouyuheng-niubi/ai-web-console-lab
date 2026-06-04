<template>
  <div class="safety-element-container p-[16px] flex flex-col overflow-hidden box-border" style="font-family: Source Han Sans CN;">
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="leading-none ml-1">新增要素</span>
        </span>
      </Button>
    </div>

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

    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      :zIndex="1200"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除要素 "{{ currentElement?.name }}" 吗？此操作不可恢复。</p>
      <p class="text-orange-500 mt-2" v-if="hasChildren">
        该要素下存在子要素，删除将同时删除所有子要素！
      </p>
      <p class="text-gray-600 mt-2">
        删除后，该要素将不再可用。
      </p>
    </Modal>

    <!-- 子要素管理弹窗 -->
    <Modal 
      v-model:open="subElementModalVisible" 
      :title="`管理 '${currentParentElement?.name}' 的子要素`" 
      width="1200px"
      :footer="null"
      @cancel="handleSubElementModalCancel"
      :zIndex="900"
    >
      <div class="sub-elements-management">
        <div class="mb-[20px] flex justify-between">
          <Button type="primary" style="background-color: #4362EF;" @click="showAddSubElementModal">
            <span class="flex items-center">
              <PlusOutlined />
              <span class="leading-none ml-1">新增子要素</span>
            </span>
          </Button>
        </div>
        
        <SmartTable
          ref="subElementTableRef"
          :api="subElementApiConfig"
          :columns="subElementColumns"
          :search-config="subElementSearchConfig"
          :responseConfig="responseConfig"
          :pagination="subElementPaginationConfig"
          :paramsFormatter="paramsFormatter"
          searchLayout="horizontal"
          @loadSuccess="handleSubElementLoadSuccess"
          @loadError="handleSubElementLoadError"
          :searchButtonWrapperSpan="6"
          :immediateSearch="false"
          :actionColumn="subElementActionColumn"
          @action="handleSubElementAction"
        >
        </SmartTable>
      </div>
    </Modal>
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="900px"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      :zIndex="1000"
    >
      <AdvancedForm 
        ref="formRef"
        :schema="formSchema" 
        :model="formState" 
        mode="form"
        formLayout="horizontal"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue';
import { 
  Button, 
  Modal, 
  message
} from 'ant-design-vue';
import { 
  PlusOutlined
} from '@ant-design/icons-vue';
import type { ExtendedColumnItem } from '@/types/business';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { getSafetyElementList, addSafetyElement, editSafetyElement, removeSafetyElement } from '@/api/system/safetyElement';
const baseStatus = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
  { label: '草稿', value: 'draft' },
  { label: '归档', value: 'archived' }
];
interface SearchItem {
  field: string;
  label: string;
  type: string;
  placeholder?: string;
  props?: any;
  colSpan?: number;
}

interface SafetyElement {
  id: string;
  name: string; // 要素名称
  title?: string; // 要素名称（兼容旧字段）
  description: string; // 要素描述
  fullDescription?: string; // 详细描述（兼容旧字段）
  keyPoints?: string[]; // 关键要点（兼容旧字段）
  key_points: string; // 要素点
  sort_order: number; // 排序序号
  sort?: number; // 排序（兼容旧字段）
  parent_id?: string; // 父级要素ID，用于树形层级结构
  parentId?: string; // 父级要素ID（兼容旧字段）
  status: 'active' | 'inactive' | 'draft' | 'archived'; // 状态：active-启用, inactive-禁用, draft-草稿, archived-归档
  createTime?: string;
  updateTime?: string;
  children?: SafetyElement[];
}

const router = useRouter();
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增要素');
const currentElement = ref<SafetyElement>();
const formRef = ref();
const smartTableRef = ref();

// 子要素管理相关变量
const subElementModalVisible = ref(false);
const currentParentElement = ref<SafetyElement>();
const subElementTableRef = ref();

const formState = reactive({
  id: '',
  name: '',
  description: '',
  key_points: '',
  sort_order: 0,
  status: 'active',
  parent_id: undefined as string | undefined
});

const responseConfig = {
  listKey: 'list',
  totalKey: 'total',
};

// 分页配置
const paginationConfig = {
  pageSize: 7,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['7', '10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
  pageSizeKey: 'pageSize',
  currentKey: 'pageNum'
};

// 用于存储从API获取的所有安全要素数据
const allSafetyElements = ref<SafetyElement[]>([]);

// 单独的函数用于获取所有安全要素数据
const loadAllSafetyElements = async () => {
  try {
    const response: any = await getSafetyElementList({ pageNum: 1, pageSize: 9999 });
    const transformedData = response.data.map((item: any) => ({
      id: String(item.id || item._id),
      name: item.name,
      description: item.description,
      key_points: item.key_points,
      sort_order: item.sort_order,
      status: item.status,
      parent_id: item.parent_id ? String(item.parent_id) : undefined,
      createTime: item.created_at,
      updateTime: item.updated_at,
      children: []
    }));
    
    allSafetyElements.value = [...transformedData];
  } catch (error) {
    console.error('获取所有安全要素数据失败:', error);
  }
};

const SelectList = computed(() => {
  return allSafetyElements.value.map(item => ({
    label: item.name || item.title,
    value: item.id,
  }));
});

const columns: ExtendedColumnItem<SafetyElement>[] = [
  {
    title: '要素名称',
    dataIndex: 'name',
    key: 'name',
    width: '25%'
  },
  {
    title: '父要素',
    dataIndex: 'parent_id',
    key: 'parent_id',
    width: '10%',
    formatter: (value: string, record: SafetyElement) => {
      if (!value) return '--';
      const parent = allSafetyElements.value.find(item => item.id === value);
      return parent ? (parent.name || parent.title) : '-';
    }
  },
  {
    title: '排序',
    dataIndex: 'sort_order',
    key: 'sort_order',
    width: '8%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '8%',
    type: 'tag',
    options: baseStatus
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: '12%',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '--'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: '12%',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '--'
  }
];

const searchConfig: SearchItem[] = [
  {
    field: 'name',
    label: '要素名称',
    type: 'input',
    placeholder: '请输入要素名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  }
];

const actionColumn = {
  title: '操作',
  width: 300,
  actions: [
    {
      label: '子要素',
      icon: 'FolderOpenOutlined',
      props: { type: 'link', size: 'small'},
      action: 'subElement'
    },
    {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '启用',
      props: { type: 'link', size: 'small' },
      action: 'toggleStatus',
      visible: (record) => {
        return record.status === 'inactive';
      }
    },
    {
      label: '禁用',
      props: { type: 'link', size: 'small', danger: true },
      action: 'toggleStatus',
      visible: (record) => {
        return record.status === 'active';
      }
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete',
    }
  ]
};

const apiConfig = async (params: any) => {
  // 使用真实API获取数据
  try {
    // 将前端字段名转换为API字段名
    const apiParams = {
      ...params,
      name: params.name,
      status: params.status,
      parent_id: '',
      include_inactive: true
    };
    
    const response: any = await getSafetyElementList(apiParams);
    
    // 将API返回的数据结构转换为前端所需格式
    const transformedData = response.data.map((item: any) => ({
      id: String(item.id || item._id),
      name: item.name,
      description: item.description,
      key_points: item.key_points,
      sort_order: item.sort_order,
      status: item.status,
      parent_id: item.parent_id ? String(item.parent_id) : undefined,
      createTime: item.created_at,
      updateTime: item.updated_at,
      children: []
    }));
    
    // 更新allSafetyElements，用于treeSelect
    allSafetyElements.value = [...transformedData];
    
    return {
      list: transformedData,
      total: response.data.total
    };
  } catch (error) {
    console.error('获取安全要素列表失败:', error);
    message.error('获取安全要素列表失败');
    return {
      list: [],
      total: 0
    };
  }
};

const paramsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params
  };
  
  if (pagination) {
    formattedParams.pageNum = pagination.current || 1;
    formattedParams.pageSize = pagination.pageSize || 7;
  }
  
  return formattedParams;
};

const formSchema = computed(() => {
  const isAddingSubElement = modalTitle.value === '新增子要素';
  
  return [
  {
    key: 'name',
    type: 'input',
    label: '要素名称',
    placeholder: '请输入要素名称',
    required: true,
    props: {
      maxlength: 50
    },
    rules: [
      { required: true, message: '请输入要素名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'parent_id',
    label: '父要素',
    type: 'select',
    props: { 
      placeholder: '请选择父要素（不选则为顶级要素）',
      options: SelectList.value,
      allowClear: true,
      showSearch: true,
      filterOption: (inputValue, option) => {
        return option.label.toLowerCase().includes(inputValue.toLowerCase());
      }
    },
    colSpan: 12
  },
  {
    key: 'status',
    type: 'radioGroup',
    label: '要素状态',
    required: true,
    props: {
      options: baseStatus
    },
    rules: [
      { required: true, message: '请选择要素状态', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'sort_order',
    label: '排序',
    type: 'inputNumber',
    props: {
      min: 0,
      placeholder: '请输入排序值'
    },
    colSpan: 12
  },
  {
    key: 'description',
    type: 'textarea',
    label: '简短描述',
    placeholder: '请输入简短描述',
    required: true,
    props: {
      rows: 2
    },
    rules: [
      { required: true, message: '请输入简短描述', trigger: 'blur' },
      { min: 2, max: 200, message: '描述长度为2-200个字符', trigger: 'blur' },
    ],
    colSpan: 24
  },
  {
    key: 'key_points',
    type: 'textarea',
    label: '关键要点',
    placeholder: '请输入关键要点，每行一个要点',
    required: true,
    props: {
      rows: 6
    },
    rules: [
      { required: true, message: '请输入关键要点', trigger: 'blur' },
      { 
        validator: (_rule: any, value: string) => {
          if (!value || value.trim() === '') {
            return Promise.reject('请输入关键要点');
          }
          const points = value.split('\n').filter(p => p.trim());
          if (points.length < 1) {
            return Promise.reject('至少输入一个关键要点');
          }
          return Promise.resolve();
        },
        trigger: 'blur'
      },
    ],
    colSpan: 24
  }];
});

const showAddModal = () => {
  modalTitle.value = '新增要素';
  resetForm();
  modalVisible.value = true;
};

const editElementFn = (record: SafetyElement, isSubElement: boolean = false) => {
  modalTitle.value = isSubElement ? '编辑子要素' : '编辑要素';
  resetForm();
  modalVisible.value = true;
  
  nextTick(() => {
    formState.id = record.id;
    formState.name = record.name;
    formState.description = record.description;
    formState.key_points = record.key_points;
    formState.status = record.status;
    formState.parent_id = record.parent_id;
    formState.sort_order = record.sort_order;
  });
};

const toggleStatus = async (record: SafetyElement) => {
  try {
    const newStatus = record.status === 'active' ? 'inactive' : 'active';
    
    await toggleElementStatus(record, newStatus);
    
    message.success(`已${newStatus === 'inactive' ? '禁用' : '启用'}要素`);
    smartTableRef.value?.refresh();
    
    // 刷新所有安全要素数据，确保treeSelect数据是最新的
    await loadAllSafetyElements();
  } catch (error: any) {
    console.error('状态切换失败:', error);
    message.error(error.message || '状态切换失败');
  }
};

const toggleElementStatus = async (record, status: string) => {
  try {
    // 调用真实的API接口
    const response = await editSafetyElement({
      ...record,
      status: status
    });
    
    return true;
  } catch (error: any) {
    console.error('更新安全要素状态失败:', error);
    throw new Error(error.response?.data?.message || error.message || '更新安全要素状态失败');
  }
};

const confirmDelete = (record: SafetyElement) => {
  currentElement.value = record;
  deleteModalVisible.value = true;
};

const hasChildren = computed(() => {
  if (!currentElement.value) return false;
  return allSafetyElements.value && allSafetyElements.value.some(item => item.parent_id === currentElement.value?.id);
});

// 子要素管理相关配置和方法
const subElementColumns: ExtendedColumnItem<SafetyElement>[] = [
  {
    title: '子要素名称',
    dataIndex: 'name',
    key: 'name',
    width: '25%'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: '30%',
    ellipsis: true
  },
  {
    title: '排序',
    dataIndex: 'sort_order',
    key: 'sort_order',
    width: '10%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    type: 'tag',
    options: baseStatus
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: '20%',
    formatter: (value: string) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '--'
  }
];

const subElementSearchConfig: SearchItem[] = [
  {
    field: 'name',
    label: '子要素名称',
    type: 'input',
    placeholder: '请输入子要素名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  }
];

const subElementActionColumn = {
  title: '操作',
  width: 200,
  actions: [
    {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'editSubElement'
    },
    {
      label: '启用',
      props: { type: 'link', size: 'small' },
      action: 'toggleSubElementStatus',
      visible: (record) => {
        return record.status === 'inactive';
      }
    },
    {
      label: '禁用',
      props: { type: 'link', size: 'small', danger: true },
      action: 'toggleSubElementStatus',
      visible: (record) => {
        return record.status === 'active';
      }
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'deleteSubElement',
    }
  ]
};

const subElementApiConfig = async (params: any) => {
  // 使用真实API获取子要素数据
  try {
    if (!currentParentElement.value) {
      return { list: [], total: 0 };
    }
    
    // 查询指定父要素下的子要素
    const apiParams = {
      ...params,
      parent_id: currentParentElement.value.id,
      name: params.name,
      status: params.status,
      include_inactive: true
    };
    
    const response: any = await getSafetyElementList(apiParams);
    
    // 将API返回的数据结构转换为前端所需格式
    const transformedData = response.data.map((item: any) => ({
      id: String(item.id || item._id),
      name: item.name,
      description: item.description,
      key_points: item.key_points,
      sort_order: item.sort_order,
      status: item.status,
      parent_id: item.parent_id ? String(item.parent_id) : null,
      createTime: item.created_at,
      updateTime: item.updated_at,
      children: []
    }));
    
    // 更新allSafetyElements，用于treeSelect
    allSafetyElements.value = [...allSafetyElements.value, ...transformedData];
    
    return {
      list: transformedData,
      total: response.data.total
    };
  } catch (error) {
    console.error('获取子要素列表失败:', error);
    message.error('获取子要素列表失败');
    return {
      list: [],
      total: 0
    };
  }
};

// 子要素分页配置
const subElementPaginationConfig = {
  pageSize: 7,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['7', '10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
  pageSizeKey: 'pageSize',
  currentKey: 'pageNum'
};

// 子要素管理相关方法
const showSubElementModal = (record: SafetyElement) => {
  currentParentElement.value = record;
  subElementModalVisible.value = true;
  
  // 在下一个tick确保组件渲染完成后再加载数据
  nextTick(() => {
    if (subElementTableRef.value) {
      subElementTableRef.value.refresh();
    }
  });
};

const handleSubElementModalCancel = async () => {
  subElementModalVisible.value = false;
  currentParentElement.value = undefined;
  
  // 刷新所有安全要素数据，确保treeSelect数据是最新的
  await loadAllSafetyElements();
};

const showAddSubElementModal = () => {
  // 打开新增要素表单，但默认父要素为当前选中的父要素
  modalTitle.value = '新增子要素';
  resetForm();
  
  // 设置默认父要素
  if (currentParentElement.value) {
    formState.parent_id = currentParentElement.value.id;
  }
  
  // 确保在表单渲染后设置值
  nextTick(() => {
    if (currentParentElement.value) {
      formState.parent_id = currentParentElement.value.id;
    }
  });
  
  modalVisible.value = true;
};

const handleSubElementLoadSuccess = (data: any[]) => {
  console.log('子要素数据加载成功:', data);
};

const handleSubElementLoadError = (error: any) => {
  console.error('子要素数据加载失败:', error);
  message.error('子要素数据加载失败');
};

const handleSubElementAction = (action: string, record: SafetyElement, index: number) => {
  switch (action) {
    case 'editSubElement':
      editSubElement(record);
      break;
    case 'toggleSubElementStatus':
      toggleSubElementStatus(record);
      break;
    case 'deleteSubElement':
      deleteSubElement(record);
      break;
    default:
      console.warn('未知的子要素操作:', action);
  }
};

const editSubElement = async (record: SafetyElement) => {
  // 编辑子要素
  editElementFn(record, true);
  // 保持子要素弹窗打开状态
  
  // 刷新所有安全要素数据，确保treeSelect数据是最新的
  await loadAllSafetyElements();
};

const toggleSubElementStatus = async (record: SafetyElement) => {
  try {
    const newStatus = record.status === 'active' ? 'inactive' : 'active';
    await toggleElementStatus(record.id, newStatus);
    message.success(`已${newStatus === 'inactive' ? '禁用' : '启用'}子要素`);
    subElementTableRef.value?.refresh();
    
    // 刷新所有安全要素数据，确保treeSelect数据是最新的
    await loadAllSafetyElements();
  } catch (error: any) {
    console.error('子要素状态切换失败:', error);
    message.error(error.message || '子要素状态切换失败');
  }
};

const deleteSubElement = async (record: SafetyElement) => {
  try {
    await deleteElement(record.id);
    message.success('删除子要素成功');
    subElementTableRef.value?.refresh();
    
    // 刷新所有安全要素数据，确保treeSelect数据是最新的
    await loadAllSafetyElements();
  } catch (error: any) {
    console.error('删除子要素失败:', error);
    message.error(error.message || '删除子要素失败');
  }
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    // 关键要点现在是长文本，不需要转换为数组
        
    // 如果是新增子要素，确保父要素ID被设置
    if (modalTitle.value === '新增子要素') {
      // 如果没有手动设置父要素（通常是因为禁用了选择），使用当前父元素的ID
      if (!formData.parent_id && currentParentElement.value) {
        formData.parent_id = currentParentElement.value.id;
      }
    }
        
    if (modalTitle.value === '新增要素' || modalTitle.value === '新增子要素') {
      await addElement({
        name: formData.name,
        description: formData.description,
        key_points: formData.key_points,
        status: formData.status,
        parent_id: formData.parent_id,
        sort_order: formData.sort_order || 0
      });
      message.success(modalTitle.value === '新增子要素' ? '新增子要素成功' : '新增要素成功');
    } else {
      await updateElement(formData.id, {
        name: formData.name,
        description: formData.description,
        key_points: formData.key_points,
        status: formData.status,
        parent_id: formData.parent_id,
        sort_order: formData.sort_order || 0
      });
      message.success('编辑要素成功');
    }
    
    // 先保存模态框的状态信息，判断是否在子要素管理中
    const isManagingSubElements = subElementModalVisible.value;
    
    modalVisible.value = false;
    resetForm();
    smartTableRef.value?.refresh();
    
    // 刷新所有安全要素数据，确保treeSelect数据是最新的
    await loadAllSafetyElements();
    
    // 如果是在子要素管理弹窗中操作（新增或编辑子要素），需要刷新子要素列表并保持弹窗打开
    if (modalTitle.value === '新增子要素' || (modalTitle.value === '编辑子要素' && isManagingSubElements)) {
      // 保持子要素弹窗打开状态并刷新子要素列表
      nextTick(() => {
        subElementTableRef.value?.refresh();
      });
    }
  } catch (error: any) {
    console.error('操作失败:', error);
    message.error(error.message || (modalTitle.value === '新增要素' ? '新增要素失败' : '编辑要素失败'));
  } finally {
    modalLoading.value = false;
  }
};

const addElement = async (formData: any) => {
  try {
    // 调用真实的API接口
    const response: any = await addSafetyElement({
      name: formData.name,
      description: formData.description,
      key_points: formData.key_points,
      status: formData.status,
      parent_id: formData.parent_id,
      sort_order: formData.sort_order || 0
    });
    
    // 将API响应转换为前端所需的格式
    const newElement: SafetyElement = {
      id: String(response.data.id || response.data._id),
      name: response.data.name,
      description: response.data.description,
      key_points: response.data.key_points,
      sort_order: response.data.sort_order,
      status: response.data.status,
      parent_id: response.data.parent_id ? String(response.data.parent_id) : undefined,
      createTime: response.data.created_at,
      updateTime: response.data.updated_at,
      children: []
    };
    
    // 更新allSafetyElements，用于treeSelect
    allSafetyElements.value = [...allSafetyElements.value, newElement];
    
    return newElement;
  } catch (error: any) {
    console.error('新增安全要素失败:', error);
    throw new Error(error.response?.data?.message || error.message || '新增安全要素失败');
  }
};

const updateElement = async (id: string, formData: any) => {
  try {
    // 调用真实的API接口
    const response: any = await editSafetyElement({
      id: id,
      name: formData.name,
      description: formData.description,
      key_points: formData.key_points,
      status: formData.status,
      parent_id: formData.parent_id,
      sort_order: formData.sort_order || 0
    });
  
  } catch (error: any) {
    console.error('更新安全要素失败:', error);
    throw new Error(error.response?.data?.message || error.message || '更新安全要素失败');
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

const handleDelete = async () => {
  try {
    if (!currentElement.value) return;
    
    await deleteElement(currentElement.value.id);
    
    deleteModalVisible.value = false;
    currentElement.value = undefined;
    message.success('删除要素成功');
    smartTableRef.value?.refresh();
    
    // 刷新所有安全要素数据，确保treeSelect数据是最新的
    await loadAllSafetyElements();
  } catch (error: any) {
    console.error('删除要素失败:', error);
    message.error(error.message || '删除要素失败');
  }
};

const deleteElement = async (id: string) => {
  try {
    // 调用真实的API接口
    await removeSafetyElement(id);
    
    // 更新allSafetyElements，用于treeSelect
    allSafetyElements.value = allSafetyElements.value.filter(item => item.id !== id);
    
    return true;
  } catch (error: any) {
    console.error('删除安全要素失败:', error);
    throw new Error(error.response?.data?.message || error.message || '删除安全要素失败');
  }
};

const resetForm = () => {
  formState.id = '';
  formState.name = '';
  formState.description = '';
  formState.key_points = '';
  formState.status = 'active';
  formState.parent_id = undefined;
  formState.sort_order = 0;
};

const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

const handleAction = (action: string, record: SafetyElement, index: number) => {
  switch (action) {
    case 'subElement':
      showSubElementModal(record);
      break;
    case 'edit':
      editElementFn(record);
      break;
    case 'toggleStatus':
      toggleStatus(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

onMounted(async () => {
  console.log('safetyElement页面初始化');
  
  // 初始化时获取所有安全要素数据，用于treeSelect
  await loadAllSafetyElements();
});
</script>

<style scoped>
.safety-element-container {
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
