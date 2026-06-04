<template>
  <div class="approval-container">
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
    </smartTable>

    <!-- 审批详情弹窗 -->
    <Modal title="审批详情" v-model:open="detailModalVisible" width="900px" :footer="null">
      <ApprovalDetail 
        :approval-data="selectedApproval"
        :isDarkTheme="false"
        :show-header="false"
        @approve="handleApprove"
        @reject="handleReject"
        @close="closeDetailModal"
      />            
    </Modal>

    <!-- 审批通过确认弹窗 -->
    <Modal title="审批通过确认" v-model:open="approveModalVisible" width="500px" @ok="confirmApprove">
      <div style="padding: 20px 0;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 16px; margin-bottom: 8px;">确定要通过此审批吗？</div>
          <div style="font-weight: 600; color: #1890ff;">{{ selectedApprovalTitle }}</div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 14px; color: #666; margin-bottom: 8px;">审批意见：</div>
          <Textarea 
            v-model:value="approveRemark"
            placeholder="请输入审批通过的意见（可选）"
            :rows="4"
            :maxlength="200"
          />
        </div>
      </div>
    </Modal>

    <!-- 审批驳回确认弹窗 -->
    <Modal title="审批驳回确认" v-model:open="rejectModalVisible" width="500px" @ok="confirmReject">
      <div style="padding: 20px 0;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 16px; margin-bottom: 8px;">确定要驳回此审批吗？</div>
          <div style="font-weight: 600; color: #f5222d;">{{ selectedApprovalTitle }}</div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 14px; color: #666; margin-bottom: 8px;">驳回原因：</div>
          <Textarea 
            v-model:value="rejectReason"
            placeholder="请输入驳回原因"
            :rows="4"
            :maxlength="200"
            :show-count="true"
          />
        </div>

        <div>
          <div style="font-size: 14px; color: #666; margin-bottom: 8px;">整改建议：</div>
          <Textarea 
            v-model:value="rectificationSuggestions"
            placeholder="请输入整改建议（可选）"
            :rows="3"
            :maxlength="200"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { getApprovalList, getApprovalDetail, approveApproval, rejectApproval } from '@/api/safeProManager/approval';
import { ref, onBeforeMount } from 'vue'
import dayjs from 'dayjs'
import { Modal, message, Textarea } from 'ant-design-vue';
import ApprovalDetail from '@/components/approval/ApprovalDetail.vue';

// 表格列配置
const columns = [
  {
    title: '审批事项',
    dataIndex: 'approval_type',
    key: 'approval_type',
    width: 150,
    // type: 'tag',
    formatter: (value: string) => {
      const typeMap = {
        'equipment_compliance': '设备合规性审批',
        'qualification_extension': '资质延期审批',
        'safety_training': '安全培训审批',
        'equipment_maintenance': '设备维修审批'
      };
      return typeMap[value] || value;
    }
  },
  {
    title: '申请人',
    dataIndex: 'applicant_name',
    key: 'applicant_name',
    width: 120,
  },
  {
    title: '申请部门',
    dataIndex: 'department',
    key: 'department',
    width: 120,
  },
  {
    title: '申请时间',
    dataIndex: 'apply_time',
    key: 'apply_time',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
    width: 160,
  },
  {
    title: '申请会议',
    dataIndex: 'meeting_name',
    key: 'meeting_name',
    width: 180,
  },
  {
    title: '审批状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    // type: 'tag',
    formatter: (value: string) => {
      const statusMap = {
        'pending': { text: '待审批', color: 'orange' },
        'approved': { text: '已通过', color: 'green' },
        'rejected': { text: '已驳回', color: 'red' },
        'withdrawn': { text: '已撤回', color: 'default' }
      };
      const config = statusMap[value] || { text: '未知', color: 'default' };
      return config.text;
    }
  },
  {
    title: '当前审批人',
    dataIndex: 'current_approver',
    key: 'current_approver',
    width: 120,
  },
  {
    title: '紧急程度',
    dataIndex: 'urgency_level',
    key: 'urgency_level',
    width: 100,
    // type: 'tag',
    formatter: (value: string) => {
      const levelMap = {
        'normal': '一般',
        'urgent': '紧急',
        'emergency': '特紧急'
      };
      return levelMap[value] || value;
    }
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 200,
  fixed: 'right',
  actions: [
    {
      label: '查看详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label: '通过',
      props: { type: 'link', size: 'small' },
      action: 'approve',
      visible: (record: any) => record.status === 'pending' && record.can_approve
    },
    {
      label: '驳回',
      props: { type: 'link', size: 'small', danger: true },
      action: 'reject',
      visible: (record: any) => record.status === 'pending' && record.can_approve
    }
  ]
};

// 搜索配置
const searchConfig = ref([
  {
    field: 'approval_type',
    label: '审批事项',
    type: 'select',
    placeholder: '请选择审批事项',
    props: {
      allowClear: true,
      options: [
        { label: '设备合规性审批', value: 'equipment_compliance' },
        { label: '资质延期审批', value: 'qualification_extension' },
        { label: '安全培训审批', value: 'safety_training' },
        { label: '设备维修审批', value: 'equipment_maintenance' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'applicant_name',
    label: '申请人',
    type: 'input',
    placeholder: '请输入申请人姓名',
    props: {
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'department',
    label: '申请部门',
    type: 'select',
    placeholder: '请选择申请部门',
    props: {
      allowClear: true,
      options: <any>[],
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '审批状态',
    type: 'select',
    placeholder: '请选择审批状态',
    props: {
      allowClear: true,
      options: [
        { label: '待审批', value: 'pending' },
        { label: '已通过', value: 'approved' },
        { label: '已驳回', value: 'rejected' },
        { label: '已撤回', value: 'withdrawn' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'urgency_level',
    label: '紧急程度',
    type: 'select',
    placeholder: '请选择紧急程度',
    props: {
      allowClear: true,
      options: [
        { label: '一般', value: 'normal' },
        { label: '紧急', value: 'urgent' },
        { label: '特紧急', value: 'emergency' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'timeRange',
    label: '申请时间',
    type: 'date-range',
    placeholder: ['开始时间', '结束时间'],
    props: {
      showTime: { format: 'HH:mm' },
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: "YYYY-MM-DD HH:mm"
    },
    colSpan: 6
  }
]);

// 响应配置
const responseConfig = {
  listKey: 'list',
  totalKey: 'pagination.total',
};

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
};

// API配置
const apiConfig = async (params: any) => {
  console.log('API调用参数:', params);
  const { pageNum, pageSize, ...rest } = params;
  const res: any = await getApprovalList({
    page: pageNum,
    page_size: pageSize,
    ...rest
  });
  return res.data;
};

// 参数格式化函数
const paramsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params,
  };

  if (pagination) {
    formattedParams.pageNum = pagination.current || 1;
    formattedParams.pageSize = pagination.pageSize || 10;
  }

  // 处理时间范围参数
  if (params.timeRange && Array.isArray(params.timeRange) && params.timeRange.length === 2) {
    formattedParams.start_time = params.timeRange[0];
    formattedParams.end_time = params.timeRange[1];
    delete formattedParams.timeRange;
  }

  console.log('格式化后的参数:', formattedParams);
  return formattedParams;
};

// 弹窗状态
const detailModalVisible = ref(false);
const approveModalVisible = ref(false);
const rejectModalVisible = ref(false);

// 数据状态
const selectedApproval = ref({});
const selectedApprovalId = ref('');
const selectedApprovalTitle = ref('');

// 审批相关
const approveRemark = ref('');
const rejectReason = ref('');
const rectificationSuggestions = ref('');

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
};

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedApprovalId.value = record.id;
  selectedApprovalTitle.value = `${record.approval_type_name || record.approval_type} - ${record.applicant_name}`;

  switch (action) {
    case 'detail':
      showApprovalDetail(record);
      break;
    case 'approve':
      openApproveModal(record);
      break;
    case 'reject':
      openRejectModal(record);
      break;
  }
};

// 显示审批详情
const showApprovalDetail = async (record: any) => {
  try {
    const res = await getApprovalDetail(record.id);
    selectedApproval.value = res.data;
    detailModalVisible.value = true;
  } catch (error) {
    message.error('获取审批详情失败');
    console.error(error);
  }
};

// 打开审批通过确认弹窗
const openApproveModal = (record: any) => {
  selectedApproval.value = record;
  approveRemark.value = '';
  approveModalVisible.value = true;
};

// 打开审批驳回确认弹窗
const openRejectModal = (record: any) => {
  selectedApproval.value = record;
  rejectReason.value = '';
  rectificationSuggestions.value = '';
  rejectModalVisible.value = true;
};

// 确认审批通过
const confirmApprove = async () => {
  try {
    await approveApproval(selectedApprovalId.value, {
      remark: approveRemark.value
    });
    
    message.success('审批通过成功');
    approveModalVisible.value = false;
    detailModalVisible.value = false;
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'));
  } catch (error) {
    message.error('审批通过失败');
    console.error(error);
  }
};

// 确认审批驳回
const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    message.warning('请输入驳回原因');
    return;
  }

  try {
    await rejectApproval(selectedApprovalId.value, {
      reason: rejectReason.value,
      suggestions: rectificationSuggestions.value
    });
    
    message.success('审批驳回成功');
    rejectModalVisible.value = false;
    detailModalVisible.value = false;
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'));
  } catch (error) {
    message.error('审批驳回失败');
    console.error(error);
  }
};

// 从详情组件处理审批通过
const handleApprove = () => {
  openApproveModal(selectedApproval.value);
};

// 从详情组件处理审批驳回
const handleReject = () => {
  openRejectModal(selectedApproval.value);
};

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false;
  selectedApproval.value = {};
};

// 加载初始化数据
onBeforeMount(async () => {
  try {
    // 加载部门数据
    const deptRes = await getDepartmentList();
    searchConfig.value[2].props.options = deptRes.data.map((dept: any) => ({
      label: dept.name,
      value: dept.id
    }));
  } catch (error) {
    console.error('初始化数据加载失败:', error);
  }
});

// 模拟API函数（需要根据实际情况实现）
const getApprovalList = async (params: any) => {
  // 模拟数据
  return {
    data: {
      list: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        approval_type: i % 2 === 0 ? 'equipment_compliance' : 'qualification_extension',
        approval_type_name: i % 2 === 0 ? '设备合规性审批' : '资质延期审批',
        applicant_name: ['张三', '李四', '王五', '赵六'][i % 4],
        department: ['生产一部', '设备部', '质量部', '安全部'][i % 4],
        apply_time: new Date(Date.now() - i * 86400000).toISOString(),
        meeting_name: i % 3 === 0 ? '班前安全交底会' : i % 3 === 1 ? '设备安全培训会' : '资质审查会议',
        status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'approved' : 'rejected',
        current_approver: i % 3 === 0 ? '审批人A' : i % 3 === 1 ? '审批人B' : '审批人C',
        urgency_level: ['normal', 'urgent', 'emergency'][i % 3],
        can_approve: i % 3 === 0, // 只有待审批的才能操作
        apply_content: `这是第${i + 1}个审批申请，涉及重要设备/资质的安全合规性检查...`
      })),
      pagination: {
        total: 50,
        page: params.page || 1,
        page_size: params.page_size || 10
      }
    }
  };
};

const getApprovalDetail = async (id: string) => {
  return {
    data: {
      id: id,
      approval_type: 'equipment_compliance',
      approval_type_name: '设备合规性审批',
      applicant_name: '张三',
      department: '生产一部',
      position: '班长',
      apply_time: new Date().toISOString(),
      meeting_name: '班前安全交底会',
      status: 'pending',
      urgency_level: 'urgent',
      apply_content: '关于设备安全合规性的审批申请，详细说明设备的基本情况、安全性能、维护记录等信息。',
      attachments: [
        { id: 1, name: '设备检验报告.pdf', url: '#', size: '2.5MB' },
        { id: 2, name: '维护记录.xlsx', url: '#', size: '1.8MB' }
      ],
      approval_flow: [
        { id: 1, approver: '审批人A', status: 'completed', time: new Date(Date.now() - 86400000).toISOString(), remark: '初步审核通过' },
        { id: 2, approver: '审批人B', status: 'current', time: null, remark: '' },
        { id: 3, approver: '审批人C', status: 'pending', time: null, remark: '' }
      ],
      history: [
        { type: 'apply', user: '张三', time: new Date(Date.now() - 2 * 86400000).toISOString(), content: '提交审批申请' },
        { type: 'approve', user: '审批人A', time: new Date(Date.now() - 86400000).toISOString(), content: '初步审核通过' }
      ]
    }
  };
};

const approveApproval = async (id: string, data: any) => {
  console.log('审批通过:', id, data);
  return { success: true };
};

const rejectApproval = async (id: string, data: any) => {
  console.log('审批驳回:', id, data);
  return { success: true };
};

const getDepartmentList = async () => {
  return {
    data: [
      { id: '1', name: '生产一部' },
      { id: '2', name: '生产二部' },
      { id: '3', name: '设备部' },
      { id: '4', name: '质量部' },
      { id: '5', name: '安全部' }
    ]
  };
};
</script>

<style scoped>
.approval-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

/* 可以添加一些自定义样式 */
:deep(.ant-table-cell) {
  padding: 12px 8px;
}

:deep(.ant-tag) {
  margin-right: 0;
}
</style>