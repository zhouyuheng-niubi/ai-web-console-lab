<template>
  <div class="create-order flex flex-col w-full">
    <Header :title="route.query.id ? '编辑工单' : '创建工单'" :show-back="true" />
    <div class="px-[20px] w-full bg-[#fff]">
      <FillModeSelector v-model="fillMode" @update:model-value="switchMode" />
    </div>
    
    <main class="main-content w-full flex-1 overflow-y-auto">
      <div class="form-container">
        <div v-if="fillMode === 'ai' && !aiAnalysisCompleted"
          class="min-h-[200px] flex flex-col justify-center items-center">
          <div class="step-indicator">
            <div class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
              <div class="step-number">1</div>
              <div class="step-text">上传媒体文件</div>
            </div>
            <div class="step-line" :class="{ active: currentStep > 1 }"></div>
            <div class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
              <div class="step-number">2</div>
              <div class="step-text">AI智能识别</div>
            </div>
            <div class="step-line" :class="{ active: currentStep > 2 }"></div>
            <div class="step-item" :class="{ active: currentStep >= 3 }">
              <div class="step-number">3</div>
              <div class="step-text">确认并补充信息</div>
            </div>
          </div>
          <div class="ai-tech-button" @click="handleAIFill">
            <div class="button-content">
              <div class="icon-wrapper text-[#fff]">
                <img src="@/assets/h5/ai-box.svg" alt="AI技术图标" class="icon" />
              </div>
              <div class="button-text">上传图片/视频</div>
              <div class="button-glow"></div>
            </div>
          </div>
        </div>
        <div v-if="fillMode === 'manual' || aiAnalysisCompleted">
          <Form :model="formState" layout="vertical" ref="formRef">
            <div class="hazard-list">
              <div v-for="(hazard, index) in formState.hazardList" :key="index" class="hazard-item">
                <div class="hazard-header">
                  <div class="hazard-title">隐患 {{ index + 1 }}</div>
                  <div class="hazard-actions flex items-center">
                    <span class="cursor-pointer text-[#1890ff] text-sm mr-2" v-if="hazard?.referenceContent"
                      @click="openReferenceContent(hazard, index)">
                      <EyeOutlined />
                      参考内容
                    </span>
                    <Button type="text" size="small" @click="toggleHazard(index)" class="toggle-btn">
                      <DownOutlined v-if="!hazard.expanded" />
                      <UpOutlined v-else />
                      {{ hazard.expanded ? '收起' : '展开' }}
                    </Button>
                    <Button v-if="formState.hazardList.length > 1" type="text" danger size="small"
                      @click="removeHazard(index)">
                      删除
                    </Button>
                  </div>
                </div>
                <div v-show="hazard.expanded !== false" class="hazard-content">
                  <Form :model="hazard" layout="vertical">

                    <FormItem label="隐患图片">
                      <FileUploadWithSource v-model="hazard.images" upload-type="image" :max-count="5"
                        upload-text="上传图片" drawer-title="上传隐患图片" description="隐患图片" @preview="handlePreview" />
                    </FormItem>

                    <FormItem label="隐患视频">
                      <FileUploadWithSource v-model="hazard.videos" upload-type="video" :max-count="1"
                        upload-text="上传视频" drawer-title="上传隐患视频" description="隐患视频" @preview="handleVideoPreview" />
                    </FormItem>
                    <FormItem label="隐患名称" name="hazardName"
                      :rules="[{ required: true, message: '请输入隐患名称', trigger: 'blur' }]">
                      <Input v-model:value="hazard.hazardName" placeholder="请输入隐患名称" size="large" :maxlength="100" />
                    </FormItem>


                    <FormItem label="隐患描述" name="hazardDesc" 
                    :rules="[{ required: true, message: '请输入隐患描述', trigger: 'blur' }]">
                      <Textarea v-model:value="hazard.hazardDesc" placeholder="请输入隐患描述"
                        :autoSize="{ minRows: 4, maxRows: 6 }" size="large" :maxlength="500" showCount />
                    </FormItem>

                    <FormItem label="隐患地点" name="area"
                      :rules="[{ required: true, message: '请输入隐患地点', trigger: 'change' }]">
                      <Input v-model:value="hazard.area" placeholder="请输入隐患地点" size="large" class="location-input" :maxlength="100">
                        <template #suffix>
                          <EnvironmentOutlined class="location-icon" @click.stop="handleLocation(index)" />
                        </template>
                      </Input>
                    </FormItem>

                    <FormItem label="隐患等级" name="hazardLevel"
                      :rules="[{ required: true, message: '请选择隐患等级', trigger: 'change' }]">
                      <Select v-model:value="hazard.hazardLevel" placeholder="请选择隐患等级" size="large">
                        <SelectOption value="一般隐患">一般隐患</SelectOption>
                        <SelectOption value="重大隐患">重大隐患</SelectOption>
                      </Select>
                    </FormItem>

                    <FormItem label="隐患类型" name="hazardType"
                      :rules="[{ required: true, message: '请输入隐患类型', trigger: 'blur' }]">
                      <Input v-model:value="hazard.hazardType" placeholder="请输入隐患类型" size="large" />
                    </FormItem>

                    <FormItem label="判断依据" name="basisRule">
                      <Textarea v-model:value="hazard.basisRule" placeholder="请输入判断依据（选填）"
                        :autoSize="{ minRows: 4, maxRows: 6 }" size="large" :maxlength="500" showCount />
                    </FormItem>

                    <FormItem label="整改建议" name="rectifySuggestion">
                      <Textarea v-model:value="hazard.rectifySuggestion" placeholder="请输入整改建议（选填）"
                        :autoSize="{ minRows: 4, maxRows: 6 }" size="large" :maxlength="500" showCount />
                    </FormItem>

                    <FormItem label="处罚标准" name="penaltyStandard">
                      <Textarea v-model:value="hazard.penaltyStandard" placeholder="请输入处罚标准（选填）" :autoSize="{ minRows: 4, maxRows: 6 }"
                        size="large" :maxlength="500" showCount />
                    </FormItem>
                  </Form>
                </div>
              </div>
            </div>

            <div class="add-hazard-section">
              <Button block size="large" @click="addHazard" class="add-hazard-btn">
                <span>
                  <PlusOutlined />
                  添加隐患
                </span>
              </Button>
            </div>

            <div class="common-fields">
              <FormItem label="工单名称" name="orderName"
                :rules="[{ required: true, message: '请输入工单名称', trigger: 'blur' }]">
                <Input v-model:value="formState.orderName" placeholder="请输入工单名称" size="large" :maxlength="50" />
              </FormItem>

              <!-- <FormItem label="填报时间" name="registerTime" :rules="[{ required: true, message: '请选择填报时间', trigger: 'change' }]">
                <DatePicker
                  v-model:value="formState.registerTime"
                  placeholder="请选择填报时间"
                  size="large"
                  show-time
                  style="width: 100%"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </FormItem> -->

              <!-- <FormItem label="整改期限" name="deadline"
                :rules="[{ required: true, message: '请选择整改期限', trigger: 'change' }]">
                <DatePicker v-model:value="formState.deadline" placeholder="请选择整改期限" size="large" style="width: 100%"
                  value-format="YYYY-MM-DD" />
              </FormItem> -->

              <!-- <FormItem label="填报人员" name="registerPerson" :rules="[{ required: true, message: '请输入填报人员', trigger: 'blur' }]">
                <Input v-model:value="formState.registerPerson" placeholder="请输入填报人员" size="large" />
              </FormItem> -->
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
      </div>
    </main>
    <div class="form-actions">
      <Button size="large" class="cancel-btn" @click="handleCancel">取消</Button>
      <Button type="primary" size="large" class="submit-btn" @click="handleSubmit">提交</Button>
    </div>

    <!-- 文件信息展示弹窗 -->
    <Modal v-model:open="showFileInfoModal" title="文件信息" :footer="null" width="90%" class="file-info-modal"
      :close-on-click-modal="false" :closable="false" :maskClosable="false" :z-index="999">
      <div class="file-info-content">
        <Spin :spinning="isAnalyzing" tip="正在识别中...">
          <div v-if="selectedFile" class="file-preview">
            <!-- <div v-if="selectedFile.type?.startsWith('image/') && isRecognizedImage(selectedFile)" 
              class="recognized-badge">
              隐患识别图片
            </div> -->
            <img v-if="selectedFile.type?.startsWith('image/')" :src="selectedFile.url" alt="预览" />
            <video v-else-if="selectedFile.type?.startsWith('video/')" :src="selectedFile.url" controls />
            <div v-else class="file-icon">📄</div>
          </div>
          <div v-if="selectedFile" class="file-details">
            <div class="detail-item">
              <span class="label">文件名：</span>
              <span class="value whitespace-nowrap overflow-ellipsis overflow-hidden">{{ selectedFile.name }}</span>
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
          <div v-if="aiAnalysisCompleted && aiRecognizedHazards.length > 0" class="ai-result-summary">
            <div class="result-header">
              <div class="result-title">AI识别结果</div>
              <div class="result-stats-mini">
                <span class="stat-badge">共识别 {{ aiRecognizedHazards.filter(h => h.hazardLevel).length }} 处隐患</span>
              </div>
            </div>
            <div class="hazard-preview-list">
              <div v-for="(hazard, index) in aiRecognizedHazards" :key="index"
                :ref="el => { if (el) hazardRefs[index] = el }" class="hazard-preview-item"
                :class="{ 'selected': selectedHazardIndex === index }">
                <div class="hazard-preview-header">
                  <div class="hazard-index">{{ index + 1 }}</div>
                  <span class="hazard-level-badge" 
                  :class="hazard.hazardLevel === '重大隐患' ? 'danger' : 'warning'"
                  v-if="hazard.hazardLevel"
                  >
                    {{ hazard.hazardLevel }}
                  </span>
                  <span class="text-[#ff4d4f] cursor-pointer text-[12px] flex-1 text-right"
                    @click="removeAiRecognizedHazard(index)">删除</span>
                </div>
                <div class="hazard-preview-content">
                  <div class="hazard-preview-row">
                    <span class="preview-label">图片：</span>
                    <span class="preview-value">
                      <Image :src="hazard.images[0]?.url" width="100px" />
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
          <div v-else-if="aiAnalysisCompleted && !aiRecognizedHazards.length" class="ai-result-summary">
            <img src="@/assets/empty-state.png" class="w-[280px] block mx-auto" />
            <div class="text-[16px] text-[#333] font-[500] text-center mt-[20px]">未识别到隐患</div>
          </div>  


          <div v-if="selectedFile?.type?.startsWith('image/') && uploadedFiles.images.length > 1" class="file-list">
            <div class="file-list-title">已上传图片 ({{ uploadedFiles.images.length }}/5)</div>
            <div class="file-list-items">
              <div v-for="(img, index) in uploadedFiles.images" :key="img.fileData?.uid" class="file-list-item"
                :class="{ active: selectedFile?.uid === img.fileData?.uid }" @click="handleFileClick(img)">
                <img :src="img.fileData.url" alt="缩略图" />
                <CloseCircleOutlined class="file-list-item-remove" @click.stop="removeImageFromModal(index)" />
              </div>
            </div>
          </div>
        </Spin>

        <Button v-if="selectedFile?.type?.startsWith('image/') && uploadedFiles.images.length < 5" type="default"
          size="medium" block :disabled="isAnalyzing" class="continue-upload-btn" @click="handleContinueUpload">
          继续上传图片 ({{ uploadedFiles.images.length }}/5)
        </Button>
        <Button v-if="selectedFile?.type?.startsWith('video/') && uploadedFiles.videos.length < 1" type="default"
          size="medium" block class="continue-upload-btn" :disabled="isAnalyzing" @click="handleContinueUpload">
          继续上传视频 ({{ uploadedFiles.videos.length }}/1)
        </Button>
        <Button v-if="isAnalyzing" danger size="medium" block class="cancel-analyze-btn" @click="handleCancelAIAnalyze">
          <div class="loading-icon flex items-center justify-center w-full">
            <span class="mr-[5px]">停止AI识别</span>
          </div>
        </Button>
        <template v-else-if="aiAnalysisCompleted">
          <Button type="primary" size="medium" block class="confirm-edit-btn"
          v-if="aiRecognizedHazards.length"
           @click="handleConfirmAndEdit">
            确认并补充信息
          </Button>
          <Button type="default" size="medium" class="re-analyze-btn mt-[10px]" block @click="handleToManual" v-else>
            人工填写
          </Button>
          <Button type="default" class="re-analyze-btn  mt-[10px]" size="medium" block @click="handleReAnalyze">
            重新识别
          </Button>
        </template>
        <template v-else>
          <Button type="primary" size="medium" block class="ai-analyze-btn" @click="handleAIAnalyze">
            AI识别隐患
          </Button>
        </template>
        <Button type="default" class="cancel-analyze-btn mt-[10px]" block size="medium" @click="handleCancelAnalyze">
          取消AI识别
        </Button>
      </div>
    </Modal>


    <!-- AI文件上传弹窗 -->
    <AIFileUploadDrawer v-model="showActionSheet" @file-uploaded="handleAIFileUploaded" />

    <!-- 参考内容弹窗 -->
    <Modal v-model:open="showReferenceModal" :title="referenceModalTitle" width="90%" class="reference-modal"
      @cancel="handleReferenceCancel">
      <div class="reference-content mt-4">
        <div class="text-sm flex items-center mb-4">
          <span>请选择替换项：</span>
          <Checkbox v-model:checked="isReplaceAll" class="ml-2 mr-1" @change="handleReplaceAllChange" />
          <span>全部</span>
        </div>
        <div v-for="(item, index) in referenceSchema" :key="index" class="mb-3">
          <div class="flex items-start">
            <Checkbox v-model:checked="item.checked" class="mr-2 mt-0.5" @change="checkAllStatus" />
            <div class="flex-1">
              <span class="text-[#788897] font-medium text-sm">{{ item.label }}:</span>
              <div class="text-[#454F64] text-sm mt-1">
                <template v-if="item.key === 'images'">
                  <div v-if="hazardReference?.referenceContent?.images?.length" class="flex flex-wrap gap-2">
                    <div v-for="(img, imgIndex) in hazardReference.referenceContent.images" :key="imgIndex"
                      class="w-[80px] h-[80px] rounded-lg overflow-hidden border border-[#E6E6E6]"
                      @click="handlePreview(img)">
                      <img :src="img?.url" alt="隐患图片" class="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span v-else class="text-gray-400">未填写</span>
                </template>
                <template v-else>
                  {{ hazardReference?.referenceContent?.[item.key] || '未填写' }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2">
          <Button @click="handleReferenceCancel" class="flex-1">取消</Button>
          <Button type="primary" @click="handleReferenceReplace" class="flex-1">确认替换</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, h, onMounted, computed, nextTick, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  Form, FormItem, Input, Select, SelectOption, Spin, Image,
  Textarea, Upload, Button, message, Modal, DatePicker, Checkbox
} from 'ant-design-vue';
import { PlusOutlined, FileImageOutlined, VideoCameraOutlined, CloseCircleOutlined, EnvironmentOutlined, DownOutlined, UpOutlined, EyeOutlined } from '@ant-design/icons-vue';
import Header from '../components/header.vue';
import FileUploadWithSource from '../components/FileUploadWithSource.vue';
import AIFileUploadDrawer from '../components/AIFileUploadDrawer.vue';
import FillModeSelector from '../components/FillModeSelector.vue';
import { detectHazard, getHazardList, updateHazard } from '@/api/hazard';
import { uploadFile } from '@/api/upload';
import dayjs from 'dayjs';
import { getCurrentLocation } from '@/utils/tool';
import { useMainStore } from '@/store';
import { saveHazard } from '@/api/hazard';
const router = useRouter();
const route = useRoute();

const mainStore = useMainStore();
const userInfo = computed(() => mainStore.userInfo);
const fillMode = ref('manual');
const aiAnalysisCompleted = ref(false);
const currentStep = ref(1);
const showActionSheet = ref(false);
const showFileInfoModal = ref(false);
const selectedFile = ref(null);
const isAnalyzing = ref(false);
const aiAnalyzeController = ref(null);
const aiRecognizedHazards = ref([]);
const selectedHazardIndex = ref(-1);
const hazardRefs = ref({});

const formState = reactive({
  images: [],
  videos: [],
  hazardList: [],
  orderName: '',
  registerTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  registerPerson: userInfo.value?.name || '',// 填报人员姓名
  registerPersonId: userInfo.value?.id || '',// 填报人员ID
  deadline: '',
  rectifyPerson: '',// 整改人员姓名
  rectifyPersonId: '',// 整改人员ID
});

const uploadedFiles = reactive({
  images: [],
  videos: []
});


const createEmptyHazard = () => ({
  images: [],
  videos: [],
  hazardName: '',
  hazardDesc: '',
  area: '',
  hazardLevel: '一般隐患',
  hazardType: '',
  basisRule: '',
  rectifySuggestion: '',
  penaltyStandard: '',
  expanded: true,
  referenceContent: null
});

const addHazard = () => {
  formState.hazardList.unshift(createEmptyHazard());
};

const removeHazard = (index) => {
  formState.hazardList.splice(index, 1);
};
const removeAiRecognizedHazard = (index) => {
  aiRecognizedHazards.value.splice(index, 1);
}

const toggleHazard = (index) => {
  formState.hazardList[index].expanded = !formState.hazardList[index].expanded;
};

if (formState.hazardList.length === 0) {
  addHazard();
}

const handlePreview = (file) => {
  Modal.info({
    title: '图片预览',
    icon: null,
    content: h(Image, { src: file.url || file.thumbUrl, style: { width: '100%' } }),
    okText: '关闭'
  });
};

const handleVideoPreview = (file) => {
  Modal.info({
    icon: null,
    title: '视频预览',
    content: h('video', { src: file.url, controls: true, style: { width: '100%' } })
  });
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (!isImage && !isVideo) {
    message.error('只能上传图片或视频文件!');
    return false;
  }

  const maxSize = isVideo ? 50 : 10;
  const isLtMaxSize = file.size / 1024 / 1024 <= maxSize;
  if (!isLtMaxSize) {
    message.error(`${isVideo ? '视频' : '图片'}大小不能超过 ${maxSize}MB!`);
    return false;
  }

  return false;
};

const handleCancel = () => {
  router.back();
};

const switchMode = (mode) => {
  fillMode.value = mode;
  currentStep.value = 1;
  aiAnalysisCompleted.value = false;
  if (mode === 'ai') {
    // 切换到AI模式时，重置上传文件
    formState.images = [];
    formState.videos = [];
    uploadedFiles.images = [];
    uploadedFiles.videos = [];
  }
};

const handleAIFill = () => {
  formState.images = [];
  formState.videos = [];
  uploadedFiles.images = [];
  uploadedFiles.videos = [];
  showActionSheet.value = true;
};

const handleAIFileUploaded = (fileData, file) => {
  const fileType = file.type.startsWith('image/') ? 'image' : 'video';
  const fileObj = { file, fileData }
  if (fileType === 'image') {
    if (uploadedFiles.images.length < 5) {
      uploadedFiles.videos = [];
      formState.images.push(fileData);
      uploadedFiles.images.push(fileObj);
    } else {
      message.warning('图片数量已达上限（5张）');
    }
  } else if (fileType === 'video') {
    if (uploadedFiles.videos.length < 1) {
      uploadedFiles.images = [];
      formState.videos.push(fileData);
      uploadedFiles.videos.push(fileObj);
    } else {
      message.warning('视频数量已达上限（1个）');
    }
  }

  currentStep.value = 2;
  handleFileClick(fileObj);
  showFileInfoModal.value = true;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const isRecognizedImage = (file) => {
  if (!aiAnalysisCompleted.value || !aiRecognizedHazards.value.length) {
    return false;
  }
  for (const hazard of aiRecognizedHazards.value) {
    if (hazard.images && hazard.images.length > 0) {
      const recognizedImage = hazard.images.find(recognizedImg =>
        recognizedImg.name === file.name
      );
      if (recognizedImage) {
        return true;
      }
    }
  }
  return false;
};

const handleFileClick = (fileObj) => {
  const img = fileObj.fileData;
  if (aiAnalysisCompleted.value && aiRecognizedHazards.value.length > 0) {
    for (let index = 0; index < aiRecognizedHazards.value.length; index++) {
      const hazard = aiRecognizedHazards.value[index];
      if (hazard.images && hazard.images.length > 0) {
        const recognizedImage = hazard.images.find(recognizedImg =>
          recognizedImg.name === img.name
        );
        if (recognizedImage) {
          selectedFile.value = {
            ...img,
            url: recognizedImage.url
          };
          selectedHazardIndex.value = index;
          nextTick(() => {
            const hazardElement = hazardRefs.value[index];
            if (hazardElement) {
              hazardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
          return;
        }
      }
    }
  }
  selectedFile.value = img;
  selectedHazardIndex.value = -1;
};

const handleContinueUpload = () => {
  showActionSheet.value = true;
};

const performAIAnalyze = async (isReAnalyze = false) => {
  try {
    isAnalyzing.value = true;
    if (isReAnalyze) {
      aiAnalysisCompleted.value = false;
      currentStep.value = 2;
    }
    selectedHazardIndex.value = -1;
    hazardRefs.value = {};

    const allFiles = [...uploadedFiles.images.map(item => item.file), ...uploadedFiles.videos.map(item => item.file)];

    if (allFiles.length === 0) {
      message.error('请先上传图片或视频！');
      isAnalyzing.value = false;
      return;
    }

    aiAnalyzeController.value = new AbortController();

    const detectResult = await detectHazard({
      files: allFiles,
      description: 'AI隐患识别'
    }, aiAnalyzeController.value.signal);
    console.log('AI识别结果:', detectResult);

    if (detectResult.data && detectResult.data.length > 0) {
      aiRecognizedHazards.value = detectResult.data.filter(item => item.hazardUrl).map(item => ({
        images: item.hazardUrl ? [
          {
            url: item.hazardUrl,
            name: item.fileName || '隐患图片',
            status: 'done',
          }
        ] : [],
        videos: [],
        hazardName: item.hazardName || '',
        hazardDesc: item.hazardDesc || '',
        area: '',
        hazardLevel: item.hazardLevel || '一般隐患',
        hazardType: item.hazardType || '',
        basisRule: item.basisRule || '',
        rectifySuggestion: item.rectifySuggestion || '',
        penaltyStandard: item.penaltyStandard || '',
        expanded: true
      }));
      setTimeout(() => {
        const arr = uploadedFiles.images.filter(item => !isRecognizedImage(item.fileData));
        aiRecognizedHazards.value.push(...arr.map(item => ({
          images: [item.fileData],
          videos: [],
          hazardName: '',
          hazardDesc: '',
          area: '',
          hazardLevel: '',
          hazardType: '',
          basisRule: '',
          rectifySuggestion: '',
          penaltyStandard: '',
          expanded: true
        })));
      }, 0);
      // await handleLocation(null, (res) => {
      //   aiRecognizedHazards.value.forEach(item => item.area = res);
      // });
    }

    message.success(isReAnalyze ? 'AI重新识别完成！' : 'AI识别完成！');
    aiAnalysisCompleted.value = true;
    currentStep.value = 3;
    if (uploadedFiles.images.length > 0) {
      handleFileClick(uploadedFiles.images[0]);
    }
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'CanceledError') {
      // 请求被终止，不提示任何信息
    } else {
      console.error('AI识别失败:', error);
      message.error('AI识别失败，请重试！');
    }
  } finally {
    isAnalyzing.value = false;
    aiAnalyzeController.value = null;
  }
};

const handleAIAnalyze = async () => {
  await performAIAnalyze(false);
};

const handleCancelAIAnalyze = () => {
  if (aiAnalyzeController.value) {
    aiAnalyzeController.value.abort();
    message.info('正在取消AI识别...');
  }
};

const handleCancelAnalyze = () => {
  showFileInfoModal.value = false;
  isAnalyzing.value = false;
  aiAnalyzeController.value = null;
  currentStep.value = 1;
  selectedFile.value = null;
  uploadedFiles.images = [];
  uploadedFiles.videos = [];
  aiRecognizedHazards.value = [];
};

const handleConfirmAndEdit = () => {
  let finalHazardList = [];
  finalHazardList = aiRecognizedHazards.value.filter(item => item.hazardName && item.hazardLevel)
  if (aiRecognizedHazards.value.length > 0) {
    const firstHazard = formState.hazardList[0];
    const isFirstHazardEmpty = !firstHazard.hazardName && !firstHazard.hazardDesc && !firstHazard.hazardType && firstHazard.images.length === 0;

    if (isFirstHazardEmpty) {
      formState.hazardList = [...aiRecognizedHazards.value, ...formState.hazardList.slice(1)];
    } else {
      formState.hazardList = [...aiRecognizedHazards.value, ...formState.hazardList];
    }
  }
  showFileInfoModal.value = false;
  uploadedFiles.images = [];
  uploadedFiles.videos = [];
  aiRecognizedHazards.value = [];
  selectedFile.value = null;
  message.success('已确认识别结果，请补充隐患信息');
};

const handleReAnalyze = async () => {
  await performAIAnalyze(true);
};

// 人工填写
const handleToManual = () => {
  // 如果有上传的图片，填入隐患列表的图片
  if (uploadedFiles.images.length > 0) {
    const imageFiles = uploadedFiles.images.map(item => ({
      url: item.fileData.url,
      name: item.fileData.name,
      uid: item.fileData.uid,
      status: 'done',
      response: { url: item.fileData.url }
    }));

    // 如果已有隐患，添加到第一个隐患；否则创建新隐患
    if (formState.hazardList.length > 0) {
      formState.hazardList[0].images = imageFiles;
    } else {
      formState.hazardList = [{
        ...createEmptyHazard(),
        images: imageFiles,
        expanded: true
      }];
    }
  }

  // 如果有上传的视频，填入隐患列表的视频
  if (uploadedFiles.videos.length > 0) {
    const videoFiles = uploadedFiles.videos.map(item => ({
      url: item.fileData.url,
      name: item.fileData.name,
      uid: item.fileData.uid,
      status: 'done',
      response: { url: item.fileData.url }
    }));

    // 如果已有隐患，添加到第一个隐患；否则创建新隐患
    if (formState.hazardList.length > 0) {
      formState.hazardList[0].videos = videoFiles;
    } else {
      formState.hazardList = [{
        ...createEmptyHazard(),
        videos: videoFiles,
        expanded: true
      }];
    }
  }

  // 关闭 AI 识别弹窗
  showFileInfoModal.value = false;
  // 切换到人工填写模式
  fillMode.value = 'manual';
  // 标记 AI 识别已完成
  aiAnalysisCompleted.value = true;
}

const removeAttachment = (type, index) => {
  if (type === 'image') {
    formState.images.splice(index, 1);
  } else if (type === 'video') {
    formState.videos.splice(index, 1);
  }
};

const removeImageFromModal = (index) => {
  uploadedFiles.images.splice(index, 1);

  if (uploadedFiles.images.length > 0) {
    handleFileClick(uploadedFiles.images[0]);
  } else {
    selectedFile.value = null;
    selectedHazardIndex.value = -1;
    showFileInfoModal.value = false;
  }

  message.success('图片删除成功！');
};

const handleAttachmentUpload = async (info) => {
  const file = info.file;
  try {
    const result = await uploadFile({
      file: file,
      description: '工单附件',
      is_public: true,
      wait_for_completion: true
    });

    const fileData = {
      url: result.download_url,
      name: result.original_filename,
      status: 'done',
    };

    if (file.type?.startsWith('image/')) {
      formState.images.push(fileData);
      // if (formState.images.length < 5) {

      // } 
      // else {
      //   message.warning('图片数量已达上限（5张）');
      // }
    } else if (file.type?.startsWith('video/')) {
      // if (formState.videos.length < 1) {

      // } else {
      //   message.warning('视频数量已达上限（1个）');
      // }
      formState.videos.push(fileData);

    }
  } catch (error) {
    console.error('文件上传失败:', error);
    message.error('文件上传失败，请重试！');
  }

};

const handleLocation = async (index = null, callBack = null) => {
  const location = getCurrentLocation((res) => {
    const resJson = JSON.parse(res);
    console.log('定位结果:', resJson);
    const address = resJson?.placeName || resJson?.locality;
    if (callBack) {
      callBack(address);
      return;
    }
    if (index !== null) {
      formState.hazardList[index].area = address;
    } else {
      formState.hazardList.forEach(hazard => {
        hazard.area = address;
      });
    }
  });
};

// 格式化文件数据，提取response中的信息
const formatFileList = (files) => {
  if (!files || files.length === 0) return [];
  return files.map(file => ({
    url: file.response?.url || file.url,
    name: file.response?.name || file.name,
    type: file.type
  }));
};


const formRef = ref(null);
const handleSubmit = async () => {
  try {
    if (!formRef.value) return;
    await formRef.value.validate();

    if (formState.hazardList.length === 0) {
      message.error('请至少添加一个隐患信息！');
      return;
    }

    for (let i = 0; i < formState.hazardList.length; i++) {
      const hazard = formState.hazardList[i];

      if (!hazard.hazardName) {
        message.error(`隐患 ${i + 1} 的隐患名称不能为空！`);
        return;
      }
      if (!hazard.hazardDesc) {
        message.error(`隐患 ${i + 1} 的隐患描述不能为空！`);
        return;
      }

      if (!hazard.area) {
        message.error(`隐患 ${i + 1} 的隐患地点不能为空！`);
        return;
      }

      if (!hazard.hazardLevel) {
        message.error(`隐患 ${i + 1} 的隐患等级不能为空！`);
        return;
      }

      if (!hazard.hazardType) {
        message.error(`隐患 ${i + 1} 的隐患类型不能为空！`);
        return;
      }

      if (hazard.images.length === 0 && hazard.videos.length === 0) {
        message.error(`隐患 ${i + 1} 必须上传图片或视频！`);
        return;
      }
    }

    if (!formState.orderName) {
      message.error('请输入工单名称！');
      return;
    }

    if (!formState.registerTime) {
      message.error('请选择填报时间！');
      return;
    }

    // if (!formState.deadline) {
    //   message.error('请选择整改期限！');
    //   return;
    // }

    if (!formState.registerPerson) {
      message.error('请输入填报人员！');
      return;
    }
    // 直接提交，不选择整改人
    saveHandle();
  } catch (error) {
    console.error('表单验证失败:', error);
    if (error && formRef.value) {
      for (let i = 0; i < error.errorFields.length; i++) {
        const field = error.errorFields[i].name;
        formRef.value.scrollToField(field[0], {
          block: 'center'
        });
        break;
      }
    }
  }
};


const saveHandle = async () => {
  // 格式化工单级别的文件数据
  const formattedImages = formatFileList(formState.images);
  const formattedVideos = formatFileList(formState.videos);
  // 格式化隐患列表中的文件数据
  const formattedHazardList = formState.hazardList.map(hazard => ({
    ...hazard,
    images: formatFileList(hazard.images),
    videos: formatFileList(hazard.videos)
  }));
  const hiddenDanger = {
    status: 'hazard_auditing',
    ...formState,
    fillType: fillMode.value,
    images: formattedImages,
    videos: formattedVideos,
    hazardList: formattedHazardList
  };

  // 如果有 id，调用更新接口；否则调用新增接口
  let res;
  if (route.query.id) {
    hiddenDanger.id = route.query.id;
    res = await updateHazard(hiddenDanger);
    if (res.code === 200) {
      message.success('工单修改成功！');
    }
  } else {
    res = await saveHazard(hiddenDanger);
    if (res.code === 200) {
      message.success('工单创建成功！');
    }
  }

  if (res.code === 200) {
    setTimeout(() => {
      router.back();
    }, 1000);
  }
};



const loadHazardData = async () => {
  if (route.query.id) {
    try {
      const res = await getHazardList({ order_id: route.query.id });
      if (res.code === 200 && res.data) {
        const data = res.data

        // 设置表单数据
        formState.id = data.id;
        formState.orderName = data.orderName || '';
        formState.deadline = data.deadline
        formState.registerPerson = data.registerPerson || userInfo.value?.name || '';
        formState.registerPersonId = data.registerPersonId || userInfo.value?.id || '';
        formState.registerTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

        // 初始化工单附件
        formState.images = (data.images || []).map(img => ({
          url: img.url,
          name: img.name,
          uid: img.uid || Date.now() + Math.random(),
          status: 'done',
          response: { url: img.url }
        }));

        formState.videos = (data.videos || []).map(video => ({
          url: video.url,
          name: video.name,
          uid: video.uid || Date.now() + Math.random(),
          status: 'done',
          response: { url: video.url }
        }));

        // 初始化隐患列表
        if (data.hazardList && data.hazardList.length > 0) {
          formState.hazardList = data.hazardList.map(hazard => ({
            ...hazard,
            images: (hazard.images || []).map(img => ({
              url: img.url,
              name: img.name,
              uid: img.uid || Date.now() + Math.random(),
              status: 'done',
              response: { url: img.url }
            })),
            videos: (hazard.videos || []).map(video => ({
              url: video.url,
              name: video.name,
              uid: video.uid || Date.now() + Math.random(),
              status: 'done',
              response: { url: video.url }
            })),
            expanded: true
          }));
        } else {
          formState.hazardList = [createEmptyHazard()];
        }
      }
    } catch (error) {
      console.error('获取工单数据失败:', error);
      message.error('获取工单数据失败，请重试！');
    }
  }
};

// ==================== 参考内容相关 ====================
const showReferenceModal = ref(false);
const referenceModalTitle = ref('参考内容');
const hazardReference = ref({});
const isReplaceAll = ref(false);
const currentHazardIndex = ref(-1);

// 参考内容schema（响应式，带checked字段）
const referenceSchema = ref([
  { key: 'hazardName', label: '隐患名称', checked: false },
  { key: 'hazardDesc', label: '隐患描述', checked: false },
  { key: 'hazardLevel', label: '隐患级别', checked: false },
  { key: 'hazardType', label: '隐患类型', checked: false },
  { key: 'basisRule', label: '依据规则', checked: false },
  { key: 'rectifySuggestion', label: '整改建议', checked: false },
  { key: 'penaltyStandard', label: '处罚标准', checked: false },
  { key: 'images', label: '隐患图片', checked: false }
]);

// 打开参考内容弹窗
const openReferenceContent = (hazard, index) => {
  currentHazardIndex.value = index;
  hazardReference.value = { ...hazard };
  if (hazard.referenceContent) {
    const content = typeof hazard.referenceContent === 'string'
      ? JSON.parse(hazard.referenceContent)
      : hazard.referenceContent;
    hazardReference.value.referenceContent = content;
  }
  referenceModalTitle.value = hazard.hazardName + '-参考内容';
  showReferenceModal.value = true;
};

// 处理"全部"勾选
const handleReplaceAllChange = () => {
  referenceSchema.value.forEach(item => {
    item.checked = isReplaceAll.value;
  });
};

// 检查勾选状态
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

// 确认替换
const handleReferenceReplace = () => {
  const checkedItems = referenceSchema.value.filter(item => item.checked);

  if (checkedItems.length === 0) {
    message.warning('请至少选择一项进行替换');
    return;
  }

  const currentHazard = formState.hazardList[currentHazardIndex.value];

  if (currentHazard) {
    checkedItems.forEach(item => {
      const key = item.key;
      const value = hazardReference.value.referenceContent?.[key];

      if (value !== undefined && value !== null) {
        if (key === 'images') {
          // 处理图片替换
          currentHazard.images = (value || []).map(img => ({
            url: img.url,
            name: img.name || '图片',
            uid: img.uid || Date.now() + Math.random(),
            status: 'done',
            response: { url: img.url }
          }));
        } else {
          // 处理其他字段替换
          currentHazard[key] = value;
        }
      }
    });

    message.success('参考内容替换成功');
  }

  showReferenceModal.value = false;
  resetReferenceModal();
};

// 取消
const handleReferenceCancel = () => {
  showReferenceModal.value = false;
  resetReferenceModal();
};

// 重置参考内容弹窗
const resetReferenceModal = () => {
  isReplaceAll.value = false;
  currentHazardIndex.value = -1;
  // 重置schema中的checked状态
  referenceSchema.value.forEach(item => {
    item.checked = false;
  });
  hazardReference.value = {};
};

onMounted(() => {
  loadHazardData();
});

onBeforeUnmount(() => {
  // 组件卸载时终止进行中的AI识别请求
  if (aiAnalyzeController.value) {
    aiAnalyzeController.value.abort();
    aiAnalyzeController.value = null;
  }
});
</script>

<style lang="scss" scoped>
.create-order {
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.location-icon {
  cursor: pointer;
  color: #1890ff;
  font-size: 18px;
  transition: all 0.3s ease;

  &:hover {
    color: #40a9ff;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

.main-content {
  padding: 16px;
  // max-width: 600px;
  margin: 0 auto;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .upload-section {
    margin-bottom: 24px;
  }

  .hazard-list {
    .hazard-item {
      margin-bottom: 24px;
      padding: 20px;
      border: 1px solid #e8e8e8;
      border-radius: 12px;
      background: #fafafa;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .hazard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #e8e8e8;

        .hazard-title {
          font-size: 16px;
          font-weight: 600;
          color: #1890ff;
        }

        .hazard-actions {
          display: flex;
          gap: 8px;
          align-items: center;

          .toggle-btn {
            color: #1890ff;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            font-size: 13px;
            transition: all 0.3s ease;

            &:hover {
              background: #e6f7ff;
              color: #40a9ff;
            }
          }
        }
      }

      .hazard-content {
        transition: all 0.3s ease;
        overflow: hidden;
      }
    }
  }

  .add-hazard-section {
    margin: 20px 0;

    .add-hazard-btn {
      border-radius: 8px;
      border: 2px dashed #1890ff;
      color: #1890ff;
      background: #f0f9ff;
      height: 42px;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        background: #e6f7ff;
        border-color: #40a9ff;
        color: #40a9ff;
      }
    }
  }

  .common-fields {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e8e8e8;

    .attachment-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .attachment-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 8px;
        background: #f5f7fa;
        border: 1px solid #e8e8e8;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #e6f7ff;
          border-color: #1890ff;
          transform: translateX(4px);
        }

        &:active {
          transform: translateX(2px);
        }

        .attachment-icon {
          font-size: 20px;
          color: #1890ff;
          flex-shrink: 0;
        }

        .attachment-name {
          flex: 1;
          font-size: 14px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }

        .attachment-remove {
          font-size: 16px;
          color: #ff4d4f;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;

          &:hover {
            transform: scale(1.2);
            color: #ff7875;
          }
        }
      }

      .attachment-upload-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 16px;
        border-radius: 8px;
        background: #f0f9ff;
        border: 2px dashed #1890ff;
        color: #1890ff;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #e6f7ff;
          border-color: #40a9ff;
          color: #40a9ff;
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
        }

        span {
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }

  :deep(.ant-form) {
    .ant-form-item {
      margin-bottom: 20px;

      .ant-form-item-label {
        font-weight: 500;
        color: #333;

        >label {
          height: auto;
        }
      }

      .ant-input,
      .ant-select-selector {
        border-radius: 8px;
        border: 1px solid #d9d9d9;

        &:focus,
        &.ant-select-focused {
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        }

        .ant-input,
        .ant-select-selector,
        .ant-input-number {
          font-size: 15px;
        }
      }
    }

    .ant-radio-group {
      .ant-radio-button-wrapper {
        border-radius: 6px;
        margin-right: 12px;

        &:first-child {
          border-radius: 6px;
        }

        &:last-child {
          border-radius: 6px;
        }
      }
    }

    .ant-upload-picture-card-wrapper {
      .ant-upload-list {
        .ant-upload-list-item {
          border-radius: 8px;
        }
      }

      .ant-upload {
        border-radius: 8px;
        border: 2px dashed #d9d9d9;
        transition: all 0.3s ease;

        &:hover {
          border-color: #1890ff;
        }
      }
    }
  }
}

// 科技感炫酷按钮样式
.ai-tech-button {
  margin: 20px 0;
  cursor: pointer;
  position: relative;
  display: inline-block;

  .button-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px 32px;
    border-radius: 50px;
    background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
    color: white;
    font-size: 16px;
    font-weight: 600;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 198, 251, 0.4);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 198, 251, 0.6);

      &::before {
        left: 100%;
      }

      .icon-wrapper {
        transform: rotate(360deg);
      }

      .button-glow {
        opacity: 1;
        transform: scale(1.2);
      }
    }

    &:active {
      transform: translateY(-1px);
    }
  }

  .icon-wrapper {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.6s ease;

    svg {
      width: 24px;
      height: 24px;
      color: white;
    }
  }

  .button-text {
    position: relative;
    z-index: 2;
  }

  .button-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1;
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  border-top: 1px solid #e8e8e8;
  background-color: #fff;
  padding: 10px;

  .cancel-btn {
    flex: 1;
    height: 42px;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 500;
    border: 1px solid #d9d9d9;

    &:hover {
      border-color: #40a9ff;
      color: #40a9ff;
    }
  }

  .submit-btn {
    flex: 1;
    height: 42px;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 500;
    background: linear-gradient(90deg, #1890ff 0%, #36cfc9 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
    }
  }
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  padding: 0 20px;
  width: 100%;

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
    max-width: 120px;

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e8e8e8;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .step-text {
      font-size: 13px;
      color: #999;
      text-align: center;
      line-height: 1.4;
      transition: all 0.3s ease;
    }

    &.active {
      .step-number {
        background: #1890ff;
        color: #fff;
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
      }

      .step-text {
        color: #1890ff;
        font-weight: 500;
      }
    }

    &.completed {
      .step-number {
        background: #52c41a;
        color: #fff;
      }

      .step-text {
        color: #52c41a;
      }
    }
  }

  .step-line {
    flex: 1;
    height: 2px;
    background: #e8e8e8;
    margin: 0 8px;
    transition: all 0.3s ease;

    &.active {
      background: #52c41a;
    }
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 12px;
  }

  .form-container {
    padding: 16px;

    :deep(.ant-form) {
      .ant-form-item {
        margin-bottom: 16px;
      }
    }

    .form-actions {
      margin-top: 24px;
      padding-top: 20px;
      gap: 10px;

      .cancel-btn,
      .submit-btn {
        height: 44px;
        font-size: 15px;
      }
    }
  }
}

@media (min-width: 768px) {
  .main-content {
    padding: 24px;
  }

  .form-container {
    padding: 32px;
  }
}

// 文件信息弹窗样式
.file-info-modal {
  :deep(.ant-modal-content) {
    border-radius: 16px;
    overflow: hidden;
  }

  :deep(.ant-modal-header) {
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;

    .ant-modal-title {
      font-size: 18px;
      font-weight: 600;
    }
  }

  :deep(.ant-modal-body) {
    padding: 24px;
  }

  .file-info-content {
    .file-preview {
      width: 100%;
      height: 200px;
      border-radius: 12px;
      overflow: hidden;
      background: #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      position: relative;

      .recognized-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
        color: #fff;
        padding: 5px 12px;
        border-radius: 16px;
        font-size: 11px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(238, 90, 90, 0.4);
        z-index: 10;
        display: flex;
        align-items: center;
        gap: 3px;

        &::before {
          content: '🔍';
          font-size: 12px;
        }
      }

      img,
      video {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .file-icon {
        font-size: 64px;
        opacity: 0.5;
      }
    }

    .ai-result-summary {
      padding: 16px;
      background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
      border-radius: 12px;
      border: 1px solid #b8d4ff;
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 20px;

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
          border-radius: 8px;
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
                min-width: 70px;
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
      margin-bottom: 20px;

      .file-list-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin-bottom: 12px;
      }

      .file-list-items {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .file-list-item {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;

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
            top: 2px;
            right: 2px;
            font-size: 14px;
            color: #ff4d4f;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            padding: 2px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;

            &:hover {
              transform: scale(1.2);
              background: #fff;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }
          }
        }
      }
    }

    .file-details {
      background: #f5f7fa;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;

      .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        border-bottom: 1px solid #e8e8e8;

        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        &:first-child {
          padding-top: 0;
        }

        .label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .value {
          font-size: 14px;
          color: #333;
          font-weight: 600;
          text-align: right;
          max-width: 60%;
          word-break: break-all;
        }
      }
    }

    .continue-upload-btn {
      height: 42px;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 600;
      background: #fff;
      border: 2px solid #1890ff;
      color: #1890ff;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
      transition: all 0.3s ease;
      margin-bottom: 12px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
        background: #f0f9ff;
      }

      &:disabled {
        background: #f5f7fa;
        border-color: #d9d9d9;
        color: #d9d9d9;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
      }

      .btn-icon {
        margin-right: 8px;
        font-size: 18px;
      }
    }

    .cancel-analyze-btn {
      border-radius: 24px;
      height: 42px
    }

    .ai-analyze-btn {
      height: 42px;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
      border: none;
      box-shadow: 0 4px 15px rgba(0, 198, 251, 0.4);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 198, 251, 0.6);
      }

      .btn-icon {
        margin-right: 8px;
        font-size: 18px;
      }
    }

    .confirm-edit-btn {
      height: 42px;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
      border: none;
      box-shadow: 0 4px 15px rgba(82, 196, 26, 0.4);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(82, 196, 26, 0.6);
      }
    }

    .re-analyze-btn {
      height: 42px;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 600;
      background: #fff;
      border: 1px solid #d9d9d9;
      transition: all 0.3s ease;

      &:hover {
        border-color: #1890ff;
        color: #1890ff;
      }
    }
  }
}

.location-input {
  :deep(.ant-input) {
    border: none !important;
    border-radius: 0px !important;
  }
}

.loading-icon {
  svg {
    width: 24px;
    height: 24px;
  }
}

// 用户列表样式
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

// 参考内容弹窗样式
.reference-modal {
  .reference-content {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 2px;

      &:hover {
        background: #a8a8a8;
      }
    }
  }
}
</style>