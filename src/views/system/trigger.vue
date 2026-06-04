<template>
  <div class="trigger-container pt-[30px] pb-[30px] px-[30px] box-border flex flex-col overflow-hidden">
    <!-- 页面标题和操作栏 - 固定不滚动 -->
    <div class="pb-[30px] flex justify-between items-center flex-shrink-0">
      <!-- <div>
        <div class="font-bold text-[22px] text-[#454F64] leading-1">危险因素管理</div>
        <div class="font-[400] text-[14px] text-[#717B92] leading-1">管理系统中的安全风险危险因素，可进行分类管理</div>
      </div> -->
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增危险因素</span>
        </span>
      </Button>
    </div>

    <!-- 危险因素列表 -->
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
        @action="handleAction"
        :searchButtonWrapperSpan="6"
        :immediateSearch="true"
        :actionColumn="actionColumn"
      >
        <!-- 风险等级显示插槽 -->
        <template #cell-risk_level="{ record }">
          <Tag :color="getRiskLevelColor(record.risk_level)">
            {{ getRiskLevelText(record.risk_level) }}
          </Tag>
        </template>
        
        <!-- 状态显示插槽 -->
        <template #cell-status="{ record }">
          <Badge 
            :status="record.status === '1' ? 'processing' : 'default'" 
            :text="record.status === '1' ? '启用' : '禁用'"
          />
        </template>
      </smartTable>
    </div>

    <!-- 新增/编辑危险因素弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="600px"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <AdvancedForm 
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
      <p>确定要删除危险因素 "{{ currentTrigger?.factor_name }}" 吗？此操作不可恢复。</p>
      <p class="text-orange-500 mt-2">
        删除后，该危险因素将不再出现在风险分析中。
      </p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { 
  Button, 
  Modal, 
  Tag, 
  Badge,
  message
} from 'ant-design-vue';
import { 
  PlusOutlined, 
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
import {getDangerList, addDanger, editDanger, removeDanger} from '@/api/system/trigger'
// 引入 smartTable 组件需要的类型
import type { ColumnItem, SearchItem } from '@/types/business';
import {triggerCategory, riskLevel,baseStatus} from '../../utils/constSeting';
import dayjs from 'dayjs'
// 类型定义
interface Trigger {
  factor_id: string;
  factor_name: string;
  category: string;
  risk_level: string; // 1-5: 极低/低/中/高/极高
  description?: string;
  status: string; // 1启用，0禁用
  creator_id?: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增危险因素');
const currentTrigger = ref<Trigger>();
const smartTableRef = ref();

const formState = reactive({
  factor_id: '',
  factor_name: '',
  category: undefined,  // 保持 undefined 以确保 placeholder 能正常显示
  risk_level: '3', // 默认中等风险
  description: '',
  status: '1' // 默认启用
});

// 表格配置
const responseConfig = {
  listKey: 'risk_factors',
  totalKey: 'total',
};

const paginationConfig = {
  pageSize: 7,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['7','10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
};


// 表格列配置
const columns: ColumnItem<Trigger>[] = [
  {
    title: '危险因素名称',
    dataIndex: 'factor_name',
    key: 'factor_name',
    width: '15%'
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: '10%',
    type: 'tag',
    options:triggerCategory
  },
  {
    title: '风险等级',
    key: 'risk_level',
    dataIndex: 'risk_level',
    width: '8%',
    type: 'tag',
    options:riskLevel
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    width: '12%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: '8%',
    type: 'tag',
    options:baseStatus
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true
  }
];


// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'search_keyword',
    label: '危险因素名称',
    type: 'input',
    placeholder: '请输入危险因素名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'category',
    label: '分类',
    type: 'select',
    props: {
      allowClear: true,
      placeholder: '请选择分类',
      options:triggerCategory
    },
    colSpan: 6
  },
  {
    field: 'risk_level',
    label: '风险等级',
    type: 'select',
    props: {
      allowClear: true,
      placeholder: '请选择风险等级',
      options:riskLevel
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 250,
  actions: [
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
        return record.status === '0';
      }
    },
    {
      label: '禁用',
      props: { type: 'link', size: 'small', danger: true },
      action: 'toggleStatus',
      visible: (record) => {
        return record.status === '1';
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

// API 配置
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  const res = await getDangerList({
    page: pageNum,
    page_size: pageSize,
    ...rest
  });
  
  return res.data;
};

// 参数格式化函数
const paramsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params
  };

  if (pagination) {
    formattedParams.pageNum = pagination.current || 1;
    formattedParams.pageSize = pagination.pageSize || 8;
  }

  return formattedParams;
};

// AdvancedForm schema配置
const formSchema = [
  {
    key: 'factor_name',
    label: '危险因素名称',
    type: 'input',
    required: true,
    props: {
      maxlength: 50,
      placeholder: '请输入危险因素名称'
    },
    rules: [
      { required: true, message: '请输入危险因素名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' }
    ]
  },
  {
    key: 'category',
    label: '分类',
    type: 'select',
    required: true,
    props: {
      placeholder: '请选择分类',
      options: [
        { value: '设备因素', label: '设备因素' },
        { value: '环境因素', label: '环境因素' },
        { value: '人为因素', label: '人为因素' },
        { value: '管理因素', label: '管理因素' }
      ]
    },
    rules: [
      { required: true, message: '请选择分类', trigger: 'change' }
    ]
  },
  {
    key: 'risk_level',
    label: '风险等级',
    type: 'select',
    required: true,
    props: {
      placeholder: '请选择风险等级',
      options: [
        { value: '1', label: '极低' },
        { value: '2', label: '低' },
        { value: '3', label: '中' },
        { value: '4', label: '高' },
        { value: '5', label: '极高' }
      ]
    },
    rules: [
      { required: true, message: '请选择风险等级', trigger: 'change' }
    ]
  },
  {
    key: 'description',
    label: '危险因素描述',
    type: 'textarea',
    props: {
      rows: 3,
      maxlength: 200,
      placeholder: '请输入危险因素描述'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'radioGroup',
    props: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' }
      ]
    }
  }
];

// 方法
const showAddModal = () => {
  modalTitle.value = '新增危险因素';
  resetForm();
  modalVisible.value = true;
};

const editTrigger = (record: Trigger) => {
  modalTitle.value = '编辑危险因素';
  resetForm();
  modalVisible.value = true;
  
  // 使用 nextTick 确保表单组件已经完全渲染
  nextTick(() => {
    formState.factor_id = record.factor_id;
    formState.factor_name = record.factor_name;
    formState.category = record.category;
    formState.risk_level = record.risk_level;
    formState.description = record.description || '';
    formState.status = record.status;
  });
};

const toggleStatus = async (record: Trigger) => {
  try {
    const newStatus = record.status === '1' ? '0' : '1';
    
    await editDanger({
      factor_id: record.factor_id,
      factor_name: record.factor_name,
      category: record.category,
      risk_level: record.risk_level,
      description: record.description,
      status: newStatus
    });
    
    message.success(`已${record.status === '1' ? '禁用' : '启用'}危险因素`);
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    message.error('状态切换失败');
  }
};

const confirmDelete = (record: Trigger) => {
  currentTrigger.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    // 手动验证表单
    const validateForm = () => {
      for (const item of formSchema) {
        if (item.required && !formState[item.key]) {
          throw new Error(item.rules?.[0]?.message || `请输入${item.label}`);
        }
        if (item.key === 'factor_name' && formState[item.key]) {
          const len = formState[item.key].length;
          if (len < 2 || len > 50) {
            throw new Error('名称长度为2-50个字符');
          }
        }
      }
    };
    
    validateForm();
    modalLoading.value = true;
    
    if (modalTitle.value === '新增危险因素') {
      // 新增危险因素
      await addDanger({
        factor_name: formState.factor_name,
        category: formState.category,
        risk_level: formState.risk_level,
        description: formState.description,
        status: formState.status
      });
      message.success('新增危险因素成功');
    } else {
      // 编辑危险因素
      await editDanger({
        factor_id: formState.factor_id,
        factor_name: formState.factor_name,
        category: formState.category,
        risk_level: formState.risk_level,
        description: formState.description,
        status: formState.status
      });
      message.success('编辑危险因素成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增危险因素' ? '新增危险因素失败' : '编辑危险因素失败');
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
    if (!currentTrigger.value) return;
    
    const res =  await removeDanger(currentTrigger.value.factor_id);
    if(res.code === 200){
      message.success('删除危险因素成功');
      // 重新加载数据
      smartTableRef.value?.refresh();
    }else{
      message.error('删除危险因素失败');
    }
    
    deleteModalVisible.value = false;
    currentTrigger.value = undefined;
    
  } catch (error) {
    message.error('删除危险因素失败');
  }
};

const resetForm = () => {
  formState.factor_id = '';
  formState.factor_name = '';
  formState.category = undefined;  // 保持 undefined 以确保 placeholder 能正常显示
  formState.risk_level = '3';
  formState.description = '';
  formState.status = '1';
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
const handleAction = (action: string, record: Trigger, index: number) => {
  console.log('操作:', action, '记录:', record, '索引:', index);
  switch (action) {
    case 'edit':
      editTrigger(record);
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

const getRiskLevelColor = (level: string) => {
  const colors = {
    '1': 'blue',
    '2': 'green', 
    '3': 'orange',
    '4': 'red',
    '5': 'purple'
  };
  return colors[level] || 'default';
};

const getRiskLevelText = (level: string) => {
  const texts = {
    '1': '极低',
    '2': '低',
    '3': '中', 
    '4': '高',
    '5': '极高'
  };
  return texts[level] || level;
};

// 暴露方法给父组件
defineExpose({
  refresh: () => smartTableRef.value?.refresh()
});
</script>

<style scoped>
.trigger-container {
  /* height: calc(100vh - 60px); */
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

:deep(.ant-table-container) {
  border-radius: 8px;
}

.text-green {
  color: #52c41a;
}

.text-orange {
  color: #fa8c16;
}

.text-red {
  color: #f5222d;
}

.text-purple {
  color: #722ed1;
}
</style>