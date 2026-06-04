<template>
  <div class="safety-dashboard">

    <!-- 主要内容区域 -->
    <div class="dashboard-content">
      <!-- 左侧列 -->
      <div class="dashboard-column">
        <!-- 实时告警趋势 -->
        <Card class="dashboard-card">
          <template #title>
            <div class="card-title">
              <AlertOutlined class="title-icon" />
              实时告警趋势
            </div>
          </template>
          <div class="alert-summary">
            <div class="alert-count">
              <span class="count-number">{{ alertData.unhandledTotal }}</span>
              <span class="count-label">未处理告警</span>
            </div>
          </div>
          <div ref="alertTrendChart" class="chart-container" style="height: 220px"></div>
        </Card>

        <!-- 告警等级分布 -->
        <Card class="dashboard-card">
          <template #title>
            <div class="card-title">
              <BarChartOutlined class="title-icon" />
              告警等级分布
            </div>
          </template>
          <div ref="alertLevelChart" class="chart-container" style="height: 280px"></div>
        </Card>

        <!-- 风险处置完成率 -->
        <Card class="dashboard-card">
          <template #title>
            <div class="card-title">
              <CheckCircleOutlined class="title-icon" />
              风险处置完成率
            </div>
          </template>
          <div class="completion-stats">
            <div class="stat-item">
              <div class="stat-value success">{{ riskData.completed }}</div>
              <div class="stat-label">已闭环</div>
            </div>
            <div ref="completionChart" class="chart-container" style="height: 180px; flex: 1"></div>
            <div class="stat-item">
              <div class="stat-value warning">{{ riskData.pending }}</div>
              <div class="stat-label">待处理</div>
            </div>
          </div>
        </Card>
      </div>

      <!-- 中间列 -->
      <div class="dashboard-column">
        <!-- 告警类型 TOP -->
        <Card class="dashboard-card alert-type-card">
          <template #title>
            <div class="card-title">
              <FireOutlined class="title-icon" />
              告警类型 TOP5
            </div>
          </template>
          <Tabs v-model:activeKey="activeAlertType" class="alert-tabs ml-4">
            <TabPane key="environment" tab="环境安全">
              <div ref="envAlertChart" class="chart-container"></div>
            </TabPane>
            <TabPane key="health" tab="健康安全">
              <div ref="healthAlertChart" class="chart-container"></div>
            </TabPane>
          </Tabs>
        </Card>

        <!-- 隐患排查统计分析 -->
        <Card class="dashboard-card">
          <template #title>
            <div class="card-title">
              <ClockCircleOutlined class="title-icon" />
              隐患排查统计分析
            </div>
          </template>
          <div class="hidden-danger-statistics">
            <!-- 筛选区域 -->
            <!-- <div class="filter-section">
              <div class="filter-item">
                <span class="filter-label">区域：</span>
                <Select 
                  v-model:value="selectedRegion" 
                  :options="regionOptions" 
                  style="width: 100px;"
                  placeholder="请选择区域"
                  @change="handleRegionChange"
                  
                />
              </div>
              <div class="filter-item">
                <span class="filter-label">时间范围：</span>
                <RadioGroup v-model:value="timeRangeType" @change="handleTimeRangeChange">
                  <RadioButton value="year">近一年</RadioButton>
                  <RadioButton value="custom">自定义</RadioButton>
                </RadioGroup>
              </div>
              <div class="filter-item" v-if="timeRangeType === 'custom'">
                <RangePicker 
                  v-model:value="customTimeRange" 
                  @change="handleCustomTimeChange"
                  style="min-width: 220px;"
                />
              </div>
            </div> -->
            
            <!-- 图表区域 -->
            <div ref="hiddenDangerChart" class="chart-container" style="height: 320px;"></div>
          </div>
        </Card>
      </div>

      <!-- 右侧列 -->
      <div class="dashboard-column">
        <!-- 企业风险等级分布 -->
        <Card class="dashboard-card">
          <template #title>
            <div class="card-title">
              <WarningOutlined class="title-icon" />
              风险等级分布
            </div>
          </template>
          <div ref="riskDistributionChart" class="chart-container" style="width: 100%;flex: 1;min-height: 150px;"></div>
        </Card>
        <Card class="dashboard-card" style="height: 230px !important;">
          <template #title>
            <div class="card-title">
              <ClockCircleOutlined class="title-icon" />
              风险事件处置时效
            </div>
          </template>
          <div class="time-stats" >
            <div class="time-item">
              <div class="time-label">今日平均时长</div>
              <div class="time-value">{{ timeData.today }}<span class="unit">小时</span></div>
            </div>
            <div class="time-divider"></div>
            <div class="time-item">
              <div class="time-label">昨日平均时长</div>
              <div class="time-value">{{ timeData.yesterday }}<span class="unit">小时</span></div>
            </div>
            <div class="time-comparison" :class="timeData.trend > 0 ? 'trend-up' : 'trend-down'">
              <component :is="timeData.trend > 0 ? ArrowUpOutlined : ArrowDownOutlined" />
              {{ Math.abs(timeData.trend) }}%
            </div>
          </div>
        </Card>

        <!-- 企业风险趋势 -->
        <Card class="dashboard-card">
          <template #title>
            <div class="card-title">
              <LineChartOutlined class="title-icon" />
              告警通知信息
            </div>
          </template>
          <div class="scroll-container">
            <Vue3SeamlessScroll :list="alarmNotifications" :step="0.5" :hover="true">
              <div class="notification-item" v-for="(item, index) in alarmNotifications" :key="index">
                <ExclamationCircleOutlined class="notification-icon" />
                <span class="notification-text"><span>{{index+1}}、</span>{{ item.text }}</span>
                <span class="notification-time">{{ item.time }}</span>
              </div>
            </Vue3SeamlessScroll>
          </div>
        </Card>
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
      <div class="warning-content">
        <ExclamationCircleOutlined class="warning-icon" />
        <div class="warning-text">
          <h3>{{ warningData.title }}</h3>
          <p>{{ warningData.message }}</p>
          <div class="warning-detail">
            <span>当前值：{{ warningData.currentValue }}</span>
            <span>阈值：{{ warningData.threshold }}</span>
          </div>
        </div>
      </div>
      <div class="warning-actions">
        <Button type="primary" @click="handleWarningConfirm">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Card, Tabs, TabPane, Modal, Button, Select, Radio, DatePicker } from 'ant-design-vue'
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
  ArrowDownOutlined
} from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'

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

// 告警通知列表
const alarmNotifications = ref([
  { 
    text: '你有一条动火作业票待办，票号:DH202510190000001请尽快登录系统进行处理。',
    time: '2025-12-05 14:30'
  },
  { 
    text: 'xx 的隐患信息已经逾期,整改期限时间为: 2025-08-07 19:52:58,请先进行延期申请再进行隐患排查整改!',
    time: '2025-12-05 14:25'
  },
  { 
    text: '你有一条动火作业票待办，票号:DH202510190000001请尽快登录系统进行处理。',
    time: '2025-12-05 14:20'
  },
  { 
    text: 'xx 的隐患信息已经逾期,整改期限时间为: 2025-08-07 19:52:58,请先进行延期申请再进行隐患排查整改!',
    time: '2025-12-05 14:15'
  },
  { 
    text: '高处作业许可证即将到期，请及时续签以确保作业安全。',
    time: '2025-12-05 14:10'
  },
  { 
    text: '电气设备巡检发现异常，请立即安排专业人员进行检修。',
    time: '2025-12-05 14:05'
  },
  { 
    text: '危险化学品存储区域温湿度超出安全范围，请及时调整环境参数。',
    time: '2025-12-05 14:00'
  },
  { 
    text: '新员工安全培训已完成，请为其分配相应岗位权限。',
    time: '2025-12-05 13:55'
  },
  { 
    text: '应急演练计划已发布，请各部门按时组织参与。',
    time: '2025-12-05 13:50'
  },
  { 
    text: '安全防护用品库存不足，请及时采购补充。',
    time: '2025-12-05 13:45'
  },
  { 
    text: '特种设备年检日期临近，请提前准备相关资料。',
    time: '2025-12-05 13:40'
  },
  { 
    text: '职业健康体检报告已出，请关注员工健康状况。',
    time: '2025-12-05 13:35'
  },
  { 
    text: '生产车间可燃气体浓度超标报警，请立即启动应急预案。',
    time: '2025-12-05 13:30'
  },
  { 
    text: '压力容器温度异常升高，已触发安全联锁保护机制。',
    time: '2025-12-05 13:25'
  },
  { 
    text: '消防水泵故障报警，主泵无法正常启动，请立即检查。',
    time: '2025-12-05 13:20'
  },
  { 
    text: '配电室烟雾探测器报警，请派人现场确认情况。',
    time: '2025-12-05 13:15'
  },
  { 
    text: '危险作业视频监控中断，可能影响安全监管。',
    time: '2025-12-05 13:10'
  },
  { 
    text: '安全门禁系统异常开启，请核查是否有未授权人员进入。',
    time: '2025-12-05 13:05'
  },
  { 
    text: '有毒气体泄漏监测报警，请相关区域人员立即撤离。',
    time: '2025-12-05 13:00'
  },
  { 
    text: '重大危险源监测数据异常，已超出预设安全阈值。',
    time: '2025-12-05 12:55'
  }
])

// 告警类型选项卡
const activeAlertType = ref('environment')

// 图表引用
const alertTrendChart = ref(null)
const alertLevelChart = ref(null)
const completionChart = ref(null)
const envAlertChart = ref(null)
const healthAlertChart = ref(null)
const riskDistributionChart = ref(null)
// const riskTrendChart = ref(null)  // 已移除，不再使用

// 图表实例
let charts = []

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
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.5)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
          ])
        },
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

// 初始化告警等级图
const initAlertLevelChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!alertLevelChart.value) {
      console.error('告警等级图表容器不存在')
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(alertLevelChart.value)) {
      console.error('告警等级图表容器不在文档中')
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = alertLevelChart.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.error('告警等级图表容器尺寸为0:', { width: offsetWidth, height: offsetHeight })
      return
    }
    
    const chart = echarts.init(alertLevelChart.value)
    
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}次 ({d}%)',
        backgroundColor: 'rgba(10, 30, 80, 0.9)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        textStyle: { color: '#fff' }
      },
      legend: {
        orient: 'vertical',
        right: 20,
        top: 'center',
        textStyle: { color: '#6cb8ff' }
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0a1e50',
          borderWidth: 2
        },
        label: {
          show: true,
          color: '#6cb8ff',
          formatter: '{b}\n{c}'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        data: [
          { value: 45, name: '一级告警', itemStyle: { color: '#ff4757' } },
          { value: 32, name: '二级告警', itemStyle: { color: '#ffa502' } },
          { value: 28, name: '三级告警', itemStyle: { color: '#00d4ff' } },
          { value: 22, name: '四级告警', itemStyle: { color: '#2ed573' } }
        ]
      }]
    }
    
    chart.setOption(option)
    charts.push(chart)
  } catch (error) {
    console.error('初始化告警等级图表失败:', error)
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
            { offset: 0, color: '#0066cc' },
            { offset: 1, color: '#00d4ff' }
          ]),
          borderRadius: [0, 5, 5, 0]
        },
        barWidth: 20,
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
        barWidth: 20,
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

// 初始化风险分布图
const initRiskDistributionChart = () => {
  try {
    // 确保DOM元素存在且已挂载
    if (!riskDistributionChart.value) {
      console.warn('风险分布图表容器尚未准备好，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (riskDistributionChart.value) {
          initRiskDistributionChart()
        }
      }, 100)
      return
    }
    
    // 检查元素是否在文档中且可见
    if (!document.contains(riskDistributionChart.value)) {
      console.warn('风险分布图表容器不在文档中，稍后重试')
      // 延迟重试
      setTimeout(() => {
        if (document.contains(riskDistributionChart.value)) {
          initRiskDistributionChart()
        }
      }, 100)
      return
    }
    
    // 检查元素尺寸
    const { offsetWidth, offsetHeight } = riskDistributionChart.value
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.warn('风险分布图表容器尺寸为0，稍后重试:', { width: offsetWidth, height: offsetHeight })
      // 延迟重试
      setTimeout(() => {
        const { offsetWidth: newWidth, offsetHeight: newHeight } = riskDistributionChart.value || {};
        if (newWidth > 0 && newHeight > 0) {
          initRiskDistributionChart()
        }
      }, 100)
      return
    }
    
    const chart = echarts.init(riskDistributionChart.value)
    
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 个区域',
        backgroundColor: 'rgba(10, 30, 80, 0.9)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        textStyle: { color: '#fff' }
      },
      grid: { top: 40, right: 20, bottom: 20, left: 80 },
      xAxis: {
        type: 'value',
        axisLabel: { color: '#6cb8ff' },
        splitLine: { lineStyle: { color: '#1e5a8e', type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: ['低风险', '一般风险', '较大风险', '重大风险'],
        axisLabel: { color: '#6cb8ff', fontSize: 13 },
        axisLine: { lineStyle: { color: '#1e5a8e' } }
      },
      series: [{
        type: 'bar',
        data: [
          { value: 45, itemStyle: { color: '#10b981' } },
          { value: 28, itemStyle: { color: '#00d4ff' } },
          { value: 15, itemStyle: { color: '#ffa502' } },
          { value: 8, itemStyle: { color: '#ef4444' } }
        ],
        barWidth: 24,
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
    console.error('初始化风险分布图表失败:', error)
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
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.5)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
          ])
        },
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

// 定时器
let timeInterval = null
let thresholdInterval = null

onMounted(() => {
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
        initAlertLevelChart()
        initCompletionChart()
        initEnvAlertChart()
        initHealthAlertChart()
        initRiskDistributionChart()
        // 初始化隐患排查统计图表
        initHiddenDangerChart()
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
})
</script>

<style scoped>
.safety-dashboard {
  height: 100%;
  background: linear-gradient(135deg, #0a1929 0%, #001e3c 50%, #0a1e3c 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-y: hidden; /* 改为hidden避免双重滚动条 */
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 30px;
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.2), rgba(0, 212, 255, 0.1));
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2);
  flex-shrink: 0; /* 防止头部被压缩 */
}

.dashboard-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
  background: linear-gradient(90deg, #00d4ff 0%, #0099ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.header-time {
  font-size: 18px;
  color: #6cb8ff;
  font-family: 'Courier New', monospace;
  font-weight: 500;
  letter-spacing: 1px;
}

.dashboard-content {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1.4fr 0.6fr; /* 左列:中间列:右列 = 1:1.4:0.6 */
  gap: 20px;
  flex: 1; /* 占据剩余空间 */
  min-height: 0; /* 允许子元素收缩 */
}

/* 确保每列都能正确填充高度 */
.dashboard-content .dashboard-column {
  display: flex;
  flex-direction: column;
  min-height: 0; /* 允许子元素收缩 */
}

.dashboard-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0; /* 允许子元素收缩 */
}

/* 确保中间列可以正确填充空间 */
.dashboard-column:nth-child(2) {
  flex: 1;
  min-height: 0; /* 允许子元素收缩 */
}

/* 确保右侧列中的卡片等高分布 */
.dashboard-column:nth-child(3) {
  display: flex;
  flex-direction: column;
  min-height: 0; /* 允许子元素收缩 */
  max-width: 550px; /* 限制右侧列的最大宽度 */
}

/* 风险等级分布卡片占据主要空间 */
.dashboard-column:nth-child(3) .dashboard-card:nth-child(1) {
  flex: 0.6;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 允许子元素收缩 */
}

/* 风险事件处置时效卡片固定高度 */
.dashboard-column:nth-child(3) .dashboard-card:nth-child(2) {
  flex: none !important;
  height: 230px !important;
  display: flex;
  flex-direction: column;
  min-height: auto !important; /* 覆盖默认设置 */
}

/* 风险事件处置时效卡片的内部样式 */
.dashboard-column:nth-child(3) .dashboard-card:nth-child(2) :deep(.ant-card-body) {
  padding: 20px 15px !important;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: auto !important;
}

.dashboard-column:nth-child(3) .dashboard-card:nth-child(2) .time-stats {
  flex: 1;
  padding: 5px 0;
  justify-content: center;
}

.dashboard-column:nth-child(3) .dashboard-card:nth-child(2) .time-label {
  font-size: 15px !important;
  margin-bottom: 10px !important;
}

.dashboard-column:nth-child(3) .dashboard-card:nth-child(2) .time-value {
  font-size: 30px !important;
}

.dashboard-column:nth-child(3) .dashboard-card:nth-child(2) .time-divider {
  height: 55px !important;
  margin: 0 45px;
}

.dashboard-column:nth-child(3) .dashboard-card:nth-child(2) .time-comparison {
  font-size: 15px !important;
  bottom: 0px;
}

/* 企业风险趋势卡片占据剩余空间 */
.dashboard-column:nth-child(3) .dashboard-card:nth-child(3) {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 允许子元素收缩 */
}

.dashboard-column:nth-child(3) .dashboard-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  min-height: 0; /* 允许子元素收缩 */
}

.dashboard-card {
  background: linear-gradient(135deg, rgba(10, 30, 80, 0.6), rgba(0, 51, 102, 0.4));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; /* 允许子元素收缩 */
}

.dashboard-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 允许子元素收缩 */
}

.dashboard-card:hover {
  border-color: rgba(0, 212, 255, 0.6);
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
  transform: translateY(-2px);
}

.dashboard-card :deep(.ant-card-head) {
  background: rgba(10, 30, 80, 0.5);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  padding: 16px 20px;
  min-height: auto;
  flex-shrink: 0; /* 防止标题被压缩 */
}

.dashboard-card :deep(.ant-card-head-title) {
  padding: 0;
}

.dashboard-card :deep(.ant-card-body) {
  padding: 20px;
  min-height: 0; /* 允许子元素收缩 */
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #00d4ff;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.title-icon {
  font-size: 18px;
  color: #00d4ff;
}

.alert-summary {
  margin-bottom: 16px;
  flex-shrink: 0; /* 防止被压缩 */
}

.alert-count {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.count-number {
  font-size: 45px;
  font-weight: 700;
  color: #ef4444;
  line-height: 1;
}

.count-label {
  font-size: 16px;
  color: #6cb8ff;
}

.chart-container {
  width: 100%;
  position: relative;
  flex: 1;
  min-height: 0; /* 允许子元素收缩 */
}

/* 移除固定的最小高度设置，改为相对高度分配 */

.completion-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-height: 0; /* 允许子元素收缩 */
}

.stat-item {
  text-align: center;
  flex-shrink: 0; /* 防止被压缩 */
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-value.success {
  color: #10b981;
}

.stat-value.warning {
  color: #ffa502;
}

.stat-label {
  font-size: 14px;
  color: #6cb8ff;
}

.alert-type-card {
  flex: 1;
  min-height: 0; /* 允许子元素收缩 */
  display: flex;
  flex-direction: column;
}

.alert-type-card :deep(.ant-card-body) {
  padding: 0;
  min-height: 0; /* 允许子元素收缩 */
  flex: 1;
  display: flex;
  flex-direction: column;
}

.alert-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 允许子元素收缩 */
}

.alert-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
  flex-shrink: 0;
}

.alert-tabs :deep(.ant-tabs-content) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 允许子元素收缩 */
}

.alert-tabs :deep(.ant-tabs-tabpane) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 允许子元素收缩 */
}

.alert-tabs :deep(.ant-tabs-tab) {
  color: #6cb8ff;
  font-weight: 500;
}

.alert-tabs :deep(.ant-tabs-tab-active) {
  color: #00d4ff;
}

.alert-tabs :deep(.ant-tabs-ink-bar) {
  background: #00d4ff;
}

/* 确保图表容器在选项卡中有正确的高度 */
.alert-tabs .chart-container {
  flex: 1;
  min-height: 200px; /* 设置最小高度确保图表可见 */
}

.time-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px 0;
  position: relative;
  flex: 1;
  min-height: 0; /* 允许子元素收缩 */
}

.time-item {
  text-align: center;
  flex-shrink: 0; /* 防止被压缩 */
}

.time-label {
  font-size: 12px;
  color: #6cb8ff;
  margin-bottom: 6px;
}

.time-value {
  font-size: 24px;
  font-weight: 700;
  color: #00d4ff;
}

.time-value .unit {
  font-size: 14px;
  color: #6cb8ff;
  margin-left: 4px;
}

.time-divider {
  width: 1px;
  height: 40px;
  background: rgba(0, 212, 255, 0.3);
}

.time-comparison {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
}

.trend-down {
  color: #10b981;
}

.trend-up {
  color: #ef4444;
}

.warning-modal :deep(.ant-modal-content) {
  background: linear-gradient(135deg, rgba(10, 30, 80, 0.95), rgba(0, 51, 102, 0.95));
  border: 2px solid #00d4ff;
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.4);
}

.warning-modal :deep(.ant-modal-header) {
  background: transparent;
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

.warning-modal :deep(.ant-modal-title) {
  color: #00d4ff;
  font-weight: 600;
}

.warning-modal :deep(.ant-modal-close-x) {
  color: #6cb8ff;
}

.warning-modal :deep(.ant-modal-close-x:hover) {
  color: #00d4ff;
}

.warning-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.warning-icon {
  font-size: 48px;
  color: #ffa502;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 5px #ffa502);
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 15px #ffa502);
  }
}

.warning-text h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #00d4ff;
}

.warning-text p {
  margin: 0 0 16px 0;
  font-size: 15px;
  line-height: 1.6;
  color: #6cb8ff;
}

.warning-detail {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #4a8dbf;
}

.warning-actions {
  text-align: right;
}

.warning-actions :deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #0066cc, #00d4ff);
  border-color: #00d4ff;
}

.warning-actions :deep(.ant-btn-primary:hover) {
  background: linear-gradient(135deg, #0080ff, #00e5ff);
  border-color: #00e5ff;
}

/* 添加隐患排查统计分析样式 */
.hidden-danger-statistics {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 0;
  flex-wrap: wrap;
  flex-shrink: 0;
  font-size: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  /* gap: 5px; */
}

.filter-label {
  color: #6cb8ff;
  font-size: 12px;
  white-space: nowrap;
}

:deep(.ant-select) {
  font-size: 12px;
}

:deep(.ant-select-selector) {
  padding: 4px 11px !important;
  min-height: 32px;
}

:deep(.ant-radio-wrapper) {
  font-size: 12px;
  line-height: 1.5;
}

:deep(.ant-radio-inner),
:deep(.ant-radio-button-wrapper),
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector)
{
  background-color: rgba(10, 30, 80, 0.6);
  border-color: #00d4ff;
  color: #6cb8ff;
}
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector){
  display: flex;
  align-items: center;
}
:deep(.ant-radio-button-wrapper){
  padding-left: 6px;
  padding-right: 6px;
  
}
:deep( .ant-radio-button-wrapper-checked){
  color: #FFA502;
  border-color: #FFA502 !important;
}
:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before),
:deep(.ant-picker .ant-picker-input >input::placeholder),
:deep(.ant-picker .ant-picker-suffix)
{
  color: #00d4ff;

}

:deep(.ant-radio-inner::after) {
  background-color: #00d4ff;
}

:deep(.ant-radio-checked .ant-radio-inner) {
  border-color: #00d4ff;
}

:deep(.ant-picker) {
  font-size: 12px;
  padding: 4px 11px;
  min-height: 32px;
  background: rgba(10, 30, 80, 0.6);
  border-color: rgba(0, 212, 255, 0.3);
  color: #6cb8ff;
}

:deep(.ant-picker-input > input),:deep(.ant-picker .ant-picker-separator) {
  color: #6cb8ff;
}

:deep(.ant-picker:hover), :deep(.ant-picker-focused) {
  border-color: #00d4ff;
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
}

:deep(.ant-picker-range) {
  width: 200px;
}

:deep(.ant-picker-dropdown) {
  background: rgba(10, 30, 80, 0.95);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
}


:deep(.ant-picker-calendar-selected-day .ant-picker-calendar-date) {
  background: rgba(0, 212, 255, 0.2);
}

:deep(.ant-picker-calendar-date:hover) {
  background: rgba(0, 212, 255, 0.1);
}

.chart-container {
  width: 100%;
  position: relative;
  flex: 1;
  min-height: 0;
}



:deep(.ant-select-focused .ant-select-selection-item),:deep(.ant-select .ant-select-arrow){
  color: #00d4ff !important;
}

:deep(.ant-select-item-option-content),
:deep(.ant-select-dropdown-menu-item )
{
  color: #00d4ff !important;
}


:deep(.ant-select-dropdown-menu),
:deep(.ant-select-dropdown-menu-root),
:deep(.ant-select-dropdown-menu-vertical li ){
    color: white !important;
}

:deep(.ant-select-dropdown) {
    color: white !important;
    border: 1px solid #00a7efab !important;
    background-color: #002761 !important;
    box-shadow: 1px 1px 12px -1px #0095ff7a inset !important;
}
 
 
:deep(.ant-select-dropdown-menu-item-selected),
:deep(.ant-select-dropdown-menu-item-active ){
    background-color: #0afce86c !important;
    color: white !important;
}


.scroll-container {
  height: 100%;
  overflow: hidden;
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 10px 5px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  gap: 8px;
}

.notification-icon {
  color: #ffa502;
  font-size: 16px;
  flex-shrink: 0;
}

.notification-text {
  color: #6cb8ff;
  font-size: 14px;
  line-height: 1.4;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-time {
  color: #6cb8ff;
  font-size: 12px;
  flex-shrink: 0;
  margin-left: 8px;
}


</style>
