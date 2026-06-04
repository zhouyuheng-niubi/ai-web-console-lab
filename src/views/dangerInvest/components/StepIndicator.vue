<template>
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
</template>

<script setup lang="ts">
defineProps<{
  currentStep: number;
}>();
</script>

<style lang="scss" scoped>
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  padding: 0 20px;

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
</style>
