<template>
  <Modal
    :open="modalVisible"
    @update:open="handleVisibleUpdate"
    title="选择整改信息"
    :close-on-click-modal="false"
    :closable="false"
    width="600px"
    :maskClosable="false"
    ok-text="确定"
    @ok="handleConfirm"
  >
    <div class="user-list">
      <div v-for="user in userList" :key="user.id" class="user-item"
        :class="{ selected: currentUser?.id === user.id }" @click="handleClickUser(user)">
        <div class="user-info">
          <div class="user-avatar">{{ user.name?.charAt(0) || 'U' }}</div>
          <div>
            <div class="user-name">{{ user.name }}</div>
            <div class="user-role">{{ user.role || '整改人员' }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="deadline-section">
      <label class="deadline-label required-label">整改期限：</label>
      <DatePicker v-model:value="deadline" format="YYYY-MM-DD" value-format="YYYY-MM-DD" class="w-[200px]" placeholder="请选择整改期限" />
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Modal, message, DatePicker } from 'ant-design-vue';
import { useMainStore } from '@/store';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'confirm']);

const mainStore = useMainStore();
const userList = computed(() => mainStore.userList);
const currentUser = ref(null);
const deadline = ref('');
const modalVisible = ref(false);

// 监听 props.visible 的变化
watch(() => props.visible, (newVal) => {
  modalVisible.value = newVal;
});

const handleClickUser = (user) => {
  currentUser.value = user;
}

const handleConfirm = () => {
  if (!currentUser.value) {
    message.error('请选择整改人！');
    return;
  }
  if (!deadline.value) {
    message.error('请选择整改期限！');
    return;
  }
  emit('confirm', {
    id: currentUser.value?.id,
    name: currentUser.value?.name,
    deadline: deadline.value
  });
  closeModal();
}

const handleVisibleUpdate = (value) => {
  modalVisible.value = value;
  emit('update:visible', value);
}

const show = () => {
  emit('update:visible', true);
}

const closeModal = () => {
  emit('update:visible', false);
  currentUser.value = null;
  deadline.value = '';
}

const hide = () => {
  closeModal();
}

defineExpose({
  show,
  hide
});
</script>

<style lang="scss" scoped>
.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px 0;
  box-sizing: border-box;

  .user-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    background: #f8f9fa;
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background: #e6f7ff;
      border-color: #1890ff;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
    }

    &.selected {
      background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
      border-color: #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);

      &::after {
        content: '✓';
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        background: #1890ff;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
      }
    }

    .user-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;

      .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        font-weight: 600;
        flex-shrink: 0;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }

      .user-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        flex: 1;
      }

      .user-role {
        font-size: 13px;
        color: #999;
        margin-top: 2px;
      }
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.deadline-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  gap: 12px;

  .deadline-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    min-width: 80px;
  }
}
</style>
