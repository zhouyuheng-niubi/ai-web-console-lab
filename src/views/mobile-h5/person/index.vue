<template>
  <div class="person-center">
    <Header title="我的" :showBack="false" />
    <main class="main-content">
      <!-- 用户信息卡片 -->
      <div class="user-info-card" v-if="isLoggedIn">
        <div class="user-avatar">
          <div class="text-avatar">{{ userInfo.name ? userInfo.name.charAt(0) : '用' }}</div>
        </div>
        <div class="user-details">
          <div class="user-name">{{ userInfo.name || userInfo.name }}</div>
          <div class="user-team">
            <span class="team-label">所属小组:</span>
            <span class="team-value">{{ userInfo.group || '暂无' }}</span>
          </div>
        </div>
      </div>
      
      <!-- 游客登录提示卡片 -->
      <div class="guest-info-card" v-else>
        <div class="guest-avatar">
          <div class="text-avatar">游</div>
        </div>
        <div class="guest-details">
          <div class="guest-name">{{ userInfo.name }}</div>
          <div class="guest-login" @click="goToLogin">
            <span class="login-text">点击登录</span>
            <span class="arrow">›</span>
          </div>
        </div>
      </div>
      
      <!-- 功能列表 -->
      <div class="function-list">
        <div class="function-item" @click="goToTeamManagement" v-if="isLoggedIn">
          <span class="function-icon"></span>
          <span class="function-name">小组信息</span>
          <span class="arrow">›</span>
        </div>
        <div class="function-item" v-if="isLoggedIn">
          <span class="function-icon"></span>
          <span class="function-name">系统设置</span>
          <span class="arrow">›</span>
        </div>
        <div class="function-item" @click="showLogoutConfirm" v-if="isLoggedIn">
          <span class="function-icon"></span>
          <span class="function-name">退出登录</span>
          <span class="arrow">›</span>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';
import { Modal } from 'ant-design-vue';
import { useMainStore } from '@/store';
const mainStore = useMainStore();
interface User {
  id: string;
  username: string;
  real_name: string;
  email?: string;
  phone?: string;
  role?: string;
  departmentId?: string;
  departmentName?: string;
}

const router = useRouter();
const userInfo = computed(() => mainStore.userInfo);


// 跳转到团队管理页面
const goToTeamManagement = () => {
  router.push('/mobile/team-management');
};

// 显示退出登录确认弹窗
const showLogoutConfirm = () => {
  Modal.confirm({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      // 执行退出登录操作
      logout();
    },
  });
};

// 判断用户是否已登录
const isLoggedIn = computed(() => {
  return userInfo.value.username !== '游客' && userInfo.value.id !== '';
});

// 退出登录
const logout = () => {
  // 清除用户信息
  userInfo.value = {
    id: '',
    username: '游客',
    real_name: '',
    departmentName: '暂无团队'
  };
  
  // 清除本地存储的token（如果有的话）
  // 这里可以根据实际的token存储方式进行清理
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  
};

// 跳转到登录页面
const goToLogin = () => {
  // 由于项目中没有明确的登录页面，我们跳转到首页
  // 实际项目中这里应该跳转到真正的登录页面
  router.push('/');
};
</script>

<style lang="scss" scoped>
.person-center {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 60px; // 为底部导航留出空间
}

.main-content {
  padding: 16px;
}

.user-info-card {
  background: linear-gradient(90deg, #1890ff 0%, #096dd9 100%);
  border-radius: 12px;
  padding: 24px 20px;
  color: white;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.guest-info-card {
  background: white;
  border-radius: 12px;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #333;
}

.guest-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  border: 2px solid #e8e8e8;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guest-details {
  flex: 1;
  
  .guest-name {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
  
  .guest-login {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 8px;
    border-top: 1px solid #f0f0f0;
    cursor: pointer;
    
    .login-text {
      font-size: 16px;
      color: #1890ff;
    }
    
    .arrow {
      color: #ccc;
      font-size: 18px;
    }
  }
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  
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
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.user-details {
  flex: 1;
  
  .user-name {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .user-team {
    display: flex;
    align-items: center;
    font-size: 14px;
    opacity: 0.9;
    
    .team-label {
      margin-right: 6px;
    }
  }
}

.function-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.function-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: #f5f5f5;
  }
  
  .function-icon {
    font-size: 20px;
    margin-right: 12px;
    width: 24px;
    text-align: center;
  }
  
  .function-name {
    flex: 1;
    font-size: 16px;
    color: #333;
  }
  
  .arrow {
    color: #ccc;
    font-size: 18px;
  }
}
</style>
