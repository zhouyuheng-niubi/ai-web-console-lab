<template>
  <div ref="riskDashboardRef" class="safety-dashboard bg-white w-full h-full font-sans overflow-y-hidden flex flex-col">
    <div class="pb-[10px] h-fit relative z-1">
      <img src="@/assets/risk-banner/light_header.png" 
      alt="风险大屏" class="w-full h-fit bolck" />
      <div class="absolute top-2 left-10 text-blue-600 text-[14px] flex items-center">
        <span >{{ currentTime }}</span>
      </div>
      <div class="absolute z-1 text-gray-800 font-[500] text-[28px]
       top-[50%] left-[50%] translate-x-[-50%] translate-y-[-60%]">
        安全生产风险综合态势分析
      </div>
      <div class="absolute top-2 right-10 text-blue-600 text-[14px] flex items-center">
        <FullscreenOutlined v-if="!isFullscreen" @click="toggleVideoFullscreen" class="cursor-pointer text-[22px] text-blue-600"/>
        <FullscreenExitOutlined v-else @click="toggleVideoFullscreen" class="cursor-pointer text-[22px] text-blue-600"/>
      </div>
    </div>
    <!-- 主要内容区域 -->
    <div class="dashboard-content p-[10px] grid w-full grid-cols-[minmax(250px,1fr)_minmax(350px,2fr)_minmax(250px,1fr)] gap-4 flex-1 min-h-0">      <!-- 左侧列 -->
      <div class="dashboard-column flex flex-col gap-5 min-h-0">
        <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0 rounded-[10px]
          bg-[#ffffff80]">
            <div class="card-title flex items-center gap-2.5 text-base font-semibold 
            text-white text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
            bg-[url('@/assets/risk-banner/title_light_bg.png')] 
            bg-no-repeat 
            min-h-[32px] pl-5" style="background-size: 100% 100%">
              <CheckCircleOutlined class="title-icon text-lg text-white-600" />
              风险处置动态
            </div>
          <div class="completion-stats px-[20px] gap-2 flex-1 flex items-center flex-wrap">
              <div class="data-num-border w-[31%] h-fit relative bg-[#D2DBFF] py-[10px] rounded-[10px]"
                v-for="item,index in leftTotalArr"
                :key="index"
              >
                <div class="w-full flex items-center justify-center">
                  <span class="text-gray-800 text-[14px] font-[500]">{{ item.name }}: </span>
                  <span class="text-blue-600 text-[18px] font-[500]">{{ item.num }}</span>
                  <span class="text-gray-800 text-[12px] ml-[1px]">条</span>
                </div>
              </div>

          </div>
        </div>
        <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0 bg-[#ffffff80] rounded-[10px]">
          <div class="card-title flex items-center gap-2.5 text-base font-semibold 
            text-white text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
            bg-[url('@/assets/risk-banner/title_light_bg.png')] 
            bg-no-repeat min-h-[32px] pl-5" style="background-size: 100% 100%">
            <BarChartOutlined class="title-icon text-lg text-white-600" />
            风险来源分析
          </div>
           <div ref="riskSourceChart" class="chart-container ml-[10px]
            w-calc(100% - 10px)" style="width: 100%;flex: 1;min-height: 205px;"></div>
        </div>

        

        <!-- 企业风险趋势 -->
        <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0  rounded-[10px]
          bg-[#ffffff80]">
          <div class="card-title flex items-center gap-2.5 text-base font-semibold
           text-white text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
           bg-[url('@/assets/risk-banner/title_light_bg.png')] 
           bg-no-repeat  min-h-[32px] pl-5" style="background-size: 100% 100%">
            <LineChartOutlined class="title-icon text-lg text-white-600" />
            告警通知信息
          </div>

          <div class="scroll-container ml-[10px]  w-calc(100% - 10px) h-full overflow-hidden">
            <Vue3SeamlessScroll :list="alarmNotifications" :step="0.5" :hover="true">
              <div class="notification-item flex items-center py-2.5 px-1.5 border-b border-cyan-400/20 gap-2" 
              v-for="(item, index) in alarmNotifications" :key="index">
                <ExclamationCircleOutlined class="notification-icon text-orange-400 text-base flex-shrink-0" />
                <span class="notification-text text-sm text-blue-600 leading-tight flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                 <span :class="{'text-[#FF4757]': item.type === '紧急'}">【{{ item.type }}】</span>{{ item.text }}</span>
                <span class="notification-time text-xs text-blue-600 flex-shrink-0 ml-2">{{ item.time }}</span>
              </div>
            </Vue3SeamlessScroll>
          </div>
        </div>
      </div>




      <!-- 中间列 -->
      <div class="dashboard-column flex flex-col gap-5 min-h-0 relative">
        <div class="h-[85px] flex items-center justify-around  ml-[10px] bg-[#ffffff80] rounded-[5px]">
          <div v-for="item,index in alarmArr" :key="index" class="text-[#666] text-[14px] total-card bg-[#D2DBFF] rounded-[8px]
          px-[10px] py-[4px] flex flex-col items-center justify-arround">
              <div>{{ item.name }}</div>
              <div :style="{ color: item.color }">
                <span class="text-lg font-bold">{{ item.value }}</span>
                <span>{{ item.unit }}</span>
              </div>
          </div>
        </div>
        <div class="relative z-1 flex-1 overflow-y-auto visual-container">
          <!-- <img src="@/assets/risk-banner/cricle_bg.png" 
            alt="风险大屏" class="w-full h-[100%] bolck" /> -->
          <div ref="map3dContainer" class="circle-data-container w-full h-full min-h-[200px] absolute top-0 left-0">
            
          </div>           
        </div>
        
        <div class="flex h-[220px] w-full">
             <div class="dashboard-card flex flex-col flex-1 min-h-0  rounded-[10px] bg-[#ffffff80]">
                <div class="card-title flex items-center gap-2.5 text-base font-semibold 
                  text-white text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
                  bg-[url('@/assets/risk-banner/title_light_bg.png')] 
                  bg-no-repeat min-h-[32px] pl-5" style="background-size: 100% 100%">
                  <BarChartOutlined class="title-icon text-lg text-white-600" />
                  30天风险趋势
                </div>
                <div class="risk-trend  ml-[10px]  w-calc(100% - 10px) flex-1 min-h-0 p-2 flex flex-col relative">
                  <div ref="riskTrendChart" class="chart-container flex-1 min-h-[140px]"></div>
                </div>

             </div>
             <div class="dashboard-card flex flex-col flex-1 min-h-0 rounded-[10px]
          bg-[#ffffff80] ml-[10px]">
                <div class="card-title flex items-center gap-2.5 text-base font-semibold 
                  text-white text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
                  bg-[url('@/assets/risk-banner/title_light_bg.png')] 
                  bg-no-repeat min-h-[32px] pl-5" style="background-size: 100% 100%">
                  <BarChartOutlined class="title-icon text-lg text-white-600" />
                  区域风险对比
                </div>
                <div class="region-comparison ml-[10px]  w-calc(100% - 10px) flex-1 min-h-0 p-4 flex flex-col relative">
                  <div class="comparison-selector flex justify-end gap-3 absolute z-[10] top-[10px] right-[4px]">
                    <span 
                      class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                      :class="selectedRegionComparison === 'alarmTotal' ? 'bg-[#9AAFF9] text-white' : 'border-[1px] border-[#9AAFF9] text-[#9AAFF9]'"
                      @click="() => { selectedRegionComparison = 'alarmTotal'; handleRegionComparisonChange(); }"
                    >
                      报警总数
                    </span>
                    <span 
                      class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                      :class="selectedRegionComparison === 'hiddenDanger' ? 'bg-[#9AAFF9] text-white' : 'border-[1px] border-[#9AAFF9] text-[#9AAFF9]'"
                      @click="() => { selectedRegionComparison = 'hiddenDanger'; handleRegionComparisonChange(); }"
                    >
                      隐患排查
                    </span>
                    <span 
                      class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                      :class="selectedRegionComparison === 'processTime' ? 'bg-[#9AAFF9] text-white' : 'border-[1px] border-[#9AAFF9] text-[#9AAFF9]'"
                      @click="() => { selectedRegionComparison = 'processTime'; handleRegionComparisonChange(); }"
                    >
                      处置时效
                    </span>
                  </div>
                  <div ref="regionComparisonChart" class="chart-container flex-1 min-h-[220px]"></div>
                </div>
             </div>
        </div>
      </div>

      <!-- 右侧列 -->
      <div class="dashboard-column flex flex-col gap-5 min-h-0 ">
        <!-- 告警类型 TOP -->
        <div class="dashboard-card flex flex-col flex-1 min-h-0 alert-type-card rounded-[10px] bg-[#ffffff80]">
          <div class="card-title flex items-center gap-2.5 text-base font-semibold text-white 
          text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
          bg-[url('@/assets/risk-banner/title_light_bg.png')] 
          bg-no-repeat  min-h-[32px] pl-5"
          style="background-size: 100% 100%">
            <!-- 告警类型 TOP5 -->
            <FireOutlined class="title-icon text-lg text-white-600" />
            危险因素占比
          </div>
          <div class="flex flex-1 relative">
            <div class="flex justify-center absolute top-[4px] left-[50%] -translate-x-[50%] text-blue-400 text-[12px] w-[100%]">
              <div>
                <span class="mr-[2px] w-[10px] h-[10px] rounded-[50%] inline-block"
                  :style="{ background: 'linear-gradient(180deg, #1688EA 0%,#1688EA 50%, rgba(60,221,235,0.1) 100%)'}"
                ></span>人的不安全行为
              </div>
              <div class="ml-[10px]">
                  <span class="mr-[2px] w-[10px] h-[10px] rounded-[50%] inline-block"
                  :style="{ background: 'linear-gradient(180deg, #37CEEA 0%,#37CEEA 50%, rgba(158,255,221,0.1) 100%)'}"
                ></span>
                物的不安全状态
              </div>
              <div class="ml-[10px]">
                  <span class="mr-[2px] w-[10px] h-[10px] rounded-[50%] inline-block"
                  :style="{ background: 'linear-gradient(180deg, #877AEB 0%,#877AEB 50%, rgba(135,122,235,0.1) 100%)'}"
                ></span>
                管理因素
              </div>
            </div>            <!-- 风险来源总体占比（饼图） -->
            <div class="flex-1" ref="totalPieRef" style="height: 200px;"></div>
            <!-- 人/物不安全因素TOP5统计（柱状图） -->
            <div class="flex-1" ref="topBarRef" style="height: 200px;"></div>
          </div>
          <!-- <div class="border-gray-300 border-[1px] ml-[10px]
          bg-[#ffffff80] w-calc(100% - 10px) flex-1">
              <Tabs v-model:activeKey="activeAlertType" class="alert-tabs ml-4 text-[14px] text-gray-800">
                <TabPane key="environment" tab="环境安全">
                  <div ref="envAlertChart" class="chart-container min-h-[140px]"></div>
                </TabPane>
                <TabPane key="health" tab="健康安全">
                  <div ref="healthAlertChart" class="chart-container min-h-[140px]"></div>
                </TabPane>
              </Tabs>          
          </div> -->
        </div>


        <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0 rounded-[10px] bg-[#ffffffe8]">
            <div class="card-title flex items-center gap-2.5 text-base font-semibold text-white 
            text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
            bg-[url('@/assets/risk-banner/title_light_bg.png')] bg-no-repeat  min-h-[32px] pl-5"
            style="background-size: 100% 100%">
              <WarningOutlined class="title-icon text-lg text-white-600" />
              特殊作业票实时监控
            </div>
            <div class="scroll-container  h-full overflow-hidden">
              <div class="grid grid-cols-6 gap-2 text-blue-400 text-[12px] min-h-[40px] items-center border-b border-cyan-400/20 bg-[#ffffff80] relative z-[10]">
                <div class="text-center">作业编号</div>
                <div class="text-center">作业类型 </div>
                <div class="text-center">作业区域</div>
                <div class="text-center">作业状态 </div>
                <div class="text-center">作业时长</div>
                <div class="text-center">风险等级</div>
              </div>
              <Vue3SeamlessScroll :list="workPlanList" :step="0.8" :hover="true">
                <div class="grid grid-cols-6 gap-2 text-gray-800 text-[12px] min-h-[40px] items-center border-b border-cyan-400/20 relative z-[1]" v-for="(item, index) in workPlanList" :key="index">
                  <div class="text-center">{{ item.jobNumber }}</div>
                  <div class="text-center">{{ item.jobType }}</div>
                  <div class="text-center">{{ item.jobArea }}</div>
                  <div class="text-center" 
                  :class="item.jobStatus === '作业中' ? 'text-yellow-400' : 'text-green-400'">{{ item.jobStatus }}</div>
                  <div class="text-center">{{ item.jobDuration }}</div>
                  <div class="text-center">{{ item.riskLevel }}</div>
                </div>              </Vue3SeamlessScroll>
            </div>
        </div>

        <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0 rounded-[10px] bg-[#ffffff80]">
            <div class="card-title flex items-center gap-2.5 text-base font-semibold text-white 
            text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
            bg-[url('@/assets/risk-banner/title_light_bg.png')] bg-no-repeat  min-h-[32px] pl-5"
            style="background-size: 100% 100%">
              <WarningOutlined class="title-icon text-lg text-white-600" />
              班前会召开质量分析
            </div>
            <div class="scroll-container h-full overflow-hidden">
              <div class="grid grid-cols-6 gap-2 text-blue-400 text-[12px] min-h-[40px] items-center border-b border-cyan-400/20 bg-[#ffffffdc] relative z-[10]">
                <div class="text-center">日期</div>
                <div class="text-center">班次 </div>
                <div class="text-center">召开状态</div>
                <div class="text-center">风险交底 </div>
                <div class="text-center">措施确认</div>
                <div class="text-center">问题反馈</div>
              </div>
              <Vue3SeamlessScroll :list="meettingRecord" :step="0.8" :hover="true">
                <div class="grid grid-cols-6 gap-2 text-gray-800 text-[12px] min-h-[40px] items-center border-b border-cyan-400/20 relative z-[1]" 
                v-for="(item, index) in meettingRecord" :key="index">
                  <div class="text-center">{{ item.createTime }}</div>
                  <div class="text-center">{{ item.workType }}</div>
                  <div class="text-center">{{ item.openTxt}}</div>
                  <div class="text-center" 
                  :class="item.finished === '完整' ? 'text-green-400': 'text-yellow-400' ">{{ item.finished }}</div>
                  <div class="text-center">{{ item.comfirmed }}</div>
                  <div class="text-center">{{ item.feedback }}</div>
                </div>              </Vue3SeamlessScroll>
            </div>
        </div>


        <!-- 区域风险对比 -->
        <!-- <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0">
          <div class="card-title flex items-center gap-2.5 text-base font-semibold text-gray-800
           text-shadow-[0_0_10px_rgba(0,212,255,0.5)] bg-[url('@/assets/risk-banner/title_light_bg.png')] 
           bg-no-repeat  min-h-[32px] pl-5" style="background-size: 100% 100%">
            <ClusterOutlined class="title-icon text-lg text-white-600" />
            区域风险对比
          </div>
          <div class="region-comparison border-gray-300 border-[1px]
           ml-[10px]bg-[#ffffff80] w-calc(100% - 10px) flex-1 min-h-0 p-4 flex flex-col relative">
            <div class="comparison-selector flex justify-end gap-3 absolute z-[10] top-[10px] right-[4px]">
              <span 
                class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                :class="selectedRegionComparison === 'alarmTotal' ? 'bg-cyan-500 text-white' : 'bg-[#4064FC] text-blue-600'"
                @click="() => { selectedRegionComparison = 'alarmTotal'; handleRegionComparisonChange(); }"
              >
                报警总数
              </span>
              <span 
                class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                :class="selectedRegionComparison === 'hiddenDanger' ? 'bg-cyan-500 text-white' : 'bg-[#4064FC] text-blue-600'"
                @click="() => { selectedRegionComparison = 'hiddenDanger'; handleRegionComparisonChange(); }"
              >
                隐患排查
              </span>
              <span 
                class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                :class="selectedRegionComparison === 'processTime' ? 'bg-cyan-500 text-white' : 'bg-[#4064FC] text-blue-600'"
                @click="() => { selectedRegionComparison = 'processTime'; handleRegionComparisonChange(); }"
              >
                处置时效
              </span>
            </div>
            <div ref="regionComparisonChart" class="chart-container flex-1 min-h-[220px]"></div>
          </div>
        </div> -->
      </div>
    </div>

    <!-- 预警弹窗 -->
    <Modal
      v-model:open="warningVisible"
      title="风险预警提醒"
      :footer="null"
      width="500px"
      centered
    >
      <div class="warning-content flex gap-5 items-start mb-6">
        <ExclamationCircleOutlined class="warning-icon text-5xl text-[#FF4757] animate-pulse" />
        <div class="warning-text">
          <h3 class="mb-3 text-lg text-blue-600">{{ warningData.title }}</h3>
          <p class="mb-4 text-sm leading-relaxed text-blue-600">{{ warningData.message }}</p>
          <div class="warning-detail flex gap-6 text-sm text-[#494949]">
            <span>当前值：{{ warningData.currentValue }}</span>
            <span>阈值：{{ warningData.threshold }}</span>
          </div>
        </div>
      </div>
      <div class="warning-actions text-right">
        <Button type="primary" @click="handleWarningConfirm">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Modal, Button, Radio, DatePicker} from 'ant-design-vue'
import {
  BarChartOutlined,
  CheckCircleOutlined,
  FireOutlined,
  WarningOutlined,
  LineChartOutlined,
  ExclamationCircleOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons-vue'
import * as echarts from 'echarts'
// import 'echarts-gl'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import RotatingCards from '@/components/RotatingCards.vue'
import {getRegionList} from '@/api/system/region'
import {rjyJson} from '@/utils/mapSeting'
import { v4 as uuidv4 } from 'uuid'
import { 
  leftTotalArr, 
  alarmArr, 
  cardsData, 
  workPlanList, 
  meettingRecord, 
  alarmNotifications, 
  thresholdRules,
  regionOptions,
  totalData,
  topData,
  riskSourceDetails,
  regionComparisonData,
  formatToFixed,
  getRiskLevelClass,
  regionAlarmCount,
  regionNames,
  warnRuleSetting
} from '@/utils/data-risk'

// 导入音频播放器
import enhancedAudioPlayer, {
  initAudioPlayer,
  stopAudio,
  stopAudioCompletely, // 完全停止函数
  setVolume, // 音量控制函数
} from '@/utils/enhancedAudioPlayer'
import {stopAllNativeAudioElements,enterFullscreen,exitFullscreen} from '@/utils/tool'

const { RangePicker } = DatePicker
const { Group: RadioGroup, Button: RadioButton } = Radio
// 当前时间
const currentTime = ref('')
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 告警数据
const alertData = ref({
  unhandledTotal: 127,
  trend: [] // 2小时趋势数据
})

// 生成2小时趋势数据
const generateTrendData = () => {
  const data = []
  const now = Date.now()
  for (let i = 120; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 60000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      value: Math.floor(Math.random() * 50) + 100
    })
  }
  return data
}

// 风险数据
const riskData = ref({
  completed: 245,
  pending: 38
})

// 时效数据
const timeData = ref({
  today: 2.3,
  yesterday: 3.1,
  trend: -25.8
})

// 预警弹窗
const warningVisible = ref(false)
const warningData = ref({
  title: '',
  message: '',
  currentValue: '',
  threshold: ''
})


// 告警类型选项卡
const activeAlertType = ref('environment')

// 图表引用
const alertTrendChart = ref(null)
const completionChart = ref(null)
const envAlertChart = ref(null)
const healthAlertChart = ref(null)
const riskSourceChart = ref(null) // 风险来源分析图表
const riskTrendChart = ref(null) // 30天风险趋势图
// 新增的风险来源图表引用
const totalPieRef = ref(null)  // 风险来源占比饼图
const topBarRef = ref(null)    // TOP5排名柱状图

// 图表实例
let charts = []
// 新增的风险来源图表实例
let totalPieChart = null
let topBarChart = null

// 初始化告警趋势图
const initAlertTrendChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!alertTrendChart.value) {
      console.warn('告警趋势图表容器尚未准备好，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (alertTrendChart.value) {
          initAlertTrendChart()
        }
      }, 100)
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(alertTrendChart.value)) {
      console.warn('告警趋势图表容器不在文档中，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (document.contains(alertTrendChart.value)) {
          initAlertTrendChart()
        }
      }, 100)
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = alertTrendChart.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('告警趋势图表容器尺寸为0，稍后重试:', { width: offsetWidth, height: offsetHeight })
      // 延迟重试
      setTimeout(() => {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = alertTrendChart.value || {};
        if (newWidth > 0 && newHeight > 0) {
          initAlertTrendChart()
        }
      }, 100)
      return
    }
    
    const chart = echarts.init(alertTrendChart.value)
    const trendData = generateTrendData()
    
    const option = {
      backgroundColor: 'transparent',
      grid: { top: 20, right: 20, bottom: 30, left: 50 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#d1d5db',
        borderWidth: 1,
        textStyle: { color: '#374151' },
        formatter: (params) => {
          if (Array.isArray(params)) {
            return params.map(param => 
              `${param.axisValueLabel}<br />${param.marker}${param.seriesName || ''}: ${param.value}次`
            ).join('<br />');
          }
          return `${params.name}<br />${params.marker}${params.seriesName || params.name}: ${params.value}次`;
        }
      },
      xAxis: {
        type: 'category',
        data: trendData.map(d => d.time),
        axisLabel: { color: '#4b5563', interval: 29 },
        axisLine: { lineStyle: { color: '#d1d5db' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6cb8ff' },
        splitLine: { lineStyle: { color: '#1e5a8e', type: 'dashed' } }
      },
      series: [{
        name: '告警数量',
        data: trendData.map(d => d.value),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00d4ff', width: 3 },
        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     { offset: 0, color: 'rgba(0, 212, 255, 0.5)' },
        //     { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
        //   ])
        // },
        itemStyle: { color: '#00d4ff' },
        symbol: 'circle',
        symbolSize: 6
      }]
    }
    
    chart.setOption(option)
    charts.push(chart)
  } catch (error) {
    console.error('初始化告警趋势图表失败:', error)
  }
}

// 初始化环境告警图
const initEnvAlertChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!envAlertChart.value) {
      console.warn('环境告警图表容器尚未准备好，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (envAlertChart.value) {
          initEnvAlertChart()
        }
      }, 100)
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(envAlertChart.value)) {
      console.warn('环境告警图表容器不在文档中，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (document.contains(envAlertChart.value)) {
          initEnvAlertChart()
        }
      }, 100)
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = envAlertChart.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('环境告警图表容器尺寸为0，稍后重试:', { width: offsetWidth, height: offsetHeight })
      // 延迟重试
      setTimeout(() => {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = envAlertChart.value || {};
        if (newWidth > 0 && newHeight > 0) {
          initEnvAlertChart()
        }
      }, 100)
      return
    }
    
    const chart = echarts.init(envAlertChart.value)
    
    const option = {
      backgroundColor: 'transparent',
      grid: { top: 20, right: 40, bottom: 20, left: 100 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(10, 30, 80, 0.9)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        textStyle: { color: '#fff' },
        formatter: (params) => {
          if (Array.isArray(params)) {
            return params.map(param => 
              `${param.name}<br />${param.marker}${param.seriesName || param.name}: ${param.value}次`
            ).join('<br />');
          }
          return `${params.name}<br />${params.marker}${params.seriesName || params.name}: ${params.value}次`;
        }
      },
      xAxis: {
        type: 'value',
        axisLabel: { color: '#6cb8ff' },
        splitLine: { lineStyle: { color: '#1e5a8e', type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: ['二氧化碳', '甲烷', '氨气', '氢气', '氧气'],
        axisLabel: { color: '#6cb8ff' },
        axisLine: { lineStyle: { color: '#1e5a8e' } }
      },
      series: [{
        name: '环境告警',
        type: 'bar',
        data: [89, 76, 65, 54, 48],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#BC7DF2' },
            { offset: 1, color: '#F1B629' }
          ]),
          borderRadius: [0, 5, 5, 0]
        },
        barWidth: 10,
        label: {
          show: true,
          position: 'right',
          color: '#6cb8ff'
        }
      }]
    }
    
    chart.setOption(option)
    charts.push(chart)
  } catch (error) {
    console.error('初始化环境告警图表失败:', error)
  }
}

// 初始化健康告警图
const initHealthAlertChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!healthAlertChart.value) {
      console.warn('健康告警图表容器尚未准备好，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (healthAlertChart.value) {
          initHealthAlertChart()
        }
      }, 100)
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(healthAlertChart.value)) {
      console.warn('健康告警图表容器不在文档中，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (document.contains(healthAlertChart.value)) {
          initHealthAlertChart()
        }
      }, 100)
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = healthAlertChart.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('健康告警图表容器尺寸为0，稍后重试:', { width: offsetWidth, height: offsetHeight })
      // 延迟重试
      setTimeout(() => {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = healthAlertChart.value || {};
        if (newWidth > 0 && newHeight > 0) {
          initHealthAlertChart()
        }
      }, 100)
      return
    }
    
    const chart = echarts.init(healthAlertChart.value)
    
    const option = {
      backgroundColor: 'transparent',
      grid: { top: 20, right: 40, bottom: 20, left: 100 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(10, 30, 80, 0.9)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        textStyle: { color: '#fff' },
        formatter: (params) => {
          if (Array.isArray(params)) {
            return params.map(param => 
              `${param.name}<br />${param.marker}${param.seriesName || param.name}: ${param.value}次`
            ).join('<br />');
          }
          return `${params.name}<br />${params.marker}${params.seriesName || params.name}: ${params.value}次`;
        }
      },
      xAxis: {
        type: 'value',
        axisLabel: { color: '#6cb8ff' },
        splitLine: { lineStyle: { color: '#1e5a8e', type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: ['未穿工作服', '未带安全帽', '烟雾', '火焰','跌倒'],
        axisLabel: { color: '#6cb8ff' },
        axisLine: { lineStyle: { color: '#1e5a8e' } }
      },
      series: [{
        name: '健康告警',
        type: 'bar',
        data: [92, 85, 67, 43, 21],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#f59e0b' },
            { offset: 1, color: '#ef4444' }
          ]),
          borderRadius: [0, 5, 5, 0]
        },
        barWidth: 10,
        label: {
          show: true,
          position: 'right',
          color: '#6cb8ff'
        }
      }]
    }
    
    chart.setOption(option)
    charts.push(chart)
  } catch (error) {
    console.error('初始化健康告警图表失败:', error)
  }
}

// 初始化风险来源分析图表
const initRiskSourceChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!riskSourceChart.value) {
      console.warn('风险来源分析图表容器尚未准备好，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (riskSourceChart.value) {
          initRiskSourceChart()
        }
      }, 100)
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(riskSourceChart.value)) {
      console.warn('风险来源分析图表容器不在文档中，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (document.contains(riskSourceChart.value)) {
          initRiskSourceChart()
        }
      }, 100)
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = riskSourceChart.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('风险来源分析图表容器尺寸为0，稍后重试:', { width: offsetWidth, height: offsetHeight })
      // 延迟重试
      setTimeout(() => {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = riskSourceChart.value || {};
        if (newWidth > 0 && newHeight > 0) {
          initRiskSourceChart()
        }
      }, 100)
      return
    }
    
    // 销毁现有图表实例（如果存在）
    const existingChart = charts.find(chart => chart.dom === riskSourceChart.value);
    if (existingChart) {
      existingChart.dispose();
      charts = charts.filter(chart => chart.dom !== riskSourceChart.value);
    }
    
    const chart = echarts.init(riskSourceChart.value)
    
    // 风险来源数据
    let echartData = [
      {
        value: 50,
        name: '人员因素',
      },
      {
        value: 20,
        name: '设备设施',
      },
      {
        value: 20,
        name: '环境因素',
      },
      {
        value: 10,
        name: '管理因素',
      },
    ];
    
    let attackSourcesColor = [
      new echarts.graphic.LinearGradient(0, 1, 1, 1, [
        { offset: 0, color: 'rgba(254, 69, 97, 0)' },
        { offset: 1, color: 'rgba(254, 69, 97, 1)' },
      ]),
      new echarts.graphic.LinearGradient(0, 1, 1, 1, [
        { offset: 0, color: 'rgba(254, 69, 97, 0)' },
        { offset: 1, color: 'rgba(255, 155, 0, 1)' },
      ]),
      new echarts.graphic.LinearGradient(0, 1, 1, 1, [
        { offset: 0, color: 'rgba(254, 69, 97, 0)' },
        { offset: 1, color: 'rgba(233, 217, 0, 1)' },
      ]),
      new echarts.graphic.LinearGradient(0, 1, 1, 1, [
        { offset: 0, color: 'rgba(0, 245, 255, 0)' },
        { offset: 1, color: 'rgba(0, 245, 255, 1)' },
      ]),
    ];

    let option = {
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          for (var i = 0; i < params.length; i++) {
            return params[i].name + ':' + params[i].data.value + '%';
          }
        },
      },
      grid: {
        containLabel: true,
        bottom: '10%',
        left: '-5%',
        top: '10%',
        right: '10%',
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        max: 100,
        min: 0, 
      },
      yAxis: [
        {
          type: 'category',
          data: echartData.map(item => item.name),
          inverse: true,
          position: 'left',
          axisLabel: {
            fontSize: '18px',
            padding: [-3, 0, 0, 0],
            margin: 18,
            formatter: function (value, index) {
              return `{b|${index + 1}}`;
              
            },
            rich: {
              b: {
                color: '#374151',
                backgroundColor: 'rgba(156, 163, 175, 0.20)',
                borderWidth: 2,
                width: 23,
                height: 23,
                align: 'center',
                borderRadius: 23,
                fontSize: 12,
              }
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        {
          type: 'category',
          data: echartData.map(item => item.value),
          inverse: true,
          position: 'right',
          axisLabel: {
            padding: [-3, 0, 0, 0],
            margin: 10,
            formatter: function (value, index) {
              return `{a|${echartData[index].value}}{b|%}`;
            },
            rich: {
              a: {
                fontSize: 15,
                color: '#374151',
                padding: [4, 5, 0, 0],
              },
              b:{
                padding: [4, 0, 0, 0],
              }
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        {
          type: 'category',
          inverse: true,
          position: 'left',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: echartData.map((item) => item.name),
          axisLabel: {
            show: true,
            margin: -2,
            fontSize: 12,
            align: 'top',
            verticalAlign: "bottom",
            padding: [0, 0, 10, 0],
            color: '#374151',
          },
        },
      ],
      series: [
        {
          data: echartData.map((item, i) => {
            let itemStyle = {
              color: i > 3 ? attackSourcesColor[3] : attackSourcesColor[i],
            };
            return {
              value: item.value,
              itemStyle: itemStyle,
            };
          }),
          type: 'bar',
          barWidth: 6,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(209, 213, 219, 1)',
            borderRadius: 30,
          },
          // label: {
          //   show: true,
          //   position: 'insideRight',
          //   distance: -10,
          //   formatter: (params) => {
          //     console.log(params,'params')
          //     if (params.dataIndex < 3) {
          //       return `{img${params.dataIndex}|}`;
          //     } else {
          //       return `{b|}`;
          //     }
          //   },
          // },
        },
      ],
    };
    
    chart.setOption(option)
    charts.push(chart)
  } catch (error) {
    console.error('初始化风险来源分析图表失败:', error)
  }
}



// 在现有数据之后添加新的数据
// 隐患排查统计数据
const selectedRegion = ref('')

const timeRangeType = ref('year') // 'year' 或 'custom'
const customTimeRange = ref([])

// 隐患排查统计图表引用
const hiddenDangerChart = ref(null)

// 区域选择变化处理
const handleRegionChange = (value) => {
  selectedRegion.value = value
  nextTick(() => {
    initHiddenDangerChart()
  })
}

// 时间范围类型变化处理
const handleTimeRangeChange = (e) => {
  timeRangeType.value = e.target.value
  nextTick(() => {
    initHiddenDangerChart()
  })
}

// 自定义时间范围变化处理
const handleCustomTimeChange = (dates) => {
  customTimeRange.value = dates
  if (dates && dates.length === 2) {
    nextTick(() => {
      initHiddenDangerChart()
    })
  }
}

// 刷新图表数据
const refreshChartData = () => {
  initHiddenDangerChart()
}

// 初始化隐患排查统计图表
const initHiddenDangerChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!hiddenDangerChart.value) {
      console.warn('隐患排查统计图表容器尚未准备好，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (hiddenDangerChart.value) {
          initHiddenDangerChart()
        }
      }, 100)
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(hiddenDangerChart.value)) {
      console.warn('隐患排查统计图表容器不在文档中，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (document.contains(hiddenDangerChart.value)) {
          initHiddenDangerChart()
        }
      }, 100)
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = hiddenDangerChart.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('隐患排查统计图表容器尺寸为0，稍后重试:', { width: offsetWidth, height: offsetHeight })
      // 延迟重试
      setTimeout(() => {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = hiddenDangerChart.value || {};
        if (newWidth > 0 && newHeight > 0) {
          initHiddenDangerChart()
        }
      }, 100)
      return
    }
    
    //  销毁现有图表实例（如果存在）
    const existingChart = charts.find(chart => chart.dom === hiddenDangerChart.value);
    if (existingChart) {
      existingChart.dispose();
      charts = charts.filter(chart => chart.dom !== hiddenDangerChart.value);
    }
    
    const chart = echarts.init(hiddenDangerChart.value)
    
    // 生成模拟数据
    const generateHiddenDangerData = () => {
      const data = []
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      
      months.forEach(month => {
        data.push({
          month,
          count: Math.floor(Math.random() * 100) + 50
        })
      })
      
      return data
    }
    
    const hiddenDangerData = generateHiddenDangerData()
    
    const option = {
      backgroundColor: 'transparent',
      grid: { top: 30, right: 30, bottom: 40, left: 60 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10, 30, 80, 0.9)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        textStyle: { color: '#fff' },
        formatter: (params) => {
          if (Array.isArray(params)) {
            return params.map(param => 
              `${param.name}<br />${param.marker}${param.seriesName || param.name}: ${param.value}次`
            ).join('<br />');
          }
          return `${params.name}<br />${params.marker}${params.seriesName || params.name}: ${params.value}次`;
        }
      },
      xAxis: {
        type: 'category',
        data: hiddenDangerData.map(d => d.month),
        axisLabel: { color: '#6cb8ff' },
        axisLine: { lineStyle: { color: '#1e5a8e' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6cb8ff' },
        splitLine: { lineStyle: { color: '#1e5a8e', type: 'dashed' } }
      },
      series: [{
        name: '隐患数量',
        data: hiddenDangerData.map(d => d.count),
        type: 'line',
        smooth: true,
        lineStyle: { color: '#00d4ff', width: 3 },
        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     { offset: 0, color: 'rgba(0, 212, 255, 0.5)' },
        //     { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
        //   ])
        // },
        itemStyle: { color: '#00d4ff' },
        symbol: 'circle',
        symbolSize: 6
      }]
    }
    
    chart.setOption(option)
    charts.push(chart)
  } catch (error) {
    console.error('初始化隐患排查统计图表失败:', error)
  }
}

// 监听选项卡变化，重新初始化对应的图表
watch(activeAlertType, (newVal) => {
  nextTick(() => {
    setTimeout(() => {
      if (newVal === 'environment' && envAlertChart.value) {
        // 销毁现有的环境告警图表实例（如果存在）
        const existingEnvChart = charts.find(chart => chart.dom === envAlertChart.value);
        if (existingEnvChart) {
          existingEnvChart.dispose();
          charts = charts.filter(chart => chart.dom !== envAlertChart.value);
        }
        initEnvAlertChart();
      } else if (newVal === 'health' && healthAlertChart.value) {
        // 销毁现有的健康告警图表实例（如果存在）
        const existingHealthChart = charts.find(chart => chart.dom === healthAlertChart.value);
        if (existingHealthChart) {
          existingHealthChart.dispose();
          charts = charts.filter(chart => chart.dom !== healthAlertChart.value);
        }
        initHealthAlertChart();
      }
    }, 50); // 短暂延迟确保DOM更新完成
  });
});

// 生成30天风险趋势数据
const generateRiskTrendData = () => {
  // 生成最近30天的日期
  const dates = [];
  const data = {};
  
  // 为6个实验室分别生成数据
  const labNames = regionNames;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // 格式化日期，包括月份和日期
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateStr = `${month}-${day}`;
    dates.push(dateStr);
    
    // 为每个实验室生成随机数据
    labNames.forEach(lab => {
      if (!data[lab]) data[lab] = [];
      // 生成50-200之间的随机数
      data[lab].push(Math.floor(Math.random() * 150) + 50);
    });
  }
  
  return { dates, data };
};

// 初始化30天风险趋势图
const initRiskTrendChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!riskTrendChart.value) {
      console.warn('30天风险趋势图表容器尚未准备好，稍后重试');
      // 延迟重试
      setTimeout(() => {
        if (riskTrendChart.value) {
          initRiskTrendChart();
        }
      }, 100);
      return;
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(riskTrendChart.value)) {
      console.warn('30天风险趋势图表容器不在文档中，稍后重试');
      // 延迟重试
      setTimeout(() => {
        if (document.contains(riskTrendChart.value)) {
          initRiskTrendChart();
        }
      }, 100);
      return;
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = riskTrendChart.value;
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('30天风险趋势图表容器尺寸为0，稍后重试:', { width: offsetWidth, height: offsetHeight });
      // 延迟重试
      setTimeout(() => {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = riskTrendChart.value || {};
        if (newWidth > 0 && newHeight > 0) {
          initRiskTrendChart();
        }
      }, 100);
      return;
    }
    
    // 销毁现有图表实例（如果存在）
    const existingChart = charts.find(chart => chart.dom === riskTrendChart.value);
    if (existingChart) {
      existingChart.dispose();
      charts = charts.filter(chart => chart.dom !== riskTrendChart.value);
    }
    
    const chart = echarts.init(riskTrendChart.value);
    
    // 生成数据
    const { dates, data } = generateRiskTrendData();
    
    // 为6个实验室创建6个数据系列
    const labNames = regionNames;
    const colors = ['#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    
    const series = labNames.map((lab, index) => ({
      name: lab,
      type: 'line',
      data: data[lab],
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: {
        width: 2,
        color: colors[index]
      },
      itemStyle: {
        color: colors[index]
      }
    }));
    
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#d1d5db',
        borderWidth: 1,
        textStyle: { color: '#374151' },
        formatter: (params) => {
          let result = `${params[0].name}<br/>`;
          params.forEach(param => {
            result += `${param.marker} ${param.seriesName}: ${param.value}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: labNames,
        textStyle: { color: '#6cb8ff', fontSize: 10 },
        top: 10,
        left: 10,
        orient: 'horizontal'
      },
      grid: {
        top: 50,
        right: 20,
        bottom: 40, // 调整底部边距以适应较小的滚动条
        left: 50
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: { 
          color: '#4b5563', 
          fontSize: 10,
          rotate: 45,
          interval: 2 // 每隔2个标签显示一个，减少拥挤
        },
        axisLine: { lineStyle: { color: '#1e5a8e' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6cb8ff' },
        splitLine: { lineStyle: { color: '#1e5a8e', type: 'dashed' } }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 30, // 默认显示最近30%的数据
          end: 100, // 显示到最新的数据
          height: 20, // 减小滚动条高度
          handleSize: '80%',
          handleStyle: {
            color: '#00d4ff'
          },
          textStyle: {
            color: '#4b5563',
            fontSize: 10 // 减小字体大小
          },
          borderColor: '#d1d5db',
          fillerColor: 'rgba(156, 163, 175, 0.1)',
          dataBackground: {
            lineStyle: {
              color: '#d1d5db'
            },
            areaStyle: {
              color: '#f3f4f6'
            }
          },
          // 设置最小缩放范围
          minValueSpan: 5, // 最小显示5天的数据
          zoomLock: false // 允许缩放
        }
      ],
      series: series
    };
    
    chart.setOption(option);
    charts.push(chart);
  } catch (error) {
    console.error('初始化30天风险趋势图表失败:', error);
  }
};

// 模拟阈值触发
const checkThreshold = async () => {  
  // 随机触发预警演示用
  if (Math.random() > 0.5) {
    // 随机选择一个规则
    const randomRule = warnRuleSetting[Math.floor(Math.random() * warnRuleSetting.length)]
    // 生成当前值（超过阈值的80%-120%）
    const currentValue = (randomRule.threshold_value * (0.8 + Math.random() * 0.4)).toFixed(1)
    if(currentValue < randomRule.threshold_value) return
    // 根据告警等级设置不同的标题和消息
    const alertConfig = { 
      low: { title: '提醒', severity: '提醒' },
      medium: { title: '警告', severity: '警告' },
      high: { title: '重要告警', severity: '重要告警' },
      critical: { title: '紧急告警', severity: '紧急告警' }
    }
    
    const config = alertConfig[randomRule.alert_level] || alertConfig.medium
    
    warningData.value = {
      title: `${config.title} - ${randomRule.rule_name}`,
      message: `${randomRule.description}当前值已超过安全阈值，请立即处理！`,
      currentValue: `${currentValue}${randomRule.unit}`,
      threshold: `${randomRule.threshold_value}${randomRule.unit}`
    }
    const text= `${warningData.value.title}${warningData.value.message},当前值：${currentValue}${randomRule.unit}，阈值：${randomRule.threshold_value}${randomRule.unit}`
    await playAlarmSound(text)
    warningVisible.value = true
  }
}

// 音频流请求
let streamController = null // 添加终止信号
const requestAudioStream = async (content) => {
  await streamController?.abort()
  streamController = new AbortController()
  const response = await fetch(`${import.meta.env.VITE_NEWAI_API}/ai/tts/realtime`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({
      text: content,
      voice:'cosyvoice-v3-myvoice-a068a4eb42c148deab21dced90c9aaa4'
    }),
    signal: streamController.signal // 添加终止信号
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response
}
// 停止当前音频播放并更新播放状态
const stopCurrentAudioPlayback = async (iosAudioCategory = 'playback') => {
  try {
    stopAudio()
    stopAllNativeAudioElements()
    enhancedAudioPlayer.onPlay = null
    enhancedAudioPlayer.onPause = null
    enhancedAudioPlayer.onStop = null
    enhancedAudioPlayer.onEnd = null
    enhancedAudioPlayer.audioBuffers = []
    enhancedAudioPlayer.currentBufferIndex = 0
    enhancedAudioPlayer.currentBufferPosition = 0
    enhancedAudioPlayer.totalFramesProcessed = 0

    if (iosAudioCategory === 'record') {
      if (enhancedAudioPlayer.audioContext && enhancedAudioPlayer.audioContext.state === 'running') {
        try {
          // 暂停而非关闭，方便后续恢复
          await enhancedAudioPlayer.audioContext.suspend();
          console.log('已暂停音频上下文');
        } catch (error) {
          console.warn('暂停音频上下文失败:', error);
        }
      }
    } else {
      // 对于播放场景，重新初始化播放器
      await enhancedAudioPlayer.init(iosAudioCategory);
      // 确保 AudioContext 已恢复
      if (enhancedAudioPlayer.audioContext && enhancedAudioPlayer.audioContext.state === 'suspended') {
        await enhancedAudioPlayer.audioContext.resume();
        console.log('AudioContext 已恢复');
      }
    }

    
  } catch (error) {
    console.error('停止音频播放时出错:', error)
  }
}
// 报警音频效果
const playAlarmSound = async(text) => {
  await stopCurrentAudioPlayback()
  let reader = null
  try {
    const uuid = uuidv4()
    const response = await requestAudioStream(text)
    reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          while (true) {
            const lineEnd = buffer.indexOf('\n')
            if (lineEnd === -1) break
            const line = buffer.slice(0, lineEnd).trim()
            buffer = buffer.slice(lineEnd + 1)
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[AUDIO_DONE]') {
                // 音频流结束
                break
              }
              try {
                // 如果有音频数据，则播放
                if (data) {
                  playBase64AudioData(uuid, data,
                    // 结束播放
                    () => {
                        console.log('播放完成')
                    },
                    // 自动播放回调
                    () => {
                      console.log('自动播放回调...')
                      
                    }, false, true) // 流式播放
                }
              } catch (error) {
                console.error('解析错误1:', error)
              }
            }
          }
        }
  }
  catch (error) {
    console.error('播放音频时出错:', error)
  }
}

// 播放Base64音频数据 - 增强版
const playBase64AudioData = async (id, base64Data, onEndedCallback = null, onStartedCallback = null, isCachedPlayback = false, shouldPlay = true) => {
  try {
    
    // 如果有开始播放回调，设置onPlay事件
    if (onStartedCallback && !isCachedPlayback) {
      enhancedAudioPlayer.onPlay = onStartedCallback
    }
    
    // 确保音频上下文已解锁
    const isUnlocked = await enhancedAudioPlayer.ensureAudioContextUnlocked();
    if (!isUnlocked) {
      console.warn('音频上下文未解锁，可能需要用户交互');
    }
    await enhancedAudioPlayer.addAudioData(id, base64Data, onEndedCallback, false, shouldPlay)
  } catch (error) {
    console.error('播放音频失败:', error);
  }
}




// 确认预警
const handleWarningConfirm = () => {
  warningVisible.value = false
}

// 区域统计
const regionData = ref([])
const getRegionData = async () => {
  try {
    const res = await getRegionList()
    regionData.value = res.data
  } catch (error) {
    console.error('获取区域数据失败:', error)
  }
}


// 定时器
let timeInterval = null
let thresholdInterval = null

onMounted(() => {
  getRegionData()
  // 更新时间
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  // 使用 nextTick 确保 DOM 更新完成后再初始化图表
  nextTick(() => {
    // 添加一个小延迟确保DOM完全渲染
    setTimeout(() => {
      try {
        // 初始化所有图表
        initAlertTrendChart()
        initEnvAlertChart()
        initHealthAlertChart()
        // 初始化隐患排查统计图表
        initHiddenDangerChart()
        // 初始化区域风险对比图表
        initRegionComparisonChart()
        // 初始化风险来源图表
        initRiskSourceChart() // 新增的风险来源分析图表
        initTotalPieChart()
        initTopBarChart()
        // 初始化30天风险趋势图
        initRiskTrendChart()
        // 初始化3D地图
        initMap3D()
      } catch (error) {
        console.error('图表初始化过程中发生错误:', error)
      }
    }, 100)
  })  
  // 定时检查阈值
  thresholdInterval = setInterval(checkThreshold, 10000)
  
  // 响应式调整
  const handleResize = () => {
    setTimeout(() => {
      charts.forEach(chart => {
        try {
          if (chart && typeof chart.resize === 'function') {
            chart.resize()
          }
        } catch (error) {
          console.error('图表 resize 过程中发生错误:', error)
        }
      })
    }, 100)
  }


  enhancedAudioPlayer?.clearAllCache()
  // 初始化音频播放器
  initAudioPlayer().catch(error => {
    console.error('初始化音频播放器失败:', error)
  })
  setVolume(1.0);

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  clearInterval(timeInterval)
  clearInterval(thresholdInterval)
  charts.forEach(chart => {
    try {
      chart && chart.dispose()
    } catch (error) {
      console.error('图表销毁过程中发生错误:', error)
    }
  })
  charts = []
  
  // 销毁新增的图表
  try {
    if (totalPieChart) {
      totalPieChart.dispose();
      totalPieChart = null;
    }
    if (topBarChart) {
      topBarChart.dispose();
      topBarChart = null;
    }
  } catch (error) {
    console.error('新增图表销毁过程中发生错误:', error)
  }
  
  // 销毁30天风险趋势图
  const riskTrendChartInstance = charts.find(chart => chart.dom === riskTrendChart.value);
  if (riskTrendChartInstance) {
    try {
      riskTrendChartInstance.dispose();
      charts = charts.filter(chart => chart.dom !== riskTrendChart.value);
    } catch (error) {
      console.error('30天风险趋势图销毁过程中发生错误:', error);
    }
  }

  // 清除音频播放器
  // 完全停止所有音频播放
  stopAudioCompletely()
  enhancedAudioPlayer?.clearAllCache()
})
// 区域风险对比图表引用
const regionComparisonChart = ref(null)
// 选中的对比维度
const selectedRegionComparison = ref('alarmTotal')
// 处理区域对比维度变化
const handleRegionComparisonChange = () => {
  nextTick(() => {
    initRegionComparisonChart()
  })
}

// 初始化风险来源总体占比（饼图）
const initTotalPieChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!totalPieRef.value) {
      console.warn('风险来源总体占比图表容器尚未准备好，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (totalPieRef.value) {
          initTotalPieChart()
        }
      }, 100)
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(totalPieRef.value)) {
      console.warn('风险来源总体占比图表容器不在文档中，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (document.contains(totalPieRef.value)) {
          initTotalPieChart()
        }
      }, 100)
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = totalPieRef.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('风险来源总体占比图表容器尺寸为0，稍后重试:', { width: offsetWidth, height: offsetHeight })
      // 延迟重试
      setTimeout(() => {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = totalPieRef.value || {};
        if (newWidth > 0 && newHeight > 0) {
          initTotalPieChart()
        }
      }, 100)
      return
    }
    
    // 销毁现有图表实例（如果存在）
    if (totalPieChart) {
      totalPieChart.dispose();
    }
    
    totalPieChart = echarts.init(totalPieRef.value)
    totalPieChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (params && params.name && params.value !== undefined) {
            return `${params.name}: ${params.value} (${params.percent}%)`;
          }
          return '';
        },
         backgroundColor: 'rgba(255,255,255,.9)',
        borderColor: '#d1d5db',
        textStyle: { color: '#374151' },
        padding: [5, 10],
        extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);'
      },
      // legend: { orient: 'horizontal', left: 'center', data: totalData.categories, textStyle: { color: '#fff', fontSize: 12 } },
      series: [
        {
          name: '风险数量',
          type: 'pie',
          radius: ['40%', '60%'],
          data: totalData.categories.map((name, idx) => ({
            name, value: totalData.values[idx]
          })),
          itemStyle: {
            color: (params) => {
              // 使用与柱状图相同的渐变色
              if (params.dataIndex === 0) {
                // 人的不安全行为 - 与柱状图第一个系列相同的渐变色
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#1688EA' },
                  { offset: 1, color: 'rgba(60,221,235,0.1)' }
                ], false);
              } else if (params.dataIndex === 1) {
                // 物的不安全状态 - 与柱状图第二个系列相同的渐变色
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#37CEEA' },
                  { offset: 1, color: 'rgba(158,255,221,0.1)' }
                ], false);
              }
              else if (params.dataIndex === 2) {
                // 管理因素 - 与柱状图第三个系列相同的渐变色
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#877AEB' },
                  { offset: 1, color: 'rgba(135,122,235,0.1)' }
                ], false);
              }

            }
          },
          label: { formatter: '{d}%', color: '#374151', position: 'inside' },
          labelLine: { show: false }
        }
      ]
    })
    charts.push(totalPieChart)
  } catch (error) {
    console.error('初始化风险来源总体占比图表失败:', error)
  }
}

// 初始化人/物/管理不安全因素TOP5统计（柱状图）
const initTopBarChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!topBarRef.value) {
      console.warn('人/物不安全因素TOP5统计图表容器尚未准备好，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (topBarRef.value) {
          initTopBarChart()
        }
      }, 100)
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(topBarRef.value)) {
      console.warn('人/物不安全因素TOP5统计图表容器不在文档中，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (document.contains(topBarRef.value)) {
          initTopBarChart()
        }
      }, 100)
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = topBarRef.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('人/物不安全因素TOP5统计图表容器尺寸为0，稍后重试:', { width: offsetWidth, height: offsetHeight })
      // 延迟重试
      setTimeout(() => {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = topBarRef.value || {};
        if (newWidth > 0 && newHeight > 0) {
          initTopBarChart()
        }
      }, 100)
      return
    }
    
    // 销毁现有图表实例（如果存在）
    if (topBarChart) {
      topBarChart.dispose();
    }
    
    topBarChart = echarts.init(topBarRef.value)
    const topOption = {
      grid: {
        top: "60",
        bottom: "25",
      },
      tooltip: {
        trigger: 'axis',
        padding: [5, 10, 5, 10],
        backgroundColor: 'rgba(255,255,255,.9)',
        borderColor: '#d1d5db',
        axisPointer: {
          type: "shadow",
        },
        formatter: (param) => {
          // 获取当前项的索引
          const index = param[0]?.dataIndex || 0;
          // 构建 tooltip 内容
          let tooltipContent = `
            <div class="reservoirAlarmChart-popup" style="color:#374151;">
              <p class="top">
                  <span>${param[0]?.axisValue} </span>
              </p>
          `;
          
          param.forEach((item, i) => {
            // 添加基础信息行
            tooltipContent += `
              <p class="item" style="display:flex;align-items:center;margin:5px 0;">
                  <i class="icon" style="width:8px;height:8px;border-radius:50%;background-color:${item.color.colorStops[0]?.color || 'red'};margin-right:8px;"></i>
                  <span class="name" style="margin-right:10px;">
                    ${item.seriesName === "人的不安全行为"?riskSourceDetails.human[index]:
                    item.seriesName === '物的不安全状态' ? riskSourceDetails.object[index] :
                    item.seriesName === '管理因素' ? riskSourceDetails.management[index] :''
                    
                    }</span>
                  <span class="value"><b>${formatToFixed(item.data)}</b>${item.data !== '--' ? '次' : ''}</span>
              </p>
            `;
          });
          
          tooltipContent += `</div>`;
          return tooltipContent;
        }
      },
      xAxis: {
        nameGap: 1,
        type: 'category',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d1d5db'
          },
        },
        axisLabel: {
          color: '#4b5563',
          fontSize: 12,
          rotate: 45,
        },
        axisTick: {
          show: false,
        },
        data: topData.xAxisData, // top1-top5
      },
      yAxis: [
        {
          nameTextStyle: {
            color: '#4b5563',
          },
          offset: 0,
          name: '数量(个)',
          type: 'value',
          axisLabel: {
            show: true,
            color: "#4b5563",
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#d1d5db'
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#d1d5db",
              type: 'dashed'
            }
          },
        }
      ],
      series: [{
        name: "人的不安全行为",
        type: "bar",
        barWidth: 10,
        symbol: "circle",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#1688EA' },
            { offset: 1, color: 'rgba(60,221,235,0.1)' }
          ], false),
          borderRadius: [5, 5, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: '#6cb8ff',
          fontSize: 10
        },
        data: topData.humanValues
      },
      {
        name: "物的不安全状态",
        type: "bar",
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#37CEEA' },
            { offset: 1, color: 'rgba(158,255,221,0.1)' }
          ], false),
          borderRadius: [5, 5, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: '#6cb8ff',
          fontSize: 10
        },
        data: topData.objectValues
      },
      {
        name: "管理因素",
        type: "bar",
        barWidth: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#877AEB' },
            { offset: 1, color: 'rgba(135,122,235,0.1)' }
          ], false),
          borderRadius: [5, 5, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: '#6cb8ff',
          fontSize: 10
        },
        data: topData.managementValues
      }
      ]
    };
    topBarChart.setOption(topOption)
    charts.push(topBarChart)
  } catch (error) {
    console.error('初始化人/物不安全因素TOP5统计图表失败:', error)
  }
}

// 初始化区域风险对比图表
const initRegionComparisonChart = () => {  try {
    // 确保DOM元素存在且已挂载
    if (!regionComparisonChart.value) {
      console.warn('区域风险对比图表容器尚未准备好，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (regionComparisonChart.value) {
          initRegionComparisonChart()
        }
      }, 100)
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(regionComparisonChart.value)) {
      console.warn('区域风险对比图表容器不在文档中，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (document.contains(regionComparisonChart.value)) {
          initRegionComparisonChart()
        }
      }, 100)
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = regionComparisonChart.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('区域风险对比图表容器尺寸为0，稍后重试:', { width: offsetWidth, height: offsetHeight })
      // 延迟重试
      setTimeout(() => {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = regionComparisonChart.value || {};
        if (newWidth > 0 && newHeight > 0) {
          initRegionComparisonChart()
        }
      }, 100)
      return
    }
    
    // 销毁现有图表实例（如果存在）
    const existingChart = charts.find(chart => chart.dom === regionComparisonChart.value);
    if (existingChart) {
      existingChart.dispose();
      charts = charts.filter(chart => chart.dom !== regionComparisonChart.value);
    }
    
    const chart = echarts.init(regionComparisonChart.value)
    
    // 定义12个月份
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    
    // 根据选中的维度准备数据
    let seriesData = []
    let title = ''
    
    switch(selectedRegionComparison.value) {
      case 'alarmTotal':
        title = '各区域报警总数对比'
        // 为每个实验室创建一个数据系列
        seriesData = regionComparisonData.value.map((item, index) => ({
          name: item.region,
          type: 'bar',
          barWidth: 14,
          stack: '总量',
          itemStyle: {
            color: ['#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]
          },
          data: item.alarmTotal
        }))
        break;
      case 'hiddenDanger':
        title = '各区域隐患排查对比'
        // 为每个实验室创建一个数据系列，使用模拟数据
        seriesData = regionComparisonData.value.map((item, index) => ({
          name: item.region,
          type: 'bar',
          barWidth: 14,
          stack: '总量',
          itemStyle: {
            color: ['#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]
          },
          data: Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 20)
        }))
        break
      case 'processTime':
        title = '各区域平均处置时效对比'
        // 为每个实验室创建一个数据系列
        seriesData = regionComparisonData.value.map((item, index) => ({
          name: item.region,
          type: 'bar',
          barWidth: 14,
          stack: '总量',
          itemStyle: {
            color: ['#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]
          },
          data: item.processTime
        }))
        break
      default:
        // 默认显示报警总数
        title = '各区域报警总数对比'
        seriesData = regionComparisonData.value.map((item, index) => ({
          name: item.region,
          type: 'bar',
          barWidth: 14,
          stack: '总量',
          itemStyle: {
            color: ['#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]
          },
          data: item.alarmTotal
        }))
        break
    }
    
    const option = {
      backgroundColor: 'transparent',
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          color: '#6cb8ff',
          fontSize: 14
        },
        show: false
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          let result = params[0].name + '<br/>';
          params.forEach(param => {
            result += param.marker + param.seriesName + ': ' + param.value + 
                     (selectedRegionComparison.value === 'processTime' ? '小时' : 
                      selectedRegionComparison.value === 'hiddenDanger' ? '个' : 
                      selectedRegionComparison.value === 'alarmTotal' ? '次' : '') + '<br/>';
          });
          return result;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#d1d5db',
        borderWidth: 1,
        textStyle: { color: '#374151' }
      },
      legend: {
        data: regionComparisonData.value.map(item => item.region),
        textStyle: { color: '#6cb8ff', fontSize: 10 },
        top: 20,
        left: 20,
        right: 0,
      },
      grid: {
        top: 60,
        right: 20,
        bottom: 60,
        left: 60
      },
      xAxis: {
        type: 'category',
        data: months, // 使用12个月份作为x轴数据
        axisLabel: { 
          color: '#4b5563', 
          fontSize: 10,
          rotate: 45,
          interval: 0
        },
        axisLine: { lineStyle: { color: '#1e5a8e' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6cb8ff' },
        splitLine: { lineStyle: { color: '#1e5a8e', type: 'dashed' } }
      },
      series: seriesData // 使用我们构建的多个系列数据
    }
    
    chart.setOption(option)
    charts.push(chart)
  } catch (error) {
    console.error('初始化区域风险对比图表失败:', error)
  }
}


// 初始化3D地图
const map3dContainer = ref(null)
const initMap3D = () => { 
  const chart = echarts.init(map3dContainer.value)
  echarts.registerMap('RJY', rjyJson);
  const option = {
    title: {
        text: '区域报警热力图',
        right: 0,
        top: 0,
        textStyle: {
            color: '#4b5563',
            fontSize: 16
        }
    },
    tooltip: {
        trigger: 'item'
    },
    visualMap: {
        min: 50,
        max: 1000,
        text: ['高', '低'],
        realtime: false,
        calculable: true,
        inRange: {
            color: ['#0974FE', '#03EBDF', '#FCBE08', '#F84742']
        }
    },
    series: [
    {
        name: '区域报警热力图',
        type: 'map',
        mapType: 'RJY', // 自定义扩展图表类型
        aspectScale:1.2, //长宽比
        
        zoom: 1,
        zlevel: 1,
        label: {
            show: true,
            color: '#fff',
            fontSize:12,
            formatter: function(params) {
                return params.data.name+'\n\n报警数: '+params.data.value
            }
        },
        itemStyle: {
            normal: {
                shadowColor: '#09689E',
                shadowOffsetX: 10,
                shadowOffsetY: 10,
            },
        },
        nameProperty: 'NAME',
        data:regionAlarmCount
    },
    
    
  ]
  }
  chart.setOption(option)
}

const riskDashboardRef = ref(null)
const isFullscreen = ref(false)
// 切换视频容器全屏
const toggleVideoFullscreen = () => {
  if (!isFullscreen.value) {
    // 进入全屏
    if (riskDashboardRef.value) {
      isFullscreen.value = true
      enterFullscreen(riskDashboardRef.value)
    }
  } else {
    isFullscreen.value = false
    // 退出全屏
    exitFullscreen()
  }
}

</script>
<style scoped lang="scss">
  .safety-dashboard{
    background-image: url('@/assets/risk-banner/light_bg.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  :deep(.ant-tabs .ant-tabs-tab){
    padding: 5px 0;
  }

  .visual-container{
    /* Webkit浏览器滚动条样式 */
    &::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background:transparent;
        display: none;
    }
    
    &::-webkit-scrollbar-track {
        background:transparent;
        border-radius: 4px;
        display: none;
    }
    
    &::-webkit-scrollbar-thumb {
       background:transparent;
        border-radius: 4px;
        display: none;
        
        &:hover {
            background:transparent;
        }
    }
    
    /* Firefox滚动条样式 */
    scrollbar-width: none;
    
    /* IE和Edge滚动条样式 */
    -ms-overflow-style: none;
  }

</style>