<template>
  <div class="operation-log-container p-[16px] h-full box-border w-full">
    <!-- 操作日志列表 -->
    <SmartTable
      ref="smartTableRef"
      :columns="columns"
      :search-config="searchConfig"
      :action-column="actionColumn"
      :api="getOperationLogList"
      :response-config="responseConfig"
      :pagination="paginationConfig"
      :searchButtonWrapperSpan="4"
      @action="handleTableAction"
      searchLayout="horizontal"
    />
    
    <!-- 详情弹窗 -->
    <Modal
      v-model:open="detailModalVisible"
      title="操作日志详情"
      width="800px"
      :footer="null"
      @cancel="closeDetailModal"
    >
      <AdvancedForm
        :schema="detailFormSchema"
        :model="detailData"
        mode="descriptions"
        :column="2"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Modal } from 'ant-design-vue'

// 表格引用
const smartTableRef = ref()

// 详情弹窗可见性
const detailModalVisible = ref(false)

// 详情数据
const detailData = ref({})

// 表格列配置
const columns = [
  {
    title: '操作标题',
    dataIndex: 'operationTitle',
    key: 'operationTitle'
  },
  {
    title: '请求URI',
    dataIndex: 'requestUri',
    key: 'requestUri'
  },
  {
    title: '操作账号',
    dataIndex: 'operationAccount',
    key: 'operationAccount'
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator'
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    key: 'operationTime',
    type: 'date'
  }
]

// 搜索配置
const searchConfig = [
  {
    field: 'operationTitle',
    label: '操作标题',
    type: 'input',
    colSpan: 6
  },
  {
    field: 'requestUri',
    label: '请求URI',
    type: 'input',
    colSpan: 6
  },
  {
    field: 'operationAccount',
    label: '操作账号',
    type: 'input',
    colSpan: 6
  },
  {
    field: 'operator',
    label: '操作人',
    type: 'input',
    colSpan: 6
  },
  {
    field: 'operationTime',
    label: '操作时间',
    type: 'date-range',
    colSpan: 8
  }
]

// 操作列配置（只有查看功能）
const actionColumn = {
  title: '操作',
  width: 100,
  actions: [
    {
      label: '查看',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    }
  ]
}

// 响应配置
const responseConfig = {
  listKey: 'data.list',
  totalKey: 'data.total'
}

// 分页配置
const paginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据`
}

// 详情表单schema
const detailFormSchema = [
  {
    key: 'operationTitle',
    label: '操作标题',
    type: 'input'
  },
  {
    key: 'requestUri',
    label: '请求URI',
    type: 'input'
  },
  {
    key: 'operationAccount',
    label: '操作账号',
    type: 'input'
  },
  {
    key: 'operator',
    label: '操作人',
    type: 'input'
  },
  {
    key: 'operationTime',
    label: '操作时间',
    type: 'datePicker'
  }
]

// 模拟API接口（实际开发中需要替换为真实接口）
const getOperationLogList = (params) => {
  // 模拟返回数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          list: [
            {
              id: 1,
              operationTitle: '用户登录',
              requestUri: '/api/auth/login',
              operationAccount: 'admin',
              operator: '系统管理员',
              operationTime: '2025-12-04 09:30:15'
            },
            {
              id: 2,
              operationTitle: '隐患排查',
              requestUri: '/api/hiddendanger/investigate',
              operationAccount: 'inspector01',
              operator: '张三',
              operationTime: '2025-12-04 10:15:20'
            },
            {
              id: 3,
              operationTitle: '数据导出',
              requestUri: '/api/report/export',
              operationAccount: 'manager01',
              operator: '李四',
              operationTime: '2025-12-04 14:20:30'
            }
          ],
          total: 3
        }
      })
    }, 500)
  })
}

// 处理表格操作
const handleTableAction = (action, record) => {
  switch (action) {
    case 'detail':
      showDetail(record)
      break
    default:
      break
  }
}

// 显示详情
const showDetail = (record) => {
  detailData.value = { ...record }
  detailModalVisible.value = true
}

// 关闭详情弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false
  detailData.value = {}
}
</script>

<style scoped>
.operation-log-container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
</style>