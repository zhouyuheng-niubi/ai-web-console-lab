<template>
  <div class="mode-selector">
    <div class="mode-item" :class="{ active: modelValue === 'manual' }" @click="handleSelect('manual')">
      <div class="mode-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
      <div class="mode-text">人工填写</div>
    </div>
    <div class="mode-item" :class="{ active: modelValue === 'ai' }" @click="handleSelect('ai')">
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

<script setup lang="ts">
defineProps<{
  modelValue: 'manual' | 'ai'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'manual' | 'ai'): void
}>()

const handleSelect = (mode: 'manual' | 'ai') => {
  emit('update:modelValue', mode)
}
</script>

<style scoped>
.mode-selector {
  display: flex;
  gap: 16px;
  margin-bottom: 10px;

  .mode-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: #f5f5f5;
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #e6f7ff;
      border-color: #1890ff;
    }

    &.active {
      background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
      border-color: #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
    }

    .mode-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      color: #666;
      font-size: 18px;
      transition: color 0.3s ease;
    }

    .mode-text {
      font-size: 13px;
      font-weight: 500;
      color: #333;
    }

    &.active .mode-icon {
      color: #1890ff;
    }
  }
}
</style>

