import type { RouteRecordRaw } from 'vue-router';

const childRoutes: RouteRecordRaw[] = [
   {
        path: '/dataCockpit',
        name: 'dataCockpit',
        // dataCockpit.vue
        component: () => import('@/views/riskManager/databoard-copy-new.vue'),
        meta: {
            title: '数据驾驶舱',
        },
    },
    {
        path: '/dataCockpit/copy',
        name: 'dataCockpitCopy',
        component: () => import('@/views/riskManager/databoard-copy-new.vue'),
        meta: {
            title: '数据驾驶舱',
        },
    },
    {

        path: '/warning-alarm/rules',
        name: 'warningAlarmRules',
        component: () => import('@/views/riskManager/rule-setting.vue'),
        meta: {
            title: '规则配置',
        }
    },
    {
        path: '/enterprise-portrait',
        name: 'enterprisePortrait',
        component: () => import('@/views/riskManager/enterprise-image.vue'),
        meta: {
            title: '企业画像',
        }
    },
    // 事故模拟知识库
    {
        path: '/accident/knowledgebase',
        name: 'asKnowledgeBase',
        component: () => import('@/views/riskManager/acsumilation-file.vue'),
        meta: {
            title: '事故模拟',
        }
    },
    
];

// 同级的页面
const topRoutes: RouteRecordRaw[] = [
     
];

export { childRoutes, topRoutes };