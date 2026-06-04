<template>
      <!-- 页面标题和操作栏 -->
         <div class="flex flex-col pt-[30px] pb-[30px] px-[30px]">
    <div class="mb-[30px] flex  items-center flex-shrink-0">
        <Button class="flex  items-center" type="primary" @click="handleAddCase">
          <PlusOutlined />
          新增案例
        </Button>
      
    </div>
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
      <template #header-left>
        <Button type="primary" @click="handleAddCase">
          <PlusOutlined />
          新增案例
        </Button>
        <Button @click="handleImport" style="margin-left: 10px;">
          <UploadOutlined />
          导入案例
        </Button>
        <Dropdown>
          <template #overlay>
            <Menu @click="handleMenuClick">
              <Menu.Item key="export_all">
                <ExportOutlined />
                导出全部
              </Menu.Item>
              <Menu.Item key="export_template">
                <FileTextOutlined />
                导出模板
              </Menu.Item>
            </Menu>
          </template>
          <Button style="margin-left: 10px;">
            <DownloadOutlined />
            导出
            <DownOutlined />
          </Button>
        </Dropdown>
      </template>
    </SmartTable>

    <!-- 案例详情弹窗 -->
    <Modal title="事故案例详情" v-model:open="detailModalVisible" width="1000px" :footer="null">
      <CaseDetail 
        :case-data="selectedCase"
        @edit="(val) => handleAction('edit', val)"
        @uploadAttachment="(val) => handleAction('uploadAttachment', val)"
        @delete="(val) => handleAction('delete', val)"
        @close="closeDetailModal"
      />            
    </Modal>

    <!-- 新增/编辑案例弹窗 -->
    <Modal :title="isEditMode ? '编辑事故案例' : '新增事故案例'" v-model:open="editModalVisible" width="900px" @ok="saveCase">
      <CaseForm
        ref="caseFormRef"
        :form-data="currentFormData"
        :is-edit="isEditMode"
        :accident-type-options="accidentTypeOptions"
        :scene-options="sceneOptions"
        :region-options="regionOptions"
        @save="saveCaseData"
      />
    </Modal>

    <!-- 上传附件弹窗 -->
    <Modal title="上传附件" v-model:open="uploadAttachmentModalVisible" width="600px" @ok="confirmUploadAttachment">
      <div style="padding: 20px 0;">
        <p class="mb-4">为案例 <strong>{{ selectedCaseName }}</strong> 上传附件：</p>
        
        <div class="mb-4">
          <label class="block mb-2">当前附件：</label>
          <div v-if="selectedCase.attachments && selectedCase.attachments.length > 0" 
            class="border border-gray-200 rounded p-3 bg-gray-50">
            <div class="space-y-2">
              <div v-for="file in selectedCase.attachments" :key="file.id" 
                class="flex items-center justify-between p-2 bg-white rounded">
                <div class="flex items-center gap-2">
                  <div class="p-1 bg-blue-100 rounded">
                    <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span class="text-sm">{{ file.name }}</span>
                </div>
                <span class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-sm">暂无附件</div>
        </div>

        <div>
          <label class="block mb-2">上传新附件：</label>
          <Upload
            v-model:file-list="attachmentFiles"
            :multiple="true"
            :max-count="10"
            :before-upload="beforeAttachmentUpload"
            @remove="handleRemoveAttachment"
          >
            <Button>
              <UploadOutlined />
              选择文件
            </Button>
          </Upload>
          <div class="mt-2 text-sm text-gray-500">
            支持图片、文档、PDF、视频等格式，单个文件不超过50MB
          </div>
        </div>

        <div class="mt-6">
          <label class="block mb-2">附件说明：</label>
          <Textarea 
            v-model:value="attachmentRemark" 
            placeholder="请输入附件说明（如：现场照片、调查报告、整改通知等）" 
            :maxlength="200" 
            :rows="3" 
            class="w-full"
          />
        </div>
      </div>
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal title="删除确认" v-model:open="deleteModalVisible" width="500px" @ok="confirmDelete">
      <div style="padding: 20px 0; text-align: center;">
        <p>确定要删除案例 <strong>{{ selectedCaseName }}</strong> 吗？</p>
        <p class="text-gray-500 mt-2">删除后将无法恢复</p>
      </div>
    </Modal>

    <!-- 导入案例弹窗 -->
    <Modal title="导入事故案例" v-model:open="importModalVisible" width="800px" @ok="confirmImport">
      <Tabs v-model:activeKey="importActiveTab">
        <TabPane key="1" tab="Excel导入">
          <div style="padding: 20px 0;">
            <div class="mb-6">
              <h4 class="font-medium mb-2">操作步骤：</h4>
              <ol class="list-decimal pl-5 space-y-1">
                <li>下载导入模板</li>
                <li>按照模板格式填写案例信息</li>
                <li>上传Excel文件</li>
                <li>系统会自动导入案例数据</li>
              </ol>
            </div>

            <div class="mb-4">
              <Button @click="downloadImportTemplate" style="margin-right: 10px;">
                <DownloadOutlined />
                下载模板
              </Button>
              <Button type="primary" @click="handleSelectExcel">
                <UploadOutlined />
                选择Excel文件
              </Button>
            </div>

            <div class="border border-gray-200 rounded p-4 bg-gray-50">
              <h4 class="font-medium mb-2">模板说明：</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>模板包含：案例名称、事故类型、发生时间、事故概况等字段</li>
                <li>请严格按照模板格式填写</li>
                <li>支持批量导入多个案例</li>
                <li>导入后可以进行附件补充</li>
              </ul>
            </div>
          </div>
        </TabPane>
        <TabPane key="2" tab="Word文档解析">
          <div style="padding: 20px 0;">
            <div class="mb-6">
              <h4 class="font-medium mb-2">功能说明：</h4>
              <p>上传Word格式的事故报告，系统会自动解析内容并生成案例。</p>
              <p class="text-sm text-gray-500 mt-1">支持标准格式的事故调查报告</p>
            </div>

            <div class="mb-4">
              <Upload
                v-model:file-list="importFiles"
                :multiple="false"
                :before-upload="beforeWordUpload"
              >
                <Button>
                  <UploadOutlined />
                  选择Word文件
                </Button>
              </Upload>
              <div class="mt-2 text-sm text-gray-500">
                支持DOC、DOCX格式，文件不超过20MB
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { Modal, message, Button, Upload, Textarea, Dropdown, Menu, Tabs } from 'ant-design-vue'
import { 
  PlusOutlined, 
  UploadOutlined, 
  DownloadOutlined, 
  ExportOutlined, 
  FileTextOutlined,
  DownOutlined 
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import CaseDetail from './components/accident/caseDetail.vue'
import CaseForm from './components/accident/caseForm.vue'

const { TabPane } = Tabs

// 表格列配置
const columns = [
  {
    title: '案例名称',
    dataIndex: 'case_name',
    key: 'case_name',
    width: 250,
    ellipsis: true,
  },
  {
    title: '事故类型',
    dataIndex: 'accident_type',
    key: 'accident_type',
    width: 120,
    formatter: (value: string) => {
      const typeMap = {
        'fall': '高处坠落',
        'fire_explosion': '火灾爆炸',
        'mechanical': '机械伤害',
        'poisoning': '中毒窒息',
        'collapse': '坍塌',
        'electric': '触电',
        'other': '其他'
      }
      return typeMap[value] || value
    }
  },
  {
    title: '适用场景',
    dataIndex: 'scene_names',
    key: 'scene_names',
    width: 150,
    ellipsis: true,
    formatter: (value: string[]) => {
      return value?.join('、') || '--'
    }
  },
  {
    title: '事故发生单位',
    dataIndex: 'occurrence_unit',
    key: 'occurrence_unit',
    width: 180,
    ellipsis: true,
  },
  {
    title: '所在区域',
    dataIndex: 'region_name',
    key: 'region_name',
    width: 120,
  },
  {
    title: '发生地点',
    dataIndex: 'location',
    key: 'location',
    width: 180,
    ellipsis: true,
  },
  {
    title: '发生时间',
    dataIndex: 'occurrence_time',
    key: 'occurrence_time',
    width: 160,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: '上传人',
    dataIndex: 'uploader_name',
    key: 'uploader_name',
    width: 100,
  },
  {
    title: '上传时间',
    dataIndex: 'upload_time',
    key: 'upload_time',
    width: 160,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: '案例附件',
    dataIndex: 'attachment_count',
    key: 'attachment_count',
    width: 100,
    formatter: (value: number) => {
      return value > 0 ? `${value}个` : '无'
    }
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 350,
  fixed: 'right',
  actions: [
    {
      label: '查看详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
   
     {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
     {
      label: '上传附件',
      props: { type: 'link', size: 'small' },
      action: 'uploadAttachment'
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete'
    }
   
   
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'case_name',
    label: '案例名称',
    type: 'input',
    placeholder: '请输入案例名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'accident_type',
    label: '事故类型',
    type: 'select',
    placeholder: '请选择事故类型',
    props: {
      allowClear: true,
      options: [
        { label: '高处坠落', value: 'fall' },
        { label: '火灾爆炸', value: 'fire_explosion' },
        { label: '机械伤害', value: 'mechanical' },
        { label: '中毒窒息', value: 'poisoning' },
        { label: '坍塌', value: 'collapse' },
        { label: '触电', value: 'electric' },
        { label: '其他', value: 'other' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'occurrence_unit',
    label: '发生单位',
    type: 'input',
    placeholder: '请输入发生单位',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'region_id',
    label: '所在区域',
    type: 'select',
    placeholder: '请选择区域',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
    },
    colSpan: 6
  },
  {
    field: 'scene_id',
    label: '适用场景',
    type: 'select',
    placeholder: '请选择适用场景',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
    },
    colSpan: 6
  },
  {
    field: 'occurrence_time_range',
    label: '发生时间',
    type: 'date-range',
    placeholder: ['开始时间', '结束时间'],
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm'
    },
    colSpan: 6
  },
  {
    field: 'upload_time_range',
    label: '上传时间',
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
  const res: any = await getCaseList({
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

  // 处理发生时间范围
  if (params.occurrence_time_range && params.occurrence_time_range.length === 2) {
    formattedParams.occurrence_start_time = params.occurrence_time_range[0]
    formattedParams.occurrence_end_time = params.occurrence_time_range[1]
    delete formattedParams.occurrence_time_range
  }

  // 处理上传时间范围
  if (params.upload_time_range && params.upload_time_range.length === 2) {
    formattedParams.upload_start_time = params.upload_time_range[0]
    formattedParams.upload_end_time = params.upload_time_range[1]
    delete formattedParams.upload_time_range
  }

  return formattedParams
}

// 弹窗状态
const detailModalVisible = ref(false)
const editModalVisible = ref(false)
const uploadAttachmentModalVisible = ref(false)
const deleteModalVisible = ref(false)
const importModalVisible = ref(false)

// 数据状态
const selectedCase = ref({})
const selectedCaseId = ref('')
const selectedCaseName = ref('')
const currentFormData = ref({})
const isEditMode = ref(false)
const attachmentRemark = ref('')
const caseFormRef = ref()

// 导入相关
const importActiveTab = ref('1')
const importFiles = ref([])

// 文件上传相关
const attachmentFiles = ref([])

// 选项数据
const accidentTypeOptions = ref([])
const sceneOptions = ref([])
const regionOptions = ref([])

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedCaseId.value = record.id
  selectedCaseName.value = record.case_name
  selectedCase.value = record

  switch (action) {
    case 'detail':
      showCaseDetail(record)
      break
    case 'edit':
      editCase(record)
      break
    case 'uploadAttachment':
      uploadAttachment(record)
      break
    case 'delete':
      deleteCase(record)
      break
  }
}

// 显示案例详情
const showCaseDetail = async (record: any) => {
  selectedCase.value = record
  detailModalVisible.value = true
}

// 编辑案例
const editCase = (record: any) => {
  isEditMode.value = true
  currentFormData.value = { ...record }
  editModalVisible.value = true
}

// 新增案例
const handleAddCase = () => {
  isEditMode.value = false
  currentFormData.value = {}
  editModalVisible.value = true
}

// 上传附件
const uploadAttachment = (record: any) => {
  attachmentRemark.value = ''
  attachmentFiles.value = []
  uploadAttachmentModalVisible.value = true
}

// 删除案例
const deleteCase = (record: any) => {
  deleteModalVisible.value = true
}

// 导入案例
const handleImport = () => {
  importActiveTab.value = '1'
  importFiles.value = []
  importModalVisible.value = true
}

// 导出菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  switch (key) {
    case 'export_all':
      handleExportAll()
      break
    case 'export_template':
      handleExportTemplate()
      break
  }
}

// 确认上传附件
const confirmUploadAttachment = async () => {
  if (attachmentFiles.value.length === 0) {
    message.warning('请选择要上传的附件')
    return
  }

  try {
    // 调用上传附件API
    // await uploadCaseAttachments(selectedCaseId.value, {
    //   files: attachmentFiles.value,
    //   remark: attachmentRemark.value
    // })
    
    message.success(`成功上传 ${attachmentFiles.value.length} 个附件`)
    uploadAttachmentModalVisible.value = false
    attachmentFiles.value = []
    attachmentRemark.value = ''
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('附件上传失败')
  }
}

// 确认删除
const confirmDelete = async () => {
  try {
    // 调用删除API
    // await deleteCaseRecord(selectedCaseId.value)
    message.success('删除成功')
    deleteModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('删除失败')
  }
}

// 确认导入
const confirmImport = async () => {
  if (importActiveTab.value === '1' && importFiles.value.length === 0) {
    message.warning('请选择要导入的Excel文件')
    return
  }

  if (importActiveTab.value === '2' && importFiles.value.length === 0) {
    message.warning('请选择要导入的Word文件')
    return
  }

  try {
    // 调用导入API
    message.success('导入成功，系统正在处理中')
    importModalVisible.value = false
    importFiles.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('导入失败')
  }
}

// 保存案例数据
const saveCaseData = async (formData: any) => {
  try {
    if (isEditMode.value) {
      message.success('案例信息更新成功')
    } else {
      message.success('案例新增成功')
    }
    editModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error(isEditMode.value ? '更新失败' : '新增失败')
  }
}

// 保存案例
const saveCase = async () => {
  try {
    if (caseFormRef.value?.handleSubmit) {
      await caseFormRef.value.handleSubmit()
    }
  } catch (error) {
    message.error('提交失败，请重试')
  }
}

// 文件上传前验证
const beforeAttachmentUpload = (file: any) => {
  const maxSize = 50 * 1024 * 1024 // 50MB
  
  if (file.size > maxSize) {
    message.error('文件大小不能超过50MB')
    return false
  }
  
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp',
    'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4', 'video/avi'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    message.error('不支持的文件类型')
    return false
  }
  
  return true
}

const beforeWordUpload = (file: any) => {
  const maxSize = 20 * 1024 * 1024 // 20MB
  
  if (file.size > maxSize) {
    message.error('文件大小不能超过20MB')
    return false
  }
  
  const allowedTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    message.error('请上传Word文档')
    return false
  }
  
  return true
}

// 处理文件移除
const handleRemoveAttachment = () => {
  // 文件移除逻辑
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes) return '--'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

// 选择Excel文件
const handleSelectExcel = () => {
  // 触发文件选择
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls'
  input.onchange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      importFiles.value = [{
        uid: '-1',
        name: file.name,
        status: 'done',
        originFileObj: file
      }]
    }
  }
  input.click()
}

// 下载导入模板
const downloadImportTemplate = () => {
  message.info('模板下载功能开发中...')
}

// 导出全部
const handleExportAll = () => {
  message.info('导出全部功能开发中...')
}

// 导出模板
const handleExportTemplate = () => {
  message.info('导出模板功能开发中...')
}

// 通用的操作处理
const handleAction = (type: string, record: any) => {
  switch (type) {
    case 'edit':
      editCase(record)
      break
    case 'uploadAttachment':
      uploadAttachment(record)
      break
    case 'delete':
      deleteCase(record)
      break
  }
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedCase.value = {}
}

// 加载初始化数据
onBeforeMount(async () => {
  try {
    // 加载使用场景数据
    const sceneRes = await getSceneList()
    sceneOptions.value = sceneRes.data.map((item: any) => ({
      label: item.scene_name,
      value: item.id
    }))
    searchConfig.value[4].props.options = sceneOptions.value

    // 加载区域数据
    const regionRes = await getRegionList()
    regionOptions.value = regionRes.data.map((item: any) => ({
      label: item.region_name,
      value: item.id
    }))
    searchConfig.value[3].props.options = regionOptions.value

  } catch (error) {
    console.error('初始化数据加载失败:', error)
  }
})

// 模拟获取案例列表API
const getCaseList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        case_name: '2023年XX项目高空坠落事故案例',
        accident_type: 'fall',
        scene_names: ['安全培训', '警示教育'],
        occurrence_unit: 'XX建筑工程有限公司',
        region_name: '建筑工地',
        location: 'XX项目3号楼15层',
        occurrence_time: '2023-05-12 14:30:00',
        uploader_name: '张三',
        upload_time: '2023-05-15 09:20:00',
        attachment_count: 3
      },
      {
        id: '2',
        case_name: '化工投料违规操作爆炸案例',
        accident_type: 'fire_explosion',
        scene_names: ['危险化学品安全', '操作规程培训'],
        occurrence_unit: 'XX化工厂',
        region_name: '化工园区',
        location: '2号车间反应釜区',
        occurrence_time: '2023-03-08 10:15:00',
        uploader_name: '李四',
        upload_time: '2023-03-10 14:00:00',
        attachment_count: 2
      },
      {
        id: '3',
        case_name: '机械加工车间手臂卷入事故',
        accident_type: 'mechanical',
        scene_names: ['机械安全', '操作规范'],
        occurrence_unit: 'XX机械制造厂',
        region_name: '机械加工区',
        location: '冲压车间3号机',
        occurrence_time: '2023-07-20 08:45:00',
        uploader_name: '王五',
        upload_time: '2023-07-22 10:30:00',
        attachment_count: 1
      },
      {
        id: '4',
        case_name: '有限空间作业中毒窒息案例',
        accident_type: 'poisoning',
        scene_names: ['有限空间作业', '应急救援'],
        occurrence_unit: 'XX市政工程公司',
        region_name: '市政管网',
        location: '污水管道检修井',
        occurrence_time: '2023-08-05 16:20:00',
        uploader_name: '赵六',
        upload_time: '2023-08-08 11:15:00',
        attachment_count: 0
      }
    ],
    pagination: {
      total: 4,
      page: 1,
      page_size: 10
    }
  }
  return { data: mockData }
}

// 模拟获取使用场景列表
const getSceneList = async () => {
  return {
    data: [
      { id: '1', scene_name: '安全培训' },
      { id: '2', scene_name: '警示教育' },
      { id: '3', scene_name: '危险化学品安全' },
      { id: '4', scene_name: '操作规程培训' },
      { id: '5', scene_name: '机械安全' },
      { id: '6', scene_name: '有限空间作业' },
      { id: '7', scene_name: '应急救援' },
      { id: '8', scene_name: '消防安全' }
    ]
  }
}

// 模拟获取区域列表
const getRegionList = async () => {
  return {
    data: [
      { id: '1', region_name: '建筑工地' },
      { id: '2', region_name: '化工园区' },
      { id: '3', region_name: '机械加工区' },
      { id: '4', region_name: '市政管网' },
      { id: '5', region_name: '电力设施' },
      { id: '6', region_name: '仓库存储区' },
      { id: '7', region_name: '办公区域' }
    ]
  }
}
</script>

<style scoped>
.accident-case-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>