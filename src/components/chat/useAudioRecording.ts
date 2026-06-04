import { ref, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { speechToText } from '@/api/chat'

/**
 * 录音功能 Composable
 * @param contentRef 输入框内容的 ref，用于将识别结果追加到输入框
 * @returns 录音相关的状态、配置和函数
 */
export function useAudioRecording(contentRef: { value: string }) {
  // 录音状态
  const audioBlob = ref<Blob | null>(null)
  const mediaRecorder = ref<MediaRecorder | null>(null)
  const audioChunks = ref<BlobPart[]>([])
  const isProcessingAudio = ref(false) // 音频处理中状态

  // 录音配置
  const speechConfig = ref({
    recording: false,
    onRecordingChange: handleRecordingChange
  })

  // 处理录音状态变化
  function handleRecordingChange(recording: boolean) {
    speechConfig.value.recording = recording

    if (recording) {
      startSpeechRecording()
    } else {
      stopSpeechRecording()
    }
  }

  // 开始语音录音
  async function startSpeechRecording() {
    try {
      // 清空之前的音频数据
      audioChunks.value = []
      audioBlob.value = null

      // 请求麦克风权限并开始录音
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.value = new MediaRecorder(stream)

      // 收集音频数据
      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data)
        }
      }

      // 录音停止后的处理
      mediaRecorder.value.onstop = async () => {
        try {
          // 创建音频 Blob
          console.log('audioChunks:', audioChunks.value)
          audioBlob.value = new Blob(audioChunks.value, { type: 'audio/wav' })
          console.log('音频数据已捕获:', audioBlob.value)

          // 停止音频流
          stream.getTracks().forEach(track => track.stop())

          // 上传音频并识别
          await uploadAndRecognizeAudio(audioBlob.value)
        } catch (error) {
          console.error('处理音频失败:', error)
          message.error('语音识别失败，请重试')
          isProcessingAudio.value = false
          speechConfig.value.recording = false
        }
      }

      // 开始录音
      mediaRecorder.value.start()
      speechConfig.value.recording = true

      message.info('开始录音，请说话...')

    } catch (error) {
      console.error('启动录音失败:', error)

      if (error instanceof Error) {
        console.log('error:', error)
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          message.error('请允许麦克风访问权限')
        } else if (error.name === 'NotFoundError') {
          message.error('未找到麦克风设备')
        } else {
          message.error('启动录音失败: ' + error.message)
        }
      } else {
        message.error('启动录音失败，请重试')
      }

      speechConfig.value.recording = false
    }
  }

  // 上传音频并识别
  async function uploadAndRecognizeAudio(blob: Blob) {
    if (!blob || blob.size === 0) {
      console.warn('音频数据为空，跳过识别')
      return
    }

    isProcessingAudio.value = true
    message.loading({ content: '正在识别语音...', key: 'speechRecognition', duration: 0 })

    try {
      console.log('开始上传音频进行识别...')
      const response = await speechToText(blob) as any
      console.log('语音识别响应:', response)

      // 处理识别结果
      if (response && response.data && response.data) {
        const recognizedText = response.data

        // 将识别结果追加到输入框
        const currentContent = contentRef.value.trim()
        if (currentContent && !currentContent.endsWith(' ') && !recognizedText.startsWith(' ')) {
          contentRef.value = currentContent + ' ' + recognizedText
        } else {
          contentRef.value = currentContent + recognizedText
        }

        message.success({ content: '识别完成', key: 'speechRecognition' })
      } else {
        message.warning({ content: '未能识别到语音内容', key: 'speechRecognition' })
      }

    } catch (error) {
      console.error('语音识别请求失败:', error)
      message.error({ content: '语音识别失败，请重试', key: 'speechRecognition' })
    } finally {
      isProcessingAudio.value = false
      speechConfig.value.recording = false
    }
  }

  // 停止语音录音
  function stopSpeechRecording() {
    try {
      if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
        mediaRecorder.value.stop()
        mediaRecorder.value = null
        isProcessingAudio.value = true
        message.loading({ content: '正在识别语音...', key: 'speechRecognition', duration: 0 })
        console.log('录音已停止')
      }
    } catch (error) {
      console.error('停止录音失败:', error)
      speechConfig.value.recording = false
      isProcessingAudio.value = false
    }
  }

  // 组件卸载时清理资源
  onUnmounted(() => {
    stopSpeechRecording()
    if (mediaRecorder.value) {
      mediaRecorder.value.stream?.getTracks().forEach(track => track.stop())
    }
  })

  return {
    // 状态
    audioBlob,
    mediaRecorder,
    audioChunks,
    isProcessingAudio,
    speechConfig,

    // 函数
    handleRecordingChange,
    startSpeechRecording,
    stopSpeechRecording,
    uploadAndRecognizeAudio,
  }
}
