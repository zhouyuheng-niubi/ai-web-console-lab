import type { RouteRecordRaw } from 'vue-router';

// 同级的页面
const topRoutes: RouteRecordRaw[] = [
    {
        path: '/mobile/ai-chat',
        component: () => import('@/views/chat.vue'),
        meta: {
            title: '智能问答',
        },
        name: 'AiMoBileChat',
    },
    // 隐患排查h5
    {
        path: '/mobile/hidden-danger',
        component: () => import('@/views/mobile-h5/hidden-danger/index.vue'),
        meta: {
            title: '隐患排查',
        },
        name: 'RiskCheck',
    },
    // 创建工单
    {
        path: '/mobile/hidden-danger/create',
        component: () => import('@/views/mobile-h5/hidden-danger/create.vue'),
        meta: {
            title: '创建工单',
        },
        name: 'CreateOrder',
    },
    // 查询中心
    {
        path: '/mobile/search-record',
        component: () => import('@/views/mobile-h5/search-record/index.vue'),
        meta: {
            title: '查询中心',
        },
        name: 'SearchRecord',
    },
    // 个人中心
    {
        path: '/mobile/person',
        component: () => import('@/views/mobile-h5/person/index.vue'),
        meta: {
            title: '个人中心',
        },
        name: 'Person',
    },
    // 团队管理
    {
        path: '/mobile/team-management',
        component: () => import('@/views/mobile-h5/team-management/index.vue'),
        meta: {
            title: '团队管理',
        },
        name: 'GroupManagement',
    },
    // 工单详情
    {
        path: '/mobile/hidden-danger/:id',
        component: () => import('@/views/mobile-h5/hidden-danger/info.vue'),
        meta: {
            title: '工单详情',
        },
        name: 'OrderDetail',
    }
];

export { topRoutes };