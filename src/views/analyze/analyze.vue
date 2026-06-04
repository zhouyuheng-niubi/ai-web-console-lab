<template>
  <div class="document-viewer relative flex flex-col p-[16px] 
     box-border w-[100%] h-[100%] bg-[#F8FAFC]">
    <div class="box-border flex flex-1 w-full min-h-0">
      <div class="document-header relative w-full h-full box-border overflow-auto
      bg-[#fff] rounded-[12px] list-card  flex flex-col" style="flex:0.25;min-width: 360px;max-width: 360px">
        <div class="font-bold text-[18px] text-[#717B92] leading-1 text-center p-[16px] border-b-[1px] border-[#E5E5E5]">{{ regionName }}报警情况分析报告</div>
        <div class="document-actions mt-[10px] w-full p-[16px]">
          <!-- 区域选择 -->
          <div class="mb-[20px]">
            <div class="font-bold text-[14px] text-[#717B92] mb-[8px]">
              <span class="text-red-500">*</span>选择区域:
            </div>
            <div class="w-full max-h-[200px] min-h-[100px] overflow-y-auto">
              <Spin :spinning="regionLoading" tip="加载中...">
                  <Tree v-model:selectedKeys="selectedKeys" :tree-data="regionOptions" :disabled="disabled"
                    :fieldNames="{ children: 'children', title: 'region_name', key: 'region_id' }" @select="onTreeSelect" :show-line="true" />                
              </Spin>

            </div>
          </div>

          <!-- 时间范围 -->
          <div class="mb-[20px]">
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
            <RangePicker @change="changeDateRange" :disabled="disabled" v-model:value="dateRange"
              format="YYYY-MM-DD HH:mm:ss" :allowClear="false" show-time value-format="YYYY-MM-DD HH:mm:ss"
              class="w-full" />
          </div>
        </div>
        <!-- 数据加载完成提示效果 -->
        <div class="text-center text-[14px] text-[#999]" v-if="!reportDataLoading && !spinning && !isFetching && !isfail && !regionLoading">
          <span class="w-[8px] h-[8px] bg-green-500 inline-block rounded-[4px]"></span>
            数据已加载完成，请点击 
            <span class="text-blue-600 cursor-pointer"  @click="refreshfn">{{inital?'启动研判':'重新研判'}}</span>
        </div>
        <!-- 操作按钮 -->
        <div class="flex gap-[10px] mt-[20px] px-[16px]">
          <Button
            type="primary"
            @click="refreshfn"
            :disabled="disabled || !canStartAnalysis || reportDataLoading"
            class="flex-1">
            <template v-if="inital">启动研判</template>
            <template v-else>重新研判</template>
          </Button>
          <Button
            v-if="!inital && isFetching"
            @click="cancelSend"
            class="flex-1">
            取消研判
          </Button>
        </div>

        <!-- 下载/保存按钮 -->
        <div v-if="reportValue && !isFetching" class="flex gap-[10px] mt-[10px] px-[16px]">
          <Button @click="exportItem" class="flex-1">
            <span>
              <DownloadOutlined class="mr-[4px]" />
              下载报告
            </span>
          </Button>
          <Button @click="saveItem" type="primary" class="flex-1">
            <span>
              <SaveOutlined class="mr-[4px]" />
            保存报告
            </span>
          </Button>
        </div>

        <!-- 缓存统计 -->
        <!-- <div class="p-[16px] border-t-[1px] border-[#E5E5E5] mt-auto">
          <div class="text-[12px] text-[#999]">
            <div>缓存数量: {{ cacheCount }}</div>
            <div>缓存大小: {{ cacheSizeKB }} KB</div>
          </div>
        </div> -->
      </div>
      <div class="document-content h-full bg-[#fff] rounded-[12px] list-card  h-full flex flex-col" style="flex:0.7">
        <div class="inital-text border-b-[1px] border-[#E6E6E6] pb-[16px]">
          <div class="text-[16px] text-[#576075]">我是安全生产风险管控智能化平台智能分析助手，基于对设备与监测的深度认知，为您提供专业的安全风险分析服务。</div>
          <div class="text-[14px] text-[#717B92] mt-2">使用提示:
            请选择目标场所，系统将自动生成详尽的风险分析报告。如需更新报告内容，可使用"重新分析"功能；完成分析后，可通过"下载"功能将报告保存至本地。</div>
        </div>
        <div class="overflow-y-auto flex-1">
          <Spin size="large" :tip="reportDataLoading ? '分析数据加载中...':'智能分析中...'" 
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
                <Button size="small" type="primary" @click="refreshfn" class="ml-1">重新分析</Button>
              </div>
            </div>
            <div class="flex flex-col items-center mt-2 w-full inital" v-if="inital">
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
import { Button, Spin, message, Tree, RangePicker, TabPane, Tabs, Modal } from 'ant-design-vue';
import { DownloadOutlined, SaveOutlined } from '@ant-design/icons-vue';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import emptyImg from '@/assets/document-empty.png';
import { getRegionList } from '@/api/system/region';
import { riskAnalysisStatistics, saveRiskAnalysisReport } from '@/api/warn/index';
import { RiskAnalysisCache } from '@/utils/RiskAnalysisCache';

const currentDateType = [
  {
    value: 'year',
    label: '本年'
  },
  {
    value: 'quarter',
    label: '本季'
  },
  {
    value: 'month',
    label: '本月'
  },
  {
    value: 'week',
    label: '本Maintainer'
  },
  {
    value: 'auto',
    label: '本日'
  },
  {
    value: '',
    label: '自定义'
  }
]
const activeDateType = ref('auto')

// 缓存统计
const cacheCount = ref(0);
const cacheSizeKB = ref(0);

// 添加 Tree 组件相关的响应式数据
const selectedKeys = ref([''])
const regionName = ref('')
const inital = ref(true)
const changeDateRange = (value) => {
  activeDateType.value = ''
  dateRange.value = value
  getStaticReport()
};
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
const exportItem = async () => {
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
        `${regionName.value + '风险分析智能报告'}${dayjs().format('YYYY-MM-DD HH:mm:ss')}.docx`,
      );
    });
  } catch (error) {
    console.error('导出失败:', error);
    message.error({ content: '导出失败', key: 'export' });
  }
};
// 保存报告内容
const saveItem = async () => {
  try {
    if (!reportValue.value)
      return message.info('暂无报告数据，请生成报告后保存！');
    // 调用保存逻辑
    saveRiskAnalysisReport({
      report_name: `${regionName.value}报警情况分析报告`,
      report_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      report_area: regionName.value,
      message: reportValue.value,
      type:'单项研判'
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


const disabled = ref(false);
const isfail = ref(false);
const isFetching = ref(false); // 请求锁
const spinning = ref(false);
const reportValue = ref(''); // 用于存储报告内容
let controller: any = null; // 存储 AbortController
const dateRange = ref([dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')])
const getData = async () => {
  if (isFetching.value) return;
  isFetching.value = true;

  // 只有在有活动的controller时才中止
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: reportOriginData.value
    }),
    signal: controller.signal,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NEWAI_API}/ai/analysis/risk-report/jaa`,
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
    isFetching.value = false
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
            isFetching.value = false;
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
    isFetching.value = false;
    isfail.value = true;
  } finally {
    isFetching.value = false;
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
const AIPrompt = (area: string) => {
  const text = `
## 一、内容要求：
1. 查询"${area}"高危企业、重大危险源等安全生产相关数据，以当前和未来天气、历史事故、历史风险作为根据并结合"${area}"查询到的相关数据，分析和推断"${area}"的风险情况，基于以上信息生成完整的、针对性的、实际的"一乡一策决策报告"。
输出中如果返回了连接，请在报告中添加超链接，并添加超链接的描述。


## 二、格式规范及强制自验证要求
### （一）格式规范细则
1. 报告标题：使用'<p>${area ? area : ''}风险分析报告</p>'标签包裹，字体采用三号黑体加粗，必须居中显示。
2. 报告日期：固定在报告标题下方，统一格式为"报告日期：YYYY年MM月DD日"，居中显示，字体为小四（12pt）宋体，西文/数字用Times New Roman。
3. 标题层级格式：
     报告标题:字体采用三号黑体加粗，必须居中显示
   - 一级标题：段前段后各1行，三号黑体加粗，左对齐；
   - 二级标题：段前段后各0.5行，四号黑体加粗，左对齐；
   - 三级标题：小四号黑体加粗，左对齐，段前段后各0.5行（与正文段落间距保持一致）；
   - 四级标题：首行缩进2字符，小四号宋体加粗，左对齐，段前段后各0.5行。
4. 文档整体格式：
   - 中文字体：宋体；西文/数字字体：Times New Roman；
   - 正文字号：小四（12pt）；行距：1.5倍；
   - 段落间距：段前0.5行，段后0.5行；
   - 对齐方式：全文两端对齐（标题、报告日期除外，按对应要求对齐）；
   - 段落首行缩进：2字符（标题、报告日期、表格内容除外）。
5. 其他规则：
   - 报告结尾：禁止出现报告单位、"以上报告"等收尾表述；

### （二）AI自验证强制流程
生成报告后，需按以下步骤自动校验格式，确保完全符合要求，未通过校验需重新调整：
1. 标签校验：检查报告标题是否用'<p>'标签包裹且居中，无多余标签或缺失标签；
2. 标题层级校验：逐一核对各级标题的字体、字号、加粗状态、对齐方式及段前段后间距，确保与对应层级要求一致；
3. 文本格式校验：
   - 随机抽取3处正文段落，检查字体、字号、行距、段落间距、首行缩进及对齐方式是否符合规范；
   - 检查所有西文/数字（如日期、气温、数量等）是否使用Times New Roman字体；
4. 特殊内容校验：
   - 确认报告日期格式正确，且包含"当前天气"相关内容，无格式错误；
   - 检查报告结尾是否无违规收尾表述；
5. 整体兼容性校验：确保HTML代码可直接在Word中打开，格式不错乱（核心校验标签使用、样式设置的规范性，避免出现Word不兼容的代码）。


## 三、输出要求
最终以HTML格式输出完整报告，输出内容仅包含HTML代码，无任何格式说明、注释等额外文字，确保代码可直接复制使用且格式100%符合上述规范。
`;
  return text;
};

// 修改 handleClick 函数为 Tree 组件的 select 事件处理函数
const onTreeSelect = async (selectedKeysValue, e) => {
  selectedKeys.value = selectedKeysValue
  // 获取选中的节点数据
  const selectedNode = e.selectedNodes[0]
  if (selectedNode) {
    regionName.value = selectedNode.region_name
    if (!dateRange.value?.length) return
    await getStaticReport()
  }
}

// 时间范围更改
const handleDateChange = (item: any) => {
  if (disabled.value) return
  activeDateType.value = item.value
  switch (item.value) {
    case 'year':
      dateRange.value = [dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss')]
      break;
    case 'quarter':
      const currentMonth = dayjs().month();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3; // 计算季度开始月份
      const quarterStart = dayjs().startOf('year').month(quarterStartMonth).startOf('month');
      const quarterEnd = quarterStart.add(2, 'month').endOf('month');
      dateRange.value = [quarterStart.format('YYYY-MM-DD HH:mm:ss'), quarterEnd.format('YYYY-MM-DD HH:mm:ss')];
      break;
    case 'month':
      dateRange.value = [dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')]
      break;
    case 'week':
      const today = dayjs();
      const dayOfWeek = today.day();
      const monday = dayOfWeek === 0 ? today.subtract(6, 'day') : today.subtract(dayOfWeek - 1, 'day');
      const sunday = monday.add(6, 'day');
      dateRange.value = [monday.startOf('day').format('YYYY-MM-DD HH:mm:ss'), sunday.endOf('day').format('YYYY-MM-DD HH:mm:ss')];
      break;
    case 'auto':
      dateRange.value = [dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')]
      break;
    default:
      dateRange.value = []
      break;
  }

  if (dateRange.value?.length) {
    getStaticReport()
  }
}


const refreshfn = () => {
  if (reportDataLoading.value) {
    return message.info('数据加载中，请稍后')
  }
  if (!dateRange.value?.length) {
    return message.info('请选择日期范围');
  }
  inital.value = false
  isfail.value = false;
  spinning.value = true;
  isFetching.value = false;
  reportValue.value = '';
  chatStream();
};
const cancelSend = () => {
  controller?.abort()
  isFetching.value = false;
  spinning.value = false
}

// 场所列表
const regionOptions = ref([]);

// 计算属性
const canStartAnalysis = computed(() => {
  return selectedKeys.value.length > 0 && dateRange.value?.length === 2;
});

// 更新缓存统计
const updateCacheStats = () => {
  cacheCount.value = RiskAnalysisCache.getCacheCount();
  cacheSizeKB.value = Math.round(RiskAnalysisCache.getCacheSize() / 1024);
};

const regionLoading= ref(false)
const getReginSelect = async () => {
  regionLoading.value = true
  getRegionList({
    include_hierarchy: true,
  }).then((res: any) => {
    regionLoading.value = false
    regionOptions.value = res.data?.hierarchy || []
    regionOptions.value.unshift({ region_name: '全部区域', region_id: '' })
    selectedKeys.value = ['']
    updateCacheStats();
    getStaticReport()
  });
};

// 获取报警统计信息
const reportOriginData = ref({});
const reportDataLoading = ref(false); // 报告数据加载状态
const reportDataError = ref(null); // 报告数据错误信息
const getStaticReport = async () => {
  if (!dateRange.value?.length) {
    return
  }

  try {
    reportDataLoading.value = true;
    reportDataError.value = null;

    const res: any = await riskAnalysisStatistics({
      region_id: selectedKeys.value.join(','),
      start_date: dateRange.value[0],
      end_date: dateRange.value[1],
      time_granularity: activeDateType.value || 'auto',
    });
    reportOriginData.value = res.data;
  } catch (error) {
    console.error('获取统计数据失败:', error);
    reportDataError.value = error.message || '获取统计数据失败';
    message.error('获取统计数据失败，请稍后重试');
  } finally {
    reportDataLoading.value = false;
  }
}

onMounted(() => {
  // chatStream();
  getReginSelect();
  // 添加 beforeunload 事件监听
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  controller?.abort()
  isfail.value = false;
  spinning.value = true;
  isFetching.value = false;
  reportValue.value = '';
  // 清理统计数据相关状态
  reportDataLoading.value = false;
  reportDataError.value = null;
  // 更新缓存统计
  updateCacheStats();
  // 移除 beforeunload 事件监听
  window.removeEventListener('beforeunload', handleBeforeUnload);
})

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
        await saveItem();
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
</script>

<style scoped lang="scss">
.document-viewer {
  width: 100%;
  height: 100%;
}

.document-header {
  width: 100%;
  background-color: #fff;
  // border-bottom: 1px solid #e0e0e0;
}

.document-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.document-content {
  width: 100%;
  // max-width: 1200px;
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
    max-width: 100%;
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