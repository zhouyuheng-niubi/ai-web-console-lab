<template>
   <!-- 页面标题和操作栏 -->
         <div class="flex flex-col pt-[30px] pb-[30px] px-[30px]">
    <div class="mb-[30px] flex  items-center flex-shrink-0">
        <Button class="flex  items-center" type="primary" @click="handleAddTeam">
          <PlusOutlined />
          新增班组
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
        <Button type="primary" @click="handleAddTeam">
          <PlusOutlined />
          新增班组
        </Button>
      </template>
    </SmartTable>

    <!-- 班组详情弹窗 -->
    <Modal title="班组详情" v-model:open="detailModalVisible" width="900px" :footer="null">
      <TeamDetail 
        :team-data="selectedTeam"
        @edit="(val) => handleAction('edit', val)"
        @addMember="(val) => handleAction('addMember', val)"
        @removeMember="(val) => handleAction('removeMember', val)"
        @disbandTeam="(val) => handleAction('disbandTeam', val)"
        @close="closeDetailModal"
      />            
    </Modal>

    <!-- 新增/编辑班组弹窗 -->
    <Modal :title="isEditMode ? '编辑班组' : '新增班组'" v-model:open="editModalVisible" width="700px" @ok="saveTeam">
      <TeamForm
        ref="teamFormRef"
        :form-data="currentFormData"
        :is-edit="isEditMode"
        :institute-options="instituteOptions"
        :region-options="regionOptions"
        :leader-options="leaderOptions"
        @save="saveTeamData"
      />
    </Modal>

    <!-- 添加成员弹窗 -->
    <Modal title="添加成员" v-model:open="addMemberModalVisible" width="800px" @ok="confirmAddMember" class="z-[10]">
      <div style="padding: 20px 0;">
        <p class="mb-4">为 <strong>{{ selectedTeamName }}</strong> 添加成员：</p>
        
        <div class="mb-4">
          <label class="block mb-2">可选人员列表：</label>
          <Table
            :columns="memberColumns"
            :data-source="availableMembers"
            :row-selection="{
              selectedRowKeys: selectedMemberKeys,
              onChange: onSelectMemberChange,
              getCheckboxProps: (record) => ({
                disabled: currentTeamMembers.includes(record.id)
              })
            }"
            :pagination="{ pageSize: 5 }"
            rowKey="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'current_team'">
                <span v-if="record.team_name" class="text-orange-600">
                  {{ record.team_name }}
                </span>
                <span v-else class="text-green-600">无班组</span>
              </template>
            </template>
          </Table>
        </div>
      </div>
    </Modal>

    <!-- 移除成员弹窗 -->
    <Modal title="移除成员" v-model:open="removeMemberModalVisible" width="800px" @ok="confirmRemoveMember">
      <div style="padding: 20px 0;">
        <p class="mb-4">从 <strong>{{ selectedTeamName }}</strong> 中移除成员：</p>
        
        <div class="mb-4">
          <label class="block mb-2">当前成员列表：</label>
          <Table
            :columns="memberColumns"
            :data-source="teamMemberList"
            :row-selection="{
              selectedRowKeys: selectedMemberKeys,
              onChange: onSelectMemberChange
            }"
            :pagination="{ pageSize: 5 }"
            rowKey="id"
          />
        </div>
      </div>
    </Modal>

    <!-- 解散班组确认弹窗 -->
    <Modal title="解散班组确认" v-model:open="disbandModalVisible" width="500px" @ok="confirmDisbandTeam">
      <div style="padding: 20px 0;">
        <p class="mb-2">确定要解散 <strong>{{ selectedTeamName }}</strong> 吗？</p>
        <p class="text-gray-500 mb-4">此操作将：</p>
        <ul class="list-disc pl-5 space-y-1 text-gray-600">
          <li>解散当前班组</li>
          <li>班组状态将变更为"已解散"</li>
          <li>班组成员将转为"无班组"状态</li>
          <li>此操作不可逆</li>
        </ul>
        <div class="mt-4">
          <label class="block mb-2">解散原因：</label>
          <Textarea 
            v-model:value="disbandReason" 
            placeholder="请输入解散原因" 
            :maxlength="200" 
            :rows="3" 
            class="w-full"
          />
        </div>
      </div>
    </Modal>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { Modal, message, Button, Table, Textarea } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import TeamDetail from './components/team/teamDetail.vue'
import TeamForm from './components/team/teamForm.vue'

// 表格列配置
const columns = [
  {
    title: '班组名称',
    dataIndex: 'team_name',
    key: 'team_name',
    width: 150,
  },
  {
    title: '所属研究所',
    dataIndex: 'institute_name',
    key: 'institute_name',
    width: 150,
  },
  {
    title: '班组长',
    dataIndex: 'leader_name',
    key: 'leader_name',
    width: 120,
  },
  {
    title: '班组人数',
    dataIndex: 'member_count',
    key: 'member_count',
    width: 100,
    formatter: (value: number) => `${value}人`
  },
  {
    title: '主要作业区域',
    dataIndex: 'region_names',
    key: 'region_names',
    width: 200,
    ellipsis: true,
    formatter: (value: string[]) => {
      return value?.join('、') || '--'
    }
  },
  {
    title: '班组状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    formatter: (value: string) => {
      const statusMap = {
        'normal': { text: '正常', color: 'green' },
        'paused': { text: '暂停作业', color: 'orange' },
        'disbanded': { text: '已解散', color: 'red' }
      }
      return statusMap[value]?.text || '--'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'created_time',
    key: 'created_time',
    width: 180,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
  }
]

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
    title: '当前班组',
    dataIndex: 'team_name',
    key: 'current_team',
    width: 150,
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
      visible: (record: any) => record.status !== 'disbanded'
    },
    {
      label: '添加成员',
      props: { type: 'link', size: 'small' },
      action: 'addMember',
      visible: (record: any) => record.status === 'normal'
    },
    {
      label: '移除成员',
      props: { type: 'link', size: 'small' },
      action: 'removeMember',
      visible: (record: any) => record.status === 'normal' && record.member_count > 0
    },
    {
      label: '解散班组',
      props: { type: 'link', size: 'small', danger: true },
      action: 'disband',
      visible: (record: any) => record.status === 'normal'
    }
  ]
}

// 搜索配置
const searchConfig = ref([
  {
    field: 'team_name',
    label: '班组名称',
    type: 'input',
    placeholder: '请输入班组名称',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'institute_id',
    label: '所属研究所',
    type: 'select',
    placeholder: '请选择研究所',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
    },
    colSpan: 6
  },
  {
    field: 'leader_id',
    label: '班组长',
    type: 'select',
    placeholder: '请选择班组长',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '班组状态',
    type: 'select',
    placeholder: '请选择状态',
    props: {
      allowClear: true,
      options: [
        { label: '正常', value: 'normal' },
        { label: '暂停作业', value: 'paused' },
        { label: '已解散', value: 'disbanded' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'region_id',
    label: '作业区域',
    type: 'select',
    placeholder: '请选择作业区域',
    props: {
      allowClear: true,
      options: [],
      showSearch: true,
    },
    colSpan: 6
  },
  {
    field: 'created_time_range',
    label: '创建时间',
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
  const res: any = await getTeamList({
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

  // 处理创建时间范围
  if (params.created_time_range && params.created_time_range.length === 2) {
    formattedParams.created_start_time = params.created_time_range[0]
    formattedParams.created_end_time = params.created_time_range[1]
    delete formattedParams.created_time_range
  }

  return formattedParams
}

// 弹窗状态
const detailModalVisible = ref(false)
const editModalVisible = ref(false)
const addMemberModalVisible = ref(false)
const removeMemberModalVisible = ref(false)
const disbandModalVisible = ref(false)

// 数据状态
const selectedTeam = ref({})
const selectedTeamId = ref('')
const selectedTeamName = ref('')
const currentFormData = ref({})
const isEditMode = ref(false)
const disbandReason = ref('')

// 选项数据
const instituteOptions = ref([])
const regionOptions = ref([])
const leaderOptions = ref([])

// 成员管理相关
const selectedMemberKeys = ref<string[]>([])
const availableMembers = ref<any[]>([])
const teamMemberList = ref<any[]>([])
const currentTeamMembers = ref<string[]>([])

const teamFormRef = ref()

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data)
}

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error)
}

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedTeamId.value = record.id
  selectedTeamName.value = record.team_name
  selectedTeam.value = record

  switch (action) {
    case 'detail':
      showTeamDetail(record)
      break
    case 'edit':
      editTeam(record)
      break
    case 'addMember':
      showAddMember(record)
      break
    case 'removeMember':
      showRemoveMember(record)
      break
    case 'disband':
      showDisbandTeam(record)
      break
  }
}

// 显示班组详情
const showTeamDetail = async (record: any) => {
  selectedTeam.value = record
  detailModalVisible.value = true
}

// 编辑班组
const editTeam = (record: any) => {
  isEditMode.value = true
  currentFormData.value = { ...record }
  editModalVisible.value = true
}

// 新增班组
const handleAddTeam = () => {
  isEditMode.value = false
  currentFormData.value = {}
  editModalVisible.value = true
}

// 显示添加成员弹窗
const showAddMember = async (record: any) => {
  try {
    // 加载可选人员
    const res = await getAvailableMembers()
    availableMembers.value = res.data
    currentTeamMembers.value = record.member_ids || []
    selectedMemberKeys.value = []
    addMemberModalVisible.value = true
  } catch (error) {
    message.error('加载人员列表失败')
  }
}

// 显示移除成员弹窗
const showRemoveMember = async (record: any) => {
  try {
    // 加载班组当前成员
    const res = await getTeamMembers(record.id)
    teamMemberList.value = res.data
    selectedMemberKeys.value = []
    removeMemberModalVisible.value = true
  } catch (error) {
    message.error('加载成员列表失败')
  }
}

// 显示解散班组弹窗
const showDisbandTeam = (record: any) => {
  disbandReason.value = ''
  disbandModalVisible.value = true
}

// 确认添加成员
const confirmAddMember = async () => {
  if (selectedMemberKeys.value.length === 0) {
    message.warning('请选择要添加的成员')
    return
  }

  try {
    // 调用添加成员API
    // await addTeamMembers(selectedTeamId.value, selectedMemberKeys.value)
    message.success(`成功添加 ${selectedMemberKeys.value.length} 名成员`)
    addMemberModalVisible.value = false
    selectedMemberKeys.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('添加成员失败')
  }
}

// 确认移除成员
const confirmRemoveMember = async () => {
  if (selectedMemberKeys.value.length === 0) {
    message.warning('请选择要移除的成员')
    return
  }

  try {
    // 调用移除成员API
    // await removeTeamMembers(selectedTeamId.value, selectedMemberKeys.value)
    message.success(`成功移除 ${selectedMemberKeys.value.length} 名成员`)
    removeMemberModalVisible.value = false
    selectedMemberKeys.value = []
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('移除成员失败')
  }
}

// 确认解散班组
const confirmDisbandTeam = async () => {
  if (!disbandReason.value.trim()) {
    message.warning('请输入解散原因')
    return
  }

  try {
    // 调用解散班组API
    // await disbandTeam(selectedTeamId.value, { reason: disbandReason.value })
    message.success('班组解散成功')
    disbandModalVisible.value = false
    disbandReason.value = ''
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('解散班组失败')
  }
}

// 保存班组数据
const saveTeamData = async (formData: any) => {
  try {
    if (isEditMode.value) {
      message.success('班组信息更新成功')
    } else {
      message.success('班组新增成功')
    }
    editModalVisible.value = false
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error(isEditMode.value ? '更新失败' : '新增失败')
  }
}

// 保存班组
const saveTeam = async () => {
  try {
    if (teamFormRef.value?.handleSubmit) {
      await teamFormRef.value.handleSubmit()
    }
  } catch (error) {
    message.error('提交失败，请重试')
  }
}

// 成员选择变化
const onSelectMemberChange = (selectedKeys: string[]) => {
  selectedMemberKeys.value = selectedKeys
}

// 通用的操作处理
const handleAction = (type: string, record: any) => {
  switch (type) {
    case 'edit':
      editTeam(record)
      break
    case 'addMember':
      showAddMember(record)
      break
    case 'removeMember':
      showRemoveMember(record)
      break
    case 'disbandTeam':
      showDisbandTeam(record)
      break
  }
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedTeam.value = {}
}

// 加载初始化数据
onBeforeMount(async () => {
  try {
    // 加载研究所数据
    const instituteRes = await getInstituteList()
    instituteOptions.value = instituteRes.data.map((item: any) => ({
      label: item.institute_name,
      value: item.id
    }))
    searchConfig.value[1].props.options = instituteOptions.value

    // 加载区域数据
    const regionRes = await getRegionList()
    regionOptions.value = regionRes.data.map((item: any) => ({
      label: item.region_name,
      value: item.id
    }))
    searchConfig.value[4].props.options = regionOptions.value

    // 加载班组长候选人数据
    const leaderRes = await getLeaderCandidates()
    leaderOptions.value = leaderRes.data.map((item: any) => ({
      label: `${item.name} (${item.employee_id})`,
      value: item.id
    }))
    searchConfig.value[2].props.options = leaderOptions.value

  } catch (error) {
    console.error('初始化数据加载失败:', error)
  }
})

// 模拟获取班组列表API
const getTeamList = async (params: any) => {
  const mockData = {
    list: [
      {
        id: '1',
        team_name: '生产一班',
        institute_name: '机械工程研究所',
        leader_name: '张三',
        member_count: 15,
        region_names: ['A车间', 'B区域', '装配线'],
        status: 'normal',
        created_time: '2023-01-15 10:30:00',
        member_ids: ['1', '2', '3']
      },
      {
        id: '2',
        team_name: '质量检测班',
        institute_name: '质量管理研究所',
        leader_name: '李四',
        member_count: 8,
        region_names: ['检验中心', '实验室'],
        status: 'normal',
        created_time: '2023-02-20 14:15:00',
        member_ids: ['4', '5']
      },
      {
        id: '3',
        team_name: '设备维护班',
        institute_name: '设备技术研究所',
        leader_name: '王五',
        member_count: 12,
        region_names: ['维修车间', '设备区'],
        status: 'paused',
        created_time: '2023-03-10 09:00:00',
        member_ids: ['6', '7', '8']
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

// 模拟获取研究所列表
const getInstituteList = async () => {
  return {
    data: [
      { id: '1', institute_name: '机械工程研究所' },
      { id: '2', institute_name: '电子技术研究所' },
      { id: '3', institute_name: '材料科学研究所' },
      { id: '4', institute_name: '质量管理研究所' },
      { id: '5', institute_name: '设备技术研究所' }
    ]
  }
}

// 模拟获取区域列表
const getRegionList = async () => {
  return {
    data: [
      { id: '1', region_name: 'A车间' },
      { id: '2', region_name: 'B区域' },
      { id: '3', region_name: '装配线' },
      { id: '4', region_name: '检验中心' },
      { id: '5', region_name: '实验室' },
      { id: '6', region_name: '维修车间' },
      { id: '7', region_name: '设备区' }
    ]
  }
}

// 模拟获取班组长候选人
const getLeaderCandidates = async () => {
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

// 模拟获取可选人员
const getAvailableMembers = async () => {
  return {
    data: [
      { id: '1', name: '张三', employee_id: '2023001', position: '操作员', team_name: '生产一班' },
      { id: '2', name: '李四', employee_id: '2023002', position: '技术员', team_name: '生产一班' },
      { id: '3', name: '王五', employee_id: '2023003', position: '检验员', team_name: '' },
      { id: '4', name: '赵六', employee_id: '2023004', position: '维修工', team_name: '设备维护班' },
      { id: '5', name: '钱七', employee_id: '2023005', position: '操作员', team_name: '' }
    ]
  }
}

// 模拟获取班组成员
const getTeamMembers = async (teamId: string) => {
  return {
    data: [
      { id: '1', name: '张三', employee_id: '2023001', position: '操作员' },
      { id: '2', name: '李四', employee_id: '2023002', position: '技术员' },
      { id: '3', name: '王五', employee_id: '2023003', position: '检验员' }
    ]
  }
}
</script>

<style scoped>
.team-management-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>