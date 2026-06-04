<template>
  <div class="exam-management">
    <!-- Header -->
    <div class="header">
      <div class="title">添加安全试题到试卷（2）</div>
      <Button type="primary" ghost>返回目录</Button>
    </div>

    <!-- Organization Method -->
    <Card class="organization-section">
      <div class="section-title">组卷方式</div>
      <RadioGroup v-model:value="organizationMethod">
        <Radio value="fixed">固定试题顺序</Radio>
        <Radio value="random">随机组题组卷</Radio>
        <Radio value="mixed">固定+随机</Radio>
      </RadioGroup>
      <div class="help-text">
        安全题库与试卷区别？
        <QuestionCircleOutlined />
      </div>
    </Card>

    <!-- Main Content Area -->
    <div class="content-layout">
      <!-- Left Content -->
      <div class="left-content">
        <!-- Toolbar -->
        <Card class="toolbar-section">
          <Space wrap>
            <Checkbox v-model:checked="selectAll" />
            <Button type="primary" :icon="h(PlusOutlined)" @click="hanleTips">添加安全试题</Button>
            <Button danger :icon="h(DeleteOutlined)" @click="hanleTips">删除安全试题</Button>
            <Button :icon="h(EditOutlined)" @click="hanleTips">修改分数</Button>
            <Button @click="hanleTips">安全直播</Button>
            <Dropdown>
              <Button>
                排序
                <DownOutlined />
              </Button>
            </Dropdown>
            <Checkbox v-model:checked="randomOrder">试题乱序</Checkbox>
            <Checkbox v-model:checked="randomOptions">试题选项随机</Checkbox>
            <Checkbox v-model:checked="timeSettings">时间设置</Checkbox>
          </Space>
          
          <div class="toolbar-info">
            <div>现在共计<span class="highlight">4</span>题 总共<span class="highlight">4</span>分</div>
            <Button type="link" @click="hanleTips">安全试题分数设置说明</Button>
          </div>
          
          <Button type="dashed" block class="switch-btn" @click="hanleTips">切换安全题分类显示</Button>
        </Card>

        <!-- Question List -->
        <div class="question-list">
          <Card 
            v-for="question in questions" 
            :key="question.id" 
            class="question-item"
          >
            <div class="question-header">
              <Checkbox v-model:checked="question.checked" />
              <div class="question-info">
                <div class="question-title">
                  <Tag color="blue">{{ question.id }}</Tag>
                  <Tag>{{ question.type }}</Tag>
                  <span>{{ question.title }}</span>
                </div>
                <Dropdown>
                  <Button type="text" size="small">
                    {{ question.points }}分
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            </div>
            
            <div class="question-meta">
              <span>分类：{{ question.category }}</span>
              <span>作者：{{ question.author }}</span>
              <span>更新于：{{ question.updateTime }}</span>
            </div>
            
            <div class="question-actions" @click="hanleTips">
              <Button type="text" size="small" :icon="h(PlusOutlined)" />
              <Button type="text" size="small" :icon="h(EditOutlined)" />
              <Button type="text" size="small" :icon="h(DeleteOutlined)" />
            </div>
          </Card>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="right-sidebar">
        <Card class="sidebar-card">
          <div class="sidebar-title">《2》</div>
          
          <div class="exam-duration">
            <div class="duration-label">考试时长</div>
            <div class="duration-value">
              总时长：30分钟
              <Button type="link" size="small" @click="hanleTips">修改</Button>
            </div>
          </div>

          <div class="score-summary">
            <Row :gutter="16">
              <Col :span="8">
                <div class="score-item">
                  <div class="label">总分</div>
                  <div class="value">4</div>
                </div>
              </Col>
              <Col :span="8">
                <div class="score-item">
                  <div class="label">总题数</div>
                  <div class="value">4</div>
                </div>
              </Col>
              <Col :span="8">
                <div class="score-item">
                  <div class="label">总部分</div>
                  <div class="value">0</div>
                </div>
              </Col>
            </Row>
          </div>

          <Button type="primary" block size="large" class="action-btn" @click="hanleTips">
            保存并进入下一步
          </Button>
          <Button type="primary" block size="large" class="action-btn" @click="hanleTips">
            使用默认设置完成创建安全试卷
          </Button>

          <Divider />

          <div class="analysis-section">
            <div class="analysis-title">
              <PieChartOutlined />
              安全题型分析
            </div>
            <div class="chart-container">
              <div class="donut-chart">
                <svg viewBox="0 0 200 200" width="200" height="200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#1890ff"
                    stroke-width="40"
                    stroke-dasharray="502.65"
                    stroke-dashoffset="0"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="60"
                    fill="white"
                  />
                  <text x="100" y="95" text-anchor="middle" font-size="14" fill="#999">
                    总分
                  </text>
                  <text x="100" y="115" text-anchor="middle" font-size="24" font-weight="bold" fill="#333">
                    4分
                  </text>
                </svg>
              </div>
            </div>
            
            <div class="legend">
              <div class="legend-item">
                <span class="legend-color" style="background: #1890ff"></span>
                <span>安全单选题</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #52c41a"></span>
                <span>安全多选题</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import {
  Card,
  Button,
  Radio,
  RadioGroup,
  Checkbox,
  Space,
  Dropdown,
  Tag,
  Divider,
  Row,
  Col,
  message
} from 'ant-design-vue'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  PieChartOutlined
} from '@ant-design/icons-vue'

const organizationMethod = ref('fixed')
const selectAll = ref(false)
const randomOrder = ref(false)
const randomOptions = ref(false)
const timeSettings = ref(false)

const questions = ref([
  {
    id: '1/4',
    type: '单选题',
    title: '下列哪项是安全生产的基本原则？',
    points: 1,
    category: '安全基础',
    author: '安全管理员',
    updateTime: '2025-12-03 17:16',
    checked: false
  },
  {
    id: '2/4',
    type: '多选题',
    title: '以下哪些属于常见的安全隐患？',
    points: 1,
    category: '隐患识别',
    author: '安全管理员',
    updateTime: '2025-12-03 17:16',
    checked: false
  },
  {
    id: '3/4',
    type: '不定项选择题',
    title: '发生火灾时正确的逃生方法包括？',
    points: 1,
    category: '应急处理',
    author: '安全管理员',
    updateTime: '2025-12-03 17:16',
    checked: false
  },
  {
    id: '4/4',
    type: '判断题',
    title: '佩戴安全帽是高空作业的必要安全措施？',
    points: 1,
    category: '个人防护',
    author: '安全管理员',
    updateTime: '2025-12-03 17:16',
    checked: false
  }
])

const hanleTips = () => {
  message.info('功能开发中,敬请期待')
}
</script>

<style scoped>
.exam-management {
  padding: 16px;
  background: #f0f2f5;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.organization-section {
  margin-bottom: 24px;
}

.section-title {
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;
}

.help-text {
  margin-top: 16px;
  color: #999;
  font-size: 14px;
}

.content-layout {
  display: flex;
  gap: 24px;
}

.left-content {
  flex: 1;
}

.right-sidebar {
  width: 320px;
}

.toolbar-section {
  margin-bottom: 16px;
}

.toolbar-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
}

.highlight {
  color: #1890ff;
  font-weight: 600;
  margin: 0 4px;
}

.switch-btn {
  margin-top: 16px;
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-item {
  position: relative;
}

.question-header {
  display: flex;
  gap: 12px;
}

.question-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.question-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.question-meta {
  margin-top: 12px;
  color: #999;
  font-size: 13px;
  display: flex;
  gap: 16px;
}

.question-actions {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
}

.sidebar-card {
  position: sticky;
  top: 24px;
}

.sidebar-title {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 24px;
}

.exam-duration {
  margin-bottom: 24px;
}

.duration-label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.duration-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
}

.score-summary {
  margin-bottom: 24px;
}

.score-item {
  text-align: center;
}

.score-item .label {
  color: #999;
  font-size: 13px;
  margin-bottom: 8px;
}

.score-item .value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.action-btn {
  margin-bottom: 12px;
}

.analysis-section {
  margin-top: 24px;
}

.analysis-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;
}

.chart-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.donut-chart {
  width: 200px;
  height: 200px;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
</style>
