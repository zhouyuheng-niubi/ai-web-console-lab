<template>
          <!-- 页面标题和操作栏 -->
         <div class="flex flex-col pt-[30px] pb-[30px] px-[30px]">
    <div class="mb-[30px] flex  items-center flex-shrink-0">
        <Button class="flex  items-center" type="primary" @click="handleAddMaterial">
          <PlusOutlined />
          新增资料
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
        <Button type="primary" @click="handleAddMaterial">
          <PlusOutlined />
          新增资料
        </Button>
        <Button @click="handleBatchUpload" style="margin-left: 10px;">
          <UploadOutlined />
          批量上传
        </Button>
        <Dropdown>
          <template #overlay>
            <Menu @click="handleMenuClick">
              <Menu.Item key="export_all">
                <ExportOutlined />
                导出全部
              </Menu.Item>
              <Menu.Item key="export_published">
                <SafetyOutlined />
                导出已发布
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

    <!-- 资料详情弹窗 -->
    <Modal title="培训资料详情" v-model:open="detailModalVisible" width="900px" :footer="null">
      <MaterialDetail 
        :material-data="selectedMaterial"
        @edit="(val) => handleAction('edit', val)"
        @updateFile="(val) => handleAction('updateFile', val)"
        @publish="(val) => handleAction('publish', val)"
        @unpublish="(val) => handleAction('unpublish', val)"
        @delete="(val) => handleAction('delete', val)"
        @close="closeDetailModal"
      />            
    </Modal>

    <!-- 新增/编辑资料弹窗 -->
    <Modal :title="isEditMode ? '编辑培训资料' : '新增培训资料'" v-model:open="editModalVisible" width="800px" @ok="saveMaterial">
      <MaterialForm
        ref="materialFormRef"
        :form-data="currentFormData"
        :is-edit="isEditMode"
        :material-type-options="materialTypeOptions"
        :scene-options="sceneOptions"
        @save="saveMaterialData"
      />
    </Modal>

    <!-- 上传更新弹窗 -->
    <Modal title="上传更新文件" v-model:open="updateFileModalVisible" width="600px" @ok="confirmUpdateFile">
      <div style="padding: 20px 0;">
        <p class="mb-4">为 <strong>{{ selectedMaterialName }}</strong> 更新文件：</p>
        
        <div class="mb-4">
          <label class="block mb-2">当前文件：</label>
          <div class="flex items-center p-3 bg-gray-50 rounded-lg">
            <div class="mr-3">
              <div class="p-2 bg-blue-100 rounded">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium">{{ selectedMaterial.file_name || '未上传' }}</div>
              <div class="text-sm text-gray-500">
                {{ selectedMaterial.file_size ? formatFileSize(selectedMaterial.file_size) : '--' }}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block mb-2">上传新文件：</label>
          <Upload
            v-model:file-list="updateFileList"
            :multiple="false"
            :before-upload="beforeMaterialUpload"
            @remove="handleRemoveUpdateFile"
          >
            <Button>
              <UploadOutlined />
              选择文件
            </Button>
          </Upload>
          <div class="mt-2 text-sm text-gray-500">
            支持视频、文档、PDF、图片等格式，最大不超过500MB
          </div>
        </div>

        <div class="mt-6">
          <label class="block mb-2">更新说明：</label>
          <Textarea 
            v-model:value="updateRemark" 
            placeholder="请输入文件更新说明" 
            :maxlength="200" 
            :rows="3" 
            class="w-full"
          />
        </div>
      </div>
    </Modal>

    <!-- 发布确认弹窗 -->
    <Modal title="发布确认" v-model:open="publishModalVisible" width="500px" @ok="confirmPublish">
      <div style="padding: 20px 0; text-align: center;">
        <p>确定要发布 <strong>{{ selectedMaterialName }}</strong> 吗？</p>
        <p class="text-gray-500 mt-2">发布后所有用户都可以查看该资料</p>
      </div>
    </Modal>

    <!-- 下架确认弹窗 -->
    <Modal title="下架确认" v-model:open="unpublishModalVisible" width="500px" @ok="confirmUnpublish">
      <div style="padding: 20px 0;">
        <p>确定要下架 <strong>{{ selectedMaterialName }}</strong> 吗？</p>
        <p class="text-gray-500 mt-2">下架后：</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600 mt-2">
          <li>用户将无法查看该资料</li>
          <li>已学习记录将保留</li>
          <li>可以重新发布</li>
        </ul>
        <div class="mt-4">
          <label class="block mb-2">下架原因：</label>
          <Textarea 
            v-model:value="unpublishReason" 
            placeholder="请输入下架原因（如：内容过时、需要修订等）" 
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
        <p>确定要删除 <strong>{{ selectedMaterialName }}</strong> 吗？</p>
        <p class="text-gray-500 mt-2">删除后将无法恢复，相关学习记录也会被删除</p>
      </div>
    </Modal>

    <!-- 批量上传弹窗 -->
    <Modal title="批量上传培训资料" v-model:open="batchUploadModalVisible" width="800px" @ok="confirmBatchUpload">
      <div style="padding: 20px 0;">
        <Tabs v-model:activeKey="batchUploadActiveTab">
          <TabPane key="1" tab="文件上传">
            <div class="mb-4">
              <Upload
                v-model:file-list="batchFiles"
                :multiple="true"
                :before-upload="beforeBatchUpload"
                @remove="handleRemoveBatchFile"
                :file-list="batchFiles"
                :max-count="20"
              >
                <Button>
                  <UploadOutlined />
                  选择文件
                </Button>
              </Upload>
              <div class="mt-2 text-sm text-gray-500">
                支持批量上传最多20个文件，单个文件不超过500MB
              </div>
            </div>
          </TabPane>
          <TabPane key="2" tab="文件夹上传">
            <div class="text-center py-8">
              <p class="text-gray-500 mb-4">暂不支持文件夹上传功能</p>
              <Button @click="batchUploadActiveTab = '1'">切换到文件上传</Button>
            </div>
          </TabPane>
        </Tabs>

        <div class="mt-4 border border-gray-200 rounded p-3">
          <h4 class="font-medium mb-2">上传说明：</h4>
          <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>支持视频、文档、PDF、图片等格式</li>
            <li>文件名将作为资料名称</li>
            <li>可以上传后统一编辑信息</li>
            <li>大文件上传可能需要较长时间</li>
          </ul>
        </div>
      </div>
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
  SafetyOutlined, 
  FileTextOutlined,
  DownOutlined 
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import MaterialDetail from './components/training/materialDetail.vue'
import MaterialForm from './components/training/materialForm.vue'

const { TabPane } = Tabs

// 表格列配置
const columns = [
  {
    title: '资料名称',
    dataIndex: 'material_name',
    key: 'material_name',
    width: 200,
  },
  {
    title: '资料类型',
    dataIndex: 'material_type',
    key: 'material_type',
    width: 120,
    formatter: (value: string) => {
      const typeMap = {
        'video': '视频',
        'document': '文档',
        'pdf': 'PDF',
        'image': '图片',
        'audio': '音频',
        'course': '课程',
        'other': '其他'
      }
      return typeMap[value] || value
    }
  },
  {
    title: '使用场景',
    dataIndex: 'scene_name',
    key: 'scene_name',
    width: 150,
  },
  {
    title: '素材时长',
    dataIndex: 'duration',
    key: 'duration',
    width: 100,
    formatter: (value: number) => {
      if (!value) return '--'
      if (value < 60) return `${value}秒`
      if (value < 3600) return `${Math.floor(value / 60)}分钟`
      const hours = Math.floor(value / 3600)
      const minutes = Math.floor((value % 3600) / 60)
      return `${hours}小时${minutes}分钟`
    }
  },
  {
    title: '素材大小',
    dataIndex: 'file_size',
    key: 'file_size',
    width: 100,
    formatter: (value: number) => formatFileSize(value)
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
    title: '最后更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: 160,
    formatter: (value: string) => {
      if (!value) return '--'
      return dayjs(value).format('YYYY-MM-DD HH:mm')
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    formatter: (value: string) => {
      const statusMap = {
        'published': { text: '已发布', color: 'green' },
        'unpublished': { text: '未发布', color: 'orange' },
        'unlisted': { text: '已下架', color: 'red' }
      }
      return statusMap[value]?.text || '--'
    }
  },
  {
    title: '观看次数',
    dataIndex: 'view_count',
    key: 'view_count',
    width: 100,
    formatter: (value: number) => `${value}次`
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 350,
  fixed: 'right',
  actions: [
    {
      label: '查看',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    
    {
      label: '上传更新',
      props: { type: 'link', size: 'small' },
      action: 'updateFile',
      visible: (record: any) => true
    },
    {
      label: '编辑',
      props: { type: 'link', size: 'small' },
      icon: 'EditOutlined',
      action: 'edit',
      
      visible: (record: any) => record.status !== 'published'
    },
    {
      label: '发布',
      props: { type: 'link', size: 'small' },
      action: 'publish',
      visible: (record: any) => record.status === 'unpublished'
    },
    {
      label: '下架',
      props: { type: 'link', size: 'small' },
      action: 'unpublish',
      visible: (record: any) => record.status === 'published'
    },
    {
      label: '删除',
      props: { type: 'link', size: 'small', danger: true },
      icon: 'DeleteOutlined',
      action: 'delete',
      visible: (record: any) => record.status !== 'published'
    }
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'material_name',
    label: '资料名称',
    type: 'input',
    placeholder: '请输入资料名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'material_type',
    label: '资料类型',
    type: 'select',
    placeholder: '请选择资料类型',
    props: {
      allowClear: true,
      options: [
        { label: '视频', value: 'video' },
        { label: '文档', value: 'document' },
        { label: 'PDF', value: 'pdf' },
        { label: '图片', value: 'image' },
        { label: '音频', value: 'audio' },
        { label: '课程', value: 'course' },
        { label: '其他', value: 'other' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'scene_id',
    label: '使用场景',
    type: 'select',
    placeholder: '请选择使用场景',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
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
        { label: '已发布', value: 'published' },
        { label: '未发布', value: 'unpublished' },
        { label: '已下架', value: 'unlisted' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'uploader_id',
    label: '上传人',
    type: 'select',
    placeholder: '请选择上传人',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
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
  const res: any = await getMaterialList({
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
const updateFileModalVisible = ref(false)
const publishModalVisible = ref(false)
const unpublishModalVisible = ref(false)
const deleteModalVisible = ref(false)
const batchUploadModalVisible = ref(false)

// 数据状态
const selectedMaterial = ref({})
const selectedMaterialId = ref('')
const selectedMaterialName = ref('')
const currentFormData = ref({})
const isEditMode = ref(false)
const updateRemark = ref('')
const unpublishReason = ref('')
const materialFormRef = ref()

// 批量上传相关
const batchUploadActiveTab = ref('1')
const batchFiles = ref([])

// 文件上传相关
const updateFileList = ref([])

// 选项数据
const materialTypeOptions = ref([])
const sceneOptions = ref([])
const uploaderOptions = ref([])

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedMaterialId.value = record.id
  selectedMaterialName.value = record.material_name
  selectedMaterial.value = record

  switch (action) {
    case 'detail':
      showMaterialDetail(record)
      break
    case 'edit':
      editMaterial(record)
      break
    case 'updateFile':
      updateMaterialFile(record)
      break
    case 'publish':
      publishMaterial(record)
      break
    case 'unpublish':
      unpublishMaterial(record)
      break
    case 'delete':
      deleteMaterial(record)
      break
  }
}

// 显示资料详情
const showMaterialDetail = async (record: any) => {
  selectedMaterial.value = record
  detailModalVisible.value = true
}

// 编辑资料
const editMaterial = (record: any) => {
  if (record.status === 'published') {
    message.warning('已发布的资料不能编辑，请先下架')
    return
  }
  isEditMode.value = true
  currentFormData.value = { ...record }
  editModalVisible.value = true
}

// 新增资料
const handleAddMaterial = () => {
  isEditMode.value = false
  currentFormData.value = {}
  editModalVisible.value = true
}

// 更新文件
const updateMaterialFile = (record: any) => {
  updateRemark.value = ''
  updateFileList.value = []
  updateFileModalVisible.value = true
}

// 发布资料
const publishMaterial = (record: any) => {
  publishModalVisible.value = true
}

// 下架资料
const unpublishMaterial = (record: any) => {
  unpublishReason.value = ''
  unpublishModalVisible.value = true
}

// 删除资料
const deleteMaterial = (record: any) => {
  if (record.status === 'published') {
    message.warning('已发布的资料不能删除，请先下架')
    return
  }
  deleteModalVisible.value = true
}

// 批量上传
const handleBatchUpload = () => {
  batchFiles.value = []
  batchUploadModalVisible.value = true
}

// 导出菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  switch (key) {
    case 'export_all':
      handleExportAll()
      break
    case 'export_published':
      handleExportPublished()
      break
    case 'export_template':
      handleExportTemplate()
      break
  }
}

// 确认更新文件
const confirmUpdateFile = async () => {
  if (updateFileList.value.length === 0) {
    message.warning('请选择要上传的文件')
    return
  }

  try {
    // 调用更新文件API
    // await updateMaterialFile(selectedMaterialId.value, {
    //   file: updateFileList.value[0],
    //   remark: updateRemark.value
    // })
    
    message.success('文件更新成功')
    updateFileModalVisible.value = false
    updateFileList.value = []
    updateRemark.value = ''
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('文件更新失败')
  }
}

// 确认发布
const confirmPublish = async () => {
  try {
    // 调用发布API
    // await publishMaterial(selectedMaterialId.value)
    message.success('发布成功')
    publishModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('发布失败')
  }
}

// 确认下架
const confirmUnpublish = async () => {
  if (!unpublishReason.value.trim()) {
    message.warning('请输入下架原因')
    return
  }

  try {
    // 调用下架API
    // await unpublishMaterial(selectedMaterialId.value, {
    //   reason: unpublishReason.value
    // })
    message.success('下架成功')
    unpublishModalVisible.value = false
    unpublishReason.value = ''
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('下架失败')
  }
}

// 确认删除
const confirmDelete = async () => {
  try {
    // 调用删除API
    // await deleteMaterial(selectedMaterialId.value)
    message.success('删除成功')
    deleteModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('删除失败')
  }
}

// 确认批量上传
const confirmBatchUpload = async () => {
  if (batchFiles.value.length === 0) {
    message.warning('请选择要上传的文件')
    return
  }

  try {
    // 调用批量上传API
    // await batchUploadMaterials(batchFiles.value)
    message.success(`批量上传成功，共处理 ${batchFiles.value.length} 个文件`)
    batchUploadModalVisible.value = false
    batchFiles.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('批量上传失败')
  }
}

// 导出全部
const handleExportAll = () => {
  message.info('导出全部功能开发中...')
}

// 导出已发布
const handleExportPublished = () => {
  message.info('导出已发布功能开发中...')
}

// 导出模板
const handleExportTemplate = () => {
  message.info('导出模板功能开发中...')
}

// 保存资料数据
const saveMaterialData = async (formData: any) => {
  try {
    if (isEditMode.value) {
      message.success('资料信息更新成功')
    } else {
      message.success('资料新增成功')
    }
    editModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error(isEditMode.value ? '更新失败' : '新增失败')
  }
}

// 保存资料
const saveMaterial = async () => {
  try {
    if (materialFormRef.value?.handleSubmit) {
      await materialFormRef.value.handleSubmit()
    }
  } catch (error) {
    message.error('提交失败，请重试')
  }
}

// 文件上传前验证
const beforeMaterialUpload = (file: any) => {
  const maxSize = 500 * 1024 * 1024 // 500MB
  
  if (file.size > maxSize) {
    message.error('文件大小不能超过500MB')
    return false
  }
  
  const allowedTypes = [
    'video/mp4', 'video/avi',
    'application/pdf', 
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg', 'image/png', 'image/gif',
    'audio/mpeg', 'audio/mp3', 'audio/wav'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    message.error('不支持的文件类型')
    return false
  }
  
  return true
}

const beforeBatchUpload = (file: any) => {
  return beforeMaterialUpload(file)
}

// 处理文件移除
const handleRemoveUpdateFile = () => {
  updateFileList.value = []
}

const handleRemoveBatchFile = (file: any) => {
  const index = batchFiles.value.indexOf(file)
  if (index !== -1) {
    batchFiles.value.splice(index, 1)
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (!bytes) return '--'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

// 通用的操作处理
const handleAction = (type: string, record: any) => {
  switch (type) {
    case 'edit':
      editMaterial(record)
      break
    case 'updateFile':
      updateMaterialFile(record)
      break
    case 'publish':
      publishMaterial(record)
      break
    case 'unpublish':
      unpublishMaterial(record)
      break
    case 'delete':
      deleteMaterial(record)
      break
  }
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedMaterial.value = {}
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
    searchConfig.value[2].props.options = sceneOptions.value

    // 加载上传人数据
    const uploaderRes = await getUploaderList()
    uploaderOptions.value = uploaderRes.data.map((item: any) => ({
      label: item.name,
      value: item.id
    }))
    searchConfig.value[4].props.options = uploaderOptions.value

  } catch (error) {
    console.error('初始化数据加载失败:', error)
  }
})

// 模拟获取资料列表API
const getMaterialList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        material_name: '安全生产操作规程',
        material_type: 'video',
        scene_name: '岗前培训',
        duration: 1800, // 30分钟
        file_size: 1024 * 1024 * 200, // 200MB
        uploader_name: '张三',
        upload_time: '2023-10-01 09:30:00',
        update_time: '2023-10-15 14:20:00',
        status: 'published',
        view_count: 156,
        file_name: 'safety_operation.mp4'
      },
      {
        id: '2',
        material_name: '机械设备维护手册',
        material_type: 'pdf',
        scene_name: '技能提升',
        duration: null,
        file_size: 1024 * 1024 * 50, // 50MB
        uploader_name: '李四',
        upload_time: '2023-10-05 14:15:00',
        update_time: '2023-10-05 14:15:00',
        status: 'unpublished',
        view_count: 0,
        file_name: 'equipment_manual.pdf'
      },
      {
        id: '3',
        material_name: '紧急事故处理流程',
        material_type: 'document',
        scene_name: '应急演练',
        duration: null,
        file_size: 1024 * 1024 * 10, // 10MB
        uploader_name: '王五',
        upload_time: '2023-10-10 11:00:00',
        update_time: '2023-10-12 16:30:00',
        status: 'unlisted',
        view_count: 89,
        file_name: 'emergency_procedure.docx'
      },
      {
        id: '4',
        material_name: '消防器材使用方法',
        material_type: 'image',
        scene_name: '安全教育',
        duration: null,
        file_size: 1024 * 1024 * 5, // 5MB
        uploader_name: '赵六',
        upload_time: '2023-10-15 10:20:00',
        update_time: null,
        status: 'published',
        view_count: 234,
        file_name: 'fire_equipment.png'
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
      { id: '1', scene_name: '岗前培训' },
      { id: '2', scene_name: '技能提升' },
      { id: '3', scene_name: '安全教育' },
      { id: '4', scene_name: '应急演练' },
      { id: '5', scene_name: '考核认证' },
      { id: '6', scene_name: '日常学习' }
    ]
  }
}

// 模拟获取上传人列表
const getUploaderList = async () => {
  return {
    data: [
      { id: '1', name: '张三' },
      { id: '2', name: '李四' },
      { id: '3', name: '王五' },
      { id: '4', name: '赵六' },
      { id: '5', name: '钱七' }
    ]
  }
}
</script>

<style scoped>
.training-material-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>