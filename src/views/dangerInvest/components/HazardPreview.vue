<template>
  <div class="hazard-preview">
    <div v-if="hazardList.length > 0">
      <div v-for="(hazard, index) in hazardList" :key="index"
        class="mb-[30px] text-[14px] text-[#454F64] bg-[#F9FAFB] rounded-[15px]">
        <div class="h-[38px] border-b-[1px] border-[#E6E6E6] flex items-center pl-[15px] font-[500]"
          style="font-family: Arial;">{{ index + 1 < 10 ? '0' + (index + 1) : index + 1 }}:</div>
        <div class="px-[15px] py-[20px]">
          <div class="green-color-title mb-[4px]"><span
              class="text-[#788897] font-[500] text-[14px]">隐患名称：</span>{{
                hazard.hazardName || '未填写' }}</div>
          <div class="red-color-title mb-[4px]">
            <span class="text-[#788897] font-[500] text-[14px]">隐患等级：</span>
            <span v-if="hazard.hazardLevel === '重大隐患'"
              class="text-[#DD5A4C] font-[500] text-[14px] bg-[#FDEFED] rounded-[27px] px-[8px] py-[2px] leading-1 ::before-none">{{
                hazard.hazardLevel }}</span>
            <span v-else
              class="text-[#8B5A2B] bg-[#FFF9E6] rounded-[27px] px-[8px] py-[2px] font-[500] text-[14px] leading-1">{{
                hazard.hazardLevel }}</span>
          </div>
          <div class="red-color-title mb-[4px]"><span
              class="text-[#788897] font-[500] text-[14px]">隐患类型：</span>{{
                hazard.hazardType || '未填写' }}</div>
          <div class="red-color-title mb-[4px]"><span
              class="text-[#788897] font-[500] text-[14px]">隐患描述：</span>{{
                hazard.hazardDesc || '未填写' }}</div>
          <div class="mb-[12px]" v-if="hazard.images && hazard.images.length > 0">
            <div class="text-[#788897] font-[500] text-[14px] mb-[8px]">隐患图片：</div>
            <div class="flex flex-wrap gap-[8px]">
              <div v-for="(img, imgIndex) in hazard.images" :key="imgIndex"
                class="w-[80px] h-[80px] rounded-[8px] overflow-hidden cursor-pointer border-[1px] border-[#E6E6E6]"
                @click="$emit('preview-image', img)">
                <img :src="img.response?.url || img.url || img.thumbUrl" alt="隐患图片"
                  class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div class="mb-[12px]" v-if="hazard.videos && hazard.videos.length > 0">
            <div class="text-[#788897] font-[500] text-[14px] mb-[8px]">隐患视频：</div>
            <div class="flex flex-wrap gap-[8px]">
              <div v-for="(video, videoIndex) in hazard.videos" :key="videoIndex"
                class="w-[160px] h-[90px] rounded-[8px] overflow-hidden cursor-pointer border-[1px] border-[#E6E6E6] relative"
                @click="$emit('preview-video', video)">
                <video :src="video.response?.url || video.url" class="w-full h-full object-cover" />
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div
                    class="w-[32px] h-[32px] rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" class="w-[16px] h-[16px] text-[#4362EF]">
                      <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="red-color-title mb-[4px]"><span
              class="text-[#788897] font-[500] text-[14px]">隐患地点：</span>{{
                hazard.area || '未填写' }}</div>
          <div class="blue-color-title mb-[4px]"><span
              class="text-[#788897] font-[500] text-[14px]">判断依据：</span>{{
                hazard.basisRule || '未填写' }}</div>
          <div class="green-color-title mb-[4px]"><span
              class="font-[500] text-[14px] text-[#788897]">整改建议：</span>{{
                hazard.rectifySuggestion || '未填写' }}</div>
          <div class="green-color-title mb-[4px]"><span
              class="font-[500] text-[14px] text-[#788897]">处罚标准：</span>
            <span
              class="rounded bg-amber-50  text-ms leading-2 !text-amber-800 !dark:bg-amber-950/30 !dark:text-amber-200">{{
                hazard.penaltyStandard || '未填写' }}</span>
          </div>
        </div>
      </div>
      <div
        class="mb-[30px] text-[14px] text-[#454F64] bg-[#F0F7FF] rounded-[15px] border-[1px] border-[#D6E4FF]">
        <div
          class="h-[38px] border-b-[1px] border-[#D6E4FF] flex items-center pl-[15px] font-[500] bg-[#E6F2FF] rounded-t-[15px]"
          style="font-family: Arial;">工单信息</div>
        <div class="px-[15px] py-[20px]">
          <div class="green-color-title mb-[4px]"><span
              class="text-[#788897] font-[500] text-[14px]">工单名称：</span>{{
                orderName || '未填写' }}</div>
          <div class="red-color-title mb-[4px]"><span
              class="text-[#788897] font-[500] text-[14px]">填报人员：</span>{{
                registerPerson || '未填写' }}</div>
          <div class="red-color-title mb-[4px]"><span
              class="text-[#788897] font-[500] text-[14px]">填报时间：</span>{{
                registerTime }}</div>
        </div>
      </div>
    </div>
    <img src="@/assets/empty-state.png" class="w-[280px] block mx-auto mt-[12%]" v-else />
  </div>
</template>

<script setup lang="ts">
import type { HazardItem, FileItem } from '../types';

defineProps<{
  hazardList: HazardItem[];
  orderName: string;
  registerPerson: string;
  registerTime: string;
}>();

defineEmits<{
  (e: 'preview-image', file: FileItem): void;
  (e: 'preview-video', file: FileItem): void;
}>();
</script>

<style lang="scss" scoped>
.red-color-title::before {
  content: ' ';
  width: 10px;
  height: 10px;
  background: #DD5A4C;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.green-color-title::before {
  content: ' ';
  width: 10px;
  height: 10px;
  background: #04D0AF;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.blue-color-title::before {
  content: ' ';
  width: 10px;
  height: 10px;
  background: #086AE1;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}
</style>
