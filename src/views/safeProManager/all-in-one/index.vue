<template>
    <div class="allinone w-full h-full p-[14px]">
        <!-- 会议签到 -->
        <div class="flex flex-row mb-[24px]">
            <div class="flex-1 flex flex-col mt-[27px]">
                <span class="text-[18px] text-[#333] font-bold mb-[7px]">会议签到</span>
                <span class="text-[13px] text-[#4C5B78] mb-[2px]">2025年12月24日星期三 10:05:57</span>
                <span class="text-[#04B383] text-[10px]">设备正常运行中</span>
            </div>

        </div>
        <!-- 识别 -->
        <div class="w-full h-[214px] scan-box flex flex-col justify-center items-center">
            <div class="w-[82px] h-[82px] rounded-[50%] flex justify-center items-center bg-[#F3F9FA] mb-[12px]">
                <img class="w-[38px] h-[31px]" src="@/assets/allinone/icon_camera.png" alt="">
            </div>

            <span class="text-[#4C5B78] text-[13px]">请将面部对准摄像头</span>
            <div class="flex items-center py-[6px]">
                <span class="w-[8px] h-[8px] rounded-[50%] bg-[#C3DFFC] mx-[4px]" v-for="item in 5" :key="item">

                </span>
            </div>
            <div
                class="w-[278px] h-[37px] rounded-[18px] flex justify-center items-center bg-[#4683F7] text-[#FFFFFF] mt-[10px]" @click="starScane">
                开始多维识别</div>

        </div>
        <!-- 展示数据 -->
        <div class="flex justify-between mt-[25px]">
            <div class="w-[110px] h-[63px] bg-[#F3F9FA] flex flex-col justify-center items-center "
                v-for="(item, index) in showNumList" :key="index">
                <span class="text-[17px]  font-bold" :style="{ color: item.color }"> {{ item.value }}{{ item.unit }}</span>
                <span class="text-[10px]  text-[#999999]">{{ item.title }}</span>
            </div>
        </div>
        <!-- 签到记录 -->
        <div>
            <div class="text-[#333] text-[15px] mt-[20px]">签到记录</div>
            <div class="mt-[10px]">
                <div :class="item.status==1?'success':'fail'" class="relative bg-[#F8F8F8] rounded-[3px] py-[8px] pl-[20px] pr-[10px] mb-[10px]  " v-for="(item, index) in signList" :key="index">
                    <div class="flex justify-between items-center ">
                        <span class="text-[14px] text-[#333]">{{ item.name }}</span>
                        <span class="text-[11px] text-[#999]">{{ item.time }}</span>
                    </div>
                      <div class="flex justify-between items-center ">
                        <span class="text-[12px] text-[#999]">{{ item.group }}</span>
                        <span class="text-[12px] " :class="item.status==1?'text-[#59B67D]':'text-[#EE4444]'">{{ item.statusName }}</span>
                    </div>
                </div>
            </div>

        </div>
        <div class="text-[12px] text-[#999] text-center mt-[20px]" 
        v-if="isShowCompany" @click="toCompany">
            <span>©2025-示例地区银利华应用科技有限责任公司版权所有</span>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { jumpTo } from '@/hooks/usePage';

const starScane = () => {
    jumpTo('/all-in-one/scan');
}

// 展示列表
const showNumList = ref([

    {
        title: '已签到人数',
        value: '0',
        unit: '',
        color: '#333333'
    },
    {
        title: '应到人数',
        value: '0',
        unit: '',

        color: '#333333'

    },
    {
        title: '签到率',
        value: '0',
        unit: '%',

        color: '#EE4444'

    },

])
// 签到记录 1成功 2失败 0未签到 3异常
const signList = ref([
    {
        name: '张三',
        time: '2025-12-24 10:05:57',
        status: 1,
        statusName: '签到成功',
        group: '维修部·电工组'
    },
      {
        name: '杨志刚',
        time: '2025-12-24 10:05:57',
        status: 1,
        statusName: '签到成功',
        group: '维修部·电工组'
    },
       {
        name: '刘一菲',
        time: '2025-12-24 10:05:57',
        status: 3,
        statusName: '检测异常',
        group: '采购部·电工组'
    },
])
// 是否展示公司信息
const isShowCompany = import.meta.env.VITE_SHOW_COMPANY_INFO === 'true'

const toCompany = () => {
    window.open('https://www.yinlihua.cn/PCH5/index.html', '_blank')
}
</script>

<style scoped lang="scss">
.allinone {
    background: url('@/assets/allinone/top_bg_compressed.png'), #FFFFFF;
    background-size: 100% auto;
    background-position: center -42px;
    background-repeat: no-repeat;
    min-height: 100vh;
   
}

.scan-box {
    background: url('@/assets/allinone/bg_scan.png');
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
}
.success{
    &::after{
        position: absolute;
        content: '';
        width: 5px;
        height: 100%;
        background-color: #04B383;
        top: 0;
        left: 0;
        border-radius: 3px 0 0 3px;
    }
}
.fail{
    &::after{
        position: absolute;
        content: '';
        width: 5px;
        height: 100%;
        background-color: #EE4444;
        border-radius: 3px 0 0 3px;
        top: 0;
        left: 0;
    }
}
</style>