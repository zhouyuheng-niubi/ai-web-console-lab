import type { RouteRecordRaw } from 'vue-router';
import { childRoutes as riskChildRoutes, topRoutes as riskTopRoutes } from './riskManager';
import { childRoutes as safeProChildRoutes, topRoutes as safeProTopRoutes } from './safeProManager';
import { childRoutes as commadnChildRoutes, topRoutes as commadTopRoutes } from './command'
import { childRoutes as systemChildRoutes, topRoutes as systemTopRoutes } from './system'
import { topRoutes as mobileTopRoutes } from './mobile'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        // home.vue
        component: () => import('@/views/testHome.vue'),
        meta: {
            title: '安全生产风险管控智能化平台',
        },
        name: 'Home',
    },
    // {
    //     path: '/newHome',
    //     component: () => import('@/views/testHome.vue'),
    //     meta: {
    //         title: '登录',
    //     },
    //     name: 'newHome',
    // },
    {  path:'/main',
        component: () => import('@/layout/layout.vue'),
        children:[
            { 
                path: '/function-introduce',
                component: () => import('@/views/function-introduce/index.vue'),
                meta: {
                    title: '功能介绍',
                },
                name: 'FunctionIntroduce',
            },  
            {
                path: '/ai-chat',
                component: () => import('@/views/chat.vue'),
                meta: {
                    title: '智能问答',
                },
                name: 'AiChat',
            },
            {
            path: '/risk-analysis',
                component: () => import('@/views/analyze/index.vue'),
                meta: {
                    title: '风险分析',
                },
                name: 'RiskAnalysis', 
            },
            {
                path: '/comprehensive-analysis',
                component: () => import('@/views/comprehensive/index.vue'),
                meta: {
                    title: '综合分析',
                },
                name: 'ComprehensiveAnalysis', 
            },
            {
                path: '/danger-invest',
                component: () => import('@/views/dangerInvest/dangerInvest.vue'),
                meta: {
                    title: '隐患排查',
                },
                name: 'DangerInvest', 
            },
            {
                path: '/danger-invest-new',
                component: () => import('@/views/dangerInvest/dangerInvest-copy.vue'),
                meta: {
                    title: '隐患排查',
                },
                name: 'DangerInvestNew',
            },
            {
                path: '/hidden-danger/list',
                component: () => import('@/views/dangerInvest/list.vue'),
                meta: {
                    title: '隐患列表',
                },
                name: 'HiddenDangerList',
            },
            {
                path:'/aiInteligent',
                // databoard.vue
                component: () => import('@/views/aiInteligent/index.vue'),
                meta: {
                    title: '智能识别应用',
                },
                name: 'AiInteligent',
            },
            {
                path:'/aiInteligent/databoard',
                component: () => import('@/views/aiInteligent/databoard.vue'),
                meta: {
                    title: '智能识别应用',
                },
                name: 'AiInteligentboard',
            },
            {
                path: '/action-recognition',
                component: () => import('@/views/actionRecognit.vue'),
                meta: {
                    title: '智能识别',
                },
                name: 'ActionRecognit', 
            },
            {
                path:'/run-record',
                component: () => import('@/views/aiInteligent/runRecord.vue'),
                meta: {
                    title: '运行记录',
                },
                name: 'runRecord',
            },
            {
                path:'/video-analysis',
                component: () => import('@/views/videoRecognit.vue'),
                meta: {
                    title: '视频分析',
                },
                name: 'VideoAnalysis', 
            },
            {
                path:'/other-module',
                component: () => import('@/views/iframView.vue'),
                meta: {
                    title: '其他模块',
                },
                name:'OtherModule',
            },
            // 系统管理-区域管理
            {
                path:'/system/region',
                component:() => import('@/views/system/region.vue'),
                meta: {
                    title: '区域管理',
                },
                name:'Region',
            },
            // 系统管理-摄像头管理
            {
                path:'/system/cameras',
                component:() => import('@/views/system/camera.vue'),
                meta: {
                    title: '摄像头管理',
                },
                name:'Cameras',
            },

            // 危险因素
            {
                path:'/system/trigger',
                component:() => import('@/views/system/trigger.vue'),
                meta: {
                    title: '危险因素管理',
                },
                name:'Trigger',
            },
            // 告警记录列表
            {
                path:'/warn-list',
                component:() => import('@/views/warnList.vue'),
                meta: {
                    title: '告警记录',
                },
                name:'WarnList',
            },
            {
                path:'/capture-record',
                component: () => import('@/views/captureList.vue'),
                meta: {
                    title: '识别记录',
                },
                name:'CaptureRecord',
            },


            // 基础管理-部门管理
            {
                path:'/basic/depart',
                component:() => import('@/views/system/depart/index.vue'),
                meta: {
                    title: '部门管理',
                },
                name:'Depart',
            },
            // 基础管理-人员管理
            {
                path:'/basic/persons',
                component:() => import('@/views/system/personnel/index.vue'),
                meta: {
                    title: '人员管理',
                },
                name:'Persons',
            },
            // 缺省页
            // {
            //     path: '/common',
            //     component: () => import('@/views/common.vue'),
            //     meta: {
            //         title: '开发中...',
            //     },
            //     name: 'Common',
            // },
            ...riskChildRoutes,
            ...safeProChildRoutes,
            ...commadnChildRoutes,
            ...systemChildRoutes,
            // 404页面配置
            {
                path: '/:pathMatch(.*)*',
                component: () => import('@/views/NotFound.vue'),
                meta: {
                    title: '开发中...',
                },
                name: 'NotFound',
            },
            
        ]
    },
    {
        path: '/test-ai',
        component: () => import('@/components/chat/Chat-Ant-Ai.vue'),
        meta: {
            title: '功能介绍',
        },
        name: 'TestAi',
    },
    ...riskTopRoutes,
    ...safeProTopRoutes,
    ...commadTopRoutes,
    ...systemTopRoutes,
    ...mobileTopRoutes,
]
export { routes };