<template>
  <Modal :open="visible" 
  @update:open="emit('update:visible', $event)" title="隐患AI复核" width="70%" :footer="null"
  @cancel="handleClose"
    wrapClassName="ai-review-modal-wrapper">
    <div v-if="isReviewing" class="py-8 min-h-[500px]">
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
      <div v-if="reviewResults.filter(item => item.error).length"
        class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="text-base font-medium text-red-700">
          识别失败：{{reviewResults.filter(item => item.error).length}} 项
        </div>
        <div class="text-sm text-red-600">
          部分隐患AI识别失败，请检查文件后重试
        </div>
      </div>

      <!-- 左右对比布局 -->
      <div class="h-[70vh] overflow-hidden flex">
        <!-- 左边：原始隐患列表项详情 -->
        <div class="flex-1 h-full overflow-y-auto border border-slate-100">
          <div class="text-sm font-medium text-[#4362EF] py-3 px-5
          mb-[16px] border-b border-slate-200 bg-slate-50">
            原始隐患信息（共 {{ detailData.hazardList?.length || 0 }} 项）
          </div>

          <div v-for="(hazard, index) in detailData.hazardList" :key="index" :class="[
            'mb-6 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 mx-4',
            selectedHazardIndex === index
              ? 'border-blue-400 shadow-md '
              : 'border border-blue-200'
          ]" style="border-width: 2px;" @click="handleHazardClick(index)">
            <div class="bg-blue-50 py-[12px] px-[16px] border-b border-slate-100 bg-slate-50/50">
              <div class="flex items-center">
                <span
                  class="inline-block w-2 h-2 rounded-full bg-[#4362EF] text-white text-center text-[10px] font-medium mr-[8px]"></span>
                <span class="font-medium text-gray-800">{{ hazard.hazardName }}</span>
              </div>
            </div>

            <div class="p-4">
              <div class="mb-2 text-sm text-gray-600"><span class="font-[600]">隐患描述：</span>
                <span :class="!hazard.hazardDesc ? 'text-gray-400' : ''">{{ hazard.hazardDesc || "--" }}</span>
              </div>
              <div class="mb-2 text-sm text-gray-600"><span class="font-[600]">隐患级别：</span><span
                  :class="!hazard.hazardLevel ? 'text-gray-400' : ''">{{ hazard.hazardLevel || "--" }}</span></div>
              <div class="mb-2 text-sm text-gray-600"><span class="font-[600]">隐患类型：</span><span
                  :class="!hazard.hazardType ? 'text-gray-400' : ''">{{ hazard.hazardType || "--" }}</span></div>
              <div class="mb-2 text-sm text-gray-600"><span class="font-[600]">判断依据：</span><span
                  :class="!hazard.basisRule ? 'text-gray-400' : ''">{{ hazard.basisRule || "--" }}</span></div>
              <div class="mb-2 text-sm text-gray-600"><span class="font-[600]">整改建议：</span><span
                  :class="!hazard.rectifySuggestion ? 'text-gray-400' : ''">{{ hazard.rectifySuggestion || "--"
                  }}</span></div>
              <div class="mb-2 text-sm text-gray-600"><span class="font-[600]">处罚标准：</span>
                <span :class="!hazard.penaltyStandard ? 'text-gray-400' : ''"
                  class="rounded bg-amber-50 text-xs leading-relaxed !text-amber-800 !dark:bg-amber-950/30 !dark:text-amber-200">{{
                    hazard.penaltyStandard || "--" }}</span>
              </div>
              <template v-if="hazard.images && hazard.images.length">
                <div class="mb-2 text-sm text-gray-600"><span class="font-[600]">隐患图片：</span></div>
                <div class="mb-4 flex flex-wrap gap-2">
                  <div>
                    <Image v-for="(image, imgIndex) in hazard.images" :key="imgIndex" :src="image.url"
                      style="width:100px;height:100px;object-fit:cover;border-radius:4px;margin-right:8px" />
                  </div>
                </div>                
              </template>
              <template v-if="hazard.videos && hazard.videos.length">
                <div class="mb-2 text-sm text-gray-600"><span class="font-[600]">隐患视频：</span></div>
                <div class="mb-4 flex flex-wrap gap-2">
                  <div v-if="hazard.videos && hazard.videos.length">
                    <div class="cursor-pointer text-[#4362EF]" @click.stop="lookVideo(video)"
                    v-for="(video, videoIndex) in hazard.videos" :key="videoIndex">
                      {{ video.name }}
                    </div>
                  </div>
                </div>                
              </template>
            </div>
          </div>
        </div>

        <!-- 中间连接箭头 -->
        <div class="flex items-center justify-center w-12 bg-gradient-to-b from-blue-50 to-emerald-50">
          <div class="flex flex-col items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
            <span class="text-xs text-slate-500 writing-vertical">AI分析</span>
          </div>
        </div>

        <!-- 右边：AI识别结果 -->
        <div class="flex-1 h-full overflow-y-auto border border-slate-100">
          <div class="text-sm text-[#4362EF] font-medium px-5 py-3 border-b
           border-slate-200 bg-slate-50 mb-[16px]">
            AI识别结果（共 {{ detailData.hazardList?.length || 0 }} 项）
          </div>

          <div v-for="(hazard, index) in detailData.hazardList" :key="index"
            :ref="el => { if (el) aiResultRefs[index] = el }" :class="[
              'mb-6 rounded-lg overflow-hidden transition-all duration-200 border-emerald-200 mx-4',
              selectedHazardIndex === index
                ? 'border-green-400 shadow-md'
                : 'border-emerald-200'
            ]" style="border-width: 2px;">
            <div class="py-[12px] px-[16px] border-b border-slate-100 bg-emerald-50/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span
                    class="inline-block w-2 h-2 rounded-full bg-emerald-500 text-white text-center text-[10px] font-medium mr-[8px]"></span>
                  <span class="font-medium text-gray-800">{{ hazard.hazardName }}</span>
                </div>
                <span v-if="reviewResults[index]?.error" class="text-red-600 text-sm">
                  识别失败
                </span>
              </div>
            </div>

            <div class="p-4">
              <!-- 识别成功 -->
              <div v-if="reviewResults[index] && !reviewResults[index].error">
                <div v-if="reviewResults[index].data && Object.keys(reviewResults[index].data).length">
                  <div class="mb-4 p-3">
                    <div class="mb-2 text-sm text-gray-600">
                      <span class="font-[600] text-slate-500">复核结论：</span>
                      <span class="text-gray-600">
                        {{ reviewResults[index].data.comparisonConclusion || "--" }}
                      </span>
                      <span v-if="reviewResults[index].data.comparisonConclusion"
                        class="text-[#0070FF] text-[12px] cursor-pointer ml-[4px]"
                        v-copy="reviewResults[index].data.comparisonConclusion" @copy-success="onCopySuccess()"
                        @copy-error="onCopyError()">复制</span>
                    </div>
                    <div class="mb-2 text-s">
                      <span class="font-[600] text-slate-500">是否有新隐患：</span>
                      <span :class="reviewResults[index].data.hasNewHazards ? 'text-red-500' : 'text-green-500'">
                        {{ reviewResults[index].data.hasNewHazards ? '是' : '否' }}
                      </span>
                    </div>
                    <div class="mb-2 text-sm" v-if="reviewResults[index].data.newHazards && reviewResults[index].data.newHazards.length">
                      <span class="font-[600] text-slate-500">新增隐患：</span>
                      <div
                        class="mt-1 pl-4 space-y-1">
                        <div v-for="(hazard, idx) in reviewResults[index].data.newHazards" :key="idx"
                          class="text-sm text-gray-600">
                          {{ idx + 1 }}. {{ hazard }}
                        </div>
                        <div class="flex justify-end items-center">
                          <span v-if="reviewResults[index].data.newHazards?.length"
                          class="text-[#0070FF] text-[12px] cursor-pointer ml-[4px]"
                          v-copy="reviewResults[index].data.newHazards.join('\n')" @copy-success="onCopySuccess()"
                          @copy-error="onCopyError()">复制</span>
                        </div>
                      </div>
                    </div>

                    <!-- 隐患详情 -->
                    <div class="mb-4 p-3 bg-slate-50 rounded-lg" v-if="reviewResults[index].data.hasNewHazards">
                      <div class="flex justify-between">
                        <div class="text-lg font-medium mb-4 text-[#4362EF]">AI隐患表单</div>
                        <!-- <div class="text-sm text-[#0070FF] cursor-pointer" @click="handleImportReference(index)">导入参考内容</div> -->
                      </div>

                      <div class="mb-2 text-sm">
                        <span class="font-[600] text-slate-500">隐患名称：</span>
                        <span class="text-gray-600">
                          {{ reviewResults[index].data.hazardName || "--" }}
                        </span>
                      </div>

                      <div class="mb-2 text-sm">
                        <span class="font-[600] text-slate-500">隐患文件：</span>
                        <div v-if="reviewResults[index].data.imageUrls && reviewResults[index].data.imageUrls.length"
                          class="flex flex-wrap mt-2">
                          <div v-for="(url, idx) in reviewResults[index].data.imageUrls" :key="idx"
                            class="mr-4 mb-4 relative w-fit">
                            <Image :src="url" style="width:100px;height:100px;object-fit:cover;border-radius:4px" />
                            <span
                              class="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded">
                              AI
                            </span>
                          </div>
                        </div>
                      </div>


                      <div class="mb-2 text-sm">
                        <span class="font-[600] text-slate-500">隐患类型：</span>
                        <span class="text-gray-600">
                          {{ reviewResults[index].data.hazardType || "--" }}
                        </span>
                      </div>
                      <div class="mb-2 text-sm">
                        <span class="font-[600] text-slate-500">隐患级别：</span>
                        <span class="text-gray-600">
                          {{ reviewResults[index].data.hazardLevel || "--" }}
                        </span>
                      </div>
                      <div class="mb-2 text-sm">
                        <span class="font-[600] text-slate-500">隐患描述：</span>
                        <span class="text-gray-600">
                          {{ reviewResults[index].data.hazardDesc || "--" }}
                        </span>
                      </div>
                      <div class="mb-2 text-sm">
                        <span class="font-[600] text-slate-500">整改建议：</span>
                        <span class="text-gray-600">
                          {{ reviewResults[index].data.rectifySuggestion || "--" }}
                        </span>
                      </div>
                      <div class="mb-2 text-sm">
                        <span class="font-[600] text-slate-500">处罚标准：</span>
                        <span class="text-gray-600">
                          {{ reviewResults[index].data.penaltyStandard || "--" }}
                        </span>
                      </div>
                      <div class="mb-2 text-sm">
                        <span class="font-[600] text-slate-500">判断依据：</span>
                        <span class="text-gray-600">
                          {{ reviewResults[index].data.basisRule || "--" }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="p-4 bg-green-50 rounded-lg text-center">
                  <span class="mr-2 text-[20px] text-green-600">
                    <CheckCircleOutlined />
                  </span>
                  <span class="text-gray-600">未识别到隐患</span>
                </div>
              </div>

              <!-- 识别失败 -->
              <div v-else-if="reviewResults[index] && reviewResults[index].error"
                class="p-4 bg-red-50 rounded-lg text-center">
                <span class="mr-2 text-[20px] text-red-600">
                  <CloseCircleOutlined />
                </span>
                <span class="text-red-600">AI识别失败，请重试</span>
              </div>

              <!-- 未识别 -->
              <div v-else class="p-4 bg-gray-50 rounded-lg text-center">
                <span class="text-gray-400">待识别</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4 clear-both">
        <!-- <Button @click="handleBatchImport" type="primary">一键导入参考内容</Button> -->
        <Button @click="handleApprove" type="primary">通过</Button>
        <Button @click="handleReject" danger>拒绝</Button>
        <Button @click="handleClose">关闭</Button>
        
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { Button, Modal, Image } from 'ant-design-vue';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
// Props
interface Props {
  visible: boolean;
  detailData: any;
  isReviewing: boolean;
  reviewResults: any[];
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'import-reference', hazardIndex: number, referenceContent: any): void;
  (e: 'look-video', videoUrl: any): void;
  (e: 'approve', value: boolean): void;
  (e: 'reject', value: boolean): void;
}>();

// 内部状态
const selectedHazardIndex = ref<number | null>(null);
const aiResultRefs = ref<any[]>([]);

// 方法
const handleHazardClick = (index: number) => {
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
  emit('approve',true);
};

const handleReject = () => {
  emit('reject',true);
};

const onCopySuccess = () => {
  message.success('复制成功');
};

const onCopyError = () => {
  message.error('复制失败');
};

const handleImportReference = (index: number) => {
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

const handleBatchImport = () => {
  let importedCount = 0;
  
  props.reviewResults.forEach((reviewResult, index) => {
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
      importedCount++;
    }
  });
  
  if (importedCount < 1) {
    message.error('暂无参考内容可导入');
  }
};

const lookVideo = (video) => {
  // window.open(video.url, '_blank');
  emit('look-video', video.url);
}
</script>

<style scoped>
.writing-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
</style>