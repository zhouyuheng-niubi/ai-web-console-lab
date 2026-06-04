<template>
    <div class="chat-container relative w-full h-full bg-[#F8FAFC] 
    box-border border-l-[1px]">
        <!-- <ChatDialog :z-index="showChat ? 999 : -1" 
        :fullscreen="true"
        :get-client-id="<REDACTED_CREDENTIAL>"
        :genCode="verifyCode" :clearCode="clearCode" v-model:show="showChat" /> -->
        <ChatAntAi />
        <QrCodeFloat 
        v-if="route.path !== '/mobile/ai-chat'"
        :qr-code-url="mobileChatCode" 
        :defaultExpanded="true" 
        title="智能问答H5端"
        :position="{
            top: 'auto',
            right: '20px',
            bottom: '100px',
            left: 'auto'
        }"
        ></QrCodeFloat>
    </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRoute} from 'vue-router'
// import ChatDialog from '@/components/chat/ChatDialog.vue'
import ChatAntAi from '@/components/chat/Chat-Ant-Ai.vue'
import QrCodeFloat from '@/components/QrCodeFloat.vue';
import mobileChatCode from '@/assets/mobile-chat-code.png'
const route = useRoute()
const getClientId = window.globalVars?.getClientId
const verifyCode = window.globalVars?.genCode
const clearCode = window.globalVars?.clearCode

const showChat = ref(true);
// @ts-ignore
window.callPhone = (phone) => {
  console.log('callPhone', phone);
}
</script>

<style scoped lang="scss">
.chat-container {
    --tr-sender-container-min-height: 100px;
}
</style>

