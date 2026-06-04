<template>
  <div class="flex flex-col pt-[30px] pb-[30px] px-[30px]">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex items-center flex-shrink-0">
      <Button class="flex items-center" type="primary" @click="handleCreateMeeting">
        <PlusOutlined />
        新建会议
      </Button>
 
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
      </SmartTable>
    </div>

    <!-- 会议详情弹窗 -->
    <Modal 
      title="会议详情" 
      v-model:open="detailModalVisible" 
      width="1000px" 
      :footer="null"
    >
      <MeetingDetail 
        :meeting-data="selectedMeeting"
        @edit="handleEditMeeting"
        @launch="handleLaunchMeeting"
        @cancel="handleCancelMeeting"
        @close="closeDetailModal"
        @viewMinutes="handleViewMinutes"
      />
    </Modal>

    <!-- 新建/编辑会议弹窗 -->
    <Modal 
      :title="isEditMode ? '编辑会议' : '新建会议'" 
      v-model:open="editModalVisible" 
      width="800px" 
      @ok="saveMeeting"
    >
      <MeetingForm
        ref="meetingFormRef"
        :form-data="currentFormData"
        :is-edit="isEditMode"
        :team-options="teamOptions"
        :personnel-options="personnelOptions"
        :area-options="areaOptions"
        @save="saveMeetingData"
      />
    </Modal>

    <!-- 发起会议确认弹窗 -->
    <Modal 
      title="发起会议确认" 
      v-model:open="launchModalVisible" 
      width="500px" 
      @ok="confirmLaunchMeeting"
    >
      <div style="padding: 20px 0;">
        <p class="mb-4">确定要发起会议 <strong>{{ selectedMeetingName }}</strong> 吗？</p>
        <p class="text-gray-500 mb-4">发起后：</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600">
          <li>会议状态将变更为"进行中"</li>
          <li>系统将通知所有参会人员</li>
          <li>会议计时开始</li>
          <li>参会人员可以进行签到</li>
        </ul>
      </div>
    </Modal>

    <!-- 取消会议确认弹窗 -->
    <Modal 
      title="取消会议确认" 
      v-model:open="cancelModalVisible" 
      width="500px" 
      @ok="confirmCancelMeeting"
    >
      <div style="padding: 20px 0;">
        <p class="mb-2">确定要取消会议 <strong>{{ selectedMeetingName }}</strong> 吗？</p>
        <p class="text-gray-500 mb-4">取消后：</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600 mb-4">
          <li>会议状态将变更为"已取消"</li>
          <li>已通知的参会人员将收到取消通知</li>
          <li>此操作不可逆</li>
          <li>需要记录取消原因</li>
        </ul>
        <div>
          <label class="block mb-2">取消原因：</label>
          <Textarea 
            v-model:value="cancelReason" 
            placeholder="请输入取消原因（如：计划变更、人员不足、场地问题等）" 
            :maxlength="200" 
            :rows="3" 
            class="w-full"
          />
        </div>
      </div>
    </Modal>

    <!-- 会议纪要弹窗 -->
    <Modal 
      title="会议纪要" 
      v-model:open="minutesModalVisible" 
      width="900px" 
      :footer="null"
    >
      <MeetingMinutes 
        :meeting-data="selectedMeeting"
        @close="closeMinutesModal"
      />
    </Modal>

    <!-- 上传相关资料弹窗 -->
    <Modal 
      title="上传相关资料" 
      v-model:open="uploadModalVisible" 
      width="600px" 
      @ok="confirmUploadFiles"
    >
      <div style="padding: 20px 0;">
        <p class="mb-4">为会议 <strong>{{ selectedMeetingName }}</strong> 上传相关资料：</p>
        
        <div class="mb-4">
          <label class="block mb-2 font-medium">文件类型：</label>
          <Select
            v-model:value="fileType"
            placeholder="请选择文件类型"
            style="width: 100%"
            :options="fileTypeOptions"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">文件描述：</label>
          <Textarea 
            v-model:value="fileDescription" 
            placeholder="请输入文件描述" 
            :maxlength="200" 
            :rows="3" 
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">上传文件：</label>
          <Upload
            v-model:file-list="uploadFiles"
            :multiple="true"
            :max-count="10"
            :before-upload="beforeFileUpload"
          >
            <Button>
              <UploadOutlined />
              选择文件
            </Button>
          </Upload>
          <div class="mt-2 text-sm text-gray-500">
            支持上传PDF、Word、Excel、PPT、图片等格式，单个文件不超过50MB
          </div>
        </div>

        <div v-if="selectedMeeting.documents && selectedMeeting.documents.length > 0" class="mt-6 pt-6 border-t border-gray-200">
          <h4 class="font-medium mb-3">已有文件</h4>
          <div class="space-y-2 max-h-[200px] overflow-y-auto">
            <div v-for="file in selectedMeeting.documents" :key="file.id" 
              class="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50">
              <div class="flex items-center gap-2">
                <FileTextOutlined />
                <div>
                  <div class="font-medium">{{ file.name }}</div>
                  <div class="text-sm text-gray-500">{{ file.type }} • {{ formatFileSize(file.size) }} • {{ file.upload_time }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Button type="link" size="small" @click="handlePreviewFile(file)">
                  预览
                </Button>
                <Button type="link" size="small" @click="handleDownloadFile(file)">
                  下载
                </Button>
              </div>
            </div>
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
  Upload, 
  Textarea, 
  Dropdown, 
  Menu, 
  Select
} from 'ant-design-vue'
import { 
  PlusOutlined, 
  UploadOutlined,
  FileTextOutlined,
  MoreOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import MeetingDetail from '@/components/meeting/meetingDetail.vue'
import MeetingForm from '@/components/meeting/meetingForm.vue'
import MeetingMinutes from '@/components/meeting/meetingMinutes.vue'

// 表格列配置
const columns = [
  {
    title: '会议名称',
    dataIndex: 'meeting_name',
    key: 'meeting_name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '发起班组',
    dataIndex: 'team_name',
    key: 'team_name',
    width: 120,
  },
  {
    title: '会议时间',
    dataIndex: 'meeting_time',
    key: 'meeting_time',
    width: 200,
    formatter: (value, row: any) => {
      return formatDateTime(row.start_time)
    }
  },
  {
    title: '会议地点',
    dataIndex: 'area_name',
    key: 'area_name',
    width: 150,
  },
  {
    title: '主持人',
    dataIndex: 'host_name',
    key: 'host_name',
    width: 100,
  },
  {
    title: '应到/实到',
    dataIndex: 'attendance_rate',
    key: 'attendance_rate',
    width: 120,
    formatter: (value, row: any) => {
      return `${row.actual_attendees || 0}/${row.expected_attendees || 0}人`
    }
  },
  {
    title: '会议状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    type: 'tag',
        options: [
      { label: '未发起', value: 'draft', color: 'gray' },
      { label: '待召开', value: 'pending', color: 'orange' },
      { label: '进行中', value: 'in_progress', color: 'blue' },
      { label: '已完成', value: 'completed', color: 'green' },
      { label: '已取消', value: 'cancelled', color: 'red' },
    ],
  
  },
  {
    title: '风险等级',
    dataIndex: 'risk_level',
    key: 'risk_level',
    width: 100,
    type: 'tag',
        options: [
      { label: '低风险', value: 'low', color: 'green' },
      { label: '中风险', value: 'medium', color: 'orange' },
      { label: '高风险', value: 'high', color: 'red' }
    ],

  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 380,
  fixed: 'right',
  actions: [
    {
      label: '查看详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label: '发起会议',
      props: { type: 'link', size: 'small' },
      action: 'launch',
      visible: (record: any) => record.status === 'pending'
    },
    {
      label: '上传资料',
      props: { type: 'link', size: 'small' },
      action: 'upload',
      visible: (record: any) => ['pending', 'in_progress', 'completed'].includes(record.status)
    },
    {
      label: '会议纪要',
      props: { type: 'link', size: 'small' },
      action: 'viewMinutes',
      visible: (record: any) => record.status === 'completed'
    },
    {
      label: '编辑',
      props: { type: 'link', size: 'small' },
      icon: 'EditOutlined',
      action: 'edit',
      visible: (record: any) => ['draft', 'pending'].includes(record.status)
    }
    ,
    
    {
      label: '取消',
      props: { type: 'link', size: 'small', danger: true },
      action: 'cancel',
      visible: (record: any) => ['draft', 'pending'].includes(record.status)
    },
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'meeting_name',
    label: '会议名称',
    type: 'input',
    placeholder: '请输入会议名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'team_id',
    label: '发起班组',
    type: 'select',
    placeholder: '请选择班组',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
    },
    colSpan: 6
  },
  {
    field: 'host_id',
    label: '主持人',
    type: 'select',
    placeholder: '请选择主持人',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '会议状态',
    type: 'select',
    placeholder: '请选择状态',
    props: {
      allowClear: true,
      options: [
        { label: '未发起', value: 'draft' },
        { label: '待召开', value: 'pending' },
        { label: '进行中', value: 'in_progress' },
        { label: '已完成', value: 'completed' },
        { label: '已取消', value: 'cancelled' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'risk_level',
    label: '风险等级',
    type: 'select',
    placeholder: '请选择风险等级',
    props: {
      allowClear: true,
      options: [
        { label: '低风险', value: 'low' },
        { label: '中风险', value: 'medium' },
        { label: '高风险', value: 'high' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'time_range',
    label: '会议时间',
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
  const res: any = await getMeetingList({
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

  // 处理会议时间范围
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
const launchModalVisible = ref(false)
const cancelModalVisible = ref(false)
const minutesModalVisible = ref(false)
const uploadModalVisible = ref(false)

// 数据状态
const selectedMeeting = ref({})
const selectedMeetingId = ref('')
const selectedMeetingName = ref('')
const currentFormData = ref({})
const isEditMode = ref(false)
const cancelReason = ref('')

// 文件上传相关
const fileType = ref('')
const fileDescription = ref('')
const uploadFiles = ref([])

// 文件类型选项
const fileTypeOptions = [
  { label: '会议议程', value: 'agenda' },
  { label: '会议通知', value: 'notice' },
  { label: '会议材料', value: 'material' },
  { label: '签到表', value: 'attendance' },
  { label: '会议记录', value: 'record' },
  { label: '决议文件', value: 'resolution' },
  { label: '其他', value: 'other' }
]

// 选项数据
const teamOptions = ref([])
const personnelOptions = ref([])
const areaOptions = ref([])

const meetingFormRef = ref()

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedMeetingId.value = record.id
  selectedMeetingName.value = record.meeting_name
  selectedMeeting.value = record

  switch (action) {
    case 'detail':
      showMeetingDetail(record)
      break
    case 'edit':
      editMeeting(record)
      break
    case 'cancel':
      cancelMeeting(record)
      break
    case 'launch':
      launchMeeting(record)
      break
    case 'upload':
      uploadDocuments(record)
      break
    case 'viewMinutes':
      viewMinutes(record)
      break
  }
}

// 显示会议详情
const showMeetingDetail = async (record: any) => {
  selectedMeeting.value = record
  detailModalVisible.value = true
}

// 编辑会议
const editMeeting = (record: any) => {
  if (!['draft', 'pending'].includes(record.status)) {
    message.warning('只有未发起或待召开的会议可以编辑')
    return
  }
  isEditMode.value = true
  currentFormData.value = { ...record }
  editModalVisible.value = true
}

// 新建会议
const handleCreateMeeting = () => {
  isEditMode.value = false
  currentFormData.value = {}
  editModalVisible.value = true
}

// 发起会议
const launchMeeting = (record: any) => {
  if (record.status !== 'pending') {
    message.warning('只有待召开的会议可以发起')
    return
  }
  launchModalVisible.value = true
}

// 取消会议
const cancelMeeting = (record: any) => {
  if (!['draft', 'pending'].includes(record.status)) {
    message.warning('只有未发起或待召开的会议可以取消')
    return
  }
  cancelReason.value = ''
  cancelModalVisible.value = true
}

// 上传相关资料
const uploadDocuments = (record: any) => {
  if (!['pending', 'in_progress', 'completed'].includes(record.status)) {
    message.warning('只有待召开、进行中或已完成的会议可以上传资料')
    return
  }
  fileType.value = ''
  fileDescription.value = ''
  uploadFiles.value = []
  uploadModalVisible.value = true
}

// 查看会议纪要
const viewMinutes = (record: any) => {
  if (record.status !== 'completed') {
    message.warning('只有已完成的会议可以查看会议纪要')
    return
  }
  minutesModalVisible.value = true
}

// 确认发起会议
const confirmLaunchMeeting = async () => {
  try {
    // 调用发起会议API
    // await launchMeetingRecord(selectedMeetingId.value)
    
    message.success('会议已成功发起')
    launchModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('会议发起失败')
  }
}

// 确认取消会议
const confirmCancelMeeting = async () => {
  if (!cancelReason.value.trim()) {
    message.warning('请输入取消原因')
    return
  }

  try {
    // 调用取消会议API
    // await cancelMeetingRecord(selectedMeetingId.value, {
    //   reason: cancelReason.value
    // })
    
    message.success('会议已取消')
    cancelModalVisible.value = false
    cancelReason.value = ''
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('会议取消失败')
  }
}

// 确认上传文件
const confirmUploadFiles = async () => {
  if (uploadFiles.value.length === 0) {
    message.warning('请选择要上传的文件')
    return
  }

  if (!fileType.value) {
    message.warning('请选择文件类型')
    return
  }

  try {
    // 调用上传文件API
    // await uploadMeetingDocuments(selectedMeetingId.value, {
    //   type: fileType.value,
    //   description: fileDescription.value,
    //   files: uploadFiles.value
    // })
    
    message.success('文件上传成功')
    uploadModalVisible.value = false
    fileType.value = ''
    fileDescription.value = ''
    uploadFiles.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('文件上传失败')
  }
}

// 保存会议数据
const saveMeetingData = async (formData: any) => {
  try {
    if (isEditMode.value) {
      // 调用更新会议API
      // await updateMeeting(selectedMeetingId.value, formData)
      message.success('会议信息更新成功')
    } else {
      // 调用创建会议API
      // await createMeeting(formData)
      message.success('会议创建成功')
    }
    editModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error(isEditMode.value ? '更新失败' : '创建失败')
  }
}

// 保存会议
const saveMeeting = async () => {
  try {
    if (meetingFormRef.value?.handleSubmit) {
      await meetingFormRef.value.handleSubmit()
    }
  } catch (error) {
    message.error('提交失败，请重试')
  }
}

// 文件上传前验证
const beforeFileUpload = (file: any) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    message.error('不支持的文件格式，请上传PDF、Word、Excel、PPT或图片文件')
    return false
  }
  
  const isLt50M = file.size / 1024 / 1024 < 50
  if (!isLt50M) {
    message.error('文件大小不能超过50MB')
    return false
  }
  
  return true
}

// 预览文件
const handlePreviewFile = (file: any) => {
  message.info('文件预览功能开发中...')
}

// 下载文件
const handleDownloadFile = (file: any) => {
  message.info('文件下载功能开发中...')
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 详情弹窗操作处理
const handleEditMeeting = (record: any) => {
  editMeeting(record)
}

const handleLaunchMeeting = (record: any) => {
  launchMeeting(record)
}

const handleCancelMeeting = (record: any) => {
  cancelMeeting(record)
}

const handleViewMinutes = (record: any) => {
  viewMinutes(record)
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedMeeting.value = {}
}

const closeMinutesModal = () => {
  minutesModalVisible.value = false
}

// 导出菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  switch (key) {
    case 'export_current':
      handleExportCurrent()
      break
    case 'export_all':
      handleExportAll()
      break
    case 'meeting_report':
      handleMeetingReport()
      break
  }
}

// 导出当前页
const handleExportCurrent = () => {
  message.info('导出当前页功能开发中...')
}

// 导出全部
const handleExportAll = () => {
  message.info('导出全部功能开发中...')
}

// 会议报告
const handleMeetingReport = () => {
  message.info('会议报告功能开发中...')
}

// 加载初始化数据
onBeforeMount(async () => {
  try {
    // 加载班组数据
    const teamRes = await getTeamList()
    teamOptions.value = teamRes.data.map((item: any) => ({
      label: item.team_name,
      value: item.id
    }))
    searchConfig.value[1].props.options = teamOptions.value

    // 加载人员数据
    const personnelRes = await getPersonnelList()
    personnelOptions.value = personnelRes.data
    // personnelRes.data.map((item: any) => ({
    //   label: item.name,
    //   value: item.id,
    //   position: item.position
    // }))
    searchConfig.value[2].props.options = personnelOptions.value

    // 加载区域数据
    const areaRes = await getAreaList()
    areaOptions.value = areaRes.data.map((item: any) => ({
      label: item.area_name,
      value: item.id,
      parent_id: item.parent_id
    }))

  } catch (error) {
    console.error('初始化数据加载失败:', error)
  }
})

// 模拟获取会议列表API
const getMeetingList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        meeting_name: '安全生产月度例会',
        team_id: '1',
        team_name: '安全检查组',
        start_time: '2023-11-01 14:00:00',
        end_time: '2023-11-01 16:00:00',
        area_id: '1',
        area_name: '主会议室',
        host_id: '1',
        host_name: '张三',
        expected_attendees: 15,
        actual_attendees: 14,
        status: 'completed',
        risk_level: 'medium',
        documents: [
          { id: '1', name: '会议议程.pdf', type: 'agenda', size: 1024000, upload_time: '2023-11-01 13:30:00' },
          { id: '2', name: '签到表.xlsx', type: 'attendance', size: 512000, upload_time: '2023-11-01 17:00:00' }
        ]
      },
      {
        id: '2',
        meeting_name: '设备维护专题会',
        team_id: '2',
        team_name: '设备维护班',
        start_time: '2023-11-02 09:00:00',
        end_time: '2023-11-02 11:00:00',
        area_id: '2',
        area_name: '设备车间会议室',
        host_id: '4',
        host_name: '李四',
        expected_attendees: 8,
        actual_attendees: 8,
        status: 'in_progress',
        risk_level: 'low',
        documents: [
          { id: '3', name: '会议通知.docx', type: 'notice', size: 256000, upload_time: '2023-11-01 15:30:00' }
        ]
      },
      {
        id: '3',
        meeting_name: '新员工安全培训会',
        team_id: '3',
        team_name: '培训部',
        start_time: '2023-11-03 14:00:00',
        end_time: '2023-11-03 17:00:00',
        area_id: '3',
        area_name: '培训教室',
        host_id: '3',
        host_name: '王五',
        expected_attendees: 20,
        actual_attendees: 0,
        status: 'pending',
        risk_level: 'high',
        documents: []
      },
      {
        id: '4',
        meeting_name: '项目启动会',
        team_id: '4',
        team_name: '技术部',
        start_time: '2023-11-05 10:00:00',
        end_time: '2023-11-05 12:00:00',
        area_id: '1',
        area_name: '主会议室',
        host_id: '2',
        host_name: '赵六',
        expected_attendees: 12,
        actual_attendees: 0,
        status: 'draft',
        risk_level: 'medium',
        documents: []
      },
      {
        id: '5',
        meeting_name: '安全风险评估会',
        team_id: '1',
        team_name: '安全检查组',
        start_time: '2023-10-28 13:00:00',
        end_time: '2023-10-28 15:00:00',
        area_id: '4',
        area_name: '风险评估室',
        host_id: '1',
        host_name: '张三',
        expected_attendees: 10,
        actual_attendees: 10,
        status: 'cancelled',
        risk_level: 'high',
        documents: []
      }
    ],
    pagination: {
      total: 5,
      page: 1,
      page_size: 10
    }
  }
  return { data: mockData }
}

// 模拟获取班组列表
const getTeamList = async () => {
  return {
    data: [
      { id: '1', team_name: '安全检查组' },
      { id: '2', team_name: '设备维护班' },
      { id: '3', team_name: '培训部' },
      { id: '4', team_name: '技术部' },
      { id: '5', team_name: '生产一班' },
      { id: '6', team_name: '质量检测班' }
    ]
  }
}

// 模拟获取人员列表
const getPersonnelList = async () => {
  return {
    data: [
     {
      name:'安全部',
      id:'112123123',
      finished:false,
      children: [
         { id: '1', name: '张三', position: '安全员',value: '1',finished:true, },
      { id: '2', name: '李四', position: '技术员',value: '2',finished:true, },
      { id: '3', name: '王五', position: '培训师',value: '3',finished:true, },
      { id: '4', name: '赵六', position: '工程师',value: '41',finished:true, },
      { id: '5', name: '钱七', position: '操作工',value: '5' ,finished:true,},
      { id: '6', name: '孙八', position: '维修工' ,value: '6',finished:true,}
      ]
     }
    ]
  }
}

// 模拟获取区域列表
const getAreaList = async () => {
  return {
    data: [
      { id: '1', area_name: '主会议室', parent_id: null },
      { id: '2', area_name: '设备车间会议室', parent_id: null },
      { id: '3', area_name: '培训教室', parent_id: null },
      { id: '4', area_name: '风险评估室', parent_id: null },
      { id: '5', area_name: '控制中心', parent_id: null }
    ]
  }
}
</script>

<style scoped>
.meeting-management-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>