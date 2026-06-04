<template>
    <div class="layout-container">
        <div class="header-container relative">
            <Header />
        </div>
        <div class="content-container bg-[#F8FAFC] flex pt-[9px] overflow-auto" 
        style="height: calc(100vh - 60px);">
            <div class="h-full overflow-auto bg-[#fff]" 
            @mouseenter="isHover = true" @mouseleave="isHover = false">
                <Sider />
            </div>
            <div class="flex-1 h-full overflow-auto">
                <RouterView />
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import Header from '@/layout/header.vue'
import Sider from '@/layout/sider.vue'
import { ref } from 'vue'
const isHover = ref(false)

</script>
<style scoped lang="scss">
.layout-container {
        /* Webkit浏览器滚动条样式 */
        &::-webkit-scrollbar {
            height: 6px;
            background-color: #f5f5f5;
        }
        
        &::-webkit-scrollbar-track {
            background-color: #f2f6fa;
            border-radius: 3px;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: #e7e7e7;
            border-radius: 3px;
            
            &:hover {
                background-color: #e7e7e7;
            }
        }
        
        /* Firefox滚动条样式 */
        scrollbar-width: thin;
        scrollbar-color: #e7e7e7 #f2f6fa;    
}

</style>