<template>
  <div class="canvas-drawing-container">
    <Spin :spinning="!currentImage" tip="图片加载中...">
      <div class="min-w-[600px] min-h-[400px] relative">
        <img 
          :src="currentImage" 
          alt="当前帧图片" 
          class="w-full h-full object-contain" 
          v-if="currentImage" 
          ref="imageRef"
          @load="onImageLoad" 
        />
        <canvas 
          ref="canvasRef" 
          :class="[
            'absolute top-0 left-0 w-full h-full', 
            {'cursor-crosshair': drawingMode && !props.viewMode, 'cursor-default': (!drawingMode || props.viewMode)}
          ]"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="onMouseLeave"
          @dblclick="finishPolygon"
          v-if="currentImage" 
        />
      </div>
    </Spin>
    <div class="footer_show w-full flex justify-between mt-[16px]">
      <div class="left_footer">
        <Button 
          v-if="!props.viewMode && (!props.currentParamType || props.currentParamType === 'polygon')"
          :type="drawingMode === 'polygon' ? 'default' : 'primary'" 
          @click="setDrawingMode('polygon')"
          class="mr-[8px]"
        >
          {{ drawingMode === 'polygon' ? '取消多边形' : '编辑多边形' }}
        </Button>
        <Button 
          v-if="!props.viewMode && (!props.currentParamType || props.currentParamType === 'line')"
          :type="drawingMode === 'line' ? 'default' : 'primary'" 
          @click="setDrawingMode('line')"
          class="mr-[8px]"
        >
          {{ drawingMode === 'line' ? '取消直线' : '编辑直线' }}
        </Button>
        <Button v-if="!props.viewMode" danger @click="clearCanvas">清除</Button>
        <!-- <Button @click="deleteLastRegion" class="mr-[8px]" :disabled="drawnRegions.length === 0">删除最后一条线段</Button> -->
      </div>
      <div class="right_footer">
        <Button @click="cancelDrawing" class="mr-[8px]">取消</Button>
        <Button v-if="!props.viewMode" type="primary" @click="saveDrawing">保存</Button>
      </div>
    </div>

    <!-- 直线配置方向 -->
    <Modal
      v-model:open="showDirectionModal"
      title="属性设置"
      @ok="updateLine"
      @cancel="cancelLine"
      cancelText="删除"
      okText="保存"
      :maskClosable="false"
      :closable="false"
    >
      <div class="">
          <div v-for="item,key in formSchema[currentParamKey]" :key="key" class="mb-4" 
          >
            <template v-if="item?.type && item?.type !== 'line' && item?.type !== 'polygon' && item?.type !== 'string'">
                <div class="flex justify-between items-center mb-2">
                  <span>{{ item.label }}
                    <Tooltip :title="item?.desc" v-if="item?.desc">
                        <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                </div>
                <div v-if="item?.type === 'input'">
                  <Input v-model:value="formState[key]" :placeholder="item?.placeholder || '请输入'" />
                </div>
                <div v-if="item?.type === 'radio' && item?.options" class="flex items-center space-x-2">
                  <RadioGroup v-model:value="formState[key]" class="flex items-center space-x-2">
                    <Radio v-for="option in item.options" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </Radio>
                  </RadioGroup>
                </div>
            </template>
          </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted,computed,watch } from 'vue';
import { Button, Spin, Modal, Input,Radio,RadioGroup,Tooltip } from 'ant-design-vue';
import {QuestionCircleOutlined} from '@ant-design/icons-vue';
// 定义组件的 props
interface Props {
  cameraId?: string;
  modelId?: string;
  viewMode?: boolean;
  currentParamType?: 'line' | 'polygon';
  currentParamKey: string;
  formSchema: any;
  defaultFormState: any;
  minCount: number;
  maxCount: number;
  initialRegions?: { [key: string]: Array<{ [key: string]: any }> };
}

// 定义组件的 emits
interface Emits {
  (e: 'save', regions: { [key: string]: Array<{ [key: string]: any }> }): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  cameraId: '',
  initialRegions: () => ({}),
  modelId: '',
  viewMode: false,
  currentParamType: undefined,
  formSchema:{},
  minCount: 1,
  maxCount: 10,
});


const emit = defineEmits<Emits>();

// 响应式数据
const currentImage = ref<string>('');
const imageRef = ref<HTMLImageElement>();
const canvasRef = ref<HTMLCanvasElement>();
const drawingMode = ref<string>(''); // 'polygon', 'line'
const isDrawing = ref<boolean>(false);
const currentPath = ref<{x: number, y: number}[]>([]);
const drawnRegions = ref<{ [key: string]: Array<{ [key: string]: any }> }>({});
const originalImageSize = ref({ width: 0, height: 0 }); // 存储原始图片尺寸
const lineDrawingState = ref<'idle' | 'start_set' | 'drawing'>('idle'); // 跟踪直线绘制状态
const formState = ref({})
const currentEditingIndex = ref<number>(-1); // 当前正在编辑的图形索引

// 方向标注相关状态
const showDirectionModal = ref<boolean>(false);
const currentLineWithDirection = ref<{shape: {type: string, points: {x: number, y: number}[], direction?: string}, direction: string | null}>({shape: {type: '', points: [], direction: undefined}, direction: null});





// 设置绘制模式
const setDrawingMode = (mode: string) => {
  if (props.viewMode) return; // 查看模式下不允许设置绘制模式
  
  // 如果当前参数类型被指定，且不匹配当前绘制模式，则不允许切换
  if (props.currentParamType && props.currentParamType !== mode) {
    return;
  }
  
  if (drawingMode.value === mode) {
    // 如果当前模式已经是该模式，则取消绘制
    drawingMode.value = '';
    isDrawing.value = false;
    currentPath.value = [];
    lineDrawingState.value = 'idle'; // 重置直线绘制状态
  } else {
    // 设置新绘制模式
    drawingMode.value = mode;
    isDrawing.value = false;
    currentPath.value = [];
    lineDrawingState.value = 'idle'; // 重置直线绘制状态
  }
};

// 获取鼠标位置（相对于canvas元素的实际像素坐标）
const getMousePos = (e: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  
  const rect = canvas.getBoundingClientRect();
  
  // 计算相对于canvas的实际坐标
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  
  // 确保坐标在canvas范围内
  x = Math.max(0, Math.min(x, canvas.width));
  y = Math.max(0, Math.min(y, canvas.height));
  
  // 返回canvas内部的实际像素坐标
  return {
    x: x,
    y: y
  };
};

// 开始绘制
const startDrawing = (e: MouseEvent) => {
  if (!drawingMode.value || props.viewMode) return;
  
  if (props.currentParamType && props.currentParamType !== drawingMode.value) {
    return;
  }
  
  const currentKey = props.currentParamKey;
  const currentRegions = drawnRegions.value[currentKey];
  const currentCount = Array.isArray(currentRegions) ? currentRegions.length : 0;
  
  if (currentCount >= props.maxCount) {
    return;
  }
  
  const pos = getMousePos(e);
  
  if (drawingMode.value === 'line') {
    // 直线模式：第一次点击设置起点，第二次点击设置终点并完成线段
    if (lineDrawingState.value === 'idle') {
      // 第一次点击，设置起点
      currentPath.value = [pos];
      lineDrawingState.value = 'start_set';
      isDrawing.value = true;
    } else if (lineDrawingState.value === 'start_set') {
      currentPath.value.push(pos);
      
      const normalizedPoints = currentPath.value.map(point => ({
        x: point.x / (canvasRef.value?.width || 1),
        y: point.y / (canvasRef.value?.height || 1)
      }));
      
      const currentKey = props.currentParamKey;
      const currentSchema = props.formSchema[currentKey];
      
      if (!drawnRegions.value[currentKey]) {
        drawnRegions.value[currentKey] = [];
      }
      
      const newShape: any = {};
      
      if (currentSchema) {
        Object.keys(currentSchema).forEach(key => {
          newShape[key] = currentSchema[key].default || null;
          if(currentSchema[key].type === 'line'){
            newShape[key] = normalizedPoints;
          }
        })
      }
      
      // 立即添加到drawnRegions并显示
      drawnRegions.value[currentKey].push(newShape);
      currentEditingIndex.value = drawnRegions.value[currentKey].length - 1;
      
      // 设置formState用于弹出框
      formState.value = { ...newShape };
      
      showDirectionModal.value = true;
      
      currentPath.value = [];
      lineDrawingState.value = 'idle';
      isDrawing.value = false;
      redrawCanvas();
    }
  } else {
    isDrawing.value = true;
    currentPath.value.push(pos);
    redrawCanvas();
  }
};

// 绘制
const draw = (e: MouseEvent) => {
  if (!drawingMode.value || props.viewMode) return;
  
  // 如果当前参数类型被指定，且不匹配当前绘制模式，则不允许绘制
  if (props.currentParamType && props.currentParamType !== drawingMode.value) {
    return;
  }
  
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const pos = getMousePos(e);
  
  // 清除画布并重绘所有内容
  redrawCanvas();
  
  // 绘制当前路径（但不保存到已绘制区域中）
  if (currentPath.value.length > 0) {
    ctx.beginPath();
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    
    // 特殊处理直线模式下的预览线
    if (drawingMode.value === 'line' && lineDrawingState.value === 'start_set') {
      // 直线模式下，只绘制从起点到当前鼠标位置的预览线
      ctx.moveTo(currentPath.value[0].x, currentPath.value[0].y);
      ctx.lineTo(pos.x, pos.y); // 连接到鼠标当前位置
      ctx.stroke();
      
      // 绘制起点的圆点标记
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(currentPath.value[0].x, currentPath.value[0].y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // 绘制鼠标当前位置的小圆点
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    } else if (drawingMode.value === 'polygon') {
      // 多边形模式保持原有逻辑
      ctx.moveTo(currentPath.value[0].x, currentPath.value[0].y);
      for (let i = 1; i < currentPath.value.length; i++) {
        ctx.lineTo(currentPath.value[i].x, currentPath.value[i].y);
      }
      ctx.lineTo(pos.x, pos.y); // 连接到鼠标当前位置
      ctx.stroke();
      
      // 绘制起点和终点的圆点标记
      ctx.fillStyle = '#FF0000';
      for (let i = 0; i < currentPath.value.length; i++) {
        ctx.beginPath();
        ctx.arc(currentPath.value[i].x, currentPath.value[i].y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // 绘制鼠标当前位置的小圆点
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // 如果是多边形模式且有至少2个点，绘制到起始点的虚线提示
      if (currentPath.value.length >= 2) {
        const firstPoint = currentPath.value[0];
        const distance = Math.sqrt(Math.pow(firstPoint.x - pos.x, 2) + Math.pow(firstPoint.y - pos.y, 2));
        
        if (distance < 15) { // 当接近起始点时，显示虚线提示闭合
          ctx.setLineDash([5, 3]); // 设置虚线样式
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(firstPoint.x, firstPoint.y);
          ctx.strokeStyle = '#FF0000';
          ctx.stroke();
          ctx.setLineDash([]); // 恢复实线样式
        }
      }
    }
  }
};

// 停止绘制
const stopDrawing = (e?: MouseEvent) => {
  if (!drawingMode.value || props.viewMode) return;
  
  // 如果当前参数类型被指定，且不匹配当前绘制模式，则不允许停止绘制
  if (props.currentParamType && props.currentParamType !== drawingMode.value) {
    return;
  }
  
  // 直线模式的逻辑已经在startDrawing中处理
  // 这里只需要处理多边形模式
  if (drawingMode.value === 'polygon') {
    if (isDrawing.value) {
      isDrawing.value = false;
      // 检查是否点击了第一个点来闭合多边形
      if (currentPath.value.length >= 3) {
        const firstPoint = currentPath.value[0];
        const lastPoint = currentPath.value[currentPath.value.length - 1];
        const distance = Math.sqrt(Math.pow(firstPoint.x - lastPoint.x, 2) + Math.pow(firstPoint.y - lastPoint.y, 2));
        
        // 如果距离小于10像素，认为是点击了第一个点来闭合多边形
        if (distance < 10) {
          finishPolygon();
        }
      }
    }
  }
};

// 鼠标离开画布
const onMouseLeave = (e?: MouseEvent) => {
  // 在直线模式下，如果正在等待第二个点，当鼠标移出画布时可以考虑取消当前操作
  if (drawingMode.value === 'line' && lineDrawingState.value === 'start_set') {
    // 可以选择在此处重置状态，也可以保留状态直到下次点击
    // 目前我们保留状态，因为用户可能会快速移回画布
  }
};

// 键盘事件处理
const handleKeyDown = (e: KeyboardEvent) => {
  // ESC键取消当前绘制
  if (e.key === 'Escape') {
    if (!props.viewMode && drawingMode.value && lineDrawingState.value !== 'idle' && (!props.currentParamType || props.currentParamType === drawingMode.value)) {
      // 如果正在绘制，取消当前操作
      currentPath.value = [];
      lineDrawingState.value = 'idle';
      isDrawing.value = false;
      redrawCanvas();
    }
  }
};

// 组件挂载时绑定键盘事件
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

// 组件卸载时移除键盘事件
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// 双击完成多边形
const finishPolygon = () => {
  if (!props.viewMode && drawingMode.value === 'polygon' && currentPath.value.length >= 3 && (!props.currentParamType || props.currentParamType === 'polygon')) {
    const normalizedPoints = currentPath.value.map(point => ({
      x: point.x / (canvasRef.value?.width || 1),
      y: point.y / (canvasRef.value?.height || 1)
    }));

    const currentKey = props.currentParamKey;
    const currentSchema = props.formSchema[currentKey];
    if (!drawnRegions.value[currentKey]) {
      drawnRegions.value[currentKey] = [];
    }
    
    const newShape: any = {};
    if (currentSchema) {
      Object.keys(currentSchema).forEach(key => {
        newShape[key] = currentSchema[key].default || null;
        if(currentSchema[key].type === 'polygon'){
          newShape[key] = normalizedPoints;
        }
      })
    }
    
    // 立即添加到drawnRegions并显示
    drawnRegions.value[currentKey].push(newShape);
    currentEditingIndex.value = drawnRegions.value[currentKey].length - 1;
    
    // 设置formState用于弹出框
    formState.value = { ...newShape };

    showDirectionModal.value = true;

    currentPath.value = [];
    redrawCanvas();
  }
};

// 选择方向
const updateLine = () => {
  const currentKey = props.currentParamKey;
  const schema = props.formSchema[currentKey];
  console.log('formState.value:', formState.value);
  if (!schema) return;
  
  const regions = drawnRegions.value[currentKey];
  if (!Array.isArray(regions)) return;
  
  // 更新当前正在编辑的图形
  if (currentEditingIndex.value >= 0 && currentEditingIndex.value < regions.length) {
    // 更新图形的属性
    Object.keys(formState.value).forEach(key => {
      regions[currentEditingIndex.value][key] = formState.value[key];
    });
  }

  showDirectionModal.value = false;
  currentEditingIndex.value = -1;

  redrawCanvas();
};

// 取消方向选择
const cancelLine = () => {
  const currentKey = props.currentParamKey;
  const regions = drawnRegions.value[currentKey];
  
  if (Array.isArray(regions) && currentEditingIndex.value >= 0 && currentEditingIndex.value < regions.length) {
    // 删除当前正在编辑的图形
    regions.splice(currentEditingIndex.value, 1);
  }
  
  showDirectionModal.value = false;
  currentEditingIndex.value = -1;
  redrawCanvas();
};

// 重绘画布
const redrawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 2;
  
  Object.keys(drawnRegions.value).forEach(key => {
    const schema = props.formSchema[key];
    if (!schema) return;
    
    const regions = drawnRegions.value[key];
    if (!Array.isArray(regions)) return;
    
    const pointsKey = Object.keys(schema).find(schemaKey => 
      schema[schemaKey].type === 'line' || schema[schemaKey].type === 'polygon'
    );
    
    if (!pointsKey) return;
    
    const shapeType = schema[pointsKey].type;
    
    regions.forEach(region => {
      const points = region[pointsKey];
      
      if (!points || !Array.isArray(points)) return;
      
      const pixelPoints = points.map(point => ({
        x: point.x * canvas.width,
        y: point.y * canvas.height
      }));
      
      ctx.beginPath();
      ctx.moveTo(pixelPoints[0].x, pixelPoints[0].y);
      for (let i = 1; i < pixelPoints.length; i++) {
        ctx.lineTo(pixelPoints[i].x, pixelPoints[i].y);
      }
      
      if (shapeType === 'polygon') {
        ctx.closePath();
      }
      
      ctx.stroke();
      
      if (shapeType === 'line' && region.direction) {
        const centerX = (pixelPoints[0].x + pixelPoints[pixelPoints.length - 1].x) / 2;
        const centerY = (pixelPoints[0].y + pixelPoints[pixelPoints.length - 1].y) / 2;
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(centerX - 15, centerY - 10, 50, 20);
        const directionOption =  schema['direction']?.options || [];
        const directionLabel = directionOption.find(option => option.value === region.direction)?.label || region.direction;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(directionLabel, centerX + 10, centerY);
      }
      
      if (shapeType === 'line' && region.line_name) {
        const centerX = (pixelPoints[0].x + pixelPoints[pixelPoints.length - 1].x) / 2;
        const centerY = (pixelPoints[0].y + pixelPoints[pixelPoints.length - 1].y) / 2;
        
        ctx.fillStyle = 'green';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(region.line_name, centerX, centerY - 15);
      }
      
      if (shapeType === 'polygon' && region.zone_name) {
        const centerX = pixelPoints.reduce((sum, p) => sum + p.x, 0) / pixelPoints.length;
        const centerY = pixelPoints.reduce((sum, p) => sum + p.y, 0) / pixelPoints.length;
        
        ctx.fillStyle = 'green';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(region.zone_name, centerX, centerY);
      }
    });
  });
};

watch(() => props.initialRegions, (newVal) => {
  if (newVal && typeof newVal === 'object') {
    drawnRegions.value = {};
    
    Object.keys(newVal).forEach(key => {
      if (Array.isArray(newVal[key])) {
        const schema = props.formSchema[key];
        if (!schema) return;
        
        const pointsKey = Object.keys(schema).find(schemaKey => 
          schema[schemaKey].type === 'line' || schema[schemaKey].type === 'polygon'
        );
        
        if (!pointsKey) return;
        
        drawnRegions.value[key] = newVal[key].map(region => {
          const newRegion: any = { ...region };
          
          if (Array.isArray(region[pointsKey])) {
            newRegion[pointsKey] = region[pointsKey].map((point: any) => {
              if (Array.isArray(point) && point.length >= 2) {
                const originalWidth = originalImageSize.value.width;
                const originalHeight = originalImageSize.value.height;
                if (originalWidth > 0 && originalHeight > 0) {
                  return { 
                    x: point[0] / originalWidth, 
                    y: point[1] / originalHeight 
                  };
                }
                return { x: point[0], y: point[1] };
              }
              return point;
            });
          }
          
          return newRegion;
        });
      }
    });
    
    redrawCanvas();
  }
}, { immediate: true, deep: true });

// 清除画布
const clearCanvas = () => {
  if (props.viewMode) return;
  drawnRegions.value = {};
  currentPath.value = [];
  redrawCanvas();
};

const deleteLastRegion = () => {
  if (props.viewMode) return;
  
  const schema = props.formSchema[props.currentParamKey];
  if (!schema) return;
  
  const regions = drawnRegions.value[props.currentParamKey];
  if (!Array.isArray(regions) || regions.length === 0) return;
  
  regions.pop();
  redrawCanvas();
};

// 取消绘制
const cancelDrawing = () => {
  emit('cancel');
  // 清除临时绘制数据
  isDrawing.value = false;
  currentPath.value = [];
  if (!props.viewMode) {
    drawingMode.value = '';
  }
  lineDrawingState.value = 'idle'; // 重置直线绘制状态
};

// 保存绘制
const saveDrawing = () => {
  if (props.viewMode) return;
  
  const saveData: { [key: string]: Array<{ [key: string]: any }> } = {};
  
  const currentKey = props.currentParamKey;
  const schema = props.formSchema[currentKey];
  if (!schema) return;
  
  const regions = drawnRegions.value[currentKey];
  if (!Array.isArray(regions)) return;
  
  const pointsKey = Object.keys(schema).find(schemaKey => 
    schema[schemaKey].type === 'line' || schema[schemaKey].type === 'polygon'
  );
  
  saveData[currentKey] = regions.map(region => {
    const result: any = {};
    
    Object.keys(region).forEach(regionKey => {
      if (regionKey === pointsKey && Array.isArray(region[regionKey])) {
        const originalWidth = originalImageSize.value.width;
        const originalHeight = originalImageSize.value.height;
        result[regionKey] = region[regionKey].map((point: any) => {
          if (point && typeof point === 'object' && 'x' in point && 'y' in point) {
            // 将标准化坐标转换回绝对像素坐标
            return [
              Math.round(point.x * originalWidth),
              Math.round(point.y * originalHeight)
            ];
          }
          return point;
        });
      } else {
        result[regionKey] = region[regionKey];
      }
    });
    
    return result;
  });
    
  emit('save', saveData);
  
  isDrawing.value = false;
  currentPath.value = [];
  drawingMode.value = '';
  lineDrawingState.value = 'idle';
};

// 图片加载完成
const onImageLoad = () => {
  if (imageRef.value) {
    // 获取原始图片的真实尺寸
    const img = imageRef.value;
    console.log('图片加载完成，原始尺寸:', img.naturalWidth, img.naturalHeight);
    originalImageSize.value = {
      width: img.naturalWidth,
      height: img.naturalHeight
    };
    
    // 初始化canvas大小
    const canvas = canvasRef.value;
    if (canvas) {
      console.log('图片加载完成，渲染尺寸:', img.clientWidth, img.clientHeight);
      // 使用图片实际渲染的大小，而非原始大小
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
      
      
      
      // 加载已保存的检测区域 - 渲染所有参数对应的绘制信息
      if (props.initialRegions) {
        // 将所有参数对应的绘制信息合并到drawnRegions中
        drawnRegions.value = {};
        Object.keys(props.initialRegions).forEach(key => {
          const regionsForThisKey = props.initialRegions[key];
          const schema = props.formSchema[key];
          
          if (!schema || !Array.isArray(regionsForThisKey)) return;
          
          // 从 schema 中找到 type 为 'line' 或 'polygon' 的字段名
          const pointsKey = Object.keys(schema).find(schemaKey => 
            schema[schemaKey].type === 'line' || schema[schemaKey].type === 'polygon'
          );
          
          if (!pointsKey) return;
          
          const shapeType = schema[pointsKey].type;
          
          drawnRegions.value[key] = regionsForThisKey.map(region => {
            const points = region[pointsKey];
            
            if (!points || !Array.isArray(points)) return null;
            
            // 将绝对像素坐标转换为标准化坐标（0-1）
            const normalizedPoints = points.map(point => {
              if (Array.isArray(point) && point.length >= 2) {
                return {
                  x: point[0] / img.naturalWidth,
                  y: point[1] / img.naturalHeight
                };
              }
              return point;
            });
            
            const newRegion: any = {
              ...region,
              [pointsKey]: normalizedPoints
            };
            
            return newRegion;
          }).filter(region => region !== null);
        });
      } else {
        drawnRegions.value = {};
      }
      console.log('drawnRegions:',drawnRegions.value)
      // 绘制已有的区域
      redrawCanvas();
    }
  }
};

// 从父组件获取图片
const setImage = (image: string) => {
  currentImage.value = image;
};

// 暴露给父组件的方法
defineExpose({
  setImage,
  setInitialRegions: (regions: Array<{ type: string; points: Array<{ x: number; y: number }> }>) => {
    // 为了兼容旧版本调用，仍然接受数组格式
    drawnRegions.value = regions.map(region => ({
      ...region,
      paramKey: props.currentParamKey
    }));
  },
  setInitialRegionsByKey: (key: string, regions: Array<{ type: string; points: Array<{ x: number; y: number }> }>) => {
    // 根据key设置特定的绘制区域
    drawnRegions.value = regions.map(region => ({
      ...region,
      paramKey: key
    }));
  },
  // 获取当前绘制区域的原始图片真实尺寸像素坐标
  getCurrentRegionsInPixels: () => {
    const canvasWidth = canvasRef.value?.width || 1;
    const canvasHeight = canvasRef.value?.height || 1;
    const originalImgWidth = originalImageSize.value.width;
    const originalImgHeight = originalImageSize.value.height;
    
    return drawnRegions.value.map(region => {
      const result: any = {
        type: region.type,
        points: region.points.map(point => {
          // 先从标准化坐标转为canvas像素坐标，再按比例转换为原始图片尺寸
          const canvasX = point.x * canvasWidth;
          const canvasY = point.y * canvasHeight;
          
          // 计算相对于原始图片的坐标
          const originalX = (canvasX / canvasWidth) * originalImgWidth;
          const originalY = (canvasY / canvasHeight) * originalImgHeight;
          
          return {
            x: originalX,
            y: originalY
          };
        })
      };
      
      // 如果有方向信息，也包含进去
      if (region.direction) {
        result.direction = region.direction;
      }
      
      return result;
    });
  }
});
</script>

<style scoped>
.footer_show {
  margin-top: 16px;
}
.required-label::before {
  content: '*';
  color: red;
  margin-right: 4px;
}
</style>