<script setup>
import { computed, nextTick, onUnmounted, ref, watch ,onBeforeUnmount,onBeforeMount} from 'vue';

import {
  AIClient,
  GeneratingStatus,
  STATUS,
  useMessage,
} from '@opentiny/tiny-robot-kit';
import { throttle } from 'lodash-es';
import { message } from 'ant-design-vue';
import {
  TrBubbleList,
  TrContainer,
  TrPrompts,
  TrSender,
} from './tiny-robot';
import {
  CopyOutlined,
  FileTextOutlined,
  SyncOutlined
} from '@ant-design/icons-vue';
import { promptItems, roles } from './chat-config/chat-config';
import {
  controller,
  CustomModelProvider,
} from './chat-config/custom-model-provider';
import { SimpleToolCallHandler } from './chat-config/simple-tool-call-handler';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
  getClientId: {
    type: Function,
    default: () => () => '',
  },
  genCode: {
    type: Function,
    default: () => () => {},
  },
  clearCode: {
    type: Function,
    default: () => () => {},
  },
  memory: {
    type: Boolean,
    default: true,
  },
  zIndex: {
    type: Number,
    default: 1,
  },
  fullscreen:{
    type:Boolean,
    default:false
  }
});

const show = defineModel('show', {
  type: Boolean,
  default: false,
});
const fullscreen = ref(props.fullscreen);
const senderRef = ref(null);
const goBottom = ref(true);
// 存储上一次滚动位置
const lastScrollTop = ref(0);
// 存储滚动容器元素
const containerBodyRef = ref(null);

// 配置AI对话提供商
const customModelProvider = new CustomModelProvider(
  {
    memory: props.memory,
  },
  {
    toolCallHandler: new SimpleToolCallHandler(),
    validator: {
      genCode: props.genCode,
      clearCode: props.clearCode,
    },
    getClientId: props.getClientId,
  },
);

// 配置AI对话客户端
const client = new AIClient({
  provider: 'custom',
  providerImplementation: customModelProvider,
});

const initContent = ref(
  '我是安全生产助手，能为您提供隐患排查、报警处置、危险化学品查询、安全规范、安全知识等服务，随时响应您的需求！ ',
);
const { messages, inputMessage, messageState, sendMessage } = useMessage({
  client,
  useStreamByDefault: true,
  initialMessages: [
    {
      role: 'assistant',
      content: initContent.value,
    },
  ],
});

// 滚动事件处理函数
const handleScroll = () => {
  if (!containerBodyRef.value || !messageState) return;

  const currentScrollTop = containerBodyRef.value.scrollTop;

  // 当状态为streaming且向上滚动时，设置goBottom为false
  if (
    messageState.status === STATUS.STREAMING &&
    currentScrollTop < lastScrollTop.value
  ) {
    goBottom.value = false;
  }

  lastScrollTop.value = currentScrollTop;
};

// 初始化时获取滚动容器并绑定事件
nextTick(() => {
  containerBodyRef.value = document.querySelector('div.tr-bubble-list');
  containerBodyRef.value?.addEventListener('scroll', handleScroll, {
    passive: true,
  });
});

const submitFn = (e) => {
  sendMessage(e);
};

const handlePromptItemClick = (e, item) => {
  sendMessage(item.description);
};

const handleDialog = () => {
  show.value = !show.value;
  senderRef.value?.focus();
};

const showMessages = computed(() => {
  if (messageState.status === STATUS.PROCESSING) {
    return [
      ...messages.value,
      {
        role: 'assistant',
        content: '正在思考中...',
        loading: true,
      },
    ];
  }
  return messages.value.map((v, i) => ({
    ...v,
    status: i === messages.value.length - 1 ? messageState.status : 'finished',
  }));
});

const throttledScroll = throttle(() => {
  const containerBody = document.querySelector('div.tr-bubble-list');
  if (containerBody) {
    containerBody.scrollTo({
      top: containerBody.scrollHeight,
      behavior: 'smooth',
    });
  }
}, 100);

watch(
  () => messageState.status,
  (v) => {
    if (v === 'finished') {
      goBottom.value = true;
    }
  },
  {
    deep: true,
  },
);

watch(
  () => messages.value[messages.value.length - 1]?.content,
  () => {
    if (goBottom.value) {
      nextTick(throttledScroll);
    }
  },
);

const onCopySuccess = (content = `复制成功`) => {
  message.success({
    content,
  });
};

const onCopyError = (content = `复制失败`) => {
  message.error({
    content,
  });
};

// 重新回答功能
const regenerateResponse = (messageItem) => {
  // 找到最后一条匹配的消息的索引
  let messageIndex = -1;
  for (let i = messages.value.length - 1; i >= 0; i--) {
    if (messages.value[i].content === messageItem.content && messages.value[i].role === messageItem.role) {
      messageIndex = i;
      break;
    }
  }
  
  if (messageIndex !== -1) {
    // 如果当前消息是最后一条消息，找到对应的用户消息重新发送
    if (messageIndex === messages.value.length - 1) {
      // 找到上一条用户消息
      for (let i = messageIndex - 1; i >= 0; i--) {
        if (messages.value[i].role === 'user') {
          // 发送相同的用户消息以获取新的AI回复
          sendMessage(messages.value[i].content);
          break;
        }
      }
    }
  }
};

watch(show,()=>{
  if(!show.value){
    router.go(-1)
  }
})
onBeforeMount(() => {
  // 从sessionStorage获取聊天记录
  const storedMessages = window.sessionStorage.getItem('messages-his');
  if (storedMessages) {
    messages.value = JSON.parse(storedMessages);
    // 滚动到最底部
    nextTick(throttledScroll);
  }
})
// 组件卸载时清理资源
onUnmounted(() => {
  customModelProvider.destroy();
  containerBodyRef.value?.removeEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  // 当前窗口存储聊天记录
  window.sessionStorage.setItem('messages-his', JSON.stringify(messages.value))
});
</script>

<template>
  <TrContainer
    v-model:fullscreen="fullscreen"
    v-model:show="show"
    id="tiny-container"
  >
    <template #title>
      <span></span>
    </template>
    <template #operations> </template>
    <template v-if="messages.length === 0">
      <TrPrompts
        :items="promptItems"
        :wrap="true"
        item-class="prompt-item"
        class="tiny-prompts"
        @item-click="handlePromptItemClick"
      />
    </template>
    <TrBubbleList v-else :items="showMessages" :roles="roles">
     
      <template #footer="{ bubbleProps }">
        <template
          v-if="
            initContent !== bubbleProps.content &&
            bubbleProps.status === 'finished'
          "
        >
          <div class="flex">

            <button @click="regenerateResponse(bubbleProps)" v-if="bubbleProps.role === 'assistant'" class="group mr-3 relative flex h-6 w-6 items-center justify-center rounded-md p-1 text-[#00000080] transition-all duration-200 hover:bg-gray-200 active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60">
              <SyncOutlined />
              <span
                class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              >
                重新回答
              </span>
            </button>
            <button
              v-copy="bubbleProps.content"
              @copy-success="onCopySuccess()"
              @copy-error="onCopyError()"
              class="group relative flex h-6 w-6 items-center justify-center rounded-md p-1 text-[#00000080] transition-all duration-200 hover:bg-gray-200 active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
               <CopyOutlined />
              <span
                class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              >
                复制
              </span>
            </button>
            <button
              v-if="bubbleProps.role === 'assistant'"
              v-export-text="bubbleProps.content"
              @copy-success="onCopySuccess('导出成功')"
              @copy-error="onCopyError('导出失败')"
              class="group relative ml-3 flex h-6 w-6 items-center justify-center rounded-md p-1 text-[#00000080] transition-all duration-200 hover:bg-gray-200 active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FileTextOutlined />
              <span
                class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              >
                导出为文本
              </span>
            </button>
          </div>
        </template>
      </template>
    </TrBubbleList>
    <template #footer>
      <TrSender
        class="chat-input"
        mode="multiple"
        :allowSpeech="false"
        :max-length="10000"
        v-model="inputMessage"
        :show-word-limit="true"
        ref="senderRef"
        :placeholder="
          messageState.status === STATUS.PROCESSING
            ? '正在思考中...'
            : '请输入您的问题'
        "
        :clearable="true"
        :loading="GeneratingStatus.includes(messageState.status)"
        @submit="submitFn"
        @cancel="
          controller && (controller.signal?.abort?.(), controller.resolve?.())
        "
      />
    </template>
  </TrContainer>
  <div @click="handleDialog">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.tr-container{
  background-color: transparent;
  border: none;
  :deep(.tr-container__dragging-bar-wrapper .tr-container__dragging-bar){
    display: none;
  }
}
 
#tiny-container {
  position: absolute;
  z-index: v-bind('zIndex');
}

#tiny-container p {
  margin: 0;
  text-align: left;
}

.tr-container__footer {
  padding: 0 16px;
  margin-bottom: 16px;
}

.tr-prompts {
  padding: 0 16px;
}

.prompt-item {
  width: calc(100% - 48px);
}

.tr-bubble__content-wrapper {
  max-width: calc(100% - 56px);
}

.tr-bubbule__body {
  overflow: auto;
}

.tr-prompt__content-label {
  font-size: 1.2em;
}

</style>
