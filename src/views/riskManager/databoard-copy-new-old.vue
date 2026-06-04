<template>
  <div class="safety-dashboard bg-[#060606] h-full font-sans overflow-y-hidden flex flex-col">
    <div class="pb-[10px] h-fit relative z-1">
      <img src="@/assets/risk-banner/top_head.png" 
      alt="风险大屏" class="w-full h-fit bolck" />
      <div class="absolute z-1 text-[#fff] text-[28px] font-[500]
       top-[50%] left-[50%] translate-x-[-50%] translate-y-[-60%]">
        安全生产风险综合态势分析
      </div>
      <div class="absolute top-2 right-10 text-[#00D4FF] text-[14px]">
        {{ currentTime }}
      </div>
    </div>
    <!-- 主要内容区域 -->
    <div class="dashboard-content p-[10px] grid w-full grid-cols-[minmax(250px,1fr)_minmax(350px,2fr)_minmax(250px,1fr)] gap-4 flex-1 min-h-0">      <!-- 左侧列 -->
      <div class="dashboard-column flex flex-col gap-5 min-h-0">
        <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0">
            <div class="card-title flex items-center gap-2.5 text-base font-semibold 
            text-white text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
            bg-[url('@/assets/risk-banner/title_bg.png')] 
            bg-no-repeat 
            min-h-[32px] pl-5" style="background-size: 100% 100%">
              <CheckCircleOutlined class="title-icon text-lg text-cyan-400" />
              风险处置动态
            </div>
          <div class="completion-stats border-[#1B3283] border-[1px] ml-[10px]
           bg-[#060F2D] w-calc(100% - 10px) px-[20px] flex items-center flex-wrap
           gap-2 flex-1 min-h-0">
              <div class="data-num-border w-[31%] relative"
                v-for="item,index in leftTotalArr"
                :key="index"
              >
                <img src="@/assets/risk-banner/data-border-big.png" class="w-full block" />
                <div class="absolute text-[#70CDF9] top-[-12px] left-[15px] text-[16px]">
                  {{ item.name }}
                </div>
                <div class="absolute top-[40%] left-[50%] -translate-x-[50%]">
                  <span class="text-[#fff] text-[16px] font-[500]">{{ item.num }}</span>
                  <span class="text-[#a5a5a5] text-[12px] ml-[2px]">条</span>
                </div>
              </div>

          </div>
        </div>
        <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0">
          <div class="card-title flex items-center gap-2.5 text-base font-semibold 
            text-white text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
            bg-[url('@/assets/risk-banner/title_bg.png')] 
            bg-no-repeat min-h-[32px] pl-5" style="background-size: 100% 100%">
            <BarChartOutlined class="title-icon text-lg text-cyan-400" />
            风险来源分析
          </div>
           <div ref="riskSourceChart" class="chart-container border-[#1B3283] border-[1px] ml-[10px]
            bg-[#060F2D] w-calc(100% - 10px)" style="width: 100%;flex: 1;min-height: 205px;"></div>
        </div>

        

        <!-- 企业风险趋势 -->
        <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0">
          <div class="card-title flex items-center gap-2.5 text-base font-semibold
           text-white text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
           bg-[url('@/assets/risk-banner/title_bg.png')] 
           bg-no-repeat  min-h-[32px] pl-5" style="background-size: 100% 100%">
            <LineChartOutlined class="title-icon text-lg text-cyan-400" />
            告警通知信息
          </div>

          <div class="scroll-container border-[#1B3283] border-[1px] ml-[10px] bg-[#060F2D] w-calc(100% - 10px) h-full overflow-hidden">
            <Vue3SeamlessScroll :list="alarmNotifications" :step="0.5" :hover="true">
              <div class="notification-item flex items-center py-2.5 px-1.5 border-b border-cyan-400/20 gap-2" 
              v-for="(item, index) in alarmNotifications" :key="index">
                <ExclamationCircleOutlined class="notification-icon text-orange-400 text-base flex-shrink-0" />
                <span class="notification-text text-sm text-cyan-400 leading-tight flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                 <span :class="{'text-[#FF4757]': item.type === '紧急'}">【{{ item.type }}】</span>{{ item.text }}</span>
                <span class="notification-time text-xs text-cyan-400 flex-shrink-0 ml-2">{{ item.time }}</span>
              </div>
            </Vue3SeamlessScroll>
          </div>
        </div>
      </div>




      <!-- 中间列 -->
      <div class="dashboard-column flex flex-col gap-5 min-h-0 relative">
        <div class="h-[85px] flex items-center justify-around  border-[#1B3283] border-[1px] ml-[10px]
           bg-[#060F2D]">
          <div v-for="item,index in alarmArr" :key="index" class="text-white text-[14px] total-card 
          px-[10px] py-[4px] flex flex-col items-center justify-arround">
              <div>{{ item.name }}</div>
              <div :style="{ color: item.color }">
                <span class="text-lg font-bold">{{ item.value }}</span>
                <span>{{ item.unit }}</span>
              </div>
          </div>
        </div>
        <div class="relative z-1 flex-1 overflow-y-auto">
          <img src="@/assets/risk-banner/cricle_bg.png" 
            alt="风险大屏" class="w-full h-[100%] bolck" />
          <div class="circle-data-container w-full h-full min-h-[500px] absolute top-0 left-0">
            <RotatingCards :cards="cardsData" />
          </div>           
        </div>
        
        <div class="flex h-[220px] absolute bottom-0 w-full left-0">
             <div class="dashboard-card flex flex-col flex-1 min-h-0">
                <div class="card-title flex items-center gap-2.5 text-base font-semibold 
                  text-white text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
                  bg-[url('@/assets/risk-banner/title_bg.png')] 
                  bg-no-repeat min-h-[32px] pl-5" style="background-size: 100% 100%">
                  <BarChartOutlined class="title-icon text-lg text-cyan-400" />
                  30天风险趋势
                </div>
                <div class="risk-trend border-[#1B3283] border-[1px]
                ml-[10px] bg-[#060f2db2] w-calc(100% - 10px) flex-1 min-h-0 p-2 flex flex-col relative">
                  <div ref="riskTrendChart" class="chart-container flex-1 min-h-[140px] overflow-x-auto"></div>
                </div>

             </div>
             <div class="dashboard-card flex flex-col flex-1 min-h-0">
                <div class="card-title flex items-center gap-2.5 text-base font-semibold 
                  text-white text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
                  bg-[url('@/assets/risk-banner/title_bg.png')] 
                  bg-no-repeat min-h-[32px] pl-5" style="background-size: 100% 100%">
                  <BarChartOutlined class="title-icon text-lg text-cyan-400" />
                  区域风险对比
                </div>
                <div class="region-comparison border-[#1B3283] border-[1px]
                ml-[10px] bg-[#060f2db2] w-calc(100% - 10px) flex-1 min-h-0 p-4 flex flex-col relative">
                  <div class="comparison-selector flex justify-end gap-3 absolute z-[10] top-[10px] right-[4px]">
                    <span 
                      class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                      :class="selectedRegionComparison === 'alarmTotal' ? 'bg-cyan-500 text-white' : 'bg-[#1B3283] text-cyan-400'"
                      @click="() => { selectedRegionComparison = 'alarmTotal'; handleRegionComparisonChange(); }"
                    >
                      报警总数
                    </span>
                    <span 
                      class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                      :class="selectedRegionComparison === 'hiddenDanger' ? 'bg-cyan-500 text-white' : 'bg-[#1B3283] text-cyan-400'"
                      @click="() => { selectedRegionComparison = 'hiddenDanger'; handleRegionComparisonChange(); }"
                    >
                      隐患排查
                    </span>
                    <span 
                      class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                      :class="selectedRegionComparison === 'processTime' ? 'bg-cyan-500 text-white' : 'bg-[#1B3283] text-cyan-400'"
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
      <div class="dashboard-column flex flex-col gap-5 min-h-0">
                <!-- 告警类型 TOP -->
        <div class="dashboard-card  flex flex-col flex-1 min-h-0 alert-type-card">
          <div class="card-title flex items-center gap-2.5 text-base font-semibold text-white 
          text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
          bg-[url('@/assets/risk-banner/title_bg.png')] 
          bg-no-repeat  min-h-[32px] pl-5"
          style="background-size: 100% 100%">
            <!-- 告警类型 TOP5 -->
            <FireOutlined class="title-icon text-lg text-cyan-400" />
            危险因素占比
          </div>
          <div class="flex border-[#1B3283] border-[1px] ml-[10px]
           bg-[#060F2D] w-calc(100% - 10px) flex-1 relative">
            <div class="flex justify-center absolute top-[4px] left-[50%] -translate-x-[50%] text-[#70CDF9] text-[12px] w-[100%]">
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
          <!-- <div class="border-[#1B3283] border-[1px] ml-[10px]
           bg-[#060F2D] w-calc(100% - 10px) flex-1">
              <Tabs v-model:activeKey="activeAlertType" class="alert-tabs ml-4 text-[14px] text-[#fff]">
                <TabPane key="environment" tab="环境安全">
                  <div ref="envAlertChart" class="chart-container min-h-[140px]"></div>
                </TabPane>
                <TabPane key="health" tab="健康安全">
                  <div ref="healthAlertChart" class="chart-container min-h-[140px]"></div>
                </TabPane>
              </Tabs>          
          </div> -->
        </div>


        <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0">
            <div class="card-title flex items-center gap-2.5 text-base font-semibold text-white 
            text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
            bg-[url('@/assets/risk-banner/title_bg.png')] bg-no-repeat  min-h-[32px] pl-5"
            style="background-size: 100% 100%">
              <WarningOutlined class="title-icon text-lg text-cyan-400" />
              特殊作业票实时监控
            </div>
            <div class="scroll-container border-[#1B3283] border-[1px] ml-[10px] bg-[#060F2D] w-calc(100% - 10px) h-full overflow-hidden">
              <div class="grid grid-cols-6 gap-2 text-[#70CDF9] text-[12px] min-h-[40px] items-center border-b border-cyan-400/20 bg-[#060F2D] relative z-[10]">
                <div class="text-center">作业编号</div>
                <div class="text-center">作业类型 </div>
                <div class="text-center">作业区域</div>
                <div class="text-center">作业状态 </div>
                <div class="text-center">作业时长</div>
                <div class="text-center">风险等级</div>
              </div>
              <Vue3SeamlessScroll :list="workPlanList" :step="0.8" :hover="true">
                <div class="grid grid-cols-6 gap-2 text-[#fff] text-[12px] min-h-[40px] items-center border-b border-cyan-400/20 relative z-[1]" v-for="(item, index) in workPlanList" :key="index">
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

        <div class="dashboard-card overflow-hidden flex flex-col flex-1 min-h-0">
            <div class="card-title flex items-center gap-2.5 text-base font-semibold text-white 
            text-shadow-[0_0_10px_rgba(0,212,255,0.5)] 
            bg-[url('@/assets/risk-banner/title_bg.png')] bg-no-repeat  min-h-[32px] pl-5"
            style="background-size: 100% 100%">
              <WarningOutlined class="title-icon text-lg text-cyan-400" />
              班前会召开质量分析
            </div>
            <div class="scroll-container border-[#1B3283] border-[1px] ml-[10px] bg-[#060F2D] w-calc(100% - 10px) h-full overflow-hidden">
              <div class="grid grid-cols-6 gap-2 text-[#70CDF9] text-[12px] min-h-[40px] items-center border-b border-cyan-400/20 bg-[#060F2D] relative z-[10]">
                <div class="text-center">日期</div>
                <div class="text-center">班次 </div>
                <div class="text-center">召开状态</div>
                <div class="text-center">风险交底 </div>
                <div class="text-center">措施确认</div>
                <div class="text-center">问题反馈</div>
              </div>
              <Vue3SeamlessScroll :list="meettingRecord" :step="0.8" :hover="true">
                <div class="grid grid-cols-6 gap-2 text-[#fff] text-[12px] min-h-[40px] items-center border-b border-cyan-400/20 relative z-[1]" 
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
          <div class="card-title flex items-center gap-2.5 text-base font-semibold text-white
           text-shadow-[0_0_10px_rgba(0,212,255,0.5)] bg-[url('@/assets/risk-banner/title_bg.png')] 
           bg-no-repeat  min-h-[32px] pl-5" style="background-size: 100% 100%">
            <ClusterOutlined class="title-icon text-lg text-cyan-400" />
            区域风险对比
          </div>
          <div class="region-comparison border-[#1B3283] border-[1px]
           ml-[10px] bg-[#060F2D] w-calc(100% - 10px) flex-1 min-h-0 p-4 flex flex-col relative">
            <div class="comparison-selector flex justify-end gap-3 absolute z-[10] top-[10px] right-[4px]">
              <span 
                class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                :class="selectedRegionComparison === 'alarmTotal' ? 'bg-cyan-500 text-white' : 'bg-[#1B3283] text-cyan-400'"
                @click="() => { selectedRegionComparison = 'alarmTotal'; handleRegionComparisonChange(); }"
              >
                报警总数
              </span>
              <span 
                class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                :class="selectedRegionComparison === 'hiddenDanger' ? 'bg-cyan-500 text-white' : 'bg-[#1B3283] text-cyan-400'"
                @click="() => { selectedRegionComparison = 'hiddenDanger'; handleRegionComparisonChange(); }"
              >
                隐患排查
              </span>
              <span 
                class="text-xs px-3 py-1 rounded-full cursor-pointer transition-all"
                :class="selectedRegionComparison === 'processTime' ? 'bg-cyan-500 text-white' : 'bg-[#1B3283] text-cyan-400'"
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
      class="warning-modal"
    >
      <div class="warning-content flex gap-5 items-start mb-6">
        <ExclamationCircleOutlined class="warning-icon text-5xl text-orange-400 animate-pulse" />
        <div class="warning-text">
          <h3 class="mb-3 text-lg text-cyan-400">{{ warningData.title }}</h3>
          <p class="mb-4 text-sm leading-relaxed text-cyan-400">{{ warningData.message }}</p>
          <div class="warning-detail flex gap-6 text-sm text-blue-300">
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
import { Modal, Button, Radio, DatePicker, Tabs, TabPane } from 'ant-design-vue'
import {
  AlertOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  FireOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  LineChartOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClusterOutlined,
  FastBackwardFilled
} from '@ant-design/icons-vue'
import * as echarts from 'echarts'
// import 'echarts-gl'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'
import RotatingCards from '@/components/RotatingCards.vue'
import {getRegionList} from '@/api/system/region'
const { RangePicker } = DatePicker
const { Group: RadioGroup, Button: RadioButton } = Radio
const leftTotalArr = [
  {
    name:'已闭环',
    num:120
  },
  {
    name:'整改中',
    num:30
  },
  {
    name:'待指派',
    num:2
  },
  {
    name:'已超时',
    num:10
  },
  {
    name:'未开始',
    num:2
  }
]
// 报警数量统计
const alarmArr = [
  {
    name:'告警误报率',
    value:3,
    unit:'%',
    icon:'',
    color:'#FF4757'
  },
  {
    name:'处置及时率',
    value:80,
    unit:'%',
    icon:'',
    color:'#08BC8F'
  },
  {
    name:'告警闭环率',
    value:70,
    unit:'%',
    icon:'',
    color:'#08BC8F'
  },  
  {
    name:'系统响应率',
    value:99,
    unit:'%',
    icon:'',
    color:'#08BC8F'
  },
  {
    name:'高风险占比',
    value:20,
    unit:'%',
    icon:'',
    color:'#FF4757'
  },
  {
    name:'班前会召开率',
    value:80,
    unit:'%',
    icon:'',
    color:'#08BC8F'
  },
  {
    name:'平均处置期',
    value:1,
    unit:'天',
    icon:'',
    color:'#08BC8F'
  } 
]
// 实验室相关数据展示
const cardsData = [
  {
    title: '实验室1',
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: '96.89%'
  },
  {
    title: '实验室2',
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: '96.89%'
  },
  {
    title: '实验室3',
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: '96.89%'
  },
  {
    title: '实验室4',
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: '96.89%'
  },
  {
    title: '实验室5',
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: '96.89%'
  },
  {
    title: '实验室6',
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: '96.89%'
  }
]

// end


// 注册组件
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

const workPlanList = ref([
  { 
    jobNumber: 'DH-15548', 
    jobType: '动火', 
    jobArea: '会锅炉车间', 
    jobStatus: '作业中', 
    jobDuration: '5.3(小时)', 
    riskLevel: '一级动火' 
  },
  { 
    jobNumber: 'DH-15549', 
    jobType: '受限空间', 
    jobArea: '锅炉车间', 
    jobStatus: '待开始', 
    jobDuration: '3.2(小时)', 
    riskLevel: '二级受限空间' 
  },
  { 
    jobNumber: 'DH-15550', 
    jobType: '高处作业', 
    jobArea: '锅炉车间', 
    jobStatus: '作业中', 
    jobDuration: '4.5(小时)', 
    riskLevel: '一级高处作业' 
  },
  { 
    jobNumber: 'DH-15551', 
    jobType: '动火', 
    jobArea: '会锅炉车间', 
    jobStatus: '作业中', 
    jobDuration: '5.3(小时)', 
    riskLevel: '一级动火' 
  },

])

const meettingRecord = ref([
  {
    createTime:'12-15',
    workType:'早班',
    openTxt:'已召开',
    finished:'完整',
    comfirmed:'已确认',
    feedback:'3条'
  },
  {
    createTime:'11-22',
    workType:'中班',
    openTxt:'已召开',
    finished:'部分缺失',
    comfirmed:'已确认',
    feedback:'1条'
  },
  {
    createTime:'11-18',
    workType:'晚班',
    openTxt:'延迟召开',
    finished:'完整',
    comfirmed:'未确认',
    feedback:'2条'
  },
  {
    createTime:'11-16',
    workType:'早班',
    openTxt:'已召开',
    finished:'完整',
    comfirmed:'已确认',
    feedback:'无'
  },
  {
    createTime:'11-14',
    workType:'中班',
    openTxt:'未召开',
    finished:'-',
    comfirmed:'-',
    feedback:'-'
  }
])


// 告警通知列表
const alarmNotifications = ref([
  { 
    text: '你有一条动火作业票待办，票号:DH202510190000001请尽快登录系统进行处理。',
    time: '2025-12-05 14:30',
    type: '紧急'
  },
  { 
    text: 'xx 的隐患信息已经逾期,整改期限时间为: 2025-08-07 19:52:58,请先进行延期申请再进行隐患排查整改!',
    time: '2025-12-05 14:25',
    type: '紧急'
  },
  { 
    text: '你有一条动火作业票待办，票号:DH202510190000001请尽快登录系统进行处理。',
    time: '2025-12-05 14:20',
    type: '一般'
  },
  { 
    text: 'xx 的隐患信息已经逾期,整改期限时间为: 2025-08-07 19:52:58,请先进行延期申请再进行隐患排查整改!',
    time: '2025-12-05 14:15',
    type: '一般'
  },
  { 
    text: '高处作业许可证即将到期，请及时续签以确保作业安全。',
    time: '2025-12-05 14:10',
    type: '紧急'
  },
  { 
    text: '电气设备巡检发现异常，请立即安排专业人员进行检修。',
    time: '2025-12-05 14:05',
    type: '紧急'
  },
  { 
    text: '危险化学品存储区域温湿度超出安全范围，请及时调整环境参数。',
    time: '2025-12-05 14:00',
    type: '一般'
  },
  { 
    text: '新员工安全培训已完成，请为其分配相应岗位权限。',
    time: '2025-12-05 13:55',
    type: '一般'
  },
  { 
    text: '应急演练计划已发布，请各部门按时组织参与。',
    time: '2025-12-05 13:50',
    type: '一般'
  },
  { 
    text: '安全防护用品库存不足，请及时采购补充。',
    time: '2025-12-05 13:45',
    type: '紧急'
  },
  { 
    text: '特种设备年检日期临近，请提前准备相关资料。',
    time: '2025-12-05 13:40',
    type: '一般'
  },
  { 
    text: '职业健康体检报告已出，请关注员工健康状况。',
    time: '2025-12-05 13:35',
    type: '一般'
  },
  { 
    text: '生产车间可燃气体浓度超标报警，请立即启动应急预案。',
    time: '2025-12-05 13:30',
    type: '紧急'
  },
  { 
    text: '压力容器温度异常升高，已触发安全联锁保护机制。',
    time: '2025-12-05 13:25',
    type: '紧急'
  },
  { 
    text: '消防水泵故障报警，主泵无法正常启动，请立即检查。',
    time: '2025-12-05 13:20',
    type: '紧急'
  },
  { 
    text: '配电室烟雾探测器报警，请派人现场确认情况。',
    time: '2025-12-05 13:15',
    type: '紧急'
  },
  { 
    text: '危险作业视频监控中断，可能影响安全监管。',
    time: '2025-12-05 13:10',
    type: '一般'
  },
  { 
    text: '安全门禁系统异常开启，请核查是否有未授权人员进入。',
    time: '2025-12-05 13:05',
    type: '紧急'
  },
  { 
    text: '有毒气体泄漏监测报警，请相关区域人员立即撤离。',
    time: '2025-12-05 13:00',
    type: '紧急'
  },
  { 
    text: '重大危险源监测数据异常，已超出预设安全阈值。',
    time: '2025-12-05 12:55',
    type: '紧急'
  }
])

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
        backgroundColor: 'rgba(10, 30, 80, 0.9)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        textStyle: { color: '#fff' },
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
        axisLabel: { color: '#6cb8ff', interval: 29 },
        axisLine: { lineStyle: { color: '#1e5a8e' } }
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



// 初始化完成率图表
const initCompletionChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!completionChart.value) {
      console.error('完成率图表容器不存在')
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(completionChart.value)) {
      console.error('完成率图表容器不在文档中')
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = completionChart.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.error('完成率图表容器尺寸为0:', { width: offsetWidth, height: offsetHeight })
      return
    }
    
    const chart = echarts.init(completionChart.value)
    const total = riskData.value.completed + riskData.value.pending
    const rate = ((riskData.value.completed / total) * 100).toFixed(1)
    
    const option = {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        radius: '90%',
        center: ['50%', '70%'],
        min: 0,
        max: 100,
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [rate / 100, '#10b981'],
              [1, '#1e5a8e']
            ]
          }
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          formatter: '{value}%',
          color: '#10b981',
          fontSize: 32,
          offsetCenter: [0, '-20%']
        },
        data: [{ value: rate }]
      }]
    }
    
    chart.setOption(option)
    charts.push(chart)
  } catch (error) {
    console.error('初始化完成率图表失败:', error)
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
    let information = {
      color: "#069DFD",
      area: ["人员因素", "设备设施", "环境因素", "管理因素"],
      dataArray: [50, 20, 20, 10],
    };

    let style = {
      width: 32,
      height: 24,
      padding: [5, 6, 0, 0],
      fontSize: 20,
      align: "center",
      color: "#ffffff"
    }

    let option = {
      backgroundColor: "#021032",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(9,40,84,0.8)",
        borderColor: "rgba(9,40,84,0.8)",
        textStyle: {
          fontSize: 20,
          color: "#fff",
        },
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          return (
            params[0].name +
            "&nbsp;&nbsp;&nbsp;&nbsp;<span style='font-weight:bold;color:'#fff'>" +
            params[0].value +
            "%</span>"
          );
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        top: "10%",
        bottom: "20%", // 特殊
        containLabel: true,
      },
      xAxis: [
        {
          type: "value",
          show: false,
          max: 100, // 设置固定的最大值，确保所有背景条长度一致
          min: 0, // 设置固定的最大值，确保所有背景条长度一致
        },
      ],
      yAxis: [
        {
          type: "category",
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          inverse: true,
          data: information.area,
          axisLabel: {
            color: "rgba(96, 98, 102, 1)",
            margin: 5,
            formatter: (name, index) => {
              const id = index + 1;
              if (id < 5) {
                return `{id|${id}}.{nameStyle|${name}}`;
              } else {
                return `{ids|${id}}.{nameStyle|${name}}`;
              }
            },
            rich: {
              id:{
                padding: [0, 0, 0, 2],
                fontSize: 16,
                color: '#fff',
              },
              ids:{
                padding: [0, 0, 0, 2],
                fontSize: 16,
                color: '#b4bec8',
              },
              nameStyle: {
                padding: [0, 10, 0, 2],
                fontSize: 16,
                color: '#fff',
              },
              rank: {
                ...style,
                backgroundColor: new echarts.graphic.LinearGradient(0, 1, 1, 1, [
                  {
                    offset: 0,
                    color: '#E7F4FF',
                  },
                  {
                    offset: 0.95,
                    color: '#fff',
                  },
                ]),
              },
              rank1: {
                ...style,
                color: "#FF992B",
                backgroundColor: new echarts.graphic.LinearGradient(0, 1, 1, 1, [
                  {
                    offset: 0,
                    color: '#E7F4FF',
                  },
                  {
                    offset: 0.95,
                    color: '#fff',
                  },
                ]),
              },
            },
          },
        },
        {
          inverse: true,
          axisTick: "none",
          axisLine: "none",
          show: true,
          axisLabel: {
            color: "#59c5c6",
            fontSize: 14,
            margin: 10,
            formatter: function (value) {
              return value+'%';
            },
          },
          data: information.dataArray,
        },
      ],
      series: [
        {
          type: "bar",
          barWidth: 12, // 柱子宽度
          MaxSize: 0,
          showBackground: true,
          backgroundStyle: {
            color: "rgb(10, 51, 126)",
            borderRadius: 5, //设置背景的圆角
          },
          data: information.dataArray.map((item) => {
            return {
              value: item,
              itemStyle: {
                borderRadius: 5,
                color: information.color,
              },
            };
          }),
        },
        {
          type: 'scatter',
          emphasis: {
            scale: false
          },
          symbol: 'rect',
          itemStyle: {
            barBorderRadius: [30, 0, 0, 30],
            color: '#fff',
            shadowColor: '#fff',
            shadowBlur: 1,
            borderWidth: 1,
            opacity: 1
          },
          symbolSize: [4, 10], // 进度条白点的大小
          z: 2,
          data: information.dataArray,
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
const regionOptions = ref([
  { label: '全部区域', value: '' },
  { label: '生产车间', value: '生产车间' },
  { label: '仓储区域', value: '仓储区域' },
  { label: '办公区域', value: '办公区域' }
])

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
  const labNames = ['实验室1', '实验室2', '实验室3', '实验室4', '实验室5', '实验室6'];
  
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
    const labNames = ['实验室1', '实验室2', '实验室3', '实验室4', '实验室5', '实验室6'];
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
        backgroundColor: 'rgba(10, 30, 80, 0.9)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        textStyle: { color: '#fff' },
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
          color: '#6cb8ff', 
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
            color: '#6cb8ff',
            fontSize: 10 // 减小字体大小
          },
          borderColor: '#1e5a8e',
          fillerColor: 'rgba(0, 212, 255, 0.1)',
          dataBackground: {
            lineStyle: {
              color: '#1e5a8e'
            },
            areaStyle: {
              color: '#060f2d'
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
const checkThreshold = () => {
  // 定义规则配置，与rule-setting.vue保持一致
  const rules = [
    {
      rule_id: 'rule001',
      rule_name: '温度异常监控',
      threshold_value: 80,
      threshold_range: '0-100°C',
      alert_level: 'high',
      description: '当设备温度超过80度时触发告警，防止设备过热损坏',
      unit: '°C'
    },
    {
      rule_id: 'rule002',
      rule_name: '压力异常监控',
      threshold_value: 150,
      threshold_range: '0-200psi',
      alert_level: 'critical',
      description: '当管道压力超过150psi时触发紧急告警，防止安全事故',
      unit: 'psi'
    },
    {
      rule_id: 'rule003',
      rule_name: '流量监控规则',
      threshold_value: 1000,
      threshold_range: '0-5000L/min',
      alert_level: 'medium',
      description: '当流量超过1000L/min时触发告警，监控生产流程异常',
      unit: 'L/min'
    },
    {
      rule_id: 'rule004',
      rule_name: '振动频率监控',
      threshold_value: 50,
      threshold_range: '0-100Hz',
      alert_level: 'low',
      description: '当设备振动频率超过50Hz时提醒维护，预防设备故障',
      unit: 'Hz'
    },
    {
      rule_id: 'rule005',
      rule_name: '电流异常监控',
      threshold_value: 100,
      threshold_range: '0-200A',
      alert_level: 'high',
      description: '当电流超过100A时触发告警，防止电路过载',
      unit: 'A'
    },
    {
      rule_id: 'rule006',
      rule_name: '氧气浓度监控',
      threshold_value: 19.5,
      threshold_range: '0-21%',
      alert_level: 'critical',
      description: '当氧气浓度低于19.5%时触发紧急告警，防止缺氧事故',
      unit: '%'
    },
    {
      rule_id: 'rule007',
      rule_name: '氢气浓度监控',
      threshold_value: 4.0,
      threshold_range: '0-4%',
      alert_level: 'critical',
      description: '当氢气浓度超过4.0%时触发紧急告警，防止爆炸事故',
      unit: '%'
    },
    {
      rule_id: 'rule008',
      rule_name: '氨气浓度监控',
      threshold_value: 25,
      threshold_range: '0-50ppm',
      alert_level: 'high',
      description: '当氨气浓度超过25ppm时触发告警，防止中毒事故',
      unit: 'ppm'
    },
    {
      rule_id: 'rule009',
      rule_name: '甲烷浓度监控',
      threshold_value: 5.0,
      threshold_range: '0-5%',
      alert_level: 'critical',
      description: '当甲烷浓度超过5.0%时触发紧急告警，防止爆炸事故',
      unit: '%'
    },
    {
      rule_id: 'rule010',
      rule_name: '二氧化碳浓度监控',
      threshold_value: 5000,
      threshold_range: '0-10000ppm',
      alert_level: 'medium',
      description: '当二氧化碳浓度超过5000ppm时触发告警，防止健康危害',
      unit: 'ppm'
    }
  ]
  
  // 随机触发预警（演示用）
  if (Math.random() > 0.5) {
    // 随机选择一个规则
    const randomRule = rules[Math.floor(Math.random() * rules.length)]
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
    warningVisible.value = true
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
        initCompletionChart()
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
})// 区域风险对比数据 - 修改为支持12个月份的数据结构
const regionComparisonData = ref([
  { 
    region: '实验室1', 
    alarmTotal: Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 50),
    riskLevel: '高风险', 
    processTime: Array.from({length: 12}, () => parseFloat((Math.random() * 5).toFixed(1)))
  },
  { 
    region: '实验室2', 
    alarmTotal: Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 30),
    riskLevel: '中风险', 
    processTime: Array.from({length: 12}, () => parseFloat((Math.random() * 4).toFixed(1)))
  },
  { 
    region: '实验室3', 
    alarmTotal: Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 20),
    riskLevel: '低风险', 
    processTime: Array.from({length: 12}, () => parseFloat((Math.random() * 3).toFixed(1)))
  },
  { 
    region: '实验室4', 
    alarmTotal: Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 40),
    riskLevel: '中风险', 
    processTime: Array.from({length: 12}, () => parseFloat((Math.random() * 4).toFixed(1)))
  },
  { 
    region: '实验室5', 
    alarmTotal: Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 10),
    riskLevel: '低风险', 
    processTime: Array.from({length: 12}, () => parseFloat((Math.random() * 2).toFixed(1)))
  },
  { 
    region: '实验室6', 
    alarmTotal: Array.from({length: 12}, () => Math.floor(Math.random() * 100) + 60),
    riskLevel: '中风险', 
    processTime: Array.from({length: 12}, () => parseFloat((Math.random() * 3.5).toFixed(1)))
  }
])

// 风险来源数据
// 1. 风险来源总体占比
const totalData = {
  categories: ['人的不安全行为', '物的不安全状态','管理因素'],
  values: [55, 35,10],
  colors: ['#1688EA', '#37CEEA','#877AEB'] // 匹配柱状图渐变主色
}

// 2. 人/物/管理不安全因素TOP5数据（X轴为top1-top5）
const topData = {
  xAxisData: ["top1", "top2", "top3", "top4", "top5"],
  // 人的不安全行为TOP5数值
  humanValues: [128, 118, 40, 26, 13],
  // 物的不安全状态TOP5数值
  objectValues: [42, 28, 17, 13, 3],
  // 管理因素TOP5数值
  managementValues: [10, 20, 30, 40, 50]
}
// 风险来源详细数据
const riskSourceDetails = {
  human: ['未戴安全帽', '未穿工作服','闯入禁区', '吸烟',  '滞留'],
  object: ['设备未关闭', '消防缺失', '管道泄漏', '防护缺失', '物品遗留'],
  management: ['管理不善', '制度缺失', '培训不足', '监督不到位', '沟通不畅']
}

// 格式化数值函数（匹配tooltip中的formatToFixed）
const formatToFixed = (val) => {
  if (val === '--' || val === null || val === undefined) return '--'
  return parseInt(val)
}// 区域风险对比图表引用
const regionComparisonChart = ref(null)
// 选中的对比维度
const selectedRegionComparison = ref('alarmTotal')

// 处理区域对比维度变化
const handleRegionComparisonChange = () => {
  nextTick(() => {
    initRegionComparisonChart()
  })
}

// 获取风险等级样式类
const getRiskLevelClass = (level) => {
  switch (level) {
    case '高风险':
      return 'text-red-500'
    case '中风险':
      return 'text-orange-400'
    case '低风险':
      return 'text-green-500'
    default:
      return 'text-cyan-400'
  }
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
         backgroundColor: 'rgba(0,0,0,.6)',
        borderColor: 'transparent',
        textStyle: { color: '#fff' },
        padding: [5, 10],
        extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);'
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
          label: { formatter: '{d}%', color: '#fff', position: 'inside' },
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
        backgroundColor: 'rgba(0,0,0,.6)',
        borderColor: 'transparent',
        axisPointer: {
          type: "shadow",
        },
        formatter: (param) => {
          // 获取当前项的索引
          const index = param[0]?.dataIndex || 0;
          // 构建 tooltip 内容
          let tooltipContent = `
            <div class="reservoirAlarmChart-popup" style="color:#fff;">
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
            color: '#999'
          },
        },
        axisLabel: {
          color: '#9eaaba',
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
            color: '#9eaaba',
          },
          offset: 0,
          name: '数量(个)',
          type: 'value',
          axisLabel: {
            show: true,
            color: "#9eaaba",
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#999'
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(49,105,129,0.4)",
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
        backgroundColor: 'rgba(10, 30, 80, 0.9)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        textStyle: { color: '#fff' }
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
          color: '#6cb8ff', 
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



</script>
<style scoped>
  .total-card{
    background-image: url('@/assets/risk-banner/data-border.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
  }
  :deep(.ant-tabs .ant-tabs-tab){
    padding: 5px 0;
  }

</style>