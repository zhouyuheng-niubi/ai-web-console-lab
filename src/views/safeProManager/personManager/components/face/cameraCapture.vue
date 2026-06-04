<template>
  <div class="camera-capture-container">
    <!-- <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">拍照录入</h3>
      <button @click="closeCamera" class="text-gray-500 hover:text-gray-800">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div> -->

    <div class="flex flex-col items-center">
      <!-- 摄像头预览 -->
      <div class="mb-4 relative">
        <video 
          ref="videoRef" 
          autoplay 
          playsinline
          class="w-full h-auto max-h-[400px] rounded-lg border-2 border-blue-500"
        ></video>
        
        <!-- 拍照引导框 -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          w-48 h-64 border-2 border-white border-dashed rounded-lg">
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 text-white text-sm bg-blue-500 px-2 py-1 rounded">
            请将人脸置于框内
          </div>
        </div>
        
        <!-- 拍照指示器 -->
        <div v-if="isCapturing" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div class="text-white text-2xl font-bold animate-pulse">拍照中...</div>
        </div>
      </div>

      <!-- 拍照结果预览 -->
      <div v-if="capturedImage" class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-medium">拍照结果</h4>
          <button @click="retakePhoto" class="text-blue-600 hover:text-blue-800 text-sm">
            重新拍照
          </button>
        </div>
        <img :src="capturedImage" alt="拍照结果" class="w-48 h-64 object-cover rounded-lg border border-gray-300">
        <div class="mt-2 text-center text-sm text-gray-500">
          照片尺寸: {{ imageSize.width }}×{{ imageSize.height }}
        </div>
      </div>

      <!-- 拍照按钮 -->
      <div v-if="!capturedImage" class="flex flex-col items-center space-y-4">
        <button 
          @click="capturePhoto"
          :disabled="!isCameraReady"
          :class="[
            'w-16 h-16 rounded-full transition-all flex items-center justify-center',
            isCameraReady 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg transform hover:scale-105' 
              : 'bg-gray-400 cursor-not-allowed text-gray-200'
          ]"
        >
          <svg v-if="isCameraReady" class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"/>
          </svg>
          <span v-else class="text-sm">准备中...</span>
        </button>
        <div class="text-center text-sm text-gray-600">
          点击按钮拍照
        </div>
      </div>

      <!-- 拍照后的操作按钮 -->
      <div v-if="capturedImage" class="flex items-center gap-4">
        <button 
          @click="usePhoto"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          使用此照片
        </button>
        <button 
          @click="closeCamera"
          class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
        >
          取消
        </button>
      </div>
    </div>

    <!-- 摄像头状态提示 -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <span class="font-medium">拍照提示</span>
      </div>
      <ul class="text-sm text-gray-600 space-y-1">
        <li>• 确保环境光线充足，避免背光</li>
        <li>• 请保持面部正对摄像头</li>
        <li>• 摘掉帽子、眼镜等遮挡物</li>
        <li>• 表情自然，保持眼睛睁开</li>
        <li>• 照片将用于人脸识别，请确保质量</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'

const emit = defineEmits(['capture', 'close'])

// 响应式数据
const videoRef = ref(null)
const capturedImage = ref('')
const isCameraReady = ref(false)
const isCapturing = ref(false)
const imageSize = ref({ width: 0, height: 0 })
const stream = ref(null)

// 初始化摄像头
const initCamera = async () => {
  try {
    // 请求摄像头权限
    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user' // 使用前置摄像头
      }
    }
    
    stream.value = await navigator.mediaDevices.getUserMedia(constraints)
    
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      isCameraReady.value = true
    }
  } catch (error) {
    console.error('摄像头初始化失败:', error)
    message.error('摄像头访问失败，请检查权限')
  }
}

// 拍照
const capturePhoto = () => {
  if (!videoRef.value || !isCameraReady.value) return
  
  isCapturing.value = true
  
  // 延迟一点时间让指示器显示
  setTimeout(() => {
    try {
      const canvas = document.createElement('canvas')
      const video = videoRef.value
      
      // 设置canvas尺寸与视频相同
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // 绘制视频帧到canvas
      const ctx = canvas.getContext('2d')
      
      // 计算裁剪区域（保持比例并居中）
      const size = Math.min(video.videoWidth, video.videoHeight)
      const x = (video.videoWidth - size) / 2
      const y = (video.videoHeight - size) / 2
      
      // 绘制裁剪后的图像
      ctx.drawImage(video, x, y, size, size, 0, 0, size, size)
      
      // 转换为base64
      capturedImage.value = canvas.toDataURL('image/jpeg', 0.9)
      imageSize.value = { width: size, height: size }
      
      isCapturing.value = false
      message.success('拍照成功')
    } catch (error) {
      console.error('拍照失败:', error)
      message.error('拍照失败，请重试')
      isCapturing.value = false
    }
  }, 500)
}

// 重新拍照
const retakePhoto = () => {
  capturedImage.value = ''
}

// 使用照片
const usePhoto = () => {
  if (capturedImage.value) {
    emit('capture', capturedImage.value)
  }
}

// 关闭摄像头
const closeCamera = () => {
  emit('close')
}

// 清理摄像头流
const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
}

// 生命Maintainer期
onMounted(() => {
  initCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
.camera-capture-container {
  height: 700px;
  overflow-y: auto;
  padding: 0 4px;
}

.camera-capture-container::-webkit-scrollbar {
  width: 6px;
}

.camera-capture-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.camera-capture-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.camera-capture-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

video {
  background: #000;
}
</style>