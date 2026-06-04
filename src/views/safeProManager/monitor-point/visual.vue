<template>
  <div class="container">
    <!-- 左侧平面图区域 -->
    <div class="left-panel">
      <div class="header">
        <p class="subtitle">厂区平面图 (1:100比例)</p>
        
        <!-- 图片上传区域 -->
        <!-- <div class="upload-container">
          <input type="file" id="imageUpload" accept="image/*" style="display: none;" @change="handleImageUpload">
          <button class="upload-btn" @click="triggerImageUpload">
            <i class="fas fa-upload"></i> 上传平面图
          </button>
          <span id="imageStatus">{{ imageStatusText }}</span>
        </div> -->
      </div>
      
      <div class="plan-toolbar">
        <button class="tool-btn" @click="addMonitoringPoint">
          <i class="fas fa-bullseye"></i> 添加监测点
        </button>
        <button class="tool-btn" @click="addCamera">
          <i class="fas fa-video"></i> 添加摄像头
        </button>
        <button class="tool-btn" @click="toggleDrawingArea" :class="{ active: isDrawingArea }">
          <i class="fas fa-draw-polygon"></i> {{ isDrawingArea ? '完成绘制' : '绘制自定义区域' }}
        </button>
        <button class="tool-btn" @click="clearAll">
          <i class="fas fa-trash-alt"></i> 清除所有
        </button>
        <button class="tool-btn success" @click="exportConfig">
          <i class="fas fa-download"></i> 导出配置
        </button>
      </div>
      
      <!-- 摄像头信息面板 -->
      <div class="camera-info" v-if="selectedCamera && showCameraInfo">
        <button class="close-btn" @click="showCameraInfo = false">&times;</button>
        <h3><i class="fas fa-video"></i> 摄像头信息</h3>
        <p><strong>位置:</strong> <span id="infoX">{{ selectedCamera.x }}</span>, <span id="infoY">{{ selectedCamera.y }}</span></p>
        <p><strong>角度:</strong> <span id="infoAngle">{{ Math.round(selectedCamera.angle) }}</span>°</p>
        <p><strong>视野角度:</strong> <span id="infoFOV">{{ Math.round(selectedCamera.fov) }}</span>°</p>
        <p><strong>监控距离:</strong> <span id="infoRange">{{ Math.round(selectedCamera.range / 100) }}</span>m</p>
        <p><strong>覆盖危险因素:</strong> <span id="infoCoverage">{{ cameraCoverageCount }}</span>个</p>
        <p><strong>覆盖百分比:</strong> <span id="infoCoveragePercent">{{ coveragePercentage }}%</span></p>
        <p><strong>视场大小:</strong> <span id="infoArea">{{ cameraArea.toFixed(2) }}</span> m² <span style="font-size: 11px; color: #7f8c8d;">(1:100比例尺)</span></p>
        <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: #2c3e50;">覆盖范围内危险因素</h4>
          <div id="cameraInfoResourceList" style="max-height: 200px; overflow-y: auto;">
            <template v-if="cameraCoveredResources.length > 0">
              <div v-for="resource in cameraCoveredResources" :key="resource.id" class="resource-item" :class="resource.type">
                <div class="resource-name">{{ resource.name }}</div>
                <div class="resource-desc">{{ resource.description }}</div>
              </div>
            </template>
            <p v-else style="text-align: center; color: #999; padding: 10px; font-size: 12px;">未发现危险因素</p>
          </div>
        </div>
      </div>
      
      <div class="plan-container">
        <svg ref="planSvg" class="plan-svg" @mousedown="handleSvgMouseDown" @mousemove="handleSvgMouseMove" @mouseup="handleSvgMouseUp" @click="handleSvgClick">
          <!-- 定义箭头标记 -->
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#e74c3c"/>
            </marker>
          </defs>
          
          <!-- 动态绘制SVG元素 -->
          <image v-if="backgroundImage" :href="backgroundImage" x="0" y="0" :width="planConfig.width" :height="planConfig.height" preserveAspectRatio="xMidYMid meet" />
          
          <!-- 资源点 -->
          <circle v-for="resource in resources" 
                  :key="resource.id"
                  :class="`resource-marker ${resource.type}`"
                  :cx="resource.x"
                  :cy="resource.y"
                  r="6"
                  @click="selectResource(resource)" />
          
          <!-- 资源点标签 -->
          <text v-for="resource in resources"
                :key="`label-${resource.id}`"
                class="room-label"
                :x="resource.x"
                :y="resource.y - 12"
                text-anchor="middle">{{ resource.name }}</text>
          
          <!-- 监测点范围 -->
          <circle v-if="monitoringPoint"
                  class="monitoring-range"
                  :cx="monitoringPoint.x"
                  :cy="monitoringPoint.y"
                  :r="monitoringPoint.range"
                  @mousedown="startDrag($event, 'monitoring-point')" />
          
          <!-- 监测点 -->
          <circle v-if="monitoringPoint"
                  class="monitoring-point"
                  :cx="monitoringPoint.x"
                  :cy="monitoringPoint.y"
                  r="8"
                  @mousedown="startDrag($event, 'monitoring-point')" />
          
          <!-- 摄像头覆盖区域 -->
          <path v-for="camera in cameras"
                :key="`coverage-${camera.id}`"
                class="camera-coverage"
                :d="getCameraCoveragePath(camera)"
                @mousedown="selectCamera(camera.id)" />
          
          <!-- 摄像头边界线 -->
          <line v-for="camera in cameras"
                :key="`left-line-${camera.id}`"
                class="camera-coverage-line"
                :x1="camera.x"
                :y1="camera.y"
                :x2="getFovPoint(camera, 'left').x"
                :y2="getFovPoint(camera, 'left').y" />
          
          <line v-for="camera in cameras"
                :key="`right-line-${camera.id}`"
                class="camera-coverage-line"
                :x1="camera.x"
                :y1="camera.y"
                :x2="getFovPoint(camera, 'right').x"
                :y2="getFovPoint(camera, 'right').y" />
          
          <!-- 摄像头方向线 -->
          <line v-for="camera in cameras"
                :key="`direction-${camera.id}`"
                class="camera-direction"
                :x1="camera.x"
                :y1="camera.y"
                :x2="camera.x + camera.range * 0.7 * Math.cos(camera.angle * Math.PI / 180)"
                :y2="camera.y + camera.range * 0.7 * Math.sin(camera.angle * Math.PI / 180)"
                marker-end="url(#arrowhead)" />
          
          <!-- 摄像头 -->
          <circle v-for="camera in cameras"
                  :key="`camera-${camera.id}`"
                  class="camera"
                  :cx="camera.x"
                  :cy="camera.y"
                  r="10"
                  :class="{ selected: selectedCameraId === camera.id }"
                  @mousedown="startDrag($event, 'camera', camera.id)" />
          
          <!-- 摄像头控制手柄 -->
          <circle v-for="camera in cameras"
                  :key="`angle-handle-${camera.id}`"
                  class="angle-handle"
                  :cx="camera.x + 50 * Math.cos(camera.angle * Math.PI / 180)"
                  :cy="camera.y + 50 * Math.sin(camera.angle * Math.PI / 180)"
                  r="6"
                  @mousedown="startDrag($event, 'angle-handle', camera.id)" />
          
          <circle v-for="camera in cameras"
                  :key="`fov-left-${camera.id}`"
                  class="fov-handle"
                  :cx="getFovPoint(camera, 'left').x"
                  :cy="getFovPoint(camera, 'left').y"
                  r="6"
                  @mousedown="startDrag($event, 'fov-handle-left', camera.id)" />
          
          <circle v-for="camera in cameras"
                  :key="`fov-right-${camera.id}`"
                  class="fov-handle"
                  :cx="getFovPoint(camera, 'right').x"
                  :cy="getFovPoint(camera, 'right').y"
                  r="6"
                  @mousedown="startDrag($event, 'fov-handle-right', camera.id)" />
          
          <circle v-for="camera in cameras"
                  :key="`range-handle-${camera.id}`"
                  class="range-handle"
                  :cx="camera.x + camera.range * 0.8 * Math.cos(camera.angle * Math.PI / 180)"
                  :cy="camera.y + camera.range * 0.8 * Math.sin(camera.angle * Math.PI / 180)"
                  r="6"
                  @mousedown="startDrag($event, 'range-handle', camera.id)" />
          
          <!-- 自定义区域 -->
          <polygon v-for="(area, index) in customAreas"
                   :key="`area-${area.id}`"
                   class="custom-area"
                   :points="getAreaPoints(area)"
                   @click="selectArea(area.id)" />
          
          <!-- 自定义区域顶点 -->
          <circle v-for="(point, pointIndex) in currentAreaPoints"
                  :key="`vertex-${pointIndex}`"
                  class="area-vertex"
                  :cx="point.x"
                  :cy="point.y"
                  r="5"
                  @click.stop="removeAreaVertex(pointIndex)" />
        </svg>
        
        <!-- 图例 -->
        <div class="legend">
          <div class="legend-item">
            <div class="legend-color" style="background-color: #3498db;"></div>
            <span>监测点范围</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #e74c3c;"></div>
            <span>摄像头及监控范围</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #f39c12;"></div>
            <span>摄像头控制手柄</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #2ecc71;"></div>
            <span>监控距离控制点</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #3498db;"></div>
            <span>人员计数</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #e74c3c;"></div>
            <span>危险因素（闯入、未戴安全帽、跌倒、睡岗、离岗）</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #f39c12;"></div>
            <span>危险因素（打电话、滞留、徘徊、物品遗落）</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #9b59b6;"></div>
            <span>自定义区域</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧控制面板 -->
    <div class="right-panel">
      <div class="analysis-section">
        <h2 class="section-title"><i class="fas fa-search"></i> 监测点分析</h2>
        <div class="range-input">
          <label for="rangeInput">监测点范围 (米):</label>
          <div class="slider-container">
            <input type="range" id="rangeSlider" min="1" max="4" v-model="monitoringRange" step="0.5" @input="updateMonitoringRange">
            <span class="slider-value">{{ monitoringRange }}</span>
          </div>
          <div class="range-display">
            <span>最小: 1m</span>
            <span>最大: 4m</span>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-value">{{ monitoredResourcesCount }}</div>
            <div class="stat-label">监测到资源</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ coveragePercent }}%</div>
            <div class="stat-label">区域覆盖率</div>
          </div>
        </div>
      </div>
      
      <div class="analysis-section">
        <h2 class="section-title"><i class="fas fa-exclamation-triangle"></i> 监测范围内危险因素</h2>
        <div class="resource-list" id="resourceList">
          <template v-if="monitoredResources.length > 0">
            <div v-for="resource in monitoredResources" :key="resource.id" class="resource-item" :class="resource.type">
              <div class="resource-name">{{ resource.name }}</div>
              <div class="resource-desc">{{ resource.description }}</div>
              <div style="font-size: 12px; margin-top: 5px; color: #7f8c8d;">
                坐标: ({{ resource.x }}, {{ resource.y }}) | 
                类型: {{ resource.type === 'danger' ? '重大危险源' : 
                       resource.type === 'warning' ? '危险因素' : '一般检测' }}
              </div>
            </div>
          </template>
          <p v-else style="text-align: center; color: #999; padding: 20px;">监测范围内未发现危险因素</p>
        </div>
      </div>
      
      <div class="analysis-section">
        <h2 class="section-title"><i class="fas fa-video"></i> 摄像头列表</h2>
        <div class="camera-list" id="cameraList">
          <template v-if="cameras.length > 0">
            <div v-for="camera in cameras" 
                 :key="camera.id"
                 class="camera-item"
                 :class="{ selected: selectedCameraId === camera.id }"
                 @click="selectCamera(camera.id)">
              <div class="camera-item-info">
                <div class="camera-item-name">摄像头 {{ camera.id }}</div>
                <div class="camera-item-details">
                  位置: ({{ Math.round(camera.x) }}, {{ Math.round(camera.y) }}) | 
                  角度: {{ Math.round(camera.angle) }}° | 
                  FOV: {{ Math.round(camera.fov) }}° | 
                  面积: {{ calculateCameraArea(camera).toFixed(1) }} m² (1:100)
                </div>
              </div>
              <div class="camera-item-actions">
                <button class="camera-item-btn delete" @click.stop="removeCamera(camera.id)">删除</button>
              </div>
            </div>
          </template>
          <p v-else style="text-align: center; color: #999; padding: 20px;">暂无摄像头</p>
        </div>
      </div>
      
      <div class="analysis-section">
        <h2 class="section-title"><i class="fas fa-video"></i> 摄像头控制</h2>
        <div class="camera-controls">
          <div class="control-group">
            <label for="cameraX">X 坐标:</label>
            <input type="number" id="cameraX" v-model="cameraControl.x" @input="updateCameraControl('x')">
          </div>
          <div class="control-group">
            <label for="cameraY">Y 坐标:</label>
            <input type="number" id="cameraY" v-model="cameraControl.y" @input="updateCameraControl('y')">
          </div>
          <div class="control-group slider-group">
            <label for="cameraAngle">摄像头角度 (°):</label>
            <div class="slider-container">
              <input type="range" id="cameraAngleSlider" min="0" max="360" v-model="cameraControl.angle" @input="updateCameraControl('angle')">
              <span class="slider-value">{{ cameraControl.angle }}</span>
            </div>
          </div>
          <div class="control-group slider-group">
            <label for="cameraFOV">视野角度 (FOV) (°):</label>
            <div class="slider-container">
              <input type="range" id="cameraFOVSlider" min="30" max="359" v-model="cameraControl.fov" @input="updateCameraControl('fov')">
              <span class="slider-value">{{ cameraControl.fov }}</span>
            </div>
          </div>
          <div class="control-group slider-group">
            <label for="cameraRange">监控距离 (米):</label>
            <div class="slider-container">
              <input type="range" id="cameraRangeSlider" min="1" max="10" v-model="cameraControl.range" @input="updateCameraControl('range')">
              <span class="slider-value">{{ cameraControl.range }}</span>
            </div>
          </div>
          <div class="control-group">
            <label for="cameraMode">摄像头模式:</label>
            <select id="cameraMode" v-model="cameraControl.mode">
              <option value="fixed">固定摄像头</option>
              <option value="ptz">PTZ摄像头(可旋转)</option>
            </select>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-value">{{ cameraCoverageCount }}</div>
            <div class="stat-label">监控到资源</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ coveragePercentage }}%</div>
            <div class="stat-label">监控效率</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ cameraArea.toFixed(2) }} m²</div>
            <div class="stat-label">视场大小</div>
            <div style="font-size: 10px; color: #7f8c8d; margin-top: 2px;">基于1:100比例尺计算</div>
          </div>
        </div>
      </div>
      
      <div class="analysis-section">
        <h2 class="section-title"><i class="fas fa-exclamation-triangle"></i> 摄像头覆盖范围内危险因素</h2>
        <div class="resource-list" id="cameraResourceList">
          <template v-if="cameraCoveredResources.length > 0">
            <div v-for="resource in cameraCoveredResources" :key="resource.id" class="resource-item" :class="resource.type">
              <div class="resource-name">{{ resource.name }}</div>
              <div class="resource-desc">{{ resource.description }}</div>
              <div style="font-size: 12px; margin-top: 5px; color: #7f8c8d;">
                坐标: ({{ resource.x }}, {{ resource.y }}) | 
                类型: {{ resource.type === 'danger' ? '重大危险源' : 
                       resource.type === 'warning' ? '危险因素' : '一般检测' }}
              </div>
            </div>
          </template>
          <p v-else style="text-align: center; color: #999; padding: 20px;">请添加摄像头以分析危险因素</p>
        </div>
      </div>
      
      <div class="analysis-section">
        <h2 class="section-title"><i class="fas fa-draw-polygon"></i> 自定义区域覆盖分析</h2>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-value">{{ coveredAreasCount }}</div>
            <div class="stat-label">覆盖区域数</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">{{ areaCoveragePercent.toFixed(1) }}%</div>
            <div class="stat-label">区域覆盖率</div>
          </div>
        </div>
        <div class="resource-list" id="areaCoverageList">
          <template v-if="customAreas.length > 0">
            <div v-for="area in customAreas" :key="area.id" class="resource-item" :class="area.coveragePercent > 50 ? 'info' : 'warning'">
              <div class="resource-name">区域 {{ area.id }}</div>
              <div class="resource-desc">面积: {{ area.area.toFixed(2) }} m²</div>
              <div style="font-size: 12px; margin-top: 5px; color: #7f8c8d;">
                覆盖面积: {{ area.coverageArea.toFixed(2) }} m² | 
                覆盖率: {{ area.coveragePercent.toFixed(1) }}%
              </div>
              <div style="margin-top: 8px;">
                <div style="background: #e0e0e0; height: 6px; border-radius: 3px; overflow: hidden;">
                  <div :style="{ background: area.coveragePercent > 50 ? '#3498db' : '#f39c12', height: '100%', width: Math.min(area.coveragePercent, 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </template>
          <p v-else style="text-align: center; color: #999; padding: 20px;">请先绘制自定义区域</p>
        </div>
      </div>

      <div class="analysis-section">
        <h2 class="section-title"><i class="fas fa-chart-pie"></i> 摄像头优化建议</h2>
        <p style="font-size: 14px; color: #666; margin-bottom: 15px;">
          拖动摄像头控制点调整监控范围，或使用右侧控制面板精确调整。系统会实时计算最佳监控覆盖范围。
        </p>
        <div style="margin-top: 15px;">
          <h3 style="font-size: 15px; margin-bottom: 10px;">使用说明:</h3>
          <ul id="suggestions" style="font-size: 13px; color: #666; padding-left: 20px;">
            <li><strong>点击"上传平面图"按钮</strong>: 上传您自己的建筑平面图</li>
            <li><strong>点击"绘制自定义区域"按钮</strong>: 在平面图上点击添加区域顶点，完成后点击"完成绘制"或按Enter键</li>
            <li><strong>红色圆点</strong>: 摄像头位置 (可拖动)</li>
            <li><strong>红色手柄</strong>: 调整摄像头角度 (可拖动旋转)</li>
            <li><strong>橙色手柄</strong>: 调整视野角度 (FOV) (可拖动缩放)</li>
            <li><strong>绿色手柄</strong>: 调整监控距离 (可拖动伸缩)</li>
            <li><strong>紫色多边形</strong>: 自定义区域，显示摄像头覆盖该区域的面积和占比</li>
          </ul>
        </div>
      </div>
      
      <div class="footer">
        <p>系统基于厂区平面图构建 | 比例尺: 1:100 | 最后更新: 2025年12月</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import ImageBg from '@/assets/point_map.jpg'
// 平面图数据和配置
const planConfig = reactive({
  width: 1129,
  height: 607,
  scale: 1, // 1:100比例尺，1像素=0.01米
  buildingWidth: 1000,
  buildingHeight: 700
})

// 危险因素资源点数据
const resources = ref([
  { id: 1, x: 703, y: 277, name: "人员计数", type: "info", description: "实时统计区域内人员数量" },
  { id: 2, x: 487, y: 411, name: "区域闯入", type: "danger", description: "检测未授权人员进入区域" },
  { id: 3, x: 368, y: 378, name: "未戴安全帽", type: "danger", description: "检测人员是否佩戴安全帽" },
  { id: 4, x: 283, y: 441, name: "跌倒检测", type: "danger", description: "检测人员跌倒情况" },
  { id: 5, x: 721, y: 365, name: "接打电话", type: "warning", description: "检测工作期间接打电话行为" },
  { id: 6, x: 572, y: 288, name: "睡岗检测", type: "danger", description: "检测值班人员睡岗情况" },
  { id: 7, x: 571, y: 322, name: "离岗检测", type: "danger", description: "检测值班人员离岗情况" },
  { id: 8, x: 798, y: 483, name: "人员滞留", type: "warning", description: "检测人员长时间滞留区域" },
  { id: 9, x: 674, y: 500, name: "徘徊检测", type: "warning", description: "检测人员异常徘徊行为" },
  { id: 10, x: 419, y: 241, name: "物品遗落", type: "warning", description: "检测区域物品遗落情况" }
])

// 监测点
const monitoringPoint = ref(null)
const monitoringRange = ref(2) // 米

// 摄像头
const cameras = ref([])
const selectedCameraId = ref(null)
const selectedCamera = computed(() => {
  return cameras.value.find(c => c.id === selectedCameraId.value)
})

// 摄像头控制
const cameraControl = reactive({
  x: 400,
  y: 300,
  angle: 45,
  fov: 60,
  range: 3, // 米
  mode: 'fixed'
})

// 背景图片
const backgroundImage = ref(null)
const imageStatusText = ref('使用默认平面图')

// 自定义区域
const customAreas = ref([])
const currentAreaPoints = ref([])
const isDrawingArea = ref(false)
const currentAreaElement = ref(null)

// 摄像头信息面板
const showCameraInfo = ref(false)

// 拖拽相关
const isDragging = ref(false)
const dragType = ref(null)
const dragData = reactive({
  element: null,
  cameraId: null,
  startX: 0,
  startY: 0,
  elementStartX: 0,
  elementStartY: 0
})

// 拖拽优化相关
const isCameraDragging = ref(false) // 专门用于标识摄像头拖拽状态

// SVG引用
const planSvg = ref(null)

// 计算属性
const monitoredResources = computed(() => {
  if (!monitoringPoint.value) return []
  
  const rangePx = monitoringPoint.value.range
  const centerX = monitoringPoint.value.x
  const centerY = monitoringPoint.value.y
  
  return resources.value.filter(resource => {
    const distance = Math.sqrt(
      Math.pow(resource.x - centerX, 2) + 
      Math.pow(resource.y - centerY, 2)
    )
    return distance <= rangePx
  })
})

const monitoredResourcesCount = computed(() => monitoredResources.value.length)

const coveragePercent = computed(() => {
  if (!monitoringPoint.value) return 0
  
  const buildingArea = planConfig.width * planConfig.height
  const monitoringArea = Math.PI * Math.pow(monitoringPoint.value.range, 2)
  return Math.min(Math.round((monitoringArea / buildingArea) * 100), 100)
})

const cameraCoveredResources = computed(() => {
  const camera = selectedCamera.value
  if (!camera) return []
  
  // 在摄像头拖拽过程中不更新覆盖资源，避免信息面板抖动
  if (isCameraDragging.value) {
    return []
  }
  
  const centerX = camera.x
  const centerY = camera.y
  const angle = camera.angle
  const fov = camera.fov
  const range = camera.range
  
  return resources.value.filter(resource => {
    // 计算资源点到摄像头的距离
    const distance = Math.sqrt(
      Math.pow(resource.x - centerX, 2) + 
      Math.pow(resource.y - centerY, 2)
    )
    
    if (distance <= range) {
      // 计算资源点相对于摄像头的角度
      const dx = resource.x - centerX
      const dy = resource.y - centerY
      let resourceAngle = Math.atan2(dy, dx) * 180 / Math.PI
      
      // 标准化角度到0-360度
      if (resourceAngle < 0) resourceAngle += 360
      
      // 计算角度差
      let angleDiff = Math.abs(resourceAngle - angle)
      if (angleDiff > 180) angleDiff = 360 - angleDiff
      
      // 检查是否在视野角度内
      return angleDiff <= fov / 2
    }
    return false
  })
})

const cameraCoverageCount = computed(() => {
  // 在摄像头拖拽过程中不更新覆盖数量，避免信息面板抖动
  if (isCameraDragging.value) {
    return 0
  }
  return cameraCoveredResources.value.length
})

const coveragePercentage = computed(() => {
  // 在摄像头拖拽过程中不更新覆盖百分比，避免信息面板抖动
  if (isCameraDragging.value) {
    return 0
  }
  return Math.round((cameraCoverageCount.value / resources.value.length) * 100)
})

const cameraArea = computed(() => {
  const camera = selectedCamera.value
  if (!camera) return 0
  
  // 在摄像头拖拽过程中不更新视场大小，避免信息面板抖动
  if (isCameraDragging.value) {
    // 返回上次计算的值或0
    return 0
  }
  
  const rangeMeters = camera.range / 100
  return (camera.fov / 360) * Math.PI * Math.pow(rangeMeters, 2)
})

const coveredAreasCount = computed(() => {
  return customAreas.value.filter(area => area.coveragePercent > 0).length
})

const areaCoveragePercent = computed(() => {
  if (customAreas.value.length === 0) return 0
  
  let totalArea = 0
  let coveredArea = 0
  
  customAreas.value.forEach(area => {
    totalArea += area.area
    coveredArea += area.coverageArea
  })
  
  return totalArea > 0 ? (coveredArea / totalArea) * 100 : 0
})

// 方法
const triggerImageUpload = () => {
  document.getElementById('imageUpload').click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    
    reader.onload = function(e) {
      backgroundImage.value = e.target.result
      imageStatusText.value = "已上传自定义平面图"
    }
    
    reader.readAsDataURL(file)
  }
}

const addMonitoringPoint = () => {
  // 设置监测点初始位置为建筑中心
  const centerX = planConfig.width / 2
  const centerY = planConfig.height / 2
  const rangePx = monitoringRange.value * 100 // 转换为像素 (1:100比例尺，1米=100像素)
  
  monitoringPoint.value = {
    x: centerX,
    y: centerY,
    range: rangePx
  }
  
  updateAnalysis()
}

const updateMonitoringRange = () => {
  if (monitoringPoint.value) {
    monitoringPoint.value.range = monitoringRange.value * 100
    updateAnalysis()
  }
}

const addCamera = () => {
  const cameraId = cameras.value.length + 1
  
  // 设置摄像头初始位置
  const cameraX = 400 + (cameras.value.length * 50)
  const cameraY = 300 + (cameras.value.length * 30)
  const angle = 45 // 角度
  const fov = 60 // 视野角度
  const range = 300 // 监控范围像素值 (3米，1:100比例尺)
  
  const newCamera = {
    id: cameraId,
    x: cameraX,
    y: cameraY,
    angle: angle,
    fov: fov,
    range: range,
    mode: 'fixed'
  }
  
  cameras.value.push(newCamera)
  selectCamera(cameraId)
  
  // 更新摄像头控制面板的值
  updateCameraControlFromCamera(newCamera)
}

const removeCamera = (cameraId) => {
  const cameraIndex = cameras.value.findIndex(c => c.id === cameraId)
  if (cameraIndex !== -1) {
    cameras.value.splice(cameraIndex, 1)
    
    // 如果删除的是当前选中的摄像头，清除选中状态
    if (selectedCameraId.value === cameraId) {
      selectedCameraId.value = null
      showCameraInfo.value = false
    }
    
    // 如果还有摄像头，选择第一个
    if (cameras.value.length > 0 && !selectedCameraId.value) {
      selectCamera(cameras.value[0].id)
    }
  }
}

const selectCamera = (cameraId) => {
  selectedCameraId.value = cameraId
  showCameraInfo.value = true
  
  const camera = cameras.value.find(c => c.id === cameraId)
  if (camera) {
    updateCameraControlFromCamera(camera)
    updateCameraAnalysis()
  }
}

const updateCameraControlFromCamera = (camera) => {
  cameraControl.x = Math.round(camera.x)
  cameraControl.y = Math.round(camera.y)
  cameraControl.angle = Math.round(camera.angle)
  cameraControl.fov = Math.round(camera.fov)
  cameraControl.range = Math.round(camera.range / 100)
  cameraControl.mode = camera.mode || 'fixed'
}

const updateCameraControl = (property) => {
  const camera = selectedCamera.value
  if (!camera) return
  
  switch (property) {
    case 'x':
      camera.x = parseInt(cameraControl.x)
      break
    case 'y':
      camera.y = parseInt(cameraControl.y)
      break
    case 'angle':
      camera.angle = parseInt(cameraControl.angle)
      break
    case 'fov':
      camera.fov = parseInt(cameraControl.fov)
      break
    case 'range':
      camera.range = parseInt(cameraControl.range) * 100
      break
    case 'mode':
      camera.mode = cameraControl.mode
      break
  }
  
  updateCameraAnalysis()
}

const updateAnalysis = () => {
  // 分析功能通过计算属性自动更新
}

const updateCameraAnalysis = () => {
  // 分析功能通过计算属性自动更新
  // 更新自定义区域覆盖分析
  updateAreaCoverageAnalysis()
}

const toggleDrawingArea = () => {
  if (isDrawingArea.value) {
    finishDrawCustomArea()
  } else {
    startDrawCustomArea()
  }
}

const startDrawCustomArea = () => {
  if (isDrawingArea.value) {
    alert('正在绘制区域，请先完成当前区域或按ESC取消')
    return
  }
  
  isDrawingArea.value = true
  currentAreaPoints.value = []
  
  // 添加键盘事件监听
  document.addEventListener('keydown', handleAreaDrawingKeydown)
  
  alert('点击平面图添加区域顶点，至少需要3个点。完成后点击"完成绘制"按钮或按ESC取消。')
}

const handleSvgClick = (event) => {
  if (!isDrawingArea.value) return
  
  const rect = planSvg.value.getBoundingClientRect()
  
  // 计算鼠标在SVG内的相对位置
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  
  // 计算缩放比例（SVG内部尺寸 vs 显示尺寸）
  const scaleX = planConfig.width / rect.width
  const scaleY = planConfig.height / rect.height
  
  // 转换到SVG内部坐标系
  const svgX = mouseX * scaleX
  const svgY = mouseY * scaleY
  
  currentAreaPoints.value.push({ x: svgX, y: svgY })
}

const handleAreaDrawingKeydown = (event) => {
  if (event.key === 'Escape') {
    cancelDrawCustomArea()
  } else if (event.key === 'Enter') {
    finishDrawCustomArea()
  }
}

const finishDrawCustomArea = () => {
  if (!isDrawingArea.value) return
  
  if (currentAreaPoints.value.length < 3) {
    alert('至少需要3个点才能构成一个区域')
    return
  }
  
  // 移除事件监听
  document.removeEventListener('keydown', handleAreaDrawingKeydown)
  
  // 计算区域面积
  const area = calculatePolygonArea(currentAreaPoints.value)
  
  // 保存区域
  const areaId = customAreas.value.length + 1
  const customArea = {
    id: areaId,
    points: [...currentAreaPoints.value],
    area: area,
    coverageArea: 0,
    coveragePercent: 0
  }
  customAreas.value.push(customArea)
  
  // 重置绘制状态
  isDrawingArea.value = false
  currentAreaPoints.value = []
  
  // 更新区域覆盖分析
  updateAreaCoverageAnalysis()
  
  alert(`自定义区域绘制完成！区域面积: ${area.toFixed(2)} 平方米`)
}

const cancelDrawCustomArea = () => {
  if (!isDrawingArea.value) return
  
  // 移除事件监听
  document.removeEventListener('keydown', handleAreaDrawingKeydown)
  
  // 重置绘制状态
  isDrawingArea.value = false
  currentAreaPoints.value = []
  
  alert('已取消绘制')
}

const removeAreaVertex = (index) => {
  if (isDrawingArea.value && currentAreaPoints.value.length > 0) {
    currentAreaPoints.value.splice(index, 1)
  }
}

const calculatePolygonArea = (points) => {
  let area = 0
  const n = points.length
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += points[i].x * points[j].y
    area -= points[j].x * points[i].y
  }
  
  area = Math.abs(area) / 2
  
  // 转换为平方米（1像素=0.01米）
  const areaInMeters = area * 0.0001
  
  return areaInMeters
}

const getAreaPoints = (area) => {
  return area.points.map(p => `${p.x},${p.y}`).join(' ')
}

const updateAreaCoverageAnalysis = () => {
  const camera = selectedCamera.value
  
  customAreas.value.forEach(area => {
    let coverageArea = 0
    let coveragePercent = 0
    
    if (camera) {
      // 计算摄像头覆盖该区域的面积
      coverageArea = calculatePolygonSectorIntersection(
        area.points,
        { x: camera.x, y: camera.y },
        camera.angle,
        camera.fov,
        camera.range
      )
      
      coveragePercent = (coverageArea / area.area) * 100
    }
    
    area.coverageArea = coverageArea
    area.coveragePercent = coveragePercent
  })
}

const calculatePolygonSectorIntersection = (polygon, center, angle, fov, range) => {
  const samples = 1000
  let intersectionCount = 0
  
  // 获取多边形边界
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  polygon.forEach(p => {
    minX = Math.min(minX, p.x)
    minY = Math.min(minY, p.y)
    maxX = Math.max(maxX, p.x)
    maxY = Math.max(maxY, p.y)
  })
  
  // 在多边形边界框内采样
  for (let i = 0; i < samples; i++) {
    const x = minX + Math.random() * (maxX - minX)
    const y = minY + Math.random() * (maxY - minY)
    const point = { x, y }
    
    if (isPointInPolygon(point, polygon) && isPointInSector(point, center, angle, fov, range)) {
      intersectionCount++
    }
  }
  
  // 计算交集面积
  const boundingBoxArea = (maxX - minX) * (maxY - minY)
  const intersectionArea = (intersectionCount / samples) * boundingBoxArea
  
  // 转换为平方米
  return intersectionArea * 0.0001
}

const isPointInPolygon = (point, polygon) => {
  let inside = false
  const n = polygon.length
  
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y
    const xj = polygon[j].x, yj = polygon[j].y
    
    if (((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
      inside = !inside
    }
  }
  
  return inside
}

const isPointInSector = (point, center, angle, fov, range) => {
  const dx = point.x - center.x
  const dy = point.y - center.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance > range) return false
  
  let pointAngle = Math.atan2(dy, dx) * 180 / Math.PI
  if (pointAngle < 0) pointAngle += 360
  
  let angleDiff = Math.abs(pointAngle - angle)
  if (angleDiff > 180) angleDiff = 360 - angleDiff
  
  return angleDiff <= fov / 2
}

const getCameraCoveragePath = (camera) => {
  const startAngle = (camera.angle - camera.fov/2) * Math.PI / 180
  const endAngle = (camera.angle + camera.fov/2) * Math.PI / 180
  
  const x1 = camera.x + camera.range * Math.cos(startAngle)
  const y1 = camera.y + camera.range * Math.sin(startAngle)
  const x2 = camera.x + camera.range * Math.cos(endAngle)
  const y2 = camera.y + camera.range * Math.sin(endAngle)
  
  const largeArcFlag = camera.fov > 180 ? 1 : 0
  return `M ${camera.x} ${camera.y} L ${x1} ${y1} A ${camera.range} ${camera.range} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

const getFovPoint = (camera, side) => {
  const angle = side === 'left' 
    ? (camera.angle - camera.fov/2) * Math.PI / 180
    : (camera.angle + camera.fov/2) * Math.PI / 180
  
  return {
    x: camera.x + 80 * Math.cos(angle),
    y: camera.y + 80 * Math.sin(angle)
  }
}

const calculateCameraArea = (camera) => {
  const rangeMeters = camera.range / 100
  return (camera.fov / 360) * Math.PI * Math.pow(rangeMeters, 2)
}

const startDrag = (event, type, cameraId = null) => {
  event.preventDefault()
  event.stopPropagation()
  
  isDragging.value = true
  dragType.value = type
  dragData.cameraId = cameraId
  dragData.startX = event.clientX
  dragData.startY = event.clientY
  
  // 保存元素初始位置
  const camera = cameras.value.find(c => c.id === cameraId)
  if (camera) {
    dragData.elementStartX = camera.x
    dragData.elementStartY = camera.y
  } else if (monitoringPoint.value && type === 'monitoring-point') {
    dragData.elementStartX = monitoringPoint.value.x
    dragData.elementStartY = monitoringPoint.value.y
  }
  
  // 添加全局事件监听
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

const handleDrag = (event) => {
  if (!isDragging.value) return
  
  const deltaX = event.clientX - dragData.startX
  const deltaY = event.clientY - dragData.startY
  
  if (dragType.value === 'monitoring-point' && monitoringPoint.value) {
    // 计算新的位置
    const rect = planSvg.value.getBoundingClientRect()
    const scaleX = planConfig.width / rect.width
    const scaleY = planConfig.height / rect.height
    
    const newX = dragData.elementStartX + deltaX * scaleX
    const newY = dragData.elementStartY + deltaY * scaleY
    
    // 限制在建筑平面图范围内
    const boundedX = Math.max(50, Math.min(newX, planConfig.width - 50))
    const boundedY = Math.max(50, Math.min(newY, planConfig.height - 50))
    
    monitoringPoint.value.x = boundedX
    monitoringPoint.value.y = boundedY
    
    updateAnalysis()
    
  } else if (dragType.value.includes('camera') && dragData.cameraId) {
    const camera = cameras.value.find(c => c.id === dragData.cameraId)
    if (!camera) return
    
    // 设置摄像头拖拽状态
    if (!isCameraDragging.value) {
      isCameraDragging.value = true
    }
    
    const rect = planSvg.value.getBoundingClientRect()
    const scaleX = planConfig.width / rect.width
    const scaleY = planConfig.height / rect.height
    
    if (dragType.value === 'camera') {
      // 移动摄像头
      const newX = dragData.elementStartX + deltaX * scaleX
      const newY = dragData.elementStartY + deltaY * scaleY
      
      // 限制在建筑平面图范围内
      const boundedX = Math.max(50, Math.min(newX, planConfig.width - 50))
      const boundedY = Math.max(50, Math.min(newY, planConfig.height - 50))
      
      camera.x = boundedX
      camera.y = boundedY
      
      // 更新摄像头控制面板
      updateCameraControlFromCamera(camera)
      
    } else if (dragType.value === 'angle-handle') {
      // 计算新的角度
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      const mouseSvgX = mouseX * scaleX
      const mouseSvgY = mouseY * scaleY
      
      const dx = mouseSvgX - camera.x
      const dy = mouseSvgY - camera.y
      const newAngle = Math.atan2(dy, dx) * 180 / Math.PI
      
      // 标准化角度到0-360度
      const normalizedAngle = (newAngle + 360) % 360
      camera.angle = normalizedAngle
      
      // 更新摄像头控制面板
      cameraControl.angle = Math.round(normalizedAngle)
      
    } else if (dragType.value === 'range-handle') {
      // 计算新的监控距离
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      const mouseSvgX = mouseX * scaleX
      const mouseSvgY = mouseY * scaleY
      
      const dx = mouseSvgX - camera.x
      const dy = mouseSvgY - camera.y
      const newRange = Math.sqrt(dx*dx + dy*dy) / 0.8
      
      // 限制范围
      const minRange = 100 // 1米 (1:100比例尺，1米=100像素)
      const maxRange = 1000 // 10米 (1:100比例尺，1米=100像素)
      const boundedRange = Math.max(minRange, Math.min(newRange, maxRange))
      
      camera.range = boundedRange
      
      // 更新摄像头控制面板
      cameraControl.range = Math.round(boundedRange / 100)
    }
    
    // 不在拖拽过程中更新摄像头分析，避免信息面板抖动
    // updateCameraAnalysis()
  }
}

const stopDrag = () => {
  isDragging.value = false
  dragType.value = null
  dragData.cameraId = null
  
  // 结束摄像头拖拽状态并更新分析
  if (isCameraDragging.value) {
    isCameraDragging.value = false
    updateCameraAnalysis() // 拖拽结束后再更新分析
  }
  
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

const handleSvgMouseDown = (event) => {
  // 阻止SVG上的默认拖拽行为
  if (!event.target.classList.contains('camera') && 
      !event.target.classList.contains('monitoring-point') &&
      !event.target.classList.contains('angle-handle') &&
      !event.target.classList.contains('fov-handle') &&
      !event.target.classList.contains('range-handle')) {
    // 如果不是在可拖拽元素上点击，可以处理其他逻辑
  }
}

const handleSvgMouseMove = (event) => {
  // 处理鼠标移动事件，主要用于拖拽
}

const handleSvgMouseUp = (event) => {
  // 处理鼠标释放事件
}

const selectResource = (resource) => {
  console.log('选中资源:', resource)
}

const selectArea = (areaId) => {
  console.log('选中区域:', areaId)
}

const clearAll = () => {
  monitoringPoint.value = null
  cameras.value = []
  selectedCameraId.value = null
  showCameraInfo.value = false
  customAreas.value = []
  isDrawingArea.value = false
  currentAreaPoints.value = []
  
  // 重置范围滑块
  monitoringRange.value = 2
  
  alert('已清除所有元素')
}

const exportConfig = () => {
  const config = {
    monitoringPoint: monitoringPoint.value ? {
      x: monitoringPoint.value.x,
      y: monitoringPoint.value.y,
      range: monitoringPoint.value.range / 100 // 转换为米
    } : null,
    cameras: cameras.value.map(camera => ({
      id: camera.id,
      x: camera.x,
      y: camera.y,
      angle: camera.angle,
      fov: camera.fov,
      range: camera.range / 100, // 转换为米
      mode: camera.mode
    })),
    customAreas: customAreas.value.map(area => ({
      id: area.id,
      points: area.points,
      area: area.area
    })),
    resources: resources.value,
    exportTime: new Date().toISOString(),
    planInfo: "示例地区省建筑设计院 - 四层修改平面图"
  }
  
  const dataStr = JSON.stringify(config, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  
  const exportFileDefaultName = '监控配置_' + new Date().toISOString().slice(0,10) + '.json'
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
  
  alert('配置已导出为JSON文件')
}

// 初始化
onMounted(() => {
  // 加载默认平面图
  backgroundImage.value = ImageBg
  
  // 添加初始摄像头
  setTimeout(() => {
    addCamera()
  }, 100)
})

// 监听监测点变化
watch(monitoringPoint, () => {
  updateAnalysis()
}, { deep: true })

// 监听摄像头变化
watch(cameras, () => {
  updateCameraAnalysis()
}, { deep: true })

// 监听选中的摄像头变化
watch(selectedCameraId, (newVal) => {
  if (newVal) {
    updateCameraAnalysis()
  }
})
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  height: 100%;
}

/* 左侧平面图区域 */
.left-panel {
  flex: 3;
  padding: 10px;
  border-right: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}

.header h1 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 5px;
}

.header .subtitle {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 3px;
}

.plan-container {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  position: relative;
  overflow: auto;
  min-height: 600px;
}

.plan-toolbar {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px 0;
  flex-wrap: wrap;
}

.tool-btn {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.tool-btn.danger {
  background: #e74c3c;
}

.tool-btn.danger:hover {
  background: #c0392b;
}

.tool-btn.success {
  background: #2ecc71;
}

.tool-btn.success:hover {
  background: #27ae60;
}

.tool-btn.info {
  background: #9b59b6;
}

.tool-btn.info:hover {
  background: #8e44ad;
}

.tool-btn.active {
  background: #8e44ad;
  box-shadow: 0 0 10px rgba(142, 68, 173, 0.5);
}

/* 右侧控制面板 */
.right-panel {
  flex: 1.5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  overflow-y: auto;
}

.analysis-section {
  margin-bottom: 25px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #3498db;
}

.range-input {
  width: 100%;
  margin: 15px 0;
}

.range-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.range-display {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  color: #7f8c8d;
  font-size: 14px;
}

.resource-list {
  margin-top: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.resource-item {
  padding: 12px 15px;
  border-left: 4px solid #e74c3c;
  margin-bottom: 10px;
  background-color: #fef5f5;
  border-radius: 0 6px 6px 0;
}

.resource-item.warning {
  border-left-color: #f39c12;
  background-color: #fef9e7;
}

.resource-item.info {
  border-left-color: #3498db;
  background-color: #f0f8ff;
}

.resource-name {
  font-weight: 600;
  margin-bottom: 5px;
}

.resource-desc {
  font-size: 13px;
  color: #666;
}

.camera-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
}

.control-group {
  display: flex;
  flex-direction: column;
}

.control-group label {
  font-size: 13px;
  margin-bottom: 5px;
  color: #555;
}

.control-group input, .control-group select {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.control-group.slider-group {
  grid-column: 1 / span 2;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-container input[type="range"] {
  flex: 1;
}

.slider-value {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
}

.stat-box {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
}

.stat-label {
  font-size: 13px;
  color: #7f8c8d;
  margin-top: 5px;
}

/* 摄像头控制手柄 */
.camera-handle {
  fill: #3498db;
  stroke: #2980b9;
  stroke-width: 2;
  cursor: move;
}

.camera-handle:hover {
  fill: #2980b9;
}

.angle-handle {
  fill: #e74c3c;
  stroke: #c0392b;
  stroke-width: 2;
  cursor: pointer;
}

.angle-handle:hover {
  fill: #c0392b;
}

.fov-handle {
  fill: #f39c12;
  stroke: #d68910;
  stroke-width: 2;
  cursor: pointer;
}

.fov-handle:hover {
  fill: #d68910;
}

.range-handle {
  fill: #2ecc71;
  stroke: #27ae60;
  stroke-width: 2;
  cursor: pointer;
}

.range-handle:hover {
  fill: #27ae60;
}

/* 平面图样式 */
.plan-svg {
  width: 100%;
  height: 100%;
  min-width: 800px;
  min-height: 600px;
}

.building-outline {
  fill: #f8f9fa;
  stroke: #7f8c8d;
  stroke-width: 2;
}

.room {
  fill: #e8f4fc;
  stroke: #bdc3c7;
  stroke-width: 1;
}

.room-label {
  font-size: 10px;
  fill: #34495e;
  pointer-events: none;
}

.monitoring-point {
  fill: #3498db;
  stroke: #2980b9;
  stroke-width: 2;
  cursor: move;
}

.monitoring-range {
  fill: rgba(52, 152, 219, 0.1);
  stroke: rgba(52, 152, 219, 0.3);
  stroke-width: 1;
  stroke-dasharray: 5,5;
}

.camera {
  fill: #e74c3c;
  cursor: move;
}

.camera.selected {
  fill: #c0392b;
  stroke: #fff;
  stroke-width: 2;
}

.camera-direction {
  stroke: #e74c3c;
  stroke-width: 2;
  marker-end: url(#arrowhead);
}

.camera-coverage {
  fill: rgba(231, 76, 60, 0.1);
  stroke: rgba(231, 76, 60, 0.3);
  stroke-width: 1;
}

.resource-marker {
  fill: #2ecc71;
  cursor: pointer;
}

.resource-marker.danger {
  fill: #e74c3c;
}

.resource-marker.warning {
  fill: #f39c12;
}

.resource-marker.info {
  fill: #3498db;
}

.custom-area {
  fill: rgba(155, 89, 182, 0.2);
  stroke: #9b59b6;
  stroke-width: 2;
}

.area-vertex {
  fill: #9b59b6;
  stroke: #fff;
  stroke-width: 2;
  cursor: pointer;
}

.area-vertex:hover {
  fill: #8e44ad;
  r: 7;
}

.camera-coverage-line {
  stroke: rgba(231, 76, 60, 0.5);
  stroke-width: 1;
  stroke-dasharray: 3,3;
}

.legend {
  position: absolute;
  bottom: 20px;
  right: 0px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  width: 200px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.footer {
  margin-top: 20px;
  text-align: center;
  color: #95a5a6;
  font-size: 12px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

/* 摄像头信息面板 */
.camera-info {
  position: absolute;
  top: 80px;
  left: 10px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 10;
}

.camera-info h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.camera-info p {
  font-size: 13px;
  margin-bottom: 8px;
  color: #555;
}

.camera-info .close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #7f8c8d;
}

.camera-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.camera-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.camera-item:hover {
  background: #e9ecef;
  border-color: #dee2e6;
}

.camera-item.selected {
  background: #e3f2fd;
  border-color: #2196f3;
}

.camera-item-info {
  flex: 1;
}

.camera-item-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.camera-item-details {
  font-size: 12px;
  color: #7f8c8d;
}

.camera-item-actions {
  display: flex;
  gap: 8px;
}

.camera-item-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

.camera-item-btn.delete {
  background: #e74c3c;
  color: white;
}

.camera-item-btn.delete:hover {
  background: #c0392b;
}

/* 图片上传样式 */
.upload-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.upload-btn {
  padding: 8px 12px;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.upload-btn:hover {
  background: #8e44ad;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .container {
    flex-direction: column;
    height: auto;
  }
  
  .left-panel, .right-panel {
    width: 100%;
  }
}
</style>