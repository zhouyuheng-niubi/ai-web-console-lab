<template>
  <div class="flex flex-col pt-[30px] pb-[30px] px-[30px]">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3">
        <Button class="flex items-center" type="primary" @click="handleCreateExam">
          <PlusOutlined />
          新建考试
        </Button>
        <!-- <Button class="flex items-center" @click="handleImportPaper">
          <ImportOutlined />
          导入试卷
        </Button> -->
        <Dropdown>
          <template #overlay>
            <Menu @click="handleMenuClick">
              <Menu.Item key="batch_operation">
                <SettingOutlined />
                批量操作
              </Menu.Item>
              <!-- <Menu.Item key="export_exams">
                <ExportOutlined />
                导出考试
              </Menu.Item> -->
              <Menu.Item key="exam_analysis">
                <BarChartOutlined />
                考试分析
              </Menu.Item>
              <!-- <Menu.Item key="view_grading">
                <FileSearchOutlined />
                查看阅卷
              </Menu.Item> -->
            </Menu>
          </template>
          <Button class="flex items-center">
            <MoreOutlined />
            更多操作
          </Button>
        </Dropdown>
      </div>
      <div class="flex items-center gap-3">
        <Badge :count="gradingPendingCount" :offset="[5, 0]">
          <Button class="flex items-center " @click="goToGradingPage" type="link" size="small">
            <FileDoneOutlined />
            待阅卷
          </Button>
        </Badge>
        <Badge  :count="inProgressCount" :offset="[5, 0]">
          <Button class="flex items-center " @click="handleInProgressExams" type="link" size="small">
            <ClockCircleOutlined />
            进行中
          </Button>
        </Badge>
      </div>
    </div>

    <!-- 考试管理Tabs -->
    <div class="mb-4">
        <ExamManagement ref="examManagement"/>
      <!-- <Tabs v-model:activeKey="activeTab" @change="handleTabChange">
        <TabPane key="exam" tab="在线考试">
        
        </TabPane>
        <TabPane key="grading" tab="阅卷管理">
          <GradingManagement />
        </TabPane>
      </Tabs> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { 
  Button, 
  Dropdown, 
  Menu, 
  Badge, 
  Tabs,
  message
} from 'ant-design-vue'
import { 
  PlusOutlined,
  ImportOutlined,
  MoreOutlined,
  SettingOutlined,
  ExportOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  FileDoneOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'
import ExamManagement from './components/exam/ExamManagement.vue'
import GradingManagement from './components/exam/GradingManagement.vue'

const { TabPane } = Tabs

const activeTab = ref('exam')
const gradingPendingCount = ref(28)
const inProgressCount = ref(5)
const examManagement = ref(null)

// 切换Tab
const handleTabChange = (key: string) => {
  activeTab.value = key
}

// 前往阅卷页面
const goToGradingPage = () => {
  activeTab.value = 'grading'
}

// 创建新考试
const handleCreateExam = () => {
    console.log(examManagement.value,'examManagement');

    if( examManagement.value.handleCreateExam){
    examManagement.value.handleCreateExam()

    }
    
//   message.info('新建考试功能开发中...')
  
}

// 导入试卷
const handleImportPaper = () => {
  message.info('导入试卷功能开发中...')
}

// 更多操作菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  switch (key) {
    case 'batch_operation':
      message.info('批量操作功能开发中...')
      break
    case 'export_exams':
      message.info('导出考试功能开发中...')
      break
    case 'exam_analysis':
      message.info('考试分析功能开发中...')
      break
    case 'view_grading':
      goToGradingPage()
      break
  }
}

// 查看进行中的考试
const handleInProgressExams = () => {
  message.info('跳转到进行中考试...')
}
</script>

<style scoped>
.exam-management-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.ant-tabs-nav {
  margin-bottom: 16px;
}
</style>