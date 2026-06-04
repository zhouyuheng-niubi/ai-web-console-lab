<template>
  <div class="advanced-form">
    <!-- 编辑模式：使用 Form 组件 -->
    <Form
      v-if="mode === 'form'"
      ref="formRef"
      :layout="formLayout"
      :model="model"
      :colon="colon"
      class="ant-advanced-search-form"
      :class="formLayout === 'horizontal' ? 'ant-form-horizontal' : ''"
    >
      <!-- 直接调用渲染函数来生成所有表单项 -->
      <RenderFormItems :schema="internalSchema" :model="model" />
    </Form>

    <!-- 详情模式：使用 Descriptions 组件 -->
    <Descriptions
      v-else-if="mode === 'descriptions'"
      :column="column"
      :colon="colon"
      bordered
      
    >
      <template v-for="(element, index) in descriptionsElements" :key="index">
        <component :is="element" />
      </template>
    </Descriptions>
  </div>
</template>

<script setup>
import { useSlots, watch, onMounted, reactive, toRaw, h, isRef, unref, ref, computed } from 'vue';
import { 
  Form, 
  FormItem, 
  Descriptions, 
  DescriptionsItem, 
  Input, 
  Select, 
  DatePicker, 
  TimePicker, 
  InputNumber, 
  Checkbox, 
  RadioGroup, 
  Radio, 
  Divider, 
  message, 
  CheckboxGroup, 
  Upload, 
  UploadDragger ,
  RangePicker,
  TreeSelect
} from 'ant-design-vue';
import { 
  DownloadOutlined, 
  DeleteOutlined, 
  FileOutlined, 
  PictureOutlined,
  UploadOutlined
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const props = defineProps({
  schema: {
    type: Array,
    required: true,
  },
  model: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: 'form',
    validator: (value) => ['form', 'descriptions'].includes(value),
  },
  column: {
    type: Number,
    default: 1, // 默认改为1列
  },
  colon: {
    type: Boolean,
    default: true,
  },
  // 添加表单布局配置
  formLayout: {
    type: String,
    default: 'vertical', // 默认布局改为vertical
    validator: (value) => ['vertical', 'horizontal', 'inline'].includes(value),
  },
  // 添加标签列配置
  labelCol: {
    type: Object,
    default: () => ({ span: 24 }), // 默认标签占满整行
  },
  // 添加包装列配置
  wrapperCol: {
    type: Object,
    default: () => ({ span: 24 }), // 默认控件占满整行
  },
});

const emit = defineEmits(['update:modelValue']);

// 将 schema 转换为组件内部的响应式数据
const internalSchema = reactive([...props.schema]);

// 定义内置表单组件的映射关系
const formComponents = {
  input: Input,
  textarea: Input.TextArea,
  select: Select,
  datePicker: DatePicker,
  timePicker: TimePicker,
  inputNumber: InputNumber,
  checkbox: Checkbox,
  checkboxGroup: CheckboxGroup,
  radioGroup: RadioGroup,
  radio: Radio,
  upload: Upload,
  uploadDragger: UploadDragger,
  rangePicker: RangePicker,
  treeSelect: TreeSelect
};

const slots = useSlots();
const formRef = ref();

/**
 * 判断某个字段是否存在插槽
 * @param {string} key 字段的key
 * @returns {boolean}
 */
const hasSlot = (key) => {
  return !!slots[key];
};

/**
 * 获取详情模式下字段的显示值
 * @param {object} item schema中的字段配置
 * @returns {string} 格式化后的值
 */
const getDisplayValue = (item) => {
  // 使用 unref 来处理可能的 ref 值
  const value = unref(props.model[item.key]);
  if (value === undefined || value === null || value === '') {
    return '-';
  }
  switch (item.type) {
    case 'datePicker': return dayjs(value).format(item.format || 'YYYY-MM-DD');
    case 'timePicker': return dayjs(value).format(item.format || 'HH:mm:ss');
    case 'rangePicker':
      if (Array.isArray(value)) {
        return value.map(v => (dayjs(v).format(item.format || 'YYYY-MM-DD'))).join(' ~ ');
      }
      return value;
    case 'select':
      if (item.props?.options && Array.isArray(item.props.options)) {
        if (Array.isArray(value)) {
          return value.map(v => (item.props.options.find(opt => opt.value === v)?.label || v)).join('、');
        }
        return item.props.options.find(opt => opt.value === value)?.label || value;
      }
      return value;
    case 'checkboxGroup':
      if (item.props?.options && Array.isArray(item.props.options) && Array.isArray(value)) {
        return value.map(v => (item.props.options.find(opt => opt.value === v)?.label || v)).join('、');
      }
      return Array.isArray(value) ? value.join('、') : value;
    case 'treeSelect':
      if (item.props?.treeData && value) {
        const findTreeNodeLabel = (treeData, targetValue) => {
          for (const node of treeData) {
            if (node.value === targetValue) {
              return node.label || node.title;
            }
            if (node.children) {
              const found = findTreeNodeLabel(node.children, targetValue);
              if (found) return found;
            }
          }
          return targetValue;
        };
        if (Array.isArray(value)) {
          return value.map(v => findTreeNodeLabel(item.props.treeData, v)).join('、');
        } else {
          return findTreeNodeLabel(item.props.treeData, value);
        }
      }
      return Array.isArray(value) ? value.join('、') : value;
    case 'checkbox': return value ? '是' : '否';
    case 'upload': 
    case 'uploadDragger':
      // 处理上传组件的值，可能为字符串URL或文件对象数组
      if (typeof value === 'string' && value) {
        // 如果是字符串URL，直接返回文件名
        return value.split('/').pop() || '图片文件';
      }
      // 确保值是数组格式，如果不是数组但存在值，则将其转换为数组
      const files = Array.isArray(value) ? value : (value ? [value] : []);
      if (Array.isArray(files) && files.length > 0) {
        return files.map(file => {
          // 显示文件名和描述（如果有）
          const fileName = file?.name || file?.url || '未知文件';
          const fileDescription = file?.description ? ` (${file.description})` : '';
          return fileName + fileDescription;
        }).join('、');
      }
      return value?.name || value?.url || '未知文件';

    default: return value.toString();
  }
};

/**
 * 深度查找并获取字段配置项
 * @param {Array} schema 要搜索的schema
 * @param {string} key 字段的key
 * @returns {object|null} 找到的字段配置项
 */
const findFieldByKey = (schema, key) => {
  for (const item of schema) {
    if (item.key === key) return item;
    if (item.type === 'group' && item.children) {
      const found = findFieldByKey(item.children, key);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 处理联动逻辑
 */
const handleLinkages = () => {
  const rawModel = toRaw(props.model);
  const traverseSchema = (schema) => {
    schema.forEach(item => {
      if (item.type === 'group' && item.children) {
        traverseSchema(item.children);
        return;
      }
      if (item.linkages && Array.isArray(item.linkages)) {
        item.linkages.forEach(linkage => {
          const triggerValue = rawModel[linkage.trigger];
          const conditionMet = typeof linkage.condition === 'function'
            ? linkage.condition(triggerValue, rawModel)
            : triggerValue === linkage.condition;

          if (conditionMet) {
            linkage.actions.forEach(action => {
              const targetField = findFieldByKey(internalSchema, action.target);
              if (!targetField) return;
              switch (action.type) {
                case 'show': targetField.hidden = !action.value; break;
                case 'hide': targetField.hidden = action.value; break;
                case 'required': targetField.required = action.value; break;
                case 'optional': targetField.required = !action.value; break;
                case 'setValue': props.model[action.target] = typeof action.value === 'function' ? action.value(triggerValue, rawModel) : action.value; break;
                case 'setOptions':  targetField.props.options = typeof action.value === 'function' ? action.value(triggerValue, rawModel) : targetField.props.options; break;
                
                default: 
                  if(typeof action.triggerFn === 'function'){
                    action.triggerFn(triggerValue, rawModel);
                  }
                break;
              }
            });
          }
        });
      }
    });
  };
  traverseSchema(internalSchema);
};

watch(() => props.model, () => { 
  if (props.mode === 'form') {
    // console.log('props.model changed:', props.model);
    handleLinkages();
    // 强制更新组件以响应数据变化
    const traverseSchema = (schema) => {
      schema.forEach(item => {
        if (item.type === 'group' && item.children) {
          traverseSchema(item.children);
          return;
        }
        // 触发重新渲染
        if (item.key) {
          const value = props.model[item.key];
          // 对于select组件，保留undefined值以确保placeholder能正常显示
          // 对于upload组件，确保值始终是数组
          if (value !== undefined || item.type === 'select') {
            // 确保数据变化能被正确检测到
            if (item.type === 'upload' || item.type === 'uploadDragger') {
              // 对于upload组件，不强制转换为数组，因为picture-card类型可能需要保持字符串URL格式
              // 保持原始值，让渲染函数处理格式转换
              props.model[item.key] = value;
            } else {
              props.model[item.key] = value;
            }
          }
        }
      });
    };
    traverseSchema(internalSchema);
  }
}, { deep: true, immediate: true });

/**
 * 初始化模型，为未定义的字段设置默认值，防止 v-model 绑定警告
 */
const initModel = () => {
  const traverseSchema = (schema) => {
    schema.forEach(item => {
      if (item.type === 'group' && item.children) {
        traverseSchema(item.children);
        return;
      }
      if (item.key && props.model[item.key] === undefined) {
        switch (item.type) {
          case 'checkbox':
            props.model[item.key] = false;
            break;
          case 'checkboxGroup':
            props.model[item.key] = [];
            break;
          case 'select':
            // 对于select组件，不设置默认值以确保placeholder能正常显示
            props.model[item.key] = undefined;
            break;
          case 'radioGroup':
            // 如果有默认选项，可以设置第一个为默认值
            if (item.props?.options?.length) {
              props.model[item.key] = item.props.options[0].value;
            } else {
              props.model[item.key] = '';
            }
            break;
          case 'upload':
          case 'uploadDragger':
            // 对于upload组件，默认值为空数组
            // 如果当前值为null或undefined，则设置为空数组
            // 如果是字符串类型（如图片URL），保持原值（对于picture-card类型可能需要）
            if (props.model[item.key] == null) {
              props.model[item.key] = [];
            }
            // 不再强制转换为数组，因为picture-card类型可能需要保持字符串URL格式
            break;
          case 'inputNumber':
            // 对于inputNumber组件，默认值为0
            props.model[item.key] = 0;
            break;
          case 'treeSelect':
            // 对于treeSelect组件，默认值为undefined
            props.model[item.key] = undefined;
            break;
          default:
            props.model[item.key] = ''; // 默认为空字符串
        }
      }
    });
  };
  traverseSchema(internalSchema);
};

onMounted(() => {
  initModel(); // 组件挂载时初始化模型
  if (props.mode === 'form') {
    setTimeout(() => {
      handleLinkages();
    }, 0);
  }
});

/**
 * 动态获取表单项的校验规则
 * @param {object} item 字段配置
 * @returns {Array} 校验规则数组
 */
const getRules = (item) => {
  if (item.hidden && item.validateWhenHidden !== true) return [];
  if (item.required && (!item.rules || item.rules.length === 0)) {
    return [{ required: true, message: `请输入${item.label}`, trigger: 'blur' }];
  }
  return item.rules || [];
};

// --- 栅格布局处理函数 ---

/**
 * 获取表单项的 Label Col 配置
 * @param {object} item 字段配置
 * @returns {object} Label Col 配置
 */
const getItemLabelCol = (item) => {
  // 如果字段本身定义了colSpan，则使用栅格布局逻辑
  if (item.colSpan) {
    if (props.formLayout === 'inline') {
      return item.labelCol || props.labelCol;
    }
    
    // 当使用horizontal布局且设置了colSpan时，使用栅格布局不需要Ant Design的栅格系统
    if (props.formLayout === 'horizontal') {
      return { span: 24 }; // 让label占据整行，由grid来控制布局
    }
    
    return { span: 24 };
  }
  
  // 默认情况下，根据布局类型返回相应配置
  if (props.formLayout === 'horizontal') {
    return props.labelCol;
  }
  
  // vertical和inline布局使用默认配置
  return item.labelCol || { span: 24 };
};

/**
 * 获取表单项的 Wrapper Col 配置
 * @param {object} item 字段配置
 * @returns {object} Wrapper Col 配置
 */
const getItemWrapperCol = (item) => {
  // 如果字段本身定义了colSpan，则使用栅格布局逻辑
  if (item.colSpan) {
    if (props.formLayout === 'inline') {
      return item.wrapperCol || props.wrapperCol;
    }

    // 当使用horizontal布局且设置了colSpan时，使用栅格布局不需要Ant Design的栅格系统
    if (props.formLayout === 'horizontal') {
      return { span: 24 }; // 让FormItem占据整行，由grid来控制宽度
    }

    const totalSpan = 24;
    const unitSpan = Math.floor(totalSpan / item.colSpan);
    return { span: unitSpan };
  }
  
  // 默认情况下，根据布局类型返回相应配置
  if (props.formLayout === 'horizontal') {
    return props.wrapperCol;
  }
  
  // vertical和inline布局使用默认配置
  return item.wrapperCol || { span: 24 };
};

/**
 * 获取Form Item的CSS类
 * @param {object} item 字段配置
 * @returns {string} CSS类名
 */
const getFormItemClass = (item) => {
  const classes = [];
  
  // 只有在horizontal布局且字段定义了colSpan时才添加栅格类
  if (props.formLayout === 'horizontal' && item.colSpan) {
    classes.push(`col-span-${item.colSpan}`);
  }
  
  if (props.formLayout === 'horizontal' && item.rowSpan) {
    classes.push(`row-span-${item.rowSpan}`);
  }
  
  // 默认添加col-span-24类确保一行一列的布局
  if (props.formLayout === 'horizontal' && !item.colSpan) {
    classes.push('col-span-24');
  }
  
  return classes.join(' ');
};

/**
 * 获取表单项样式
 * @param {object} item 字段配置
 * @returns {object} 样式对象
 */
const getFormItemStyle = (item) => {
  const style = { ...item.style };

  // 只有在定义了colSpan时才应用栅格样式
  if (item.colSpan) {
    if (props.formLayout === 'inline') {
      style.flex = `0 0 ${(100 / 24) * item.colSpan}%`;
      style.maxWidth = `${(100 / 24) * item.colSpan}%`;
    } else if (props.formLayout === 'horizontal') {
      // 栅格布局的column和row通过CSS类设置，不在内联样式中设置
      if (item.colSpan) {
        // 通过CSS类设置，不在这里设置
      }
      if (item.rowSpan) {
        style.alignSelf = 'start';
      }
    } else {
      if (item.rowSpan) {
        style.gridRow = `span ${item.rowSpan}`;
        style.alignSelf = 'start';
      }
    }
  }
  
  return style;
};

// --- 修正后的渲染函数组件 ---

/**
 * 渲染 Form 模式下的所有项（包括分组和普通字段）
 */
const RenderFormItems = (props) => {
  console.log('Rendering Form Items', props);
  const { schema, model } = props;
  return schema.map(item => {
    if (item.hidden) return null;

    if (item.type === 'group') {
      return h('div', { class: 'form-group', key: item.key || item.label }, [
        item.label ? h(Divider, { orientation: 'left' }, () => item.label) : null,
        h(RenderFormItems, { schema: item.children, model })
      ]);
    } else {
      // 为 FormItem 提供一个稳定的 key
      const formItemKey = `form-item-${item.key}`;
      return h(FormItem, {
        key: formItemKey,
        name: item.key,
        label: item.label,
        rules: getRules(item),
        required: item.required,
        labelCol: getItemLabelCol(item),
        wrapperCol: getItemWrapperCol(item),
        class: getFormItemClass(item),
        style: getFormItemStyle(item),
      }, () => {
        if (hasSlot(item.key)) {
          // 插槽内容由父组件提供，父组件负责 v-model 绑定
          return slots[item.key]();
        }

        const Component = formComponents[item.type];
        if (!Component) {
          console.warn(`未知的字段类型: ${item.type}`);
          return null;
        }
        
        // 构建组件的 props
        const componentProps = {
          placeholder: item.placeholder || (item.type === 'select' ? `请选择${item.label}` : `请输入${item.label}`),
          // 传递用户自定义的 props
          ...item.props,
        };
        
        // 根据组件类型设置不同的 v-model 属性
        switch (item.type) {
          case 'input':
          case 'textarea':
            componentProps.value = model[item.key];
            componentProps['onUpdate:value'] = (value) => {
              model[item.key] = value;
            };
            break;
          case 'select':
            componentProps.value = model[item.key];
            componentProps['onChange'] = (value) => {
              model[item.key] = value;
            };
            // 如果有 options 配置，直接使用 options 属性
            if (item.props?.options) {
              componentProps.options = item.props.options;
            }
            break;
          case 'treeSelect':
            componentProps.value = model[item.key];
            componentProps['onChange'] = (value) => {
              model[item.key] = value;
            };
            // 如果有 treeData 配置，直接使用 treeData 属性
            if (item.props?.treeData) {
              componentProps.treeData = item.props.treeData;
            }
            break;
          case 'radioGroup':
            componentProps.value = model[item.key];
            componentProps['onChange'] = (e) => {
              // RadioGroup的onChange返回事件对象，需要提取target.value
              const value = e && e.target ? e.target.value : e;
              model[item.key] = value;
            };
            // 如果有 options 配置，直接使用 options 属性
            if (item.props?.options) {
              componentProps.options = item.props.options;
            }
            break;
          case 'checkboxGroup':
            componentProps.value = model[item.key] || [];
            componentProps['onChange'] = (value) => {
              model[item.key] = value;
            };
            // 如果有 options 配置，直接使用 options 属性
            if (item.props?.options) {
              componentProps.options = item.props.options;
            }
            break;
          case 'checkbox':
            componentProps.checked = model[item.key];
            componentProps['onChange'] = (e) => {
              model[item.key] = e.target.checked;
            };
            break;
          case 'datePicker':
            // 特别处理datePicker组件的值
            componentProps.value = model[item.key] ? dayjs(model[item.key]) : undefined;
            componentProps['onUpdate:value'] = (value) => {
              model[item.key] = value ? dayjs(value).format(item.props?.format || 'YYYY-MM-DD') : '';
            };
            break;
          case 'timePicker':
            // 特别处理timePicker组件的值
            componentProps.value = model[item.key] ? dayjs(model[item.key]) : undefined;
            componentProps['onUpdate:value'] = (value) => {
              model[item.key] = value ? dayjs(value).format(item.props?.format || 'YYYY-MM-DD HH:mm:ss') : '';
            };
            break;
          case 'rangePicker':
            // 特别处理rangePicker组件的值
            componentProps.value = model[item.key] ? [dayjs(model[item.key][0]), dayjs(model[item.key][1])] : undefined;
            componentProps['onUpdate:value'] = (value) => {
              model[item.key] = value ? [dayjs(value[0]).format(item.props?.format || 'YYYY-MM-DD HH:mm:ss'), dayjs(value[1]).format(item.props?.format || 'YYYY-MM-DD HH:mm:ss')] : [];
            };
            break;
          case 'inputNumber':
            // 特别处理inputNumber组件的值
            componentProps.value = model[item.key] !== undefined && model[item.key] !== null ? model[item.key] : undefined;
            componentProps['onUpdate:value'] = (value) => {
              model[item.key] = value;
            };
            break;
          case 'upload':
          case 'uploadDragger':
            // 特别处理upload组件的值，确保fileList始终是数组
            // 如果值是字符串（如图片URL），则转换为合适的文件对象格式
            let fileListValue = model[item.key];
            if (typeof fileListValue === 'string' && fileListValue) {
              // 如果是字符串且非空，转换为文件对象数组
              fileListValue = [{
                uid: '-1',
                name: fileListValue.split('/').pop() || 'image',
                status: 'done',
                url: fileListValue,
                thumbUrl: fileListValue // 对于图片，设置缩略图URL
              }];
            } else if (!Array.isArray(fileListValue)) {
              fileListValue = fileListValue ? [fileListValue] : [];
            }
            componentProps.fileList = fileListValue;
            componentProps['onUpdate:fileList'] = (fileList) => {
              // 对于picture-card类型，如果只有一个文件且是图片，可以只保存URL字符串
              if (componentProps.listType === 'picture-card' && fileList && fileList.length === 1) {
                const file = fileList[0];
                // 如果文件有url或thumbUrl，只保存URL字符串
                if (file && (file.url || file.thumbUrl)) {
                  model[item.key] = file.url || file.thumbUrl;
                } else {
                  model[item.key] = fileList;
                }
              } else {
                model[item.key] = fileList || [];
              }
            };
            
            // 设置默认的上传属性
            const defaultUploadProps = {
              name: 'file',
              action: '#', // 默认action，实际使用时需要配置
              method: 'post',
              multiple: false,
              showUploadList: true,
              withCredentials: false,
              headers: {},
              data: {},
              beforeUpload: () => false, // 阻止自动上传，让用户自定义
            };
            
            // 合并默认属性
            Object.assign(componentProps, defaultUploadProps, item.props);
            
            // 添加默认的上传属性
            if (!componentProps.listType) {
              // 根据组件类型设置默认的列表类型
              componentProps.listType = item.type === 'uploadDragger' ? 'picture-card' : 'text'; 
            }
            
            // 为uploadDragger添加默认的拖拽提示文本
            if (item.type === 'uploadDragger' && !componentProps.placeholder) {
              componentProps.placeholder = '点击或拖拽文件到此区域上传';
            }
            
            // 添加默认的图标渲染
            // 对于picture-card类型，使用Ant Design Vue的默认渲染，不使用自定义itemRender
            if (!componentProps.itemRender && componentProps.listType !== 'picture-card' && componentProps.listType !== 'picture') {
              componentProps.itemRender = (props) => {
                return h(CustomFileItem, props);
              };
            }
            
            // Upload组件不设置children，让其使用默认渲染
            // 对于picture-card类型，Ant Design Vue会自动处理图片预览
            const isDraggerType = item.type === 'uploadDragger';
            
            // 为upload类型（非uploadDragger）且listType为picture-card时提供默认上传图标
            // uploadDragger 类型即使使用 picture-card 也应使用拖拽界面
            if (componentProps.listType === 'picture-card' && !isDraggerType) {
              // 为picture-card类型提供默认的上传图标
              return h(Component, componentProps, {
                default: () => CustomUploadIcon(false)
              });
            } else if (componentProps.listType !== 'picture-card') {
              // 非picture-card类型使用对应的上传图标
              return h(Component, componentProps, {
                default: () => CustomUploadIcon(isDraggerType)
              });
            } else {
              // uploadDragger 且 picture-card 类型，使用默认渲染
              return h(Component, componentProps);
            }
        }

        // RadioGroup 组件现在直接使用 options 属性，无需手动渲染子组件
        if (item.type === 'radioGroup') {
          return h(Component, componentProps);
        }
        
        // Select 组件现在直接使用 options 属性，无需手动渲染子组件
        if (item.type === 'select') {
          return h(Component, componentProps);
        }

        // TreeSelect 组件现在直接使用 treeData 属性，无需手动渲染子组件
        if (item.type === 'treeSelect') {
          return h(Component, componentProps);
        }

        // CheckboxGroup 组件现在直接使用 options 属性，无需手动渲染子组件
        if (item.type === 'checkboxGroup') {
          return h(Component, componentProps);
        }
        
        // Upload 和 UploadDragger 组件特殊处理
        if (item.type === 'upload' || item.type === 'uploadDragger') {
          return h(Component, componentProps);
        }

        // 对于其他组件，正常渲染
        return h(Component, componentProps);
      });
    }
  });
};

/**
 * 计算属性，用于生成 descriptions 模式下的元素
 */
const descriptionsElements = computed(() => {
  return renderDescriptionsItems(props.schema);
});

/**
 * 渲染 Descriptions 模式下的所有项（包括分组和普通字段）
 */
function renderDescriptionsItems(schema) {
  if (!schema || !Array.isArray(schema)) {
    console.log('Invalid schema provided');
    return [];
  }
  
  // 创建一个递归渲染函数
  function renderItems(items, parentKey = '') {
    return items.flatMap((item, index) => {
      const itemKey = `${parentKey}-${index}`;
      // console.log('Processing item:', item);
      
      if (item.hidden) {
        // console.log('Item is hidden, skipping');
        return [];
      }

      if (item.type === 'group') {
        // console.log('Processing group item');
        // 处理分组中的子项
        const childrenElements = renderItems(item.children || [], itemKey);
        
        // 创建分组容器
        const groupContainer = h('div', { class: 'desc-group', key: item.key || itemKey }, [
          // 添加分组标题（如果有的话）
          item.label ? h('div', { class: 'desc-group-title font-bold mb-2' }, item.label) : null,
          // 添加子元素
          ...childrenElements
        ]);
        
        return [groupContainer];
      } else {
        // console.log('Processing regular item');
        // 处理普通项
        const descItem = h(DescriptionsItem, {
          key: `desc-item-${item.key || itemKey}`,
          label: item.label,
          span: item.span,
        }, () => {
          if (hasSlot(item.key)) {
            // console.log('Using slot for item:', item.key);
            return slots[item.key]?.();
          }
          // console.log('Using display value for item:', item.key);
          return getDisplayValue(item);
        });
        
        // console.log('DescriptionsItem created:', descItem);
        return [descItem];
      }
    }).filter(Boolean); // 过滤掉 null 值
  }
  
  try {
    const result = renderItems(schema);
    console.log('renderDescriptionsItems result:', result);
    return result;
  } catch (error) {
    console.error('Error in renderDescriptionsItems:', error);
    return [];
  }
}

// 显式暴露组件以便在模板中使用

// 自定义文件项渲染组件
const CustomFileItem = (props) => {
  const { file, actions } = props;
  
  // 根据文件类型显示不同图标
  const getFileIcon = () => {
    if (file.type && file.type.startsWith('image/')) {
      return h(PictureOutlined);
    }
    return h(FileOutlined);
  };
  
  return h('div', { class: 'ant-upload-list-item' }, [
    h('div', { class: 'ant-upload-list-item-info' }, [
      h('span', { class: 'ant-upload-list-item-thumbnail' }, getFileIcon()),
      h('span', { class: 'ant-upload-list-item-name' }, file.name),
      h('span', { class: 'ant-upload-list-item-description' }, file.description || ''),
    ]),
    h('div', { class: 'ant-upload-list-item-actions' }, [
      h('button', {
        type: 'button',
        onClick: actions.preview,
        class: 'ant-btn ant-btn-text ant-btn-sm'
      }, [h(DownloadOutlined)]),
      h('button', {
        type: 'button',
        onClick: actions.remove,
        class: 'ant-btn ant-btn-text ant-btn-sm'
      }, [h(DeleteOutlined)])
    ])
  ]);
};

// 自定义上传图标组件
const CustomUploadIcon = (isDragger = false) => h('div', { 
  style: {
    display: 'inline-block',
    cursor: 'pointer'
  }
}, [
  h('div', [
    h(UploadOutlined, { 
      style: { 
        fontSize: '24px',
        color: '#666',
        marginBottom: '8px'
      } 
    }),
    h('div', { 
      style: { 
        color: '#666',
        fontSize: '14px'
      } 
    }, '点击上传'),
    isDragger ? h('div', { 
      style: { 
        color: '#8c8c8c',
        fontSize: '12px',
        marginTop: '4px'
      } 
    }, '或拖拽文件到此区域') : null
  ])
]);

// 暴露表单验证方法
const validate = () => {
  if (props.mode === 'form' && formRef.value) {
    return formRef.value.validate();
  }
  return Promise.resolve();
};

const resetFields = () => {
  if (props.mode === 'form' && formRef.value) {
    formRef.value.resetFields();
  }
};

defineExpose({
  validate,
  resetFields,
  formRef
});
</script>

<style scoped>
/* 分组样式 */
.form-group {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}
.desc-group {
  margin-bottom: 16px;
}

/* 栅格布局支持 */
:deep(.ant-form-horizontal) {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: 16px 8px;
  align-items: center;
}

:deep(.ant-form-horizontal .ant-form-item) {
  margin-bottom: 0;
  /* 覆盖 Ant Design 的 flex 布局，使用 grid */
  display: block !important;
  align-items: stretch;
}

/* 栅格布局下的FormItem内部布局 */
:deep(.ant-form-horizontal .ant-form-item .ant-row) {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 栅格列跨度类 */
:deep(.ant-form-horizontal .ant-form-item.col-span-1) { grid-column: span 1; }
:deep(.ant-form-horizontal .ant-form-item.col-span-2) { grid-column: span 2; }
:deep(.ant-form-horizontal .ant-form-item.col-span-3) { grid-column: span 3; }
:deep(.ant-form-horizontal .ant-form-item.col-span-4) { grid-column: span 4; }
:deep(.ant-form-horizontal .ant-form-item.col-span-5) { grid-column: span 5; }
:deep(.ant-form-horizontal .ant-form-item.col-span-6) { grid-column: span 6; }
:deep(.ant-form-horizontal .ant-form-item.col-span-7) { grid-column: span 7; }
:deep(.ant-form-horizontal .ant-form-item.col-span-8) { grid-column: span 8; }
:deep(.ant-form-horizontal .ant-form-item.col-span-9) { grid-column: span 9; }
:deep(.ant-form-horizontal .ant-form-item.col-span-10) { grid-column: span 10; }
:deep(.ant-form-horizontal .ant-form-item.col-span-11) { grid-column: span 11; }
:deep(.ant-form-horizontal .ant-form-item.col-span-12) { grid-column: span 12; }
:deep(.ant-form-horizontal .ant-form-item.col-span-13) { grid-column: span 13; }
:deep(.ant-form-horizontal .ant-form-item.col-span-14) { grid-column: span 14; }
:deep(.ant-form-horizontal .ant-form-item.col-span-15) { grid-column: span 15; }
:deep(.ant-form-horizontal .ant-form-item.col-span-16) { grid-column: span 16; }
:deep(.ant-form-horizontal .ant-form-item.col-span-17) { grid-column: span 17; }
:deep(.ant-form-horizontal .ant-form-item.col-span-18) { grid-column: span 18; }
:deep(.ant-form-horizontal .ant-form-item.col-span-19) { grid-column: span 19; }
:deep(.ant-form-horizontal .ant-form-item.col-span-20) { grid-column: span 20; }
:deep(.ant-form-horizontal .ant-form-item.col-span-21) { grid-column: span 21; }
:deep(.ant-form-horizontal .ant-form-item.col-span-22) { grid-column: span 22; }
:deep(.ant-form-horizontal .ant-form-item.col-span-23) { grid-column: span 23; }
:deep(.ant-form-horizontal .ant-form-item.col-span-24) { grid-column: span 24; }

/* 栅格行跨度类 */
:deep(.ant-form-horizontal .ant-form-item.row-span-1) { grid-row: span 1; }
:deep(.ant-form-horizontal .ant-form-item.row-span-2) { grid-row: span 2; }
:deep(.ant-form-horizontal .ant-form-item.row-span-3) { grid-row: span 3; }
:deep(.ant-form-horizontal .ant-form-item.row-span-4) { grid-row: span 4; }

:deep(.ant-form-item-label[style*="span: 24"]) {
  text-align: left !important;
  font-weight: 500;
}

/* 确保栅格布局下label和wrapper的正确排列 */
:deep(.ant-form-horizontal .ant-form-item .ant-form-item-label) {
  flex: 0 0 auto;
  min-width: 80px;
  text-align: right;
  padding-right: 8px;
}

:deep(.ant-form-horizontal .ant-form-item .ant-form-item-control) {
  flex: 1;
  min-width: 0;
}

/* 日期选择器适配 */
:deep(.ant-picker),:deep(.ant-input-number),:deep(.ant-tree-select) {
  width: 100%;
}

/* Upload组件样式增强 */
:deep(.ant-upload-list-item-description) {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

:deep(.ant-upload-wrapper .ant-upload-drag) {
  min-height: 100px;
}

:deep(.ant-upload-list-item-thumbnail) {
  margin-right: 8px;
}

:deep(.ant-upload-list-item-actions) {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s;
}

:deep(.ant-upload-list-item:hover .ant-upload-list-item-actions) {
  opacity: 1;
}

/* 自定义上传图标样式 */
:deep(.custom-upload-icon) {
  color: #666;
  text-align: center;
  padding: 20px;
}
:deep(.ant-form-item .ant-form-item-label >label::after){
  content: '';
  margin:unset;
}
:deep(.ant-descriptions-item-label){
  white-space: nowrap;
}
</style>