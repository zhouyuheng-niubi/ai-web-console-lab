<template>
  <div class="pending-list">
    <div v-for="item in list" :key="item.id" class="pending-item" @click="handleItemClick(item)">
      <div class="item-header">
        <span class="item-title">{{item.orderName}}</span>
        <Tag :color="statusOptions.find(opt => opt.value === item.status)?.color || 'orange'">{{ statusOptions.find(opt => opt.value === item.status)?.label || item.status }}</Tag>
        <!-- <span class="item-status" :class="item.statusClass">{{ statusOptions.find(opt => opt.value === item.status)?.label || item.status }}</span> -->
      </div>
      <div class="item-content">
        <div class="item-description">创建时间：{{ item.registerTime }}</div>
        <div class="item-description">整改期限：{{ item.deadline }}</div>
      </div>
    </div>
    <!-- <div v-if="list.length === 0" class="empty-state">
      <div class="empty-icon">
        <img src="@/assets/empty-state.png" alt="Empty" 
        style="width:280px; height: auto;" />
      </div>
      <div class="empty-text">{{EmptyText}}</div>
    </div> -->
  </div>
</template>

<script setup>
import { defineProps, defineEmits,onMounted } from 'vue';
import { useHiddenDangerStore } from '@/store/modules/hidden-danger';
import {Empty, Tag} from 'ant-design-vue';
const store = useHiddenDangerStore();
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  EmptyText: {
    type: String,
    default: '暂无待办事项'
  }
});
const statusOptions = store.getStatusOptions();

const emit = defineEmits(['item-click']);

const handleItemClick = (item) => {
  emit('item-click', item);
};
</script>

<style lang="scss" scoped>
.pending-list {
  .pending-item {
    background:#F8F8F8;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    border-left: 4px solid #1890ff;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      background: #f0f0f0;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .item-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }

      .item-status {
        font-size: 13px;
        padding: 4px 12px;
        border-radius: 12px;
        font-weight: 500;

        &.status-pending {
          background: #fff7e6;
          color: #fa8c16;
        }

        &.status-processing {
          background: #e6f7ff;
          color: #1890ff;
        }

        &.status-completed {
          background: #f6ffed;
          color: #52c41a;
        }
      }
    }

    .item-content {
      .item-desc {
        color: #666;
        font-size: 14px;
        line-height: 1.6;
        margin: 0 0 12px 0;
      }

      .item-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid #e8e8e8;

        .item-time {
          font-size: 13px;
          color: #999;
        }

        .item-priority {
          font-size: 13px;
          padding: 2px 10px;
          border-radius: 10px;
          font-weight: 500;

          &.priority-high {
            background: #fff1f0;
            color: #ff4d4f;
          }

          &.priority-medium {
            background: #fff7e6;
            color: #fa8c16;
          }

          &.priority-low {
            background: #f6ffed;
            color: #52c41a;
          }
        }
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #999;

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .empty-text {
      font-size: 16px;
      color: #999;
    }
  }
}
</style>