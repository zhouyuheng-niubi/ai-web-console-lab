<!-- components/question/QuestionManagement.vue -->
<template>
  <div class="question-management">
    <!-- 题库筛选 -->
    <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg" v-if="selectedBankName">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium text-blue-700">当前题库：{{ selectedBankName }}</h3>
          <div class="text-sm text-blue-600 mt-1">题库ID：{{ selectedBankId }}</div>
        </div>
        <div class="flex items-center gap-3">
          <!-- <Button size="small" @click="handleClearBank">清除筛选</Button> -->
          <Button class="flex items-center" type="primary" size="small" @click="handleAddQuestion">
            <PlusOutlined />
            添加试题
          </Button>
        </div>
      </div>
    </div>

    <!-- 快速筛选标签 -->
    <div class="mb-4">
      <div class="flex items-center gap-4">
        <Tag color="blue" class="cursor-pointer" @click="handleQuickFilter('')">全部 {{ questionStats.total }}</Tag>
        <Tag color="green" class="cursor-pointer" @click="handleQuickFilter('single_choice')">单选题 {{ questionStats.single_choice }}</Tag>
        <Tag color="orange" class="cursor-pointer" @click="handleQuickFilter('multiple_choice')">多选题 {{ questionStats.multiple_choice }}</Tag>
        <Tag color="purple" class="cursor-pointer" @click="handleQuickFilter('true_false')">判断题 {{ questionStats.true_false }}</Tag>
        <Tag color="cyan" class="cursor-pointer" @click="handleQuickFilter('short_answer')">简答题 {{ questionStats.short_answer }}</Tag>
        <Tag color="red" class="cursor-pointer" @click="handleQuickFilter('needs_review')">需人工批阅 {{ questionStats.needs_review }}</Tag>
      </div>
    </div>

    <!-- 试题列表 -->
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

    <!-- 试题预览弹窗 -->
    <Modal 
      title="试题预览" 
      v-model:open="previewModalVisible" 
      width="800px" 
      :footer="null"
    >
      <QuestionPreview 
        :question-data="selectedQuestion"
        @close="closePreviewModal"
      />
    </Modal>
      <!-- 添加/修改试题弹窗 -->
    <Modal 
      :title="modalTitle"
      v-model:open="questionModalVisible"
      width="900px"
      :maskClosable="false"
      @ok="handleSaveQuestion"
      @cancel="handleCancelEdit"
    >
      <QuestionForm
        ref="questionFormRef"
        :form-data="currentQuestionData"
        :is-edit="isEditMode"
        :bank-options="bankOptions"
        :chapter-options="chapterOptions"
        @save="handleFormSave"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Tag, Button, Modal, message } from 'ant-design-vue'
import { 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CopyOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import QuestionPreview from './QuestionPreview.vue'
import QuestionForm from './QuestionForm.vue'

const props = defineProps({
  selectedBankId: {
    type: String,
    default: ''
  },
  selectedBankName: {
    type: String,
    default: ''
  }
})
// 加载选项数据
onMounted(() => {
  loadOptionData()
})
// 弹窗状态
const questionModalVisible = ref(false)
const isEditMode = ref(false)
const currentQuestionData = ref({})
const questionFormRef = ref()
// 数据
const bankOptions = ref([])
const chapterOptions = ref([])

// 计算属性
const modalTitle = computed(() => {
  return isEditMode.value ? '修改试题' : '添加试题'
})
// 表格列配置
const columns = [
  {
    title: '试题内容',
    dataIndex: 'question_content',
    key: 'question_content',
    width: 300,
    ellipsis: true,
    formatter: (value: string) => {
      // 提取纯文本内容，移除HTML标签
      const text = value.replace(/<[^>]+>/g, '')
      return text.length > 50 ? text.substring(0, 50) + '...' : text
    }
  },
  {
    title: '题型',
    dataIndex: 'question_type',
    key: 'question_type',
    width: 100,
    formatter: (value: string) => {
      const typeMap = {
        'single_choice': '单选题',
        'multiple_choice': '多选题',
        'true_false': '判断题',
        'fill_blank': '填空题',
        'short_answer': '简答题',
        'case_analysis': '案例分析题'
      }
      return typeMap[value] || value
    }
  },
  {
    title: '难度',
    dataIndex: 'difficulty',
    key: 'difficulty',
    width: 80,
      type: 'tag',
        options: [
      { value: 'easy', label: '简单' ,color: 'green'},
      { value: 'medium', label: '中等' , color: 'orange'},
      { value: 'hard', label: '困难' , color: 'red'}
    ],
  },
  {
    title: '知识点',
    dataIndex: 'knowledge_point',
    key: 'knowledge_point',
    width: 150,
    ellipsis: true,
  },
  {
    title: '章节',
    dataIndex: 'chapter',
    key: 'chapter',
    width: 120,
  },
  {
    title: '人工批阅',
    dataIndex: 'manual_review',
    key: 'manual_review',
    width: 100,
    formatter: (value: boolean) => {
      return value ? '是' : '否'
    }
  },
  {
    title: '分值',
    dataIndex: 'score',
    key: 'score',
    width: 80,
    formatter: (value: number) => `${value}分`
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
      { value: 'inactive', label: '禁用' , color: 'red'}
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
      label: '预览',
      props: { type: 'link', size: 'small', },
      action: 'preview'
    },
    {
      label: '编辑',
      props: { type: 'link', size: 'small',  },
      action: 'edit',
      visible: (record: any) => record.status === 'active'
    },
    {
      label: '复制',
      props: { type: 'link', size: 'small', },
      action: 'copy'
    },
    {
      label: '删除',
      props: { type: 'link', size: 'small', danger: true,  },
      action: 'delete',
      visible: (record: any) => record.status === 'active'
    }
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'question_content',
    label: '试题内容',
    type: 'input',
    placeholder: '请输入试题内容关键词',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'question_type',
    label: '题型',
    type: 'select',
    placeholder: '请选择题型',
    props: {
      allowClear: true,
      options: [
        { label: '单选题', value: 'single_choice' },
        { label: '多选题', value: 'multiple_choice' },
        { label: '判断题', value: 'true_false' },
        { label: '填空题', value: 'fill_blank' },
        { label: '简答题', value: 'short_answer' },
        { label: '案例分析题', value: 'case_analysis' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'difficulty',
    label: '难度',
    type: 'select',
    placeholder: '请选择难度',
    props: {
      allowClear: true,
      options: [
        { label: '简单', value: 'easy' },
        { label: '中等', value: 'medium' },
        { label: '困难', value: 'hard' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'manual_review',
    label: '人工批阅',
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
    field: 'knowledge_point',
    label: '知识点',
    type: 'input',
    placeholder: '请输入知识点',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'chapter',
    label: '章节',
    type: 'input',
    placeholder: '请输入章节',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '试题状态',
    type: 'select',
    placeholder: '请选择状态',
    props: {
      allowClear: true,
      options: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
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

// API配置 - 根据选中的题库ID进行筛选
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params
  
  // 如果选中了题库，自动添加到筛选条件
  const queryParams = { ...rest }
  if (props.selectedBankId) {
    queryParams.bank_id = props.selectedBankId
  }
  
  const res: any = await getQuestionList({
    page: pageNum,
    page_size: pageSize,
    ...queryParams
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

  return formattedParams
}

// 数据状态
const selectedQuestion = ref({})
const previewModalVisible = ref(false)
const questionStats = ref({
  total: 0,
  single_choice: 0,
  multiple_choice: 0,
  true_false: 0,
  short_answer: 0,
  needs_review: 0
})

// 监听选中的题库变化
watch(() => props.selectedBankId, (newVal) => {
  if (newVal) {
    // 触发表格重新加载
    window.dispatchEvent(new CustomEvent('table-reload'))
  }
})

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  updateQuestionStats(data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 更新试题统计
const updateQuestionStats = (data: any[]) => {
  const stats = {
    total: data.length,
    single_choice: 0,
    multiple_choice: 0,
    true_false: 0,
    short_answer: 0,
    needs_review: 0
  }
  
  data.forEach(question => {
    if (question.question_type === 'single_choice') stats.single_choice++
    if (question.question_type === 'multiple_choice') stats.multiple_choice++
    if (question.question_type === 'true_false') stats.true_false++
    if (question.question_type === 'short_answer') stats.short_answer++
    if (question.manual_review) stats.needs_review++
  })
  
  questionStats.value = stats
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedQuestion.value = record
  
  switch (action) {
    case 'preview':
      previewQuestion(record)
      break
    case 'edit':
      editQuestion(record)
      break
    case 'copy':
      copyQuestion(record)
      break
    case 'delete':
      deleteQuestion(record)
      break
  }
}

// 预览试题
const previewQuestion = (record: any) => {
  previewModalVisible.value = true
}

// 编辑试题
const editQuestion = (record: any) => {
handleEditQuestion(record)
}
const loadOptionData = async () => {
  try {
    // 加载题库选项
    bankOptions.value = await getBankOptions()
    
    // 加载章节选项
    chapterOptions.value = await getChapterOptions()
    
  } catch (error) {
    console.error('加载选项数据失败:', error)
    message.error('数据加载失败')
  }
}

// 添加试题
const handleAddQuestion = () => {
  isEditMode.value = false
  currentQuestionData.value = {
    // 设置默认值
    question_type: 'single_choice',
    difficulty: 'medium',
    score: 5,
    manual_review: false,
    status: 'active'
  }
  questionModalVisible.value = true
}

// 编辑试题
const handleEditQuestion = (question) => {
  isEditMode.value = true
  currentQuestionData.value = { ...question }
  questionModalVisible.value = true
}

// 保存试题
const handleSaveQuestion = async () => {
  try {
    if (questionFormRef.value?.handleSubmit) {
      await questionFormRef.value.handleSubmit()
    }
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 表单保存回调
const handleFormSave = async (formData) => {
  try {
    if (isEditMode.value) {
      // 调用更新试题API
      await updateQuestion(formData)
      message.success('试题更新成功')
    } else {
      // 调用创建试题API
      await createQuestion(formData)
      message.success('试题添加成功')
    }
    
    // 关闭弹窗
    questionModalVisible.value = false
    
    // 重新加载试题列表
    await reloadQuestionList()
    
  } catch (error) {
    console.error('保存失败:', error)
    message.error(isEditMode.value ? '更新失败' : '添加失败')
  }
}

// 取消编辑
const handleCancelEdit = () => {
  // 可以添加确认提示
  // const hasChanges = Object.keys(currentQuestionData.value).length > 0
  // if (hasChanges) {
  //   Modal.confirm({
  //     title: '确认取消',
  //     content: '您有未保存的修改，确定要取消吗？',
  //     okText: '确定',
  //     cancelText: '继续编辑',
  //     onOk: () => {
  //       questionModalVisible.value = false
  //       currentQuestionData.value = {}
  //     }
  //   })
  // } else {
    questionModalVisible.value = false
    currentQuestionData.value = {}
  // }
}

// 模拟API函数
const getBankOptions = async () => {
  return [
    { label: '安全生产法律法规题库', value: '1' },
    { label: '危险化学品安全管理题库', value: '2' },
    { label: '消防安全知识题库', value: '3' },
    { label: '高处作业安全技术题库', value: '4' },
    { label: '电气安全技术题库', value: '5' }
  ]
}

const getChapterOptions = async () => {
  return [
    { label: '第一章 安全生产法律法规', value: '1' },
    { label: '第二章 危险化学品安全管理', value: '2' },
    { label: '第三章 消防安全知识', value: '3' },
    { label: '第四章 高处作业安全技术', value: '4' },
    { label: '第五章 电气安全技术', value: '5' },
    { label: '第六章 职业健康防护', value: '6' },
    { label: '第七章 特种设备安全管理', value: '7' },
    { label: '第八章 应急管理与救援', value: '8' },
    { label: '第九章 事故案例分析', value: '9' },
    { label: '第十章 安全生产标准化', value: '10' }
  ]
}

const createQuestion = async (formData) => {
  console.log('创建试题:', formData)
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))
  return { success: true, data: { id: 'new-question-id', ...formData } }
}

const updateQuestion = async (formData) => {
  console.log('更新试题:', formData)
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))
  return { success: true, data: formData }
}

const reloadQuestionList = async () => {
  // 重新加载试题列表
  console.log('重新加载试题列表')
}
// 复制试题
const copyQuestion = (record: any) => {
  message.info(`复制试题：${record.question_content.substring(0, 50)}...`)
}

// 删除试题
const deleteQuestion = (record: any) => {
  if (record.status !== 'active') {
    message.warning('只有启用的试题可以删除')
    return
  }
  
  Modal.confirm({
    title: '确认删除试题',
    content: '确定要删除这道试题吗？删除后不可恢复。',
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        // 调用删除试题API
        // await deleteQuestionRecord(record.id)
        message.success('试题删除成功')
        window.dispatchEvent(new CustomEvent('table-reload'))
      } catch (error) {
        message.error('试题删除失败')
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
    const typeField = searchFields.find(f => f.field === 'question_type')
    if (typeField && ['single_choice', 'multiple_choice', 'true_false', 'short_answer'].includes(type)) {
      typeField.value = type
    } else if (type === 'needs_review') {
      const reviewField = searchFields.find(f => f.field === 'manual_review')
      if (reviewField) reviewField.value = true
    }
  }
  
  // 触发表格重新加载
  window.dispatchEvent(new CustomEvent('table-reload'))
}


// 清除题库筛选
const handleClearBank = () => {
  // 通过事件通知父组件清除选中的题库
  // 这里需要父组件实现清除方法
  message.info('清除题库筛选')
}

// 设置选中的题库
const setSelectedBank = (bankId: string, bankName: string) => {
  // 这个方法由父组件调用
  if (bankId !== props.selectedBankId) {
    // 更新搜索条件，触发重新加载
    window.dispatchEvent(new CustomEvent('table-reload'))
  }
}

// 刷新列表
const refreshList = () => {
  window.dispatchEvent(new CustomEvent('table-reload'))
}

// 关闭预览弹窗
const closePreviewModal = () => {
  previewModalVisible.value = false
  selectedQuestion.value = {}
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 暴露方法给父组件
defineExpose({
  setSelectedBank,
  refreshList,
  handleAddQuestion
})

// 模拟获取试题列表API（安全生产相关试题数据）
const getQuestionList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        bank_id: '1',
        question_content: '《安全生产法》规定，生产经营单位的主要负责人对本单位的安全生产工作负有什么责任？',
        question_type: 'single_choice',
        difficulty: 'easy',
        knowledge_point: '安全生产法律法规',
        chapter: '第一章 总则',
        manual_review: false,
        score: 5,
        created_time: '2024-01-01 10:00:00',
        status: 'active',
        options: [
          { id: 'A', content: '主要责任' },
          { id: 'B', content: '全面责任' },
          { id: 'C', content: '管理责任' },
          { id: 'D', content: '监督责任' }
        ],
        correct_answer: ['B'],
        explanation: '《安全生产法》第五条规定，生产经营单位的主要负责人对本单位的安全生产工作全面负责。'
      },
      {
        id: '2',
        bank_id: '1',
        question_content: '危险化学品的储存应符合哪些安全要求？',
        question_type: 'multiple_choice',
        difficulty: 'medium',
        knowledge_point: '危险化学品管理',
        chapter: '第二章 危险化学品管理',
        manual_review: false,
        score: 10,
        created_time: '2024-01-02 14:30:00',
        status: 'active',
        options: [
          { id: 'A', content: '专用仓库储存' },
          { id: 'B', content: '远离火源、热源' },
          { id: 'C', content: '配备消防设施' },
          { id: 'D', content: '定期检查' },
          { id: 'E', content: '标识清晰' }
        ],
        correct_answer: ['A', 'B', 'C', 'D', 'E'],
        explanation: '危险化学品储存需要满足专用仓库、远离火源、配备消防设施、定期检查和标识清晰等安全要求。'
      },
      {
        id: '3',
        bank_id: '2',
        question_content: '高处作业时，安全带应如何正确使用？',
        question_type: 'short_answer',
        difficulty: 'medium',
        knowledge_point: '高处作业安全',
        chapter: '第三章 高处作业安全',
        manual_review: true,
        score: 15,
        created_time: '2024-01-03 09:00:00',
        status: 'active',
        explanation: '1. 安全带应高挂低用；2. 挂在牢固的构架上；3. 严禁挂在移动或不牢固的物件上；4. 使用前检查完好性。'
      },
      {
        id: '4',
        bank_id: '2',
        question_content: '电气设备发生火灾时，可以使用水直接灭火。',
        question_type: 'true_false',
        difficulty: 'easy',
        knowledge_point: '电气消防安全',
        chapter: '第四章 电气安全',
        manual_review: false,
        score: 5,
        created_time: '2024-01-04 11:20:00',
        status: 'active',
        correct_answer: ['false'],
        explanation: '电气设备发生火灾时，应先切断电源再灭火。未切断电源前严禁用水直接灭火，以防触电。'
      },
      {
        id: '5',
        bank_id: '3',
        question_content: '职业病的预防措施主要包括哪些方面？',
        question_type: 'short_answer',
        difficulty: 'hard',
        knowledge_point: '职业健康防护',
        chapter: '第五章 职业健康',
        manual_review: true,
        score: 20,
        created_time: '2024-01-05 15:40:00',
        status: 'active',
        explanation: '1. 工程控制措施；2. 管理控制措施；3. 个体防护措施；4. 健康监护；5. 教育培训。'
      },
      {
        id: '6',
        bank_id: '3',
        question_content: '根据《安全生产法》，安全生产费用应当用于哪些方面？',
        question_type: 'multiple_choice',
        difficulty: 'medium',
        knowledge_point: '安全生产投入',
        chapter: '第六章 安全生产管理',
        manual_review: false,
        score: 10,
        created_time: '2024-01-06 08:45:00',
        status: 'active',
        options: [
          { id: 'A', content: '安全设施投入' },
          { id: 'B', content: '安全培训教育' },
          { id: 'C', content: '劳动防护用品配备' },
          { id: 'D', content: '事故隐患排查治理' },
          { id: 'E', content: '应急救援器材配备' }
        ],
        correct_answer: ['A', 'B', 'C', 'D', 'E'],
        explanation: '安全生产费用应当用于安全设施投入、安全培训教育、劳动防护用品配备、事故隐患排查治理、应急救援器材配备等方面。'
      },
      {
        id: '7',
        bank_id: '4',
        question_content: '受限空间作业前应进行哪些安全准备？',
        question_type: 'short_answer',
        difficulty: 'hard',
        knowledge_point: '受限空间作业',
        chapter: '第七章 特殊作业安全',
        manual_review: true,
        score: 15,
        created_time: '2024-01-07 13:15:00',
        status: 'active',
        explanation: '1. 作业许可证办理；2. 气体检测；3. 通风换气；4. 安全警示；5. 应急救援准备；6. 专人监护。'
      },
      {
        id: '8',
        bank_id: '4',
        question_content: '火灾报警电话号码是119，医疗急救电话号码是120。',
        question_type: 'true_false',
        difficulty: 'easy',
        knowledge_point: '应急管理',
        chapter: '第八章 应急管理',
        manual_review: false,
        score: 5,
        created_time: '2024-01-08 10:30:00',
        status: 'active',
        correct_answer: ['true'],
        explanation: '119是火灾报警电话，120是医疗急救电话，这是常识性应急知识。'
      },
      {
        id: '9',
        bank_id: '5',
        question_content: '特种设备操作人员必须持证上岗，这个证件的有效期是几年？',
        question_type: 'single_choice',
        difficulty: 'medium',
        knowledge_point: '特种设备管理',
        chapter: '第九章 特种设备安全',
        manual_review: false,
        score: 5,
        created_time: '2024-01-09 16:20:00',
        status: 'active',
        options: [
          { id: 'A', content: '1年' },
          { id: 'B', content: '2年' },
          { id: 'C', content: '3年' },
          { id: 'D', content: '4年' }
        ],
        correct_answer: ['D'],
        explanation: '特种设备操作人员证书有效期为4年，到期前需要进行复审。'
      },
      {
        id: '10',
        bank_id: '5',
        question_content: '请分析某化工厂泄漏事故的主要原因及防范措施。',
        question_type: 'case_analysis',
        difficulty: 'hard',
        knowledge_point: '事故案例分析',
        chapter: '第十章 事故案例',
        manual_review: true,
        score: 25,
        created_time: '2024-01-10 09:50:00',
        status: 'active',
        explanation: '主要原因：1. 设备老化；2. 操作失误；3. 管理不到位；4. 应急预案不完善。防范措施：1. 定期设备检查维护；2. 加强操作培训；3. 完善管理制度；4. 制定应急预案并演练。'
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