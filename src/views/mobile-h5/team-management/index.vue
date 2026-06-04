<template>
  <div class="team-management">
    <Header title="团队管理" :showBack="true" />
    <main class="main-content">
      <!-- 团队信息 -->
      <div class="team-info-card">
        <div class="team-header">
          <div class="team-name">{{ teamInfo.name }}</div>
          <div class="team-member-count">{{ teamInfo.memberCount }}人</div>
        </div>
        <div class="team-description">{{ teamInfo.description }}</div>
      </div>

      <!-- 团队成员列表 -->
      <div class="section-title">团队成员</div>
      <div class="member-list">
        <div 
          class="member-item" 
          v-for="member in teamMembers" 
          :key="member.id"
        >
          <div class="member-avatar">
            <div class="text-avatar">{{ member.name.charAt(0) }}</div>
          </div>
          <div class="member-info">
            <div class="member-name">{{ member.name }}</div>
            <div class="member-role">{{ member.role }}</div>
          </div>
          <div class="member-actions" v-if="member.id !== currentUser.id">
            <Button 
              class="action-btn message-btn" 
              @click="sendMessage(member)"
              type="default"
            >
              发消息
            </Button>
            <Button 
              class="action-btn remove-btn" 
              @click="removeMember(member)"
              v-if="currentUser.role === 'admin'"
              type="default"
            >
              移除
            </Button>
          </div>
        </div>
      </div>

      <!-- 管理员操作 -->
      <!-- <div class="admin-actions" v-if="currentUser.role === 'admin'">
        <Button class="action-btn primary-btn" @click="showInviteModal = true" type="primary">
          邀请成员
        </Button>
        <Button class="action-btn danger-btn" @click="dissolveTeam" type="primary" danger>
          解散团队
        </Button>
      </div> -->
    </main>
    
    <!-- 邀请成员弹窗 -->
    <Modal
      v-model:visible="showInviteModal"
      title="邀请成员"
      width="90%"
      :footer="null"
      @cancel="closeInviteModal"
    >
      <div class="modal-body">
        <div class="search-box">
          <Input
            v-model:value="searchKeyword"
            placeholder="搜索用户名或姓名"
            class="search-input"
            size="large"
            allow-clear
          />
        </div>
        <div class="user-list">
          <div 
            class="user-item" 
            v-for="user in filteredUsers" 
            :key="user.id"
            @click="selectUser(user)"
          >
            <div class="user-avatar">
              <div class="text-avatar">{{ user.name.charAt(0) }}</div>
            </div>
            <div class="user-info">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-username">@{{ user.username }}</div>
            </div>
            <div class="user-selected" v-if="user.selected">✓</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <Button class="btn cancel-btn" @click="closeInviteModal">取消</Button>
        <Button 
          class="btn confirm-btn" 
          @click="inviteMembers"
          :disabled="!selectedUsers.length"
          type="primary"
        >
          邀请 {{ selectedUsers.length }} 人
        </Button>
      </div>
    </Modal>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';

// 按需引入 ant-design-vue 组件
import { Input, Modal, Button, message } from 'ant-design-vue';

// 团队信息类型
interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

// 成员信息类型
interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// 用户信息类型
interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  selected?: boolean;
}

// 当前用户信息
const currentUser = ref({
  id: '1',
  name: '张三',
  role: 'admin', // 或 'member'
  avatar: '@/assets/h5/avatar.png'
});

// 团队信息
const teamInfo = ref<Team>({
  id: 'team-001',
  name: '安全管理部',
  description: '负责公司整体安全管理工作',
  memberCount: 1
});

// 团队成员列表
const teamMembers = ref<Member[]>([
  {
    id: '1',
    name: '张三',
    role: '管理员',
    avatar: '@/assets/h5/avatar.png'
  }
]);

// 邀请成员相关
const showInviteModal = ref(false);
const searchKeyword = ref('');
const selectedUsers = ref<string[]>([]);

// 模拟用户列表
const userList = ref<User[]>([
  {
    id: '6',
    name: 'Maintainer八',
    username: 'zhouba',
    avatar: '@/assets/h5/avatar.png'
  },
  {
    id: '7',
    name: '吴九',
    username: 'wujiu',
    avatar: '@/assets/h5/avatar.png'
  },
  {
    id: '8',
    name: '郑十',
    username: 'zhengshi',
    avatar: '@/assets/h5/avatar.png'
  }
]);

// 过滤后的用户列表
const filteredUsers = computed(() => {
  return userList.value.map(user => ({
    ...user,
    selected: selectedUsers.value.includes(user.id)
  })).filter(user => 
    user.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    user.username.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

// 选择用户
const selectUser = (user: User) => {
  if (selectedUsers.value.includes(user.id)) {
    selectedUsers.value = selectedUsers.value.filter(id => id !== user.id);
  } else {
    selectedUsers.value.push(user.id);
  }
};

// 发送消息
const sendMessage = (member: Member) => {
  console.log('发送消息给:', member.name);
};

// 移除成员
const removeMember = (member: Member) => {
  console.log('移除成员:', member.name);
};

// 解散团队
const dissolveTeam = () => {
  console.log('解散团队');
};

// 邀请成员
const inviteMembers = () => {
  console.log('邀请成员:', selectedUsers.value);
  // 这里应该调用API邀请成员
  closeInviteModal();
};

// 关闭邀请弹窗
const closeInviteModal = () => {
  showInviteModal.value = false;
  searchKeyword.value = '';
  selectedUsers.value = [];
};

onMounted(() => {
  // 初始化数据
  console.log('团队管理页面初始化');
});
</script>

<style lang="scss" scoped>
.team-management {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(180deg, rgba(0, 102, 204, 0.05) 0%, transparent 100%);
    pointer-events: none;
  }
}

.main-content {
  padding: 16px;
  position: relative;
  z-index: 1;
}

.team-info-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  .team-name {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a2e;
    background: linear-gradient(135deg, #0066cc 0%, #0088ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .team-member-count {
    font-size: 14px;
    color: #0066cc;
    background: rgba(0, 102, 204, 0.15);
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 600;
  }
}

.team-description {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
  padding: 12px;
  background: rgba(0, 102, 204, 0.08);
  border-radius: 12px;
  border-left: 3px solid #0066cc;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 24px 0 16px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: linear-gradient(135deg, #0066cc 0%, #0088ff 100%);
    border-radius: 2px;
    margin-right: 10px;
  }
}

.member-list {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.member-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(90deg, rgba(0, 102, 204, 0.12) 0%, transparent 100%);
    transition: width 0.3s ease;
  }
  
  &:hover {
    background-color: rgba(0, 102, 204, 0.06);
    
    &::before {
      width: 100%;
    }
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .member-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 16px;
    background: linear-gradient(135deg, #0066cc 0%, #0088ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
    }
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .text-avatar {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .member-info {
    flex: 1;
    
    .member-name {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
      margin-bottom: 6px;
      transition: color 0.3s ease;
    }
    
    .member-role {
      font-size: 13px;
      color: #0066cc;
      font-weight: 500;
      background: rgba(0, 102, 204, 0.12);
      padding: 2px 8px;
      border-radius: 10px;
      display: inline-block;
    }
  }
  
  .member-actions {
    display: flex;
    gap: 10px;
    
    .action-btn {
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      outline: none;
      transition: all 0.3s ease;
      
      &.message-btn {
        background: linear-gradient(135deg, #0066cc 0%, #0088ff 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 102, 204, 0.5);
        }
        
        &:active {
          transform: translateY(0);
        }
      }
      
      &.remove-btn {
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
        }
        
        &:active {
          transform: translateY(0);
        }
      }
    }
  }
}

.admin-actions {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: slideUp 0.6s ease-out 0.2s backwards;
  
  .action-btn {
    border-radius: 12px;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    outline: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    height: 40px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }
    
    &:hover::before {
      left: 100%;
    }
    
    &.primary-btn {
      background: linear-gradient(135deg, #0066cc 0%, #0088ff 100%);
      color: white;
      box-shadow: 0 6px 20px rgba(0, 102, 204, 0.45);
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0, 102, 204, 0.55);
      }
      
      &:active {
        transform: translateY(-1px);
      }
    }
    
    &.danger-btn {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
      color: white;
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(255, 107, 107, 0.5);
      }
      
      &:active {
        transform: translateY(-1px);
      }
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.06) 0%, rgba(0, 136, 255, 0.06) 100%);
  
  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, #0066cc 0%, #0088ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .close-btn {
    font-size: 28px;
    cursor: pointer;
    color: #999;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(0, 102, 204, 0.12);
      color: #0066cc;
      transform: rotate(90deg);
    }
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  
  .search-box {
    margin-bottom: 20px;
    
    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e8e8e8;
      border-radius: 12px;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.15);
      }
      
      &::placeholder {
        color: #aaa;
      }
    }
  }
  
  .user-list {
    .user-item {
      display: flex;
      align-items: center;
      padding: 14px;
      border-radius: 12px;
      cursor: pointer;
      margin-bottom: 10px;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      &:hover {
        background-color: rgba(0, 102, 204, 0.06);
        transform: translateX(4px);
      }
      
      .user-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 14px;
        background: linear-gradient(135deg, #0066cc 0%, #0088ff 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
        transition: transform 0.3s ease;
        
        &:hover {
          transform: scale(1.1);
        }
                
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .user-info {
        flex: 1;
        
        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a2e;
          margin-bottom: 4px;
        }
        
        .user-username {
          font-size: 13px;
          color: #666;
        }
      }
      
      .user-selected {
        width: 24px;
        height: 24px;
        border: 2px solid #0066cc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        background: linear-gradient(135deg, #0066cc 0%, #0088ff 100%);
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0, 102, 204, 0.4);
        animation: scaleIn 0.2s ease;
      }
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.03) 0%, rgba(0, 136, 255, 0.03) 100%);
  
  .btn {
    border-radius: 10px;
    border: 2px solid #e8e8e8;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    &.cancel-btn {
      background: white;
      color: #666;
      
      &:hover {
        border-color: #0066cc;
        color: #0066cc;
        background: rgba(0, 102, 204, 0.05);
      }
    }
    
    &.confirm-btn {
      background: linear-gradient(135deg, #0066cc 0%, #0088ff 100%);
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);  
      &:disabled {
        background: #e8e8e8;
        color: #aaa;
        border-color: #e8e8e8;
        cursor: not-allowed;
        box-shadow: none;
      }
    }
  }
}
</style>
