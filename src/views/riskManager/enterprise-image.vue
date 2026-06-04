<template>
  <div class="dashboard-container">
    <!-- Main Content -->
    <div class="main-content">
      <div class="left-panel">
        <!-- Statistics Cards -->
        <Row :gutter="16" class="stats-cards">
          <Col :span="4">
            <Card class="stat-card blue-card">
              <div class="stat-content">
                <div class="stat-label">危化品</div>
                <div class="stat-value">2</div>
                <div class="stat-icon">🧪</div>
              </div>
            </Card>
          </Col>
          <Col :span="4">
            <Card class="stat-card green-card">
              <div class="stat-content">
                <div class="stat-label">危化工艺</div>
                <div class="stat-value">4</div>
                <div class="stat-icon">⚗️</div>
              </div>
            </Card>
          </Col>
          <Col :span="4">
            <Card class="stat-card orange-card">
              <div class="stat-content">
                <div class="stat-label">重大危险源</div>
                <div class="stat-value">1</div>
                <div class="stat-icon">⚠️</div>
              </div>
            </Card>
          </Col>
          <Col :span="4">
            <Card class="stat-card red-card">
              <div class="stat-content">
                <div class="stat-label">企业风险等级</div>
                <div class="stat-value">三级</div>
                <div class="stat-icon">📊</div>
              </div>
            </Card>
          </Col>
          <Col :span="4">
            <Card class="stat-card blue-card">
              <div class="stat-content">
                <div class="stat-label">企业人员数</div>
                <div class="stat-value">95</div>
                <div class="stat-icon">👥</div>
              </div>
            </Card>
          </Col>
          <Col :span="4">
            <Card class="stat-card purple-card">
              <div class="stat-content">
                <div class="stat-label">其他</div>
                <div class="stat-value">0</div>
                <div class="stat-icon">📚</div>
              </div>
            </Card>
          </Col>
        </Row>

        <!-- Charts Section -->
        <Row :gutter="16" class="charts-section">
          <Col :span="12">
            <Card title="风险单元统计" class="chart-card">
              <div ref="riskChartRef" style="width: 100%; height: 250px"></div>
            </Card>
          </Col>
          <Col :span="12">
            <Card title="近一年隐患分析" class="chart-card">
              <div ref="hazardChartRef" style="width: 100%; height: 250px"></div>
              <!-- <div class="legend-info">
                <div class="legend-item">
                  <span class="dot yellow"></span>一般隐患 <strong>0</strong>
                </div>
                <div class="legend-item">
                  <span class="dot orange"></span>待整改 <strong>0</strong>
                </div>
                <div class="legend-item">
                  <span class="dot orange"></span>已整改 <strong>0</strong>
                </div>
                <div class="legend-item">
                  <span class="dot yellow"></span>重大隐患 <strong>0</strong>
                </div>
                <div class="legend-item">
                  <span class="dot orange"></span>待整改 <strong>1</strong>
                </div>
                <div class="legend-item">
                  <span class="dot grey"></span>已整改 <strong>0</strong>
                </div>
              </div> -->
            </Card>
          </Col>
        </Row>

        <!-- Enterprise Safety Profile -->
        <Card class="profile-card">
          <template #title>
            <span><FileTextOutlined /> 企业安全生产画像</span>
          </template>
          <Row :gutter="16">
            <Col :span="6">
              <div class="profile-item">
                <div class="profile-icon blue-bg">
                  <CheckCircleOutlined />
                </div>
                <div class="profile-text cursor-pointer" @click="toNavigation('/digital-plan')">
                  <div class="profile-label">应急预案数</div>
                  <div class="profile-value">5</div>
                </div>
              </div>
            </Col>
            <Col :span="6">
              <div class="profile-item">
                <div class="profile-icon green-bg">
                  <ReconciliationOutlined />
                </div>
                <div class="profile-text cursor-pointer" @click="toNavigation('/emergency-materials')">
                  <div class="profile-label">物资数量</div>
                  <div class="profile-value">2750</div>
                </div>
              </div>
            </Col>
            <Col :span="6">
              <div class="profile-item">
                <div class="profile-icon purple-bg">
                  <SafetyOutlined />
                </div>
                <div class="profile-text cursor-pointer" @click="toNavigation('/emergency-drill')">
                  <div class="profile-label">应急演练计划</div>
                  <div class="profile-value">7</div>
                </div>
              </div>
            </Col>
            <Col :span="6">
              <div class="profile-item">
                <div class="profile-icon orange-bg">
                  <FileDoneOutlined />
                </div>
                <div class="profile-text cursor-pointer" @click="toNavigation('/emergency-drill/records')">
                  <div class="profile-label">应急演练记录</div>
                  <div class="profile-value">7</div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <!-- Special Operations Statistics -->
        <Card class="operations-card">
          <template #title>
            <span><BarChartOutlined /> 特殊作业数据统计</span>
          </template>
          <template #extra>
            <RadioGroup v-model:value="timeRange" button-style="solid" size="small">
              <RadioButton value="all">全部</RadioButton>
              <RadioButton value="year">今年</RadioButton>
              <RadioButton value="lastYear">近半年</RadioButton>
              <RadioButton value="threeMonths">近三月</RadioButton>
              <RadioButton value="oneMonth">近一月</RadioButton>
            </RadioGroup>
          </template>
          <div ref="operationsChartRef" style="width: 100%; height: 300px"></div>
        </Card>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <Card class="company-info-card" title="企业信息">
          <div class="info-item">
            <span class="info-label">企业类型：</span>
            <span class="info-value">生产</span>
          </div>
          <div class="info-item">
            <span class="info-label">人员总数：</span>
            <span class="info-value">95</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业性质：</span>
            <span class="info-value">国有企业</span>
          </div>
          <div class="info-item">
            <span class="info-label">成立日期：</span>
            <span class="info-value">2001-12-10</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业责任人：</span>
            <span class="info-value">赵xx 180****0692</span>
          </div>
          <div class="info-item">
            <span class="info-label">安全负责人：</span>
            <span class="info-value">赵xx 180****0692</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业地址：</span>
            <span class="info-value">示例地区市...</span>
          </div>
        </Card>

        <Card class="alert-card">
          <template #title>
            <span><BellOutlined /> 系统预警报警</span>
          </template>
          <div class="alert-summary">
            <WarningOutlined class="warning-icon" />
            <span>今日预警/报警次数：<strong class="alert-count">0次</strong></span>
          </div>
          <Tabs v-model:activeKey="alertTab" size="small">
            <TabPane key="1">
              <template #tab>
                未处理 (0)
              </template>
            </TabPane>
            <TabPane key="2">
              <template #tab>
                已处理 (0)
              </template>
            </TabPane>
          </Tabs>
          <div class="no-alert">
            暂无预警信息
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { 
  Card, 
  Row, 
  Col, 
  Tabs, 
  TabPane,
  RadioGroup,
  RadioButton
} from 'ant-design-vue'
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ReconciliationOutlined,
  SafetyOutlined,
  FileDoneOutlined,
  BarChartOutlined,
  BellOutlined,
  WarningOutlined
} from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
const activeTab = ref('1')
const alertTab = ref('1')
const timeRange = ref('all')

const riskChartRef = ref(null)
const hazardChartRef = ref(null)
const operationsChartRef = ref(null)

onMounted(() => {
  initRiskChart()
  initHazardChart()
  initOperationsChart()
})

// 监听时间范围变化，重新初始化特殊作业图表
watch(timeRange, () => {
  if (operationsChartRef.value) {
    const chart = echarts.getInstanceByDom(operationsChartRef.value)
    if (chart) {
      chart.dispose()
    }
    initOperationsChart()
  }
})

const initRiskChart = () => {
  const chart = echarts.init(riskChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '0%',
      top: 'center',
      formatter: function(name) {
        const data = option.series[0].data
        const item = data.find(item => item.name === name)
        if (item && item.value > 0) {
          const total = data.reduce((sum, item) => sum + item.value, 0)
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
          return `${name}: ${item.value} (${percentage}%)`
        }
        return name
      }
    },
    series: [
      {
        name: '风险单元',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: '{b}: {c}\n({d}%)',
          fontSize: 12
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: 0, name: '四级', itemStyle: { color: '#f5222d' } },
          { value: 0, name: '三级', itemStyle: { color: '#fa8c16' } },
          { value: 0, name: '二级', itemStyle: { color: '#fadb14' } }
        ]
      }
    ]
  }
  chart.setOption(option)
}

const initHazardChart = () => {
  const chart = echarts.init(hazardChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '0%',
      top: 'center',
      formatter: function(name) {
        const data = option.series[0].data
        const item = data.find(item => item.name === name)
        if (item && item.value > 0) {
          const total = data.reduce((sum, item) => sum + item.value, 0)
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
          return `${name}: ${item.value} (${percentage}%)`
        }
        return name
      }
    },
    series: [
      {
        name: '隐患分析',
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: '{b}: {c}\n({d}%)',
          fontSize: 12
        },
        data: [
          { value: 0, name: '一般隐患-待整改', itemStyle: { color: '#fadb14' } },
          { value: 0, name: '一般隐患-已整改', itemStyle: { color: '#fa8c16' } },
          { value: 1, name: '重大隐患-待整改', itemStyle: { color: '#ff7875' } },
          { value: 0, name: '重大隐患-已整改', itemStyle: { color: '#d9d9d9' } }
        ]
      }
    ]
  }
  chart.setOption(option)
}

const initOperationsChart = () => {
  const chart = echarts.init(operationsChartRef.value)
  
  // 根据时间范围生成数据
  const getOperationsData = (timeRange) => {
    const baseData = {
      '动火': Math.floor(Math.random() * 20) + 5,
      '受限空间': Math.floor(Math.random() * 15) + 3,
      '盲板抽堵': Math.floor(Math.random() * 10) + 2,
      '高处': Math.floor(Math.random() * 25) + 8,
      '临时用电': Math.floor(Math.random() * 18) + 4,
      '动土': Math.floor(Math.random() * 12) + 3
    }
    
    switch(timeRange) {
      case 'year':
        return Object.keys(baseData).reduce((acc, key) => {
          acc[key] = baseData[key] * 12
          return acc
        }, {})
      case 'lastYear':
        return Object.keys(baseData).reduce((acc, key) => {
          acc[key] = baseData[key] * 6
          return acc
        }, {})
      case 'threeMonths':
        return Object.keys(baseData).reduce((acc, key) => {
          acc[key] = Math.floor(baseData[key] * 3)
          return acc
        }, {})
      case 'oneMonth':
        return baseData
      default:
        return Object.keys(baseData).reduce((acc, key) => {
          acc[key] = baseData[key] * 15
          return acc
        }, {})
    }
  }
  
  const data = getOperationsData(timeRange.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c} 次'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Object.keys(data),
      axisLabel: {
        rotate: 30,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '作业次数',
      axisLabel: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '作业次数',
        type: 'bar',
        data: Object.values(data),
        itemStyle: {
          color: function(params) {
            const colors = ['#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1', '#13c2c2']
            return colors[params.dataIndex % colors.length]
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          formatter: '{c}'
        }
      }
    ]
  }
  
  chart.setOption(option)
}
const router = useRouter()
const toNavigation = (path) => {
  router.push({ path })
}
</script>

<style scoped>
.dashboard-container {
  background: #f0f2f5;
  min-height: 100vh;
  padding: 16px;
}

.dashboard-header {
  background: white;
  padding: 12px 24px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
}

.dashboard-header h2 {
  margin: 0;
  color: #ff4d4f;
  font-size: 20px;
}

.main-content {
  display: flex;
  gap: 16px;
}

.left-panel {
  flex: 1;
}

.right-panel {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Stats Cards */
.stats-cards {
  margin-bottom: 16px;
}

.stat-card {
  border-radius: 8px;
  overflow: hidden;
}

.stat-card :deep(.ant-card-body) {
  padding: 20px 16px;
}

.stat-content {
  position: relative;
  color: white;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

.stat-icon {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32px;
  opacity: 0.3;
}

.blue-card {
  background: linear-gradient(135deg, #667eea 0%, #4e9af1 100%);
  color: white;
}

.green-card {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  color: white;
}

.orange-card {
  background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
  color: white;
}

.red-card {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
}

.purple-card {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
  color: white;
}

/* Charts */
.charts-section {
  margin-bottom: 16px;
}

.chart-card :deep(.ant-card-body) {
  padding-top: 8px;
}

.legend-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}

.dot.yellow {
  background: #fadb14;
}

.dot.orange {
  background: #fa8c16;
}

.dot.grey {
  background: #d9d9d9;
}

/* Profile Card */
.profile-card {
  margin-bottom: 16px;
}

.profile-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.blue-bg {
  background: #1890ff;
}

.green-bg {
  background: #52c41a;
}

.purple-bg {
  background: #722ed1;
}

.orange-bg {
  background: #fa8c16;
}

.profile-text {
  flex: 1;
}

.profile-label {
  font-size: 12px;
  color: #8c8c8c;
}

.profile-value {
  font-size: 20px;
  font-weight: bold;
  color: #262626;
}


.no-data {
  text-align: center;
  padding: 40px 0;
  color: #8c8c8c;
}

/* Company Info */
.company-info-card {
  margin-bottom: 16px;
}

.info-item {
  margin-bottom: 12px;
  font-size: 13px;
}

.info-label {
  color: #8c8c8c;
}

.info-value {
  color: #262626;
}

/* Alert Card */
.alert-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.alert-card :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.alert-summary {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fff7e6;
  border-radius: 4px;
  margin-bottom: 16px;
}

.warning-icon {
  color: #fa8c16;
  font-size: 18px;
  margin-right: 8px;
}

.alert-count {
  color: #ff4d4f;
}

.alert-card :deep(.ant-tabs) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.alert-card :deep(.ant-tabs-content-holder) {
  flex: 1;
  display: flex;
}

.alert-card :deep(.ant-tabs-tabpane) {
  height: 100%;
  display: flex;
}

.no-alert {
  flex: 1;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  color: #8c8c8c;
  text-align: center;
}
</style>