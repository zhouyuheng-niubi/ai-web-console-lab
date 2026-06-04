<template>
  <div class="flex flex-col pt-[30px] pb-[30px] px-[30px]">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3">
        <Button class="flex items-center" type="primary" @click="handleCreateQuestionBank">
          <PlusOutlined />
          新建题库
        </Button>
        <!-- <Button class="flex items-center" @click="handleImportQuestions">
          <ImportOutlined />
          导入试题
        </Button> -->
        <!-- <Dropdown>
          <template #overlay>
            <Menu @click="handleMenuClick">
              <Menu.Item key="batch_import">
                <UploadOutlined />
                批量导入
              </Menu.Item>
              <Menu.Item key="export_bank">
                <ExportOutlined />
                导出题库
              </Menu.Item>
              <Menu.Item key="question_analysis">
                <BarChartOutlined />
                试题分析
              </Menu.Item>
            </Menu>
          </template>
          <Button>
            <MoreOutlined />
            更多操作
          </Button>
        </Dropdown> -->
      </div>
    
    </div>

    <!-- 题库管理Tabs -->
    <div class="mb-4">
         <QuestionBankManagement 
            ref="bankManagementRef"
            @question-management="handleQuestionManagement"
             @edit="editQuestionBank"
          />
    
    </div>
  <!-- 试题管理 -->
    <Modal 
      :title="'试题管理'" 
      v-model:open="questionVisible" 
      width="1200px" 
      @ok=""
    >
      <QuestionManagement 
            ref="questionManagementRef"
            :selected-bank-id="selectedBankId"
            :selected-bank-name="selectedBankName"
          />
    </Modal>

    <!-- 新建/编辑题库弹窗 -->
    <Modal 
      :title="isEditMode ? '编辑题库' : '新建题库'" 
      v-model:open="bankModalVisible" 
      width="800px" 
      @ok="saveQuestionBank"
    >
      <QuestionBankForm
        ref="questionBankFormRef"
        :form-data="currentBankData"
        :is-edit="isEditMode"
        @save="saveBankData"
      />
    </Modal>

    <!-- 导入试题弹窗 -->
    <Modal 
      title="导入试题" 
      v-model:open="importModalVisible" 
      width="700px" 
      @ok="confirmImportQuestions"
    >
      <ImportQuestionForm
        ref="importFormRef"
        @import="handleImportSubmit"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { 
  Button, 
  Dropdown, 
  Menu, 
  Badge, 
  Tabs,
  Modal,
  message
} from 'ant-design-vue'
import { 
  PlusOutlined,

} from '@ant-design/icons-vue'

import { useRouter } from 'vue-router'
import QuestionManagement from './components/question/QuestionManagement.vue'
import QuestionBankManagement from './components/question/QuestionBankManagement.vue'
import QuestionBankForm from './components/question/QuestionBankForm.vue'
import ImportQuestionForm from './components/question/ImportQuestionForm.vue'

const { TabPane } = Tabs
const router = useRouter()
const activeTab = ref('question_bank')
const selectedBankId = ref('')
const selectedBankName = ref('')
const bankModalVisible = ref(false)
const questionVisible = ref(false)
const importModalVisible = ref(false)
const isEditMode = ref(false)

const currentBankData = ref({})
const bankStats = ref({
  total_questions: 0,
  active_banks: 0
})

const bankManagementRef = ref()
const questionManagementRef = ref()
const questionBankFormRef = ref()
const importFormRef = ref()

// 新建题库
const handleCreateQuestionBank = () => {
  isEditMode.value = false
  currentBankData.value = {}
  bankModalVisible.value = true
}
const editQuestionBank = (record: any) => { 

  isEditMode.value = true
 currentBankData.value = {...record}
  bankModalVisible.value = true
}
// 导入试题
const handleImportQuestions = () => {
  importModalVisible.value = true
}



// 查看启用题库
const handleActiveBanks = () => {
  if (bankManagementRef.value) {
    bankManagementRef.value.filterActiveBanks()
  }
}

// 处理试题管理
const handleQuestionManagement = (bank: any) => {
  selectedBankId.value = bank.id
  selectedBankName.value = bank.bank_name

//   jumpTo('/question-management',{id: bank.id,bank_name: bank.bank_name})
  // 通知试题管理组件
  if (questionManagementRef.value) {
    questionManagementRef.value.setSelectedBank(bank.id, bank.bank_name)
  }
  questionVisible.value = true

}

// 保存题库数据
const saveBankData = async (formData: any) => {
  try {
    if (isEditMode.value) {
      // 调用更新题库API
      // await updateQuestionBank(selectedBankId.value, formData)
      message.success('题库信息更新成功')
    } else {
      // 调用创建题库API
      // await createQuestionBank(formData)
      message.success('题库创建成功')
    }
    bankModalVisible.value = false
    
    // 刷新题库列表
    if (bankManagementRef.value) {
      bankManagementRef.value.refreshList()
    }
  } catch (error) {
    message.error(isEditMode.value ? '更新失败' : '创建失败')
  }
}

// 保存题库
const saveQuestionBank = async () => {
  try {
    if (questionBankFormRef.value?.handleSubmit) {
      await questionBankFormRef.value.handleSubmit()
    }
  } catch (error) {
    message.error('提交失败，请重试')
  }
}

// 确认导入试题
const confirmImportQuestions = async () => {
  try {
    if (importFormRef.value?.handleSubmit) {
      await importFormRef.value.handleSubmit()
    }
  } catch (error) {
    message.error('导入失败，请重试')
  }
}

// 处理导入提交
const handleImportSubmit = async (importData: any) => {
  try {
    // 调用导入试题API
    // await importQuestions(importData)
    message.success(`成功导入${importData.questions.length}道试题`)
    importModalVisible.value = false
    
    // 刷新试题列表
    if (questionManagementRef.value) {
      questionManagementRef.value.refreshList()
    }
  } catch (error) {
    message.error('试题导入失败')
  }
}

// 提供共享数据
provide('bankStats', bankStats)
</script>

<style scoped>
.question-bank-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>