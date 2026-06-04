<!-- components/question/QuestionBankManagement.vue -->
<template>
  <div class="question-bank-management">
    <!-- 快速筛选标签 -->
    <div class="mb-4">
      <div class="flex items-center gap-4">
        <Tag color="blue" class="cursor-pointer" @click="handleQuickFilter('')">全部 {{ bankStats.total }}</Tag>
        <Tag color="green" class="cursor-pointer" @click="handleQuickFilter('active')">启用 {{ bankStats.active }}</Tag>
        <Tag color="orange" class="cursor-pointer" @click="handleQuickFilter('inactive')">禁用 {{ bankStats.inactive }}</Tag>
        <Tag color="purple" class="cursor-pointer" @click="handleQuickFilter('training')">用于训练 {{ bankStats.training }}</Tag>
        <Tag color="cyan" class="cursor-pointer" @click="handleQuickFilter('exam')">用于考试 {{ bankStats.exam }}</Tag>
      </div>
    </div>

    <!-- 题库列表 -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Tag, message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'

const emit = defineEmits(['question-management','edit'])

// 表格列配置
const columns = [
  {
    title: '题库名称',
    dataIndex: 'bank_name',
    key: 'bank_name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '开放类型',
    dataIndex: 'access_type',
    key: 'access_type',
    width: 120,
    formatter: (value: string) => {
      const typeMap = {
        'full_open': '完全开放',
        'partial_student': '部分学员'
      }
      return typeMap[value] || value
    }
  },
  {
    title: '题库分类',
    dataIndex: 'bank_category',
    key: 'bank_category',
    width: 150,
    formatter: (value: string) => {
      const categoryMap = {
        'promotion_exam': '职位晋升考试',
        'safety_knowledge': '安全知识学习',
        'regulation_exam': '法规政策考试',
        'certification_exam': '资格认证考试',
        'emergency_drill': '应急演练考核',
        'skill_assessment': '技能评估测试'
      }
      return categoryMap[value] || value
    }
  },
  {
    title: '根知识点',
    dataIndex: 'root_knowledge',
    key: 'root_knowledge',
    width: 150,
    ellipsis: true,
  },
  {
    title: '总题数',
    dataIndex: 'total_questions',
    key: 'total_questions',
    width: 80,
    formatter: (value: number) => `${value}题`
  },
  {
    title: '客观题数',
    dataIndex: 'objective_questions',
    key: 'objective_questions',
    width: 80,
    formatter: (value: number) => `${value}题`
  },
  {
    title: '主观题数',
    dataIndex: 'subjective_questions',
    key: 'subjective_questions',
    width: 80,
    formatter: (value: number) => `${value}题`
  },
  {
    title: '用于考试',
    dataIndex: 'for_exam',
    key: 'for_exam',
    width: 100,
    formatter: (value: boolean) => {
      return  value ? '是' : '否'
       
    }
  },
  {
    title: '用于训练',
    dataIndex: 'for_training',
    key: 'for_training',
    width: 100,
    formatter: (value: boolean) => {
      return value ? '是' : '否'
    
    }
  },
  {
    title: '创建时间',
    dataIndex: 'created_time',
    key: 'created_time',
    width: 150,
    formatter: (value: string) => formatDateTime(value)
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
      type: 'tag',
        options: [
      { value: 'active', label: '启用' ,color: 'green'},
      { value: 'inactive', label: '禁用' , color: 'red'},
      { value: 'draft', label: '草稿' , color: 'gray'}
    ],

  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 250,
  fixed: 'right',
  actions: [
    {
      label: '试题管理',
      props: { type: 'link', size: 'small' },
      action: 'question_management'
    },
    {
      label: '编辑',
      props: { type: 'link', size: 'small'},
      action: 'edit',
      // visible: (record: any) => record.status !== 'inactive'
    },
    {
      label: '删除',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete',
      visible: (record: any) => record.status === 'inactive'
    }
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'bank_name',
    label: '题库名称',
    type: 'input',
    placeholder: '请输入题库名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'access_type',
    label: '开放类型',
    type: 'select',
    placeholder: '请选择开放类型',
    props: {
      allowClear: true,
      options: [
        { label: '完全开放', value: 'full_open' },
        { label: '部分学员', value: 'partial_student' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'bank_category',
    label: '题库分类',
    type: 'select',
    placeholder: '请选择题库分类',
    props: {
      allowClear: true,
      options: [
        { label: '职位晋升考试', value: 'promotion_exam' },
        { label: '安全知识学习', value: 'safety_knowledge' },
        { label: '法规政策考试', value: 'regulation_exam' },
        { label: '资格认证考试', value: 'certification_exam' },
        { label: '应急演练考核', value: 'emergency_drill' },
        { label: '技能评估测试', value: 'skill_assessment' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'for_exam',
    label: '用于考试',
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
    field: 'for_training',
    label: '用于训练',
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
    field: 'status',
    label: '题库状态',
    type: 'select',
    placeholder: '请选择状态',
    props: {
      allowClear: true,
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' },
        { label: '草稿', value: 'draft' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'time_range',
    label: '创建时间',
    type: 'date-range',
    placeholder: ['开始时间', '结束时间'],
    props: {
      format: 'YYYY-MM-DD'
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
  const res: any = await getQuestionBankList({
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

  // 处理创建时间范围
  if (params.time_range && params.time_range.length === 2) {
    formattedParams.start_time = params.time_range[0]
    formattedParams.end_time = params.time_range[1]
    delete formattedParams.time_range
  }

  return formattedParams
}

// 数据状态
const bankStats = ref({
  total: 0,
  active: 0,
  inactive: 0,
  training: 0,
  exam: 0
})

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  updateBankStats(data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 更新题库统计
const updateBankStats = (data: any[]) => {
  const stats = {
    total: data.length,
    active: 0,
    inactive: 0,
    training: 0,
    exam: 0
  }
  
  data.forEach(bank => {
    if (bank.status === 'active') stats.active++
    if (bank.status === 'inactive') stats.inactive++
    if (bank.for_training) stats.training++
    if (bank.for_exam) stats.exam++
  })
  
  bankStats.value = stats
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  switch (action) {
    case 'question_management':
      manageQuestions(record)
      break
    case 'edit':
      editQuestionBank(record)
      break
    case 'delete':
      deleteQuestionBank(record)
      break
  }
}

// 试题管理
const manageQuestions = (record: any) => {
  emit('question-management', record)
}

// 编辑题库
const editQuestionBank = (record: any) => {
  // if (record.status === 'inactive') {
  //   message.warning('已禁用的题库不能编辑')
  //   return
  // }
    emit('edit', record)

//   // 这里可以通过事件发射到父组件打开编辑弹窗
//   message.info(`编辑题库：${record.bank_name}`)
}

// 删除题库
const deleteQuestionBank = (record: any) => {
  if (record.status !== 'inactive') {
    message.warning('只有已禁用的题库可以删除')
    return
  }
  
  Modal.confirm({
    title: '确认删除题库',
    content: `确定要删除题库"${record.bank_name}"吗？此操作将删除题库中的所有试题。`,
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        // 调用删除题库API
        // await deleteQuestionBankRecord(record.id)
        message.success('题库删除成功')
        window.dispatchEvent(new CustomEvent('table-reload'))
      } catch (error) {
        message.error('题库删除失败')
      }
    }
  })
}

// 快速筛选
const handleQuickFilter = (type: string) => {
  const searchFields = searchConfig.value
  
  // 清空所有筛选
  searchFields.forEach(field => {
    field.value = undefined
  })
  
  // 设置筛选
  if (type) {
    if (type === 'active' || type === 'inactive') {
      const statusField = searchFields.find(f => f.field === 'status')
      if (statusField) statusField.value = type
    } else if (type === 'training') {
      const trainingField = searchFields.find(f => f.field === 'for_training')
      if (trainingField) trainingField.value = true
    } else if (type === 'exam') {
      const examField = searchFields.find(f => f.field === 'for_exam')
      if (examField) examField.value = true
    }
  }
  
  // 触发表格重新加载
  window.dispatchEvent(new CustomEvent('table-reload'))
}

// 筛选启用题库
const filterActiveBanks = () => {
  handleQuickFilter('active')
}

// 刷新列表
const refreshList = () => {
  window.dispatchEvent(new CustomEvent('table-reload'))
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 暴露方法给父组件
defineExpose({
  filterActiveBanks,
  refreshList
})

// 模拟获取题库列表API（安全生产相关题库数据）
const getQuestionBankList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        bank_name: '安全生产法律法规题库',
        access_type: 'full_open',
        bank_category: 'regulation_exam',
        root_knowledge: '安全生产法律法规体系',
        total_questions: 356,
        objective_questions: 300,
        subjective_questions: 56,
        for_exam: true,
        for_training: true,
        created_time: '2024-01-01 09:00:00',
        status: 'active',
        description: '包含《安全生产法》、《职业病防治法》等法律法规题库'
      },
      {
        id: '2',
        bank_name: '危险化学品安全管理题库',
        access_type: 'partial_student',
        bank_category: 'safety_knowledge',
        root_knowledge: '危险化学品安全管理',
        total_questions: 245,
        objective_questions: 200,
        subjective_questions: 45,
        for_exam: true,
        for_training: true,
        created_time: '2024-01-05 14:30:00',
        status: 'active',
        description: '危险化学品分类、储存、使用、运输等安全管理题库'
      },
      {
        id: '3',
        bank_name: '消防安全知识题库',
        access_type: 'full_open',
        bank_category: 'safety_knowledge',
        root_knowledge: '消防安全基础知识',
        total_questions: 189,
        objective_questions: 160,
        subjective_questions: 29,
        for_exam: true,
        for_training: true,
        created_time: '2024-01-10 10:00:00',
        status: 'active',
        description: '火灾预防、报警、灭火、逃生等消防安全知识题库'
      },
      {
        id: '4',
        bank_name: '高处作业安全技术题库',
        access_type: 'partial_student',
        bank_category: 'skill_assessment',
        root_knowledge: '高处作业安全技术',
        total_questions: 178,
        objective_questions: 150,
        subjective_questions: 28,
        for_exam: true,
        for_training: false,
        created_time: '2024-01-15 08:30:00',
        status: 'active',
        description: '高处作业的危险性分析、安全防护、应急逃生等技术题库'
      },
      {
        id: '5',
        bank_name: '电气安全技术题库',
        access_type: 'full_open',
        bank_category: 'skill_assessment',
        root_knowledge: '电气安全技术',
        total_questions: 267,
        objective_questions: 220,
        subjective_questions: 47,
        for_exam: true,
        for_training: true,
        created_time: '2024-01-20 13:00:00',
        status: 'active',
        description: '电气安全标准、防护措施、事故处理等技术题库'
      },
      {
        id: '6',
        bank_name: '职业健康防护题库',
        access_type: 'partial_student',
        bank_category: 'safety_knowledge',
        root_knowledge: '职业健康管理',
        total_questions: 156,
        objective_questions: 130,
        subjective_questions: 26,
        for_exam: false,
        for_training: true,
        created_time: '2024-01-25 09:30:00',
        status: 'active',
        description: '职业病危害因素识别、防护措施、健康监护等题库'
      },
      {
        id: '7',
        bank_name: '特种设备安全操作题库',
        access_type: 'partial_student',
        bank_category: 'certification_exam',
        root_knowledge: '特种设备安全管理',
        total_questions: 324,
        objective_questions: 280,
        subjective_questions: 44,
        for_exam: true,
        for_training: false,
        created_time: '2024-01-28 14:00:00',
        status: 'inactive',
        description: '起重机械、压力容器等特种设备的安全操作题库'
      },
      {
        id: '8',
        bank_name: '应急管理知识题库',
        access_type: 'full_open',
        bank_category: 'emergency_drill',
        root_knowledge: '应急管理体系',
        total_questions: 198,
        objective_questions: 165,
        subjective_questions: 33,
        for_exam: true,
        for_training: true,
        created_time: '2024-02-01 10:30:00',
        status: 'draft',
        description: '应急预案编写、演练组织、效果评估等题库'
      },
      {
        id: '9',
        bank_name: '受限空间作业安全题库',
        access_type: 'partial_student',
        bank_category: 'skill_assessment',
        root_knowledge: '受限空间作业安全',
        total_questions: 145,
        objective_questions: 120,
        subjective_questions: 25,
        for_exam: true,
        for_training: true,
        created_time: '2024-02-05 08:00:00',
        status: 'active',
        description: '受限空间识别、通风、检测、救援等安全题库'
      },
      {
        id: '10',
        bank_name: '安全生产标准化题库',
        access_type: 'full_open',
        bank_category: 'promotion_exam',
        root_knowledge: '安全生产标准化',
        total_questions: 287,
        objective_questions: 240,
        subjective_questions: 47,
        for_exam: true,
        for_training: true,
        created_time: '2024-02-10 13:30:00',
        status: 'active',
        description: '安全生产标准化要求、体系建立、运行维护等题库'
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
</script>