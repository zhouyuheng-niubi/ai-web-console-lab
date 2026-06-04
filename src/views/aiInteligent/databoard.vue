<template>
  <div class="dashboard-container flex flex-col relative">
    <header class="dashboard-header">
      <img src="@/assets/action/title-bg.png" class="w-full" />
      <h1 class="header-title absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">人工智能监测平台</h1>
    </header>
    <!-- 其他管理 -->
    <!-- <div class="other-manage absolute top-[50px] left-[40px]">
      <div class="cursor-pointer border-[1px] border-[#00D2FF] text-[14px] text-[#00D2FF]
      rounded-[8px] px-[10px] py-[4px]" @click="handleOtherManageClick">工序流程</div>
    </div> -->
    <div class="dashboard-content flex-1 overflow-auto">
      <aside class="left-panel">
        <!-- 告警趋势 -->
        <div class="panel-section">
          <div class="section-header">
            今近7日告警趋势
          </div>
          <div class="chart-container">
            <canvas ref="trendChart" class="trend-chart"></canvas>
          </div>
        </div>

        <!-- 告警类型排行 -->
        <div class="panel-section">
          <div class="section-header">
            告警类型排行
          </div>
          <div class="ranking-list px-[10px]">
            <div class="ranking-item" v-for="item in rankings" :key="item.name">
              <span class="ranking-label">{{ item.name }}</span>
              <div class="ranking-bar">
                <div class="ranking-progress" :style="{ width: item.percentage + '%' }"></div>
              </div>
              <span class="ranking-value">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- 告警统计 -->
        <div class="panel-section">
          <div class="section-header">
            告警统计
          </div>
          <div class="stats-container px-[10px]">
            <div class="stat-item">
              <div class="stat-icon">
                <img src="@/assets/action/alert-icon.png" class="w-[85px] h-[79px]" alt="告警图标" />
              </div>
              <div class="stat-content">
                <div class="stat-label">本Maintainer告警</div>
                <div class="stat-value">3773<span class="unit">条</span></div>
                <div class="stat-compare">环比（上Maintainer无数据）</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                 <img src="@/assets/action/alert-icon.png" class="w-[85px] h-[79px]" alt="告警图标" />
              </div>
              <div class="stat-content">
                <div class="stat-label">本月告警</div>
                <div class="stat-value">3773<span class="unit">条</span></div>
                <div class="stat-compare">环比（上月无数据）</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 接入状态 -->
        <div class="panel-section">
          <div class="section-header">
            接入状态
          </div>
          <div class="access-status px-[10px]">
            <div class="status-icon">
              <img src="@/assets/action/connection.png" class="w-[85px] h-[79px]" alt="告警图标" />
            </div>
            <div class="status-info">
              <div class="status-label">已启用/上限</div>
              <div class="status-value">{{selectedVideos?.length || 0}} / {{MAX_VIDEO_COUNT}}</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Center Panel -->
      <main class="center-panel">
        <!-- Video Area -->
        <div class="video-section">
          <div class="video-header">
            <div class="flex">
              <div class="video-tabs flex-1">
                <span class="tab active">数据源:</span>
                <!-- :maxTagCount="1" -->
                <TreeSelect
                  v-model:value="selectedRegionKey"
                  show-search
                  style="flex:1; margin-left: 10px;min-width: 280px;"
                  :dropdown-style="{ 
                    maxHeight: '400px', 
                    overflow: 'auto',
                    
                  }"
                  :tree-data="videoTreeData"
                  placeholder="请选择区域"
                  allow-clear
                  tree-default-expand-all
                  @change="handleVideoChange"
                  class="dark-theme-treeselect"
                  :field-names="{label: 'title', value: 'key'}"
                  multiple
                  tree-checkable
                  :maxCount="MAX_VIDEO_COUNT"
                />
              </div>
              <!-- 算法选择区域 -->
              <!-- <div class="algorithm-selection ml-[5px]" v-if="selectedVideos.length > 0">
                <div class="text-[14px] text-[#00d4ff] flex items-center">
                  <span class="mr-3">选择算法：</span>
                  <Select
                    v-model:value="checkedList"
                    mode="multiple"
                    placeholder="请选择算法"
                    style="width: 280px"
                    :options="typeList"
                    @change="changeModel"
                    :max-tag-count="1"
                    allowClear
                  />
                </div>
              </div> -->

              <!-- 开始布控按钮 -->
              <!-- <div @click="startAnalysis" class="ml-3 cursor-pointer border-[1px] border-[#00D2FF] text-[14px] text-[#00D2FF]
              rounded-[6px] px-[10px] py-[4px]" v-if="!startFlag">开始布控</div>
              <div class="flex items-center ml-3 mr-[5px] cursor-pointer border-[1px] border-[#00D2FF] text-[14px] text-[#00D2FF]
              rounded-[6px] px-[10px] py-[4px]" @click="stopAnalysis()"  v-else>
                停止布控
              </div> -->
            </div>


            <div class="video-controls">
              <!-- <span class="control-text">{{ selectedVideos.length }}分屏</span> -->
               <!-- 全屏 -->
              <ArrowsAltOutlined @click="toggleVideoFullscreen" class="cursor-pointer text-[18px] text-[#00D2FF]"/>
            </div>
          </div>
          <div 
            ref="videoContainer"
            class="video-container" 
            v-if="selectedVideos.length > 0"
            :class="getVideoContainerClass(selectedVideos.length)"
          >
            <div class="corner-bl"></div>
            <div class="corner-br"></div>
            <div 
              class="video-frame relative" 
              v-for="(video, index) in selectedVideos" 
              :key="video.key || index"
              :class="getVideoFrameBorderClass(index, selectedVideos.length)"
              @mouseenter="showPanel(index)"
              @mouseleave="hidePanel(index)" 
            >
              <div class="absolute top-0 h-[40px] w-full 
              flex  pl-[10px] z-[999] bg-[rgba(3,17,50,0.56)]" 
                v-show="video.showPanel">
                <div class="leading-[40px]">数据源： <span >{{ video.title }}</span></div>
                <div class="ml-[8px] relative">
                  <div 
                    class="cursor-pointer flex leading-[40px] items-center"
                    @mouseenter="showAlgorithmList(index)"
                    @mouseleave="hideAlgorithmList(index)"
                  >
                    算法：
                    <div class="text-[#00d4ff] flex items-center">
                      <span>
                        {{ video.scene_names?.[0] || '--' }}
                        <span class="text-[#bbb] text-[12px]">{{ video.scene_names?.length > 1 ? `等${video.scene_names?.length}个` : '' }}</span>

                      </span>
                        <!-- 算法选择列表 -->
                        <div 
                          v-show="video.showAlgorithmList"
                          class="algorithm-dropdown"
                        >
                          <div 
                            v-for="item in typeList" 
                            :key="item.value"
                            class="algorithm-item"
                            @click.stop="selectScene(index, item)"
                          >
                            <span class="text-[#fff]" :class="{'!text-[#00d4ff]': video.scenes.includes(item.value)}">{{ item.label }}</span>
                            <CloseOutlined v-if="video.scenes.includes(item.value)" @click.stop="removeScene(index, item)"
                            class="text-[#00d4ff]" />
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div class="pl-[8px] pr-[10px] relative leading-[40px] flex-1 flex justify-end">
                  <div 
                    v-if="!video.isAnalyzing" 
                    @click="startSingleAnalysis(index)" 
                    class="start-analysis cursor-pointer text-[14px] text-[#00D2FF]"
                  >
                    开始布控
                  </div>
                  <div 
                    v-else 
                    @click="stopSingleAnalysis(index)" 
                    class="start-analysis cursor-pointer text-[14px] text-[#FF4D4F]"
                  >
                    停止布控
                  </div>
                </div>
              </div>
              <VideoPlayer 
                :videoUrl="video.url" 
                :videoType="'auto'"
                :videoId="video.key"
                videobg="#021A40"
                @error="handleVideoError(video.key,index)"
              />
            </div>
          </div>
          <div ref="videoContainer" class="video-container" v-else>
            <div class="corner-bl"></div>
            <div class="corner-br"></div>
            <div class="video-frame empty-state">
              <div class="empty-content">
                <div class="empty-icon">📹</div>
                <div class="empty-text">请选择数据源</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Stats -->
        <div class="bottom-stats">
          <div class="section-header" style="background-image: url('/src/assets/action/home-title-big.png');">
            今日告警统计
          </div>
          <div class="stats-cards px-[15px] pb-[10px]">
            <div class="stat-card flex items-center">
              <div class="card-icon">
                <img src="@/assets/action/alert-icon.png" class="w-[85px] h-[79px]" alt="告警图标" />
              </div>
              <div class="ml-[5px]">
                <div class="card-label">今日告警总数</div>
                <div class="card-value red">1323<span class="unit">条</span></div>                
              </div>

            </div>
            <div class="stat-card flex items-center">
              <div class="card-icon">
                <img src="@/assets/action/alert-icon.png" class="w-[85px] h-[79px]" alt="告警图标" />
              </div>
              <div class="ml-[5px]">
                <div class="card-label">今日已处理</div>
                <div class="card-value green">0<span class="unit">条</span></div>                
              </div>

            </div>
            <div class="stat-card flex items-center">
              <div class="card-icon">
                <img src="@/assets/action/alert-icon.png" class="w-[85px] h-[79px]" alt="告警图标" />
              </div>
              <div class="ml-[5px]">
                <div class="card-label">今日未处理</div>
                <div class="card-value orange">1323<span class="unit">条</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Right Panel - 告警记录模块 -->
      <aside class="right-panel bg-[#0C234D]">
        <div class="panel-section full-height">
          <div class="section-header flex items-center justify-between pr-[12px]">
            <div>最新告警</div>
            <div class="">
              <Button class="control-btn" size="small" @click="handleMoreClick">
                更多
              </Button>
            </div>
          </div>
          <!-- 最新告警内容 -->
          <div class="message-container overflow-hidden flex-1 overflow-y-auto" ref="messageContainerRef">
            <Spin :spinning="hisSpin" tip="加载中..." size="large" class="h-[100%]">
              <div 
                class="py-[12px] px-[16px] mb-[14px] relative warn-card cursor-pointer" 
                v-for="item,index in currentWarnList" 
                :key="item.id"
                @click="showAlarmDetail(item)"
              >
                <div class="corner-bl"></div>
                <div class="corner-br"></div>
                <img 
                  src="@/assets/action/new-message.png" 
                  class="absolute right-[-4px] top-[-4px]" 
                  v-if="index === 0" 
                />
                <div class="relative">
                  <img 
                    :src="item?.imageUrl || 'https://www.antdv.com/#error'" 
                    style="width: 100%;height: auto;max-height: 200px;object-fit: cover;"
                  />
                  <div class="absolute text-[#ff1c27] px-[4px] py-[4px] leading-none rounded-[10px] text-[12px] top-0 left-0 bg-[#0000008f]">
                    {{item.scene_name}}
                  </div>
                </div>
                
                <div class="flex-1">
                  <div class="">
                    <div class="text-[14px] leading-none text-[#0290fb] mt-[5px] flex items-center">
                      <FieldTimeOutlined />
                      <span class="ml-[2px]">报警时间：</span>
                      <span>{{ item?.detection_time }}</span>
                    </div>
                    <div class="text-[14px] leading-none text-[#0290fb] mt-[5px] flex items-center">
                      <AlertOutlined />
                      <span class="ml-[2px]">报警原因：</span>
                      <span>{{ item?.detection_result }}</span>
                    </div>
                    <div class="text-[14px] text-[#0290fb] leading-none mt-[5px] flex items-center">
                      <EnvironmentOutlined />
                      <span class="ml-[2px]">视频来源：</span>
                      <span>{{ item?.stream_name }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!currentWarnList?.length" class="h-[100%] min-h-[500px] pt-[20%]">
                <img 
                  src="@/assets/empty.png" 
                  class="w-[40%] block mx-auto"    
                />               
              </div>

            </Spin>
          </div>

          <!-- 告警详情模态框 -->
          <div 
            v-if="showAlarmModal" 
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="closeAlarmDetail"
          >
            <div 
              class="bg-[#1a2332] rounded-lg overflow-hidden w-[1000px] h-[80vh]"
              @click.stop
            >
              <AlarmDetail 
                :alarm-data="selectedAlarm"
                :image-url="selectedAlarm?.imageUrl"
                @close="closeAlarmDetail"
                @confirm="handleConfirm"
                @falseAlarm="handleFalseAlarm"
                @reset="handleReset"
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, onUnmounted,h } from 'vue'
import { Button, TreeSelect, Spin, Image,notification, Select, message } from 'ant-design-vue'
import {  FieldTimeOutlined, AlertOutlined, EnvironmentOutlined,ArrowsAltOutlined,CloseOutlined, CheckOutlined } from '@ant-design/icons-vue'
import VideoPlayer from '@/components/videoPlayer/VideoPlayer.vue'
import { getAlarmList, startAnalysisApi, stopAnalysisApi,getAvailVideoList,updateVideoStream } from '@/api/warn/index'
import AlarmDetail from '@/components/alarmDetail/index.vue'
import { v4 as uuidv4 } from 'uuid'
import { getAllTypeList } from '@/utils/constSeting'
import { useRouter } from 'vue-router'
import fireAlert from '@/assets/audio/fire-alert.mp3'
import normalAlert from '@/assets/audio/normal-alert.mp3'

const router = useRouter()

// 开始布控相关变量
const startFlag = ref(false)
const typeList = ref([])
const checkedList = ref([])
const messageInfo = ref([])
const captureList = ref([])
const currentCaptureList = ref([])
const capturePage = ref({
  currentPage:1,
  pageSize:8,
  total:0,
  hasNext:false,
  isLoading:false
})
const currentCaptureType = ref(0)



const trendChart = ref(null)
const videoContainer = ref(null)
const rankings = ref([
  { name: '未穿工作服', value: 1135, percentage: 100 },
  { name: '区域入侵', value: 1011, percentage: 89 },
  { name: '人数预警', value: 502, percentage: 44 },
  { name: '未戴安全帽', value: 423, percentage: 37 }
])

// 区域相关数据
const videoTreeData = ref([])
const selectedRegionKey = ref(undefined)
const selectedVideos = ref([])

// 告警记录相关数据
const currentWarnList = ref([])
const messageContainerRef = ref(null)
const hisSpin = ref(true)
const MAX_VIDEO_COUNT = 9

// 告警详情模态框相关数据
const showAlarmModal = ref(false)
const selectedAlarm = ref(null)

// 全屏相关变量
const isFullscreen = ref(false)
const fullscreenElement = ref(null)
const loadVideoTree = async () => {
  try {
    await updateVideoStream()
    const {data,code} = await getAvailVideoList()
    if(code === 200) {
      videoTreeData.value = data
      setDefaultSelectedNode(data)
    }

  } catch (error) {
    console.error('获取区域列表失败:', error)
  }
}

// 设置默认选中最后一级的第一个节点
const setDefaultSelectedNode = (treeData) => {
  if (!treeData || treeData.length === 0) return
  
  // 递归查找最后一个层级的第一个叶子节点
  const findLastLevelFirstLeaf = (nodes) => {
    if (!nodes || nodes.length === 0) return null
    for (const node of nodes) {
      if (!node.children || node.children.length === 0) {
        return node
      }
      const leaf = findLastLevelFirstLeaf(node.children)
      if (leaf) {
        return leaf
      }
    }
    return null
  }
  
  const defaultNode = findLastLevelFirstLeaf(treeData)
  if (defaultNode) {
    selectedRegionKey.value = [defaultNode.key]
    handleVideoChange([defaultNode.key], [defaultNode.title], {})
  }
}

// 区域选择变更处理
const handleVideoChange = async (value, label, extra) => {
  console.log('Selected value:', value)
  console.log('Selected label:', label)
  console.log('Selected extra:', extra)
  console.log('selectedVideos:', selectedVideos.value)
  // 如果当前正在全局布控，先停止全局布控
  // if (startFlag.value) {
  //   stopAnalysis()
  // }
  
  // 如果没有选择任何视频，清空列表
  if (!value || (Array.isArray(value) && value.length === 0)) {
    // 对于当前正在布控的视频，先停止布控
    for (const video of selectedVideos.value) {
      if (video.isAnalyzing) {
        try {
          await stopAnalysisApi({
            stream_id: video.nodeData.stream_id
          })
        } catch (e) {
          console.error('停止布控失败:', e)
        }
      }
    }
    selectedVideos.value = []
    return
  }

  // 如果有triggerValue且未选中，则停止布控
  if(extra.triggerValue && !extra.checked){
    let obj = selectedVideos.value.find(v => v.key === extra.triggerValue)
    if(obj && obj.isAnalyzing){
      stopAnalysisApi({
        stream_id: obj.nodeData.stream_id
      })
    }
  }


  
  // 创建一个新的视频列表，保留原有视频的布控状态
  const newSelectedVideos = []
  const selectedNodes = []
  
  // 处理多选情况
  if (Array.isArray(value)) {
    value.forEach(selectedKey => {
      const node = findNodeById(videoTreeData.value, selectedKey)
      if (node) {
        selectedNodes.push(node)
      }
    })
    
    // 根据选择的区域过滤告警记录
    if (selectedNodes.length > 0) {
      filterAlertsByMultipleRegions(selectedNodes)
      
      // 处理视频展示，最多显示9个视频
      for (const node of selectedNodes.slice(0, MAX_VIDEO_COUNT)) {
        // 查找是否已经在当前选中的视频中
        const existingVideo = selectedVideos.value.find(v => v.key === node.key)
        if (existingVideo) {
          // 保留原有的布控状态和其他属性
          newSelectedVideos.push(existingVideo)
        } else {
          // 新增的视频，初始化布控状态为false
          newSelectedVideos.push({
            key: node.key,
            title: node.title,
            url: node.url || node.stream_url || node.video_url,
            path: getNodePath(videoTreeData.value, node.key),
            nodeData: node,
            scenes: node.scenes || [],
            scene_names: node.scene_names ? node.scene_names : [],
            selectedScene: node.scenes ? node.scenes : [],
            showAlgorithmList: false,
            isAnalyzing: false,
            showPanel: false,
          })
        }
      }
  
      
      selectedVideos.value = newSelectedVideos
      // 设置默认算法：合并所有选中视频的scenes，去重后赋值
      const allScenes = new Set()
      selectedNodes.forEach(node => {
        if (node && node.scenes) {
          const scenes = Array.isArray(node.scenes) ? node.scenes : []
          scenes.forEach(scene => allScenes.add(scene))
        }
      })
      
      if (allScenes.size > 0) {
        checkedList.value = Array.from(allScenes)
      } else {
        checkedList.value = typeList.value.length > 0 ? [typeList.value[0].value] : []
      }
    }
  } 
  
  
  // else {
  //   // 单选模式：获取单个选中项的完整信息
  //   const selectedNode = findNodeById(videoTreeData.value, value[0])
  //   if (selectedNode) {
  //     filterAlertsByRegion(selectedNode)
      
  //     // 查找是否已经在当前选中的视频中
  //     const existingVideo = selectedVideos.value.find(v => v.key === selectedNode.key)
  //     if (existingVideo) {
  //       // 保留原有的布控状态和其他属性
  //       selectedVideos.value = [existingVideo]
  //     } else {
  //       // 新增的视频，初始化布控状态为false
  //       selectedVideos.value = [{
  //         key: selectedNode.key,
  //         title: selectedNode.title,
  //         url: selectedNode.url || selectedNode.stream_url || selectedNode.video_url,
  //         path: getNodePath(videoTreeData.value, value[0]),
  //         nodeData: selectedNode,
  //         scenes: selectedNode.scenes || [],
  //         scene_names: selectedNode.scene_names ? selectedNode.scene_names : [],
  //         showAlgorithmList: false,
  //         isAnalyzing: false
  //       }]
  //     }
      
  //     // 对于不再选中的视频，如果正在布控则停止布控
  //     for (const oldVideo of selectedVideos.value) {
  //       if (oldVideo.key !== selectedNode.key && oldVideo.isAnalyzing) {
  //         try {
  //           await stopAnalysisApi({
  //             stream_id: oldVideo.nodeData.stream_id
  //           })
  //           // 更新状态
  //           oldVideo.isAnalyzing = false
  //         } catch (e) {
  //           console.error('停止布控失败:', e)
  //         }
  //       }
  //     }
      
  //     // 设置默认算法：从选中的视频获取scenes
  //     if (selectedNode.scenes) {
  //       checkedList.value = Array.isArray(selectedNode.scenes) ? selectedNode.scenes : []
  //     } else {
  //       checkedList.value = typeList.value.length > 0 ? [typeList.value[0].value] : []
  //     }
      
  //     console.log('选中的视频列表:', selectedVideos.value)
  //     console.log('设置的默认算法:', checkedList.value)
  //   }
  // }
}


// 根据key查找节点
const findNodeById = (nodes, targetKey) => {
  for (const node of nodes) {
    console.log('findNodeById', node)
    if (node.key === targetKey) {
      return node
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, targetKey)
      if (found) return found
    }
  }
  return null
}

// 获取完整路径
const getNodePath = (nodes, targetKey, currentPath = []) => {
  for (const node of nodes) {
    const newPath = [...currentPath, { 
      key: node.key, 
      title: node.title 
    }]
    
    if (node.key === targetKey) {
      return newPath
    }
    
    if (node.children && node.children.length > 0) {
      const path = getNodePath(node.children, targetKey, newPath)
      if (path.length > 0) {
        return path
      }
    }
  }
  return []
}

// 根据选择的区域过滤告警记录
const filterAlertsByRegion = (regionNode) => {
  // 如果有区域ID，重新获取该区域的告警数据
  if (regionNode.stream_id) {
    getAlarmRecords({ stream_id: regionNode.stream_id, page_size: 10 })
  }
}

// 根据多个选择的区域过滤告警记录
const filterAlertsByMultipleRegions = (videoNodes) => { 
  const stream_ids = videoNodes
    .filter(node => node.stream_id)
    .map(node => node.stream_id)
  if (stream_ids.length > 0) {
    getAlarmRecords({ stream_id: stream_ids.join(','), page_size: stream_ids.length > 1 ? 50 : 10 })
  }
}

// 统一获取告警记录的函数
const getAlarmRecords = async (options = {}) => {
  const {
    stream_id = null,
    page = 1,
    page_size = 10,
    message_type = 'exception_result'
  } = options

  try {
    hisSpin.value = true
    const params = {
      page,
      page_size,
      message_type,
      ...(stream_id && { stream_id })
    }
    
    const { data, code } = await getAlarmList(params)
    
    if (code === 200) {
      const warnList = data.messages || []
      const formattedList = warnList.map(({ data }) => ({
        ...data,
        time: data.detection_time,
        title: data.scene_name,
        status: data.level,
        imageUrl: data.base64_image,
        id: data.id || uuidv4()
      }))
      currentWarnList.value = formattedList
    }
  } catch (error) {
    const errorMsg = stream_id 
      ? (Array.isArray(stream_id) ? '获取多个区域告警记录失败' : '获取区域告警记录失败')
      : '获取告警记录失败'
    console.error(errorMsg, error)
  } finally {
    hisSpin.value = false
  }
}

// 获取视频容器样式类名
const getVideoContainerClass = (videoCount) => {
  if (videoCount === 1) return 'single-video';
  if (videoCount === 2) return 'two-videos';
  if (videoCount === 4) return 'four-videos';
  if (videoCount === 6) return 'six-videos';
  if (videoCount >= 9) return 'nine-videos';
  // 默认返回适合的布局
  if (videoCount === 3) return 'three-videos';
  if (videoCount === 5) return 'five-videos';
  if (videoCount === 7) return 'seven-videos';
  if (videoCount === 8) return 'eight-videos';
  return 'single-video';
}

// 获取视频帧边框类名
const getVideoFrameBorderClass = (index, videoCount) => {
  // 获取行列数
  const { cols, rows } = getGridDimensions(videoCount);
  
  // 计算当前帧的行列位置（从1开始）
  const col = (index % cols) + 1;
  const row = Math.floor(index / cols) + 1;
  
  const classes = [];
  
  // 不是最右列，添加右边框
  if (col < cols) {
    classes.push('border-r');
  }
  
  // 不是最底行，添加底边框
  if (row < rows) {
    classes.push('border-b');
  }
  
  // 添加边框颜色类
  classes.push('border-[#1D95FF]/50');
  
  return classes.join(' ');
}

// 获取网格维度
const getGridDimensions = (videoCount) => {
  switch (videoCount) {
    case 1: return { cols: 1, rows: 1 };
    case 2: return { cols: 2, rows: 1 };
    case 3: return { cols: 2, rows: 2 };
    case 4: return { cols: 2, rows: 2 };
    case 5: return { cols: 3, rows: 2 };
    case 6: return { cols: 3, rows: 2 };
    case 7: return { cols: 3, rows: 3 };
    case 8: return { cols: 3, rows: 3 };
    case 9: return { cols: 3, rows: 3 };
    default: return { cols: 3, rows: 3 };
  }
}

// SSE连接用于实时接收告警
let sseConnection = null

// 处理检测结果消息
const handleDetectionResult = (data, type) => {
  if (type === 'exception_result') {
    const params = {
      ...data,
      time: data.detection_time,
      title: data.scene_name,
      status: data.level,
      imageUrl: data.base64_image,
      id: data.id || uuidv4()
    }
    
     notification.open({
        message: '最新告警信息',
        duration: 5,
        description: h('div', [
          // 图片元素
          h(Image, {
            src: data.base64_image, // 示例图片
            alt: '报警图片',
            style: { width: '100%', height: 'auto', marginTop: '8px', borderRadius: '4px' }
          }),
          h('p', null, `报警时间:${data.detection_time}`),
          // 补充文本 + 自定义按钮
          h('div', { style: { marginTop: '4px'} }, [
            h('span', null, `报警原因:${data.detection_result}`),
          ])
        ]),
        class: 'notification-custom-class',
      });


    // 添加新消息到数组开头（最新消息在最上面）
    currentWarnList.value.unshift(params)
    // 火焰烟雾
    if(['fire_detection', 'smoke_detection'].includes(data.scene_type)){
        playAudio('fireAlert')
    }
    else {
        // 其他报警
        playAudio('normalAlert')
    }
    // 限制列表长度为500条
    if (currentWarnList.value.length > 500) {
      currentWarnList.value.pop()
    }
  }
}

// 建立SSE连接
const setupSSE = () => {
  const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/sse/events`)
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'exception_result') {
        handleDetectionResult(data.data, 'exception_result')
      }
    } catch (e) {
      console.error('解析SSE消息失败:', e)
    }
  }
  
  // 触发报警事件监听
  eventSource.addEventListener('exception_result', function(event) {
    try {
      const data = JSON.parse(event.data)
      console.log('触发报警事件:', data)
      if (data.data) {
        handleDetectionResult(data.data, 'exception_result')
      }
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

onBeforeMount(async () => {
  const data = await getAllTypeList()
  typeList.value = data
  loadVideoTree()
})

onMounted(() => {
  drawTrendChart()
  sseConnection = setupSSE()
  
  // 添加全屏状态监听
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
})

// 组件销毁时关闭SSE连接
onUnmounted(() => {
  if (sseConnection) {
    sseConnection.close()
  }
  // 停止分析
  stopAnalysis(false)
  // 清理缓存
  clearCache()
  
  // 移除全屏状态监听
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
})

const handleMoreClick = () => {
  router.replace({
    path: '/warn-list'
  })
}
const handleOtherManageClick = () => {
  router.push({
    path: '/other-module',
    query: {
      type: 'process-flow-recognize'
    }
  })
}

// 开始布控
const startAnalysis = async () => {
  if(!selectedVideos.value || selectedVideos.value.length === 0) {
    message.error({
      message: '请先选择数据源',
      duration: 3
    })
    return
  }
  
  const hide = message.loading('开始分析中...', 0)
  try{
    const streamIds = selectedVideos.value.map(video => video.nodeData.stream_id).filter(id => id)
    if(streamIds.length === 0) {
      hide()
      notification.error({
        message: '所选数据源无效',
        duration: 3
      })
      return
    }

    // 为每个选中的视频启动分析
    for(const stream_id of streamIds) {
      await startAnalysisApi({
        stream_id,
        scenes: checkedList.value
      })
    }
    
    startFlag.value = true
    hide()
    notification.success({
      message: '布控成功',
      duration: 3
    })
  }
  catch(e){
    hide()
    notification.error({
      message: '布控失败',
      duration: 3
    })
    console.error('布控失败:', e)
  }
}

// 停止分析
const stopAnalysis = async (notify = true) => {
  try{
    const streamIds = selectedVideos.value.map(video => video.nodeData.stream_id).filter(id => id)
    if(streamIds.length > 0) {
      for(const stream_id of streamIds) {
        await stopAnalysisApi({
          stream_id
        })
      }
    }
    startFlag.value = false
    if(notify){
      notification.success({
        message: '停止布控成功',
        duration: 3
      })
    }
  } catch(e) {
    if(notify){
      notification.error({
        message: '停止布控失败',
        duration: 3
      })
    }
    console.error('停止布控失败:', e)
  }
}

// 更改模型选择
const changeModel = () => {
  if(startFlag.value) {
    stopAnalysis()
  }
}

// 清理缓存函数
const clearCache = (onlyKey) => {
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

// 显示告警详情
const showAlarmDetail = (alarm) => {
  selectedAlarm.value = alarm
  showAlarmModal.value = true
}

// 关闭告警详情
const closeAlarmDetail = () => {
  showAlarmModal.value = false
  selectedAlarm.value = null
}

// 确认告警处理
const handleConfirm = (data) => {
  console.log('确认告警处理:', data)
  closeAlarmDetail()
}

// 标记为误报
const handleFalseAlarm = (data) => {
  console.log('标记为误报:', data)
  closeAlarmDetail()
}

// 重置操作
const handleReset = () => {
  console.log('重置操作')
  
}

const drawTrendChart = () => {
  if (!trendChart.value) return
  
  const canvas = trendChart.value
  const ctx = canvas.getContext('2d')
  const width = canvas.width = canvas.offsetWidth
  const height = canvas.height = canvas.offsetHeight
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height)
  
  // Data points
  const data = [1500, 800, 1200, 2300, 1800, 500, 1200]
  const labels = ['12-05', '12-07', '12-08', '12-09', '12-10', '12-11', '12-12']
  const max = 2500
  
  // Draw grid lines
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = height * 0.9 - (height * 0.7 * i / 5)
    ctx.beginPath()
    ctx.moveTo(40, y)
    ctx.lineTo(width - 10, y)
    ctx.stroke()
  }
  
  // Draw Y-axis labels
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.font = '10px Arial'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 5; i++) {
    const y = height * 0.9 - (height * 0.7 * i / 5)
    const value = (max * i / 5).toFixed(0)
    ctx.fillText(value, 35, y + 3)
  }
  
  // Draw line chart
  const pointSpacing = (width - 60) / (data.length - 1)
  
  // Draw area gradient
  const gradient = ctx.createLinearGradient(0, height * 0.2, 0, height * 0.9)
  gradient.addColorStop(0, 'rgba(0, 200, 255, 0.4)')
  gradient.addColorStop(1, 'rgba(0, 100, 255, 0.0)')
  
  ctx.beginPath()
  ctx.moveTo(40, height * 0.9)
  
  data.forEach((value, index) => {
    const x = 40 + index * pointSpacing
    const y = height * 0.9 - (value / max) * height * 0.7
    if (index === 0) {
      ctx.lineTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  
  ctx.lineTo(40 + (data.length - 1) * pointSpacing, height * 0.9)
  ctx.closePath()
  ctx.fillStyle = gradient
  ctx.fill()
  
  // Draw line
  ctx.beginPath()
  ctx.strokeStyle = '#00d4ff'
  ctx.lineWidth = 2
  
  data.forEach((value, index) => {
    const x = 40 + index * pointSpacing
    const y = height * 0.9 - (value / max) * height * 0.7
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()
  
  // Draw points
  data.forEach((value, index) => {
    const x = 40 + index * pointSpacing
    const y = height * 0.9 - (value / max) * height * 0.7
    
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#00d4ff'
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
  })
  
  // Draw X-axis labels
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'
  labels.forEach((label, index) => {
    const x = 40 + index * pointSpacing
    ctx.fillText(label, x, height * 0.95)
  })
}

// 切换视频容器全屏
const toggleVideoFullscreen = () => {
  if (!isFullscreen.value) {
    // 进入全屏
    if (videoContainer.value) {
      enterFullscreen(videoContainer.value)
    }
  } else {
    // 退出全屏
    exitFullscreen()
  }
}

// 进入全屏
const enterFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.webkitRequestFullscreen) { /* Safari */
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) { /* IE11 */
    element.msRequestFullscreen()
  }
}

// 退出全屏
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen()
  }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement || 
                      !!document.webkitFullscreenElement || 
                      !!document.msFullscreenElement
}

// 语音播报
let adudioElement = null
const playAudio = (audioFileName) => {
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
// 显示顶部操作
const showPanel = (index) => {
  if (selectedVideos.value[index]) {
    selectedVideos.value[index].showPanel = true
  }
}
const hidePanel = (index) => {
  if (selectedVideos.value[index]) {
    selectedVideos.value[index].showPanel = false
  }
}


// 显示算法列表
const showAlgorithmList = (index) => {
  if (selectedVideos.value[index]) {
    selectedVideos.value[index].showAlgorithmList = true
  }
}

// 隐藏算法列表
const hideAlgorithmList = (index) => {
  if (selectedVideos.value[index]) {
    selectedVideos.value[index].showAlgorithmList = false
  }
}

// 选择场景
const selectScene = (index, scene) => {
  if (selectedVideos.value[index]) {
    // 更新选中的场景
    if(selectedVideos.value[index].scenes.includes(scene.value)) return
    selectedVideos.value[index].scenes.push(scene.value)
    selectedVideos.value[index].scene_names.push(scene.label)

    // 如果正在布控，则停止布控
    if (selectedVideos.value[index].isAnalyzing) {
      stopSingleAnalysis(index)
    }
  }
}

// 移除场景
const removeScene = (index, scene) => {
  if (selectedVideos.value[index]) {
    if (selectedVideos.value[index].scenes?.length === 1) return message.info('至少保留一个算法')
    let deleteIndex = selectedVideos.value[index].scenes.findIndex(s => s === scene.value)
    selectedVideos.value[index].scenes.splice(deleteIndex, 1)
    selectedVideos.value[index].scene_names.splice(deleteIndex, 1)

    // 如果正在布控，则停止布控
    if (selectedVideos.value[index].isAnalyzing) {
      stopSingleAnalysis(index)
    }
  }
}

// 处理视频错误
const handleVideoError = async (key,index) => {
  const {res:{data:{stream_configs}}} = await updateVideoStream()
  if(selectedVideos.value[index]?.url) selectedVideos.value[index].url = stream_configs[key].url
}

// 单个视频开始布控
const startSingleAnalysis = async (index) => {
  const video = selectedVideos.value[index]
  if (!video) return

  try {
    await startAnalysisApi({
      stream_id: video.nodeData.stream_id,
      scenes: video.scenes || []
    })
    video.isAnalyzing = true
    notification.success({
      message: '布控成功',
      duration: 3
    })
  } catch (e) {
    notification.error({
      message: '布控失败',
      duration: 3
    })
    console.error('布控失败:', e)
  }
}

// 单个视频停止布控
const stopSingleAnalysis = async (index) => {
  const video = selectedVideos.value[index]
  if (!video) return

  try {
    await stopAnalysisApi({
      stream_id: video.nodeData.stream_id
    })
    video.isAnalyzing = false
    notification.success({
      message: '停止布控成功',
      duration: 3
    })
  } catch (e) {
    notification.error({
      message: '停止布控失败',
      duration: 3
    })
    console.error('停止布控失败:', e)
  }
}</script>

<style scoped>

.dashboard-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #031031 0%, #031031 50%, #031031 100%);
  color: #fff;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  overflow-y: auto;
  box-sizing: border-box;
  /* Webkit浏览器滚动条样式 */
    &::-webkit-scrollbar {
        height: 8px;
        background-color: #f2f6fa4f;
    }
    
    &::-webkit-scrollbar-track {
        background-color: #f2f6fa4f;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #01d5ff93;
        border-radius: 4px;
        
        &:hover {
            background-color: #01d5ff93;
        }
    }
    
    /* Firefox滚动条样式 */
    scrollbar-width: thin;
    scrollbar-color: #01d5ff93 #021936;
}

/* Header */
.dashboard-header {
  position: relative;
  height: fit-content;
}

.header-logo {
  position: absolute;
  left: 20px;
  top: 20px;
  padding: 8px 16px;
  background: rgba(0, 150, 255, 0.2);
  border: 1px solid rgba(0, 200, 255, 0.5);
  font-size: 14px;
  color: #00d4ff;
}

.header-title {
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 8px;

}


/* Main Content */
.dashboard-content {
  display: flex;
  box-sizing: border-box;
  padding:10px 20px;
  gap: 20px;
}

/* Panel Sections */
.panel-section {
  background: rgba(0, 50, 100, 0.3);
  /* border: 1px solid rgba(0, 200, 255, 0.3); */
  /* border-radius: 4px; */
  /* padding: 15px; */
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.panel-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 200, 255, 0.5) 50%, transparent 100%);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 16px;
  color: #fff;
  position: relative;
  background-image: url('@/assets/action/home-title-smal.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 38px;
  padding-left: 10px;
}

.header-icon {
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #00d4ff 0%, #0066ff 100%);
  margin-right: 8px;
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.8);
}

.header-btn {
  margin-left: auto;
}

/* Left Panel */
.left-panel {
  width: 320px;
  overflow-y: auto;
}

.left-panel::-webkit-scrollbar {
  width: 4px;
}

.left-panel::-webkit-scrollbar-thumb {
  background: rgba(0, 200, 255, 0.3);
  border-radius: 2px;
}

/* Chart */
.chart-container {
  height: 180px;
}

.trend-chart {
  width: 100%;
  height: 100%;
}

/* Rankings */
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ranking-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  min-width: 100px;
}

.ranking-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 50, 100, 0.5);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.ranking-progress {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff 0%, #0066ff 100%);
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.8);
  transition: width 0.3s ease;
}

.ranking-value {
  font-size: 13px;
  color: #fff;
  min-width: 40px;
  text-align: right;
}

/* Stats */
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 5px;
}

.stat-value {
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  background: -webkit-gradient(linear, left bottom, left top, from(#fff), to(#fad16a));
  background: linear-gradient(0deg, #fff, #fad16a);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.stat-value .unit {
  font-size: 14px;
  margin-left: 4px;
}

.stat-compare {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 3px;
}

/* Access Status */
.access-status {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
}


.status-info {
  flex: 1;
}

.status-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.status-value {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  background: -webkit-gradient(linear, left bottom, left top, from(#fff), to(#fad16a));
  background: linear-gradient(0deg, #fff, #fad16a);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Center Panel */
.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(0, 50, 100, 0.3);
  overflow: hidden;
  position: relative;
}

.video-header {
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  padding:5px 10px;

}

.video-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tab {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: color 0.3s;
}

.tab.active {
  color: #00d4ff;
  position: relative;
}

.video-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.control-btn {
  background: rgba(0, 150, 255, 0.2);
  border-color: rgba(0, 200, 255, 0.5);
  color: #00d4ff;
}

.video-container {
  flex: 1;
  display: grid;
  overflow: hidden;
  height: 100%;
  border: 1px solid #1D95FF;
  position: relative;
  z-index: 1;
  background-color: #021A40;
}

/* 四个角的锁定效果 */
.video-container::before,.warn-card::before  {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-top: 2px solid #56E2E7;
  border-left: 2px solid #56E2E7;
  z-index: 2;
}

.video-container::after,.warn-card::after  {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-top: 2px solid #56E2E7;
  border-right: 2px solid #56E2E7;
  z-index: 2;
}

.video-container .corner-bl,.warn-card .corner-bl {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #56E2E7;
  border-left: 2px solid #56E2E7;
  z-index: 2;
}

.video-container .corner-br, .warn-card .corner-br {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid #56E2E7;
  border-right: 2px solid #56E2E7;

  z-index: 2;
}

.video-container.single-video {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.video-container.two-videos {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}

.video-container.three-videos {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.video-container.four-videos {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.video-container.five-videos {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.video-container.six-videos {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.video-container.seven-videos {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.video-container.eight-videos {
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.video-container.nine-videos {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.video-frame {
  width: 100%;
  height: 100%; /* 确保每个播放块高度一致 */
  position: relative;
  overflow: hidden;
  background: #021A40;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  min-width: 200px;
  /* 移除边框，避免与容器间隙重复 */
  box-sizing: border-box;
}

.video-frame.empty-state {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  border: 2px dashed rgba(0, 200, 255, 0.2);
}

.empty-content {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.empty-text {
  font-size: 16px;
}

.video-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 视频帧边框样式 */
.border-r {
  border-right-width: 1px !important;
}

.border-b {
  border-bottom-width: 1px !important;
}

.border-\[#1D95FF\]\/50 {
  border-color: rgba(29, 149, 255, 0.5) !important;
}

.video-label {
  position: absolute;
  bottom: 20px;
  left: 20px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 200, 255, 0.5);
  color: #fff;
  font-size: 16px;
  border-radius: 2px;
}


/* Bottom Stats */
.bottom-stats {
  background: rgba(0, 50, 100, 0.3);
  position: relative;
}

.bottom-stats::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 200, 255, 0.5) 50%, transparent 100%);
}

.stats-cards {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.stat-card {
  flex:1;
  padding: 20px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  background-image: -webkit-gradient(linear, left bottom, left top, from(rgba(28, 68, 138, 0)), to(rgba(28, 68, 138, .6)));
  background-image: linear-gradient(0deg, rgba(28, 68, 138, 0), rgba(28, 68, 138, .6));
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}


.card-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  
}

.card-value {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
}

.card-value.red {
  color: #ff4444;
  text-shadow: 0 0 20px rgba(255, 68, 68, 0.5);
}

.card-value.green {
  color: #00ff88;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
}

.card-value.orange {
  color: #ffaa00;
  text-shadow: 0 0 20px rgba(255, 170, 0, 0.5);
}

.card-value .unit {
  font-size: 16px;
  margin-left: 4px;
}

/* Right Panel */
.right-panel {
  width: 380px;
}

.full-height {
  height: 100%;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
}

.video-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
}

.video-list::-webkit-scrollbar {
  width: 4px;
}

.video-list::-webkit-scrollbar-thumb {
  background: rgba(0, 200, 255, 0.3);
  border-radius: 2px;
}

.video-item {
  background: rgba(0, 50, 100, 0.3);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
}

.video-item:hover {
  border-color: rgba(0, 200, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 200, 255, 0.3);
}

.video-thumbnail {
  width: 100%;
  height: 180px;
  background: #000;
  position: relative;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-info {
  padding: 12px;
}

.video-name {
  font-size: 14px;
  color: #fff;
  margin-bottom: 8px;
  font-weight: bold;
}

.video-details {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.video-select-btn {
  width: calc(100% - 24px);
  margin: 0 12px 12px;
  background: rgba(0, 150, 255, 0.2);
  border-color: rgba(0, 200, 255, 0.5);
  color: #00d4ff;
}

.video-select-btn:hover {
  background: rgba(0, 150, 255, 0.4);
  border-color: rgba(0, 200, 255, 0.8);
}
.warn-card{
  border: 1px solid #1d95ff;
    position: relative;
    width: 100%;
    height: 100%;
}

:deep(.ant-select-selector) {
  background-color: rgba(0, 50, 100, 0.3) !important;
  border-color: rgba(0, 200, 255, 0.3) !important;
  color: #00d5ff !important;
}
:deep(.ant-select-selection-placeholder),:deep(.ant-select-selection-item-remove){
  color: #00d5ffb6 !important;
}
:deep(.ant-select-focused .ant-select-selection-item),:deep(.ant-select-selection-item-remove){
  color: #00d5ffb6 !important;
}

/* 全屏样式 */
:fullscreen .video-container {
  background-color: #000 !important;
  width: 100vw !important;
  height: 100vh !important;
}

:fullscreen .video-frame {
  min-height: unset !important;
  height: 100% !important;
}

:fullscreen .video-label {
  font-size: 18px;
  padding: 10px 16px;
}

/* 算法选择列表样式 */
.algorithm-dropdown {
  position: absolute;
  top: 40px;
  left: 0;
  width: 180px;
  background: rgba(3, 17, 50, 1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #1D95FF;
}

.algorithm-item {
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.algorithm-item:hover {
  background: rgba(29, 149, 255, 0.2);
}

/* WebKit浏览器的全屏样式 */
:-webkit-full-screen .video-container {
  background-color: #000 !important;
  width: 100vw !important;
  height: 100vh !important;
}

:-webkit-full-screen .video-frame {
  min-height: unset !important;
  height: 100% !important;
}

:-webkit-full-screen .video-label {
  font-size: 18px;
  padding: 10px 16px;
}

/* IE11的全屏样式 */
:-ms-fullscreen .video-container {
  background-color: #000 !important;
  width: 100vw !important;
  height: 100vh !important;
}

:-ms-fullscreen .video-frame {
  min-height: unset !important;
  height: 100% !important;
}

:-ms-fullscreen .video-label {
  font-size: 18px;
  padding: 10px 16px;
}

</style>
