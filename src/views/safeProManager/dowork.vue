<template>
  <div class="dowork-container">
    <!-- 页面标题 -->
    <!-- <PageHeader
      title="特殊作业管理"
      sub-title="特殊作业信息维护与管理"
      style="padding: 0 0 16px 0"
    /> -->

    <!-- 搜索和操作区域 -->
    <div class="toolbar-container">
      <Space>
        <Button type="primary" @click="handleAdd">新增</Button>
        <Button @click="handleRefresh">刷新</Button>
      </Space>
    </div>

    <!-- 列表区域 -->
    <SmartTable
      ref="tableRef"
      :api="getDoworkList"
      :columns="columns"
      :search-config="searchConfig"
      :action-column="actionColumn"
      :response-config="{ listKey: 'records', totalKey: 'total' }"
      :pagination="{ pageSize: 10 }"
      :scroll="{ x: 'max-content' }"
      @action="handleTableAction"
    />

    <!-- 详情弹窗 -->
    <Modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :confirm-loading="confirmLoading"
      :width="800"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      :footer="modalType === 'view' ? null : undefined"
    >
      <WorkDetail v-if="modalVisible && modalType === 'view'" :ticket-data="detailData" />
      <AdvancedForm
        v-else-if="modalVisible"
        ref="formRef"
        :schema="formSchema"
        :model="formModel"
        mode="form"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { message, Button, Space, Modal, PageHeader, Modal as AntModal } from 'ant-design-vue'
import WorkDetail from './work-detail.vue'
// 模拟数据存储
let mockData = [
  {
    id: 1,
    licenseNumber: 'LIC-2025-001',
    jobContent: '高空作业',
    jobUnit: '施工一部',
    jobArea: 'A区',
    jobStatus: 1,
    plannedJob: '定期维护',
    expectedTime: '2025-12-01 ~ 2025-12-02',
    ticketTime: '2025-11-30'
  },
  {
    id: 2,
    licenseNumber: 'LIC-2025-002',
    jobContent: '电气维修',
    jobUnit: '电气部',
    jobArea: 'B区',
    jobStatus: 2,
    plannedJob: '设备检修',
    expectedTime: '2025-12-05 ~ 2025-12-06',
    ticketTime: '2025-12-01'
  }
]

// API模拟函数
const getDoworkList = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 过滤逻辑
      let filteredData = [...mockData]
      if (params.licenseNumber) {
        filteredData = filteredData.filter(item => 
          item.licenseNumber.toLowerCase().includes(params.licenseNumber.toLowerCase())
        )
      }
      if (params.jobContent) {
        filteredData = filteredData.filter(item => 
          item.jobContent.toLowerCase().includes(params.jobContent.toLowerCase())
        )
      }
      if (params.jobUnit) {
        filteredData = filteredData.filter(item => 
          item.jobUnit.toLowerCase().includes(params.jobUnit.toLowerCase())
        )
      }
      if (params.jobStatus) {
        filteredData = filteredData.filter(item => item.jobStatus === params.jobStatus)
      }

      resolve({
        records: filteredData,
        total: filteredData.length
      })
    }, 300)
  })
}

// 表格引用
const tableRef = ref()

// 表格列配置
const columns = [
  {
    title: '许可证编号',
    dataIndex: 'licenseNumber',
    key: 'licenseNumber'
  },
  {
    title: '作业内容',
    dataIndex: 'jobContent',
    key: 'jobContent'
  },
  {
    title: '作业单位',
    dataIndex: 'jobUnit',
    key: 'jobUnit'
  },
  {
    title: '作业区域',
    dataIndex: 'jobArea',
    key: 'jobArea'
  },
  {
    title: '作业状态',
    dataIndex: 'jobStatus',
    key: 'jobStatus',
    type: 'select',
    options: [
      { label: '待审批', value: 1 },
      { label: '进行中', value: 2 },
      { label: '已完成', value: 3 },
      { label: '已取消', value: 4 }
    ]
  },
  {
    title: '计划作业',
    dataIndex: 'plannedJob',
    key: 'plannedJob'
  },
  {
    title: '预期作业时间',
    dataIndex: 'expectedTime',
    key: 'expectedTime'
  },
  {
    title: '办票时间',
    dataIndex: 'ticketTime',
    key: 'ticketTime'
  }
]

// 搜索配置
const searchConfig = [
  {
    field: 'licenseNumber',
    label: '许可证编号',
    type: 'input'
  },
  {
    field: 'jobContent',
    label: '作业内容',
    type: 'input'
  },
  {
    field: 'jobUnit',
    label: '作业单位',
    type: 'input'
  },
  {
    field: 'jobStatus',
    label: '作业状态',
    type: 'select',
    props: {
      options: [
        { label: '待审批', value: 1 },
        { label: '进行中', value: 2 },
        { label: '已完成', value: 3 },
        { label: '已取消', value: 4 }
      ]
    }
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 200,
  actions: [
    {
      label: '作业详情',
      icon: 'EyeOutlined',
      action: 'view',
      props: { type: 'link' }
    },
    {
      label: '编辑',
      icon: 'EditOutlined',
      action: 'edit',
      props: { type: 'link' }
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      action: 'delete',
      props: { type: 'link', danger: true }
    }
  ]
}

// 弹窗相关状态
const modalVisible = ref(false)
const confirmLoading = ref(false)
const modalType = ref('add') // 'add' 或 'edit' 或 'view'
const detailData = ref({}) // 详情数据

// 弹窗标题计算属性
const modalTitle = computed(() => {
  if (modalType.value === 'add') return '新增特殊作业'
  if (modalType.value === 'edit') return '编辑特殊作业'
  return '查看特殊作业'
})

// 表单引用
const formRef = ref()

// 表单模型
const formModel = reactive({
  id: undefined,
  licenseNumber: '',
  jobContent: '',
  jobUnit: '',
  jobArea: '',
  jobStatus: undefined,
  plannedJob: '',
  expectedStartTime: '',
  expectedEndTime: '',
  ticketTime: ''
})

// 表单配置
const formSchema = [
  {
    key: 'licenseNumber',
    label: '许可证编号',
    type: 'input',
    required: true,
    placeholder: '请输入许可证编号'
  },
  {
    key: 'jobContent',
    label: '作业内容',
    type: 'input',
    required: true,
    placeholder: '请输入作业内容'
  },
  {
    key: 'jobUnit',
    label: '作业单位',
    type: 'input',
    required: true,
    placeholder: '请输入作业单位'
  },
  {
    key: 'jobArea',
    label: '作业区域',
    type: 'input',
    required: true,
    placeholder: '请输入作业区域'
  },
  {
    key: 'jobStatus',
    label: '作业状态',
    type: 'select',
    required: true,
    props: {
      options: [
        { label: '待审批', value: 1 },
        { label: '进行中', value: 2 },
        { label: '已完成', value: 3 },
        { label: '已取消', value: 4 }
      ]
    }
  },
  {
    key: 'plannedJob',
    label: '计划作业',
    type: 'input',
    required: true,
    placeholder: '请输入计划作业'
  },
  {
    key: 'expectedTime',
    label: '预期作业时间',
    type: 'rangePicker',
    props: {
      showTime: true,
      format: 'YYYY-MM-DD',
      placeholder: ['开始时间', '结束时间']
    },
    required: true
  },
  {
    key: 'ticketTime',
    label: '办票时间',
    type: 'datePicker',
    required: true,
    props: {
      showTime: true,
      format: 'YYYY-MM-DD'
    }
  }
]

// 处理新增
const handleAdd = () => {
  modalType.value = 'add'
  // 重置表单
  Object.keys(formModel).forEach(key => {
    if (key === 'id') {
      formModel[key] = undefined
    } else if (key === 'jobStatus') {
      formModel[key] = undefined
    } else {
      formModel[key] = ''
    }
  })
  modalVisible.value = true
}

// 处理刷新
const handleRefresh = () => {
  tableRef.value?.refresh()
}

// 处理表格操作
const handleTableAction = (action, record) => {
  switch (action) {
    case 'view':
      modalType.value = 'view'
      // 构造传递给详情组件的数据，基于实际记录数据动态生成
      detailData.value = {
        ticketNumber: record.licenseNumber || '',
        applicantUnit: record.jobUnit || '',
        applicationTime: record.ticketTime || '',
        workContent: record.jobContent || '',
        confinedSpaceName: record.confinedSpaceName || '未知',
        originalMedium: record.originalMedium || '未知',
        workUnit: record.jobUnit || '',
        workLeader: record.workLeader || '未知',
        guardian: record.guardian || '未知',
        workers: record.workers || '未知',
        relatedTickets: record.relatedTickets || '无',
        riskIdentification: record.riskIdentification || '未知',
        implementationTime: record.expectedTime || ''
      }
      modalVisible.value = true
      break
    case 'edit':
      modalType.value = 'edit'
      // 清空表单
      Object.keys(formModel).forEach(key => {
        if (key === 'id') {
          formModel[key] = undefined
        } else if (key === 'jobStatus') {
          formModel[key] = undefined
        } else {
          formModel[key] = ''
        }
      })
      // 填充数据
      Object.assign(formModel, record)
      // 处理时间范围数据
      if (record.expectedTime && typeof record.expectedTime === 'string') {
        const timeRange = record.expectedTime.split('~')
        formModel.expectedTime = timeRange
      }
      modalVisible.value = true
      break
    case 'delete':
      handleDelete(record)
      // message.info('功能开发中，敬请期待')
      break
  }
}

// 处理删除
const handleDelete = (record) => {
  AntModal.confirm({
    title: '确认删除',
    content: `确定要删除许可证编号为 "${record.licenseNumber}" 的特殊作业记录吗？`,
    okText: '确认',
    cancelText: '取消',
    okType: 'danger',
    onOk() {
      // 执行删除操作
      const index = mockData.findIndex(item => item.id === record.id)
      if (index > -1) {
        mockData.splice(index, 1)
        message.success('删除成功')
        handleRefresh()
      } else {
        message.error('删除失败，记录不存在')
      }
    },
    onCancel() {
      // 取消删除
    }
  })
}

// 处理弹窗确认
const handleModalOk = async () => {
  try {
    confirmLoading.value = true
    // 表单验证
    if (formRef.value) {
      await formRef.value.validate()
    }
    
    // 处理日期时间格式
    const submitData = { ...formModel }
    if (submitData.expectedTime && Array.isArray(submitData.expectedTime)) {
      submitData.expectedTime = `${submitData.expectedTime[0]} ~ ${submitData.expectedTime[1]}`
    }
    if (submitData.ticketTime && submitData.ticketTime.format) {
      submitData.ticketTime = submitData.ticketTime
    }
    
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (modalType.value === 'add') {
      // 新增操作
      const newRecord = {
        ...submitData,
        id: Date.now() // 使用时间戳作为临时ID
      }
      mockData.unshift(newRecord)
      message.success('新增成功')
    } else if (modalType.value === 'edit') {
      // 编辑操作
      const index = mockData.findIndex(item => item.id === formModel.id)
      if (index > -1) {
        mockData[index] = { ...mockData[index], ...submitData }
        message.success('编辑成功')
      } else {
        message.error('编辑失败，记录不存在')
      }
    }
    
    modalVisible.value = false
    handleRefresh()
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    confirmLoading.value = false
  }
}

// 处理弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
}
</script>

<style scoped>
.dowork-container {
  padding: 16px;
  /* background: #fff; */
}

.toolbar-container {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>