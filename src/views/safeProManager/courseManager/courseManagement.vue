<template>
  <div class="flex flex-col pt-[30px] pb-[30px] px-[30px]">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3">
        <Button class="flex items-center" type="primary" @click="handleCreateCourse">
          <PlusOutlined />
          新建课程
        </Button>
        <!-- <Dropdown>
          <template #overlay>
            <Menu @click="handleMenuClick">
              <Menu.Item key="batch_import">
                <UploadOutlined />
                批量导入
              </Menu.Item>
              <Menu.Item key="export_current">
                <ExportOutlined />
                导出当前页
              </Menu.Item>
              <Menu.Item key="export_all">
                <DownloadOutlined />
                导出全部
              </Menu.Item>
            </Menu>
          </template>
          <Button>
            <MoreOutlined />
            更多操作
          </Button>
        </Dropdown> -->
      </div>
      <div class="flex items-center gap-3">
        <Button class="flex items-center" @click="handleCourseAnalysis" type="link" size="small">
          <BarChartOutlined />
          课程分析
        </Button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
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
      >
        <template #extra>
          <div class="mb-4">
            <div class="flex items-center gap-4">
              <Tag color="blue" class="cursor-pointer" @click="handleQuickFilter('')">全部 {{ courseStats.total }}</Tag>
              <Tag color="green" class="cursor-pointer" @click="handleQuickFilter('active')">启用 {{ courseStats.active }}</Tag>
              <Tag color="orange" class="cursor-pointer" @click="handleQuickFilter('inactive')">禁用 {{ courseStats.inactive }}</Tag>
              <Tag color="purple" class="cursor-pointer" @click="handleQuickFilter('training')">培训项目 {{ courseStats.training }}</Tag>
              <Tag color="cyan" class="cursor-pointer" @click="handleQuickFilter('enterprise')">企业培训 {{ courseStats.enterprise }}</Tag>
            </div>
          </div>
        </template>
      </SmartTable>
    </div>

    <!-- 课程详情弹窗 -->
    <Modal 
      title="课程详情" 
      v-model:open="detailModalVisible" 
      width="1000px" 
      :footer="null"
    >
      <CourseDetail 
        :course-data="selectedCourse"
        @edit="handleEditCourse"
        @close="closeDetailModal"
      />
    </Modal>

    <!-- 新建/编辑课程弹窗 -->
    <Modal 
      :title="isEditMode ? '编辑课程' : '新建课程'" 
      v-model:open="editModalVisible" 
      width="800px" 
      @ok="saveCourse"
    >
      <CourseForm
        ref="courseFormRef"
        :form-data="currentFormData"
        :is-edit="isEditMode"
        @save="saveCourseData"
      />
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      title="删除确认" 
      v-model:open="deleteModalVisible" 
      width="500px" 
      @ok="confirmDeleteCourse"
    >
      <div style="padding: 20px 0;">
        <p class="mb-4">确定要删除课程 <strong>{{ selectedCourseName }}</strong> 吗？</p>
        <p class="text-gray-500 mb-4">删除后：</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600">
          <li>课程将被永久删除</li>
          <li>已完成的培训记录将保留</li>
          <li>正在进行的培训将无法继续</li>
          <li>此操作不可恢复</li>
        </ul>
        <div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center gap-2 text-red-600">
            <ExclamationCircleOutlined />
            <span>警告：请谨慎操作！</span>
          </div>
        </div>
      </div>
    </Modal>

    <!-- 统计分析弹窗 -->
    <Modal 
      title="课程统计分析" 
      v-model:open="analysisModalVisible" 
      width="1200px" 
      :footer="null"
    >
      <CourseAnalysis 
        :course-data="analysisData"
        @close="closeAnalysisModal"
      />
    </Modal>

    <!-- 批量导入弹窗 -->
    <Modal 
      title="批量导入课程" 
      v-model:open="importModalVisible" 
      width="600px" 
      @ok="confirmImportCourses"
    >
      <div style="padding: 20px 0;">
        <div class="mb-6">
          <h4 class="font-medium mb-2">操作步骤：</h4>
          <ol class="list-decimal pl-5 space-y-1">
            <li>下载课程模板</li>
            <li>按照模板格式填写课程信息</li>
            <li>上传Excel文件</li>
            <li>系统会自动创建课程</li>
          </ol>
        </div>

        <div class="mb-6">
          <Button @click="downloadCourseTemplate" type="primary" style="margin-right: 10px;">
            <DownloadOutlined />
            下载模板
          </Button>
          <Button @click="handleSelectCourseExcel">
            <UploadOutlined />
            选择Excel文件
          </Button>
        </div>

        <div v-if="importPreview.length > 0" class="mb-4">
          <h4 class="font-medium mb-2">导入预览（前5条）：</h4>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">课程名称</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">开放类型</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">课时</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in importPreview" :key="item.id">
                  <td class="px-4 py-2 text-sm">{{ item.course_name }}</td>
                  <td class="px-4 py-2 text-sm">{{ getCategoryText(item.category) }}</td>
                  <td class="px-4 py-2 text-sm">{{ getDevTypeText(item.development_type) }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.duration }}小时</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { 
  Modal, 
  message, 
  Button, 
  Tag,
} from 'ant-design-vue'
import { 
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import CourseDetail from './components/course/courseDetail.vue'
import CourseForm from './components/course/courseForm.vue'
import CourseAnalysis from './components/course/courseAnalysis.vue'

// 表格列配置
const columns = [
  {
    title: '课程名称',
    dataIndex: 'course_name',
    key: 'course_name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '培训项目',
    dataIndex: 'is_training',
    key: 'is_training',
    width: 100,
    formatter: (value: boolean) => {
      return value ? '是' : '否'
    }
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 120,
    formatter: (value: string) => {
      const categoryMap = {
        'enterprise': '企业培训',
        'national_certification': '国家职业资格认证'
      }
      return categoryMap[value] || value
    }
  },
  {
    title: '开放类型',
    dataIndex: 'development_type',
    key: 'development_type',
    width: 120,
    formatter: (value: string) => {
      const typeMap = {
        'partial': '部分学员',
        'public': '完全公开',
        'internal': '内部使用',
        'external': '对外培训'
      }
      return typeMap[value] || value
    }
  },
  {
    title: '课时',
    dataIndex: 'duration',
    key: 'duration',
    width: 80,
    formatter: (value: number) => `${value}小时`
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
      { label: '启用', value: 'active', color: 'green' },
      { label: '禁用', value: 'inactive', color: 'red' },
      { label: '草稿', value: 'draft', color: 'gray' },

    ]
   
  },
  {
    title: '学习人数',
    dataIndex: 'learner_count',
    key: 'learner_count',
    width: 100,
    formatter: (value: number) => `${value}人`
  },
  {
    title: '完成率',
    dataIndex: 'completion_rate',
    key: 'completion_rate',
    width: 120,
    type: 'progress',
    props: {
      percent: (record: any) => record.completion_rate || 0,
      size: 'small',
      format: (record: any) => `${record.completion_rate || 0}%`
    }
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 300,
  fixed: 'right',
  actions: [
    {
      label: '统计分析',
      props: { type: 'link', size: 'small',  },
      action: 'analysis'
    },
    {
      label: '查看详情',
      props: { type: 'link', size: 'small', },
      action: 'detail'
    },
    {
      label: '修改',
      props: { type: 'link', size: 'small',  },
      icon:'EditOutlined',
      action: 'edit',
      visible: (record: any) => record.status !== 'inactive'
    },
    {
      label: '删除',
      props: { type: 'link', size: 'small', danger: true, },
       icon: 'DeleteOutlined' ,
      action: 'delete',
      visible: (record: any) => record.status !== 'inactive'
    }
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'course_name',
    label: '课程名称',
    type: 'input',
    placeholder: '请输入课程名称',
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
    field: 'category',
    label: '分类',
    type: 'select',
    placeholder: '请选择分类',
    props: {
      allowClear: true,
      options: [
        { label: '企业培训', value: 'enterprise' },
        { label: '国家职业资格认证', value: 'national_certification' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'development_type',
    label: '开放类型',
    type: 'select',
    placeholder: '请选择开放类型',
    props: {
      allowClear: true,
      options: [
        { label: '部分学员', value: 'partial' },
        { label: '完全公开', value: 'public' },
        { label: '内部使用', value: 'internal' },
        { label: '对外培训', value: 'external' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '状态',
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
    field: 'duration_range',
    label: '课时范围',
    type: 'range',
    // placeholder: ['最小课时', '最大课时'],
    props: {
      min: 0,
      max: 100,
      style: { width: '100%' }
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
  const res: any = await getCourseList({
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

  // 处理课时范围
  if (params.duration_range && params.duration_range.length === 2) {
    formattedParams.min_duration = params.duration_range[0]
    formattedParams.max_duration = params.duration_range[1]
    delete formattedParams.duration_range
  }

  // 处理创建时间范围
  if (params.time_range && params.time_range.length === 2) {
    formattedParams.start_time = params.time_range[0]
    formattedParams.end_time = params.time_range[1]
    delete formattedParams.time_range
  }

  return formattedParams
}

// 弹窗状态
const detailModalVisible = ref(false)
const editModalVisible = ref(false)
const deleteModalVisible = ref(false)
const analysisModalVisible = ref(false)
const importModalVisible = ref(false)

// 数据状态
const selectedCourse = ref({})
const selectedCourseId = ref('')
const selectedCourseName = ref('')
const currentFormData = ref({})
const isEditMode = ref(false)
const analysisData = ref({})
const importPreview = ref([])

// 课程统计
const courseStats = ref({
  total: 0,
  active: 0,
  inactive: 0,
  training: 0,
  enterprise: 0
})

const courseFormRef = ref()

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data)
  updateCourseStats(data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 更新课程统计
const updateCourseStats = (data: any[]) => {
  const stats = {
    total: data.length,
    active: 0,
    inactive: 0,
    training: 0,
    enterprise: 0
  }
  
  data.forEach(course => {
    if (course.status === 'active') stats.active++
    if (course.status === 'inactive') stats.inactive++
    if (course.is_training) stats.training++
    if (course.category === 'enterprise') stats.enterprise++
  })
  
  courseStats.value = stats
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedCourseId.value = record.id
  selectedCourseName.value = record.course_name
  selectedCourse.value = record

  switch (action) {
    case 'detail':
      showCourseDetail(record)
      break
    case 'edit':
      editCourse(record)
      break
    case 'delete':
      deleteCourse(record)
      break
    case 'analysis':
      showCourseAnalysis(record)
      break
  }
}

// 显示课程详情
const showCourseDetail = async (record: any) => {
  selectedCourse.value = record
  detailModalVisible.value = true
}

// 编辑课程
const editCourse = (record: any) => {
  if (record.status === 'inactive') {
    message.warning('已停用的课程不能编辑')
    return
  }
  isEditMode.value = true
  currentFormData.value = { ...record }
  editModalVisible.value = true
}

// 新建课程
const handleCreateCourse = () => {
  isEditMode.value = false
  currentFormData.value = {}
  editModalVisible.value = true
}

// 删除课程
const deleteCourse = (record: any) => {
  if (record.status === 'inactive') {
    message.warning('已停用的课程不能删除')
    return
  }
  deleteModalVisible.value = true
}

// 显示课程分析
const showCourseAnalysis = async (record: any) => {
  try {
    // 获取统计分析数据
    const res = await getCourseAnalysis(record.id)
    analysisData.value = {
      course: record,
      statistics: res.data
    }
    analysisModalVisible.value = true
  } catch (error) {
    message.error('获取分析数据失败')
  }
}

// 快速筛选
const handleQuickFilter = (type: string) => {
  const searchFields = searchConfig.value
  let filterParams: any = {}
  
  switch (type) {
    case 'active':
      filterParams = { status: 'active' }
      break
    case 'inactive':
      filterParams = { status: 'inactive' }
      break
    case 'training':
      filterParams = { is_training: true }
      break
    case 'enterprise':
      filterParams = { category: 'enterprise' }
      break
    default:
      filterParams = {}
  }
  
  // 更新搜索条件
  searchFields.forEach(field => {
    if (filterParams[field.field] !== undefined) {
      field.value = filterParams[field.field]
    } else if (type === '') {
      field.value = undefined
    }
  })
  
  // 触发表格重新加载
  window.dispatchEvent(new CustomEvent('table-reload'))
}

// 确认删除课程
const confirmDeleteCourse = async () => {
  try {
    // 调用删除课程API
    // await deleteCourseRecord(selectedCourseId.value)
    
    message.success('课程删除成功')
    deleteModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('课程删除失败')
  }
}

// 保存课程数据
const saveCourseData = async (formData: any) => {
  try {
    if (isEditMode.value) {
      // 调用更新课程API
      // await updateCourse(selectedCourseId.value, formData)
      message.success('课程信息更新成功')
    } else {
      // 调用创建课程API
      // await createCourse(formData)
      message.success('课程创建成功')
    }
    editModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error(isEditMode.value ? '更新失败' : '创建失败')
  }
}

// 保存课程
const saveCourse = async () => {
  try {
    if (courseFormRef.value?.handleSubmit) {
      await courseFormRef.value.handleSubmit()
    }
  } catch (error) {
    message.error('提交失败，请重试')
  }
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 获取分类文本
const getCategoryText = (category: string) => {
  const categoryMap = {
    'enterprise': '企业培训',
    'national_certification': '国家职业资格认证'
  }
  return categoryMap[category] || category
}

// 获取开放类型文本
const getDevTypeText = (type: string) => {
  const typeMap = {
    'partial': '部分学员',
    'public': '完全公开',
    'internal': '内部使用',
    'external': '对外培训'
  }
  return typeMap[type] || type
}

// 详情弹窗操作处理
const handleEditCourse = (record: any) => {
  editCourse(record)
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedCourse.value = {}
}

const closeAnalysisModal = () => {
  analysisModalVisible.value = false
//   analysisData.value = {}
}

// 更多操作菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  switch (key) {
    case 'batch_import':
      handleBatchImport()
      break
    case 'export_current':
      handleExportCurrent()
      break
    case 'export_all':
      handleExportAll()
      break
  }
}

// 批量导入
const handleBatchImport = () => {
  importModalVisible.value = true
  importPreview.value = []
}

// 课程分析
const handleCourseAnalysis = () => {
  // 获取整体统计分析数据
  getOverallAnalysis().then(res => {
    analysisData.value = {
      overall: true,
      statistics: res.data
    }
    analysisModalVisible.value = true
  }).catch(() => {
    message.error('获取分析数据失败')
  })
}

// 确认导入课程
const confirmImportCourses = async () => {
  if (importPreview.value.length === 0) {
    message.warning('请先选择要导入的文件')
    return
  }

  try {
    // 调用批量导入API
    // await batchImportCourses(importPreview.value)
    
    message.success(`成功导入${importPreview.value.length}条课程数据`)
    importModalVisible.value = false
    importPreview.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('课程导入失败')
  }
}

// 下载课程模板
const downloadCourseTemplate = () => {
  message.info('课程模板下载功能开发中...')
}

// 选择Excel文件
const handleSelectCourseExcel = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls'
  input.onchange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      // 模拟解析Excel文件
      const mockData = [
        {
          id: 'imp-1',
          course_name: '导入课程1',
          category: 'enterprise',
          development_type: 'public',
          duration: 8
        },
        {
          id: 'imp-2',
          course_name: '导入课程2',
          category: 'national_certification',
          development_type: 'partial',
          duration: 16
        },
        {
          id: 'imp-3',
          course_name: '导入课程3',
          category: 'enterprise',
          development_type: 'internal',
          duration: 4
        }
      ]
      importPreview.value = mockData
      message.success(`已选择文件：${file.name}，共${mockData.length}条数据`)
    }
  }
  input.click()
}

// 导出当前页
const handleExportCurrent = () => {
  message.info('导出当前页功能开发中...')
}

// 导出全部
const handleExportAll = () => {
  message.info('导出全部功能开发中...')
}

// 加载初始化数据
onBeforeMount(async () => {
  try {
    // 可以在这里加载额外的初始化数据
  } catch (error) {
    console.error('初始化数据加载失败:', error)
  }
})

// 模拟获取课程列表API（生成安全生产相关课程数据）
const getCourseList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        course_name: '安全生产法律法规培训',
        is_training: true,
        category: 'enterprise',
        development_type: 'public',
        duration: 8,
        created_time: '2025-10-01 09:00:00',
        status: 'active',
        learner_count: 156,
        completion_rate: 89,
        description: '学习安全生产相关法律法规，提升法律意识',
        course_content: '包括《安全生产法》、《职业病防治法》等主要内容',
        target_audience: '全体员工',
        difficulty_level: '初级',
        prerequisites: '无',
        evaluation_method: '在线考试',
        pass_score: 80,
        course_cover: '',
        instructor: '张三',
        tags: ['法律法规', '安全生产', '基础']
      },
      {
        id: '2',
        course_name: '危险化学品安全管理',
        is_training: true,
        category: 'national_certification',
        development_type: 'partial',
        duration: 16,
        created_time: '2025-10-05 14:30:00',
        status: 'active',
        learner_count: 78,
        completion_rate: 76,
        description: '掌握危险化学品的安全管理知识和应急处理技能',
        course_content: '危险化学品分类、储存、使用、运输等安全管理要求',
        target_audience: '危险化学品管理人员',
        difficulty_level: '中级',
        prerequisites: '有相关工作经验',
        evaluation_method: '实操+理论考试',
        pass_score: 85,
        course_cover: '',
        instructor: '李四',
        tags: ['危险化学品', '安全管理', '应急处理']
      },
      {
        id: '3',
        course_name: '高处作业安全技术',
        is_training: true,
        category: 'enterprise',
        development_type: 'internal',
        duration: 12,
        created_time: '2025-10-10 10:00:00',
        status: 'active',
        learner_count: 45,
        completion_rate: 92,
        description: '高处作业的安全技术要求与防护措施',
        course_content: '高处作业的危险性分析、安全防护、应急逃生等',
        target_audience: '高处作业人员',
        difficulty_level: '中级',
        prerequisites: '身体健康，无恐高症',
        evaluation_method: '实操考核',
        pass_score: 80,
        course_cover: '',
        instructor: '王五',
        tags: ['高处作业', '安全技术', '防护措施']
      },
      {
        id: '4',
        course_name: '消防安全知识普及',
        is_training: false,
        category: 'enterprise',
        development_type: 'public',
        duration: 4,
        created_time: '2025-10-15 08:30:00',
        status: 'active',
        learner_count: 234,
        completion_rate: 95,
        description: '消防安全基础知识与灭火器使用',
        course_content: '火灾预防、报警、灭火、逃生等基础知识',
        target_audience: '全体员工',
        difficulty_level: '初级',
        prerequisites: '无',
        evaluation_method: '在线测试',
        pass_score: 70,
        course_cover: '',
        instructor: '赵六',
        tags: ['消防安全', '灭火器', '应急逃生']
      },
      {
        id: '5',
        course_name: '电气安全技术',
        is_training: true,
        category: 'national_certification',
        development_type: 'external',
        duration: 20,
        created_time: '2025-10-20 13:00:00',
        status: 'active',
        learner_count: 89,
        completion_rate: 81,
        description: '电气安全技术与防护措施',
        course_content: '电气安全标准、防护措施、事故处理等',
        target_audience: '电工及相关技术人员',
        difficulty_level: '高级',
        prerequisites: '电工基础知识',
        evaluation_method: '理论+实操考试',
        pass_score: 85,
        course_cover: '',
        instructor: '钱七',
        tags: ['电气安全', '防护技术', '电工']
      },
      {
        id: '6',
        course_name: '职业健康与防护',
        is_training: true,
        category: 'enterprise',
        development_type: 'partial',
        duration: 6,
        created_time: '2025-10-25 09:30:00',
        status: 'active',
        learner_count: 112,
        completion_rate: 88,
        description: '职业病防护与职业健康管理',
        course_content: '职业病危害因素识别、防护措施、健康监护等',
        target_audience: '一线作业人员',
        difficulty_level: '初级',
        prerequisites: '无',
        evaluation_method: '在线考试',
        pass_score: 75,
        course_cover: '',
        instructor: '孙八',
        tags: ['职业健康', '职业病防护', '健康管理']
      },
      {
        id: '7',
        course_name: '特种设备安全操作',
        is_training: true,
        category: 'national_certification',
        development_type: 'internal',
        duration: 24,
        created_time: '2025-10-28 14:00:00',
        status: 'inactive',
        learner_count: 56,
        completion_rate: 72,
        description: '特种设备安全操作规程（已停用）',
        course_content: '起重机械、压力容器等特种设备的安全操作',
        target_audience: '特种设备操作人员',
        difficulty_level: '高级',
        prerequisites: '相关操作证',
        evaluation_method: '实操考核',
        pass_score: 90,
        course_cover: '',
        instructor: 'Maintainer九',
        tags: ['特种设备', '安全操作', '起重机械']
      },
      {
        id: '8',
        course_name: '应急预案制定与演练',
        is_training: false,
        category: 'enterprise',
        development_type: 'public',
        duration: 10,
        created_time: '2025-11-01 10:30:00',
        status: 'draft',
        learner_count: 0,
        completion_rate: 0,
        description: '安全生产应急预案的制定与演练（草稿）',
        course_content: '应急预案编写、演练组织、效果评估等',
        target_audience: '安全管理人员',
        difficulty_level: '中级',
        prerequisites: '安全管理基础知识',
        evaluation_method: '方案评审',
        pass_score: 80,
        course_cover: '',
        instructor: '吴十',
        tags: ['应急预案', '应急演练', '安全管理']
      },
      {
        id: '9',
        course_name: '受限空间作业安全',
        is_training: true,
        category: 'enterprise',
        development_type: 'partial',
        duration: 14,
        created_time: '2025-11-05 08:00:00',
        status: 'active',
        learner_count: 67,
        completion_rate: 79,
        description: '受限空间作业的安全要求与防护',
        course_content: '受限空间识别、通风、检测、救援等安全要求',
        target_audience: '受限空间作业人员',
        difficulty_level: '中级',
        prerequisites: '相关作业经验',
        evaluation_method: '理论+实操考核',
        pass_score: 85,
        course_cover: '',
        instructor: '郑十一',
        tags: ['受限空间', '安全作业', '应急救援']
      },
      {
        id: '10',
        course_name: '安全生产标准化建设',
        is_training: true,
        category: 'enterprise',
        development_type: 'external',
        duration: 18,
        created_time: '2025-11-10 13:30:00',
        status: 'active',
        learner_count: 34,
        completion_rate: 86,
        description: '企业安全生产标准化体系建设',
        course_content: '安全生产标准化要求、体系建立、运行维护等',
        target_audience: '企业管理人员',
        difficulty_level: '高级',
        prerequisites: '管理经验',
        evaluation_method: '方案设计',
        pass_score: 80,
        course_cover: '',
        instructor: '王十二',
        tags: ['标准化', '体系建设', '安全管理']
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

// 模拟获取课程分析数据
const getCourseAnalysis = async (courseId: string) => {
  return {
    data: {
      learning_statistics: {
        total_learners: 156,
        completed: 139,
        in_progress: 12,
        not_started: 5,
        average_score: 85.6,
        average_time: 6.8
      },
      progress_trend: [
        { date: '2025-10-01', learners: 10 },
        { date: '2025-10-08', learners: 25 },
        { date: '2025-10-15', learners: 45 },
        { date: '2025-10-22', learners: 78 },
        { date: '2025-10-29', learners: 112 },
        { date: '2025-11-05', learners: 139 }
      ],
      score_distribution: [
        { range: '90-100分', count: 45 },
        { range: '80-89分', count: 67 },
        { range: '70-79分', count: 25 },
        { range: '60-69分', count: 15 },
        { range: '0-59分', count: 4 }
      ],
      department_statistics: [
        { department: '王强', learners: 56, average_score: 87.2,totalStduyMinutes: 100 },
        { department: '李明', learners: 34, average_score: 89.5 ,totalStduyMinutes: 120},
        { department: '张三', learners: 28, average_score: 91.8,totalStduyMinutes: 103 },
        { department: '向日葵', learners: 21, average_score: 82.4,totalStduyMinutes: 103 },
        { department: '李四', learners: 17, average_score: 76.9,totalStduyMinutes: 130}
      ]
    }
  }
}

// 模拟获取整体分析数据
const getOverallAnalysis = async () => {
  return {
    data: {
      overview: {
        total_courses: 10,
        active_courses: 8,
        total_learners: 831,
        average_completion_rate: 83.8
      },
      course_type_distribution: [
        { type: '企业培训', count: 7, percentage: 70 },
        { type: '国家认证', count: 3, percentage: 30 }
      ],
      training_project_stats: {
        training_courses: 8,
        non_training_courses: 2,
        training_learner_count: 645,
        training_completion_rate: 82.4
      },
      top_courses: [
        { course_name: '消防安全知识普及', learners: 234, completion_rate: 95 },
        { course_name: '安全生产法律法规培训', learners: 156, completion_rate: 89 },
        { course_name: '职业健康与防护', learners: 112, completion_rate: 88 },
        { course_name: '电气安全技术', learners: 89, completion_rate: 81 },
        { course_name: '危险化学品安全管理', learners: 78, completion_rate: 76 }
      ],
      monthly_trend: [
        { month: '2025-10', new_courses: 7, new_learners: 512 },
        { month: '2025-11', new_courses: 3, new_learners: 319 }
      ]
    }
  }
}
</script>

<style scoped>
.course-management-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.quick-filter-tags {
  margin-bottom: 16px;
  padding: 0;
}

.quick-filter-tags .ant-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.quick-filter-tags .ant-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>