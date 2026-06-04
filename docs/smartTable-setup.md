# SmartTable 项目配置指南

## 概述

本文档详细说明如何为示例地区安AI隐患排查项目配置和使用SmartTable组件。SmartTable是一个高度可配置的表格组件，集成了搜索、分页、排序、编辑等功能，专门针对项目业务需求进行了优化。

## 项目结构

```
src/
├── components/
│   └── smartTable/
│       ├── index.vue              # 主组件
│       ├── index.ts               # 组件入口
│       ├── config.ts              # 项目配置
│       ├── utils.ts               # 工具函数
│       ├── README.md              # 使用指南
│       └── example/               # 示例文件
│           ├── apiTable.vue       # API表格示例
│           └── staticTable.vue    # 静态表格示例
├── types/
│   └── business.ts                # 业务类型定义
├── views/
│   ├── warnList-smartTable.vue    # 告警列表示例
│   └── system/
│       └── camera-smartTable.vue  # 摄像头管理示例
└── docs/
    └── smartTable-setup.md        # 本文档
```

## 配置步骤

### 1. 组件安装

SmartTable组件已经集成在项目中，无需额外安装。如果需要更新依赖，确保以下包已安装：

```json
{
  "dependencies": {
    "ant-design-vue": "^4.2.6",
    "axios": "^1.13.2",
    "dayjs": "^1.11.18",
    "vue": "^3.5.13"
  }
}
```

### 2. 类型定义

项目已包含完整的TypeScript类型定义：

- `src/types/business.ts` - 业务数据类型
- 组件内部类型定义 - SmartTable特定类型

### 3. API配置适配

使用项目统一的API配置：

```typescript
import { SmartTable, ApiPresets, createApiConfig } from '@/components/smartTable';

// 使用预设配置
const apiConfig = ApiPresets.warnList;

// 或自定义配置
const apiConfig = createApiConfig('/api/custom', 'post', {
  paramsFormatter: (params, pagination) => ({
    page: pagination.current,
    size: pagination.pageSize,
    ...params
  }),
  responseHandler: (response) => ({
    list: response.data.items,
    total: response.data.total
  })
});
```

## 使用方式

### 方式一：API模式（推荐）

自动处理数据加载、分页、搜索等：

```vue
<template>
  <SmartTable
    ref="smartTableRef"
    :columns="columns"
    :search-config="searchConfig"
    :action-column="actionColumn"
    :toolbar-config="toolbarConfig"
    :api="apiConfig"
    @action="handleAction"
    @toolbarAction="handleToolbarAction"
  />
</template>

<script setup>
import { SmartTable, ApiPresets } from '@/components/smartTable';

const apiConfig = ApiPresets.cameraList;
const smartTableRef = ref();

// 列配置、搜索配置等...
</script>
```

### 方式二：静态数据模式

适用于前端已有数据的场景：

```vue
<template>
  <SmartTable
    :columns="columns"
    :data-source="tableData"
    :search-config="searchConfig"
    @search="handleSearch"
    @tableChange="handleTableChange"
  />
</template>

<script setup>
const tableData = ref([...]);
</script>
```

## 项目特定功能

### 1. 状态映射

项目预设了多种状态映射：

```typescript
import { getStatusConfig } from '@/components/smartTable/config';

// 告警状态
getStatusConfig('warnStatus', 0); // { text: '未处理', color: 'red', badge: 'error' }

// 设备状态
getStatusConfig('deviceStatus', '1'); // { text: '启用', color: 'green', badge: 'processing' }

// 算法类型
getStatusConfig('algorithmType', '人脸识别'); // { color: 'blue' }
```

### 2. 预设API配置

```typescript
import { ApiPresets } from '@/components/smartTable/config';

// 告警列表
ApiPresets.warnList // /sse/messages

// 摄像头列表
ApiPresets.cameraList // /cameras

// 区域列表
ApiPresets.regionList // /regions

// 触发器列表
ApiPresets.triggerList // /triggers
```

### 3. 日期处理

自动处理dayjs日期对象：

```typescript
import { formatDateParams } from '@/components/smartTable/config';

// 将dayjs对象转换为后端需要的格式
formatDateParams({
  dateRange: [dayjs('2024-01-01'), dayjs('2024-01-31')],
  singleDate: dayjs('2024-01-01')
});

// 结果：
// {
//   dateRange: ['2024-01-01 00:00:00', '2024-01-31 00:00:00'],
//   singleDate: '2024-01-01 00:00:00'
// }
```

## 最佳实践

### 1. 统一的错误处理

```typescript
const handleError = (error: any, defaultMessage: string) => {
  const message = error?.response?.data?.message || error?.message || defaultMessage;
  message.error(message);
  console.error(error);
};

// 在事件处理中使用
const handleAction = async (action: string, record: any) => {
  try {
    // 执行操作
    await someApiCall(record.id);
    message.success('操作成功');
    smartTableRef.value?.refresh();
  } catch (error) {
    handleError(error, '操作失败');
  }
};
```

### 2. 响应式设计

```typescript
// 使用响应式配置
const searchConfig = computed(() => [
  {
    field: 'status',
    label: '状态',
    type: 'select',
    props: {
      options: statusOptions.value, // 响应式选项
      disabled: loading.value        // 响应式状态
    }
  }
]);
```

### 3. 性能优化

```typescript
// 使用debounce优化搜索
import { debounce } from '@/components/smartTable/utils';

const handleQuickSearch = debounce((keyword: string) => {
  smartTableRef.value?.setSearchParams({ keyword });
}, 300);

// 使用memo优化复杂计算
const formattedColumns = computed(() => {
  return columns.map(col => ({
    ...col,
    componentProps: col.componentProps ? memoize(col.componentProps) : undefined
  }));
});
```

## 常见问题

### 1. API响应格式不匹配

如果后端响应格式与预设不符，使用自定义responseHandler：

```typescript
const apiConfig = createApiConfig('/api/data', 'get', {
  responseHandler: (response) => ({
    list: response.result.items,      // 自定义数据字段
    total: response.result.totalCount  // 自定义总数字段
  })
});
```

### 2. 分页参数名称不同

使用paramsFormatter自定义分页参数：

```typescript
const apiConfig = createApiConfig('/api/data', 'get', {
  paramsFormatter: (params, pagination) => ({
    pageNum: pagination.current,  // 使用pageNum而不是page
    pageSize: pagination.pageSize,
    ...params
  })
});
```

### 3. 需要自定义验证规则

在列配置中添加rules：

```typescript
{
  title: '名称',
  dataIndex: 'name',
  edit: {
    type: 'input',
    rules: [
      { required: true, message: '请输入名称' },
      { min: 2, max: 50, message: '名称长度为2-50个字符' },
      { pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/, message: '只能输入中英文' }
    ]
  }
}
```

### 4. 复杂的自定义渲染

使用render函数：

```typescript
import { h } from 'vue';
import { Tag, Space } from 'ant-design-vue';

{
  title: '标签',
  dataIndex: 'tags',
  render: (tags: string[]) => h(Space, {}, 
    tags.map(tag => h(Tag, { color: 'blue' }, tag))
  )
}
```

## 扩展开发

### 添加新的状态映射

在`config.ts`中扩展StatusMappings：

```typescript
export const StatusMappings = {
  // 现有配置...
  
  // 新增自定义状态
  customStatus: {
    'pending': { text: '待审核', color: 'orange', badge: 'warning' },
    'approved': { text: '已通过', color: 'green', badge: 'success' },
    'rejected': { text: '已拒绝', color: 'red', badge: 'error' }
  }
};
```

### 添加新的API预设

```typescript
export const ApiPresets = {
  // 现有配置...
  
  // 新增自定义API配置
  customList: createApiConfig('/api/custom', 'get', {
    paramsFormatter: (params, pagination) => ({
      customPage: pagination.current,
      customSize: pagination.pageSize,
      ...params
    })
  })
};
```

### 添加新的工具函数

在`utils.ts`中添加：

```typescript
export function customFormatter(value: any): string {
  // 自定义格式化逻辑
  return String(value).toUpperCase();
}
```

## 测试和调试

### 1. 开发环境调试

```vue
<template>
  <SmartTable
    :api="apiConfig"
    @loadSuccess="handleLoadSuccess"
    @loadError="handleLoadError"
  />
</template>

<script setup>
const handleLoadSuccess = (data) => {
  console.log('数据加载成功:', data);
};

const handleLoadError = (error) => {
  console.error('数据加载失败:', error);
};
</script>
```

### 2. 性能监控

```typescript
import { throttle } from '@/components/smartTable/utils';

// 节流处理频繁操作
const handleSearch = throttle((params) => {
  console.log('搜索参数:', params);
}, 500);
```

## 总结

通过以上配置，SmartTable组件已经完全适配示例地区安AI隐患排查项目。主要特性包括：

1. **统一的API配置** - 适配项目现有的API结构
2. **完整的状态映射** - 预设各种业务状态
3. **TypeScript支持** - 完整的类型定义
4. **丰富的示例** - 覆盖常见使用场景
5. **工具函数库** - 提供常用的数据处理功能
6. **详细的文档** - 便于团队成员快速上手

按照本指南配置后，开发人员可以快速构建功能完整的表格页面，大大提高开发效率。