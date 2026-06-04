<template>
  <div class="emer-goods-container p-[16px] flex flex-col overflow-hidden  box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增物资</span>
        </span>
      </Button>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 flex gap-[20px] overflow-hidden">
      <!-- 左侧物资类型树 -->
      <div class="bg-white rounded-[12px] p-[20px] shadow-sm w-[280px] flex-shrink-0 flex flex-col">
        <div class="mb-[16px] flex justify-between items-center">
          <div class="font-semibold text-[16px] text-[#454F64]">物资分类</div>
          <Button type="text" size="small" @click="refreshTree">
            <ReloadOutlined />
          </Button>
        </div>
        <div class="flex-1 overflow-auto">
          <Tree
            v-model:selectedKeys="selectedCategoryKeys"
            :tree-data="categoryTreeData"
            :field-names="{ title: 'category_name', key: 'category_id', children: 'children' }"
            @select="handleCategorySelect"
            class="category-tree"
          />
        </div>
      </div>

      <!-- 右侧物资列表 -->
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
    </div>

    <!-- 新增/编辑物资弹窗 -->
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
        formLayout="horizontal"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
      />
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除物资 "{{ currentGoods?.goods_name }}" 吗？此操作不可恢复。</p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { 
  Button, 
  Modal, 
  Tag,
  Tree,
  message
} from 'ant-design-vue';
import { 
  PlusOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
// import { getEmergencyGoodsList, addEmergencyGoods, editEmergencyGoods, removeEmergencyGoods } from '@/api/commond/emer-goods';
// import { getGoodsCategoryList } from '@/api/commond/goods-category';
// import { getWarehouseList } from '@/api/commond/warehouse';
// 引入 smartTable 组件需要的类型
import type { ColumnItem, SearchItem } from '@/types/business';
import dayjs from 'dayjs'

// 类型定义
interface EmergencyGoods {
  goods_id: string;
  goods_name: string;
  category_id: string;
  category_name?: string;
  warehouse_id: string;
  warehouse_name?: string;
  responsible_person: string;
  responsible_phone: string;
  stock_quantity: number;
  min_safe_quantity: number;
  max_safe_quantity: number;
  in_out_quantity: number;
  update_time?: string;
  create_time?: string;
  stock_status?: string;
}

interface GoodsCategory {
  category_id: string;
  category_name: string;
  parent_id?: string;
  children?: GoodsCategory[];
}

interface Warehouse {
  warehouse_id: string;
  warehouse_name: string;
  location?: string;
  status: string;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增物资');
const currentGoods = ref<EmergencyGoods>();
const formRef = ref();
const smartTableRef = ref();
const categoryTreeData = ref<GoodsCategory[]>([]);
const warehouseOptions = ref([]);
const selectedCategoryKeys = ref<string[]>([]);
const categoryOptions = ref([]);

// 表单状态
const formState = reactive({
  goods_id: '',
  goods_name: '',
  category_id: '',
  warehouse_id: '',
  responsible_person: '',
  responsible_phone: '',
  stock_quantity: 0,
  min_safe_quantity: 0,
  max_safe_quantity: 0,
  in_out_quantity: 0
});

// 表格配置
const responseConfig = {
  listKey: 'goods',
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
const columns: ColumnItem<EmergencyGoods>[] = [
  {
    title: '物资名称',
    dataIndex: 'goods_name',
    key: 'goods_name',
    width: '120px',
    ellipsis: true
  },
  {
    title: '物资类型',
    dataIndex: 'category_name',
    key: 'category_name',
    width: '100px',
    ellipsis: true
  },
  {
    title: '所属仓库',
    dataIndex: 'warehouse_name',
    key: 'warehouse_name',
    width: '100px',
    ellipsis: true
  },
  {
    title: '负责人',
    dataIndex: 'responsible_person',
    key: 'responsible_person',
    width: '80px',
    ellipsis: true
  },
  {
    title: '负责人电话',
    dataIndex: 'responsible_phone',
    key: 'responsible_phone',
    width: '100px',
    ellipsis: true,
  },
  {
    title: '库存数量',
    dataIndex: 'stock_quantity',
    key: 'stock_quantity',
    width: '80px',
    ellipsis: true,
    sorter: true
  },
  {
    title: '常备数量',
    dataIndex: 'min_safe_quantity',
    key: 'min_safe_quantity',
    width: '80px',
    ellipsis: true
  },
  {
    title: '进出数',
    dataIndex: 'in_out_quantity',
    key: 'in_out_quantity',
    width: '80px',
    ellipsis: true
  },
  {
    title: '库存状态',
    dataIndex: 'stock_status',
    key: 'stock_status',
    width: '80px',
    ellipsis: true,
    type: 'tag',
    options: [
      { label: '充足', value: '充足', color: 'green' },
      { label: '预警', value: '预警', color: 'orange' },
      { label: '不足', value: '不足', color: 'red' }
    ],
    slotName: 'stock_status'
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: '140px',
    ellipsis: true,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
];



// 操作列配置
const actionColumn = {
  title: '操作',
  width: '160px',
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

// 静态数据
const staticEmergencyGoods: EmergencyGoods[] = [
  {
    goods_id: 'goods001',
    goods_name: '医用口罩',
    category_id: 'cate001',
    category_name: '医疗防护用品',
    warehouse_id: 'warehouse001',
    warehouse_name: '主仓库',
    responsible_person: '张三',
    responsible_phone: '10000000000',
    stock_quantity: 500,
    min_safe_quantity: 200,
    max_safe_quantity: 1000,
    in_out_quantity: 50,
    update_time: '2025-12-01 10:30:00',
    create_time: '2024-11-01 09:00:00',
    stock_status: '充足'
  },
  {
    goods_id: 'goods002',
    goods_name: '消毒液',
    category_id: 'cate001',
    category_name: '医疗防护用品',
    warehouse_id: 'warehouse001',
    warehouse_name: '主仓库',
    responsible_person: '李四',
    responsible_phone: '10000000000',
    stock_quantity: 150,
    min_safe_quantity: 100,
    max_safe_quantity: 500,
    in_out_quantity: 30,
    update_time: '2025-12-01 11:15:00',
    create_time: '2024-11-02 10:00:00',
    stock_status: '预警'
  },
  {
    goods_id: 'goods003',
    goods_name: '帐篷',
    category_id: 'cate002',
    category_name: '应急救援装备',
    warehouse_id: 'warehouse002',
    warehouse_name: '应急仓库',
    responsible_person: '王五',
    responsible_phone: '10000000000',
    stock_quantity: 20,
    min_safe_quantity: 30,
    max_safe_quantity: 100,
    in_out_quantity: 5,
    update_time: '2025-12-01 09:45:00',
    create_time: '2024-11-03 14:00:00',
    stock_status: '不足'
  },
  {
    goods_id: 'goods004',
    goods_name: '应急手电筒',
    category_id: 'cate002',
    category_name: '应急救援装备',
    warehouse_id: 'warehouse002',
    warehouse_name: '应急仓库',
    responsible_person: '赵六',
    responsible_phone: '10000000000',
    stock_quantity: 80,
    min_safe_quantity: 50,
    max_safe_quantity: 200,
    in_out_quantity: 10,
    update_time: '2025-12-01 12:20:00',
    create_time: '2024-11-04 16:00:00',
    stock_status: '正常'
  },
  {
    goods_id: 'goods005',
    goods_name: '矿泉水',
    category_id: 'cate003',
    category_name: '生活物资',
    warehouse_id: 'warehouse001',
    warehouse_name: '主仓库',
    responsible_person: '张三',
    responsible_phone: '10000000000',
    stock_quantity: 2000,
    min_safe_quantity: 1000,
    max_safe_quantity: 5000,
    in_out_quantity: 100,
    update_time: '2025-12-01 13:00:00',
    create_time: '2024-11-05 08:00:00',
    stock_status: '充足'
  }
];

// 模拟数据存储
let emergencyGoodsData: EmergencyGoods[] = [...staticEmergencyGoods];

const staticCategories: GoodsCategory[] = [
  { category_id: 'cate001', category_name: '医疗防护用品' },
  { category_id: 'cate002', category_name: '应急救援装备' },
  { category_id: 'cate003', category_name: '生活物资' }
];

const staticWarehouses: Warehouse[] = [
  { warehouse_id: 'warehouse001', warehouse_name: '主仓库', location: '一楼A区', status: 'active' },
  { warehouse_id: 'warehouse002', warehouse_name: '应急仓库', location: '二楼B区', status: 'active' }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'goods_name',
    label: '物资名称',
    type: 'input',
    placeholder: '请输入物资名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'warehouse_id',
    label: '所属仓库',
    type: 'select',
    placeholder: '请选择仓库',
    props: {
      allowClear: true,
      options:staticWarehouses.map(item => ({ label: item.warehouse_name, value: item.warehouse_id }))
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
  }
];

// API 配置（使用静态数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 过滤数据
  let filteredData = emergencyGoodsData;
  
  if (rest.goods_name) {
    filteredData = filteredData.filter(item => 
      item.goods_name.includes(rest.goods_name)
    );
  }
  
  if (rest.category_id) {
    filteredData = filteredData.filter(item => 
      item.category_id === rest.category_id
    );
  }
  
  if (rest.warehouse_id) {
    filteredData = filteredData.filter(item => 
      item.warehouse_id === rest.warehouse_id
    );
  }
  
  if (rest.responsible_person) {
    filteredData = filteredData.filter(item => 
      item.responsible_person.includes(rest.responsible_person)
    );
  }
  
  if (selectedCategoryKeys.value[0]) {
    filteredData = filteredData.filter(item => 
      item.category_id === selectedCategoryKeys.value[0]
    );
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    goods: pagedData,
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
const formSchema = computed(() => [
  {
    key: 'goods_name',
    type: 'input',
    label: '物资名称',
    placeholder: '请输入物资名称',
    required: true,
    rules: [
      { required: true, message: '请输入物资名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'category_id',
    type: 'select',
    label: '物资类型',
    placeholder: '请选择物资类型',
    required: true,
    props: {
      options: categoryOptions.value
    },
    rules: [
      { required: true, message: '请选择物资类型', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'warehouse_id',
    type: 'select',
    label: '所属仓库',
    placeholder: '请选择所属仓库',
    required: true,
    props: {
      options: warehouseOptions.value,
      allowClear: false
    },
    rules: [
      { required: true, message: '请选择所属仓库', trigger: 'change' },
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
    ],
    colSpan: 12
  },
  {
    key: 'responsible_phone',
    type: 'input',
    label: '负责人电话',
    placeholder: '请输入负责人电话',
    rules: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'stock_quantity',
    type: 'inputNumber',
    label: '库存数量',
    placeholder: '请输入库存数量',
    required: true,
    props: {
      min: 0,
      precision: 0
    },
    rules: [
      { required: true, message: '请输入库存数量', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'min_safe_quantity',
    type: 'inputNumber',
    label: '常备数量',
    placeholder: '请输入常备数量',
    required: true,
    props: {
      min: 0,
      precision: 0
    },
    rules: [
      { required: true, message: '请输入常备数量', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'max_safe_quantity',
    type: 'inputNumber',
    label: '最大库存量',
    placeholder: '请输入最大库存量',
    required: true,
    props: {
      min: 0,
      precision: 0
    },
    rules: [
      { required: true, message: '请输入最大库存量', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'in_out_quantity',
    type: 'inputNumber',
    label: '进出数',
    placeholder: '请输入进出数量',
    props: {
      min: 0,
      precision: 0
    },
    colSpan: 12
  }
]);

// 方法
const showAddModal = () => {
  modalTitle.value = '新增物资';
  resetForm();
  modalVisible.value = true;
};

const editGoodsFn = async (record: EmergencyGoods) => {
  try {
    modalTitle.value = '编辑物资';
    formState.goods_id = record.goods_id;
    formState.goods_name = record.goods_name;
    formState.category_id = record.category_id;
    formState.warehouse_id = record.warehouse_id;
    formState.responsible_person = record.responsible_person;
    formState.responsible_phone = record.responsible_phone;
    formState.stock_quantity = record.stock_quantity;
    formState.min_safe_quantity = record.min_safe_quantity;
    formState.max_safe_quantity = record.max_safe_quantity;
    formState.in_out_quantity = record.in_out_quantity;

    modalVisible.value = true;
  } catch (error) {
    console.error('获取物资详情失败:', error);
    message.error('获取物资详情失败');
  }
};


const confirmDelete = (record: EmergencyGoods) => {
  currentGoods.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    if (modalTitle.value === '新增物资') {
      // 新增操作
      // 根据ID查找对应的分类和仓库名称
      const selectedCategory = staticCategories.find(cat => cat.category_id === formData.category_id);
      const selectedWarehouse = staticWarehouses.find(wh => wh.warehouse_id === formData.warehouse_id);
      
      const newGoods: EmergencyGoods = {
        ...formData,
        category_name: selectedCategory?.category_name || '',
        warehouse_name: selectedWarehouse?.warehouse_name || '',
        goods_id: 'goods' + Date.now(), // 生成唯一ID
        update_time: new Date().toLocaleString('zh-CN'),
        create_time: new Date().toLocaleString('zh-CN'),
        stock_status: formData.stock_quantity > formData.min_safe_quantity ? '充足' : 
                     formData.stock_quantity < formData.min_safe_quantity ? '不足' : '预警'
      };
      
      // 添加到数据数组
      emergencyGoodsData.unshift(newGoods);
      message.success('新增物资成功');
    } else {
      // 编辑操作
      const index = emergencyGoodsData.findIndex(item => item.goods_id === formData.goods_id);
      if (index !== -1) {
        // 根据ID查找对应的分类和仓库名称
        const selectedCategory = staticCategories.find(cat => cat.category_id === formData.category_id);
        const selectedWarehouse = staticWarehouses.find(wh => wh.warehouse_id === formData.warehouse_id);
        
        emergencyGoodsData[index] = {
          ...formData,
          category_name: selectedCategory?.category_name || '',
          warehouse_name: selectedWarehouse?.warehouse_name || '',
          update_time: new Date().toLocaleString('zh-CN'),
          stock_status: formData.stock_quantity > formData.min_safe_quantity ? '充足' : 
                       formData.stock_quantity < formData.min_safe_quantity ? '不足' : '预警'
        };
      }
      message.success('编辑物资成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增物资' ? '新增物资失败' : '编辑物资失败');
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
    if (!currentGoods.value) return;
    
    // 模拟删除操作延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 从数据数组中删除
    const index = emergencyGoodsData.findIndex(item => item.goods_id === currentGoods.value?.goods_id);
    if (index !== -1) {
      emergencyGoodsData.splice(index, 1);
    }
    
    deleteModalVisible.value = false;
    currentGoods.value = undefined;
    message.success('删除物资成功');
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除物资失败:', error);
    message.error('删除物资失败');
  }
};

const resetForm = () => {
  formState.goods_id = '';
  formState.goods_name = '';
  formState.category_id = '';
  formState.warehouse_id = '';
  formState.responsible_person = '';
  formState.responsible_phone = '';
  formState.stock_quantity = 0;
  formState.min_safe_quantity = 0;
  formState.max_safe_quantity = 0;
  formState.in_out_quantity = 0;
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
const handleAction = (action: string, record: EmergencyGoods, index: number) => {
  switch (action) {
    case 'edit':
      editGoodsFn(record);
      break;
    case 'delete':
      confirmDelete(record);
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

const refreshTree = async () => {
  await loadCategoryTree();
  message.success('分类树刷新成功');
};

// 获取物资分类树（使用静态数据）
const loadCategoryTree = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    
    categoryTreeData.value = buildTree(staticCategories);
    
    // 更新分类选项
    categoryOptions.value = flattenTree(categoryTreeData.value).map((item: GoodsCategory) => ({
      value: item.category_id,
      label: item.category_name
    }));
    
    // 更新搜索配置中的分类选项
    const categorySearchItem = searchConfig.find(item => item.field === 'category_id');
    if (categorySearchItem) {
      categorySearchItem.props.options = categoryOptions.value;
    }
  } catch (error) {
    console.error('加载物资分类失败:', error);
  }
};

// 构建树形结构
const buildTree = (flatList: GoodsCategory[]): GoodsCategory[] => {
  const tree: GoodsCategory[] = [];
  const map = new Map();

  // 创建映射
  flatList.forEach(item => {
    map.set(item.category_id, { ...item, children: [] });
  });

  // 构建树形结构
  flatList.forEach(item => {
    const node = map.get(item.category_id);
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id).children.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
};

// 扁平化树形结构
const flattenTree = (tree: GoodsCategory[]): GoodsCategory[] => {
  const result: GoodsCategory[] = [];
  
  const traverse = (nodes: GoodsCategory[]) => {
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

// 获取仓库列表（使用静态数据）
const loadWarehouses = async () => {
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    
    warehouseOptions.value = staticWarehouses.map((warehouse: Warehouse) => ({
      value: warehouse.warehouse_id,
      label: warehouse.warehouse_name
    }));
  } catch (error) {
    console.error('加载仓库列表失败:', error);
  }
};

onMounted(() => {
  loadCategoryTree();
  loadWarehouses();
});
</script>

<style scoped>
.emer-goods-container {
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
</style>