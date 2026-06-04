<template>
  <div class="certificate-container">
    <!-- 页面标题 -->
    <!-- <PageHeader
      title="证书管理"
      sub-title="证书信息维护与管理"
      style="padding: 0 0 16px 0"
    /> -->

    <div class="content-layout">
      <!-- 左侧证书类别 -->
      <div class="category-panel">
        <div class="panel-header">
          <span>证书类别</span>
          <Space>
            <Button type="link" size="small" @click="handleAddCategory">新增</Button>
            <!-- <Button type="link" size="small" @click="handleEditCategory" v-if="currentCategory !== 'all'">编辑</Button> -->
          </Space>
        </div>
        <div class="category-list">
          <Menu
            :selected-keys="selectedCategoryKeys"
            mode="inline"
            @select="handleCategorySelect"
          >
            <MenuItem key="all">
              <span class="flex items-center">
                <span class="mr-2">全部证书</span>
                <Badge :number-style="{
                  backgroundColor: '#fff',
                  color: '#999',
                  boxShadow: '0 0 0 1px #d9d9d9 inset',
                }" :count="categoryStatistics.all"></Badge>
              </span>
            </MenuItem>
            <MenuItem 
              v-for="category in certificateCategories" 
              :key="category.id"
            >
              <span class="flex items-center">
                <span class="mr-2">{{ category.name }}</span>
                <Badge :number-style="{
                  backgroundColor: '#fff',
                  color: '#999',
                  boxShadow: '0 0 0 1px #d9d9d9 inset',
                }" :count="categoryStatistics[category.id.toString()]"></Badge>
              </span>
            </MenuItem>
          </Menu>
        </div>
      </div>

      <!-- 右侧证书信息列表 -->
      <div class="main-content">
        <!-- 搜索和操作区域 -->
        <div class="toolbar-container p-[16px]">
          <Space>
            <Button type="primary" @click="handleAdd">新增</Button>
            <Button @click="handleImport">导入人员证书</Button>
            <Button @click="handleDownloadTemplate">下载证书导入模板</Button>
            <Button @click="handleExport">导出</Button>
            <Button @click="handleRefresh">刷新</Button>
          </Space>
        </div>

        <!-- 列表区域 -->
        <SmartTable
          ref="tableRef"
          :api="getCertificateList"
          :columns="columns"
          :search-config="searchConfig"
          :action-column="actionColumn"
          :response-config="{ listKey: 'records', totalKey: 'total' }"
          :pagination="{ pageSize: 5 }"
          :scroll="{ x: 'max-content' }"
          @action="handleTableAction"
        />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <Modal
      :open="modalVisible"
      :title="modalTitle"
      :confirm-loading="confirmLoading"
      :width="800"
      :ok-button-props="{ style: { display: modalType === 'view' ? 'none' : 'inline-block' } }"
      :cancel-text="modalType === 'view' ? '关闭' : '取消'"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <AdvancedForm
        v-if="modalVisible"
        ref="formRef"
        :schema="formSchema"
        :model="formModel"
        mode="form"
        :disabled="modalType === 'view'"
      />
    </Modal>

    <!-- 证书类别弹窗 -->
    <Modal
      :open="categoryModalVisible"
      title="证书类别管理"
      :confirm-loading="categoryConfirmLoading"
      @ok="handleCategoryModalOk"
      @cancel="handleCategoryModalCancel"
    >
      <Form
        ref="categoryFormRef"
        :model="categoryModel"
        formLayout="horizontal"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <FormItem label="类别名称" name="name" :rules="[{ required: true, message: '请输入类别名称' }]">
          <Input v-model:value="categoryModel.name" placeholder="请输入类别名称" />
        </FormItem>
        <FormItem label="描述" name="description">
          <InputTextArea v-model:value="categoryModel.description" placeholder="请输入描述" :rows="3" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { 
  Button, 
  PageHeader, 
  Menu, 
  MenuItem, 
  Space, 
  Modal, 
  Form, 
  FormItem, 
  Input,
  message,
  Badge
} from 'ant-design-vue'
import SmartTable from '@/components/smartTable/index.vue'
import AdvancedForm from '@/components/advancedForm/index.vue'

// 解构出 TextArea 组件
const InputTextArea = Input.TextArea

// 所有模拟数据
const allMockData = [
  {
    id: 1,
    certificateName: '高压电工操作证',
    personName: '张三',
    department: '电气部',
    issuingAuthority: '应急管理局',
    validTime: '2023-12-01 ~ 2026-12-02',
    reviewTime: '2025-12-01',
    certificateStatus: 1,
    category: 1 // 特种作业操作证
  },
  {
    id: 2,
    certificateName: '焊工操作证',
    personName: '李四',
    department: '焊接部',
    issuingAuthority: '人社局',
    validTime: '2023-10-01 ~ 2025-10-02',
    reviewTime: '2025-10-01',
    certificateStatus: 2,
    category: 1 // 特种作业操作证
  },
  {
    id: 3,
    certificateName: '安全员资格证',
    personName: '王五',
    department: '安全部',
    issuingAuthority: '住建厅',
    validTime: '2022-05-01 ~ 2025-05-02',
    reviewTime: '2025-05-01',
    certificateStatus: 2,
    category: 2 // 职业资格证书
  },
  {
    id: 4,
    certificateName: '安全培训合格证',
    personName: '赵六',
    department: '安全部',
    issuingAuthority: '应急管理局',
    validTime: '2023-06-01 ~ 2026-06-02',
    reviewTime: '2025-06-01',
    certificateStatus: 1,
    category: 3 // 安全培训合格证
  },
  {
    id: 5,
    certificateName: '高级电工技术等级证',
    personName: '孙七',
    department: '电气部',
    issuingAuthority: '人社局',
    validTime: '2023-03-01 ~ 2028-03-02',
    reviewTime: '2026-03-01',
    certificateStatus: 1,
    category: 4 // 技术等级证书
  },
  {
    id: 6,
    certificateName: '起重机操作证',
    personName: 'Maintainer八',
    department: '设备部',
    issuingAuthority: '应急管理局',
    validTime: '2023-08-01 ~ 2026-08-02',
    reviewTime: '2025-08-01',
    certificateStatus: 3,
    category: 1 // 特种作业操作证
  },
  {
    id: 7,
    certificateName: '质量工程师资格证',
    personName: '吴九',
    department: '质量部',
    issuingAuthority: '质检总局',
    validTime: '2022-11-01 ~ 2025-11-02',
    reviewTime: '2025-11-01',
    certificateStatus: 3,
    category: 2 // 职业资格证书
  },
  {
    id: 8,
    certificateName: '消防安全培训证',
    personName: '郑十',
    department: '安全部',
    issuingAuthority: '消防局',
    validTime: '2023-09-01 ~ 2026-09-02',
    reviewTime: '2025-09-01',
    certificateStatus: 1,
    category: 3 // 安全培训合格证
  }
]

// 证书类别数据
const certificateCategories = reactive([
  { id: 1, name: '特种作业操作证', description: '特种作业人员操作证书' },
  { id: 2, name: '职业资格证书', description: '职业资格相关证书' },
  { id: 3, name: '安全培训合格证', description: '安全培训合格证书' },
  { id: 4, name: '技术等级证书', description: '技术等级评定证书' }
])

// 统计数据计算函数
const categoryStatistics = reactive({
  all: 0,
  '1': 0, // 特种作业操作证
  '2': 0, // 职业资格证书
  '3': 0, // 安全培训合格证
  '4': 0  // 技术等级证书
})

// 更新统计数据
const updateStatistics = () => {
  categoryStatistics.all = allMockData.length
  certificateCategories.forEach(category => {
    categoryStatistics[category.id.toString()] = allMockData.filter(item => item.category === category.id).length
  })
}

// 初始化统计数据
updateStatistics()

// API模拟函数
const getCertificateList = (params) => {
  // 模拟API请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据类别筛选数据
      let filteredData = allMockData
      
      // 类别筛选逻辑：
      // 1. 如果左侧菜单选择了特定类别（不是'all'），则按该类别筛选
      if (currentCategory.value && currentCategory.value !== 'all') {
        filteredData = filteredData.filter(item => item.category === parseInt(currentCategory.value))
      }
      // 2. 如果左侧菜单选择的是'all'，但搜索参数中有明确的类别值，则按搜索参数筛选
      else if (currentCategory.value === 'all' && params.category && params.category !== '' && params.category !== 'all') {
        filteredData = filteredData.filter(item => item.category === parseInt(params.category))
      }
      // 3. 如果左侧菜单选择的是'all'且搜索参数中没有类别或类别为'all'，则显示所有数据  
      else {
      }
      
      
      // 其他搜索条件筛选
      if (params.certificateName) {
        filteredData = filteredData.filter(item => 
          item.certificateName.toLowerCase().includes(params.certificateName.toLowerCase())
        )
      }
      
      if (params.personName) {
        filteredData = filteredData.filter(item => 
          item.personName.toLowerCase().includes(params.personName.toLowerCase())
        )
      }
      
      if (params.department) {
        filteredData = filteredData.filter(item => 
          item.department.toLowerCase().includes(params.department.toLowerCase())
        )
      }
      
      if (params.certificateStatus) {
        filteredData = filteredData.filter(item => 
          item.certificateStatus === parseInt(params.certificateStatus)
        )
      }
      
      // 分页处理
      const pageNum = params.pageNum || 1;
      const pageSize = params.pageSize || 5;
      const startIndex = (pageNum - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pagedData = filteredData.slice(startIndex, endIndex);
      
      const mockData = {
        records: pagedData,
        total: filteredData.length
      }
      resolve(mockData)
    }, 500)
  })
}
// 表格引用
const tableRef = ref()

// 选中的证书类别
const selectedCategoryKeys = ref(['all'])
const currentCategory = ref('all')

// 处理类别选择
const handleCategorySelect = ({ key }) => {
  // 更新选中的key
  selectedCategoryKeys.value = [key]
  currentCategory.value = key
  // 刷新表格数据
  if (tableRef.value) {
    // 使用 setSearchParams 确保类别参数正确传递，并重置到第一页
    if (tableRef.value.setSearchParams) {
      tableRef.value.setSearchParams({ category: key !== 'all' ? key : '', pageNum: 1 })
    } else {
      tableRef.value.refresh()
    }
  }
}

// 表格列配置
const columns = [
  {
    title: '证书名称',
    dataIndex: 'certificateName',
    key: 'certificateName'
  },
  {
    title: '证书类别',
    dataIndex: 'category',
    key: 'category',
    type: 'select',
    options: certificateCategories.map(cat => ({
      label: cat.name,
      value: cat.id
    }))
  },
  {
    title: '人员名称',
    dataIndex: 'personName',
    key: 'personName'
  },
  {
    title: '所属部门',
    dataIndex: 'department',
    key: 'department'
  },
  {
    title: '发证机关',
    dataIndex: 'issuingAuthority',
    key: 'issuingAuthority'
  },
  {
    title: '有效时间',
    dataIndex: 'validTime',
    key: 'validTime'
  },
  {
    title: '复审时间',
    dataIndex: 'reviewTime',
    key: 'reviewTime'
  },
  {
    title: '证书状态',
    dataIndex: 'certificateStatus',
    key: 'certificateStatus',
    type: 'select',
    options: [
      { label: '有效', value: 1 },
      { label: '过期', value: 2 },
      { label: '即将过期', value: 3 }
    ]
  }
]

// 搜索配置
const searchConfig = [
  {
    field: 'certificateName',
    label: '证书名称',
    type: 'input'
  },
  {
    field: 'category',
    label: '证书类别',
    type: 'select',
    props: {
      options: certificateCategories.map(cat => ({
        label: cat.name,
        value: cat.id
      }))
    }
  },
  {
    field: 'personName',
    label: '人员名称',
    type: 'input'
  },
  {
    field: 'department',
    label: '所属部门',
    type: 'input'
  },
  {
    field: 'certificateStatus',
    label: '证书状态',
    type: 'select',
    props: {
      options: [
        { label: '有效', value: 1 },
        { label: '过期', value: 2 },
        { label: '即将过期', value: 3 }
      ]
    }
  }
]

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 200,
  actions: [
    {
      label: '查看',
      icon: 'EyeOutlined',
      action: 'view',
      props: { type: 'link' }
    },
    {
      label: '编辑',
      icon: 'EditOutlined',
      action: 'edit',
      props: { type: 'link' }
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      action: 'delete',
      props: { type: 'link', danger: true }
    }
  ]
}

// 弹窗相关状态
const modalVisible = ref(false)
const confirmLoading = ref(false)
const modalType = ref('add') // 'add' 或 'edit' 或 'view'

// 弹窗标题计算属性
const modalTitle = computed(() => {
  if (modalType.value === 'add') return '新增证书'
  if (modalType.value === 'edit') return '编辑证书'
  return '查看证书'
})

// 表单引用
const formRef = ref()

// 表单模型
const formModel = reactive({
  id: undefined,
  certificateName: '',
  category: undefined,
  personName: '',
  department: '',
  issuingAuthority: '',
  validStartTime: '',
  validEndTime: '',
  reviewTime: '',
  certificateStatus: undefined
})

// 表单配置
const formSchema = [
  {
    key: 'certificateName',
    label: '证书名称',
    type: 'input',
    required: true,
    placeholder: '请输入证书名称'
  },
  {
    key: 'category',
    label: '证书类别',
    type: 'select',
    required: true,
    props: {
      options: certificateCategories.map(cat => ({
        label: cat.name,
        value: cat.id
      }))
    }
  },
  {
    key: 'personName',
    label: '人员名称',
    type: 'input',
    required: true,
    placeholder: '请输入人员名称'
  },
  {
    key: 'department',
    label: '所属部门',
    type: 'input',
    required: true,
    placeholder: '请输入所属部门'
  },
  {
    key: 'issuingAuthority',
    label: '发证机关',
    type: 'input',
    required: true,
    placeholder: '请输入发证机关'
  },
  {
    key: 'validTime',
    label: '有效时间',
    type: 'rangePicker',
    props: {
      placeholder: ['开始时间', '结束时间']
    },
    required: true
  },
  {
    key: 'reviewTime',
    label: '复审时间',
    type: 'datePicker',
    required: true,
    props: {
      format: 'YYYY-MM-DD'
    }
  },
  {
    key: 'certificateStatus',
    label: '证书状态',
    type: 'select',
    required: true,
    props: {
      options: [
        { label: '有效', value: 1 },
        { label: '过期', value: 2 },
        { label: '即将过期', value: 3 }
      ]
    }
  }
]

// 处理新增
const handleAdd = () => {
  modalType.value = 'add'
  // 重置表单
  Object.assign(formModel, {
    id: undefined,
    certificateName: '',
    category: undefined,
    personName: '',
    department: '',
    issuingAuthority: '',
    validStartTime: '',
    validEndTime: '',
    validTime: '',
    reviewTime: '',
    certificateStatus: undefined
  })
  modalVisible.value = true
}

// 处理刷新
const handleRefresh = () => {
  // 强制刷新表格
  if (tableRef.value) {
    // 确保在刷新时使用当前的类别选择，并重置到第一页
    if (tableRef.value.setSearchParams) {
      // 重置到第一页并设置搜索参数
      tableRef.value.setSearchParams({ category: currentCategory.value !== 'all' ? currentCategory.value : '', pageNum: 1 })
    } else {
      tableRef.value.refresh()
    }
  }
}

// 处理表格操作
const handleTableAction = (action, record) => {
  switch (action) {
    case 'view':
      modalType.value = 'view'
      // 深拷贝数据避免影响原数据
      Object.assign(formModel, JSON.parse(JSON.stringify(record)))
      modalVisible.value = true
      break
    case 'edit':
      modalType.value = 'edit'
      // 深拷贝数据避免影响原数据
      Object.assign(formModel, JSON.parse(JSON.stringify(record)))
      // 处理有效时间数组转换
      if (formModel.validTime && typeof formModel.validTime === 'string') {
        const timeRange = formModel.validTime.split('~')
        if (timeRange.length === 2) {
          formModel.validTime = [timeRange[0].trim(), timeRange[1].trim()]
        }
      }
      modalVisible.value = true
      break
    case 'delete':
      handleDelete(record)
      break
  }
}

// 处理删除
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除证书"${record.certificateName}"吗？`,
    onOk: () => {
      // 模拟删除操作
      const index = allMockData.findIndex(item => item.id === record.id)
      if (index > -1) {
        allMockData.splice(index, 1)
        updateStatistics() // 更新统计
        message.success('删除成功')
        handleRefresh()
      } else {
        message.error('删除失败，未找到该证书')
      }
    },
    onCancel: () => {
      message.info('已取消删除')
    }
  })
}

// 处理弹窗确认
const handleModalOk = async () => {
  try {
    confirmLoading.value = true
    // 表单验证
    if (formRef.value) {
      await formRef.value.validate()
    }
    
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (modalType.value === 'add') {
      // 新增数据
      const newId = allMockData.length > 0 ? Math.max(...allMockData.map(item => item.id)) + 1 : 1
      const newItem = {
        id: newId,
        certificateName: formModel.certificateName,
        personName: formModel.personName,
        department: formModel.department,
        issuingAuthority: formModel.issuingAuthority,
        validTime: Array.isArray(formModel.validTime) 
          ? `${formModel.validTime[0]} ~ ${formModel.validTime[1]}`
          : formModel.validTime,
        reviewTime: formModel.reviewTime,
        certificateStatus: formModel.certificateStatus,
        category: formModel.category
      }
      allMockData.unshift(newItem)
      updateStatistics() // 更新统计
      message.success('新增证书成功')
    } else if (modalType.value === 'edit') {
      // 编辑数据
      const index = allMockData.findIndex(item => item.id === formModel.id)
      if (index > -1) {
        const updatedItem = {
          id: formModel.id,
          certificateName: formModel.certificateName,
          personName: formModel.personName,
          department: formModel.department,
          issuingAuthority: formModel.issuingAuthority,
          validTime: Array.isArray(formModel.validTime) 
            ? `${formModel.validTime[0]} ~ ${formModel.validTime[1]}`
            : formModel.validTime,
          reviewTime: formModel.reviewTime,
          certificateStatus: formModel.certificateStatus,
          category: formModel.category
        }
        allMockData.splice(index, 1, updatedItem)
        updateStatistics() // 更新统计
        message.success('编辑证书成功')
      } else {
        message.error('编辑失败，未找到该证书')
        return
      }
    } else if (modalType.value === 'view') {
      // 查看模式不需要保存
      modalVisible.value = false
      return
    }
    
    modalVisible.value = false
    // 确保在新增或编辑后正确更新统计数据并刷新界面
    updateStatistics()
    // 在新增数据后，计算新数据应在哪一页显示，并跳转到对应页面
    setTimeout(() => {
      if (tableRef.value) {
        // 获取当前筛选后的数据总数
        const currentCategory = currentCategory.value;
        let filteredData = allMockData;
        
        // 应用相同的筛选逻辑
        if (currentCategory && currentCategory !== 'all') {
          filteredData = filteredData.filter(item => item.category === parseInt(currentCategory));
        }
        
        // 计算总页数
        const pageSize = 5;
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        
        // 设置搜索参数并跳转到最后一页
        if (tableRef.value.setSearchParams) {
          tableRef.value.setSearchParams({ 
            category: currentCategory !== 'all' ? currentCategory : '', 
            pageNum: totalPages 
          });
        } else {
          tableRef.value.refresh();
        }
      }
    }, 100)
  } catch (error) {
    console.error('表单验证失败:', error)
    message.error('表单验证失败，请检查输入信息')
  } finally {
    confirmLoading.value = false
  }
}

// 处理弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false
}

// 证书类别弹窗相关状态
const categoryModalVisible = ref(false)
const categoryConfirmLoading = ref(false)
const categoryFormRef = ref()

// 证书类别表单模型
const categoryModel = reactive({
  id: undefined,
  name: '',
  description: ''
})

// 处理新增类别
const handleAddCategory = () => {
  categoryModalVisible.value = true
  // 重置表单
  categoryModel.id = undefined
  categoryModel.name = ''
  categoryModel.description = ''
}

// 处理编辑类别
const handleEditCategory = () => {
  const categoryId = parseInt(currentCategory.value)
  const category = certificateCategories.find(cat => cat.id === categoryId)
  if (category) {
    Object.assign(categoryModel, category)
    categoryModalVisible.value = true
  }
}

// 处理证书类别弹窗确认
const handleCategoryModalOk = async () => {
  try {
    categoryConfirmLoading.value = true
    // 表单验证
    if (categoryFormRef.value) {
      await categoryFormRef.value.validate()
    }
    
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 新增类别
    if (!categoryModel.id) {
      const newId = Math.max(...certificateCategories.map(item => item.id)) + 1
      certificateCategories.push({
        id: newId,
        name: categoryModel.name,
        description: categoryModel.description
      })
      // 初始化统计
      categoryStatistics[newId.toString()] = 0
      message.success('新增类别成功')
    } else {
      // 编辑类别
      const index = certificateCategories.findIndex(item => item.id === categoryModel.id)
      if (index > -1) {
        certificateCategories.splice(index, 1, {
          id: categoryModel.id,
          name: categoryModel.name,
          description: categoryModel.description
        })
        message.success('编辑类别成功')
      }
    }
    
    categoryModalVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    categoryConfirmLoading.value = false
  }
}

// 处理证书类别弹窗取消
const handleCategoryModalCancel = () => {
  categoryModalVisible.value = false
  // 重置表单
  Object.assign(categoryModel, {
    id: undefined,
    name: '',
    description: ''
  })
}

// 处理导入人员证书
const handleImport = () => {
  return message.info('功能开发中，敬请期待')
  // 模拟文件选择和导入
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls,.csv'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      message.success(`已选择文件: ${file.name}，开始导入...`)
      // 这里可以调用实际的导入API
      setTimeout(() => {
        // 模拟导入数据
        const importedData = [
          {
            id: Math.max(...allMockData.map(item => item.id)) + 1,
            certificateName: '导入的证书示例',
            personName: '导入人员',
            department: '导入部门',
            issuingAuthority: '导入机关',
            validTime: '2023-01-01 ~ 2026-01-01',
            reviewTime: '2025-01-01',
            certificateStatus: 1,
            category: 1
          }
        ]
        allMockData.push(...importedData)
        updateStatistics() // 更新统计
        message.success('导入成功')
        handleRefresh()
      }, 2000)
    }
  }
  input.click()
}

// 处理下载证书导入模板
const handleDownloadTemplate = () => {
  return message.info('功能开发中，敬请期待')
  // 模拟下载模板
  const link = document.createElement('a')
  link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQABgAIAAAAIQD1avyxIAEAAH4LAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJyVm07CMBBF9xXfwHYGp7+iyaSgkJhZ2DqQhQ0uToJChuB2sBG0DYhIqCy6Ao+Ky+JSDQnoTnPH+8m393YvpHoeNGL9s/3f6eB9DQG9xQBcP6AC8f8e5D8jvu6Y9Yk1TYqC5GqBTLJaayG5B5DfX/9tG/zJv5H5f8v9tP+9W9f8W8j3Zg+f8uI6B8zQo8jN5P+B8d7P+B8z0p8B8z1p8B8z2p8B8z3p8B8z4p8B8z5p8B8z6p8B8z7p8B8z8p8B8z9p8B8z+p8B8z/p8B8zAp8B8zBp8B8zCp8B8zDp8B8zEp8B8zFp8B8zGp8B8zHp8B8zIp8B8zJp8B8zKp8B8zLp8B8zMp8B8zNp8B8zOp8B8zPp8B8zQp8B8zRp8B8zSp8B8zTp8B8zUp8B8zVp8B8zWp8B8zXp8B8zYp8B8zZp8B8z'
  link.download = '证书导入模板.xlsx'
  link.click()
  message.success('模板下载成功')
}

// 处理导出
const handleExport = () => {
  return message.info('功能开发中，敬请期待')
  // 模拟导出操作
  message.loading('正在导出数据...', 2)
  setTimeout(() => {
    const link = document.createElement('a')
    link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQABgAIAAAAIQD1avyxIAEAAH4LAAATAAAAW0NvbnRlbnRfVHlwZXNdLnhtbJyVm07CMBBF9xXfwHYGp7+iyaSgkJhZ2DqQhQ0uToJChuB2sBG0DYhIqCy6Ao+Ky+JSDQnoTnPH+8m393YvpHoeNGL9s/3f6eB9DQG9xQBcP6AC8f8e5D8jvu6Y9Yk1TYqC5GqBTLJaayG5B5DfX/9tG/zJv5H5f8v9tP+9W9f8W8j3Zg+f8uI6B8zQo8jN5P+B8d7P+B8z0p8B8z1p8B8z2p8B8z3p8B8z4p8B8z5p8B8z6p8B8z7p8B8z8p8B8z9p8B8z+p8B8z/p8B8zAp8B8zBp8B8zCp8B8zDp8B8zEp8B8zFp8B8zGp8B8zHp8B8zIp8B8zJp8B8zKp8B8zLp8BzMp8B8zNp8B8zOp8B8zPp8B8zQp8B8zRp8B8zSp8B8zTp8B8zUp8B8zVp8B8zWp8B8zXp8B8zYp8B8zZp8B8z'
    link.download = `证书数据_${new Date().toLocaleDateString()}.xlsx`
    link.click()
    message.success('导出成功')
  }, 2000)
}
</script>

<style scoped>
.certificate-container {
  padding: 16px;
  /* background: #fff; */
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-layout {
  display: flex;
  flex: 1;
  gap: 16px;
}

.category-panel {
  width: 250px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.category-list {
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
}

.count-badge {
  float: right;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 0 6px;
  font-size: 12px;
  color: #666;
  /* height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  top:50%; */
  /* transform: translateY(-50%); */
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.toolbar-container {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>