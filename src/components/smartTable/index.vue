<template>
  <div class="smart-table-container">
    <!-- 搜索区域 -->
    <Card v-if="searchConfig && searchConfig.length > 0" class="search-card">
      <Form
        :model="searchForm"
        :layout="searchLayout"
        @finish="handleSearch"
        @change="handleFormChange"
        :label-col="searchLabelCol"
        :wrapper-col="searchWrapperCol"
      >
        <template v-for="item in visibleSearchItems" :key="item.field">
          <FormItem
            :label="item.label"
            :name="item.field"
            :rules="item.rules || []"
            :label-col="getItemLabelCol(item)"
            :wrapper-col="getItemWrapperCol(item)"
            :style="getSearchItemStyle(item)"
            :class="getFormItemClass(item)"
          >
            <component
              :is="getFormComponent(item.type)"
              v-model:value="searchForm[item.field]"
              v-bind="getComponentProps(item)"
              :placeholder="item.placeholder || (
                item.type === 'select' ? `请选择${item.label}` : 
                item.type === 'date-range' ? ['开始时间', '结束时间'] : 
                `请输入${item.label}`)"
              @change="handleFieldChange(item.field, $event)"
            >
              <!-- 为select组件添加options -->
              <template v-if="item.type === 'select' && item.props?.options" #options>
                <SelectOption
                  v-for="option in item.props.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectOption>
              </template>
            </component>
          </FormItem>
        </template>
        <div
          class="flex items-center" :class="`col-span-${searchButtonWrapperSpan}`"
        >
          <Button type="primary" html-type="submit">查询</Button>
          <Button style="margin-left: 8px" @click="resetSearch">重置</Button>
          <Button
            v-if="hasAdvancedSearch"
            style="margin-left: 8px"
            @click="toggleAdvancedSearch"
          >
            {{ advancedSearchVisible ? '收起' : '高级搜索' }}
            <template v-if="advancedSearchVisible">
              <UpOutlined />
            </template>
            <template v-else>
              <DownOutlined />
            </template>
          </Button>
        </div>
      </Form>
    </Card>

    <!-- 表格工具栏 -->
    <div class="table-toolbar" v-if="toolbarConfig && toolbarConfig.length > 0">
      <template v-for="item in toolbarConfig" :key="item.action || item.label">
        <Button
          v-if="item.type === 'button'"
          v-bind="item.props || {}"
          @click="handleToolbarAction(item.action)"
          class="flex items-center"
        >
          <component :is="item.icon" v-if="item.icon" style="margin-right: 4px;" />
          {{ item.label }}
        </Button>
        <Divider v-if="item.type === 'divider'" v-bind="item.props || {}" />
        <Dropdown v-if="item.type === 'dropdown'">
          <template #overlay>
            <Menu @click="({ key }) => handleToolbarAction(item.action, key)">
              <MenuItem
                v-for="(option, optIndex) in item.options"
                :key="optIndex"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </MenuItem>
            </Menu>
          </template>
          <Button v-bind="item.props || {}">
            <component :is="item.icon" v-if="item.icon" style="margin-right: 4px;" />
            {{ item.label }}
            <DownOutlined style="margin-left: 4px;" />
          </Button>
        </Dropdown>
      </template>
    </div>
    <!-- 表格主体 -->
    <Table
      :columns="formattedColumns"
      :data-source="tableData"
      :row-key="rowKey || 'id'"
      :loading="isLoading"
      :pagination="finalPaginationConfig"
      :row-selection="rowSelectionConfig"
      :scroll="scrollConfig"
      :childrenColumnName="childrenColumnName"
      :defaultExpandAllRows="defaultExpandAllRows"
      :expandedRowKeys="internalExpandedRowKeys"
      :expandRowByClick="false"
      :rowClassName="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
      :expandIcon="customExpandIcon"
      @change="handleTableChange"
      @expand="handleExpand"
      @expandedRowsChange="handleExpandedRowsChange"
      v-bind="tableProps"
    >
      <!-- 使用新的 bodyCell 插槽替代旧的 column.slots 方式 -->
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'action'">
          <Button
            v-for="action in getVisibleActions(record)"
            :key="action.action"
            v-bind="action.props || {}"
            @click="handleAction(action, record, index)"
            :disabled="action.disabled && action.disabled(record)"
          >
            <span>
              <EditOutlined v-if="action.icon === 'EditOutlined'" style="margin-right: 4px;" />
              <DeleteOutlined v-else-if="action.icon === 'DeleteOutlined'" style="margin-right: 4px;" />
              <ArrowDownOutlined v-else-if="action.icon === 'ArrowDownOutlined'" style="margin-right: 4px;" />
              {{ action.label }}
            </span>
          </Button>
        </template>
        <!-- 其他自定义单元格渲染可以在这里添加 -->
      </template>
    </Table>
  </div>
</template>

<script lang="tsx" setup>
import { ref, computed, onMounted, watch, reactive, h,unref, nextTick } from 'vue';
import {
  Input,
  Select,
  SelectOption,
  Checkbox,
  Radio,
  InputNumber,
  Switch,
  Button,
  Form,
  FormItem,
  Table,
  Card,
  Divider,
  Dropdown,
  Menu,
  MenuItem,
  Tooltip,

  Badge,
  Tag,
  Rate,
  Progress,
  DatePicker,
  Image
} from 'ant-design-vue';
import {
  EditOutlined,
  DownOutlined,
  UpOutlined,
  DeleteOutlined,
  RightOutlined,
  ArrowDownOutlined
} from '@ant-design/icons-vue';
import type { TableProps, TableColumnType, PaginationProps, FormProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

// 设置 dayjs 语言
dayjs.locale('zh-cn');

// 生成唯一 key 的辅助函数
const generateUniqueKey = (column: ColumnItem, record: any, index: number): string => {
  const recordId = record.id || record.key || record._id || index;
  return `${column.dataIndex || column.key || 'column'}-${recordId}-${index}`;
};

// 链式键解析函数
const getNestedValue = (obj: any, key: string | undefined): any => {
  if (!obj || !key) return undefined;
  return key.split('.').reduce((acc, currKey) => {
    if (acc === null || acc === undefined) return acc;
    return acc[currKey];
  }, obj);
};

// 定义栅格布局配置类型
interface ColConfig {
  span?: number;
  offset?: number;
  xs?: number | { span?: number; offset?: number };
  sm?: number | { span?: number; offset?: number };
  md?: number | { span?: number; offset?: number };
  lg?: number | { span?: number; offset?: number };
  xl?: number | { span?: number; offset?: number };
  xxl?: number | { span?: number; offset?: number };
}

// 定义编辑配置类型
interface EditConfig {
  type?: 'input' | 'select' | 'number' | 'date' | 'date-range' | 'month' | 'year' | 'week' | 'quarter' | 'switch' | 'radio' | 'checkbox';
  props?: any;
  rules?: any[];
  disabled?: (record: any) => boolean;
}

// 定义搜索条件配置类型
interface SearchItem {
  field: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'date-range' | 'month' | 'year' | 'week' | 'quarter' | 'checkbox' | 'radio' | 'number' | 'switch';
  props?: any;
  rules?: any[];
  advanced?: boolean;
  labelCol?: ColConfig;
  wrapperCol?: ColConfig;
  colSpan?: number;
  rowSpan?: number;
  style?: Record<string, any>;
  placeholder?: string;
}

// 定义 API 函数类型
interface ApiFunction {
  (params: any): Promise<any>;
}

// 定义响应配置类型
interface ResponseConfig {
  listKey?: string;
  totalKey?: string;
}

// 定义工具栏配置类型
interface ToolbarItem {
  type: 'button' | 'divider' | 'dropdown';
  label: string;
  icon?: 'EditOutlined' | 'DeleteOutlined' | string;
  props?: any;
  action?: string;
  options?: { label: string; disabled?: boolean }[];
}

// 定义表格列配置类型
interface ColumnItem<T = any> extends Omit<TableColumnType<T>, 'dataIndex' | 'key' | 'render'> {
  dataIndex: string;
  key?: string;
  slot?: string;
  type?: 'tag' | 'switch' | 'radio' | 'checkbox' | 'badge' | 'rate' | 'progress' | 'date' | 'date-range' | 'image' | 'select';
  componentProps?: (value: any, record: T) => Record<string, any>;
  edit?: EditConfig;
  formatter?: (value: any, record: T) => string;
  render?: (value: any, record: T, index: number) => string | JSX.Element;
  // 新增options属性用于select和tag的选项配置
  options?: { label: string; value: any,color?:string }[];
}

// 定义操作列配置类型
interface ActionItem {
  label: string;
  icon?: 'EditOutlined' | 'DeleteOutlined' | string;
  props?: any;
  action: string;
  disabled?: (record: any) => boolean;
  visible?: (record: any) => boolean; // 添加visible属性支持动态显示判断
}

// 定义操作列类型
interface ActionColumn {
  title?: string;
  width?: number;
  fixed?: 'left' | 'right';
  actions: ActionItem[];
}

// 组件 props
const props = defineProps({
  dataSource: {
    type: Array,
    default: () => [],
  },
  api: {
    type: Function as () => ApiFunction,
    default: null,
  },
  paramsFormatter: {
    type: Function as () => (params: any, pagination: PaginationProps | false) => any,
    default: null,
  },
  responseConfig: {
    type: Object as () => ResponseConfig,
    default: () => ({
      listKey: 'list',
      totalKey: 'total',
    }),
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  immediateSearch: {
    type: Boolean,
    default: false,
  },
  searchDebounce: {
    type: Number,
    default: 300,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Array as () => ColumnItem[],
    required: true,
  },
  searchConfig: {
    type: Array as () => SearchItem[],
    default: () => [],
  },
  toolbarConfig: {
    type: Array as () => ToolbarItem[],
    default: () => [],
  },
  actionColumn: {
    type: Object as () => ActionColumn,
    default: null,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  pagination: {
    type: Object as () => PaginationProps,
    default: () => ({
      pageSize: 10,
      current: 1,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => `共 ${total} 条数据`,
    }),
  },
  rowSelection: {
    type: Object,
    default: null,
  },
  scroll: {
    type: Object,
    default: () => ({ x: 'max-content' }),
  },
  tableProps: {
    type: Object as () => Partial<TableProps>,
    default: () => ({}),
  },
  searchLayout: {
    type: String as () => FormProps['layout'],
    default: 'inline',
  },
  searchLabelCol: {
    type: Object as () => ColConfig,
    default: () => ({ span: 8 }),
  },
  searchWrapperCol: {
    type: Object as () => ColConfig,
    default: () => ({ span: 16 }),
  },
  searchButtonLabelCol: {
    type: Object as () => ColConfig,
    default: () => ({ span: 0 }),
  },
  searchButtonWrapperSpan: {
    type: Number,
    default:6,
  },
  editRow: {
    type: Boolean,
    default: false,
  },
  // 树型表格配置
  childrenColumnName: {
    type: String,
    default: 'children',
  },
  defaultExpandAllRows: {
    type: Boolean,
    default: false,
  },
  defaultExpandedRowKeys: {
    type: Array,
    default: () => [],
  },
  expandedRowKeys: {
    type: Array,
    default: () => [],
  },
  
});

// 组件 emit
const emit = defineEmits<{
  (e: 'search', params: any, pagination: PaginationProps | false): void;
  (e: 'tableChange', pagination: PaginationProps | false, filters: any, sorter: any): void;
  (e: 'action', action: string, record: any, index: number): void;
  (e: 'toolbarAction', action: string, key?: string): void;
  (e: 'selectChange', selectedRowKeys: any[], selectedRows: any[]): void;
  (e: 'loadSuccess', data: any[]): void;
  (e: 'loadError', error: any): void;
  (e: 'cellEdit', record: any, column: ColumnItem, value: any): void;
  (e: 'formChange', params: any): void;
  (e: 'expand', expanded: boolean, record: any): void;
  (e: 'expandedRowsChange', expandedRows: any[]): void;
}>();

// 内部状态管理
const searchForm = ref<any>({});
const advancedSearchVisible = ref(false);
const paginationConfig = ref<PaginationProps>({ ...props.pagination });
const internalTableData = ref<any[]>([]);
const internalLoading = ref(false);
const totalCount = ref(0);
const internalExpandedRowKeys = ref<any[]>([...props.defaultExpandedRowKeys]);

// 编辑状态管理
const editingState = reactive({
  rowIndex: -1,
  dataIndex: '',
  tempValue: null
});

// 搜索防抖定时器
let searchDebounceTimer: NodeJS.Timeout | null = null;

// 初始化搜索表单
const initSearchForm = () => {
  const form: any = {};
  props.searchConfig.forEach((item) => {
    // 对于select组件，如果没设置默认值则不设置初始值，以确保placeholder能正常显示
    if (item.type === 'select') {
      if ('defaultValue' in (item.props || {})) {
        form[item.field] = item.props.defaultValue;
      }
      // 如果没有设置defaultValue，则不设置初始值，保持undefined
    } else {
      form[item.field] = item.props?.defaultValue ?? (item.type === 'date-range' || item.props?.mode === 'multiple' ? [] : '');
    }
  });
  searchForm.value = form;
};

// 可见的搜索项
const visibleSearchItems = computed(() => {
  return props.searchConfig.filter(item => {
    return !item.advanced || (item.advanced && advancedSearchVisible.value);
  });
});

// 是否有高级搜索项
const hasAdvancedSearch = computed(() => {
  return props.searchConfig.some(item => item.advanced);
});


// 获取表单组件
const getFormComponent = (type: string) => {
  switch (type) {
    case 'input': return Input;
    case 'select': return Select;
    case 'date':
    case 'month':
    case 'year':
    case 'week':
    case 'quarter':
      return DatePicker;
    case 'date-range':
      return DatePicker.RangePicker;
    case 'checkbox': return Checkbox;
    case 'radio': return Radio.Group;
    case 'number': return InputNumber;
    case 'switch': return Switch;
    default: return Input;
  }
};

// 获取组件属性（适配日期组件配置）
const getComponentProps = (item: SearchItem) => {
  const baseProps = { ...item.props };
  
  const dateBaseProps = {
    locale,
    allowClear: true,
    inputReadOnly: true,
    ...baseProps
  };

  switch (item.type) {
    case 'date':
      return { ...dateBaseProps, picker: 'date', format: baseProps.format || 'YYYY-MM-DD' };
    case 'month':
      return { ...dateBaseProps, picker: 'month', format: baseProps.format || 'YYYY-MM' };
    case 'year':
      return { ...dateBaseProps, picker: 'year', format: baseProps.format || 'YYYY' };
    case 'week':
      return { ...dateBaseProps, picker: 'week', format: baseProps.format || 'YYYY-wo' };
    case 'quarter':
      return { ...dateBaseProps, picker: 'quarter', format: baseProps.format || 'YYYY-QQ' };
    case 'date-range':
      return {
        ...dateBaseProps,
        format: baseProps.format || 'YYYY-MM-DD',
      };
    default:
      return baseProps;
  }
};

// 获取展示组件
const getDisplayComponent = (type: string) => {
  const components: Record<string, any> = {
    tag: Tag,
    switch: Switch,
    radio: Radio,
    checkbox: Checkbox,
    badge: Badge,
    rate: Rate,
    progress: Progress,
    date: DatePicker,
    'date-range': DatePicker.RangePicker,
    image: Image,
    select: 'span' // select类型使用span标签展示
  };
  return components[type] || Tag;
};

// 获取编辑组件
const getEditComponent = (type: string) => {
  switch (type) {
    case 'date':
    case 'month':
    case 'year':
    case 'week':
    case 'quarter':
      return DatePicker;
    case 'date-range':
      return DatePicker.RangePicker;
    case 'input': return Input;
    case 'select': return Select;
    case 'number': return InputNumber;
    case 'switch': return Switch;
    case 'radio': return Radio.Group;
    case 'checkbox': return Checkbox;
    default: return Input;
  }
};

// 获取列编辑属性
const getColumnEditProps = (column: ColumnItem) => {
  const editConfig = column.edit || {};
  const baseProps = { ...editConfig.props };

  const dateBaseProps = {
    locale,
    allowClear: true,
    inputReadOnly: true,
    ...baseProps
  };

  switch (editConfig.type) {
    case 'date':
      return { ...dateBaseProps, picker: 'date', format: baseProps.format || 'YYYY-MM-DD' };
    case 'month':
      return { ...dateBaseProps, picker: 'month', format: baseProps.format || 'YYYY-MM' };
    case 'year':
      return { ...dateBaseProps, picker: 'year', format: baseProps.format || 'YYYY' };
    case 'week':
      return { ...dateBaseProps, picker: 'week', format: baseProps.format || 'YYYY-wo' };
    case 'quarter':
      return { ...dateBaseProps, picker: 'quarter', format: baseProps.format || 'YYYY-QQ' };
    case 'date-range':
      return { ...dateBaseProps, format: baseProps.format || 'YYYY-MM-DD'};
    default:
      return baseProps;
  }
};

// 获取组件属性
const getColumnComponentProps = (column: ColumnItem, value: any, record: any) => {
  if (column.componentProps) {
    return column.componentProps(value, record);
  }

  const baseProps = {
    locale,
    disabled: true,
    value: value || undefined
  };

  switch (column.type) {
    case 'tag':
      
      // 支持tag的options配置进行中文回显，支持数组和逗号分隔的多选
      if (unref(column.options) && Array.isArray(unref(column.options))) {
        // 处理数组值
        if (Array.isArray(value)) {
          const tags = value.map(val => {
            const option = unref(column.options).find(opt => opt.value === val || opt.value.toString() === val);
            const displayText = option ? option.label : val;
            return {
              color: option?.color || getTagColor(displayText),
              children: displayText
            };
          });
          return tags;
        }
        
        // 处理逗号分隔的字符串值
        if (typeof value === 'string' && value.includes(',')) {
          const values = value.split(',').map(v => v.trim());
          const tags = values.map(val => {
            const option = unref(column.options).find(opt => opt.value === val || opt.value.toString() === val);
            const displayText = option ? option.label : val;
            return {
              color: option?.color || getTagColor(displayText),
              children: displayText
            };
          });
          return tags;
        }
        
        // 单个值处理
        const option = unref(column.options).find(opt => opt.value === value || opt.value.toString() === value);
        const displayText = option ? option.label : value;
        return { color: option?.color ||  getTagColor(displayText), children: displayText };
      }
      return { color: getTagColor(value), children: value };
    case 'select':
      // 支持select的options配置进行中文回显，支持数组和逗号分隔的多选
      if (unref(column.options) && Array.isArray(unref(column.options))) {
        // 处理数组值
        if (Array.isArray(value)) {
          const labels = value.map(val => {
            const option = unref(column.options).find(opt => opt.value === val || opt.value.toString() === val);
            return option ? option.label : val;
          });
          return { children: labels.join(', ') };
        }
        
        // 处理逗号分隔的字符串值
        if (typeof value === 'string' && value.includes(',')) {
          const values = value.split(',').map(v => v.trim());
          const labels = values.map(val => {
            const option = unref(column.options).find(opt => opt.value === val || opt.value.toString() === val);
            return option ? option.label : val;
          });
          return { children: labels.join(', ') };
        }
        
        // 单个值处理
        const option = unref(column.options).find(opt => opt.value === value || opt.value.toString() === value);
        return { children: option ? option.label : value };
      }
      return { children: value };
    case 'switch':
      return { checked: value, checkedChildren: '启用', unCheckedChildren: '禁用' };
    case 'badge':
      return { status: getBadgeStatus(value), text: value };
    case 'progress':
      return { percent: value, size: 'small' };
    case 'date':
      return { ...baseProps, picker: 'date', format: 'YYYY-MM-DD' };
    case 'date-range':
      return { ...baseProps, format: 'YYYY-MM-DD'};
    case 'image':
      // 处理 base64 图片数据
      let imageSrc = value;
      if (value && typeof value === 'string' && !value.startsWith('data:') && !value.startsWith('http')) {
        // 如果是 base64 字符串但没有 data: 前缀，添加前缀
        imageSrc = `data:image/jpeg;base64,${value}`;
      }
      return { 
        src: imageSrc, 
        alt: '图片',
        style: { width: '80px', height: '60px', objectFit: 'cover' },
        preview: true,
        fallback: '/placeholder.png' // 添加备用图片
      };
    default:
      return { value };
  }
};

// 辅助函数：获取Tag颜色
const getTagColor = (value: any) => {
  const colorMap: Record<string, string> = {
    '成功': 'success',
    '失败': 'error',
    '警告': 'warning',
    '进行中': 'processing',
    '已禁用': 'default'
  };
  return colorMap[value] || 'blue';
};

// 辅助函数：获取Badge状态
const getBadgeStatus = (value: any) => {
  const statusMap: Record<string, 'success' | 'processing' | 'warning' | 'error' | 'default'> = {
    '正常': 'success',
    '异常': 'error',
    '处理中': 'processing',
    '待审核': 'warning'
  };
  return statusMap[value] || 'default';
};

// 辅助函数：获取选项标签
const getSelectOptionLabel = (column: ColumnItem, value: any) => {
  if (!unref(column.options) || !Array.isArray(unref(column.options))) {
    return value;
  }
  
  // 处理空值
  if (value === null || value === undefined || value === '') {
    return '--';
  }
  
  // 如果是数组，处理多选
  if (Array.isArray(value)) {
    const labels = value.map(val => {
      const option = unref(column.options).find(opt => opt.value === val);
      return option ? option.label : val;
    });
    return labels.join(', ');
  }
  
  // 如果是字符串且包含逗号，处理逗号分隔的多选
  if (typeof value === 'string' && value.includes(',')) {
    const values = value.split(',').map(v => v.trim());
    const labels = values.map(val => {
      const option = unref(column.options).find(opt => opt.value === val || opt.value.toString() === val);
      return option ? option.label : val;
    });
    return labels.join(', ');
  }
  
  // 单个值匹配
  const option = unref(column.options).find(opt => opt.value === value || opt.value.toString() === value);
  return option ? option.label : value;
};

// 获取表单项的 Label Col 配置
const getItemLabelCol = (item: SearchItem) => {
  if (props.searchLayout === 'inline' || !item.colSpan) {
    return item.labelCol || props.searchLabelCol;
  }
  
  // 当使用horizontal布局且设置了colSpan时，使用栅格布局不需要Ant Design的栅格系统
  if (props.searchLayout === 'horizontal' && item.colSpan) {
    return { span: 24 }; // 让label占据整行，由grid来控制布局
  }
  
  return { span: 24 };
};

// 获取表单项的 Wrapper Col 配置
const getItemWrapperCol = (item: SearchItem) => {
  if (props.searchLayout === 'inline' || !item.colSpan) {
    return item.wrapperCol || props.searchWrapperCol;
  }

  // 当使用horizontal布局且设置了colSpan时，使用栅格布局不需要Ant Design的栅格系统
  if (props.searchLayout === 'horizontal' && item.colSpan) {
    return { span: 24 }; // 让FormItem占据整行，由grid来控制宽度
  }

  const totalSpan = 24;
  const unitSpan = Math.floor(totalSpan / item.colSpan);
  return { span: unitSpan };
};

// 获取Form Item的CSS类
const getFormItemClass = (item: SearchItem) => {
  const classes: string[] = [];
  
  if (props.searchLayout === 'horizontal' && item.colSpan) {
    classes.push(`col-span-${item.colSpan}`);
  }
  
  if (props.searchLayout === 'horizontal' && item.rowSpan) {
    classes.push(`row-span-${item.rowSpan}`);
  }
  
  return classes.join(' ');
};

// 获取搜索项样式
const getSearchItemStyle = (item: SearchItem) => {
  const style: Record<string, any> = { ...item.style };

  if (props.searchLayout === 'inline') {
    if (item.colSpan) {
      style.flex = `0 0 ${(100 / 24) * item.colSpan}%`;
      style.maxWidth = `${(100 / 24) * item.colSpan}%`;
    }
  } else if (props.searchLayout === 'horizontal') {
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
  
  return style;
};

// 合并加载状态
const isLoading = computed(() => {
  return internalLoading.value || props.loading;
});

// 表格数据源
const tableData = computed(() => {
  return props.api ? internalTableData.value : props.dataSource;
});

// 最终分页配置
const finalPaginationConfig = computed<PaginationProps | false>(() => {
  if (!props.showPagination) return false;
  return {
    ...paginationConfig.value,
    total: totalCount.value,
    showSizeChanger: props.pagination.showSizeChanger !== undefined 
      ? props.pagination.showSizeChanger 
      : true,
    showQuickJumper: props.pagination.showQuickJumper !== undefined 
      ? props.pagination.showQuickJumper 
      : true,
    showTotal: props.pagination.showTotal !== undefined 
      ? props.pagination.showTotal 
      : (total: number) => `共 ${total} 条数据`,
  };
});

// 格式化日期参数
const formatDateParams = (params: any) => {
  const formatted: any = {};
  Object.entries(params).forEach(([key, value]) => {
    if (!value) {
      formatted[key] = value;
      return;
    }
    if (Array.isArray(value) && value.length === 2 && dayjs.isDayjs(value[0]) && dayjs.isDayjs(value[1])) {
      formatted[key] = [value[0].format('YYYY-MM-DD'), value[1].format('YYYY-MM-DD')];
    } else if (dayjs.isDayjs(value)) {
      formatted[key] = value.format('YYYY-MM-DD');
    } else {
      formatted[key] = value;
    }
  });
  return formatted;
};

// 处理数据加载
const loadData = async (params: any = {}, pagination: PaginationProps | false = finalPaginationConfig.value) => {
  if (!props.api) return;

  try {
    internalLoading.value = true;
    const formattedParams = formatDateParams(params);

    const requestParams = props.paramsFormatter 
      ? props.paramsFormatter({ ...formattedParams }, pagination)
      : props.showPagination 
        ? { ...formattedParams, pageNum: pagination?.current || 1, pageSize: pagination?.pageSize || 10 }
        : { ...formattedParams };

    const response = await props.api(requestParams);
    
    console.log('=== SmartTable loadData ===');
    console.log('API响应数据:', response);
    console.log('响应数据类型:', typeof response);
    console.log('是否为数组:', Array.isArray(response));
    
    // 如果响应本身就是数组（无分页的树型数据），直接使用
    let list = [];
    let total = 0;
    
    if (Array.isArray(response)) {
      list = response;
      total = response.length;
      console.log('使用数组响应，长度:', total);
    } else {
      // 如果是对象，尝试从指定键获取数据
      list = getNestedValue(response, props.responseConfig.listKey) ?? response.data ?? response.list ?? [];
      total = getNestedValue(response, props.responseConfig.totalKey) ?? response.total ?? 0;
      console.log('使用对象响应，列表长度:', list.length, '总数:', total);
    }

    console.log('最终设置到表格的数据:', list);
    console.log('=== loadData 结束 ===');

    internalTableData.value = Array.isArray(list) ? list : [];
    totalCount.value = typeof total === 'number' ? total : 0;
    
    // 如果设置了默认展开所有行，则在数据加载完成后展开所有节点
    if (props.defaultExpandAllRows) {
      // 等待 DOM 更新后展开所有节点
      await nextTick();
      const allKeys: any[] = [];
      const collectKeys = (data: any[]) => {
        data.forEach(item => {
          if (item[props.childrenColumnName] && item[props.childrenColumnName].length > 0) {
            allKeys.push(item[props.rowKey || 'id']);
            collectKeys(item[props.childrenColumnName]);
          }
        });
      };
      collectKeys(internalTableData.value);
      internalExpandedRowKeys.value = allKeys;
    }
    
    emit('loadSuccess', internalTableData.value);
  } catch (error) {
    console.error('数据加载失败:', error);
    emit('loadError', error);
  } finally {
    internalLoading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  if (props.showPagination) {
    paginationConfig.value.current = 1;
  }
  if (props.api) {
    loadData(searchForm.value, finalPaginationConfig.value);
  } else {
    emit('search', formatDateParams(searchForm.value), finalPaginationConfig.value);
  }
};

// 重置搜索
const resetSearch = () => {
  initSearchForm();
  if (props.showPagination) {
    paginationConfig.value.current = 1;
  }
  if (props.api) {
    loadData(searchForm.value, finalPaginationConfig.value);
  } else {
    emit('search', formatDateParams(searchForm.value), finalPaginationConfig.value);
  }
};

// 处理表单变化
const handleFormChange = () => {
  emit('formChange', formatDateParams(searchForm.value));
  if (props.immediateSearch) {
    triggerImmediateSearch();
  }
};

// 处理字段变化
const handleFieldChange = (field: string, value: any) => {
  if (props.immediateSearch) {
    triggerImmediateSearch();
  }
};

// 触发即时搜索（带防抖）
const triggerImmediateSearch = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
  
  searchDebounceTimer = setTimeout(() => {
    if (props.showPagination) {
      paginationConfig.value.current = 1;
    }
    if (props.api) {
      loadData(searchForm.value, finalPaginationConfig.value);
    } else {
      emit('search', formatDateParams(searchForm.value), finalPaginationConfig.value);
    }
  }, props.searchDebounce);
};

// 切换高级搜索
const toggleAdvancedSearch = () => {
  advancedSearchVisible.value = !advancedSearchVisible.value;
};

// 处理表格变化
const handleTableChange = (pagination: PaginationProps, filters: any, sorter: any) => {
  if (props.showPagination) {
    paginationConfig.value = { ...pagination };
  }
  const params = { ...searchForm.value, filters, sorter };
  if (props.api) {
    loadData(params, finalPaginationConfig.value);
  } else {
    emit('tableChange', finalPaginationConfig.value, filters, sorter);
  }
};

// 处理展开/折叠
const handleExpand = (expanded: boolean, record: any) => {
  // 更新内部展开状态
  const recordKey = record[props.rowKey || '_id'];
  if (expanded) {
    // 展开当前行
    if (!internalExpandedRowKeys.value.includes(recordKey)) {
      internalExpandedRowKeys.value.push(recordKey);
    }
  } else {
    // 折叠当前行
    const index = internalExpandedRowKeys.value.indexOf(recordKey);
    if (index > -1) {
      internalExpandedRowKeys.value.splice(index, 1);
    }
  }
  emit('expand', expanded, record);
};

// 处理展开行变化
const handleExpandedRowsChange = (expandedRows: any[]) => {
  internalExpandedRowKeys.value = [...expandedRows];
  emit('expandedRowsChange', expandedRows);
};

// 行选择配置
const rowSelectionConfig = computed(() => {
  if (!props.rowSelection) return null;
  return {
    ...props.rowSelection,
    onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
      emit('selectChange', selectedRowKeys, selectedRows);
    },
  };
});

// 操作列相关
const hasActionColumn = computed(() => {
  return !!props.actionColumn && props.actionColumn.actions.length > 0;
});

// 获取可见的操作按钮（支持动态权限判断）
const getVisibleActions = (record: any) => {
  if (!props.actionColumn || !props.actionColumn.actions) {
    return [];
  }
  
  // 过滤出可见的操作按钮
  return props.actionColumn.actions.filter(action => {
    // 如果action有visible属性且是一个函数，则调用它来判断是否显示
    if (typeof action.visible === 'function') {
      return action.visible(record);
    }
    // 如果没有visible属性，默认显示
    return true;
  });
};

const handleAction = (action: ActionItem, record: any, rowIndex: number) => {
  emit('action', action.action, record, rowIndex);
};

// 工具栏操作
const handleToolbarAction = (action: string, key?: string) => {
  emit('toolbarAction', action, key);
};

// 滚动配置
const scrollConfig = computed(() => {
  return { ...props.scroll };
});

// 自定义展开图标
const customExpandIcon = (expandIconProps: any) => {
  const { expanded, onExpand, record } = expandIconProps;
  
  // 检查是否有子节点 - 使用组件的 childrenColumnName 配置
  const hasChildren = record[props.childrenColumnName] && 
                      Array.isArray(record[props.childrenColumnName]) && 
                      record[props.childrenColumnName].length > 0;
  
  // 如果没有子节点，返回 null 不显示图标
  if (!hasChildren) {
    return null;
  }
  
  return h(
    'span',
    {
      class: 'custom-expand-icon',
      style: {
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        marginRight: '8px',
        transition: 'transform 0.2s ease'
      },
      onClick: (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onExpand(record, e);
      }
    },
    [
      h(RightOutlined, {
        style: {
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '12px',
          color: '#666'
        }
      })
    ]
  );
};

// 编辑功能相关
const isEditing = (rowIndex: number, dataIndex: string) => {
  return editingState.rowIndex === rowIndex && editingState.dataIndex === dataIndex;
};

const editValue = computed({
  get: () => editingState.tempValue,
  set: (val) => {
    editingState.tempValue = val;
  }
});

// 开始编辑
const startEditing = (rowIndex: number, dataIndex: string, value: any) => {
  editingState.rowIndex = rowIndex;
  editingState.dataIndex = dataIndex;
  editingState.tempValue = value;
};

// 完成编辑
const handleEditComplete = (rowIndex: number, column: ColumnItem, record: any) => {

  let finalValue = editingState.tempValue;
  if (column.edit?.type?.includes('date')) {
    if (Array.isArray(finalValue) && finalValue.length === 2) {
      finalValue = finalValue.map(item => item.format('YYYY-MM-DD'));
    } else if (dayjs.isDayjs(finalValue)) {
      finalValue = finalValue.format('YYYY-MM-DD');
    }
  }

  if (JSON.stringify(finalValue) !== JSON.stringify(record[column.dataIndex])) {
    emit('cellEdit', record, column, finalValue);
  }

  editingState.rowIndex = -1;
  editingState.dataIndex = '';
  editingState.tempValue = null;
};

// 列配置处理
const finalColumns = computed(() => {
  const cols = [...props.columns];
  
  cols.forEach(column => {
    if (column.edit) {
      const dataIndex = column.key || column.dataIndex;
      column.onCell = (record: any, rowIndex: number) => ({
        onClick: () => {
          startEditing(rowIndex, dataIndex, record[column.dataIndex]);
        }
      });
    }
  });
  
  // 移除使用 slots 的方式，改用新的插槽方式处理操作列
  if (hasActionColumn.value) {
    cols.push({
      title: props.actionColumn?.title || '操作',
      key: 'action',
      dataIndex: 'action', // 添加 dataIndex 属性
      width: props.actionColumn?.width || 150,
      fixed: props.actionColumn?.fixed || 'right',
    });
  }
  return cols;
});

const formattedColumns = computed(() => {
  return finalColumns.value.map(column => {
    // 调试日志 - 可以在生产环境中移除
    // console.log('Processing column:', column.title, 'width:', column.width, 'ellipsis:', column.ellipsis);
    // 为有 formatter 的列添加 customRender（优先级最高）
    if(!column.align) column.align = 'center';
    if (column.formatter) {
      return {
        ...column,
        width: column.width,
        ellipsis: column.ellipsis,
        customRender: ({ record, text, index }) => {
        
          // 检查text是否是整个record对象（当dataIndex对应的字段不存在时会发生）
          if (text && typeof text === 'object' && text === record) {
            return '--';
          }
          
          
          // 编辑状态处理
          if (isEditing(index, column.dataIndex)) {
            return h('div', { class: 'edit-cell' }, [
              h(getEditComponent(column.edit?.type || 'input'), {
                value: editValue,
                'onUpdate:value': (val: any) => { editingState.tempValue = val; },
                ...getColumnEditProps(column),
                onBlur: () => handleEditComplete(index, column, record),
                onKeyup: (e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    handleEditComplete(index, column, record);
                  }
                },
                autofocus: true
              })
            ]);
          }
          
          // 非编辑状态使用 formatter，包装在具有省略号样式的容器中，并添加 Tooltip
          const formattedText = column.formatter(text, record);
          const shouldShowTooltip = typeof formattedText === 'string' && formattedText.length > 0 && formattedText !== '--' && column.ellipsis === true;
          
          if (shouldShowTooltip) {
            return h(Tooltip, {
              title: formattedText,
              placement: 'bottom',
              mouseEnterDelay: 0.1,
              key: generateUniqueKey(column, record, index)
            }, {
              default: () => h('div', { 
                style: {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%'
                }
              }, formattedText)
            });
          }
          
          return h('div', { 
            style: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }
          }, formattedText);
        }
      };
    }
    
    // 为有 type 的列添加 customRender
    if (column.type) {
      return {
        ...column,
        width: column.width,
        ellipsis: column.ellipsis,
        customRender: ({ record, text, index }) => {
          // 编辑状态处理
          if (isEditing(index, column.dataIndex)) {
            return h('div', { class: 'edit-cell' }, [
              h(getEditComponent(column.edit?.type || 'input'), {
                value: editValue,
                'onUpdate:value': (val: any) => { editingState.tempValue = val; },
                ...getColumnEditProps(column),
                onBlur: () => handleEditComplete(index, column, record),
                onKeyup: (e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    handleEditComplete(index, column, record);
                  }
                },
                autofocus: true
              })
            ]);
          }
          if (column.type === 'image') {
            // 处理 base64 图片数据
            let imageSrc = text;
            if (text && typeof text === 'string' && !text.startsWith('data:') && !text.startsWith('http') && !text.startsWith('/')) {
              imageSrc = `data:image/jpeg;base64,${text}`;
            }
            return h(Image, {
              src: imageSrc,
              alt: '图片',
              style: { width: '80px', height: '60px', objectFit: 'cover' },
              preview: true,
              fallback: '/placeholder.png'
            });
          }
          if (column.type === 'tag') {
            if(text === null 
            || text === undefined 
            || JSON.stringify(text) === '{}' 
            || text?.length === 0) return h(Tag, { color: getTagColor(text) }, () => '--');

            let tagContent;
            let fullText = '';

            if (unref(column.options) && Array.isArray(unref(column.options))) {
              // 处理数组值
              if (Array.isArray(text)) {
                const tagElements = text.map(val => {
                  const option = unref(column.options).find(opt => opt.value === val || opt.value.toString() === val);
                  const displayText = option ? option.label : val;
                  const color = option?.color ? option.color : getTagColor(displayText);
                  fullText += (fullText ? ', ' : '') + displayText;
                  return h(Tag, { color, style: { margin: 0 } }, () => displayText);
                });
                tagContent = h('div', { style: { display: 'flex',justifyContent: 'center', flexWrap: 'wrap', gap: '4px' } }, tagElements);
              }
              
              // 处理逗号分隔的字符串值
              else if (typeof text === 'string' && text.includes(',')) {
                const values = text.split(',').map(v => v.trim());
                const tagElements = values.map(val => {
                  const option = unref(column.options).find(opt => opt.value === val || opt.value.toString() === val);
                  const displayText = option ? option.label : val;
                  const color = option?.color ? option.color : getTagColor(displayText);
                  fullText += (fullText ? ', ' : '') + displayText;
                  return h(Tag, { color, style: { margin: 0 } }, () => displayText);
                });
                tagContent = h('div', { style: { display: 'flex',justifyContent: 'center',flexWrap: 'wrap', gap: '4px' } }, tagElements);
              }
              
              // 单个值处理
              else {
                const option = unref(column.options).find(opt => opt.value === text || opt.value.toString() === text);
                const displayText = option ? option.label : text;
                fullText = displayText;
                const color = option?.color ? option.color : getTagColor(displayText);
                tagContent = h(Tag, { color }, () => displayText);
              }
            }
            
            // 没有options配置的情况
            else {
              fullText = text;
              tagContent = h(Tag, { color: getTagColor(text) }, () => text);
            }
            
            // 为tag添加Tooltip包装
            if (fullText && fullText.length > 0 && column.ellipsis === true) {
              return h(Tooltip, {
                title: fullText,
                placement: 'bottom',
                mouseEnterDelay: 0.1,
                key: generateUniqueKey(column, record, index)
              }, {
                default: () => tagContent
              });
            }
            
            return tagContent;
          }
          
          if (column.type === 'select') {
            // 支持select的options配置进行中文回显，支持数组和逗号分隔的多选
            let displayText = '';
            
            if (unref(column.options) && Array.isArray(unref(column.options))) {
              // 处理数组值
              if (Array.isArray(text)) {
                const labels = text.map(val => {
                  const option = unref(column.options).find(opt => opt.value === val || opt.value.toString() === val);
                  return option ? option.label : val;
                });
                displayText = labels.join(', ');
              }
              
              // 处理逗号分隔的字符串值
              else if (typeof text === 'string' && text.includes(',')) {
                const values = text.split(',').map(v => v.trim());
                const labels = values.map(val => {
                  const option = unref(column.options).find(opt => opt.value === val || opt.value.toString() === val);
                  return option ? option.label : val;
                });
                displayText = labels.join(', ');
              }
              
              // 单个值处理
              else {
                const option = unref(column.options).find(opt => opt.value === text || opt.value.toString() === text);
                displayText = option ? option.label : text;
              }
            } else {
              displayText = text;
            }
            
            // 为select添加Tooltip包装
            const selectContent = h('span', {}, displayText);
            if (displayText && displayText.length > 0 && displayText !== '--' && column.ellipsis === true) {
              return h(Tooltip, {
                title: displayText,
                placement: 'bottom',
                mouseEnterDelay: 0.1,
                key: generateUniqueKey(column, record, index)
              }, {
                default: () => selectContent
              });
            }
            
            return selectContent;
          }
          
          if (column.type === 'switch') {
            return h(Switch, { 
              checked: text, 
              checkedChildren: '启用', 
              unCheckedChildren: '禁用',
              disabled: true 
            });
          }
          
          if (column.type === 'badge') {
            return h(Badge, { status: getBadgeStatus(text), text });
          }
          
          if (column.type === 'progress') {
            return h(Progress, { percent: text, size: 'small' });
          }
          
          if (column.type === 'rate') {
            return h(Rate, { value: text, disabled: true, allowHalf: true });
          }
          // 默认返回文本
          return text || '--';
        }
      };
    }
    if (column.render) {
      return { 
        ...column, 
        width: column.width,
        ellipsis: column.ellipsis,
        customRender: column.render 
      };
    }
    
    // 为普通列添加 customRender（包含编辑支持）
    // 但排除操作列，因为操作列使用新的 bodyCell 插槽处理
    if ((column.edit || (column.dataIndex && finalColumns.value.some(col => col.dataIndex === column.dataIndex && col.edit))) && column.key !== 'action') {
      return {
        ...column,
        width: column.width,
        ellipsis: column.ellipsis,
        customRender: ({ record, text, index }) => {
          // 编辑状态处理
          if (isEditing(index, column.dataIndex)) {
            return h('div', { class: 'edit-cell' }, [
              h(getEditComponent(column.edit?.type || 'input'), {
                value: editValue,
                'onUpdate:value': (val: any) => { editingState.tempValue = val; },
                ...getColumnEditProps(column),
                onBlur: () => handleEditComplete(index, column, record),
                onKeyup: (e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    handleEditComplete(index, column, record);
                  }
                },
                autofocus: true
              })
            ]);
          }
          
          // 非编辑状态返回原始文本，包装在具有省略号样式的容器中，并添加 Tooltip
          const displayText = text || text === false || text === 0 ? text : '--';
          const shouldShowTooltip = typeof displayText === 'string' && displayText !== '--' && displayText.length > 0 && column.ellipsis === true;
          
          if (shouldShowTooltip) {
            return h(Tooltip, {
              title: displayText,
              placement: 'bottom',
              mouseEnterDelay: 0.1,
              key: generateUniqueKey(column, record, index)
            }, {
              default: () => h('div', { 
                style: {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%'
                }
              }, displayText)
            });
          }
          
          return h('div', { 
            style: {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }
          }, displayText);
        }
      };
    }
    
    // 为普通列添加基本的 customRender
    return {
      ...column,
      width: column.width,
      ellipsis: column.ellipsis,
      customRender: ({ record, text, index }) => {
        // 特殊处理序号列
        if (column.dataIndex === 'index') {
          return index + 1;
        }
        // 普通文本列的默认渲染，包装在具有省略号样式的容器中，并添加 Tooltip
        const displayText = text || text === false || text === 0 ? text : '--';
        const shouldShowTooltip = typeof displayText === 'string' && displayText !== '--' && displayText.length > 0 && column.ellipsis === true
        
        if (shouldShowTooltip) {
          return h(Tooltip, {
            title: displayText,
            placement: 'bottom',
            mouseEnterDelay: 0.1,
            key: generateUniqueKey(column, record, index)
          }, {
            default: () => h('div', { 
              style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%'
              }
            }, displayText)
          });
        }
        
        return h('div', { 
          style: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%'
          }
        }, displayText);
      }
    };
  });
});

// 监听数据变化时退出编辑状态
watch(
  () => tableData.value,
  () => {
    editingState.rowIndex = -1;
    editingState.dataIndex = '';
    editingState.tempValue = null;
  }
);

// 监听分页配置变化
watch(
  () => props.pagination,
  (newVal) => {
    paginationConfig.value = { ...newVal };
  },
  { deep: true }
);

// 监听分页开关变化
watch(
  () => props.showPagination,
  (newVal) => {
    if (newVal) {
      paginationConfig.value.current = 1;
    }
    if (props.api) {
      loadData(searchForm.value, finalPaginationConfig.value);
    }
  }
);

// 监听展开行keys变化
watch(
  () => props.expandedRowKeys,
  (newVal) => {
    internalExpandedRowKeys.value = [...newVal];
  },
  { deep: true }
);

// 监听搜索布局变化
watch(
  () => props.searchLayout,
  () => {
    searchForm.value = { ...searchForm.value };
  }
);

// 初始化
onMounted(() => {
  initSearchForm();
  if (props.api) {
    loadData(searchForm.value, finalPaginationConfig.value);
  } else if (props.searchConfig.length > 0) {
    emit('search', formatDateParams(searchForm.value), finalPaginationConfig.value);
  }
});

// 暴露方法
const expose = {
  refresh: () => {
    if (props.api) {
      loadData(searchForm.value, finalPaginationConfig.value);
    } else {
      emit('search', formatDateParams(searchForm.value), finalPaginationConfig.value);
    }
  },
  reset: () => {
    initSearchForm();
    if (props.showPagination) {
      paginationConfig.value = { ...props.pagination, current: 1 };
    }
    if (props.api) {
      loadData(searchForm.value, finalPaginationConfig.value);
    } else {
      emit('search', formatDateParams(searchForm.value), finalPaginationConfig.value);
    }
  },
  getSearchParams: () => formatDateParams(searchForm.value),
  setSearchParams: (params: any) => {
    searchForm.value = { ...searchForm.value, ...params };
    expose.refresh();
  },
  cancelEdit: () => {
    editingState.rowIndex = -1;
    editingState.dataIndex = '';
    editingState.tempValue = null;
  },
  clearSearchDebounce: () => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = null;
    }
  },
  // 树型表格相关方法
  expandAll: () => {
    const allKeys: any[] = [];
    const collectKeys = (data: any[]) => {
      data.forEach(item => {
        if (item[props.childrenColumnName] && item[props.childrenColumnName].length > 0) {
          allKeys.push(item[props.rowKey || 'id']);
          collectKeys(item[props.childrenColumnName]);
        }
      });
    };
    collectKeys(tableData.value);
    internalExpandedRowKeys.value = allKeys;
  },
  collapseAll: () => {
    internalExpandedRowKeys.value = [];
  },
  getExpandedRowKeys: () => [...internalExpandedRowKeys.value],
  setExpandedRowKeys: (keys: any[]) => {
    internalExpandedRowKeys.value = [...keys];
  }
};

defineExpose(expose);
</script>

<style scoped>
.smart-table-container {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
}

.search-card {
  margin-bottom: 16px;
  :deep(.ant-form-item-label){
    padding: 0;
  }
}

.table-toolbar {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 编辑状态样式 */
:deep(.ant-table-cell-editing) {
  padding: 4px !important;
}

:deep(.ant-table-cell:hover) {
  background-color: #f5f7fa;
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
:deep(.ant-picker) {
  width: 100%;
}

/* 自定义展开图标样式 */
.custom-expand-icon:hover {
  background-color: #f0f0f0;
  border-radius: 2px;
}

:deep(.table-striped) td {
  background-color: #fafafa;
}
:deep(.ant-table-cell-row-hover){
  background-color: #6cbbfc33 !important;
}

/* 修复固定列悬浮时遮挡问题 */
:deep(.ant-table-cell-fix-right) {
  background-color: #fff !important;
  z-index: 99 !important;
}

/* 省略号样式支持 - 关键修复 */
:deep(.ant-table-tbody > tr > td) {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

:deep(.ant-table-thead > tr > th) {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* 确保设置了 ellipsis 的列能够正确显示省略号 */
:deep(.ant-table-cell-ellipsis) {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  word-break: keep-all !important;
}

/* 为自定义渲染的内容添加省略号支持 */
:deep(.ant-table-tbody .ant-table-cell) {
  white-space: nowrap !important;
}

/* 处理嵌套元素的省略号 */
:deep(.ant-table-cell .ant-typography) {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: block !important;
}

/* 强制所有表格单元格应用省略号 */
:deep(.ant-table-tbody td) {
  max-width: 0 !important;
}

:deep(.ant-table-cell) {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>