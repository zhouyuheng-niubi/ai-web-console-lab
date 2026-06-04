<template>
  <div class="mode-selector">
    <div
      class="mode-item"
      :class="{ active: modelValue === 'manual' }"
      @click="handleSelect('manual')"
    >
      <div class="mode-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
      <div class="mode-text">人工填写</div>
    </div>
    <div
      class="mode-item"
      :class="{ active: modelValue === 'ai' }"
      @click="handleSelect('ai')"
    >
      <div class="mode-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </div>
      <div class="mode-text">AI填写</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'manual'
  }
})

const emit = defineEmits(['update:modelValue'])

const handleSelect = (mode) => {
  emit('update:modelValue', mode)
}
</script>

<style lang="scss" scoped>
.mode-selector {
  display: flex;
  gap: 16px;
  padding: 16px 0px;
  background: white;

  .mode-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border-radius: 12px;
    background: #f5f7fa;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &.active {
      background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
      border-color: #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);

      .mode-icon {
        color: #1890ff;
        transform: scale(1.1);
      }

      .mode-text {
        color: #1890ff;
        font-weight: 600;
      }
    }

    &:hover:not(.active) {
      background: #e8e8e8;
      transform: translateY(-2px);
    }

    .mode-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      color: #666;
      transition: all 0.3s ease;

      svg {
        width: 28px;
        height: 28px;
      }
    }

    .mode-text {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      transition: all 0.3s ease;
    }
  }
}
</style>
