<template>
  <div class="grading-management">
    <!-- 快速筛选标签 -->
    <div class="mb-4">
      <div class="flex items-center gap-4">
        <Tag color="blue" class="cursor-pointer" @click="handleQuickFilter('')">全部 {{ gradingStats.total }}</Tag>
        <Tag color="orange" class="cursor-pointer" @click="handleQuickFilter('pending_grading')">待阅卷 {{ gradingStats.pending_grading }}</Tag>
        <Tag color="green" class="cursor-pointer" @click="handleQuickFilter('graded')">已阅卷 {{ gradingStats.graded }}</Tag>
        <Tag color="purple" class="cursor-pointer" @click="handleQuickFilter('pending_review')">待审阅 {{ gradingStats.pending_review }}</Tag>
        <Tag color="cyan" class="cursor-pointer" @click="handleQuickFilter('scored')">已出分 {{ gradingStats.scored }}</Tag>
      </div>
    </div>

    <!-- 批量操作 -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Button @click="handleBatchAssign">批量分配</Button>
        <Button @click="handleBatchExport">批量导出</Button>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-500">阅卷进度：{{ gradingProgress }}%</span>
        <Progress :percent="gradingProgress" size="small" style="width: 200px" />
      </div>
    </div>

    <!-- 阅卷列表 -->
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

    <!-- 阅卷明细弹窗 -->
    <Modal 
      title="阅卷明细" 
      v-model:open="detailModalVisible" 
      width="1000px" 
      :footer="null"
    >
      <GradingDetail 
        :grading-data="selectedGrading"
        @close="closeDetailModal"
        @review="handleReview"
      />
    </Modal>

    <!-- 审阅改分弹窗 -->
    <Modal 
      title="审阅与改分" 
      v-model:open="reviewModalVisible" 
      width="800px" 
      @ok="confirmReview"
    >
      <ReviewForm
        :grading-data="selectedGrading"
        @save="saveReviewData"
      />
    </Modal>
       <!-- 指派弹窗 -->
    <Modal title="分配阅卷" v-model:open="assignModalVisible" width="500px" @ok="confirmAssign">
      <div style="padding: 20px 0;">
        <div style="margin-bottom: 20px;">
          <div style="font-size: 16px; margin-bottom: 8px;" class="bg-[#fef0f0] text-[#f56c6c] px-[5px] py-[10px]">
            <p>1、请确保所有考生已完成考试。</p>
            <p>2、提交后将按阅卷配置分配阅卷人员。</p>
            <p>3、指派结果将通过站内信发送，如有异常请手动处理。</p>



          </div>
          <div style="font-weight: 600; color: #f5222d;">{{ selectedApprovalTitle }}</div>
        </div>
        
       
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Tag, Button, Progress, Modal, message } from 'ant-design-vue'
import { 
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import GradingDetail from './GradingDetail.vue'
import ReviewForm from './ReviewForm.vue'

// 表格列配置
const columns = [
  {
    title: '试卷ID',
    dataIndex: 'paper_id',
    key: 'paper_id',
    width: 120,
  },
  {
    title: '考试名称',
    dataIndex: 'exam_name',
    key: 'exam_name',
    width: 180,
    ellipsis: true,
  },
  {
    title: '考生姓名',
    dataIndex: 'candidate_name',
    key: 'candidate_name',
    width: 100,
  },
  {
    title: '阅卷人员',
    dataIndex: 'grading_person',
    key: 'grading_person',
    width: 100,
    formatter: (value: string) => value || '未分配'
  },
  {
    title: '阅卷进度',
    dataIndex: 'grading_progress',
    key: 'grading_progress',
    width: 120,
    type: 'progress',
    props: {
      percent: (record: any) => record.grading_progress || 0,
      size: 'small',
      format: (record: any) => `${record.grading_progress || 0}%`
    }
  },
  {
    title: '阅卷状态',
    dataIndex: 'grading_status',
    key: 'grading_status',
    width: 100,
    type: 'tag',
      options: [
      { label: '已阅卷', value: 'graded', color: 'green' },
      { label: '待阅卷', value: 'pending', color: 'orange' },
      { label: '阅卷中', value: 'in_progress', color: 'blue' },
   
    ],
  },
  {
    title: '审阅状态',
    dataIndex: 'review_status',
    key: 'review_status',
    width: 100,
       type: 'tag',
      options: [
      { label: '已审阅', value: 'reviewed', color: 'green' },
      { label: '待审阅', value: 'pending', color: 'orange' },
      { label: '驳回', value: 'rejected', color: 'red' },
   
    ],
 
  },
  {
    title: '审阅人',
    dataIndex: 'reviewer',
    key: 'reviewer',
    width: 100,
    formatter: (value: string) => value || '--'
  },
  {
    title: '出分状态',
    dataIndex: 'score_status',
    key: 'score_status',
    width: 100,
         type: 'tag',
      options: [
      { label: '已出分', value: 'scored', color: 'green' },
      { label: '待出分', value: 'pending', color: 'orange' },
   
    ],
 
  },
  {
    title: '总分',
    dataIndex: 'total_score',
    key: 'total_score',
    width: 80,
    formatter: (value: number) => value  ? `${value}分` : '--'
  }
]
const assignModalVisible = ref(false)
const confirmAssign = ()=>{
assignModalVisible.value = false
  message.info(`分配阅卷：${currentAssign.value.candidate_name}的试卷`)
}
// 操作列配置
const actionColumn = {
  title: '操作',
  width: 200,
  fixed: 'right',
  actions: [
    {
      label: '阅卷明细',
      props: { type: 'link', size: 'small',   },
      action: 'detail',
      visible: (record: any) => record.grading_status !== 'pending'
    },
    {
      label: '审阅&改分',
      props: { type: 'link', size: 'small'  },
      action: 'review',
      visible: (record: any) => record.grading_status === 'graded' && record.review_status === 'pending'
    },
    {
      label: '分配阅卷',
      props: { type: 'link', size: 'small' },
      action: 'assign',
      visible: (record: any) => !record.grading_person && record.grading_status === 'pending'
    },
      {
      label: '再次分配',
      props: { type: 'link', size: 'small' },
      action: 'reAssign',
      visible: (record: any) => record.grading_person !== 'pending' && record.grading_status === 'in_progress'
    },
    
    {
      label: '确认出分',
      props: { type: 'link', size: 'small' },
      action: 'confirm_score',
      visible: (record: any) => record.review_status === 'reviewed' && record.score_status === 'pending'
    }
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'paper_id',
    label: '试卷ID',
    type: 'input',
    placeholder: '请输入试卷ID',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
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
    field: 'candidate_name',
    label: '考生姓名',
    type: 'input',
    placeholder: '请输入考生姓名',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'grading_status',
    label: '阅卷状态',
    type: 'select',
    placeholder: '请选择阅卷状态',
    props: {
      allowClear: true,
      options: [
        { label: '已阅卷', value: 'graded' },
        { label: '待阅卷', value: 'pending' },
        { label: '阅卷中', value: 'in_progress' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'review_status',
    label: '审阅状态',
    type: 'select',
    placeholder: '请选择审阅状态',
    props: {
      allowClear: true,
      options: [
        { label: '已审阅', value: 'reviewed' },
        { label: '待审阅', value: 'pending' },
        { label: '驳回', value: 'rejected' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'score_status',
    label: '出分状态',
    type: 'select',
    placeholder: '请选择出分状态',
    props: {
      allowClear: true,
      options: [
        { label: '已出分', value: 'scored' },
        { label: '待出分', value: 'pending' }
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

// API配置
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params
  const res: any = await getGradingList({
    page: pageNum,
    page_size: pageSize,
    ...rest
  })
  return res.data
}

// 参数格式化函数
const paramsFormatter = (params: any) => {
  return params
}

// 数据状态
const selectedGrading = ref({})
const detailModalVisible = ref(false)
const reviewModalVisible = ref(false)
const gradingStats = ref({
  total: 0,
  pending_grading: 0,
  graded: 0,
  pending_review: 0,
  scored: 0
})

// 计算阅卷进度
const gradingProgress = computed(() => {
  if (gradingStats.value.total === 0) return 0
  const gradedCount = gradingStats.value.graded + gradingStats.value.scored
  return Math.round((gradedCount / gradingStats.value.total) * 100)
})

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  updateGradingStats(data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 更新阅卷统计
const updateGradingStats = (data: any[]) => {
  const stats = {
    total: data.length,
    pending_grading: 0,
    graded: 0,
    pending_review: 0,
    scored: 0
  }
  
  data.forEach(item => {
    if (item.grading_status === 'pending') stats.pending_grading++
    if (item.grading_status === 'graded') stats.graded++
    if (item.review_status === 'pending' && item.grading_status === 'graded') stats.pending_review++
    if (item.score_status === 'scored') stats.scored++
  })
  
  gradingStats.value = stats
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedGrading.value = record
  
  switch (action) {
    case 'detail':
      showGradingDetail(record)
      break
    case 'review':
      showReviewModal(record)
      break
    case 'assign':
      assignGrading(record)
      break
       case 'reAssign':
      assignGrading(record)
      break
      
    case 'confirm_score':
      confirmScore(record)
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
  
  // 设置筛选
  if (type) {
    if (type === 'pending_grading') {
      const gradingField = searchFields.find(f => f.field === 'grading_status')
      if (gradingField) gradingField.value = 'pending'
    } else if (type === 'graded') {
      const gradingField = searchFields.find(f => f.field === 'grading_status')
      if (gradingField) gradingField.value = 'graded'
    } else if (type === 'pending_review') {
      const reviewField = searchFields.find(f => f.field === 'review_status')
      if (reviewField) reviewField.value = 'pending'
      const gradingField = searchFields.find(f => f.field === 'grading_status')
      if (gradingField) gradingField.value = 'graded'
    } else if (type === 'scored') {
      const scoreField = searchFields.find(f => f.field === 'score_status')
      if (scoreField) scoreField.value = 'scored'
    }
  }
  
  // 触发表格重新加载
  window.dispatchEvent(new CustomEvent('table-reload'))
}

// 批量分配
const handleBatchAssign = () => {
  message.info('批量分配功能开发中...')
}

// 批量导出
const handleBatchExport = () => {
  message.info('批量导出功能开发中...')
}

// 显示阅卷明细
const showGradingDetail = (record: any) => {
  detailModalVisible.value = true
}

// 显示审阅弹窗
const showReviewModal = (record: any) => {
  if (record.grading_status !== 'graded') {
    message.warning('只有已阅卷的试卷可以进行审阅')
    return
  }
  if (record.review_status === 'reviewed') {
    message.warning('该试卷已完成审阅')
    return
  }
  reviewModalVisible.value = true
}

const currentAssign = ref({})
// 分配阅卷
const assignGrading = (record: any) => {
  currentAssign.value = record
    assignModalVisible.value = true

}

// 确认出分
const confirmScore = (record: any) => {
  if (record.review_status !== 'reviewed') {
    message.warning('只有已审阅的试卷可以确认出分')
    return
  }
  
  Modal.confirm({
    title: '确认出分',
    content: `确定要为考生"${record.candidate_name}"的试卷确认出分吗？确认后成绩将不可更改。`,
    okText: '确认出分',
    cancelText: '取消',
    onOk: async () => {
      try {
        // 调用确认出分API
        // await confirmScoreRecord(record.id)
        message.success('出分确认成功')
        window.dispatchEvent(new CustomEvent('table-reload'))
      } catch (error) {
        message.error('出分确认失败')
      }
    }
  })
}

// 处理审阅
const handleReview = (data: any) => {
  showReviewModal(data)
}

// 保存审阅数据
const saveReviewData = async (formData: any) => {
  try {
    // 调用保存审阅API
    // await saveReview(formData)
    message.success('审阅完成')
    reviewModalVisible.value = false
    selectedGrading.value = {}
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('审阅保存失败')
  }
}

// 确认审阅
const confirmReview = async () => {
  // 实际中应该调用ReviewForm的提交方法
  message.info('审阅功能开发中...')
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedGrading.value = {}
}

// 模拟获取阅卷列表API（安全生产相关阅卷数据）
const getGradingList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        paper_id: 'P20240115001',
        exam_name: '安全生产法律法规知识考试',
        candidate_name: '张三',
        grading_person: '李四',
        grading_progress: 100,
        grading_status: 'graded',
        review_status: 'pending',
        reviewer: null,
        score_status: 'pending',
        total_score: 85
      },
      {
        id: '2',
        paper_id: 'P20240115002',
        exam_name: '安全生产法律法规知识考试',
        candidate_name: '王五',
        grading_person: '赵六',
        grading_progress: 100,
        grading_status: 'graded',
        review_status: 'reviewed',
        reviewer: '钱七',
        score_status: 'scored',
        total_score: 92
      },
      {
        id: '3',
        paper_id: 'P20240110001',
        exam_name: '危险化学品安全管理资格认证',
        candidate_name: '孙八',
        grading_person: null,
        grading_progress: 0,
        grading_status: 'pending',
        review_status: 'pending',
        reviewer: null,
        score_status: 'pending',
        total_score: null
      },
      {
        id: '4',
        paper_id: 'P20240110002',
        exam_name: '危险化学品安全管理资格认证',
        candidate_name: 'Maintainer九',
        grading_person: '吴十',
        grading_progress: 60,
        grading_status: 'in_progress',
        review_status: 'pending',
        reviewer: null,
        score_status: 'pending',
        total_score: null
      },
      {
        id: '5',
        paper_id: 'P20240105001',
        exam_name: '消防安全管理人员晋升考试',
        candidate_name: '郑十一',
        grading_person: '王十二',
        grading_progress: 100,
        grading_status: 'graded',
        review_status: 'reviewed',
        reviewer: '李十三',
        score_status: 'scored',
        total_score: 78
      },
      {
        id: '6',
        paper_id: 'P20240105002',
        exam_name: '消防安全管理人员晋升考试',
        candidate_name: '陈十四',
        grading_person: '林十五',
        grading_progress: 100,
        grading_status: 'graded',
        review_status: 'rejected',
        reviewer: '张十六',
        score_status: 'pending',
        total_score: 65
      },
      {
        id: '7',
        paper_id: 'P20240112001',
        exam_name: '应急救援预案培训效果评估',
        candidate_name: '刘十七',
        grading_person: '黄十八',
        grading_progress: 100,
        grading_status: 'graded',
        review_status: 'pending',
        reviewer: null,
        score_status: 'pending',
        total_score: 88
      },
      {
        id: '8',
        paper_id: 'P20240112002',
        exam_name: '应急救援预案培训效果评估',
        candidate_name: '杨十九',
        grading_person: '朱二十',
        grading_progress: 45,
        grading_status: 'in_progress',
        review_status: 'pending',
        reviewer: null,
        score_status: 'pending',
        total_score: null
      },
      {
        id: '9',
        paper_id: 'P20231230001',
        exam_name: '电气安全技术操作考核',
        candidate_name: '郭二十一',
        grading_person: '何二十二',
        grading_progress: 100,
        grading_status: 'graded',
        review_status: 'reviewed',
        reviewer: '高二十三',
        score_status: 'scored',
        total_score: 76
      },
      {
        id: '10',
        paper_id: 'P20231230002',
        exam_name: '电气安全技术操作考核',
        candidate_name: '马二十四',
        grading_person: '罗二十五',
        grading_progress: 100,
        grading_status: 'graded',
        review_status: 'reviewed',
        reviewer: '梁二十六',
        score_status: 'scored',
        total_score: 81
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