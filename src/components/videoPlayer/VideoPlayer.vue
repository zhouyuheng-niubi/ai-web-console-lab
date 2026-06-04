<template>
  <div class="video-view">
    <!-- 调试信息(生产环境应该注释掉) -->
    <div v-if="false" class="debug-info" style="position: absolute; top: 0; left: 0; background: rgba(0,0,0,0.8); color: #fff; padding: 10px; z-index: 9999; font-size: 12px;">
      <div>当前播放器: {{ debugPlayerType }}</div>
      <div>URL: {{ currentVideoUrl }}</div>
      <div>videoType: {{ props.videoType }}</div>
      <div>hasValidVideoUrl: {{ hasValidVideoUrl }}</div>
      <div>isCurrentDirectWebRTC: {{ isCurrentDirectWebRTC }}</div>
      <div>isCurrentRtsp: {{ isCurrentRtsp }}</div>
      <div>isCurrentHls: {{ isCurrentHls }}</div>
      <div>isCurrentImg: {{ isCurrentImg }}</div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="showLoading" class="loading-overlay" :style="{height: videoContainerHeight}">
      <div class="loading-spinner"></div>
      <span>视频加载中...</span>
    </div>
    
    <!-- 错误信息 -->
    <div v-if="currentErrorMessage" class="error-overlay" :style="{height: videoContainerHeight}">
      <span>{{ currentErrorMessage }}</span>
      <Button type="primary" @click="() => reconnect()" class="retry-btn">重试</Button>
    </div>
    
    <!-- 视频播放器容器 -->
    <div class="video-container overflow-y-auto overflow-x-auto" :style="{background: videobg}" :key="playerKey">
      <!-- Direct WebRTC -->
      <DirectWebRTCVideoPlayer
        ref="directWebrtcPlayerRef"
        :data-stream="currentVideoUrl"
        :video-id="videoId"
        :server-ip="directWebrtcServerIp"
        :websocket="directWebrtcWebsocket"
        :camera-id="directWebrtcCameraId"
        :token="<REDACTED_CREDENTIAL>"
        :access-key="directWebrtcAccessKey"
        :access-secret="<REDACTED_CREDENTIAL>"
        v-if="isCurrentDirectWebRTC && hasValidVideoUrl"
        :autoplay="autoplay"
        :muted="muted"
        :setting-alg="settingAlg"
      />
      
      <!-- RTSP 视频使用 WebRTC 组件 -->
      <WebRTCVideoPlayer
        ref="webrtcPlayerRef"
        :stream-url="currentVideoUrl"
        :server-url="serverUrl"
        :video-id="videoId"
        :autoplay="autoplay"
        :muted="muted"
        v-else-if="isCurrentRtsp && hasValidVideoUrl"
        @ended="handleVideoEnded"
        @update:loading="handleWebRtcLoading"
        @update:error="handleWebRtcError"
      />
      
      <!-- HLS 视频使用 HLS 组件 -->
      <HlsVideoPlayer
        ref="hlsPlayerRef"
        :video-url="currentVideoUrl"
        :video-id="videoId"
        :controls="controls"
        :autoplay="autoplay"
        :muted="muted"
        :crossOrigin="crossOrigin"
        :preload="preload"
        :playsinline="playsinline"
        :webkit-playsinline="webkitPlaysinline"
        :x5-playsinline="x5Playsinline"
        v-else-if="isCurrentHls && hasValidVideoUrl"
        @ended="handleVideoEnded"
        @error="handlePlayerError"
        @loaded="handlePlayerLoaded"
        @update:loading="handleHlsLoading"
        @update:error="handleHlsError"
      >
        <template #controllBottom v-if="$slots.controllBottom">
          <slot name="controllBottom"></slot>
        </template>
      </HlsVideoPlayer>
      
      <!-- 图片 预览 -->
      <img v-else-if="isCurrentImg && hasValidVideoUrl" :src="currentVideoUrl" class="w-full h-full object-contain"/>
      
      <!-- 其他格式视频使用原生播放器 -->
      <video 
        v-else-if="hasValidVideoUrl"
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
        @error="handleNativePlayerError"
        class="video-element"
      >
        <span>您的浏览器不支持视频播放。</span>
      </video>
      
      <!-- 底部自定义控制区域(仅用于原生播放器) -->
      <div class="custom-bottom-control" v-if="$slots.controllBottom && hasValidVideoUrl && !isCurrentRtsp && !isCurrentHls && !isCurrentDirectWebRTC && !isCurrentImg">
        <slot name="controllBottom"></slot>
      </div>
    </div>

    <!-- 多视频源标签页 -->
    <div 
      class="video-tabs" 
      v-if="videoUrls && Array.isArray(videoUrls) && videoUrls.length > 1"
    >
      <Tabs
        v-model:active-key="currentVideoIndex"
        tab-position="top"
        :tab-bar-gutter="15"
        @change="handleTabChange"
        popup-class-name="tabs-dropdown"
      >
        <TabPane
          v-for="(url, index) in videoUrls"
          :key="index"
          :tab="getTabName(url, index)"
        />
      </Tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, onActivated, onDeactivated, watch, computed, PropType } from 'vue'
import { TabPane, Tabs,Button } from 'ant-design-vue'
import HlsVideoPlayer from './HlsVideoPlayer.vue'
import WebRTCVideoPlayer from './WebRTCVideoPlayer.vue'
import DirectWebRTCVideoPlayer from './DirectWebRTCVideoPlayer.vue'
// 定义组件属性
const props = defineProps({
  // 视频流地址 - 支持字符串或数组
  videoUrl: {
    type: [String, Array],
    required: true
  },
  // 视频类型
  videoType: {
    type: String,
    default: 'auto', // auto|hls|rtsp|mp4|directwebrtc|img
    validator: (value: string) => ['auto', 'hls', 'rtsp', 'mp4', 'directwebrtc', 'img'].includes(value)
  },
  // WebRTC服务器地址（用于RTSP）
  serverUrl: {
    type: String,
    default: 'http://10.0.0.1:8000'
  },
  // 视频元素ID
  videoId: {
    type: String,
    default: 'video-player'
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
  },
  // 标签页名称
  tabNames: {
    type: Array,
    default: () => []
  },
  videobg: {
    type: String,
    default: '#000000'
  },
  // DirectWebRTC相关配置
  directWebrtcServerIp: {
    type: String,
    default: '10.0.0.1'
  },
  directWebrtcWebsocket: {
    type: Number,
    default: 8083
  },
  directWebrtcCameraId: {
    type: String,
    default: ''
  },
  directWebrtcToken: {
    type: String,
    default: ''
  },
  directWebrtcAccessKey: {
    type: String,
    default: '69156104eb712e27f7d43591'
  },
  directWebrtcAccessSecret: {
    type: String,
    default: '4fd5a37e-5527-46ad-a34d-0709d72102bc'
  },
  settingAlg: {
    type: Array as PropType<string[]>,
    default: () => [] //配置算法
  },
})
const emit = defineEmits(['error'])

const isComponentDestroyed = ref(false)

const safeEmit = (event: string, ...args: any[]) => {
  if (!isComponentDestroyed.value) {
    emit(event as any, ...args)
  }
}

// 响应式数据
const videoRef = ref<HTMLVideoElement | null>(null)
const webrtcPlayerRef = ref(null)
const hlsPlayerRef = ref(null)
const directWebrtcPlayerRef = ref(null)
const currentVideoIndex = ref(0)
const isLoading = ref(false)
const errorMessage = ref('')
const isConnected = ref(false)
const videoContainerHeight = ref('100%')
const webrtcLoading = ref(false)
const webrtcError = ref('')
const hlsLoading = ref(false)
const hlsError = ref('')

// 计算属性
const videoUrls = computed(() => {
  return (Array.isArray(props.videoUrl) ? props.videoUrl : [props.videoUrl]) as string[]
})

const currentVideoUrl = computed(() => {
  return videoUrls.value[currentVideoIndex.value] as string
})

// 计算当前是否为RTSP视频
const isCurrentRtsp = computed(() => {
  const videoType = getVideoType(currentVideoUrl.value)
  const result = videoType === 'rtsp'
  console.log(`[VideoPlayer] isCurrentRtsp: ${result}, videoType: ${videoType}, url: ${currentVideoUrl.value}`)
  return result
})

// 计算当前是否为HLS视频
const isCurrentHls = computed(() => {
  const videoType = getVideoType(currentVideoUrl.value)
  const result = videoType === 'hls'
  console.log(`[VideoPlayer] isCurrentHls: ${result}, videoType: ${videoType}, url: ${currentVideoUrl.value}`)
  return result
})

// 计算当前是否为Direct WebRTC视频
const isCurrentDirectWebRTC = computed(() => {
  const videoType = getVideoType(currentVideoUrl.value)
  const result = videoType === 'directwebrtc'
  console.log(`[VideoPlayer] isCurrentDirectWebRTC: ${result}, videoType: ${videoType}, url: ${currentVideoUrl.value}`)
  return result
})

// 计算当前是否为img视频
const isCurrentImg = computed(() => {
  const videoType = getVideoType(currentVideoUrl.value)
  const result = videoType === 'img'
  console.log(`[VideoPlayer] isCurrentImg: ${result}, videoType: ${videoType}, url: ${currentVideoUrl.value}`)
  return result
})

// 计算播放器key,确保切换时强制重新渲染
const playerKey = computed(() => {
  const videoType = getVideoType(currentVideoUrl.value)
  // 使用 videoType + url + videoId 组合作为 key,确保类型或 URL 变化时重新渲染
  // 每个播放器类型都有唯一的前缀,避免冲突
  return `player-${videoType}-${currentVideoUrl.value}-${props.videoId}`
})

// 检查是否有有效的视频URL
const hasValidVideoUrl = computed(() => {
  const url = currentVideoUrl.value
  // 使用统一的类型判断
  const videoType = getVideoType(url)
  
  // DirectWebRTC 类型需要特殊处理
  if (videoType === 'directwebrtc') {
    // 必须有 cameraId 和 serverIp 才算有效
    const isValid = !!(props.directWebrtcCameraId && props.directWebrtcServerIp)
    console.log(`[VideoPlayer] hasValidVideoUrl (directwebrtc): ${isValid}, cameraId: ${props.directWebrtcCameraId}, serverIp: ${props.directWebrtcServerIp}`)
    return isValid
  }
  
  // img 类型需要有效的 URL
  if (videoType === 'img') {
    if (!url || typeof url !== 'string') {
      console.log(`[VideoPlayer] hasValidVideoUrl (img): false, invalid url`)
      return false
    }
    if (url.trim() === '') {
      console.log(`[VideoPlayer] hasValidVideoUrl (img): false, empty url`)
      return false
    }
    console.log(`[VideoPlayer] hasValidVideoUrl (img): true, url: ${url}`)
    return true
  }
  
  // 其他类型需要有效的 URL
  if (!url || typeof url !== 'string') {
    console.log(`[VideoPlayer] hasValidVideoUrl (${videoType}): false, invalid url`)
    return false
  }
  if (url.trim() === '') {
    console.log(`[VideoPlayer] hasValidVideoUrl (${videoType}): false, empty url`)
    return false
  }
  
  console.log(`[VideoPlayer] hasValidVideoUrl (${videoType}): true, url: ${url}`)
  return true
})

// 调试:打印当前渲染的播放器类型
const debugPlayerType = computed(() => {
  if (isCurrentDirectWebRTC.value && hasValidVideoUrl.value) return 'DirectWebRTC'
  if (isCurrentRtsp.value && hasValidVideoUrl.value) return 'WebRTC (RTSP)'
  if (isCurrentHls.value && hasValidVideoUrl.value) return 'HLS'
  if (isCurrentImg.value && hasValidVideoUrl.value) return 'Image'
  if (hasValidVideoUrl.value) return 'Native Video'
  return 'None'
})

// 计算是否显示加载状态
const showLoading = computed(() => {
  if (isCurrentRtsp.value) return webrtcLoading.value
  if (isCurrentHls.value) return hlsLoading.value
  if (isCurrentDirectWebRTC.value) return false
  if (isCurrentImg.value) return false
  return isLoading.value
})

// 计算当前错误消息
const currentErrorMessage = computed(() => {
  if (isCurrentRtsp.value) return webrtcError.value
  if (isCurrentHls.value) return hlsError.value
  if (isCurrentDirectWebRTC.value) return '' // DirectWebRTCVideoPlayer有自己的错误处理
  if (isCurrentImg.value) return ''
  return errorMessage.value
})

const getVideoType = (url: string): string => {
  if (props.videoType !== 'auto') {
    return props.videoType
  }
  
  if (url.includes('.m3u8')) return 'hls'
  if (url.includes('rtsp://') || url.includes('rtmp://')) return 'rtsp'
  if (url.includes('webrtc') || url.includes('ZLMediaKit') || url.includes('zlmediakit')) return 'directwebrtc'
  if (url.includes('.mjpg')) return 'img'
  if (url.includes('.mp4')) return 'mp4'
  if (url.includes('.webm')) return 'webm'
  if (url.includes('.ogg')) return 'ogg'

  
  return 'mp4' // 默认类型
}

const getTabName = (url: string, index: number): string => {
  if (props.tabNames && props.tabNames.length > index) {
    return props.tabNames[index] as string
  }
  
  const type = getVideoType(url)
  return `视频 ${index + 1} (${type.toUpperCase()})`
}

// 播放控制方法
const playVideo = () => {
  if (videoRef.value && videoRef.value.paused) {
    console.log('playVideo')
    videoRef.value.play().catch(e => {
      console.log('自动播放被阻止，需要用户交互:', e)
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

// 初始化视频播放
const initVideo = async () => {
  // RTSP、HLS、DirectWebRTC 和 img 视频由各自组件处理，不需要额外初始化
  if (isCurrentRtsp.value || isCurrentHls.value || isCurrentDirectWebRTC.value || isCurrentImg.value) {
    isLoading.value = false
    return
  }
  
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // 清理之前的播放器实例
    destroyCurrentPlayer()
    
    // 等待DOM更新和播放器清理完成
    await new Promise(resolve => setTimeout(resolve, 150))
    
    // 重新获取video元素引用
    const videoElement = document.getElementById(props.videoId) as HTMLVideoElement
    if (!videoElement) {
      console.error('视频元素未找到')
      errorMessage.value = '视频元素未找到'
      isLoading.value = false
      return
    }
    
    // 更新ref引用
    videoRef.value = videoElement
    
    videoRef.value.style.width = 'auto'
    videoRef.value.style.height = '100%'
    videoContainerHeight.value = '100%'
    
    const videoType = getVideoType(currentVideoUrl.value)
    console.log(`初始化原生视频播放器，类型: ${videoType}, URL: ${currentVideoUrl.value}`)
    
    await initNativePlayer()
    
  } catch (error) {
    console.error('视频初始化失败:', error)
    errorMessage.value = `视频初始化失败: ${(error as Error).message || '未知错误'}`
    isLoading.value = false
    safeEmit('error', error)
  }
}

// 原生视频播放器初始化
const initNativePlayer = () => {
  return new Promise<void>((resolve, reject) => {
    if (!videoRef.value) {
      reject(new Error('视频元素未找到'))
      return
    }
    
    // 清理之前的源
    videoRef.value.src = ''
    videoRef.value.load()
    
    // 设置新的源
    videoRef.value.src = currentVideoUrl.value
    
    // 设置额外属性以提高兼容性
    videoRef.value.setAttribute('crossorigin', 'anonymous')
    videoRef.value.preload = 'metadata' // 先加载元数据
    
    let hasResolved = false
    
    const cleanupEvents = () => {
      if (videoRef.value) {
        videoRef.value.removeEventListener('loadedmetadata', handleLoadedMetadata)
        videoRef.value.removeEventListener('canplay', handleCanPlay)
        videoRef.value.removeEventListener('error', handleError)
        videoRef.value.removeEventListener('loadstart', handleLoadStart)
        videoRef.value.removeEventListener('suspend', handleSuspend)
      }
    }
    
    const handleLoadStart = () => {
      console.log('视频开始加载')
    }
    
    const handleSuspend = () => {
      console.log('视频加载被挂起')
    }
    
    const handleLoadedMetadata = () => {
      if (!hasResolved) {
        hasResolved = true
        videoRef.value!.muted = props.muted
        isLoading.value = false
        
        // 检查视频是否可以播放
        if (videoRef.value!.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
          errorMessage.value = '视频源不可用'
          cleanupEvents()
          reject(new Error('视频源不可用'))
          return
        }
        
        playVideo()
        cleanupEvents()
        resolve()
      }
    }
    
    const handleCanPlay = () => {
      if (!hasResolved && videoRef.value!.readyState >= 2) {
        handleLoadedMetadata()
      }
    }
    
    const handleError = (e: Event) => {
      if (!hasResolved) {
        hasResolved = true
        console.error('视频加载错误:', e)
        
        // 获取详细的错误信息
        const target = e.target as HTMLVideoElement
        let errorMsg = '视频加载失败'
        console.error('视频加载错误:', target.error)
        if (target.error) {
          switch (target.error.code) {
            case target.error.MEDIA_ERR_ABORTED:
              errorMsg = '视频加载被中止'
              break
            case target.error.MEDIA_ERR_NETWORK:
              errorMsg = '网络错误导致视频加载失败'
              break
            case target.error.MEDIA_ERR_DECODE:
              errorMsg = '视频解码失败，请检查视频格式'
              break
            case target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg = '视频格式不支持或服务器配置错误'
              // 特别处理 DEMUXER_ERROR_NO_SUPPORTED_STREAMS 错误
              if (target.error.message && target.error.message.includes('DEMUXER_ERROR_NO_SUPPORTED_STREAMS')) {
                errorMsg = '视频编码格式不被浏览器支持，请联系管理员'
              }
              break
            default:
              errorMsg = `视频加载失败: ${target.error.message || '未知错误'}`
          }
        }
        
        // 尝试其他兼容性处理
        handleCompatibilityFallback(currentVideoUrl.value)
          .then(() => {
            isLoading.value = false
            cleanupEvents()
            resolve()
          })
          .catch(() => {
            errorMessage.value = errorMsg
            isLoading.value = false
            cleanupEvents()
            reject(new Error(errorMsg))
          })
      }
    }
    
    // 添加事件监听器
    videoRef.value.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoRef.value.addEventListener('canplay', handleCanPlay)
    videoRef.value.addEventListener('error', handleError)
    videoRef.value.addEventListener('loadstart', handleLoadStart)
    videoRef.value.addEventListener('suspend', handleSuspend)
    
    // 设置超时检测
    setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true
        errorMessage.value = '视频加载超时'
        isLoading.value = false
        cleanupEvents()
        reject(new Error('视频加载超时'))
      }
    }, 30000)
  })
}

// 兼容性回退处理
const handleCompatibilityFallback = async (url: string) => {
  return new Promise<void>((resolve, reject) => {
    console.log('尝试兼容性回退处理...')
    
    // 如果是MP4文件，尝试不同的加载方式
    if (url.includes('.mp4')) {
      // 方法1: 添加时间戳参数避免缓存
      const timestampUrl = `${url}?t=${Date.now()}`
      console.log('尝试带时间戳的URL:', timestampUrl)
      
      // 重新设置src并重新加载
      if (videoRef.value) {
        videoRef.value.src = timestampUrl
        videoRef.value.load()
        
        // 添加临时事件监听器来检测是否成功
        let fallbackHandled = false
        
        const handleLoadSuccess = () => {
          if (!fallbackHandled) {
            fallbackHandled = true
            videoRef.value!.removeEventListener('loadedmetadata', handleLoadSuccess)
            videoRef.value!.removeEventListener('canplay', handleLoadSuccess)
            console.log('兼容性处理成功')
            resolve()
          }
        }
        
        const handleLoadError = () => {
          if (!fallbackHandled) {
            fallbackHandled = true
            videoRef.value!.removeEventListener('loadedmetadata', handleLoadSuccess)
            videoRef.value!.removeEventListener('canplay', handleLoadSuccess)
            videoRef.value!.removeEventListener('error', handleLoadError)
            console.log('兼容性处理失败')
            reject(new Error('兼容性处理失败'))
          }
        }
        
        videoRef.value.addEventListener('loadedmetadata', handleLoadSuccess)
        videoRef.value.addEventListener('canplay', handleLoadSuccess)
        videoRef.value.addEventListener('error', handleLoadError)
        
        // 设置超时
        setTimeout(() => {
          if (!fallbackHandled) {
            fallbackHandled = true
            videoRef.value!.removeEventListener('loadedmetadata', handleLoadSuccess)
            videoRef.value!.removeEventListener('canplay', handleLoadSuccess)
            videoRef.value!.removeEventListener('error', handleLoadError)
            console.log('兼容性处理超时')
            reject(new Error('兼容性处理超时'))
          }
        }, 10000)
      } else {
        reject(new Error('视频元素不存在'))
      }
    } else {
      // 非MP4文件不处理
      reject(new Error('不支持的文件格式'))
    }
  })
}

// 清理原生播放器实例
const destroyCurrentPlayer = () => {
  console.log('开始清理原生播放器实例')
  
  if (videoRef.value) {
    try {
      videoRef.value.pause()
      videoRef.value.src = ''
      videoRef.value.removeAttribute('src')
      videoRef.value.load()
      console.log('原生视频元素已清理')
    } catch (e) {
      console.warn('原生视频元素清理时出现错误:', e)
    }
  }
  
  isLoading.value = false
  errorMessage.value = ''
  webrtcLoading.value = false
  hlsLoading.value = false
  webrtcError.value = ''
  hlsError.value = ''
  
  console.log('原生播放器实例清理完成')
}

// 重新连接
const reconnect = async (newUrl?: string) => {
  try {
    if (newUrl) {
      const urlIndex = videoUrls.value.indexOf(newUrl)
      if (urlIndex !== -1) {
        currentVideoIndex.value = urlIndex
      }
    }
    
    // 如果是RTSP视频，调用子组件的重新连接方法
    if (isCurrentRtsp.value && webrtcPlayerRef.value) {
      await webrtcPlayerRef.value.reconnect(currentVideoUrl.value)
      return
    }
    
    // 如果是HLS视频，调用子组件的重新连接方法
    if (isCurrentHls.value && hlsPlayerRef.value) {
      await hlsPlayerRef.value.reconnect(currentVideoUrl.value)
      return
    }
    
    // 如果是DirectWebRTC视频，重新初始化
    if (isCurrentDirectWebRTC.value && directWebrtcPlayerRef.value) {
      // DirectWebRTCVideoPlayer有自己的重连逻辑，无需特殊处理
      return
    }
    
    // 其他视频格式的重新连接逻辑
    destroyCurrentPlayer()
    
    // 等待DOM更新和清理完成
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 重新初始化
    await initVideo()
  } catch (error) {
    console.error('重新连接失败:', error)
    errorMessage.value = `重新连接失败: ${(error as Error).message || '未知错误'}`
    safeEmit('error', error)
  }
}

// 事件处理
const handleVideoEnded = () => {
  if (videoUrls.value.length > currentVideoIndex.value + 1) {
    currentVideoIndex.value += 1
    initVideo()
  }
}

const handleNativePlayerError = (error: any) => {
  console.error('原生播放器错误:', error)
  const errorMsg = typeof error === 'string' ? error : `播放器错误: ${(error as Error)?.message || '未知错误'}`
  errorMessage.value = errorMsg
  safeEmit('error', errorMsg)
}

const handleTabChange = async (key: number) => {
  currentVideoIndex.value = key
  await initVideo()
}

// HLS 组件事件处理
const handlePlayerError = (error: any) => {
  console.error('HLS播放器错误:', error)
  const errorMsg = typeof error === 'string' ? error : `HLS播放器错误: ${(error as Error)?.message || '未知错误'}`
  hlsError.value = errorMsg
  safeEmit('error', errorMsg)
}

const handlePlayerLoaded = (data: any) => {
  console.log('HLS播放器加载完成:', data)
  hlsLoading.value = false
}

// 状态处理方法
const handleWebRtcLoading = (loading: boolean) => {
  webrtcLoading.value = loading
}

const handleWebRtcError = (error: string | unknown) => {
  const errorMsg = typeof error === 'string' ? error : `WebRTC连接错误: ${(error as Error)?.message || '未知错误'}`
  webrtcError.value = errorMsg
  safeEmit('error', errorMsg)
}

const handleHlsLoading = (loading: boolean) => {
  hlsLoading.value = loading
}

const handleHlsError = (error: string | unknown) => {
  const errorMsg = typeof error === 'string' ? error : `HLS播放器错误: ${(error as Error)?.message || '未知错误'}`
  hlsError.value = errorMsg
  safeEmit('error', errorMsg)
}

// 生命Maintainer期
onMounted(() => {
  initVideo()
})

onBeforeUnmount(() => {
  isComponentDestroyed.value = true
  destroyCurrentPlayer()
})

// 页面激活时恢复播放
onActivated(() => {
  if (isCurrentRtsp.value && webrtcPlayerRef.value) {
    webrtcPlayerRef.value.play()
  } else if (isCurrentHls.value && hlsPlayerRef.value) {
    hlsPlayerRef.value.play()
  } else if (isCurrentDirectWebRTC.value && directWebrtcPlayerRef.value) {
    // DirectWebRTCVideoPlayer有自己的生命Maintainer期管理
  } else if (videoRef.value && videoRef.value.paused) {
    playVideo()
  }
})

// 页面停用时暂停播放
onDeactivated(() => {
  if (isCurrentRtsp.value && webrtcPlayerRef.value) {
    webrtcPlayerRef.value.pause()
  } else if (isCurrentHls.value && hlsPlayerRef.value) {
    hlsPlayerRef.value.pause()
  } else if (isCurrentDirectWebRTC.value && directWebrtcPlayerRef.value) {
    // DirectWebRTCVideoPlayer有自己的生命Maintainer期管理
  } else if (videoRef.value && !videoRef.value.paused) {
    pauseVideo()
  }
})

// 监听属性变化 - 只保留一个 watch，避免重复触发
watch(() => props.videoUrl, async (newUrl, oldUrl) => {
  if (isComponentDestroyed.value) return
  
  const newFirstUrl = Array.isArray(newUrl) ? newUrl[0] : newUrl
  const oldFirstUrl = Array.isArray(oldUrl) ? oldUrl[0] : oldUrl
  
  if (newFirstUrl !== oldFirstUrl) {
    currentVideoIndex.value = 0
    console.log('VideoPlayer videoUrl 变化:', newFirstUrl, '类型:', getVideoType(newFirstUrl as string))
    await reconnect(newFirstUrl as string)
  }
}, { flush: 'post' })

// 监听播放器类型变化 - 用于调试
watch([isCurrentDirectWebRTC, isCurrentRtsp, isCurrentHls, isCurrentImg, hasValidVideoUrl], ([directWebrtc, rtsp, hls, img, valid]) => {
  console.log(`[VideoPlayer] 播放器类型变化:`)
  console.log(`  - DirectWebRTC: ${directWebrtc}`)
  console.log(`  - RTSP: ${rtsp}`)
  console.log(`  - HLS: ${hls}`)
  console.log(`  - Image: ${img}`)
  console.log(`  - hasValidVideoUrl: ${valid}`)
  console.log(`  -> 实际渲染: ${debugPlayerType.value}`)
}, { flush: 'post' })

// 暴露给父组件的方法
defineExpose({
  play: () => {
    if (isCurrentRtsp.value && webrtcPlayerRef.value) {
      webrtcPlayerRef.value.play()
    } else if (isCurrentHls.value && hlsPlayerRef.value) {
      hlsPlayerRef.value.play()
    } else if (isCurrentDirectWebRTC.value && directWebrtcPlayerRef.value) {
      // DirectWebRTCVideoPlayer有自己的播放控制
    } else {
      playVideo()
    }
  },
  pause: () => {
    if (isCurrentRtsp.value && webrtcPlayerRef.value) {
      webrtcPlayerRef.value.pause()
    } else if (isCurrentHls.value && hlsPlayerRef.value) {
      hlsPlayerRef.value.pause()
    } else if (isCurrentDirectWebRTC.value && directWebrtcPlayerRef.value) {
      // DirectWebRTCVideoPlayer有自己的暂停控制
    } else {
      pauseVideo()
    }
  },
  stop: () => {
    stopVideo()
    
  },
  reconnect,
  isConnected: () => {
    if (isCurrentRtsp.value && webrtcPlayerRef.value) {
      return webrtcPlayerRef.value.isConnected()
    } else if (isCurrentHls.value && hlsPlayerRef.value) {
      return hlsPlayerRef.value.isConnected()
    } else if (isCurrentDirectWebRTC.value && directWebrtcPlayerRef.value) {
      // DirectWebRTCVideoPlayer有自己的连接状态
      return true; // ZLMediaKit WebRTC连接状态需要根据实际组件实现调整
    } else if (isCurrentImg.value) {
      return true; 
    }
    return isConnected.value
  },
  getCurrentUrl: () => currentVideoUrl.value,
  getCurrentIndex: () => currentVideoIndex.value,
  getLoadingState: () => showLoading.value,
  getErrorMessage: () => currentErrorMessage.value
})
</script>

<style scoped lang="scss">
.video-view {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  height: 100%; // 固定高度
  
  .video-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center; // 水平居中
    align-items: center; // 垂直居中
    background: #000; // 添加黑色背景
    
    .video-element {
      height: 100%; // 固定高度
      min-width: 75%;
      max-width: 100%; // 宽度自适应，不超过容器宽度
      object-fit: contain; // 保持视频原始比例
    }
  }

  span {
    font-size: 16px;
    text-align: center;
  }

  .video-tabs {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    padding: 0 10px;
    background: rgba(0, 0, 0, 0.7);
  }
  
  .loading-overlay, .error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; // 固定高度与视频容器一致
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    z-index: 10;
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #0058FD;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }
    
    .retry-btn {
      margin-top: 10px;
      padding: 4px 16px;
      background: #0058FD;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background: #0048DD;
      }
    }
  }
  
  .custom-bottom-control {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    z-index: 5;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}
</style>