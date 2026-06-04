<template>
  <div class="knowledge-base-container p-[16px]">
    <!-- Left Sidebar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>安全生产知识分类</h3>
      </div>
      
      <div class="sidebar-tips">
        <div class="tips-text">
          提示：<br />
          1.新建子分类、重命名、删除分类、请鼠标由左移动到分类上<br />
          2.所有知识点均与安全生产操作相关
        </div>
      </div>

      <Button type="primary" block class="new-directory-btn" size="large" @click="hanleTips">
        <template #icon>
          <PlusOutlined />
        </template>
        新建根目录
      </Button>

      <div class="search-category">
        <Input 
          placeholder="搜索安全生产知识分类" 
          v-model:value="categorySearch"
        >
          <template #suffix>
            <SearchOutlined class="search-icon" />
          </template>
        </Input>
      </div>

      <div class="category-tree">
        <Tree
          :tree-data="treeData"
          :default-expand-all="true"
          :show-icon="true"
        >
          <template #icon="{ dataRef }">
            <FolderOutlined  style="color: #faad14;" />
          </template>
        </Tree>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="content-header">
        <Space :size="12" @click="hanleTips">
          <Button type="primary">
         
            <span>
              <PlusOutlined />新建安全生产知识点
            </span>
          </Button>
          <Button>移动到分类</Button>
          <Button>
            <span>
              <DeleteOutlined />
              删除知识点
            </span>
          </Button>
          <Button>标签管理</Button>
        </Space>

        <div class="header-right">
          <Input 
            placeholder="搜索安全生产操作知识" 
            v-model:value="searchText"
            style="width: 200px;"
          >
            <template #suffix>
              <SearchOutlined class="search-icon" />
            </template>
          </Input>
        </div>
      </div>

      <div class="content-toolbar">
        <div class="toolbar-left">
          <Checkbox v-model:checked="selectAll">全选</Checkbox>
          <Button type="text" size="small">
            <LeftOutlined />
          </Button>
          <Input value="1" style="width: 50px; text-align: center;" />
          <Button type="text" size="small">
            <RightOutlined />
          </Button>
          <span class="pagination-text">/ 1页</span>
          <span class="divider">|</span>
          <span class="pagination-text">显示</span>
          <Select v-model:value="pageSize" style="width: 70px;">
            <SelectOption :value="30">30</SelectOption>
            <SelectOption :value="50">50</SelectOption>
            <SelectOption :value="100">100</SelectOption>
          </Select>
          <span class="pagination-text">条记录</span>
          <span class="divider">|</span>
          <span class="pagination-text">共1条数据记录</span>
        </div>

        <div class="toolbar-right">
          <Select v-model:value="sortType" style="width: 120px;">
            <SelectOption value="date">新建日期</SelectOption>
            <SelectOption value="update">更新日期</SelectOption>
          </Select>
          <Select v-model:value="creatorFilter" style="width: 120px;">
            <SelectOption value="all">全部创建人</SelectOption>
            <SelectOption value="me">我创建的</SelectOption>
          </Select>
        </div>
      </div>

      <div class="knowledge-list">
        <Card class="knowledge-card" v-for="item in knowledgeList" :key="item.id">
          <div class="card-header">
            <Checkbox v-model:checked="item.selected" />
            <h2 class="knowledge-title">{{ item.title }}</h2>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-value">{{ item.likes }}</span>
                <span class="stat-label">人点赞</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ item.comments }}</span>
                <span class="stat-label">人评论</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ item.views }}</span>
                <span class="stat-label">人查看</span>
              </div>
            </div>
          </div>

          <div class="card-meta">
            <span class="meta-text">系统管理员 创建于{{ item.createDate }} 上次更新：{{ item.updateDate }}</span>
          </div>

          <div class="card-footer">
            <Space @click="hanleTips">
              <Button type="link">相关课程({{ item.courses }})</Button>
              <Button type="link">学习记录</Button>
              <Dropdown>
                <Button type="link">
                  <span>
                    更多<DownOutlined />
                  </span>
                </Button>
              </Dropdown>
            </Space>
          </div>
        </Card>
      </div>

      <div class="content-footer">
        <div class="footer-pagination">
          <Button type="text" size="small">
            <LeftOutlined />
          </Button>
          <Input value="1" style="width: 50px; text-align: center;" />
          <Button type="text" size="small">
            <RightOutlined />
          </Button>
          <span class="pagination-text">/ 1页</span>
          <span class="divider">|</span>
          <span class="pagination-text">显示</span>
          <Select v-model:value="pageSize" style="width: 70px;">
            <SelectOption :value="30">30</SelectOption>
            <SelectOption :value="50">50</SelectOption>
            <SelectOption :value="100">100</SelectOption>
          </Select>
          <span class="pagination-text">条记录</span>
          <span class="divider">|</span>
          <span class="pagination-text">共1条数据记录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  Button, 
  Input, 
  Tree, 
  Space, 
  Checkbox, 
  Select, 
  Card,
  Dropdown, 
  message
} from 'ant-design-vue';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FolderOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined
} from '@ant-design/icons-vue';

const SelectOption = Select.Option;

const categorySearch = ref('');
const searchText = ref('');
const selectAll = ref(false);
const pageSize = ref(30);
const sortType = ref('date');
const creatorFilter = ref('all');

const treeData = ref([
  {
    title: '所有安全生产知识',
    key: 'all',
    children: []
  },
  {
    title: '安全操作规程',
    key: 'safety-procedures',
    children: [
      {
        title: '电气安全操作',
        key: 'electrical-safety',
        children: []
      },
      {
        title: '高空作业安全',
        key: 'high-altitude-safety',
        children: []
      }
    ]
  },
  {
    title: '应急处理',
    key: 'emergency-response',
    children: [
      {
        title: '火灾应急预案',
        key: 'fire-emergency',
        children: []
      },
      {
        title: '化学品泄漏处理',
        key: 'chemical-leak',
        children: []
      }
    ]
  },
  {
    title: '个人防护',
    key: 'personal-protection',
    children: []
  }
]);

const knowledgeList = ref([
  {
    id: 1,
    title: '电气设备安全操作规程',
    subtitle: '电气安全',
    likes: 15,
    comments: 3,
    views: 128,
    courses: 2,
    createDate: '2025/12/3',
    updateDate: '2025/12/3',
    selected: false
  },
  {
    id: 2,
    title: '高空作业安全防护措施',
    subtitle: '高空作业',
    likes: 22,
    comments: 5,
    views: 96,
    courses: 1,
    createDate: '2025/12/1',
    updateDate: '2025/12/2',
    selected: false
  }
]);

const hanleTips = () => {
  message.info('功能开发中,敬请期待')
}
</script>

<style scoped>
.knowledge-base-container {
  display: flex;
  background: #f5f5f5;
  height: 100%;
}

.sidebar {
  width: 240px;
  background: white;
  padding: 20px 16px;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  padding-bottom: 12px;
  border-bottom: 2px solid #1890ff;
}

.sidebar-tips {
  background: #f0f0f0;
  padding: 12px;
  border-radius: 4px;
}

.tips-text {
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

.new-directory-btn {
  height: 40px;
  font-size: 14px;
}

.search-category {
  margin-top: 8px;
}

.search-icon {
  color: #bfbfbf;
  cursor: pointer;
}

.category-tree {
  flex: 1;
  overflow-y: auto;
}

.main-content {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 20px;
  border-radius: 4px;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.content-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px 20px;
  border-radius: 4px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-text {
  font-size: 14px;
  color: #666;
}

.divider {
  color: #d9d9d9;
  margin: 0 8px;
}

.knowledge-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.knowledge-card {
  background: white;
  border-radius: 4px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.knowledge-title {
  flex: 1;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #262626;
}

.card-stats {
  display: flex;
  gap: 32px;
  margin-left: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
}

.stat-label {
  font-size: 12px;
  color: #8c8c8c;
}

.card-meta {
  margin-bottom: 12px;
}

.meta-text {
  font-size: 12px;
  color: #8c8c8c;
}

.card-footer {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.card-footer a {
  color: #1890ff;
  font-size: 14px;
}

.card-footer a:hover {
  text-decoration: underline;
}

.content-footer {
  background: white;
  padding: 12px 20px;
  border-radius: 4px;
}

.footer-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>