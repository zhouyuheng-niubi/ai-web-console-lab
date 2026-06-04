<template>
  <div class="warn-list-container">
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
    <Modal title="告警详情" v-model:open="detailModalVisible" width="800px" :footer="null">
      <AlarmDetail 
        :alarm-data="selectedAlarm"
        :image-url="selectedAlarmImageUrl"
        :isDarkTheme="false"
        :show-header="false"
        @falseAlarm="(val) => handleAction('falseAlarm', val)"
        @confirm="(val) => handleAction('confirm',val)"
        @close="closeDetailModal"
      />            
    </Modal>
    <!-- 视频播放弹窗 -->
    <Modal title="报警视频片段" v-model:open="videoModalVisible" width="800px" :footer="null" @cancel="closeVideoModal">
      <div style="width: 100%; height: 450px">
          <VideoPlayer ref="videoPlayerDetail"
          :videoUrl="currentVideoUrl" videoType="mp4" videoId="video-player-detail" v-if="videoModalVisible" />                
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { getAlarmList } from '@/api/warn/index';
import {getRegionList} from '@/api/system/region';
import {getAllTypeList,modelOrigin} from '@/utils/constSeting'
import {ref,onBeforeMount} from 'vue'
import dayjs from 'dayjs'
import { Modal,message } from 'ant-design-vue';
import AlarmDetail from '@/components/alarmDetail/index.vue';
import VideoPlayer from '@/components/videoPlayer/VideoPlayer.vue'
// 表格列配置
const columns = [
  {
    title: '算法',
    dataIndex: 'scene_name',
    key: 'scene_name',
    width: 120,
    ellipsis: true
  },
  {
    title: '算法来源',
    dataIndex: 'algorithm_source',
    key: 'scene_engines',
    type:'tag',
    options:modelOrigin,
    width: 120,
    ellipsis: true
  },
  {
    title: '任务名称',
    dataIndex: 'raw_result',
    key: 'raw_result',
    width: 150,
    ellipsis: true
  },
  {
    title: '识别时间',
    dataIndex: 'processing_time',
    key: 'processing_time',
    width: 100,
  },
  {
    title: '报警时间',
    dataIndex: 'timestamp',
    key: 'timestamp',
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
    width: 180,
  },
  {
    title: '摄像头名称',
    dataIndex: 'stream_name',
    key: 'stream_name',
    width: 150,
    ellipsis: true
  },
  {
    title: '所属区域',
    dataIndex: 'region_name',
    key: 'region_name',
    width: 120,
  },
  {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    type:'tag',
    formatter: (value: string) => {
      // 根据API返回的状态值显示对应文本
      const statusMap = {
        '0': '未处理',
        '1': '已处理',
        '2': '误报'
      };
      return statusMap[value] || '未处理';
    }
  },
  {
    title: '告警图片',
    dataIndex: 'image_url',
    key: 'image_url',
    width: 180,
    type: 'image',
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 190,
  fixed: 'right',
  actions: [
    {
      label: '详情',
      props: { type: 'link', size: 'small' },
      action: 'detail'
    },
    {
      label:'视频片段',
      props: { type: 'link', size: 'small' },
      action: 'video'
    }
  ]
};

// 搜索配置
const searchConfig = ref(
  [
  {
    field: 'scene_types',
    label: '算法类型',
    type: 'select',
    props: {
      options: [],
      allowClear: true,
      mode: 'multiple',
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }
    },
     colSpan: 6
  },
  {
    field: 'region_id',
    label: '所属区域',
    type: 'select',
    placeholder: '请选择所属区域',
    props:{
      allowClear: true,
      options: [],
      showSearch: true,
      filterOption: (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }
    },
    colSpan: 6
  },
  {
    field: 'detection_result',
    label: '任务名称',
    type: 'input',
    placeholder: '请输入任务名称',
    props:{
      allowClear: true,
    },
    colSpan: 6
  },
  {
    field: 'timeRange',
    label: '报警时间',
    type: 'date-range',
    placeholder: ['开始时间', '结束时间'],
    props: {
      showTime: { format: 'HH:mm:ss' },
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat:"YYYY-MM-DD HH:mm:ss"
    },
    colSpan: 6
  }
])

// 响应配置
const responseConfig = {
  listKey: 'messages', // 根据API返回结构配置
  totalKey: 'pagination.total_count',
};

// 分页配置
const paginationConfig = {
  pageSize: 5,  // 根据项目规则，初始默认加载10条数据
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['5', '20', '50', '100'],
  showTotal: (total: number) => `共 ${total} 条记录`,
  // 确保分页参数名称与API期望的匹配
  pageSizeKey: 'pageSize',
  currentKey: 'pageNum'
};

const apiConfig = async( params: any) => {
    console.log('API调用参数:', params);
    const {pageNum, pageSize, ...rest} = params
    const res: any = await getAlarmList({ 
        page: pageNum,
        page_size: pageSize,
        ...rest
    })
    res.data.messages = res.data.messages.map(item => {
      return {
        from_db: item.from_db,
        timestamp: item.timestamp,
        type: item.type,
        processing_time: item.data?.result?.processing_time ? item.data.result?.processing_time+'s':'--',
        ...item.data
      }
    })
    return res.data
}

// 参数格式化函数
const paramsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params,
    message_type: 'exception_result', // 固定参数
  };
  
  if (pagination) {
    formattedParams.pageNum = pagination.current || 1;
    formattedParams.pageSize = pagination.pageSize || 5;
  }
   // 处理时间范围参数
  if (params.timeRange && Array.isArray(params.timeRange) && params.timeRange.length === 2) {
    formattedParams.start_time = params.timeRange[0];
    formattedParams.end_time = params.timeRange[1];
  }
  if(params.scene_types && Array.isArray(params.scene_types)){
    formattedParams.scene_types = params.scene_types.join(',')
  }

  delete formattedParams.timeRange
  
  console.log('格式化后的参数:', formattedParams);
  return formattedParams;
};


// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
};

// 表格操作事件处理
const detailModalVisible = ref(false);
const selectedAlarm = ref({});
const selectedAlarmImageUrl = ref('');

const handleTableAction = (action: string, record: any) => {
  if (action === 'detail') {
    selectedAlarm.value = record;
    // 构造图片URL，image_url
    if (record.image_url) {
      selectedAlarmImageUrl.value = record.image_url;
    } else {
      selectedAlarmImageUrl.value = '/src/assets/img_error.png';
    }
    detailModalVisible.value = true;
  }
  if(action === 'video'){
    // console.log('查看视频片段', record);
    playVideo(record);
  }

};

const closeDetailModal = () => {
  detailModalVisible.value = false;
  selectedAlarm.value = {};
  selectedAlarmImageUrl.value = '';
};

// 报警消息处理
const handleAction = (type: string, record: any) => {
  if (type === 'falseAlarm') {
    console.log('处理误报', record);
    message.info('功能开发中，敬请期待')
  }
  if (type === 'confirm') {
    console.log('确认报警', record);
    message.info('功能开发中，敬请期待')
  }
  closeDetailModal()
};


// 视频片段播放
const videoModalVisible = ref(false);
const currentVideoUrl = ref('');
const closeVideoModal = () => {
  videoModalVisible.value = false;
  currentVideoUrl.value = '';
};

const playVideo = (record: any) => {
    console.log('播放视频片段', record);
    // message.info('功能开发中，敬请期待')
    if (!record.video_clip_url) {
      message.info('暂无视频片段')
      return
    }
    videoModalVisible.value = true;
    currentVideoUrl.value = record.video_clip_url;
};



onBeforeMount(() => {
  getAllTypeList().then(data => {
    searchConfig.value[0].props.options = data
  })
  getRegionList().then(data => {
    const regions = data?.data?.regions || [];
    searchConfig.value[1].props.options = regions.map(region => ({
      label: region.region_name,
      value: region.region_id
    }));
  })
})
</script>

<style scoped>
.warn-list-container {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>