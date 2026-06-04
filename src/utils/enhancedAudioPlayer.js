import {stopAllNativeAudioElements} from './tool'

/**
 * 增强版音频播放器
 * 专门优化连续播放体验，解决一截截播放的问题
 * 新增音频缓存功能，支持重复播放
 */

class EnhancedAudioPlayer {
  constructor() {
    // 音频配置
    this.audioConfig = {
      sampleRate: 24000,
      channels: 1,
      bitDepth: 16,
      bufferSize: 4096
    }
    
    // 音频上下文
    this.audioContext = null
    // 音频工作节点
    this.workletNode = null
    // 脚本处理器（用于兼容旧浏览器）
    this.scriptProcessor = null
    // 音频缓冲区数组
    this.audioBuffers = []
    // 当前缓冲区索引
    this.currentBufferIndex = 0
    // 当前缓冲区位置
    this.currentBufferPosition = 0
    // 总处理帧数
    this.totalFramesProcessed = 0
    // 播放开始时间
    this.playStartTime = 0
    // 暂停位置
    this.pausePosition = 0
    // 是否正在播放
    this.isPlaying = false
    // 是否已暂停
    this.paused = false
    // 是否已初始化
    this.isInitialized = false
    this.isWorkletSupported = false
    
    // Base64音频数据队列
    this.base64AudioDataQueue = []
    // 音频元素（用于某些浏览器的兼容性）
    this.audioElement = null
    // 音频元素源节点
    this.audioElementSource = null
    // 回调函数
    this.onPlay = null
    this.onPause = null
    this.onStop = null
    this.onEnd = null
    // 添加增益节点用于控制音量
    this.gainNode = null
    // 添加一个标志，用于跟踪页面可见性状态
    this.pageVisible = true
    // 添加一个标志，用于跟踪是否应该在页面可见时自动恢复播放
    this.shouldResumeOnVisible = false
    
    // 音频缓存管理
    this.audioCache = new Map() // 存储缓存的音频数据，key为消息ID，value为AudioBuffer
    this.currentCacheKey = null // 当前播放的缓存键
    
    // 连续播放控制
    this.minBufferDuration = 0.3 // 最小缓冲时长（秒）
    this.targetBufferDuration = 0.8 // 目标缓冲时长（秒）
    this.maxBufferDuration = 5.0 // 最大缓冲时长（秒）
    
    // 用户交互解锁状态
    this.isUserInteractionUnlocked = false
    
    // 播放完成标志
    this.isPlaybackCompleted = false
  }
  
  /**
   * 解锁音频上下文（用于iOS Safari等需要用户交互的浏览器）
   */
  unlockAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      // 在iOS Safari中，需要用户交互来解锁音频上下文
      return this.audioContext.resume().then(() => {
        this.isUserInteractionUnlocked = true
        console.log('音频上下文已解锁')
        return true
      }).catch(error => {
        console.warn('音频上下文解锁失败:', error)
        // 即使解锁失败，也标记为已尝试解锁
        this.isUserInteractionUnlocked = true
        return false
      })
    }
    return Promise.resolve(true)
  }
  
  /**
   * 检查浏览器兼容性
   */
  checkCompatibility() {
    const isWorkletSupported = typeof AudioContext !== 'undefined' && 
                             typeof AudioWorkletNode !== 'undefined' &&
                             typeof AudioWorkletProcessor !== 'undefined'
    
    const isScriptProcessorSupported = typeof AudioContext !== 'undefined' &&
                                     typeof AudioContext.prototype.createScriptProcessor !== 'undefined'
    
    return {
      workletSupported: isWorkletSupported,
      scriptProcessorSupported: isScriptProcessorSupported
    }
  }
  
  /**
   * 转换PCM字节为Float32
   */
  convertToFloat32(byteData, bitDepth) {
    const buffer = new DataView(byteData)
    const float32 = new Float32Array(byteData.byteLength / (bitDepth / 8))
    const scale = 1 / (1 << (bitDepth - 1))
    
    for (let i = 0; i < float32.length; i++) {
      const byteOffset = i * (bitDepth / 8)
      if (bitDepth === 16) {
        float32[i] = buffer.getInt16(byteOffset, true) * scale
      } else if (bitDepth === 32) {
        float32[i] = buffer.getInt32(byteOffset, true) * scale
      }
    }
    
    return float32
  }
  
  /**
   * 初始化AudioWorklet
   */
  async initializeWorklet() {
    try {
      // 创建AudioWorklet处理器脚本
      const processorScript = `
        class EnhancedStreamProcessor extends AudioWorkletProcessor {
          constructor() {
            super()
            this.buffers = []
            this.currentBufferIndex = 0
            this.currentPosition = 0
            this.isPlaying = true
            this.paused = false
            this.pausePosition = 0
            this.totalFramesProcessed = 0
            this.config = {
              sampleRate: 24000,
              channels: 1
            }
            
            // 监听来自主线程的消息
            this.port.onmessage = (event) => {
              const { type, buffer, pausePosition } = event.data
              
              switch (type) {
                case 'pushBuffer':
                  this.buffers.push(buffer)
                  break
                case 'pause':
                  this.paused = true
                  this.pausePosition = pausePosition
                  break
                case 'resume':
                  this.paused = false
                  // 重置播放位置到暂停位置
                  this.resetPlaybackPosition(pausePosition)
                  break
                case 'clearBuffers':
                  this.buffers = []
                  this.currentBufferIndex = 0
                  this.currentPosition = 0
                  break
              }
            }
          }
          
          resetPlaybackPosition(targetPosition) {
            let position = 0
            this.currentBufferIndex = 0
            this.currentPosition = 0
            
            // 遍历缓冲区找到目标位置
            for (let i = 0; i < this.buffers.length; i++) {
              const buffer = this.buffers[i]
              if (position + buffer.length > targetPosition) {
                this.currentBufferIndex = i
                this.currentPosition = targetPosition - position
                break
              }
              position += buffer.length
            }
            
            this.totalFramesProcessed = targetPosition
          }

          process(inputs, outputs, parameters) {
            const output = outputs[0]
            const channelCount = this.config.channels
            const frameCount = output[0].length

            // 如果暂停，输出静音
            if (this.paused) {
              for (let c = 0; c < channelCount; c++) {
                output[c].fill(0)
              }
              return true
            }

            // 如果没有数据，输出静音
            if (this.buffers.length === 0 || this.currentBufferIndex >= this.buffers.length) {
              for (let c = 0; c < channelCount; c++) {
                output[c].fill(0)
              }
              return true
            }

            // 连续填充音频数据
            let framesFilled = 0
            while (framesFilled < frameCount && this.currentBufferIndex < this.buffers.length) {
              const currentBuffer = this.buffers[this.currentBufferIndex]
              const remainingInBuffer = currentBuffer.length - this.currentPosition
              const framesToCopy = Math.min(frameCount - framesFilled, remainingInBuffer)
              
              // 为每个通道填充数据
              for (let c = 0; c < channelCount; c++) {
                const channelData = output[c]
                for (let i = 0; i < framesToCopy; i++) {
                  const bufferIndex = this.currentPosition + i
                  const outputIndex = framesFilled + i
                  channelData[outputIndex] = currentBuffer[bufferIndex] || 0
                }
              }
              
              framesFilled += framesToCopy
              this.currentPosition += framesToCopy
              this.totalFramesProcessed += framesToCopy
              
              // 如果当前缓冲区已用完，移动到下一个
              if (this.currentPosition >= currentBuffer.length) {
                this.currentBufferIndex++
                this.currentPosition = 0
              }
            }
            
            // 如果还有剩余空间，填充静音
            if (framesFilled < frameCount) {
              for (let c = 0; c < channelCount; c++) {
                const channelData = output[c]
                for (let i = framesFilled; i < frameCount; i++) {
                  channelData[i] = 0
                }
              }
            }

            return true
          }
        }

        registerProcessor('enhanced-stream-processor', EnhancedStreamProcessor)
      `
      
      // 创建Blob URL
      const blob = new Blob([processorScript], { type: 'text/javascript' })
      const workletUrl = URL.createObjectURL(blob)
      
      // 添加AudioWorklet模块
      await this.audioContext.audioWorklet.addModule(workletUrl)
      
      // 创建GainNode用于控制音量
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0; // 设置增益为1.0（正常音量）
      
      // 创建WorkletNode
      this.workletNode = new AudioWorkletNode(this.audioContext, 'enhanced-stream-processor', {
        outputChannelCount: [this.audioConfig.channels]
      })
      
      // 连接节点：workletNode -> gainNode -> destination
      this.workletNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      return true
    } catch (error) {
      console.error('初始化AudioWorklet失败:', error)
      return false
    }
  }
  
  /**
   * 初始化ScriptProcessor（降级方案）
   */
  initializeScriptProcessor() {
    try {
      // 创建脚本处理器
      const bufferSize = this.audioConfig.bufferSize
      this.scriptProcessor = this.audioContext.createScriptProcessor(
        bufferSize, 
        0, 
        this.audioConfig.channels
      )
      
      // 创建GainNode用于控制音量
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 1.0; // 设置增益为1.0（正常音量）
      
      // 保存this引用
      const self = this
      
      // 处理音频
      this.scriptProcessor.onaudioprocess = function(event) {
        const outputBuffer = event.outputBuffer
        const channelCount = self.audioConfig.channels
        const frameCount = outputBuffer.length
        
        // 如果没有音频数据，输出静音
        if (self.audioBuffers.length === 0 || self.currentBufferIndex >= self.audioBuffers.length) {
          for (let channel = 0; channel < channelCount; channel++) {
            const data = outputBuffer.getChannelData(channel)
            data.fill(0)
          }
          return
        }
        
        // 连续填充音频数据
        let framesFilled = 0
        while (framesFilled < frameCount && self.currentBufferIndex < self.audioBuffers.length) {
          const currentBuffer = self.audioBuffers[self.currentBufferIndex]
          const remainingInBuffer = currentBuffer.length - self.currentBufferPosition
          const framesToCopy = Math.min(frameCount - framesFilled, remainingInBuffer)
          
          // 为每个通道填充数据
          for (let channel = 0; channel < channelCount; channel++) {
            const outputData = outputBuffer.getChannelData(channel)
            for (let i = 0; i < framesToCopy; i++) {
              const bufferIndex = self.currentBufferPosition + i
              const outputIndex = framesFilled + i
              const dataIndex = channelCount === 1 ? bufferIndex : bufferIndex * 2 + channel
              outputData[outputIndex] = currentBuffer[dataIndex] || 0
            }
          }
          
          framesFilled += framesToCopy
          self.currentBufferPosition += framesToCopy
          self.totalFramesProcessed += framesToCopy
          
          // 如果当前缓冲区已用完，移动到下一个
          if (self.currentBufferPosition >= currentBuffer.length) {
            self.currentBufferIndex++
            self.currentBufferPosition = 0
          }
        }
        
        // 如果还有剩余空间，填充静音
        if (framesFilled < frameCount) {
          for (let channel = 0; channel < channelCount; channel++) {
            const outputData = outputBuffer.getChannelData(channel)
            for (let i = framesFilled; i < frameCount; i++) {
              outputData[i] = 0
            }
          }
        }
      }
      
      // 连接到扬声器：scriptProcessor -> gainNode -> destination
      this.scriptProcessor.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      return true
    } catch (error) {
      console.error('初始化ScriptProcessor失败:', error)
      return false
    }
  }
  
  /**
   * 初始化音频播放器
   * @param {string} iosAudioCategory - iOS音频会话类别
   */
  async init(iosAudioCategory = 'playback') {
    if (this.isInitialized) return true
    
    try {
      // 检查兼容性
      const compatibility = this.checkCompatibility()
      this.isWorkletSupported = compatibility.workletSupported
      
      if (!compatibility.workletSupported && !compatibility.scriptProcessorSupported) {
        throw new Error('浏览器不支持Web Audio API')
      }
      
      // 创建音频上下文
      const AudioContext = window.AudioContext || window.webkitAudioContext
      this.audioContext = new AudioContext({ sampleRate: this.audioConfig.sampleRate })
      
      // 尝试恢复可能被暂停的音频上下文
      if (this.audioContext.state === 'suspended') {
        // 在iOS Safari中，音频上下文需要用户交互才能解锁
        // 这里我们不等待resume完成，因为可能没有用户交互
        this.audioContext.resume().catch(error => {
          console.warn('音频上下文恢复失败，可能需要用户交互来解锁:', error)
        })
      }
      
      // 初始化音频处理器
      let initialized = false
      if (compatibility.workletSupported) {
        initialized = await this.initializeWorklet()
      } else if (compatibility.scriptProcessorSupported) {
        initialized = this.initializeScriptProcessor()
      }
      
      if (!initialized) {
        throw new Error('初始化音频播放器失败')
      }
      
      this.isInitialized = true
      this.isPlaying = true
      this.isPlaybackCompleted = false
      
      return true
    } catch (error) {
      console.error('初始化音频播放器失败:', error)
      // 清理已创建的资源
      this.cleanupResources()
      throw error
    }
  }
  
  
  /**
   * 确保音频上下文已解锁（用于需要用户交互的场景）
   */
  async ensureAudioContextUnlocked() {
    if (!this.audioContext) {
      await this.init()
    }
    
    // 如果音频上下文被暂停，尝试解锁
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        // 尝试解锁音频上下文
        await this.unlockAudioContext()
      } catch (error) {
        console.warn('音频上下文解锁失败，可能需要用户交互:', error)
        // 如果解锁失败，我们仍然继续，因为播放时可能会再次尝试
      }
    }
    
    // 返回音频上下文是否正在运行
    return this.audioContext ? this.audioContext.state === 'running' : false
  }
  
  /**
   * 将Base64字符串转换为ArrayBuffer
   */
  base64ToArrayBuffer(base64) {
    // 移除可能存在的数据URL前缀
    const base64Data = base64.replace(/^data:audio\/[a-z]+;base64,/, '')
    
    // 将Base64字符串转换为二进制字符串
    const binaryString = atob(base64Data)
    
    // 创建字节数组
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    // 返回ArrayBuffer
    return bytes.buffer
  }
  
  /**
   * 计算缓冲区时长（秒）
   */
  calculateBufferDuration() {
    let totalFrames = 0
    for (const buffer of this.audioBuffers) {
      totalFrames += buffer.length
    }
    // 减去已经播放的帧数
    totalFrames -= this.totalFramesProcessed
    return Math.max(0, totalFrames / this.audioConfig.sampleRate)
  }
  
  /**
   * 检查是否需要更多数据
   */
  needMoreData() {
    const bufferDuration = this.calculateBufferDuration()
    return bufferDuration < this.minBufferDuration
  }
  
  /**
   * 检查是否有足够数据开始播放
   */
  hasEnoughDataToPlay() {
    const bufferDuration = this.calculateBufferDuration()
    return bufferDuration >= this.targetBufferDuration || 
           (this.audioBuffers.length > 0 && !this.needMoreData())
  }
  
  /**
   * 添加音频数据到播放队列
   */
  addAudioData(key, base64Data, onEndedCallback = null, isStreamEnded = false, shouldPlay = true) {
    if (!this.audioContext) return
    try {
      this.currentCacheKey = key
      // 将Base64数据转换为ArrayBuffer
      const arrayBuffer = this.base64ToArrayBuffer(base64Data)
      // 转换为Float32数组
      const float32Data = this.convertToFloat32(arrayBuffer, this.audioConfig.bitDepth)
      // 如果shouldPlay为false，只缓存数据到base64队列，不添加到播放缓冲区
      if (!shouldPlay) {
        // 播放前缓存数据到base64队列
        this.base64AudioDataQueue.push(float32Data)
        return
      }
      if(this.base64AudioDataQueue.length > 0) {
        this.base64AudioDataQueue.forEach(item => {
          this.audioBuffers.push(item)
          // 如果使用AudioWorklet且正在播放，发送缓存数据到工作线程
          if (this.isPlaying && this.workletNode && this.workletNode.port) {
            this.workletNode.port.postMessage({
              type: 'pushBuffer',
              buffer: item
            }, [item.buffer])
          }
        })
        
        // 清空缓存队列
        this.base64AudioDataQueue = []
      }
      
      // 添加到音频缓冲区
      this.audioBuffers.push(float32Data)
      // 如果使用AudioWorklet且正在播放，发送数据到工作线程
      if (this.isPlaying && this.workletNode && this.workletNode.port) {
        this.workletNode.port.postMessage({
          type: 'pushBuffer',
          buffer: float32Data
        }, [float32Data.buffer])
      }
      
      // 确保isPlaying状态正确设置
      if (!this.isPlaying && this.hasEnoughDataToPlay()) {
        this.isPlaying = true
      }
      
      // 只有在以下条件都满足时才触发onPlay回调：
      // 1. 有足够的数据播放
      // 2. 还没有开始播放（playStartTime为0）
      // 3. onPlay回调存在
      // 4. 当前处于播放状态
      if (this.hasEnoughDataToPlay() && 
          !this.playStartTime && 
          this.onPlay && 
          this.isPlaying) {
        this.playStartTime = this.audioContext.currentTime
        this.onPlay()
        // 设置播放完成检查定时器
        if (onEndedCallback) {
          this.checkPlaybackCompletion(onEndedCallback)
        }
      }
      
      // 如果已经播放但新增了数据，重新检查播放完成
      if (this.isPlaying && this.playStartTime && onEndedCallback) {
        this.checkPlaybackCompletion(onEndedCallback)
      }
      
      // 如果音频流已结束，立即缓存所有Base64数据
      if (isStreamEnded) {
        // 如果提供了回调函数，通知缓存完成
        if (onEndedCallback) {
          onEndedCallback({
            cached: true,
            cacheKey: key,
            message: '音频数据已缓存完成',
            isStreamEnded: true
          })
        }
      }
    } catch (error) {
      console.error('添加音频数据失败:', error)
    }
  }
  
  /**
   * 播放当前缓存的音频数据
   */
  playCurrentCacheData(key, onEndedCallback) {
    if (this.currentCacheKey === key) {
      if (!this.audioContext) return
      if (!this.base64AudioDataQueue?.length) return
      
      this.base64AudioDataQueue.forEach(item => {
        this.audioBuffers.push(item)
        // 如果使用AudioWorklet且正在播放，发送缓存数据到工作线程
        if (this.isPlaying && this.workletNode && this.workletNode.port) {
          this.workletNode.port.postMessage({
            type: 'pushBuffer',
            buffer: item
          }, [item.buffer])
        }
      })

      // 清空缓存队列
      this.base64AudioDataQueue = []
      
      // 确保isPlaying状态正确设置
      // 如果当前没有播放且有足够数据，则设置为播放状态
      if (!this.isPlaying && this.hasEnoughDataToPlay()) {
        this.isPlaying = true
      }
      
      // 只有在以下条件都满足时才触发onPlay回调：
      // 1. 有足够的数据播放
      // 2. 还没有开始播放（playStartTime为0）
      // 3. onPlay回调存在
      // 4. 当前处于播放状态
      if (this.hasEnoughDataToPlay() && 
          !this.playStartTime && 
          this.onPlay && 
          this.isPlaying) {
        this.playStartTime = this.audioContext.currentTime
        this.onPlay()
        
        // 设置播放完成检查定时器
        if (onEndedCallback) {
          this.checkPlaybackCompletion(onEndedCallback)
        }
      }
      
      // 如果已经播放但新增了数据，重新检查播放完成
      if (this.isPlaying && this.playStartTime && onEndedCallback) {
        this.checkPlaybackCompletion(onEndedCallback)
      }
    }
  }

  
  /**
   * 检查播放是否完成，并调用回调
   */
  checkPlaybackCompletion(onEndedCallback) {
    // 如果已经有定时器在运行，先清除
    if (this.playbackCheckTimer) {
      clearTimeout(this.playbackCheckTimer)
    }
    
    const checkCompletion = async () => {
      const bufferDuration = this.calculateBufferDuration()
      
      // 如果缓冲区还有数据，继续检查
      if (bufferDuration > 0) {
        this.playbackCheckTimer = setTimeout(checkCompletion, 100)
      } else {
        // 播放完成
        this.isPlaybackCompleted = true
        console.log('Base64音频播放完成')
        
        if (onEndedCallback) {
          // 传递播放完成状态给回调函数
          onEndedCallback({
            playbackCompleted: true,
            message: '音频播放完成'
          })
        }
        
        // 播放完成后立即清理资源
        await this.cleanupAfterPlayback()
        
        this.playbackCheckTimer = null
      }
    }
    
    // 立即开始检查
    this.playbackCheckTimer = setTimeout(checkCompletion, 100)
  }
  
  /**
   * 播放完成后的清理工作
   */
  async cleanupAfterPlayback() {
    console.log('开始播放完成后的清理工作');
    
    try {
      // 1. 重置播放状态
      this.isPlaying = false
      this.playStartTime = 0
      this.pausePosition = 0
      this.totalFramesProcessed = 0
      this.currentBufferIndex = 0
      this.currentBufferPosition = 0
      
      // 2. 清理音频缓冲区
      this.audioBuffers = []
      
      // 3. 如果使用AudioWorklet，清除缓冲区
      if (this.workletNode && this.workletNode.port) {
        this.workletNode.port.postMessage({
          type: 'clearBuffers'
        })
      }
      
      // 4. 重置音频
      stopAllNativeAudioElements()
      
      console.log('播放完成后的清理工作已完成');
    } catch (error) {
      console.error('播放完成后的清理工作失败:', error);
    }
  }
  
  /**
   * 清理资源
   */
  cleanupResources() {
    console.log('开始清理音频播放器资源');
    
    try {
      // 停止audio元素
      this.stopAudioElement();
      stopAllNativeAudioElements()
      // 清理资源
      if (this.workletNode) {
        try {
          this.workletNode.disconnect()
        } catch (error) {
          console.warn('断开workletNode连接失败:', error)
        }
        this.workletNode = null
      }
      
      if (this.scriptProcessor) {
        try {
          this.scriptProcessor.disconnect()
        } catch (error) {
          console.warn('断开scriptProcessor连接失败:', error)
        }
        this.scriptProcessor = null
      }
      
      // 断开并清理增益节点
      if (this.gainNode) {
        try {
          this.gainNode.disconnect()
        } catch (error) {
          console.warn('断开gainNode连接失败:', error)
        }
        this.gainNode = null
      }
      
      if (this.audioContext) {
        try {
          // 如果音频上下文正在运行，先暂停再关闭
          if (this.audioContext.state === 'running') {
            this.audioContext.suspend()
          }
          
          // 断开所有连接并关闭音频上下文
          this.audioContext.close().then(() => {
            console.log('音频上下文已关闭')
          }).catch(error => {
            console.error('关闭音频上下文失败:', error)
          })
        } catch (error) {
          console.error('处理音频上下文时出错:', error)
        }
        this.audioContext = null
      }
      
      // 清理数据
      this.base64AudioDataQueue = []
      this.audioBuffers = []
      
      console.log('音频播放器资源清理完成');
    } catch (error) {
      console.error('清理音频播放器资源时出错:', error);
    }
  }
  
  /**
   * 暂停播放
   */
  pause() {
    if (!this.isPlaying) return
    
    // 记录暂停位置
    this.pausePosition = this.totalFramesProcessed
    this.paused = true
    this.isPlaying = false
    
    // 如果使用AudioWorklet，发送暂停指令
    if (this.workletNode && this.workletNode.port) {
      this.workletNode.port.postMessage({
        type: 'pause',
        pausePosition: this.pausePosition
      })
    }
    
    // 暂停音频上下文
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend()
    }
    
    if (this.onPause) this.onPause()
  }

  /**
   * 暂停播放但不停止数据存储
   */
  pausePlaybackOnly() {
    // 只暂停播放状态，不影响数据存储
    this.paused = true
    // 不修改 this.isPlaying 状态，保持数据接收
    
    // 如果使用AudioWorklet，发送暂停指令
    if (this.workletNode && this.workletNode.port) {
      this.workletNode.port.postMessage({
        type: 'pause',
        pausePosition: this.totalFramesProcessed // 使用当前帧位置而不是暂停位置
      })
    }
    
    // 暂停音频上下文
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend()
    }
    
    if (this.onPause) this.onPause()
  }
  
  /**
   * 恢复播放
   */
  resume() {
    if (this.isPlaying) return
    
    this.isPlaying = true
    this.paused = false
    
    // 重新初始化音频处理器（如果需要）
    if ((!this.workletNode && !this.scriptProcessor) && this.audioContext) {
      const compatibility = this.checkCompatibility()
      if (compatibility.workletSupported) {
        this.initializeWorklet()
      } else if (compatibility.scriptProcessorSupported) {
        this.initializeScriptProcessor()
      }
    }
    
    // 如果使用AudioWorklet，发送恢复指令
    if (this.workletNode && this.workletNode.port) {
      this.workletNode.port.postMessage({
        type: 'resume',
        pausePosition: this.pausePosition
      })
    }
    
    // 恢复音频上下文
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    
    if (this.onPlay) this.onPlay()
  }
  
  /**
   * 停止播放并清理资源
   */
  async stop() {
    console.log('停止音频播放器');
    
    this.isPlaying = false
    this.isInitialized = false
    this.paused = false
    this.playStartTime = 0
    this.pausePosition = 0
    this.totalFramesProcessed = 0
    this.currentBufferIndex = 0
    this.currentBufferPosition = 0
    this.isPlaybackCompleted = false
    
    // 清理资源
    this.cleanupResources()
    
    // 清除所有事件回调
    this.onPlay = null
    this.onPause = null
    this.onStop = null
    this.onEnd = null
    
    if (this.onStop) {
      try {
        this.onStop()
      } catch (error) {
        console.error('执行onStop回调时出错:', error)
      }
    }
    
    console.log('音频播放器已完全停止')
  }
  
  /**
   * 停止播放并清理资源（用于页面卸载等场景）
   */
  async stopCompletely() {
    console.log('开始完全停止音频播放');
    
    // 停止所有可能的播放
    this.isPlaying = false
    this.paused = false
    this.isPlaybackCompleted = false
    
    // 清理资源
    this.cleanupResources()
    
    // 清理缓存数据
    this.audioCache.clear()
    
    // 清除所有事件回调
    this.onPlay = null
    this.onPause = null
    this.onStop = null
    this.onEnd = null
    
    console.log('音频播放器已完全停止')
  }
  
  /**
   * 停止播放但不影响数据缓存
   */
  async stopPlaybackOnly() {
    console.log('停止播放但保留数据缓存');
    
    this.isPlaying = false
    this.isInitialized = false // 重置初始化状态
    this.paused = false
    this.playStartTime = 0
    this.pausePosition = 0
    this.totalFramesProcessed = 0
    this.currentBufferIndex = 0
    this.currentBufferPosition = 0
    this.isPlaybackCompleted = false
    
    // 停止audio元素
    this.stopAudioElement();
    
    // 清理资源
    if (this.workletNode) {
      this.workletNode.disconnect()
      this.workletNode = null
    }
    
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect()
      this.scriptProcessor = null
    }
    
    // 断开增益节点但不清理
    if (this.gainNode) {
      this.gainNode.disconnect()
      this.gainNode = null
    }
    
    if (this.audioContext) {
      // 暂停音频上下文
      if (this.audioContext.state === 'running') {
        this.audioContext.suspend()
      }
    }
    
    // 清理播放数据，但保留缓存数据
    this.audioBuffers = []
    // 重置播放位置相关的计数器
    this.currentBufferIndex = 0
    this.currentBufferPosition = 0
    this.totalFramesProcessed = 0
    
    // 清除所有事件回调
    this.onPlay = null
    this.onPause = null
    this.onStop = null
    this.onEnd = null
    
    if (this.onStop) this.onStop()
    
    console.log('音频播放已停止，但数据缓存继续')
  }
  
  /**
   * 停止播放但继续接收和缓存数据
   */
  async stopPlaybackButContinueCaching() {
    console.log('停止播放但继续接收和缓存数据');
    
    // 只是停止播放，不清理任何数据
    this.isPlaying = false
    this.isInitialized = false // 重置初始化状态
    this.paused = false
    this.playStartTime = 0
    this.pausePosition = 0
    this.totalFramesProcessed = 0
    this.currentBufferIndex = 0
    this.currentBufferPosition = 0
    this.isPlaybackCompleted = false
    
    // 停止audio元素
    this.stopAudioElement();
    
    // 暂停音频上下文但不关闭
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend()
    }
    
    // 断开音频处理器但不清理
    if (this.workletNode) {
      this.workletNode.disconnect()
      this.workletNode = null
    }
    
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect()
      this.scriptProcessor = null
    }
    
    // 断开增益节点但不清理
    if (this.gainNode) {
      this.gainNode.disconnect()
      this.gainNode = null
    }
    
    // 清理播放缓冲区但保留缓存队列
    this.audioBuffers = []
    // 重置播放位置相关的计数器
    this.currentBufferIndex = 0
    this.currentBufferPosition = 0
    this.totalFramesProcessed = 0
    
    // 清除所有事件回调
    this.onPlay = null
    this.onPause = null
    this.onStop = null
    this.onEnd = null
    
    if (this.onStop) this.onStop()
    
    console.log('音频播放已停止，但继续接收和缓存数据')
  }
  
  /**
   * 恢复播放（包括之前缓存的数据）
   */
  async resumePlaybackWithCachedData() {
    if (this.isPlaying) return
    
    this.isPlaying = true
    this.paused = false
    this.isPlaybackCompleted = false
    
    // 重新初始化音频处理器
    if (this.audioContext) {
      const compatibility = this.checkCompatibility()
      if (compatibility.workletSupported && !this.workletNode) {
        await this.initializeWorklet()
      } else if (compatibility.scriptProcessorSupported && !this.scriptProcessor) {
        this.initializeScriptProcessor()
      }
    }
    
    // 恢复音频上下文
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
    
    if (this.onPlay) this.onPlay()
  }
  
  /**
   * 设置音量
   * @param {number} volume 音量值 (0.0 到 1.0)
   */
  setVolume(volume) {
    if (this.gainNode) {
      // 限制音量范围在0.0到1.0之间
      const clampedVolume = Math.max(0, Math.min(1, volume));
      this.gainNode.gain.value = clampedVolume;
      console.log(`音量已设置为: ${clampedVolume}`);
    } else {
      console.warn('增益节点未初始化，无法设置音量');
    }
  }
  
  /**
   * 增加音量
   * @param {number} increment 增量值
   */
  increaseVolume(increment = 0.1) {
    if (this.gainNode) {
      const currentVolume = this.gainNode.gain.value;
      const newVolume = Math.min(1, currentVolume + increment);
      this.gainNode.gain.value = newVolume;
      console.log(`音量已增加到: ${newVolume}`);
    } else {
      console.warn('增益节点未初始化，无法增加音量');
    }
  }
  
  /**
   * 减少音量
   * @param {number} decrement 减量值
   */
  decreaseVolume(decrement = 0.1) {
    if (this.gainNode) {
      const currentVolume = this.gainNode.gain.value;
      const newVolume = Math.max(0, currentVolume - decrement);
      this.gainNode.gain.value = newVolume;
      console.log(`音量已减少到: ${newVolume}`);
    } else {
      console.warn('增益节点未初始化，无法减少音量');
    }
  }
  
  /**
   * 获取当前音量
   * @returns {number} 当前音量值 (0.0 到 1.0)
   */
  getVolume() {
    if (this.gainNode) {
      return this.gainNode.gain.value;
    }
    return 0;
  }
  
  /**
   * 检查是否播放完毕
   */
  isPlaybackFinished() {
    return this.audioBuffers.length > 0 && 
           this.currentBufferIndex >= this.audioBuffers.length &&
           this.currentBufferPosition >= (this.audioBuffers[this.audioBuffers.length - 1]?.length || 0)
  }
  
  /**
   * 获取当前播放进度（0-1）
   */
  getProgress() {
    if (this.audioBuffers.length === 0) return 0
    
    let totalFrames = 0
    for (const buffer of this.audioBuffers) {
      totalFrames += buffer.length
    }
    
    if (totalFrames === 0) return 0
    
    return Math.min(1, this.totalFramesProcessed / totalFrames)
  }
  
  /**
   * 将Float32数组转换为WAV格式
   */
  float32ToWav(float32Array) {
    const sampleRate = this.audioConfig.sampleRate
    const channels = this.audioConfig.channels
    const bitDepth = 16 // WAV文件通常使用16位
    
    // 计算文件大小
    const bytesPerSample = bitDepth / 8
    const bytesPerFrame = channels * bytesPerSample
    const dataSize = float32Array.length * bytesPerSample
    const fileSize = 36 + dataSize
    
    // 创建ArrayBuffer
    const buffer = new ArrayBuffer(44 + dataSize)
    const view = new DataView(buffer)
    
    // 写入WAV文件头
    this.writeWavHeader(view, fileSize, sampleRate, channels, bitDepth)
    
    // 写入音频数据
    const offset = 44
    const scale = Math.pow(2, bitDepth - 1)
    
    for (let i = 0; i < float32Array.length; i++) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]))
      const intSample = sample * scale
      
      if (bitDepth === 16) {
        view.setInt16(offset + i * 2, intSample, true)
      }
    }
    
    return buffer
  }
  
  /**
   * 写入WAV文件头
   */
  writeWavHeader(view, fileSize, sampleRate, channels, bitDepth) {
    const bytesPerSample = bitDepth / 8
    const blockAlign = channels * bytesPerSample
    const byteRate = sampleRate * blockAlign
    
    // RIFF header
    this.writeString(view, 0, 'RIFF')
    view.setUint32(4, fileSize, true)
    this.writeString(view, 8, 'WAVE')
    
    // fmt chunk
    this.writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true) // chunk size
    view.setUint16(20, 1, true) // PCM format
    view.setUint16(22, channels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitDepth, true)
    
    // data chunk
    this.writeString(view, 36, 'data')
    view.setUint32(40, fileSize - 36, true)
  }
  
  /**
   * 写入字符串到DataView
   */
  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
  
  /**
   * 将Base64音频数据转换为音频文件地址
   */
  base64ToAudioFileUrl(base64Data, mimeType = 'audio/wav') {
    try {
      // 移除可能存在的数据URL前缀
      const base64DataClean = base64Data.replace(/^data:audio\/[a-z]+;base64,/, '')
      
      // 将Base64转换为二进制数据
      const binaryString = atob(base64DataClean)
      const bytes = new Uint8Array(binaryString.length)
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      // 创建Blob对象
      const blob = new Blob([bytes], { type: mimeType })
      
      // 生成Object URL
      const audioUrl = URL.createObjectURL(blob)
      
      return audioUrl
    } catch (error) {
      console.error('转换音频文件地址失败:', error)
      throw error
    }
  }
  
  /**
   * 将音频数据缓存到本地并返回文件地址
   */
  cacheAudioData(key, base64Data, mimeType = 'audio/wav') {
    try {
      // 生成音频文件地址
      const audioFileUrl = this.base64ToAudioFileUrl(base64Data, mimeType)
      
      // 将Base64数据转换为ArrayBuffer
      const arrayBuffer = this.base64ToArrayBuffer(base64Data)
      
      // 转换为Float32数组
      const float32Data = this.convertToFloat32(arrayBuffer, this.audioConfig.bitDepth)
      
      // 缓存到Map中
      this.audioCache.set(key, {
        buffer: float32Data,
        timestamp: Date.now(),
        audioFileUrl: audioFileUrl,
        mimeType: mimeType
      })
      
      return audioFileUrl
    } catch (error) {
      console.error('缓存音频数据失败:', error)
      return null
    }
  }
  
  /**
   * 直接从Base64数据获取音频文件地址（不缓存）
   */
  getAudioFileUrl(base64Data, mimeType = 'audio/wav') {
    return this.base64ToAudioFileUrl(base64Data, mimeType)
  }
  
  /**
   * 从缓存中获取音频文件地址
   */
  getCachedAudioFileUrl(key) {
    if (!this.audioCache.has(key)) {
      return null
    }
    
    const cachedData = this.audioCache.get(key)
    return cachedData.audioFileUrl || null
  }
  
  /**
   * 播放音频文件地址（使用audio元素）
   */
  async playAudioFileUrl(audioUrl) {
    return new Promise((resolve, reject) => {
      try {
        const audioElement = new Audio(audioUrl);
        
        // 添加iOS兼容性处理
        // 在iOS Safari中，需要添加额外的属性来确保音频可以播放
        audioElement.preload = 'auto';
        audioElement.playsInline = true; // iOS Safari需要这个属性
        audioElement.webkitPlaysInline = true; // 旧版iOS Safari兼容
        
        audioElement.oncanplaythrough = () => {
          audioElement.play().then(() => {
            resolve(audioElement);
          }).catch(err => {
            console.warn('音频播放失败，可能需要用户交互:', err);
            // 在iOS中，如果播放失败，可能是由于需要用户交互
            // 我们会等待用户交互后再尝试播放
            const tryPlayAfterUserInteraction = () => {
              audioElement.play().then(() => {
                resolve(audioElement);
              }).catch(reject);
              document.removeEventListener('touchstart', tryPlayAfterUserInteraction);
              document.removeEventListener('click', tryPlayAfterUserInteraction);
            };
            
            document.addEventListener('touchstart', tryPlayAfterUserInteraction, { once: true });
            document.addEventListener('click', tryPlayAfterUserInteraction, { once: true });
          });
        };
        
        audioElement.onerror = (err) => {
          console.error('音频播放错误:', err);
          reject(err);
        };
        
        // 播放结束时清理资源
        audioElement.onended = async () => {
          console.log('音频元素播放结束');
          stopAllNativeAudioElements()
        };
        
        // 如果音频已经可以播放，直接播放
        if (audioElement.readyState >= 3) {
          audioElement.play().then(() => {
            resolve(audioElement);
          }).catch(err => {
            console.warn('音频播放失败，可能需要用户交互:', err);
            // 在iOS中，如果播放失败，可能是由于需要用户交互
            const tryPlayAfterUserInteraction = () => {
              audioElement.play().then(() => {
                resolve(audioElement);
              }).catch(reject);
              document.removeEventListener('touchstart', tryPlayAfterUserInteraction);
              document.removeEventListener('click', tryPlayAfterUserInteraction);
            };
            
            document.addEventListener('touchstart', tryPlayAfterUserInteraction, { once: true });
            document.addEventListener('click', tryPlayAfterUserInteraction, { once: true });
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * 播放音频（简化版，用于与现有代码兼容）
   */
  async playAudio(audioUrl, onEndedCallback) {
    return new Promise((resolve, reject) => {
      try {
        // 停止当前正在播放的音频
        this.stopAudioElement();
        console.log('播放音频文件地址:', audioUrl);
        // 创建新的audio元素
        this.audioElement = new Audio(audioUrl);
        
        // 添加iOS兼容性处理
        // 在iOS Safari中，需要添加额外的属性来确保音频可以播放
        this.audioElement.preload = 'auto';
        this.audioElement.playsInline = true; // iOS Safari需要这个属性
        this.audioElement.webkitPlaysInline = true; // 旧版iOS Safari兼容
        
        // 添加用户交互解锁处理
        const unlockAudio = () => {
          // 在iOS Safari中，音频播放需要用户交互
          if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(err => {
              console.warn('音频上下文恢复失败:', err);
            });
          }
          // 移除事件监听器，避免重复触发
          document.removeEventListener('touchstart', unlockAudio);
          document.removeEventListener('click', unlockAudio);
        };
        
        // 添加用户交互事件监听器
        document.addEventListener('touchstart', unlockAudio, { once: true });
        document.addEventListener('click', unlockAudio, { once: true });
        
        this.audioElement.oncanplaythrough = () => {
          // 在iOS中，可能需要用户交互才能播放
          this.audioElement.play().then(() => {
            resolve(this.audioElement);
          }).catch(err => {
            console.warn('音频播放失败，可能需要用户交互:', err);
            // 在iOS中，如果播放失败，可能是由于需要用户交互
            // 我们会等待用户交互后再尝试播放
            const tryPlayAfterUserInteraction = () => {
              this.audioElement.play().then(() => {
                resolve(this.audioElement);
              }).catch(reject);
              document.removeEventListener('touchstart', tryPlayAfterUserInteraction);
              document.removeEventListener('click', tryPlayAfterUserInteraction);
            };
            
            document.addEventListener('touchstart', tryPlayAfterUserInteraction, { once: true });
            document.addEventListener('click', tryPlayAfterUserInteraction, { once: true });
          });
        };
        
        this.audioElement.onended = async () => {
          console.log('音频播放结束', onEndedCallback);
          
          // 播放结束后清理资源
          stopAllNativeAudioElements()
          
          if (onEndedCallback) {
            // 传递音频文件地址给回调函数
            onEndedCallback(audioUrl);
          }
        };
        
        this.audioElement.onerror = (err) => {
          console.error('音频播放错误:', err);
          reject(err);
        };
        
        // 如果音频已经可以播放，直接播放
        if (this.audioElement.readyState >= 3) {
          this.audioElement.play().then(() => {
            resolve(this.audioElement);
          }).catch(err => {
            console.warn('音频播放失败，可能需要用户交互:', err);
            // 在iOS中，如果播放失败，可能是由于需要用户交互
            const tryPlayAfterUserInteraction = () => {
              this.audioElement.play().then(() => {
                resolve(this.audioElement);
              }).catch(reject);
              document.removeEventListener('touchstart', tryPlayAfterUserInteraction);
              document.removeEventListener('click', tryPlayAfterUserInteraction);
            };
            
            document.addEventListener('touchstart', tryPlayAfterUserInteraction, { once: true });
            document.addEventListener('click', tryPlayAfterUserInteraction, { once: true });
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * 停止audio元素播放
   */
  stopAudioElement() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement = null;
      } catch (error) {
        console.error('停止audio元素失败:', error);
      }
    }
  }
  
  /**
   * 启用自动页面可见性处理
   */
  enableAutoPageVisibilityHandling() {
    const handleVisibilityChange = () => {
      this.setPageVisibility(!document.hidden);
    };
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 返回一个函数用于取消监听
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }
  
  /**
   * 设置页面可见性状态
   */
  setPageVisibility(visible) {
    this.pageVisible = visible;
    
    if (visible && this.shouldResumeOnVisible) {
      // 页面变为可见且应该恢复播放
      console.log('页面变为可见，恢复音频播放');
      // 不再自动恢复播放，因为用户可能不希望音频自动继续播放
      // 如果需要恢复播放，用户可以手动点击播放按钮
      this.shouldResumeOnVisible = false;
    } else if (!visible && this.isPlaying) {
      // 页面变为不可见且正在播放，直接停止播放而不是暂停
      console.log('页面变为不可见，停止音频播放');
      this.stop();
      this.shouldResumeOnVisible = false; // 不标记为应该恢复，因为是直接停止
    }
  }
  
  /**
   * 检查缓存是否存在
   */
  hasCachedAudio(key) {
    return this.audioCache.has(key)
  }
  
  /**
   * 删除指定的音频缓存
   */
  removeCachedAudio(key) {
    return this.audioCache.delete(key)
  }
  
  /**
   * 清理过期缓存（默认7天）
   */
  clearExpiredCache(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const now = Date.now()
    for (const [key, data] of this.audioCache.entries()) {
      if (now - data.timestamp > maxAge) {
        this.audioCache.delete(key)
      }
    }
  }
  
  /**
   * 清理所有缓存
   */
  clearAllCache() {
    this.audioCache.clear()
  }
  
  /**
   * 获取缓存大小
   */
  getCacheSize() {
    return this.audioCache.size
  }
  
  /**
   * 获取缓存键列表
   */
  getCacheKeys() {
    return Array.from(this.audioCache.keys())
  }
}

// 创建单例实例
const enhancedAudioPlayer = new EnhancedAudioPlayer()

// 导出播放函数
export async function playBase64Audio(base64Data) {
  return await enhancedAudioPlayer.playBase64PcmAudio(base64Data)
}

// 导出添加音频数据函数
export function addAudioData(base64Data) {
  return enhancedAudioPlayer.addAudioData(base64Data)
}

// 导出初始化函数
export async function initAudioPlayer() {
  return await enhancedAudioPlayer.init()
}

// 导出停止函数
export function stopAudio() {
  return enhancedAudioPlayer.stop()
}

// 导出仅停止播放函数
export function stopPlaybackOnly() {
  return enhancedAudioPlayer.stopPlaybackOnly()
}

// 导出停止播放但继续缓存函数
export function stopPlaybackButContinueCaching() {
  return enhancedAudioPlayer.stopPlaybackButContinueCaching()
}

// 导出恢复播放函数
export function resumePlaybackWithCachedData() {
  return enhancedAudioPlayer.resumePlaybackWithCachedData()
}

// 导出暂停函数
export function pauseAudio() {
  return enhancedAudioPlayer.pause()
}

// 导出仅暂停播放函数
export function pausePlaybackOnly() {
  return enhancedAudioPlayer.pausePlaybackOnly()
}

// 导出恢复函数
export function resumeAudio() {
  return enhancedAudioPlayer.resume()
}

// 导出缓存相关函数
export function cacheAudioData(key, base64Data) {
  return enhancedAudioPlayer.cacheAudioData(key, base64Data)
}

export function hasCachedAudio(key) {
  return enhancedAudioPlayer.hasCachedAudio(key)
}

export function removeCachedAudio(key) {
  return enhancedAudioPlayer.removeCachedAudio(key)
}

export function clearExpiredCache(maxAge) {
  return enhancedAudioPlayer.clearExpiredCache(maxAge)
}

export function clearAllCache() {
  return enhancedAudioPlayer.clearAllCache()
}

export function getCacheSize() {
  return enhancedAudioPlayer.getCacheSize()
}

export function getCacheKeys() {
  return enhancedAudioPlayer.getCacheKeys()
}

// 导出音频流结束标记函数
export function markStreamEnded(onEndedCallback = null) {
  return enhancedAudioPlayer.markStreamEnded(onEndedCallback)
}

// 导出完全停止函数
export function stopAudioCompletely() {
  return enhancedAudioPlayer.stopCompletely()
}

// 导出音量控制函数
export function setVolume(volume) {
  return enhancedAudioPlayer.setVolume(volume)
}

export function increaseVolume(increment) {
  return enhancedAudioPlayer.increaseVolume(increment)
}

export function decreaseVolume(decrement) {
  return enhancedAudioPlayer.decreaseVolume(decrement)
}

export function getVolume() {
  return enhancedAudioPlayer.getVolume()
}

export default enhancedAudioPlayer
