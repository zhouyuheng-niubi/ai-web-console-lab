<template>
    <!-- 页面标题和操作栏 -->
         <div class="flex flex-col pt-[30px] pb-[30px] px-[30px]">
    <div class="mb-[30px] flex  items-center flex-shrink-0">
        <Button class="flex  items-center" type="primary" @click="handleAddFace">
          <PlusOutlined />
          新增人脸
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
        <Button type="primary" @click="handleAddFace">
          <template #icon>
            <PlusOutlined />
          </template>
          新增人脸
        </Button>
        <Button @click="handleBatchImport" style="margin-left: 10px;">
          <template #icon>
            <UploadOutlined />
          </template>
          批量导入
        </Button>
      </template>
    </SmartTable>

    <!-- 人脸详情弹窗 -->
    <Modal title="人脸信息详情" v-model:open="detailModalVisible" width="800px"  :footer="null">
      <FaceDetail 
        :face-data="selectedFace"
        @edit="(val) => handleAction('edit', val)"
        @updateFace="(val) => handleAction('updateFace', val)"
        @delete="(val) => handleAction('delete', val)"
        @close="closeDetailModal"
      />            
    </Modal>

    <!-- 新增/编辑人脸弹窗 -->
    <Modal :title="isEditMode ? '编辑人脸信息' : '新增人脸'" v-model:open="editModalVisible" width="700px" @ok="saveFace">
      <FaceForm
        ref="faceFormRef"
        :form-data="currentFormData"
        :is-edit="isEditMode"
        :team-options="teamOptions"
        @save="saveFaceData"
      />
    </Modal>

    <!-- 更新人脸图片弹窗 -->
    <Modal title="更新人脸图片" v-model:open="updateFaceModalVisible" width="600px" @ok="confirmUpdateFace">
      <div style="padding: 20px 0;">
        <p class="mb-4">为 <strong>{{ selectedFaceName }}</strong> 更新人脸图片：</p>
        
        <div class="mb-4">
          <label class="block mb-2 font-medium">当前图片：</label>
          <div class="flex items-center">
            <div v-if="selectedFace.face_image" class="mr-4">
              <img :src="selectedFace.face_image" alt="当前人脸" class="w-32 h-32 object-cover rounded-lg border border-gray-300">
            </div>
            <div v-else class="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300">
              <span class="text-gray-500">无图片</span>
            </div>
          </div>
        </div>

        <div>
          <label class="block mb-2 font-medium">上传新图片：</label>
          <Upload
            v-model:file-list="faceImageFileList"
            list-type="picture-card"
            :max-count="1"
            :before-upload="beforeFaceUpload"
            @remove="handleRemoveFaceImage"
          >
            <div v-if="faceImageFileList.length === 0">
              <PlusOutlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </Upload>
          <div class="mt-2 text-sm text-gray-500">
            支持 JPG/PNG 格式，建议尺寸 500×500px，文件大小不超过 2MB
          </div>
        </div>

        <!-- <div class="mt-6">
          <label class="block mb-2 font-medium">拍照录入：</label>
          <Button @click="openCamera" style="width: 100%; height: 100px; background: #f8f9fa; border: 2px dashed #d9d9d9;">
            <CameraOutlined style="font-size: 24px; color: #999;" />
            <div class="mt-2">点击拍照录入</div>
          </Button>
        </div> -->
      </div>
    </Modal>

    <!-- 批量导入弹窗 -->
    <Modal title="批量导入人脸" v-model:open="importModalVisible" width="800px" @ok="confirmImport">
      <Tabs v-model:activeKey="activeTab">
        <TabPane key="1" tab="Excel模板导入">
          <div style="padding: 20px 0;">
            <div class="mb-6">
              <h4 class="font-medium mb-2">操作步骤：</h4>
              <ol class="list-decimal pl-5 space-y-1">
                <li>下载导入模板文件</li>
                <li>按照模板格式填写人员信息</li>
                <li>上传Excel文件</li>
                <li>系统会自动处理导入</li>
              </ol>
            </div>

            <div class="mb-4">
              <Button @click="downloadTemplate" style="margin-right: 10px;">
                <DownloadOutlined />
                下载模板
              </Button>
              <Button type="primary">
                <UploadOutlined />
                选择Excel文件
              </Button>
            </div>

            <div class="border border-gray-200 rounded p-4 bg-gray-50">
              <h4 class="font-medium mb-2">模板说明：</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>模板包含：姓名、工号、所属班组、岗位等字段</li>
                <li>请确保数据格式正确</li>
                <li>图片文件需要单独上传到指定文件夹</li>
              </ul>
            </div>
          </div>
        </TabPane>
        <TabPane key="2" tab="图片批量上传">
          <div style="padding: 20px 0;">
            <div class="mb-6">
              <h4 class="font-medium mb-2">操作说明：</h4>
              <p>批量上传人脸图片，系统会根据文件名自动匹配人员信息。</p>
              <p class="text-sm text-gray-500 mt-1">文件名格式：工号_姓名.jpg（例如：2023001_张三.jpg）</p>
            </div>

            <div class="mb-4">
              <Upload
                v-model:file-list="batchImageFiles"
                list-type="picture-card"
                multiple
                :max-count="50"
                :before-upload="beforeBatchUpload"
                @remove="handleRemoveBatchFile"
              >
                <div>
                  <PlusOutlined />
                  <div style="margin-top: 8px">上传图片</div>
                </div>
              </Upload>
              <div class="mt-2 text-sm text-gray-500">
                支持批量上传最多50张图片，单张图片不超过2MB
              </div>
            </div>

            <div class="border border-gray-200 rounded p-4 bg-gray-50">
              <h4 class="font-medium mb-2">上传状态：</h4>
              <div v-if="uploadStatus.length === 0" class="text-center py-4 text-gray-500">
                暂无上传记录
              </div>
              <div v-else class="space-y-2">
                <div v-for="item in uploadStatus" :key="item.name" 
                  class="flex items-center justify-between p-2 bg-white rounded">
                  <span>{{ item.name }}</span>
                  <span :class="item.status === 'success' ? 'text-green-600' : 'text-red-600'">
                    {{ item.status === 'success' ? '成功' : '失败' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal title="删除确认" v-model:open="deleteModalVisible" width="400px" @ok="confirmDelete">
      <div style="padding: 20px 0; text-align: center;">
        <p>确定要删除 <strong>{{ selectedFaceName }}</strong> 的人脸信息吗？</p>
        <p class="text-gray-500 mt-1">删除后无法恢复，该人员将无法进行人脸识别</p>
      </div>
    </Modal>

    <!-- 拍照弹窗 -->
    <!-- <Modal title="拍照录入" v-model:open="cameraModalVisible" width="900px" :footer="null">
      <CameraCapture 
        @capture="handleCapture"
        @close="closeCamera"
      />
    </Modal> -->
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { Modal, message, Upload, Button, Tabs } from 'ant-design-vue'
import { PlusOutlined, UploadOutlined, CameraOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import face_pic1 from '@/assets/faceRecognition/pic1.jpg'
import face_pic2 from '@/assets/faceRecognition/pic2.jpg'
import face_pic3 from '@/assets/faceRecognition/pic3.jpg'
import sign_pic1 from '@/assets/faceRecognition/sign1.png'
import sign_pic2 from '@/assets/faceRecognition/sign2.png'
import sign_pic3 from '@/assets/faceRecognition/sign3.png'
import FaceDetail from './components/face/faceDetail.vue'
import FaceForm from './components/face/faceForm.vue'
import CameraCapture from './components/face/cameraCapture.vue'

const { TabPane } = Tabs

// 表格列配置
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  {
    title: '工号',
    dataIndex: 'employee_id',
    key: 'employee_id',
    width: 100,
  },
  {
    title: '所属班组',
    dataIndex: 'team_name',
    key: 'team_name',
    width: 120,
  },
  {
    title: '人脸图片',
    dataIndex: 'face_image',
    key: 'face_image',
    width: 120,
    type: 'image',
    props: {
      width: 40,
      height: 40,
      preview: true
    }
  },
  {
    title: '录入时间',
    dataIndex: 'created_time',
    key: 'created_time',
    width: 160,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '签字签名',
    dataIndex: 'signature_image',
    key: 'signature_image',
    width: 100,
    type: 'image',
    props: {
      width: 40,
      height: 20,
      preview: true
    }
  },
  {
    title: '最后更新时间',
    dataIndex: 'updated_time',
    key: 'updated_time',
    width: 160,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    // type: 'tag',
    formatter: (value: string) => {
      const statusMap = {
        'active': { text: '已激活', color: 'green' },
        'inactive': { text: '未激活', color: 'orange' },
        'expired': { text: '已过期', color: 'red' }
      }
      return statusMap[value]?.text || '--'
    }
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 280,
  fixed: 'right',
  actions: [
    {
      label: '查看详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label: '编辑信息',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '更新图片',
      props: { type: 'link', size: 'small' },
      action: 'updateFace'
    },
    {
      label: '删除',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete'
    }
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '请输入姓名',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'employee_id',
    label: '工号',
    type: 'input',
    placeholder: '请输入工号',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'team_id',
    label: '所属班组',
    type: 'select',
    placeholder: '请选择班组',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
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
        { label: '已激活', value: 'active' },
        { label: '未激活', value: 'inactive' },
        { label: '已过期', value: 'expired' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'created_time_range',
    label: '录入时间',
    type: 'date-range',
    placeholder: ['开始时间', '结束时间'],
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss'
    },
    colSpan: 6
  },
  {
    field: 'updated_time_range',
    label: '更新时间',
    type: 'date-range',
    placeholder: ['开始时间', '结束时间'],
    props: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss'
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
  console.log('API调用参数:', params)
  const { pageNum, pageSize, ...rest } = params
  // 这里调用实际的API
  const res: any = await getFaceList({
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

  // 处理录入时间范围
  if (params.created_time_range && Array.isArray(params.created_time_range) && params.created_time_range.length === 2) {
    formattedParams.created_start_time = params.created_time_range[0]
    formattedParams.created_end_time = params.created_time_range[1]
    delete formattedParams.created_time_range
  }

  // 处理更新时间范围
  if (params.updated_time_range && Array.isArray(params.updated_time_range) && params.updated_time_range.length === 2) {
    formattedParams.updated_start_time = params.updated_time_range[0]
    formattedParams.updated_end_time = params.updated_time_range[1]
    delete formattedParams.updated_time_range
  }

  console.log('格式化后的参数:', formattedParams)
  return formattedParams
}

// 弹窗状态
const detailModalVisible = ref(false)
const editModalVisible = ref(false)
const updateFaceModalVisible = ref(false)
const importModalVisible = ref(false)
const deleteModalVisible = ref(false)
const cameraModalVisible = ref(false)

// 数据状态
const selectedFace = ref({})
const selectedFaceId = ref('')
const selectedFaceName = ref('')
const selectedRecord = ref({})
const currentFormData = ref({})
const isEditMode = ref(false)
const teamOptions = ref([])
const faceFormRef = ref()

// 文件上传相关
const faceImageFileList = ref([])
const batchImageFiles = ref([])
const uploadStatus = ref([])
const activeTab = ref('1')

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedRecord.value = record
  selectedFaceId.value = record.id
  selectedFaceName.value = record.name

  switch (action) {
    case 'detail':
      showFaceDetail(record)
      break
    case 'edit':
      editFace(record)
      break
    case 'updateFace':
      updateFace(record)
      break
    case 'delete':
      deleteFace(record)
      break
  }
}

// 显示人脸详情
const showFaceDetail = async (record: any) => {
  try {
    // 这里调用获取人脸详情API
    // const res = await getFaceDetail(record.id)
    // selectedFace.value = res.data
    selectedFace.value = record
    detailModalVisible.value = true
  } catch (error) {
    message.error('获取人脸详情失败')
    console.error(error)
  }
}

// 编辑人脸信息
const editFace = (record: any) => {
  isEditMode.value = true
  currentFormData.value = { ...record }
  editModalVisible.value = true
}

// 新增人脸
const handleAddFace = () => {
  isEditMode.value = false
  currentFormData.value = {}
  editModalVisible.value = true
}

// 更新人脸图片
const updateFace = (record: any) => {
  selectedFace.value = record
  faceImageFileList.value = []
  updateFaceModalVisible.value = true
}

// 删除人脸
const deleteFace = (record: any) => {
  deleteModalVisible.value = true
}

// 批量导入
const handleBatchImport = () => {
  importModalVisible.value = true
  activeTab.value = '1'
  batchImageFiles.value = []
  uploadStatus.value = []
}

// 确认更新人脸图片
const confirmUpdateFace = async () => {
  if (faceImageFileList.value.length === 0) {
    message.warning('请上传人脸图片或拍照')
    return
  }

  try {
    const file = faceImageFileList.value[0].originFileObj
    const formData = new FormData()
    formData.append('face_image', file)
    formData.append('face_id', selectedFaceId.value)

    // 调用更新人脸图片API
    // await updateFaceImage(formData)
    message.success('人脸图片更新成功')
    updateFaceModalVisible.value = false
    faceImageFileList.value = []
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('更新人脸图片失败')
    console.error(error)
  }
}

// 确认删除
const confirmDelete = async () => {
  try {
    // 调用删除API
    // await deleteFaceRecord(selectedFaceId.value)
    message.success('删除成功')
    deleteModalVisible.value = false
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('删除失败')
    console.error(error)
  }
}

// 确认导入
const confirmImport = async () => {
  if (activeTab.value === '2' && batchImageFiles.value.length === 0) {
    message.warning('请上传图片文件')
    return
  }

  try {
    if (activeTab.value === '1') {
      // Excel导入逻辑
      message.success('Excel文件已提交，系统正在处理中')
    } else {
      // 图片批量上传逻辑
      const formData = new FormData()
      batchImageFiles.value.forEach((file: any) => {
        formData.append('images', file.originFileObj)
      })

      // await batchUploadFaces(formData)
      message.success('批量上传成功')
      uploadStatus.value = batchImageFiles.value.map(file => ({
        name: file.name,
        status: 'success'
      }))
    }
    
    importModalVisible.value = false
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('导入失败')
    console.error(error)
  }
}

// 保存人脸数据
const saveFaceData = async (formData: any) => {
  try {
    if (isEditMode.value) {
      // 调用编辑API
      // await updateFaceRecord(formData)
      message.success('人脸信息更新成功')
    } else {
      // 调用新增API
      // await addFaceRecord(formData)
      message.success('人脸信息新增成功')
    }
    editModalVisible.value = false
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error(isEditMode.value ? '更新失败' : '新增失败')
    console.error(error)
  }
}

// 保存人脸（表单提交）
const saveFace = async () => {
  try {
    if (faceFormRef.value && faceFormRef.value.handleSubmit) {
      await faceFormRef.value.handleSubmit()
    }
  } catch (error) {
    console.error('提交失败:', error)
    message.error('提交失败，请重试')
  }
}

// 文件上传前验证
const beforeFaceUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
    return false
  }
  
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB')
    return false
  }
  
  return true
}

const beforeBatchUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
    return false
  }
  
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB')
    return false
  }
  
  return true
}

// 处理文件移除
const handleRemoveFaceImage = () => {
  faceImageFileList.value = []
}

const handleRemoveBatchFile = (file: any) => {
  const index = batchImageFiles.value.indexOf(file)
  if (index !== -1) {
    batchImageFiles.value.splice(index, 1)
  }
}

// 下载模板
const downloadTemplate = () => {
  message.info('模板下载功能开发中...')
  // 这里实现模板下载逻辑
}

// 打开摄像头
const openCamera = () => {
  cameraModalVisible.value = true
}

// 处理拍照结果
const handleCapture = (imageData: string) => {
  // 将base64图片转换为文件
  const file = dataURLtoFile(imageData, 'capture.jpg')
  faceImageFileList.value = [{
    uid: '-1',
    name: 'capture.jpg',
    status: 'done',
    originFileObj: file
  }]
  
  cameraModalVisible.value = false
  message.success('拍照成功，图片已添加到上传列表')
}

// 关闭摄像头
const closeCamera = () => {
  cameraModalVisible.value = false
}

// base64转文件
const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// 通用的操作处理
const handleAction = (type: string, record: any) => {
  switch (type) {
    case 'edit':
      editFace(record)
      break
    case 'updateFace':
      updateFace(record)
      break
    case 'delete':
      deleteFace(record)
      break
  }
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedFace.value = {}
}

// 加载初始化数据
onBeforeMount(async () => {
  try {
    // 加载班组数据
    const teamRes = await getTeamList()
    teamOptions.value = teamRes.data.map((team: any) => ({
      label: team.team_name,
      value: team.id
    }))
    searchConfig.value[2].props.options = teamOptions.value

  } catch (error) {
    console.error('初始化数据加载失败:', error)
  }
})

// 模拟获取班组列表API
const getTeamList = async () => {
  return {
    data: [
      { id: '1', team_name: '生产一班' },
      { id: '2', team_name: '生产二班' },
      { id: '3', team_name: '设备维护班' },
      { id: '4', team_name: '质量检测班' }
    ]
  }
}

// 模拟获取人脸列表API
const getFaceList = async (params: any) => {
  // 模拟数据
  const mockData = {
    list: [
      {
        id: '1',
        name: '张三',
        employee_id: '2023001',
        team_name: '生产一班',
        face_image: face_pic1,
        created_time: '2023-10-01 09:00:00',
        signature_image:sign_pic1,
        updated_time: '2023-10-15 14:30:00',
        status: 'active'
      },
      {
        id: '2',
        name: '李四',
        employee_id: '2023002',
        team_name: '设备维护班',
        face_image: face_pic2,
        created_time: '2023-10-02 10:15:00',
        signature_image: sign_pic2,
        updated_time: '2023-10-20 11:45:00',
        status: 'active'
      },
      {
        id: '3',
        name: '王五',
        employee_id: '2023003',
        team_name: '质量检测班',
        face_image: face_pic3,
        created_time: '2023-10-03 14:20:00',
        signature_image: sign_pic3,
        updated_time: '2023-10-03 14:20:00',
        status: 'inactive'
      }
    ],
    pagination: {
      total: 3,
      page: 1,
      page_size: 10
    }
  }
  return { data: mockData }
}
</script>

<style scoped>
.face-recognition-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

:deep(.ant-table-cell) {
  padding: 12px 8px;
}

:deep(.ant-upload-list-picture-card .ant-upload-list-item) {
  width: 100px;
  height: 100px;
}

:deep(.ant-upload.ant-upload-select-picture-card) {
  width: 100px;
  height: 100px;
}
</style>