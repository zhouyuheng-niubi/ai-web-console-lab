<template>
    <div class="action-recognit-container relative pt-[10px] flex flex-col 
    box-border w-[100%] h-[100%] bg-[#F8FAFC]">
         <div class="flex justify-between w-full pb-[10px]
          mx-auto flex-1 overflow-y-auto">
            <div class="bg-[#fff] rounded-[15px] card-panel h-full box-border py-2 mr-4 px-4 flex flex-col" style="flex:0.17">
                <div class="text-[18px] text-[#576075] leading-1 mb-[10px]">视频列表</div>
                <div class="w-full min-w-[200px] flex-1 overflow-auto box-border pl-[15px]">
                        <div class="bg-[#e0edfa5b] rounded-[6px] p-[10px] h-full overflow-y-auto tree-loading">
                            <Spin :spinning="intailSpini" tip="加载中..." size="large" class="h-full min-h-[200px]">
                                <Tree :selectedKeys="selectedKeys" @select="onTreeSelect"
                                :tree-data="treeData" show-icon :default-expand-all="true"
                                :expanded-keys="expandedKeys" @expand="onExpand">
                                    <template #icon="{ key, selected,url }">
                                        <img v-if="url" :src="getIconSrc(selected)" />
                                    </template>
                                </Tree>                                
                            </Spin>
                        </div>
                </div>
            </div>
            <div class="bg-[#fff] rounded-[15px] card-panel h-full box-border py-2 px-4 flex flex-col min-w-[400px] overflow-x-hidden" style="flex:0.59">
                <div class="header-filter font-500 text-[18px] text-[#576075] leading-1  flex items-center justify-between">
                    <div>
                        实时视频分析监测
                        <div class="text-[#3ef079] text-[14px]">
                            <span class="w-[8px] h-[8px] bg-[#3ef079] rounded-full mr-[5px] inline-block"></span>
                            流媒体运行中，视频分析器运行中
                        </div>
                    </div>
                    <!-- 开始识别 -->
                    <Button type="primary" @click="startAnalysis" class="mt-[10px]" v-if="!startFlag">开始布控</Button>
                    <div class="flex items-center" v-else>
                        <Button type="primary"  @click="stopAnalysis(currentSelected?.stream_id, true)" class="mr-[5px]">停止布控</Button>
                    </div>

                    <!-- <div class="bg-[#0058FD] text-[#fff] 
                    rounded-[10px] flex items-center pl-[18px]
                     pr-[16px] py-[5px] cursor-pointer" @click="refreshVideoList">
                        <SyncOutlined style="font-size: 18px" />
                        <span class="text-[14px] leading-1 pl-[2px]">刷新</span>
                    </div> -->
                </div>
                <div class="font-400 text-[16px] text-[#717B92] leading-1 mb-[10px]  mt-[8px] flex justify-between gap-2">
                    <template v-if="checkedList">
                        <!-- <div class="">选择算法：</div> -->
                        <div class="flex flex-1 flex-wrap">
                            <span class="mr-[10px]">算法来源：{{ modelOrigin.find((item) => item.value === currentSelected?.algorithm_source)?.label }}</span>
                            <Checkbox v-model:checked="checkedAll" @change="changeModel">全选</Checkbox>
                            <CheckboxGroup v-model:value="checkedList" @change="changeModel" :options="currentCanModel">
                            </CheckboxGroup>
                        </div>
                    </template>
                    <Button type="link" @click="openAlgorithmConfig" class="flex-shrink-0">算法配置</Button>
                    <!-- <span v-for="item,index in typeList" :key="index" 
                    :class="{'bg-[#0058FD] !text-[#fff]':currentModelList.has(item.value)}"
                    class="mr-[10px] cursor-pointer border-[1px] border-[#0058FD]
                    px-[10px] py-[4px] rounded-[10px] text-[#0058FD] leading-none text-[14px] mt-[10px]"
                    @click="changeModel(item)"
                    >{{ item.label }}</span> -->
                </div>
                <div class="w-full flex-1 overflow-y-auto overflow-x-hidden relative z-[1]" ref="videoContainerRef">
                    <!-- <div class="flex items-center justify-end w-full text-[12px] absolute bottom-[20px]
                     right-[10px] left-[10px] text-[#fff] video-type-selector" style="z-index: 999;">
                        <span class="text-[#fff]">播放类型：</span>
                        <RadioGroup v-model:value="streamType" @change="changeStreamType">
                            <Radio :value="type.value" v-for="type,type_index in streamTypeArr" :key="type_index">
                                {{type.label}}
                            </Radio>
                        </RadioGroup>
                    </div> -->
                    <VideoPlayer 
                        :video-url="currentStream" 
                        :video-type="streamType"
                        :directWebrtcServerIp="previewConfig.edgBoxServerIp"
                        :directWebrtcCameraId="previewConfig.source_id"
                        :directWebrtcAccessKey="previewConfig.edge_box_access_key"
                        :directWebrtcAccessSecret="previewConfig.edge_box_access_secret"
                        :settingAlg="edgeBoxChecked"
                    >
                    </VideoPlayer>
                    <!-- 视频流实时标志 -->
                    <div class="absolute bottom-[0px] right-[10px] z-[200] flex items-center bg-[rgba(0,0,0,0.5)] px-[10px] py-[5px]">
                        <span class="mr-[20px] cursor-pointer">
                            <FullscreenOutlined v-if="!isFullscreen" @click="toggleVideoFullscreen" class="cursor-pointer text-[22px] text-white"/>
                            <FullscreenExitOutlined v-else @click="toggleVideoFullscreen" class="cursor-pointer text-[22px] text-white"/>
                        </span>
                        <div class="text-[14px] text-[#fff] leading-none">live</div>
                    </div>
                    <!-- 加载loading -->
                    <Spin :spinning="videoSpin" tip="视频切换中..." size="large" class="absolute top-0 left-0 right-0 
                    bottom-0 flex items-center justify-center z-[100] bg-[#00000080]">
                    </Spin>
                </div>
                <div class="mt-[10px] flex items-center justify-between">
                    <div class="text-[16px] font-[500] text-[#576075]">识别记录(<span class="text-[#DD6A0C]">{{ captureList?.length }}</span>条)</div>
                    <div class="types flex items-center text-[14px] text-[#576075]">
                        <div>
                            <Button type="link" @click="toMoreList('capture')">更多 ></Button>
                        </div>
                    </div>
                </div>
                <div class="capture-scroll-container w-full h-[180px]" ref="captureContainerRef">
                    <Spin :spinning="captureSpin">
                        <div class="mt-[10px] flex w-fit gap-5 " v-if="captureList?.length">
                            <div v-for="item,index in captureList" :key="item.id" 
                            class="capture-item h-[150px] flex flex-col items-center">
                                <Image :src="item?.imageUrl || '/src/assets/img_error.png'" 
                                    style="width:140px; height: 90px;object-fit: cover;" 
                                    />
                                <div class="text-[12px] font-[400] text-[#717B92] w-full whitespace-nowrap overflow-hidden text-ellipsis">
                                    <Tooltip placement="top">
                                        <template #title>【{{item.scene_name}}】{{ item.detection_result }}</template>
                                       【{{item.scene_name}}】{{ item.detection_result }}
                                    </Tooltip>
                                    
                                </div>
                                <div class="text-[12px] font-[400] text-[#717B92]">
                                {{ item.detection_time}}
                                </div>
                            
                            </div>
                        </div>
                        <img src="@/assets/empty.png" class="w-[120px] block mx-auto mt-[15px]" v-else />                                             
                    </Spin>
                </div>
            </div>
            <!-- 报警事件信息 -->
            <div class="bg-[#fff] rounded-[15px] ml-4 card-panel
             h-full box-border py-2 px-4 min-w-[300px] flex flex-col" style="flex:0.24">
                <div class="flex justify-between items-center">
                    <div class="text-[18px] text-[#576075]">
                        告警记录
                        (<span class="text-[#DD6A0C] text-[24px]">{{warnPage.total}}</span>条)
                    </div>
                    <div class="types flex items-center text-[14px] text-[#576075]">
                        <div>
                            <Button type="link" @click="toMoreList('warn')">更多 ></Button>
                        </div>
                    </div>
                </div>
                <div class="search-container mt-[10px] text-[14px]">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="whitespace-nowrap">选择算法：</span>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="flex flex-wrap gap-2">
                                <RadioGroup v-model:value="searchParams.scene_types" :options="currentCanModel" @change="changeSearch">
                                </RadioGroup>
                                <span class="cursor-pointer text-[#4362EF] text-[14px]" @click="clearTypesSearch">清空</span>                         
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3 py-[10px]" v-if="searchParams.scene_types && messageInfo?.length">
                        <div class="metric-card">
                            <div class="metric-label">误报率</div>
                            <div class="metric-value leading-none">{{ modelResult?.false_positive_rate || '0%' }}</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">漏报率</div>
                            <div class="metric-value leading-none">{{ modelResult?.false_negative_rate || '0%' }}</div>
                        </div>
                        <!-- <div class="metric-card">
                            <div class="metric-label">误报率</div>
                            <div class="metric-value leading-none error-rate">{{ modelResult?.false_positive_rate || '0%' }}</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">漏报率</div>
                            <div class="metric-value leading-none error-rate">{{ modelResult?.false_negative_rate || '0%' }}</div>
                        </div> -->
                    </div>  
                </div>
                <!-- 算法描述 -->
                <div class="description-container flex items-center bg-[#F4F9FD]
                justify-between text-[14px] mb-[5px] pl-[5px] py-[5px] rounded-[5px]" 
                v-if="searchParams.scene_types">
                    <div class="flex items-center">
                        <ExclamationCircleOutlined class="text-[#DD6A0C] mr-[10px]" />
                        <span>算法：{{detailModel.modelName}}</span>
                    </div>
                    <Button type="link" @click="openModelDetail(searchParams.scene_types)">使用说明</Button>
                </div>
                <div class="message-container overflow-hidden flex-1
                 overflow-y-auto" ref="messageContainerRef">
                    <Spin :spinning="hisSpin" tip="加载中..." size="large">
                        <div class="rounded-[6px] bg-[#F2F5FA] py-[12px] px-[16px] mt-[14px] relative cursor-pointer" 
                        :class="{'border-[1px] border-[#ff0000e6]':index === 0}"
                        v-for="item,index in messageInfo" :key="item.id" @click="handleTableAction('detail', item)">
                         <img src="@/assets/action/new-message.png" class="absolute right-[-4px] top-[-4px]" v-if="index === 0" />
                            <div class="relative">
                                <img :src="item?.imageUrl || '/src/assets/img_error.png'" 
                                 style="width: 100%;height: auto;max-height: 200px;object-fit: cover;"
                                />
                                <div class="absolute text-[#ff1c27] px-[4px] py-[4px] leading-none rounded-[10px] text-[12px]
                                 top-0 left-0 bg-[#0000008f]">{{item.scene_name}}</div>
                            </div>
                            
                            <div class="flex-1">
                               
                                <div class="">
                                    <div class="text-[14px] text-[#717B92] leading-none mt-[5px] flex items-center">
                                        <EnvironmentOutlined />
                                        <span class="ml-[2px]">所属区域：</span>
                                        <span>{{ item?.region_name || '--' }}</span>
                                    </div>
                                    <div class="text-[14px] text-[#717B92] leading-none mt-[5px] flex items-center">
                                        <EnvironmentOutlined />
                                        <span class="ml-[2px]">监控设备：</span>
                                        <span>{{ item?.stream_name }}</span>
                                    </div>
                                    <div class="text-[14px] leading-none text-[#717B92] mt-[5px] flex items-center">
                                        <FieldTimeOutlined />
                                        <span class="ml-[2px]">报警时间：</span>
                                        <span>{{ item?.detection_time }}</span>
                                    </div>
                                    <div class="text-[14px] leading-none text-[#717B92] mt-[5px] flex items-center">
                                        <AlertOutlined />
                                        <span class="ml-[2px]">报警原因：</span>
                                        <span>{{ item?.detection_result }}</span>
                                    </div>
                                    <div class="text-[14px] text-[#717B92] leading-none mt-[5px] flex items-center">
                                        <EnvironmentOutlined />
                                        <span class="ml-[2px]">算法来源：</span>
                                        <span>{{ item?.algorithm_source || '--' }}</span>
                                    </div>
                                    <div class="text-[14px] leading-none text-[#717B92] mt-[5px] flex items-center">
                                        <FieldTimeOutlined />
                                        <span class="ml-[2px]">识别时间：</span>
                                        <span>{{ item?.result.processing_time? item?.result.processing_time+'s':'--' }}</span>
                                    </div>
                                    <!-- 播放按钮 -->
                                    <div class="text-[14px] text-[#717B92] leading-none mt-[5px] flex items-center">
                                        <PlayCircleOutlined />
                                        <span class="ml-[2px]">视频片段：</span>
                                        <span class="text-[#4362EF] cursor-pointer text-[12px]" @click.stop="playVideo(item,index)">播放</span>
                                    </div>
                                </div>
                                <!-- <div class="flex items-center mb-[9px]">
                                    <div class="font-500 text-[14px] text-[#D95446] leading-1">[{{ item?.scene_name }}]</div>
                                    <div class="font-500 text-[14px] text-[#717B92] leading-1">{{ item?.detection_result }}</div>
                                </div>
                                <div class="flex justify-between items-center font-400 text-[12px] text-[#717B92]">
                                    <div class="leading-none">设备ID:{{ item?.device_id}}</div>
                                    <div class="leading-none">{{ item?.time }}</div>
                                </div> -->
                            </div>
                        </div>
                        <img src="@/assets/empty.png" class="w-[40%] block mx-auto mt-[25%]" v-if="!messageInfo?.length" /> 
                    </Spin>
                </div>
            </div>
         </div>
         <!-- 告警详情弹窗 -->
         <Modal title="告警详情" v-model:open="detailModalVisible"  width="800px" :footer="null">
            <AlarmDetail
            :alarm-data="selectedAlarm"
            :image-url="selectedAlarmImageUrl"
            :isDarkTheme="false"
            :show-header="false"
            @falseAlarm="(val) => handleAction('falseAlarm', val)"
            @confirm="(val) => handleAction('confirm',val)"
            @close="closeDetailModal"
          />
         </Modal>
         <!-- 视频播放弹窗 -->
         <Modal title="报警视频片段" v-model:open="videoModalVisible" width="800px" :footer="null" @cancel="closeVideoModal">
            <div style="width: 100%; height: 450px">
                <VideoPlayer ref="videoPlayerDetail"
                :videoUrl="currentVideoUrl" 
                videoType="mp4" 
                videoId="video-player-detail" 
                v-if="videoModalVisible" />                
            </div>

        </Modal>
         <!-- 模型描述 -->
         <Modal title="算法描述详情" v-model:open="modelDetailVisible"  width="600px" :footer="null">
            <div class="model-detail-container">
                <div class="model-detail-title text-[16px] font-[500]">{{ detailModel.modelName }}：</div>
                <div class="model-detail-content text-[14px] mt-[5px]" v-if="modelDes[detailModel.model]">
                        <div v-for="(item, index) in modelDes[detailModel.model]" :key="index">{{ item }}</div>
                </div>
            </div>
         </Modal>
         <!-- 权限验证弹窗 -->
         <Modal
            v-model:open="authModalVisible"
            title="权限验证"
            width="400px"
            @ok="handleAuthConfirm"
            @cancel="handleAuthCancel"
         >
            <div class="py-4">
               <div class="mb-2 text-[14px] text-[#576075]">请输入权限码以访问算法配置：</div>
               <Input.Password
                  v-model:value="authCodeInput"
                  placeholder="请输入权限码"
                  class="w-full"
                  @pressEnter="handleAuthConfirm"
               />
            </div>
         </Modal>
         <!-- 算法配置弹窗 -->
         <Modal 
            v-model:open="algorithmConfigVisible" 
            title="算法配置" 
            width="75%"
            :confirm-loading="algorithmConfigLoading"
            @ok="handleAlgorithmConfigOk"
            @cancel="handleAlgorithmConfigCancel"
         >
            <CameraForm 
               ref="algorithmFormRef"
               :initialData="algorithmCurrentCamera"
               :regionTree="algorithmRegionTree"
               :riskFactorsOptions="algorithmRiskFactorsOptions"
               :sceneTypesOptions="algorithmSceneTypesOptions"
               :modelParams="algorithmModelParams"
            />
         </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed, onBeforeMount, h } from 'vue';
import { Image, Spin, Tree, Checkbox, CheckboxGroup, notification,
    RadioGroup, Button, message, Modal,Input ,Tooltip} from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash-es';
import VideoPlayer from '@/components/videoPlayer/VideoPlayer.vue'
import CameraForm from '@/components/CameraForm/index.vue';
import videoIcon from '@/assets/action/icon-video.png';
import videoIconA from '@/assets/action/icon-video-a.png';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; 
import type { TreeProps } from 'ant-design-vue';
import { AlertOutlined, FieldTimeOutlined,
    EnvironmentOutlined, PlayCircleOutlined, ExclamationCircleOutlined,
    FullscreenOutlined, FullscreenExitOutlined
} from '@ant-design/icons-vue'
import { getAllTypeList, modelDes, modelOrigin } from '@/utils/constSeting'
import { getAvailVideoList, getAlarmList, startAnalysisApi, stopAnalysisApi, updateVideoStream, getRiskRateData, getEdgeBoxModel } from '@/api/warn/index'
import { getCameraList, editCamera } from '@/api/system/camera';
import { getDangerList } from '@/api/system/trigger'
import { getRegionList } from '@/api/system/region';
import { getModelConfig } from '@/api/system/model';
import { v4 as uuidv4 } from 'uuid'
import normalAlert from '@/assets/audio/normal-alert.mp3'
import fireAlert from '@/assets/audio/fire-alert.mp3'
import AlarmDetail from '@/components/alarmDetail/index.vue';
// 导入音频播放器
import enhancedAudioPlayer, {
  initAudioPlayer,
  stopAudio,
  stopAudioCompletely, // 完全停止函数
  setVolume, // 音量控制函数
} from '@/utils/enhancedAudioPlayer'
import {stopAllNativeAudioElements,getAllNodeKeys,enterFullscreen,exitFullscreen} from '@/utils/tool'
// 返回
const streamType = ref('auto')
const streamTypeArr = [
    {
        label:'hls',
        value:'hls'
    },
    {
        label:'rtsp',
        value:'rtsp'
    }
]


const serverUrl = ref('http://10.0.0.1:8000')
const router = useRouter()
const currentLine = ref(0)
const intailSpini = ref(true)
const hisSpin = ref(false)
const videoList = ref([])

const currentStream = ref('')
const currentSelected = ref({})
const selectedKeys = ref([''])
const expandedKeys = ref([])
const treeData = ref<TreeProps['treeData']>([])
const modelResult = ref({}) //模型检测信息

const messageInfo = ref([])
const messageTotal = ref(0)
const messageContainerRef = ref(null)
const videoSpin = ref(false)
// 预览配置
const previewConfig = ref({
    edgBoxServerIp: '10.0.0.1',
    source_id: '',
    edge_box_access_key: "69156104eb712e27f7d43591",
    edge_box_access_secret: "4fd5a37e-5527-46ad-a34d-0709d72102bc"
})
// 边缘盒子
const edgeBoxModel = ref({})
// 选择模型
const checkedAll = computed({
    get: () => {
        return checkedList.value.length === currentCanModel.value.length 
    },
    set: (value) => {
        checkedList.value = value?  currentCanModel.value.map(item => item.value) : []
    }
})

const checkedList = ref([''])//系统选择项

// 边缘盒子模型选择项
const edgeBoxChecked = computed(() => {
    if(currentSelected.value?.algorithm_source === 'YOLO') return checkedList.value
    const arr =[]
    checkedList.value.forEach(item => {
        if(edgeBoxModel.value[item]){
            arr.push(edgeBoxModel.value[item][0].algorithm)
        }
    })
    return arr
})



const currentModelName = computed(() => {
    const newValue =checkedList.value[checkedList.value.length -1]
    const label = typeList.value.find(item => item.value === newValue)?.label
    return label
})

// 展开/折叠事件
const onExpand = (expandedKeysValue) => {
    expandedKeys.value = expandedKeysValue
}

// 选择树型结构 - 实际处理逻辑
const handleTreeSelect = async (selectedKeysParam, {selected, selectedNodes, node, event}) => {
    if (!selected || !selectedNodes?.length) return
    
    const nodeData = selectedNodes[0]
    if (!nodeData?.url && !nodeData?.stream_id) {
        selectedKeys.value = currentSelected.value?.key ? [currentSelected.value.key] : []
        return
    }
    
    selectedKeys.value = selectedKeysParam
    
    try {
        videoSpin.value = true
        currentSelected.value = nodeData
        captureList.value = []
        messageInfo.value = []
        startFlag.value = false
        searchParams.value.scene_types = ''
        
        await initWarnEvent()

        checkedList.value = currentSelected.value?.scenes || []
        currentCanModel.value = typeList.value.filter(item => checkedList.value.includes(item.value))
        currentStream.value = nodeData?.url || ''
        startFlag.value = currentSelected.value?.monitoring || false

        getPreviewVideoUrl(currentSelected.value, startFlag.value)
    } catch (e) {
        console.error('选择视频节点失败:', e)
    } finally {
        videoSpin.value = false
    }
}

// 选择树型结构 - 防抖处理
const onTreeSelect = debounce(handleTreeSelect, 300, { leading: true, trailing: false })
// 更新视频流
const updateVideoList = async () => {
    const res = await updateVideoStream()
    return res
}

// 更改编码格式
const changeStreamType = async () => {
    const res = await updateVideoList()
    let hlsUrl = ''
    let rtspUrl = ''
    if(res?.data?.stream_configs){
        for(const key in res?.data?.stream_configs){
            if(key === currentSelected.value?.stream_id){
                console.log(res?.data?.stream_configs[key],'stream_config')
                hlsUrl = res?.data?.stream_configs[key]?.iot_info?.play_urls?.hls
                rtspUrl = res?.data?.stream_configs[key]?.iot_info?.play_urls?.rtsp
                break 
            }
        }        
    }
    if(streamType.value === 'hls') currentStream.value = hlsUrl

    else if(streamType.value === 'rtsp') currentStream.value = rtspUrl
}

const getIconSrc = (selected:boolean) => {
    return selected? videoIconA : videoIcon
}
// 获取可以视频列表
const getVideoList = async () => {
    try{
        intailSpini.value = true
        const {data,code} = await getAvailVideoList()
        intailSpini.value = false
        if(code === 200) {
            treeData.value = data
            //if(treeData.value && treeData.value.length > 0) treeData.value[0].title = treeData.value[0].title.replace('银利华','')
            // 获取所有非叶子节点的key并设置展开
            nextTick(() => {
                expandedKeys.value = getAllNodeKeys(treeData.value)
            })
            
            // 递归查找最深层的第一个叶子节点
            const findFirstLeaf = (nodes) => {
                if (!nodes || nodes.length === 0) return null
                for (const node of nodes) {
                    if (node.children && node.children.length > 0) {
                        const leaf = findFirstLeaf(node.children)
                        if (leaf) return leaf
                    } else {
                        // 找到叶子节点
                        return node
                    }
                }
                return null
            }
            
            const firstLeaf = findFirstLeaf(treeData.value)
            if (firstLeaf) {
                currentSelected.value = firstLeaf
                selectedKeys.value = [firstLeaf.key]
                checkedList.value = currentSelected.value?.scenes || []
                currentCanModel.value = typeList.value.filter(item => checkedList.value.includes(item.value))
                // if(streamType.value === 'hls') currentStream.value = firstLeaf.iot_info?.play_urls?.hls
                // else if(streamType.value === 'rtsp')currentStream.value = firstLeaf.iot_info?.play_urls?.rtsp
                currentStream.value = firstLeaf?.url
                captureList.value = []
                messageInfo.value = []
                startFlag.value = currentSelected.value?.monitoring || false
                // searchParams.value.checkedList = typeList.value.map(item => item.value)
                initWarnEvent()
                getPreviewVideoUrl(currentSelected.value,startFlag.value)
            }
        }
    
    }
    catch(e){
        intailSpini.value = false
        console.error('获取视频流列表失败:', e)
    }

}
// 重新启动
const changeModel = () => {
    if(startFlag.value) {
        stopAnalysis(currentSelected.value?.stream_id)
        startAnalysis()
    }
}


// 获取历史消息
const searchParams = ref({
    // checkedList:[],
    scene_types:null,
    place:'',
    status:'',
    warnTime:[dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')]
})

const statusArray = [
    {
        label:'全部',
        value:''
    },
    {
        label:'未处理',
        value:'noHandle'
    },
    {
        label:'已处理',
        value:'finished'
    },
]
const typeList = ref([])
const currentCanModel = ref([])
const warnPage = ref({
    currentPage:1,
    pageSize:10,
    total:0,
    hasNext:false,
    isLoading:false
})
// 获取报警事件
const getWarnEvent = async (stream_id:string, isLoadMore = false) => {
    try{
        const params:any = {
            page:warnPage.value.currentPage,
            page_size:warnPage.value.pageSize,
            // stream_id,
            message_type:'exception_result',
            scene_types:searchParams.value.scene_types
        }
        const {data,code} = await getAlarmList(params)

        if(code === 200) {
            console.log('stream_id',stream_id)
            console.log('获取的历史消息:', data)
            const reversedData = data.messages
            const {has_next,total_count,total_pages} = data.pagination
            console.log(has_next,'是否有下一页')
            console.log(total_count,'总条数')
            console.log(total_pages,'总页数')
            
            warnPage.value.total = total_count
            warnPage.value.hasNext = has_next
            console.log(reversedData,'reversedDatdata')
            const arr = []
            reversedData.forEach(({data}) => {
                // const imageUrl = data.base64_image ? base64ToBlobUrl(data.base64_image) : ''
                const params = {
                    ...data,
                    time: dayjs(data.detection_time).format('YYYY-MM-DD HH:mm:ss'),
                    title: data.scene_name,
                    status: data.level,
                    imageUrl: data.image_url || data.base64_image,
                    id: data.id || uuidv4()
                }
                arr.push(params)
            })
            return arr
        }

    }
    catch(e){
        if (!isLoadMore) {
            hisSpin.value = false
        }
        console.error('获取历史消息失败:', e)
    }
}
// 获取捕获记录
const captureList = ref([])//全部记录
const captureSpin = ref(false)
const captureContainerRef = ref(null)

let sseConnection = null
// 滚动到最新消息
const scrollToLatestMessage = () => {
    setTimeout(() => {
        const container = messageContainerRef.value
        if (container) {
            container.scrollTop = 0 // 因为最新消息在数组开头，所以滚动到顶部
        }
    })
}
// 滚动到最左侧
const scrollToLeft = () => {
    setTimeout(() => {
        const container = captureContainerRef.value
        if (container) {
            container.scrollLeft = 0   
        }
    })
}

// 将base64图片转换为blob URL
const base64ToBlobUrl = (base64String) => {
    if (!base64String) return ''
    
    try {
        // 提取base64数据部分（去掉data:image/jpeg;base64,前缀）
        const base64Data = base64String.split(',')[1]
        if (!base64Data) return base64String
        
        // 将base64转换为二进制数据
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)
        
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'image/jpeg' })
        
        // 创建blob URL
        return URL.createObjectURL(blob)
    } catch (error) {
        console.error('Base64转Blob URL失败:', error)
        return base64String // 如果转换失败，返回原始base64字符串
    }
}

// 处理检测结果消息
const handleDetectionResult = (data,type:'exception_result'|'detection_result') => {
    // console.log('stream_id:',data.stream_id)
    // console.log('currentSelected.value?.stream_id:',currentSelected.value?.stream_id)

    // if(data.stream_id !== currentSelected.value?.stream_id) return
    if(type === 'exception_result'){
        if (!messageInfo.value) {
            messageInfo.value = []
        }
    }
    if(type === 'detection_result'){
        if (!captureList.value) {
            captureList.value = []
        }
    }


    // 转换base64图片为blob URL
    // const imageUrl = data.base64_image ? base64ToBlobUrl(data.base64_image) : ''
    const params = {
       ...data,
        time: dayjs(data.detection_time).format('YYYY-MM-DD HH:mm:ss'),
        title: data.scene_name,
        status: data.level,
        imageUrl:data.image_url || data.base64_image, // 存储转换后的blob URL 
        id: data.id || uuidv4()
    }
    // 添加新消息到数组开头（最新消息在最上面）
    if(type === 'exception_result') {
        // 关闭之前的报警通知
        notification.destroy()

        notification.open({
            key: 'alarm-notification',
            message: '最新告警信息',
            duration: 10,
            class: 'alarm-flash-notification',
            btn: h(Button, {
                type: 'primary',
                size: 'small',
                onClick: () => notification.close('alarm-notification')
            }, '关闭'),
            description: h('div', [
                // 图片元素
                h(Image, {
                    src: data.image_url || data.base64_image, // 示例图片
                    alt: '报警图片',
                    style: { width: '400px', height: '200px', marginTop: '8px', borderRadius: '4px',objectFit:'contain'}
                }),
                h('p', { style: { marginTop: '8px', marginBottom: '4px' } }, `所属区域：${data.region_name || '--'}`),
                h('p', { style: { marginBottom: '4px' } }, `监控设备：${data.stream_name || '--'}`),
                h('p', { style: { marginBottom: '4px' } }, `算法来源：${data.algorithm_source || '--'}`),
                h('p', { style: { marginBottom: '4px' } }, `报警时间：${dayjs(data.detection_time).format('YYYY-MM-DD HH:mm:ss')}`),
                // 补充文本 + 自定义按钮
                h('div', { style: { marginTop: '4px'} }, [
                    h('span', null, `报警原因：${data.detection_result}`),
                ])
            ]),
        });


        messageInfo.value.unshift(params)
        // 更新总条数
        warnPage.value.total = warnPage.value.total + 1
    }
    else {
        captureList.value.unshift(params)
    }
    
    
    // 滚动到最新消息
    if(type === 'exception_result') scrollToLatestMessage()
    else scrollToLeft()
}

// 修复SSE事件监听
const setupSSE = () => {
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/sse/events`)
    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            if (data.type === 'exception_result') {
                handleDetectionResult(data.data,'exception_result')
            }
            if(data.type === 'detection_result'){
                handleDetectionResult(data.data,'detection_result')
            }
        } catch (e) {
            console.error('解析SSE消息失败:', e)
        }
    }
    // 捕获事件监听
    eventSource.addEventListener('detection_result', function(event) {
        try {
            const data = JSON.parse(event.data)
            console.log('触发捕获事件:', data)
            if (data.data) {
                handleDetectionResult(data.data,'detection_result')
            }
        } catch (e) {
            console.error('解析触发捕获事件失败:', e)
        }
    })
    // 触发报警事件监听
    eventSource.addEventListener('exception_result', function(event) {
        try {
            const data = JSON.parse(event.data)
            console.log('触发报警事件:', data)
            if (data.data) {
                handleDetectionResult(data.data,'exception_result')
                
                // 触发红色边框闪烁效果
                triggerAlarmFlash()
                // +data.data.stream_name + data.data.detection_result
                const textStr = data.data.scene_name+'检测告警' 
                playAlarmSound(textStr)
                // // 火焰烟雾
                // if(['fire_detection', 'smoke_detection'].includes(data.data.scene_type)){
                //     playAudio('fireAlert',() => {
                //         playAlarmSound(textStr)
                //     })
                // }
                // else {
                //     // 其他报警
                //     playAudio('normalAlert',() => {
                //          playAlarmSound(textStr)
                //     })
                    
                // }
            }

            // 增加报警音效播放
            // fire_detection smoke_detection fire-alert.mp3
            // normal-alert.mp3
            
        } catch (e) {
            console.error('解析触发报警事件失败:', e)
        }
    })


    
    eventSource.onerror = (error) => {
        console.error('SSE连接错误:', error)
    }
    
    eventSource.onopen = () => {
        console.log('SSE连接已建立')
    }
    
    return eventSource
}
let adudioElement = null

// 报警闪烁定时器
let alarmFlashTimer = null

// 触发报警红色边框闪烁效果
const triggerAlarmFlash = () => {
    // 清除之前的定时器
    if (alarmFlashTimer) {
        clearTimeout(alarmFlashTimer)
    }
    // 开始闪烁
    isAlarmFlashing.value = true
    // 3秒后停止闪烁
    alarmFlashTimer = setTimeout(() => {
        isAlarmFlashing.value = false
    }, 2000)
}

const playAudio = (audioFileName:string,endCallback?:() => void) => {
    if(adudioElement) {
        adudioElement.pause()
        adudioElement = null
    }
    let audioSrc = audioFileName === 'fireAlert' ? fireAlert : normalAlert
    adudioElement = new Audio(audioSrc)
    adudioElement.play()
    adudioElement.onended = () => {
        audioSrc = ''
        endCallback?.()
    }
}


// end
// 启动分析
const startFlag = ref(false)
const startAnalysis = async () => {
    if(!currentSelected.value?.stream_id) return message.error('请先选择摄像头') 
    const hide = message.loading('开始分析中...', 0);
    try{
        
        const res = await startAnalysisApi({
            stream_id: currentSelected.value?.stream_id,
            scenes: checkedList.value
        })
        startFlag.value = true
        // 更新视频列表 monitoring状态
        updateVideoMonitoringStatus(currentSelected.value?.stream_id, true)
        hide()
        
        // 重置状态
        // 重置列表数据
        clearCache()
        // searchParams.value.checkedList = typeList.value.map(item => item.value)
        initWarnEvent()
        getPreviewVideoUrl(currentSelected.value,true)
    }
    catch(e){
        hide()
    }

    

    
}
// 停止分析
const stopAnalysis = async (stream_id?:string,changeFlag?:boolean) => {
    let loading = null
    if(changeFlag){
        loading = message.loading('停止分析中...', 0);
    }
    try {
        await stopAnalysisApi({
            stream_id: stream_id || null
        })
        updateVideoMonitoringStatus(stream_id, false)
        if(changeFlag) {
            startFlag.value = false
            getPreviewVideoUrl(currentSelected.value,false)
        }
    } catch (e) {
        console.error('停止分析失败:', e)
        message.error('停止分析失败')
    } finally {
        if(loading) loading()
    }
}

// 更新视频启动状态
const updateVideoMonitoringStatus = async (stream_id:string, monitoring:boolean) => {
    const targetObj = findChildren(treeData.value, stream_id)
    if (targetObj) targetObj.monitoring = monitoring
}
const findChildren = (treeData, stream_id) => {
    console.log(treeData,'treeData')
    console.log(stream_id,'stream_id')
    for (const item of treeData) {
        if (item.key === stream_id) return item
        if (item.children) {
            const result = findChildren(item.children, stream_id)
            if (result) return result
        }
    }
    return null
}




const initWarnEvent = async () => {
    warnPage.value.currentPage = 1
    warnPage.value.hasNext = false
    warnPage.value.isLoading = false
    try {
        hisSpin.value = true
        messageInfo.value = await getWarnEvent(currentSelected.value?.stream_id)
    } catch (e) {
        console.error('初始化告警事件失败:', e)
        messageInfo.value = []
    } finally {
        hisSpin.value = false
    }
    return true
}

const changeSearch = async() => {
    detailModel.value.modelName = currentCanModel.value.find(item => item.value === searchParams.value.scene_types)?.label || ''
    detailModel.value.model = searchParams.value.scene_types
    await initWarnEvent()
    if(messageInfo.value?.length){
        getRiskRateData({
            camera_id:currentSelected.value?.stream_id,
            scene_type:searchParams.value.scene_types
        }).then(res => {
            modelResult.value = res.data
        })
    }
}
// 清空场景类型搜索
const clearTypesSearch = () => {
    searchParams.value.scene_types = ''
    changeSearch()
}

const clearCache = (
    onlyKey?:string
) => {
   
    // 清理所有blob URL
    if(messageInfo.value?.length){
        messageInfo.value.forEach(msg => {
            if (msg?.imageUrl && msg?.imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(msg.imageUrl)
            }
        })
        messageInfo.value = []       
    }
    if(captureList.value?.length){
        captureList.value.forEach(msg => {
            if (msg?.imageUrl && msg?.imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(msg.imageUrl)
            }
        })
        captureList.value = []
    }
     
}

// 查看更多
const toMoreList = (type:string) => {
    if(type === 'warn'){
        router.push({ path: '/warn-list' })
    }
    if(type === 'capture'){
        router.push({ path: '/capture-record' })
    }
}

// 表格操作事件处理
const detailModalVisible = ref(false);
const selectedAlarm = ref({});
const selectedAlarmImageUrl = ref('');
const handleTableAction = (action: string, record: any) => {
  if (action === 'detail') {
    selectedAlarm.value = record;
    // 构造图片URL，如果存在base64_image则使用base64，否则使用默认图片
    if(record.image_url) {
      selectedAlarmImageUrl.value = record.image_url;
    }
    else if (record.base64_image) {
      selectedAlarmImageUrl.value = record.base64_image;
    } 
    else {
      selectedAlarmImageUrl.value = '/src/assets/img_error.png';
    }
    detailModalVisible.value = true;
  }
};

const closeDetailModal = () => {
  detailModalVisible.value = false;
  selectedAlarm.value = {};
  selectedAlarmImageUrl.value = '';
};

// 报警消息处理
const handleAction = (type: string, record: any) => {
  if (type === 'falseAlarm') {
    console.log('处理误报', record);
    message.info('功能开发中，敬请期待')
  }
  if (type === 'confirm') {
    console.log('确认报警', record);
    message.info('功能开发中，敬请期待')
  }
  closeDetailModal()
};

// 视频片段播放
const videoModalVisible = ref(false);
const currentVideoUrl = ref('');
const closeVideoModal = () => {
  videoModalVisible.value = false;
  currentVideoUrl.value = '';
};

const playVideo = (record: any,index:number) => {
    // console.log('播放视频片段', record);
    if (!record.video_clip_url) {
      message.info('暂无视频片段')
      return
    }
    videoModalVisible.value = true;
    currentVideoUrl.value = record.video_clip_url;
};


// 实时文本播放

// 音频流请求
let streamController = null // 添加终止信号
const requestAudioStream = async (content) => {
  await streamController?.abort()
  streamController = new AbortController()
  const response = await fetch(`${import.meta.env.VITE_NEWAI_API}/ai/tts/realtime`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({
      text: content,
      voice:'cosyvoice-v3-myvoice-a068a4eb42c148deab21dced90c9aaa4'
    }),
    signal: streamController.signal // 添加终止信号
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response
}

// 停止当前音频播放并更新播放状态
const stopCurrentAudioPlayback = async (iosAudioCategory = 'playback') => {
  try {
    stopAudio()
    stopAllNativeAudioElements()
    enhancedAudioPlayer.onPlay = null
    enhancedAudioPlayer.onPause = null
    enhancedAudioPlayer.onStop = null
    enhancedAudioPlayer.onEnd = null
    enhancedAudioPlayer.audioBuffers = []
    enhancedAudioPlayer.currentBufferIndex = 0
    enhancedAudioPlayer.currentBufferPosition = 0
    enhancedAudioPlayer.totalFramesProcessed = 0

    if (iosAudioCategory === 'record') {
      if (enhancedAudioPlayer.audioContext && enhancedAudioPlayer.audioContext.state === 'running') {
        try {
          // 暂停而非关闭，方便后续恢复
          await enhancedAudioPlayer.audioContext.suspend();
          console.log('已暂停音频上下文');
        } catch (error) {
          console.warn('暂停音频上下文失败:', error);
        }
      }
    } else {
      // 对于播放场景，重新初始化播放器
      await enhancedAudioPlayer.init(iosAudioCategory);
      // 确保 AudioContext 已恢复
      if (enhancedAudioPlayer.audioContext && enhancedAudioPlayer.audioContext.state === 'suspended') {
        await enhancedAudioPlayer.audioContext.resume();
        console.log('AudioContext 已恢复');
      }
    }

    
  } catch (error) {
    console.error('停止音频播放时出错:', error)
  }
}

// 报警音频效果
const playAlarmSound = async(text) => {
  await stopCurrentAudioPlayback()
  let reader = null
  try {
    const uuid = uuidv4()
    const response = await requestAudioStream(text)
    reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          while (true) {
            const lineEnd = buffer.indexOf('\n')
            if (lineEnd === -1) break
            const line = buffer.slice(0, lineEnd).trim()
            buffer = buffer.slice(lineEnd + 1)
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[AUDIO_DONE]') {
                // 音频流结束
                break
              }
              try {
                // 如果有音频数据，则播放
                if (data) {
                  playBase64AudioData(uuid, data,
                    // 结束播放
                    () => {
                        console.log('播放完成')
                    },
                    // 自动播放回调
                    () => {
                      console.log('自动播放回调...')
                      
                    }, false, true) // 流式播放
                }
              } catch (error) {
                console.error('解析错误1:', error)
              }
            }
          }
        }
  }
  catch (error) {
    console.error('播放音频时出错:', error)
  }
}

// 播放Base64音频数据 - 增强版
const playBase64AudioData = async (id, base64Data, onEndedCallback = null, onStartedCallback = null, isCachedPlayback = false, shouldPlay = true) => {
  try {
    
    // 如果有开始播放回调，设置onPlay事件
    if (onStartedCallback && !isCachedPlayback) {
      enhancedAudioPlayer.onPlay = onStartedCallback
    }
    
    // 确保音频上下文已解锁
    const isUnlocked = await enhancedAudioPlayer.ensureAudioContextUnlocked();
    if (!isUnlocked) {
      console.warn('音频上下文未解锁，可能需要用户交互');
    }
    await enhancedAudioPlayer.addAudioData(id, base64Data, onEndedCallback, false, shouldPlay)
  } catch (error) {
    console.error('播放音频失败:', error);
  }
}

// 判断监测类型时 大模型还是边缘盒子去对应预览视频效果
const getPreviewVideoUrl = (currentSelected:any,flag:boolean = false) => {
    if(!flag){
        currentStream.value = currentSelected?.url
        streamType.value = 'auto'
        previewConfig.value = {
            edgBoxServerIp: '',
            source_id: '',
            edge_box_access_key: '',
            edge_box_access_secret: ''
        }
        return
    }
    if(currentSelected?.algorithm_source === 'EDGE_BOX'){
        if(currentSelected.preview?.edge_box_source_id) {
            previewConfig.value.edgBoxServerIp = currentSelected.preview.edge_box_ip
            previewConfig.value.source_id = currentSelected.preview.edge_box_source_id
            previewConfig.value.edge_box_access_key = currentSelected.preview.edge_box_access_key
            previewConfig.value.edge_box_access_secret = currentSelected.preview.edge_box_access_secret
            currentStream.value = ''
            streamType.value = 'directwebrtc'
        } else {
            currentStream.value = currentSelected?.url || ''
            streamType.value = 'auto'
        }
    }else if (currentSelected?.algorithm_source === 'YOLO'){
      if(currentSelected.preview?.yolo_url)  {
        previewConfig.value = {
            edgBoxServerIp: '',
            source_id: '',
            edge_box_access_key: '',
            edge_box_access_secret: ''
        }
        currentStream.value = currentSelected.preview.yolo_url
        streamType.value = 'img'
      } else {
        currentStream.value = currentSelected?.url || ''
        streamType.value = 'auto'
      }
    } else {
        currentStream.value = currentSelected?.url || ''
        streamType.value = 'auto'
    }
}

// 查看模型详情
const modelDetailVisible = ref(false)
const detailModel = ref({
    modelName:'',
    model:''
})
const openModelDetail = (modelType) => {
//   detailModel.value.modelName = currentCanModel.value.find(item => item.value === modelType)?.label || ''
//   detailModel.value.model = modelType
  modelDetailVisible.value = true
}

// ========== 算法配置相关 ==========
const algorithmConfigVisible = ref(false);
const algorithmConfigLoading = ref(false);
const algorithmFormRef = ref();
const algorithmModelParams = ref<any>({});
const algorithmSceneTypesOptions = ref<any[]>([]);

// 算法配置相关数据
const algorithmCurrentCamera = ref<any>({});
const algorithmRegionTree = ref<any[]>([]);
const algorithmRiskFactorsOptions = ref<any[]>([]);

// ========== 权限验证相关 ==========
const AUTH_CODE = 'ylh@123'; // 内置权限校验码
const isAuthVerified = ref(false); // 是否已验证通过
const authModalVisible = ref(false); // 权限验证弹窗状态
const authCodeInput = ref(''); // 用户输入的权限码
const authError = ref(''); // 验证错误信息

// 打开算法配置弹窗
const openAlgorithmConfig = async () => {
    console.log(currentSelected.value,'currentSelected.value')
   if(!currentSelected.value?.stream_id) {
      message.warning('请先选择摄像头');
      return;
   }
   // 如果已经验证通过，直接打开配置弹窗
   if(isAuthVerified.value) {
      openAlgorithmConfigModal();
      return;
   }
   
   // 否则打开权限验证弹窗
   authCodeInput.value = '';
   authError.value = '';
   authModalVisible.value = true;
};

// 权限验证确认
const handleAuthConfirm = () => {
   if(!authCodeInput.value) {
      authError.value = '请输入权限码';
      return;
   }
   
   if(authCodeInput.value === AUTH_CODE) {
      isAuthVerified.value = true;
      authModalVisible.value = false;
      authCodeInput.value = '';
      authError.value = '';
      // 验证通过后打开配置弹窗
      openAlgorithmConfigModal();
   } else {
      authError.value = '权限码错误，请重新输入';
   }
};

// 权限验证取消
const handleAuthCancel = () => {
   authModalVisible.value = false;
   authCodeInput.value = '';
   authError.value = '';
};

// 打开算法配置弹窗的实际逻辑
const openAlgorithmConfigModal = async () => {
   // 获取摄像头详情
   try {
      const cameraId = currentSelected.value.camera_id || currentSelected.value.stream_id;
      if(!cameraId) {
         message.error('摄像头ID不存在');
         return;
      }
      
      const res = await getCameraList({ camera_id: cameraId });
      const cameras = (res as any).data?.cameras || [];
      
      if(!cameras || cameras.length === 0) {
         message.error('获取摄像头详情失败');
         return;
      }
      
      algorithmCurrentCamera.value = cameras[0];
      algorithmConfigVisible.value = true;
   } catch (error) {
      console.error('加载算法配置失败:', error);
      message.error('加载算法配置失败');
   }
};

// 确认算法配置
const handleAlgorithmConfigOk = async () => {
   try {
      await algorithmFormRef.value?.validate();
      const formData = algorithmFormRef.value?.getFormData();
      
      algorithmConfigLoading.value = true;
      
      await editCamera({ camera_id: formData.camera_id, ...formData });
      message.success('算法配置保存成功');
      
      algorithmConfigVisible.value = false;
      algorithmCurrentCamera.value = {};
      
      // 重新加载视频列表
      getVideoList();
   } catch (error: any) {
      if (error?.message) {
         message.error(error.message);
      } else {
         message.error('算法配置保存失败');
      }
   } finally {
      algorithmConfigLoading.value = false;
   }
};

// 取消算法配置
const handleAlgorithmConfigCancel = () => {
   algorithmConfigVisible.value = false;
   algorithmCurrentCamera.value = {};
};
// ========== 算法配置相关结束 ==========

// 视频全屏
const isFullscreen = ref(false)
const videoContainerRef = ref(null)
const isAlarmFlashing = ref(false) // 报警闪烁状态
const toggleVideoFullscreen = () => {
     if (!isFullscreen.value) {
        if(videoContainerRef.value){
            isFullscreen.value = true
            enterFullscreen(videoContainerRef.value)
        }
     }else{
        isFullscreen.value = false
        // 退出全屏
        exitFullscreen()
     }

}

onMounted(() => {
    getVideoList()
    sseConnection = setupSSE()

    enhancedAudioPlayer?.clearAllCache()
    // 初始化音频播放器
    initAudioPlayer().catch(error => {
        console.error('初始化音频播放器失败:', error)
    })
    setVolume(1.0);

    // 边缘盒子
    getEdgeBoxModel().then((res:any) => {
        edgeBoxModel.value = res.data
    })

    // 初始化算法配置相关数据
    getAllTypeList().then(res => {
        algorithmSceneTypesOptions.value = res;
    });
    
    // 获取算法参数配置
    getModelConfig().then((res: any) => {
        algorithmModelParams.value = (res as any).data || {};
    });
    
    // 获取危险因素列表
    getDangerList({
        page:1,
        page_size:9999,
        search_keyword:''
    }).then((res: any) => {
        algorithmRiskFactorsOptions.value = (res as any).data?.risk_factors.map((item: any) => ({ value: item.factor_id, label: item.factor_name })) || [];
    });
    
    // 获取区域列表
    getRegionList({
        include_hierarchy: true
    }).then((res: any) => {
        algorithmRegionTree.value = (res as any).data.hierarchy || [];
    });
})

// 组件销毁时关闭SSE连接并清理blob URL和事件监听器
onUnmounted(() => {
    if (sseConnection) {
        sseConnection.close()
    }
    
    clearCache()
    // 清除音频播放器
    // 完全停止所有音频播放
    stopAudioCompletely()
    enhancedAudioPlayer?.clearAllCache()
})
onBeforeMount(async () => {
  const data = await getAllTypeList()
  typeList.value = data
})
</script>

<style scoped lang="scss">
.action-recognit-container{
    font-family: Source Han Sans CN;
    /* Webkit浏览器滚动条样式 */
    &::-webkit-scrollbar {
        height: 8px;
        background-color: #f5f5f5;
    }
    
    &::-webkit-scrollbar-track {
        background-color: #f2f6fa;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #0058FD;
        border-radius: 4px;
        
        &:hover {
            background-color: #0047cc;
        }
    }
    
    /* Firefox滚动条样式 */
    scrollbar-width: thin;
    scrollbar-color: #0058FD #f2f6fa;
}
.back-icon{
   &:hover{
        color: var(--tr-suggestion-primary-color) !important;
    }
}
.card-panel{
    background: #FFFFFF;
    box-shadow: 0px 0px 3px 0px rgba(211,211,211,0.36);
    border-radius: 12px;
}
.active-video-item{
    background-color: #0058FD;
    color:#fff;
}

/* 横向滚动条样式 */
.capture-scroll-container{
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
}

/* 抓拍记录项样式 */
.capture-item {
    background: #f0f6faa8;
    flex-shrink: 0;
    overflow: hidden;
    white-space: normal;
    word-break: break-word;
    width: 140px;
}
.current-time{
    display: flex;
    align-items: center;
    &::after{
        content: ' ';
        display: block;
        width: 1px;
        height: 10px;
        background-color: #666;
        margin-left: 5px;
    }
}
:deep(.ant-tree .ant-tree-node-content-wrapper .ant-tree-iconEle){
    height: fit-content;
    line-height: 1;
}
:deep(.ant-tree .ant-tree-node-content-wrapper){
    display: flex;
    align-items: center;
}
:deep(.ant-tree){
    background: transparent;
}
:deep(.ant-checkbox-group){
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
:deep(.ant-checkbox-wrapper) {
    margin-right: 0 !important;
    // white-space: nowrap;
    color: #333;
    display: flex;
    align-items: center;
}
:deep(.ant-tree .ant-tree-switcher),
:deep(.ant-tree .ant-tree-indent-unit)
{
    width: 8px;
}

.video-type-selector{
    :deep(.ant-radio-wrapper){
        color: #ffffff;
        font-size: 14px;
    }
}

/* 指标卡片样式 */
.metric-card {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #0058fd;
}

.metric-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 4px;
    text-align: center;
}

.metric-value {
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
    text-align: center;
}

.metric-value.error-rate {
    color: #dc2626;
}

.metric-card:hover .metric-label {
    color: #0058fd;
}

.metric-card:hover .metric-value.error-rate {
    color: #b91c1c;
}
</style>
<style>

/* 报警红色边框闪烁动画 */
@keyframes alarm-flash-border {
    0%, 100% {
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
    }
    50% {
        box-shadow: 0 0 15px 5px rgba(255, 0, 0, 0.9);
    }
}

@keyframes alarm-flash-inset {
    0%, 100% {
        box-shadow: inset 0 0 0 0 rgba(255, 0, 0, 0);
    }
    50% {
        box-shadow: inset 0 0 5px 5px rgba(255, 0, 0, 0.6);
    }
}

.alarm-flash {
    animation: alarm-flash-border 0.5s ease-in-out infinite;
}

/* 使用伪元素实现内阴影覆盖层 */
.alarm-flash::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    pointer-events: none;
    animation: alarm-flash-inset 0.5s ease-in-out infinite;
    border-radius: 8px;
}

/* 通知消息报警闪烁效果 */
.alarm-flash-notification {
    animation: alarm-flash-border 0.5s ease-in-out infinite;
}

/* .alarm-flash-notification .ant-notification-notice-content {
    animation: alarm-flash-inset 0.5s ease-in-out infinite;
} */

</style>
