<template>
  <div class="invest-hidedanger-container p-[16px] h-full box-border w-full">
    <!-- 隐患列表 -->
    <SmartTable
      ref="smartTableRef"
      :columns="columns"
      :search-config="searchConfig"
      :action-column="actionColumn"
      :api="getHiddenDangerList"
      :response-config="responseConfig"
      :pagination="paginationConfig"
      :searchButtonWrapperSpan="4"
      @action="handleTableAction"
      searchLayout="horizontal"
    />
    
    <!-- 详情弹窗 -->
    <Modal
      v-model:open="detailModalVisible"
      title="隐患详情"
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
    title: '区域名称',
    dataIndex: 'areaName',
    key: 'areaName',
    
  },
  {
    title: '隐患名称',
    dataIndex: 'hiddenDangerName',
    key: 'hiddenDangerName'
  },
  {
    title: '隐患级别',
    dataIndex: 'hiddenDangerLevel',
    key: 'hiddenDangerLevel',
    type: 'tag',
    options: [
      { label: '一般隐患', value: '1', color: 'green' },
      { label: '重大隐患', value: '2', color: 'red' }
    ]
  },
  {
    title: '隐患来源',
    dataIndex: 'hiddenDangerSource',
    key: 'hiddenDangerSource'
  },
  {
    title: '责任人',
    dataIndex: 'responsiblePerson',
    key: 'responsiblePerson'
  },
  {
    title: '排查时间',
    dataIndex: 'inspectTime',
    key: 'inspectTime',
    type: 'date'
  },
  {
    title: '整改时间',
    dataIndex: 'rectifyTime',
    key: 'rectifyTime',
    type: 'date'
  },
  {
    title: '验收人',
    dataIndex: 'acceptor',
    key: 'acceptor'
  },
  {
    title: '验收时间',
    dataIndex: 'acceptTime',
    key: 'acceptTime',
    type: 'date'
  },
  {
    title: '整改资金',
    dataIndex: 'rectifyFund',
    key: 'rectifyFund'
  },
  {
    title: '整改期限',
    dataIndex: 'rectifyDeadline',
    key: 'rectifyDeadline',
    type: 'date'
  },
  {
    title: '隐患状态',
    dataIndex: 'hiddenDangerStatus',
    key: 'hiddenDangerStatus',
    type: 'tag',
    options: [
      { label: '待整改', value: '1', color: 'orange' },
      { label: '整改中', value: '2', color: 'blue' },
      { label: '已完成', value: '3', color: 'green' },
      { label: '已关闭', value: '4', color: 'gray' }
    ]
  },
  {
    title: '数据来源',
    dataIndex: 'dataSource',
    key: 'dataSource'
  }
]

// 搜索配置
const searchConfig = [
  {
    field: 'areaName',
    label: '区域名称',
    type: 'input',
    colSpan: 6
  },
  {
    field: 'hiddenDangerName',
    label: '隐患名称',
    type: 'input',
    colSpan: 6
  },
    {
    field: 'inspectTime',
    label: '排查时间',
    type: 'date-range',
    colSpan: 6
  },
  {
    field: 'rectifyDeadline',
    label: '整改期限',
    type: 'date-range',
    colSpan: 6
  },
  {
    field: 'hiddenDangerLevel',
    label: '隐患级别',
    type: 'select',
    props: {
      options: [
        { label: '一般隐患', value: '1' },
        { label: '重大隐患', value: '2' }
      ]
    },
    colSpan: 5
  },
  {
    field: 'hiddenDangerSource',
    label: '隐患来源',
    type: 'input',
    colSpan: 5
  },
  {
    field: 'dataSource',
    label: '数据来源',
    type: 'select',
    props: {
      options: [
        { label: '人工录入', value: '人工录入' },
        { label: '系统检测', value: '系统检测' }
      ]
    },
    colSpan: 5
  },
  {
    field: 'hiddenDangerStatus',
    label: '隐患状态',
    type: 'select',
    props: {
      options: [
        { label: '待整改', value: '1' },
        { label: '整改中', value: '2' },
        { label: '已完成', value: '3' },
        { label: '已关闭', value: '4' }
      ]
    },
    colSpan: 5
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 100,
  actions: [
    {
      label: '详情',
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
    key: 'areaName',
    label: '区域名称',
    type: 'input'
  },
  {
    key: 'hiddenDangerName',
    label: '隐患名称',
    type: 'input'
  },
  {
    key: 'hiddenDangerLevel',
    label: '隐患级别',
    type: 'select',
    props: {
      options: [
        { label: '一般隐患', value: '1' },
        { label: '重大隐患', value: '2' }
      ]
    }
  },
  {
    key: 'hiddenDangerSource',
    label: '隐患来源',
    type: 'input'
  },
  {
    key: 'responsiblePerson',
    label: '责任人',
    type: 'input'
  },
  {
    key: 'inspectTime',
    label: '排查时间',
    type: 'datePicker'
  },
  {
    key: 'rectifyTime',
    label: '整改时间',
    type: 'datePicker'
  },
  {
    key: 'acceptor',
    label: '验收人',
    type: 'input'
  },
  {
    key: 'acceptTime',
    label: '验收时间',
    type: 'datePicker'
  },
  {
    key: 'rectifyFund',
    label: '整改资金',
    type: 'input'
  },
  {
    key: 'rectifyDeadline',
    label: '整改期限',
    type: 'datePicker'
  },
  {
    key: 'hiddenDangerStatus',
    label: '隐患状态',
    type: 'select',
    props: {
      options: [
        { label: '待整改', value: '1' },
        { label: '整改中', value: '2' },
        { label: '已完成', value: '3' },
        { label: '已关闭', value: '4' }
      ]
    }
  },
  {
    key: 'dataSource',
    label: '数据来源',
    type: 'input'
  }
]

// 模拟API接口（实际开发中需要替换为真实接口）
const getHiddenDangerList = (params) => {
  // 模拟返回数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          list: [
            {
              id: 1,
              areaName: '生产车间',
              hiddenDangerName: '设备老化隐患',
              hiddenDangerLevel: '2',
              hiddenDangerSource: '定期检查',
              responsiblePerson: '张三',
              inspectTime: '2025-11-01',
              rectifyTime: '2025-11-05',
              acceptor: '李四',
              acceptTime: '2025-11-10',
              rectifyFund: '5000元',
              rectifyDeadline: '2025-11-15',
              hiddenDangerStatus: '3',
              dataSource: '人工录入'
            },
            {
              id: 2,
              areaName: '仓储区域',
              hiddenDangerName: '安全通道堵塞',
              hiddenDangerLevel: '1',
              hiddenDangerSource: '巡查发现',
              responsiblePerson: '王五',
              inspectTime: '2025-11-02',
              rectifyTime: '2025-11-08',
              acceptor: '赵六',
              acceptTime: '2025-11-12',
              rectifyFund: '2000元',
              rectifyDeadline: '2025-11-20',
              hiddenDangerStatus: '2',
              dataSource: '系统检测'
            }
          ],
          total: 2
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
.page-title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
}
</style>