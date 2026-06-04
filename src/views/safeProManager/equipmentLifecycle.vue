<template>
  <div class="equipment-lifecycle-container">
    <Tabs v-model:activeKey="activeKey" @change="onTabChange">
      <TabPane key="acceptance" tab="设备验收">
        <div class="table-actions">
          <Button type="primary" @click="showAcceptanceModal">新增验收</Button>
        </div>
        <SmartTable
          :columns="acceptanceColumns"
          :data-source="acceptanceData"
          :pagination="pagination"
          @change="handleTableChange"
          :actionColumn="acceptanceActionColumn"
          @action="handleAcceptanceAction"
        />
      </TabPane>
      
      <TabPane key="inventory" tab="盘点任务">
        <div class="table-actions">
          <Button type="primary" @click="showInventoryModal">新增盘点任务</Button>
        </div>
        <SmartTable
          :columns="inventoryColumns"
          :data-source="inventoryData"
          :pagination="pagination"
          @change="handleTableChange"
          :actionColumn="inventoryActionColumn"
          @action="handleInventoryAction"
        />
      </TabPane>
    </Tabs>

    <!-- 设备验收模态框 -->
    <Modal
      v-model:open="acceptanceModalVisible"
      :title="acceptanceModalTitle"
      @ok="handleAcceptanceOk"
      @cancel="handleAcceptanceCancel"
      width="800px"
      :confirm-loading="acceptanceModalLoading"
    >
      <AdvancedForm
        ref="acceptanceFormRef"
        :schema="acceptanceFormSchema"
        :model="acceptanceFormState"
        mode="form"
        formLayout="horizontal"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
      />
    </Modal>

    <!-- 盘点任务模态框 -->
    <Modal
      v-model:open="inventoryModalVisible"
      :title="inventoryModalTitle"
      @ok="handleInventoryOk"
      @cancel="handleInventoryCancel"
      width="1000px"
      :confirm-loading="inventoryModalLoading"
    >
      <AdvancedForm
        ref="inventoryFormRef"
        :schema="inventoryFormSchema"
        :model="inventoryFormState"
        mode="form"
        formLayout="horizontal"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { 
  Tabs, 
  TabPane, 
  Button, 
  Modal, 
  message
} from 'ant-design-vue'

// 当前激活的tab
const activeKey = ref('acceptance')

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const acceptanceData = ref([])
const inventoryData = ref([])

// 模态框显示控制
const acceptanceModalVisible = ref(false)
const inventoryModalVisible = ref(false)

// 模态框标题和加载状态
const acceptanceModalTitle = ref('新增设备验收')
const inventoryModalTitle = ref('新增盘点任务')
const acceptanceModalLoading = ref(false)
const inventoryModalLoading = ref(false)

// 表单引用
const acceptanceFormRef = ref()
const inventoryFormRef = ref()

// 表单数据模型
const acceptanceFormState = reactive({
  id: undefined,
  code: '',
  acceptanceType: undefined,
  equipmentCode: '',
  equipmentName: '',
  acceptor: '',
  acceptanceTime: null,
  remark: '',
  approvalStatus: undefined
})

const inventoryFormState = reactive({
  id: undefined,
  taskCode: '',
  planCode: '',
  planTitle: '',
  planManager: '',
  inventoryTime: null,
  inventoryMethod: undefined,
  planInventoryTime: null,
  manager: '',
  status: undefined,
  shouldCount: 0,
  actualCount: 0,
  lossCount: 0,
  profitCount: 0
})

// 设备验收表单配置 - 2列布局
const acceptanceFormSchema = [
  {
    key: 'code',
    label: '编号',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入编号'
    },
    rules: [
      { required: true, message: '请输入编号', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'acceptanceType',
    label: '验收类型',
    type: 'select',
    required: true,
    props: {
      placeholder: '请选择验收类型',
      options: [
        { value: 'arrival', label: '到货验收' },
        { value: 'trial', label: '试运行验收' },
        { value: 'warranty', label: '质保验收' }
      ]
    },
    rules: [
      { required: true, message: '请选择验收类型', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'equipmentCode',
    label: '设备编号',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入设备编号'
    },
    rules: [
      { required: true, message: '请输入设备编号', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'equipmentName',
    label: '设备名称',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入设备名称'
    },
    rules: [
      { required: true, message: '请输入设备名称', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'acceptor',
    label: '验收人',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入验收人'
    },
    rules: [
      { required: true, message: '请输入验收人', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'acceptanceTime',
    label: '验收时间',
    type: 'datePicker',
    required: true,
    props: {
      placeholder: '请选择验收时间',
      valueFormat: 'YYYY-MM-DD'
    },
    rules: [
      { required: true, message: '请选择验收时间', trigger: 'change' }
    ],
    colSpan: 12
  },
  // {
  //   key: 'approvalStatus',
  //   label: '审批状态',
  //   type: 'select',
  //   required: true,
  //   props: {
  //     placeholder: '请选择审批状态',
  //     options: [
  //       { value: 'pending', label: '待审批' },
  //       { value: 'approved', label: '已审批' },
  //       { value: 'rejected', label: '已拒绝' }
  //     ]
  //   },
  //   rules: [
  //     { required: true, message: '请选择审批状态', trigger: 'change' }
  //   ],
  //   colSpan: 12
  // },
  {
    key: 'remark',
    label: '备注',
    type: 'textarea',
    props: {
      placeholder: '请输入备注',
      rows: 4
    },
    colSpan: 24
  }
]

const ysType = [
  { value: 'arrival', label: '到货验收' },
  { value: 'trial', label: '试运行验收' },
  { value: 'warranty', label: '质保验收' }
]
const approvalType = [
  { value: 'pending', label: '待审批' },
  { value: 'approved', label: '已审批' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'canceled', label: '已取消' },
  { value: 'completed', label: '已完成' }
]

const taskStatus = [
  { value: 'notStarted', label: '未开始' },
  { value: 'inProgress', label: '进行中' },
  { value: 'completed', label: '已完成' }
]

// 盘点任务表单配置 - 2列布局
const inventoryFormSchema = [
  {
    key: 'taskCode',
    label: '任务编号',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入任务编号'
    },
    rules: [
      { required: true, message: '请输入任务编号', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'planCode',
    label: '计划编号',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入计划编号'
    },
    rules: [
      { required: true, message: '请输入计划编号', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'planTitle',
    label: '计划标题',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入计划标题'
    },
    rules: [
      { required: true, message: '请输入计划标题', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'planManager',
    label: '计划负责人',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入计划负责人'
    },
    rules: [
      { required: true, message: '请输入计划负责人', trigger: 'blur' }
    ],
    colSpan: 12
  },
  {
    key: 'inventoryTime',
    label: '盘点时间',
    type: 'datePicker',
    required: true,
    props: {
      placeholder: '请选择盘点时间',
      valueFormat: 'YYYY-MM-DD'
    },
    rules: [
      { required: true, message: '请选择盘点时间', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'inventoryMethod',
    label: '盘点方式',
    type: 'select',
    required: true,
    props: {
      placeholder: '请选择盘点方式',
      options: [
        { value: 'manual', label: '人工盘点' },
        { value: 'automatic', label: '自动盘点' }
      ]
    },
    rules: [
      { required: true, message: '请选择盘点方式', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'planInventoryTime',
    label: '计划盘点时间',
    type: 'datePicker',
    required: true,
    props: {
      placeholder: '请选择计划盘点时间',
      valueFormat: 'YYYY-MM-DD'
    },
    rules: [
      { required: true, message: '请选择计划盘点时间', trigger: 'change' }
    ],
    colSpan: 12
  },
  {
    key: 'manager',
    label: '负责人',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入负责人'
    },
    rules: [
      { required: true, message: '请输入负责人', trigger: 'blur' }
    ],
    colSpan: 12
  },
  // {
  //   key: 'status',
  //   label: '状态',
  //   type: 'select',
  //   required: true,
  //   props: {
  //     placeholder: '请选择状态',
  //     options: taskStatus,

  //   },
  //   rules: [
  //     { required: true, message: '请选择状态', trigger: 'change' }
  //   ],
  //   colSpan: 12
  // },
  {
    key: 'shouldCount',
    label: '应盘',
    type: 'inputNumber',
    props: {
      placeholder: '请输入应盘数量',
      min: 0
    },
    colSpan: 6
  },
  {
    key: 'actualCount',
    label: '已盘',
    type: 'inputNumber',
    props: {
      placeholder: '请输入已盘数量',
      min: 0
    },
    colSpan: 6
  },
  {
    key: 'lossCount',
    label: '盘亏',
    type: 'inputNumber',
    props: {
      placeholder: '请输入盘亏数量',
      min: 0
    },
    colSpan: 6
  },
  {
    key: 'profitCount',
    label: '盘盈',
    type: 'inputNumber',
    props: {
      placeholder: '请输入盘盈数量',
      min: 0
    },
    colSpan: 6
  }
]

// 设备验收表格列定义
const acceptanceColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    customRender: ({ index }) => {
      console.log('index:', index)
     return index + 1
    }
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code'
  },
  {
    title: '验收类型',
    dataIndex: 'acceptanceType',
    key: 'acceptanceType',
    type: 'tag',
    options: ysType
  },
  {
    title: '设备编号',
    dataIndex: 'equipmentCode',
    key: 'equipmentCode'
  },
  {
    title: '设备名称',
    dataIndex: 'equipmentName',
    key: 'equipmentName'
  },
  {
    title: '验收人',
    dataIndex: 'acceptor',
    key: 'acceptor'
  },
  {
    title: '验收时间',
    dataIndex: 'acceptanceTime',
    key: 'acceptanceTime'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '审批状态',
    dataIndex: 'approvalStatus',
    key: 'approvalStatus',
    type: 'tag',
    options: approvalType
  }
]

// 盘点任务表格列定义
const inventoryColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    // customRender: ({ index }) => index + 1
  },
  {
    title: '任务编号',
    dataIndex: 'taskCode',
    key: 'taskCode'
  },
  {
    title: '计划编号',
    dataIndex: 'planCode',
    key: 'planCode'
  },
  {
    title: '计划标题',
    dataIndex: 'planTitle',
    key: 'planTitle'
  },
  {
    title: '计划负责人',
    dataIndex: 'planManager',
    key: 'planManager'
  },
  {
    title: '盘点时间',
    dataIndex: 'inventoryTime',
    key: 'inventoryTime'
  },
  {
    title: '盘点方式',
    dataIndex: 'inventoryMethod',
    key: 'inventoryMethod',
    type: 'tag',
    options: [
      { value: 'manual', label: '人工盘点' },
      { value: 'automatic', label: '自动盘点' }
    ]
  },
  {
    title: '计划盘点时间',
    dataIndex: 'planInventoryTime',
    key: 'planInventoryTime'
  },
  {
    title: '负责人',
    dataIndex: 'manager',
    key: 'manager'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    type: 'tag',
    options: taskStatus
  },
  {
    title: '应盘',
    dataIndex: 'shouldCount',
    key: 'shouldCount'
  },
  {
    title: '已盘',
    dataIndex: 'actualCount',
    key: 'actualCount'
  },
  {
    title: '盘亏',
    dataIndex: 'lossCount',
    key: 'lossCount'
  },
  {
    title: '盘盈',
    dataIndex: 'profitCount',
    key: 'profitCount'
  }
]

// 设备验收操作列配置
const acceptanceActionColumn = {
  title: '操作',
  width: 150,
  fixed: 'right',
  actions: [
    {
      label: '编辑',
      icon: 'EditOutlined',
      action: 'edit',
      props: {
        type: 'link'
      },
      visible: (record) => {
        return record.approvalStatus !== 'approved' && record.approvalStatus !== 'completed';
      }
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      action: 'delete',
      props: {
        danger: true,
        type: 'link'
      },
      
    }
  ]
}

// 盘点任务操作列配置
const inventoryActionColumn = {
  title: '操作',
  width: 150,
  fixed: 'right',
  actions: [
    {
      label: '编辑',
      icon: 'EditOutlined',
      action: 'edit',
      props: {
        type: 'link'
      },
      visible: (record) => {
        return record.status !== 'approved' && record.status !== 'completed';
      }
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

// Tab切换事件
const onTabChange = (key) => {
  console.log('当前激活的tab:', key)
}

// 表格分页变化事件
const handleTableChange = (pag) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  // 使用模拟数据，无需重新加载
}

// 显示设备验收模态框
const showAcceptanceModal = () => {
  acceptanceModalTitle.value = '新增设备验收'
  resetAcceptanceForm()
  acceptanceModalVisible.value = true
}

// 显示盘点任务模态框
const showInventoryModal = () => {
  inventoryModalTitle.value = '新增盘点任务'
  resetInventoryForm()
  inventoryModalVisible.value = true
}

// 处理设备验收操作
const handleAcceptanceAction = (action, record, index) => {
  switch (action) {
    case 'edit':
      editAcceptance(record)
      break
    case 'delete':
      deleteAcceptance(record)
      break
    default:
      console.warn('未知操作:', action)
  }
}

// 处理盘点任务操作
const handleInventoryAction = (action, record, index) => {
  switch (action) {
    case 'edit':
      editInventory(record)
      break
    case 'delete':
      deleteInventory(record)
      break
    default:
      console.warn('未知操作:', action)
  }
}

// 编辑设备验收
const editAcceptance = (record) => {
  acceptanceModalTitle.value = '编辑设备验收'
  resetAcceptanceForm()
  acceptanceModalVisible.value = true
  
  // 使用 nextTick 确保表单组件已经完全渲染
  nextTick(() => {
    acceptanceFormState.id = record.id
    acceptanceFormState.code = record.code
    acceptanceFormState.acceptanceType = record.acceptanceType
    acceptanceFormState.equipmentCode = record.equipmentCode
    acceptanceFormState.equipmentName = record.equipmentName
    acceptanceFormState.acceptor = record.acceptor
    acceptanceFormState.acceptanceTime = record.acceptanceTime
    acceptanceFormState.remark = record.remark
    acceptanceFormState.approvalStatus = record.approvalStatus
  })
}

// 删除设备验收
const deleteAcceptance = (record) => {
  // 从数据列表中移除
  const index = acceptanceData.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    acceptanceData.value.splice(index, 1)
    message.success('删除成功')
    // 更新分页总数
    pagination.total = Math.max(acceptanceData.value.length, inventoryData.value.length)
  }
}

// 编辑盘点任务
const editInventory = (record) => {
  inventoryModalTitle.value = '编辑盘点任务'
  resetInventoryForm()
  inventoryModalVisible.value = true
  
  // 使用 nextTick 确保表单组件已经完全渲染
  nextTick(() => {
    inventoryFormState.id = record.id
    inventoryFormState.taskCode = record.taskCode
    inventoryFormState.planCode = record.planCode
    inventoryFormState.planTitle = record.planTitle
    inventoryFormState.planManager = record.planManager
    inventoryFormState.inventoryTime = record.inventoryTime
    inventoryFormState.inventoryMethod = record.inventoryMethod
    inventoryFormState.planInventoryTime = record.planInventoryTime
    inventoryFormState.manager = record.manager
    inventoryFormState.status = record.status
    inventoryFormState.shouldCount = record.shouldCount
    inventoryFormState.actualCount = record.actualCount
    inventoryFormState.lossCount = record.lossCount
    inventoryFormState.profitCount = record.profitCount
  })
}

// 删除盘点任务
const deleteInventory = (record) => {
  // 从数据列表中移除
  const index = inventoryData.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    inventoryData.value.splice(index, 1)
    message.success('删除成功')
    // 更新分页总数
    pagination.total = Math.max(acceptanceData.value.length, inventoryData.value.length)
  }
}

// 处理设备验收确认
const handleAcceptanceOk = async () => {
  try {
    acceptanceModalLoading.value = true
    
    // 表单验证
    await acceptanceFormRef.value?.validate()
    
    // 保存逻辑
    if (acceptanceModalTitle.value === '新增设备验收') {
      // 新增逻辑
      // 生成新的ID
      const newId = acceptanceData.value.length > 0 
        ? Math.max(...acceptanceData.value.map(item => item.id)) + 1 
        : 1
      
      // 添加到数据列表
      acceptanceData.value.push({
        ...acceptanceFormState,
        id: newId,
        approvalStatus: 'pending'
      })
      
      message.success('新增设备验收成功')
    } else {
      // 编辑逻辑
      const index = acceptanceData.value.findIndex(item => item.id === acceptanceFormState.id)
      if (index !== -1) {
        acceptanceData.value[index] = { ...acceptanceFormState }
        message.success('编辑设备验收成功')
      }
    }
    
    acceptanceModalVisible.value = false
    resetAcceptanceForm()
    // 更新分页总数
    pagination.total = Math.max(acceptanceData.value.length, inventoryData.value.length)
  } catch (error) {
    console.error('操作失败:', error)
    message.error(acceptanceModalTitle.value === '新增设备验收' ? '新增设备验收失败' : '编辑设备验收失败')
  } finally {
    acceptanceModalLoading.value = false
  }
}

// 处理设备验收取消
const handleAcceptanceCancel = () => {
  acceptanceModalVisible.value = false
  resetAcceptanceForm()
}

// 处理盘点任务确认
const handleInventoryOk = async () => {
  try {
    inventoryModalLoading.value = true
    
    // 表单验证
    await inventoryFormRef.value?.validate()
    
    // 保存逻辑
    if (inventoryModalTitle.value === '新增盘点任务') {
      // 新增逻辑
      // 生成新的ID
      const newId = inventoryData.value.length > 0 
        ? Math.max(...inventoryData.value.map(item => item.id)) + 1 
        : 1
      
      // 添加到数据列表
      inventoryData.value.push({
        ...inventoryFormState,
        status: 'pending',
        id: newId
      })
      
      message.success('新增盘点任务成功')
    } else {
      // 编辑逻辑
      const index = inventoryData.value.findIndex(item => item.id === inventoryFormState.id)
      if (index !== -1) {
        inventoryData.value[index] = { ...inventoryFormState }
        message.success('编辑盘点任务成功')
      }
    }
    
    inventoryModalVisible.value = false
    resetInventoryForm()
    // 更新分页总数
    pagination.total = Math.max(acceptanceData.value.length, inventoryData.value.length)
  } catch (error) {
    console.error('操作失败:', error)
    message.error(inventoryModalTitle.value === '新增盘点任务' ? '新增盘点任务失败' : '编辑盘点任务失败')
  } finally {
    inventoryModalLoading.value = false
  }
}

// 处理盘点任务取消
const handleInventoryCancel = () => {
  inventoryModalVisible.value = false
  resetInventoryForm()
}

// 重置设备验收表单
const resetAcceptanceForm = () => {
  acceptanceFormState.id = undefined
  acceptanceFormState.code = ''
  acceptanceFormState.acceptanceType = undefined
  acceptanceFormState.equipmentCode = ''
  acceptanceFormState.equipmentName = ''
  acceptanceFormState.acceptor = ''
  acceptanceFormState.acceptanceTime = null
  acceptanceFormState.remark = ''
  acceptanceFormState.approvalStatus = undefined
}

// 重置盘点任务表单
const resetInventoryForm = () => {
  inventoryFormState.id = undefined
  inventoryFormState.taskCode = ''
  inventoryFormState.planCode = ''
  inventoryFormState.planTitle = ''
  inventoryFormState.planManager = ''
  inventoryFormState.inventoryTime = null
  inventoryFormState.inventoryMethod = undefined
  inventoryFormState.planInventoryTime = null
  inventoryFormState.manager = ''
  inventoryFormState.status = undefined
  inventoryFormState.shouldCount = 0
  inventoryFormState.actualCount = 0
  inventoryFormState.lossCount = 0
  inventoryFormState.profitCount = 0
}

// 初始化数据
const initData = () => {
  // 模拟设备验收数据
  acceptanceData.value = [
    {
      id: 1,
      code: 'YS2023001',
      acceptanceType: 'arrival',
      equipmentCode: 'SB2023001',
      equipmentName: '服务器设备',
      acceptor: '张三',
      acceptanceTime: '2023-10-01',
      remark: '设备完好无损',
      approvalStatus: 'approved'
    },
    {
      id: 2,
      code: 'YS2023002',
      acceptanceType: 'trial',
      equipmentCode: 'SB2023002',
      equipmentName: '网络设备',
      acceptor: '李四',
      acceptanceTime: '2023-10-05',
      remark: '试运行正常',
      approvalStatus: 'pending'
    }
  ]
  
  // 模拟盘点任务数据
  inventoryData.value = [
    {
      id: 1,
      taskCode: 'PD2023001',
      planCode: 'PJ2023001',
      planTitle: '季度设备盘点',
      planManager: '王五',
      inventoryTime: '2023-10-10',
      inventoryMethod: 'manual',
      planInventoryTime: '2023-10-15',
      manager: '赵六',
      status: 'completed',
      shouldCount: 100,
      actualCount: 98,
      lossCount: 2,
      profitCount: 0
    },
    {
      id: 2,
      taskCode: 'PD2023002',
      planCode: 'PJ2023002',
      planTitle: '年度资产盘点',
      planManager: '孙七',
      inventoryTime: '2023-10-12',
      inventoryMethod: 'automatic',
      planInventoryTime: '2023-10-20',
      manager: 'Maintainer八',
      status: 'inProgress',
      shouldCount: 500,
      actualCount: 200,
      lossCount: 0,
      profitCount: 0
    }
  ]
  
  pagination.total = Math.max(acceptanceData.value.length, inventoryData.value.length)
}

// 页面初始化
initData()
</script>

<style scoped>
.equipment-lifecycle-container {
  padding: 20px;
  background: #fff;
}

.table-actions {
  margin-bottom: 16px;
  text-align: right;
}
</style>