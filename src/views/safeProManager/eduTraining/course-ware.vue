<template>
  <div class="courseware-management flex flex-col">
    <!-- <div class="page-header">
      <span class="breadcrumb">课件资源</span>
    </div> -->

    <div class="content-wrapper flex-1 overflow-y-auto">
      <!-- Left Sidebar -->
      <div class="left-sidebar">
        <Tabs v-model:activeKey="activeTab" class="sidebar-tabs">
          <TabPane key="all" tab="所有课件">
            <div class="sidebar-content">
              <div class="tip-box">
                按分类、重命名、删除分类、请进入右侧课件...
              </div>
              
              <Button type="primary" block class="add-category-btn" @click="handleTips">
                <span>
                  <PlusOutlined />
                  新建根分类
                </span>
              </Button>

              <Input 
                v-model:value="searchCategory" 
                placeholder="搜索分类"
                class="search-input"
              >
                <template #suffix>
                  <SearchOutlined class="search-icon" />
                </template>
              </Input>

              <div class="category-tree">
                <div class="category-item active">
                  <FolderFilled class="folder-icon" />
                  <span>所有课件</span>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>

      <!-- Main Content -->
      <div class="main-content flex-1 overflow-y-auto">
        <Tabs v-model:activeKey="contentTab" class="content-tabs">
          <TabPane key="files" tab="课程文件">
            <!-- SmartTable Component -->
            <SmartTable
              :columns="tableColumns"
              :search-config="searchConfig"
              :toolbar-config="toolbarConfig"
              :action-column="actionColumn"
              :data-source="dataSource"
              :pagination="paginationConfig"
              @action="handleAction"
              @toolbarAction="handleToolbarAction"
              @search="handleSearch"
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Tabs, 
  TabPane, 
  Button, 
  Input,
  message
} from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  FolderFilled,
  CloseOutlined
} from '@ant-design/icons-vue'

const activeTab = ref('all')
const contentTab = ref('files')
const searchCategory = ref('')
const searchKeyword = ref('')

// SmartTable 配置
const tableColumns = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
    width: 60,
    align: 'center'
  },
  {
    title: '文件名',
    dataIndex: 'fileName',
    key: 'fileName',
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: '上传时间',
    dataIndex: 'uploadTime',
    key: 'uploadTime',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  }
]

// 搜索配置
const searchConfig = [
  {
    field: 'fileName',
    label: '课件名称',
    type: 'input',
    placeholder: '请输入课件名称'
  },
  {
    field: 'category',
    label: '分类',
    type: 'select',
    props: {
      options: [
        { label: '所有分类', value: '' },
        { label: '安全培训', value: 'safety' },
        { label: '操作规程', value: 'operation' },
        { label: '应急预案', value: 'emergency' }
      ]
    }
  },
  {
    field: 'uploadTime',
    label: '上传时间',
    type: 'date-range'
  }
]

// 工具栏配置
const toolbarConfig = [
  {
    type: 'button',
    label: '上传新课件',
    icon: 'UploadOutlined',
    props: { type: 'primary' },
    action: 'upload'
  },
  {
    type: 'button',
    label: '删除',
    icon: 'DeleteOutlined',
    props: { danger: true },
    action: 'delete'
  },
  {
    type: 'button',
    label: '移动',
    icon: 'DragOutlined',
    action: 'move'
  },
  {
    type: 'dropdown',
    label: '排序',
    icon: 'SortAscendingOutlined',
    action: 'sort',
    options: [
      { label: '按文件名排序' },
      { label: '按上传时间排序' },
      { label: '按文件大小排序' }
    ]
  },
  {
    type: 'dropdown',
    label: '课件类型',
    action: 'filterType',
    options: [
      { label: '所有类型' },
      { label: 'PDF' },
      { label: 'PPT' },
      { label: 'Word' },
      { label: '视频' }
    ]
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 150,
  fixed: 'right',
  actions: [
    {
      label: '编辑',
      icon: 'EditOutlined',
      action: 'edit'
    },
    {
      label: '下载',
      icon: 'DownloadOutlined',
      action: 'download'
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      action: 'delete'
    }
  ]
}

// 分页配置
const paginationConfig = {
  pageSize: 30,
  current: 1,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条数据记录`
}

// 数据源
const dataSource = ref([])

// 处理操作按钮点击
const handleAction = (action, record, index) => {
  message.info('功能开发中，敬请期待')
  console.log('操作:', action, record, index)
  switch (action) {
    case 'edit':
      console.log('编辑课件:', record)
      break
    case 'download':
      console.log('下载课件:', record)
      break
    case 'delete':
      console.log('删除课件:', record)
      break
  }
}

// 处理工具栏操作
const handleToolbarAction = (action, key) => {
  console.log('工具栏操作:', action, key)
  return message.info('功能开发中，敬请期待')
  switch (action) {
    case 'upload':
      console.log('上传新课件')
      break
    case 'delete':
      console.log('批量删除')
      break
    case 'move':
      console.log('移动课件')
      break
    case 'sort':
      console.log('排序:', key)
      break
    case 'filterType':
      console.log('课件类型筛选:', key)
      break
  }
}      
const handleTips = (key) => {
  message.info('功能开发中，敬请期待')
}

// 处理搜索
const handleSearch = (params, pagination) => {
  console.log('搜索参数:', params, pagination)
  // 这里可以调用API获取数据
}
</script>

<style scoped>
.courseware-management {
  height: 100%;
  background: #f5f5f5;
  padding: 14px;
}

.page-header {
  background: white;
  padding: 12px 24px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 14px;
  color: #666;
}

.content-wrapper {
  display: flex;
  /* height: calc(100vh - 49px); */
}

.left-sidebar {
  width: 220px;
  background: white;
  border-right: 1px solid #e8e8e8;
}

.sidebar-tabs :deep(.ant-tabs-nav) {
  margin: 0;
  padding: 0 12px;
}

.sidebar-tabs :deep(.ant-tabs-tab) {
  padding: 12px 8px;
}

.sidebar-content {
  padding: 12px;
}

.tip-box {
  background: #f0f9ff;
  border: 1px solid #d6e4ff;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.add-category-btn {
  margin-bottom: 12px;
  border-radius: 4px;
}

.search-input {
  margin-bottom: 16px;
}

.search-icon {
  color: #1890ff;
  cursor: pointer;
}

.category-tree {
  margin-top: 12px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.category-item:hover {
  background: #f5f5f5;
}

.category-item.active {
  background: #fff3e0;
  color: #ff9800;
}

.folder-icon {
  margin-right: 8px;
  font-size: 16px;
}

.main-content {
  flex: 1;
  background: white;
  overflow: auto;
}

.content-tabs {
  height: 100%;
}

.content-tabs :deep(.ant-tabs-nav) {
  margin: 0;
  padding: 0 24px;
}

.content-tabs :deep(.ant-tabs-tab) {
  color: white;
  padding: 16px 24px;
}

.content-tabs :deep(.ant-tabs-tab-active) {
  background: white;
  color: #1890ff;
  border-radius: 0;
}

.content-tabs :deep(.ant-tabs-ink-bar) {
  display: none;
}

.content-tabs :deep(.ant-tabs-content) {
  height: calc(100% - 57px);
  padding: 16px 24px;
}

.floating-btn {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 48px;
  height: 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}
</style>
