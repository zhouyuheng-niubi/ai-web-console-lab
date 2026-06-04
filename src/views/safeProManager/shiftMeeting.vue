<template>
  <div class="meeting-briefing-container">
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

    <!-- 会议详情弹窗 -->
    <Modal title="会议详情" v-model:open="detailModalVisible" width="900px" height="600px" :footer="null">
      <MeetingBriefingDetail 
        :meeting-data="selectedMeeting"
        :isDarkTheme="false"
        :show-header="false"
        @sign="handleSign"
        @confirmMeasures="handleConfirmMeasures"
        @signPromise="handleSignPromise"
        @close="closeDetailModal"
      />            
    </Modal>

    <!-- 安全交底弹窗 -->
    <Modal title="安全交底" v-model:open="briefingModalVisible" width="800px" @ok="handleBriefingSubmit">
      <MeetingBriefingForm
        ref="briefingFormRef"
        :meeting-data="selectedMeeting"
        @close="closeBriefingModal"
      />
    </Modal>

    <!-- 签到确认弹窗 -->
    <Modal title="会议签到" v-model:open="signModalVisible" width="500px" @ok="confirmSign">
      <div style="padding: 20px 0; text-align: center;">
        <div style="margin-bottom: 20px;">
          <div style="font-size: 16px; margin-bottom: 8px;">会议名称：</div>
          <div style="font-weight: 600;">{{ selectedMeetingName }}</div>
        </div>
        <div style="margin-bottom: 20px;">
          <div style="font-size: 16px; margin-bottom: 8px;">签到验证码：</div>
          <div style="font-size: 32px; font-weight: 700; color: #1890ff; letter-spacing: 8px;">
            {{ signCode }}
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <div style="font-size: 14px; color: #666;">
            请在会议现场输入此验证码完成签到
          </div>
        </div>
      </div>
    </Modal>

    <!-- 安全措施确认弹窗 -->
    <Modal title="安全措施确认" v-model:open="measuresModalVisible" width="600px" @ok="confirmMeasures">
      <div style="padding: 20px 0;">
        <div style="margin-bottom: 20px;">
          <div style="font-size: 16px; margin-bottom: 8px;">会议名称：</div>
          <div style="font-weight: 600; margin-bottom: 16px;">{{ selectedMeetingName }}</div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 16px; margin-bottom: 12px;">安全措施清单：</div>
          <div style="background: #f6ffed; border: 1px solid #b7eb8f; border-radius: 6px; padding: 16px;">
            <div v-for="(measure, index) in safetyMeasures" :key="index" 
                 style="display: flex; align-items: flex-start; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #d9d9d9;">
              <div style="margin-right: 12px;">
                <Checkbox v-model:checked="measure.checked" />
              </div>
              <div>
                <div style="font-weight: 500; margin-bottom: 4px;">{{ measure.title }}</div>
                <div style="font-size: 13px; color: #666;">{{ measure.description }}</div>
              </div>
            </div>
            <div v-if="safetyMeasures.length === 0" style="text-align: center; color: #999; padding: 20px;">
              暂无安全措施要求
            </div>
          </div>
        </div>

        <div>
          <div style="font-size: 14px; color: #666; margin-bottom: 8px;">确认人：</div>
          <Input 
            v-model:value="confirmPerson"
            placeholder="请输入确认人姓名"
            style="margin-bottom: 16px;"
          />
          <Textarea 
            v-model:value="confirmRemark"
            placeholder="确认备注（可选）"
            :rows="3"
          />
        </div>
      </div>
    </Modal>

    <!-- 签署承诺书弹窗 -->
    <Modal title="签署安全承诺书" v-model:open="promiseModalVisible" width="800px" @ok="confirmPromise">
      <div style="padding: 20px 0;">
        <div style="margin-bottom: 20px;">
          <div style="font-size: 16px; margin-bottom: 8px;">会议名称：</div>
          <div style="font-weight: 600; margin-bottom: 16px;">{{ selectedMeetingName }}</div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <div style="font-size: 16px; margin-bottom: 12px;">安全承诺书内容：</div>
          <div style="background: #fafafa; border: 1px solid #d9d9d9; border-radius: 6px; padding: 20px; max-height: 300px; overflow-y: auto;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h3 style="margin-bottom: 8px;">安全承诺书</h3>
              <div style="color: #666;">班前会安全承诺</div>
            </div>
            
            <div style="line-height: 1.8;">
              <p style="text-indent: 2em; margin-bottom: 12px;">
                本人承诺在参与本次班前会及相关生产作业过程中，严格遵守各项安全规章制度和操作规程，切实履行安全职责。
              </p>
              <p style="text-indent: 2em; margin-bottom: 12px;">
                本人已认真学习并理解本次会议所传达的安全要求，清楚作业过程中可能存在的安全风险，并已掌握相应的防范措施。
              </p>
              <p style="text-indent: 2em; margin-bottom: 12px;">
                本人承诺在作业过程中正确佩戴和使用劳动防护用品，不违章指挥、不违章作业、不违反劳动纪律。
              </p>
              <p style="text-indent: 2em; margin-bottom: 12px;">
                如发现安全隐患或发生安全事故，本人将立即报告并采取必要措施，积极参与应急处置。
              </p>
              <p style="text-indent: 2em; margin-bottom: 12px;">
                本人郑重承诺，将本着对自己、对同事、对企业负责的态度，严格遵守各项安全规定，确保安全生产。
              </p>
            </div>
            
            <div style="margin-top: 32px;">
              <p>承诺人：<span style="text-decoration: underline; min-width: 100px; display: inline-block;">{{ promisePerson }}</span></p>
              <p style="margin-top: 12px;">签署日期：<span style="text-decoration: underline;">{{ formatDate(new Date()) }}</span></p>
            </div>
          </div>
        </div>

        <div>
          <div style="font-size: 14px; color: #666; margin-bottom: 8px;">承诺人：</div>
          <Input 
            v-model:value="promisePerson"
            placeholder="请输入承诺人姓名"
            style="margin-bottom: 16px;"
          />
          
          <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <Checkbox v-model:checked="agreePromise">
              我已阅读并同意以上安全承诺书内容
            </Checkbox>
          </div>
          
          <div>
            <div style="font-size: 14px; color: #666; margin-bottom: 8px;">签署备注：</div>
            <Textarea 
              v-model:value="promiseRemark"
              placeholder="签署备注（可选）"
              :rows="3"
            />
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { getMeetingBriefingList, signMeeting, confirmSafetyMeasures, signPromise, submitSafetyBriefing } from '@/api/safeProManager/meetingBriefing';
import { ref, onBeforeMount } from 'vue'
import dayjs from 'dayjs'
import { Modal, message, Textarea, Input, Checkbox } from 'ant-design-vue';
import MeetingBriefingDetail from '@/components/meeting/MeetingBriefingDetail.vue';
import MeetingBriefingForm from '@/components/meeting/MeetingBriefingForm.vue';

// 表格列配置
const columns = [
  {
    title: '会议名称',
    dataIndex: 'meeting_name',
    key: 'meeting_name',
    width: 180,
  },
  {
    title: '发起班组',
    dataIndex: 'team_name',
    key: 'team_name',
    width: 120,
  },
  {
    title: '会议时间',
    dataIndex: 'meeting_time',
    key: 'meeting_time',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
    width: 160,
  },
  {
    title: '待办类型',
    dataIndex: 'todo_type',
    key: 'todo_type',
    width: 140,
    // type: 'tag',
    formatter: (value: string[]) => {
      const typeMap = {
        'sign': '待签到',
        'confirm_measures': '待确认安全措施',
        'sign_promise': '待签署承诺书',
        'briefing': '待参与交底'
      };
      // 如果是数组，显示多个状态
      if (Array.isArray(value)) {
        return value.map(v => typeMap[v] || v).join('、');
      }
      return typeMap[value] || value;
    }
  },
  {
    title: '紧急程度',
    dataIndex: 'urgency_level',
    key: 'urgency_level',
    width: 100,
    // type: 'tag',
    formatter: (value: string) => {
      const levelMap = {
        'normal': { text: '一般', color: 'default' },
        'urgent': { text: '紧急', color: 'orange' },
        'emergency': { text: '特紧急', color: 'red' }
      };
      const config = levelMap[value] || { text: '未知', color: 'default' };
      return config.text;
    }
  },
  {
    title: '会议地点',
    dataIndex: 'region_name',
    key: 'region_name',
    width: 120,
  },
  {
    title: '主持人',
    dataIndex: 'host_name',
    key: 'host_name',
    width: 100,
  },
  {
    title: '参会人数',
    dataIndex: 'attendance',
    key: 'attendance',
    width: 120,
    formatter: (value: any) => {
      return `${value.actual || 0}/${value.total || 0}`;
    }
  },
  {
    title: '安全交底状态',
    dataIndex: 'briefing_status',
    key: 'briefing_status',
    width: 120,
    // type: 'tag',
    formatter: (value: string) => {
      const statusMap = {
        'not_started': { text: '未开始', color: 'default' },
        'in_progress': { text: '进行中', color: 'blue' },
        'completed': { text: '已完成', color: 'green' }
      };
      const config = statusMap[value] || { text: '未知', color: 'default' };
      return config.text;
    }
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 180,
  fixed: 'right',
  actions: [
    {
      label: '详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label: '安全交底',
      props: { type: 'link', size: 'small' },
      action: 'briefing'
    }
  ]
};

// 搜索配置
const searchConfig = ref([
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
    field: 'team_id',
    label: '发起班组',
    type: 'select',
    placeholder: '请选择班组',
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
    field: 'todo_type',
    label: '待办类型',
    type: 'select',
    placeholder: '请选择待办类型',
    props: {
      allowClear: true,
      mode: 'multiple',
      options: [
        { label: '待签到', value: 'sign' },
        { label: '待确认安全措施', value: 'confirm_measures' },
        { label: '待签署承诺书', value: 'sign_promise' },
        { label: '待参与交底', value: 'briefing' }
      ]
    },
    colSpan: 6
  },
  {
    field: 'timeRange',
    label: '会议时间',
    type: 'date-range',
    placeholder: ['开始时间', '结束时间'],
    props: {
      showTime: { format: 'HH:mm' },
      format: 'YYYY-MM-DD HH:mm',
      valueFormat: "YYYY-MM-DD HH:mm"
    },
    colSpan: 6
  },
  {
    field: 'briefing_status',
    label: '交底状态',
    type: 'select',
    placeholder: '请选择交底状态',
    props: {
      allowClear: true,
      options: [
        { label: '未开始', value: 'not_started' },
        { label: '进行中', value: 'in_progress' },
        { label: '已完成', value: 'completed' }
      ]
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
  const res: any = await getMeetingBriefingList({
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
const briefingModalVisible = ref(false);
const signModalVisible = ref(false);
const measuresModalVisible = ref(false);
const promiseModalVisible = ref(false);

// 数据状态
const selectedMeeting = ref({});
const selectedMeetingId = ref('');
const selectedMeetingName = ref('');
const selectedRecord = ref({});

// 签到相关
const signCode = ref('');

// 安全措施相关
const safetyMeasures = ref([
  {
    id: 1,
    title: '个人防护用品检查',
    description: '检查安全帽、安全带、防护眼镜等个人防护用品是否齐全有效',
    checked: false
  },
  {
    id: 2,
    title: '作业环境检查',
    description: '检查作业区域是否存在安全隐患，如地面湿滑、障碍物等',
    checked: false
  },
  {
    id: 3,
    title: '设备设施检查',
    description: '检查使用的设备设施是否完好，安全防护装置是否有效',
    checked: false
  },
  {
    id: 4,
    title: '安全警示标识',
    description: '检查作业区域是否设置必要的安全警示标识',
    checked: false
  },
  {
    id: 5,
    title: '应急设施检查',
    description: '检查消防器材、应急照明、疏散通道等应急设施是否完好',
    checked: false
  }
]);
const confirmPerson = ref('');
const confirmRemark = ref('');

// 承诺书相关
const promisePerson = ref('');
const promiseRemark = ref('');
const agreePromise = ref(false);

// 表单引用
const briefingFormRef = ref();

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
};

// 表格操作事件处理
const handleTableAction = (action: string, record: any) => {
  selectedRecord.value = record;
  selectedMeetingId.value = record.id;
  selectedMeetingName.value = record.meeting_name;

  switch (action) {
    case 'detail':
      showMeetingDetail(record);
      break;
    case 'briefing':
      openBriefingModal(record);
      break;
  }
};

// 显示会议详情
const showMeetingDetail = async (record: any) => {
  try {
    // 这里调用API获取会议详情
    // const res = await getMeetingDetail(record.id);
    // selectedMeeting.value = res.data;
    selectedMeeting.value = record;
    detailModalVisible.value = true;
  } catch (error) {
    message.error('获取会议详情失败');
    console.error(error);
  }
};

// 打开安全交底弹窗
const openBriefingModal = (record: any) => {
  selectedMeeting.value = record;
  briefingModalVisible.value = true;
};

// 处理签到
const handleSign = () => {
  // 生成随机签到验证码（4位数字）
  signCode.value = Math.floor(1000 + Math.random() * 9000).toString();
  signModalVisible.value = true;
};

// 确认签到
const confirmSign = async () => {
  try {
    await signMeeting(selectedMeetingId.value, { sign_code: signCode.value });
    message.success('签到成功');
    signModalVisible.value = false;
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'));
  } catch (error) {
    message.error('签到失败');
    console.error(error);
  }
};

// 处理安全措施确认
const handleConfirmMeasures = () => {
  measuresModalVisible.value = true;
};

// 确认安全措施
const confirmMeasures = async () => {
  if (!confirmPerson.value.trim()) {
    message.warning('请输入确认人姓名');
    return;
  }

  // 检查是否所有必选措施都已确认
  const requiredMeasures = safetyMeasures.value.filter(measure => !measure.checked);
  if (requiredMeasures.length > 0) {
    message.warning('请确认所有必选安全措施');
    return;
  }

  try {
    const confirmedMeasures = safetyMeasures.value
      .filter(measure => measure.checked)
      .map(measure => measure.id);

    await confirmSafetyMeasures(selectedMeetingId.value, {
      measures: confirmedMeasures,
      confirm_person: confirmPerson.value,
      remark: confirmRemark.value
    });

    message.success('安全措施确认成功');
    measuresModalVisible.value = false;
    confirmPerson.value = '';
    confirmRemark.value = '';
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'));
  } catch (error) {
    message.error('安全措施确认失败');
    console.error(error);
  }
};

// 处理签署承诺书
const handleSignPromise = () => {
  promiseModalVisible.value = true;
};

// 确认签署承诺书
const confirmPromise = async () => {
  if (!promisePerson.value.trim()) {
    message.warning('请输入承诺人姓名');
    return;
  }

  if (!agreePromise.value) {
    message.warning('请阅读并同意安全承诺书内容');
    return;
  }

  try {
    await signPromise(selectedMeetingId.value, {
      person: promisePerson.value,
      remark: promiseRemark.value,
      agree_terms: agreePromise.value
    });

    message.success('安全承诺书签署成功');
    promiseModalVisible.value = false;
    promisePerson.value = '';
    promiseRemark.value = '';
    agreePromise.value = false;
    // 刷新表格
    window.dispatchEvent(new CustomEvent('table-reload'));
  } catch (error) {
    message.error('签署失败');
    console.error(error);
  }
};

// 处理安全交底提交
const handleBriefingSubmit = async () => {
  try {
    if (briefingFormRef.value && briefingFormRef.value.handleSubmit) {
      await briefingFormRef.value.handleSubmit();
    }
    briefingModalVisible.value = false;
  } catch (error) {
    console.error('提交失败:', error);
    message.error('提交失败，请重试');
  }
};

// 格式化日期
const formatDate = (date: Date) => {
  return dayjs(date).format('YYYY年MM月DD日');
};

// 关闭弹窗
const closeDetailModal = () => {
  detailModalVisible.value = false;
  selectedMeeting.value = {};
};

const closeBriefingModal = () => {
  briefingModalVisible.value = false;
};

// 加载初始化数据
onBeforeMount(async () => {
  try {
    // 加载班组数据
    const teamRes = await getTeamList();
    searchConfig.value[1].props.options = teamRes.data.map((team: any) => ({
      label: team.team_name,
      value: team.id
    }));
  } catch (error) {
    console.error('初始化数据加载失败:', error);
  }
});

// 模拟API函数（需要根据实际情况实现）
const getMeetingBriefingList = async (params: any) => {
  // 模拟数据
  return {
    data: {
      list: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        meeting_name: `班前安全交底会${i + 1}`,
        team_name: ['生产一班', '生产二班', '设备维护班', '质量检测班'][i % 4],
        meeting_time: new Date(Date.now() + i * 86400000).toISOString(),
        todo_type: i % 4 === 0 ? ['sign', 'confirm_measures'] : ['sign_promise', 'briefing'],
        urgency_level: ['normal', 'urgent', 'emergency'][i % 3],
        region_name: ['一楼会议室', '二楼培训室', '生产车间'][i % 3],
        host_name: ['张三', '李四', '王五', '赵六'][i % 4],
        attendance: {
          total: 15,
          actual: Math.floor(Math.random() * 15)
        },
        briefing_status: ['not_started', 'in_progress', 'completed'][i % 3]
      })),
      pagination: {
        total: 50,
        page: params.page || 1,
        page_size: params.page_size || 10
      }
    }
  };
};

const signMeeting = async (meetingId: string, data: any) => {
  console.log('会议签到:', meetingId, data);
  return { success: true };
};

const confirmSafetyMeasures = async (meetingId: string, data: any) => {
  console.log('确认安全措施:', meetingId, data);
  return { success: true };
};

const signPromise = async (meetingId: string, data: any) => {
  console.log('签署承诺书:', meetingId, data);
  return { success: true };
};

const submitSafetyBriefing = async (data: any) => {
  console.log('提交安全交底:', data);
  return { success: true };
};

// 模拟获取班组列表API
const getTeamList = async () => {
  return {
    data: [
      { id: '1', team_name: '生产一班' },
      { id: '2', team_name: '生产二班' },
      { id: '3', team_name: '设备维护班' },
      { id: '4', team_name: '质量检测班' }
    ]
  };
};
</script>

<style scoped>
.meeting-briefing-container {
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