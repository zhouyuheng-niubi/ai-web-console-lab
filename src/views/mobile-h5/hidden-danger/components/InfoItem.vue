<template>
  <div class="info-item" :class="itemClass">
    <span v-if="label" class="label" :class="{'required-label': required}">{{ label }}</span>
    <span class="value" :class="valueClass">
      <slot></slot>
    </span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  valueClass: {
    type: String,
    default: ''
  },
  itemClass: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.info-item {
  display: flex;
  margin-bottom: 12px;
  flex-wrap: wrap;
  
  .label {
    font-size: 14px;
    color: #666;
    min-width: 80px;
    flex-shrink: 0;
    
    &.required-label {
      &::before {
        content: '*';
        color: #ff4d4f;
        margin-left: 4px;
      }
    }
  }
  
  .value {
    font-size: 14px;
    color: #333;
    flex: 1;
    word-break: break-word;
    
    &.high-risk {
      color: #ff4d4f;
      font-weight: 500;
    }
    
    &.critical-risk {
      color: #cf1322;
      font-weight: 600;
    }
    
    &.medium-risk {
      color: #fa8c16;
      font-weight: 500;
    }
    
    &.low-risk {
      color: #fa8c16;
      font-weight: 500;
    }
    
    &.processing {
      color: #1890ff;
      font-weight: 500;
    }
    
    &.pending {
      color: #fa8c16;
      font-weight: 500;
    }
    
    &.rejected {
      color: #ff4d4f;
      font-weight: 500;
    }
    
    &.completed {
      color: #52c41a;
      font-weight: 500;
    }
  }
}
</style>
