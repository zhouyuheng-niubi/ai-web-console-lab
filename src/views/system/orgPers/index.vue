<template>
  <div class="org-management-container pt-[30px] pb-[30px] px-[30px] box-border flex flex-col overflow-hidden">
    <!-- 页面标题和操作栏 - 固定不滚动 -->
    <div class="pb-[30px] flex justify-between items-center flex-shrink-0">
      <div>
        <div class="font-bold text-[22px] text-[#454F64] leading-1">组织架构</div>
        <div class="font-[400] text-[14px] text-[#717B92] leading-1">管理系统中的组织架构信息</div>
      </div>
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
          <PlusOutlined />
          <span class="ml-1 leading-none">新增部门</span>
        </span>
      </Button>
    </div>

    <!-- 主体内容：左侧树形导航 + 右侧详情 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧组织树导航 -->
      <div class="w-[300px] bg-white rounded-[12px] px-[20px] py-[20px] shadow-sm mr-[20px] flex flex-col">
        <div class="mb-[16px]">
          <Input v-model:value="searchDept" placeholder="搜索部门" />
        </div>
        <div class="flex-1 overflow-auto">
          <Tree 
            v-model:selectedKeys="selectedKeys" 
            :tree-data="treeData" 
            :field-names="{ title: 'name', key: 'id', children: 'children' }"
            :defaultExpandAll="true"
            @select="onTreeSelect"
            draggable
            @drop="onDrop"
            :blockNode="true"
          />
        </div>
      </div>

      <!-- 右侧主区域：部门详情 -->
      <div class="flex-1 bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex flex-col overflow-auto">
        <div v-if="selectedDept.id">
          <!-- 部门基本信息卡片 -->
          <Card title="部门基本信息" class="mb-[20px]">
            <Descriptions :column="2">
              <Descriptions.Item label="部门名称">{{ selectedDept.name }}</Descriptions.Item>
              <Descriptions.Item label="部门编码">{{ selectedDept.code }}</Descriptions.Item>
              <Descriptions.Item label="排序">{{ selectedDept.sort }}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge :status="selectedDept.status === 1 ? 'processing' : 'default'" 
                      :text="selectedDept.status === 1 ? '启用' : '禁用'" />
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{{ selectedDept.createTime }}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{{ selectedDept.updateTime }}</Descriptions.Item>
            </Descriptions>
          </Card>

          <!-- 部门人员列表 -->
          <Card title="部门人员列表" class="mb-[20px]">
            <SmartTable 
              :api="getPersonnelByDepartment" 
              :columns="personnelColumns" 
              :pagination="personnelPaginationConfig"
              :immediateSearch="true"
              :paramsFormatter="personnelParamsFormatter"
            />
          </Card>

          <!-- 岗位编制信息 -->
          <Card title="岗位编制信息" class="mb-[20px]">
            <div class="flex flex-wrap gap-4 mb-4">
              <Tag color="blue">管理岗 ({{ selectedDept.managementPositions || 0 }})</Tag>
              <Tag color="green">技术岗 ({{ selectedDept.technicalPositions || 0 }})</Tag>
              <Tag color="orange">操作岗 ({{ selectedDept.operationalPositions || 0 }})</Tag>
              <Tag color="volcano">辅助岗 ({{ selectedDept.supportPositions || 0 }})</Tag>
            </div>
            <Table :columns="positionColumns" :data-source="selectedDept.positions" :pagination="false" />
          </Card>

          <!-- 风险等级标识 -->
          <Card title="风险等级标识" class="mb-[20px]">
            <Descriptions :column="2">
              <Descriptions.Item label="风险等级">
                <Badge :status="getRiskLevelStatus(selectedDept.riskLevel)" 
                      :text="getRiskLevelText(selectedDept.riskLevel)" />
              </Descriptions.Item>
              <Descriptions.Item label="风险类型">{{ selectedDept.riskTypes?.join(', ') || '无' }}</Descriptions.Item>
              <Descriptions.Item label="安全负责人">{{ selectedDept.safetyOfficer || '未设置' }}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{{ selectedDept.phone || '未设置' }}</Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
        <div v-else class="flex items-center justify-center h-[300px]">
          <div class="text-center">
            <div class="text-[24px] text-gray-400">请选择一个部门</div>
            <div class="text-[14px] text-gray-500 mt-2">在左侧树形结构中选择一个部门以查看详细信息</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑部门弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="600px" 
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
      <p>确定要删除部门 "{{ currentOrg?.name }}" 吗？此操作不可恢复。</p>
      <p class="mt-2 text-orange-500">
        删除后，该部门将不再可用。
      </p>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue';
import {
  Button,
  Modal,
  Badge,
  message,
  Tree,
  Input,
  Card,
  Descriptions,
  Tag,
  Table
} from 'ant-design-vue';
import {
  PlusOutlined,
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
// 引入 smartTable 组件需要的类型
import type { ColumnItem, SearchItem } from '@/types/business';
import { baseStatus } from '@/utils/constSeting';
import dayjs from 'dayjs';
import SmartTable from '@/components/smartTable/index.vue';

// 类型定义
interface Organization {
  id: number;
  name: string;
  code: string;
  parentId: number | null;
  sort: number;
  status: number; // 1启用，0禁用
  createTime: string;
  updateTime: string;
  children?: Organization[];
  // 部门详情扩展字段
  managementPositions?: number;
  technicalPositions?: number;
  operationalPositions?: number;
  supportPositions?: number;
  positions?: Array<{
    id: number;
    name: string;
    count: number;
    filled: number;
  }>;
  riskLevel?: number; // 1-低风险，2-中风险，3-高风险，4-极高风险
  riskTypes?: string[];
  safetyOfficer?: string;
  phone?: string;
}

interface Personnel {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  status: number;
}

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增部门');
const currentOrg = ref<Organization>();
const formRef = ref();
const searchDept = ref('');
const selectedKeys = ref<number[]>([]);
const selectedDept = ref<Organization>({});

// 表单状态
const formState = reactive({
  id: undefined,
  name: '',
  code: '',
  parentId: undefined,
  sort: 0,
  status: 1 // 默认启用
});

// 树形数据
const treeData = ref<Organization[]>([]);

// 表格配置
const responseConfig = {
  listKey: 'records',
  totalKey: 'total',
};

const paginationConfig = {
  pageSize: 7,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['7', '10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
};

// 部门人员表格列配置
const personnelColumns: ColumnItem<Personnel>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '15%'
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
    width: '20%'
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width: '15%'
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: '20%'
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: '15%',
    type: 'tag',
    options: baseStatus
  }
];

// 岗位编制表格列配置
const positionColumns = [
  {
    title: '岗位名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '编制人数',
    dataIndex: 'count',
    key: 'count'
  },
  {
    title: '已配置人数',
    dataIndex: 'filled',
    key: 'filled'
  },
  {
    title: '空缺人数',
    key: 'vacant',
    customRender: ({ record }) => record.count - record.filled
  }
];

// 部门人员表格分页配置
const personnelPaginationConfig = {
  pageSize: 5,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '20'],
  showTotal: (total: number) => `共 ${total} 条记录`,
};

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 200,
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
      visible: (record: Organization) => {
        return record.status === 0;
      }
    },
    {
      label: '禁用',
      props: { type: 'link', size: 'small', danger: true },
      action: 'toggleStatus',
      visible: (record: Organization) => {
        return record.status === 1;
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

// 模拟API数据 - 部门树
const loadDepartmentTree = async () => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTreeData: Organization[] = [
        {
          id: 1,
          name: '总部',
          code: 'HQ001',
          parentId: null,
          sort: 1,
          status: 1,
          createTime: '2023-01-01 12:00:00',
          updateTime: '2023-01-01 12:00:00',
          managementPositions: 5,
          technicalPositions: 10,
          operationalPositions: 0,
          supportPositions: 3,
          positions: [
            { id: 1, name: '总经理', count: 1, filled: 1 },
            { id: 2, name: '副总经理', count: 3, filled: 2 },
            { id: 3, name: '行政助理', count: 2, filled: 1 }
          ],
          riskLevel: 2,
          riskTypes: ['管理风险', '财务风险'],
          safetyOfficer: '张三',
          phone: '10000000000',
          children: [
            {
              id: 2,
              name: '研发部',
              code: 'RD001',
              parentId: 1,
              sort: 1,
              status: 1,
              createTime: '2023-01-02 12:00:00',
              updateTime: '2023-01-02 12:00:00',
              managementPositions: 2,
              technicalPositions: 15,
              operationalPositions: 0,
              supportPositions: 2,
              positions: [
                { id: 1, name: '研发总监', count: 1, filled: 1 },
                { id: 2, name: '高级工程师', count: 5, filled: 4 },
                { id: 3, name: '工程师', count: 10, filled: 10 }
              ],
              riskLevel: 1,
              riskTypes: ['技术风险'],
              safetyOfficer: '李四',
              phone: '10000000000'
            },
            {
              id: 3,
              name: '市场部',
              code: 'MKT001',
              parentId: 1,
              sort: 2,
              status: 1,
              createTime: '2023-01-03 12:00:00',
              updateTime: '2023-01-03 12:00:00',
              managementPositions: 2,
              technicalPositions: 3,
              operationalPositions: 5,
              supportPositions: 2,
              positions: [
                { id: 1, name: '市场总监', count: 1, filled: 1 },
                { id: 2, name: '市场经理', count: 2, filled: 2 },
                { id: 3, name: '市场专员', count: 5, filled: 4 }
              ],
              riskLevel: 3,
              riskTypes: ['市场风险', '竞争风险'],
              safetyOfficer: '王五',
              phone: '10000000000'
            }
          ]
        },
        {
          id: 4,
          name: '测试部',
          code: 'TEST001',
          parentId: null,
          sort: 2,
          status: 1,
          createTime: '2023-01-04 12:00:00',
          updateTime: '2023-01-04 12:00:00',
          managementPositions: 1,
          technicalPositions: 8,
          operationalPositions: 0,
          supportPositions: 1,
          positions: [
            { id: 1, name: '测试经理', count: 1, filled: 1 },
            { id: 2, name: '高级测试工程师', count: 3, filled: 3 },
            { id: 3, name: '测试工程师', count: 5, filled: 4 }
          ],
          riskLevel: 1,
          riskTypes: ['质量风险'],
          safetyOfficer: '赵六',
          phone: '10000000000'
        }
      ];
      resolve({
        data: mockTreeData
      });
      treeData.value = mockTreeData;
    }, 500);
  });
};

// 获取部门人员API
const getPersonnelByDepartment = async (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟部门人员数据
      const mockPersonnel: Personnel[] = [
        { id: 1, name: '张三', position: '部门经理', phone: '10000000000', email: 'maintainer@example.com', status: 1 },
        { id: 2, name: '李四', position: '高级工程师', phone: '10000000000', email: 'maintainer@example.com', status: 1 },
        { id: 3, name: '王五', position: '工程师', phone: '10000000000', email: 'maintainer@example.com', status: 1 },
        { id: 4, name: '赵六', position: '助理', phone: '10000000000', email: 'maintainer@example.com', status: 0 },
      ];
      resolve({
        data: {
          records: mockPersonnel,
          total: mockPersonnel.length
        }
      });
    }, 300);
  });
};

// 人员参数格式化
const personnelParamsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params,
    departmentId: selectedDept.value.id
  };

  if (pagination) {
    formattedParams.pageNum = pagination.current || 1;
    formattedParams.pageSize = pagination.pageSize || 5;
  }

  return formattedParams;
};

// 获取风险等级状态
const getRiskLevelStatus = (level: number) => {
  switch (level) {
    case 1: return 'success'; // 低风险
    case 2: return 'warning'; // 中风险
    case 3: return 'error'; // 高风险
    case 4: return 'default'; // 极高风险
    default: return 'default';
  }
};

// 获取风险等级文本
const getRiskLevelText = (level: number) => {
  switch (level) {
    case 1: return '低风险';
    case 2: return '中风险';
    case 3: return '高风险';
    case 4: return '极高风险';
    default: return '未定义';
  }
};

// 树节点选择事件
const onTreeSelect = (selectedKeysValue: number[], e: { selected: boolean; node: any }) => {
  if (selectedKeysValue.length > 0) {
    const nodeId = selectedKeysValue[0];
    // 查找选中的节点
    const findNode = (nodes: Organization[], id: number): Organization | null => {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.children) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    
    const node = findNode(treeData.value, nodeId);
    if (node) {
      selectedDept.value = { ...node };
    }
  }
};

// 拖拽事件
const onDrop = (info: any) => {
  const dropKey = info.node.eventKey;
  const dragKey = info.dragNode.eventKey;
  const dropPos = info.node.pos.split('-');
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

  const loop = (data: Organization[], key: number, callback: (node: Organization, i: number, data: Organization[]) => void) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === key) {
        return callback(data[i], i, data);
      }
      if (data[i].children) {
        loop(data[i].children!, key, callback);
      }
    }
  };

  const data = [...treeData.value];

  // Find dragObject
  let dragObj: Organization | undefined;
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1);
    dragObj = item;
  });

  if (dragObj) {
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      // where to insert. pos: 0 means before the drop node, 1 means after, -1 means inside
      if (dropPosition === -1) {
        item.children.unshift(dragObj);
      } else {
        item.children.splice(dropPosition, 0, dragObj);
      }
    });
    treeData.value = data;
    message.success('部门结构调整成功');
  }
};

// 表格列配置
const columns: ColumnItem<Organization>[] = [
  {
    title: '部门名称',
    dataIndex: 'name',
    key: 'name',
    width: '20%'
  },
  {
    title: '部门编码',
    dataIndex: 'code',
    key: 'code',
    width: '15%'
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: '10%'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: '15%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: '10%',
    type: 'tag',
    options: baseStatus
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'name',
    label: '部门名称',
    type: 'input',
    placeholder: '请输入部门名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'code',
    label: '部门编码',
    type: 'input',
    placeholder: '请输入部门编码',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    props: {
      allowClear: true,
      placeholder: '请选择状态',
      options: baseStatus
    },
    colSpan: 6
  }
];

// AdvancedForm schema配置
const formSchema = [
  {
    key: 'name',
    label: '部门名称',
    type: 'input',
    required: true,
    props: {
      maxlength: 50,
      placeholder: '请输入部门名称'
    },
    rules: [
      { required: true, message: '请输入部门名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' }
    ]
  },
  {
    key: 'code',
    label: '部门编码',
    type: 'input',
    required: true,
    props: {
      maxlength: 20,
      placeholder: '请输入部门编码'
    },
    rules: [
      { required: true, message: '请输入部门编码', trigger: 'blur' },
      { pattern: /^[A-Za-z0-9_-]+$/, message: '编码只能包含字母、数字、下划线和横线', trigger: 'blur' }
    ]
  },
  {
    key: 'parentId',
    label: '上级部门',
    type: 'select',
    props: {
      placeholder: '请选择上级部门',
      options: treeData.value.map(item => ({ value: item.id, label: item.name }))
    }
  },
  {
    key: 'sort',
    label: '排序',
    type: 'inputNumber',
    props: {
      min: 0,
      placeholder: '请输入排序值'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'radioGroup',
    props: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  }
];

// 方法
const showAddModal = () => {
  modalTitle.value = '新增部门';
  resetForm();
  modalVisible.value = true;
};

const editOrg = (record: Organization) => {
  modalTitle.value = '编辑部门';
  resetForm();
  modalVisible.value = true;

  // 使用 nextTick 确保表单组件已经完全渲染
  nextTick(() => {
    formState.id = record.id;
    formState.name = record.name;
    formState.code = record.code;
    formState.parentId = record.parentId || undefined;
    formState.sort = record.sort;
    formState.status = record.status;
  });
};

const toggleStatus = async (record: Organization) => {
  try {
    const newStatus = record.status === 1 ? 0 : 1;

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));

    message.success(`已${record.status === 1 ? '禁用' : '启用'}部门`);
    // 重新加载数据
    loadDepartmentTree();
  } catch (error) {
    message.error('状态切换失败');
  }
};

const confirmDelete = (record: Organization) => {
  currentOrg.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    modalLoading.value = true;

    // 表单验证
    await formRef.value?.validate();

    if (modalTitle.value === '新增部门') {
      // 新增部门 - 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('新增部门成功');
    } else {
      // 编辑部门 - 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('编辑部门成功');
    }

    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    loadDepartmentTree();
  } catch (error: any) {
    console.error('操作失败:', error);
    message.error(error.message || (modalTitle.value === '新增部门' ? '新增部门失败' : '编辑部门失败'));
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
    if (!currentOrg.value) return;

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));

    message.success('删除部门成功');
    deleteModalVisible.value = false;
    currentOrg.value = undefined;
    // 重新加载数据
    loadDepartmentTree();
  } catch (error) {
    message.error('删除部门失败');
  }
};

const resetForm = () => {
  formState.id = undefined;
  formState.name = '';
  formState.code = '';
  formState.parentId = undefined;
  formState.sort = 0;
  formState.status = 1;
};

// 操作列事件处理
const handleAction = (action: string, record: Organization, index: number) => {
  console.log('操作:', action, '记录:', record, '索引:', index);
  switch (action) {
    case 'edit':
      editOrg(record);
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

// 初始化数据
onMounted(async () => {
  await loadDepartmentTree();
});
</script>

<style scoped>
.org-management-container {
  height: 100%;
  overflow: hidden;
}

:deep(.ant-descriptions-item-label) {
  font-weight: bold;
}
</style>