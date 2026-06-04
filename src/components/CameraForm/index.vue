<template>
  <AdvancedForm 
    ref="formRef"
    :schema="formSchema" 
    :model="formState" 
    mode="form"
    formLayout="horizontal"
    :labelCol="{ span: 6 }"
    :wrapperCol="{ span: 18 }"
  >
    <template #scenes>
      <div class="scenes-container w-full">
        <div>
          <RadioGroup button-style="solid"  class="mb-[10px]"
          v-model:value="busyModelType" v-if="
          formState.business_type && busyModelTypeSetting[formState.business_type] 
          && Array.isArray(busyModelTypeSetting[formState.business_type])"
          @change="handleBusyModelTypeChange"
          >
            <RadioButton :key="index" :value="item.value"
            v-for="item,index in busyModelTypeSetting[formState.business_type]">{{ item.label }}</RadioButton>
          </RadioGroup>
        </div>
        <!-- 目标可选择模型 -->
        <CheckboxGroup v-model:value="formState.scenes" 
        :options="currentModels"></CheckboxGroup>
      </div>
    </template>

    <template #modelSetting>
      <div class="model-setting-container flex flex-wrap gap-[10px] w-full bg-[#F5F5F5] min-h-[50px] p-[10px] rounded-[10px]">
        <div v-for="model in modelSetting" :key="model.value" 
        class="border-[1px] border-[#E5E7EB] bg-[#fff]
        rounded-[4px] px-[10px] py-[5px] w-[300px] min-h-[100px]">
          <div class="model-setting-item text-[#515A6E] 
          text-[14px] font-bold flex items-center justify-between 
          border-b-[1px] border-[#E5E7EB] pb-1">
            <span>{{ model.name }}</span>
          </div>
          <div class="model-setting-content pt-2">
            <div v-if="modelParams[model.value]">
                <div v-for="param,key in modelParams[model.value]" :key="key" class="flex items-center mt-[5px]">
                  <span class="mr-[6px] whitespace-nowrap"
                  :class="{'required-label': model.requiredArray.includes(key)}"
                  >
                    {{ param.label}}
                    <Tooltip :title="param?.desc || '参数'">
                      <QuestionCircleOutlined />
                    </Tooltip>
                    :
                  </span>
                  <div class="flex-1 flex items-center">
                      <!-- 动态组件 -->
                      <CheckboxGroup v-if="param.type === 'checkbox'" 
                      :options="param.options" v-model:value="model.config[key]" />
                      <InputNumber v-else-if="param.type === 'number'" 
                      placeholder="请输入参数值" v-model:value="model.config[key]" :min="1" :max="9999" />
                      
                      <RadioGroup v-else-if="param.type === 'radio'"  v-model:value="model.config[key]" @change="handleRadioChange(param,key,model)">
                        <Radio v-for="option,index in param.options" 
                        :key="index" :value="option.value">{{ option.label }}</Radio>
                      </RadioGroup>

                      <!-- 画线 -->
                      <template v-else-if="param.type === 'line_array'">
                        <Button type="link" size="small" @click="openDrawRegionModal(model.value,key,'draw', 'line')">绘制</Button>
                        <Button type="link" size="small" @click="openDrawRegionModal(model.value,key,'view', 'line')">查看</Button>
                      </template>

                      <template v-else-if="param.type === 'zone_array'">
                        <Button type="link" size="small" @click="openDrawRegionModal(model.value,key, 'draw', 'polygon')">绘制</Button>
                        <Button type="link" size="small" @click="openDrawRegionModal(model.value,key,'view', 'polygon')">查看</Button>
                      </template>
                      <template v-else>
                        <span>{{ model.config[key] }}</span>
                      </template>
                      <span>{{ param.unit }}</span>
                  </div>
                </div>
            </div> 
          </div>
        </div>
        <div class="w-full flex items-center justify-center h-[50px] text-[#515A6E] text-[14px] rounded-[10px]"
         v-if="JSON.stringify(modelSetting) === '{}'">请勾选检测模型</div>
      </div>
    </template>    
  </AdvancedForm>

  <!-- 检测区域选择弹窗 -->
  <Modal v-model:open="drawRegionVisible" title="标定检测区域" width="950px" :footer="null">
    <CanvasDrawing
      ref="canvasDrawingRef"
      :camera-id="formState.camera_id"
      :initial-regions="initialRegions"
      :model-id="currentModelId"
      :view-mode="currentDrawMode === 'view'"
      :current-param-type="currentParamType"
      :current-param-key="currentParamKey"
      :form-schema="currentParamSchema"
      @save="onSaveDrawing"
      @cancel="onCancelDrawing"
    />
  </Modal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { 
  Button, 
  Modal, 
  message,
  InputNumber,
  CheckboxGroup,
  Tooltip,
  RadioGroup,
  RadioButton,
  Radio
} from 'ant-design-vue';
import { 
  QuestionCircleOutlined
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
import CanvasDrawing from '@/components/CanvasDrawing/index.vue';
import { modelOrigin, busyType, busyModelTypeSetting, cameraTypes } from '@/utils/constSeting';
import { captureCurrentFrame } from '@/api/warn';

// Props 定义
interface Props {
  initialData?: any;
  regionTree?: any[];
  riskFactorsOptions?: any[];
  sceneTypesOptions?: any[];
  modelParams?: any;
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
  regionTree: () => [],
  riskFactorsOptions: () => [],
  sceneTypesOptions: () => [],
  modelParams: () => ({})
});

// Emits 定义
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'submit', value: any): void;
  (e: 'cancel'): void;
}>();

// 响应式数据
const formRef = ref();
const modelSetting = ref<any>({});
const busyModelType = ref('');
const drawRegionVisible = ref(false);
const canvasDrawingRef = ref();
const initialRegions = ref<{ [key: string]: Array<{ type: string; points: Array<{ x: number; y: number }> }> }>({});

// 表单状态
const formState = reactive({
  _id: '',
  camera_name: '',
  camera_desc: '',
  region_id: '',
  stream_url: '',
  status: '1',
  camera_type: undefined as string | undefined,
  location: '',
  risk_factors: [] as string[],
  scenes: [] as string[],
  camera_id: undefined as string | undefined,
  modal_origin: modelOrigin[0].value,
  auto_switch_model: true,
  business_type: '监测监控'
});

// 当前可选择模型
const currentModels = ref<any[]>([]);

// 表单配置
const formSchema = computed(() => [
  {
    key: 'camera_name',
    type: 'input',
    label: '摄像头名称',
    placeholder: '请输入摄像头名称',
    required: true,
    rules: [
      { required: true, message: '请输入摄像头名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'camera_type',
    type: 'radioGroup',
    label: '摄像头类型',
    placeholder: '请选择摄像头类型',
    required: true,
    props: {
      options: cameraTypes
    },
    rules: [
      { required: true, message: '请选择摄像头类型', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'camera_desc',
    type: 'textarea',
    label: '重点参数',
    placeholder: '请输入重点参数',
    props: {
      rows: 2,
      maxlength: 200,
      showCount: true
    },
    colSpan: 24
  },
  {
    key: 'business_type',
    type: 'radioGroup',
    label: '业务类型',
    placeholder: '请选择业务类型',
    required: true,
    props: {
      options: busyType
    },
    rules: [
      { required: true, message: '请选择业务类型', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'region_id',
    type: 'treeSelect',
    label: '所属区域',
    placeholder: '请选择所属区域',
    required: true,
    props: {
      treeData: props.regionTree,
      allowClear: true,
      showSearch: true,
      fieldNames: {
        children: 'children',
        label: 'region_name',
        value: 'region_id',
      }
    },
    rules: [
      { required: true, message: '请选择所属区域', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'stream_url',
    type: 'input',
    label: '流地址',
    placeholder: '请输入流地址（RTSP/HTTP/HTTPS）',
    required: true,
    rules: [
      { required: true, message: '请输入流地址', trigger: 'blur' },
      { 
        pattern: /^(rtsp|http|https):\/\/.+/, 
        message: '请输入有效的流地址', 
        trigger: 'blur' 
      }
    ],
    colSpan: 12
  },
  {
    key: 'modal_origin',
    type: 'radioGroup',
    label: '算法来源',
    props: {
      options: modelOrigin
    },
    colSpan: 12,
  },
  {
    key: 'risk_factors',
    type: 'checkboxGroup',
    label: '危险因素',
    props: {
      options: props.riskFactorsOptions
    },
    rules: [
      { required: true, message: '请选择危险因素', trigger: 'change' },
    ],
    colSpan: 24
  },
  {
    key: 'scenes',
    label: '模型算法',
    colSpan: 24,
  },
  {
    key: "modelSetting",
    label: "算法设置",
    colSpan: 24,
  },
  {
    key: 'status',
    type: 'radioGroup',
    label: '状态',
    required: true,
    props: {
      options: [
        { value: '1', label: '启用' },
        { value: '0', label: '禁用' }
      ]
    },
    rules: [
      { required: true, message: '请选择状态', trigger: 'change' },
    ],
    colSpan: 12
  },
  {
    key: 'auto_switch_model',
    type: 'radioGroup',
    label: '自动切换模型',
    props: {
      options: [
        { value: true, label: '启用' },
        { value: false, label: '禁用' }
      ]
    },
    colSpan: 12
  }
]);

// 监听模型来源变化，清空已选模型
watch(() => formState.modal_origin, (newValue, oldValue) => {
  if(formState.scenes && formState.scenes.length > 0){
    formState.scenes = [];
  }
  updateCurrentModels();
});

// 监听业务类型变化
watch(() => formState.business_type, (newValue, oldValue) => {
  updateCurrentModels();
});

// 监听 props.sceneTypesOptions 变化，更新可选模型
watch(() => props.sceneTypesOptions, (newValue) => {
  if(newValue && newValue.length > 0) {
    updateCurrentModels();
  }
}, { deep: true });

// 监听 props.modelParams 变化
watch(() => props.modelParams, (newValue) => {
  if(newValue && Object.keys(newValue).length > 0) {
    // 如果有待加载的初始数据，重新加载
    if(props.initialData && Object.keys(props.initialData).length > 0) {
      loadData(props.initialData);
    }
  }
}, { deep: true });

// 标记是否正在加载初始数据
const isLoadingData = ref(false);

// 更新当前模型列表
const updateCurrentModels = (preserveScenes = false) => {
  let targetSeting = busyModelTypeSetting[formState.business_type];
  if(!targetSeting) {
    currentModels.value = props.sceneTypesOptions;
  } else if(Array.isArray(targetSeting)) {
    busyModelType.value = targetSeting[0].value;
    currentModels.value = props.sceneTypesOptions.filter(item => targetSeting[0].models.includes(item.value));
  } else {
    currentModels.value = props.sceneTypesOptions.filter(item => targetSeting.models.includes(item.value));
  }
  // 只在非加载数据时清空已选模型
  if(!preserveScenes && !isLoadingData.value) {
    formState.scenes = [];
  }
  currentModels.value = currentModels.value.filter(option => 
    option.detection_engine.includes(formState.modal_origin) || option.detection_engine === 'BOTH'
  ).map(option => ({
    ...option, 
    disabled: formState.modal_origin === 'EDGE_BOX' ? !option?.edge_status : !option?.yolo_status
  }));
};

// 处理业务类型模型切换
const handleBusyModelTypeChange = (e: any) => {
  let targetSeting = busyModelTypeSetting[formState.business_type];
  let index = targetSeting.findIndex((item: any) => item.value === busyModelType.value);
  currentModels.value = props.sceneTypesOptions.filter(item => targetSeting[index].models.includes(item.value));
};

// 检测区域绘制相关
const currentImage = ref<any>(null);
const currentDrawMode = ref<'draw' | 'view'>('draw');
let currentModelId: string | null = null;
let currentParamType: 'line' | 'polygon' | null = null;
const currentParamKey = ref('');
const currentParamSchema = ref<any>({});

// 打开绘制区域弹窗
const openDrawRegionModal = async (modelKey: string, paramKey: string, mode: 'draw' | 'view', paramType: 'line' | 'polygon') => {
  if(!formState.stream_url) return message.error('请先配置流地址');
  currentModelId = modelKey;
  currentParamType = paramType;
  currentParamKey.value = paramKey;
  currentDrawMode.value = mode;
  currentParamSchema.value = {};
  
  // 当前模型参数配置信息
  for(const objectKey in props.modelParams[currentModelId]) {
    const currentTarget = props.modelParams[currentModelId][objectKey];
    if(currentTarget.type === 'line_array' || currentTarget.type === 'zone_array') {
      currentParamSchema.value[objectKey] = currentTarget.item_schema || {};
    }
  }

  drawRegionVisible.value = true;
  if (canvasDrawingRef.value) {
    canvasDrawingRef.value.setImage('');
  }
  
  // 获取当前帧图片
  const resImage = await captureCurrentFrame(formState.stream_url);
  const image = (resImage as any).data?.base64_image || '';
  
  // 设置初始区域
  let savedRegions = {};
  if (currentModelId && currentParamType) {
    const currentModelParams = props.modelParams[currentModelId];
    if (currentModelParams) {
      for (const key in currentModelParams) {
        const param = currentModelParams[key];
        if ((param.type === 'line_array' || param.type === 'zone_array') && modelSetting.value[currentModelId]?.config?.[key]) {
          const paramRegions = modelSetting.value[currentModelId].config[key];
          savedRegions[key] = paramRegions;
        }
      }
    }
  }
  initialRegions.value = savedRegions;
  
  // 等待组件加载后设置图片
  nextTick(() => {
    if (canvasDrawingRef.value) {
      canvasDrawingRef.value.setImage(image);
    }
  });
};

// 监听模型勾选变化，获取具体模型配置
watch(() => formState.scenes, (newValue, oldValue) => {
  if(!newValue?.length) modelSetting.value = {};
  if(newValue?.length > 0 && Array.isArray(newValue)){
    for(const key in modelSetting.value){
      if(!newValue.includes(key)){
        delete modelSetting.value[key];
      }
    }
    // 获取具体模型配置
    newValue.forEach(modelId => {
      if(!modelSetting.value.hasOwnProperty(modelId)) {
        const name = props.sceneTypesOptions.find(item => item.value === modelId)?.label;
        modelSetting.value[modelId] = {
          name: name,
          value: modelId,
          requiredArray: [],
          config: {}
        };
        const triggerChange = [];
        // 动态赋值
        if(props.modelParams[modelId]){
          for(const key in props.modelParams[modelId]){
            modelSetting.value[modelId].requiredArray.push(key);
            const param = props.modelParams[modelId][key];
            if(param.required_trigger){
              triggerChange.push(key);
            }
            if(param.multi){
              modelSetting.value[modelId].config[key] = param.options[0]?.value ? [param.options[0].value] : [];
            }
            else if(param.type === 'radio'){
              modelSetting.value[modelId].config[key] = param.options[0]?.value || '';
            }
            else if(param.type === 'number'){
              modelSetting.value[modelId].config[key] = 1;
            }
            else{
              modelSetting.value[modelId].config[key] = param.default || '';
            }
          }
        }
        // 初始化必填项
        for(const key of triggerChange){
          const param = props.modelParams[modelId][key];
          handleRadioChange(param, key, modelSetting.value[modelId]);
        }
      }
    });
  }
}, { deep: true });

// 保存绘制结果
const onSaveDrawing = (regions: any) => {
  if(regions && JSON.stringify(regions) !== '{}'){
    for(const key in regions){
      modelSetting.value[currentModelId].config[key] = regions[key];
    }
  }
  drawRegionVisible.value = false;
};

// 取消绘制
const onCancelDrawing = () => {
  drawRegionVisible.value = false;
};

// radio change事件
const handleRadioChange = (param: any, key: string, modal: any) => {
  const required_trigger = param.required_trigger || null;
  const targetKeyValue = modelSetting.value[modal.value].config[key];
  if(required_trigger){
    const options = param.options || [];
    const requiredArr = modelSetting.value[modal.value].requiredArray;
    const needrequiredArr = required_trigger[targetKeyValue];
    const noRequiredArr = [];
    options.forEach((item: any) => {
      if(item.value !== targetKeyValue){
        if(required_trigger[item.value]) noRequiredArr.push(...required_trigger[item.value]);
      }
    });
    needrequiredArr.forEach((item: any) => {
      if(!requiredArr.includes(item)){
        requiredArr.push(item);
      }
    });
    noRequiredArr.forEach((item: any) => {
      if(requiredArr.includes(item)){
        requiredArr.splice(requiredArr.indexOf(item), 1);
      }
    });
    modelSetting.value[modal.value].requiredArray = requiredArr;
  }
};

// 验证表单
const validate = async () => {
  await formRef.value?.validate();
  
  if(JSON.stringify(modelSetting.value) === '{}') {
    throw new Error('请配置模型设置');
  }
  
  for (const modelKey in modelSetting.value) {
    const modelConfig = modelSetting.value[modelKey].config;
    const requiredArray = modelSetting.value[modelKey].requiredArray;
    for (const paramKey in modelConfig){
      const paramValue = modelConfig[paramKey];
      if (requiredArray.includes(paramKey) && !paramValue) {
        const paramName = props.modelParams[modelKey][paramKey]['label'];
        throw new Error(`参数 "${modelSetting.value[modelKey].name}-${paramName}" 不能为空，请填写完整`);
      }
      if (requiredArray.includes(paramKey) && Array.isArray(paramValue) && paramValue.length === 0 ) {
        const paramName = props.modelParams[modelKey][paramKey]['label'];
        throw new Error(`参数 "${modelSetting.value[modelKey].name}-${paramName}" 不能为空，请填写完整`);
      }
    }
  }
  
  return true;
};

// 获取表单数据
const getFormData = () => {
  const scene_engines: Record<string, string> = {};
  const scene_configs: Record<string, any> = {};
  
  Object.keys(modelSetting.value).forEach(key => {
    scene_engines[key] = formState.modal_origin;
    scene_configs[key] = modelSetting.value[key].config;
  });
  
  const formData = {
    ...formState,
    scene_engines,
    scene_configs
  };
  
  // 删除不需要的字段
  if(formData.hasOwnProperty('modal_origin')) {
    delete formData.modal_origin;
  }
  
  return formData;
};

// 重置表单
const resetFields = () => {
  formState._id = '';
  formState.camera_name = '';
  formState.camera_desc = '';
  formState.region_id = '';
  formState.stream_url = '';
  formState.status = '1';
  formState.camera_type = undefined;
  formState.location = '';
  formState.auto_switch_model = true;
  formState.scenes = [];
  formState.risk_factors = [];
  formState.modal_origin = modelOrigin[0].value;
  formState.camera_id = undefined;
  formState.business_type = '监测监控';
  modelSetting.value = {};
  
  if(formRef.value?.resetFields) {
    formRef.value.resetFields();
  }
  updateCurrentModels();
};

// 加载数据
const loadData = (cameraDetail: any) => {
  isLoadingData.value = true;
  
  formState._id = cameraDetail._id || '';
  formState.camera_id = cameraDetail.camera_id || cameraDetail.stream_id;
  formState.camera_name = cameraDetail.camera_name || cameraDetail.stream_name || '';
  formState.camera_desc = cameraDetail.camera_desc || '';
  formState.stream_url = cameraDetail.url || cameraDetail.stream_url || '';
  formState.region_id = cameraDetail.region_id || '';
  formState.business_type = cameraDetail.business_type || '监测监控';
  formState.status = cameraDetail.status || '1';
  formState.camera_type = cameraDetail.camera_type;
  formState.location = cameraDetail.location || '';
  
  if(!cameraDetail?.risk_factors) {
    formState.risk_factors = [];
  } else {
    formState.risk_factors = cameraDetail.risk_factors;
  }
  
  if(cameraDetail.scene_engines) {
    formState.modal_origin = Object.values(cameraDetail.scene_engines)[0] as string || modelOrigin[0].value;
  }
  
  formState.auto_switch_model = cameraDetail.auto_switch_model === false ? false : true;
  
  // 延迟设置场景，确保 props 数据已加载
  setTimeout(() => {
    if(!cameraDetail?.scenes && !cameraDetail?.scene_configs) {
      formState.scenes = [];
    } else if(cameraDetail?.scenes && !cameraDetail.scene_configs) {
      formState.scenes = cameraDetail.scenes;
    } else {
      formState.scenes = [];
      modelSetting.value = {};
      Object.keys(cameraDetail.scene_configs).forEach(key => {
        formState.scenes.push(key);
        modelSetting.value[key] = {
          name: props.sceneTypesOptions.find(item => item.value === key)?.label || key,
          value: key,
          requiredArray: [],
          config: cameraDetail.scene_configs[key]
        };
        if(props.modelParams[key]){
          for(const keyValue in props.modelParams[key]){
            modelSetting.value[key].requiredArray.push(keyValue);
            if(!cameraDetail.scene_configs[key].hasOwnProperty(keyValue)){
              const param = props.modelParams[key][keyValue];
              if(param.multi){
                modelSetting.value[key].config[keyValue] = [param.options[0]];
              }
              else if(param.type === 'radio'){
                modelSetting.value[key].config[keyValue] = param.options[0];
              }
              else if(param.type === 'number'){
                modelSetting.value[key].config[keyValue] = 1;
              }
              else{
                modelSetting.value[key].config[keyValue] = param.default || '';
              }              
            }
          }
        }
      });
    }
    updateCurrentModels(true);
    isLoadingData.value = false;
  }, 100);
};

// 监听初始数据变化
watch(() => props.initialData, (newData) => {
  if(newData && Object.keys(newData).length > 0) {
    loadData(newData);
  }
}, { immediate: true, deep: true });

// 暴露方法
defineExpose({
  validate,
  getFormData,
  resetFields,
  loadData
});
</script>

<style scoped>
.required-label {
  &::before {
    content: '*';
    color: red;
    margin-right: 2px;
  }
}
</style>
