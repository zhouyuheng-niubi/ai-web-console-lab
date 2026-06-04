<template>
 <!-- 页面标题和操作栏 -->
         <div class="flex flex-col pt-[30px] pb-[30px] px-[30px]">
    <div class="mb-[30px] flex  items-center flex-shrink-0">
        <Button class="flex  items-center" type="primary" @click="handleAddPersonnel">
          <PlusOutlined />
          新增人员
        </Button>
      
    </div>
  <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
    <SmartTable :api="apiConfig" :columns="columns" :search-config="searchConfig" :responseConfig="responseConfig"
      :pagination="paginationConfig" :paramsFormatter="paramsFormatter" searchLayout="horizontal"
      @loadSuccess="handleLoadSuccess" @loadError="handleLoadError" :searchButtonWrapperSpan="6" :immediateSearch="true"
      :actionColumn="actionColumn" @action="handleTableAction">
      <template #header-left>
        <Button type="primary" @click="handleAddPersonnel">
          <template #icon>
            <PlusOutlined />
          </template>
          新增人员
        </Button>
      </template>
    </SmartTable>

    <!-- 人员详情弹窗 -->
    <Modal title="人员详情" v-model:open="detailModalVisible" width="800px" :footer="null">
      <PersonnelDetail :personnel-data="selectedPersonnel" @edit="(val) => handleAction('edit', val)"
        @resign="(val) => handleAction('resign', val)" @resetPassword="(val) => handleAction('resetPassword', val)"
        @close="closeDetailModal" />
    </Modal>

    <!-- 新增/编辑人员弹窗 -->
    <Modal :title="isEditMode ? '编辑人员' : '新增人员'" v-model:open="editModalVisible" width="700px" @ok="savePersonnel">
      <PersonnelForm ref="personnelFormRef" :form-data="currentFormData" :is-edit="isEditMode"
        :team-options="teamOptions" :position-options="positionOptions" @save="savePersonnelData" />
    </Modal>

    <!-- 离职登记弹窗 -->
    <Modal title="离职登记" v-model:open="resignModalVisible" width="500px" @ok="confirmResign">
      <div style="padding: 20px 0;">
        <p>确定要办理 <strong>{{ selectedPersonnelName }}</strong> 的离职手续吗？</p>
        <div style="margin-top: 15px;">
          <label style="display: block; margin-bottom: 8px;">离职原因：</label>
          <Textarea v-model:value="resignReason" placeholder="请输入离职原因" :maxlength="200" :rows="4"
            class="h-full w-full" />
        </div>
        <div style="margin-top: 15px;">
          <label style="display: block; margin-bottom: 8px;">离职日期：</label>
          <DatePicker v-model:value="resignDate" style="width: 100%" :format="dateFormat" />
        </div>
      </div>
    </Modal>

    <!-- 重置密码确认弹窗 -->
    <Modal title="重置密码确认" v-model:open="resetPasswordModalVisible" width="400px" @ok="confirmResetPassword">
      <div style="padding: 20px 0; text-align: center;">
        <p>确定要重置 <strong>{{ selectedPersonnelName }}</strong> 的密码吗？</p>
        <p>重置后密码将恢复为默认密码</p>
      </div>
    </Modal>

    <!-- 健康档案弹窗 -->
    <Modal title="健康档案" v-model:open="healthRecordModalVisible" width="900px" height="600px" :footer="null">
      <HealthRecord :personnel-id="selectedPersonnelId" :personnel-name="selectedPersonnelName"
        @close="closeHealthRecordModal" />
    </Modal>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue'
import { Modal, message, Textarea, DatePicker, Button } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import PersonnelDetail from './components/personnel/personnelDetail.vue'
import PersonnelForm from './components/personnel/personnelForm.vue'
import HealthRecord from './components/personnel/healthRecord.vue'

// 表格列配置
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    formatter: (value: string) => {
      const genderMap = {
        '1': '男',
        '2': '女'
      }
      return genderMap[value] || '--'
    }
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width: 120,
  },
  {
    title: '身份证号',
    dataIndex: 'id_card',
    key: 'id_card',
    width: 180,
  },
  {
    title: '所属班组',
    dataIndex: 'team_name',
    key: 'team_name',
    width: 120,
  },
  {
    title: '岗位',
    dataIndex: 'position',
    key: 'position',
    width: 120,
  },
  {
    title: '入职时间',
    dataIndex: 'entry_date',
    key: 'entry_date',
    width: 120,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    // type: 'tag',
    formatter: (value: string) => {
      const statusMap = {
        '1': { text: '在职', color: 'green' },
        '2': { text: '离职', color: 'red' }
      }
      return statusMap[value]?.text || '--'
    }
  },
  {
    title: '应急联系人',
    dataIndex: 'emergency_contact',
    key: 'emergency_contact',
    width: 150,
    formatter: (value: any) => {
      return value ? `${value.name}/${value.phone}` : '--'
    }
  },
  {
    title: '健康档案',
    dataIndex: 'health_record_count',
    key: 'health_record_count',
    width: 100,
    formatter: (value: number) => {
      return value > 0 ? `${value}份` : '无'
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
      label: '编辑',
      props: { type: 'link', size: 'small' },
      action: 'edit',
      visible: (record: any) => record.status === '1' // 在职人员可编辑
    },
    {
      label: '离职登记',
      props: { type: 'link', size: 'small', danger: true },
      action: 'resign',
      visible: (record: any) => record.status === '1' // 在职人员可离职
    },
    // {
    //   label: '重置密码',
    //   props: { type: 'link', size: 'small' },
    //   action: 'resetPassword',
    //   visible: (record: any) => record.status === '1' // 在职人员可重置密码
    // },
    // {
    //   label: '健康档案',
    //   props: { type: 'link', size: 'small' },
    //   action: 'healthRecord'
    // }
    // {
    //   label: '离职登记',
    //   props: { type: 'link', size: 'small' },
    //   action: 'healthRecord'
    // }
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
    field: 'phone',
    label: '联系电话',
    type: 'input',
    placeholder: '请输入联系电话',
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
    field: 'position',
    label: '岗位',
    type: 'select',
    placeholder: '请选择岗位',
    props: {
      allowClear: true,
      options: []
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
        { label: '在职', value: '1' },
        { label: '离职', value: '2' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'entry_date_range',
    label: '入职时间',
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
  console.log('API调用参数:', params)
  const { pageNum, pageSize, ...rest } = params
  // 这里调用实际的API
  const res: any = await getPersonnelList({
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

  // 处理入职时间范围参数
  if (params.entry_date_range && Array.isArray(params.entry_date_range) && params.entry_date_range.length === 2) {
    formattedParams.entry_start_date = params.entry_date_range[0]
    formattedParams.entry_end_date = params.entry_date_range[1]
    delete formattedParams.entry_date_range
  }

  console.log('格式化后的参数:', formattedParams)
  return formattedParams
}

// 弹窗状态
const detailModalVisible = ref(false)
const editModalVisible = ref(false)
const resignModalVisible = ref(false)
const resetPasswordModalVisible = ref(false)
const healthRecordModalVisible = ref(false)

// 数据状态
const selectedPersonnel = ref({})
const selectedPersonnelId = ref('')
const selectedPersonnelName = ref('')
const selectedRecord = ref({})
const currentFormData = ref({})
const isEditMode = ref(false)
const resignReason = ref('')
const resignDate = ref(dayjs())
const dateFormat = 'YYYY-MM-DD'
const teamOptions = ref([])
const positionOptions = ref([])
const personnelFormRef = ref()

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
  selectedPersonnelId.value = record.id
  selectedPersonnelName.value = record.name

  switch (action) {
    case 'detail':
      showPersonnelDetail(record)
      break
    case 'edit':
      editPersonnel(record)
      break
    case 'resign':
      showResignDialog(record)
      break
    case 'resetPassword':
      showResetPasswordDialog(record)
      break
    case 'healthRecord':
      showHealthRecord(record)
      break
  }
}

// 显示人员详情
const showPersonnelDetail = async (record: any) => {
  try {
    // 这里调用获取人员详情API
    // const res = await getPersonnelDetail(record.id)
    // selectedPersonnel.value = res.data
    selectedPersonnel.value = record
    detailModalVisible.value = true
  } catch (error) {
    message.error('获取人员详情失败')
    console.error(error)
  }
}

// 编辑人员
const editPersonnel = (record: any) => {
  isEditMode.value = true
  currentFormData.value = { ...record }
  editModalVisible.value = true
}

// 新增人员
const handleAddPersonnel = () => {
  isEditMode.value = false
  currentFormData.value = {}
  editModalVisible.value = true
}

// 显示离职登记弹窗
const showResignDialog = (record: any) => {
  resignDate.value = dayjs()
  resignReason.value = ''
  resignModalVisible.value = true
}

// 确认离职
const confirmResign = async () => {
  if (!resignReason.value.trim()) {
    message.warning('请输入离职原因')
    return
  }

  try {
    // 调用离职API
    // await resignPersonnel(selectedPersonnelId.value, {
    //   reason: resignReason.value,
    //   resign_date: resignDate.value
    // })
    message.success('离职登记成功')
    resignModalVisible.value = false
    resignReason.value = ''
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error('离职登记失败')
    console.error(error)
  }
}

// 显示重置密码弹窗
const showResetPasswordDialog = (record: any) => {
  resetPasswordModalVisible.value = true
}

// 确认重置密码
const confirmResetPassword = async () => {
  try {
    // 调用重置密码API
    // await resetPassword(selectedPersonnelId.value)
    message.success('密码重置成功')
    resetPasswordModalVisible.value = false
    // 可以提示新密码
    message.info('新密码已发送到用户手机')
  } catch (error) {
    message.error('密码重置失败')
    console.error(error)
  }
}

// 显示健康档案
const showHealthRecord = (record: any) => {
  healthRecordModalVisible.value = true
}

// 保存人员数据
const savePersonnelData = async (formData: any) => {
  try {
    if (isEditMode.value) {
      // 调用编辑API
      // await updatePersonnel(formData)
      message.success('人员信息更新成功')
    } else {
      // 调用新增API
      // await addPersonnel(formData)
      message.success('人员新增成功')
    }
    editModalVisible.value = false
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'))
  } catch (error) {
    message.error(isEditMode.value ? '更新失败' : '新增失败')
    console.error(error)
  }
}

// 保存人员（表单提交）
const savePersonnel = async () => {
  try {
    // 调用表单组件的提交方法
    if (personnelFormRef.value && personnelFormRef.value.handleSubmit) {
      await personnelFormRef.value.handleSubmit()
    }
  } catch (error) {
    console.error('提交失败:', error)
    message.error('提交失败，请重试')
  }
}

// 通用的操作处理
const handleAction = (type: string, record: any) => {
  switch (type) {
    case 'edit':
      editPersonnel(record)
      break
    case 'resign':
      showResignDialog(record)
      break
    case 'resetPassword':
      confirmResetPassword()
      break
  }
}

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  selectedPersonnel.value = {}
}

const closeHealthRecordModal = () => {
  healthRecordModalVisible.value = false
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

    // 加载岗位数据
    const positionRes = await getPositionList()
    positionOptions.value = positionRes.data.map((position: any) => ({
      label: position.position_name,
      value: position.position_code
    }))
    searchConfig.value[3].props.options = positionOptions.value

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

// 模拟获取岗位列表API
const getPositionList = async () => {
  return {
    data: [
      { position_code: 'manager', position_name: '经理' },
      { position_code: 'supervisor', position_name: '主管' },
      { position_code: 'operator', position_name: '操作员' },
      { position_code: 'technician', position_name: '技术员' },
      { position_code: 'inspector', position_name: '检验员' },
      { position_code: 'safety_officer', position_name: '安全员' }
    ]
  }
}

// 模拟获取人员列表API
const getPersonnelList = async (params: any) => {
  // 模拟数据
  const mockData = {
    list: [
      {
        id: '1',
        name: '张三',
        gender: '1',
        phone: '10000000000',
        id_card: '<REDACTED_ID>',
        team_name: '生产一班',
        position: '操作员',
        entry_date: '2020-01-15',
        status: '1',
        emergency_contact: { name: '张父', phone: '10000000000' },
        health_record_count: 3
      },
      {
        id: '2',
        name: '李四',
        gender: '2',
        phone: '10000000000',
        id_card: '<REDACTED_ID>',
        team_name: '设备维护班',
        position: '技术员',
        entry_date: '2019-05-20',
        status: '1',
        emergency_contact: { name: '李母', phone: '10000000000' },
        health_record_count: 2
      },
      {
        id: '3',
        name: '王五',
        gender: '1',
        phone: '10000000000',
        id_card: '<REDACTED_ID>',
        team_name: '质量检测班',
        position: '检验员',
        entry_date: '2021-03-10',
        status: '2',
        emergency_contact: { name: '王兄', phone: '10000000000' },
        health_record_count: 1
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
.personnel-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

:deep(.ant-table-cell) {
  padding: 12px 8px;
}

:deep(.ant-tag) {
  margin-right: 0;
}
</style>