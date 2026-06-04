<template>
  <div class="danger-invest-container relative p-[16px] flex flex-col
   h-full box-border overflow-hidden w-full" style="font-family: Source Han Sans CN;">
    <!-- <div class="absolute top-[20px] left-[5%] cursor-pointer" @click="backFn">
      <ArrowLeftOutlined style="font-size: 24px;color:#666" class="back-icon" />
    </div> -->
    <!-- <div>
      <div class="font-bold text-[22px] text-[#454F64] leading-1">AI隐患排查</div>
      <div class="font-[400] text-[14px] text-[#717B92] leading-1 mb-[30px]">精准识别，让隐患无所遁形</div>
    </div> -->
    <div class="w-full flex-1 flex box-border pb-[50px] min-h-0">
      <!-- 左侧上传区域 - 固定高度，不滚动 -->
      <div style="flex:0.3" class="bg-[#fff] rounded-[12px] list-card upload-card
      box-border p-[26px] relative h-full flex flex-col">
        <div class="flex-shrink-0">
          <div class="mb-[25px]">
            <div class="font-[500] text-[18px] text-[#576075] leading-none">上传隐患图片或视频</div>
            <div class="font-[400] text-[12px] leading-1 text-[#717B92] mt-[14px] leading-none">
              支持JPG、PNG、BMP、TIFF、WEBP、MP4格式，单文件最大10MB</div>
          </div>

          <UploadDragger class="mt-[20px]" v-model:fileList="fileList" name="file" :multiple="true"
            @change="handleChange" accept="image/*,video/*" :before-upload="beforeUpload" listType="picture-card"
            :maxCount="3" :disabled="spinning">
            <p class="ant-upload-drag-icon">
              <PlusOutlined style="color: #4362EF;"></PlusOutlined>
            </p>
            <p class="text-[16px] text-[#717B92]">点击或拖拽到此区域上传</p>
            <template #itemRender="{ file, actions }">
              <div class="flex items-center justify-between mt-2 
                  border-[1px] border-[#d9d9d9] rounded-[8px] p-[8px]">
                <div class="flex-1 flex items-center">
                  <Image :src="getFilePreviewUrl(file) || 'https://www.antdv.com/#error'" v-if="isImageFile(file)"
                    :width="40" :height="40" />
                  <img v-else-if="isVideoFile(file)" :src="getVideoThumbnail(file) || 'https://www.antdv.com/#error'"
                    @click="showVideoModal(file)" style="width: 40px; height: 40px; object-fit: cover; cursor: pointer;"
                    alt="视频封面" @load="handleThumbnailLoad(file)" />
                  <div class="ml-1 text-[#525252] text-[14px] cursor-pointer" @click="previewFile(file)">{{ file.name }}
                  </div>
                </div>
                <div class="flex items-center cursor-pointer">
                  <Button size="small" type="text" :disabled="spinning" @click="removeFile(file)">
                    <DeleteOutlined style="font-size: 18px;color:#666" />
                  </Button>
                </div>
              </div>
            </template>
          </UploadDragger>
        </div>

        <div class="mt-[20px] flex-1 min-h-0">
          <div class="font-[500] text-[18px] text-[#576075] mb-[14px]">
            附加描述
          </div>
          <Textarea v-model:value="text" placeholder="请提供排查相关信息，例如：
          需排查的隐患类型（如电气、消防、设备安全等）
          具体排查场景 / 对象（如车间、办公楼、施工机械等）
          您的核心排查需求（如合规检查、风险预判、问题整改等）" :disabled="spinning" :maxlength="200" :rows="5" class="h-full" />
        </div>

        <div class="mt-[20px] w-full flex justify-center">
          <Button type="primary" style="background-color: #4362EF;" @click="customRequest" v-if="!spinning">{{
            reportValue ?
              '重新识别' : '识别分析' }}</Button>
          <Button type="primary" style="background-color: #4362EF;" v-if="spinning" @click="cancelRequest">停止识别</Button>
        </div>
      </div>

      <!-- 右侧结果区域 - 可滚动 -->
      <div style="flex:0.7" class="text-[16px] text-[#333] h-full flex flex-col result-card
      ml-[30px] bg-[#fff] rounded-[12px] list-card px-[30px] box-border">
        <div class="flex-shrink-0 h-[68px] flex items-center justify-between border-b-[1px] border-[#E6E6E6]">
          <div class="flex items-end ">
            <span class="leading-none font-[500] text-[18px] text-[#576075]">隐患识别结果</span>
            <span class="leading-none font-[400] text-[12px] text-[#717B92] ml-[8px]">AI智能识别出以下隐患，仅供参考</span>
          </div>
          <div class="font-[400] text-[14px] text-[#717B92] leading-none">共识别出 <span class="text-[#4362EF] font-bold">{{
            reportValue?.length }}</span> 条隐患</div>
        </div>
        <div class="flex justify-end">
          <Button type="link" @click="exportText" v-if="reportValue">导出文本</Button>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto">
          <Spin size="large" :spinning="spinning" tip="智能识别中...">
            <div v-if="reportValue">
              <div v-for="item, index in reportValue" :key="index"
                class="mb-[30px] text-[14px] text-[#454F64] bg-[#F9FAFB] rounded-[15px] ">
                <div class="h-[38px] border-b-[1px] border-[#E6E6E6] flex items-center pl-[15px] font-[500]"
                  style="font-family: Arial;">{{ index + 1 < 10 ? '0' + (index + 1) : index + 1 }}:</div>
                    <div class="px-[15px] py-[20px]">
                      <div class="green-color-title mb-[4px]"><span
                          class="text-[#788897] font-[500] text-[14px]">文件名称：</span>{{ item.fileName }}</div>
                      <div class="red-color-title mb-[4px]">
                        <span class="text-[#788897] font-[500] text-[14px]">隐患等级：</span>
                        <span v-if="item.hazardLevel === '重大隐患'"
                          class="text-[#DD5A4C] font-[500] text-[14px] bg-[#FDEFED] rounded-[27px] px-[8px] py-[2px] leading-1 ::before-none">{{
                            item.hazardLevel }}</span>
                        <span v-else
                          class="text-[#8B5A2B] bg-[#FFF9E6] rounded-[27px] px-[8px] py-[2px] font-[500] text-[14px] leading-1">
                          {{ item.hazardLevel }}
                        </span>
                      </div>
                      <div class="red-color-title mb-[4px]"><span
                          class="text-[#788897] font-[500] text-[14px]">隐患类型：</span>{{
                            item.hazardType }}</div>
                      <div class="red-color-title mb-[4px]"><span
                          class="text-[#788897] font-[500] text-[14px]">隐患描述：</span>{{
                            item.hazardDesc }}</div>
                      <div class="blue-color-title mb-[4px]"><span
                          class="text-[#788897] font-[500] text-[14px]">判断依据：</span>{{ item.basisRule }}</div>
                      <div class="green-color-title mb-[4px]"><span
                          class="font-[500] text-[14px] text-[#788897]">整改建议</span>：{{ item.rectifySuggestion }}</div>
                    </div>

                </div>
              </div>
              <img src="@/assets/empty-state.png" class="w-[280px] block mx-auto mt-[12%]" v-else />
          </Spin>
        </div>
      </div>
    </div>
    <!-- 视频播放弹窗 -->
    <Modal v-model:open="videoModalVisible" title="视频预览" width="800px" :footer="null" @cancel="closeVideoModal">
      <video ref="videoPlayer" controls autoplay style="width: 100%; max-height: 500px;" :src="currentVideoUrl">
        您的浏览器不支持视频播放。
      </video>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { PlusOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { message, UploadDragger, Button, Image, Modal, Spin, Textarea } from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
const text = ref('');
const maxSize = 10
const fileList = ref([]);
const videoModalVisible = ref(false);
const currentVideoUrl = ref('');
const videoPlayer = ref();
const handleChange = (info: UploadChangeParam) => {
  info.file.status = 'done'
};

// 删除文件
const removeFile = (file: UploadProps['fileList'][number]) => {
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
};

// 大小校验
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPngOrVideo = file.type.startsWith('image/') || file.type.startsWith('video/')
  if (!isJpgOrPngOrVideo) {
    message.error('请上传图片或视频文件');
  }
  const isLt10M = file.size / 1024 / 1024 < maxSize;
  if (!isLt10M) {
    message.error(`文件大小不超过${maxSize}M`);
    fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
  }
  return false;
};
// 上传识别分析操作
const customRequest = () => {
  if (fileList.value.length === 0) {
    message.warning('请先上传文件');
    return;
  }
  const formData:any = new FormData(); 
  fileList.value.map(item=>{
    formData.append('files',item.originFileObj)
  })
  formData.append('description',text.value)
  getData(formData)
}
const cancelRequest = async () => {
  controller?.abort();
  isFetching.value = false;
  spinning.value = false;
  isfail.value = false;
}

// 请求结果
const spinning = ref(false);
const isfail = ref(false);
const isFetching = ref(false); // 请求锁
const reportValue = ref<any>(''); // 用于存储报告内容
let controller: any = null; // 存储 AbortController
const getData = async (formData: any) => {
  if (isFetching.value) return;
  spinning.value = true;
  controller = new AbortController();
  const options = {
    method: 'POST',
    body: formData,
    signal: controller?.signal, // 添加终止信号
  };
  // 发送请求
  try {
    const response = await fetch(`${import.meta.env.VITE_NEWAI_API}/hazard/detect`, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorText}`,
      );
    }
    const data = await response.json();
    function groupByFileName(hazards) {
      const grouped = {};
      hazards.forEach(hazard => {
        const fileName = hazard.fileName;
        if (!grouped[fileName]) {
          grouped[fileName] = [];
        }
        grouped[fileName].push(hazard);
      });
      // 将对象转换为数组，便于按文件名顺序展示（若需保留原顺序，可先收集所有文件名再遍历）
      let data = []
      Object.entries(grouped).map(([fileName, items]) => ({ fileName, hazards: items })).forEach(item => {
        data.push(...item.hazards)
      })
      return data;
    }

    reportValue.value = groupByFileName(JSON.parse(JSON.stringify(data.data)));
    isFetching.value = false;
    isfail.value = false;
    spinning.value = false;


  } catch (error) {
    spinning.value = false;
    isfail.value = true;
    isFetching.value = false;
    console.error('请求失败', error);
  }
}

// 导出文本
const exportText = () => {
  if (!reportValue.value) return
  // 构造完整的HTML结构
  let autoText = ''
  autoText += `<h1>AI隐患排查报告</h1>`
  reportValue.value.forEach((item, index) => {
    autoText += `<p>文件名称：${item.fileName}</p>`
    autoText += `<p>隐患等级：${item.hazardLevel}</p>`
    autoText += `<p>隐患类型：${item.hazardType}</p>`
    autoText += `<p>隐患描述：${item.hazardDesc}</p>`
    autoText += `<p>判断依据：${item.basisRule}</p>`
    autoText += `<p>整改建议：${item.rectifySuggestion}</p>`
    autoText += `<p></p>`
  });
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
       <head>
          <meta charset="UTF-8">
          <title>AI隐患排查报告</title>
          <style>
              body {
                  font-family: "仿宋_GB2312", "FangSong_GB2312", serif;
                  font-size: 16pt;
              }
              h1 {
                  font-family: "黑体", "SimHei", sans-serif;
                  font-size: 16pt;
                  font-weight: bold;
                  text-align: center;
                  line-height: 40px;
                  margin-bottom: 20px;
              }
              h2 {
                  font-family: "黑体", "SimHei", sans-serif;
                  font-size: 16pt;
                  font-weight: bold;
                  text-align: left;
                  line-height: 40px;
                  margin-bottom: 20px;
                  margin-top: 30px;
              }
              p {
                  font-family: "仿宋_GB2312", "FangSong_GB2312", serif;
                  font-size: 16pt;
                  text-align: justify;
                  text-justify: inter-ideograph;
                  text-indent: 2em;
                  line-height: 40px;
                  margin: 10px 0;
              }
          </style>
      </head>
      <body>
        ${autoText}
      </body>
    </html>
  `;

  // 转换为Word文档并下载
  asBlob(html).then((res) => {
    saveAs(
      res,
      `${'AI隐患识别与记录'}${dayjs().format('YYYY-MM-DD HH:mm:ss')}.docx`,
    );
  });
}




// 返回
// 判断是否为图片文件
const isImageFile = (file: any) => {
  return file.type.startsWith('image/')
};

// 判断是否为视频文件
const isVideoFile = (file: any) => {
  return file.type.startsWith('video/')
};

// 获取文件预览URL
const getFilePreviewUrl = (file: any) => {
  if (file.url) {
    return file.url; // 如果已经有URL，直接返回
  }

  if (file.originFileObj) {
    return URL.createObjectURL(file.originFileObj); // 创建本地文件预览URL
  }

  return '';
};

// 获取视频封面图（使用第一帧）
const getVideoThumbnail = (file: any) => {
  if (file.thumbnail) {
    return file.thumbnail;
  }

  const videoUrl = getFilePreviewUrl(file);
  if (!videoUrl) return '';

  // 创建视频元素来捕获第一帧
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.crossOrigin = 'anonymous';
    video.muted = true;

    video.addEventListener('loadeddata', () => {
      // 跳转到第一帧
      video.currentTime = 0.1;
    });

    video.addEventListener('seeked', () => {
      // 创建canvas来绘制视频帧
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg');
        file.thumbnail = thumbnailUrl;
        resolve(thumbnailUrl);
      } else {
        resolve('');
      }
      video.src = '';
    });

    video.addEventListener('error', () => {
      resolve('');
    });
  });
};

// 显示视频弹窗
const showVideoModal = (file: any) => {
  currentVideoUrl.value = getFilePreviewUrl(file);
  videoModalVisible.value = true;
};

// 处理缩略图加载
const handleThumbnailLoad = async (file: any) => {
  if (!file.thumbnail && isVideoFile(file)) {
    try {
      // 异步生成缩略图
      const thumbnail = await getVideoThumbnail(file);
      file.thumbnail = thumbnail;
    } catch (error) {
      console.error('生成缩略图失败:', error);
    }
  }
};

// 文件预览功能
const previewFile = (file: any) => {
  const fileUrl = getFilePreviewUrl(file);
  if (!fileUrl) return;

  if (isVideoFile(file)) {
    // 视频预览
    showVideoModal(file);
  }

};

// 关闭视频弹窗
const closeVideoModal = () => {
  videoModalVisible.value = false;
  currentVideoUrl.value = '';
  if (videoPlayer.value) {
    videoPlayer.value.pause();
    videoPlayer.value.currentTime = 0;
  }
};

const router = useRouter()
const backFn = () => {
  router.go(-1)
}
</script>
<style scoped lang="scss">
.back-icon {
  &:hover {
    color: var(--tr-suggestion-primary-color) !important;
  }
}

.result-title {
  display: flex;
  align-items: center;
  line-height: 1;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 16px;
    border-radius: 2px;
    background-color: var(--tr-suggestion-primary-color);
    margin-right: 4px;
  }
}

.list-card {
  box-shadow: 0px 0px 3px 0px rgba(211, 211, 211, 0.36);
}

.upload-card {
  background-image: url('@/assets/upload-pic-bg.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: 0% 0%;
}

.result-card {
  background-image: url('@/assets/result-pic-bg.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: 0% 0%;
}

.red-color-title::before {
  content: ' ';
  width: 10px;
  height: 10px;
  background: #DD5A4C;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.green-color-title::before {
  content: ' ';
  width: 10px;
  height: 10px;
  background: #04D0AF;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.blue-color-title::before {
  content: ' ';
  width: 10px;
  height: 10px;
  background: #086AE1;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}
</style>
