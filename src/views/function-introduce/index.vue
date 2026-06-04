<template>
    <div class=" w-[100%] h-[100%] px-4 py-1">
        <div class="menu-introduce w-full h-full  flex items-center justify-center">
            <div class="card-container w-[855px] h-fit min-h-[567px] z-2 pt-[100px] pl-[220px] pr-[30px]">
                <div class="font-bold text-[24px] text-[#fff]">{{ pageName }}</div>
                <div class="font-[500] text-[16px] text-[#fff] mt-[20px] leading-[2em]">{{ menuIntroduce }}</div>
            </div>            
        </div>

    </div>
</template>
<script setup lang="ts">
    import  {useRoute} from 'vue-router'
    import {routeModel} from './data'
    import { ref,watch } from 'vue'
    const route = useRoute()
    const menuIntroduce = ref('')
    const pageName = ref('')
    watch(() => route.query.menu, (newVal) => {
        if(newVal) {
            pageName.value = routeModel[route.query.menu as string]?.name
            menuIntroduce.value = routeModel[route.query.menu as string]?.description
        }
    },{immediate: true})
</script>
<style scoped lang="scss">
.menu-introduce {
    background-image: url('@/assets/layout/introduce_bg.jpg');
    background-size: 100% 100%;
    .card-container{
        position: relative;
        background-image: 
                url('@/assets/layout/layout_head.png'),
                url('@/assets/layout/layout_body.png'),
                url('@/assets/layout/layout_footer.png');
                background-size: 855px 217px, 855px calc(100% - 217px - 179px), 855px 179px;
                background-position: 0px 0px, 0px 217px, left bottom;
                background-repeat: no-repeat;
    }
}


</style>

