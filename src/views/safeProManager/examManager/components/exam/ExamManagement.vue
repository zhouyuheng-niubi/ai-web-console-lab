<template>
  <div class="exam-management">
    <!-- 快速筛选标签 -->
    <div class="mb-4">
      <div class="flex items-center gap-4">
        <Tag color="blue" class="cursor-pointer" @click="handleQuickFilter('')">全部 {{ examStats.total }}</Tag>
        <Tag color="green" class="cursor-pointer" @click="handleQuickFilter('in_progress')">考试中 {{ examStats.in_progress }}</Tag>
        <Tag color="orange" class="cursor-pointer" @click="handleQuickFilter('pending')">待发布 {{ examStats.pending }}</Tag>
        <Tag color="purple" class="cursor-pointer" @click="handleQuickFilter('grading')">待阅卷 {{ examStats.grading }}</Tag>
        <Tag color="cyan" class="cursor-pointer" @click="handleQuickFilter('scored')">已出分 {{ examStats.scored }}</Tag>
      </div>
    </div>

    <!-- 考试列表 -->
    <div class="bg-white rounded-[12px] shadow-sm">
      <SmartTable
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
        @action="handleTableAction"
      />
    </div>

    <!-- 考试总览弹窗 -->
    <Modal 
      title="考试总览" 
      v-model:open="detailModalVisible" 
      width="1000px" 
      :footer="null"
    >
      <ExamDetail 
        :exam-data="selectedExam"
        @close="closeDetailModal"
      />
        <!-- @review="handleReview" -->

    </Modal>
    <!-- 考试操作弹窗 -->
    <ExamActionModal
      :visible="actionModalVisible"
      :exam-data="selectedExam"
      :action-type="selectedAction"
      @close="closeActionModal"
      @confirm="handleActionConfirm"
    />
   <!-- 编辑考试弹窗 -->
    <Modal 
      :title="modalTitle"
      v-model:open="editModalVisible"
      width="1000px"
      :maskClosable="false"
      @ok="handleSaveExam"
      @cancel="handleCancelEdit"
    >
      <ExamForm
        ref="examFormRef"
        :form-data="currentExamData"
        :is-edit="isEditMode"
        :course-options="courseOptions"
        :department-options="departmentOptions"
        :position-options="positionOptions"
        :personnel-options="personnelOptions"
        @save="handleFormSave"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Tag, Dropdown, Menu, message,Modal } from 'ant-design-vue'
import { 
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import ExamActionModal from './ExamActionModal.vue'
import ExamForm from './ExamForm.vue'
import ExamDetail from './examDetail.vue'
// 弹窗状态
const editModalVisible = ref(false)
const isEditMode = ref(false)
const currentExamData = ref({})
const examFormRef = ref()
const detailModalVisible = ref(false)


// 数据
const courseOptions = ref([])
const departmentOptions = ref([])
const positionOptions = ref([])
const personnelOptions = ref([])

// 计算属性
const modalTitle = computed(() => {
  return isEditMode.value ? '编辑考试' : '新建考试'
})
// 模拟数据加载
onMounted(() => {
  loadInitialData()
})
// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedExam.value = {}
}
// 加载初始化数据
const loadInitialData = async () => {
  try {
    // 模拟加载选项数据
    courseOptions.value = await getCourseOptions()
    departmentOptions.value = await getDepartmentOptions()
    positionOptions.value = await getPositionOptions()
    personnelOptions.value = await getPersonnelOptions()
    
  } catch (error) {
    console.error('初始化数据加载失败:', error)
    message.error('数据加载失败')
  }
}
// 新建考试
const handleCreateExam = () => {
  isEditMode.value = false
  currentExamData.value = {
    // 设置默认值
    is_training: true,
    exam_type: 'regular',
    exam_category: 'primary_engineer',
    access_permission: 'full_open',
    total_score: 100,
    passing_score: 60,
    duration: 120,
    max_attempts: 1,
    random_questions: false,
    question_order_random: false,
    show_score_after_exam: true,
    show_answer_after_exam: false,
    allow_retake_after_pass: false,
    anti_cheating_enabled: false,
    require_camera: false,
    allow_switch_tab: true,
    require_fullscreen: false,
    pass_certificate_template: 'standard',
    status: 'draft'
  }
  editModalVisible.value = true
}

// 编辑考试
const handleEditExam = (exam) => {
  isEditMode.value = true
  currentExamData.value = { ...exam }
  editModalVisible.value = true
}
// 保存考试
const handleSaveExam = async () => {
  try {
    // 调用表单组件的提交方法
    if (examFormRef.value?.handleSubmit) {
      await examFormRef.value.handleSubmit()
    } else {
      message.warning('表单组件未初始化')
    }
  } catch (error) {
    console.error('保存失败:', error)
    // 这里不显示错误消息，因为表单组件内部已经处理了
  }
}

// 表单保存回调
const handleFormSave = async (formData) => {
  try {
    if (isEditMode.value) {
      // 调用更新API
      await updateExam(formData)
      message.success('考试更新成功')
    } else {
      // 调用创建API
      await createExam(formData)
      message.success('考试创建成功')
    }
    
    // 关闭弹窗
    editModalVisible.value = false
    
    // 重新加载数据
    await loadInitialData()
    
  } catch (error) {
    console.error('保存失败:', error)
    message.error(isEditMode.value ? '更新失败' : '创建失败')
  }
}

// 取消编辑
const handleCancelEdit = () => {
  // 可以添加确认提示
  editModalVisible.value = false
  currentExamData.value = {}
}

// 工具函数
const formatExamTime = (exam) => {
  if (!exam.start_time || !exam.end_time) return '时间未设置'
  return `${dayjs(exam.start_time).format('MM-DD HH:mm')} ~ ${dayjs(exam.end_time).format('MM-DD HH:mm')}`
}

const getStatusText = (status) => {
  const statusMap = {
    'draft': '草稿',
    'pending': '待发布',
    'published': '已发布',
    'in_progress': '进行中',
    'ended': '已结束',
    'closed': '已关闭'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    'draft': 'text-gray-600',
    'pending': 'text-orange-600',
    'published': 'text-blue-600',
    'in_progress': 'text-green-600',
    'ended': 'text-gray-500',
    'closed': 'text-red-600'
  }
  return classMap[status] || 'text-gray-600'
}
const getCourseOptions = async () => {
  return [
    { label: '安全生产法律法规培训', value: '1' },
    { label: '危险化学品安全管理', value: '2' },
    { label: '消防安全知识普及', value: '3' },
    { label: '电气安全技术', value: '4' },
    { label: '职业健康与防护', value: '5' }
  ]
}

const getDepartmentOptions = async () => {
  return [
    { label: '安全环保部', value: '1' },
    { label: '生产管理部', value: '2' },
    { label: '技术工程部', value: '3' },
    { label: '设备维修部', value: '4' },
    { label: '质量检测部', value: '5' }
  ]
}

const getPositionOptions = async () => {
  return [
    { label: '安全员', value: '1' },
    { label: '技术员', value: '2' },
    { label: '工程师', value: '3' },
    { label: '班组长', value: '4' },
    { label: '操作工', value: '5' },
    { label: '维修工', value: '6' }
  ]
}

const getPersonnelOptions = async () => {
  return [
    { label: '张三', value: '1', department: '安全环保部' },
    { label: '李四', value: '2', department: '生产管理部' },
    { label: '王五', value: '3', department: '技术工程部' },
    { label: '赵六', value: '4', department: '设备维修部' },
    { label: '钱七', value: '5', department: '质量检测部' }
  ]
}

const createExam = async (formData) => {
  console.log('创建考试:', formData)
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))
  return { success: true, data: { id: 'new-id', ...formData } }
}

const updateExam = async (formData) => {
  console.log('更新考试:', formData)
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))
  return { success: true, data: formData }
}
// 表格列配置

const columns = [
  {
    title: '考试名称',
    dataIndex: 'exam_name',
    key: 'exam_name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '培训项目',
    dataIndex: 'is_training',
    key: 'is_training',
    width: 100,
    formatter: (value: boolean) => {
      return   value ? '是' : '否'
       
    }
  },
  {
    title: '考试类型',
    dataIndex: 'exam_type',
    key: 'exam_type',
    width: 120,
    formatter: (value: string) => {
      const typeMap = {
        'regular': '常规考试',
        'practice': '模拟考试',
        'qualification': '资格认证',
        'promotion': '晋升考试'
      }
      return typeMap[value] || value
    }
  },
  {
    title: '考试分类',
    dataIndex: 'exam_category',
    key: 'exam_category',
    width: 150,
    formatter: (value: string) => {
      const categoryMap = {
        'promotion': '职位晋升考试',
        'primary_engineer': '初级安全工程师',
        'advanced_engineer': '高级安全工程师',
        'simulation': '模拟考试',
        'certification': '资格认证考试',
        'training_assessment': '培训效果评估'
      }
      return categoryMap[value] || value
    }
  },
  {
    title: '开放权限',
    dataIndex: 'access_permission',
    key: 'access_permission',
    width: 120,
    formatter: (value: string) => {
      const permissionMap = {
        'full_open': '完全开放',
        'department': '部门开放',
        'position': '岗位开放',
        'specific': '指定人员'
      }
      return permissionMap[value] || value
    }
  },
  {
    title: '考试时间',
    dataIndex: 'exam_time',
    key: 'exam_time',
    width: 250,
    formatter: (value, row: any) => {
      if (!row.start_time || !row.end_time) return '--'
      return `${formatDateTime(row.start_time)} 至 ${formatDateTime(row.end_time)}`
    }
  },
  {
    title: '总分',
    dataIndex: 'total_score',
    key: 'total_score',
    width: 80,
    formatter: (value: number) => `${value}分`
  },
  {
    title: '及格分',
    dataIndex: 'passing_score',
    key: 'passing_score',
    width: 80,
    formatter: (value: number) => `${value}分`
  },
  {
    title: '考试人数',
    dataIndex: 'exam_participants',
    key: 'exam_participants',
    width: 100,
    formatter: (value: number) => `${value}人`
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
       type: 'tag',
      options: [
      { label: '考试中', value: 'in_progress', color: 'green' },
      { label: '待发布', value: 'pending', color: 'orange' },
      { label: '待阅卷', value: 'grading', color: 'purple' },
      { label: '已出分', value: 'scored', color: 'blue' },
      { label: '已结束', value: 'ended', color: 'gray' },
      { label: '草稿', value: 'draft', color: 'gray' },
   
    ],
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 200,
  fixed: 'right',
  actions: [
    {
      label: '考试总览',
      props: { type: 'link', size: 'small', },
      action: 'detail'
    },
    {
      label: '编辑',
      props: { type: 'link', size: 'small'  },
      action: 'edit',
      visible: (record: any) => ['draft', 'pending'].includes(record.status)
    },
     {
      label: '删除考试',
      props: { type: 'link', size: 'small' ,danger: true },
      action: 'delete',
      visible: (record: any) => ['draft', 'ended'].includes(record.status)
    },
    {
         label: '发布考试',
      props: { type: 'link', size: 'small'  },
      action: 'publish',
      visible: (record: any) => ['pending','draft'].includes(record.status)
    },
    {
         label: '开始考试',
      props: { type: 'link', size: 'small'  },
      action: 'start',
      visible: (record: any) => ['published'].includes(record.status)
    },
    {
         label: '暂停考试',
      props: { type: 'link', size: 'small'  },
      action: 'pause',
      visible: (record: any) => ['in_progress'].includes(record.status)
    },
    {
         label: '结束考试',
      props: { type: 'link', size: 'small'  },
      action: 'end',
      visible: (record: any) => ['in_progress', 'published'].includes(record.status)
    },
   
  ]
}

// 获取更多操作菜单
const getMoreActions = (record: any) => {
  const actions = []
  
  // 状态操作按钮
  switch (record.status) {
    case 'pending':
      actions.push({ key: 'publish', label: '发布考试'  })
      break
    case 'in_progress':
      actions.push(
        { key: 'start', label: '开始考试' },
        { key: 'pause', label: '暂停考试'  },
        { key: 'end', label: '结束考试' }
      )
      break
    case 'grading':
      actions.push({ key: 'grading_overview', label: '考试总览' })
      actions.push({ key: 'view_grading', label: '阅卷情况'  })
      break
    case 'scored':
      actions.push({ key: 'result_overview', label: '成绩总览' })
      break
  }
  
  // 通用功能
  actions.push(
    { key: 'analysis', label: '考试分析', icon: 'SettingOutlined' },
    { key: 'participants', label: '考生管理', icon: 'SettingOutlined'  }
  )
  
  // 删除按钮（特定状态）
  if (['draft', 'ended'].includes(record.status)) {
    actions.push({ 
      key: 'delete', 
      label: '删除考试', 
      icon: 'DeleteOutlined' ,
      danger: true
    })
  }
  
  return actions
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'exam_name',
    label: '考试名称',
    type: 'input',
    placeholder: '请输入考试名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'is_training',
    label: '培训项目',
    type: 'select',
    placeholder: '请选择',
    props: {
      allowClear: true,
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    },
    colSpan: 6
  },
  {
    field: 'exam_type',
    label: '考试类型',
    type: 'select',
    placeholder: '请选择考试类型',
    props: {
      allowClear: true,
      options: [
        { label: '常规考试', value: 'regular' },
        { label: '模拟考试', value: 'practice' },
        { label: '资格认证', value: 'qualification' },
        { label: '晋升考试', value: 'promotion' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'exam_category',
    label: '考试分类',
    type: 'select',
    placeholder: '请选择考试分类',
    props: {
      allowClear: true,
      options: [
        { label: '职位晋升考试', value: 'promotion' },
        { label: '初级安全工程师', value: 'primary_engineer' },
        { label: '高级安全工程师', value: 'advanced_engineer' },
        { label: '模拟考试', value: 'simulation' },
        { label: '资格认证考试', value: 'certification' },
        { label: '培训效果评估', value: 'training_assessment' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '考试状态',
    type: 'select',
    placeholder: '请选择状态',
    props: {
      allowClear: true,
      options: [
        { label: '考试中', value: 'in_progress' },
        { label: '待发布', value: 'pending' },
        { label: '待阅卷', value: 'grading' },
        { label: '已出分', value: 'scored' },
        { label: '已结束', value: 'ended' },
        { label: '草稿', value: 'draft' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'time_range',
    label: '考试时间',
    type: 'date-range',
    placeholder: ['开始时间', '结束时间'],
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm'
    },
    colSpan: 6
  }
])

// 响应配置
const responseConfig = {
  listKey: 'list',
  totalKey: 'pagination.total'
}

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
}

// API配置
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params
  const res: any = await getExamList({
    page: pageNum,
    page_size: pageSize,
    ...rest
  })
  return res.data
}

// 参数格式化函数
const paramsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params
  }

  if (pagination) {
    formattedParams.pageNum = pagination.current || 1
    formattedParams.pageSize = pagination.pageSize || 10
  }

  // 处理考试时间范围
  if (params.time_range && params.time_range.length === 2) {
    formattedParams.start_time = params.time_range[0]
    formattedParams.end_time = params.time_range[1]
    delete formattedParams.time_range
  }

  return formattedParams
}

// 数据状态
const selectedExam = ref({})
const selectedAction = ref('')
const actionModalVisible = ref(false)
const examStats = ref({
  total: 0,
  in_progress: 0,
  pending: 0,
  grading: 0,
  scored: 0
})

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  updateExamStats(data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 更新考试统计
const updateExamStats = (data: any[]) => {
  const stats = {
    total: data.length,
    in_progress: 0,
    pending: 0,
    grading: 0,
    scored: 0
  }
  
  data.forEach(exam => {
    if (exam.status === 'in_progress') stats.in_progress++
    if (exam.status === 'pending') stats.pending++
    if (exam.status === 'grading') stats.grading++
    if (exam.status === 'scored') stats.scored++
  })
  
  examStats.value = stats
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any, row?: number) => {
  console.log(action, record, row);
  
  selectedExam.value = record
  
  if (action === 'more' ) {
    // handleMoreAction(menuKey, record)
  } else {
    switch (action) {
      case 'detail':
        showExamDetail(record)
        break
      case 'edit':
        editExam(record)
        break
          case 'delete':
       confirmDeleteExam(record)
        break
         case 'publish':
      confirmPublishExam(record)
      break
    case 'start':
      confirmStartExam(record)
      break
    case 'pause':
      confirmPauseExam(record)
      break
    case 'end':
      confirmEndExam(record)
      break
    }
  }
}

// 更多操作处理
const handleMoreAction = (menuKey: string, record: any) => {
  selectedAction.value = menuKey
  
  switch (menuKey) {
    case 'publish':
      confirmPublishExam(record)
      break
    case 'start':
      confirmStartExam(record)
      break
    case 'pause':
      confirmPauseExam(record)
      break
    case 'end':
      confirmEndExam(record)
      break
    case 'grading_overview':
      showGradingOverview(record)
      break
    case 'view_grading':
      viewGrading(record)
      break
    case 'result_overview':
      showResultOverview(record)
      break
    case 'analysis':
      showExamAnalysis(record)
      break
    case 'participants':
      showParticipants(record)
      break
    case 'delete':
      console.log('删除');
      
      confirmDeleteExam(record)
      break
  }
}

// 快速筛选
const handleQuickFilter = (type: string) => {
  const searchFields = searchConfig.value
  
  // 清空所有筛选
  searchFields.forEach(field => {
    field.value = undefined
  })
  
  // 设置状态筛选
  if (type) {
    const statusField = searchFields.find(f => f.field === 'status')
    if (statusField) {
      statusField.value = type
    }
  }
  
  // 触发表格重新加载
  window.dispatchEvent(new CustomEvent('table-reload'))
}

// 显示考试详情
const showExamDetail = (record: any) => {
  selectedExam.value = {...record }
  detailModalVisible.value = true
  // message.info(`查看考试详情：${record.exam_name}`)
}

// 编辑考试
const editExam = (record: any) => {
  if (!['draft', 'pending'].includes(record.status)) {
    message.warning('只有草稿或待发布状态的考试可以编辑')
    return
  }
//   handleCreateExam()
  handleEditExam(record)
//   message.info(`编辑考试：${record.exam_name}`)
}

// 确认操作
const handleActionConfirm = (actionData: any) => {
  const { action, data } = actionData
  const examName = selectedExam.value.exam_name
  
  switch (action) {
    case 'publish':
      message.success(`考试"${examName}"已发布`)
      break
    case 'start':
      message.success(`考试"${examName}"已开始`)
      break
    case 'pause':
      message.success(`考试"${examName}"已暂停`)
      break
    case 'end':
      message.success(`考试"${examName}"已结束`)
      break
    case 'delete':
      message.success(`考试"${examName}"已删除`)
      break
  }
  
  closeActionModal()
  window.dispatchEvent(new CustomEvent('table-reload'))
}

// 各种操作确认
const confirmPublishExam = (record: any) => {
  selectedAction.value = 'publish'
  actionModalVisible.value = true
}

const confirmStartExam = (record: any) => {
  selectedAction.value = 'start'
  actionModalVisible.value = true
}

const confirmPauseExam = (record: any) => {
  selectedAction.value = 'pause'
  actionModalVisible.value = true
}

const confirmEndExam = (record: any) => {
  selectedAction.value = 'end'
  actionModalVisible.value = true
}

const confirmDeleteExam = (record: any) => {
  selectedAction.value = 'delete'
  console.log(selectedAction.value);
  
  actionModalVisible.value = true
}

const showGradingOverview = (record: any) => {
  message.info(`查看"${record.exam_name}"阅卷总览`)
}

const viewGrading = (record: any) => {
  message.info(`查看"${record.exam_name}"阅卷情况`)
  // 这里可以跳转到阅卷管理页面
  emit('viewGrading', record.id)
}

const showResultOverview = (record: any) => {
  message.info(`查看"${record.exam_name}"成绩总览`)
}

const showExamAnalysis = (record: any) => {
  message.info(`查看"${record.exam_name}"考试分析`)
}

const showParticipants = (record: any) => {
  message.info(`查看"${record.exam_name}"考生管理`)
}

// 关闭操作弹窗
const closeActionModal = () => {
  actionModalVisible.value = false
  selectedAction.value = ''
  selectedExam.value = {}
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 模拟获取考试列表API（安全生产相关考试数据）
const getExamList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        exam_name: '安全生产法律法规知识考试',
        is_training: true,
        exam_type: 'regular',
        exam_category: 'primary_engineer',
        access_permission: 'full_open',
        start_time: '2024-01-15 09:00:00',
        end_time: '2024-01-15 11:00:00',
        total_score: 100,
        passing_score: 60,
        exam_participants: 156,
        status: 'in_progress',
        description: '安全生产法律法规基础知识考核'
      },
      {
        id: '2',
        exam_name: '危险化学品安全管理资格认证',
        is_training: true,
        exam_type: 'qualification',
        exam_category: 'certification',
        access_permission: 'department',
        start_time: '2024-01-10 14:00:00',
        end_time: '2024-01-10 16:30:00',
        total_score: 120,
        passing_score: 72,
        exam_participants: 89,
        status: 'grading',
        description: '危险化学品安全管理专业人员资格认证考试'
      },
      {
        id: '3',
        exam_name: '消防安全管理人员晋升考试',
        is_training: false,
        exam_type: 'promotion',
        exam_category: 'promotion',
        access_permission: 'position',
        start_time: '2024-01-05 10:00:00',
        end_time: '2024-01-05 12:00:00',
        total_score: 100,
        passing_score: 70,
        exam_participants: 45,
        status: 'scored',
        description: '消防安全管理人员岗位晋升考试'
      },
      {
        id: '4',
        exam_name: '特种设备安全操作模拟考试',
        is_training: true,
        exam_type: 'practice',
        exam_category: 'simulation',
        access_permission: 'full_open',
        start_time: '2024-01-20 09:00:00',
        end_time: '2024-01-20 11:00:00',
        total_score: 100,
        passing_score: 60,
        exam_participants: 0,
        status: 'pending',
        description: '特种设备安全操作规程模拟练习'
      },
      {
        id: '5',
        exam_name: '高处作业安全技术考核',
        is_training: true,
        exam_type: 'regular',
        exam_category: 'advanced_engineer',
        access_permission: 'specific',
        start_time: '2023-12-28 13:00:00',
        end_time: '2023-12-28 15:00:00',
        total_score: 100,
        passing_score: 70,
        exam_participants: 78,
        status: 'scored',
        description: '高处作业安全技术专业考核'
      },
      {
        id: '6',
        exam_name: '职业健康安全管理体系认证',
        is_training: false,
        exam_type: 'qualification',
        exam_category: 'certification',
        access_permission: 'full_open',
        start_time: '2024-01-25 09:00:00',
        end_time: '2024-01-25 12:00:00',
        total_score: 150,
        passing_score: 90,
        exam_participants: 0,
        status: 'draft',
        description: '职业健康安全管理体系内审员认证考试'
      },
      {
        id: '7',
        exam_name: '应急救援预案培训效果评估',
        is_training: true,
        exam_type: 'practice',
        exam_category: 'training_assessment',
        access_permission: 'department',
        start_time: '2024-01-12 14:00:00',
        end_time: '2024-01-12 15:30:00',
        total_score: 80,
        passing_score: 48,
        exam_participants: 112,
        status: 'grading',
        description: '应急救援预案培训后效果评估考试'
      },
      {
        id: '8',
        exam_name: '电气安全技术操作考核',
        is_training: true,
        exam_type: 'regular',
        exam_category: 'primary_engineer',
        access_permission: 'position',
        start_time: '2023-12-30 08:30:00',
        end_time: '2023-12-30 10:30:00',
        total_score: 100,
        passing_score: 65,
        exam_participants: 94,
        status: 'ended',
        description: '电气安全技术操作规范考核'
      },
      {
        id: '9',
        exam_name: '受限空间作业安全知识测试',
        is_training: true,
        exam_type: 'practice',
        exam_category: 'simulation',
        access_permission: 'full_open',
        start_time: '2024-02-01 10:00:00',
        end_time: '2024-02-01 11:00:00',
        total_score: 60,
        passing_score: 36,
        exam_participants: 0,
        status: 'pending',
        description: '受限空间作业安全知识在线测试'
      },
      {
        id: '10',
        exam_name: '安全生产标准化建设评估',
        is_training: false,
        exam_type: 'qualification',
        exam_category: 'certification',
        access_permission: 'specific',
        start_time: '2024-01-08 09:00:00',
        end_time: '2024-01-08 12:00:00',
        total_score: 120,
        passing_score: 75,
        exam_participants: 56,
        status: 'scored',
        description: '安全生产标准化建设评估员认证考试'
      }
    ],
    pagination: {
      total: 10,
      page: 1,
      page_size: 10
    }
  }
  return { data: mockData }
}
// 暴露方法给父组件
defineExpose({
  handleCreateExam
});
</script>