<template>
  <div class="run-record-container overflow-y-scroll p-[16px] flex flex-col box-border" style="font-family: Source Han Sans CN;">

    <!-- 主要内容区域 -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
      <SmartTable
        ref="smartTableRef"
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
        @action="handleAction"
      >
      </SmartTable>
    </div>

    <!-- 详情弹窗 -->
    <Modal 
      v-model:open="detailModalVisible" 
      title="布控记录详情" 
      width="800px"
      @ok="handleDetailModalOk"
      @cancel="handleDetailModalCancel"
      :footer="null"
    >
      <AdvancedForm 
        ref="detailFormRef"
        :schema="detailFormSchema" 
        :model="detailFormState" 
        mode="descriptions"
        :column="2"
      />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { 
  Button, 
  Modal, 
  message
} from 'ant-design-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
// 引入 smartTable 组件需要的类型
import type { ExtendedColumnItem } from '@/types/business';
import dayjs from 'dayjs'
import { getAllTypeList } from '@/utils/constSeting';

// 定义搜索项类型
interface SearchItem {
  field: string;
  label: string;
  type: string;
  placeholder?: string;
  props?: any;
  colSpan?: number;
}

// 类型定义
interface ControlRecord {
  id: string;
  number: string;
  video_stream: string;
  video_status: string;
  algorithm_stream: string;
  algorithm: string;
  fps_status: string;
  add_time: string;
}

// 响应式数据
const detailModalVisible = ref(false);
const smartTableRef = ref();
const detailFormRef = ref();

// 详情表单状态
const detailFormState = reactive({
  id: '',
  number: '',
  video_stream: '',
  video_status: '',
  algorithm_stream: '',
  algorithm: '',
  fps_status: '',
  add_time: ''
});

// 表格配置
const responseConfig = {
  listKey: 'records',
  totalKey: 'total',
};

const paginationConfig = {
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
};

// 算法选项
const algorithmOptions = ref([]);

// 获取算法选项
const loadAlgorithmOptions = async () => {
  try {
    const options = await getAllTypeList();
    algorithmOptions.value = options;
  } catch (error) {
    console.error('获取算法选项失败:', error);
    message.error('获取算法选项失败');
  }
};

// 表格列配置
const columns: ExtendedColumnItem<ControlRecord>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '5%'
  },
  {
    title: '编号',
    dataIndex: 'number',
    key: 'number',
    width: '12%'
  },
  {
    title: '视频流',
    dataIndex: 'video_stream',
    key: 'video_stream',
    width: '15%'
  },
  {
    title: '视频流状态',
    dataIndex: 'video_status',
    key: 'video_status',
    width: '8%',
    type: 'tag',
    options: [
      { label: '正常', value: 'normal', color: 'green' },
      { label: '异常', value: 'abnormal', color: 'red' }
    ]
  },
  {
    title: '算法流',
    dataIndex: 'algorithm_stream',
    key: 'algorithm_stream',
    width: '15%'
  },
  {
    title: '算法',
    dataIndex: 'algorithm',
    key: 'algorithm',
    width: '10%'
  },
  {
    title: 'fps状态',
    dataIndex: 'fps_status',
    key: 'fps_status',
    width: '6%',
    type: 'tag',
    options: [
      { label: '正常', value: 'normal', color: 'green' },
      { label: '偏低', value: 'low', color: 'orange' },
      { label: '异常', value: 'abnormal', color: 'red' }
    ]
  },
  {
    title: '添加时间',
    dataIndex: 'add_time',
    key: 'add_time',
    width: '15%',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'number',
    label: '编号',
    type: 'input',
    placeholder: '请输入编号',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'video_stream',
    label: '视频流',
    type: 'input',
    placeholder: '请输入视频流',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'algorithm',
    label: '算法',
    type: 'select',
    placeholder: '请选择算法',
    props: {
      allowClear: true,
      options: algorithmOptions
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 280,
  fixed: 'right',
  actions: [
    // {
    //   label: '详情',
    //   icon: 'EyeOutlined',
    //   props: { type: 'link', size: 'small' },
    //   action: 'detail'
    // }
    {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete'
    },
    {
      label: '执行布控',
      props: { type: 'link', size: 'small' },
      action: 'control'
    }
  ]
};

// 详情表单配置
const detailFormSchema = [
  {
    key: 'id',
    type: 'input',
    label: 'ID',
    props: { disabled: true },
    colSpan: 12
  },
  {
    key: 'number',
    type: 'input',
    label: '编号',
    props: { disabled: true },
    colSpan: 12
  },
  {
    key: 'video_stream',
    type: 'input',
    label: '视频流',
    props: { disabled: true },
    colSpan: 12
  },
  {
    key: 'video_status',
    type: 'select',
    label: '视频流状态',
    props: { 
      disabled: true,
      options: [
        { label: '正常', value: 'normal' },
        { label: '异常', value: 'abnormal' }
      ]
    },
    colSpan: 12
  },
  {
    key: 'algorithm_stream',
    type: 'input',
    label: '算法流',
    props: { disabled: true },
    colSpan: 12
  },
  {
    key: 'algorithm',
    type: 'input',
    label: '算法',
    props: { disabled: true },
    colSpan: 12
  },
  {
    key: 'fps_status',
    type: 'select',
    label: 'fps状态',
    props: { 
      disabled: true,
      options: [
        { label: '正常', value: 'normal' },
        { label: '偏低', value: 'low' },
        { label: '异常', value: 'abnormal' }
      ]
    },
    colSpan: 12
  },
  {
    key: 'add_time',
    type: 'input',
    label: '添加时间',
    props: { disabled: true },
    colSpan: 12
  }
];

// 静态数据
const staticRecords: ControlRecord[] = [
  {
    id: '1',
    number: 'BK001',
    video_stream: 'rtsp://10.0.0.1:554/rtp/3751882254',
    video_status: 'normal',
    algorithm_stream: '算法流1',
    algorithm: '未穿工作服检测',
    fps_status: 'normal',
    add_time: '2025-12-01 10:30:00'
  },
  {
    id: '2',
    number: 'BK002',
    video_stream: 'rtsp://10.0.0.1:554/rtp/3751882254',
    video_status: 'normal',
    algorithm_stream: '算法流2',
    algorithm: '未带安全帽检测',
    fps_status: 'low',
    add_time: '2025-12-01 11:15:00'
  },
  {
    id: '3',
    number: 'BK003',
    video_stream: 'rtsp://10.0.0.1:554/rtp/2064809670',
    video_status: 'normal',
    algorithm_stream: '算法流3',
    algorithm: '离岗检测',
    fps_status: 'normal',
    add_time: '2025-12-01 09:45:00'
  },
  {
    id: '4',
    number: 'BK004',
    video_stream: 'rtsp://10.0.0.1:554/rtp/8046653740',
    video_status: 'normal',
    algorithm_stream: '算法流4',
    algorithm: '火焰检测',
    fps_status: 'abnormal',
    add_time: '2025-12-01 12:20:00'
  },
  {
    id: '5',
    number: 'BK005',
    video_stream: 'rtsp://10.0.0.1:554/rtp/2064809670',
    video_status: 'normal',
    algorithm_stream: '算法流5',
    algorithm: '睡岗检测',
    fps_status: 'normal',
    add_time: '2025-12-01 13:00:00'
  }
];

// API 配置（使用静态数据）
const apiConfig = async (params: any) => {
  const { pageNum, pageSize, ...rest } = params;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 过滤数据
  let filteredData = staticRecords;
  
  if (rest.number) {
    filteredData = filteredData.filter(item => 
      item.number.includes(rest.number)
    );
  }
  
  if (rest.video_stream) {
    filteredData = filteredData.filter(item => 
      item.video_stream.includes(rest.video_stream)
    );
  }
  
  if (rest.algorithm) {
    filteredData = filteredData.filter(item => 
      item.algorithm.includes(rest.algorithm)
    );
  }
  
  // 分页
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;
  const pagedData = filteredData.slice(start, end);
  
  return {
    records: pagedData,
    total: filteredData.length
  };
};

// 参数格式化函数
const paramsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params
  };

  if (pagination) {
    formattedParams.pageNum = pagination.current || 1;
    formattedParams.pageSize = pagination.pageSize || 10;
  }

  return formattedParams;
};

// 查看详情
const viewDetailFn = async (record: ControlRecord) => {
  try {
    detailFormState.id = record.id;
    detailFormState.number = record.number;
    detailFormState.video_stream = record.video_stream;
    detailFormState.video_status = record.video_status;
    detailFormState.algorithm_stream = record.algorithm_stream;
    detailFormState.algorithm = record.algorithm;
    detailFormState.fps_status = record.fps_status;
    detailFormState.add_time = record.add_time;

    detailModalVisible.value = true;
  } catch (error) {
    console.error('获取详情失败:', error);
    message.error('获取详情失败');
  }
};

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

// 操作列事件处理
const handleAction = (action: string, record: ControlRecord, index: number) => {
  switch (action) {
    case 'detail':
      viewDetailFn(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};

// 详情弹窗事件处理
const handleDetailModalOk = () => {
  detailModalVisible.value = false;
};

const handleDetailModalCancel = () => {
  detailModalVisible.value = false;
};

onMounted(() => {
  // 加载算法选项
  loadAlgorithmOptions();
  // 页面初始化逻辑
});
</script>

<style scoped>
.run-record-container {
  height: 100%;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
}
</style>