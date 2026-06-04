<template>
  <Modal :open="visible" 
  @update:open="emit('update:visible', $event)" title="隐患AI复核" width="90%" :footer="null"
  @cancel="handleClose"
    wrapClassName="ai-review-modal-wrapper">
    <div v-if="props.isReviewing" class="py-8 min-h-[300px]">
      <div class="flex flex-col items-center justify-center">
        <div class="mb-4">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500 animate-spin">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>
        <div class="text-lg font-medium mb-2">AI识别中...</div>
      </div>
    </div>
    <div v-else class="py-4">
      <!-- 错误提示 -->
      <div v-if="props.reviewResults.filter(item => item.error).length"
        class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="text-base font-medium text-red-700">
          识别失败：{{props.reviewResults.filter(item => item.error).length}} 项
        </div>
        <div class="text-sm text-red-600">
          部分隐患AI识别失败，请检查文件后重试
        </div>
      </div>

      <!-- 隐患列表（上下布局，适合移动端） -->
      <div class="max-h-[60vh] overflow-y-auto">
        <div class="text-sm font-medium text-[#4362EF] py-2 px-3 mb-2 border-b border-slate-200 bg-slate-50 rounded">
          隐患信息（共 {{ detailData.hazardList?.length || 0 }} 项）
        </div>

        <div v-for="(hazard, index) in detailData.hazardList" :key="index" :class="[
          'mb-4 rounded-lg overflow-hidden transition-all duration-200',
          selectedHazardIndex === index
            ? 'border-blue-400 shadow-md '
            : 'border border-slate-200'
        ]" style="border-width: 2px;" @click="handleHazardClick(index)">
          <!-- 隐患标题 -->
          <div class="bg-slate-50 py-2 px-3 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center">
              <span class="inline-block w-5 h-5 rounded-full bg-[#4362EF] text-white text-center text-xs leading-5 font-medium mr-2">{{ index + 1 }}</span>
              <span class="font-medium text-gray-800 text-sm">{{ hazard.hazardName }}</span>
            </div>
            <span v-if="props.reviewResults[index]?.error" class="text-xs text-red-600">识别失败</span>
            <span v-else-if="props.reviewResults[index]?.data" class="text-xs text-green-600">识别完成</span>
          </div>

          <div class="p-3">
            <!-- 原始隐患信息 -->
            <div class="mb-3 pb-3 border-b border-slate-100">
              <div class="text-xs font-medium text-slate-500 mb-2">原始信息</div>
              <div class="mb-1 text-xs text-gray-600"><span class="font-[600]">隐患描述：</span>
                <span :class="!hazard.hazardDesc ? 'text-gray-400' : ''">{{ hazard.hazardDesc || "--" }}</span>
              </div>
              <div class="mb-1 text-xs text-gray-600"><span class="font-[600]">隐患级别：</span><span
                  :class="!hazard.hazardLevel ? 'text-gray-400' : ''">{{ hazard.hazardLevel || "--" }}</span></div>
              <div class="mb-1 text-xs text-gray-600"><span class="font-[600]">隐患类型：</span><span
                  :class="!hazard.hazardType ? 'text-gray-400' : ''">{{ hazard.hazardType || "--" }}</span></div>
              <div class="mb-1 text-xs text-gray-600"><span class="font-[600]">整改建议：</span><span
                  :class="!hazard.rectifySuggestion ? 'text-gray-400' : ''">{{ hazard.rectifySuggestion || "--"
                  }}</span></div>
              <template v-if="hazard.images && hazard.images.length">
                <div class="mb-1 text-xs text-gray-600"><span class="font-[600]">隐患图片：</span></div>
                <div class="mb-2 flex flex-wrap gap-2">
                  <Image v-for="(image, imgIndex) in hazard.images" :key="imgIndex" :src="image.url"
                    style="width:80px;height:80px;object-fit:cover;border-radius:4px" />
                </div>                
              </template>
            </div>

            <!-- AI识别结果 -->
            <div>
              <div class="text-xs font-medium text-emerald-600 mb-2 flex items-center">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                AI识别结果
              </div>
              
              <!-- 识别成功 -->
              <div v-if="props.reviewResults[index] && !props.reviewResults[index].error && props.reviewResults[index].data">
                <div v-if="Object.keys(props.reviewResults[index].data).length">
                  <div class="mb-2 p-2 bg-slate-50 rounded">
                    <div class="mb-1 text-xs text-gray-600">
                      <span class="font-[600] text-slate-500">复核结论：</span>
                      <span class="text-gray-600">
                        {{ props.reviewResults[index].data.comparisonConclusion || "--" }}
                      </span>
                      <span v-if="props.reviewResults[index].data.comparisonConclusion"
                        class="text-[#0070FF] text-[10px] cursor-pointer ml-1"
                        v-copy="props.reviewResults[index].data.comparisonConclusion" @copy-success="onCopySuccess()"
                        @copy-error="onCopyError()">复制</span>
                    </div>
                    <div class="mb-1 text-xs">
                      <span class="font-[600] text-slate-500">是否有新隐患：</span>
                      <span :class="props.reviewResults[index].data.hasNewHazards ? 'text-red-500' : 'text-green-500'">
                        {{ props.reviewResults[index].data.hasNewHazards ? '是' : '否' }}
                      </span>
                    </div>
                    <div v-if="props.reviewResults[index].data.newHazards && props.reviewResults[index].data.newHazards.length" class="mb-1 text-xs">
                      <span class="font-[600] text-slate-500">新增隐患：</span>
                      <div class="mt-1 pl-2 space-y-1">
                        <div v-for="(hazard, idx) in props.reviewResults[index].data.newHazards" :key="idx"
                          class="text-xs text-gray-600">
                          {{ idx + 1 }}. {{ hazard }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- AI识别详情 -->
                  <div class="p-2 bg-emerald-50/50 rounded" v-if="props.reviewResults[index].data.hasNewHazards">
                    <div class="mb-1 text-xs text-gray-600">
                      <span class="font-[600] text-slate-500">隐患名称：</span>
                      <span class="text-gray-600">{{ props.reviewResults[index].data.hazardName || "--" }}</span>
                    </div>
                    <div class="mb-1 text-xs text-gray-600">
                      <span class="font-[600] text-slate-500">隐患类型：</span>
                      <span class="text-gray-600">{{ props.reviewResults[index].data.hazardType || "--" }}</span>
                    </div>
                    <div class="mb-1 text-xs text-gray-600">
                      <span class="font-[600] text-slate-500">隐患级别：</span>
                      <span class="text-gray-600">{{ props.reviewResults[index].data.hazardLevel || "--" }}</span>
                    </div>
                    <div class="mb-1 text-xs text-gray-600">
                      <span class="font-[600] text-slate-500">隐患描述：</span>
                      <span class="text-gray-600">{{ props.reviewResults[index].data.hazardDesc || "--" }}</span>
                    </div>
                    <div class="mb-1 text-xs text-gray-600">
                      <span class="font-[600] text-slate-500">整改建议：</span>
                      <span class="text-gray-600">{{ props.reviewResults[index].data.rectifySuggestion || "--" }}</span>
                    </div>

                    <!-- AI识别图片 -->
                    <div v-if="props.reviewResults[index].data.imageUrls && props.reviewResults[index].data.imageUrls.length" class="mt-2">
                      <span class="font-[600] text-slate-500 text-xs">AI识别图片：</span>
                      <div class="flex flex-wrap gap-2 mt-1">
                        <div v-for="(url, idx) in props.reviewResults[index].data.imageUrls" :key="idx" class="relative">
                          <Image :src="url" style="width:80px;height:80px;object-fit:cover;border-radius:4px" />
                          <span class="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] px-1 rounded">
                            AI
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="p-3 bg-green-50 rounded text-center">
                  <span class="text-green-600 text-xs">未识别到隐患</span>
                </div>
              </div>

              <!-- 识别失败 -->
              <div v-else-if="props.reviewResults[index] && props.reviewResults[index].error" class="p-3 bg-red-50 rounded text-center">
                <span class="text-red-600 text-xs">AI识别失败，请重试</span>
              </div>

              <!-- 未识别 -->
              <div v-else class="p-3 bg-gray-50 rounded text-center">
                <span class="text-gray-400 text-xs">待识别</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
        <Button @click="handleApprove" type="primary" size="small">通过</Button>
        <Button @click="handleReject" danger size="small">拒绝</Button>
        <Button @click="handleClose" size="small">关闭</Button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { Button, Modal, Image, message } from 'ant-design-vue';

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  detailData: {
    type: Object,
    default: () => ({
      hazardList: []
    })
  },
  isReviewing: {
    type: Boolean,
    default: false
  },
  reviewResults: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['update:visible', 'import-reference', 'approve', 'reject']);

// ==================== 隐患AI复核相关状态 ====================
const selectedHazardIndex = ref(null);
const aiResultRefs = ref([]);

// 监听visible变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    selectedHazardIndex.value = 0;
  }
});

// 监听reviewResults变化，自动选中第一个
watch(() => props.reviewResults, (newVal) => {
  if (newVal && newVal.length > 0) {
    selectedHazardIndex.value = 0;
  }
}, { immediate: true });

// 方法
const handleHazardClick = (index) => {
  selectedHazardIndex.value = index;
  nextTick(() => {
    const targetElement = aiResultRefs.value[index];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
};

const handleClose = () => {
  emit('update:visible', false);
  selectedHazardIndex.value = null;
  aiResultRefs.value = [];
};

// 处理通过按钮点击事件
const handleApprove = () => {
  emit('approve', true);
};

const handleReject = () => {
  emit('reject', true);
};

const onCopySuccess = () => {
  message.success('复制成功');
};

const onCopyError = () => {
  message.error('复制失败');
};

const handleImportReference = (index) => {
  const reviewResult = props.reviewResults[index];
  if (reviewResult && reviewResult.data) {
    const { hazardName, hazardType, hazardLevel, hazardDesc, rectifySuggestion, penaltyStandard, basisRule, imageUrls } = reviewResult.data;
    
    const referenceContent = {
      hazardName: hazardName || "",
      hazardType: hazardType || "",
      hazardLevel: hazardLevel || "",
      hazardDesc: hazardDesc || "",
      rectifySuggestion: rectifySuggestion || "",
      penaltyStandard: penaltyStandard || "",
      basisRule: basisRule || "",
      images: (imageUrls || []).map(url => ({
        url,
        name: url.split('/').pop(),
        type: url.split('.').pop() === 'mp4' ? 'video/mp4' : 'image/jpeg',
      }))
    };
    emit('import-reference', index, referenceContent);
  } else {
    message.error('暂无参考内容可导入');
  }
};
</script>

<style lang="scss" scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
