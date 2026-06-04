<template>
  <div class="hls-video-player">
      <video 
        :id="videoId" 
        ref="videoRef"
        :controls="controls"
        :autoplay="autoplay" 
        :muted="muted"
        :crossOrigin="crossOrigin"
        :preload="preload"
        :playsinline="playsinline"
        :webkit-playsinline="webkitPlaysinline"
        :x5-playsinline="x5Playsinline"
        @ended="handleVideoEnded"
        class="video-element"
      >
        <span>您的浏览器不支持视频播放。</span>
      </video>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch, onActivated, onDeactivated } from 'vue'
import Hls from 'hls.js'

// 定义组件属性
const props = defineProps({
  // HLS 视频流地址
  videoUrl: {
    type: String,
    required: true
  },
  // 视频元素ID
  videoId: {
    type: String,
    default: 'hls-video-player'
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
  // 是否显示控件
  controls: {
    type: Boolean,
    default: true
  },
  // 跨域设置
  crossOrigin: {
    type: String,
    default: 'anonymous'
  },
  // 预加载
  preload: {
    type: String,
    default: 'auto'
  },
  // 移动端播放设置
  playsinline: {
    type: Boolean,
    default: true
  },
  webkitPlaysinline: {
    type: Boolean,
    default: true
  },
  x5Playsinline: {
    type: Boolean,
    default: true
  }
})

// 定义事件
const emit = defineEmits(['ended', 'error', 'loaded', 'update:loading', 'update:error'])

// 响应式数据
const videoRef = ref<HTMLVideoElement | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const isConnected = ref(false)

// HLS 实例
let hls: any = null

// 播放控制方法
const playVideo = () => {
  if (videoRef.value && videoRef.value.paused) {
    console.log('HLS播放开始')
    videoRef.value.play().catch(e => {
      console.log('HLS自动播放被阻止，需要用户交互:', e)
    })
  }
  isLoading.value = false
}

const pauseVideo = () => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
}

const stopVideo = () => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
  }
}

// 初始化 HLS 播放器
const initHlsPlayer = () => {
  return new Promise<void>((resolve, reject) => {
    if (!videoRef.value) {
      reject(new Error('视频元素未找到'))
      return
    }
    
    // 检查HLS是否支持
    if (!Hls.isSupported()) {
      reject(new Error('当前浏览器不支持HLS播放'))
      return
    }
    
    // 清理之前的HLS实例
    destroyHls()
    
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
      xhrSetup: function(xhr: XMLHttpRequest, _url: string) {
        xhr.withCredentials = false
        xhr.setRequestHeader('Accept', '*/*')
      }
    })
    
    // 绑定视频元素
    hls.attachMedia(videoRef.value)
    
    // 加载源
    hls.loadSource(props.videoUrl)
    
    hls.on(Hls.Events.MANIFEST_PARSED, (_event: any, data: any) => {
      console.log('HLS流解析完成', data)
      isLoading.value = false
      isConnected.value = true
      playVideo()
      emit('loaded', data)
      emit('update:loading', false)
      resolve()
    })
    
    hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
      console.error('HLS错误详情:', data)
      if (data.fatal) {
        handleHlsError(data)
        reject(new Error(`HLS致命错误: ${data.details}`))
      }
      emit('error', data)
      emit('update:error', errorMessage.value)
    })
    
    // 监听加载成功事件
    hls.on(Hls.Events.LEVEL_LOADED, (_event: any, data: any) => {
      console.log('HLS级别加载完成:', data.level, data.details)
    })
    
    hls.on(Hls.Events.FRAG_LOADED, (_event: any, data: any) => {
      console.log('HLS片段加载完成:', data.frag.url)
    })
    
    // 设置超时检测
    setTimeout(() => {
      if (isLoading.value) {
        errorMessage.value = 'HLS视频加载超时'
        isLoading.value = false
        reject(new Error('HLS加载超时'))
      }
    }, 30000)
  })
}

// 错误处理
const handleHlsError = (data: any) => {
  switch(data.type) {
    case Hls.ErrorTypes.NETWORK_ERROR:
      if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR || 
          data.details === Hls.ErrorDetails.LEVEL_LOAD_ERROR) {
        errorMessage.value = '无法连接到HLS视频流服务器，可能是CORS限制或网络问题'
      } else {
        errorMessage.value = '网络错误，请检查网络连接'
      }
      break
    case Hls.ErrorTypes.MEDIA_ERROR:
      errorMessage.value = 'HLS媒体错误，视频格式可能不受支持'
      break
    default:
      errorMessage.value = `HLS视频加载失败: ${data.details || '未知错误'}`
      break
  }
  isLoading.value = false
  isConnected.value = false
  emit('update:loading', false)
  emit('update:error', errorMessage.value)
}

// 清理 HLS 实例
const destroyHls = () => {
  if (hls) {
    try {
      hls.stopLoad()
      hls.destroy()
      console.log('HLS实例已清理')
    } catch (e) {
      console.warn('HLS清理时出现错误:', e)
    }
    hls = null
  }
}

// 清理视频元素
const destroyVideoElement = () => {
  if (videoRef.value) {
    try {
      videoRef.value.pause()
      videoRef.value.src = ''
      videoRef.value.removeAttribute('src')
      videoRef.value.load()
      console.log('HLS视频元素已清理')
    } catch (e) {
      console.warn('HLS视频元素清理时出现错误:', e)
    }
  }
}

// 初始化视频播放
const initVideo = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    emit('update:loading', true)
    
    // 清理之前的实例
    destroyHls()
    destroyVideoElement()
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 重新获取video元素引用
    const videoElement = document.getElementById(props.videoId) as HTMLVideoElement
    if (!videoElement) {
      console.error('HLS视频元素未找到')
      errorMessage.value = '视频元素未找到'
      isLoading.value = false
      emit('update:loading', false)
      return
    }
    
    // 更新ref引用
    videoRef.value = videoElement
    
    videoRef.value.style.width = '100%'
    videoRef.value.style.height = '100%'
    
    console.log(`初始化HLS播放器，URL: ${props.videoUrl}`)
    setTimeout(async () => {
     await initHlsPlayer()
    }, 100)
    // await initHlsPlayer()
    
  } catch (error) {
    console.error('HLS视频初始化失败:', error)
    errorMessage.value = `HLS初始化失败: ${(error as Error).message || '未知错误'}`
    isLoading.value = false
    isConnected.value = false
    emit('update:loading', false)
  }
}

// 重新连接
const reconnect = async (newUrl?: string) => {
  try {
    if (newUrl && newUrl !== props.videoUrl && newUrl.indexOf('m3u8')) {
      // 如果URL改变，需要重新初始化
      await initVideo()
    } else {
      // 如果URL相同，直接重新连接
      destroyHls()
      await new Promise(resolve => setTimeout(resolve, 200))
      await initHlsPlayer()
    }
  } catch (error) {
    console.error('HLS重新连接失败:', error)
    errorMessage.value = `重新连接失败: ${(error as Error).message || '未知错误'}`
  }
}

// 事件处理
const handleVideoEnded = () => {
  console.log('HLS视频播放结束')
  emit('ended')
}

// 生命Maintainer期
onMounted(() => {
  // 确保只有在收到正确的HLS URL时才初始化
  if (props.videoUrl && props.videoUrl.includes('.m3u8')) {
    // 添加短暂延迟，确保父组件的状态已经稳定
    setTimeout(() => {
      initVideo()
    }, 50)
  } else {
    console.warn('HlsVideoPlayer收到了非HLS格式的URL:', props.videoUrl)
  }
})

onBeforeUnmount(() => {
  destroyHls()
  destroyVideoElement()
})

// 页面激活时恢复播放
onActivated(() => {
  if (videoRef.value && videoRef.value.paused) {
    playVideo()
  }
})

// 页面停用时暂停播放
onDeactivated(() => {
  if (videoRef.value && !videoRef.value.paused) {
    pauseVideo()
  }
})

// 监听URL变化
watch(() => props.videoUrl, async (newUrl, oldUrl) => {
  if (newUrl !== oldUrl) {
    console.log('HLS视频URL发生变化:', oldUrl, '->', newUrl)
    // 只有当新URL是HLS格式时才重新初始化
    if (newUrl && newUrl.includes('.m3u8')) {
      await initVideo()
    } else {
      console.warn('新的URL不是HLS格式，跳过初始化:', newUrl)
    }
  }
})

// 暴露给父组件的方法
defineExpose({
  play: playVideo,
  pause: pauseVideo,
  stop: stopVideo,
  reconnect,
  isConnected: () => isConnected.value,
  getCurrentUrl: () => props.videoUrl,
  destroyHls,
  getHlsInstance: () => hls
})
</script>

<style scoped lang="scss">
.hls-video-player {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .video-element {
        height: 100%;
        min-width: 75%;
        max-width: 100%;
        object-fit: contain;
   }
}
</style>