<template>
  <div class="device-status-container p-[16px] flex flex-col overflow-hidden box-border"
    style="font-family: Source Han Sans CN;">

    <!-- 主要内容区域 - 左右布局 -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
      <div class="flex h-full device-status-layout">
        <!-- 左侧设备列表 -->
        <div class="w-1/4 pr-6 border-r border-gray-200 device-list">
          <div class="flex items-center justify-between mb-4">
            <Input v-model:value="searchKeyword" placeholder="搜索设备名称或编号" @change="filterDevices"
              style="width: calc(100% - 80px);">
              <template #prefix>
                <SearchOutlined style="color: rgba(0, 0, 0, 0.45);" />
              </template>
            </Input>
            <Button type="primary" style="background-color: #4362EF;" @click="refreshDeviceList">
              <ReloadOutlined />
            </Button>
          </div>

          <div class="overflow-y-auto device-list-content" style="height: calc(100vh - 250px);">
            <div v-for="device in filteredDevices" :key="device.id"
              class="p-3 mb-2 transition-colors duration-200 rounded cursor-pointer device-item hover:bg-blue-50"
              :class="{ 'bg-blue-100': selectedDevice && selectedDevice.id === device.id }"
              @click="selectDevice(device)">
              <div class="flex items-start justify-between">
                <div class="device-name font-medium text-gray-800 truncate max-w-[70%]">
                  {{ device.name }}
                </div>
                <Tag
                  :color="device.status === 'normal' || device.status === 'running' ? 'green' : device.status === 'warning' ? 'orange' : 'red'"
                  class="status-tag">
                  {{ device.status === 'normal' ? '正常' : device.status === 'running' ? '运行中' : device.status ===
                    'warning' ? '预警'
                    : '报警' }}
                </Tag>
              </div>
              <div class="mt-1 text-xs text-gray-500 device-code">
                编号: {{ device.equipment_code }}
              </div>
              <div class="mt-1 text-xs text-gray-500 device-type">
                类型: {{ device.equipment_type }}
              </div>
              <div class="mt-1 text-xs text-gray-500 device-location">
                区域: {{ device.location }}
              </div>
              <div class="pt-2 mt-2 border-t border-gray-100">
                <div class="flex justify-between text-xs">
                  <span class="text-gray-500">温度:</span>
                  <span class="font-medium">{{ device.real_time_data.temperature }}°C</span>
                </div>
                <div class="flex justify-between mt-1 text-xs">
                  <span class="text-gray-500">压力:</span>
                  <span class="font-medium">{{ device.real_time_data.pressure }} MPa</span>
                </div>
                <div class="flex justify-between mt-1 text-xs">
                  <span class="text-gray-500">震动:</span>
                  <span class="font-medium">{{ device.real_time_data.vibration }} mm/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧设备状态详情 -->
        <div class="w-3/4 pl-6 overflow-y-auto device-detail" v-if="selectedDevice">
          <div class="mb-6 device-header">
            <div class="flex items-start justify-between">
              <div class="flex items-center">
                <div class="h-[60px]  rounded-lg  mr-[10px] overflow-hidden">
                  <Image :src="selectedDevice.image_path" :alt="selectedDevice.name"
                    class="!object-contain !h-[60px] !max-w-full !rounded-lg !max-h-64 " />
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-800">{{ selectedDevice.name }}</h3>
                  <p class="mt-1 text-gray-500">{{ selectedDevice.equipment_code }} | {{ selectedDevice.location }}</p>
                </div>
              </div>
              <Tag
                :color="selectedDevice.status === 'normal' || selectedDevice.status === 'running' ? 'green' : selectedDevice.status === 'warning' ? 'orange' : 'red'"
                class="flex items-center h-8 px-3 py-1 text-lg">
                {{ selectedDevice.status === 'normal' ? '正常' : selectedDevice.status === 'running' ? '运行中' :
                  selectedDevice.status === 'warning' ? '预警' : '报警' }}
              </Tag>
            </div>
          </div>

          <!-- 设备图片展示 -->
          <!-- <div class="mb-6 device-image" v-if="selectedDevice.image_path">
            <h4 class="mb-4 font-medium text-gray-700">设备图片</h4>
            <div class="flex items-center justify-center p-4 rounded-lg bg-gray-50" style="height: 300px;">
            
          <img :src="selectedDevice.image_path" :alt="selectedDevice.name"
            class="object-contain max-w-full rounded-lg max-h-64">
          <div>
            设备信息
          </div>
        </div>
      </div> -->

          <!-- 设备状态指标 -->
          <div class="mb-6 status-cards">
            <div class="grid grid-cols-4 gap-4">
              <div class="p-4 rounded-lg status-card bg-blue-50" :class="{
                'flashing emergency': selectedDevice.real_time_data.temperature > 100,
                'flashing alert': selectedDevice.real_time_data.temperature > 80 && selectedDevice.real_time_data.temperature <= 100
              }">
                <div class="text-sm text-gray-500">温度</div>
                <div class="mt-1 text-2xl font-bold text-blue-600">{{ selectedDevice.real_time_data.temperature }}°C
                </div>
                <div class="mt-2 text-xs"
                  :class="selectedDevice.real_time_data.temperature > 100 ? 'text-red-500' : selectedDevice.real_time_data.temperature > 80 ? 'text-yellow-500' : 'text-green-500'">
                  {{ selectedDevice.real_time_data.temperature > 100 ? '报警' : selectedDevice.real_time_data.temperature
                    > 80 ?
                    '预警' : '正常' }}
                </div>
              </div>
              <div class="p-4 rounded-lg status-card bg-green-50" :class="{
                'flashing emergency': selectedDevice.real_time_data.pressure > 1.0,
                'flashing alert': selectedDevice.real_time_data.pressure > 0.8 && selectedDevice.real_time_data.pressure <= 1.0
              }">
                <div class="text-sm text-gray-500">压力</div>
                <div class="mt-1 text-2xl font-bold text-green-600">{{ selectedDevice.real_time_data.pressure }} MPa
                </div>
                <div class="mt-2 text-xs"
                  :class="selectedDevice.real_time_data.pressure > 1.0 ? 'text-red-500' : selectedDevice.real_time_data.pressure > 0.8 ? 'text-yellow-500' : 'text-green-500'">
                  {{ selectedDevice.real_time_data.pressure > 1.0 ? '报警' : selectedDevice.real_time_data.pressure > 0.8
                    ? '预警' :
                    '正常' }}
                </div>
              </div>
              <div class="p-4 rounded-lg status-card bg-purple-50" :class="{
                'flashing emergency': selectedDevice.real_time_data.vibration > 5.0,
                'flashing alert': selectedDevice.real_time_data.vibration > 3.0 && selectedDevice.real_time_data.vibration <= 5.0
              }">
                <div class="text-sm text-gray-500">震动</div>
                <div class="mt-1 text-2xl font-bold text-purple-600">{{ selectedDevice.real_time_data.vibration }} mm/s
                </div>
                <div class="mt-2 text-xs"
                  :class="selectedDevice.real_time_data.vibration > 5.0 ? 'text-red-500' : selectedDevice.real_time_data.vibration > 3.0 ? 'text-yellow-500' : 'text-green-500'">
                  {{ selectedDevice.real_time_data.vibration > 5.0 ? '报警' : selectedDevice.real_time_data.vibration >
                    3.0 ? '预警'
                    : '正常' }}
                </div>
              </div>
              <div class="p-4 rounded-lg status-card bg-yellow-50">
                <div class="text-sm text-gray-500">健康指数</div>
                <div class="mt-1 text-2xl font-bold text-yellow-600">{{ selectedDevice.health_index }}%</div>
                <div class="mt-2 text-xs text-gray-500">设备状态</div>
              </div>
            </div>
          </div>

          <!-- 监测项目列表 -->
          <div class="mb-6 monitoring-projects">
            <h4 class="mb-4 font-medium text-gray-700">监测项目</h4>
            <div class="p-4 rounded-lg bg-gray-50">
              <div class="grid grid-cols-2 gap-3">
                <div v-for="project in selectedDevice.monitoring_projects" :key="project.id"
                  class="p-3 mb-2 transition-shadow bg-white border-l-4 rounded cursor-pointer project-item hover:shadow-md"
                  :class="{
                    'border-green-500': project.status === 'normal',
                    'border-yellow-500': project.status === 'warning',
                    'border-orange-500': project.status === 'alert',
                    'border-red-500': project.status === 'emergency',
                    'flashing': project.status === 'warning' || project.status === 'alert' || project.status === 'emergency',
                    'warning': project.status === 'warning',
                    'alert': project.status === 'alert',
                    'emergency': project.status === 'emergency'
                  }" @click="openTrendModal(project)">
                  <div class="flex justify-between">
                    <div class="font-medium">{{ project.name }}</div>
                    <div class="text-xs text-gray-500">{{ project.last_update }}</div>
                  </div>
                  <div class="mt-1 text-sm text-gray-600">{{ project.status_text }}</div>
                  <div v-if="project.confidence" class="mt-1 text-xs text-gray-500">置信度: {{ project.confidence }}%</div>
                  <!-- 添加摄像头信息 -->
                  <div v-if="project.camera_name" class="mt-1 text-xs text-gray-600">
                    <span class="text-gray-500">摄像头:</span>
                    <span class="font-medium">{{ project.camera_name }}</span>
                  </div>
                  <!-- 添加启停状态显示，如果是设备启停状态项目则使用图标 -->
                  <div v-if="project.running_status" class="flex items-center mt-1 text-xs">
                    <span class="mr-1 text-gray-500">状态:</span>
                    <span v-if="project.name.includes('设备启停状态')" class="flex items-center">
                      <span v-if="project.running_status === 'start'" class="text-green-600">
                        <CheckCircleOutlined class="mr-1" />
                        <span>运行中</span>
                      </span>
                      <span v-else class="text-red-600">
                        <StopOutlined class="mr-1" />
                        <span>已停止</span>
                      </span>
                    </span>
                    <span v-else class="flex items-center">
                      <Tag :color="project.running_status === 'start' ? 'green' : 'red'">
                        {{ project.running_status === 'start' ? '开启' : '停止' }}
                      </Tag>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 监控点位信息 -->
          <div class="mb-6 maintenance-records">
            <h4 class="mb-4 font-medium text-gray-700">监控点位信息</h4>
            <div class="p-4 rounded-lg bg-gray-50">
              <div v-if="selectedDevice.monitoring_points && selectedDevice.monitoring_points.length > 0"
                class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div v-for="(point, index) in selectedDevice.monitoring_points" :key="index"
                  class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm" :class="{
                    'flashing': point.status === 'warning' || point.status === 'alert' || point.status === 'emergency',
                    'warning': point.status === 'warning',
                    'alert': point.status === 'alert',
                    'emergency': point.status === 'emergency'
                  }">
                  <div class="font-medium text-gray-800">{{ point.name }}</div>
                  <div class="mt-2 text-sm text-gray-600">{{ point.description }}</div>
                  <div class="mt-3 text-xs text-gray-500">更新时间: {{ point.last_update }}</div>
                  <div v-if="point.status" class="mt-2">
                    <Tag
                      :color="point.status === 'normal' || point.status === 'online' ? 'green' : point.status === 'warning' ? 'orange' : point.status === 'offline' ? 'red' : 'blue'">
                      {{ point.status === 'normal' ? '正常' : point.status === 'online' ? '在线' : point.status ===
                        'warning' ? '预警'
                        : point.status === 'offline' ? '离线' : point.status === 'alert' ? '报警' : point.status ===
                          'emergency' ?
                      '紧急' : point.status }}
                    </Tag>
                  </div>
                </div>
              </div>
              <div v-else class="py-8 text-center text-gray-500">
                暂无监控点位信息
              </div>
            </div>
          </div>

          <!-- 摄像头信息 -->
          <div class="mb-6 camera-info">
            <h4 class="mb-4 font-medium text-gray-700">摄像头信息</h4>
            <div class="p-4 rounded-lg bg-gray-50">
              <div class="grid grid-cols-2 gap-4">
                <div class="camera-item">
                  <div class="text-sm text-gray-500">摄像头位置</div>
                  <div class="mt-1 font-medium">{{ selectedDevice.camera_position }}</div>
                </div>
                <div class="camera-item">
                  <div class="text-sm text-gray-500">视频流地址</div>
                  <div class="mt-1 font-medium text-blue-600">{{ selectedDevice.current_video_feed }}</div>
                </div>
                <div class="camera-item">
                  <div class="text-sm text-gray-500">AI检测状态</div>
                  <div class="mt-1">
                    <Tag :color="selectedDevice.video_analysis_status.is_online ? 'green' : 'red'">
                      {{ selectedDevice.video_analysis_status.is_online ? '在线' : '离线' }}
                    </Tag>
                  </div>
                </div>
                <div class="camera-item">
                  <div class="text-sm text-gray-500">检测敏感度</div>
                  <div class="mt-1 font-medium">{{ selectedDevice.detection_sensitivity }}/10</div>
                </div>
                <div class="camera-item">
                  <div class="text-sm text-gray-500">分析模式</div>
                  <div class="mt-1 font-medium">{{ selectedDevice.video_analysis_status.analysis_mode === 'realtime' ?
                    '实时分析' :
                    selectedDevice.video_analysis_status.analysis_mode === 'scheduled' ? '定时分析' : '暂停分析' }}</div>
                </div>
                <div class="camera-item">
                  <div class="text-sm text-gray-500">检测准确率</div>
                  <div class="mt-1 font-medium">{{ selectedDevice.video_analysis_status.detection_accuracy }}%</div>
                </div>
              </div>

              <div class="mt-4">
                <h5 class="font-medium text-gray-700">视频预览</h5>
                <div class="flex items-center justify-center p-2 mt-2 bg-black rounded" style="height: 240px;">
                  <div class="text-center text-white">
                    <div class="mb-2">摄像头实时视频预览</div>
                    <div class="text-sm text-gray-300">视频流: {{ selectedDevice.current_video_feed }}</div>
                    <div class="mt-4 text-gray-400">[摄像头画面区域]</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 子设备列表 -->
          <div class="mb-6 sub-equipment">
            <h4 class="mb-4 font-medium text-gray-700">子设备列表</h4>
            <div class="p-4 rounded-lg bg-gray-50">
              <SmartTable :columns="subEquipmentColumns" :data-source="selectedDevice.sub_equipment_list"
                :pagination="false">
              </SmartTable>
            </div>
          </div>

          <!-- 设备报警记录 -->
          <div class="mb-6 alarm-records">
            <h4 class="mb-4 font-medium text-gray-700">近期报警记录</h4>
            <div class="p-4 rounded-lg bg-gray-50">
              <div
                v-if="selectedDevice.monitoring_projects && selectedDevice.monitoring_projects.some(p => p.status !== 'normal')">
                <div v-for="(project, index) in selectedDevice.monitoring_projects.filter(p => p.status !== 'normal')"
                  :key="index" class="p-3 mb-2 bg-white border-l-4 rounded alarm-item" :class="{
                    'border-orange-500': project.status === 'alert',
                    'border-red-500': project.status === 'emergency'
                  }">
                  <div class="flex justify-between">
                    <div class="font-medium">{{ project.name }}</div>
                    <div class="text-xs text-gray-500">{{ project.last_update }}</div>
                  </div>
                  <div class="mt-1 text-sm text-gray-600">{{ project.status_text }}</div>
                </div>
              </div>
              <div v-else class="py-8 text-center text-gray-500">
                暂无报警记录
              </div>
            </div>
          </div>

        </div>

        <!-- 右侧无设备选择提示 -->
        <div v-else class="flex items-center justify-center w-2/3 pl-6 text-gray-400 device-detail">
          <div class="text-center">
            <div class="mb-4 text-4xl">📋</div>
            <p>请选择左侧设备查看状态详情</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <div v-if="previewVisible" class="preview-overlay" @click="closeImagePreview">
      <div class="preview-content" @click.stop>
        <img :src="previewImage" :alt="selectedDevice?.name" class="preview-image" @click.stop>
        <span class="preview-close" @click="closeImagePreview">&times;</span>
      </div>
    </div>

    <!-- 监测项目趋势图弹窗 -->
    <Modal v-model:visible="trendModalVisible" :title="selectedTrendProject?.name + '趋势图'" :width="900" :footer="null"
      @cancel="closeTrendModal">
      <div v-if="selectedTrendProject" class="trend-chart-container">
        <div ref="trendChartRef" style="height: 400px;"></div>
      </div>
    </Modal>

  </div>




</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import {
  Button,
  Input,
  Tag,
  Timeline,
  TimelineItem,
  message,
  Image, Modal
} from 'ant-design-vue';
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons-vue';
import { perceivedStateData } from "./perceivedStateData.ts";

// 导入 ECharts 相关内容
import * as echarts from 'echarts';
import { onUnmounted } from 'vue';

// 导入 SmartTable 组件
import SmartTable from '@/components/SmartTable/index.vue';

// 定义子设备表格列
const subEquipmentColumns = [
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '设备编号',
    dataIndex: 'equipment_code',
    key: 'equipment_code',
  },
  {
    title: '报警状态',
    dataIndex: 'alarm_status',
    key: 'alarm_status',
    type: 'tag',
    options: [
      {
        label: '正常',
        value: "normal",
        color: "green",
      },
      {
        label: '预警',
        value: "warning",
        color: "orange",
      },
      {
        label: '报警',
        value: "alert",
        color: "red",
      },
      {
        label: '紧急',
        value: "emergency",
        color: "red",
      },
    ]

  },
  {
    title: '在线状态',
    dataIndex: 'online_status',
    key: 'online_status',
    type: 'tag',
    options: [
      {
        label: '在线',
        value: "online",
        color: "green",
      },
      {
        label: '离线',
        value: "offline",
        color: "red",
      },
      {
        label: '维护中',
        value: "maintaining",
        color: "orange",
      },
      {
        label: '未知',
        value: "unknown",
        color: "gray",
      },
    ]
  },
  {
    title: '检测值',
    dataIndex: 'detection_value',
    key: 'detection_value',
    type: 'custom',
    options: [
      {
        render: (text: any, record: any) => {
          return `${text}${record.detection_unit}`;
        }
      }
    ]
  },
  {
    title: '趋势',
    dataIndex: 'trend',
    key: 'trend',
    type: 'tag',
    options: [
      {
        label: '上升',
        value: "rising",
        color: "green",
      },
      {
        label: '下降',
        value: "falling",
        color: "blue",
      },
      {
        label: '稳定',
        value: "stable",
        color: "gray",
      },
      {
        label: '波动',
        value: "fluctuating",
        color: "yellow",
      }
    ]
  },
  {
    title: '检测时间',
    dataIndex: 'detection_time',
    key: 'detection_time',
  },
  {
    title: '操作',
    key: 'operation',
    dataIndex: 'operation',
    slots: { customRender: 'operation' },
  }
];

// 图片预览相关变量
const previewVisible = ref(false);
const previewImage = ref('');

// 趋势图表模态框相关变量
const trendModalVisible = ref(false);
const selectedTrendProject = ref<any>(null);
const trendChartRef = ref<HTMLElement | null>(null);
let trendChart: echarts.ECharts | null = null;

// 响应式数据
const searchKeyword = ref('');
const selectedDevice = ref<any>(null);
const allDevices = ref<any[]>([]);
const filteredDevices = ref<any[]>([]);
// 添加图表实例引用
const tempChartRef = ref<HTMLElement | null>(null);
let tempChart: echarts.ECharts | null = null;

// // 处理图片加载失败的函数
// const handleImageError = (event: Event) => {
//   const target = event.target as HTMLImageElement;
//   target.src = '@/assets/proEquipment/设备图片.png'; // 设置默认图片路径，如果不存在可以替换为其他默认图片
// };

// 选择设备
const selectDevice = (device: any) => {
  selectedDevice.value = device;
  // 设备切换时更新图表
  nextTick(() => {
    updateTempChart();
  });
};

// 图片预览功能
const openImagePreview = (imagePath: string) => {
  previewImage.value = imagePath;
  previewVisible.value = true;
  // 阻止背景滚动
  document.body.style.overflow = 'hidden';
};

const closeImagePreview = () => {
  previewVisible.value = false;
  previewImage.value = '';
  // 恢复背景滚动
  document.body.style.overflow = '';
};

// 查看子设备
const viewSubEquipment = (subEquipment: any) => {
  message.info(`查看子设备: ${subEquipment.name}`);
};

// 打开趋势图表模态框
const openTrendModal = (project: any) => {
  selectedTrendProject.value = project;
  trendModalVisible.value = true;
  // 等待模态框渲染完成后再初始化图表
  nextTick(() => {
    updateTrendChart();
  });
};

// 关闭趋势图表模态框
const closeTrendModal = () => {
  trendModalVisible.value = false;
  // 关闭模态框时销毁图表实例
  if (trendChart) {
    trendChart.dispose();
    trendChart = null;
  }
  selectedTrendProject.value = null;
};

// 过滤设备
const filterDevices = () => {
  if (!searchKeyword.value.trim()) {
    filteredDevices.value = [...allDevices.value];
  } else {
    filteredDevices.value = allDevices.value.filter(device =>
      device.name.includes(searchKeyword.value) ||
      device.equipment_code.includes(searchKeyword.value)
    );
  }
};

// 刷新设备列表
const refreshDeviceList = () => {
  // 在实际应用中，这里会调用API获取最新数据
  message.success('设备列表已刷新');
  searchKeyword.value = '';
  initStatusData();
};

// 初始化状态感知数据
const initStatusData = () => {
  allDevices.value = [...perceivedStateData];
  filteredDevices.value = [...allDevices.value];

  // 默认选中第一个设备
  if (allDevices.value.length > 0) {
    selectedDevice.value = allDevices.value[0];
    nextTick(() => {
      updateTempChart();
    });
  }
};

// 更新温度趋势图表
const updateTempChart = () => {
  if (!tempChartRef.value) return;

  // 如果已有图表实例，先清空
  if (tempChart) {
    tempChart.dispose();
  }

  // 初始化图表
  tempChart = echarts.init(tempChartRef.value);

  // 准备示例数据 - 在实际应用中应该从设备数据中获取
  const now = new Date();
  const data: { name: string; value: [string, number] }[] = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    const formattedTime = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    // 生成模拟温度数据，基于当前设备的温度上下浮动
    const baseTemp = selectedDevice.value?.real_time_data?.temperature || 30;
    const temp = baseTemp + (Math.random() - 0.5) * 10; // 在基础温度上浮动5度左右

    data.push({
      name: formattedTime,
      value: [formattedTime, parseFloat(temp.toFixed(1))]
    });
  }

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#4362EF',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      formatter: '{b}<br/>{a}: {c}°C',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#4362EF',
          width: 1
        }
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#E3E6EB'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999',
        fontSize: 10
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#E3E6EB'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#999',
        fontSize: 10,
        formatter: '{value}°C'
      },
      splitLine: {
        lineStyle: {
          color: '#F0F2F5',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '温度',
        data: data.map(item => item.value[1]),
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#4362EF',
          width: 2
        },
        itemStyle: {
          color: '#4362EF',
          borderWidth: 1,
          borderColor: '#fff',
          borderType: 'solid'
        },
        areaStyle: {
          opacity: 0.1,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#4362EF'
              },
              {
                offset: 1,
                color: '#fff'
              }
            ]
          }
        },
        // 添加阈值线
        markLine: {
          data: [
            {
              name: '报警阈值',
              yAxis: 100,
              lineStyle: {
                color: '#F4664A',
                type: 'solid',
                width: 1
              },
              label: {
                show: false
              }
            },
            {
              name: '预警阈值',
              yAxis: 80,
              lineStyle: {
                color: '#FAAD14',
                type: 'solid',
                width: 1
              },
              label: {
                show: false
              }
            }
          ],
          silent: true
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '5%',
      containLabel: true
    }
  };

  tempChart.setOption(option);
};

// 更新趋势图表
const updateTrendChart = () => {
  if (!trendChartRef.value || !selectedTrendProject.value) return;

  // 如果已有图表实例，先清空
  if (trendChart) {
    trendChart.dispose();
  }

  // 初始化图表
  trendChart = echarts.init(trendChartRef.value);

  // 检查是否是冒烟检测项目
  if (selectedTrendProject.value.name.includes('冒烟检测')) {
    // 为冒烟检测生成每天识别到烟雾的次数数据
    const now = new Date();
    const data: { name: string; value: [string, number] }[] = [];

    for (let i = 29; i >= 0; i--) { // 显示最近30天的数据
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const formattedDate = date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });

      // 生成随机的烟雾检测次数，大部分时间没有检测到烟雾
      const smokeCount = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0; // 30%概率检测到烟雾，数量1-5次

      data.push({
        name: formattedDate,
        value: [formattedDate, smokeCount]
      });
    }

    // 为冒烟检测设置图表配置
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#4362EF',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        formatter: selectedTrendProject.value.name + ': {c}次',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#4362EF',
            width: 1
          }
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisLine: {
          lineStyle: {
            color: '#E3E6EB'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999',
          fontSize: 10,
          interval: 2 // 每隔2个标签显示一个，避免标签过于密集
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#E3E6EB'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999',
          fontSize: 10,
          formatter: '{value}次'
        },
        splitLine: {
          lineStyle: {
            color: '#F0F2F5',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: selectedTrendProject.value.name,
          data: data.map(item => item.value[1]),
          type: 'bar', // 使用柱状图显示次数
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ff6b6b' },
              { offset: 1, color: '#ffa500' }
            ])
          }
        }
      ],
      grid: {
        left: '8%',
        right: '4%',
        bottom: '12%',
        top: '8%',
        containLabel: true
      }
    };

    trendChart.setOption(option);
  }
  // 检查是否是设备启停状态项目
  else if (selectedTrendProject.value.name.includes('设备启停状态')) {
    // 为设备启停状态生成二进制状态数据 (0=停止, 1=运行)
    const now = new Date();
    const data: { name: string; value: [string, number] }[] = [];

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      const formattedTime = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

      // 随机生成设备运行状态，大部分时间是运行状态
      const status = Math.random() > 0.2 ? 1 : 0; // 80%概率为运行状态

      data.push({
        name: formattedTime,
        value: [formattedTime, status]
      });
    }

    // 为设备启停状态设置图表配置
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#4362EF',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        formatter: (params: any) => {
          const param = params[0];
          return selectedTrendProject.value.name + ': ' + (param.value[1] === 1 ? '运行' : '停止');
        },
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#4362EF',
            width: 1
          }
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#E3E6EB'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999',
          fontSize: 10
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        min: -0.2,
        max: 1.2,
        axisLine: {
          lineStyle: {
            color: '#E3E6EB'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999',
          fontSize: 10,
          formatter: (value: number) => {
            return value === 1 ? '运行' : value === 0 ? '停止' : '';
          }
        },
        splitLine: {
          lineStyle: {
            color: '#F0F2F5',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: selectedTrendProject.value.name,
          data: data.map(item => item.value[1]),
          type: 'line',
          step: 'start', // 使用阶梯线图更好地显示状态变化
          lineStyle: {
            color: '#52c41a',
            width: 3
          },
          itemStyle: {
            color: '#52c41a',
            borderWidth: 1,
            borderColor: '#fff',
            borderType: 'solid'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#52c41a40'
                },
                {
                  offset: 1,
                  color: '#52c41a10'
                }
              ]
            },
            opacity: 0.3
          }
        }
      ],
      grid: {
        left: '8%',
        right: '4%',
        bottom: '10%',
        top: '8%',
        containLabel: true
      }
    };

    trendChart.setOption(option);
  }
  else {
    // 其他监测项目的原有逻辑
    const now = new Date();
    const data: { name: string; value: [string, number] }[] = [];

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      const formattedTime = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

      // 生成模拟数据，根据项目类型不同生成不同范围的数据
      let baseValue = 50;
      if (selectedTrendProject.value.name.includes('温度')) baseValue = 70;
      if (selectedTrendProject.value.name.includes('压力')) baseValue = 0.5;
      if (selectedTrendProject.value.name.includes('震动')) baseValue = 2;
      if (selectedTrendProject.value.name.includes('转速')) baseValue = 10000;
      if (selectedTrendProject.value.name.includes('流量')) baseValue = 50;
      if (selectedTrendProject.value.name.includes('液位')) baseValue = 50;
      if (selectedTrendProject.value.name.includes('浓度')) baseValue = 100;
      if (selectedTrendProject.value.name.includes('面风速')) baseValue = 0.5;
      if (selectedTrendProject.value.name.includes('设备启停')) baseValue = 1; // 0代表停止，1代表运行

      // 根据不同项目类型生成合理的数值范围
      let value;
      if (selectedTrendProject.value.name.includes('设备启停')) {
        // 设备启停状态只有0和1两个值
        value = Math.random() > 0.3 ? 1 : 0; // 更多时候是运行状态
      } else if (selectedTrendProject.value.name.includes('浓度')) {
        // 浓度值可能偶尔超标
        value = baseValue + (Math.random() > 0.8 ? 100 : Math.random() * 20); // 偶尔出现高值
      } else {
        value = baseValue + (Math.random() - 0.5) * (baseValue * 0.3); // 在基础值附近浮动30%
      }

      // 确保数值在合理范围内
      if (selectedTrendProject.value.name.includes('面风速')) {
        value = Math.min(Math.max(value, 0), 1); // 面风速范围 0-1 m/s
      } else if (selectedTrendProject.value.name.includes('液位')) {
        value = Math.min(Math.max(value, 0), 100); // 液位范围 0-100%
      } else if (selectedTrendProject.value.name.includes('设备启停')) {
        value = Math.round(value); // 启停状态必须是整数
      }

      data.push({
        name: formattedTime,
        value: [formattedTime, parseFloat(value.toFixed(2))]
      });
    }

    // 根据项目类型设置y轴标签
    let yAxisLabel = '';
    if (selectedTrendProject.value.unit) {
      yAxisLabel = selectedTrendProject.value.unit;
    } else if (selectedTrendProject.value.name.includes('设备启停')) {
      yAxisLabel = '';
    } else {
      yAxisLabel = selectedTrendProject.value.name;
    }

    // 计算上下限值
    let upperLimit = null;
    let lowerLimit = null;
    let warningUpperLimit = null;
    let warningLowerLimit = null;

    if (selectedTrendProject.value.threshold) {
      // 从阈值中提取数值
      const thresholdText = selectedTrendProject.value.threshold;
      // 尝试解析阈值字符串，如 "180°C", "1.2MPa", "80%", "120mg/m³" 等
      const thresholdMatch = thresholdText.match(/[\d.]+/);
      if (thresholdMatch) {
        const thresholdValue = parseFloat(thresholdMatch[0]);

        // 根据监测项目类型设置上下限
        if (selectedTrendProject.value.name.includes('温度')) {
          upperLimit = thresholdValue; // 报警上限
          lowerLimit = 0; // 温度下限通常为0
          warningUpperLimit = thresholdValue * 0.9; // 预警上限
        } else if (selectedTrendProject.value.name.includes('压力')) {
          upperLimit = thresholdValue; // 报警上限
          lowerLimit = 0; // 压力下限通常为0
          warningUpperLimit = thresholdValue * 0.9; // 预警上限
        } else if (selectedTrendProject.value.name.includes('震动')) {
          upperLimit = thresholdValue; // 报警上限
          lowerLimit = 0; // 震动下限通常为0
          warningUpperLimit = thresholdValue * 0.8; // 预警上限
        } else if (selectedTrendProject.value.name.includes('转速')) {
          upperLimit = thresholdValue; // 报警上限
          lowerLimit = 0; // 转速下限通常为0
          warningUpperLimit = thresholdValue * 0.9; // 预警上限
        } else if (selectedTrendProject.value.name.includes('液位')) {
          upperLimit = thresholdValue; // 报警上限
          lowerLimit = 0; // 液位下限
          warningUpperLimit = thresholdValue * 0.8; // 预警上限
          warningLowerLimit = 30; // 液位预警下限
        } else if (selectedTrendProject.value.name.includes('浓度')) {
          upperLimit = thresholdValue; // 报警上限
          lowerLimit = 0; // 浓度下限
          warningUpperLimit = thresholdValue * 0.8; // 预警上限
        } else if (selectedTrendProject.value.name.includes('面风速')) {
          upperLimit = thresholdValue; // 报警上限
          lowerLimit = 0.4; // 面风速下限
          warningUpperLimit = thresholdValue * 0.9; // 预警上限
          warningLowerLimit = 0.45; // 面风速预警下限
        } else {
          // 默认处理：上限为阈值，下限为0
          upperLimit = thresholdValue;
          lowerLimit = 0;
          warningUpperLimit = thresholdValue * 0.8;
        }
      }
    } else {
      // 如果没有定义阈值，根据项目类型使用默认值
      if (selectedTrendProject.value.name.includes('温度')) {
        upperLimit = 200;
        lowerLimit = -20;
        warningUpperLimit = 180;
      } else if (selectedTrendProject.value.name.includes('压力')) {
        upperLimit = 1.5;
        lowerLimit = 0;
        warningUpperLimit = 1.2;
      } else if (selectedTrendProject.value.name.includes('震动')) {
        upperLimit = 8;
        lowerLimit = 0;
        warningUpperLimit = 6;
      } else if (selectedTrendProject.value.name.includes('转速')) {
        upperLimit = 15000;
        lowerLimit = 0;
        warningUpperLimit = 14000;
      } else if (selectedTrendProject.value.name.includes('液位')) {
        upperLimit = 80;
        lowerLimit = 30;
        warningUpperLimit = 70;
        warningLowerLimit = 40;
      } else if (selectedTrendProject.value.name.includes('浓度')) {
        upperLimit = 120;
        lowerLimit = 0;
        warningUpperLimit = 100;
      } else if (selectedTrendProject.value.name.includes('面风速')) {
        upperLimit = 0.6;
        lowerLimit = 0.4;
        warningUpperLimit = 0.55;
        warningLowerLimit = 0.45;
      } else if (selectedTrendProject.value.name.includes('设备启停')) {
        // 设备启停状态不显示阈值线
      }
    }

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#4362EF',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        formatter: selectedTrendProject.value.name + ': {c}' + (selectedTrendProject.value.unit || ''),
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#4362EF',
            width: 1
          }
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#E3E6EB'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999',
          fontSize: 10
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#E3E6EB'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999',
          fontSize: 10,
          formatter: (value: number) => {
            if (selectedTrendProject.value.name.includes('设备启停')) {
              return value === 1 ? '运行' : '停止';
            }
            return value + (selectedTrendProject.value.unit || '');
          }
        },
        splitLine: {
          lineStyle: {
            color: '#F0F2F5',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: selectedTrendProject.value.name,
          data: data.map(item => item.value[1]),
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#4362EF',
            width: 2
          },
          itemStyle: {
            color: '#4362EF',
            borderWidth: 1,
            borderColor: '#fff',
            borderType: 'solid'
          },
          areaStyle: {
            opacity: 0.1,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#4362EF'
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ]
            }
          },
          // 根据监测项目类型添加阈值线
          markLine: {
            data: [
              // 预警上限
              ...(warningUpperLimit !== null ? [{
                name: '预警上限',
                yAxis: warningUpperLimit,
                lineStyle: {
                  color: '#FAAD14',
                  type: 'solid',
                  width: 1
                },
                label: {
                  position: 'insideEndTop',
                  formatter: '预警上限: ' + warningUpperLimit + (selectedTrendProject.value.unit || ''),
                  color: '#FAAD14'
                }
              }] : []),
              // 预警下限
              ...(warningLowerLimit !== null ? [{
                name: '预警下限',
                yAxis: warningLowerLimit,
                lineStyle: {
                  color: '#FAAD14',
                  type: 'solid',
                  width: 1
                },
                label: {
                  position: 'insideEndBottom',
                  formatter: '预警下限: ' + warningLowerLimit + (selectedTrendProject.value.unit || ''),
                  color: '#FAAD14'
                }
              }] : []),
              // 报警上限
              ...(upperLimit !== null ? [{
                name: '报警上限',
                yAxis: upperLimit,
                lineStyle: {
                  color: '#F4664A',
                  type: 'dashed',
                  width: 2
                },
                label: {
                  position: 'insideEndTop',
                  formatter: '报警上限: ' + upperLimit + (selectedTrendProject.value.unit || ''),
                  color: '#F4664A'
                }
              }] : []),
              // 报警下限
              ...(lowerLimit !== null ? [{
                name: '报警下限',
                yAxis: lowerLimit,
                lineStyle: {
                  color: '#F4664A',
                  type: 'dashed',
                  width: 2
                },
                label: {
                  position: 'insideEndBottom',
                  formatter: '报警下限: ' + lowerLimit + (selectedTrendProject.value.unit || ''),
                  color: '#F4664A'
                }
              }] : [])
            ],
            silent: true
          }
        }
      ],
      grid: {
        left: '8%',
        right: '4%',
        bottom: '10%',
        top: '8%',
        containLabel: true
      }
    };

    trendChart.setOption(option);
  }
};

// 组件挂载后初始化数据
onMounted(() => {
  initStatusData();
});

// 组件卸载前销毁图表实例
onUnmounted(() => {
  if (tempChart) {
    tempChart.dispose();
  }
  if (trendChart) {
    trendChart.dispose();
  }
});
</script>

<style scoped>
.device-status-container {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.device-status-layout {
  height: calc(100% - 80px);
}

.device-list-content {
  height: calc(100vh - 250px);
}

.device-item {
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
}

.device-item:hover {
  border-color: #4362EF;
  box-shadow: 0 2px 8px rgba(67, 98, 239, 0.15);
}

.device-item.active {
  border-color: #4362EF;
  background-color: #f0f5ff;
}

.status-card {
  transition: all 0.3s;
}

.status-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 闪烁动画效果 */
.flashing {
  animation: flash 1.2s infinite;
  animation-timing-function: ease-in-out;
}

@keyframes flash {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  25%,
  75% {
    opacity: 0.7;
    transform: scale(1.02);
  }

  50% {
    opacity: 0.4;
    transform: scale(1.04);
  }
}

/* 针对不同状态的闪烁效果 */
.flashing.warning {
  animation: flash-warning 1.5s infinite;
}

.flashing.alert {
  animation: flash-alert 1.2s infinite;
}

.flashing.emergency {
  animation: flash-emergency 1s infinite;
}

@keyframes flash-warning {

  0%,
  100% {
    background-color: inherit;
  }

  50% {
    background-color: #ffec3d;
    /* 黄色警告 */
  }
}

@keyframes flash-alert {

  0%,
  100% {
    background-color: inherit;
    box-shadow: 0 0 5px rgba(255, 107, 128, 0.3);
  }

  50% {
    background-color: #ff7875;
    /* 红色警告 */
    box-shadow: 0 0 15px rgba(255, 107, 128, 0.8);
  }
}

@keyframes flash-emergency {

  0%,
  100% {
    background-color: inherit;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
  }

  50% {
    background-color: #ff4d4f;
    /* 紧急红色 */
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.9);
  }
}

/* 设备图片容器样式 */
.device-image-container {
  position: relative;
  display: inline-block;
}

.device-image {
  transition: all 0.3s ease-in-out;
  border: 1px solid #e8e8e8;
  padding: 2px;
}

.device-image:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  position: relative;
}

/* 图片预览样式 */
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.preview-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.preview-close {
  position: absolute;
  top: -12px;
  right: -12px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  width: 30px;
  height: 30px;
  background-color: #4362EF;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
}

.preview-close:hover {
  background-color: #ff4d4f;
}

/* 趋势图表容器样式 */
.trend-chart-container {
  width: 100%;
  height: 400px;
}
</style>
