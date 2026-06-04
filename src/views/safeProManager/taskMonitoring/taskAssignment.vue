<template>
        <!-- 页面标题和操作栏 -->
         <div class="flex flex-col pt-[30px] pb-[30px] px-[30px]">
    <div class="mb-[30px] flex  items-center flex-shrink-0">
        <Button class="flex  items-center" type="primary" @click="handleCreateTask">
          <PlusOutlined />
          新建任务
        </Button>
        <!-- <Button class="flex  items-center" @click="handleBatchCreate" style="margin-left: 10px;">
          <FileAddOutlined />
          批量创建
        </Button> -->
        <!-- <Dropdown class="flex  items-center">
          <template #overlay>
            <Menu @click="handleMenuClick">
              <Menu.Item key="export_current">
                <ExportOutlined />
                导出当前页
              </Menu.Item>
              <Menu.Item key="export_all">
                <DownloadOutlined />
                导出全部
              </Menu.Item>
              <Menu.Item key="task_report">
                <FileTextOutlined />
                任务报告
              </Menu.Item>
            </Menu>
          </template>
          <Button style="margin-left: 10px;">
            <MoreOutlined />
            更多
            <DownOutlined />
          </Button>
        </Dropdown> -->
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
    </SmartTable>

    <!-- 任务详情弹窗 -->
    <Modal title="任务详情" v-model:open="detailModalVisible" width="1000px" :footer="null">
      <TaskDetail 
        :task-data="selectedTask"
        @edit="(val) => handleAction('edit', val)"
        @assignPersonnel="(val) => handleAction('assignPersonnel', val)"
        @updateProgress="(val) => handleAction('updateProgress', val)"
        @pauseTask="(val) => handleAction('pauseTask', val)"
        @cancelTask="(val) => handleAction('cancelTask', val)"
        @completeTask="(val) => handleAction('completeTask', val)"
        @close="closeDetailModal"
      />            
    </Modal>

    <!-- 新建/编辑任务弹窗 -->
    <Modal :title="isEditMode ? '编辑任务' : '新建任务'" v-model:open="editModalVisible" width="900px" @ok="saveTask">
      <TaskForm
        ref="taskFormRef"
        :form-data="currentFormData"
        :is-edit="isEditMode"
        :meeting-options="meetingOptions"
        :task-type-options="taskTypeOptions"
        :team-options="teamOptions"
        :personnel-options="personnelOptions"
        :equipment-options="equipmentOptions"
        :material-options="materialOptions"
        @save="saveTaskData"
      />
    </Modal>

    <!-- 分配人员弹窗 -->
    <Modal title="分配人员" v-model:open="assignModalVisible" width="800px" @ok="confirmAssignPersonnel">
      <div style="padding: 20px 0;">
        <p class="mb-4">为任务 <strong>{{ selectedTaskName }}</strong> 分配人员：</p>
        
        <div class="grid grid-cols-2 gap-6">
          <!-- 负责人选择 -->
          <div>
            <h4 class="font-medium mb-3 text-gray-700">负责人</h4>
            <div class="space-y-3">
              <div v-for="person in responsiblePersonnelList" :key="person.id" 
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span class="text-blue-600 font-medium">{{ person.name.charAt(0) }}</span>
                  </div>
                  <div>
                    <div class="font-medium">{{ person.name }}</div>
                    <div class="text-sm text-gray-500">{{ person.position }}</div>
                  </div>
                </div>
                <Radio v-model="responsiblePersonId " 
                  :value="person.id"
                  @change="handleResponsibleSelect(person.id)" />
              </div>
            </div>
          </div>

          <!-- 协同人员选择 -->
          <div>
            <h4 class="font-medium mb-3 text-gray-700">协同人员</h4>
            <div class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              <div v-for="person in collaborativePersonnelList" :key="person.id" 
                class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span class="text-green-600 font-medium">{{ person.name.charAt(0) }}</span>
                  </div>
                  <div>
                    <div class="font-medium">{{ person.name }}</div>
                    <div class="text-sm text-gray-500">{{ person.position }}</div>
                  </div>
                </div>
                <Checkbox v-model="collaborativePersonIds" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-medium text-gray-700">已选人员</h4>
            <span class="text-sm text-gray-500">共 {{ getSelectedCount() }} 人</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <div v-if="getSelectedCount() === 0" class="text-center text-gray-500 py-2">
              暂未选择人员
            </div>
            <div v-else class="space-y-2">
              <div v-if="selectedResponsiblePerson" class="flex items-center gap-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  负责人
                </span>
                <span>{{ selectedResponsiblePerson.name }}</span>
                <span class="text-sm text-gray-500">{{ selectedResponsiblePerson.position }}</span>
              </div>
              <div v-if="collaborativePersonIds.length > 0" class="flex flex-wrap gap-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  协同人员
                </span>
                <span v-for="personId in collaborativePersonIds" :key="personId" class="text-sm">
                  {{ getPersonName(personId) }}
                  <span v-if="getPersonName(personId)" class="text-gray-500 ml-1">
                    {{ getPersonPosition(personId) }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <!-- 更新进度弹窗 -->
    <Modal title="更新任务进度" v-model:open="progressModalVisible" width="600px" @ok="confirmUpdateProgress">
      <div style="padding: 20px 0;">
        <p class="mb-4">为任务 <strong>{{ selectedTaskName }}</strong> 更新进度：</p>
        
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="text-gray-700">当前进度</label>
            <span class="font-medium text-blue-600">{{ currentProgress }}%</span>
          </div>
          <Slider 
            v-model:value="progressValue" 
            :marks="progressMarks"
            :step="10"
            :tip-formatter="(value) => `${value}%`"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">进度说明：</label>
          <Textarea 
            v-model:value="progressRemark" 
            placeholder="请输入进度说明（如：已完成设备安装、正在进行调试、遇到技术问题等）" 
            :maxlength="500" 
            :rows="4" 
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">现场照片：</label>
          <Upload
            v-model:file-list="progressFiles"
            list-type="picture-card"
            :max-count="5"
            :before-upload="beforeImageUpload"
          >
            <div>
              <PlusOutlined />
              <div style="margin-top: 8px">上传照片</div>
            </div>
          </Upload>
          <div class="mt-2 text-sm text-gray-500">
            支持上传现场照片作为进度证明
          </div>
        </div>

        <div v-if="selectedTask.equipment_list && selectedTask.equipment_list.length > 0" class="mb-4">
          <label class="block mb-2 font-medium">设备使用情况：</label>
          <div class="space-y-2">
            <div v-for="equipment in selectedTask.equipment_list" :key="equipment.id" 
              class="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <span class="font-medium">{{ equipment.name }}</span>
                <span class="text-sm text-gray-500 ml-2">({{ equipment.model }})</span>
              </div>
              <Select :default-value="equipment.status || 'normal'" style="width: 120px;" size="small">
                <Select.Option value="normal">正常使用</Select.Option>
                <Select.Option value="damaged">损坏</Select.Option>
                <Select.Option value="maintenance">维修中</Select.Option>
                <Select.Option value="unused">未使用</Select.Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </Modal>

    <!-- 暂停任务确认弹窗 -->
    <Modal title="暂停任务确认" v-model:open="pauseModalVisible" width="500px" @ok="confirmPauseTask">
      <div style="padding: 20px 0;">
        <p class="mb-2">确定要暂停任务 <strong>{{ selectedTaskName }}</strong> 吗？</p>
        <p class="text-gray-500 mb-4">暂停后：</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600 mb-4">
          <li>任务状态将变更为"已暂停"</li>
          <li>任务停止计时</li>
          <li>可以随时恢复任务</li>
          <li>已完成的进度会保留</li>
        </ul>
        <div>
          <label class="block mb-2">暂停原因：</label>
          <Textarea 
            v-model:value="pauseReason" 
            placeholder="请输入暂停原因（如：设备故障、天气影响、资源不足等）" 
            :maxlength="200" 
            :rows="3" 
            class="w-full"
          />
        </div>
      </div>
    </Modal>

    <!-- 取消任务确认弹窗 -->
    <Modal title="取消任务确认" v-model:open="cancelModalVisible" width="500px" @ok="confirmCancelTask">
      <div style="padding: 20px 0;">
        <p class="mb-2">确定要取消任务 <strong>{{ selectedTaskName }}</strong> 吗？</p>
        <p class="text-gray-500 mb-4">取消后：</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600 mb-4">
          <li>任务状态将变更为"已取消"</li>
          <li>任务将被终止</li>
          <li>此操作不可逆</li>
          <li>需要记录取消原因</li>
        </ul>
        <div>
          <label class="block mb-2">取消原因：</label>
          <Textarea 
            v-model:value="cancelReason" 
            placeholder="请输入取消原因（如：计划变更、无法执行、风险过大等）" 
            :maxlength="200" 
            rows="3" 
            class="w-full"
          />
        </div>
      </div>
    </Modal>

    <!-- 完成确认弹窗 -->
    <Modal title="任务完成确认" v-model:open="completeModalVisible" width="600px" @ok="confirmCompleteTask">
      <div style="padding: 20px 0;">
        <p class="mb-4">确认任务 <strong>{{ selectedTaskName }}</strong> 已完成？</p>
        
        <div class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div class="flex items-center gap-3 mb-2">
            <CheckCircleOutlined class="text-green-600 text-lg" />
            <span class="font-medium text-green-700">任务完成检查清单</span>
          </div>
          <ul class="list-disc pl-5 space-y-1 text-green-600">
            <li>确认所有工作已完成</li>
            <li>确认设备已归还或妥善存放</li>
            <li>确认物料已清点完毕</li>
            <li>确认现场已清理</li>
            <li>确认安全检查通过</li>
          </ul>
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">完成说明：</label>
          <Textarea 
            v-model:value="completeRemark" 
            placeholder="请输入完成说明，包括主要成果、遇到的问题、解决方案等" 
            :maxlength="500" 
            :rows="4" 
            class="w-full"
          />
        </div>

        <div class="mb-4">
          <label class="block mb-2 font-medium">完成证明：</label>
          <Upload
            v-model:file-list="completeFiles"
            list-type="picture-card"
            :max-count="5"
            :before-upload="beforeImageUpload"
          >
            <div>
              <PlusOutlined />
              <div style="margin-top: 8px">上传照片</div>
            </div>
          </Upload>
          <div class="mt-2 text-sm text-gray-500">
            可上传验收报告、完成照片等证明文件
          </div>
        </div>
      </div>
    </Modal>

    <!-- 批量创建弹窗 -->
    <Modal title="批量创建任务" v-model:open="batchCreateModalVisible" width="800px" @ok="confirmBatchCreate">
      <div style="padding: 20px 0;">
        <Tabs v-model:activeKey="batchCreateActiveTab">
          <TabPane key="1" tab="Excel模板导入">
            <div class="mb-6">
              <h4 class="font-medium mb-2">操作步骤：</h4>
              <ol class="list-decimal pl-5 space-y-1">
                <li>下载任务模板</li>
                <li>按照模板格式填写任务信息</li>
                <li>上传Excel文件</li>
                <li>系统会自动创建任务</li>
              </ol>
            </div>

            <div class="mb-4">
              <Button @click="downloadTaskTemplate" style="margin-right: 10px;">
                <DownloadOutlined />
                下载模板
              </Button>
              <Button type="primary" @click="handleSelectTaskExcel">
                <UploadOutlined />
                选择Excel文件
              </Button>
            </div>
          </TabPane>
          <TabPane key="2" tab="会议任务批量生成">
            <div style="padding: 20px 0;">
              <div class="mb-4">
                <label class="block mb-2">选择会议：</label>
                <Select
                  v-model:value="selectedMeetingId"
                  placeholder="请选择会议"
                  style="width: 100%"
                  :options="meetingOptions"
                  show-search
                />
              </div>

              <div class="mb-4">
                <label class="block mb-2">批量生成方式：</label>
                <RadioGroup v-model:value="batchGenerationMode" class="w-full">
                  <Radio value="auto" class="block mb-2">
                    自动生成（根据会议内容智能生成）
                  </Radio>
                  <Radio value="manual" class="block">
                    手动配置（逐一配置任务信息）
                  </Radio>
                </RadioGroup>
              </div>

              <div v-if="selectedMeetingId && batchGenerationMode === 'auto'" class="border border-gray-200 rounded p-4 bg-gray-50">
                <p class="text-gray-600">系统将根据会议记录自动生成任务清单，确认后批量创建。</p>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  </div>
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
  Tabs,
  Radio,
  RadioGroup,
  Checkbox,
  Slider,
  Select
} from 'ant-design-vue'
import { 
  PlusOutlined, 
  UploadOutlined, 
  DownloadOutlined, 
  ExportOutlined, 
  FileTextOutlined,
  FileAddOutlined,
  MoreOutlined,
  DownOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import TaskDetail from './components/task/taskDetail.vue'
import TaskForm from './components/task/taskForm.vue'

const { TabPane } = Tabs
const { Option } = Select

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
    title: '任务名称',
    dataIndex: 'task_name',
    key: 'task_name',
    width: 200,
    ellipsis: true,
  },
  {
    title: '任务类型',
    dataIndex: 'task_type',
    key: 'task_type',
    width: 120,
    formatter: (value: string) => {
      const typeMap = {
        'maintenance': '设备维护',
        'repair': '设备维修',
        'inspection': '安全检查',
        'installation': '设备安装',
        'training': '培训任务',
        'documentation': '文档整理',
        'other': '其他任务'
      }
      return typeMap[value] || value
    }
  },
  {
    title: '分配班组',
    dataIndex: 'team_name',
    key: 'team_name',
    width: 120,
  },
  {
    title: '负责人',
    dataIndex: 'responsible_person_name',
    key: 'responsible_person_name',
    width: 100,
  },
  {
    title: '协同人员',
    dataIndex: 'collaborative_person_count',
    key: 'collaborative_person_count',
    width: 100,
    formatter: (value: number) => `${value}人`
  },
  {
    title: '任务时间',
    dataIndex: 'task_time',
    key: 'task_time',
    width: 200,
    formatter: (value,row: any) => {
      return `${formatDate(row.start_time)} 至 ${formatDate(row.end_time)}`
    }
  },
  {
    title: '任务状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    formatter: (value: string) => {
      const statusMap = {
        'not_started': { text: '未开始', color: 'gray' },
        'in_progress': { text: '进行中', color: 'blue' },
        'completed': { text: '已完成', color: 'green' },
        'paused': { text: '已暂停', color: 'orange' },
        'cancelled': { text: '已取消', color: 'red' }
      }
      return statusMap[value]?.text || '--'
    }
  },
  {
    title: '进度',
    dataIndex: 'progress',
    key: 'progress',
    width: 120,
    type: 'progress',
    props: {
      status: (record: any) => {
        const progress = record.progress || 0
        if (progress >= 100) return 'success'
        if (progress > 0) return 'active'
        return 'normal'
      },
      format: (record: any) => `${record.progress || 0}%`
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
      props: { type: 'link', size: 'small' },
      action: 'edit',
      visible: (record: any) => ['not_started', 'paused'].includes(record.status)
    },
    {
      label: '分配人员',
      props: { type: 'link', size: 'small' },
      action: 'assignPersonnel',
      visible: (record: any) => ['not_started', 'paused'].includes(record.status)
    },
    {
      label: '更新进度',
      props: { type: 'link', size: 'small' },
      action: 'updateProgress',
      visible: (record: any) => ['in_progress'].includes(record.status)
    },
    {
      label: '暂停',
      props: { type: 'link', size: 'small' },
      action: 'pauseTask',
      visible: (record: any) => ['in_progress'].includes(record.status)
    },
    {
      label: '取消',
      props: { type: 'link', size: 'small' },
      action: 'cancelTask',
      visible: (record: any) => ['not_started', 'in_progress', 'paused'].includes(record.status)
    },
    {
      label: '完成确认',
      props: { type: 'link', size: 'small' },
      action: 'completeTask',
      visible: (record: any) => ['in_progress', 'paused'].includes(record.status)
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
    field: 'task_type',
    label: '任务类型',
    type: 'select',
    placeholder: '请选择任务类型',
    props: {
      allowClear: true,
      options: [
        { label: '设备维护', value: 'maintenance' },
        { label: '设备维修', value: 'repair' },
        { label: '安全检查', value: 'inspection' },
        { label: '设备安装', value: 'installation' },
        { label: '培训任务', value: 'training' },
        { label: '文档整理', value: 'documentation' },
        { label: '其他任务', value: 'other' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'team_id',
    label: '分配班组',
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
    field: 'responsible_person_id',
    label: '负责人',
    type: 'select',
    placeholder: '请选择负责人',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '任务状态',
    type: 'select',
    placeholder: '请选择状态',
    props: {
      allowClear: true,
      options: [
        { label: '未开始', value: 'not_started' },
        { label: '进行中', value: 'in_progress' },
        { label: '已完成', value: 'completed' },
        { label: '已暂停', value: 'paused' },
        { label: '已取消', value: 'cancelled' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'time_range',
    label: '任务时间',
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
  const res: any = await getTaskList({
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

  // 处理任务时间范围
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
const assignModalVisible = ref(false)
const progressModalVisible = ref(false)
const pauseModalVisible = ref(false)
const cancelModalVisible = ref(false)
const completeModalVisible = ref(false)
const batchCreateModalVisible = ref(false)

// 数据状态
const selectedTask = ref({})
const selectedTaskId = ref('')
const selectedTaskName = ref('')
const currentFormData = ref({})
const isEditMode = ref(false)
const pauseReason = ref('')
const cancelReason = ref('')
const progressValue = ref(0)
const progressRemark = ref('')
const completeRemark = ref('')

// 人员分配相关
const responsiblePersonId = ref('')
const collaborativePersonIds = ref<string[]>([])
const responsiblePersonnelList = ref<any[]>([])
const collaborativePersonnelList = ref<any[]>([])

// 批量创建相关
const batchCreateActiveTab = ref('1')
const selectedMeetingId = ref('')
const batchGenerationMode = ref('auto')

// 文件上传相关
const progressFiles = ref([])
const completeFiles = ref([])

// 进度标记
const progressMarks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%'
}

// 选项数据
const meetingOptions = ref([])
const taskTypeOptions = ref([])
const teamOptions = ref([])
const personnelOptions = ref([])
const equipmentOptions = ref([])
const materialOptions = ref([])

const taskFormRef = ref()

// 计算当前进度
const currentProgress = computed(() => {
  return selectedTask.value.progress || 0
})

// 获取选中的人员数量
const getSelectedCount = () => {
  let count = 0
  if (responsiblePersonId.value) count++
  count += collaborativePersonIds.value.length
  return count
}

// 获取选中的负责人信息
const selectedResponsiblePerson = computed(() => {
  return responsiblePersonnelList.value.find(person => person.id === responsiblePersonId.value)
})

// 获取人员姓名
const getPersonName = (personId: string) => {
  const person = personnelOptions.value.find((p: any) => p.value === personId)
  return person?.label || personId
}

// 获取人员岗位
const getPersonPosition = (personId: string) => {
  const person = personnelOptions.value.find((p: any) => p.value === personId)
  return person?.position || ''
}

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedTaskId.value = record.id
  selectedTaskName.value = record.task_name
  selectedTask.value = record

  switch (action) {
    case 'detail':
      showTaskDetail(record)
      break
    case 'edit':
      editTask(record)
      break
    case 'assignPersonnel':
      assignPersonnel(record)
      break
    case 'updateProgress':
      updateProgress(record)
      break
    case 'pauseTask':
      pauseTask(record)
      break
    case 'cancelTask':
      cancelTask(record)
      break
    case 'completeTask':
      completeTask(record)
      break
  }
}

// 显示任务详情
const showTaskDetail = async (record: any) => {
  selectedTask.value = record
  detailModalVisible.value = true
}

// 编辑任务
const editTask = (record: any) => {
  if (!['not_started', 'paused'].includes(record.status)) {
    message.warning('只有未开始或已暂停的任务可以编辑')
    return
  }
  isEditMode.value = true
  currentFormData.value = { ...record }
  editModalVisible.value = true
}

// 新建任务
const handleCreateTask = () => {
  isEditMode.value = false
  currentFormData.value = {}
  editModalVisible.value = true
}

// 分配人员
const assignPersonnel = async (record: any) => {
  if (!['not_started', 'paused'].includes(record.status)) {
    message.warning('只有未开始或已暂停的任务可以分配人员')
    return
  }
  
  try {
    // 加载可分配人员
    const res = await getAssignablePersonnel()
    const personnel = res.data
    
    // 区分负责人和协同人员候选人
    responsiblePersonnelList.value = personnel.filter((p: any) => p.can_be_responsible)
    collaborativePersonnelList.value = personnel.filter((p: any) => p.can_collaborate)
    
    // 设置当前已分配的人员
    responsiblePersonId.value = record.responsible_person_id || ''
    collaborativePersonIds.value = record.collaborative_person_ids || []
    
    assignModalVisible.value = true
  } catch (error) {
    message.error('加载人员数据失败')
  }
}

// 更新进度
const updateProgress = (record: any) => {
  progressValue.value = record.progress || 0
  progressRemark.value = ''
  progressFiles.value = []
  progressModalVisible.value = true
}

// 暂停任务
const pauseTask = (record: any) => {
  if (record.status !== 'in_progress') {
    message.warning('只有进行中的任务可以暂停')
    return
  }
  pauseReason.value = ''
  pauseModalVisible.value = true
}

// 取消任务
const cancelTask = (record: any) => {
  if (!['not_started', 'in_progress', 'paused'].includes(record.status)) {
    message.warning('该任务状态不可取消')
    return
  }
  cancelReason.value = ''
  cancelModalVisible.value = true
}

// 完成任务
const completeTask = (record: any) => {
  if (!['in_progress', 'paused'].includes(record.status)) {
    message.warning('只有进行中或已暂停的任务可以完成')
    return
  }
  completeRemark.value = ''
  completeFiles.value = []
  completeModalVisible.value = true
}

// 批量创建
const handleBatchCreate = () => {
  batchCreateModalVisible.value = true
  batchCreateActiveTab.value = '1'
  selectedMeetingId.value = ''
  batchGenerationMode.value = 'auto'
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
    case 'task_report':
      handleTaskReport()
      break
  }
}

// 负责人选择
const handleResponsibleSelect = (personId: string) => {
  responsiblePersonId.value = personId
}

// 确认分配人员
const confirmAssignPersonnel = async () => {
  if (!responsiblePersonId.value) {
    message.warning('请选择负责人')
    return
  }

  try {
    // 调用分配人员API
    // await assignTaskPersonnel(selectedTaskId.value, {
    //   responsible_person_id: responsiblePersonId.value,
    //   collaborative_person_ids: collaborativePersonIds.value
    // })
    
    message.success('人员分配成功')
    assignModalVisible.value = false
    responsiblePersonId.value = ''
    collaborativePersonIds.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('人员分配失败')
  }
}

// 确认更新进度
const confirmUpdateProgress = async () => {
  if (progressValue.value < 0 || progressValue.value > 100) {
    message.warning('进度值必须在0-100之间')
    return
  }

  try {
    // 调用更新进度API
    // await updateTaskProgress(selectedTaskId.value, {
    //   progress: progressValue.value,
    //   remark: progressRemark.value,
    //   files: progressFiles.value
    // })
    
    message.success('进度更新成功')
    progressModalVisible.value = false
    progressRemark.value = ''
    progressFiles.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('进度更新失败')
  }
}

// 确认暂停任务
const confirmPauseTask = async () => {
  if (!pauseReason.value.trim()) {
    message.warning('请输入暂停原因')
    return
  }

  try {
    // 调用暂停任务API
    // await pauseTaskRecord(selectedTaskId.value, {
    //   reason: pauseReason.value
    // })
    
    message.success('任务已暂停')
    pauseModalVisible.value = false
    pauseReason.value = ''
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('任务暂停失败')
  }
}

// 确认取消任务
const confirmCancelTask = async () => {
  if (!cancelReason.value.trim()) {
    message.warning('请输入取消原因')
    return
  }

  try {
    // 调用取消任务API
    // await cancelTaskRecord(selectedTaskId.value, {
    //   reason: cancelReason.value
    // })
    
    message.success('任务已取消')
    cancelModalVisible.value = false
    cancelReason.value = ''
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('任务取消失败')
  }
}

// 确认完成任务
const confirmCompleteTask = async () => {
  if (!completeRemark.value.trim()) {
    message.warning('请输入完成说明')
    return
  }

  try {
    // 调用完成任务API
    // await completeTaskRecord(selectedTaskId.value, {
    //   remark: completeRemark.value,
    //   files: completeFiles.value
    // })
    
    message.success('任务已完成')
    completeModalVisible.value = false
    completeRemark.value = ''
    completeFiles.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('任务完成确认失败')
  }
}

// 确认批量创建
const confirmBatchCreate = async () => {
  if (batchCreateActiveTab.value === '1') {
    // Excel导入逻辑
    message.info('Excel导入功能开发中...')
  } else if (batchCreateActiveTab.value === '2') {
    if (!selectedMeetingId.value) {
      message.warning('请选择会议')
      return
    }
    
    try {
      // 调用批量生成任务API
      // await batchGenerateTasks(selectedMeetingId.value, batchGenerationMode.value)
      message.success('批量任务创建成功')
      batchCreateModalVisible.value = false
      window.dispatchEvent(new CustomEvent('table-reload'))
    } catch (error) {
      message.error('批量创建失败')
    }
  }
}

// 保存任务数据
const saveTaskData = async (formData: any) => {
  try {
    if (isEditMode.value) {
      message.success('任务信息更新成功')
    } else {
      message.success('任务创建成功')
    }
    editModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error(isEditMode.value ? '更新失败' : '创建失败')
  }
}

// 保存任务
const saveTask = async () => {
  try {
    if (taskFormRef.value?.handleSubmit) {
      await taskFormRef.value.handleSubmit()
    }
  } catch (error) {
    message.error('提交失败，请重试')
  }
}

// 文件上传前验证
const beforeImageUpload = (file: any) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
    return false
  }
  
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片大小不能超过5MB')
    return false
  }
  
  return true
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '--'
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 导出当前页
const handleExportCurrent = () => {
  message.info('导出当前页功能开发中...')
}

// 导出全部
const handleExportAll = () => {
  message.info('导出全部功能开发中...')
}

// 任务报告
const handleTaskReport = () => {
  message.info('任务报告功能开发中...')
}

// 下载任务模板
const downloadTaskTemplate = () => {
  message.info('任务模板下载功能开发中...')
}

// 选择Excel文件
const handleSelectTaskExcel = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls'
  input.onchange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      message.success(`已选择文件：${file.name}`)
    }
  }
  input.click()
}

// 通用的操作处理
const handleAction = (type: string, record: any) => {
  switch (type) {
    case 'edit':
      editTask(record)
      break
    case 'assignPersonnel':
      assignPersonnel(record)
      break
    case 'updateProgress':
      updateProgress(record)
      break
    case 'pauseTask':
      pauseTask(record)
      break
    case 'cancelTask':
      cancelTask(record)
      break
    case 'completeTask':
      completeTask(record)
      break
  }
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedTask.value = {}
}

// 加载初始化数据
onBeforeMount(async () => {
  try {
    // 加载会议数据
    const meetingRes = await getMeetingList()
    meetingOptions.value = meetingRes.data.map((item: any) => ({
      label: item.meeting_name,
      value: item.id
    }))

    // 加载班组数据
    const teamRes = await getTeamList()
    teamOptions.value = teamRes.data.map((item: any) => ({
      label: item.team_name,
      value: item.id
    }))
    searchConfig.value[3].props.options = teamOptions.value

    // 加载人员数据
    const personnelRes = await getPersonnelList()
    personnelOptions.value = personnelRes.data.map((item: any) => ({
      label: item.name,
      value: item.id,
      position: item.position
    }))
    searchConfig.value[4].props.options = personnelOptions.value

    // 加载设备数据
    const equipmentRes = await getEquipmentList()
    equipmentOptions.value = equipmentRes.data.map((item: any) => ({
      label: `${item.name} (${item.model})`,
      value: item.id
    }))

    // 加载物料数据
    const materialRes = await getMaterialList()
    materialOptions.value = materialRes.data.map((item: any) => ({
      label: item.name,
      value: item.id,
      unit: item.unit
    }))

  } catch (error) {
    console.error('初始化数据加载失败:', error)
  }
})

// 模拟获取任务列表API
const getTaskList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        meeting_name: '安全生产月度例会',
        task_name: '车间消防器材检查维护',
        task_type: 'inspection',
        team_name: '安全检查组',
        responsible_person_name: '张三',
        responsible_person_id: '1',
        collaborative_person_count: 2,
        collaborative_person_ids: ['2', '3'],
        start_time: '2023-11-01 09:00:00',
        end_time: '2023-11-05 18:00:00',
        status: 'in_progress',
        progress: 60
      },
      {
        id: '2',
        meeting_name: '设备维护专题会',
        task_name: '2号生产线大修',
        task_type: 'maintenance',
        team_name: '设备维护班',
        responsible_person_name: '李四',
        responsible_person_id: '4',
        collaborative_person_count: 3,
        collaborative_person_ids: ['5', '6', '7'],
        start_time: '2023-11-02 08:00:00',
        end_time: '2023-11-10 17:00:00',
        status: 'not_started',
        progress: 0
      },
      {
        id: '3',
        meeting_name: '新员工安全培训会',
        task_name: '安全操作规程培训',
        task_type: 'training',
        team_name: '培训部',
        responsible_person_name: '王五',
        responsible_person_id: '8',
        collaborative_person_count: 1,
        collaborative_person_ids: ['9'],
        start_time: '2023-11-03 14:00:00',
        end_time: '2023-11-03 17:00:00',
        status: 'completed',
        progress: 100
      },
      {
        id: '4',
        meeting_name: '项目启动会',
        task_name: '设备安装调试',
        task_type: 'installation',
        team_name: '技术部',
        responsible_person_name: '赵六',
        responsible_person_id: '10',
        collaborative_person_count: 4,
        collaborative_person_ids: ['11', '12', '13', '14'],
        start_time: '2023-10-25 08:00:00',
        end_time: '2023-11-15 18:00:00',
        status: 'paused',
        progress: 40
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

// 模拟获取会议列表
const getMeetingList = async () => {
  return {
    data: [
      { id: '1', meeting_name: '安全生产月度例会' },
      { id: '2', meeting_name: '设备维护专题会' },
      { id: '3', meeting_name: '新员工安全培训会' },
      { id: '4', meeting_name: '项目启动会' },
      { id: '5', meeting_name: '安全风险评估会' }
    ]
  }
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
      { id: '1', name: '张三', position: '安全员' },
      { id: '2', name: '李四', position: '技术员' },
      { id: '3', name: '王五', position: '培训师' },
      { id: '4', name: '赵六', position: '工程师' },
      { id: '5', name: '钱七', position: '操作工' },
      { id: '6', name: '孙八', position: '维修工' }
    ]
  }
}

// 模拟获取可分配人员
const getAssignablePersonnel = async () => {
  return {
    data: [
      { id: '1', name: '张三', position: '安全员', can_be_responsible: true, can_collaborate: true },
      { id: '2', name: '李四', position: '技术员', can_be_responsible: true, can_collaborate: true },
      { id: '3', name: '王五', position: '培训师', can_be_responsible: true, can_collaborate: true },
      { id: '4', name: '赵六', position: '工程师', can_be_responsible: true, can_collaborate: true },
      { id: '5', name: '钱七', position: '操作工', can_be_responsible: false, can_collaborate: true },
      { id: '6', name: '孙八', position: '维修工', can_be_responsible: false, can_collaborate: true }
    ]
  }
}

// 模拟获取设备列表
const getEquipmentList = async () => {
  return {
    data: [
      { id: '1', name: '电动扳手', model: 'DL-2000' },
      { id: '2', name: '绝缘检测仪', model: 'JY-500' },
      { id: '3', name: '高空作业车', model: 'GK-8' },
      { id: '4', name: '激光测距仪', model: 'JC-100' }
    ]
  }
}

// 模拟获取物料列表
const getMaterialList = async () => {
  return {
    data: [
      { id: '1', name: '螺栓', unit: '个' },
      { id: '2', name: '电线', unit: '米' },
      { id: '3', name: '润滑油', unit: '升' },
      { id: '4', name: '密封胶', unit: '支' }
    ]
  }
}
</script>

<style scoped>
.ta<REDACTED_CREDENTIAL> {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>