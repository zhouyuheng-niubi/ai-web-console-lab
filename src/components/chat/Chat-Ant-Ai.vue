<script setup lang="ts">
defineOptions({ name: 'PlaygroundIndependentSetup' })
import type { AttachmentsProps, BubbleListProps, ConversationsProps, PromptsProps } from 'ant-design-x-vue'
import type { VNode } from 'vue'
import {
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  SmileOutlined,
  SyncOutlined,
  MessageOutlined,
  CloseOutlined,
  EditOutlined,
  PlusSquareOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import { Badge, Button, Flex, Space, Typography, message, theme, Input, Modal, Skeleton } from 'ant-design-vue'
import {
  Attachments,
  Bubble,
  Conversations,
  Sender,
  useXAgent,
  useXChat,
} from 'ant-design-x-vue'
import { computed, h, ref, watch, onMounted, onUnmounted, markRaw, defineComponent, shallowRef } from 'vue'
import {
  createConversation,
  conversationList, saveMessage,
  conversationMessages,
  editConversation, deleteConversation, attachmentRecognition
} from '@/api/chat'
import { useAudioRecording } from './useAudioRecording'
// 导入本地AI头像资源
import aiChatGif from '@/assets/ai-chat.gif'
import localAvatar from '@/assets/avator.svg'
// 导入 markdown 渲染器
import { BubbleMarkdownContentRenderer } from './markdown'
import { saveAs } from 'file-saver';
import { nextTick } from 'vue'

// 为window对象扩展globalVars属性
declare global {
  interface Window {
    globalVars?: {
      genCode?: () => Promise<string>;
      clearCode?: () => void;
      getClientId?: () => string;
    };
  }
}
const { token } = theme.useToken()

// 创建 markdown 渲染器实例（使用 markRaw 避免不必要的响应式）
const markdownRenderer = markRaw(new BubbleMarkdownContentRenderer({
  mdConfig: {
    html: true,
    linkify: true,
    typographer: true,
  },
  dompurifyConfig: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'img'],
    ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'class'],
  },
}))

// 移动端菜单可见性
const menuVisible = ref(false)
// 会话列表弹窗可见性
const sessionPopupVisible = ref(false)
// 新建会话按钮状态
const newSessionBtnLoading = ref(false)

// 定义一个真实的API请求函数
const realApiRequest = async (
  message: string,
  attachmentsIds: string[],
  historyMessages: Array<{ message: string; status?: string }>,
  onUpdate?: (chunk: string) => void
) => {
  // 使用window.globalVars中的函数获取必要的认证信息
  // const verifyCode = window.globalVars?.genCode ? await window.globalVars.genCode() : '';
  // const clientId = window.globalVars?.getClientId ? window.globalVars.getClientId() : '';

  abortController.value = new AbortController();

  // 构建消息列表：排除最后一条（当前消息）和初始化消息，取最后4条历史消息
  const historyOnly = historyMessages.slice(0, -1);
  const filteredHistory = historyOnly.filter(msg => msg.message !== initContent);
  const lastFourMessages = filteredHistory.slice(-4);
  const formattedHistory = lastFourMessages.map(msg => ({
    role: msg.status === 'local' ? 'user' : 'assistant',
    content: msg.message
  }));

  // 添加当前消息
  const allMessages = [
    ...formattedHistory,
    { role: 'user' as const, content: message }
  ];

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'connector-client-id': clientId,
      // 'mcp-verify-code': verifyCode,
    },
    body: JSON.stringify({
      messages: allMessages,
      attachments: attachmentsIds,
    }),
    signal: abortController.value.signal,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_NEWAI_API}/ai/chat/jaa`,
      options,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`,
      );
    }

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) return '';

    const decoder = new TextDecoder('utf-8');
    let text = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ') && line.slice(6) !== '[DONE]') {
          try {
            const messageData = JSON.parse(line.slice(6));
            const content = messageData.choices[0]?.delta?.content;
            if (content) {
              text += content;
              if (onUpdate) {
                onUpdate(content);
              }
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

    return text;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

// 保存AI回复消息
const saveAIResponse = async (content: string) => {
  try {
    // 调用API保存AI回复消息
    const res = await saveMessage({
      content,
      conversation_id: activeKey.value,
      role: 'assistant'
    });
    if (res.code === 200) {
      // 保存成功
    }
  } catch (error) {
    console.error('保存AI回复消息失败:', error);
  }
};

// 开始编辑会话标题
const startEditTitle = (event: Event) => {
  event.stopPropagation();
  if(activeKey.value.includes('temp-')) return 
  const conversation = conversationsItems.value.find(item => item.key === activeKey.value);
  if (conversation) {
    editTitleValue.value = conversation.label;
    lastTitleValue.value = conversation.label;
    isEditingTitle.value = true;
  }
};

// 保存会话标题
const saveEditTitle = async () => {
  if(activeKey.value.includes('temp-')) {
    message.error('发送您的问题后再编辑标题');
    return;

  }
  if (!editTitleValue.value.trim()) {
    message.error('标题不能为空');
    return;
  }

  // 检查标题是否发生变化
  if (editTitleValue.value.trim() === lastTitleValue.value) {
    isEditingTitle.value = false;
    return;
  }

  const conversation = conversationsItems.value.find(item => item.key === activeKey.value);
  if (conversation) {
    editTitleLoading.value = true;
    try {
      // 调用API更新会话标题
      const res = await editConversation({
        conversation_id: activeKey.value,
        title: editTitleValue.value.trim(),
      });

      if (res.code === 200) {
        // 更新本地会话列表（使用就地更新而非 map）
        const index = conversationsItems.value.findIndex(item => item.key === activeKey.value);
        if (index !== -1) {
          conversationsItems.value[index].label = editTitleValue.value.trim();
        }
        lastTitleValue.value = editTitleValue.value.trim();
        isEditingTitle.value = false;
      }
    } catch (error) {
      console.error('更新会话标题失败:', error);
      message.error('更新标题失败');
    } finally {
      editTitleLoading.value = false;
    }
  }
};

// 取消编辑会话标题
const cancelEditTitle = () => {
  isEditingTitle.value = false;
  const conversation = conversationsItems.value.find(item => item.key === activeKey.value);
  if (conversation) {
    editTitleValue.value = conversation.label;
  }
};

// 处理重命名弹窗确认
const handleRenameConfirm = async () => {
  if (!renameInputValue.value.trim()) {
    message.error('对话名称不能为空');
    return;
  }

  // 检查名称是否发生变化
  const currentConversation = conversationsItems.value.find(item => item.key === renameConversationKey.value);
  if (currentConversation && renameInputValue.value.trim() === currentConversation.label) {
    renameModalVisible.value = false;
    return;
  }

  try {
    // 调用API更新会话标题
    const res = await editConversation({
      conversation_id: renameConversationKey.value,
      title: renameInputValue.value.trim(),
    });

    if (res.code === 200) {
      // 更新本地会话列表
      conversationsItems.value = conversationsItems.value.map(item => {
        if (item.key === renameConversationKey.value) {
          return {
            ...item,
            label: renameInputValue.value.trim()
          };
        }
        return item;
      });
      message.success('对话名称修改成功');
    }
  } catch (error) {
    console.error('修改对话名称失败:', error);
    message.error('修改对话名称失败');
  } finally {
    renameModalVisible.value = false;
  }
};

// 处理重命名弹窗取消
const handleRenameCancel = () => {
  renameModalVisible.value = false;
};

// 删除会话
const deleteConversationItem = async (conversationId: string) => {
  try {
    // 判断是否是临时会话，如果是则直接删除
    const dataIndex = conversationsItems.value.findIndex(item => item.key === conversationId);
    if (dataIndex !== -1 && !conversationsItems.value[dataIndex]?.isTemp) {
      const res = await deleteConversation({ conversationId });
      if (res.code !== 200) return
    }

    // 从本地列表中移除会话
    conversationsItems.value = conversationsItems.value.filter(item => item.key !== conversationId);

    // 如果删除的是当前激活的会话，切换到其他会话
    if (activeKey.value === conversationId) {
      if (conversationsItems.value.length > 0) {
        onConversationClick(conversationsItems.value[0].key);
      } else {
        // 如果没有会话了，创建一个新会话
        await onAddConversation();
      }
    }
    message.success('会话删除成功');
  } catch (error) {
    console.error('删除会话失败:', error);
    message.error('删除会话失败');
  }
};

// 点击外部关闭编辑
const handleClickOutside = (event: Event) => {
  let target = event.target as Node;
  // 如果target是文本节点，获取其父元素
  while (target && target.nodeType !== Node.ELEMENT_NODE) {
    target = target.parentNode;
  }
  if (!target || !(target as HTMLElement).closest('.title-edit-container')) {
    cancelEditTitle();
  }
};

// 移除点击外部关闭编辑的事件监听

// 创建自定义的useXAgent，使用真实的API
const [agent] = useXAgent<string, { message: string, attachments: string[] }, string>({
  request: async ({ message, attachments }, { onSuccess, onError,onUpdate }) => {
    agentRequestLoading.value = true;
    try {
      const response = await realApiRequest(message, attachments, messages.value, onUpdate);
      onSuccess([response]);
      nextTick(() => {
        scrollToBottom();
      });
      // 保存AI回复消息
      if (activeKey.value) {
        await saveAIResponse(response);
      }
    } catch (error) {
      onError(error);
    } finally {
      agentRequestLoading.value = false;
      // 清理controller
      abortController.value = null;
    }
  },
});

const { onRequest, messages, setMessages } = useXChat({
  agent: agent.value,
  transformMessage: (info) => {
    const { originMessage, chunk } = info;
    // 在流式更新时触发滚动到底部
    if (chunk) {
      // 使用 nextTick 确保 DOM 更新后再滚动
      nextTick(() => {
        scrollToBottom();
      });
    }
    // 简单的文本累积
    return `${originMessage || ''}${chunk || ''}`;
  },
});

const styles = computed(() => {
  return {
    'layout': {
      'width': '100%',
      'min-width': '300px',
      'height': '100%',
      'min-height': '500px',
      'border-radius': `${token.value.borderRadius}px`,
      'display': 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'justify-content': 'center',
      'background': `${token.value.colorBgContainer}`,
      'font-family': `AlibabaPuHuiTi, ${token.value.fontFamily}, sans-serif`,
    },
    'menu': {
      'background': `${token.value.colorBgLayout}80`,
      'width': '280px',
      'max-width': '30vw',
      'height': '100%',
      'display': 'flex',
      'flex-direction': 'column',
      '@media screen and (max-width: 768px)': {
        'position': 'absolute',
        'zIndex': 999,
        'width': '80%',
        'height': '100%',
        'transform': menuVisible.value ? 'translateX(0)' : 'translateX(-100%)',
        'transition': 'transform 0.3s ease',
      },
    },
    'menu-mobile-open': {
      '@media screen and (max-width: 768px)': {
        'transform': 'translateX(0)',
      },
    },
    'conversations': {
      'padding': '0 12px',
      'flex': 1,
      'overflow-y': 'auto',
    },
    'chat': {
      'flex': '1',
      'overflow-y': 'auto',
      'width': '100%',
      'max-width': '100%',
      'margin': '0',
      'box-sizing': 'border-box',
      'display': 'flex',
      'flex-direction': 'column',
      'padding': `${token.value.paddingMD}px`,
      'gap': '12px',
      'background': '#F8FAFC',
      '@media screen and (max-width: 768px)': {
        'padding': `${token.value.paddingXS}px`,
      },
    },
    'messages': {
      'flex': 1,
      'overflow-y': 'auto',
      'position': 'relative',
    },
    'placeholder': {
      'padding-top': '32px',
      'text-align': 'left',
      'flex': 1,
      'overflow-y': 'auto',
    },
    'senderBody': {
      width: '100%',
      'box-shadow': token.value.boxShadow,
      'background': token.value.colorBgContainer,
      'padding': `${token.value.paddingSM}px`,
    },
    'sender': {
      'width': '100%',

    },
    'logo': {
      'display': 'flex',
      'width': '100%',
      'height': '60px',
      'align-items': 'center',
      'justify-content': 'space-between',
      'padding': '0 16px',
      'box-sizing': 'border-box',
      '@media screen and (max-width: 768px)': {
        'padding': '0 12px',
        'height': '50px',
      },
    },
    'logo-img': {
      width: '20px',
      height: '20px',
      display: 'inline-block',
      '@media screen and (max-width: 768px)': {
        width: '18px',
        height: '18px',
      },
    },
    'logo-span': {
      'display': 'inline-block',
      'margin': '0 6px',
      'font-weight': 'bold',
      'color': token.value.colorText,
      'font-size': '14px',
      '@media screen and (max-width: 768px)': {
        'font-size': '13px',
      },
    },
    'addBtn': {
      background: '#1677ff0f',
      border: '1px solid #1677ff34',
      width: 'calc(100% - 16px)',
      margin: '0 8px 16px 8px',
      '@media screen and (max-width: 768px)': {
        'width': 'calc(100% - 12px)',
        'margin': '0 6px 12px 6px',
      },
    },
    'mobile-menu-toggle': {
      'display': 'none',
      '@media screen and (max-width: 768px)': {
        'display': 'block',
        'position': 'absolute',
        'top': '16px',
        'left': '16px',
        'zIndex': 1000,
      },
    },
    'overlay': {
      'display': 'none',
      '@media screen and (max-width: 768px)': {
        'display': menuVisible.value ? 'block' : 'none',
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0,
        'backgroundColor': 'rgba(0, 0, 0, 0.5)',
        'zIndex': 998,
      },
    },
    'drawer-header': {
      'display': 'flex',
      'justify-content': 'space-between',
      'align-items': 'center',
      'padding': '12px',
      'border-bottom': `1px solid ${token.value.colorSplit}`,
      'margin-bottom': '12px',
    },
    'drawer-title': {
      'margin': 0,
      'fontSize': '16px',
      'fontWeight': '500',
    },
  } as const
})

function renderTitle(icon: VNode, title: string) {
  return h(Space, { align: 'start' }, () => [icon, h('span', title)])
}

const placeholderPromptsItems: PromptsProps['items'] = [
  {
    key: '1',
    label: renderTitle(h(FireOutlined, { style: { color: '#FF4D4F' } }), '热门话题'),
    description: '您感兴趣的是？',
    children: [
      {
        key: '1-1',
        description: `X 中有什么新内容？`,
      },
      {
        key: '1-2',
        description: `什么是通用人工智能（AGI）？`,
      },
      {
        key: '1-3',
        description: `文档在哪里？`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(h(ReadOutlined, { style: { color: '#1890FF' } }), '设计指南'),
    description: '如何设计一个好的产品？',
    children: [
      {
        key: '2-1',
        icon: h(HeartOutlined),
        description: `深入了解`,
      },
      {
        key: '2-2',
        icon: h(SmileOutlined),
        description: `设置AI角色`,
      },
      {
        key: '2-3',
        icon: h(CommentOutlined),
        description: `表达感受`,
      },
    ],
  },
]

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    typing: { step: 100, interval: 1 },
    styles: {
      content: {

      },
    },
    avatar: {
      size: 40,
    },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
    avatar: {
      size: 40,
    },
  },
  file: {
    placement: 'end',
    avatar: { size: 40, style: { visibility: 'hidden' } },
    variant: 'borderless',
    messageRender: (items) => h(
      'div',
      {
        style: {
          display: 'flex',
          gap: '12px',
          overflowY: 'hidden',
          maxWidth: '80vw',
          justifyContent: 'flex-end',
          paddingBottom: '4px',
          flexWrap: 'wrap',
        }
      },
      (items as any[]).map((item) => h(
        Attachments.FileCard,
        {
          key: item.uid,
          item:{
            ...item,
            description:item.description|| '附件',
          },
          onClick: () => {
            handleBubbleClick(item)
          },
          style: { flexShrink: 0, maxWidth: '200px', maxHeight: '200px' }
        }
      ))
    ),
  },
}

// ==================== 自定义 InputTextArea 组件 ====================
// 导入 triggerFocus 工具函数
const triggerFocus = (input: any, option?: any) => {
  if (!input) return
  try {
    if (option?.cursor === 'all') {
      input.focus()
      input.select()
    } else if (option?.cursor === 'end') {
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    } else {
      input.focus()
    }
  } catch (error) {
    // Ignore error
  }
}

const MyInputTextArea = defineComponent({
  name: 'MyInputTextArea',
  setup(props, { attrs, expose }) {
    const textAreaRef = shallowRef()

    const focus = (option?: any) => {
      triggerFocus(textAreaRef.value, option)
    }

    const blur = () => {
      textAreaRef.value?.blur()
    }

    expose({
      focus,
      blur,
    })

    return () => h(
      Input.TextArea as any,
      {
        ...attrs,
        ref: textAreaRef,
        autoSize:  { minRows: 2, maxRows: 5 },
        maxlength: 5000,
        showCount: true,
        placeholder:"请输入您的问题",
        style:{
          fontSize:'15px'
        }
      }
    )
  },
})

// ==================== State ====================
const headerOpen = ref(false)
const content = ref('')
const conversationsItems = ref([])
const activeKey = ref('')
const attachedFiles = ref<AttachmentsProps['items']>([])
// Track saved attachment IDs per conversation to avoid duplicate saves
const savedAttachmentsPerConversation = ref<Record<string, Set<string>>>({})
const conversationsRef = ref<any>()
const agentRequestLoading = ref(false)
const abortController = ref<AbortController | null>(null)
const isEditingTitle = ref(false)
const editTitleValue = ref('')
const editTitleLoading = ref(false)
const lastTitleValue = ref('')
const titleEditTimeout = ref<number | null>(null)
// 重命名弹窗相关状态
const renameModalVisible = ref(false)
const renameInputValue = ref('')
const renameConversationKey = ref('')
// 加载状态
const isLoadingMessages = ref(false)
const isLoadingMoreMessages = ref(false) // 新增：用于区分初始加载和追加加载
const isLoadingMoreConversations = ref(false)
// 启用自动滚动，让流式输出时滚动位置保持在底部
const autoMessageScroll = ref(true)
// 初始化消息
const initContent = '我是安全生产助手，能为您提供隐患排查、报警处置、危险化学品查询、安全规范、安全知识等服务，随时响应您的需求！';


// ========== 录音功能函数 ==========
const {
  audioBlob,
  mediaRecorder,
  audioChunks,
  isProcessingAudio,
  speechConfig,
} = useAudioRecording(content)

// ========== 录音功能函数结束 ==========


// 获取会话列表
const conversationPage = {
  page: 1,
  total: 0,
  limit: 20,
}
// 会话历史列表
const historyPage = {
  page: 1,
  total: 0,
  limit: 10,
}



watch(activeKey, () => {
  if (activeKey.value !== undefined) {
    // 当切换会话时，会通过onConversationClick从API获取消息
  }
}, { immediate: true })

// 监听标题编辑，添加节流功能
watch(editTitleValue, (newValue) => {
  // 清除之前的定时器
  if (titleEditTimeout.value) {
    clearTimeout(titleEditTimeout.value);
  }

  // 设置新的定时器，300毫秒后保存
  titleEditTimeout.value = window.setTimeout(() => {
    // 只有在编辑模式下才自动保存
    if (isEditingTitle.value && newValue.trim()) {
      saveEditTitle();
    }
  }, 300);
});

// ===== 会话列表菜单配置（缓存避免重复创建）=====
const menuItemItems = [
  {
    label: '重命名',
    key: 'rename',
    icon: h(EditOutlined),
  },
  {
    label: '删除',
    key: 'delete',
    icon: h(DeleteOutlined),
    danger: true,
  },
];

const menuConfig = (conversation) => ({
  trigger: () => h(PlusSquareOutlined, { onClick: (event) => event.stopPropagation() }),
  items: conversation.isTemp ? menuItemItems.slice(1) : menuItemItems,
  onClick: (menuInfo) => {
    menuInfo.domEvent.stopPropagation();
    console.log(`Click ${conversation.key} - ${menuInfo.key}`);
    switch (menuInfo.key) {
      case 'rename':
        // 打开重命名弹窗
        const targetConversation = conversationsItems.value.find(item => item.key === conversation.key);
        if (targetConversation) {
          renameConversationKey.value = conversation.key;
          renameInputValue.value = targetConversation.label;
          renameModalVisible.value = true;
        }
        break;
      case 'delete':
        deleteConversationItem(conversation.key)
        break;
    }
  },
});

/**
 * 停止AI请求
 */
const stopRequest = () => {
  if (abortController.value) {
    abortController.value.abort();
    abortController.value = null;
    agentRequestLoading.value = false;
  }
};

// ==================== Event ====================
async function onSubmit(nextContent: string) {
  // 如果正在加载中，禁止发送新内容
  if (agentRequestLoading.value) {
    return;
  }
  
  if (!nextContent) return;
  // 判断文件是否有上传

  if (attachedFiles.value.length > 0) {
    const hasUnfinishedFile = attachedFiles.value.some(file => file.percent < 100);
    if (hasUnfinishedFile) {
      message.info('存在文件未上传完成，请稍后');
      return;
    }
  }
  // 检查当前会话是否为临时会话
  const conversation = conversationsItems.value.find(item => item.key === activeKey.value);
  if (conversation && conversation.isTemp) {
    // 使用第一条消息的内容作为对话标题
    const conversationTitle = nextContent.length > 20 ? nextContent.substring(0, 20) + '...' : nextContent;

    // 创建正式会话
    try {
      const res = await createConversation({
        title: conversationTitle,
      });

      if (res.code === 200) {
        const conversationId = res.data.id;

        // 更新会话列表，替换临时会话为正式会话（使用就地更新）
        const index = conversationsItems.value.findIndex(item => item.key === activeKey.value);
        if (index !== -1) {
          conversationsItems.value[index].key = conversationId;
          conversationsItems.value[index].label = conversationTitle;
          // 删除 isTemp 属性（如果存在）
          delete (conversationsItems.value[index] as any).isTemp;
        }

        // 更新激活的会话ID
        activeKey.value = conversationId;
      }
    } catch (error) {
      console.error('创建正式会话失败:', error);
      return;
    }
  }
  // 先调用onRequest，它会自动添加一条纯文本消息到列表
  onRequest({
    message: nextContent,
    attachments: attachedFiles.value.map(file => file.id)
  })
  content.value = ''

  // 等待消息被添加到列表
  await nextTick()

  // 获取onRequest刚添加的消息ID（在最后一条）
  const lastMessageIndex = messages.value.length - 1
  const files = attachedFiles.value.map(file => ({
        id: file.id,
        name: file.name,
        url: file.url,
        type: file.type
      }))
  let newAttachments = []
  if (lastMessageIndex >= 0) {
    const lastMessage = messages.value[lastMessageIndex]
    const conversationId = activeKey.value
    
    // 确保当前会话有已保存附件集合
    if (!savedAttachmentsPerConversation.value[conversationId]) {
      savedAttachmentsPerConversation.value[conversationId] = new Set()
    }
    const savedAttachmentsSet = savedAttachmentsPerConversation.value[conversationId]
    
    // 过滤附件：只包含已上传成功（有ID）且未保存过的附件
    newAttachments = files.filter(attachment => {
      return attachment.id && !savedAttachmentsSet.has(attachment.id)
    })

    // 用带附件的消息替换最后一条消息
    const updatedMessage = {
      ...lastMessage,
      attachments: newAttachments
    }
    const updatedMessages = [...messages.value]
    updatedMessages[lastMessageIndex] = updatedMessage as any
    setMessages(updatedMessages)
  }
  // 保存消息到API
  if (activeKey.value) {
    onSaveMessageApi(nextContent,newAttachments)
  }
  setTimeout(() => {
    scrollToBottom();
  }, 0); // 增加延迟到 100ms
}

// 监听窗口大小变化，在大屏模式下确保菜单始终可见
watch(
  () => window.innerWidth,
  (width) => {
    if (width > 768) {
      menuVisible.value = false // 在桌面端不显示移动端菜单
    }
  }
)

const onPromptsItemClick: PromptsProps['onItemClick'] = (info) => {
  onRequest({ message: info.data.description as string })
}

async function onAddConversation() {
  // 检查当前会话是否为临时会话且没有发送过消息
  const conversation = conversationsItems.value.find(item => item.key === activeKey.value);
  if (conversation && conversation.isTemp) {
    // 检查当前消息是否只有初始消息
    const currentMessages = messages.value;
    if (currentMessages.length === 1 && currentMessages[0].message === initContent) {
      message.warning('当前会话尚未发送消息，请先发送消息后再创建新会话');
      return;
    }
  }

  // 显示加载状态
  newSessionBtnLoading.value = true;

  try {
    // 创建临时本地会话，不立即调用API
    const tempKey = `temp-${Date.now()}`;
    const title = `新对话`;

    // 更新会话列表
    conversationsItems.value = [
      ...conversationsItems.value,
      {
        key: tempKey,
        label: title,
        isTemp: true // 标记为临时会话
      },
    ];
    editTitleValue.value = title;
    activeKey.value = tempKey;

    // 重置加载状态（新会话不需要显示骨架屏）
    isLoadingMessages.value = false;
    isLoadingMoreMessages.value = false;

    // 清空消息并设置初始消息
    setMessages([
      {
        id: 'init-' + Date.now(),
        message: initContent,
        status: 'success',
      }
    ]);

    // 关闭弹窗
    cancelSessionPopup()

    // 在移动端上创建新对话后关闭菜单
    if (window.innerWidth <= 768) {
      menuVisible.value = false
    }
  } catch (error) {
    console.error('创建临时会话失败:', error);
  } finally {
    // 隐藏加载状态
    newSessionBtnLoading.value = false;
  }
}

// 点击会话项后在移动端关闭菜单
const onConversationClick: ConversationsProps['onActiveChange'] = async (key) => {
  activeKey.value = key

  // 重置历史消息分页状态
  historyPage.page = 1;
  historyPage.total = 0;

  // 显示加载状态（初始加载）
  isLoadingMessages.value = true;
  isLoadingMoreMessages.value = false;
  cancelSessionPopup()
  // 从API获取会话历史消息
  try {
    const formattedMessages = await loadConversationMessages(key, 1, historyPage.limit, true);
    if (formattedMessages.length > 0) {
      setMessages(formattedMessages);

      // 第一页数据加载完成后，滚动到底部
      setTimeout(() => {
        scrollToBottom();
      }, 0); // 增加延迟到 100ms
    }
  } catch (error) {
    console.error('获取会话历史消息失败:', error);
  } finally {
    // 隐藏加载状态
    isLoadingMessages.value = false;
    isLoadingMoreMessages.value = false;
  }

  // 在移动端上选择会话后关闭菜单
  if (window.innerWidth <= 768) {
    menuVisible.value = false
  }
}

// 操作功能相关函数
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
const regenerateResponse = async (messageItem) => {
  // 找到当前 AI 消息的索引
  const currentIndex = messages.value.findIndex(msg => msg.id === messageItem.key);

  // 如果找到了 AI 消息，并且前一条消息存在（即用户消息）
  if (currentIndex > 0) {
    const userMessage = messages.value[currentIndex - 1];

    // 重新发起请求，使用用户消息的内容和附件
    if (userMessage && userMessage.message) {
      // 从附件对象中提取文件ID数组
      const attachmentIds = (userMessage.attachments || []).map(attach => attach.id).filter(Boolean);
      
      // 调用 onRequest 发送消息
      onRequest({ 
        message: userMessage.message,
        attachments: attachmentIds
      });

      // 等待消息被添加到列表
      await nextTick();

      // 获取新添加的消息的索引（应该在当前AI消息之后）
      const newMessageIndex = currentIndex + 1;
      
      if (newMessageIndex < messages.value.length) {
        const newMessage = messages.value[newMessageIndex];
        
        // 用历史附件信息更新新消息的附件
        const updatedMessage = {
          ...newMessage,
          attachments: userMessage.attachments || []
        };
        const updatedMessages = [...messages.value];
        updatedMessages[newMessageIndex] = updatedMessage as any;
        setMessages(updatedMessages);
      }
    }
  }
};

// 加载会话消息的统一函数
const loadConversationMessages = async (conversationId, page = 1, limit = historyPage.limit, setInitialMessage = true) => {
  const noDataFn = () => {
    if (setInitialMessage) {
      setMessages([
        {
          id: 'init-' + Date.now(),
          message: initContent,
          status: 'success',
        }
      ]);
    }
    return []
  }
  try {
    if (!conversationId || conversationId.includes('temp-')) {
      return noDataFn()
    }
    const res = await conversationMessages({
      conversation_id: conversationId,
      skip: (page - 1) * limit,
      limit: limit
    });

    if (res.code === 200) {
      const messagesData = res.data || [];
      // 更新总消息数
      historyPage.total = res.total || 0;
      historyPage.page = page;

      // 提取并跟踪已保存的附件ID
      if (!savedAttachmentsPerConversation.value[conversationId]) {
        savedAttachmentsPerConversation.value[conversationId] = new Set();
      }
      const savedAttachments = savedAttachmentsPerConversation.value[conversationId];
      
      // 转换消息格式以匹配组件需求
      const formattedMessages = messagesData.map(msg => {
        // 提取附件ID并添加到已保存集合
        (msg.attachments || []).forEach(attach => {
          if (attach.id) {
            savedAttachments.add(attach.id);
          }
        });
        
        return {
          id: msg.id || 'msg-' + Date.now() + Math.random(),
          message: msg.content,
          status: msg.role === 'user' ? 'local' : 'success',
          isHistory: true, // 标记为历史消息，不使用流式渲染
          attachments: (msg.attachments || []).map(attach => ({
            ...attach,
            status: 'done' // 标记为已完成状态，防止编辑
          }))
        };
      }).reverse();

      // 如果没有历史消息且需要设置初始消息
      if (formattedMessages.length === 0 && setInitialMessage) {
        return noDataFn()
      } else {
        return formattedMessages;
      }
    }
    return [];
  } catch (error) {
    console.error('获取会话消息失败:', error);
    return noDataFn()
  }
};

// 会话列表滚动事件处理
const handleConversationsScroll = () => {
  if (conversationsRef.value) {
    const conversationsElement = conversationsRef.value.$el;
    if (conversationsElement) {
      const { scrollTop, scrollHeight, clientHeight } = conversationsElement;
      const tragger = scrollHeight - scrollTop - clientHeight < 50
      // 当滚动到底部100px以内时，加载更多数据
      if (tragger) {
        loadMoreConversations();
      }
    }
  }
};

// 消息列表滚动事件处理
const handleMessagesScroll = (event: Event) => {
  if (event.target instanceof HTMLElement) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    // 当滚动到顶部时，加载更多数据
    if (scrollTop < 50) {
      loadMoreMessages();
    }
    // 判断是否显示滚动到底部按钮
    // 当距离底部超过200像素时显示按钮
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    showScrollToBottom.value = distanceToBottom > 200;
  }
};

// 加载更多会话数据
const loadMoreConversations = async () => {
  // 检查是否已经在加载中，或者已经没有更多数据
  if (isLoadingMoreConversations.value || conversationsItems.value.length >= conversationPage.total) {
    return;
  }
  isLoadingMoreConversations.value = true;
  try {
    // 增加页码
    conversationPage.page += 1;
    // 调用API获取更多会话列表
    const res = await conversationList({
      skip: (conversationPage.page - 1) * conversationPage.limit,
      limit: conversationPage.limit,
      is_active: true
    });

    if (res.code === 200) {
      const moreConversations = res.data || [];
      if (moreConversations.length > 0) {
        // 将新数据添加到现有会话列表中
        conversationsItems.value = [
          ...conversationsItems.value,
          ...moreConversations.map(item => ({
            key: item.id,
            label: item.title || `对话 ${item.id}`,
          }))
        ];
      }
    }
  } catch (error) {
    console.error('加载更多会话失败:', error);
  } finally {
    isLoadingMoreConversations.value = false;
  }
};

// 消息列表引用
const messagesListRef = ref(null);
// 是否显示滚动到底部按钮
const showScrollToBottom = ref(false);

// 滚动到底部的函数
const scrollToBottom = () => {
  showScrollToBottom.value = false; // 隐藏按钮
  if (messagesListRef.value && typeof messagesListRef.value.scrollTo === 'function') {
    messagesListRef.value.scrollTo({
      offset: 999999,
      behavior: 'auto'
    });
  } else {
    const listEl = document.querySelector('.ant-bubble-list') as HTMLElement;
    if (listEl) {
      listEl.scrollTop = listEl.scrollHeight;
    }
  }
};

// 加载更多消息数据
const loadMoreMessages = async () => {
  // 检查是否已经在加载中，或者当前没有激活的会话
  if (isLoadingMessages.value || isLoadingMoreMessages.value || !activeKey.value) {
    return;
  }

  // 检查是否还有更多数据可以加载
  const currentMessagesCount = messages.value.length;
  if (currentMessagesCount >= historyPage.total && historyPage.total > 0) {
    return;
  }

  isLoadingMoreMessages.value = true;

  // 保存当前的滚动位置和高度（通过 DOM 直接获取）
  let scrollTopBefore = 0;
  let scrollHeightBefore = 0;
  let scrollElement: HTMLElement | null = null;

  // 获取滚动容器元素
  const getScrollElement = (): HTMLElement | null => {
    // 方法1：通过 messagesListRef 获取
    if (messagesListRef.value?.nativeElement) {
      return messagesListRef.value.nativeElement;
    } else if (messagesListRef.value?.$el) {
      return messagesListRef.value.$el;
    }
    // 方法2：通过 DOM 选择器获取
    return document.querySelector('.ant-bubble-list') as HTMLElement;
  };

  scrollElement = getScrollElement();
  if (scrollElement) {
    scrollTopBefore = scrollElement.scrollTop;
    scrollHeightBefore = scrollElement.scrollHeight;
  }

  try {
    // 增加页码
    const nextPage = historyPage.page + 1;
    // 调用API获取更多历史消息
    const formattedMessages = await loadConversationMessages(activeKey.value, nextPage, historyPage.limit, false);

    if (formattedMessages.length > 0) {
      // 使用 scrollToBefore 模式更新消息，避免列表跳动
      setMessages([...formattedMessages, ...messages.value]);

      // 等待 DOM 更新完成
      await nextTick();

      // 滚动位置恢复函数
      const restoreScroll = () => {
        const updatedScrollElement = getScrollElement();
        if (!updatedScrollElement) return;

        const scrollHeightAfter = updatedScrollElement.scrollHeight;
        const addedHeight = scrollHeightAfter - scrollHeightBefore;
        const newScrollTop = scrollTopBefore + addedHeight;

        // 使用 scrollTo 方法设置滚动位置
        if (messagesListRef.value && typeof messagesListRef.value.scrollTo === 'function') {
          messagesListRef.value.scrollTo({
            offset: newScrollTop,
            behavior: 'auto'
          });
        } else {
          // 回退到直接设置 scrollTop
          updatedScrollElement.scrollTop = newScrollTop;
        }
      };

      // 使用 requestAnimationFrame 确保 DOM 完全渲染后再恢复滚动
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          restoreScroll();
        });
      });
    }
  } catch (error) {
    console.error('加载更多消息失败:', error);
  } finally {
    isLoadingMoreMessages.value = false;
  }
};



const items = computed<BubbleListProps['items']>(() => {
  if (messages.value.length === 0) {
    return [{ content: initContent, role: 'ai', avatar: { src: aiChatGif }, footer: undefined, key: 'init-' + Date.now() }]
  }

  // 使用普通循环代替 flatMap，减少函数调用开销
  const resultItems: any[] = [];

  for (const msg of messages.value) {
    const isAI = msg.status !== 'local';
    const isHistory = (msg as any).isHistory; // 检查是否为历史消息
    const shouldShowLoading = msg.status === 'loading' && (!msg.message || msg.message.length === 0);
    const avatar = isAI ? { src: aiChatGif } : { src: localAvatar };

    // 创建附件消息（放在前面）
    if (msg.attachments && msg.attachments.length > 0) {
      const attachmentItems = msg.attachments.map((attach: any) => ({
        name: attach.name,
        url: attach.url,
        type: attach.type,
        status: 'done' // 确保附件显示为已完成状态
      }));

      resultItems.push({
        key: msg.id + '-attachments',
        loading: shouldShowLoading,
        role: 'file',
        content: attachmentItems,
      });
    }

    // 创建文本消息（放在后面）
    if (msg.message) {
      // 禁用打字机效果，让流式输出直接显示，速度更快
      const shouldUseTyping = false;

      resultItems.push({
        key: msg.id,
        loading: shouldShowLoading,
        role: isAI ? 'ai' : 'local',
        content: msg.message,
        avatar,
        // 历史消息禁用打字机效果，新AI消息使用默认typing配置
        typing: shouldUseTyping,
        // 使用Markdown渲染
        messageRender: isAI ? (content: string) => markdownRenderer.render({ content }) : undefined,
        // 添加footer插槽，仅对AI消息显示操作按钮
        footer: isAI ? msg.message : undefined
      });
    }

    // 如果既没有文本也没有附件，创建一个空消息
    if (!msg.message && (!msg.attachments || msg.attachments.length === 0)) {
      resultItems.push({
        key: msg.id,
        loading: shouldShowLoading,
        role: isAI ? 'ai' : 'local',
        content: '',
        avatar,
        // 空消息不需要footer
        footer: undefined
      });
    }
  }

  // 如果AI正在响应（请求发送后，响应接收前），则在最后添加一个AI加载项
  if (agentRequestLoading.value) {
    // 检查是否已经有一个AI加载项，避免重复添加
    const hasAILoadingItem = resultItems.some(item => item.key === 'ai-loading');
    const lastMessage = messages.value[messages.value.length - 1];
    const hasAIResponseWithContent = lastMessage &&
      lastMessage.status !== 'local' &&
      lastMessage.message &&
      lastMessage.message.length > 0;

    // 只有在没有AI响应内容时才显示加载气泡
    if (!hasAILoadingItem && !hasAIResponseWithContent) {
      resultItems.push({
        key: 'ai-loading',
        loading: true,
        role: 'ai',
        content: '',
        avatar: { src: aiChatGif }, // AI头像
        footer: undefined, // 为空内容时不显示footer
      });
    }
  }

  return resultItems;
})

// ==================== 会话管理 ====================
const historyList = ref([])
const getconversationList = async () => {
  try {
    // 显示加载状态（初始加载）
    isLoadingMessages.value = true;
    isLoadingMoreMessages.value = false;
    // 重置页码为1
    conversationPage.page = 1;
    // 调用API获取会话列表
    const res = await conversationList({ skip: (conversationPage.page - 1) * 10, limit: conversationPage.limit, is_active: true })
    if (res.code === 200) {
      historyList.value = res.data || []
      conversationPage.total = res.total || 0

      // 更新会话列表
      if (historyList.value.length > 0) {
        conversationsItems.value = historyList.value.map(item => ({
          key: item.id,
          label: item.title || `对话 ${item.id}`,
        }));

        // 设置默认激活的会话为最新的会话（列表中的第一条）
        const latestConversationId = historyList.value[0].id;
        activeKey.value = latestConversationId;

        // 重置历史消息分页状态
        historyPage.page = 1;
        historyPage.total = 0;

        // 加载最新会话的历史消息
        try {
          const formattedMessages = await loadConversationMessages(latestConversationId, 1, historyPage.limit, true);
          if (formattedMessages.length > 0) {
            setMessages(formattedMessages);

            // 第一页数据加载完成后，滚动到底部
            setTimeout(() => {
              scrollToBottom();
            }, 0); // 增加延迟到 100ms
          }
        } catch (error) {
          console.error('获取最新会话历史消息失败:', error);
        }
      } else {
        // 如果没有会话，创建一个新会话
        await onAddConversation();
      }
    }
  } catch (error) {
    console.error('获取会话列表失败:', error);
    // 出错时创建一个默认会话
    await onAddConversation();
  } finally {
    // 隐藏加载状态
    isLoadingMessages.value = false;
    isLoadingMoreMessages.value = false;
  }
}

// 保存消息
const onSaveMessageApi = async (content: string,attachments) => {
  try {
    const conversationId = activeKey.value;
    if (!conversationId) return;
    
    // 确保当前会话有已保存附件集合
    if (!savedAttachmentsPerConversation.value[conversationId]) {
      savedAttachmentsPerConversation.value[conversationId] = new Set();
    }
    const savedAttachmentsSet = savedAttachmentsPerConversation.value[conversationId];
    
    // 过滤附件：只包含已上传成功（有ID）且未保存过的附件
    const newAttachments = attachments.filter(attachment => {
      return attachment.id && !savedAttachmentsSet.has(attachment.id);
    });
    
    // 调用API保存消息，只包含新附件
    const res = await saveMessage({
      content,
      conversation_id: conversationId,
      role: 'user',
      attachments: newAttachments
    })
    if (res.code === 200) {
        // 保存成功，将新附件ID添加到已保存集合
        newAttachments.forEach(attachment => {
          if (attachment.id) {
            savedAttachmentsSet.add(attachment.id);
          }
        });
    }
  } catch (error) {
    console.error('保存消息失败:', error);
  }
}

// 上传附件等配置
const acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif',
  'image/bmp', 'video/mp4', 'video/avi','.txt', '.pdf', '.docx', '.csv', '.json', '.md', '.xlsx'];
const fileSizeSetting = {
  imageSize: 1024 * 1024 * 10, // 10MB
  videoSize: 1024 * 1024 * 50, // 50MB
  otherSize: 1024 * 1024 * 100, // 100MB
}
const maxFileCount = 5 // 最大文件上传数量
// 检查文件有效性的函数
const validateFile = (file: any) => {
  const fileType = file.type;
  const fileSize = file.size;
  const suffix = '.' + file.name.split('.').pop();

  // 检查文件类型
  const typeValid = acceptedFileTypes.includes(fileType) || acceptedFileTypes.includes(suffix);
  if (!typeValid) {
    message.error(`不支持上传 ${fileType} 类型的文件`);
    return { valid: false, typeValid: false, sizeValid: true };
  }

  // 检查文件大小
  const fileBefore = fileType.split('/')[0];
  const limitSize = fileBefore === 'image' ? fileSizeSetting.imageSize : fileBefore === 'video' ? fileSizeSetting.videoSize : fileSizeSetting.otherSize;
  const sizeValid = fileSize <= limitSize;
  if (!sizeValid) {
    message.error(`文件大小不能超过 ${fileSizeSetting[fileBefore + 'Size'] / (1024 * 1024)} MB`);
    return { valid: false, typeValid: true, sizeValid: false };
  }

  return { valid: true, typeValid: true, sizeValid: true };
}

const handleFileChange: AttachmentsProps['onChange'] = async ({ file, fileList }) => {
  console.log('handleFileChange', file, fileList);
  // 如果是删除操作，直接更新列表
  if (!file && fileList) {
    const validatedFiles = fileList.filter((f: any) => {
      const validation = validateFile(f);
      return validation.valid;
    });
    attachedFiles.value = validatedFiles;
    return;
  }

  // 过滤掉不满足条件的文件
  let validFileList = fileList.filter((f: any) => {
    const validation = validateFile(f);
    return validation.valid;
  });

  // 检查文件数量限制
  if (validFileList.length > maxFileCount) {
    message.warning(`最多只能上传 ${maxFileCount} 个文件，多余的文件已移除`);
    validFileList = validFileList.slice(0, maxFileCount);
  }

  // 合并新文件列表与现有附件列表，保留现有文件的状态
  const existingFilesMap = new Map(attachedFiles.value.map(f => [f.uid, f]));
  const mergedList = validFileList.map(file => {
    const existing = existingFilesMap.get(file.uid);
    if (existing) {
      // 保留现有文件的状态属性（仅当属性存在时）
      const merged: any = { ...file };
      if (existing.status !== undefined) merged.status = existing.status;
      if (existing.percent !== undefined) merged.percent = existing.percent;
      if (existing.url !== undefined) merged.url = existing.url;
      if (existing.id !== undefined) merged.id = existing.id;
      return merged;
    }
    // 新文件，设置初始状态为 pending
    return {
      ...file,
      status: 'pending',
      percent: 0
    };
  });

  // 更新附件列表
  attachedFiles.value = mergedList as AttachmentsProps['items'];

  // 辅助函数：更新指定文件的状态
  const updateFileStatus = (uid: string, updates: Partial<any>) => {
    const index = attachedFiles.value.findIndex(f => f.uid === uid);
    if (index !== -1) {
      attachedFiles.value = [
        ...attachedFiles.value.slice(0, index),
        { ...attachedFiles.value[index], ...updates },
        ...attachedFiles.value.slice(index + 1)
      ];
    }
  };

  // 对每个状态为 pending 的文件启动上传任务
  for (const file of mergedList) {
    if (file.status === 'pending') {
      const uid = file.uid;
      // 立即更新状态为 uploading，避免重复触发
      updateFileStatus(uid, { status: 'uploading', percent: 0 });
      
      // 异步上传任务
      (async () => {
        try {
          const uploadFile = await uploadFilesApi(file);
          if (uploadFile) {
            updateFileStatus(uid, {
              status: 'done',
              percent: 100,
              url: uploadFile.url,
              id: uploadFile.id,
              name: uploadFile.name
            });
          } else {
            updateFileStatus(uid, { status: 'error', percent: 0,description:'识别失败' });
          }
        } catch (error) {
          console.error('上传文件异常:', error);
          updateFileStatus(uid, { status: 'error', percent: 0 ,description:'识别失败'});
        }
      })();
    }
  }
}

// 上传文件
const uploadFilesApi = async (file: any) => {
  try {
    // 获取原始文件对象
    let originalFile = file;
    if (file && !(file instanceof File)) {
      if (file.originFileObj && file.originFileObj instanceof File) {
        originalFile = file.originFileObj;
      } else {
        console.error('无法获取有效的文件对象:', file);
        return null;
      }
    }
    
    const res = await attachmentRecognition({
      files: [originalFile]
    }, undefined)
    if (res.code === 200) {
      return Array.isArray(res.data) ? res.data[0] : null
    }
    else{
      return null
    }
  }
  catch (error) {
    console.error('上传文件失败:', error);
    return null
  }

}
// 下载文件
const downloadFile = async (name, url) => {
  try {
    saveAs(url, name || '附件')
  } catch (error) {
    console.error('下载文件失败:', error);
  }
}
const isImage = (url) => {
  const ext = url.split('.').pop()
  return ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif'

}
// 气泡被点击
const handleBubbleClick = (item) => {
  if (item?.url) {
    if(isImage(item.url)) {
      return
    }
    downloadFile(item.name || '附件', item.url) // 下载文件
  }
}

const showSeesionPopup = () => {
  sessionPopupVisible.value = true
  nextTick(() => {
    if (conversationsRef.value) {
      const conversationsElement = conversationsRef.value.$el;
      if (conversationsElement) {
        conversationsElement.addEventListener('scroll', handleConversationsScroll);
      }
    }
  })
}
const cancelSessionPopup = () => {
  // 移除会话列表滚动事件监听
  if (conversationsRef.value) {
    const conversationsElement = conversationsRef.value.$el;
    if (conversationsElement) {
      conversationsElement.removeEventListener('scroll', handleConversationsScroll);
    }
  }
  sessionPopupVisible.value = false
}

onMounted(() => {
  getconversationList()
  // 添加点击外部关闭编辑的事件监听
  document.addEventListener('click', handleClickOutside);

})

onUnmounted(() => {
  // 移除事件监听
  document.removeEventListener('click', handleClickOutside);

  // 清除定时器
  if (titleEditTimeout.value) {
    clearTimeout(titleEditTimeout.value);
  }
})

</script>

<template>
  <div :style="styles.layout">
    <!-- 顶部工具栏 -->
    <div :style="styles.logo" class="top-toolbar ">
      <!-- 会话列表按钮 -->
      <Button type="text" @click="showSeesionPopup" :icon="h(MessageOutlined)" title="会话列表"
        class="flex items-center justify-center" />

      <!-- 会话标题 -->
      <div style="flex: 1; margin: 0 16px; overflow: hidden; position: relative;" class="title-edit-container">
        <!-- 显示模式 -->
        <div v-if="!isEditingTitle" style="white-space: nowrap; overflow: hidden; text-align: center;
          text-overflow: ellipsis; font-weight: 500; cursor: pointer; font-size: 16px; color: #333;"
          @click="startEditTitle($event)">
          {{conversationsItems.find(item => item.key === activeKey)?.label || '新对话'}}
        </div>
        <!-- 编辑模式 -->
        <div v-else style="display: flex; align-items: center; gap: 8px;">
          <Input v-model:value="editTitleValue" type="text" style="flex: 1; padding: 4px 8px;
               border: 1px solid #d9d9d9; text-align: center; font-weight: 500;font-size: 16px;
               border-radius: 10px; outline: none;" @keyup.enter="saveEditTitle" autofocus />
        </div>
      </div>

      <!-- 新建会话按钮 -->
      <Button type="text" @click="onAddConversation" :icon="h(PlusOutlined)" :loading="newSessionBtnLoading"
        title="新建对话" class="flex items-center justify-center" />

    </div>

    <!-- 顶部会话列表弹窗 -->
    <div v-if="sessionPopupVisible" class="session-popup-overlay" @click="cancelSessionPopup"></div>

    <div v-if="sessionPopupVisible" class="session-popup-panel" @click.stop>
      <div :style="styles['drawer-header']" class="popup-header">
        <h3 :style="styles['drawer-title']">会话列表</h3>
        <Space :size="'small'">
          <Button type="primary" size="small" @click="onAddConversation" :loading="newSessionBtnLoading">
            <span>
              <PlusOutlined /> 新建
            </span>
          </Button>
          <Button type="text" @click="cancelSessionPopup" class="flex items-center justify-center">
            <CloseOutlined />
          </Button>
        </Space>
      </div>

      <!-- 会话管理 -->
      <Conversations :items="conversationsItems" :style="styles.conversations" :active-key="activeKey"
        :menu="menuConfig" @active-change="onConversationClick" @click.stop ref="conversationsRef">
      </Conversations>
    </div>

    <!-- 聊天主内容区 -->
    <div :style="styles.chat">
      <!-- 实际消息列表 -->
      <Skeleton :active="true" :loading="isLoadingMessages && !isLoadingMoreMessages">
        <Bubble.List ref="messagesListRef" :items="items" :roles="roles" :autoScroll="autoMessageScroll"
          :style="styles.messages" @scroll="handleMessagesScroll">
          <template #footer="{ item }">
            <div class="flex gap-2 mt-2">
              <!-- 重新回答按钮 -->
              <button v-if="item.role === 'ai' && !item.loading && !agentRequestLoading && initContent !== item.content"
                @click="regenerateResponse(item)"
                class="group relative flex h-6 w-6 items-center justify-center rounded-md p-1 text-[#00000080] transition-all duration-200 hover:bg-gray-200 active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                type="button">
                <SyncOutlined />
                <span
                  class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  重新回答
                </span>
              </button>

              <!-- 复制按钮 -->
              <button v-if="initContent !== item.content && !item.loading && !agentRequestLoading && item.role !== 'file'" v-copy="item.content"
                @copy-success="onCopySuccess()" @copy-error="onCopyError()"
                class="group relative flex h-6 w-6 items-center justify-center rounded-md p-1 text-[#00000080] transition-all duration-200 hover:bg-gray-200 active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                type="button">
                <CopyOutlined />
                <span
                  class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  复制
                </span>
              </button>

              <!-- 导出为文本按钮 -->
              <button v-if="initContent !== item.content && !item.loading && !agentRequestLoading && item.role !== 'file'"
                v-export-text="item.content" @copy-success="onCopySuccess('导出成功')" @copy-error="onCopyError('导出失败')"
                class="group relative flex h-6 w-6 items-center justify-center rounded-md p-1 text-[#00000080] transition-all duration-200 hover:bg-gray-200 active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
                type="button">
                <FileTextOutlined />
                <span
                  class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  导出为文本
                </span>
              </button>
            </div>
          </template>
        </Bubble.List>
        <div v-if="showScrollToBottom" class="absolute bottom-[240px] left-[50%] -translate-x-[50%] z-10">
          <div @click="scrollToBottom"
           class="flex items-center justify-center bg-[#fff] text-[#333] cursor-pointer
           w-[40px] h-[40px] rounded-[15px] shadow-lg transition-colors duration-200 border-[1px] border-[#e2e2e2]">
            <DownOutlined /> 
          </div>
        </div>
      </Skeleton>


      <!-- <Prompts
        :items="senderPromptsItems"
        @item-click="onPromptsItemClick"
      /> -->


    </div>
    <div :style="styles.senderBody" ref="senderBodyRef">
      <div v-if="headerOpen" style="margin-bottom: 10px;">
        <Attachments :items="attachedFiles" @change="handleFileChange" :before-upload="() => false" :multiple="true">
          <template #placeholder="{ type }">
            <Flex v-if="type === 'inline'" align="center" justify="center" vertical gap="2">
              <Typography.Text style="font-size: 30px; line-height: 1;">
                <CloudUploadOutlined />
              </Typography.Text>
              <Typography.Title :level="5" style="margin: 0; font-size: 14px; line-height: 1.5;">
                上传文件
              </Typography.Title>
              <Typography.Text type="secondary">
                点击或将文件拖拽到此处上传（最多{{ maxFileCount }}个文件）
              </Typography.Text>
              <Typography.Text type="secondary">
                支持文件类型：{{ acceptedFileTypes.join(', ') }}
              </Typography.Text>
            </Flex>
            <Typography.Text v-if="type === 'drop'">
              <div class="w-full h-[200px] flex items-center justify-center">将文件拖拽到这里</div>
            </Typography.Text>
          </template>
        </Attachments>
      </div>
      <Sender
        :value="content"
        :style="styles.sender"
        :loading="agentRequestLoading"
        :allow-speech="speechConfig"
        :components="{ input: MyInputTextArea as any }"
        placeholder="请输入您的问题"
        @submit="onSubmit"
        @change="value => content = value"
        @cancel="stopRequest">
        <template #prefix>
          <Badge :dot="attachedFiles.length > 0 && !headerOpen">
            <Button type="text" 
            @click="() => headerOpen = !headerOpen" class="py-0">
              <template #icon>
                <PaperClipOutlined />
              </template>
            </Button>
          </Badge>
        </template>
      </Sender>
    </div>


    <!-- 重命名弹窗 -->
    <Modal v-model:visible="renameModalVisible" title="编辑对话名称" ok-text="确认" cancel-text="取消" @ok="handleRenameConfirm"
      @cancel="handleRenameCancel">
      <Input v-model:value="renameInputValue" placeholder="请输入对话名称" autofocus />
    </Modal>
  </div>
</template>

<style scoped lang="scss">
:deep(.ant-avatar) {
  width: 40px;
  height: auto;
  border-radius: 0;
}

:deep(.ant-bubble) {
  .ant-bubble-content {
    font-size: 16px;
  }

  .ant-bubble-footer {
    margin-top: 0px;
  }
}

.session-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

.session-popup-panel {
  position: absolute;
  top: 60px; // 与顶部工具栏对齐
  left: 16px;
  width: 320px;
  min-height: 320px;
  max-height: calc(100vh - 200px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideDown 0.3s ease;
  overflow: hidden;
  overflow-y: auto;
  padding-bottom: 15px;
}

.popup-header {
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 16px;
}


:deep(.ant-bubble-end .ant-bubble-content-shadow) {
  background-color: #4362EF;
  color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

:deep(.ant-bubble-start .ant-bubble-content-filled) {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.88);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

:deep(.ant-sender-actions-btn) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.ant-attachment-list-upload-btn) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.ant-attachment-list-card-text) {
  color: #fff;
}

// :deep(.ant-attachment-list-card-desc) {
//   display: none;
// }

// :deep(.ant-attachment-list-card-desc) {
//   display: none;
// }

:deep(.ant-attachment-list-card-type-overview) {
  align-items: center;

  .ant-attachment-list-card-icon {
    padding-top: 0;
  }
}
:deep(.ant-sender-actions-btn){
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.ant-input-textarea-show-count::after){
  font-size: 12px;
}
:deep(.ant-attachment-list-card-desc){
  font-size: 10px;
}
:deep(.ant-bubble-list){
  overflow-x: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
