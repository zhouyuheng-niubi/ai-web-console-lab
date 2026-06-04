<template>
  <div class="behavior-monitor-container">
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
        <Button type="primary" @click="handleManualCreate">
          <PlusOutlined />
          手动创建
        </Button>
        <Button @click="handleBatchProcess" style="margin-left: 10px;">
          <SettingOutlined />
          批量处理
        </Button>
        <Dropdown>
          <template #overlay>
            <Menu @click="handleMenuClick">
              <Menu.Item key="export_violations">
                <ExportOutlined />
                导出违规记录
              </Menu.Item>
              <Menu.Item key="export_statistics">
                <BarChartOutlined />
                导出统计报表
              </Menu.Item>
              <Menu.Item key="generate_report">
                <FileTextOutlined />
                生成分析报告
              </Menu.Item>
            </Menu>
          </template>
          <Button style="margin-left: 10px;">
            <MoreOutlined />
            更多
            <DownOutlined />
          </Button>
        </Dropdown>
      </template>
    </SmartTable>

    <!-- 监控详情弹窗 -->
    <Modal title="行为监控详情" v-model:open="detailModalVisible" width="1000px" :footer="null">
      <MonitorDetail 
        :monitor-data="selectedMonitor"
        @assignHandle="(val) => handleAction('assignHandle', val)"
        @updateResult="(val) => handleAction('updateResult', val)"
        @closeCase="(val) => handleAction('closeCase', val)"
        @close="closeDetailModal"
      />            
    </Modal>

    <!-- 手动创建弹窗 -->
    <Modal title="手动创建监控记录" v-model:open="createModalVisible" width="800px" @ok="saveManualCreate">
      <ManualCreateForm
        ref="manualFormRef"
        :form-data="currentFormData"
        :personnel-options="personnelOptions"
        :region-options="regionOptions"
        :violation-type-options="violationTypeOptions"
        @save="saveMonitorData"
      />
    </Modal>

    <!-- 分配处理弹窗 -->
    <Modal title="分配处理" v-model:open="assignModalVisible" width="600px" @ok="confirmAssignHandle">
      <div style="padding: 20px 0;">
        <p class="mb-4">为监控记录 <strong>{{ selectedMonitorName }}</strong> 分配处理人员：</p>
        
        <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-gray-600">被监控人员：</span>
              <span class="font-medium">{{ selectedMonitor.person_name }}</span>
            </div>
            <div>
              <span class="text-gray-600">违规行为：</span>
              <span class="font-medium">{{ getViolationTypeText(selectedMonitor.violation_type) }}</span>
            </div>
            <div>
              <span class="text-gray-600">监控地点：</span>
              <span class="font-medium">{{ selectedMonitor.location }}</span>
            </div>
            <div>
              <span class="text-gray-600">监控时间：</span>
              <span class="font-medium">{{ formatDateTime(selectedMonitor.monitor_time) }}</span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">处理人员：</label>
          <Select
            v-model:value="handlePersonId"
            placeholder="请选择处理人员"
            style="width: 100%"
            :options="handlePersonnelOptions"
            show-search
            :filter-option="filterPersonnelOption"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">处理优先级：</label>
          <RadioGroup v-model:value="handlePriority" class="w-full">
            <Radio value="high" class="block mb-2">
              <span class="text-red-600">🔴 高优先级（立即处理）</span>
            </Radio>
            <Radio value="medium" class="block mb-2">
              <span class="text-orange-600">🟡 中优先级（24小时内处理）</span>
            </Radio>
            <Radio value="low" class="block">
              <span class="text-green-600">🟢 低优先级（3天内处理）</span>
            </Radio>
          </RadioGroup>
        </div>

        <div>
          <label class="block mb-2 font-medium">处理说明：</label>
          <Textarea 
            v-model:value="handleRemark" 
            placeholder="请输入处理说明和要求" 
            :maxlength="200" 
            :rows="3" 
            class="w-full"
          />
        </div>
      </div>
    </Modal>

    <!-- 更新处理结果弹窗 -->
    <Modal title="更新处理结果" v-model:open="updateResultModalVisible" width="700px" @ok="confirmUpdateResult">
      <div class="h-[600px] overflow-y-auto" style="padding: 20px 0;">
        <p class="mb-4">更新 <strong>{{ selectedMonitorName }}</strong> 的处理结果：</p>
        
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-gray-600">被监控人员：</span>
              <span class="font-medium">{{ selectedMonitor.person_name }}</span>
            </div>
            <div>
              <span class="text-gray-600">当前状态：</span>
              <span class="font-medium">{{ getResultText(selectedMonitor.handle_result) }}</span>
            </div>
            <div>
              <span class="text-gray-600">处理人员：</span>
              <span class="font-medium">{{ selectedMonitor.handle_person_name || '未分配' }}</span>
            </div>
            <div>
              <span class="text-gray-600">监控时间：</span>
              <span class="font-medium">{{ formatDateTime(selectedMonitor.monitor_time) }}</span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">处理结果：</label>
          <Select
            v-model:value="handleResult"
            placeholder="请选择处理结果"
            style="width: 100%"
            :options="[
              { label: '处理中', value: 'processing' },
              { label: '已整改', value: 'rectified' },
              { label: '已结案', value: 'closed' }
            ]"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">处理措施：</label>
          <Textarea 
            v-model:value="handleMeasures" 
            placeholder="请输入具体的处理措施（如：警告、罚款、培训、停工等）" 
            :maxlength="500" 
            :rows="4" 
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">处理情况说明：</label>
          <Textarea 
            v-model:value="handleSituation" 
            placeholder="请输入处理情况说明，包括与违规人员的沟通情况、整改情况等" 
            :maxlength="500" 
            :rows="4" 
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">证明材料：</label>
          <Upload
            v-model:file-list="handleFiles"
            list-type="picture-card"
            :max-count="5"
            :before-upload="beforeFileUpload"
          >
            <div>
              <PlusOutlined />
              <div style="margin-top: 8px">上传证明</div>
            </div>
          </Upload>
          <div class="mt-2 text-sm text-gray-500">
            可上传整改照片、培训记录、处罚凭证等证明文件
          </div>
        </div>
      </div>
    </Modal>

    <!-- 结案确认弹窗 -->
    <Modal title="结案确认" v-model:open="closeCaseModalVisible" width="600px" @ok="confirmCloseCase">
      <div style="padding: 20px 0;">
        <p class="mb-4">确认 <strong>{{ selectedMonitorName }}</strong> 结案？</p>
        
        <div class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div class="flex items-center gap-3 mb-2">
            <CheckCircleOutlined class="text-green-600 text-lg" />
            <span class="font-medium text-green-700">结案检查清单</span>
          </div>
          <ul class="list-disc pl-5 space-y-1 text-green-600">
            <li>确认违规行为已处理</li>
            <li>确认整改措施已落实</li>
            <li>确认相关人员已接受教育</li>
            <li>确认证明材料齐全</li>
            <li>确认无遗留问题</li>
          </ul>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">结案说明：</label>
          <Textarea 
            v-model:value="closeRemark" 
            placeholder="请输入结案说明，包括处理经过、整改效果等" 
            :maxlength="300" 
            :rows="4" 
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">结案附件：</label>
          <Upload
            v-model:file-list="closeFiles"
            list-type="picture-card"
            :max-count="3"
            :before-upload="beforeFileUpload"
          >
            <div>
              <PlusOutlined />
              <div style="margin-top: 8px">上传附件</div>
            </div>
          </Upload>
          <div class="mt-2 text-sm text-gray-500">
            可上传结案报告、验收记录等文件
          </div>
        </div>
      </div>
    </Modal>

    <!-- 批量处理弹窗 -->
    <Modal title="批量处理监控记录" v-model:open="batchProcessModalVisible" width="800px" @ok="confirmBatchProcess">
      <div style="padding: 20px 0;">
        <div class="mb-6">
          <p class="mb-2">已选择 <strong>{{ batchProcessRecords.length }}</strong> 条监控记录进行批量处理：</p>
          <div class="max-h-60 overflow-y-auto border border-gray-200 rounded p-3">
            <div v-for="record in batchProcessRecords" :key="record.id" 
              class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <span class="font-medium">{{ record.person_name }}</span>
                <span class="text-gray-500 ml-2">{{ getViolationTypeText(record.violation_type) }}</span>
                <span class="text-sm text-gray-400 ml-2">({{ formatDateTime(record.monitor_time) }})</span>
              </div>
              <span :class="['px-2 py-1 rounded text-xs font-medium', getResultClass(record.handle_result)]">
                {{ getResultText(record.handle_result) }}
              </span>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">批量处理方式：</label>
          <RadioGroup v-model:value="batchProcessMethod" class="w-full">
            <Radio value="same_handle" class="block mb-2">
              分配同一处理人员
            </Radio>
            <Radio value="batch_assign" class="block mb-2">
              批量分配处理
            </Radio>
            <Radio value="batch_update" class="block">
              批量更新处理结果
            </Radio>
          </RadioGroup>
        </div>

        <div v-if="batchProcessMethod === 'same_handle'" class="mb-4">
          <label class="block mb-2 font-medium">处理人员：</label>
          <Select
            v-model:value="batchHandlePersonId"
            placeholder="请选择处理人员"
            style="width: 100%"
            :options="handlePersonnelOptions"
            show-search
          />
        </div>

        <div v-if="batchProcessMethod === 'batch_update'" class="mb-4">
          <label class="block mb-2 font-medium">处理结果：</label>
          <Select
            v-model:value="batchHandleResult"
            placeholder="请选择处理结果"
            style="width: 100%"
            :options="[
              { label: '处理中', value: 'processing' },
              { label: '已整改', value: 'rectified' },
              { label: '已结案', value: 'closed' }
            ]"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">处理说明：</label>
          <Textarea 
            v-model:value="batchProcessRemark" 
            placeholder="请输入批量处理说明" 
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
import { 
  Modal, 
  message, 
  Button, 
  Upload, 
  Textarea, 
  Dropdown, 
  Menu, 
  Radio,
  RadioGroup,
  Select
} from 'ant-design-vue'
import { 
  PlusOutlined, 
  SettingOutlined,
  ExportOutlined, 
  BarChartOutlined,
  FileTextOutlined,
  MoreOutlined,
  DownOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import MonitorDetail from './components/behavior/monitorDetail.vue'
import ManualCreateForm from './components/behavior/manualCreateForm.vue'
const typeMap = {
        'no_helmet': '未戴安全帽',
        'no_work_clothes': '未穿工作服',
        'no_safety_shoes': '未穿安全鞋',
        'wrong_operation': '违规操作',
        'no_protection': '未使用防护用品',
        'alcohol': '酒后上岗',
        'fatigue': '疲劳作业',
        'other': '其他违规'
      }
// 表格列配置
const columns = [
  {
    title: '任务名称',
    dataIndex: 'task_name',
    key: 'task_name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '监控时间',
    dataIndex: 'monitor_time',
    key: 'monitor_time',
    width: 160,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '监控区域',
    dataIndex: 'region_name',
    key: 'region_name',
    width: 120,
  },
  {
    title: '监控地点',
    dataIndex: 'location',
    key: 'location',
    width: 150,
    ellipsis: true,
  },
  {
    title: '被监控人员',
    dataIndex: 'person_name',
    key: 'person_name',
    width: 120,
  },
  {
    title: '分析结果',
    dataIndex: 'violation_type',
    key: 'violation_type',
    width: 150,
    formatter: (value: string) => {
    
      return typeMap[value] || value
    }
  },
  {
    title: '违规行为描述',
    dataIndex: 'violation_desc',
    key: 'violation_desc',
    width: 200,
    ellipsis: true,
  },
  {
    title: '处理人员',
    dataIndex: 'handle_person_name',
    key: 'handle_person_name',
    width: 120,
    formatter: (value: string) => value || '未分配'
  },
  {
    title: '处理结果',
    dataIndex: 'handle_result',
    key: 'handle_result',
    width: 120,
    formatter: (value: string) => {
      const resultMap = {
        'unprocessed': { text: '未处理', color: 'red' },
        'processing': { text: '处理中', color: 'orange' },
        'rectified': { text: '已整改', color: 'blue' },
        'closed': { text: '已结案', color: 'green' }
      }
      return resultMap[value]?.text || '--'
    }
  },
  {
    title: '整改复查记录',
    dataIndex: 'recheck_count',
    key: 'recheck_count',
    width: 120,
    formatter: (value: number) => value > 0 ? `${value}次` : '无'
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 300,
  fixed: 'right',
  actions: [
    {
      label: '查看详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label: '分配处理',
      props: { type: 'link', size: 'small' },
      action: 'assignHandle',
      visible: (record: any) => record.handle_result === 'unprocessed'
    },
    {
      label: '更新结果',
      props: { type: 'link', size: 'small' },
      action: 'updateResult',
      visible: (record: any) => ['unprocessed', 'processing'].includes(record.handle_result)
    },
    {
      label: '结案',
      props: { type: 'link', size: 'small' },
      action: 'closeCase',
      visible: (record: any) => ['processing', 'rectified'].includes(record.handle_result)
    }
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'task_name',
    label: '任务名称',
    type: 'input',
    placeholder: '请输入任务名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'person_name',
    label: '被监控人员',
    type: 'input',
    placeholder: '请输入人员姓名',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'violation_type',
    label: '违规类型',
    type: 'select',
    placeholder: '请选择违规类型',
    props: {
      allowClear: true,
      options: [
        { label: '未戴安全帽', value: 'no_helmet' },
        { label: '未穿工作服', value: 'no_work_clothes' },
        { label: '未穿安全鞋', value: 'no_safety_shoes' },
        { label: '违规操作', value: 'wrong_operation' },
        { label: '未使用防护用品', value: 'no_protection' },
        { label: '酒后上岗', value: 'alcohol' },
        { label: '疲劳作业', value: 'fatigue' },
        { label: '其他违规', value: 'other' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'region_id',
    label: '监控区域',
    type: 'select',
    placeholder: '请选择监控区域',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
    },
    colSpan: 6
  },
  {
    field: 'handle_result',
    label: '处理结果',
    type: 'select',
    placeholder: '请选择处理结果',
    props: {
      allowClear: true,
      options: [
        { label: '未处理', value: 'unprocessed' },
        { label: '处理中', value: 'processing' },
        { label: '已整改', value: 'rectified' },
        { label: '已结案', value: 'closed' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'handle_person_id',
    label: '处理人员',
    type: 'select',
    placeholder: '请选择处理人员',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
    },
    colSpan: 6
  },
  {
    field: 'monitor_time_range',
    label: '监控时间',
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
  const { pageNum, pageSize, ...rest } = params
  const res: any = await getMonitorList({
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

  // 处理监控时间范围
  if (params.monitor_time_range && params.monitor_time_range.length === 2) {
    formattedParams.monitor_start_time = params.monitor_time_range[0]
    formattedParams.monitor_end_time = params.monitor_time_range[1]
    delete formattedParams.monitor_time_range
  }

  return formattedParams
}

// 弹窗状态
const detailModalVisible = ref(false)
const createModalVisible = ref(false)
const assignModalVisible = ref(false)
const updateResultModalVisible = ref(false)
const closeCaseModalVisible = ref(false)
const batchProcessModalVisible = ref(false)

// 数据状态
const selectedMonitor = ref({})
const selectedMonitorId = ref('')
const selectedMonitorName = ref('')
const currentFormData = ref({})
const manualFormRef = ref()

// 分配处理相关
const handlePersonId = ref('')
const handlePriority = ref('medium')
const handleRemark = ref('')

// 更新处理结果相关
const handleResult = ref('processing')
const handleMeasures = ref('')
const handleSituation = ref('')

// 结案相关
const closeRemark = ref('')

// 批量处理相关
const batchProcessMethod = ref('same_handle')
const batchHandlePersonId = ref('')
const batchHandleResult = ref('processing')
const batchProcessRemark = ref('')
const batchProcessRecords = ref<any[]>([])

// 文件上传相关
const handleFiles = ref([])
const closeFiles = ref([])

// 选项数据
const personnelOptions = ref([])
const regionOptions = ref([])
const violationTypeOptions = ref([])
const handlePersonnelOptions = ref([])

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedMonitorId.value = record.id
  selectedMonitorName.value = `${record.person_name} - ${typeMap[record.violation_type] }`
  selectedMonitor.value = record

  switch (action) {
    case 'detail':
      showMonitorDetail(record)
      break
    case 'assignHandle':
      assignHandle(record)
      break
    case 'updateResult':
      updateResult(record)
      break
    case 'closeCase':
      closeCase(record)
      break
  }
}

// 显示监控详情
const showMonitorDetail = async (record: any) => {
  selectedMonitor.value = record
  detailModalVisible.value = true
}

// 手动创建
const handleManualCreate = () => {
  currentFormData.value = {}
  createModalVisible.value = true
}

// 分配处理
const assignHandle = (record: any) => {
  if (record.handle_result !== 'unprocessed') {
    message.warning('只有未处理的记录可以分配')
    return
  }
  
  handlePersonId.value = ''
  handlePriority.value = 'medium'
  handleRemark.value = ''
  assignModalVisible.value = true
}

// 更新处理结果
const updateResult = (record: any) => {
  if (!['unprocessed', 'processing'].includes(record.handle_result)) {
    message.warning('该记录状态无法更新处理结果')
    return
  }
  
  handleResult.value = record.handle_result === 'unprocessed' ? 'processing' : record.handle_result
  handleMeasures.value = ''
  handleSituation.value = ''
  handleFiles.value = []
  updateResultModalVisible.value = true
}

// 结案
const closeCase = (record: any) => {
  if (!['processing', 'rectified'].includes(record.handle_result)) {
    message.warning('只有处理中或已整改的记录可以结案')
    return
  }
  
  closeRemark.value = ''
  closeFiles.value = []
  closeCaseModalVisible.value = true
}

// 批量处理
const handleBatchProcess = () => {
  // 这里应该获取选中的记录
  // 暂时使用提示
  message.info('请先选择需要处理的监控记录')
  // batchProcessModalVisible.value = true
}

// 导出菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  switch (key) {
    case 'export_violations':
      handleExportViolations()
      break
    case 'export_statistics':
      handleExportStatistics()
      break
    case 'generate_report':
      handleGenerateReport()
      break
  }
}

// 确认分配处理
const confirmAssignHandle = async () => {
  if (!handlePersonId.value) {
    message.warning('请选择处理人员')
    return
  }

  try {
    // 调用分配处理API
    // await assignHandlePerson(selectedMonitorId.value, {
    //   handle_person_id: handlePersonId.value,
    //   priority: handlePriority.value,
    //   remark: handleRemark.value
    // })
    
    message.success('分配处理成功')
    assignModalVisible.value = false
    handlePersonId.value = ''
    handleRemark.value = ''
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('分配处理失败')
  }
}

// 确认更新处理结果
const confirmUpdateResult = async () => {
  if (!handleMeasures.value.trim()) {
    message.warning('请输入处理措施')
    return
  }

  try {
    // 调用更新处理结果API
    // await updateHandleResult(selectedMonitorId.value, {
    //   handle_result: handleResult.value,
    //   handle_measures: handleMeasures.value,
    //   handle_situation: handleSituation.value,
    //   files: handleFiles.value
    // })
    
    message.success('处理结果更新成功')
    updateResultModalVisible.value = false
    handleMeasures.value = ''
    handleSituation.value = ''
    handleFiles.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('处理结果更新失败')
  }
}

// 确认结案
const confirmCloseCase = async () => {
  if (!closeRemark.value.trim()) {
    message.warning('请输入结案说明')
    return
  }

  try {
    // 调用结案API
    // await closeMonitorCase(selectedMonitorId.value, {
    //   remark: closeRemark.value,
    //   files: closeFiles.value
    // })
    
    message.success('已结案')
    closeCaseModalVisible.value = false
    closeRemark.value = ''
    closeFiles.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('结案失败')
  }
}

// 确认批量处理
const confirmBatchProcess = async () => {
  if (batchProcessRecords.value.length === 0) {
    message.warning('请选择要处理的记录')
    return
  }

  try {
    // 调用批量处理API
    message.success(`批量处理完成，共处理 ${batchProcessRecords.value.length} 条记录`)
    batchProcessModalVisible.value = false
    batchProcessRecords.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('批量处理失败')
  }
}

// 保存监控数据
const saveMonitorData = async (formData: any) => {
  try {
    message.success('监控记录创建成功')
    createModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('创建失败')
  }
}

// 保存手动创建
const saveManualCreate = async () => {
  try {
    if (manualFormRef.value?.handleSubmit) {
      await manualFormRef.value.handleSubmit()
    }
  } catch (error) {
    message.error('提交失败，请重试')
  }
}

// 文件上传前验证
const beforeFileUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  const isPDF = file.type === 'application/pdf'
  const isVideo = file.type.startsWith('video/')
  
  if (!isImage && !isPDF && !isVideo) {
    message.error('只能上传图片、PDF或视频文件')
    return false
  }
  
  const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 视频100MB，其他10MB
  if (file.size > maxSize) {
    message.error(`文件大小不能超过${isVideo ? '100MB' : '10MB'}`)
    return false
  }
  
  return true
}

// 格式化日期时间
const formatDateTime = (datetime: string) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
}

// 获取违规类型文本
const getViolationTypeText = (type: string) => {
  const typeMap = {
    'no_helmet': '未戴安全帽',
    'no_work_clothes': '未穿工作服',
    'no_safety_shoes': '未穿安全鞋',
    'wrong_operation': '违规操作',
    'no_protection': '未使用防护用品',
    'alcohol': '酒后上岗',
    'fatigue': '疲劳作业',
    'other': '其他违规'
  }
  return typeMap[type] || type
}

// 获取处理结果文本
const getResultText = (result: string) => {
  const resultMap = {
    'unprocessed': '未处理',
    'processing': '处理中',
    'rectified': '已整改',
    'closed': '已结案'
  }
  return resultMap[result] || '--'
}

// 获取处理结果样式类
const getResultClass = (result: string) => {
  const classMap = {
    'unprocessed': 'bg-red-100 text-red-800',
    'processing': 'bg-orange-100 text-orange-800',
    'rectified': 'bg-blue-100 text-blue-800',
    'closed': 'bg-green-100 text-green-800'
  }
  return classMap[result] || classMap.unprocessed
}

// 人员筛选函数
const filterPersonnelOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 导出违规记录
const handleExportViolations = () => {
  message.info('导出违规记录功能开发中...')
}

// 导出统计报表
const handleExportStatistics = () => {
  message.info('导出统计报表功能开发中...')
}

// 生成分析报告
const handleGenerateReport = () => {
  message.info('生成分析报告功能开发中...')
}

// 通用的操作处理
const handleAction = (type: string, record: any) => {
  switch (type) {
    case 'assignHandle':
      assignHandle(record)
      break
    case 'updateResult':
      updateResult(record)
      break
    case 'closeCase':
      closeCase(record)
      break
  }
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedMonitor.value = {}
}

// 加载初始化数据
onBeforeMount(async () => {
  try {
    // 加载区域数据
    const regionRes = await getRegionList()
    regionOptions.value = regionRes.data.map((item: any) => ({
      label: item.region_name,
      value: item.id
    }))
    searchConfig.value[3].props.options = regionOptions.value

    // 加载人员数据
    const personnelRes = await getPersonnelList()
    personnelOptions.value = personnelRes.data.map((item: any) => ({
      label: item.name,
      value: item.id
    }))

    // 加载处理人员数据
    const handlePersonnelRes = await getHandlePersonnelList()
    handlePersonnelOptions.value = handlePersonnelRes.data.map((item: any) => ({
      label: item.name,
      value: item.id
    }))
    searchConfig.value[5].props.options = handlePersonnelOptions.value

  } catch (error) {
    console.error('初始化数据加载失败:', error)
  }
})

// 模拟获取监控列表API
const getMonitorList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        task_name: '车间安全检查',
        monitor_time: '2023-11-05 10:30:25',
        region_name: '生产车间',
        location: 'A车间焊接区',
        person_name: '张三',
        violation_type: 'no_helmet',
        violation_desc: '进行焊接作业时未佩戴安全帽',
        handle_person_name: '李四',
        handle_result: 'processing',
        recheck_count: 1
      },
      {
        id: '2',
        task_name: '高空作业监控',
        monitor_time: '2023-11-05 14:15:40',
        region_name: '建筑工地',
        location: '3号楼15层外墙',
        person_name: '王五',
        violation_type: 'no_safety_shoes',
        violation_desc: '高处作业未穿安全鞋，未系安全带',
        handle_person_name: null,
        handle_result: 'unprocessed',
        recheck_count: 0
      },
      {
        id: '3',
        task_name: '设备操作监控',
        monitor_time: '2023-11-04 09:20:15',
        region_name: '机械加工区',
        location: '2号冲床操作位',
        person_name: '赵六',
        violation_type: 'wrong_operation',
        violation_desc: '未按操作规程进行设备操作',
        handle_person_name: '钱七',
        handle_result: 'rectified',
        recheck_count: 2
      },
      {
        id: '4',
        task_name: '危化品作业监控',
        monitor_time: '2023-11-03 16:45:30',
        region_name: '化工车间',
        location: '危化品仓库装卸区',
        person_name: '孙八',
        violation_type: 'no_protection',
        violation_desc: '接触化学品未佩戴防护手套和口罩',
        handle_person_name: 'Maintainer九',
        handle_result: 'closed',
        recheck_count: 3
      },
      {
        id: '5',
        task_name: '夜间施工监控',
        monitor_time: '2023-11-05 22:10:20',
        region_name: '建筑工地',
        location: '夜间施工区域',
        person_name: '吴十',
        violation_type: 'fatigue',
        violation_desc: '连续作业12小时，疲劳作业',
        handle_person_name: '郑十一',
        handle_result: 'processing',
        recheck_count: 1
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

// 模拟获取区域列表
const getRegionList = async () => {
  return {
    data: [
      { id: '1', region_name: '生产车间' },
      { id: '2', region_name: '建筑工地' },
      { id: '3', region_name: '机械加工区' },
      { id: '4', region_name: '化工车间' },
      { id: '5', region_name: '仓库区域' },
      { id: '6', region_name: '办公区域' }
    ]
  }
}

// 模拟获取人员列表
const getPersonnelList = async () => {
  return {
    data: [
      { id: '1', name: '张三' },
      { id: '2', name: '李四' },
      { id: '3', name: '王五' },
      { id: '4', name: '赵六' },
      { id: '5', name: '钱七' },
      { id: '6', name: '孙八' }
    ]
  }
}

// 模拟获取处理人员列表
const getHandlePersonnelList = async () => {
  return {
    data: [
      { id: '1', name: '李四', role: '安全员' },
      { id: '2', name: '钱七', role: '安全主管' },
      { id: '3', name: 'Maintainer九', role: '安全经理' },
      { id: '4', name: '郑十一', role: '生产主管' }
    ]
  }
}
</script>

<style scoped>
.behavior-monitor-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>