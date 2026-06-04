<template>
    <div class="video-recognit w-[100%] h-[100%] bg-[#F8FAFC]  relative pt-[33px] 
    pl-[40px] pr-[33px] box-border flex justify-between">
        <div class="left-view w-[49%] h-[95%] bg-[#fff] p-[15px]">
            <div class="w-full h-[260px] bg-[#fcf8f8]">
              <UploadDragger v-model:fileList="fileList" name="file" accept="video/*"
              @change="handleChange" 
              listType="picture-card"
              :maxCount="1"
              v-if="!fileList?.length"
              :before-upload="beforeUpload">
                <p class="ant-upload-drag-icon mt-[40px]">
                    <PlusOutlined style="color: #4362EF;"></PlusOutlined>
                     <p class="text-[16px] text-[#717B92] mt-[10px]">点击或拖拽到此区域上传</p>
                     <p class="text-[14px] text-[#717B92] mt-[4px]">请上传MP4格式视频文件</p>
                </p>
                <template #itemRender="{ file, actions }">
              <!-- <div class="flex items-center justify-between mt-2 
                  border-[1px] border-[#d9d9d9] rounded-[8px] p-[8px]">
                <div class="flex-1 flex items-center">
                  <img v-if="isVideoFile(file)" :src="getVideoThumbnail(file) || 'https://www.antdv.com/#error'"
                    @click="showVideoModal(file)" style="width: 40px; height: 40px; object-fit: cover; cursor: pointer;"
                    alt="视频封面" @load="handleThumbnailLoad(file)" />
                  <div class="ml-1 text-[#525252] text-[14px] cursor-pointer" @click="previewFile(file)">{{ file.name }}
                  </div>
                </div>
                <div class="flex items-center cursor-pointer">
                  <Button size="small" type="text" :disabled="hisSpin" @click="removeFile(file)">
                    <DeleteOutlined style="font-size: 18px;color:#666" />
                  </Button>
                </div>
              </div> -->
            </template>
              </UploadDragger>
              <div v-for="fileItem,fileIndex in fileList" :key="fileIndex" class="h-full relative">
                  <img src="@/assets/delete.png" class="w-[28px] h-[28px] absolute right-[10px] top-[10px] cursor-pointer" @click="removeFile(fileItem)" />
                  <img v-if="isVideoFile(fileItem)" :src="getVideoThumbnail(fileItem) || 'https://www.antdv.com/#error'"
                    @click="showVideoModal(fileItem)" style="width: 100%; height: auto;max-height: 100%; object-fit: cover; cursor: pointer;"
                    alt="视频封面" @load="handleThumbnailLoad(fileItem)" />
              </div>
            </div>
            <div v-if="errorArr.has('fileList')">
                 <div class="error-msg text-[12px] text-[#F00] leading-1" >请上传视频文件</div>
            </div>
            <div class="setting mt-[20px]">
                <div class="font-[500] text-[14px] text-[#717B92] leading-1 required-label">选择算法:</div>
                <div class="type-list flex flex-wrap">
                    <div class="border-[1px] border-[#E5E5E5] rounded-[5px] leading-none
                    px-[10px] py-[5px] mr-[10px] cursor-pointer text-[#999] mt-[6px]" 
                    :class="{'active-type': currentModel.has(item?.key)}"
                    v-for="item,index in typeList" :key="index" @click="handleTypeClick(item)">
                        {{ item.name }}
                    </div>
                </div>
                <div class="error-msg text-[12px] text-[#F00] leading-1" v-if="errorArr.has('currentModel')">请选择算法</div>
            </div>
            <!-- <div class="mt-[20px]">
                <div class="font-[500] text-[14px] text-[#717B92] leading-1 required-label" >描述:</div>
                <div class="error-msg text-[12px] text-[#F00] leading-1" v-if="errorArr.has('description')">请输入描述</div>
                <Textarea v-model="description" placeholder="请输入描述" :rows="4" maxlength="200" show-count  />
            </div> -->
            <div class="mt-[20px] flex items-center">
                <div class="font-[500] text-[14px] text-[#717B92] leading-1">最大检测帧数：</div>
                <InputNumber v-model:value="max_frames" :min="1" :max="1000" />
            </div>
            <div class="mt-[20px] flex items-center justify-center">
                <Button type="primary" size="small" @click="startRecognit" :disabled="isFetching">
                    开始识别
                </Button>
            </div>
        </div>
        <div class="right-view w-[49%] h-[95%] bg-[#fff] p-[15px] flex flex-col">
           <div class="font-[500] text-[22px] text-[#454F64] leading-1">识别结果</div>
           
            <div class="flex-1 overflow-y-auto">
                <Spin :spinning="hisSpin" tip="智能识别中..." size="large">
                    <div class="result-list">
                        <div class="type-list flex flex-wrap mb-[10px]" v-if="selectType?.length">
                            <div class="text-[16px] leading-[38px] text-[#454F64]">算法筛选：</div>
                            <div class="border-[1px] border-[#E5E5E5] rounded-[5px] leading-none
                            px-[10px] py-[5px] mr-[10px] cursor-pointer text-[#999] mt-[6px] h-fit" 
                            :class="{'active-type':filterKeys.has(item.key)}"
                            @click="changeFilterType(item)"
                            v-for="item,index in selectType" :key="index">
                                    {{ item.name }}
                                </div>
                        </div>
                        <div class="result-list flex flex-wrap gap-[10px]">
                            <div v-for="item,index in filterList" :key="index" class="w-[48%] bg-[#fcf8f8] rounded-[8px]">
                                <div>
                                    <Image :src="item?.base64_image || 'https://www.antdv.com/#error'" 
                                    style="width: 100%;height: auto;max-height: 200px;"
                                    />
                                    <div class="text-des text-[14px] px-[10px] py-[5px] ">
                                        <div>
                                            <span class="text-[#454F64] leading-2">识别内容：</span>{{ item?.detection_result }}
                                        </div>
                                        <div>
                                            <span class="text-[#454F64] leading-2">检测级别：</span>
                                            <span :class="{'text-[#F00]':item.level.includes('严重')}">{{ item.level }}</span>
                                        </div>
                                        <div>
                                            <span class="text-[#454F64] leading-2">算法类型：</span>{{ item.scene_name}}
                                        </div>
                                        <div>
                                            <span class="text-[#454F64] leading-2">帧时间戳：</span>{{ item.timestamp }}s
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mx-auto w-[300px] mt-[10%]" v-if="!filterList?.length">
                        <img src="@/assets/empty-state.png" />
                    </div>
                    <div v-else class="text-[14px] text-[#999] leading-1 text-center mt-[10px]">没有更多结果了</div>
                </Spin>
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
import {ref,onBeforeMount,computed,onUnmounted} from 'vue'
import type { UploadChangeParam, UploadProps} from 'ant-design-vue';
import { PlusOutlined,DeleteOutlined} from '@ant-design/icons-vue';
import {UploadDragger,message,Textarea,Button,InputNumber,Spin,Modal,Image} from 'ant-design-vue'
import {getAllTypeList} from '@/utils/constSeting'
const fileList = ref([])
const currentModel = ref(new Set([]))
const description = ref('')
const hisSpin = ref(false)
const handleTypeClick = (item) => {
    if(currentModel.value.has(item.key)) {
        currentModel.value.delete(item.key)
        return
    }
    
    currentModel.value.add(item.key)
}
const maxSize = 100
const handleChange = (info: UploadChangeParam) => {
  info.file.status = 'done'
};

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPngOrVideo =  file.type.startsWith('video/')
  if (!isJpgOrPngOrVideo) {
    message.error('请上传视频文件');
  }
  const isLt10M = file.size / 1024 / 1024 < maxSize;
  if (!isLt10M) {
    message.error(`文件大小不超过${maxSize}M`);
  }
  return isJpgOrPngOrVideo && isLt10M;
};
const isFetching = ref(false)
const errorArr = ref(new Set([]))
const max_frames = ref(10)
const typeList = ref([])
const selectType = ref([])
const resultList = ref([])
const startRecognit = async () => {
    errorArr.value.clear()
    if(!currentModel.value.size) {
        errorArr.value.add('currentModel')
    }
    if(!fileList.value.length){
        errorArr.value.add('fileList')
    }
    // if(!description.value) {
    //     errorArr.value.add('description')
    // }
    if(errorArr.value.size) return
    isFetching.value = true
    hisSpin.value = true
    const formData = new FormData()
    formData.append('scene_type',Array.from(currentModel.value).join(','))
    formData.append('file',fileList.value[0].originFileObj)
    formData.append('max_frames',max_frames.value)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/analyze`, {
        method: 'POST',
        body:formData
    });
    try{
        const res = await response.json();
        console.log(res,'识别结构')
        console.log(res.data,'data')
        console.log(res.code,'code')
        if(res.code !== 200){
            message.error(res?.message || '识别失败')
        }
        else{
            const {scenes:{scene_names,scene_types},results_by_scene} = res.data
            selectType.value= scene_types.map((item,index) => ({
                name: scene_names[index],
                key: item
            }))

            selectType.value.unshift({
                name: '全部',
                key: ''
            })
            // scene_type
            if(results_by_scene){
                resultList.value = []
                for(const key in results_by_scene){
                    if(Array.isArray(results_by_scene[key])){
                        resultList.value.push(...results_by_scene[key])
                    }
                    filterKeys.value.add('')
                }
            }
            console.log(resultList.value,'resultList.value')
            // resultObj.value = results_by_scene
            
        }
    }
    catch(e) {
        console.log('e', e)
        message.error('识别失败')
    }
    finally{
        isFetching.value = false
        hisSpin.value = false
    }
    

}

const videoModalVisible = ref(false);
const currentVideoUrl = ref('');
const videoPlayer = ref();
// 显示视频弹窗
const showVideoModal = (file: any) => {
  currentVideoUrl.value = getFilePreviewUrl(file);
  videoModalVisible.value = true;
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
// 删除文件
const removeFile = (file: UploadProps['fileList'][number]) => {
  if(hisSpin.value) return
  fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
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
// 判断是否为视频文件
const isVideoFile = (file: any) => {
  return file.type.startsWith('video/')
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

const filterKeys = ref(new Set([]))
// 识别结果类型过滤
const changeFilterType = (item) => {
    if(filterKeys.value.has(item.key)) return filterKeys.value.delete(item.key)
    if(item.key !== '' &&   filterKeys.value.has(''))  filterKeys.value.delete('') 
    else filterKeys.value.clear() 
    filterKeys.value.add(item.key)
}
// 过滤后的结果
const filterList = computed(() => {
    const result = resultList.value || []
    return result.filter(item => {
        if(filterKeys.value.size) {
            if(filterKeys.value.has('')) return true
            return filterKeys.value.has(item.scene_type)
        }
        return true
    })
})

onBeforeMount(async () => {
  const data = await getAllTypeList()
  typeList.value = data
})


</script>
<style scoped lang="scss">
.required-label{
    &::before{
        content: '*';
        color: #F00;
    }
}
.active-type{
    border-color: #4362EF;
    color: #4362EF;
}
.right-view{
    background-image: url('@/assets/result-pic-bg.png');
    background-repeat: no-repeat;
    background-size: 100% auto;
}

:deep(.ant-upload-wrapper){
  display: block;
  height: 100%;
}
</style>