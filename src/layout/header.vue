<template>
    <div class="header-container flex items-center
     px-[30px] py-[14px] box-border w-[100vw] h-[60px] bg-[#fff]" 
    >
        <div class="flex items-center flex-shrink-0">
            <img src="@/assets/layout/company-icon.png" class="w-[304px] h-[32px] block cursor-pointer" @click="toHome" />
            <img src="@/assets/layout/des-title.png" class="w-[125px] h-[15px] block cursor-pointer ml-[18px]" @click="toHome" />
        </div>
        <div class="right-control flex justify-between items-center pl-12 flex-1 overflow-hidden overflow-x-auto">
            <div class="flex-1">
                <Menu :selectedKeys="selectedKeys" mode="horizontal" @click="handleClickMenu">
                    <MenuItem v-for="menu in headerMenu" :key="menu.key">{{ menu.name }}</MenuItem>
                </Menu>
            </div>
            <div class="mr-[5px] flex-shrink-0">
                <img src="@/assets/layout/avatar.png" class="w-[44px]" />
            </div>
            <div class="flex flex-col items-end">
                <div class="text-[16px] text-[#333]">admin</div>
                <div class="text-[14px] text-[#999]">系统管理员</div>
            </div>
            <div class="text-[14px] ml-[10px] text-[#999]">
                <DownOutlined />
            </div>
            
            <!-- <Button type="primary" class="flex-shrink-0" @click="toCurrentSystem"
            v-if="showSystemArr.includes(activePath)"
            >进入系统</Button> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Menu, MenuItem } from 'ant-design-vue'
import {DownOutlined} from '@ant-design/icons-vue'
import { useMenuStore } from '@/store'
import { computed,watch,ref } from 'vue'
import {headerMenu} from '@/layout/menu'
const router = useRouter()
const activePath = computed(() => {
    return router.currentRoute.value.fullPath
})
const menuStore = useMenuStore()
const toHome = () => {
    router.replace('/')
}
const currentKey = computed(() => menuStore.currentKey)
const selectedKeys =ref([currentKey.value])

watch(currentKey, () => {
    selectedKeys.value = [currentKey.value]
})

const handleClickMenu = ({ key }) => {
    // if (key !== 'safetyProMenu') {
        menuStore.setCurrentKey(key)
        changeCurrentKey(key)
    // }
    // else{
    //     // 对于外链菜单
    //     window.open(import.meta.env.VITE_TQLY_PLATFORM, '_blank')
    //     selectedKeys.value = [currentKey.value]
        
    // }
}

const changeCurrentKey = (key) => {
    switch (key) {
        case 'safetyProMenu':
        // const path = menuStore.toSystem('safetyProMenu')
        // if (path) router.replace(path);
        // window.open(import.meta.env.VITE_TQLY_PLATFORM, '_blank')
        // return;
        case 'aiMenu':
        // router.replace('/aiInteligent');
        // break;
        

        case 'emergencyMenu':
        // router.replace('/other-module?type=emergency-map&system=true');
        // break;
        case 'comprehensiveRiskMenu':
        // router.replace('/dataCockpit');
        // break;
        case 'systemConfigMenu':
        // toCurrentSystem()
        // break;
        case 'oneMapMenu':
        case 'messageServiceMenu':  
        const path = menuStore.toSystem(currentKey.value)
        if (path) {
            router.replace(path);
        }
        break;

        default:
        break;
  }
}

// 当前菜单存在系统菜单入口
const showSystemArr = ['/other-module?type=emergency-map&system=true','/dataCockpit','/aiInteligent']
const toCurrentSystem = () => {
    const path = menuStore.toSystem(currentKey.value)
    if (path) {
        router.replace(path);
    }
}
// end
</script>

<style scoped lang="scss">
.primary-name{
    display: flex;
    align-items: center;
    &::before{
        content: '';
        display: inline-block;
        width: 50px;
        height: 2px;
        background: #4362EF;
        margin-left: 10px;
        margin-right: 10px;
    }
}
.right-control {
    :deep(.ant-menu) {
        font-size: 16px;
        color: #333;
    }
    :deep(.ant-menu-horizontal){
        border-bottom: none;
        
    }
    :deep(.ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected){
        color: #4362EF;
        font-weight: bold;
        font-size: 18px;
        
    }
    :deep(.ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected::after),
    :deep(.ant-menu-light.ant-menu-horizontal >.ant-menu-item:hover::after)
    {
        border-bottom-width: 3px;
        border-bottom-color: #4362EF;
    }
}
</style>