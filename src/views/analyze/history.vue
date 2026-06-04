<template>
    <div class="document-viewer relative flex flex-col  p-[16px] 
       box-border w-[100%] h-[100%] bg-[#fff]">
        <div class="text-[14px]" style="user-select: none;">
            <span>时间选择：</span>
            <RadioGroup v-model:value="dateType" @change="handleDateTypeChange">
                <RadioButton v-for="item in dateTypes" :key="item.value" :value="item.value">{{ item.label }}
                </RadioButton>
            </RadioGroup>
            <RangePicker v-model:value="dateRangeValue" @change="handleSearch" class="ml-[10px]"
                v-if="dateType === ''" />
            <DatePicker v-model:value="dateValue" @change="handleSearch" :picker="pickerType" class="ml-[10px]"
                value-format="YYYY-MM-DD HH:mm:ss" v-else />
            <span class="ml-[10px]">区域选择：</span>
            <TreeSelect v-model:value="selectedRegionKey" :style="{ maxHeight: '400px', width: '240px' }" allow-clear
                :field-names="{
                    children: 'children', label: 'region_name', value: 'region_id'
                }" show-search tree-node-filter-prop="region_name" :tree-data="regionOptions" @change="handleSearch"
                placeholder="选择区域" />
        </div>
        <div class="report-list flex-1 overflow-hidden flex border-[1px] border-[#E5E5E5] mt-[10px]">
            <div class="table-view h-full overflow-y-auto" style="flex:0.4">
                <SmartTable ref="smartTableRef" :api="apiConfig" :columns="columns" :responseConfig="responseConfig"
                    :pagination="paginationConfig" :paramsFormatter="paramsFormatter" :actionColumn="actionColumn"
                    @action="handleAction" @loadSuccess="handleLoadSuccess" @loadError="handleLoadError"
                    :immediateSearch="true" />
            </div>
            <div class="table-view h-full overflow-y-auto bg-[#F8FAFC]" style="flex:0.6">
                <div v-if="reportValue" v-html="reportValue" class="w-full h-full p-[20px] report-html-content"></div>
                <div v-else class="w-full h-full flex items-center justify-center">
                    <div class="text-[22px] text-[#666] font-[500]">报告预览区域</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRegionList } from '@/api/system/region';
import { getRiskAnalysisReport, deleteRiskAnalysisReport } from '@/api/warn/index';
import { RadioGroup, RadioButton, DatePicker, RangePicker, Button, TreeSelect, Modal, message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';

// 定义表格列配置类型，与smartTable组件中的定义保持一致
interface ColumnItem<T = any> {
    dataIndex: string;
    key?: string;
    title: string;
    width?: number | string;
    fixed?: 'left' | 'right';
    ellipsis?: boolean;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    filterable?: boolean;
    options?: any[];
    slot?: string;
    type?: 'tag' | 'switch' | 'radio' | 'checkbox' | 'badge' | 'rate' | 'progress' | 'date' | 'date-range' | 'image' | 'select';
    componentProps?: (value: any, record: T) => Record<string, any>;
    formatter?: (value: any, record: T) => string;
    render?: (value: any, record: T, index: number) => string;
}

const dateType = ref('year')
const pickerType = ref<'year' | 'quarter' | 'month' | 'week' | 'date' | 'time'>('year')
const dateValue = ref<Dayjs>(dayjs())
const dateRangeValue = ref<[Dayjs, Dayjs]>()
const dateTypes = [
    {
        value: 'year',
        label: '年度'
    },
    {
        value: 'quarter',
        label: '季度'
    },
    {
        value: 'month',
        label: '月度'
    },
    // {
    //     value:'week',
    //     label:'Maintainer度',
    // },
    {
        value: '',
        label: '自定义'
    }
]

// SmartTable配置
const smartTableRef = ref();

// API配置
const apiConfig = async (params: any) => {
    const { pageNum, pageSize, ...rest } = params;

    // 根据时间类型和选择的日期生成时间范围
    let timeRange;
    if (dateType.value === '') {
        // 自定义时间范围
        if (dateRangeValue.value) {
            timeRange = [
                dateRangeValue.value[0].format('YYYY-MM-DD HH:mm:ss'),
                dateRangeValue.value[1].format('YYYY-MM-DD HH:mm:ss')
            ];
        }
    } else {
        // 根据选择的时间类型生成时间范围
        if (dateValue.value) {
            switch (dateType.value) {
                case 'year':
                    timeRange = [
                        dayjs(dateValue.value).startOf('year').format('YYYY-MM-DD HH:mm:ss'),
                        dayjs(dateValue.value).endOf('year').format('YYYY-MM-DD HH:mm:ss')
                    ];
                    break;
                case 'quarter':
                    const quarter = Math.floor(dayjs(dateValue.value).month() / 3) + 1;
                    const startMonth = (quarter - 1) * 3;
                    const start = dayjs(dateValue.value).startOf('year').month(startMonth).startOf('month');
                    const end = start.add(2, 'months').endOf('month');
                    timeRange = [
                        start.format('YYYY-MM-DD HH:mm:ss'),
                        end.format('YYYY-MM-DD HH:mm:ss')
                    ];
                    break;
                case 'month':
                    timeRange = [
                        dayjs(dateValue.value).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                        dayjs(dateValue.value).endOf('month').format('YYYY-MM-DD HH:mm:ss')
                    ];
                    break;
                case 'week':
                    timeRange = [
                        dayjs(dateValue.value).startOf('week').format('YYYY-MM-DD HH:mm:ss'),
                        dayjs(dateValue.value).endOf('week').format('YYYY-MM-DD HH:mm:ss')
                    ];
                    break;
            }
        }
    }

    // 构建请求参数
    const requestParams: any = {
        page: pageNum,
        page_size: pageSize,
        ...rest,
        type: '单项研判'
    };

    if (timeRange) {
        requestParams.start_time = timeRange[0];
        requestParams.end_time = timeRange[1];
    }

    if (selectedRegionKey.value) {
        requestParams.region_id = selectedRegionKey.value;
    }

    const res: any = await getRiskAnalysisReport(requestParams);
    // 检查返回数据结构，根据实际API响应调整
    if (res && res.data) {
        return res.data;
    } else {
        // 如果API直接返回列表数据
        return res || { reports: [], total: 0 };
    }
};

// 响应配置
const responseConfig = {
    listKey: 'reports', // 假设后端返回的报告列表字段名为reports
    totalKey: 'total', // 假设后端返回的总数字段名为total
};

// 分页配置
const paginationConfig = {
    pageSize: 5,
    current: 1,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['5', '10', '20', '50', '100'],
    showTotal: (total: number) => `共 ${total} 条记录`,
};

// 参数格式化函数
const paramsFormatter = (params: any, pagination: any) => {
    const formattedParams: any = {
        ...params
    };

    if (pagination) {
        formattedParams.pageNum = pagination.current || 1;
        formattedParams.pageSize = pagination.pageSize || 10;
    }

    return formattedParams;
};
const columns: ColumnItem[] = [
    {
        title: '报告名称',
        dataIndex: 'report_name',
        key: 'report_name',
        width: '30%',
        ellipsis: true,
    },
    {
        title: '报告时间',
        dataIndex: 'report_time',
        key: 'report_time',
        width: '30%',
        formatter: (value: string) => {
            return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '--';
        }
    },
];
// 操作列配置
const actionColumn = {
    title: '操作',
    width: 150,
    fixed: 'right',
    actions: [
        {
            label: '删除',
            props: { type: 'link', size: 'small', danger: true },
            action: 'delete'
        },
        {
            label: '查看',
            props: { type: 'link', size: 'small' },
            action: 'view'
        },
        {
            label: '下载',
            props: { type: 'link', size: 'small' },
            action: 'download'
        },
    ]
}
// 操作列事件处理
const handleAction = (action: string, record: any, index: number) => {
    switch (action) {
        case 'delete':
            confirmDelete(record, index);
            break;
        case 'view':
            viewReport(record, index);
            break;
        case 'download':
            downloadReport(record);
            break;
    }
};

// 删除确认弹窗
const confirmDelete = (record: any, index: number) => {
    Modal.confirm({
        title: '确认删除',
        content: `确定要删除报告 "${record.report_name || record.title || record.id}" 吗？此操作不可恢复。`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
            try {
                await deleteRiskAnalysisReport(record.report_id || record.id);
                message.success('删除成功');
                // 重新加载数据
                smartTableRef.value?.refresh();
                if (reportIndex === index) reportValue.value = null;
            } catch (error) {
                console.error('删除失败:', error);
                message.error('删除失败');
            }
        }
    });
};

// 查看报告
let reportIndex = -1;
const viewReport = async (record: any, index: number) => {
    try {
        reportIndex = index;
        reportValue.value = record.message
    } catch (error) {
        console.error('获取报告内容失败:', error);
        message.error('获取报告内容失败');
    }
};

// 预处理HTML以适配Word格式
const preprocessHtmlForWord = (html) => {
    // 将CSS style中的width/height转换为HTML属性
    let processedHtml = html.replace(
        /<img([^>]+)style="[^"]*width:\s*(\d+)px[^"]*"/g,
        '<img$1width="$2" height="auto"'
    );

    // 确保所有图片都有width属性
    processedHtml = processedHtml.replace(
        /<img(?![^>]*width=)([^>]*)>/g,
        '<img$1 width="600" height="auto">'
    );

    return processedHtml;
};

// 下载报告
const downloadReport = async (record: any) => {
    try {
        if (!record.message) return message.error('报告内容为空');
        const processedHtml = preprocessHtmlForWord(record.message);
        // 构造完整的HTML结构，添加Word专用的样式
        const html = `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8">
                <style>
                    img { 
                    max-width: 600px !important; 
                    width: 600px !important; 
                    height: auto !important; 
                    display: block; 
                    margin: 10px 0; 
                    }
                    p { margin: 10px 0; }
                    table { border-collapse: collapse; width: 100%; }
                    td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
                </style>
                </head>
                <body>
                ${processedHtml}
                </body>
                </html>
            `;
        // 转换为Word文档并下载
        asBlob(html).then((res: Blob) => {
            saveAs(
                res,
                `${record.report_name}.${dayjs().format('YYYY-MM-DD HH:mm:ss')}.docx`,
            );
        });
    } catch (error) {

    }
};

const handleDateTypeChange = () => {
    if (dateType.value && ['year', 'quarter', 'month', 'week', 'date', 'time'].includes(dateType.value)) {
        pickerType.value = dateType.value as 'year' | 'quarter' | 'month' | 'week' | 'date' | 'time';
    }
    dateRangeValue.value = [];
    dateValue.value = null;
}
// 场所列表
const selectedRegionKey = ref<string | null>(null);
const regionOptions = ref([]);
const getReginSelect = async () => {
    getRegionList({
        include_hierarchy: true,
    }).then((res: any) => {
        regionOptions.value = res.data?.hierarchy || []
        regionOptions.value.unshift({ region_name: '全部区域', region_id: '' })
    });
};

// 报告内容
const reportValue = ref<string | null>(null);


// 事件处理
const handleLoadSuccess = (data: any[]) => {
    console.log('数据加载成功:', data);
};

const handleLoadError = (error: any) => {
    console.error('数据加载失败:', error);
    message.error('数据加载失败');
};
const handleSearch = () => {
    smartTableRef.value?.refresh();
};

onMounted(() => {
    getReginSelect();
});
</script>
<style>
.report-html-content {
    img {
        margin: 0 auto;
        max-width: 600px;
    }
}
</style>
