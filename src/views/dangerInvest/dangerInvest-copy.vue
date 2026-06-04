<template>
  <div class="create-order-pc relative p-[16px] flex flex-col h-full box-border overflow-hidden w-full"
    style="font-family: Source Han Sans CN;">
    <div class="w-full flex-1 flex box-border pb-[10px] min-h-0">
      <!-- 左侧表单区域 -->
      <div style="flex:0.5"
        class="bg-[#fff] rounded-[12px] list-card upload-card box-border p-[26px] relative h-full flex flex-col min-h-0">
        <div class="flex-shrink-0 mb-[15px]">
          <div class="font-[500] text-[18px] text-[#576075] leading-none">
            {{ props.initialData ? '重新填写隐患工单' : '创建隐患工单' }}
          </div>
          <div class="font-[400] text-[12px] leading-1 text-[#717B92] mt-[14px] leading-none">
            <span class="cursor-pointer text-[#4362EF] mr-[10px]" @click="showRejectReasonModal">查看驳回原因</span>
            {{ props.initialData ? '请修改后重新提交' : '支持人工填写和AI智能识别两种方式' }}
          </div>
        </div>

        <div class="mb-[10px] relative" style="z-index: 100;">
          <FillModeSelector v-model="fillMode" @update:model-value="switchMode" />
        </div>

        <div v-if="fillMode === 'ai' && !aiAnalysisCompleted" class="ai-upload-section flex-shrink-0">
          <StepIndicator :current-step="currentStep" />

          <Upload.Dragger :show-upload-list="false" :before-upload="beforeAIUpload"
            :custom-request="handleAIFileUploadWrapper" accept=".jpg,.jpeg,.png,.bmp,.mp4,.avi" :multiple="true"
            class="ai-upload-dragger">
            <div class="upload-content">
              <div class="upload-icon">
                <UploadOutlined />
              </div>
              <div class="upload-title">点击或拖拽上传文件</div>
              <div class="upload-desc">支持 JPG、PNG、BMP 图片和 MP4、AVI 视频</div>
            </div>
          </Upload.Dragger>
          <div class="ai-tips">
            <div class="tip-item">
              <span>图片：最多5张，单张≤10MB（JPG/PNG/BMP）</span>
            </div>
            <div class="tip-item">
              <span>视频：最多1个，≤50MB（MP4/AVI）</span>
            </div>
          </div>
        </div>

        <div class="flex-1 min-h-0 overflow-y-auto">
          <Form v-if="fillMode === 'manual' || aiAnalysisCompleted" :model="formState" layout="vertical" ref="formRef">
            <div class="hazard-list">
              <div v-for="(hazard, index) in formState.hazardList" :key="index" class="hazard-item">
                <div class="hazard-header">
                  <div class="hazard-title">隐患 {{ index + 1 }}</div>
                  <div class="hazard-actions flex items-center">
                    <span class="cursor-pointer text-[#1890ff]" v-if="hazard?.referenceContent"
                      @click="openReferenceContent(hazard)">
                      <EyeOutlined />
                      参考内容
                    </span>
                    <Button type="text" size="middle" @click="toggleHazard(index)" class="toggle-btn">
                      <span>
                        <DownOutlined v-if="!hazard.expanded" />
                        <UpOutlined v-else />
                        {{ hazard.expanded ? '收起' : '展开' }}

                      </span>
                    </Button>
                    <Button v-if="formState.hazardList.length > 1" type="text" danger size="middle"
                      @click="removeHazard(index)">
                      删除
                    </Button>
                  </div>
                </div>
                <div v-show="hazard.expanded !== false" class="hazard-content">
                  <Form :model="hazard" layout="vertical">

                    <FormItem label="隐患图片">
                      <Upload v-model:file-list="(hazard.images as any)" list-type="picture-card" :max-count="5"
                        :before-upload="beforeImageUpload" :custom-request="handleImageUpload" 
                        accept=".jpg,.jpeg,.png,.bmp"
                        :show-upload-list="true" @preview="(file: any) => handlePreview(file)">
                        <div v-if="hazard.images.length < 5">
                          <PlusOutlined />
                          <div style="margin-top: 8px">上传图片</div>
                        </div>
                      </Upload>
                    </FormItem>

                    <FormItem label="隐患视频">
                      <Upload v-model:file-list="(hazard.videos as any)" list-type="text" :max-count="1"
                        :before-upload="beforeVideoUpload" :custom-request="handleVideoUpload" accept=".mp4,.avi"
                        :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: true }"
                        @preview="(file: any) => handleVideoPreview(file)">
                        <Button v-if="hazard.videos.length < 1">
                          <span>
                            <PlusOutlined />
                            上传视频
                          </span>
                        </Button>
                      </Upload>
                    </FormItem>

                    <div class="form-row">
                      <FormItem label="隐患名称" name="hazardName"
                        :rules="[{ required: true, message: '请输入隐患名称', trigger: 'blur' }]" class="form-item-half">
                        <Input v-model:value="hazard.hazardName" placeholder="请输入隐患名称" 
                        :maxlength="100" />
                      </FormItem>

                      <FormItem label="隐患等级" name="hazardLevel"
                        :rules="[{ required: true, message: '请选择隐患等级', trigger: 'change' }]" class="form-item-half">
                        <Select v-model:value="hazard.hazardLevel" placeholder="请选择隐患等级">
                          <SelectOption value="一般隐患">一般隐患</SelectOption>
                          <SelectOption value="重大隐患">重大隐患</SelectOption>
                        </Select>
                      </FormItem>
                    </div>

                    <FormItem label="隐患描述" name="hazardDesc"
                      :rules="[{ required: true, message: '请输入隐患描述', trigger: 'blur' }]">
                      <Textarea v-model:value="hazard.hazardDesc" placeholder="请输入隐患描述"
                        :maxlength="500" showCount
                        :autoSize="{ minRows: 3, maxRows: 5 }" />
                    </FormItem>

                    <div class="form-row">
                      <FormItem label="隐患地点" name="area"
                        :rules="[{ required: true, message: '请输入隐患地点', trigger: 'change' }]" class="form-item-half">
                        <Input v-model:value="hazard.area" :maxlength="100" placeholder="请输入隐患地点" class="location-input">
                          <template #suffix>
                            <EnvironmentOutlined class="location-icon" @click.stop="handleLocation(index)" />
                          </template>
                        </Input>
                      </FormItem>

                      <FormItem label="隐患类型" name="hazardType"
                        :rules="[{ required: true, message: '请输入隐患类型', trigger: 'blur' }]" class="form-item-half">
                        <Input v-model:value="hazard.hazardType" placeholder="请输入隐患类型" />
                      </FormItem>
                    </div>

                    <FormItem label="判断依据" name="basisRule">
                      <Textarea v-model:value="hazard.basisRule" placeholder="请输入判断依据（选填）"
                        :autoSize="{ minRows: 3, maxRows: 5 }" :maxlength="500" showCount />
                    </FormItem>

                    <FormItem label="整改建议" name="rectifySuggestion">
                      <Textarea v-model:value="hazard.rectifySuggestion" placeholder="请输入整改建议（选填）"
                        :autoSize="{ minRows: 3, maxRows: 5 }" :maxlength="500" showCount />
                    </FormItem>

                    <FormItem label="处罚标准" name="penaltyStandard">
                      <Textarea v-model:value="hazard.penaltyStandard" placeholder="请输入处罚标准（选填）" 
                      :autoSize="{ minRows: 3, maxRows: 5 }" :maxlength="500" showCount />
                    </FormItem>
                  </Form>
                </div>
              </div>
            </div>

            <div class="add-hazard-section">
              <Button @click="addHazard" class="add-hazard-btn">
                <span>
                  <PlusOutlined />
                  添加隐患
                </span>
              </Button>
            </div>

            <div class="common-fields">
              <div class="form-row">
                <FormItem label="工单名称" name="orderName"
                  :rules="[{ required: true, message: '请输入工单名称', trigger: 'blur' }]" class="form-item-half">
                  <Input v-model:value="formState.orderName" :maxlength="50" placeholder="请输入工单名称" />
                </FormItem>

                <!-- <FormItem label="整改期限" name="deadline"
                  :rules="[{ required: true, message: '请选择整改期限', trigger: 'change' }]" class="form-item-half">
                  <DatePicker v-model:value="formState.deadline" placeholder="请选择整改期限" style="width: 100%"
                    value-format="YYYY-MM-DD" />
                </FormItem> -->
              </div>

              <FormItem label="工单附件">
                <div class="attachment-list">
                  <div v-for="(file, index) in formState.images" :key="file.uid" class="attachment-item"
                    @click="handlePreview(file)">
                    <FileImageOutlined class="attachment-icon" />
                    <span class="attachment-name">{{ file.name }}</span>
                    <CloseCircleOutlined class="attachment-remove" @click.stop="removeAttachment('image', index)" />
                  </div>
                  <div v-for="(file, index) in formState.videos" :key="file.uid" class="attachment-item"
                    @click="handleVideoPreview(file)">
                    <VideoCameraOutlined class="attachment-icon" />
                    <span class="attachment-name">{{ file.name }}</span>
                    <CloseCircleOutlined class="attachment-remove" @click.stop="removeAttachment('video', index)" />
                  </div>
                  <Upload :show-upload-list="false" :before-upload="beforeUpload" :multiple="true"
                    @change="handleAttachmentUpload">
                    <div class="attachment-upload-btn">
                      <PlusOutlined />
                      <span>上传附件</span>
                    </div>
                  </Upload>
                </div>
              </FormItem>
            </div>
          </Form>
        </div>

        <div class="mt-[10px] w-full flex justify-center flex-shrink-0">
          <Button class="cancel-btn mr-[20px]" @click="handleCancel">{{ formState.id ? '取消' : '重置' }}</Button>
          <Button type="primary" class="submit-btn" @click="handleSubmit">提交</Button>
        </div>
      </div>

      <!-- 右侧预览区域 -->
      <div style="flex:0.5"
        class="text-[16px] text-[#333] h-full flex flex-col result-card ml-[30px] bg-[#fff] rounded-[12px] list-card px-[30px] box-border">
        <div class="flex-shrink-0 h-[68px] flex items-center justify-between border-b-[1px] border-[#E6E6E6]">
          <div class="flex items-end">
            <span class="leading-none font-[500] text-[18px] text-[#576075]">隐患工单预览</span>
            <span class="leading-none font-[400] text-[12px] text-[#717B92] ml-[8px]">确认信息无误后提交</span>
          </div>
          <div class="font-[400] text-[14px] text-[#717B92] leading-none">共 <span class="text-[#4362EF] font-bold">{{
            formState.hazardList.length }}</span> 条隐患</div>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto">
          <HazardPreview
            :hazard-list="formState.hazardList"
            :order-name="formState.orderName"
            :register-person="formState.registerPerson"
            :register-time="formState.registerTime"
            @preview-image="handlePreview"
            @preview-video="handleVideoPreview"
          />
        </div>
      </div>
    </div>
    <QrCodeFloat :qr-code-url="mobileHiddenCode" 
    :position="{
        top: 'auto',
        right: '20px',
        bottom: '40px',
        left: 'auto'
    }"
    :defaultExpanded="true" title="隐患随手拍H5端"></QrCodeFloat>
    <Modal v-model:open="showFileInfoModal"
      :title="isAnalyzing ? 'AI正在识别中...' : (aiAnalysisCompleted ? 'AI识别完成' : '文件信息')" :footer="null" width="80%"
      class="file-info-modal" :close-on-click-modal="false" :closable="false" :maskClosable="false" :z-index="999">
      <div class="file-info-content">
        <StepIndicator :current-step="currentStep" />
        <Spin :spinning="isAnalyzing" tip="正在识别中...">
          <div class="flex gap-[10px]">
            <div class="flex-1 flex-shrink-0">
              <div v-if="selectedFile" class="file-preview">
                <!-- <div v-if="selectedFile.type?.startsWith('image/') && isRecognizedImage(selectedFile)" 
                  class="recognized-badge">
                  隐患识别图片
                </div> -->
                <Image v-if="selectedFile.type?.startsWith('image/')" width="auto" height="100%"
                  :src="selectedFile.url" alt="预览" />
                <video v-else-if="selectedFile.type?.startsWith('video/')" :src="selectedFile.url" controls />
                <div v-else class="file-icon">📄</div>
              </div>
              <div v-if="selectedFile" class="file-details">
                <div class="detail-item">
                  <span class="label">文件名：</span>
                  <span class="value">{{ selectedFile.name }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">文件类型：</span>
                  <span class="value">{{ selectedFile.type || '未知' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">文件大小：</span>
                  <span class="value">{{ formatFileSize(selectedFile.size) }}</span>
                </div>
              </div>
              <div v-if="selectedFile?.type?.startsWith('image/') && uploadedFiles.images.length > 1"
                class="file-list">
                <div class="file-list-title">已上传图片 ({{ uploadedFiles.images.length }}/5)</div>
                <div class="file-list-items">
                  <div v-for="(img, index) in uploadedFiles.images" :key="img.fileData?.uid" class="file-list-item"
                    :class="{ active: selectedFile?.uid === img.fileData?.uid }" @click="handleFileClickWrapper(img)">
                    <img :src="img.fileData?.url" alt="缩略图" />
                    <CloseCircleOutlined class="file-list-item-remove" @click.stop="removeImageFromModal(index)" />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="aiAnalysisCompleted && aiRecognizedHazards.length > 0"
              class="ai-result-summary flex-shrink-0 flex-1 max-h-[420px]">
              <div class="result-header">
                <div class="result-title">AI识别结果</div>
                <div class="result-stats-mini">
                  <span class="stat-badge">{{aiRecognizedHazards.filter(h => h.hazardLevel).length}}个隐患</span>
                  <span v-if="aiRecognizedHazards.filter(h => h.hazardLevel === '重大隐患').length > 0"
                    class="stat-badge danger">{{aiRecognizedHazards.filter(h => h.hazardLevel === '重大隐患').length
                    }}个重大</span>
                  <span v-if="aiRecognizedHazards.filter(h => h.hazardLevel === '一般隐患').length > 0"
                    class="stat-badge warning">{{aiRecognizedHazards.filter(h => h.hazardLevel === '一般隐患').length
                    }}个一般</span>
                </div>
              </div>
              <div class="hazard-preview-list">
                <div v-for="(hazard, index) in aiRecognizedHazards" :key="index"
                  :ref="(el: any) => { if (el) hazardRefs[index] = el }" class="hazard-preview-item"
                  :class="{ 'selected': selectedHazardIndex === index }">
                  <div class="hazard-preview-header">
                    <span class="hazard-index">{{ index + 1 }}</span>
                    <span class="hazard-level-badge" v-if="hazard.hazardLevel"
                      :class="hazard.hazardLevel === '重大隐患' ? 'danger' : 'warning'">{{ hazard.hazardLevel }}</span>
                    <span class="text-[#ff4d4f] cursor-pointer text-[12px] flex-1 text-right"
                      @click="removeAiRecognizedHazard(index)">删除</span>
                  </div>
                  <div class="hazard-preview-content">
                    <div class="hazard-preview-row">
                      <span class="preview-label">图片：</span>
                      <span class="preview-value">
                        <Image :src="hazard.images[0]?.url" width="140px" />
                      </span>
                    </div>
                    <div class="hazard-preview-row">
                      <span class="preview-label">名称：</span>
                      <span class="preview-value">{{ hazard.hazardName || '未识别到隐患' }}</span>
                    </div>
                    <div class="hazard-preview-row">
                      <span class="preview-label">类型：</span>
                      <span class="preview-value">{{ hazard.hazardType || '未识别到隐患' }}</span>
                    </div>
                    <div class="hazard-preview-row">
                      <span class="preview-label">描述：</span>
                      <span class="preview-value preview-desc">{{ hazard.hazardDesc || '未识别到隐患' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 没有识别结果 -->
            <div v-else-if="aiAnalysisCompleted && !aiRecognizedHazards.length"
              class="flex-1 ai-result-summary flex-shrink-0 ">
              <img src="@/assets/empty-state.png" class="w-[280px] block mx-auto" />
              <div class="text-[16px] text-[#333] font-[500] text-center mt-[20px]">未识别到隐患</div>
            </div>
          </div>

        </Spin>
        <div class="flex justify-center gap-[10px]">
          <Button v-if="selectedFile?.type?.startsWith('image/') && uploadedFiles.images.length < 5" type="default"
            :disabled="isAnalyzing" class="continue-upload-btn" @click="handleContinueUpload">
            继续上传图片 ({{ uploadedFiles.images.length }}/5)
          </Button>
          <Button v-if="selectedFile?.type?.startsWith('video/') && uploadedFiles.videos.length < 1" type="default"
            class="continue-upload-btn" :disabled="isAnalyzing" @click="handleContinueUpload">
            继续上传视频 ({{ uploadedFiles.videos.length }}/1)
          </Button>
          <Button v-if="isAnalyzing" danger type="primary" class="cancel-analyze-btn" @click="handleCancelAIAnalyze">
            <div class="loading-icon flex items-center justify-center w-full">
              <span class="mr-[5px]">停止AI识别</span>
            </div>
          </Button>
          <template v-else-if="aiAnalysisCompleted">
            <Button type="primary" class="confirm-edit-btn" v-if="aiRecognizedHazards.length"
              @click="handleConfirmAndEdit">
              确认并补充信息
            </Button>
            <Button type="primary" class="re-analyze-btn" @click="handleToManual" v-else>
              人工填写
            </Button>
            <Button type="default" class="re-analyze-btn" @click="handleReAnalyze">
              重新识别
            </Button>

          </template>
          <template v-else>
            <Button type="primary" class="ai-analyze-btn" @click="handleAIAnalyze">
              AI识别隐患
            </Button>
          </template>
          <Button type="default" class="continue-upload-btn" @click="handleCancelAnalyze">
            取消AI识别
          </Button>
        </div>
      </div>
    </Modal>

    <!-- 参考内容modal -->
    <Modal v-model:open="showReferenceModal" :title="referenceModalTitle" width="50%" class="reference-modal">
      <div class="reference-content mt-5">
        <div class="text-[14px] flex w-full w-full mb-[20px]">
          <span>请选择替换项：</span>
          <Checkbox v-model:checked="isReplaceAll" class="mr-2" @change="handleReplaceAllChange">
          </Checkbox>
          <span> 全部 </span>
        </div>
        <div v-for="(item, index) in referenceSchema" :key="index">
          <div class="flex mb-2">
              <Checkbox v-model:checked="item.checked" class="mr-2" @change="checkAllStatus" />
              <span class="text-[#788897] font-[500] text-[14px] whitespace-nowrap">{{ item.label }}:</span>
              <span class="text-[#454F64] text-[14px] ml-[10px]">
                <template v-if="item.key === 'images'">
                  <div class="flex flex-wrap gap-2">
                    <div v-for="(img, imgIndex) in hazardReference?.referenceContent[item.key]" :key="imgIndex"
                      class="w-[80px] h-[80px] rounded-[8px] overflow-hidden cursor-pointer border-[1px] border-[#E6E6E6]"
                      @click="handlePreview(img)">
                      <img :src="img?.url" alt="隐患图片" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  {{ hazardReference?.referenceContent[item.key] || '未填写' }}
                </template>
              </span>
            </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button @click="handleReferenceCancel">取消</Button>
          <Button type="primary" @click="handleReferenceReplace">确认替换</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, computed, watch } from 'vue';
import {
  Form, FormItem, Input, Select, SelectOption, Spin,
  Textarea, Upload, Button, message, Modal, DatePicker, Image, Checkbox
} from 'ant-design-vue';
import type { UploadFile } from 'ant-design-vue';
import {
  PlusOutlined, FileImageOutlined, UploadOutlined,
  VideoCameraOutlined, CloseCircleOutlined, EnvironmentOutlined, DownOutlined, UpOutlined,
  EyeOutlined
} from '@ant-design/icons-vue';
import { useMainStore } from '@/store';
import { uploadFile } from '@/api/upload';
import FillModeSelector from './components/FillModeSelector.vue';
import StepIndicator from './components/StepIndicator.vue';
import HazardPreview from './components/HazardPreview.vue';
import { useFileUpload } from './composables/useFileUpload';
import { useAIAnalyze } from './composables/useAIAnalyze';
import { useOrderForm } from './composables/useOrderForm';
import { getCurrentLocation } from '@/utils/tool';
import type {
  FillMode,
  FileItem,
  HazardItem,
  InitialOrderData,
  UploadedFileObject,
  StepStatus
} from './types';
import QrCodeFloat from '@/components/QrCodeFloat.vue';
import mobileHiddenCode from '@/assets/mobile-hiddendanger.png'
// ==================== Props & Emits ====================
const props = defineProps({
  initialData: {
    type: Object as () => InitialOrderData | null,
    default: () => null
  }
});

const emit = defineEmits(['success', 'cancel']);

// ==================== Store ====================
const mainStore = useMainStore();
const userInfo = computed(() => mainStore.sysUserInfo);

// ==================== Composables ====================
const {
  uploadedFiles,
  formatFileSize,
  validateFile,
  handleAIFileUpload,
  uploadMultipleFiles,
  formatFileList: formatUploadFileList,
  clearUploadedFiles,
} = useFileUpload();

const {
  isAnalyzing,
  aiRecognizedHazards,
  selectedHazardIndex,
  hazardRefs,
  isRecognizedImage,
  handleFileClick,
  performAIAnalyze,
  cancelAIAnalyze,
  removeRecognizedHazard,
  resetAIState,
} = useAIAnalyze();

const {
  formRef,
  formState,
  initFormData,
  resetForm: resetOrderForm,
  addHazard,
  removeHazard,
  toggleHazard,
  confirmAIResults,
  convertToManual,
  validateForm,
  saveOrder,
  removeAttachment,
  handleImageUpload,
  handleVideoUpload,
  formatFileList: formatOrderFileList,
} = useOrderForm(userInfo.value);

// ==================== 响应式状态 ====================
const fillMode = ref<FillMode>('manual');
const aiAnalysisCompleted = ref(false);
const currentStep = ref<StepStatus>(1);
const showFileInfoModal = ref(false);
const selectedFile = ref<any>(null);
const showReferenceModal = ref(false);
const referenceModalTitle = ref('参考内容');
const hazardReference = ref({});
const isReplaceAll = ref(false);

// 参考内容schema数组（响应式）
const referenceSchema = ref([
  {
    key: "hazardName",
    label: "隐患名称",
    type: "input",
    checked: false
  },
  {
    key: "hazardDesc",
    label: "隐患描述",
    type: "textarea",
    checked: false
  },
  {
    key: "hazardLevel",
    label: "隐患级别",
    type: "select",
    props: {
      options: [
        { label: "一般隐患", value: "一般隐患" },
        { label: "重大隐患", value: "重大隐患" },
      ],
    },
    checked: false
  },
  {
    key: "hazardType",
    label: "隐患类型",
    type: "input",
    checked: false
  },
  {
    key: "basisRule",
    label: "依据规则",
    type: "textarea",
    checked: false
  },
  {
    key: "rectifySuggestion",
    label: "整改建议",
    type: "textarea",
    checked: false
  },
  {
    key: "penaltyStandard",
    label: "处罚标准",
    type: "textarea",
    checked: false
  },
  {
    key: "images",
    label: "隐患图片",
    type: "images",
    checked: false
  }
]);

// 监听referenceSchema的变化，更新isReplaceAll的状态
watch(() => referenceSchema.value.map(item => item.checked), (newCheckedStates) => {
  const allChecked = newCheckedStates.every(checked => checked);
  const allUnchecked = newCheckedStates.every(checked => !checked);
  
  if (allChecked) {
    isReplaceAll.value = true;
  } else if (allUnchecked) {
    isReplaceAll.value = false;
  }
  // 如果部分选中，则保持isReplaceAll为false
}, { deep: true });

const hazardListSchema = (isReference: boolean = false) => {
  const targetArr = isReference ? [] : [
    {
      key: "hazardFile",
      label: "隐患文件",
    },
    {
      key: "rectifyImages",
      label: "整改图片",
    },
    {
      key: "rectifyDesc",
      label: "整改说明",
    },
    {
      key: "area",
      label: "区域",
      type: "input",
    }]
  const arr = [
    {
      key: "hazardName",
      label: "隐患名称",
      type: "input",
      checked: false
    },
    {
      key: "hazardDesc",
      label: "隐患描述",
      type: "textarea",
      checked: false
    },
    ...targetArr,
    {
      key: "hazardLevel",
      label: "隐患级别",
      type: "select",
      props: {
        options: [
          { label: "一般隐患", value: "一般隐患" },
          { label: "重大隐患", value: "重大隐患" },
        ],
      },
      checked: false
    },
    {
      key: "hazardType",
      label: "隐患类型",
      type: "input",
      checked: false
    },
    {
      key: "basisRule",
      label: "依据规则",
      type: "textarea",
      checked: false
    },
    {
      key: "rectifySuggestion",
      label: "整改建议",
      type: "textarea",
      checked: false
    },
    {
      key: "penaltyStandard",
      label: "处罚标准",
      type: "textarea",
      checked: false
    },
  ];
  return arr;
}

// ==================== 生命Maintainer期 ====================
onMounted(() => {
  if (props.initialData) {
    initFormData(props.initialData);
  } else {
    // 初始化时至少添加一个空隐患
    if (formState.hazardList.length === 0) {
      addHazard();
    }
  }
});

// 监听 props 变化
watch(() => props.initialData, (newData) => {
  if (newData) {
    initFormData(newData);
  }
});

// ==================== 文件预览 ====================
const handlePreview = (file: FileItem) => {
  const imageUrl = file.response?.url || file.url || file.thumbUrl;
  Modal.info({
    title: '图片预览',
    icon: null,
    bodyStyle: {
      textAlign: 'center',
    },
    content: h(Image, { src: imageUrl, style: { width: '100%', minWidth: '400px' } }),
    okText: '关闭',
    width: 800,
    closable: true,
    maskClosable: true,
    onOk: () => { },
  });
};

const handleVideoPreview = (file: FileItem) => {
  const videoUrl = file.response?.url || file.url;
  Modal.info({
    icon: null,
    title: '视频预览',
    content: h('video', { src: videoUrl, controls: true, style: { width: '100%' } }),
  });
};

// ==================== 文件验证 ====================
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (!isImage && !isVideo) {
    message.error('只能上传图片或视频文件！');
    return false;
  }

  const maxSize = isVideo ? 50 : 10;
  const isLtMaxSize = file.size / 1024 / 1024 <= maxSize;
  if (!isLtMaxSize) {
    message.error(`${isVideo ? '视频' : '图片'}大小不能超过 ${maxSize}MB！`);
    return false;
  }

  return false;
};

const beforeImageUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('只能上传图片文件！');
    return false;
  }
  const isLt10M = file.size / 1024 / 1024 <= 10;
  if (!isLt10M) {
    message.error('图片大小不能超过10MB！');
    return false;
  }
  return true;
};

const beforeVideoUpload = (file: File) => {
  const isVideo = file.type.startsWith('video/');
  if (!isVideo) {
    message.error('只能上传视频文件！');
    return false;
  }
  const isLt50M = file.size / 1024 / 1024 <= 50;
  if (!isLt50M) {
    message.error('视频大小不能超过50MB！');
    return false;
  }
  return true;
};

// ==================== 模式切换 ====================
const switchMode = (mode: FillMode) => {
  fillMode.value = mode;
  currentStep.value = 1;
  aiAnalysisCompleted.value = false;
  if (mode === 'ai') {
    formState.images = [];
    formState.videos = [];
    clearUploadedFiles();
  }
};

// ==================== AI文件上传 ====================
const beforeAIUpload = (file: File) => {
  const validation = validateFile(file);
  if (!validation.valid) {
    message.error(validation.error);
    return false;
  }
  return true;
};

const handleAIFileUploadWrapper = async (options: any) => {
  const { file } = options;
  const fileObj = await handleAIFileUpload(file);
  if (fileObj) {
    // 添加文件到工单附件
    const fileData = {
      url: fileObj.fileData.url,
      name: fileObj.fileData.name,
      uid: fileObj.fileData.uid,
      status: 'done',
      response: { url: fileObj.fileData.url },
    };

    if (file.type.startsWith('image/')) {
      formState.images.push(fileData);
    } else if (file.type.startsWith('video/')) {
      formState.videos.push(fileData);
    }

    currentStep.value = 2;
    handleFileClickWrapper(fileObj);
    showFileInfoModal.value = true;
  }
};

// ==================== 文件选择 ====================
const handlePCFileSelect = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.jpg,.jpeg,.png,.bmp,.mp4,.avi';
  input.multiple = true;

  input.onchange = async (e) => {
    const files = Array.from((e.target as HTMLInputElement).files || []);
    if (files.length > 0) {
      const fileObjects = await uploadMultipleFiles(files);
      if (fileObjects.length > 0) {
        // 添加所有文件到工单附件
        fileObjects.forEach((fileObj, index) => {
          const file = files[index];
          const fileData = {
            url: fileObj.fileData.url,
            name: fileObj.fileData.name,
            uid: fileObj.fileData.uid,
            status: 'done',
            response: { url: fileObj.fileData.url },
          };

          if (file.type.startsWith('image/')) {
            formState.images.push(fileData);
          } else if (file.type.startsWith('video/')) {
            formState.videos.push(fileData);
          }
        });

        currentStep.value = 2;
        handleFileClickWrapper(fileObjects[0]);
        showFileInfoModal.value = true;
      }
    }
  };
  input.click();
};

const handleContinueUpload = () => {
  handlePCFileSelect();
};

// ==================== AI识别控制 ====================
const handleFileClickWrapper = (fileObj: UploadedFileObject) => {
  handleFileClick(
    fileObj,
    aiRecognizedHazards.value,
    (file) => {
      selectedFile.value = file;
    },
    (index, element) => {
      // 可以在这里处理额外的逻辑
    }
  );
};

const handleAIAnalyze = async () => {
  const success = await performAIAnalyze(uploadedFiles, false);
  if (success) {
    aiAnalysisCompleted.value = true;
    currentStep.value = 3;
    if (uploadedFiles.images.length > 0) {
      handleFileClickWrapper(uploadedFiles.images[0]);
    }
  }
};

const handleReAnalyze = async () => {
  const success = await performAIAnalyze(uploadedFiles, true);
  if (success) {
    aiAnalysisCompleted.value = true;
    currentStep.value = 3;
    if (uploadedFiles.images.length > 0) {
      handleFileClickWrapper(uploadedFiles.images[0]);
    }
  }
};

// ==================== Modal 操作 ====================
const handleCancelAnalyze = () => {
  showFileInfoModal.value = false;
  isAnalyzing.value = false;
  currentStep.value = 1;
  selectedFile.value = null;
  clearUploadedFiles();
  resetAIState();
};

const handleConfirmAndEdit = () => {
  confirmAIResults(aiRecognizedHazards.value);
  showFileInfoModal.value = false;
  clearUploadedFiles();
  resetAIState();
  selectedFile.value = null;
};

const handleToManual = () => {
  convertToManual(uploadedFiles);
  showFileInfoModal.value = false;
  fillMode.value = 'manual';
  aiAnalysisCompleted.value = true;
};

const removeImageFromModal = (index: number) => {
  uploadedFiles.images.splice(index, 1);
  if (uploadedFiles.images.length > 0) {
    handleFileClickWrapper(uploadedFiles.images[0]);
  } else {
    selectedFile.value = null;
    selectedHazardIndex.value = -1;
    showFileInfoModal.value = false;
  }
  message.success('图片删除成功！');
};

const openReferenceContent = (hazard: HazardItem) => {
  hazardReference.value = { ...hazard };
  hazardReference.value.referenceContent = JSON.parse(hazardReference.value.referenceContent || '{}');
  console.log(typeof hazard.referenceContent);
  referenceModalTitle.value = hazard.hazardName + '-参考内容';
  showReferenceModal.value = true;
};

const handleReplaceAllChange = () => {
  referenceSchema.value.forEach(item => {
    item.checked = isReplaceAll.value;
  });
};

const checkAllStatus = () => {
  const allChecked = referenceSchema.value.every(item => item.checked);
  const allUnchecked = referenceSchema.value.every(item => !item.checked);
  
  if (allChecked) {
    isReplaceAll.value = true;
  } else if (allUnchecked) {
    isReplaceAll.value = false;
  }
  // 如果部分选中，则保持isReplaceAll为false
};

const handleReferenceReplace = () => {
  const checkedItems = referenceSchema.value.filter(item => item.checked);

  if (checkedItems.length === 0) {
    message.warning('请至少选择一项进行替换');
    return;
  }

  // 找到当前隐患在formState.hazardList中的索引
  const currentHazardIndex = formState.hazardList.findIndex(
    hazard => hazard.id === hazardReference.value.id
  );

  if (currentHazardIndex !== -1) {
    const currentHazard = formState.hazardList[currentHazardIndex];

    // 遍历选中的项进行替换
    checkedItems.forEach(item => {
      const value = hazardReference.value.referenceContent[item.key];
      if (value) {
        // 根据key更新对应字段
        switch (item.key) {
          case 'hazardName':
            currentHazard.hazardName = value;
            break;
          case 'hazardDesc':
            currentHazard.hazardDesc = value;
            break;
          case 'hazardLevel':
            currentHazard.hazardLevel = value;
            break;
          case 'hazardType':
            currentHazard.hazardType = value;
            break;
          case 'basisRule':
            currentHazard.basisRule = value;
            break;
          case 'rectifySuggestion':
            currentHazard.rectifySuggestion = value;
            break;
          case 'penaltyStandard':
            currentHazard.penaltyStandard = value;
            break;
          case 'images':
            currentHazard.images = value;

            break;
        }
      }
    });

    message.success('参考内容替换成功');
  }

  showReferenceModal.value = false;
  resetReferenceModal();
};

const handleReferenceCancel = () => {
  showReferenceModal.value = false;
  resetReferenceModal();
};

const resetReferenceModal = () => {
  isReplaceAll.value = false;
  // 重置schema中的checked状态
  referenceSchema.value.forEach(item => {
    item.checked = false;
  });
};
const showRejectReasonModal = () => {
  const hasReferenceContent  = props.initialData?.hazardList?.some(item => item.referenceContent);
  
  // Create modal content with manual copy functionality and colored message
  const modalContent = h('div', null, [
    h('div', {
      class: 'mb-2'
    }, [
      h('span', props.initialData?.rejectReason || '无'),
      h('span', {
        class: 'cursor-pointer text-[#4362EF] ml-2',
        onClick: async () => {
          const textToCopy = props.initialData?.rejectReason || '无';
          if (!textToCopy) {
            onCopyError('复制失败');
            return;
          }
          
          try {
            await navigator.clipboard.writeText(textToCopy);
            onCopySuccess('复制成功');
          } catch (error) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
              const successful = document.execCommand('copy');
              if (successful) {
                onCopySuccess('复制成功');
              } else {
                onCopyError('复制失败');
              }
            } catch (err) {
              onCopyError('复制失败');
            } finally {
              document.body.removeChild(textarea);
            }
          }
        }
      }, '复制')
    ]),
    hasReferenceContent ? h('div', {
      class: 'text-[#0070FF] text-sm'
    }, '可参照每条隐患的参考内容') : null
  ]);
  
  Modal.info({
    title: '驳回原因',
    icon: null,
    content: modalContent,
    okText: '关闭',
    width:600,
    closable: true,
    maskClosable: true,
    onOk: () => { },
  });
}


// ==================== 工单附件上传 ====================
const handleAttachmentUpload = async (info: any) => {
  const file = info.file;
  try {
    const result: any = await uploadFile({
      file,
      description: '工单附件',
      is_public: true,
      wait_for_completion: true,
    });

    const fileData: FileItem = {
      url: result.data?.download_url || file.url,
      name: result.data?.original_filename || file.name,
      uid: result.data?.id || file.uid || Date.now(),
      status: 'done',
    };

    if (file.type?.startsWith('image/')) {
      formState.images.push(fileData);
    } else if (file.type?.startsWith('video/')) {
      formState.videos.push(fileData);
    }
  } catch (error) {
    console.error('文件上传失败:', error);
    message.error('文件上传失败，请重试！');
  }
};

// ==================== 地理位置 ====================
const handleLocation = async (index: number | null = null, callBack?: (address: string) => void) => {
  getCurrentLocation((res: string) => {
    const resJson = JSON.parse(res);
    const address = resJson?.placeName || resJson?.locality;
    if (callBack) {
      callBack(address);
      return;
    }
    if (index !== null) {
      formState.hazardList[index].area = address;
    } else {
      formState.hazardList.forEach((hazard) => {
        hazard.area = address;
      });
    }
  });
};

// ==================== 表单操作 ====================
const handleCancel = () => {
  emit('cancel');
  resetAll();
};

const resetAll = () => {
  resetOrderForm();
  clearUploadedFiles();
  resetAIState();
  aiAnalysisCompleted.value = false;
  currentStep.value = 1;
  fillMode.value = 'manual';
  selectedFile.value = null;
};

// ==================== 表单提交 ====================
const handleSubmit = async () => {
  const isValid = await validateForm();
  if (!isValid) return;

  const isEdit = !!(props.initialData && props.initialData.id);
  const result = await saveOrder(isEdit, props.initialData?.id);

  if (result && result.code === 200) {
    emit('success', result.data);
    resetAll();
  }
};
const onCopySuccess = (content = `复制成功`) => {
  console.log('1111');
  message.success({
    content,
  });
};

const onCopyError = (content = `复制失败`) => {
  message.error({
    content,
  });
};

// ==================== 暴露给模板 ====================
const removeAiRecognizedHazard = removeRecognizedHazard;
const handleCancelAIAnalyze = cancelAIAnalyze;
</script>

<style lang="scss" scoped>
.list-card {
  box-shadow: 0px 0px 3px 0px rgba(211, 211, 211, 0.36);
}

.upload-card {
  background-image: url('@/assets/upload-pic-bg.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: 0% 0%;
}

.result-card {
  background-image: url('@/assets/result-pic-bg.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: 0% 0%;
}

.ai-upload-section {
  .ai-upload-dragger {
    position: relative;
    width: 100%;
    background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
    border: 2px dashed #b8d4ff;
    border-radius: 12px;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      border-color: #1890ff;
      background: linear-gradient(135deg, #e6f2ff 0%, #d6e9ff 100%);
    }

    :deep(.ant-upload-drag-container) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 20px;
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .upload-icon {
        width: 56px;
        height: 56px;
        background: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #1890ff;
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
      }

      .upload-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .upload-desc {
        font-size: 13px;
        color: #666;
      }
    }
  }

  .ai-tips {
    margin-top: 12px;
    padding: 12px;
    background: #fafafa;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .tip-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #666;
      line-height: 1.5;

      .tip-icon {
        font-size: 16px;
        flex-shrink: 0;
      }
    }
  }
}

.hazard-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;

  .hazard-item {
    background: #f9f9f9;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e8e8e8;

    .hazard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      background: #f0f0f0;
      border-bottom: 1px solid #e8e8e8;

      .hazard-title {
        font-size: 16px;
        font-weight: 600;
        color: #4362EF;
      }

      .hazard-actions {
        display: flex;
        gap: 8px;

        .toggle-btn {
          color: #1890ff;

          &:hover {
            color: #1890ff;
          }
        }
      }
    }

    .hazard-content {
      padding: 20px;
    }
  }
}

.form-row {
  display: flex;
  gap: 20px;

  .form-item-half {
    flex: 1;
  }
}

.add-hazard-section {
  margin: 20px 0;

  .add-hazard-btn {
    width: 100%;
    height: 48px;
    border: 2px dashed #d9d9d9;
    background: #fafafa;
    color: #666;
    font-size: 14px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #1890ff;
      color: #1890ff;
      background: #f0f7ff;
    }
  }
}

.common-fields {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.attachment-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  .attachment-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f5f5f5;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #e6f7ff;
    }

    .attachment-icon {
      font-size: 18px;
      color: #666;
    }

    .attachment-name {
      font-size: 13px;
      color: #333;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }

    .attachment-remove {
      font-size: 16px;
      color: #ff4d4f;
      cursor: pointer;

      &:hover {
        color: #ff7875;
      }
    }
  }

  .attachment-upload-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    background: #fafafa;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #1890ff;
      color: #1890ff;
      background: #f0f7ff;
    }
  }
}

.form-actions {
  display: flex;
  gap: 16px;
  padding: 0 24px 24px;

  .cancel-btn {
    flex: 1;
    height: 48px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    font-size: 16px;

    &:hover {
      border-color: #40a9ff;
      color: #40a9ff;
    }
  }

  .submit-btn {
    flex: 1;
    height: 48px;
    background: #4362EF;
    border-radius: 8px;
    font-size: 16px;
    border: none;

    &:hover {
      background: #3350d9;
    }
  }
}

.location-input {
  .location-icon {
    cursor: pointer;
    color: #666;
    transition: color 0.3s ease;

    &:hover {
      color: #1890ff;
    }
  }

  :deep(.ant-input) {
    border: none !important;
  }
}

.file-info-modal {
  .file-info-content {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .file-preview {
      width: 100%;
      height: 280px;
      background: #f5f5f5;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;

      .recognized-badge {
        position: absolute;
        bottom: 12px;
        right: 25px;
        background: linear-gradient(135deg, #ff6b6ba6 0%, #ee5a5aa6 100%);
        color: #fff;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(238, 90, 90, 0.4);
        z-index: 10;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      img,
      video {
        max-width: 80%;
        max-height: 100%;
        object-fit: contain;
      }

      .file-icon {
        font-size: 64px;
      }
    }

    .file-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 8px;

      .detail-item {
        display: flex;
        font-size: 14px;

        .label {
          font-weight: 500;
          color: #666;
          min-width: 80px;
        }

        .value {
          flex: 1;
          color: #333;
        }
      }
    }

    .ai-result-summary {
      padding: 16px;
      background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
      border-radius: 8px;
      border: 1px solid #b8d4ff;
      overflow-y: auto;

      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(24, 144, 255, 0.2);

        .result-title {
          font-size: 15px;
          font-weight: 600;
          color: #1890ff;
        }

        .result-stats-mini {
          display: flex;
          gap: 8px;

          .stat-badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            background: #fff;
            color: #666;
            border: 1px solid #d9d9d9;

            &.danger {
              background: #fff1f0;
              color: #ff4d4f;
              border-color: #ffa39e;
            }

            &.warning {
              background: #fffbe6;
              color: #faad14;
              border-color: #ffe58f;
            }
          }
        }
      }

      .hazard-preview-list {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .hazard-preview-item {
          background: #fff;
          border-radius: 6px;
          padding: 12px;
          border: 1px solid #e8e8e8;
          transition: all 0.3s ease;

          &:hover {
            border-color: #1890ff;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
          }

          &.selected {
            border-color: #1890ff;
            background: #e6f7ff;
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
          }

          .hazard-preview-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;

            .hazard-index {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #1890ff;
              color: #fff;
              font-size: 12px;
              font-weight: 600;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .hazard-level-badge {
              padding: 2px 8px;
              border-radius: 10px;
              font-size: 11px;
              font-weight: 500;

              &.danger {
                background: #fff1f0;
                color: #ff4d4f;
              }

              &.warning {
                background: #fffbe6;
                color: #faad14;
              }
            }
          }

          .hazard-preview-content {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .hazard-preview-row {
              display: flex;
              font-size: 13px;
              line-height: 1.5;

              .preview-label {
                min-width: 50px;
                color: #666;
                font-weight: 500;
              }

              .preview-value {
                flex: 1;
                color: #333;

                &.preview-desc {
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
      }
    }

    .file-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .file-list-title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }

      .file-list-items {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .file-list-item {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;

          &:hover {
            border-color: #1890ff;
          }

          &.active {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
          }

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .file-list-item-remove {
            position: absolute;
            top: 4px;
            right: 4px;
            font-size: 16px;
            color: #ff4d4f;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            padding: 2px;

            &:hover {
              color: #ff7875;
            }
          }
        }
      }
    }

    // 按钮基础样式
    .continue-upload-btn,
    .ai-analyze-btn,
    .confirm-edit-btn,
    .re-analyze-btn,
    .cancel-analyze-btn {
      height: 40px;
      padding: 0 24px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    // 次要按钮 - 线框样式
    .continue-upload-btn {
      border: 1px solid #d9d9d9;
      color: #666;
      background: #fff;

      &:hover:not(:disabled) {
        border-color: #4362EF;
        color: #4362EF;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    // 主要操作按钮 - 主题色填充
    .ai-analyze-btn {
      background: #4362EF;
      border: none;
      color: #fff;

      &:hover {
        background: #3651d4;
        box-shadow: 0 4px 12px rgba(67, 98, 239, 0.25);
      }

      &:active {
        background: #2d45b3;
      }
    }

    // 确认按钮 - 主题色填充
    .confirm-edit-btn {
      background: #4362EF;
      border: none;
      color: #fff;

      &:hover {
        background: #3651d4;
        box-shadow: 0 4px 12px rgba(67, 98, 239, 0.25);
      }

      &:active {
        background: #2d45b3;
      }
    }

    // 次要操作按钮 - 线框主题色
    .re-analyze-btn {
      border: 1px solid #4362EF;
      color: #4362EF;
      background: #fff;

      &:hover {
        background: rgba(67, 98, 239, 0.05);
      }

      &:active {
        background: rgba(67, 98, 239, 0.1);
      }
    }

    // 停止/危险按钮 - 红色填充
    .cancel-analyze-btn {
      background: #ff4d4f;
      border: none;
      color: #fff;

      &:hover {
        background: #ff7875;
        box-shadow: 0 4px 12px rgba(255, 77, 79, 0.25);
      }

      &:active {
        background: #d9363e;
      }
    }
  }
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-height: 400px;
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
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        font-weight: 600;
        flex-shrink: 0;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }

      .user-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        flex: 1;
      }

      .user-role {
        font-size: 13px;
        color: #999;
        margin-top: 2px;
      }
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #a8a8a8;
    }
  }
}



:deep(.ant-form) {
  .ant-form-item {
    margin-bottom: 24px;

    .ant-form-item-label {
      font-weight: 500;
      color: #333;
      font-size: 14px;

      >label {
        height: auto;
      }
    }

    .ant-input,
    .ant-select-selector {
      border-radius: 8px;
      border: 1px solid #d9d9d9;
      font-size: 14px;

      &:focus,
      &.ant-select-focused {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
      }
    }

    .ant-input-number {
      width: 100%;
    }
  }
}
:deep(.ant-checkbox-wrapper){
  display: block;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .mode-selector {
    flex-direction: column;
    gap: 12px;
  }

  .page-title {
    font-size: 24px !important;
  }

  .form-container {
    padding: 24px;
  }
}
</style>
