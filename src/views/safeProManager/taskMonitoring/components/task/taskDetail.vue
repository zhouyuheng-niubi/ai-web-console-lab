<template>
  <div class="task-detail">
    <!-- 任务基本信息 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">任务基本信息</h3>
      <div class="grid grid-cols-2 gap-x-8 gap-y-4">
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">任务名称:</span>
          <span class="ml-2 font-medium">{{ taskData.task_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">所属会议:</span>
          <span class="ml-2 font-medium">{{ taskData.meeting_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">任务类型:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getTaskTypeClass()]">
              {{ getTaskTypeText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">分配班组:</span>
          <span class="ml-2 font-medium">{{ taskData.team_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">负责人:</span>
          <span class="ml-2 font-medium">{{ taskData.responsible_person_name || '--' }}</span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">任务时间:</span>
          <span class="ml-2 font-medium">
            {{ formatDateTime(taskData.start_time) }} 至 {{ formatDateTime(taskData.end_time) }}
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">任务状态:</span>
          <span class="ml-2">
            <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
              {{ getStatusText() }}
            </span>
          </span>
        </div>
        <div class="flex items-start">
          <span class="min-w-[120px] text-gray-600">当前进度:</span>
          <div class="ml-2 flex items-center gap-2">
            <div class="w-32">
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  :class="['h-full rounded-full transition-all', getProgressColor()]" 
                  :style="{ width: `${taskData.progress || 0}%` }"
                ></div>
              </div>
            </div>
            <span class="font-medium text-blue-600">{{ taskData.progress || 0 }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务人员 -->
    <div class="mb-8">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">任务人员</h3>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium mb-3 text-blue-600">负责人</h4>
          <div v-if="taskData.responsible_person_name" class="p-3 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span class="text-blue-600 font-medium text-lg">{{ taskData.responsible_person_name?.charAt(0) }}</span>
              </div>
              <div>
                <div class="font-medium">{{ taskData.responsible_person_name }}</div>
                <div class="text-sm text-gray-600">负责整体任务执行和进度把控</div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500">未指定负责人</div>
        </div>

        <div>
          <h4 class="font-medium mb-3 text-green-600">协同人员</h4>
          <div v-if="taskData.collaborative_persons && taskData.collaborative_persons.length > 0">
            <div class="space-y-2">
              <div v-for="person in taskData.collaborative_persons" :key="person.id" 
                class="p-3 border border-green-200 rounded-lg bg-green-50">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span class="text-green-600 font-medium text-lg">{{ person.name?.charAt(0) }}</span>
                  </div>
                  <div>
                    <div class="font-medium">{{ person.name }}</div>
                    <div class="text-sm text-gray-600">{{ person.position }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500">暂无协同人员</div>
        </div>
      </div>
    </div>

    <!-- 设备清单 -->
    <div class="mb-8" v-if="taskData.equipment_list && taskData.equipment_list.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">所需设备清单</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">设备名称</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型号</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">备注</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="equipment in taskData.equipment_list" :key="equipment.id">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ equipment.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ equipment.model }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ equipment.quantity }} {{ equipment.unit }}</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded text-xs font-medium', getEquipmentStatusClass(equipment.status)]">
                  {{ getEquipmentStatusText(equipment.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ equipment.remark || '--' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 物料清单 -->
    <div class="mb-8" v-if="taskData.material_list && taskData.material_list.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">所需物料清单</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">物料名称</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">规格</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">单位</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">备注</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="material in taskData.material_list" :key="material.id">
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ material.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ material.specification }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ material.quantity }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ material.unit }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ material.remark || '--' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 安全要求 -->
    <div class="mb-8" v-if="taskData.safety_requirements">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">安全要求</h3>
      <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-start gap-3">
          <ExclamationCircleOutlined class="text-yellow-600 text-lg mt-1" />
          <div class="whitespace-pre-wrap">{{ taskData.safety_requirements }}</div>
        </div>
      </div>
    </div>

    <!-- 进度记录 -->
    <div class="mb-8" v-if="taskData.progress_records && taskData.progress_records.length > 0">
      <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">进度记录</h3>
      <div class="space-y-4">
        <div v-for="record in taskData.progress_records" :key="record.id" 
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span class="text-blue-600 font-medium">{{ record.operator_name?.charAt(0) }}</span>
              </div>
              <div>
                <div class="font-medium">{{ record.operator_name }}</div>
                <div class="text-sm text-gray-500">{{ formatDateTime(record.created_time) }}</div>
              </div>
            </div>
            <span class="font-medium text-blue-600">{{ record.progress }}%</span>
          </div>
          <div class="mb-2">
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-blue-500 rounded-full" 
                :style="{ width: `${record.progress}%` }"
              ></div>
            </div>
          </div>
          <div class="text-gray-600">{{ record.remark }}</div>
          <div v-if="record.files && record.files.length > 0" class="mt-3">
            <div class="text-sm text-gray-500 mb-1">附件：</div>
            <div class="flex flex-wrap gap-2">
              <div v-for="file in record.files" :key="file.id" 
                class="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                <PaperClipOutlined />
                <span>{{ file.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button @click="handleEdit"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
        编辑
      </button>
      <button @click="handleAssignPersonnel"
        class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors">
        分配人员
      </button>
      <button @click="handleUpdateProgress"
        class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
        更新进度
      </button>
      <button v-if="taskData.status === 'in_progress'" @click="handlePauseTask"
        class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors">
        暂停
      </button>
      <button @click="handleCancelTask"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
        取消
      </button>
      <button v-if="['in_progress', 'paused'].includes(taskData.status)" @click="handleCompleteTask"
        class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors">
        完成确认
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleOutlined, PaperClipOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

const props = defineProps({
  taskData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'edit', 'assignPersonnel', 'updateProgress', 'pauseTask', 'cancelTask', 'completeTask'])

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm')
}

// 获取任务类型文本
const getTaskTypeText = () => {
  const typeMap = {
    'maintenance': '设备维护',
    'repair': '设备维修',
    'inspection': '安全检查',
    'installation': '设备安装',
    'training': '培训任务',
    'documentation': '文档整理',
    'other': '其他任务'
  }
  return typeMap[props.taskData.task_type] || '未知'
}

// 获取任务类型样式类
const getTaskTypeClass = () => {
  const type = props.taskData.task_type
  const classMap = {
    'maintenance': 'bg-blue-100 text-blue-800',
    'repair': 'bg-orange-100 text-orange-800',
    'inspection': 'bg-green-100 text-green-800',
    'installation': 'bg-purple-100 text-purple-800',
    'training': 'bg-yellow-100 text-yellow-800',
    'documentation': 'bg-gray-100 text-gray-800',
    'other': 'bg-gray-100 text-gray-800'
  }
  return classMap[type] || classMap.other
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    'not_started': '未开始',
    'in_progress': '进行中',
    'completed': '已完成',
    'paused': '已暂停',
    'cancelled': '已取消'
  }
  return statusMap[props.taskData.status] || '未知'
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.taskData.status
  const classMap = {
    'not_started': 'bg-gray-100 text-gray-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'paused': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classMap[status] || classMap.not_started
}

// 获取进度条颜色
const getProgressColor = () => {
  const progress = props.taskData.progress || 0
  if (progress >= 100) return 'bg-green-500'
  if (progress >= 70) return 'bg-blue-500'
  if (progress >= 30) return 'bg-yellow-500'
  return 'bg-red-500'
}

// 获取设备状态文本
const getEquipmentStatusText = (status) => {
  const statusMap = {
    'normal': '正常使用',
    'damaged': '损坏',
    'maintenance': '维修中',
    'unused': '未使用',
    'returned': '已归还'
  }
  return statusMap[status] || '--'
}

// 获取设备状态样式类
const getEquipmentStatusClass = (status) => {
  const classMap = {
    'normal': 'bg-green-100 text-green-800',
    'damaged': 'bg-red-100 text-red-800',
    'maintenance': 'bg-orange-100 text-orange-800',
    'unused': 'bg-gray-100 text-gray-800',
    'returned': 'bg-blue-100 text-blue-800'
  }
  return classMap[status] || classMap.normal
}

// 操作处理
const handleEdit = () => {
  if (!['not_started', 'paused'].includes(props.taskData.status)) {
    message.warning('只有未开始或已暂停的任务可以编辑')
    return
  }
  emit('edit', props.taskData)
}

const handleAssignPersonnel = () => {
  if (!['not_started', 'paused'].includes(props.taskData.status)) {
    message.warning('只有未开始或已暂停的任务可以分配人员')
    return
  }
  emit('assignPersonnel', props.taskData)
}

const handleUpdateProgress = () => {
  if (props.taskData.status !== 'in_progress') {
    message.warning('只有进行中的任务可以更新进度')
    return
  }
  emit('updateProgress', props.taskData)
}

const handlePauseTask = () => {
  if (props.taskData.status !== 'in_progress') {
    message.warning('只有进行中的任务可以暂停')
    return
  }
  emit('pauseTask', props.taskData)
}

const handleCancelTask = () => {
  if (!['not_started', 'in_progress', 'paused'].includes(props.taskData.status)) {
    message.warning('该任务状态不可取消')
    return
  }
  emit('cancelTask', props.taskData)
}

const handleCompleteTask = () => {
  if (!['in_progress', 'paused'].includes(props.taskData.status)) {
    message.warning('只有进行中或已暂停的任务可以完成')
    return
  }
  emit('completeTask', props.taskData)
}
</script>