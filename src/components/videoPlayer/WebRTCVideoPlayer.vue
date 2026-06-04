<template>
  <div class="webrtc-video-player">
    <video 
      :id="videoId" 
      controls 
      :autoplay="autoplay" 
      :muted="muted" 
      :width="width" 
      :height="height"
      class="video-element"
    ></video>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onActivated, onDeactivated, watch } from 'vue'

// 定义组件属性
const props = defineProps({
  // 视频流地址
  streamUrl: {
    type: String,
    required: true
  },
  // WebRTC服务器地址
  serverUrl: {
    type: String,
    default: "http://127.0.0.1:8000"
  },
  // 视频元素ID
  videoId: {
    type: String,
    default: "webrtc-video"
  },
  // 是否自动播放
  autoplay: {
    type: Boolean,
    default: true
  },
  // 是否静音
  muted: {
    type: Boolean,
    default: true
  },
  // 宽度
  width: {
    type: String,
    default: '100%'
  },
  // 高度
  height: {
    type: String,
    default: '100%'
  }
})

// 定义事件
const emit = defineEmits<{
  ended: []
  'update:loading': [value: boolean]
  'update:error': [message: string]
}>()

// 响应式数据
const webRtcServer = ref(null)
const isConnected = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// 创建视频实例
const initVideo = () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    emit('update:loading', true)
    
    if (typeof (window as any).WebRtcStreamer === 'undefined') {
      const errorMsg = 'WebRtcStreamer库未加载，请检查脚本引入'
      errorMessage.value = errorMsg
      isLoading.value = false
      emit('update:error', errorMsg)
      emit('update:loading', false)
      console.error('WebRtcStreamer is not defined. Please make sure the library is loaded.')
      return
    }
    
    webRtcServer.value = new (window as any).WebRtcStreamer(props.videoId, props.serverUrl)
    webRtcServer.value.connect(props.streamUrl)
    isConnected.value = true
    isLoading.value = false
    emit('update:loading', false)
    console.log('WebRTC视频连接已建立:', props.streamUrl)
  } catch (error) {
    const errorMsg = `WebRTC初始化失败: ${(error as Error).message || '未知错误'}`
    errorMessage.value = errorMsg
    isLoading.value = false
    emit('update:error', errorMsg)
    emit('update:loading', false)
    console.error('初始化WebRTC视频失败:', error)
  }
}

// 销毁视频实例
const destroyVideo = () => {
  if (webRtcServer.value) {
    webRtcServer.value.disconnect()
    webRtcServer.value = null
    isConnected.value = false
    console.log('WebRTC视频连接已断开')
  }
}

// 重新连接视频流
const reconnect = (_newStreamUrl?: string | null) => {
  destroyVideo()
  // 注意：这里不能直接修改 props.streamUrl，需要通过父组件来修改
  setTimeout(() => {
    initVideo()
  }, 100)
}

// 暂停视频
const pause = () => {
  const video = document.getElementById(props.videoId) as HTMLVideoElement
  if (video) {
    video.pause()
  }
}

// 播放视频
const play = () => {
  const video = document.getElementById(props.videoId) as HTMLVideoElement
  if (video) {
    video.play()
  }
}


// 生命Maintainer期
onMounted(() => {
  initVideo()
})

onBeforeUnmount(() => {
  destroyVideo()
})

// 页面激活时恢复播放
onActivated(() => {
  const video = document.getElementById(props.videoId) as HTMLVideoElement
  if (video && video.paused) {
    video.play()
  }
})

// 页面停用时暂停播放
onDeactivated(() => {
  const video = document.getElementById(props.videoId) as HTMLVideoElement
  if (video && !video.paused) {
    video.pause()
  }
})
watch(() => props.streamUrl, (newStreamUrl) => {
  reconnect(newStreamUrl)
})

// 暴露方法给父组件
defineExpose({
  reconnect,
  pause,
  play,
  destroyVideo,
  isConnected: () => isConnected.value
})
</script>

<style scoped lang="scss">
.webrtc-video-player {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .video-element {
    height: 100%; // 固定高度
    min-width: 75%;
    max-width: 100%; // 宽度自适应，不超过容器宽度
    object-fit: contain; // 保持视频原始比例
    
    &:focus {
      outline: none;
    }
  }
}
</style>