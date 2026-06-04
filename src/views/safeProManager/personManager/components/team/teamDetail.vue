<template>
    <div class="team-detail">
        <!-- 班组基本信息 -->
        <div class="mb-8">
            <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">班组基本信息</h3>
            <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                <div class="flex items-start">
                    <span class="min-w-[120px] text-gray-600">班组名称:</span>
                    <span class="ml-2 font-medium">{{ teamData.team_name || '--' }}</span>
                </div>
                <div class="flex items-start">
                    <span class="min-w-[120px] text-gray-600">所属研究所:</span>
                    <span class="ml-2 font-medium">{{ teamData.institute_name || '--' }}</span>
                </div>
                <div class="flex items-start">
                    <span class="min-w-[120px] text-gray-600">班组长:</span>
                    <span class="ml-2 font-medium">{{ teamData.leader_name || '--' }}</span>
                </div>
                <div class="flex items-start">
                    <span class="min-w-[120px] text-gray-600">班组人数:</span>
                    <span class="ml-2 font-medium">{{ teamData.member_count || 0 }}人</span>
                </div>
                <div class="flex items-start">
                    <span class="min-w-[120px] text-gray-600">班组状态:</span>
                    <span class="ml-2">
                        <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusClass()]">
                            {{ getStatusText() }}
                        </span>
                    </span>
                </div>
                <div class="flex items-start">
                    <span class="min-w-[120px] text-gray-600">创建时间:</span>
                    <span class="ml-2 font-medium">{{ formatDateTime(teamData.created_time) }}</span>
                </div>
            </div>
        </div>

        <!-- 主要作业区域 -->
        <div class="mb-8">
            <h3 class="text-base font-medium mb-4 pb-2 border-b border-gray-200">主要作业区域</h3>
            <div class="flex flex-wrap gap-2">
                <span v-for="region in teamData.region_names" :key="region"
                    class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {{ region }}
                </span>
                <span v-if="!teamData.region_names || teamData.region_names.length === 0" class="text-gray-500">
                    未设置作业区域
                </span>
            </div>
        </div>

        <!-- 班组成员 -->
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <h3 class="text-base font-medium">班组成员 ({{ teamData.member_count || 0 }}人)</h3>
                <button v-if="teamData.status === 'normal'" @click="handleAddMember"
                    class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors">
                    添加成员
                </button>
            </div>

            <div v-if="teamData.members && teamData.members.length > 0">
                <Table :columns="memberColumns" :data-source="teamData.members" :pagination="false" rowKey="id"
                    class="mb-4" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
                暂无班组成员
            </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button @click="handleEdit"
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
                编辑信息
            </button>
            <button v-if="teamData.status === 'normal' && teamData.member_count > 0" @click="handleRemoveMember"
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors">
                移除成员
            </button>
            <button v-if="teamData.status === 'normal'" @click="handleDisbandTeam"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors">
                解散班组
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Modal, Table } from 'ant-design-vue'
import dayjs from 'dayjs'

const props = defineProps({
  teamData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'edit', 'addMember', 'removeMember', 'disbandTeam'])

// 成员表格列配置
const memberColumns = [
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
    width: 120,
  },
  {
    title: '岗位',
    dataIndex: 'position',
    key: 'position',
    width: 120,
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width: 120,
  },
  {
    title: '入职时间',
    dataIndex: 'entry_date',
    key: 'entry_date',
    width: 120,
    formatter: (value: string) => {
      return dayjs(value).format('YYYY-MM-DD')
    }
  }
]

// 格式化日期时间
const formatDateTime = (datetime) => {
  if (!datetime) return '--'
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
}

// 获取状态文本
const getStatusText = () => {
  const statusMap = {
    'normal': '正常',
    'paused': '暂停作业',
    'disbanded': '已解散'
  }
  return statusMap[props.teamData.status] || '未知'
}

// 获取状态样式类
const getStatusClass = () => {
  const status = props.teamData.status
  const classMap = {
    'normal': 'bg-green-100 text-green-800',
    'paused': 'bg-orange-100 text-orange-800',
    'disbanded': 'bg-red-100 text-red-800'
  }
  return classMap[status] || classMap.normal
}

// 操作处理
const handleEdit = () => {
  emit('edit', props.teamData)
}

const handleAddMember = () => {
  emit('addMember', props.teamData)
}

const handleRemoveMember = () => {
  emit('removeMember', props.teamData)
}

const handleDisbandTeam = () => {
  Modal.confirm({
    title: '确认解散班组',
    content: '确定要解散该班组吗？此操作不可逆。',
    onOk() {
      emit('disbandTeam', props.teamData)
    }
  })
}
</script>