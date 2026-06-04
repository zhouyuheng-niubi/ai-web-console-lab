<template>
    <!-- 底部导航 -->
    <footer class="bottom-nav">
        <div class="nav-container">
            <div class="nav-item" v-for="menu in menus" :key="menu.path" @click="handleNavigate(menu.path)">
                <img :src="route.path === menu.path ? menu.iconA : menu.icon" class="nav-icon w-[28px]" />
                <span class="nav-text" :class="route.path === menu.path ? '!text-[#0058FD]' : ''">{{ menu.name }}</span>
            </div>
        </div>
    </footer>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import meIcon from '@/assets/h5/me.png';
import meIconA from '@/assets/h5/me_a.png';
import handleIcon from '@/assets/h5/daichuli.png';
import handleIconA from '@/assets/h5/daichuli_a.png';
import searchIcon from '@/assets/h5/zaitu.png';
import searchIconA from '@/assets/h5/zaitu_a.png';
import { computed } from 'vue';
const currentPath = computed(() => router.currentRoute.value.fullPath);

const route = useRoute();
const router = useRouter();

const menus = [
    { path: '/mobile/hidden-danger', name: '处理中心', icon: handleIcon, iconA: handleIconA },
    { path: '/mobile/search-record', name: '查询中心', icon: searchIcon, iconA: searchIconA },
    { path: '/mobile/person', name: '我的', icon: meIcon, iconA: meIconA },
]
const handleNavigate = (path: string) => {
  router.replace({path});
};
</script>
<style lang="scss" scoped>
    .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        z-index: 100;
        padding: 8px 0;
        height: 68px;
        box-sizing: border-box;
    }
    .nav-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        // max-width: 600px;
        margin: 0 auto;
    }

    .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    transition: all 0.2s;
    
    &.active {
        background: #e6f7ff;
        .nav-text {
            color: #1890ff;
            font-weight: 600;
        }
    }
    
    &:hover {
        background: #f5f5f5;
    }
    
    .nav-text {
        font-size: 14px;
        color: #666;
    }
    }
</style>

