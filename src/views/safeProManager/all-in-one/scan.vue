<template>
    <div class="p-[14px] pt-[30px] scan-container">
        <div class="text-[18px] text-[#333] font-bold text-center mb-[14px]">人员多维度识别验证</div>
        <!-- 步骤 -->
        <div class="flex w-full items-end mb-[10px]">
            <div class="flex-1">
                <div class="flex justify-between">
                    <div class="flex flex-col items-center flex-1" v-for="(item, index) in stepList" :key="index">
                        <img class="w-[27px] h-[27px] mb-[3px]" :src="step >= index ? item.imgA : item.img" alt="">
                        <div class="text-[#333] text-[12px]"
                            :class="step >= index ? 'text-[#4683F7]' : 'text-[#4C5B78]'">
                            {{ item.Title }}</div>
                    </div>
                </div>
                <div class="w-full h-[3px] bg-[#C0D9F3] my-[10px] relative">
                    <div class="absolute left-[0px] top-[0px] h-[3px] bg-[#4683F7]"
                        :style="{ 'width': `${(step + 1) / 5 * 100}%` }"></div>
                </div>
            </div>
            <div class="text-[#4683F7] text-[13px] ml-[10px] pb-[3px]">{{ step + 1 }}/5</div>
        </div>
        <!-- 识别框 -->
        <div class="bg-[#fff] w-full p-[14px] rounded-[7px] ">
            <div class="text-[15px] text-[#333] ">正在识别中... </div>
            <div class="text-[#4C5B78] text-[13px]">请正对摄像头，保持光线充足</div>
            <div class="w-full h-[326px] bg-[#EBF5FE] rounded-[7px] mt-[15px] relative">
              
                <div
                    class="text-[14px] text-[#fff] bg-[#333] w-[271px] h-[34px] opacity-[0.5] rounded-[7px] flex items-center justify-center absolute bottom-[18px] left-[50%] transform -translate-x-1/2">
                    正在检测面部特征...</div>
            </div>
            <div
                class="w-full py-[12px] px-[12px] flex justify-between bg-[#EBF5FE] rounded-[7px] box-border mt-[11px]">
                <img class="w-[15px] h-[15px] mr-[4px] mt-[3px]" src="@/assets/allinone/icon_tips.png" alt="">
                <span class="flex-1 text-[#4683F7] text-[14px]">请保持面部在框内，缓慢转动头部完成多角度 采集</span>
            </div>
            <!-- 提示 -->
            <div class="text-[13px] text-[#4C5B78] mt-[15px] ">
                <div class="flex justify-between items-center mb-[10px] ">
                    <div class="flex  items-center flex-1 pl-[15px]">
                        <img class="w-[14px] h-[8px] mr-[4px]" src="@/assets/allinone/icon_finish.png" alt="">光线充足环境
                    </div>
                    <div class="flex  items-center flex-1 pl-[15px]">
                        <img class="w-[14px] h-[8px] mr-[4px]" src="@/assets/allinone/icon_finish.png" alt="">正视摄像头
                    </div>
                </div>
                <div class="flex justify-between items-center mb-[10px]">
                    <div class="flex  items-center flex-1 pl-[15px]">
                        <img class="w-[14px] h-[8px] mr-[4px]" src="@/assets/allinone/icon_finish.png" alt="">露出完整面部
                    </div>
                    <div class="flex  items-center flex-1 pl-[15px]">
                        <img class="w-[14px] h-[8px] mr-[4px]" src="@/assets/allinone/icon_finish.png" alt="">保持静止2秒
                    </div>
                </div>
            </div>
        </div>
  <div @click="jumpTo('/all-in-one/result')" class="mx-auto w-[278px] h-[37px] rounded-[25px] flex items-center justify-center bg-[#4683F7] text-[#fff] text-[15px]">手动结束</div>

        <div class="text-[12px] text-[#999] text-center mt-[20px]" v-if="isShowCompany" @click="toCompany">
            <span>©2025-示例地区银利华应用科技有限责任公司版权所有</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import icon_face from '@/assets/allinone/icon_face.png';
import icon_face_selcted from '@/assets/allinone/icon_face_selcted.png';
import icon_zs from '@/assets/allinone/icon_zs.png';
import icon_zs_selcted from '@/assets/allinone/icon_zs_selcted.png';
import icon_gp from '@/assets/allinone/icon_gp.png';
import icon_gp_selcted from '@/assets/allinone/icon_gp_selcted.png';
import icon_tw from '@/assets/allinone/icon_tw.png';
import icon_tw_selcted from '@/assets/allinone/icon_tw_selected.png';
import icon_zt from '@/assets/allinone/icon_zt.png';
import icon_zt_selcted from '@/assets/allinone/icon_zt_selected.png';
import { jumpTo } from '@/hooks/usePage';
// 步骤
const step = ref(0);
// 步骤列表
const stepList = ref([
    {
        Title: '人脸',
        img: icon_face,
        imgA: icon_face_selcted,
    },
    {
        Title: '证书',
        img: icon_zs,
        imgA: icon_zs_selcted,

    },
    {
        Title: '工牌',
        img: icon_gp,
        imgA: icon_gp_selcted,

    },
    {
        Title: '体温',
        img: icon_tw,
        imgA: icon_tw_selcted,

    },
    {
        Title: '状态',
        img: icon_zt,
        imgA: icon_zt_selcted,

    },

])
const stepTimer = ref(null);

// 是否展示公司信息
const isShowCompany = import.meta.env.VITE_SHOW_COMPANY_INFO === 'true'
const toCompany = () => {
    window.open('https://www.yinlihua.cn/PCH5/index.html', '_blank')
}
onMounted(() => {

    stepTimer.value = setInterval(() => {
        step.value++;
        if (step.value >= 5) {
            jumpTo('/all-in-one/result')
            clearInterval(stepTimer.value)
        }
    }, 1000);
})
</script>

<style scoped lang="scss">
.scan-container {
    background: url('@/assets/allinone/bg_compressed.png'), #FFFFFF;
    background-size: 100% auto;
    background-position: center top;
    background-repeat: no-repeat;
    min-height: 100vh;

}
</style>