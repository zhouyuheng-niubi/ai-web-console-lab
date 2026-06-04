<template>
  <div class="certificate-management-container">
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
        <Button type="primary" @click="handleAddCertificate">
          <PlusOutlined />
          新增证书
        </Button>
        <Button @click="handleBatchImport" style="margin-left: 10px;">
          <UploadOutlined />
          批量导入
        </Button>
        <Button @click="handleExport" style="margin-left: 10px;">
          <ExportOutlined />
          导出
        </Button>
        <Button @click="handleCheckAll" style="margin-left: 10px;">
          <SafetyCertificateOutlined />
          批量核验
        </Button>
      </template>
    </SmartTable>

    <!-- 证书详情弹窗 -->
    <Modal title="证书详情" v-model:open="detailModalVisible" width="900px" :footer="null">
      <CertificateDetail 
        :certificate-data="selectedCertificate"
        @edit="(val) => handleAction('edit', val)"
        @verify="(val) => handleAction('verify', val)"
        @invalidate="(val) => handleAction('invalidate', val)"
        @close="closeDetailModal"
      />            
    </Modal>

    <!-- 新增/编辑证书弹窗 -->
    <Modal :title="isEditMode ? '编辑证书' : '新增证书'" v-model:open="editModalVisible" width="700px" @ok="saveCertificate">
      <CertificateForm
        ref="certificateFormRef"
        :form-data="currentFormData"
        :is-edit="isEditMode"
        :person-options="personOptions"
        :certificate-type-options="certificateTypeOptions"
        :institution-options="institutionOptions"
        @save="saveCertificateData"
      />
    </Modal>

    <!-- 证书核验弹窗 -->
    <Modal title="证书核验" v-model:open="verifyModalVisible" width="800px" @ok="confirmVerify">
      <div style="padding: 20px 0;">
        <p class="mb-4">核验证书：<strong>{{ selectedCertificateName }}</strong></p>
        
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-gray-600">人员名称：</span>
              <span class="font-medium">{{ selectedCertificate.person_name }}</span>
            </div>
            <div>
              <span class="text-gray-600">证书编号：</span>
              <span class="font-medium">{{ selectedCertificate.certificate_no }}</span>
            </div>
            <div>
              <span class="text-gray-600">证书名称：</span>
              <span class="font-medium">{{ selectedCertificate.certificate_name }}</span>
            </div>
            <div>
              <span class="text-gray-600">有效期：</span>
              <span class="font-medium">{{ formatDate(selectedCertificate.valid_start) }} 至 {{ formatDate(selectedCertificate.valid_end) }}</span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">核验结果：</label>
          <RadioGroup v-model:value="verifyResult" class="w-full">
            <Radio value="valid" class="block mb-2">
              <span class="text-green-600">✅ 有效</span>
            </Radio>
            <Radio value="invalid" class="block mb-2">
              <span class="text-red-600">❌ 无效</span>
            </Radio>
            <Radio value="questionable" class="block">
              <span class="text-orange-600">⚠️ 存疑</span>
            </Radio>
          </RadioGroup>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">核验说明：</label>
          <Textarea 
            v-model:value="verifyRemark" 
            placeholder="请输入核验说明（如：证书真实有效、发现伪造痕迹、信息不符等）" 
            :maxlength="500" 
            :rows="4" 
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">核验证明：</label>
          <Upload
            v-model:file-list="verifyFileList"
            list-type="picture-card"
            :max-count="3"
            :before-upload="beforeVerifyFileUpload"
            @remove="handleRemoveVerifyFile"
          >
            <div>
              <PlusOutlined />
              <div style="margin-top: 8px">上传证明</div>
            </div>
          </Upload>
          <div class="mt-2 text-sm text-gray-500">
            可上传核验截图、核查记录等证明文件
          </div>
        </div>
      </div>
    </Modal>

    <!-- 证书作废确认弹窗 -->
    <Modal title="证书作废确认" v-model:open="invalidateModalVisible" width="500px" @ok="confirmInvalidate">
      <div style="padding: 20px 0;">
        <p class="mb-2">确定要作废证书 <strong>{{ selectedCertificateName }}</strong> 吗？</p>
        <p class="text-gray-500 mb-4">作废后：</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600 mb-4">
          <li>证书状态将变更为"已作废"</li>
          <li>该证书不再可用于任何认证</li>
          <li>操作记录将永久保存</li>
        </ul>
        <div>
          <label class="block mb-2">作废原因：</label>
          <Textarea 
            v-model:value="invalidateReason" 
            placeholder="请输入作废原因（如：证书到期、人员离职、证书遗失、信息错误等）" 
            :maxlength="200" 
            :rows="3" 
            class="w-full"
          />
        </div>
      </div>
    </Modal>

    <!-- 批量核验弹窗 -->
    <Modal title="批量核验" v-model:open="batchVerifyModalVisible" width="800px" @ok="confirmBatchVerify">
      <div style="padding: 20px 0;">
        <div class="mb-6">
          <p class="mb-2">已选择 <strong>{{ batchVerifyCertificates.length }}</strong> 个证书进行批量核验：</p>
          <div class="max-h-60 overflow-y-auto border border-gray-200 rounded p-3">
            <div v-for="cert in batchVerifyCertificates" :key="cert.id" 
              class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <span class="font-medium">{{ cert.person_name }}</span>
                <span class="text-gray-500 ml-2">{{ cert.certificate_name }}</span>
                <span class="text-sm text-gray-400 ml-2">({{ cert.certificate_no }})</span>
              </div>
              <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass(cert.status)]">
                {{ getStatusText(cert.status) }}
              </span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">批量核验结果：</label>
          <RadioGroup v-model:value="batchVerifyResult" class="w-full">
            <Radio value="valid" class="block mb-2">
              <span class="text-green-600">✅ 全部有效</span>
            </Radio>
            <Radio value="invalid" class="block mb-2">
              <span class="text-red-600">❌ 全部无效</span>
            </Radio>
            <Radio value="need_check" class="block">
              <span class="text-orange-600">⚠️ 需要人工复核</span>
            </Radio>
          </RadioGroup>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">核验说明：</label>
          <Textarea 
            v-model:value="batchVerifyRemark" 
            placeholder="请输入批量核验说明" 
            :maxlength="500" 
            :rows="3" 
            class="w-full"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { Modal, message, Button, Upload, Textarea, Radio, RadioGroup } from 'ant-design-vue'
import { PlusOutlined, UploadOutlined, ExportOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import CertificateDetail from '@/components/certificate/certificateDetail.vue'
import CertificateForm from '@/components/certificate/certificateForm.vue'

// 表格列配置
const columns = [
  {
    title: '人员名称',
    dataIndex: 'person_name',
    key: 'person_name',
    width: 120,
  },
  {
    title: '证书名称',
    dataIndex: 'certificate_name',
    key: 'certificate_name',
    width: 150,
  },
  {
    title: '证书编号',
    dataIndex: 'certificate_no',
    key: 'certificate_no',
    width: 150,
  },
  {
    title: '证书类型',
    dataIndex: 'certificate_type',
    key: 'certificate_type',
    width: 120,
    formatter: (value: string) => {
      const typeMap = {
        'safety': '安全证书',
        'professional': '职业资格证书',
        'training': '培训证书',
        'education': '学历证书',
        'other': '其他'
      }
      return typeMap[value] || value
    }
  },
  {
    title: '发证机构',
    dataIndex: 'issuing_institution',
    key: 'issuing_institution',
    width: 150,
    ellipsis: true,
  },
  {
    title: '有效期',
    dataIndex: 'valid_period',
    key: 'valid_period',
    width: 180,
    formatter: (value,row: any) => {
console.log(value,row,'格式化有效期');
      return `${formatDate(row.valid_start)} 至 ${formatDate(row.valid_end)}`
    }
  },
  {
    title: '证书状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    type: 'tag',
    formatter: (value: string) => {
      const statusMap = {
        'valid': { text: '有效', color: 'green' },
        'expired': { text: '已过期', color: 'red' },
        'invalid': { text: '已作废', color: 'gray' },
        'verifying': { text: '核验中', color: 'orange' }
      }
      return `${statusMap[value]?.text}` || '--'
    }
  },
  {
    title: '证书附件',
    dataIndex: 'attachment_count',
    key: 'attachment_count',
    width: 100,
    type: 'file',
    formatter: (value: number) => {
      return value > 0 ? `${value}个` : '无'
    }
  },
  {
    title: '上次核验日期',
    dataIndex: 'last_verify_date',
    key: 'last_verify_date',
    width: 150,
    formatter: (value: string) => {
      if (!value) return '未核验'
      return dayjs(value).format('YYYY-MM-DD')
    }
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 200,
  fixed: 'right',
  actions: [
    {
      label: '查看',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label: '编辑',
      props: { type: 'link', size: 'small' },
      action: 'edit',
      visible: (record: any) => record.status !== 'invalid'
    },
    {
      label: '核验',
      props: { type: 'link', size: 'small' },
      action: 'verify',
      visible: (record: any) => record.status !== 'invalid'
    },
    {
      label: '作废',
      props: { type: 'link', size: 'small', danger: true },
      action: 'invalidate',
      visible: (record: any) => record.status === 'valid'
    }
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'person_name',
    label: '人员名称',
    type: 'input',
    placeholder: '请输入人员名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'certificate_name',
    label: '证书名称',
    type: 'input',
    placeholder: '请输入证书名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'certificate_no',
    label: '证书编号',
    type: 'input',
    placeholder: '请输入证书编号',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'certificate_type',
    label: '证书类型',
    type: 'select',
    placeholder: '请选择证书类型',
    props: {
      allowClear: true,
      options: [
        { label: '安全证书', value: 'safety' },
        { label: '职业资格证书', value: 'professional' },
        { label: '培训证书', value: 'training' },
        { label: '学历证书', value: 'education' },
        { label: '其他', value: 'other' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '证书状态',
    type: 'select',
    placeholder: '请选择状态',
    props: {
      allowClear: true,
      options: [
        { label: '有效', value: 'valid' },
        { label: '已过期', value: 'expired' },
        { label: '已作废', value: 'invalid' },
        { label: '核验中', value: 'verifying' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'valid_end_range',
    label: '有效期截止',
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
  const res: any = await getCertificateList({
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

  // 处理有效期范围
  if (params.valid_end_range && params.valid_end_range.length === 2) {
    formattedParams.valid_end_start = params.valid_end_range[0]
    formattedParams.valid_end_end = params.valid_end_range[1]
    delete formattedParams.valid_end_range
  }

  return formattedParams
}

// 弹窗状态
const detailModalVisible = ref(false)
const editModalVisible = ref(false)
const verifyModalVisible = ref(false)
const invalidateModalVisible = ref(false)
const batchVerifyModalVisible = ref(false)

// 数据状态
const selectedCertificate = ref({})
const selectedCertificateId = ref('')
const selectedCertificateName = ref('')
const currentFormData = ref({})
const isEditMode = ref(false)
const invalidateReason = ref('')
const verifyResult = ref('valid')
const verifyRemark = ref('')
const batchVerifyResult = ref('valid')
const batchVerifyRemark = ref('')
const batchVerifyCertificates = ref<any[]>([])
const certificateFormRef = ref()

// 文件上传相关
const verifyFileList = ref([])

// 选项数据
const personOptions = ref([])
const certificateTypeOptions = ref([])
const institutionOptions = ref([])

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedCertificateId.value = record.id
  selectedCertificateName.value = `${record.person_name} - ${record.certificate_name}`
  selectedCertificate.value = record

  switch (action) {
    case 'detail':
      showCertificateDetail(record)
      break
    case 'edit':
      editCertificate(record)
      break
    case 'verify':
      verifyCertificate(record)
      break
    case 'invalidate':
      invalidateCertificate(record)
      break
  }
}

// 显示证书详情
const showCertificateDetail = async (record: any) => {
  selectedCertificate.value = record
  detailModalVisible.value = true
}

// 编辑证书
const editCertificate = (record: any) => {
  isEditMode.value = true
  currentFormData.value = { ...record }
  editModalVisible.value = true
}

// 新增证书
const handleAddCertificate = () => {
  isEditMode.value = false
  currentFormData.value = {}
  editModalVisible.value = true
}

// 核验证书
const verifyCertificate = (record: any) => {
  verifyResult.value = 'valid'
  verifyRemark.value = ''
  verifyFileList.value = []
  verifyModalVisible.value = true
}

// 作废证书
const invalidateCertificate = (record: any) => {
  invalidateReason.value = ''
  invalidateModalVisible.value = true
}

// 批量导入
const handleBatchImport = () => {
  message.info('批量导入功能开发中...')
}

// 导出
const handleExport = () => {
  message.info('导出功能开发中...')
}

// 批量核验
const handleCheckAll = () => {
  // 这里应该获取当前页或选中的数据
  // 暂时使用提示
  message.info('请先选择需要核验的证书')
  // batchVerifyModalVisible.value = true
}

// 确认核验
const confirmVerify = async () => {
  if (!verifyResult.value) {
    message.warning('请选择核验结果')
    return
  }

  try {
    // 调用核验API
    // await verifyCertificateRecord(selectedCertificateId.value, {
    //   result: verifyResult.value,
    //   remark: verifyRemark.value,
    //   files: verifyFileList.value
    // })
    
    message.success('核验成功')
    verifyModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('核验失败')
  }
}

// 确认作废
const confirmInvalidate = async () => {
  if (!invalidateReason.value.trim()) {
    message.warning('请输入作废原因')
    return
  }

  try {
    // 调用作废API
    // await invalidateCertificateRecord(selectedCertificateId.value, {
    //   reason: invalidateReason.value
    // })
    
    message.success('证书已作废')
    invalidateModalVisible.value = false
    invalidateReason.value = ''
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('作废失败')
  }
}

// 确认批量核验
const confirmBatchVerify = async () => {
  if (batchVerifyCertificates.value.length === 0) {
    message.warning('请选择要核验的证书')
    return
  }

  try {
    // 调用批量核验API
    // await batchVerifyCertificates(batchVerifyCertificates.value, {
    //   result: batchVerifyResult.value,
    //   remark: batchVerifyRemark.value
    // })
    
    message.success(`批量核验完成，共处理 ${batchVerifyCertificates.value.length} 个证书`)
    batchVerifyModalVisible.value = false
    batchVerifyCertificates.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('批量核验失败')
  }
}

// 保存证书数据
const saveCertificateData = async (formData: any) => {
  try {
    if (isEditMode.value) {
      message.success('证书信息更新成功')
    } else {
      message.success('证书新增成功')
    }
    editModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error(isEditMode.value ? '更新失败' : '新增失败')
  }
}

// 保存证书
const saveCertificate = async () => {
  try {
    if (certificateFormRef.value?.handleSubmit) {
      await certificateFormRef.value.handleSubmit()
    }
  } catch (error) {
    message.error('提交失败，请重试')
  }
}

// 文件上传前验证
const beforeVerifyFileUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  const isPDF = file.type === 'application/pdf'
  if (!isImage && !isPDF) {
    message.error('只能上传图片或PDF文件')
    return false
  }
  
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('文件大小不能超过5MB')
    return false
  }
  
  return true
}

// 处理文件移除
const handleRemoveVerifyFile = () => {
  // 文件移除逻辑
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '--'
  return dayjs(date).format('YYYY-MM-DD')
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap = {
    'valid': '有效',
    'expired': '已过期',
    'invalid': '已作废',
    'verifying': '核验中'
  }
  return statusMap[status] || '--'
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classMap = {
    'valid': 'bg-green-100 text-green-800',
    'expired': 'bg-red-100 text-red-800',
    'invalid': 'bg-gray-100 text-gray-800',
    'verifying': 'bg-orange-100 text-orange-800'
  }
  return classMap[status] || classMap.valid
}

// 通用的操作处理
const handleAction = (type: string, record: any) => {
  switch (type) {
    case 'edit':
      editCertificate(record)
      break
    case 'verify':
      verifyCertificate(record)
      break
    case 'invalidate':
      invalidateCertificate(record)
      break
  }
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedCertificate.value = {}
}

// 加载初始化数据
onBeforeMount(async () => {
  try {
    // 加载人员数据
    const personRes = await getPersonList()
    personOptions.value = personRes.data.map((item: any) => ({
      label: `${item.name} (${item.employee_id})`,
      value: item.id
    }))

    // 加载证书类型数据
    const typeRes = await getCertificateTypeList()
    certificateTypeOptions.value = typeRes.data.map((item: any) => ({
      label: item.type_name,
      value: item.type_code
    }))

    // 加载发证机构数据
    const institutionRes = await getInstitutionList()
    institutionOptions.value = institutionRes.data.map((item: any) => ({
      label: item.institution_name,
      value: item.id
    }))

  } catch (error) {
    console.error('初始化数据加载失败:', error)
  }
})

// 模拟获取证书列表API
const getCertificateList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        person_name: '张三',
        certificate_name: '特种作业操作证',
        certificate_no: 'TZ20230001',
        certificate_type: 'safety',
        issuing_institution: '安全生产监督管理局',
        valid_start: '2023-01-01',
        valid_end: '2025-12-31',
        status: 'valid',
        attachment_count: 2,
        last_verify_date: '2023-10-15'
      },
      {
        id: '2',
        person_name: '李四',
        certificate_name: '注册安全工程师',
        certificate_no: 'CS20230002',
        certificate_type: 'professional',
        issuing_institution: '人力资源和社会保障部',
        valid_start: '2022-03-15',
        valid_end: '2025-03-15',
        status: 'valid',
        attachment_count: 1,
        last_verify_date: '2023-09-20'
      },
      {
        id: '3',
        person_name: '王五',
        certificate_name: '安全管理人员培训证书',
        certificate_no: 'PX20230003',
        certificate_type: 'training',
        issuing_institution: '安全生产培训中心',
        valid_start: '2022-06-01',
        valid_end: '2023-05-31',
        status: 'expired',
        attachment_count: 1,
        last_verify_date: '2023-05-15'
      },
      {
        id: '4',
        person_name: '赵六',
        certificate_name: '电工作业证书',
        certificate_no: 'DG20230004',
        certificate_type: 'safety',
        issuing_institution: '电力安全监管局',
        valid_start: '2023-02-01',
        valid_end: '2026-01-31',
        status: 'invalid',
        attachment_count: 0,
        last_verify_date: '2023-08-10'
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

// 模拟获取人员列表
const getPersonList = async () => {
  return {
    data: [
      { id: '1', name: '张三', employee_id: '2023001' },
      { id: '2', name: '李四', employee_id: '2023002' },
      { id: '3', name: '王五', employee_id: '2023003' },
      { id: '4', name: '赵六', employee_id: '2023004' },
      { id: '5', name: '钱七', employee_id: '2023005' }
    ]
  }
}

// 模拟获取证书类型列表
const getCertificateTypeList = async () => {
  return {
    data: [
      { type_code: 'safety', type_name: '安全证书' },
      { type_code: 'professional', type_name: '职业资格证书' },
      { type_code: 'training', type_name: '培训证书' },
      { type_code: 'education', type_name: '学历证书' },
      { type_code: 'skill', type_name: '技能等级证书' },
      { type_code: 'other', type_name: '其他证书' }
    ]
  }
}

// 模拟获取发证机构列表
const getInstitutionList = async () => {
  return {
    data: [
      { id: '1', institution_name: '安全生产监督管理局' },
      { id: '2', institution_name: '人力资源和社会保障部' },
      { id: '3', institution_name: '安全生产培训中心' },
      { id: '4', institution_name: '电力安全监管局' },
      { id: '5', institution_name: '特种设备检验院' },
      { id: '6', institution_name: '消防职业技能鉴定中心' }
    ]
  }
}
</script>

<style scoped>
.certificate-management-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>