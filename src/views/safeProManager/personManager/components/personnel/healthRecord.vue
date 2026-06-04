<template>
  <div class="health-record-container">
    <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <h2 class="text-lg font-medium text-gray-800">
        健康档案 - {{ personnelName }}
      </h2>
      <div class="flex items-center gap-3">
        <Button class="flex items-center" type="primary" @click="handleAddRecord">
          <template #icon>
            <PlusOutlined />
          </template>
          新增档案
        </Button>
        <Button class="flex items-center" @click="handleExport">
          <template #icon>
            <ExportOutlined />
          </template>
          导出
        </Button>
        <!-- <button @click="closeModal" 
          class="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
          title="关闭">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button> -->
      </div>
    </div>

    <!-- 档案列表 -->
    <div class="space-y-4">
      <div v-if="loading" class="text-center py-8">
        <LoadingOutlined style="font-size: 24px; color: #1890ff;" />
        <p class="mt-2 text-gray-500">加载中...</p>
      </div>

      <div v-else-if="healthRecords.length === 0" class="text-center py-8   ">
        <Empty description="暂无健康档案记录" />
        <Button type="primary" class="mt-4" @click="handleAddRecord">新增档案</Button>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="record in healthRecords" :key="record.id" 
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="font-medium text-gray-800">{{ record.type_name }}</h3>
                <p class="text-sm text-gray-500 mt-1">
                  <CalendarOutlined class="mr-1" />
                  {{ formatDate(record.check_date) }}
                </p>
              </div>
              <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass(record.status)]">
                {{ getStatusText(record.status) }}
              </span>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm">
                <span class="text-gray-600 min-w-[80px]">体检机构:</span>
                <span class="text-gray-800">{{ record.institution || '--' }}</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="text-gray-600 min-w-[80px]">有效期至:</span>
                <span class="text-gray-800">{{ formatDate(record.expire_date) }}</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="text-gray-600 min-w-[80px]">结论:</span>
                <span class="text-gray-800">{{ record.conclusion || '--' }}</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <div class="text-sm text-gray-500">
                <FileTextOutlined class="mr-1" />
                {{ record.files?.length || 0 }} 个文件
              </div>
              <div class="flex items-center gap-2">
                <Button type="link" size="small" @click="viewRecord(record)">查看</Button>
                <Button type="link" size="small" @click="editRecord(record)">编辑</Button>
                <Button type="link" size="small" danger @click="deleteRecord(record)">删除</Button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-6">
          <Pagination
            v-model:current="pagination.current"
            v-model:pageSize="pagination.pageSize"
            :total="pagination.total"
            show-size-changer
            show-quick-jumper
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- 档案详情/编辑弹窗 -->
    <Modal :title="recordModalTitle" v-model:open="recordModalVisible" width="800px" @ok="saveRecord">
      <RecordForm
        ref="recordFormRef"
        :form-data="currentRecordData"
        :is-edit="isRecordEditMode"
        :record-types="recordTypes"
        @save="saveRecordData"
      />
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal title="删除确认" v-model:open="deleteModalVisible" width="400px" @ok="confirmDelete">
      <div style="padding: 20px 0; text-align: center;">
        <p>确定要删除该健康档案吗？</p>
        <p class="text-gray-500 mt-1">删除后无法恢复</p>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Modal, Button, Pagination, Empty, message } from 'ant-design-vue'
import { 
  PlusOutlined, 
  ExportOutlined, 
  CalendarOutlined, 
  FileTextOutlined, 
  LoadingOutlined 
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import RecordForm from './recodForm.vue'

const props = defineProps({
  personnelId: {
    type: String,
    required: true
  },
  personnelName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

// 数据状态
const loading = ref(false)
const healthRecords = ref([])
const recordTypes = ref([
  { value: 'general', label: '常规体检' },
  { value: 'occupational', label: '职业健康检查' },
  { value: 'pre_employment', label: '入职体检' },
  { value: 'periodic', label: '定期体检' }
])

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 8,
  total: 0
})

// 弹窗状态
const recordModalVisible = ref(false)
const deleteModalVisible = ref(false)
const isRecordEditMode = ref(false)
const recordModalTitle = ref('')
const currentRecordData = ref({})
const currentRecordId = ref('')
const recordFormRef = ref()

// 格式化日期
const formatDate = (date) => {
  if (!date) return '--'
  return dayjs(date).format('YYYY-MM-DD')
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'valid': '有效',
    'expired': '已过期',
    'warning': '即将过期'
  }
  return statusMap[status] || '未知'
}

// 获取状态样式类
const getStatusClass = (status) => {
  const classMap = {
    'valid': 'bg-green-100 text-green-800',
    'expired': 'bg-red-100 text-red-800',
    'warning': 'bg-orange-100 text-orange-800'
  }
  return classMap[status] || classMap.valid
}

// 加载健康档案数据
const loadHealthRecords = async () => {
  loading.value = true
  try {
    // 这里调用实际的API
    // const res = await getHealthRecords({
    //   personnel_id: props.personnelId,
    //   page: pagination.value.current,
    //   page_size: pagination.value.pageSize
    // })
    
    // 模拟数据
    const mockData = {
      list: [
        {
          id: '1',
          type: 'pre_employment',
          type_name: '入职体检',
          check_date: '2023-01-15',
          institution: '市人民医院',
          expire_date: '2024-01-15',
          conclusion: '身体健康，适合岗位',
          status: 'valid',
          files: [{ name: '体检报告.pdf' }, { name: '化验单.jpg' }]
        },
        {
          id: '2',
          type: 'periodic',
          type_name: '年度体检',
          check_date: '2023-06-20',
          institution: '健康体检中心',
          expire_date: '2024-06-20',
          conclusion: '各项指标正常',
          status: 'valid',
          files: [{ name: '体检报告.pdf' }]
        },
        {
          id: '3',
          type: 'occupational',
          type_name: '职业健康检查',
          check_date: '2022-12-10',
          institution: '职业病防治院',
          expire_date: '2023-12-10',
          conclusion: '无职业病风险',
          status: 'expired',
          files: [{ name: '职业健康报告.pdf' }]
        }
      ],
      pagination: {
        total: 3,
        page: 1,
        page_size: 8
      }
    }
    
    healthRecords.value = mockData.list
    pagination.value.total = mockData.pagination.total
    
  } catch (error) {
    console.error('加载健康档案失败:', error)
    message.error('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 页面变化处理
const handlePageChange = (page, pageSize) => {
  pagination.value.current = page
  pagination.value.pageSize = pageSize
  loadHealthRecords()
}

// 查看档案详情
const viewRecord = (record) => {
  isRecordEditMode.value = false
  recordModalTitle.value = '健康档案详情'
  currentRecordData.value = { ...record }
  recordModalVisible.value = true
}

// 新增档案
const handleAddRecord = () => {
  isRecordEditMode.value = false
  recordModalTitle.value = '新增健康档案'
  currentRecordData.value = {
    personnel_id: props.personnelId,
    type: 'general',
    check_date: dayjs().format('YYYY-MM-DD')
  }
  recordModalVisible.value = true
}

// 编辑档案
const editRecord = (record) => {
  isRecordEditMode.value = true
  recordModalTitle.value = '编辑健康档案'
  currentRecordData.value = { ...record }
  recordModalVisible.value = true
}

// 删除档案
const deleteRecord = (record) => {
  currentRecordId.value = record.id
  deleteModalVisible.value = true
}

// 确认删除
const confirmDelete = async () => {
  try {
    // 调用删除API
    // await deleteHealthRecord(currentRecordId.value)
    message.success('删除成功')
    deleteModalVisible.value = false
    loadHealthRecords()
  } catch (error) {
    message.error('删除失败')
    console.error(error)
  }
}

// 保存档案数据
const saveRecordData = async (formData) => {
  try {
    if (isRecordEditMode.value) {
      // 调用编辑API
      // await updateHealthRecord(formData)
      message.success('档案更新成功')
    } else {
      // 调用新增API
      // await addHealthRecord(formData)
      message.success('档案新增成功')
    }
    recordModalVisible.value = false
    loadHealthRecords()
  } catch (error) {
    message.error(isRecordEditMode.value ? '更新失败' : '新增失败')
    console.error(error)
  }
}

// 保存档案（表单提交）
const saveRecord = async () => {
  try {
    if (recordFormRef.value && recordFormRef.value.handleSubmit) {
      await recordFormRef.value.handleSubmit()
    }
  } catch (error) {
    console.error('提交失败:', error)
    message.error('提交失败，请重试')
  }
}

// 导出数据
const handleExport = async () => {
  try {
    message.info('导出功能开发中...')
    // 这里实现导出逻辑
  } catch (error) {
    message.error('导出失败')
    console.error(error)
  }
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}

// 组件挂载时加载数据
onMounted(() => {
  loadHealthRecords()
})
</script>

<style scoped>
.health-record-container {
  height: 600px;
  overflow-y: auto;
  padding: 0 4px;
}

.health-record-container::-webkit-scrollbar {
  width: 6px;
}

.health-record-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.health-record-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.health-record-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>