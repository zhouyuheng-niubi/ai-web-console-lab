<template>
  <div class="rule-container p-[16px] box-border flex flex-col overflow-hidden" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="pb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="handleAdd">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增监测规则</span>
        </span>
      </Button>
    </div>

    <!-- 规则列表 -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
      <SmartTable
        ref="smartTableRef"
        :api="getRuleList"
        :columns="columns"
        :search-config="searchConfig"
        :searchButtonWrapperSpan="4"
        :action-column="actionColumn"
        :response-config="{ listKey: 'rules', totalKey: 'total' }"
        :pagination="{ pageSize: 10 }"
        :scroll="{ x: 'max-content' }"
        @action="handleAction"
        searchLayout="horizontal"
      >
      </SmartTable>
    </div>

    <!-- 新增/编辑规则弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="900px"
      :confirm-loading="confirmLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <AdvancedForm 
        ref="formRef"
        :schema="formSchema" 
        :model="formModel"
        mode="form"
      />
    </Modal>



    <!-- 业务场景自定义新增弹窗 -->
    <Modal 
      v-model:open="sceneModalVisible" 
      title="新增业务场景"
      @ok="handleAddScene"
      @cancel="sceneModalVisible = false"
    >
      <div class="py-4">
        <div class="mb-4">
          <div class="mb-2">场景名称：</div>
          <Input 
            v-model:value="newSceneName" 
            placeholder="请输入业务场景名称"
            style="width: 100%;"
          />
        </div>
        <div class="mb-2">场景描述：</div>
        <Input.TextArea 
          v-model:value="newSceneDesc" 
          placeholder="请输入业务场景描述"
          :rows="3"
          style="width: 100%;"
        />
      </div>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted,h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import SmartTable from '@/components/smartTable/index.vue'
import AdvancedForm from '@/components/advancedForm/index.vue'
import { Button, Tag, Input } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
// 移除API导入，使用模拟数据
import { riskLevel, baseStatus,getAllTypeList } from '@/utils/constSeting'
// 移除不必要的导入，使用模拟数据
import dayjs from 'dayjs'

// 响应式数据
const smartTableRef = ref()
const formRef = ref()
const modalVisible = ref(false)

const sceneModalVisible = ref(false)
const confirmLoading = ref(false)
const modalType = ref('add') // 'add' 或 'edit' 或 'view'
// 弹窗标题计算属性
const modalTitle = computed(() => {
  if (modalType.value === 'add') return '新增监测规则'
  if (modalType.value === 'edit') return '编辑监测规则'
  return '查看监测规则'
})
// 业务场景相关
const businessScenes =  [
      { value: '化工实验室', label: '化工实验室' },
      { value: '煤矿井下', label: '煤矿井下' },
      { value: '仓储库区', label: '仓储库区' },
      { value: '危化品运输路线', label: '危化品运输路线' },
      { value: '生产实验室', label: '生产实验室' },
      { value: '配电室', label: '配电室' },
      { value: '办公区域', label: '办公区域' },
      { value: '实验室', label: '实验室' }
    ]
const newSceneName = ref('')
const newSceneDesc = ref('')
// 监测类型选项
const monitorTypes = ref([])

// 从API获取监测类型
const loadMonitorTypes = async () => {
    const res = await getAllTypeList()
    if (res && Array.isArray(res)) {
      // 假设API返回的数据格式为 [{ id: '...', name: '...' }] 或 [{ value: '...', label: '...' }]
      // 根据实际API返回格式进行适配
      monitorTypes.value = res.map(item => ({
        value: item.value || item.id,
        label: item.label || item.name
      }))
    }
}

// 负责人列表
const personnelList =  [
      { id: '1', name: '张三', department: '安全部' },
      { id: '2', name: '李四', department: '生产部' },
      { id: '3', name: '王五', department: '仓储部' },
      { id: '4', name: '赵六', department: '设备部' },
      { id: '5', name: '陈七', department: '运输部' },
      { id: '6', name: '刘八', department: '质检部' },
      { id: '7', name: 'Maintainer九', department: '维修部' },
      { id: '8', name: '吴十', department: '环保部' }
    ]

// 表单模型
const formModel = reactive({
  rule_id: undefined,
  rule_name: '',
  business_scene: '',
  risk_level: '',
  is_key_area: '0',
  key_area_coverage: 0,
  monitor_point_count: 0,
  monitor_types: [],
  core_monitoring_index: '',
  max_alert_level: '',
  alert_notification_method: '',
  notification_personnel: '',
  rule_status: '1',
  create_time: '',
  last_modify_time: ''
})

// 模拟数据存储
let mockRules = [
  {
    rule_id: '1',
    rule_name: '实验室A区物品遗落检测',
    business_scene: '化工实验室',
    risk_level: '4',
    is_key_area: '1',
    key_area_coverage: 98,
    monitor_point_count: 12,
    monitor_types: ['abandoned_object_detection'],
    core_monitoring_index: '物品遗落检测(检测区域内的遗留物品)',
    max_alert_level: '3',
    alert_notification_method: '现场声光',
    notification_personnel: '张三（安全部）、李四（实验室主任）',
    rule_status: '1',
    create_time: '2025-11-15 10:30:00',
    last_modify_time: '2025-11-15 15:45:00'
  },
  {
    rule_id: '2',
    rule_name: '办公区域人员计数',
    business_scene: '办公区域',
    risk_level: '2',
    is_key_area: '0',
    key_area_coverage: 85,
    monitor_point_count: 6,
    monitor_types: ['counting'],
    core_monitoring_index: '人员计数(实时统计区域内人员数量)',
    max_alert_level: '1',
    alert_notification_method: '现场声光',
    notification_personnel: '王五（安全部）、赵六（人事部）',
    rule_status: '1',
    create_time: '2025-11-14 09:15:00',
    last_modify_time: '2025-11-14 14:20:00'
  },
  {
    rule_id: '3',
    rule_name: '生产实验室离岗检测',
    business_scene: '生产实验室',
    risk_level: '3',
    is_key_area: '1',
    key_area_coverage: 90,
    monitor_point_count: 8,
    monitor_types: ['absenteeism'],
    core_monitoring_index: '离岗检测(检测操作人员是否在岗)',
    max_alert_level: '2',
    alert_notification_method: '现场声光',
    notification_personnel: '陈七（生产部）、Maintainer八（安全部）',
    rule_status: '1',
    create_time: '2025-11-13 14:20:00',
    last_modify_time: '2025-11-13 16:30:00'
  },
  {
    rule_id: '4',
    rule_name: '配电室睡岗检测',
    business_scene: '配电室',
    risk_level: '4',
    is_key_area: '1',
    key_area_coverage: 100,
    monitor_point_count: 4,
    monitor_types: ['duty_detection'],
    core_monitoring_index: '睡岗检测(检测值班人员是否睡岗)',
    max_alert_level: '3',
    alert_notification_method: '现场声光',
    notification_personnel: '刘九（设备部）、吴十（安全部）',
    rule_status: '0',
    create_time: '2025-11-12 16:45:00',
    last_modify_time: '2025-11-12 17:00:00'
  },
  {
    rule_id: '5',
    rule_name: '仓储库区跌倒检测',
    business_scene: '仓储库区',
    risk_level: '4',
    is_key_area: '1',
    key_area_coverage: 95,
    monitor_point_count: 10,
    monitor_types: ['fall_detection'],
    core_monitoring_index: '跌倒检测(检测区域内人员跌倒情况)',
    max_alert_level: '3',
    alert_notification_method: '现场声光',
    notification_personnel: '孙一（安全部）、李二（仓储部）',
    rule_status: '1',
    create_time: '2025-11-11 11:30:00',
    last_modify_time: '2025-11-11 12:00:00'
  },
  {
    rule_id: '6',
    rule_name: '危化品仓库火焰检测',
    business_scene: '危化品仓库',
    risk_level: '5',
    is_key_area: '1',
    key_area_coverage: 100,
    monitor_point_count: 12,
    monitor_types: ['fire_detection'],
    core_monitoring_index: '火焰检测(检测区域内火焰或火光)',
    max_alert_level: '4',
    alert_notification_method: '现场声光',
    notification_personnel: 'Maintainer三（安全部）、郑四（仓储部）',
    rule_status: '1',
    create_time: '2025-11-10 10:15:00',
    last_modify_time: '2025-11-10 11:00:00'
  },
  {
    rule_id: '7',
    rule_name: '办公区域闯入检测',
    business_scene: '办公区域',
    risk_level: '3',
    is_key_area: '1',
    key_area_coverage: 92,
    monitor_point_count: 8,
    monitor_types: ['intrusion'],
    core_monitoring_index: '闯入检测(检测非授权人员进入)',
    max_alert_level: '2',
    alert_notification_method: '现场声光',
    notification_personnel: '王五（安全部）、赵六（人事部）',
    rule_status: '1',
    create_time: '2025-11-09 14:20:00',
    last_modify_time: '2025-11-09 15:30:00'
  },
  {
    rule_id: '8',
    rule_name: '生产实验室滞留检测',
    business_scene: '生产实验室',
    risk_level: '3',
    is_key_area: '1',
    key_area_coverage: 88,
    monitor_point_count: 7,
    monitor_types: ['lingering_detection'],
    core_monitoring_index: '滞留检测(检测人员异常滞留情况)',
    max_alert_level: '2',
    alert_notification_method: '现场声光',
    notification_personnel: '陈七（生产部）、Maintainer八（安全部）',
    rule_status: '0',
    create_time: '2025-11-08 09:45:00',
    last_modify_time: '2025-11-08 10:15:00'
  },
  {
    rule_id: '9',
    rule_name: '实验室徘徊检测',
    business_scene: '实验室',
    risk_level: '2',
    is_key_area: '0',
    key_area_coverage: 75,
    monitor_point_count: 5,
    monitor_types: ['loitering_detection'],
    core_monitoring_index: '徘徊检测(检测人员异常徘徊行为)',
    max_alert_level: '1',
    alert_notification_method: '现场声光',
    notification_personnel: '刘九（实验室）、吴十（安全部）',
    rule_status: '1',
    create_time: '2025-11-07 13:20:00',
    last_modify_time: '2025-11-07 14:00:00'
  },
  {
    rule_id: '10',
    rule_name: '生产区域使用手机检测',
    business_scene: '生产实验室',
    risk_level: '3',
    is_key_area: '1',
    key_area_coverage: 90,
    monitor_point_count: 9,
    monitor_types: ['phone_call'],
    core_monitoring_index: '使用手机检测(检测区域内人员使用手机行为)',
    max_alert_level: '2',
    alert_notification_method: '现场声光',
    notification_personnel: '孙一（安全部）、李二（生产部）',
    rule_status: '1',
    create_time: '2025-11-06 15:30:00',
    last_modify_time: '2025-11-06 16:10:00'
  }
]

// API模拟函数
const getRuleList = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 过滤逻辑
      let filteredData = [...mockRules]
      if (params.rule_name) {
        filteredData = filteredData.filter(item => 
          item.rule_name.toLowerCase().includes(params.rule_name.toLowerCase())
        )
      }
      if (params.business_scene) {
        filteredData = filteredData.filter(item => 
          item.business_scene === params.business_scene
        )
      }
      if (params.risk_level) {
        filteredData = filteredData.filter(item => item.risk_level === params.risk_level)
      }
      if (params.is_key_area) {
        filteredData = filteredData.filter(item => item.is_key_area === params.is_key_area)
      }
      if (params.rule_status) {
        filteredData = filteredData.filter(item => item.rule_status === params.rule_status)
      }
      if (params.notification_personnel) {
        filteredData = filteredData.filter(item => 
          item.notification_personnel.toLowerCase().includes(params.notification_personnel.toLowerCase())
        )
      }

      resolve({
        rules: filteredData,
        total: filteredData.length
      })
    }, 300)
  })
}

// 移除不需要的配置，使用SmartTable默认配置

// 搜索配置
const searchConfig = computed(() => [
  {
    field: 'rule_name',
    label: '规则名称',
    type: 'input',
    colSpan: 6,
  },
  {
    field: 'risk_level',
    label: '风险等级',
    type: 'select',
    props: {
      options: riskLevel
    },
    colSpan: 6
  },
  {
    field: 'is_key_area',
    label: '关联重点区域',
    type: 'radio',
    props: {
      options: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'rule_status',
    label: '状态',
    type: 'radio',
    props: {
      options:baseStatus
    },
    colSpan: 6
  },
])

// 表格列配置
const columns = computed(() => [
  {
    title: '规则名称',
    dataIndex: 'rule_name',
    key: 'rule_name',
    width: 200,
    ellipsis: true
  },
  {
    title: '风险等级',
    dataIndex: 'risk_level',
    key: 'risk_level',
    width: 100,
    type: 'tag',
    options: riskLevel
  },
  {
    title: '关联重点区域',
    dataIndex: 'is_key_area',
    key: 'is_key_area',
    width: 120,
    type: 'tag',
    options: [
      { value: '1', label: '是', color: 'red' },
      { value: '0', label: '否', color: 'default' }
    ]
  },
  {
    title: '覆盖率',
    dataIndex: 'key_area_coverage',
    key: 'key_area_coverage',
    width: 120,
  },
  {
    title: '监测点位总数',
    dataIndex: 'monitor_point_count',
    key: 'monitor_point_count',
    width: 120
  },
  {
    title: '监测类型',
    dataIndex: 'monitor_types',
    key: 'monitor_types',
    type: 'tag',
    options: monitorTypes.value,
    width: 200
  },
  {
    title: '最高预警级别',
    dataIndex: 'max_alert_level',
    key: 'max_alert_level',
    width: 120,
    type: 'tag',
    options: [
      { value: '1', label: '一般' },
      { value: '2', label: '较大' },
      { value: '3', label: '重大' },
      { value: '4', label: '特别重大' }
    ]
  },
  {
    title: '预警通知方式',
    dataIndex: 'alert_notification_method',
    key: 'alert_notification_method',
    width: 150,
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'rule_status',
    key: 'rule_status',
    width: 120,
    type: 'tag',
    options: baseStatus
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    width: 180
  },
  {
    title: '最后修改时间',
    dataIndex: 'last_modify_time',
    key: 'last_modify_time',
    width: 180
  }
]
)

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 280,
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
      props: { type: 'link', danger: true }
    },
    {
      label: '启用',
      icon: 'CheckOutlined',
      action: 'enable',
      props: { type: 'link' },
      visible: (record) => record.rule_status === '0'
    },
    {
      label: '禁用',
      icon: 'StopOutlined',
      action: 'disable',
      props: { type: 'link', danger: true },
      visible: (record) => record.rule_status === '1'
    }
  ]
}

// 表单配置
const formSchema = computed(() => [
  {
    key: 'rule_name',
    label: '规则名称',
    type: 'input',
    required: true,
    placeholder: '请输入规则名称（突出区域 + 核心监测对象）'
  },
  {
    key: 'business_scene',
    label: '所属业务场景',
    type: 'select',
    required: true,
    props: {
      options: businessScenes,
      placeholder: '请选择业务场景',
      allowClear: true
    }
  },
  {
    key: 'risk_level',
    label: '风险等级',
    type: 'select',
    required: true,
    props: {
      options: riskLevel,
      placeholder: '请选择风险等级'
    }
  },
  {
    key: 'is_key_area',
    label: '重点区域关联',
    type: 'radioGroup',
    required: true,
    props: {
      options: [
        { value: '1', label: '是' },
        { value: '0', label: '否' }
      ],
      placeholder: '请选择是否为重点区域'
    }
  },
  {
    key: 'key_area_coverage',
    label: '重点区域覆盖率',
    type: 'inputNumber',
    required: true,
    props: {
      min: 0,
      max: 100,
      placeholder: '请输入覆盖率百分比',
      formatter: (value) => `${value}%`,
      parser: (value) => value.replace('%', '')
    }
  },
  {
    key: 'monitor_point_count',
    label: '监测点位总数',
    type: 'inputNumber',
    required: true,
    props: {
      min: 0,
      placeholder: '请输入监测点位总数'
    }
  },
  {
    key: 'monitor_types',
    label: '监测类型',
    type: 'checkboxGroup',
    required: true,
    props: {
      options: monitorTypes.value
    }
  },
  {
    key: 'core_monitoring_index',
    label: '',
    type: 'input',
    required: true,
    placeholder: '请输入关键指标 + 量程/阈值（如：甲烷(0-1000ppm，报警≥500ppm)）'
  },
  {
    key: 'max_alert_level',
    label: '最高预警级别',
    type: 'select',
    required: true,
    props: {
      options: [
        { value: '1', label: '一般' },
        { value: '2', label: '较大' },
        { value: '3', label: '重大' },
        { value: '4', label: '特别重大' }
      ],
      placeholder: '请选择最高预警级别'
    }
  },
  {
    key: 'alert_notification_method',
    label: '预警通知方式',
    type: 'input',
    required: true,
    placeholder: '请输入核心推送渠道（如：短信 + 现场声光）'
  },
  {
    key: 'notification_personnel',
    label: '通知负责人',
    type: 'input',
    required: true,
    placeholder: '请输入核心对接人（如：张三（安全部）、李四（实验室主任））'
  },
  {
    key: 'rule_status',
    label: '状态',
    type: 'select',
    required: true,
    props: {
      options:baseStatus,
      placeholder: '请选择规则状态'
    }
  }
])


// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '-'
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
}

// 处理新增
const handleAdd = () => {
  modalType.value = 'add'
  // 重置表单
  Object.keys(formModel).forEach(key => {
    if (key === 'rule_id') {
      formModel[key] = undefined
    } else if (key === 'rule_status') {
      formModel[key] = 'draft'
    } else if (key === 'monitor_types') {
      formModel[key] = []
    } else if (key === 'is_key_area') {
      formModel[key] = '0'
    } else if (key === 'key_area_coverage') {
      formModel[key] = 0
    } else if (key === 'monitor_point_count') {
      formModel[key] = 0
    } else {
      formModel[key] = ''
    }
  })
  modalVisible.value = true
}

// 处理刷新
const handleRefresh = () => {
  smartTableRef.value?.refresh()
}

// 重置表单
const resetForm = () => {
  Object.keys(formModel).forEach(key => {
    if (key === 'rule_id') {
      formModel[key] = undefined
    } else if (key === 'rule_status') {
      formModel[key] = '1'
    } else if (key === 'monitor_types') {
      formModel[key] = []
    } else if (key === 'is_key_area') {
      formModel[key] = '0'
    } else if (key === 'key_area_coverage') {
      formModel[key] = 0
    } else if (key === 'monitor_point_count') {
      formModel[key] = 0
    } else {
      formModel[key] = ''
    }
  })
}

// 处理弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
  resetForm()
}

// 处理弹窗确认
const handleModalOk = async () => {
  try {
    // 表单验证
    if (formRef.value) {
      await formRef.value.validate()
    }
    
    // 处理监测类型数组
    const submitData = { ...formModel }
    
    // 确保monitor_types是数组格式
    if (submitData.monitor_types && !Array.isArray(submitData.monitor_types)) {
      submitData.monitor_types = [submitData.monitor_types]
    } else if (!submitData.monitor_types) {
      submitData.monitor_types = []
    }
    
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (modalType.value === 'add') {
      // 新增操作
      const newRecord = {
        ...submitData,
        rule_id: Date.now().toString(),
        create_time: formatDateTime(new Date()),
        last_modify_time: formatDateTime(new Date())
      }
      
      mockRules.unshift(newRecord)
      message.success('新增成功')
    } else if (modalType.value === 'edit') {
      // 编辑操作
      const index = mockRules.findIndex(item => item.rule_id === formModel.rule_id)
      if (index > -1) {
        const updateData = { ...mockRules[index], ...submitData }
        updateData.last_modify_time = formatDateTime(new Date())
        mockRules[index] = updateData
        message.success('编辑成功')
      } else {
        message.error('编辑失败，记录不存在')
      }
    }
    
    modalVisible.value = false
    handleRefresh()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 处理表格操作
const handleAction = (action, record) => {
  switch (action) {
    case 'edit':
      modalType.value = 'edit'
      // 填充表单数据
      Object.keys(formModel).forEach(key => {
        if (key === 'monitor_types') {
          // 确保monitor_types是数组格式
          if (record[key] && Array.isArray(record[key])) {
            formModel[key] = [...record[key]]
          } else if (record[key]) {
            formModel[key] = [record[key]]
          } else {
            formModel[key] = []
          }
        } else {
          formModel[key] = record[key] !== undefined ? record[key] : ''
        }
      })
      modalVisible.value = true
      break
    case 'delete':
      Modal.confirm({
        title: '确认删除',
        content: `确定要删除规则 "${record.rule_name}" 吗？此操作不可恢复。`,
        okText: '确认',
        cancelText: '取消',
        okType: 'danger',
        onOk() {
          // 执行删除操作
          const index = mockRules.findIndex(item => item.rule_id === record.rule_id)
          if (index > -1) {
            mockRules.splice(index, 1)
            message.success('删除成功')
            handleRefresh()
          } else {
            message.error('删除失败，记录不存在')
          }
        }
      })
      break
    case 'enable':
      handleToggleStatus(record.rule_id, 'active')
      break
    case 'disable':
      handleToggleStatus(record.rule_id, 'inactive')
      break
  }
}

// 切换规则状态
const handleToggleStatus = (ruleId, status) => {
  const index = mockRules.findIndex(item => item.rule_id === ruleId)
  if (index > -1) {
    mockRules[index].rule_status = status
    message.success(`规则${status === 'active' ? '启用' : '禁用'}成功`)
    handleRefresh()
  } else {
    message.error('操作失败，记录不存在')
  }
}

// 新增业务场景
const handleAddScene = async () => {
  if (!newSceneName.value.trim()) {
    message.error('请输入场景名称')
    return
  }
  
  try {
    // 模拟创建业务场景
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log('模拟创建业务场景:', {
      name: newSceneName.value,
      description: newSceneDesc.value
    })
    
    // 添加到业务场景列表
    businessScenes.push({
      value: newSceneName.value,
      label: newSceneName.value
    })
    
    message.success('业务场景创建成功')
    sceneModalVisible.value = false
    newSceneName.value = ''
    newSceneDesc.value = ''
  } catch (error) {
    console.error('创建业务场景失败:', error)
    message.error('创建失败')
  }
}

onMounted(async() => {
    await loadMonitorTypes()
    console.log('监测类型加载完成:', monitorTypes.value)
})
</script>
<style lang="scss" scoped>
.rule-container {
  background-color: #f5f7fa;
  min-height: 100vh;
}

:deep(.ant-table) {
  .ant-table-thead > tr > th {
    background-color: #fafafa;
    font-weight: 600;
    color: #262626;
  }
  
  .ant-table-tbody > tr:hover > td {
    background-color: #f5f5f5;
  }
}

:deep(.ant-tag) {
  margin: 2px;
  border-radius: 4px;
}

:deep(.ant-btn-primary) {
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(67, 98, 239, 0.2);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(67, 98, 239, 0.3);
  }
}

:deep(.ant-modal) {
  .ant-modal-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px 8px 0 0;
    
    .ant-modal-title {
      color: white;
      font-weight: 600;
    }
  }
  
  .ant-modal-content {
    border-radius: 8px;
    overflow: hidden;
  }
}

:deep(.ant-form) {
  .ant-form-item-label > label {
    font-weight: 500;
    color: #595959;
  }
  
  .ant-input, .ant-select-selector, .ant-radio-wrapper, .ant-checkbox-wrapper {
    border-radius: 6px;
    
    &:hover {
      border-color: #4362EF;
    }
    
    &:focus, &.ant-select-focused {
      border-color: #4362EF;
      box-shadow: 0 0 0 2px rgba(67, 98, 239, 0.2);
    }
  }
  
  .ant-radio-wrapper-checked {
    color: #4362EF;
    
    .ant-radio-inner {
      background-color: #4362EF;
      border-color: #4362EF;
    }
  }
  
  .ant-checkbox-wrapper-checked {
    color: #4362EF;
    
    .ant-checkbox-inner {
      background-color: #4362EF;
      border-color: #4362EF;
    }
  }
}

:deep(.ant-tag-success) {
  background-color: #f6ffed;
  border-color: #b7eb8f;
  color: #52c41a;
}

:deep(.ant-tag-processing) {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

:deep(.ant-tag-warning) {
  background-color: #fffbe6;
  border-color: #ffe58f;
  color: #faad14;
}

:deep(.ant-tag-error) {
  background-color: #fff2f0;
  border-color: #ffccc7;
  color: #ff4d4f;
}

:deep(.ant-tag-default) {
  background-color: #fafafa;
  border-color: #d9d9d9;
  color: #8c8c8c;
}

:deep(.ant-tag-red) {
  background-color: #fff2f0;
  border-color: #ffccc7;
  color: #ff4d4f;
}

// 监测类型标签样式
:deep(.cell-monitor-types) {
  .ant-tag {
    font-size: 12px;
    line-height: 20px;
    padding: 0 6px;
  }
}

// 表单添加按钮样式
:deep(.form-extra-add-btn) {
  color: #4362EF;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    color: #3a54d9;
    text-decoration: underline;
  }
}

// 响应式布局
@media (max-width: 768px) {
  .rule-container {
    padding: 8px;
  }
  
  :deep(.ant-modal) {
    width: 95% !important;
    margin: 10px;
  }
  
  :deep(.ant-form-item) {
    .ant-form-item-label {
      text-align: left;
    }
  }
}
</style>
