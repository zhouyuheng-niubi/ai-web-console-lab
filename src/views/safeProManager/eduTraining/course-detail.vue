<template>
  <div class="course-detail-page">
    <!-- Course Header -->
    <Card class="course-header">
      <div class="course-info-wrapper">
        <img 
          src="@/assets/others_0.jpg"
          alt="Course Cover" 
          class="course-cover"
        />
        <div class="course-details">
          <h1 class="course-title">111</h1>
          <p class="course-subtitle">111</p>
          <div class="course-meta">
            <span>专栏有效期: 永久</span>
            <Divider type="vertical" />
            <span>课程长约: 0分0秒</span>
          </div>
          <p class="course-update-info">
            系统管理员 创建于2025-12-03 17:12:06 上次更新: 2025-12-03 17:12:06
          </p>
          <Space :size="12" class="action-buttons" @click="handleTips">
            <Button type="primary" size="large">专栏分享</Button>
            <Button size="large">编辑专栏</Button>
            <Button size="large">预览专栏</Button>
          </Space>
        </div>
      </div>
    </Card>

    <!-- Statistics Section -->
    <div class="statistics-section">
      <h2 class="section-title">数据统计</h2>
      <Row :gutter="16">
        <Col :span="4.8" v-for="stat in statistics" :key="stat.label">
          <Card class="stat-card">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value">{{ stat.value }}</div>
          </Card>
        </Col>
      </Row>
    </div>

    <!-- Content Management Section -->
    <div class="content-management-section">
      <h2 class="section-title">专栏详情</h2>
      <Card>
        <Tabs v-model:activeKey="activeTab">
          <TabPane key="content" tab="内容管理">
            <div class="content-toolbar">
              <Space :size="12" @click="handleTips">
                <Button type="primary">
                  <PlusOutlined /> 添加
                </Button>
                <Button type="primary" style="background-color: #52c41a; border-color: #52c41a;">
                  <CloudUploadOutlined /> 新建
                </Button>
                <Button>上架</Button>
                <Button>下架</Button>
                <Button danger>
                  <DeleteOutlined /> 删除
                </Button>
              </Space>
              <Input 
                v-model:value="searchText"
                placeholder="请输入课程关键词"
                style="width: 250px;"
                allowClear
              >
                <template #suffix>
                  <SearchOutlined />
                </template>
              </Input>
            </div>

            <!-- Pagination Top -->
            <div class="pagination-bar">
              <Space :size="8">
                <Button size="small" @click="handlePrevPage" :disabled="currentPage === 1">
                  <LeftOutlined />
                </Button>
                <InputNumber 
                  v-model:value="currentPage" 
                  :min="1" 
                  :max="totalPages"
                  size="small"
                  style="width: 60px;"
                />
                <Button size="small" @click="handleNextPage" :disabled="currentPage === totalPages">
                  <RightOutlined />
                </Button>
                <span class="pagination-text">/ {{ totalPages }}页</span>
                <Divider type="vertical" />
                <span class="pagination-text">显示</span>
                <Select v-model:value="pageSize" size="small" style="width: 80px;">
                  <SelectOption :value="10">10</SelectOption>
                  <SelectOption :value="30">30</SelectOption>
                  <SelectOption :value="50">50</SelectOption>
                  <SelectOption :value="100">100</SelectOption>
                </Select>
                <span class="pagination-text">条记录</span>
                <Divider type="vertical" />
                <span class="pagination-text">共 {{ totalRecords }} 条数据记录</span>
              </Space>
            </div>

            <!-- Data Table -->
            <Table 
              :columns="columns" 
              :data-source="dataSource"
              :pagination="false"
              :row-selection="rowSelection"
              bordered
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <Space :size="8" @click="handleTips">
                    <Button type="link" size="small">编辑</Button>
                    <Button type="link" size="small">删除</Button>
                  </Space>
                </template>
              </template>
              <template #emptyText>
                <Empty description="暂无数据" />
              </template>
            </Table>

            <!-- Pagination Bottom -->
            <div class="pagination-bar">
              <Space :size="8">
                <Button size="small" @click="handlePrevPage" :disabled="currentPage === 1">
                  <LeftOutlined />
                </Button>
                <InputNumber 
                  v-model:value="currentPage" 
                  :min="1" 
                  :max="totalPages"
                  size="small"
                  style="width: 60px;"
                />
                <Button size="small" @click="handleNextPage" :disabled="currentPage === totalPages">
                  <RightOutlined />
                </Button>
                <span class="pagination-text">/ {{ totalPages }}页</span>
                <Divider type="vertical" />
                <span class="pagination-text">显示</span>
                <Select v-model:value="pageSize" size="small" style="width: 80px;">
                  <SelectOption :value="10">10</SelectOption>
                  <SelectOption :value="30">30</SelectOption>
                  <SelectOption :value="50">50</SelectOption>
                  <SelectOption :value="100">100</SelectOption>
                </Select>
                <span class="pagination-text">条记录</span>
                <Divider type="vertical" />
                <span class="pagination-text">共 {{ totalRecords }} 条数据记录</span>
              </Space>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Card,
  Button,
  Space,
  Divider,
  Row,
  Col,
  Tabs,
  TabPane,
  Input,
  InputNumber,
  Select,
  SelectOption,
  Table,
  Empty,
  message
} from 'ant-design-vue'
import {
  WechatOutlined,
  BellOutlined,
  WeiboOutlined,
  PlusOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  SearchOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'

// Statistics data
const statistics = ref([
  { label: '浏览量', value: 0 },
  { label: '浏览人数', value: 0 },
  { label: '订阅量', value: 0 },
  { label: '总销售额（元）', value: 0 },
  { label: '销量', value: 0 }
])

// Tab management
const activeTab = ref('content')

// Search
const searchText = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(30)
const totalPages = ref(0)
const totalRecords = ref(0)

// Table columns
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: '学习人数/浏览人数',
    dataIndex: 'views',
    key: 'views',
    width: 180,
    align: 'center'
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
    key: 'uploadTime',
    width: 180,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    align: 'center'
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center'
  }
]

// Table data
const dataSource = ref([])

// Row selection
const selectedRowKeys = ref<number[]>([])
const rowSelection = reactive({
  selectedRowKeys,
  onChange: (keys: number[]) => {
    selectedRowKeys.value = keys
  }
})

// Handlers
const handleAdd = () => {
  console.log('[v0] Add button clicked')
}

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
const handleTips= () => {
  message.info('功能开发中，敬请期待')
}
</script>

<style scoped>
.course-detail-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.course-header {
  margin-bottom: 24px;
}

.course-info-wrapper {
  display: flex;
  gap: 24px;
  position: relative;
}

.course-cover {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.course-details {
  flex: 1;
}

.course-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f1f1f;
}

.course-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0 0 12px 0;
}

.course-meta {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.course-update-info {
  font-size: 13px;
  color: #999;
  margin: 0 0 20px 0;
}

.action-buttons {
  margin-top: 16px;
}

.share-icons {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
}

.share-icon {
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.share-icon.wechat {
  color: #09bb07;
}

.share-icon.wechat:hover {
  color: #07a804;
}

.share-icon.bell {
  color: #1890ff;
}

.share-icon.bell:hover {
  color: #096dd9;
}

.share-icon.weibo {
  color: #e6162d;
}

.share-icon.weibo:hover {
  color: #c41425;
}

.statistics-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1f1f1f;
}

.stat-card {
  text-align: center;
  border-radius: 4px;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 12px;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #1f1f1f;
}

.content-management-section {
  margin-bottom: 24px;
}

.content-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pagination-bar {
  padding: 12px 0;
  display: flex;
  align-items: center;
}

.pagination-text {
  font-size: 14px;
  color: #666;
}

:deep(.ant-tabs-tab) {
  font-size: 15px;
  padding: 12px 0;
}

:deep(.ant-table) {
  font-size: 14px;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  color: #1f1f1f;
}

:deep(.ant-btn-primary) {
  background-color: #1890ff;
  border-color: #1890ff;
}

:deep(.ant-btn-primary:hover) {
  background-color: #40a9ff;
  border-color: #40a9ff;
}
</style>
