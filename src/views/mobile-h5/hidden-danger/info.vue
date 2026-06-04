<template>
  <div class="info-container flex flex-col w-full h-full box-border overflow-auto">
    <Header :title="hiddenDangerInfo.orderName" />
    <main class="main-content w-full flex-1 overflow-y-auto">
      <InfoCard title="工单基础信息">
        <InfoItem label="工单名称：">{{ hiddenDangerInfo.orderName }}</InfoItem>
        <InfoItem label="工单状态：">
          <StatusBadge :status="hiddenDangerInfo.status" />
        </InfoItem>
        <InfoItem
          v-if="hiddenDangerInfo.status === 'rectification_rejected' || hiddenDangerInfo.status === 'hazard_rejected'"
          label="驳回原因：">{{ hiddenDangerInfo.rejectReason }}</InfoItem>
        <InfoItem
          v-if="(hiddenDangerInfo.status === 'rectification_rejected' || hiddenDangerInfo.status === 'hazard_rejected') && hiddenDangerInfo.hazardList?.some(h => h.referenceContent)"
          label="参考提示：" value-class="!text-[#1890ff]">可参照每条隐患的参考内容</InfoItem>
        <InfoItem label="整改期限：" value-class="!text-[#fa8c16]">{{ hiddenDangerInfo.deadline || '--'}}</InfoItem>
        <InfoItem label="填报时间：">{{ hiddenDangerInfo.registerTime }}</InfoItem>
        <InfoItem label="填报人：">{{ hiddenDangerInfo.registerPerson }}</InfoItem>
        <InfoItem label="填写方式：">{{ hiddenDangerInfo?.fillType === 'ai' ? 'AI填写' : '人工填写' }}</InfoItem>
        <InfoItem label="整改人：">{{ hiddenDangerInfo.rectifyPerson || '--'}}</InfoItem>
        <InfoItem label="审核人：" v-if="hiddenDangerInfo.status === 'completed'">{{ hiddenDangerInfo.auditPerson }}
        </InfoItem>
        
      </InfoCard>

      <InfoCard
        v-if="hiddenDangerInfo.status === 'pending_rectification' || hiddenDangerInfo.status === 'rectification_rejected'"
        title="填写整改方式">
        <FillModeSelector v-model="fillType" />

        <!-- 人工填写提示 -->
        <div v-if="fillType === 'manual'" class="text-center text-sm text-gray-500">
          <div class="flex items-center justify-center mb-2">
            请在下方隐患信息中手动填写整改说明并上传整改图片
          </div>
          <div class="text-xs text-gray-400">每个隐患单独填写整改说明和上传整改图片</div>
        </div>

        <!-- AI填写内容 -->
        <div v-else-if="fillType === 'ai'" class="flex flex-col gap-2">


          <div class="info-item flex flex-col justify-center">
            <FileUploadWithSource v-model="rectifyImages" upload-type="image" :max-count="20" upload-text="上传整改图片"
              drawer-title="上传整改图片" description="整改图片" :auto-upload="false" :disabled="isAnalyzing"
              @preview="handlePreview" @change="handleRectifyImageChange" />
            <Button type="primary" class="mt-4" @click="handleAiDescription" v-if="!isAnalyzing">
              <span>AI一键填写</span>
            </Button>
            <Button danger class="mt-4" @click="handleCancelAIAnalyze" v-else>
              <span>取消AI填写</span>
            </Button>
          </div>
          <div class="text-center text-sm text-gray-500">
            <div class="flex items-center justify-center mb-2">
              AI将智能识别隐患图片并自动生成整改说明
            </div>
            <div class="text-xs text-gray-400">请上传整改图片后点击AI一键填写</div>
          </div>
        </div>
      </InfoCard>

      <HazardInfoCard v-for="(hazard, index) in hiddenDangerInfo.hazardList" :key="index" :hazard="hazard"
        :disabled="isAnalyzing" :index="index" :total-count="hiddenDangerInfo.hazardList.length"
        :status="hiddenDangerInfo.status" @preview="handlePreview" />

      <InfoCard v-if="orderAttachments.length > 0" title="工单附件">
        <div class="attachments-section">
          <AttachmentItem v-for="(item, index) in orderAttachments" :key="'order-' + index" :file="item"
            @click="handlePreview(item)" />
        </div>
      </InfoCard>
    </main>

    <PreviewModal :visible="previewVisible" :file="currentPreviewFile" @close="closePreview" />

    <AiAnalyzeModal :visible="aiAnalyzeModalVisible" :is-analyzing="isAnalyzing"
      :hazard-list="hiddenDangerInfo.hazardList" :current-index="currentAnalyzeIndex" :compare-list="compareList"
      :is-failed="analysisFailed" @cancel="handleAiAnalyzeCancel" @confirm="handleAiAnalyzeConfirm" />

    <RejectModal :visible="rejectModalVisible" @close="handleRejectCancel" @confirm="handleRejectConfirm" />

    <!-- 填写整改信息弹窗 -->
    <Modal v-model:open="showRectifyPersonModal" title="填写整改信息" :close-on-click-modal="false" :closable="false"
      width="90%" :maskClosable="false" ok-text="确定" @ok="handleSelectRectifyPerson">
      <div class="rectify-form">
        <div class="form-item">
          <label class="form-label">整改人 <span class="required">*</span></label>
          <div class="user-list">
            <div v-for="user in rectifyUserList" :key="user.id" class="user-item"
              :class="{ selected: selectedRectifyUser?.id === user.id }" @click="clickRectifyUser(user)">
              <div class="user-info">
                <div class="user-avatar">{{ user.name?.charAt(0) || 'U' }}</div>
                <div>
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-role">{{ user.role || '整改人员' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-item">
          <label class="form-label">整改期限 <span class="required">*</span></label>
          <DatePicker
            v-model:value="rectifyForm.deadline"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="w-full"
            placeholder="请选择整改期限"
          />
        </div>
      </div>
    </Modal>

    <!-- 隐患AI复核弹窗 -->
    <AiReviewModal v-model:visible="aiReviewModalVisible" :detail-data="hiddenDangerInfo" :is-reviewing="isReviewing"
      :review-results="reviewResults" @approve="handleApprove" @reject="handleReject" />

    <!-- 延期Modal -->
    <Modal
      v-model:open="delayModalVisible"
      :title="currentAction === 'delay_rectify' ? '延期整改' : '审核延期'"
      width="90%"
      @cancel="handleDelayCancel"
    >
      <div class="py-4">
        <!-- 工单基础信息 -->
        <div class="mb-4">
          <h3 class="text-base font-medium mb-4 text-gray-700">工单基础信息</h3>
          <div class="flex flex-col gap-2">
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 min-w-[80px]">工单名称:</span>
              <span class="text-sm text-gray-700">{{ hiddenDangerInfo.orderName || "--" }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 min-w-[80px]">登记人:</span>
              <span class="text-sm text-gray-700">{{ hiddenDangerInfo.registerPerson || "--" }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 min-w-[80px]">整改人:</span>
              <span class="text-sm text-gray-700">{{ hiddenDangerInfo.rectifyPerson || "--" }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 min-w-[80px]">当前状态:</span>
              <StatusBadge :status="hiddenDangerInfo.status" />
            </div>
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-500 min-w-[80px]">整改期限:</span>
              <span class="text-sm text-gray-700">{{ hiddenDangerInfo.deadline || "--" }}</span>
            </div>
          </div>
          <div class="flex items-center w-full mt-2" v-if="hiddenDangerInfo.status === 'defer_auditing'">
            <span class="text-sm font-medium text-orange-400 min-w-[80px]">延期原因:</span>
            <span class="text-sm text-gray-700">{{ hiddenDangerInfo.delayReason || "--" }}</span>
          </div>
          <div class="flex items-center w-full mt-2" v-if="hiddenDangerInfo.status === 'defer_rejected'">
            <span class="text-sm font-medium text-orange-400 min-w-[80px]">驳回原因:</span>
            <span class="text-sm text-gray-700">{{ hiddenDangerInfo.rejectReason || "--" }}</span>
          </div>
        </div>

        <!-- 延期整改表单 -->
        <div v-if="currentAction === 'delay_rectify'" class="mb-6">
          <h3 class="text-base font-medium mb-4 text-gray-700">延期信息</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-500 mb-2">延期原因</label>
            <textarea
              v-model="delayReason"
              placeholder="请输入延期原因"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :rows="4"
              :maxlength="200"
              showCount
              :autoSize="{ minRows: 4, maxRows: 6 }"
            />
            <div class="text-right text-xs text-gray-400 mt-1">{{ delayReason.length }}/200</div>
          </div>
        </div>

        <!-- 审核延期表单 -->
        <div v-else-if="currentAction === 'delay_confirmation'" class="mb-6">
          <h3 class="text-base font-medium mb-4 text-gray-700">审核信息</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">审核结果</label>
            <Radio.Group v-model:value="delayAuditResult" class="flex space-x-6">
              <Radio value="approve">通过</Radio>
              <Radio value="reject">拒绝</Radio>
            </Radio.Group>
          </div>
          <div v-if="delayAuditResult === 'reject'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">驳回原因</label>
            <Textarea
              v-model="delayRejectReason"
              placeholder="请输入驳回原因"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :autoSize="{ minRows: 4, maxRows: 6 }"
              :maxlength="200"
              showCount
            />
          </div>
          <div class="mb-4" v-else>
            <label class="block text-sm font-medium text-gray-700 mb-2">新整改期限</label>
            <DatePicker
              v-model:value="newDeadline"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              class="w-full"
              placeholder="请选择新的整改期限"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <Button @click="handleDelayCancel">取消</Button>
        <Button 
          type="primary" 
          @click="handleDelaySubmit"
        >
          {{ currentAction === 'delay_rectify' ? '提交延期申请' : '提交' }}
        </Button>
      </template>
    </Modal>

    <div class="footer-buttons w-full flex justify-end gap-4 p-4 bg-[#fff]">
      <!-- 待整改状态 -->
      <div class="flex gap-[10px]"
        v-if="hiddenDangerInfo.status === 'pending_rectification' || hiddenDangerInfo.status === 'rectification_rejected'">
        <Button type="primary" size="medium" @click="handleRectifySubmit">提交整改</Button>
      </div>

      <!-- 审核状态（隐患审核/整改审核） -->
      <div class="flex gap-[10px]"
        v-else-if="hiddenDangerInfo.status === 'rectification_auditing' || hiddenDangerInfo.status === 'hazard_auditing'">
        <!-- 只有整改审核时才显示整改AI分析按钮 -->
        <Button type="primary" size="medium" @click="handleAiAnalyze" class="ai-linear-btn"
          v-if="hiddenDangerInfo.status === 'rectification_auditing'">
          整改AI分析
        </Button>
        <Button type="primary" class="ai-linear-btn" @click="handleRectifyAudit" v-else-if="hiddenDangerInfo.status === 'hazard_auditing'
          && hiddenDangerInfo?.fillType !== 'ai'">隐患AI复核</Button>
        <Button type="primary" size="medium" @click="handleApprove">通过</Button>
        <Button danger size="medium" @click="handleReject">拒绝</Button>
      </div>

      <!-- 归档状态 -->
      <div class="flex gap-[10px]" v-else-if="hiddenDangerInfo.status === 'pending_archiving'">
        <Button type="primary" size="medium" @click="handleArchive">归档</Button>
      </div>

      <!-- 隐患被拒 -->
      <div class="flex gap-[10px]" v-else-if="hiddenDangerInfo.status === 'hazard_rejected'">
        <Button type="primary" size="medium" @click="handleReSubmit">重新提交</Button>
      </div>

      <!-- 延期整改状态 -->
      <div class="flex gap-[10px]" v-else-if="hiddenDangerInfo.status === 'expired' || hiddenDangerInfo.status === 'defer_rejected'">
        <Button type="primary" size="medium" @click="openDelayModal('delay_rectify')">延期整改</Button>
      </div>

      <!-- 审核延期状态 -->
      <div class="flex gap-[10px]" v-else-if="hiddenDangerInfo.status === 'defer_auditing'">
        <Button type="primary" size="medium" @click="openDelayModal('delay_confirmation')">审核延期</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Button, message, Modal, Radio, DatePicker,Textarea } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { compareRectify, fillRectify, getHazardList, updateHazard, hazardAudit } from '@/api/hazard'

import Header from '../components/header.vue'
import FileUploadWithSource from '../components/FileUploadWithSource.vue'
import InfoCard from './components/InfoCard.vue'
import InfoItem from './components/InfoItem.vue'
import HazardInfoCard from './components/HazardInfoCard.vue'
import AttachmentItem from './components/AttachmentItem.vue'
import PreviewModal from './components/PreviewModal.vue'
import AiAnalyzeModal from './components/AiAnalyzeModal.vue'
import AiReviewModal from './components/AiReviewModal.vue'
import RejectModal from './components/RejectModal.vue'
import StatusBadge from './components/StatusBadge.vue'
import FillModeSelector from '../components/FillModeSelector.vue'
import { useMainStore } from '@/store'
const mainStore = useMainStore()
const userInfo = computed(() => mainStore.userInfo)
const route = useRoute()
const router = useRouter()

const hiddenDangerInfo = ref({})
const rectifyImages = ref([])
const uploadedRectifyFiles = ref([])
const previewVisible = ref(false)
const currentPreviewFile = ref(null)
const isAnalyzing = ref(false)
const aiAnalyzeController = ref(null)
const compareList = ref([])
const aiAnalyzeModalVisible = ref(false)
const currentAnalyzeIndex = ref(0)
const fillType = ref('manual')
const isLoadingDetail = ref(false)
const currentOrderId = ref('')

// ==================== 隐患AI复核相关状态 ====================
const aiReviewModalVisible = ref(false)
const isReviewing = ref(false)
const reviewResults = ref([])
const aiReviewController = ref(null)

// ==================== 延期相关状态 ====================
const delayModalVisible = ref(false)
const delayReason = ref('')
const newDeadline = ref('')
const delayAuditResult = ref('')
const delayRejectReason = ref('')
const currentAction = ref('')

const handlePreview = (file) => {
  if (!file.type) {
    if (file.url.includes('.jpg') || file.url.includes('.png')) {
      file.type = 'image'
    }
  }
  currentPreviewFile.value = file
  previewVisible.value = true
}

const closePreview = () => {
  previewVisible.value = false
  currentPreviewFile.value = null
}

const orderAttachments = computed(() => {
  const attachments = []
  if (hiddenDangerInfo.value.images && hiddenDangerInfo.value.images.length > 0) {
    hiddenDangerInfo.value.images.forEach(img => {
      attachments.push({
        name: img.name,
        url: img.url,
        type: 'image',
        size: formatFileSize(img.size)
      })
    })
  }
  if (hiddenDangerInfo.value.videos && hiddenDangerInfo.value.videos.length > 0) {
    hiddenDangerInfo.value.videos.forEach(video => {
      attachments.push({
        name: video.name || '视频文件',
        url: video.url,
        type: 'video',
        size: formatFileSize(video.size)
      })
    })
  }
  return attachments
})

const formatFileSize = (bytes) => {
  if (!bytes) return '0KB'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + sizes[i]
}

const handleRectifyImageChange = (info) => {
  const file = info.file
  if (file.status === 'done') {
    uploadedRectifyFiles.value.push(file)
  }
}

const handleAiDescription = async () => {
  if (!rectifyImages.value || rectifyImages.value.length === 0) {
    message.error('请上传整改图片')
    return
  }
  Modal.confirm({
    title: '确认使用AI分析',
    content: '使用AI分析将覆盖当前已填写的整改图片和整改说明，是否继续？',
    onOk: () => {
      aiRequest()
    }
  })
}

const aiRequest = async () => {
  isAnalyzing.value = true
  aiAnalyzeController.value = new AbortController();
  try {
    const result = await fillRectify({
      files: rectifyImages.value,
      hazards: hiddenDangerInfo.value.hazardList.map((item, index) => {
        return {
          id: `yh_${index}`,
          hazardDesc: item.hazardDesc,
          hazardName: item.hazardName,
          hazardUrl: item.images[0].url,
        }
      }),
    }, aiAnalyzeController.value.signal)
    if (result.data) {
      result.data.forEach(item => {
        const index = item.id.split('_')[1]
        hiddenDangerInfo.value.hazardList[index].rectifyImages = item.urls.map(item => {
          const name = item.split('/').pop()
          const type = name.split('.').pop()
          return {
            url: item,
            name: name,
            type: type === 'jpg' ? 'image/jpeg' : type === 'png' ? 'image/png' : type === 'mp4' ? 'video/mp4' : 'image',
            status: 'done'
          }
        })
        hiddenDangerInfo.value.hazardList[index].rectifyDesc = item.content
      })
      message.success('整改AI分析完成，请确认整改说明和图片')
    }
  }
  finally {
    isAnalyzing.value = false
    aiAnalyzeController.value = null
  }
}

const handleCancelAIAnalyze = () => {
  if (aiAnalyzeController.value) {
    aiAnalyzeController.value.abort()
    aiAnalyzeController.value = null
    isAnalyzing.value = false
  }
}

// ==================== 统一封装更新函数 ====================
/** @typedef {Object} UpdateHazardDataOptions
 * @property {any} data - 要更新的数据
 * @property {string} [successMessage] - 成功消息
 * @property {string} [errorMessage] - 错误消息
 * @property {string} [status] - 要设置的状态
 * @property {Record<string, any>} [additionalFields] - 额外的字段
 */

/**
 * 统一封装更新函数
 * @param {UpdateHazardDataOptions} options - 配置选项
 * @returns {Promise<boolean>} 是否更新成功
 */
const updateHazardData = async (options) => {
  const {
    data,
    successMessage = "更新成功",
    errorMessage = "更新失败，请重试！",
    status,
    additionalFields = {}
  } = options;

  try {
    // 如果提供了状态，更新状态
    if (status) {
      data.status = status;
    }

    // 合并额外字段
    const updateData = { ...data, ...additionalFields };

    const result = await updateHazard(updateData);
    if (result.code === 200) {
      message.success(successMessage);
      fillType.value = 'manual';
      setTimeout(() => {
        router.go(-1);
      }, 500);
      return true;
    } else {
      message.error(errorMessage);
      return false;
    }
  } catch (error) {
    console.error(errorMessage, error);
    message.error(errorMessage);
    return false;
  }
};

// ==================== 业务流程函数 ====================
const formatFileList = (files) => {
  if (!files || files.length === 0) return [];
  return files.map(file => ({
    url: file.response?.url || file.url,
    name: file.response?.name || file.name,
    type: file.type
  }));
};

const handleRectifySubmit = async () => {
  if (!hiddenDangerInfo.value.hazardList || hiddenDangerInfo.value.hazardList.length === 0) {
    message.error('没有需要整改的隐患信息')
    return
  }

  for (let i = 0; i < hiddenDangerInfo.value.hazardList.length; i++) {
    const hazard = hiddenDangerInfo.value.hazardList[i]
    if (!hazard.rectifyDesc || hazard.rectifyDesc.trim() === '') {
      message.error(`隐患信息 ${hiddenDangerInfo.value.hazardList.length > 1 ? `(${i + 1})` : ''}的整改说明为必填项`)
      return
    }
    if (!hazard.rectifyImages || hazard.rectifyImages.length === 0) {
      message.error(`隐患信息 ${hiddenDangerInfo.value.hazardList.length > 1 ? `(${i + 1})` : ''}的整改图片为必填项`)
      return
    }
  }

  const formattedData = {
    ...hiddenDangerInfo.value,
    hazardList: hiddenDangerInfo.value.hazardList.map(hazard => ({
      ...hazard,
      images: formatFileList(hazard.images),
      videos: formatFileList(hazard.videos),
      rectifyImages: formatFileList(hazard.rectifyImages)
    }))
  };

  await updateHazardData({
    data: formattedData,
    status: "rectification_auditing",
    successMessage: "整改提交成功",
    errorMessage: "整改提交失败，请重试！"
  });
}

const handleArchive = async () => {
  await updateHazardData({
    data: hiddenDangerInfo.value,
    status: "completed",
    additionalFields: {
      auditPerson: userInfo.value?.name,
      auditPersonId: userInfo.value?.id
    },
    successMessage: "归档成功",
    errorMessage: "归档失败，请重试！"
  });
}
// 重新提交
const handleReSubmit = () => {
  router.push({
    path: `/mobile/hidden-danger/create`,
    query: {
      id: hiddenDangerInfo.value.id
    }
  });
}

// ==================== 隐患AI复核相关方法 ====================
const handleRectifyAudit = async () => {
  if (!hiddenDangerInfo.value.hazardList || hiddenDangerInfo.value.hazardList.length === 0) {
    message.error('没有隐患信息可复核')
    return
  }

  // 初始化状态
  aiReviewModalVisible.value = true
  isReviewing.value = true
  reviewResults.value = []
  aiReviewController.value = new AbortController()

  try {
    // 构造隐患复核参数
    const auditParams = hiddenDangerInfo.value.hazardList.map((hazard) => {
      const imageUrls = []

      // 收集图片URL
      if (hazard.images && hazard.images.length > 0) {
        hazard.images.forEach((image) => {
          if (image.url) {
            imageUrls.push(image.url)
          }
        })
      }

      // 收集视频URL
      if (hazard.videos && hazard.videos.length > 0) {
        hazard.videos.forEach((video) => {
          if (video.url) {
            imageUrls.push(video.url)
          }
        })
      }

      return {
        imageUrls,
        hazardDesc: hazard.hazardDesc || ''
      }
    })

    // 调用隐患复核接口
    const response = await hazardAudit({ auditItems: auditParams }, aiReviewController.value.signal)

    // 处理返回结果
    if (response?.data) {
      // 为每个隐患项设置结果
      reviewResults.value = []
      hiddenDangerInfo.value.hazardList.forEach((hazard, index) => {
        // 如果有新隐患，则设置参考内容为新隐患信息，否则为空字符串
        if (response.data[index]?.hasNewHazards) {
          hazard.referenceContent = response.data[index]
        } else {
          hazard.referenceContent = ''
        }

        reviewResults.value.push({
          data: response.data[index] || {},
          error: null
        })
      })
    } else {
      reviewResults.value = []
      hiddenDangerInfo.value.hazardList.forEach((hazard, index) => {
        hazard.referenceContent = ''
        reviewResults.value.push({
          data: {},
          error: '识别失败'
        })
      })
    }
  } catch (error) {
    // 请求被终止时不显示错误
    if (error?.name === 'AbortError' || error?.name === 'CanceledError') {
      return
    }
    console.error('AI复核流程失败:', error)
    message.error('AI复核流程失败，请重试')
    // 为所有隐患项设置错误状态
    reviewResults.value = []
    hiddenDangerInfo.value.hazardList.forEach((hazard, index) => {
      hazard.referenceContent = ''
      reviewResults.value.push({
        data: {},
        error: '识别失败'
      })
    })
  } finally {
    isReviewing.value = false
    aiReviewController.value = null
  }
}


// ==================== 延期操作相关方法 ====================
const openDelayModal = (action) => {
  currentAction.value = action
  delayReason.value = ''
  newDeadline.value = ''
  delayAuditResult.value = ''
  delayRejectReason.value = ''
  delayModalVisible.value = true
}

const handleDelayCancel = () => {
  delayModalVisible.value = false
  delayReason.value = ''
  newDeadline.value = ''
  delayAuditResult.value = ''
  delayRejectReason.value = ''
  currentAction.value = ''
}

const handleDelaySubmit = async () => {
  if (currentAction.value === 'delay_rectify') {
    // 验证延期整改表单
    if (!delayReason.value || delayReason.value.trim() === '') {
      message.error('请输入延期原因')
      return
    }

    // 提交延期申请
    await updateHazardData({
      data: hiddenDangerInfo.value,
      status: 'defer_auditing',
      additionalFields: {
        delayReason: delayReason.value
      },
      successMessage: '延期申请提交成功，等待审核',
      errorMessage: '延期申请提交失败，请重试！'
    })
  } else if (currentAction.value === 'delay_confirmation') {
    // 验证审核延期表单
    if (!delayAuditResult.value) {
      message.error('请选择审核结果')
      return
    }
    if (delayAuditResult.value === 'reject' && (!delayRejectReason.value || delayRejectReason.value.trim() === '')) {
      message.error('请输入驳回原因')
      return
    }
    if (delayAuditResult.value === 'approve' && !newDeadline.value) {
      message.error('请选择新的整改期限')
      return
    }

    // 提交延期审核
    const status = delayAuditResult.value === 'approve' ? 'pending_rectification' : 'defer_rejected'
    await updateHazardData({
      data: hiddenDangerInfo.value,
      status: status,
      additionalFields: {
        auditPerson: userInfo.value?.name,
        auditPersonId: userInfo.value?.id,
        rejectReason: delayAuditResult.value === 'reject' ? delayRejectReason.value : undefined,
        deadline: delayAuditResult.value === 'approve' ? newDeadline.value : undefined
      },
      successMessage: delayAuditResult.value === 'approve' ? '延期审核通过' : '延期审核拒绝',
      errorMessage: '延期审核失败，请重试！'
    })
  }

  handleDelayCancel()
}

const rejectModalVisible = ref(false)
const handleReject = async () => {
  rejectModalVisible.value = true
}

const handleRejectConfirm = async (reason) => {
  if (!reason || reason.trim() === '') {
    message.error('请输入拒绝原因')
    return
  }

  // 根据当前状态设置不同的驳回状态
  let rejectedStatus = ''
  if (hiddenDangerInfo.value.status === 'hazard_auditing') {
    rejectedStatus = 'hazard_rejected'
  } else if (hiddenDangerInfo.value.status === 'rectification_auditing') {
    rejectedStatus = 'rectification_rejected'
  }

  const success = await updateHazardData({
    data: hiddenDangerInfo.value,
    status: rejectedStatus,
    additionalFields: {
      rejectReason: reason,
      auditPerson: userInfo.value?.name,
      auditPersonId: userInfo.value?.id
    },
    successMessage: "拒绝成功",
    errorMessage: "拒绝失败，请重试！"
  });

  if (success) {
    rejectModalVisible.value = false;
    aiReviewModalVisible.value = false
  }
}

const handleRejectCancel = () => {
  rejectModalVisible.value = false
}

const handleApprove = async () => {
  if (hiddenDangerInfo.value.status === "hazard_auditing") {
    // 隐患审核通过，弹出选择整改人弹窗
    showRectifyPersonModal.value = true;
  }
  else if (hiddenDangerInfo.value.status === "rectification_auditing") {
    // 整改审核通过，更新为待归档
    await updateHazardData({
      data: hiddenDangerInfo.value,
      status: "pending_archiving",
      additionalFields: {
        auditPerson: userInfo.value?.name,
        auditPersonId: userInfo.value?.id
      },
      successMessage: "整改审核通过",
      errorMessage: "整改审核失败"
    });
  }
  aiReviewModalVisible.value = false
}

// 填写整改信息相关
const showRectifyPersonModal = ref(false);
const selectedRectifyUser = ref(null);
const rectifyForm = ref({
  deadline: ''
});
const rectifyUserList = computed(() => mainStore.userList);

const clickRectifyUser = (user) => {
  selectedRectifyUser.value = user;
}

const handleSelectRectifyPerson = async () => {
  if (!selectedRectifyUser.value) {
    message.error('请选择整改人！');
    return;
  }
  if (!rectifyForm.value.deadline) {
    message.error('请选择整改期限！');
    return;
  }

  const success = await updateHazardData({
    data: hiddenDangerInfo.value,
    status: "pending_rectification",
    additionalFields: {
      rectifyPerson: selectedRectifyUser.value?.name,
      rectifyPersonId: selectedRectifyUser.value?.id,
      deadline: rectifyForm.value.deadline,
      auditPerson: userInfo.value?.name,
      auditPersonId: userInfo.value?.id
    },
    successMessage: "隐患审核通过",
    errorMessage: "隐患审核失败"
  });

  if (success) {
    showRectifyPersonModal.value = false;
    // 重置表单
    selectedRectifyUser.value = null;
    rectifyForm.value = {
      deadline: ''
    };
  }
}


const requestCompareRectify = async (hazardInfo) => {
  console.log(hazardInfo)
  const hazard = { ...hazardInfo }
  const fileList = hazard.rectifyImages
  hazard.hazardUrl = hazard.images?.length > 0 ? hazard.images[0].url : []
  delete hazard.rectifyImages
  delete hazard.images
  delete hazard.videos
  delete hazard.rectifyDesc
  delete hazard.area
  delete hazard.expand

  hazard.fileName = `隐患${(currentAnalyzeIndex.value + 1)}`
  return compareRectify({
    files: fileList,
    recognizedHazards: JSON.stringify([hazard])
  })
}

const analysisFailed = ref(false)
const handleAiAnalyze = async () => {
  compareList.value = []
  currentAnalyzeIndex.value = 0
  aiAnalyzeModalVisible.value = true
  isAnalyzing.value = true
  analysisFailed.value = false
  for (let i = 0; i < hiddenDangerInfo.value.hazardList.length; i++) {
    currentAnalyzeIndex.value = i
    const hazard = hiddenDangerInfo.value.hazardList[i]
    try {
      const result = await requestCompareRectify(hazard)
      if (result.data) {
        // 构建比较项对象
        const compareItem = {
          fileName: hazard.hazardName || `隐患${i + 1}`,
          hazardName: hazard.hazardName,
          hazardDesc: hazard.hazardDesc,
          images: hazard.images,
          rectifyImages: hazard.rectifyImages,
          rectifyDesc: hazard.rectifyDesc,
          rectified: result.data.rectified || false,
          rectificationContent: result.data.rectificationContent || '',
          annotatedHazardImages: result.data.annotatedHazardImages || []
        }
        compareList.value.push(compareItem)
      }
    } catch (error) {
      // 请求被终止时不显示错误
      if (error?.name === 'AbortError' || error?.name === 'CanceledError') {
        return
      }
      console.error('AI分析失败:', error)
      message.error(`AI分析失败，请重试！`)
      isAnalyzing.value = false
      analysisFailed.value = true
      return
    }
  }

  isAnalyzing.value = false
  currentAnalyzeIndex.value = hiddenDangerInfo.value.hazardList.length
}

const handleAiAnalyzeCancel = () => {
  if (isAnalyzing.value) {
    // 终止进行中的AI分析请求
    if (aiAnalyzeController.value) {
      aiAnalyzeController.value.abort()
      aiAnalyzeController.value = null
    }
    isAnalyzing.value = false
  }
  aiAnalyzeModalVisible.value = false
  compareList.value = []
}

const handleAiAnalyzeConfirm = () => {
  aiAnalyzeModalVisible.value = false
  compareList.value = []
}
const infodetail = (order_id) => {
  if (!order_id) {
    console.warn('infodetail: order_id 为空，跳过调用')
    return
  }
  // 防止重复调用：检查是否正在加载当前ID
  if (isLoadingDetail.value && currentOrderId.value === order_id) {
    console.warn('infodetail: 正在加载中，跳过重复调用')
    return
  }

  isLoadingDetail.value = true
  currentOrderId.value = order_id

  getHazardList({ order_id }).then(res => {
    if (res.data) {
      hiddenDangerInfo.value = res.data
    }
  }).finally(() => {
    isLoadingDetail.value = false
  })
}

onMounted(() => {
  const id = route.params.id
  infodetail(id)
  fillType.value = 'manual'
})

// 监听AI复核弹窗关闭，终止进行中的请求并清空结果
watch(aiReviewModalVisible, (newVal) => {
  if (!newVal) {
    if (aiReviewController.value) {
      aiReviewController.value.abort()
      aiReviewController.value = null
    }
    // 清空识别结果，避免影响下次识别
    reviewResults.value = []
  }
})

onBeforeUnmount(() => {
  // 清理状态，防止内存泄漏
  isLoadingDetail.value = false
  currentOrderId.value = ''
  if (aiAnalyzeController.value) {
    aiAnalyzeController.value.abort()
  }
  if (aiReviewController.value) {
    aiReviewController.value.abort()
  }
})
</script>

<style lang="scss" scoped>
.info-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.main-content {
  padding: 16px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.attachments-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-buttons {
  position: sticky;
  bottom: 0;
  z-index: 100;
}

.ai-linear-btn {
  background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
  color: #fff;
  border: none;
}



/* 填写整改信息弹窗样式 */
.rectify-form {
  padding: 8px 0;

  .form-item {
    margin-bottom: 20px;

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;

      .required {
        color: #ff4d4f;
        margin-left: 4px;
      }
    }

    .form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.3s;
      outline: none;
      box-sizing: border-box;

      &:focus {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
      }

      &::placeholder {
        color: #bfbfbf;
      }
    }

    .form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.3s;
      outline: none;
      box-sizing: border-box;
      resize: vertical;

      &:focus {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
      }

      &::placeholder {
        color: #bfbfbf;
      }
    }
  }
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px 0;
  box-sizing: border-box;

  .user-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: #f8f9fa;
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background: #e6f7ff;
      border-color: #1890ff;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
    }

    &.selected {
      background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
      border-color: #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);

      &::after {
        content: '✓';
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        background: #1890ff;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .user-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;

      .user-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
        font-weight: 600;
        flex-shrink: 0;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }

      .user-name {
        font-size: 15px;
        font-weight: 600;
        color: #333;
        flex: 1;
      }

      .user-role {
        font-size: 12px;
        color: #999;
        margin-top: 2px;
      }
    }
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;

    &:hover {
      background: #a8a8a8;
    }
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 12px;
  }
}
</style>
