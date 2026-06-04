<template>
  <div class="ri<REDACTED_CREDENTIAL> p-[16px] h-full box-border w-full">
    <!-- 风险分级管控列表 -->
    <SmartTable
      ref="smartTableRef"
      :columns="columns"
      :search-config="searchConfig"
      :action-column="actionColumn"
      :api="getRiskControlList"
      :response-config="responseConfig"
      :pagination="paginationConfig"
      :searchButtonWrapperSpan="4"
      :immediate-search="true"
      @action="handleTableAction"
      searchLayout="horizontal"
    />
    
    <!-- 详情弹窗 -->
    <Modal
      v-model:open="detailModalVisible"
      title="风险详情"
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
    
    <!-- 风险对象详情弹窗 -->
    <Modal
      v-model:open="riskObjectDetailModalVisible"
      title="风险对象详情"
      width="1000px"
      :footer="null"
      @cancel="closeRiskObjectDetailModal"
    >
      <SmartTable
        ref="riskObjectDetailTableRef"
        :columns="riskObjectDetailColumns"
        :data-source="riskObjectDetailData"
        :pagination="riskObjectDetailPaginationConfig"
        :scroll="{ x: 'max-content' }"
      />
    </Modal>
    
    <!-- 风险单元详情弹窗 -->
    <Modal
      v-model:open="riskUnitDetailModalVisible"
      title="风险单元详情"
      width="1000px"
      :footer="null"
      @cancel="closeRiskUnitDetailModal"
    >
      <SmartTable
        ref="riskUnitDetailTableRef"
        :columns="riskUnitDetailColumns"
        :data-source="riskUnitDetailData"
        :pagination="riskUnitDetailPaginationConfig"
        :scroll="{ x: 'max-content' }"
      />
    </Modal>
    
    <!-- 风险事件详情弹窗 -->
    <Modal
      v-model:open="riskEventDetailModalVisible"
      title="风险事件详情"
      width="1000px"
      :footer="null"
      @cancel="closeRiskEventDetailModal"
    >
      <SmartTable
        ref="riskEventDetailTableRef"
        :columns="riskEventDetailColumns"
        :data-source="riskEventDetailData"
        :pagination="riskEventDetailPaginationConfig"
        :scroll="{ x: 'max-content' }"
      />
    </Modal>
    
    <!-- 管控措施详情弹窗 -->
    <Modal
      v-model:open="controlMeasureDetailModalVisible"
      title="管控措施详情"
      width="1000px"
      :footer="null"
      @cancel="closeControlMeasureDetailModal"
    >
      <SmartTable
        ref="controlMeasureDetailTableRef"
        :columns="controlMeasureDetailColumns"
        :data-source="controlMeasureDetailData"
        :pagination="controlMeasureDetailPaginationConfig"
        :scroll="{ x: 'max-content' }"
      />
    </Modal>
    
    <!-- 隐患排查任务详情弹窗 -->
    <Modal
      v-model:open="hiddenDangerTaskDetailModalVisible"
      title="隐患排查任务详情"
      width="1000px"
      :footer="null"
      @cancel="closeHiddenDangerTaskDetailModal"
    >
      <SmartTable
        ref="hiddenDangerTaskDetailTableRef"
        :columns="hiddenDangerTaskDetailColumns"
        :data-source="hiddenDangerTaskDetailData"
        :pagination="hiddenDangerTaskDetailPaginationConfig"
        :scroll="{ x: 'max-content' }"
      />
    </Modal>
    
    <!-- 隐患排查记录详情弹窗 -->
    <Modal
      v-model:open="hiddenDangerRecordDetailModalVisible"
      title="隐患排查记录详情"
      width="1000px"
      :footer="null"
      @cancel="closeHiddenDangerRecordDetailModal"
    >
      <SmartTable
        ref="hiddenDangerRecordDetailTableRef"
        :columns="hiddenDangerRecordDetailColumns"
        :data-source="hiddenDangerRecordDetailData"
        :pagination="hiddenDangerRecordDetailPaginationConfig"
        :scroll="{ x: 'max-content' }"
      />
    </Modal>
    
    <!-- 停工检修记录详情弹窗 -->
    <Modal
      v-model:open="shutdownMaintenanceDetailModalVisible"
      title="停工检修记录详情"
      width="1000px"
      :footer="null"
      @cancel="closeShutdownMaintenanceDetailModal"
    >
      <SmartTable
        ref="shutdownMaintenanceDetailTableRef"
        :columns="shutdownMaintenanceDetailColumns"
        :data-source="shutdownMaintenanceDetailData"
        :pagination="shutdownMaintenanceDetailPaginationConfig"
        :scroll="{ x: 'max-content' }"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { Modal } from 'ant-design-vue'

// 表格引用
const smartTableRef = ref()

// 详情弹窗可见性
const detailModalVisible = ref(false)

// 风险对象详情弹窗可见性
const riskObjectDetailModalVisible = ref(false)

// 风险单元详情弹窗可见性
const riskUnitDetailModalVisible = ref(false)

// 风险事件详情弹窗可见性
const riskEventDetailModalVisible = ref(false)

// 管控措施详情弹窗可见性
const controlMeasureDetailModalVisible = ref(false)

// 隐患排查任务详情弹窗可见性
const hiddenDangerTaskDetailModalVisible = ref(false)

// 隐患排查记录详情弹窗可见性
const hiddenDangerRecordDetailModalVisible = ref(false)

// 停工检修记录详情弹窗可见性
const shutdownMaintenanceDetailModalVisible = ref(false)

// 详情数据
const detailData = ref({})

// 风险对象详情数据
const riskObjectDetailData = ref([])

// 风险单元详情数据
const riskUnitDetailData = ref([])

// 风险事件详情数据
const riskEventDetailData = ref([])

// 管控措施详情数据
const controlMeasureDetailData = ref([])

// 隐患排查任务详情数据
const hiddenDangerTaskDetailData = ref([])

// 隐患排查记录详情数据
const hiddenDangerRecordDetailData = ref([])

// 停工检修记录详情数据
const shutdownMaintenanceDetailData = ref([])

// 风险对象详情表格引用
const riskObjectDetailTableRef = ref()

// 风险单元详情表格引用
const riskUnitDetailTableRef = ref()

// 风险事件详情表格引用
const riskEventDetailTableRef = ref()

// 管控措施详情表格引用
const controlMeasureDetailTableRef = ref()

// 隐患排查任务详情表格引用
const hiddenDangerTaskDetailTableRef = ref()

// 隐患排查记录详情表格引用
const hiddenDangerRecordDetailTableRef = ref()

// 停工检修记录详情表格引用
const shutdownMaintenanceDetailTableRef = ref()

// 表格列配置
const columns = [
  {
    title: '区域名称',
    dataIndex: 'areaName',
    key: 'areaName'
  },
  {
    title: '风险对象数量',
    dataIndex: 'riskObjectCount',
    key: 'riskObjectCount',
    // 添加点击事件处理
    render: ({ text, record }) => {
      return h('a', {
        onClick: () => showRiskObjectDetail(record),
        style: { color: '#4362EF' }
      }, text)
    }
  },
  {
    title: '风险单元数量',
    dataIndex: 'riskUnitCount',
    key: 'riskUnitCount',
    // 添加点击事件处理
    render: ({ text, record }) => {
      return h('a', {
        onClick: () => showRiskUnitDetail(record),
        style: { color: '#4362EF' }
      }, text)
    }
  },
  {
    title: '风险事件数量',
    dataIndex: 'riskEventCount',
    key: 'riskEventCount',
    // 添加点击事件处理
    render: ({ text, record }) => {
      return h('a', {
        onClick: () => showRiskEventDetail(record),
        style: { color: '#4362EF' }
      }, text)
    }
  },
  {
    title: '管控措施数量',
    dataIndex: 'controlMeasureCount',
    key: 'controlMeasureCount',
    // 添加点击事件处理
    render: ({ text, record }) => {
      return h('a', {
        onClick: () => showControlMeasureDetail(record),
        style: { color: '#4362EF' }
      }, text)
    },
  },
  {
    title: '隐患排查任务数量',
    dataIndex: 'hiddenDangerTaskCount',
    key: 'hiddenDangerTaskCount',
    // 添加点击事件处理
    render: ({ text, record }) => {
      return h('a', {
        onClick: () => showHiddenDangerTaskDetail(record),
        style: { color: '#4362EF' }
      }, text)
    }
  },
  {
    title: '隐患排查记录数量',
    dataIndex: 'hiddenDangerRecordCount',
    key: 'hiddenDangerRecordCount',
    // 添加点击事件处理
    render: ({ text, record }) => {
      return h('a', {
        onClick: () => showHiddenDangerRecordDetail(record),
        style: { color: '#4362EF' }
      }, text)
    }
  },
  {
    title: '停工检修记录数量',
    dataIndex: 'shutdownMaintenanceCount',
    key: 'shutdownMaintenanceCount',
    // 添加点击事件处理
    render: ({ text, record }) => {
      return h('a', {
        onClick: () => showShutdownMaintenanceDetail(record),
        style: { color: '#4362EF' }
      }, text)
    }
  }
]

// 风险对象详情列配置
const riskObjectDetailColumns = [
  {
    title: '风险对象名称',
    dataIndex: 'riskObjectName',
    key: 'riskObjectName'
  },
  {
    title: '重大危险源编码',
    dataIndex: 'majorHazardCode',
    key: 'majorHazardCode'
  },
  {
    title: '责任部门',
    dataIndex: 'responsibleDepartment',
    key: 'responsibleDepartment'
  },
  {
    title: '责任人',
    dataIndex: 'responsiblePerson',
    key: 'responsiblePerson'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '是否重大危险源',
    dataIndex: 'isMajorHazard',
    key: 'isMajorHazard',
    customRender: ({ text }) => {
      return text ? '是' : '否'
    }
  }
]

// 风险单元详情列配置
const riskUnitDetailColumns = [
  {
    title: '风险单元名称',
    dataIndex: 'riskUnitName',
    key: 'riskUnitName'
  },
  {
    title: '区域名称',
    dataIndex: 'areaName',
    key: 'areaName'
  },
  {
    title: '风险单元状态',
    dataIndex: 'riskUnitStatus',
    key: 'riskUnitStatus'
  },
  {
    title: '风险对象名称',
    dataIndex: 'riskObjectName',
    key: 'riskObjectName'
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department'
  },
  {
    title: '责任人',
    dataIndex: 'responsiblePerson',
    key: 'responsiblePerson'
  },
  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone'
  }
]

// 风险事件详情列配置
const riskEventDetailColumns = [
  {
    title: '风险事件名称',
    dataIndex: 'riskEventName',
    key: 'riskEventName'
  },
  {
    title: '风险对象名称',
    dataIndex: 'riskObjectName',
    key: 'riskObjectName'
  },
  {
    title: '风险单元名称',
    dataIndex: 'riskUnitName',
    key: 'riskUnitName'
  }
]

// 管控措施详情列配置
const controlMeasureDetailColumns = [
  {
    title: '管控措施名称',
    dataIndex: 'controlMeasureName',
    key: 'controlMeasureName'
  },
  {
    title: '风险对象名称',
    dataIndex: 'riskObjectName',
    key: 'riskObjectName'
  },
  {
    title: '风险单元名称',
    dataIndex: 'riskUnitName',
    key: 'riskUnitName'
  },
  {
    title: '风险事件名称',
    dataIndex: 'riskEventName',
    key: 'riskEventName'
  },
  {
    title: '隐患排查内容',
    dataIndex: 'hiddenDangerContent',
    key: 'hiddenDangerContent'
  },
  {
    title: '管控方式',
    dataIndex: 'controlMethod',
    key: 'controlMethod'
  },
  {
    title: '管控措施分类1',
    dataIndex: 'controlMeasureCategory1',
    key: 'controlMeasureCategory1'
  },
  {
    title: '管控措施分类2',
    dataIndex: 'controlMeasureCategory2',
    key: 'controlMeasureCategory2'
  },
  {
    title: '管控措施分类3',
    dataIndex: 'controlMeasureCategory3',
    key: 'controlMeasureCategory3'
  }
]

// 隐患排查任务详情列配置
const hiddenDangerTaskDetailColumns = [
  {
    title: '隐患排查任务名称',
    dataIndex: 'hiddenDangerTaskName',
    key: 'hiddenDangerTaskName'
  },
  {
    title: '隐患排查内容',
    dataIndex: 'hiddenDangerContent',
    key: 'hiddenDangerContent'
  },
  {
    title: '风险对象名称',
    dataIndex: 'riskObjectName',
    key: 'riskObjectName'
  },
  {
    title: '风险单元名称',
    dataIndex: 'riskUnitName',
    key: 'riskUnitName'
  },
  {
    title: '风险事件名称',
    dataIndex: 'riskEventName',
    key: 'riskEventName'
  },
  {
    title: '管控措施名称',
    dataIndex: 'controlMeasureName',
    key: 'controlMeasureName'
  },
  {
    title: '巡检Maintainer期',
    dataIndex: 'inspectionCycle',
    key: 'inspectionCycle'
  },
  {
    title: '岗位负责人',
    dataIndex: 'postResponsiblePerson',
    key: 'postResponsiblePerson'
  },
  {
    title: '工作日类型',
    dataIndex: 'workDayType',
    key: 'workDayType'
  },
  {
    title: '任务类型',
    dataIndex: 'taskType',
    key: 'taskType'
  },
  {
    title: '任务状态',
    dataIndex: 'taskStatus',
    key: 'taskStatus'
  }
]

// 隐患排查记录详情列配置
const hiddenDangerRecordDetailColumns = [
  {
    title: '隐患排查内容',
    dataIndex: 'hiddenDangerContent',
    key: 'hiddenDangerContent'
  },
  {
    title: '排查时间',
    dataIndex: 'inspectionTime',
    key: 'inspectionTime'
  },
  {
    title: '排查设备IMEI码',
    dataIndex: 'inspectionDeviceIMEI',
    key: 'inspectionDeviceIMEI'
  },
  {
    title: '风险对象名称',
    dataIndex: 'riskObjectName',
    key: 'riskObjectName'
  },
  {
    title: '风险单元名称',
    dataIndex: 'riskUnitName',
    key: 'riskUnitName'
  },
  {
    title: '风险事件名称',
    dataIndex: 'riskEventName',
    key: 'riskEventName'
  },
  {
    title: '管控措施',
    dataIndex: 'controlMeasure',
    key: 'controlMeasure'
  },
  {
    title: '排查人员',
    dataIndex: 'inspector',
    key: 'inspector'
  },
  {
    title: '排查人联系方式',
    dataIndex: 'inspectorContact',
    key: 'inspectorContact'
  },
  {
    title: '是否包保责任人任务',
    dataIndex: 'isContractResponsibleTask',
    key: 'isContractResponsibleTask',
    customRender: ({ text }) => {
      return text ? '是' : '否'
    }
  },
  {
    title: '任务类型',
    dataIndex: 'taskType',
    key: 'taskType'
  },
  {
    title: '包保任务对应内容',
    dataIndex: 'contractTaskContent',
    key: 'contractTaskContent'
  }
]

// 停工检修记录详情列配置
const shutdownMaintenanceDetailColumns = [
  {
    title: '风险对象名称',
    dataIndex: 'riskObjectName',
    key: 'riskObjectName'
  },
  {
    title: '风险单元名称',
    dataIndex: 'riskUnitName',
    key: 'riskUnitName'
  },
  {
    title: '停工检修开始时间',
    dataIndex: 'shutdownMaintenanceStartTime',
    key: 'shutdownMaintenanceStartTime'
  },
  {
    title: '停工检修结束时间',
    dataIndex: 'shutdownMaintenanceEndTime',
    key: 'shutdownMaintenanceEndTime'
  },
  {
    title: '停工检修原因',
    dataIndex: 'shutdownMaintenanceReason',
    key: 'shutdownMaintenanceReason'
  }
]

// 搜索配置
const searchConfig = [
  {
    field: 'areaName',
    label: '区域名称',
    type: 'input',
    colSpan: 6
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

// 风险对象详情分页配置
const riskObjectDetailPaginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据`,
  total: 0
}

// 风险单元详情分页配置
const riskUnitDetailPaginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据`,
  total: 0
}

// 风险事件详情分页配置
const riskEventDetailPaginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据`,
  total: 0
}

// 管控措施详情分页配置
const controlMeasureDetailPaginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据`,
  total: 0
}

// 隐患排查任务详情分页配置
const hiddenDangerTaskDetailPaginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据`,
  total: 0
}

// 隐患排查记录详情分页配置
const hiddenDangerRecordDetailPaginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据`,
  total: 0
}

// 停工检修记录详情分页配置
const shutdownMaintenanceDetailPaginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据`,
  total: 0
}

// 详情表单schema
const detailFormSchema = [
  {
    key: 'areaName',
    label: '区域名称',
    type: 'input'
  },
  {
    key: 'riskObjectCount',
    label: '风险对象数量',
    type: 'input'
  },
  {
    key: 'riskUnitCount',
    label: '风险单元数量',
    type: 'input'
  },
  {
    key: 'riskEventCount',
    label: '风险事件数量',
    type: 'input'
  },
  {
    key: 'controlMeasureCount',
    label: '管控措施数量',
    type: 'input'
  },
  {
    key: 'hiddenDangerTaskCount',
    label: '隐患排查任务数量',
    type: 'input'
  },
  {
    key: 'hiddenDangerRecordCount',
    label: '隐患排查记录数量',
    type: 'input'
  },
  {
    key: 'shutdownMaintenanceCount',
    label: '停工检修记录数量',
    type: 'input'
  }
]

// 模拟API接口（实际开发中需要替换为真实接口）
const getRiskControlList = (params) => {
  // 模拟返回数据
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟数据
      const mockData = [
        {
          id: 1,
          areaName: '生产车间',
          riskObjectCount: 15,
          riskUnitCount: 8,
          riskEventCount: 12,
          controlMeasureCount: 25,
          hiddenDangerTaskCount: 10,
          hiddenDangerRecordCount: 5,
          shutdownMaintenanceCount: 2
        },
        {
          id: 2,
          areaName: '仓储区域',
          riskObjectCount: 10,
          riskUnitCount: 6,
          riskEventCount: 8,
          controlMeasureCount: 18,
          hiddenDangerTaskCount: 7,
          hiddenDangerRecordCount: 3,
          shutdownMaintenanceCount: 1
        },
        {
          id: 3,
          areaName: '主办公区',
          riskObjectCount: 5,
          riskUnitCount: 3,
          riskEventCount: 4,
          controlMeasureCount: 12,
          hiddenDangerTaskCount: 5,
          hiddenDangerRecordCount: 2,
          shutdownMaintenanceCount: 0
        },
      ];

      // 基本过滤功能
      let filteredData = [...mockData];
      
      // 区域名称过滤
      if (params.areaName) {
        filteredData = filteredData.filter(item => 
          item.areaName.includes(params.areaName)
        );
      }
      
      // 风险对象数量过滤
      if (params.riskObjectCount) {
        filteredData = filteredData.filter(item => 
          item.riskObjectCount.toString().includes(params.riskObjectCount)
        );
      }
      
      // 风险单元数量过滤
      if (params.riskUnitCount) {
        filteredData = filteredData.filter(item => 
          item.riskUnitCount.toString().includes(params.riskUnitCount)
        );
      }
      
      // 风险事件数量过滤
      if (params.riskEventCount) {
        filteredData = filteredData.filter(item => 
          item.riskEventCount.toString().includes(params.riskEventCount)
        );
      }
      
      // 管控措施数量过滤
      if (params.controlMeasureCount) {
        filteredData = filteredData.filter(item => 
          item.controlMeasureCount.toString().includes(params.controlMeasureCount)
        );
      }
      
      // 隐患排查任务数量过滤
      if (params.hiddenDangerTaskCount) {
        filteredData = filteredData.filter(item => 
          item.hiddenDangerTaskCount.toString().includes(params.hiddenDangerTaskCount)
        );
      }
      
      // 隐患排查记录数量过滤
      if (params.hiddenDangerRecordCount) {
        filteredData = filteredData.filter(item => 
          item.hiddenDangerRecordCount.toString().includes(params.hiddenDangerRecordCount)
        );
      }
      
      // 停工检修记录数量过滤
      if (params.shutdownMaintenanceCount) {
        filteredData = filteredData.filter(item => 
          item.shutdownMaintenanceCount.toString().includes(params.shutdownMaintenanceCount)
        );
      }

      // 分页处理
      const pageSize = params.pageSize || 10;
      const current = params.current || 1;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredData.slice(start, end);

      resolve({
        data: {
          list: paginatedData,
          total: filteredData.length
        }
      });
    }, 500);
  });
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

// 显示风险对象详情
const showRiskObjectDetail = (record) => {
  // 根据风险对象数量生成相应数量的数据条目
  const count = record.riskObjectCount || 0;
  const mockRiskObjectData = [];
  
  for (let i = 1; i <= count; i++) {
    mockRiskObjectData.push({
      id: i,
      riskObjectName: `风险对象${i}`,
      majorHazardCode: i % 3 === 0 ? `MH00${i}` : '',
      responsibleDepartment: ['生产部', '仓储部', '设备部', '动力部', '技术部'][i % 5],
      responsiblePerson: ['张三', '李四', '王五', '赵六', '孙七'][i % 5],
      status: ['运行中', '正常', '维护中'][i % 3],
      isMajorHazard: i % 3 === 0
    });
  }
  
  riskObjectDetailData.value = mockRiskObjectData;
  riskObjectDetailPaginationConfig.total = mockRiskObjectData.length;
  riskObjectDetailModalVisible.value = true;
}

// 关闭风险对象详情弹窗
const closeRiskObjectDetailModal = () => {
  riskObjectDetailModalVisible.value = false;
  riskObjectDetailData.value = [];
}

// 显示风险单元详情
const showRiskUnitDetail = (record) => {
  // 根据风险单元数量生成相应数量的数据条目
  const count = record.riskUnitCount || 0;
  const mockRiskUnitData = [];
  
  for (let i = 1; i <= count; i++) {
    mockRiskUnitData.push({
      id: i,
      riskUnitName: `风险单元${i}`,
      areaName: record.areaName,
      riskUnitStatus: ['运行中', '正常', '维护中'][i % 3],
      riskObjectName: `风险对象${i}`,
      department: ['生产部', '仓储部', '设备部', '动力部', '技术部'][i % 5],
      responsiblePerson: ['张三', '李四', '王五', '赵六', '孙七'][i % 5],
      phone: `1380013800${i % 10}`
    });
  }
  
  riskUnitDetailData.value = mockRiskUnitData;
  riskUnitDetailPaginationConfig.total = mockRiskUnitData.length;
  riskUnitDetailModalVisible.value = true;
}

// 显示风险事件详情
const showRiskEventDetail = (record) => {
  // 根据风险事件数量生成相应数量的数据条目
  const count = record.riskEventCount || 0;
  const mockRiskEventData = [];
  
  for (let i = 1; i <= count; i++) {
    mockRiskEventData.push({
      id: i,
      riskEventName: `风险事件${i}`,
      riskObjectName: `风险对象${i}`,
      riskUnitName: `风险单元${i}`
    });
  }
  
  riskEventDetailData.value = mockRiskEventData;
  riskEventDetailPaginationConfig.total = mockRiskEventData.length;
  riskEventDetailModalVisible.value = true;
}

// 显示管控措施详情
const showControlMeasureDetail = (record) => {
  // 根据管控措施数量生成相应数量的数据条目
  const count = record.controlMeasureCount || 0;
  const mockControlMeasureData = [];
  
  for (let i = 1; i <= count; i++) {
    mockControlMeasureData.push({
      id: i,
      controlMeasureName: `管控措施${i}`,
      riskObjectName: `风险对象${i}`,
      riskUnitName: `风险单元${i}`,
      riskEventName: `风险事件${i}`,
      hiddenDangerContent: `隐患排查内容${i}`,
      controlMethod: ['自动监控', '自动报警', '人工巡检'][i % 3],
      controlMeasureCategory1: ['工程技术措施', '管理措施', '应急措施'][i % 3],
      controlMeasureCategory2: ['设备维护', '安全防护', '设备点检'][i % 3],
      controlMeasureCategory3: ['预防性维护', '实时监控', '定期维护'][i % 3]
    });
  }
  
  controlMeasureDetailData.value = mockControlMeasureData;
  controlMeasureDetailPaginationConfig.total = mockControlMeasureData.length;
  controlMeasureDetailModalVisible.value = true;
}

// 显示隐患排查任务详情
const showHiddenDangerTaskDetail = (record) => {
  // 根据隐患排查任务数量生成相应数量的数据条目
  const count = record.hiddenDangerTaskCount || 0;
  const mockHiddenDangerTaskData = [];
  
  for (let i = 1; i <= count; i++) {
    mockHiddenDangerTaskData.push({
      id: i,
      hiddenDangerTaskName: `隐患排查任务${i}`,
      hiddenDangerContent: `隐患排查内容${i}`,
      riskObjectName: `风险对象${i}`,
      riskUnitName: `风险单元${i}`,
      riskEventName: `风险事件${i}`,
      controlMeasureName: `管控措施${i}`,
      inspectionCycle: ['每日', '每Maintainer', '每月'][i % 3],
      postResponsiblePerson: ['张三', '李四', '王五', '赵六', '孙七'][i % 5],
      workDayType: ['工作日', '全天'][i % 2],
      taskType: ['日常巡检', '专项检查'][i % 2],
      taskStatus: ['进行中', '已完成', '待处理'][i % 3]
    });
  }
  
  hiddenDangerTaskDetailData.value = mockHiddenDangerTaskData;
  hiddenDangerTaskDetailPaginationConfig.total = mockHiddenDangerTaskData.length;
  hiddenDangerTaskDetailModalVisible.value = true;
}

// 显示隐患排查记录详情
const showHiddenDangerRecordDetail = (record) => {
  // 根据隐患排查记录数量生成相应数量的数据条目
  const count = record.hiddenDangerRecordCount || 0;
  const mockHiddenDangerRecordData = [];
  
  for (let i = 1; i <= count; i++) {
    mockHiddenDangerRecordData.push({
      id: i,
      hiddenDangerContent: `隐患排查内容${i}`,
      inspectionTime: `2023-05-${15 + (i % 15)} 0${9 + (i % 12)}:${30 + (i % 30)}:00`,
      inspectionDeviceIMEI: `86753090123456${i % 10}`,
      riskObjectName: `风险对象${i}`,
      riskUnitName: `风险单元${i}`,
      riskEventName: `风险事件${i}`,
      controlMeasure: `管控措施${i}`,
      inspector: ['王检查员', '李检查员', '张检查员'][i % 3],
      inspectorContact: `1380013800${10 + (i % 90)}`,
      isContractResponsibleTask: i % 2 === 0,
      taskType: ['日常巡检', '专项检查'][i % 2],
      contractTaskContent: i % 2 === 0 ? `包保任务对应内容${i}` : ''
    });
  }
  
  hiddenDangerRecordDetailData.value = mockHiddenDangerRecordData;
  hiddenDangerRecordDetailPaginationConfig.total = mockHiddenDangerRecordData.length;
  hiddenDangerRecordDetailModalVisible.value = true;
}

// 显示停工检修记录详情
const showShutdownMaintenanceDetail = (record) => {
  // 根据停工检修记录数量生成相应数量的数据条目
  const count = record.shutdownMaintenanceCount || 0;
  const mockShutdownMaintenanceData = [];
  
  for (let i = 1; i <= count; i++) {
    mockShutdownMaintenanceData.push({
      id: i,
      riskObjectName: `风险对象${i}`,
      riskUnitName: `风险单元${i}`,
      shutdownMaintenanceStartTime: `2023-06-${1 + (i % 20)} 0${8 + (i % 12)}:00:00`,
      shutdownMaintenanceEndTime: `2023-06-${5 + (i % 20)} 1${5 + (i % 12)}:00:00`,
      shutdownMaintenanceReason: `停工检修原因${i}`
    });
  }
  
  shutdownMaintenanceDetailData.value = mockShutdownMaintenanceData;
  shutdownMaintenanceDetailPaginationConfig.total = mockShutdownMaintenanceData.length;
  shutdownMaintenanceDetailModalVisible.value = true;
}

// 关闭风险单元详情弹窗
const closeRiskUnitDetailModal = () => {
  riskUnitDetailModalVisible.value = false;
  riskUnitDetailData.value = [];
}

// 关闭风险事件详情弹窗
const closeRiskEventDetailModal = () => {
  riskEventDetailModalVisible.value = false;
  riskEventDetailData.value = [];
}

// 关闭管控措施详情弹窗
const closeControlMeasureDetailModal = () => {
  controlMeasureDetailModalVisible.value = false;
  controlMeasureDetailData.value = [];
}

// 关闭隐患排查任务详情弹窗
const closeHiddenDangerTaskDetailModal = () => {
  hiddenDangerTaskDetailModalVisible.value = false;
  hiddenDangerTaskDetailData.value = [];
}

// 关闭隐患排查记录详情弹窗
const closeHiddenDangerRecordDetailModal = () => {
  hiddenDangerRecordDetailModalVisible.value = false;
  hiddenDangerRecordDetailData.value = [];
}

// 关闭停工检修记录详情弹窗
const closeShutdownMaintenanceDetailModal = () => {
  shutdownMaintenanceDetailModalVisible.value = false;
  shutdownMaintenanceDetailData.value = [];
}
</script>

<style scoped>
.page-title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
}
</style>