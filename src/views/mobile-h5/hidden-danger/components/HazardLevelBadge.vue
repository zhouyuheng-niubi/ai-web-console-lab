<template>
  <span class="hazard-level-badge" :class="levelClass">{{ level }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: String,
    default: ''
  }
})

const levelClass = computed(() => {
  const classMap = {
    '一般隐患': 'low-risk',
    '重大隐患': 'high-risk'
  }
  return classMap[props.level] || ''
})
</script>

<style lang="scss" scoped>
.hazard-level-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  
  &.low-risk {
    background: #fff7e6;
    color: #fa8c16;
  }
  
  &.high-risk {
    background: #fff1f0;
    color: #ff4d4f;
  }
}
</style>
