<template>
    <div class="result-container px-[14px]">
        <!-- 识别验证完成 -->
        <div class="flex flex-col items-center justify-between py-[20px]">
            <div class="flex items-center justify-center w-[65px] h-[65px] rounded-[50%] bg-[#F9F8F8] mb-[5px]">
                <img class="w-[34px] h-[18px]" src="@/assets/allinone/icon_finish.png" alt="">
            </div>
            <div class="text-[17px] text-[#333] mb-[5px]">识别验证完成</div>
            <div class="text-[13px] text-[#4C5B78]">5项检查已完成，3项通过，2项需注意</div>
        </div>
        <!-- 扫描人物信息 -->
        <div class="box-border px-[14px] py-[16px] flex bg-[#FFFFFF] rounded-[7px] mb-[10px]">
            <img class="mr-[10px] w-[71px] h-[71px]" src="@/assets/allinone/icon_avatar.png" alt="">
            <div class="flex flex-col flex-1 leading-[21px] pt-[6px]">
                <span class="text-[#333333] text-[15px]">杨志刚</span>
                <span class="text-[#999999] text-[13px]">维修部·电工组</span>
                <span class="text-[#999999] text-[11px]">工号：EMP20230587</span>
            </div>
        </div>
        <!-- 异常提示 -->
        <div class="w-full py-[12px] px-[12px] flex justify-between bg-[#FCEEEE] rounded-[7px] box-border mt-[11px]">
            <img class="w-[15px] h-[15px] mr-[9px] mt-[3px]" src="@/assets/allinone/icon_error_tips.png" alt="">
            <span class="flex-1 text-[#EE4444] text-[14px]">1.监测到体温37.8度超出正常值；2.检测到疲劳状态，不建议参与工作。</span>
        </div>
        <div>
            <div class="mb-[12px]">
                <span class="text-[#333333] text-[15px]">异常检测结果</span>
            </div>
            <div class="bg-[#fff] rounded-[7px] p-[14px] mb-[30px]">
                <div class="flex items-center  mb-[15px]">
                    <img class="w-[28px] h-[28px] mr-[15px]" src="@/assets/allinone/icon_error_face.png" alt="">
                    <span class="flex-1 text[#333] text-[14px]">面部状态监测</span>
                </div>
                <div class="text-[13px] pb-[15px] border-b-[1px] border-[#EBEBEB] mb-[15px]">
                    <div class="flex items-center justify-between mb-[15px]">
                        <span class="flex w-[84px]">疲劳度</span>
                        <div class="flex items-center flex-1">
                            <div class="bg-[#EBEFF5] rounded-[5px] h-[9px] flex-1 mr-[10px] relative">
                                <div class="h-full absolute top-0 left-0 rounded-[5px]"
                                    :style="{ width: `${50}%`, background: '#EE4444' }"></div>
                            </div>
                            <span class="text-[#EE4444] text-[]">偏高</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mb-[15px]">
                        <span class="flex w-[84px]">眨眼频率</span>
                        <div class="flex items-center flex-1">
                            <div class="bg-[#EBEFF5] rounded-[5px] h-[9px] flex-1 mr-[10px] relative">
                                <div class="h-full absolute top-0 left-0   rounded-[5px]"
                                    :style="{ width: `${50}%`, background: '#EAB42F' }"></div>
                            </div>
                            <span class="text-[#EAB42F] text-[]">偏高</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="flex w-[84px]">精神状态</span>
                        <div class="flex items-center flex-1">
                            <div class="bg-[#EBEFF5] rounded-[5px] h-[9px] flex-1 mr-[10px] relative">
                                <div class="h-full absolute top-0 left-0 rounded-[5px]"
                                    :style="{ width: `${50}%`, background: '#EAB42F' }"></div>
                            </div>
                            <span class="text-[#EAB42F] text-[]">不佳</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between ">
                    <div class="flex items-center  "> <img class="w-[28px] h-[28px] mr-[15px]"
                            src="@/assets/allinone/icon_error_face.png" alt="">
                        <span class="flex-1 text[#333] text-[14px]">面部状态监测</span>
                    </div>
                    <span class="text-[13px] text-[#EE4444]">37.8° 异常</span>


                </div>


            </div>
            <div class="mx-auto w-[278px] h-[37px] rounded-[25px] flex items-center justify-center bg-[#4683F7] text-[#fff] text-[15px]" 
            @click="backHome">
                签到完成，返回首页（{{timer}}s）
            </div>
             <div class="text-[12px] text-[#999] text-center mt-[20px]" v-if="isShowCompany" @click="toCompany">
                <span>©2025-示例地区银利华应用科技有限责任公司版权所有</span>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { jumpTo,redirectTo } from '@/hooks/usePage';
import { onMounted, ref } from 'vue';
const timer = ref(10)
// 是否展示公司信息
const isShowCompany = import.meta.env.VITE_SHOW_COMPANY_INFO === 'true'
const backHome = () => {
    console.log('返回首页');
    
    redirectTo('/all-in-one');
}
const toCompany = () => {
    window.open('https://www.yinlihua.cn/PCH5/index.html', '_blank')
}
onMounted(() => {
    const interval = setInterval(() => {
        timer.value--;
        if (timer.value <= 0) {
            clearInterval(interval);
            backHome()
        }
    }, 1000);
});
</script>

<style scoped lang="scss">
.result-container {
    background: url('@/assets/allinone/bg_compressed.png'), #F9F8F8;
    background-size: 100% auto;
    background-position: center top;
    background-repeat: no-repeat;
    min-height: 100vh;

}
</style>