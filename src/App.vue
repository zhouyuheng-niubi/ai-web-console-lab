<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { App, ConfigProvider } from 'ant-design-vue';
import {onMounted} from 'vue';
import {generateSignature,getEdgeBoxTimestamp,getTokenInfo} from './api/yjbx';
onMounted(async() => {
  // const {signature, ak, nonce,timestamp} = generateSignature();
  // // 更新系统时间
  // await getEdgeBoxTimestamp();
  // const res = await getTokenInfo({
  //   signature,
  //   ak,
  //   nonce,
  //   timestamp: timestamp.toString(),
  // });
  // console.log(res, 'edge_box_token_info');
});

</script>

<template>
  <ConfigProvider :locale="zhCN">
    <App class="h-[100vh] w-[100vw]">
      <RouterView />
    </App>
  </ConfigProvider>
</template>

<style>
.ant-upload-wrapper{
  display: block;
}
body {
  margin: 0;
  padding:0;
}
.notification-custom-class{
  background: #021a40d5 !important;
  color: #01D4FF !important;
  
}
.notification-custom-class .ant-notification-notice-message{
  color: #01D4FF !important;
}
.notification-custom-class  .ant-notification-close-icon{
  color: #01D4FF !important;
}
.dark-warning-modal{
    .ant-modal-content{
      background-color: #052141da;
    }
    .ant-modal-header{
      background-color: transparent;
      color: #fff;
    }
    .ant-modal-title{
      color: #fff;
    }
    .ant-modal-close{
      color: #fff;
    }
    .ant-btn-primary{
      background-color: #00d4ff;
      border-color: #00d4ff;
    }
  }

.tiny-sender__input-row{
  height: fit-content;
}
.required-label {
  &::before {
    content: '*';
    color: red;
    margin-right: 2px;
  }
}
</style>
<style scoped>
.ai-chat-toggle {
  position: relative;
  width: 60px;
  height: 60px;
  cursor: pointer;
}
</style>
