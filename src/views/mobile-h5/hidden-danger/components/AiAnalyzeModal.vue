<template>
  <div class="ai-analyze-modal" v-if="visible" @click="handleCancel">
    <div class="ai-analyze-modal-content" @click.stop>
      <div class="ai-analyze-modal-header">
        <span class="ai-analyze-modal-title">{{ isAnalyzing ? 'AI分析中...' : 'AI分析整改结果' }}</span>
        <button v-if="!isAnalyzing" class="close-btn" @click="handleCancel">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      <div class="ai-analyze-modal-body">
        <div v-if="isAnalyzing" class="analyze-progress">
          <div class="progress-item" v-for="(item, index) in hazardList" :key="index">
            <div class="progress-info">
              <span class="progress-label">隐患{{ index + 1 }}</span>
              <span class="progress-status"
                :class="{ 'completed': index < currentIndex, 'analyzing': index === currentIndex, 'pending': index > currentIndex }">
                {{ index < currentIndex ? '已完成' : (index === currentIndex ? '分析中...' : '等待中') }} </span>
            </div>
            <div class="progress-bar" v-if="index <= currentIndex">
              <div class="progress-fill"
                :class="{ 'completed': index < currentIndex, 'analyzing': index === currentIndex }"
                :style="{ width: index < currentIndex ? '100%' : '60%' }"></div>
            </div>
          </div>
        </div>
        <div v-else class="analyze-results">
          <div class="mb-[10px] text-[14px] font-[500]" v-if="compareList.filter(item => !item.rectified && !item.error).length">
            未完成整改隐患：{{compareList.filter(item => !item.rectified && !item.error).length}}项
          </div>
          <div class="result-item" v-for="(item, index) in compareList.filter(item => !item.rectified && !item.error)" :key="index">
            <div class="result-header">
              <span class="result-title">{{ item.fileName }}</span>
              <HazardLevelBadge :level="item.hazardLevel" />
            </div>
            <div class="result-body">
              <div class="result-row" v-if="item.hazardName">
                <span class="result-label">隐患名称：</span>
                <span class="result-value">{{ item.hazardName }}</span>
              </div>
              <div class="result-row">
                <span class="result-label">隐患图片：</span>
                <span class="result-value">
                  <div v-for="(image, imgIndex) in item.images" :key="imgIndex" class="attachment-item">
                    <div class="attachment-preview">
                      <Image :src="image.url" alt="隐患图片" />
                    </div>
                  </div>
                </span>
              </div>
              <div class="result-row">
                <span class="result-label">整改图片：</span>
                <span class="result-value">
                  <div v-for="(image, imgIndex) in item.rectifyImages" :key="imgIndex" class="attachment-item">
                    <div class="attachment-preview">
                      <Image :src="image.url" alt="整改图片" />
                    </div>
                  </div>
                </span>
              </div>
              <div class="result-row">
                <span class="result-label">整改说明：</span>
                <span class="result-value">{{ item.rectifyDesc }}</span>
              </div>
              <div class="result-row" v-if="item.hazardType">
                <span class="result-label">隐患类型：</span>
                <span class="result-value">{{ item.hazardType }}</span>
              </div>
              <div class="result-row" v-if="item.hazardDesc">
                <span class="result-label">隐患描述：</span>
                <span class="result-value">{{ item.hazardDesc }}</span>
              </div>
              <div class="result-row" v-if="item.basisRule">
                <span class="result-label">依据规则：</span>
                <span class="result-value">{{ item.basisRule }}</span>
              </div>
              <div class="result-row" v-if="item.penaltyStandard">
                <span class="result-label">处罚标准：</span>
                <span class="result-value">{{ item.penaltyStandard }}</span>
              </div>
              <div class="result-row" v-if="item.rectifySuggestion">
                <span class="result-label">整改建议：</span>
                <span class="result-value">{{ item.rectifySuggestion }}</span>
              </div>
              <!-- 显示AI分析结果 -->
              <div class="mb-2 border-t-[1px] pt-[10px] mt-[10px] text-gray-600" v-if="item.rectificationContent">
                <div class="font-[600] text-[#0070FF] mb-[10px]">AI分析结果：</div>
                {{ item.rectificationContent }}
                <span class="text-[#0070FF] text-[12px] cursor-pointer" v-copy="item.rectificationContent"
                  @copy-success="onCopySuccess()" @copy-error="onCopyError()">复制</span>
              </div>
              <!-- 显示标注图片 -->
              <div class="mt-2" v-if="item.annotatedHazardImages && item.annotatedHazardImages.length">
                <div class="mb-1 text-sm font-[600] text-gray-600">隐患图片：</div>
                <div class="flex flex-wrap gap-2">
                  <div v-for="(image, imgIndex) in item.annotatedHazardImages" :key="'annotated-' + imgIndex">
                    <Image :src="image.trim()" alt="标注图片" :width="80" :height="80" class="object-cover rounded" />
                  </div>
                </div>
              </div>

            </div>
          </div>
          <!-- 完成整改样式 -->
          <div class="flex items-center justify-center"
          v-if="!compareList?.length && !compareList.filter(item => !item.rectified || item.error).length && !isFailed">
            <span class="mr-2 text-[30px] text-[green]">
              <FileDoneOutlined />
            </span>
            <div class="text-[16px] font-medium text-gray-600">已完成所有隐患整改</div>
          </div>
          <!-- 分析失败样式 -->
          <div class="flex items-center justify-center" v-if="isFailed">
            <span class="mr-2 text-[30px] text-[red]">
              <ExclamationCircleOutlined />
            </span>
            <div class="text-[16px] font-medium text-red-600">AI分析失败，请重试！</div>
          </div>
        </div>
        <!-- 完成整改样式-->
        <div class="flex items-center justify-center"
          v-if="compareList.length > 0 && !compareList.filter(item => !item.rectified || item.error).length">
          <span class="mr-2 text-[30px] text-[green]">
            <FileDoneOutlined />
          </span>
          <div class="text-[16px] font-medium text-gray-600">
            已完成所有隐患整改
          </div>
        </div>
      </div>
      <div class="ai-analyze-modal-footer" v-if="!isAnalyzing">
        <Button type="primary" size="medium" @click="handleConfirm">确认</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Image, Button,message } from 'ant-design-vue'
import HazardLevelBadge from './HazardLevelBadge.vue'
import { FileDoneOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isAnalyzing: {
    type: Boolean,
    default: false
  },
  hazardList: {
    type: Array,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  compareList: {
    type: Array,
    default: () => []
  },
  isFailed: {
    type: Boolean,
    default: false
  },
})
const onCopySuccess = (content = `复制成功`) => {
  message.success({
    content,
  });
};

const onCopyError = (content = `复制失败`) => {
  message.error({
    content,
  });
};

const emit = defineEmits(['cancel', 'confirm'])

const handleCancel = () => {
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
.ai-analyze-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;

  .ai-analyze-modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .ai-analyze-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #eee;

      .ai-analyze-modal-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        transition: color 0.3s ease;

        &:hover {
          color: #333;
        }
      }
    }

    .ai-analyze-modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;

      .analyze-progress {
        .progress-item {
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
          }

          .progress-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .progress-label {
              font-size: 14px;
              color: #333;
              font-weight: 500;
            }

            .progress-status {
              font-size: 12px;
              color: #999;

              &.completed {
                color: #52c41a;
              }

              &.analyzing {
                color: #1890ff;
              }

              &.pending {
                color: #999;
              }
            }
          }

          .progress-bar {
            height: 6px;
            background: #f0f0f0;
            border-radius: 3px;
            overflow: hidden;

            .progress-fill {
              height: 100%;
              border-radius: 3px;
              transition: width 0.3s ease;

              &.completed {
                background: #52c41a;
              }

              &.analyzing {
                background: #1890ff;
                animation: progress-pulse 1.5s ease-in-out infinite;
              }
            }
          }
        }
      }

      .analyze-results {
        .result-item {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          border: 1px solid #e8e8e8;

          &:last-child {
            margin-bottom: 0;
          }

          .result-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eee;

            .result-title {
              font-size: 15px;
              font-weight: 600;
              color: #333;
            }
          }

          .result-body {
            .result-row {
              display: flex;
              margin-bottom: 10px;

              &:last-child {
                margin-bottom: 0;
              }

              .result-label {
                font-size: 13px;
                color: #666;
                min-width: 80px;
                flex-shrink: 0;
              }

              .result-value {
                font-size: 13px;
                color: #333;
                flex: 1;
                word-break: break-word;
              }

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
            }
          }
        }
      }
    }

    .ai-analyze-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 20px;
      border-top: 1px solid #eee;
    }
  }
}

@keyframes progress-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}
</style>
