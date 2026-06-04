<template>
  <InfoCard :title="`隐患信息 ${showIndex ? `(${index + 1})` : ''}`">
    <InfoItem label="隐患名称：">{{ hazard.hazardName }}</InfoItem>
    <InfoItem label="隐患图片：">
      <div v-for="(image, imgIndex) in hazard.images" :key="imgIndex" class="attachment-item">
        <div class="attachment-preview">
          <Image :src="image.url" alt="隐患图片" />
        </div>
      </div>
    </InfoItem>
    
    <InfoItem v-if="hazard.videos?.length" label="隐患视频：">
      <div v-for="(video, vidIndex) in hazard.videos" :key="vidIndex">
        <div class="flex">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>{{ video.name }}</span>
        </div>
      </div>
    </InfoItem>
      <InfoItem label="整改图片：" :required="isEditable">
      <FileUploadWithSource
        v-if="isEditable"
        v-model="hazard.rectifyImages"
        upload-type="image"
        :max-count="5"
        upload-text="上传图片"
        drawer-title="上传图片"
        description="整改图片"
        :disabled="disabled"
        @preview="$emit('preview', $event)"
      />
      <div v-else v-for="(image, imgIndex) in hazard.rectifyImages" :key="imgIndex" class="attachment-item">
        <div class="attachment-preview">
          <Image :src="image.url" alt="整改图片" />
        </div>
      </div>
    </InfoItem>
    <InfoItem label="整改说明：" :required="isEditable">
      <Textarea v-if="isEditable" v-model:value="hazard.rectifyDesc" 
      :autoSize="{ minRows: 4, maxRows: 6 }" :disabled="disabled" 
      size="large" placeholder="请输入整改说明"></Textarea>
      <span v-else>{{ hazard.rectifyDesc || '--' }}</span>
    </InfoItem>    
    <InfoItem label="隐患类型：">{{ hazard.hazardType }}</InfoItem>
    <InfoItem label="隐患等级：">
      <HazardLevelBadge :level="hazard.hazardLevel" />
    </InfoItem>
    <InfoItem label="所在区域：">{{ hazard.area }}</InfoItem>
    <InfoItem label="隐患描述：">{{ hazard.hazardDesc }}</InfoItem>
    
    <InfoItem v-if="hazard.deadline" label="整改期限：">{{ hazard.deadline }}</InfoItem>
    <InfoItem v-if="hazard.basisRule" label="依据规则：">{{ hazard.basisRule }}</InfoItem>
    <InfoItem v-if="hazard.rectifySuggestion" label="整改建议：">{{ hazard.rectifySuggestion }}</InfoItem>
    <InfoItem v-if="hazard.penaltyStandard" value-class="rounded bg-amber-50  text-xs leading-relaxed !text-amber-800 !dark:bg-amber-950/30 !dark:text-amber-200"
    label="处罚标准：">{{ hazard.penaltyStandard }}</InfoItem>
  </InfoCard>
</template>

<script setup>
import { computed } from 'vue'
import { Image, Textarea } from 'ant-design-vue'
import InfoCard from './InfoCard.vue'
import InfoItem from './InfoItem.vue'
import HazardLevelBadge from './HazardLevelBadge.vue'
import FileUploadWithSource from '../../components/FileUploadWithSource.vue'

const props = defineProps({
  hazard: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['preview'])

const showIndex = computed(() => props.totalCount > 1)

const isEditable = computed(() => {
  return props.status === 'pending_rectification' || props.status === 'rectification_rejected'
})
</script>

<style lang="scss" scoped>
.attachment-item {
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-right: 0;
  }
}

.attachment-preview {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
