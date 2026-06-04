<template>
    <div class="home-views w-full h-[100vh] flex flex-col justify-between">
        <div class="relative h-fit">
            <img src="@/assets/home/bg.jpg" class="w-full relative z-1" />
            <div class="w-full left-0 absolute 
            z-2 content-views box-border flex flex-col justify-between">
                <div>
                    <img src="@/assets/home/company-logo.png" class="logo-img" />
                    <div class="flex items-end title-line-2">
                        <img src="@/assets/home/title_new.png" class="title-img block" />
                        <img src="@/assets/home/des_title.png" class="des-title-img block" />
                    </div>
                </div>
                <div class="flex items-end justify-center flex-1">
                    <div v-for="item,index in handleArr" 
                    :key="index" 
                    @mouseenter="handleMouseEnter(index)"
                    @mouseleave="handleMouseLeave"
                    @click="handleClick(item)"
                    :class="currentIndex === index ? 'translate-y-[-4%]':''"
                    class="cursor-pointer nav-card-item relative">
                        <img :src="currentIndex === index ? item.bgActive:item.bg" class="nav-card-bg" />
                        <div class="absolute top-[3%] left-[12.5%] pt-[20%]
                        right-[3%] bottom-[3%] ">
                            <div class="big-title">{{ item.name }}</div>
                            <div class="big-des">{{ item.des }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-[#788485] text-[14px] mt-[20px] pb-[54px]
		flex flex-col items-center  cursor-pointer" v-if="isShowCompany">
            <div class="leading-1" @click="toCompany">技术支持：示例地区银利华应用科技有限责任公司</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { debounce } from 'lodash-es';
import { useMenuStore } from '@/store/index';
import acitonBg from '@/assets/home/action.png';
import acitonBgA from '@/assets/home/action_a.png';
import analyzeBg from '@/assets/home/analyze.png';
import analyzeBgA from '@/assets/home/analyze_a.png';
import chatBg from '@/assets/home/chat.png';
import chatBgA from '@/assets/home/chat_a.png';
import dangerBg from '@/assets/home/danger.png';
import dangerBgA from '@/assets/home/danger_a.png';

// 是否展示公司信息
const isShowCompany = import.meta.env.VITE_SHOW_COMPANY_INFO === 'true'

// 页面高度响应式变量
const pageHeight = ref(0);

// 计算页面高度
const calculatePageHeight = () => {
  pageHeight.value = document.body.clientHeight;
  document.documentElement.style.setProperty('--page-height', `${pageHeight.value}px`);
};

// 监听页面变化
onMounted(() => {
  calculatePageHeight();
  // 监听窗口大小变化和内容变化
  window.addEventListener('resize', calculatePageHeight);
  window.addEventListener('load', calculatePageHeight);
  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver(calculatePageHeight);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
});

const handleArr = [
    {
        name: '人工智能服务能力',
        des: '智能识别，自动预警',
        path:'aiMenu',
        bg: acitonBg,
        bgActive:acitonBgA,
    },
    {
        name: '安全生产管理业务',
        des: '规范流程，实时监管',
        path:'safetyProMenu',
        bg: dangerBg,
        bgActive:dangerBgA,
    },
    {
        name: '应急指挥服务中心',
        des: '智能响应，高效协同',
        path:'emergencyMenu',
        bg: chatBg,
        bgActive: chatBgA,
    },
    {
        name: '综合风险分析研判',
        des: '全面洞察，精准预判',
        path:'comprehensiveRiskMenu',
        bg:analyzeBg,
        bgActive: analyzeBgA
    },
    
]
const router = useRouter()
const currentIndex= ref<any>('')

// 防抖的鼠标悬浮处理函数
const handleMouseEnter = debounce((index: number) => {
  currentIndex.value = index;
}, 150);

const handleMouseLeave = debounce(() => {
  currentIndex.value = '';
}, 150);

const menuStore = useMenuStore()
const handleClick = (item: any) => {
   menuStore.setCurrentKey(item.path)
   switch (item.path) {
    case 'aiMenu':
      router.replace('/aiInteligent');
      break;
    case 'safetyProMenu':
      const path = menuStore.toSystem('safetyProMenu')
      if (path) router.replace(path);
      break;
    case 'emergencyMenu':
      router.replace('/other-module?type=emergency-map&system=true');
      break;
    case 'comprehensiveRiskMenu':
      router.replace('/dataCockpit');
      break;
    default:
      break;
  }
}
const toCompany = () => {
    window.open('https://www.yinlihua.cn/PCH5/index.html', '_blank')
}
</script>
<style scoped lang="scss">
$design-width: 1920;
$design-height: 980;

// px转vw混入
@mixin px-to-vw($property, $px, $base-width: $design-width) {
  #{$property}: calc((#{$px} / #{$base-width}) * 100vw) !important;
}

// px转vh混入（使用页面高度）
@mixin px-to-vh($property, $px, $base-height: $design-height) {
  #{$property}: calc((#{$px} / #{$base-height}) * var(--page-height, 100vh)) !important;
}

.home-views {
  .logo-img{
    @include px-to-vw(width, 178);
  }
  .content-views{
    height: 96%;
    top:17%;
    @include px-to-vw(padding-left, 80);
    @include px-to-vw(padding-right, 80);
    .title-line-2{
        @include px-to-vh(margin-top, 88);
       .title-img{
            @include px-to-vw(width, 276);
        }
        .des-title-img{
            @include px-to-vw(width, 232);
            @include px-to-vh(margin-bottom, 10);
            @include px-to-vw(margin-left, 24);
        }
    }
  }
  .nav-card-item{
    .nav-card-bg{
        @include px-to-vw(width, 420);
    }
    .big-title{
        line-height: 1;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #576075;
        @include px-to-vw(font-size, 30);
        margin-bottom: 4.7%;
    }
    .big-des{
        line-height: 1;
        font-family: Source Han Sans CN;
        font-weight: 400;
        @include px-to-vw(font-size, 18);
        color: #567DB6;
    }
  }
}
</style>