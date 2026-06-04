<template>
    <div class="w-full h-full relative flex flex-col pb-[10px]  px-[10px]">
        <div class="flex-1 overflow-hidden box-border">
             <iframe :src="url" width="100%" key="iframe-view"
            allow="accelerometer; camera; microphone; clipboard-read; clipboard-write;fullscreen;webkitfullscreen; mozfullscreen; msfullscreen"
            
            height="100%" frameborder="0"></iframe>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref,watch } from 'vue';
import { useRoute } from 'vue-router';
import CryptoJS from 'crypto-js';
import {checkLoginStatus,enableAutoLogin} from '@/api/labelMark';
const route = useRoute();

const url = ref('')
const KEY = 'laaysptlaayspt12'// 前端生成的Key
const showSystem = ref(false)
const initalFn = async() => {
    const { type,system,...query} = route.query
    showSystem.value = system === 'true'
    // 构造查询字符串
    const queryString = new URLSearchParams(query as Record<string, string>).toString();
    if(type === 'data-labeling'){
        await checkLoginStatus()
        const res =  await enableAutoLogin()
         setTimeout(() => {
           if(res.auto_login_enabled) url.value = res.url
         }, 1000);
        return
    }
    
    
    switch(type){
        case 'train-models':
        case 'data-labeling':
            url.value = `${import.meta.env.VITE_XCPPLATFORM}?hiddenLayout=true`
            break
        case 'knowledge-base':
            url.value = `${import.meta.env.VITE_ZHISHU_PLATFORM}/#/knowledge-bases?token=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmOTJiYjdhNy0xODkwLTRiMmItODVmMy1iOTU3NzE5NDlkNmIiLCJ1c2VybmFtZSI6ImppdWFuYW4ifQ.932GgWBeKdgoA-72rmfnzeARCz8sdN_HqYT425UkOuA`
            break
        case 'action-label':
            url.value = import.meta.env.VITE_LABEL_SYS+ `?username=maintainer@example.com&password=123456&redirect=/tasks?hide_sidebar=1&hide_topnav=1`
            break;
        case 'emergency-map':
            url.value = `${import.meta.env.VITE_YJZ_PLATFORM}`
            break;
        case 'process-flow-recognize':
            url.value = `${import.meta.env.VITE_XSQ_PLATFORM}/video-view`
            break;
        case 'data-labeling':
            // url.value =  import.meta.env.VITE_TRAIN_PLATFORM+`?username=maintainer@example.com&password=password`
            break;

        case 'accident-simulation':
            url.value = `${import.meta.env.VITE_ACGS_PLATFORM}/#/Risk`
            break;

        case 'process-flow-management':
            url.value = `${import.meta.env.VITE_XSQ_PLATFORM}/analysis-setting`
            break;
        // case 'risk-grading-control':
        //     url.value = `${import.meta.env.VITE_LZ_PLATFORM}`
        //     break;
        // case 'train-manage':
        //     url.value = import.meta.env.VITE_XCLABEL_SYS+ `?username=admin&password=admin888&redirect=/train/index?hide_sidebar=1&hide_topnav=1`
        // }
    }
    
    // 如果有额外的查询参数，将其附加到URL上
    if (queryString && url.value) {
        const separator = url.value.includes('?') ? '&' : '?';
        url.value += separator + queryString;
    }
}

  // 执行自动登录
  const performAutoLogin = async () => {
    try {
      const apiBaseUrl = 'http://10.0.0.1:8088';
      const autoLoginUrl = `${apiBaseUrl}/api/labelstudio-auth/auto-login-page`;

      return new Promise<boolean>((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = autoLoginUrl;

        let timeoutId: number;

        // 监听iframe加载完成
        iframe.onload = () => {
          console.log("自动登录iframe加载完成");
          // 等待一小段时间确保登录完成
          timeoutId = window.setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
            console.log("自动登录成功");
            
            resolve(true);
          }, 1500);
        };

        iframe.onerror = () => {
          console.error("自动登录iframe加载失败");
          if (timeoutId) clearTimeout(timeoutId);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          
          resolve(false);
        };

        document.body.appendChild(iframe);

        // 设置超时保护
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            console.warn("自动登录超时");
            document.body.removeChild(iframe);
            
            resolve(false);
          }
        }, 10000);
      });
    } catch (err) {
      console.error("自动登录失败:", err);
      
      return false;
    }
  };


// 使用前端生成的Key加密函数
function encrypt(text: string, KEY: string) {
  // 确保密钥长度为16字节
  const paddedKey = KEY.padEnd(16, '0').slice(0, 16);
  const keyHex = CryptoJS.enc.Utf8.parse(paddedKey);
  const ivHex = CryptoJS.enc.Utf8.parse(paddedKey);
  const encrypted = CryptoJS.AES.encrypt(text, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

watch(() => route.query, initalFn, { immediate: true, deep: true })
</script>
<style scoped lang="scss">
iframe{
   :deep(.TSYCJ){
    display: none;
   }

   :deep(.ant-btn-primary){
    background-color: #4362EF;
    border-color: #4362EF;
   }
}
</style>