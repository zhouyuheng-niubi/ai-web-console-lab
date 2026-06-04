<template>
  <div class="response-list-container">
    <!-- 页面标题 -->
    <!-- <div class="page-header">
      <h2>责任清单</h2>
    </div> -->

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 左侧分类菜单 -->
      <div class="left-menu">
        <Menu
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          @click="handleMenuClick"
        >
          <MenuItem 
            v-for="item in menuItems" 
            :key="item.key"
          >
            {{ item.title }}
          </MenuItem>
        </Menu>
      </div>

      <!-- 右侧内容区域 -->
      <div class="right-content">
        <!-- 操作按钮区域 -->
        <div class="action-buttons p-[16px]">
          <Button type="primary" @click="handleCreate">
            <span>
                <PlusOutlined />
                新建检查项目
            </span>
          </Button>
          <Button @click="handleExport">
            <span>
                <DownloadOutlined />
                导出综合安全隐患检查
            </span>
          </Button>
          <Button @click="handleDownloadTemplate">
            <span>
                <DownloadOutlined />
                下载检查项模板
            </span>
          </Button>
          <Button @click="handleImport">
            <span>
                <UploadOutlined />
                导入清单检查项
            </span>
          </Button>
        </div>

        <!-- 列表区域 -->
        <div class="list-container">
          <SmartTable
            ref="smartTableRef"
            :columns="tableColumns"
            :data-source="tableData"
            :pagination="pagination"
            :loading="loading"
            :action-column="actionColumn"
            @action="handleTableAction"
          />
        </div>
      </div>
    </div>

    <!-- 详情表单弹窗 -->
    <Modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :confirm-loading="confirmLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      width="600px"
    >
      <AdvancedForm
        v-if="modalVisible"
        ref="advancedFormRef"
        :schema="formSchema"
        :model="formModel"
        mode="form"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { message, Modal, Button, Menu, MenuItem } from 'ant-design-vue';
import { PlusOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue';

// 菜单数据
const menuItems = ref([
  { key: '1', title: '综合安全隐患检查' },
  { key: '2', title: '节假日安全隐患检查' },
  { key: '3', title: '春季安全隐患检查' },
  { key: '4', title: '夏季安全隐患检查' },
  { key: '5', title: '秋季安全隐患检查' },
  { key: '6', title: '冬季安全隐患检查' },
  { key: '7', title: '职业健康检查' }
]);

// 当前选中的菜单项
const selectedKeys = ref(['1']);

// 表格数据
const tableData = ref([]);

// 所有模拟数据
const allMockData = ref([
  // 综合安全隐患检查
  {
    id: 1,
    category: '综合安全隐患检查',
    content: '检查消防设施是否完好有效'
  },
  {
    id: 2,
    category: '综合安全隐患检查',
    content: '检查疏散通道是否畅通'
  },
  {
    id: 3,
    category: '综合安全隐患检查',
    content: '检查应急照明和疏散指示标志是否正常'
  },
  {
    id: 4,
    category: '综合安全隐患检查',
    content: '检查电气线路是否存在老化、破损现象'
  },
  {
    id: 5,
    category: '综合安全隐患检查',
    content: '检查危险化学品储存是否符合规定'
  },
  
  // 节假日安全隐患检查
  {
    id: 6,
    category: '节假日安全隐患检查',
    content: '检查值班人员是否在岗在位'
  },
  {
    id: 7,
    category: '节假日安全隐患检查',
    content: '检查重点部位安全防范措施是否落实'
  },
  {
    id: 8,
    category: '节假日安全隐患检查',
    content: '检查应急物资是否充足可用'
  },
  
  // 春季安全隐患检查
  {
    id: 9,
    category: '春季安全隐患检查',
    content: '检查防雷设施是否完好'
  },
  {
    id: 10,
    category: '春季安全隐患检查',
    content: '检查防汛物资是否准备充分'
  },
  {
    id: 11,
    category: '春季安全隐患检查',
    content: '检查室外设备设施是否稳固'
  },
  
  // 夏季安全隐患检查
  {
    id: 12,
    category: '夏季安全隐患检查',
    content: '检查防暑降温措施是否到位'
  },
  {
    id: 13,
    category: '夏季安全隐患检查',
    content: '检查用电设备散热情况是否良好'
  },
  {
    id: 14,
    category: '夏季安全隐患检查',
    content: '检查易燃易爆物品储存是否符合要求'
  },
  
  // 秋季安全隐患检查
  {
    id: 15,
    category: '秋季安全隐患检查',
    content: '检查干燥季节防火措施是否落实'
  },
  {
    id: 16,
    category: '秋季安全隐患检查',
    content: '检查落叶清理是否及时'
  },
  
  // 冬季安全隐患检查
  {
    id: 17,
    category: '冬季安全隐患检查',
    content: '检查供暖设备是否安全运行'
  },
  {
    id: 18,
    category: '冬季安全隐患检查',
    content: '检查防冻保温措施是否到位'
  },
  {
    id: 19,
    category: '冬季安全隐患检查',
    content: '检查冰雪天气安全防护是否完善'
  },
  
  // 职业健康检查
  {
    id: 20,
    category: '职业健康检查',
    content: '检查职业病防护设施是否正常运行'
  },
  {
    id: 21,
    category: '职业健康检查',
    content: '检查个人防护用品配备是否齐全'
  },
  {
    id: 22,
    category: '职业健康检查',
    content: '检查作业场所职业病危害因素检测是否合格'
  }
]);

// 加载状态
const loading = ref(false);

// 分页配置
const pagination = reactive({
  pageSize: 10,
  current: 1,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据`
});

// 表格引用
const smartTableRef = ref();

// 表格列配置
const actionColumn = {
  title: '操作',
  width: 150,
  fixed: 'right',
  actions: [
    {
      label: '编辑',
      icon: 'EditOutlined',
      action: 'edit',
      props: { type: 'link' }
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      action: 'delete',
      props: {
        danger: true,
        type: 'link'
      }
    }
  ]
}
const tableColumns = ref([
  {
    title: '安全类别',
    dataIndex: 'category',
    key: 'category'
  },
  {
    title: '检查内容',
    dataIndex: 'content',
    key: 'content'
  },
]);

// 弹窗相关
const modalVisible = ref(false);
const confirmLoading = ref(false);
const modalType = ref('create'); // create 或 edit
const currentRecord = ref(null);

// 表单引用
const advancedFormRef = ref();

// 表单模型
const formModel = reactive({
  category: null,
  content: ''
});

// 表单配置
const getCategoryOptions = () => {
  return menuItems.value.map(item => ({
    label: item.title,
    value: item.title
  }));
};

const formSchema = ref([
  {
    key: 'category',
    label: '安全类别',
    type: 'select',
    required: true,
    placeholder: '请选择安全类别',
    props:{
      options: getCategoryOptions(),
      showSearch: true
    }
  },
  {
    key: 'content',
    label: '检查内容',
    type: 'textarea',
    required: true,
    placeholder: '请输入检查内容',
    props: {
      rows: 4
    }
  }
]);

// 弹窗标题计算属性
const modalTitle = computed(() => {
  return modalType.value === 'create' ? '新建检查项目' : '编辑检查项目';
});

// 菜单点击事件
const handleMenuClick = ({ key }) => {
  console.log('选中的菜单项:', key);
  selectedKeys.value = [key];
  // 模拟加载数据
  loadTableData();
};

// 加载表格数据
const loadTableData = () => {
  loading.value = true;
  
  // 模拟异步加载数据
  setTimeout(() => {
    // 根据选中的菜单项过滤数据
    const selectedKey = selectedKeys.value[0];
    const selectedMenu = menuItems.value.find(item => item.key === selectedKey);
    
    let filteredData = [];
    if (selectedMenu) {
      filteredData = allMockData.value.filter(item => item.category === selectedMenu.title);
    } else {
      filteredData = [...allMockData.value];
    }
    
    tableData.value = filteredData;
    pagination.total = filteredData.length;
    loading.value = false;
  }, 500);
};

// 处理新建检查项目
const handleCreate = () => {
  modalType.value = 'create';
  // 重置表单数据
  Object.keys(formModel).forEach(key => {
    formModel[key] = null;
  });
  // 更新表单配置以确保获取最新的菜单选项
  formSchema.value[0].options = getCategoryOptions();
  const selectedKey = selectedKeys.value[0];
  const selectedMenu = menuItems.value.find(item => item.key === selectedKey);
  formModel.category = selectedMenu ? selectedMenu.title : null;
  modalVisible.value = true;
};

// 处理导出
const handleExport = () => {
  return message.info('功能开发中，敬请期待')
  message.success('正在导出综合安全隐患检查...');
  // 实际项目中这里会调用导出接口
};

// 处理下载模板
const handleDownloadTemplate = () => {
  return message.info('功能开发中，敬请期待')
  message.success('正在下载检查项模板...');
  // 实际项目中这里会调用下载接口
};

// 处理导入
const handleImport = () => {
  return message.info('功能开发中，敬请期待')
  message.success('正在导入清单检查项...');
  // 实际项目中这里会调用导入接口
};

// 处理表格操作
const handleTableAction = (action, record) => {
  switch (action) {
    case 'edit':
      handleEdit(record);
      break;
    case 'delete':
      handleDelete(record);
      break;
  }
};

// 处理编辑
const handleEdit = (record) => {
  modalType.value = 'edit';
  currentRecord.value = record;
  
  // 设置表单数据
  Object.keys(formModel).forEach(key => {
    formModel[key] = record[key] || null;
  });
  
  modalVisible.value = true;
};

// 处理删除
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除"${record.category}"这条检查项目吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      // 实际删除数据
      const index = allMockData.value.findIndex(item => item.id === record.id);
      if (index !== -1) {
        allMockData.value.splice(index, 1);
        message.success('删除成功');
        // 重新加载数据
        loadTableData();
      }
    }
  });
};

// 处理弹窗确认
const handleModalOk = () => {
  confirmLoading.value = true;
  
  // 表单验证
  advancedFormRef.value.validate().then(() => {
    // 模拟保存操作
    setTimeout(() => {
      if (modalType.value === 'create') {
        // 新增数据
        const newId = allMockData.value.length > 0 
          ? Math.max(...allMockData.value.map(item => item.id)) + 1 
          : 1;
        
        const newData = {
          id: newId,
          category: formModel.category,
          content: formModel.content
        };
        
        allMockData.value.unshift(newData);
        message.success('新建成功');
      } else {
        // 编辑数据
        const index = allMockData.value.findIndex(item => item.id === currentRecord.value.id);
        if (index !== -1) {
          allMockData.value[index] = {
            ...allMockData.value[index],
            category: formModel.category,
            content: formModel.content
          };
          message.success('编辑成功');
        }
      }
      
      confirmLoading.value = false;
      modalVisible.value = false;
      
      // 重新加载数据
      loadTableData();
    }, 1000);
  }).catch(() => {
    confirmLoading.value = false;
  });
};

// 处理弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false;
};

// 组件挂载时加载数据
onMounted(() => {
  // 初始化时确保选中第一个菜单项
  if (menuItems.value.length > 0 && (!selectedKeys.value || selectedKeys.value.length === 0)) {
    selectedKeys.value = [menuItems.value[0].key];
  }
  loadTableData();
});
</script>

<style scoped>
.response-list-container {
  padding: 16px;
  /* background-color: #fff; */
  /* border-radius: 4px; */
}

.page-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.main-content {
  display: flex;
  gap: 20px;
}

.left-menu {
  width: 250px;
  flex-shrink: 0;
  border-right: 1px solid #f0f0f0;
  padding-right: 20px;
  background-color: #fff;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.action-buttons {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.list-container {
  flex: 1;
}
:deep(.ant-menu-light.ant-menu-root.ant-menu-inline){
  border: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-menu {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding-right: 0;
    padding-bottom: 20px;
  }
}
</style>