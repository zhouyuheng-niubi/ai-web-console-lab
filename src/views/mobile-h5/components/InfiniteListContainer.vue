<template>
  <div class="infinite-list-container" ref="containerRef">
    <div
      class="pull-refresh-indicator"
      :class="{ pulling: isPulling, refreshing: isRefreshing }"
      :style="{ height: pullDistance + 'px' }"
    >
      <LoadingOutlined v-if="isRefreshing" class="refresh-icon spinning" />
      <ArrowDownOutlined v-else class="refresh-icon" :style="{ transform: `rotate(${pullDistance * 2}deg)` }" />
      <span class="refresh-text">{{ refreshText }}</span>
    </div>

    <div class="list-content" ref="contentRef">
      <slot name="default"></slot>
      
      <div v-if="isLoading" class="loading-more">
        <LoadingOutlined class="loading-icon" />
        <span>加载中...</span>
      </div>
      
      <div v-else-if="hasMore" class="load-more-hint">
        <span>上拉加载更多</span>
      </div>
      
      <div v-else-if="listData.length > 0" class="no-more-data">
        <span>没有更多数据了</span>
      </div>
      
      <Empty v-if="!isLoading && listData.length === 0" description="暂无数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { LoadingOutlined, ArrowDownOutlined } from '@ant-design/icons-vue';
import { Empty } from 'ant-design-vue';

const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  hasMore: {
    type: Boolean,
    default: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  threshold: {
    type: Number,
    default: 100
  },
  pullThreshold: {
    type: Number,
    default: 60
  }
});

const emit = defineEmits(['loadMore', 'refresh']);

const containerRef = ref(null);
const contentRef = ref(null);
const isPulling = ref(false);
const isRefreshing = ref(false);
const pullDistance = ref(0);
const startY = ref(0);
const currentY = ref(0);

const refreshText = computed(() => {
  if (isRefreshing.value) return '刷新中...';
  if (pullDistance.value >= props.pullThreshold) return '释放立即刷新';
  return '下拉刷新';
});

const handleScroll = () => {
  if (!containerRef.value || !contentRef.value) return;
  
  const { scrollTop, scrollHeight, clientHeight } = contentRef.value;
  
  if (props.isLoading || !props.hasMore) return;
  
  const distanceToBottom = scrollHeight - scrollTop - clientHeight;
  
  if (distanceToBottom < props.threshold) {
    emit('loadMore');
  }
};

const handleTouchStart = (e) => {
  if (contentRef.value.scrollTop > 0) return;
  
  startY.value = e.touches[0].clientY;
  isPulling.value = true;
};

const handleTouchMove = (e) => {
  if (!isPulling.value || isRefreshing.value) return;
  
  currentY.value = e.touches[0].clientY;
  const distance = currentY.value - startY.value;
  
  if (distance > 0 && contentRef.value.scrollTop <= 0) {
    // 只有在可以取消时才调用 preventDefault
    if (e.cancelable) {
      e.preventDefault();
    }
    pullDistance.value = Math.min(distance * 0.5, props.pullThreshold * 1.5);
  }
};

const handleTouchEnd = () => {
  if (!isPulling.value) return;
  
  if (pullDistance.value >= props.pullThreshold) {
    isRefreshing.value = true;
    pullDistance.value = props.pullThreshold;
    emit('refresh');
  } else {
    pullDistance.value = 0;
  }
  
  isPulling.value = false;
};

const resetRefreshState = () => {
  isRefreshing.value = false;
  pullDistance.value = 0;
};

const scrollToTop = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = 0;
  }
};

watch(() => props.isLoading, (newVal) => {
  if (!newVal && isRefreshing.value) {
    setTimeout(() => {
      resetRefreshState();
    }, 300);
  }
});

onMounted(() => {
  if (contentRef.value) {
    contentRef.value.addEventListener('scroll', handleScroll);
    contentRef.value.addEventListener('touchstart', handleTouchStart, { passive: false });
    contentRef.value.addEventListener('touchmove', handleTouchMove, { passive: false });
    contentRef.value.addEventListener('touchend', handleTouchEnd);
  }
});

onUnmounted(() => {
  if (contentRef.value) {
    contentRef.value.removeEventListener('scroll', handleScroll);
    contentRef.value.removeEventListener('touchstart', handleTouchStart);
    contentRef.value.removeEventListener('touchmove', handleTouchMove);
    contentRef.value.removeEventListener('touchend', handleTouchEnd);
  }
});

defineExpose({
  scrollToTop,
  resetRefreshState
});
</script>

<style lang="scss" scoped>
.infinite-list-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.pull-refresh-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 10px;
  background: #fff;
  transition: height 0.3s ease;
  z-index: 10;
  
  &.pulling {
    transition: none;
  }
  
  &.refreshing {
    transition: height 0.3s ease;
  }
}

.refresh-icon {
  font-size: 24px;
  color: #1890ff;
  margin-bottom: 8px;
  
  &.spinning {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.refresh-text {
  font-size: 14px;
  color: #999;
}

.list-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px;
  box-sizing: border-box;
}

.loading-more,
.load-more-hint,
.no-more-data {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  color: #999;
  font-size: 14px;
  gap: 8px;
}

.loading-icon {
  font-size: 16px;
  color: #1890ff;
  
  &.spinning {
    animation: spin 1s linear infinite;
  }
}
</style>
