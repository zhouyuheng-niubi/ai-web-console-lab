<template>
  <div class="document-viewer relative flex flex-col 
     box-border w-[100%] h-[100%] bg-[#F8FAFC]">
    <div class="box-border flex flex-1 w-full min-h-0">
      <div class="document-header relative w-full h-full box-border overflow-auto
      bg-[#fff] rounded-[12px] list-card  flex flex-col" style="flex:0.25;min-width: 360px;max-width: 360px">
        <div
          class="font-bold text-[18px] text-[#717B92] leading-1 text-center p-[16px] border-b-[1px] border-[#E5E5E5]">
          综合风险研判配置</div>
        <div class="document-actions mt-[10px] w-full p-[16px] flex-1 overflow-y-auto">
          <!-- 区域选择 -->
          <div class="mb-[10px]">
            <div class="font-bold text-[14px] text-[#717B92] mb-[8px]">
              <span class="text-red-500">*</span>选择区域:
            </div>
            <div class="w-full max-h-[200px] min-h-[100px] overflow-y-auto">
              <Spin :spinning="regionLoading" tip="加载中...">
                <Tree v-model:selectedKeys="selectedKeys" :tree-data="regionOptions" :disabled="disabled"
                  :field-names="{ children: 'children', title: 'region_name', key: 'region_id' }" @select="onTreeSelect"
                  :show-line="true" />
              </Spin>
            </div>
          </div>

          <!-- 时间范围 -->
          <div class="mb-[10px]">
            <div class="font-bold text-[14px] text-[#717B92] mb-[8px]">
              <span class="text-red-500">*</span>时间范围:
            </div>
            <div class="flex flex-wrap mb-[10px]" style="user-select:none">
              <span v-for="item, index in currentDateType" :key="index" @click="handleDateChange(item)"
                :class="{ 'bg-[#4362EF] text-[#fff]': activeDateType === item.value }" class="border-[1px] border-[#4362EF] text-[#4362EF] h-fit
                  rounded-[5px] mr-[8px] mt-[8px] cursor-pointer px-[15px] text-[14px] py-[6px] transition-all">
                {{ item.label }}
              </span>
            </div>
            <RangePicker :disabled="disabled" @change="changeDateRange" v-model:value="dateRange"
              format="YYYY-MM-DD HH:mm:ss" :allowClear="false" show-time value-format="YYYY-MM-DD HH:mm:ss"
              class="w-full" />
          </div>

          <!-- 研判维度 -->
          <div class="mb-[10px]">
            <div class="font-bold text-[14px] text-[#717B92] mb-[8px]">研判维度:</div>
            <Checkbox.Group v-model:value="selectedDimensions" :disabled="disabled" class="w-full"
              @change="onDimensionChange">
              <div class="grid grid-cols-3 gap-[10px]">
                <Checkbox value="alarm">告警分析</Checkbox>
                <Checkbox value="behavior">行为分析</Checkbox>
                <Checkbox value="training">培训分析</Checkbox>
                <Checkbox value="equipment">设备分析</Checkbox>
                <Checkbox value="operation">作业分析</Checkbox>
                <Checkbox value="emergency">应急分析</Checkbox>
              </div>
            </Checkbox.Group>
          </div>
          <div class="mb-[10px]">
            <div class="font-bold text-[14px] text-[#717B92] mb-[8px]">安全要素:
              <Checkbox v-model:checked="selectAllElements" :disabled="disabled">全选</Checkbox>
            </div>
            <Checkbox.Group v-model:value="selectedElements" :disabled="disabled" class="w-full"
              @change="onElementChange">
              <div class="grid grid-cols-1 gap-[10px] w-full">
                <Checkbox :value="element._id" v-for="element in elements" :key="element._id">{{ element.name }}
                </Checkbox>
              </div>
            </Checkbox.Group>
          </div>
        </div>

        <div class="bg-[#fff] pt-[10px]">
          <!-- 数据加载完成提示效果 -->
          <div class="text-center text-[14px] text-[#999]"
            v-if="!reportDataLoading && !spinning && !isFetching && !isfail && !regionLoading">
            <span class="w-[8px] h-[8px] bg-green-500 inline-block rounded-[4px]"></span>
            数据已加载完成，请点击
            <span class="text-blue-600 cursor-pointer" @click="startAnalysis">{{ initial ? '启动研判' : '重新研判' }}</span>
          </div>
          <!-- 操作按钮 -->
          <div class="flex gap-[10px] mt-[20px]">
            <Button type="primary" @click="startAnalysis" :disabled="!canStartAnalysis || reportDataLoading"
              :loading="loading" class="flex-1">
              <template v-if="initial">启动研判</template>
              <template v-else>重新研判</template>
            </Button>
            <Button v-if="!initial && loading" @click="cancelAnalysis" class="flex-1">
              取消研判
            </Button>
          </div>
          <!-- 下载/保存按钮 -->
          <div v-if="reportValue && !loading" class="flex gap-[10px] mt-[10px] px-[16px]">
            <Button @click="exportReport" class="flex-1">
              <span>
                <DownloadOutlined class="mr-[4px]" />
                下载报告
              </span>
            </Button>
            <Button @click="saveReport" type="primary" class="flex-1">
              <span>
                <SaveOutlined class="mr-[4px]" />
                保存报告
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div class="document-content h-full bg-[#fff] rounded-[12px] list-card  h-full flex flex-col" style="flex:0.7">
        <div class="inital-text border-b-[1px] border-[#E6E6E6] pb-[16px]">
          <div class="text-[16px] text-[#576075]">我是安全生产风险管控智能化平台综合风险研判助手，基于对设备与监测的深度认知，为您提供专业的综合风险分析服务。</div>
          <div class="text-[14px] text-[#717B92] mt-2">使用提示:
            请选择目标区域和时间范围，选择研判维度后点击"启动研判"，系统将自动生成详尽的综合风险分析报告。如需更新报告内容，可使用"重新研判"功能；完成分析后，可通过"下载"功能将报告保存至本地。</div>
        </div>
        <div class="overflow-y-auto flex-1">
          <Spin size="large" :tip="reportDataLoading ? '分析数据加载中...' : '智能分析中...'"
            :spinning="spinning || reportDataLoading">
            <div class="content-wrapper">
              <div class="content-tips text-center text-[12px] text-[#999] mt-[10px]" v-if="!isFetching && reportValue">
                内容由AI生成，仅供参考
              </div>
              <div id="report-container" v-html="reportValue"></div>
            </div>

            <div class="mt-5 empty-data" v-if="isfail">
              <div class="empty-icon">
                <img :src="emptyImg" alt="暂无数据" />
              </div>
              <div class="flex items-center">
                <p class="empty-text">分析失败，点击按钮</p>
                <Button size="small" type="primary" @click="startAnalysis" class="ml-1">重新研判</Button>
              </div>
            </div>
            <div class="flex flex-col items-center mt-2 w-full inital" v-if="initial">
              <img src="@/assets/empty.png" class="w-[200px] mt-[180px]" alt="暂无数据" />
            </div>
          </Spin>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { Button, Spin, Tree, RangePicker, Checkbox, Tag, Tabs, TabPane, message, Modal } from 'ant-design-vue';
import { CheckCircleOutlined, DownloadOutlined, SaveOutlined } from '@ant-design/icons-vue';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import emptyImg from '@/assets/empty.png';
import { getRegionList } from '@/api/system/region';
import { riskAnalysisStatistics,saveRiskAnalysisReport } from '@/api/warn/index';
import { generateMockRiskAnalysisData } from '@/utils/mockDataGenerator';
import { getSafetyElementList } from '@/api/system/safetyElement';
import { menuSetting, headerMenu } from '@/layout/menu'
import { hazardStatistics } from '@/api/hazard'
// 时间类型选项
const currentDateType = [
  { value: 'year', label: '本年' },
  { value: 'quarter', label: '本季' },
  { value: 'month', label: '本月' },
  { value: 'week', label: '本Maintainer' },
  { value: 'auto', label: '本日' },
  { value: '', label: '自定义' }
];

// 响应式数据
const activeDateType = ref('auto');
const selectedKeys = ref<string[]>(['']);
const regionName = ref('全部区域');
const initial = ref(true);
const loading = ref(false);
const reportValue = ref<any>(""); // 修改为存储AI生成的HTML报告
const regionOptions = ref<any[]>([]);
const disabled = ref(false);
const dateRange = ref([
  dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
]);
const selectedDimensions = ref<string[]>([
  'alarm', 'warning', 'behavior', 'training', 'equipment', 'operation', 'emergency'
]);
const chartActiveKey = ref('alarm');
const changeDateRange = (value) => {
  activeDateType.value = ''
  dateRange.value = value
  getStaticReport()
};
// 添加单项研判中的状态变量
const alarmRes = ref({});
const isfail = ref(false);
const spinning = ref(false);
const isFetching = ref(false); // 请求锁
let controller: any = null; // 存储 AbortController
const reportOriginData = ref({}); // 用于存储原始数据，传递给AI
const reportDataLoading = ref(false); // 报告数据加载状态
const regionLoading = ref(false)
// 计算属性
const canStartAnalysis = computed(() => {
  return selectedKeys.value.length > 0 && dateRange.value?.length === 2 && selectedDimensions.value.length > 0;
});

// 预处理HTML以适配Word格式
const preprocessHtmlForWord = (html) => {
  // 将CSS style中的width/height转换为HTML属性
  let processedHtml = html.replace(
    /<img([^>]+)style="[^"]*width:\s*(\d+)px[^"]*"/g,
    '<img$1width="$2" height="auto"'
  );

  // 确保所有图片都有width属性
  processedHtml = processedHtml.replace(
    /<img(?![^>]*width=)([^>]*)>/g,
    '<img$1 width="600" height="auto">'
  );

  return processedHtml;
};

// 导出功能
const exportReport = async () => {
  try {
    if (!reportValue.value)
      return message.info('暂无报告数据，请生成报告后下载！');

    // 预处理HTML
    const processedHtml = preprocessHtmlForWord(reportValue.value);

    // 构造完整的HTML结构，添加Word专用的样式
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        img { 
          max-width: 600px !important; 
          width: 600px !important; 
          height: auto !important; 
          display: block; 
          margin: 10px 0; 
        }
        p { margin: 10px 0; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
      </style>
    </head>
    <body>
      ${processedHtml}
    </body>
    </html>
  `;

    // 转换为Word文档并下载
    asBlob(html).then((res: Blob) => {
      saveAs(
        res,
        `${regionName.value + '综合风险研判智能报告'}${dayjs().format('YYYY-MM-DD HH:mm:ss')}.docx`,
      );
    });
  } catch (error) {
    console.error('导出失败:', error);
    message.error({ content: '导出失败', key: 'export' });
  }
};

// 保存报告内容
const saveReport = async () => {
  try {
    if (!reportValue.value)
      return message.info('暂无报告数据，请生成报告后保存！');
    // 调用保存逻辑
    saveRiskAnalysisReport({
      report_name: `${regionName.value}综合风险研判报告`,
      report_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      report_area: regionName.value,
      message: reportValue.value,
      type:'综合研判'
    }).then((res) => {
     if(res.code === 200) message.success('保存成功！');
      else message.error('保存失败！');
    }).catch((error) => {
      console.error('保存失败:', error);
      message.error('保存失败');
    });
  } catch (error) {
    console.error('保存失败:', error);
  }
};

// 获取区域列表
const getReginSelect = async () => {
  try {
    regionLoading.value = true
    const res: any = await getRegionList({ include_hierarchy: true });
    regionOptions.value = res.data?.hierarchy || [];
    regionOptions.value.unshift({ region_name: '全部区域', region_id: '' });
    selectedKeys.value = [''];
    getStaticReport();
    regionLoading.value = false
  } catch (error) {
    console.error('获取区域列表失败:', error);
    message.error('获取区域列表失败');
    regionLoading.value = false
  }
};

// 树选择事件
const onTreeSelect = (selectedKeysValue: string[], info: any) => {
  selectedKeys.value = selectedKeysValue;
  const selectedNode = info.selectedNodes[0];
  if (selectedNode) {
    regionName.value = selectedNode.region_name;
  }
  // 当选择区域时，获取统计数据
  if (dateRange.value?.length) {
    getStaticReport();
  }
};

// 时间范围更改
const handleDateChange = (item: any) => {
  activeDateType.value = item.value;

  switch (item.value) {
    case 'year':
      dateRange.value = [
        dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
        dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss')
      ];
      break;
    case 'quarter':
      const currentMonth = dayjs().month();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      const quarterStart = dayjs().startOf('year').month(quarterStartMonth).startOf('month');
      const quarterEnd = quarterStart.add(2, 'month').endOf('month');
      dateRange.value = [
        quarterStart.format('YYYY-MM-DD HH:mm:ss'),
        quarterEnd.format('YYYY-MM-DD HH:mm:ss')
      ];
      break;
    case 'month':
      dateRange.value = [
        dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
      ];
      break;
    case 'week':
      const today = dayjs();
      const dayOfWeek = today.day();
      const monday = dayOfWeek === 0 ? today.subtract(6, 'day') : today.subtract(dayOfWeek - 1, 'day');
      const sunday = monday.add(6, 'day');
      dateRange.value = [
        monday.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        sunday.endOf('day').format('YYYY-MM-DD HH:mm:ss')
      ];
      break;
    case 'auto':
      dateRange.value = [
        dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      ];
      break;
    default:
      dateRange.value = [];
      break;
  }

  // 当更改时间范围时，获取统计数据
  if (dateRange.value?.length) {
    getStaticReport();
  }
};

// 日期范围变化
const onDateRangeChange = () => {
  activeDateType.value = '';
  // 当日期范围改变时，获取统计数据
  if (dateRange.value?.length) {
    getStaticReport();
  }
};

// 研判维度变化
const onDimensionChange = () => {
  // 当维度选择改变时，获取统计数据
  if (dateRange.value?.length && selectedKeys.value?.length) {
    getStaticReport();
  }
};

// 获取统计数据 - 使用综合研判API
const getStaticReport = async () => {
  reportDataLoading.value = true
  const res = await riskAnalysisStatistics({
    region_id: selectedKeys.value.join(','),
    start_date: dateRange.value[0],
    end_date: dateRange.value[1],
    time_granularity: activeDateType.value || 'auto',
  });
  alarmRes.value = res.data
  reportDataLoading.value = false
  // 不在这里请求数据，而是在点击分析时通过 filterSelectedDimensionsData 方法请求
  return;
}

// 启动研判
const startAnalysis = async () => {
  if (!canStartAnalysis.value) {
    return message.info('请选择区域和时间范围');
  }

  if (selectedDimensions.value.length === 0) {
    return message.error('请至少选择一个研判维度');
  }

  initial.value = false;
  loading.value = true;
  reportValue.value = "";
  isfail.value = false;
  spinning.value = true;
  isFetching.value = false;

  // 调用AI分析
  chatStream();
};

// 取消研判
const cancelAnalysis = () => {
  controller?.abort();
  loading.value = false;
  spinning.value = false;
  message.info('已取消研判');
};

// AI分析流式响应
const getData = async () => {
  if (isFetching.value) return;
  isFetching.value = true;

  // 只有在有活动的controller时才中止
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();
  const filteredData = await filterSelectedDimensionsData();
  // return
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: filteredData,
      safetyElements: getElementString(),
    }),
    signal: controller.signal,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NEWAI_API}/ai/analysis/comprehensive/jaa`,
      options,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`,
      );
    }
    return response;
  } catch (error) {
    throw error;
  }
};

const chatStream = async () => {
  let reader = null;
  try {
    isFetching.value = false;
    const response = await getData();

    // 如果请求被取消，直接返回
    if (!response) {
      isFetching.value = false;
      return;
    }

    reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      while (true) {
        const lineEnd = buffer.indexOf('\n');
        if (lineEnd === -1) break;
        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 1);
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            loading.value = false;
            break;
          }
          try {
            const parsed = JSON.parse(data);
            const extra = parsed.choices[0]?.delta?.extra;
            if (extra) {
              console.log(extra);
              continue;
            }
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              if (content != null) {
                spinning.value = false;
                reportValue.value += content;
              }
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('解析错误1:', error);
            }

            spinning.value = false;
            isfail.value = true;
          }
        }
      }
    }
  } catch (error) {
    // 如果是中止错误，不显示错误信息
    if (error.name === 'AbortError') {
      console.log('流读取被中止');
      return;
    }
    console.error('解析错误2:', error);
    spinning.value = false;
    loading.value = false;
    isfail.value = true;
  } finally {
    loading.value = false;
    // 只有在reader存在时才取消
    if (reader) {
      try {
        await reader.cancel();
      } catch (cancelError) {
        // 忽略取消错误
      }
    }
  }
};

const elements = ref<any[]>([]);
const selectedElements = ref<any[]>([]);
const onElementChange = () => {
  console.log(selectedElements.value);
};
const getElementString = () => {
  let text = '一、安全要素内容：'
  const arr = elements.value.filter((element) => selectedElements.value.includes(element._id));
  arr.forEach((element) => {
    text += `${element.name}:${element.description}`;
    text += '\n';
    if (element.children && element.children.length > 0) {
      text += element.children.map((child) => `${child.name}:${child.description}`).join('');
      text += '\n';
    }
  });
  // 拼接平台系统菜单信息
  text += '二、平台系统模块信息：'
  for (const key in menuSetting) {
    if (menuSetting[key].length > 0) {
      const menuName = headerMenu.find((item) => item.key === key)?.name || key
      text += `${menuName}:${menuSetting[key].map((item) => item.label).filter((item) => item !== '模块介绍').join(',')}`
    }
  }

  return text;
};
const selectAllElements = computed({
  get: () => {
    return selectedElements.value.length === elements.value.length;
  },
  set: (value) => {
    if (value) {
      selectedElements.value = elements.value.map((element) => element._id);
    } else {
      selectedElements.value = [];
    }
  },
});

const getInfos = async () => {
  const trees = await getSafetyElementList({
    tree: true
  });
  elements.value = trees?.data || [];
  selectedElements.value = trees?.data.map((element) => element._id) || [];
};

// 获取隐患排查数据
const getHazardCheckData = async () => {
  try {
    const res: any = await hazardStatistics({
      start_date: dateRange.value[0],
      end_date: dateRange.value[1]
    });
  } catch (error) {
    console.log(error);
  }
};


// 组件挂载
onMounted(() => {
  getReginSelect();
  getHazardCheckData();
  getInfos();
  // 添加 beforeunload 事件监听
  window.addEventListener('beforeunload', handleBeforeUnload);
});

// 组件卸载
onUnmounted(() => {
  controller?.abort();
  isfail.value = false;
  spinning.value = true;
  isFetching.value = false;
  reportValue.value = '';
  // 清理统计数据相关状态
  reportDataLoading.value = false;
  // 移除 beforeunload 事件监听
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// 路由离开守卫
onBeforeRouteLeave((to, from, next) => {
  if (reportValue.value && reportValue.value.trim() !== '') {
    Modal.confirm({
      title: '提示',
      content: '当前报告有未保存的内容，是否保存后再离开？',
      okText: '保存并离开',
      cancelText: '不保存离开',
      centered: true,
      onOk: async () => {
        await saveReport();
        next();
      },
      onCancel: () => {
        next();
      },
    });
  } else {
    next();
  }
});

// 浏览器刷新/关闭提示
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (reportValue.value && reportValue.value.trim() !== '') {
    e.preventDefault();
    e.returnValue = '当前报告有未保存的内容，确定要离开吗？';
    return e.returnValue;
  }
};

// 过滤选中的维度数据
const filterSelectedDimensionsData = async () => {
  if (reportDataLoading.value) {
    message.info('区域基本信息加载中，请稍后')
    return;
  }
  // 如果没有选择任何维度，返回空对象
  if (selectedDimensions.value.length === 0) {
    return {};
  }

  try {
    // 1. 直接使用本地 mockDataGenerator 生成模拟数据
    const res: any = generateMockRiskAnalysisData({
      region_id: selectedKeys.value.join(','),
      start_date: dateRange.value[0],
      end_date: dateRange.value[1],
      time_granularity: activeDateType.value || 'day',
      include_dimensions: selectedDimensions.value.join(','),
    });
    let allData = res.data;
    let filteredData = {};

    // 2. 如果选择了告警维度，获取真实告警数据
    try {
      // 使用 getStaticReport 类似的方式获取告警统计数据
      filteredData = { ...alarmRes.value }
      if (!selectedDimensions.value.includes('alarm')) {
        delete filteredData.summary
      }
      allData = {
        ...allData,
        ...filteredData
      }
    } catch (error) {

    }

    // 3. 其他维度使用模拟数据

    if (selectedDimensions.value.includes('behavior') && allData.behavior_analysis) {
      filteredData.behavior_analysis = allData.behavior_analysis;
    }
    if (selectedDimensions.value.includes('training') && allData.training_analysis) {
      filteredData.training_analysis = allData.training_analysis;
    }
    if (selectedDimensions.value.includes('equipment') && allData.equipment_analysis) {
      filteredData.equipment_analysis = allData.equipment_analysis;
    }
    if (selectedDimensions.value.includes('operation') && allData.operation_analysis) {
      filteredData.operation_analysis = allData.operation_analysis;
    }
    if (selectedDimensions.value.includes('emergency') && allData.emergency_analysis) {
      filteredData.emergency_analysis = allData.emergency_analysis;
    }

    // 4. 始终包含汇总数据和风险评估（如果至少选择了一个维度）
    // if (allData.summary) {
    //   filteredData.summary = allData.summary;
    // }
    // if (allData.risk_assessment) {
    //   filteredData.risk_assessment = allData.risk_assessment;
    // }
    // if (allData.trend_prediction) {
    //   filteredData.trend_prediction = allData.trend_prediction;
    // }
    // if (allData.recommendations) {
    //   filteredData.recommendations = allData.recommendations;
    // }

    // 更新 reportOriginData，用于保存报告
    reportOriginData.value = allData;

    return filteredData;
  } catch (error) {
    console.error('生成模拟数据失败:', error);
    message.error('生成模拟数据失败，请稍后重试');
    return {};
  }
};
</script>

<style scoped lang="scss">
.document-viewer {
  width: 100%;
  height: 100%;
}

.document-header {
  width: 100%;
  background-color: #fff;
}

.document-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.content-tips {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

.inital {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2px;
  width: 100%;
}

.list-card {
  box-shadow: 0px 0px 3px 0px rgba(211, 211, 211, 0.36);
}

.document-content {
  width: 100%;
  padding: 20px;
  margin: 0 auto;
  background-color: #fff;

  :deep(.ant-spin-spinning) {
    margin-top: 100px;
  }
}

.content-wrapper {
  min-height: 100%;
  color: #333;
  background-color: #fff;

  /* 确保内容区域背景为白色 */
}


ul {
  padding-left: 2em;
}

.content-wrapper p {
  margin-bottom: 16px;
  line-height: 1.6;
  color: #333;
}

// 空数据状态样式
.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-text {
  margin: 0;
  font-size: 16px;
  color: #999;
  white-space: nowrap;
}

.empty-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

:deep(.ant-spin-nested-loading .ant-spin-container::after) {
  background: transparent !important;
}

.back-icon {
  &:hover {
    color: var(--tr-suggestion-primary-color) !important;
  }
}

.list-card {
  box-shadow: 0px 0px 3px 0px rgba(211, 211, 211, 0.36);
}
</style>
<style>
#report-container {
  all: initial;

  /* 重置所有继承样式 */
  contain: content;

  /* 样式隔离 */
  user-select: text;

  /* 重置内部元素样式 */
  * {
    all: revert;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: '宋体', SimSun, serif;
    font-size: 12pt;
    line-height: 1.5;
  }

  /* 确保表格等元素不会溢出 */
  table {
    max-width: 100%;
    border-collapse: collapse;
  }

  /* 限制图片大小 */
  img {
    max-width: 600px !important;
    height: auto;
  }

  ::marker {
    text-indent: unset !important;
  }

  ul {
    padding-left: 2em;
  }
}
</style>