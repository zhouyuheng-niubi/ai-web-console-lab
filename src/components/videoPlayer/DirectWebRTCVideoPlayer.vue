<template>
  <div class="webrtc-player">
    <div class="relative w-full h-full">
      <video
        :id="videoId"
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="player-video"
      ></video>
      <!-- 为每个算法创建一个canvas元素 -->
      <canvas 
        v-for="(alg, index) in settingAlg" 
        :key="index" 
        class="canvas-shuju " 
        :id="'canvas_' + videoId + '_' + alg"
      ></canvas>
    </div>
    <div class="player-status" v-if="!isPlaying">
      {{ statusText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, PropType } from 'vue';
import CryptoJS from 'crypto-js';
const props = defineProps({
  data_stream: {
    type: String,
    required: true,
    default: 'http://10.0.0.1:1985/index/api/webrtc'
  },
  videoId: {
    type: String,
    required: true,
    default: '0'
  },
  serverIp: {
    type: String,
    default: '10.0.0.1'
  },
  websocket: {
    type: Number,
    default: 8083
  },
  mqttAuth: {
    type: Array,
    default: () => ['work', 'Bjhmdys@202010']
  },
  resultTopic: {
    type: String,
    default: 'ks/video_detection'
  },
  getSources: {
    type: String,
    default: ':9092/ks/source'
  },
  subscribe: {
    type: String,
    default: ':9092/stream/live/subscribe'
  },
  streamInfoTopic: {
    type: String,
    default: 'ks/stream_local'
  },
  media_http_api: {
    type: Number,
    default: 1985
  },
  accessKey: {
    type: String,
    default: '69156104eb712e27f7d43591'
  },
  accessSecret: {
    type: String,
    default: '4fd5a37e-5527-46ad-a34d-0709d72102bc'
  },
  token: {
    type: String,
    default: ''
  },
  getToken: {
    type: String,
    default: ':9092/ks/system/user/token'
  },
  getTime: {
    type: String,
    default: ':9092/ks/system/time'
  },
  cameraId: {
    type: String,
    default: ''
  },
  settingAlg: {
    type: Array as PropType<string[]>,
    default: () => ([])//配置算法
  },
});

// 全局配置
const ZQLGLOBAL = reactive({
  serverIp: props.serverIp,
  getSources: props.getSources,
  subscribe: props.subscribe,
  resultTopic: props.resultTopic,
  streamInfoTopic: props.streamInfoTopic,
  media_http_api: props.media_http_api,
  websocket: props.websocket,
  mqttAuth: props.mqttAuth,
  accessKey: props.accessKey,
  accessSecret: props.accessSecret,
  token: props.token,
  getToken: props.getToken,
  getTime: props.getTime,
});

// API请求模块
const ZQL_apis = {
  getSources: () => {
    return new Promise((resolve, reject) => {
      fetch(`http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.getSources}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ZQLGLOBAL.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
  
  subscribeLive: (source_id: string) => {
    return new Promise((resolve, reject) => {
      fetch(`http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.subscribe}?source_id=${source_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ZQLGLOBAL.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
  
  getToken: async () => {
    const ak = ZQLGLOBAL.accessKey;
    const sk = ZQLGLOBAL.accessSecret;
    const timestampRes: any = await ZQL_apis.getTimestamp();
    const timestamp = timestampRes.data;
    const nonce = ZQL_apis.generateRandomString(10);
    const signature = ZQL_apis.generateSignature(ak, sk, timestamp, nonce);
    
    return new Promise((resolve, reject) => {
      fetch(`http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.getToken}?signature=${signature}&ak=${ak}&timestamp=${timestamp}&nonce=${nonce}`)
        .then(response => response.json())
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
  
  getTimestamp: () => {
    return new Promise((resolve, reject) => {
      fetch(`http://${ZQLGLOBAL.serverIp}${ZQLGLOBAL.getTime}`)
        .then(response => response.json())
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
  
  generateSignature: (ak: string, sk: string, timestamp: string, nonce: string) => {
    // 使用crypto-js库生成HMAC-SHA256签名
    const message = `${ak}:${timestamp}:${nonce}`;
    // @ts-ignore
    const hash =  CryptoJS.HmacSHA256(message, sk);
    // @ts-ignore
    const signature = CryptoJS.enc.Hex.stringify(hash);
    return signature;
  },
  
  generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  }
}

// 视频状态管理
const videoState = reactive({
  id: '',
  loading: true,
  openWs: true,
  alg: null,
  algListShow: false,
  subscribeTimeout: null,
  refreshTimeInterval: null,
  refreshTime: null,
  replayTimer: null,
  playerState: "pending",
  detectInterval: null,
  quanping: false,
  srsrtc: null,
  stream: "",
  status: "",
  stream_code: "",
  canvas: null,
  canvasTimeout: null,
  actualWidth: 0,
  actualHeight: 0,
  oriWidth: 0,
  oriHeight: 0,
  startTime: 0,
  resizeObserver: null,
});

const isPlaying = ref(false);
const statusText = ref('加载中...');
const mqttClient: any = ref(null);

// 添加窗口大小变化处理函数
const handleResize = () => {
  console.log('window resize');
  // 窗口大小改变时，重新计算视频尺寸以适配容器
  requestAnimationFrame(() => {
    if (videoState.oriWidth && videoState.oriHeight) {
      setPosition();
    }
  });
};

const playVideo = (streamUrl?: string) => {
  const video = document.getElementById(`${props.videoId}`) as HTMLVideoElement;
  const streamUrlToUse = streamUrl || props.data_stream;
  // @ts-ignore
  const srsrtc = new window.ZLMRTCClient.Endpoint({
    element: video, // video 标签
    debug: false, // 是否打印日志
    zlmsdpUrl: streamUrlToUse, //流地址
    simulcast: false,
    useCamera: true,
    audioEnable: true,
    videoEnable: true,
    recvOnly: true,
    resolution: { w: 1280, h: 720 },
    usedatachannel: false,
    videoId: "", // 不填选择默认的:空字符串
    audioId: "", // 不填选择默认的：空字符串
  });

  srsrtc.on(
    // @ts-ignore
    window.ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED,
    (e: any) => {
      // offer anwser 交换失败
      console.log("offer anwser 交换失败: videoId=", props.videoId, e);
      if (e.code == -400 && e.msg == "stream not found") {
          destroyVideoByIndex();
          // 重新订阅逻辑
          console.log('重新订阅视频流');
      }
    }
  );

  // @ts-ignore
  srsrtc.on(window.ZLMRTCClient.Events.WEBRTC_ON_REMOTE_STREAMS, (e: any) => {
    //获取到了远端流，可以播放
    videoState.loading = false;
    videoState.playerState = "success";
    videoState.startTime = new Date().getTime();
    isPlaying.value = true;
    statusText.value = '';

    if (videoState.refreshTimeInterval) {
      clearInterval(videoState.refreshTimeInterval);
    }
    videoState.refreshTime = (Math.random() * 5 + 5) * 1000 * 6;
    const video = document.getElementById(`${props.videoId}`) as HTMLVideoElement;
    // 监听视频加载完成事件以获取准确的视频尺寸
    const handleVideoLoaded = () => {
      // 优先使用摄像头API获取的尺寸，更准确
      if (props.cameraId) {
        getCameraSize(props.cameraId);
      } else if (video && video.videoWidth && video.videoHeight) {
        // 如果没有cameraId，使用视频元素的实际尺寸
        setOrisize(video.videoWidth, video.videoHeight);
      } else if (videoState.oriWidth && videoState.oriHeight) {
        // 如果无法获取视频的实时尺寸，使用已知的原始尺寸
        setOrisize(videoState.oriWidth, videoState.oriHeight);
      }
      
      // 移除事件监听器
      video.removeEventListener('loadeddata', handleVideoLoaded);
      video.removeEventListener('canplay', handleVideoLoaded);
      
      // 添加视频容器尺寸变化监听
      const container = document.querySelector('.webrtc-player') as HTMLElement;
      if (container) {
        // 先断开之前的监听器（如果存在）
        if (videoState.resizeObserver) {
          videoState.resizeObserver.disconnect();
        }
        
        const resizeObserver = new ResizeObserver(() => {
          // 监听容器元素尺寸的变化，重新计算显示位置
          requestAnimationFrame(() => {
            // 当容器尺寸变化时，重新计算视频在容器中的位置
            if (videoState.oriWidth && videoState.oriHeight) {
              setOrisize(videoState.oriWidth, videoState.oriHeight);
            }
          });
        });
        resizeObserver.observe(container);
        
        // 将ResizeObserver实例存储到videoState中以便后续清理
        videoState.resizeObserver = resizeObserver;
      }
    };
    
    // 如果视频元素已经加载完成，直接设置尺寸
    if (video && video.videoWidth && video.videoHeight && (video.readyState === 4 || video.readyState === 3)) {
      handleVideoLoaded();
    } else {
      // 否则等待视频加载完成
      video.addEventListener('loadeddata', handleVideoLoaded);
      video.addEventListener('canplay', handleVideoLoaded);
    }
  });

  // @ts-ignore
  srsrtc.on(window.ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, (e: any) => {
    console.log("WEBRTC_ON_CONNECTION_STATE_CHANGE: videoId=", props.videoId, e);
    if (e == "failed") {
      console.log(
        `${props.videoId}已运行${
          (new Date().getTime() - videoState.startTime) / 1000
        }秒`
      );
      console.log(
        `---------------- 重新推流${props.videoId} -------------------------`
      );
      handleReplayVideo();
    }
    if (e == "disconnected") {
      console.log(
        `---------------- 重新播放${props.videoId} -------------------------`
      );
      handleRefresh();
    }
  });

  videoState.srsrtc = srsrtc;
};

// 处理视频重播
const handleReplayVideo = () => {
  if (videoState.replayTimer) {
    clearTimeout(videoState.replayTimer);
  }
  videoState.replayTimer = setTimeout(() => {
    handleRefresh();
  }, 3000);
};

// 处理视频刷新
const handleRefresh = () => {
  if (!videoState) {
    return;
  }
  if (videoState.status == "离线") {
    destroyVideoByIndex();
    // 重新订阅
    if (props.cameraId) {
      subscribeLive(props.cameraId);
    }
  } else {
    if (!videoState.stream) {
      return;
    }
    const video = document.getElementById(`${props.videoId}`) as HTMLVideoElement;
    if (video) {
      video.srcObject = null;
    }
    if (videoState && videoState.replayTimer) {
      clearTimeout(videoState.replayTimer);
      videoState.replayTimer = null;
    }
    if (videoState && videoState.srsrtc) {
      // @ts-ignore
      videoState.srsrtc.close();
    }
    videoState.srsrtc = null;
    videoState.status = "";
    // 重新播放
    if (videoState.stream) {
      const data_stream = videoState.stream.replace('127.0.0.1', props.serverIp);
      playVideo(data_stream);
    }
  }
};

// 销毁视频
const destroyVideoByIndex = () => {
  clearCanvas();
  if (videoState) {
    if (videoState && videoState.subscribeTimeout) {
      clearTimeout(videoState.subscribeTimeout);
      videoState.subscribeTimeout = null;
    }
    if (videoState && videoState.replayTimer) {
      clearTimeout(videoState.replayTimer);
      videoState.replayTimer = null;
    }
    if (videoState.refreshTimeInterval) {
      clearInterval(videoState.refreshTimeInterval);
      videoState.refreshTimeInterval = null;
    }
    const video = document.getElementById(`${props.videoId}`) as HTMLVideoElement;
    if (video) {
      video.srcObject = null;
    }
    if (videoState.srsrtc) {
      // @ts-ignore
      videoState.srsrtc.close();
    }
    
    // 清理ResizeObserver
    if (videoState.resizeObserver) {
      videoState.resizeObserver.disconnect();
      videoState.resizeObserver = null;
    }
    
    clearCanvas();
    // videoState = null; // 不能将reactive对象设置为null
  }
};

// 清空画布
const clearCanvas = () => {
  // 清空所有canvas
  for (let i = 0; i < props.settingAlg.length; i++) {
    const alg = props.settingAlg[i];
    const canvas = document.getElementById(`canvas_${props.videoId}_${alg}`) as HTMLCanvasElement;
    if (canvas && canvas.getContext("2d")) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }
};

// 设置位置
const setPosition = () => {
  const container = document.querySelector('.webrtc-player') as HTMLElement;
  const video = document.getElementById(`${props.videoId}`) as HTMLVideoElement;
  
  if (!video || !container) return;
  
  // 获取容器的实际尺寸
  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;
  
  // 获取视频原始宽高比
  const aspectRatio = videoState.oriWidth / videoState.oriHeight;
  
  // 计算视频适应容器的尺寸
  let width, height;
  if (containerWidth / containerHeight > aspectRatio) {
    // 容器宽高比大于视频宽高比，以高度为准
    height = containerHeight;
    width = height * aspectRatio;
  } else {
    // 容器宽高比小于视频宽高比，以宽度为准
    width = containerWidth;
    height = width / aspectRatio;
  }
  
  // 更新实际宽高
  videoState.actualWidth = width;
  videoState.actualHeight = height;
  
  // 设置视频的尺寸和位置
  video.style.position = "absolute";
  video.style.width = width + "px";
  video.style.height = height + "px";
  
  // 计算居中位置
  const videoLeft = (containerWidth - width) / 2;
  const videoTop = (containerHeight - height) / 2;
  
  // 应用位置
  video.style.left = Math.floor(videoLeft) + "px";
  video.style.top = Math.floor(videoTop) + "px";
  
  // 设置所有canvas的尺寸和位置
  for (let i = 0; i < props.settingAlg.length; i++) {
    const alg = props.settingAlg[i];
    const canvas = document.getElementById(`canvas_${props.videoId}_${alg}`) as HTMLCanvasElement;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.position = "absolute";
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      
      // 应用相同的位置
      canvas.style.left = Math.floor(videoLeft) + "px";
      canvas.style.top = Math.floor(videoTop) + "px";
    }
  }
};

// 设置原始尺寸
const setOrisize = (width: number, height: number) => {
  const container = document.querySelector('.webrtc-player') as HTMLElement;
  if (!container) {
    return;
  }
    
  const oriWidth = width;
  const oriHeight = height;
  videoState.oriWidth = oriWidth;
  videoState.oriHeight = oriHeight;

  // 调用setPosition来适配容器尺寸
  setPosition();
};

// 检测结果可视化相关函数
const setAlarms = (data: any) => {
  if (
    !videoState ||
    !videoState.actualWidth ||
    !videoState.actualHeight ||
    !videoState.oriWidth ||
    !videoState.oriHeight
  ) {
    return;
  }

  const algName = getAlgName(data);
  // 和当前的canvas进行比较，如果存在清除之前画布
  const canvasold = document.getElementById(`canvas_${props.videoId}_${algName}`) as HTMLCanvasElement;
  if (canvasold) {
    canvasold.width = videoState.actualWidth;
    canvasold.height = videoState.actualHeight;
    const context = canvasold.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvasold.width, canvasold.height);
    }
  }

  const canvas = document.getElementById(`canvas_${props.videoId}_${algName}`) as HTMLCanvasElement;
  if (!canvas) {
    console.warn(`Canvas with id canvas_${props.videoId}_${algName} not found`);
    return;
  }
  
  const context = canvas.getContext("2d");
  if (!context) {
    console.warn(`Canvas context not available for canvas_${props.videoId}_${algName}`);
    return;
  }
  
  // 重新计算canvas的缩放比例，确保绘制内容与视频贴合
  const canvasScaleX = canvas.width / videoState.oriWidth;
  const canvasScaleY = canvas.height / videoState.oriHeight;
  
  const bbox = data.reserved_data.bbox;
  if (Object.values(bbox.polygons).length > 0) {
    Object.values(bbox.polygons).forEach((item: any) => {
      const color = JSON.parse(JSON.stringify(item.color)).reverse();
      const points = item.polygon.map((point: number[]) => {
        const x = point[0] !== undefined ? point[0] : 0;
        const y = point[1] !== undefined ? point[1] : 0;
        return [
          Math.round(x * canvasScaleX),
          Math.round(y * canvasScaleY),
        ] as [number, number];
      });
      
      context.font = "20px Arial bolder";
      context.fillStyle = "transparent";
      context.strokeStyle = "rgb(" + color.join(",") + ")";
      context.lineWidth = 2;
      drawPolygons(points, context);
      drawPolygonInfo(context, Object.values(bbox.polygons), canvasScaleX, canvasScaleY);
    });
  }

  if (bbox.rectangles.length > 0) {
    bbox.rectangles.forEach((item: any, i: number) => {
      const color = JSON.parse(JSON.stringify(item.color)).reverse();
      const coordinates = {
        x: Math.round(item.xyxy[0] * canvasScaleX),
        y: Math.round(item.xyxy[1] * canvasScaleY),
        x1: Math.round(item.xyxy[2] * canvasScaleX),
        y1: Math.round(item.xyxy[3] * canvasScaleY),
      };
      
      context.font = "20px Arial bolder";
      context.fillStyle = "rgb(" + color.join(",") + ")";
      context.fillText(item.label || "", coordinates.x, coordinates.y - 10);
      context.strokeStyle = "rgb(" + color.join(",") + ")";
      context.lineWidth = 2;
      
      let lines = [];
      let lineWidth = (coordinates.x1 - coordinates.x) / 4;
      let lineHeight = (coordinates.y1 - coordinates.y) / 4;
      lines[0] = {
        x: coordinates.x,
        y: coordinates.y,
        x1: coordinates.x + lineWidth,
        y1: coordinates.y,
      };
      lines[1] = {
        x: coordinates.x,
        y: coordinates.y,
        x1: coordinates.x,
        y1: coordinates.y + lineHeight,
      };
      lines[2] = {
        x: coordinates.x1,
        y: coordinates.y,
        x1: coordinates.x1 - lineWidth,
        y1: coordinates.y,
      };
      lines[3] = {
        x: coordinates.x1,
        y: coordinates.y,
        x1: coordinates.x1,
        y1: coordinates.y + lineHeight,
      };
      lines[4] = {
        x: coordinates.x,
        y: coordinates.y1,
        x1: coordinates.x + lineWidth,
        y1: coordinates.y1,
      };
      lines[5] = {
        x: coordinates.x,
        y: coordinates.y1,
        x1: coordinates.x,
        y1: coordinates.y1 - lineHeight,
      };
      lines[6] = {
        x: coordinates.x1,
        y: coordinates.y1,
        x1: coordinates.x1 - lineWidth,
        y1: coordinates.y1,
      };
      lines[7] = {
        x: coordinates.x1,
        y: coordinates.y1,
        x1: coordinates.x1,
        y1: coordinates.y1 - lineHeight,
      };
      lines.forEach((lineItem) => {
        drawLine(context, lineItem);
      });
    });
  }

  if (Object.values(bbox.lines).length > 0) {
    Object.values(bbox.lines).forEach((item: any, i: number) => {
      const color = JSON.parse(JSON.stringify(item.color)).reverse();
      const coordinates = {
        x: Math.round(item.line[0][0] * canvasScaleX),
        y: Math.round(item.line[0][1] * canvasScaleY),
        x1: Math.round(item.line[1][0] * canvasScaleX),
        y1: Math.round(item.line[1][1] * canvasScaleY),
      };
      
      context.font = "20px Arial bolder";
      context.fillStyle = "rgb(" + color.join(",") + ")";
      if (item.ext.direction) {
        context.fillText(item.name, (coordinates.x + coordinates.x1) / 2, (coordinates.y + coordinates.y1) / 2 + 20);
      }

      context.strokeStyle = "rgb(" + color.join(",") + ")";
      context.lineWidth = 2;
      drawLine(context, coordinates);
      drawCountingInfo(context, Object.values(bbox.lines));
    });
  }
};

// 获取算法名称
const getAlgName = (data: any) => {
  // 如果数据包含算法信息，返回算法名称
  if (data && data.alg) {
    return data.alg.name || data.alg;
  }
  
  // 如果无法确定具体算法，返回第一个算法
  return props.settingAlg.length > 0 ? props.settingAlg[0] : 'default';
};

// 根据数据和算法配置确定canvas索引
const determineCanvasIndex = (data: any, settingAlg: any[]) => {
  // 如果数据包含算法信息，可以根据算法名称或类型来确定canvas索引
  if (data && data.alg) {
    const algName = data.alg.name || data.alg;
    const algIndex = settingAlg.findIndex((alg: any) => {
      // 根据实际算法数据结构进行匹配
      return alg.name === algName || alg === algName;
    });
    
    if (algIndex !== -1) {
      return algIndex;
    }
  }
  
  // 如果无法确定具体算法，返回第一个canvas（索引0）
  return 0;
};

const drawPolygons = (points: [number, number][], context: CanvasRenderingContext2D) => {
  if (points.length === 0) return;
  
  const firstPoint = points[0];
  if (!firstPoint || firstPoint.length < 2) return;
  
  context.beginPath();
  context.moveTo(firstPoint[0], firstPoint[1]);

  for (var i = 1; i < points.length; i++) {
    const point = points[i];
    if (point && point.length >= 2) {
      context.lineTo(point[0], point[1]);
    }
  }
  context.closePath();
  context.fill();
  context.stroke();
};

const drawLine = (ctx: CanvasRenderingContext2D, line: any) => {
  ctx.beginPath();
  ctx.moveTo(line.x, line.y);
  ctx.lineTo(line.x1, line.y1);
  ctx.stroke();
};

const drawCountingInfo = (context: CanvasRenderingContext2D, lines: any[]) => {
  lines.forEach((item, index) => {
    context.fillStyle = "rgb(255,0,0)";
    if (item.ext.direction.length == 2) {
      context.fillText(`[${item.name}] ${item.ext.action.count}: ${item.ext.result.count}`, 0, 20 * index + 20);
    } else {
      context.fillText(`[${item.name}] ${item.ext.action.increase}: ${item.ext.result.increase},${item.ext.action.decrease}: ${item.ext.result.decrease},${item.ext.action.delta}: ${item.ext.result.delta}`, 0, 20 * index + 20);
    }
  });
};

const drawPolygonInfo = (context: CanvasRenderingContext2D, polygons: any[], canvasScaleX: number, canvasScaleY: number) => {
  polygons.forEach((item, index) => {
    context.fillStyle =
      "rgb(" +
      JSON.parse(JSON.stringify(item.color)).reverse().join(",") +
      ")";
    let leftPoint = item.polygon[0];
    for (let i = 1; i < item.polygon.length; i++) {
      if (item.polygon[i][0] < leftPoint[0]) {
        leftPoint = item.polygon[i];
      }
    }
    context.fillText(
      `${item.name}`,
      leftPoint[0] * canvasScaleX,
      leftPoint[1] * canvasScaleY + 20
    );
    if (item.ext.result) {
      context.fillStyle = "rgb(255,0,0)";
      context.fillText(`${item.name}: ${item.ext.result}`, 0, 20 * index + 20);
    }
  });
};

// 订阅直播流
const subscribeLive = async (cameraId: string) => {
  // 确保token已获取
  if (!ZQLGLOBAL.token) {
    try {
      const res: any = await ZQL_apis.getToken();
      if (res.error_code == 0) {
        ZQLGLOBAL.token = res.data;
      }
    } catch (error) {
      console.error('获取token失败:', error);
      return; // 如果获取token失败，则不继续执行订阅
    }
  }
  
  getCameraSize(cameraId);
  try {
    const data: any = await ZQL_apis.subscribeLive(cameraId);
    const stream = data.data;
    if (data && stream) {
      videoState.stream = stream;
      // 更新播放链接
      const data_stream = stream.replace('127.0.0.1', props.serverIp);
      // 重新播放视频
      playVideo(data_stream);
    } else {
      console.log('订阅失败');
    }
  } catch (err) {
    console.log('订阅错误:', err);
  }
};

// 获取摄像头尺寸
const getCameraSize = (id: string) => {
  // 这里需要根据实际的摄像头数据结构来获取尺寸
  ZQL_apis.getSources().then((res: any) => {
    const sources = res.data;
    const camera = sources.find((source: any) => source.id === id);
    if (camera && camera.stream && camera.stream.image_size && camera.stream.image_size.draw) {
      // 优先使用摄像头API提供的draw尺寸
      setOrisize(
        camera.stream.image_size.draw[0],
        camera.stream.image_size.draw[1]
      );
    } else if (camera && camera.stream && camera.stream.image_size && camera.stream.image_size.original) {
      // 如果没有draw尺寸，尝试使用original尺寸
      setOrisize(
        camera.stream.image_size.original[0],
        camera.stream.image_size.original[1]
      );
    } else {
      // 最后尝试使用视频元素的实际尺寸
      const video = document.getElementById(`${props.videoId}`) as HTMLVideoElement;
      if (video && video.videoWidth && video.videoHeight) {
        setOrisize(video.videoWidth, video.videoHeight);
      }
    }
  }).catch(err => {
    console.error('获取摄像头信息失败:', err);
    // 出错时尝试使用视频元素的实际尺寸
    const video = document.getElementById(`${props.videoId}`) as HTMLVideoElement;
    if (video && video.videoWidth && video.videoHeight) {
      setOrisize(video.videoWidth, video.videoHeight);
    }
  });
};

// 获取视频源列表
const getSources = async () => {
  try {
    const res: any = await ZQL_apis.getSources();
    return res.data;
  } catch (error) {
    console.error('获取视频源失败:', error);
    return [];
  }
};

// MQTT连接管理
const connectMqtt = () => {
  // @ts-ignore
  mqttClient.value = window.mqtt.connect(`ws://${props.serverIp}:${props.websocket}/mqtt`, {
    username: props.mqttAuth[0],
    password: props.mqttAuth[1],
  });
  
  mqttClient.value.subscribe(
    props.resultTopic,
    { qos: 0 },
    (error: any) => {
      if (error) {
        console.log('subscribe error:', error);
        return;
      }
    }
  );
  
  mqttClient.value.on('message', (topic: string, payload: any) => {
    const msg = JSON.parse(payload.toString());
    // console.log('mqtt message:', msg);
    if (msg.msg_type == 'video_detection') {
      // 检查是否是当前视频的检测结果
      const sourceId = msg.data.source.id;
      // 算法相关 name type display_name
      const algorithm = msg.data.alg;

      if (sourceId === props.cameraId) {
        setAlarms(msg.data);
        // 清除之前的超时定时器
        if (videoState && videoState.canvasTimeout) {
          clearTimeout(videoState.canvasTimeout);
        }
        // 设置新的超时定时器，在一段时间后清除画布
        videoState.canvasTimeout = setTimeout(() => {
          clearCanvas();
        }, 1000);
      }
    }
  });
};

onMounted(async () => {
  // 初始化MQTT连接
  connectMqtt();
  
  // 初始化token
  try {
    const res: any = await ZQL_apis.getToken();
    if (res.error_code == 0) {
      ZQLGLOBAL.token = res.data;
    }
  } catch (error) {
    console.error('获取token失败:', error);
  }
  
  // 如果提供了cameraId，则订阅直播流
  if (props.cameraId) {
    // 确保token已获取后再订阅
    subscribeLive(props.cameraId);
  } else {
    // 初始化播放
    playVideo(props.data_stream);
  }
  
  // 添加窗口大小变化监听器
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 标记组件已销毁,防止异步操作
  videoState.loading = false;
  videoState.playerState = "destroyed";
  
  // 清理资源
  if (videoState.srsrtc) {
    try {
      // @ts-ignore
      videoState.srsrtc.close();
    } catch (e) {
      console.warn('关闭 WebRTC 连接时出错:', e);
    }
  }
  
  if (mqttClient.value) {
    try {
      mqttClient.value.end();
    } catch (e) {
      console.warn('关闭 MQTT 连接时出错:', e);
    }
  }
  
  if (videoState.replayTimer) {
    clearTimeout(videoState.replayTimer);
    videoState.replayTimer = null;
  }
  
  if (videoState.refreshTimeInterval) {
    clearInterval(videoState.refreshTimeInterval);
    videoState.refreshTimeInterval = null;
  }
  
  // 清理canvas超时定时器
  if (videoState.canvasTimeout) {
    clearTimeout(videoState.canvasTimeout);
    videoState.canvasTimeout = null;
  }
  
  // 清理ResizeObserver
  if (videoState.resizeObserver) {
    try {
      videoState.resizeObserver.disconnect();
      videoState.resizeObserver = null;
    } catch (e) {
      console.warn('断开 ResizeObserver 时出错:', e);
    }
  }
  
  // 清理订阅超时
  if (videoState.subscribeTimeout) {
    clearTimeout(videoState.subscribeTimeout);
    videoState.subscribeTimeout = null;
  }
  
  // 移除窗口大小变化监听器
  try {
    window.removeEventListener('resize', handleResize);
  } catch (e) {
    console.warn('移除 resize 监听器时出错:', e);
  }
  
  // 清空视频元素
  const video = document.getElementById(`${props.videoId}`) as HTMLVideoElement;
  if (video) {
    try {
      video.srcObject = null;
    } catch (e) {
      console.warn('清空视频元素时出错:', e);
    }
  }
  
  // 清空所有 canvas
  clearCanvas();
  
  console.log('DirectWebRTCVideoPlayer 组件已卸载并清理完成');
});
</script>

<style scoped>
.webrtc-player {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.player-video {
  position: absolute;
  object-fit: contain;
}

.player-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.canvas-shuju {
  /* background-color: rgba(106, 184, 252, 0.199); */
  z-index: 10;
  pointer-events: none;
}

.player-status {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 14px;
}
</style>