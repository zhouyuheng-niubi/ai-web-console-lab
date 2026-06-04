<template>
    <div class="action-recognit-container relative pt-[10px] flex flex-col 
    box-border w-[100%] h-[100%] bg-[#F8FAFC]">
        <!-- pl-[30px] pr-[33px]  -->
        <!-- <div class="w-full flex items-center justify-between">
            <div>
                <div class="font-bold text-[22px] text-[#454F64] leading-1">视频流智能识别监测</div>
                <div class="font-400 text-[14px] text-[#717B92] leading-1 mb-[20px]">各种场景下的视频流实时监测分析与事件监测预警</div>
            </div>
        </div> -->
         <div class="flex justify-between w-full pb-[10px]
          mx-auto flex-1 overflow-y-auto">
            <div class="bg-[#fff] rounded-[15px] card-panel h-full box-border py-2 mr-4 px-4 flex flex-col" style="flex:0.17">
                <div class="text-[18px] text-[#576075] leading-1 mb-[10px]">视频列表</div>
                <div class="w-full min-w-[200px] flex-1 overflow-auto box-border pl-[15px]">
                        <div class="bg-[#e0edfa5b] rounded-[6px] p-[10px] h-full overflow-y-auto tree-loading">
                            <Spin :spinning="intailSpini" tip="加载中..." size="large" class="h-full min-h-[200px]">
                                <Tree v-model:selectedKeys="selectedKeys" @select="onTreeSelect"
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
                        <Button  @click="stopAnalysis(currentSelected?.stream_id, true)" class="mr-[5px]">停止布控</Button>
                    </div>

                    <!-- <div class="bg-[#0058FD] text-[#fff] 
                    rounded-[10px] flex items-center pl-[18px]
                     pr-[16px] py-[5px] cursor-pointer" @click="refreshVideoList">
                        <SyncOutlined style="font-size: 18px" />
                        <span class="text-[14px] leading-1 pl-[2px]">刷新</span>
                    </div> -->
                </div>
                <div class="font-400 text-[16px] text-[#717B92] leading-1 mb-[10px]  mt-[8px]">
                    
                    <template v-if="checkedList">
                        <div class="">选择算法：<Checkbox v-model:checked="checkedAll" @change="changeModel">全选</Checkbox></div>
                        <div class="flex flex-wrap">
                            <CheckboxGroup v-model:value="checkedList" @change="changeModel" :options="typeList">
                            </CheckboxGroup>
                        </div>
                    </template>
                    <!-- <span v-for="item,index in typeList" :key="index" 
                    :class="{'bg-[#0058FD] !text-[#fff]':currentModelList.has(item.value)}"
                    class="mr-[10px] cursor-pointer border-[1px] border-[#0058FD]
                    px-[10px] py-[4px] rounded-[10px] text-[#0058FD] leading-none text-[14px] mt-[10px]"
                    @click="changeModel(item)"
                    >{{ item.label }}</span> -->
                </div>
                <div class="w-full flex-1 overflow-y-auto overflow-x-hidden relative z-[1]">
                    
                    <!-- 视频流实时标志 -->
                    <div class="absolute top-[10px] right-[10px] z-[100]">
                        <div class="text-[14px] text-[#fff] leading-none">live</div>
                    </div>
                    <div class="flex items-center justify-end w-full text-[12px] absolute bottom-[20px]
                     right-[10px] left-[10px] text-[#fff] video-type-selector" style="z-index: 999;">
                        <span class="text-[#fff]">播放类型：</span>
                        <RadioGroup v-model:value="streamType" @change="changeStreamType">
                            <Radio :value="type.value" v-for="type,type_index in streamTypeArr" :key="type_index">
                                {{type.label}}
                            </Radio>
                        </RadioGroup>
                    </div>

                    <VideoPlayer :video-url="currentStream" :video-type="streamType">
                    </VideoPlayer>
                    <!-- 加载loading -->
                    <Spin :spinning="videoSpin" tip="视频切换中..." size="large" class="absolute top-0 left-0 right-0 
                    bottom-0 flex items-center justify-center z-[100] bg-[#00000080]">
                    </Spin>
                </div>
                <div class="mt-[10px] flex items-center justify-between">
                    <div class="text-[16px] font-[500] text-[#576075]">抓拍记录(<span class="text-[#DD6A0C]">{{ currentCaptureType === 1? capturePage?.total :currentCaptureList?.length }}</span>条)</div>
                    <div class="types flex items-center text-[14px] text-[#576075]">
                        <div class="mr-[5px] cursor-pointer current-time leading-none" :class="{'text-[#0058FD]':currentCaptureType === 0}"
                        @click="changeCapureType(0)"
                        >当前</div>
                        <div class="mr-[5px] cursor-pointer leading-none"
                            :class="{'text-[#0058FD]':currentCaptureType === 1}"
                            @click="changeCapureType(1)">全部</div>
                            
                        <!-- <div class="cursor-pointer leading-none ml-[10px] flex items-center"
                            :class="{'text-[#0058FD]':autoScrollCapture}"
                            @click="toggleAutoScrollCapture">
                            <span>自动滚动</span>
                            <div class="w-[10px] h-[10px] ml-[4px] rounded-full" :class="{'bg-[#0058FD]':autoScrollCapture, 'bg-[#717B92]':!autoScrollCapture}"></div>
                        </div> -->
                    </div>
                </div>
                <div class="capture-scroll-container w-full h-[180px]" ref="captureContainerRef">
                    <Spin :spinning="captureSpin">
                        <div class="mt-[10px] flex w-fit gap-5 " v-if="currentCaptureList?.length">
                            <div v-for="item,index in currentCaptureList" :key="item.id" 
                            class="capture-item h-[150px] flex flex-col items-center">
                                <Image :src="item?.imageUrl || 'https://www.antdv.com/#error'" 
                                    style="width:140px; height: 90px;object-fit: cover;" 
                                    />
                                <div class="text-[12px] font-[400] text-[#717B92] w-full whitespace-nowrap overflow-hidden text-ellipsis">
                                    【{{item.scene_name}}】{{ item.detection_result }}
                                </div>
                                <div class="text-[12px] font-[400] text-[#717B92]">
                                {{ item.detection_time}}
                                </div>
                            
                            </div>
                            <!-- 加载更多指示器
                            <div v-if="capturePage && capturePage.value && capturePage.value.isLoading" class="capture-item h-[150px] flex flex-col items-center justify-center">
                                <div class="w-[140px] h-[90px] flex items-center justify-center bg-gray-100 rounded">
                                    <div class="text-[12px] text-gray-500">加载中...</div>
                                </div>
                            </div>
                            <div v-else-if="capturePage && capturePage.value && capturePage.value.hasNext" class="capture-item h-[150px] flex flex-col items-center justify-center">
                                <div class="w-[140px] h-[90px] flex items-center justify-center bg-gray-100 rounded cursor-pointer" @click="loadMoreCapture">
                                    <div class="text-[12px] text-gray-500">加载更多</div>
                                </div>
                            </div> -->
                        </div>
                        <img src="@/assets/empty.png" class="w-[120px] block mx-auto mt-[15px]" v-else />                                             
                    </Spin>
                </div>
            </div>
            <!-- 报警事件信息 -->
            <div class="bg-[#fff] rounded-[15px] ml-4 card-panel
             h-full box-border py-2 px-4 min-w-[300px] flex flex-col" style="flex:0.24">
                <div class="flex justify-between items-center">
                    <div class="text-[18px] text-[#576075]">报警记录(
                        <span class="text-[#DD6A0C] text-[24px]">{{currentWarnType === 1? warnPage?.total :currentWarnList?.length}}</span>条)
                    </div>
                    <div class="types flex items-center text-[14px] text-[#576075]">
                        <div class="mr-[5px] cursor-pointer current-time leading-none" :class="{'text-[#0058FD]':currentWarnType === 0}"
                        @click="changeWarnType(0)"
                        >当前</div>
                        <div class="mr-[5px] cursor-pointer leading-none"
                            :class="{'text-[#0058FD]':currentWarnType === 1}"
                            @click="changeWarnType(1)">全部</div>
                        <!-- <div class="cursor-pointer leading-none ml-[10px] flex items-center"
                            :class="{'text-[#0058FD]':autoScrollMessage}"
                            @click="toggleAutoScrollMessage">
                            <span>自动滚动</span>
                            <div class="w-[10px] h-[10px] ml-[4px] rounded-full" :class="{'bg-[#0058FD]':autoScrollMessage, 'bg-[#717B92]':!autoScrollMessage}"></div>
                        </div> -->
                    </div>
                </div>
                <div class="search-container mt-[10px] text-[14px]">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="whitespace-nowrap">选择算法： <Checkbox v-model:checked="searchcheckedAll" @change="changeSearch">全选</Checkbox></span>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="flex flex-wrap gap-2">
                                <CheckboxGroup v-model:value="searchParams.checkedList" :options="typeList"  @change="changeSearch">
                                </CheckboxGroup>                            
                            </div>
                        </div>
                    </div>
                    <div class="w-full" v-if="currentWarnType === 1">
                        <div class="flex mt-[5px] pb-[5px]">
                            <span class="whitespace-nowrap text-[#576075]">报警时间：</span>
                            <RangePicker 
                                v-model:value="searchParams.warnTime" 
                                show-time 
                                size="small"  
                                @change="changeSearch"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                :disabled-date="disabledDate"
                                :allowClear="false"
                            />
                        </div>
                        <!-- <div class="flex mt-[5px]">
                            <span class="whitespace-nowrap text-[#576075]">报警地点：</span>
                            <Input placeholder="请输入报警地点" v-model:value="searchParams.place" 
                            size="small" class="flex-1"></Input>
                        </div> -->
                        <!-- <div class="flex mt-[5px]">
                            <span class="whitespace-nowrap text-[#576075]">处理状态：</span>
                            <RadioGroup v-model:value="searchParams.status">
                                <Radio :value="item.value" v-for="item,index in statusArray" :key="index">{{item.label}}</Radio>
                            </RadioGroup>
                        </div> -->
                    </div>
                </div>
                <div class="message-container overflow-hidden flex-1
                 overflow-y-auto" ref="messageContainerRef">
                    <Spin :spinning="hisSpin" tip="加载中..." size="large">
                        <!-- border-[1px] border-[#D95446] rounded-[6px] bg-[#FFFDFC]
                        py-[12px] px-[16px] mt-[14px] flex relative -->
                        <div class="rounded-[6px] bg-[#F2F5FA] py-[12px] px-[16px] mt-[14px] relative" 
                        v-for="item,index in currentWarnList" :key="item.id">
                         <img src="@/assets/action/new-message.png" class="absolute right-[-4px] top-[-4px]" v-if="index === 0" />
                            <!-- <div class="flex justify-between items-center mb-[4px]">
                                <div class="text-[14px] font-[500] text-[#576075] leading-none">{{item.scene_name}}检测</div>
                                <div class="bg-[#FF6D6D] text-[#fff] px-[4px] py-[4px] rounded-[2px] text-[12px] leading-none">未处理</div>
                            </div> -->
                            
                            <div class="relative">
                                <Image :src="item?.imageUrl || 'https://www.antdv.com/#error'" 
                                 style="width: 100%;height: auto;max-height: 200px;"
                                />
                                <div class="absolute text-[#ff1c27] px-[4px] py-[4px] leading-none rounded-[10px] text-[12px]
                                 top-0 left-0 bg-[#0000008f]">{{item.scene_name}}</div>
                            </div>
                            
                            <div class="flex-1">
                               
                                <div class="">
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
                                        <span class="ml-[2px]">视频来源：</span>
                                        <span>{{ item?.stream_name }}</span>
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
                        <img src="@/assets/empty.png" class="w-[40%] block mx-auto mt-[25%]" v-if="!currentWarnList?.length" /> 
                    </Spin>
                </div>
            </div>
         </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted,onBeforeUnmount, onUnmounted, nextTick,computed,onBeforeMount,watch} from 'vue';
import { Image,Spin,Tree,Checkbox,CheckboxGroup,Input,Radio,RadioGroup, RangePicker,Button, message} from 'ant-design-vue';

import type { Dayjs } from 'dayjs';
type RangeValue = [Dayjs, Dayjs];

import { useRouter } from 'vue-router';
import VideoPlayer from '@/components/videoPlayer/VideoPlayer.vue'
import videoIcon from '@/assets/action/icon-video.png';
import videoIconA from '@/assets/action/icon-video-a.png';
import warningIcon from '@/assets/action/warning-icon.png';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; 
import type { TreeProps } from 'ant-design-vue';
import {AlertOutlined,FieldTimeOutlined,EnvironmentOutlined} from '@ant-design/icons-vue'
import {getAllTypeList} from '@/utils/constSeting'
import {getAvailVideoList,getAlarmList,startAnalysisApi,stopAnalysisApi,updateVideoStream} from '@/api/warn/index'
import { v4 as uuidv4 } from 'uuid'
import { useMenuStore } from '@/store';
import fireAlert from '@/assets/audio/fire-alert.mp3'
import normalAlert from '@/assets/audio/normal-alert.mp3'
// 返回
const streamType = ref('rtsp')
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
const backFn = () => {
  router.go(-1)
}
const currentLine = ref(0)
const intailSpini = ref(true)
const hisSpin = ref(false)
const videoList = ref([])

const currentStream = ref('')
const currentSelected = ref({})
const selectedKeys = ref([''])
const expandedKeys = ref([])
const treeData = ref<TreeProps['treeData']>([])


const messageInfo = ref([])
const currentWarnList = ref([])
const messageContainerRef = ref(null)
const videoSpin = ref(false)
const openVideo = (index:number) => {
    currentLine.value = index
    // 获取历史消息
    getWarnEvent(videoList.value[index]?.stream_id)
}
// 选择模型
const checkedAll = computed({
    get: () => {
        return checkedList.value.length === typeList.value.length 
    },
    set: (value) => {
        checkedList.value = value?  typeList.value.map(item => item.value) : []
    }
})

const searchcheckedAll = computed({
    get: () => {
        return searchParams.value.checkedList.length ===  typeList.value.length 
    },
    set: (value) => {
        searchParams.value.checkedList = value ? typeList.value.map(item => item.value) : []
        // 手动触发搜索以更新列表
        changeSearch()
    }
})


const checkedList = ref([''])
// const currentModelList = ref(new Set(['enter']))
// const changeModel = (model:string) => {
//     if(currentModelList.value.has(model.value)) {
//         currentModelList.value.delete(model.value)
//     }else{
//         currentModelList.value.add(model?.value)
//     }
// }
const currentModelName = computed(() => {
    const newValue =checkedList.value[checkedList.value.length -1]
    const label = typeList.value.find(item => item.value === newValue)?.label
    return label
})

// 获取所有非叶子节点的key
const getAllNodeKeys = (nodes) => {
    const keys = []
    if (!nodes) return keys
    
    nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
            keys.push(node.key)
            keys.push(...getAllNodeKeys(node.children))
        }
    })
    return keys
}

// 展开/折叠事件
const onExpand = (expandedKeysValue) => {
    expandedKeys.value = expandedKeysValue
}

// 选择树型结构
const onTreeSelect = async (selectedKeys, {selected, selectedNodes, node, event}) => {
    // 新的视频流节点
   videoSpin.value = true
    if(currentSelected.value?.stream_id && currentSelected.value?.stream_id !== selectedNodes[0]?.stream_id) stopAnalysis(currentSelected.value?.stream_id)
    currentSelected.value = selectedNodes[0]
    captureList.value = []
    messageInfo.value = []
    currentWarnList.value = []
    currentCaptureList.value = []
    currentCaptureType.value = 0
    currentWarnType.value = 1
    // startAnalysis()
    startFlag.value = false
    // 更新报警数据
    changeSearch()

    const res = await updateVideoList()
    let url = ''
    videoSpin.value = false
    if(res?.data?.stream_configs){
        for(const key in res?.data?.stream_configs){
            if(key === selectedNodes[0]?.stream_id){
                const leaf = res?.data?.stream_configs[key]
                if(streamType.value === 'hls') currentStream.value = leaf?.iot_info?.play_urls?.hls
                else if(streamType.value === 'rtsp')currentStream.value = leaf?.iot_info?.play_urls?.rtsp
                currentSelected.value.scenes = leaf?.scenes || []
                checkedList.value = leaf?.scenes || []
                return
            }
        }        
    }
    // 默认情况
    if(selectedNodes[0]?.url){
        checkedList.value = currentSelected.value?.scenes || []
        currentStream.value = url? url: streamType.value === 'hls'? selectedNodes[0]?.iot_info?.play_urls?.hls : selectedNodes[0]?.iot_info?.play_urls?.rtsp 
    }
    
}
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
                // startAnalysis()
                if(streamType.value === 'hls') currentStream.value = firstLeaf.iot_info?.play_urls?.hls
                else if(streamType.value === 'rtsp')currentStream.value = firstLeaf.iot_info?.play_urls?.rtsp

                captureList.value = []
                messageInfo.value = []
                currentWarnList.value = []
                currentCaptureList.value = []

                // // 请求记录
                // hisSpin.value = true
                // currentWarnList.value = await getWarnEvent(currentSelected.value?.stream_id)
                // hisSpin.value = false
                // // 添加滚动监听器
                // nextTick(() => {
                //     const container = messageContainerRef.value
                //     if (container) {
                //         container.addEventListener('scroll', debouncedHandleWarnScroll)
                //     }
                // })
                searchParams.value.checkedList = typeList.value.map(item => item.value)
                initWarnEvent()
                // 捕获记录
                currentCaptureType.value = 0
                

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
    // startAnalysis()
    if(startFlag.value) {
        stopAnalysis(currentSelected.value?.stream_id)
        startAnalysis()
    }
}


// 获取历史消息
const searchParams = ref({
    checkedList:[],
    place:'',
    status:'',
    warnTime:[dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')]
})

const disabledDate = (current) => {
    if (!current) return false;
    
    // 统一日期格式进行比较[6](@ref)
    const currentDateStr = current.format('YYYY-MM-DD HH:mm:ss');
    const todayStr = dayjs().format('YYYY-MM-DD HH:mm:ss');
    
    // 禁用未来日期
    if (currentDateStr > todayStr) {
        return true;
    }
    
    return false;
};
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

const warnPage = ref({
    currentPage:1,
    pageSize:5,
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
            stream_id,
            message_type:'exception_result',
            scene_types:searchParams.value.checkedList.join(',')
        }
        if(searchParams.value.warnTime?.length){
            params.start_time = dayjs(searchParams.value.warnTime[0]).format('YYYY-MM-DD HH:mm:ss')
            params.end_time = dayjs(searchParams.value.warnTime[1]).format('YYYY-MM-DD HH:mm:ss')
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
            
            const arr = []
            reversedData.forEach(({data}) => {
                // const imageUrl = data.base64_image ? base64ToBlobUrl(data.base64_image) : ''
                const params = {
                    ...data,
                    time: data.detection_time,
                    title: data.scene_name,
                    status: data.level,
                    imageUrl: data.base64_image,
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
const currentCaptureList = ref([])//当前记录
const captureSpin = ref(false)
const captureContainerRef = ref(null)

// 自动滚动相关变量
const autoScrollCapture = ref(false) // 抓拍记录自动滚动
const autoScrollMessage = ref(false) // 事件信息自动滚动

// 抓拍记录自动滚动
const startCaptureAutoScroll = () => {
    if (!autoScrollCapture.value) return
    
    const container = captureContainerRef.value
    if (container) {
        const scrollWidth = container.scrollWidth
        const clientWidth = container.clientWidth
        const maxScrollLeft = scrollWidth - clientWidth
        
        if (maxScrollLeft > 0) {
            let currentScroll = 0
            const scrollInterval = setInterval(() => {
                if (!autoScrollCapture.value || currentScroll >= maxScrollLeft) {
                    clearInterval(scrollInterval)
                    return
                }
                currentScroll += 2
                container.scrollLeft = currentScroll
                
                // 滚动到最右边后回到左边
                if (currentScroll >= maxScrollLeft) {
                    setTimeout(() => {
                        container.scrollLeft = 0
                        currentScroll = 0
                    }, 2000)
                }
            }, 50)
        }
    }
}

// 事件信息自动滚动
const startMessageAutoScroll = () => {
    if (!autoScrollMessage.value) return
    
    const container = messageContainerRef.value
    if (container) {
        const scrollHeight = container.scrollHeight
        const clientHeight = container.clientHeight
        const maxScrollTop = scrollHeight - clientHeight
        
        if (maxScrollTop > 0) {
            let currentScroll = 0
            const scrollInterval = setInterval(() => {
                if (!autoScrollMessage.value || currentScroll >= maxScrollTop) {
                    clearInterval(scrollInterval)
                    return
                }
                currentScroll += 1
                container.scrollTop = currentScroll
                
                // 滚动到底部后回到顶部
                if (currentScroll >= maxScrollTop) {
                    setTimeout(() => {
                        container.scrollTop = 0
                        currentScroll = 0
                    }, 2000)
                }
            }, 100)
        }
    }
}

// 切换自动滚动状态
const toggleAutoScrollCapture = () => {
    autoScrollCapture.value = !autoScrollCapture.value
    if (autoScrollCapture.value) {
        startCaptureAutoScroll()
    }
}

const toggleAutoScrollMessage = () => {
    autoScrollMessage.value = !autoScrollMessage.value
    if (autoScrollMessage.value) {
        startMessageAutoScroll()
    }
}

// 监听容器变化，重新开始自动滚动
// watch(captureList, () => {
//     nextTick(() => {
//         if (autoScrollCapture.value) {
//             startCaptureAutoScroll()
//         }
//     })
// })

// watch(messageInfo, () => {
//     nextTick(() => {
//         if (autoScrollMessage.value) {
//             startMessageAutoScroll()
//         }
//     })
// })

const capturePage = ref({
    currentPage:1,
    pageSize:8,
    total:0,
    hasNext:false,
    isLoading:false
})

// 分页加载更多抓拍记录
const loadMoreCapture = async () => {
    if (!capturePage?.value || capturePage.value.isLoading || !capturePage.value.hasNext || currentCaptureType.value !== 1) {
        return
    }
    
    capturePage.value.isLoading = true
    capturePage.value.currentPage += 1
    
    try {
        const newData = await getCaptureList(currentSelected.value?.stream_id, true)
        if (newData && newData.length > 0) {
            currentCaptureList.value = [...currentCaptureList.value, ...newData]
        }
    } catch (error) {
        console.error('加载更多抓拍记录失败:', error)
        if (capturePage?.value) {
            capturePage.value.currentPage -= 1 // 加载失败时回退页码
        }
    } finally {
        if (capturePage?.value) {
            capturePage.value.isLoading = false
        }
    }
}

// 滚动事件监听器
const handleCaptureScroll = () => {
    console.log('添加滚动监听',currentCaptureType.value)
    if (currentCaptureType.value !== 1) return
    
    const container = captureContainerRef.value
    if (!container) return
    
    const scrollLeft = container.scrollLeft
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    
    // 当滚动到右侧80%的位置时触发加载更多
    const maxScrollLeft = scrollWidth - clientWidth
    const scrollThreshold = maxScrollLeft - clientWidth * 0.8
    
    if (scrollLeft >= scrollThreshold && maxScrollLeft > 0 && capturePage?.value && !capturePage.value.isLoading && capturePage.value.hasNext) {
        loadMoreCapture()
    }
}

// 防抖函数
const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
}

// 防抖后的滚动处理
const debouncedHandleScroll = debounce(handleCaptureScroll, 200)

// 分页加载更多报警记录
const loadMoreWarn = async () => {
    if (!warnPage?.value || warnPage.value.isLoading || !warnPage.value.hasNext || currentWarnType.value !== 1) {
        return
    }
    
    warnPage.value.isLoading = true
    warnPage.value.currentPage += 1
    
    try {
        const newData = await getWarnEvent(currentSelected.value?.stream_id, true)
        if (newData && newData.length > 0) {
            currentWarnList.value = [...currentWarnList.value, ...newData]
        }
    } catch (error) {
        console.error('加载更多报警记录失败:', error)
        if (warnPage?.value) {
            warnPage.value.currentPage -= 1 // 加载失败时回退页码
        }
    } finally {
        if (warnPage?.value) {
            warnPage.value.isLoading = false
        }
    }
}

// 报警记录滚动事件监听器
const handleWarnScroll = () => {
    if (currentWarnType.value !== 1) return
    
    const container = messageContainerRef.value
    if (!container) return
    
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    
    // 当滚动到底部80%的位置时触发加载更多
    const maxScrollTop = scrollHeight - clientHeight
    const scrollThreshold = maxScrollTop - clientHeight * 0.8
    if (scrollTop >= scrollThreshold && maxScrollTop > 0 && warnPage?.value && !warnPage.value.isLoading && warnPage.value.hasNext) {
        loadMoreWarn()
    }
}

// 防抖后的报警记录滚动处理
const debouncedHandleWarnScroll = debounce(handleWarnScroll, 200)

const getCaptureList = async (stream_id:string, isLoadMore = false) => {
    try{
        const params:any = {
            stream_id:stream_id,
            message_type:'detection_result',
            page_size:capturePage.value.pageSize,
            page:capturePage.value.currentPage
        }

        const {data,code} = await getAlarmList(params)
        if(code === 200) {
            console.log('stream_id',stream_id)
            console.log('获取的捕获消息:', data)
            const reversedData = data.messages
            const {has_next,total_count,total_pages} = data.pagination
            console.log(has_next,'是否有下一页')
            console.log(total_count,'总条数')
            console.log(total_pages,'总页数')
            
            capturePage.value.total = total_count
            capturePage.value.hasNext = has_next
            
            const arr = []
            reversedData.map(({data}) => {
                // const imageUrl = data.base64_image ? base64ToBlobUrl(data.base64_image) : ''
                const params = {
                    ...data,
                    time: data.detection_time,
                    title: data.scene_name,
                    status: data.level,
                    imageUrl: data.base64_image, // 存储转换后的blob URL
                    id: data.id || uuidv4() 
                }
                arr.push(params)
            })
            return arr
        }
    }
    catch(e){
        if (!isLoadMore) {
            captureSpin.value = false
        }
        console.error('获取捕获记录失败:', e)
        return []
    }
}



let sseConnection = null
// 滚动到最新消息
const scrollToLatestMessage = () => {
    if(autoScrollMessage.value) return
    setTimeout(() => {
        const container = messageContainerRef.value
        if (container) {
            container.scrollTop = 0 // 因为最新消息在数组开头，所以滚动到顶部
        }
    })
}
// 滚动到最左侧
const scrollToLeft = () => {
    if(autoScrollCapture.value) return
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
    console.log('stream_id:',data.stream_id)
    console.log('currentSelected.value?.stream_id:',currentSelected.value?.stream_id)

    if(data.stream_id !== currentSelected.value?.stream_id) return
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
        time: data.detection_time,
        title: data.scene_name,
        status: data.level,
        imageUrl: data.base64_image, // 存储转换后的blob URL 
        id: data.id || uuidv4()
    }
    // 添加新消息到数组开头（最新消息在最上面）
    if(type === 'exception_result') {
        messageInfo.value.unshift(params)
        // 更新总条数
        warnPage.value.total = warnPage.value.total + 1

        // 更新当前报警列表
        if(currentWarnType.value === 0) {
            currentWarnList.value = messageInfo.value
        }
    }
    else {
        captureList.value.unshift(params)
        // 更新总条数
        capturePage.value.total = capturePage.value.total + 1
        // 更新当前捕获列表
        if(currentCaptureType.value === 0) {
            currentCaptureList.value = captureList.value
        }
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
                // 火焰烟雾
                if(['fire_detection', 'smoke_detection'].includes(data.data.scene_type)){
                    playAudio('fireAlert')
                }
                else {
                    // 其他报警
                    playAudio('normalAlert')
                }
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
const playAudio = (audioFileName:string) => {
    if(adudioElement) {
        adudioElement.pause()
        adudioElement = null
    }
    let audioSrc = audioFileName === 'fireAlert' ? fireAlert : normalAlert
    adudioElement = new Audio(audioSrc)
    adudioElement.play()
    adudioElement.onended = () => {
        audioSrc = ''
    }
}


const currentCaptureType = ref(0)
const changeCapureType = (type) => {
    
    if(currentCaptureType.value === 1) {
        clearCache('currentCaptureList')
        scrollToLeft() //重置滚动条
    }
    currentCaptureType.value = type
    
}
const currentWarnType = ref(1)
const changeWarnType = (type) => {
    if(currentWarnType.value === 1) {
        clearCache('currentWarnList')
        scrollToLatestMessage() //重置滚动条
    }
    currentWarnType.value = type
    if(currentWarnType.value === 1) {
        searchParams.value.checkedList = typeList.value.map(item => item.value)
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
        hide()
        
        // 重置状态
        // 重置列表数据
        clearCache()
        // 重置分页信息
        warnPage.value = {
            currentPage: 1,
            pageSize: 5,
            total: 0,
            hasNext: false,
            isLoading: false
        }
        
        capturePage.value = {
            currentPage: 1,
            pageSize: 8,
            total: 0,
            hasNext: false,
            isLoading: false
        }
        currentWarnType.value = 1
        currentCaptureType.value = 0
        // 请求记录
        // hisSpin.value = true
        // currentWarnList.value = await getWarnEvent(currentSelected.value?.stream_id)
        // hisSpin.value = false
        searchParams.value.checkedList = typeList.value.map(item => item.value)
        initWarnEvent()
    }
    catch(e){
        hide()
    }

    

    
}
// 停止分析
const stopAnalysis = async (stream_id?:string,changeFlag?:boolean) => {
    await stopAnalysisApi({
        stream_id: stream_id || null
    })
   if(changeFlag) startFlag.value = false
}
watch(currentCaptureType,async () => {
    if(currentCaptureType.value === 0) {
        currentCaptureList.value = captureList.value
        return
    }
    if(currentCaptureType.value === 1) {
        // 重置分页状态
        capturePage.value.currentPage = 1
        capturePage.value.hasNext = false
        capturePage.value.isLoading = false
        
        captureSpin.value = true
        const data = await getCaptureList(currentSelected.value?.stream_id)
        currentCaptureList.value = data || []
        captureSpin.value = false
        
        // 添加滚动监听
        nextTick(() => {
            const container = captureContainerRef.value
            if (container) {
                container.addEventListener('scroll', debouncedHandleScroll)
            }
        })
    }
})

watch(currentWarnType,async () => {
    if(currentWarnType.value === 0) {
        // 切换到当前模式时移除滚动监听器
        const container = messageContainerRef.value
        if (container) {
            container.removeEventListener('scroll', debouncedHandleWarnScroll)
        }
        return currentWarnList.value = messageInfo.value
    }
    if(currentWarnType.value === 1) {
        searchParams.value.checkedList = typeList.value.map(item => item.value)
        initWarnEvent()
    }
})


const initWarnEvent = async () => {
    // 重置分页状态
    warnPage.value.currentPage = 1
    warnPage.value.hasNext = false
    warnPage.value.isLoading = false
    // 初始化时设置全选状态，并确保checkedList同步更新
    hisSpin.value = true
    currentWarnList.value = await getWarnEvent(currentSelected.value?.stream_id)
    hisSpin.value = false
    
   
    // 添加滚动监听器
    nextTick(() => {
        const container = messageContainerRef.value
        if (container) {
            container.addEventListener('scroll', debouncedHandleWarnScroll)
        }
    })
}


const changeSearch = async() => {
    hisSpin.value = true
    if(currentWarnType.value === 1){
        if(searchParams.value.warnTime?.length < 2){
            return message.error('请选择时间范围')
        }
        // 比较时间范围是否小于2天
        if(
            dayjs(searchParams.value.warnTime[1]).diff(dayjs(searchParams.value.warnTime[0]), 'day') >= 2
        )
        { 
            message.error('时间范围不能超过2天')
            return
        }
        


        // 重置分页状态
        scrollToLatestMessage()
        clearCache('currentWarnList')
        // warnPage.value.currentPage = 1
        // warnPage.value.hasNext = false
        // warnPage.value.isLoading = false
        // currentWarnList.value = await getWarnEvent(currentSelected.value?.stream_id)
        // // 添加滚动监听器
        // nextTick(() => {
        //     const container = messageContainerRef.value
        //     if (container) {
        //         container.addEventListener('scroll', debouncedHandleWarnScroll)
        //     }
        // })
        initWarnEvent()
    }
    else{
        currentWarnList.value = currentWarnList.value.filter(item => checkedList.value.includes(item.scene_type))
    }
    
    hisSpin.value = false
}

const clearCache = (
    onlyKey?:string
) => {
    switch(onlyKey){
        case 'currentCaptureList':
            if(currentCaptureList.value?.length){
                    currentCaptureList.value.forEach(msg => {
                        if (msg?.imageUrl && msg?.imageUrl.startsWith('blob:')) {
                            URL.revokeObjectURL(msg.imageUrl)
                            
                        }
                    })
                    currentCaptureList.value = []
                }
            break

        case 'currentWarnList':
            if(currentWarnList.value?.length){
                    currentWarnList.value.forEach(msg => {
                        if (msg?.imageUrl && msg?.imageUrl.startsWith('blob:')) {
                            URL.revokeObjectURL(msg.imageUrl)
                            
                        }
                    })
                    currentWarnList.value = []
                }
            break
        default:
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
                if(currentCaptureList.value?.length){
                    currentCaptureList.value.forEach(msg => {
                        if (msg?.imageUrl && msg?.imageUrl.startsWith('blob:')) {
                            URL.revokeObjectURL(msg.imageUrl)
                            
                        }
                    })
                    currentCaptureList.value = []
                }
                if(currentWarnList.value?.length){
                    currentWarnList.value.forEach(msg => {
                        if (msg?.imageUrl && msg?.imageUrl.startsWith('blob:')) {
                            URL.revokeObjectURL(msg.imageUrl)
                            
                        }
                    })
                    currentWarnList.value = []
                }
            break
    }
}


onMounted(() => {
    getVideoList()
    sseConnection = setupSSE()
})

// 组件销毁时关闭SSE连接并清理blob URL和事件监听器
onUnmounted(() => {
    if (sseConnection) {
        sseConnection.close()
    }
    
    // 清理滚动事件监听器
    const container = captureContainerRef.value
    if (container) {
        container.removeEventListener('scroll', debouncedHandleScroll)
    }
    
    // 清理报警记录滚动事件监听器
    const warnContainer = messageContainerRef.value
    if (warnContainer) {
        warnContainer.removeEventListener('scroll', debouncedHandleWarnScroll)
    }
    clearCache()
    
})
onBeforeUnmount(() => {
    stopAnalysis()
    console.log('组件销毁-执行停止分析')
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
    white-space: nowrap;
}
:deep(.ant-tree .ant-tree-switcher),
:deep(.ant-tree .ant-tree-indent-unit)
{
    width: 8px;
}
:deep(.ant-checkbox-wrapper){
    color: #333;
}
// .tree-loading{
//     :deep(.ant-spin-nested-loading){
//         margin-top: 30px;
//     }
// }

.video-type-selector{
    :deep(.ant-radio-wrapper){
        color: #ffffff;
        font-size: 14px;
    }
}
</style>

