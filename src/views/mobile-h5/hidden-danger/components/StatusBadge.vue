<template>
  <span class="status-badge" :class="statusClass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { useHiddenDangerStore } from '@/store/modules/hidden-danger'

const props = defineProps({
  status: {
    type: String,
    default: ''
  }
})

const store = useHiddenDangerStore()
const statusOptions = store.getStatusOptions()

const label = computed(() => {
  const option = statusOptions.find(opt => opt.value === props.status)
  return option?.label || props.status
})

const statusClass = computed(() => {
  const colorMap = {
    'orange': 'pending',
    'red': 'rejected',
    'blue': 'processing',
    'purple': 'archiving',
    'green': 'completed'
  }
  const option = statusOptions.find(opt => opt.value === props.status)
  return colorMap[option?.color] || ''
})
</script>

<style lang="scss" scoped>
.status-badge {
  font-size: 14px;
  font-weight: 500;

  &.pending {
    color: #fa8c16;
  }

  &.processing {
    color: #1890ff;
  }

  &.rejected {
    color: #ff4d4f;
  }

  &.completed {
    color: #52c41a;
  }

  &.archiving {
    color: #722ed1;
  }
}
</style>
