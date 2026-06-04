<template>
  <div class="data-cockpit-container">
    <!-- 页面标题 -->
    <!-- <div class="page-header">
      <h1 class="tech-title">
        <span class="title-text">数据驾驶舱</span>
        <span class="title-decoration"></span>
      </h1>
    </div> -->
    <!-- 统计卡片区域 -->
    <div class="statistics-cards">
      <Row :gutter="[24, 24]">
        <!-- 设备总数卡片 -->
        <Col :span="8">
          <div class="statistic-card device-total-card">
            <div class="card-icon">
              <div class="icon-bg">
                <img src="@/assets/layout/icon_train.png" alt="设备图标" />
              </div>
            </div>
            <div class="card-content">
              <div class="card-title">设备总数</div>
              <div class="card-value">{{ deviceStats.total }}</div>
              <div class="card-footer">
                <span class="footer-text online">在线: {{ deviceStats.online }}</span>
                <span class="footer-text offline">离线: {{ deviceStats.offline }}</span>
              </div>
            </div>
          </div>
        </Col>

        <!-- 当前报警数卡片 -->
        <Col :span="8">
          <div class="statistic-card alarm-card">
            <div class="card-icon">
              <div class="icon-bg">
                <img src="@/assets/layout/icon_danger.png" alt="报警图标" />
              </div>
            </div>
            <div class="card-content">
              <div class="card-title">当前报警数</div>
              <div class="card-value">{{ alarmStats.current }}</div>
              <div class="card-footer">
                <span class="footer-text today">今日: {{ alarmStats.today }}</span>
                <span class="footer-text week">本Maintainer: {{ alarmStats.week }}</span>
              </div>
            </div>
          </div>
        </Col>

        <!-- 当前预警数卡片 -->
        <Col :span="8">
          <div class="statistic-card warning-card">
            <div class="card-icon">
              <div class="icon-bg">
                <img src="@/assets/layout/icon_action.png" alt="预警图标" />
              </div>
            </div>
            <div class="card-content">
              <div class="card-title">当前预警数</div>
              <div class="card-value">{{ warningStats.current }}</div>
              <div class="card-footer">
                <span class="footer-text today">今日: {{ warningStats.today }}</span>
                <span class="footer-text week">本Maintainer: {{ warningStats.week }}</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <Row :gutter="[24, 24]">
        <!-- 报警趋势图 -->
        <Col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">报警趋势</h3>
            </div>
            <div class="chart-container">
              <div class="echart-placeholder" ref="alarmTrendChart"></div>
            </div>
          </div>
        </Col>

        <!-- 预警分类统计 -->
        <Col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">预警分类统计</h3>
            </div>
            <div class="chart-container">
              <div class="echart-placeholder" ref="warningCategoryChart"></div>
            </div>
          </div>
        </Col>

        <!-- 设备状态分布 -->
        <Col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">设备状态分布</h3>
            </div>
            <div class="chart-container">
              <div class="echart-placeholder" ref="deviceStatusChart"></div>
            </div>
          </div>
        </Col>

        <!-- 区域风险排名 -->
        <Col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">区域风险排名</h3>
            </div>
            <div class="chart-container">
              <div class="echart-placeholder" ref="riskRankingChart"></div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Row, Col,Button } from 'ant-design-vue'
import * as echarts from 'echarts'
import { useMenuStore } from '@/store';
import { useRouter } from 'vue-router'
const router = useRouter()
// 设备统计数据
const deviceStats = ref({
  total: 128,
  online: 115,
  offline: 13
})

// 报警统计数据
const alarmStats = ref({
  current: 5,
  today: 23,
  week: 156
})

// 预警统计数据
const warningStats = ref({
  current: 12,
  today: 42,
  week: 287
})

// 图表实例
const charts = ref([])

// 图表引用
const alarmTrendChart = ref(null)
const warningCategoryChart = ref(null)
const deviceStatusChart = ref(null)
const riskRankingChart = ref(null)

// 初始化报警趋势图
const initAlarmTrendChart = () => {
  if (!alarmTrendChart.value) return
  
  const chart = echarts.init(alarmTrendChart.value)
  
  const option = {
    title: {
      text: '',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Maintainer一', 'Maintainer二', 'Maintainer三', 'Maintainer四', 'Maintainer五', 'Maintainer六', 'Maintainer日'],
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 198, 255, 0.5)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 198, 255, 0.5)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(0, 114, 255, 0.3)'
        }
      }
    },
    series: [
      {
        data: [12, 18, 9, 15, 22, 17, 14],
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(0, 198, 255, 0.4)'
              },
              {
                offset: 1,
                color: 'rgba(0, 114, 255, 0.1)'
              }
            ]
          }
        },
        lineStyle: {
          color: '#00c6ff',
          width: 3
        },
        itemStyle: {
          color: '#0072ff',
          borderWidth: 2,
          borderColor: '#ffffff'
        },
        emphasis: {
          itemStyle: {
            color: '#4facfe',
            borderWidth: 3,
            borderColor: '#ffffff'
          }
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  }
  
  chart.setOption(option)
  charts.value.push(chart)
  return chart
}

// 初始化预警分类统计图
const initWarningCategoryChart = () => {
  if (!warningCategoryChart.value) return
  
  const chart = echarts.init(warningCategoryChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '0',
      left: 'center',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    series: [
      {
        name: '预警分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: 'rgba(10, 25, 47, 0.8)',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
            formatter: '{b}\n{d}%',
            color: '#fff'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 32, name: '行为识别', itemStyle: { color: '#0072ff' } },
          { value: 28, name: '危险区域', itemStyle: { color: '#00c6ff' } },
          { value: 22, name: '设备故障', itemStyle: { color: '#4facfe' } },
          { value: 18, name: '环境异常', itemStyle: { color: '#00f2fe' } }
        ]
      }
    ]
  }
  
  chart.setOption(option)
  charts.value.push(chart)
  return chart
}

// 初始化设备状态分布图
const initDeviceStatusChart = () => {
  if (!deviceStatusChart.value) return
  
  const chart = echarts.init(deviceStatusChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '0',
      left: 'center',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    series: [
      {
        name: '设备状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: 'rgba(10, 25, 47, 0.8)',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
            formatter: '{b}\n{d}%',
            color: '#fff'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 115, name: '在线', itemStyle: { color: '#00c6ff' } },
          { value: 13, name: '离线', itemStyle: { color: '#0072ff' } }
        ]
      }
    ]
  }
  
  chart.setOption(option)
  charts.value.push(chart)
  return chart
}

// 初始化区域风险排名图
const initRiskRankingChart = () => {
  if (!riskRankingChart.value) return
  
  const chart = echarts.init(riskRankingChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['A区', 'B区', 'C区', 'D区', 'E区'],
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 198, 255, 0.5)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 198, 255, 0.5)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.8)'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(0, 114, 255, 0.3)'
        }
      }
    },
    series: [
      {
        name: '风险值',
        type: 'bar',
        barWidth: '40%',
        data: [32, 28, 24, 18, 15],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00c6ff' },
            { offset: 0.5, color: '#0072ff' },
            { offset: 1, color: '#0072ff' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#0072ff' },
              { offset: 0.7, color: '#0072ff' },
              { offset: 1, color: '#00c6ff' }
            ])
          }
        }
      }
    ]
  }
  
  chart.setOption(option)
  charts.value.push(chart)
  return chart
}

// 窗口大小改变时重绘图表
const handleResize = () => {
  charts.value.forEach(chart => {
    if (chart) {
      chart.resize()
    }
  })
}

// 页面加载时的初始化操作
onMounted(() => {
  // 初始化所有图表
  initAlarmTrendChart()
  initWarningCategoryChart()
  initDeviceStatusChart()
  initRiskRankingChart()
  
  // 添加窗口大小改变事件监听器
  window.addEventListener('resize', handleResize)
})

// 组件销毁时清理事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  
  // 销毁所有图表实例
  charts.value.forEach(chart => {
    if (chart) {
      chart.dispose()
    }
  })
  
  // 清空图表数组
  charts.value = []
})
</script>

<style scoped lang="scss">
.data-cockpit-container {
  padding: 24px;
  background: linear-gradient(135deg, #0a192f, #0f2a4a, #143b66);
  min-height: 100vh;
  color: #fff;

  .page-header {
    margin-bottom: 24px;

    .tech-title {
      position: relative;
      display: inline-block;

      .title-text {
        font-size: 32px;
        font-weight: 600;
        background: linear-gradient(to right, #00c6ff, #0072ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: 2px;
      }

      .title-decoration {
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(to right, #00c6ff, #0072ff);
        border-radius: 3px;
        box-shadow: 0 0 10px rgba(0, 114, 255, 0.5);
      }
    }
  }

  .statistics-cards {
    margin-bottom: 24px;

    .statistic-card {
      display: flex;
      align-items: center;
      background: rgba(10, 25, 47, 0.7);
      border-radius: 12px;
      padding: 24px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 114, 255, 0.3);
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(0, 50, 100, 0.4);
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 114, 255, 0.5);
        background: rgba(15, 42, 74, 0.8);
        border: 1px solid rgba(0, 198, 255, 0.5);
      }

      .card-icon {
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        
        .icon-bg {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(0, 114, 255, 0.2);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(0, 198, 255, 0.3);
          
          img {
            width: 36px;
            height: 36px;
            filter: drop-shadow(0 0 8px rgba(0, 198, 255, 0.7));
          }
        }
      }

      .card-content {
        flex: 1;

        .card-title {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 8px;
          font-weight: 500;
        }

        .card-value {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 8px;
          text-shadow: 0 0 10px rgba(0, 198, 255, 0.5);
        }

        .card-footer {
          display: flex;
          gap: 16px;

          .footer-text {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            
            &.online {
              color: #4facfe;
            }
            
            &.offline {
              color: #00c6ff;
            }
            
            &.today {
              color: #0072ff;
            }
            
            &.week {
              color: #00f2fe;
            }
          }
        }
      }

      // 不同卡片的样式
      &.device-total-card {
        .icon-bg {
          background: linear-gradient(135deg, rgba(0, 114, 255, 0.3), rgba(0, 198, 255, 0.5));
        }
        
        .card-value {
          color: #00c6ff;
          text-shadow: 0 0 10px rgba(0, 198, 255, 0.7);
        }
      }

      &.alarm-card {
        .icon-bg {
          background: linear-gradient(135deg, rgba(0, 114, 255, 0.3), rgba(79, 172, 254, 0.5));
        }
        
        .card-value {
          color: #4facfe;
          text-shadow: 0 0 10px rgba(79, 172, 254, 0.7);
        }
      }

      &.warning-card {
        .icon-bg {
          background: linear-gradient(135deg, rgba(0, 114, 255, 0.3), rgba(0, 242, 254, 0.5));
        }
        
        .card-value {
          color: #00f2fe;
          text-shadow: 0 0 10px rgba(0, 242, 254, 0.7);
        }
      }
    }
  }

  .charts-section {
    .chart-card {
      background: rgba(10, 25, 47, 0.7);
      border-radius: 12px;
      padding: 24px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 114, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 50, 100, 0.4);

      .chart-header {
        margin-bottom: 20px;

        .chart-title {
          font-size: 20px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          margin: 0;
          position: relative;
          padding-left: 12px;
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 20px;
            background: linear-gradient(to bottom, #00c6ff, #0072ff);
            border-radius: 2px;
          }
        }
      }

      .chart-container {
        height: 300px;
        
        .echart-placeholder {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .data-cockpit-container {
    padding: 16px;

    .page-header {
      .tech-title {
        .title-text {
          font-size: 24px;
        }
      }
    }

    .statistics-cards {
      .statistic-card {
        padding: 16px;
        
        .card-icon {
          width: 50px;
          height: 50px;
          margin-right: 16px;
          
          .icon-bg {
            img {
              width: 28px;
              height: 28px;
            }
          }
        }
        
        .card-content {
          .card-title {
            font-size: 14px;
          }
          
          .card-value {
            font-size: 24px;
          }
          
          .card-footer {
            flex-direction: column;
            gap: 4px;
          }
        }
      }
    }
    
    .charts-section {
      .chart-card {
        padding: 16px;
        
        .chart-container {
          height: 250px;
        }
      }
    }
  }
}
</style>