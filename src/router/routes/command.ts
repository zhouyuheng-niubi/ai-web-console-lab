import type { RouteRecordRaw } from 'vue-router';

const childRoutes: RouteRecordRaw[] = [
   {
        path: '/emergency-materials',
        name: 'emergencyMaterials',
        component: () => import('@/views/command/emer-goods.vue'),
        meta: {
            title: '应急物资',
        },
   },
   {
        path: '/emergency-group',
        name: 'emergencyGroup',
        component: () => import('@/views/command/emer-group.vue'),
        meta: {
            title: '应急小组',
        },
   },
   {
        path: '/emergency-expert',
        name: 'emergencyExpert',
        component: () => import('@/views/command/emer-expert.vue'),
        meta: {
            title: '应急专家',
        },
   },
   {
        path: '/emergency-institution',
        name: 'emergencyInstitution',
        component: () => import('@/views/command/emer-institution.vue'),
        meta: {
            title: '应急机构',
        },
   },
   {
        path: '/emergency-equipment',
        name: 'emergencyEquipment',
        component: () => import('@/views/command/emer-equip.vue'),
        meta: {
            title: '应急装备',
        },
   },

   {
        path: '/digital-plan',
        name: 'digitalPlan',
        component: () => import('@/views/command/digital-pro.vue'),
        meta: {
            title: '数字预案',
        },
   },
   {
        path: '/plan-category',
        name: 'planCategory',
        component: () => import('@/views/command/plan-category.vue'),
        meta: {
            title: '预案分类管理',
        },
   },
   {
        path: '/emergency-drill',
        name: 'emergencyDrill',
        component: () => import('@/views/command/emer-drill.vue'),
        meta: {
            title: '演练计划',
        },
   },
   {
        path: '/emergency-drill/records',
        name: 'emergencyDrillRecords',
        component: () => import('@/views/command/drill-record.vue'),
        meta: {
            title: '演练记录',
        },
   },
   {

        path: '/consequence-simulation',
        name: 'consequenceSimulation',
        component: () => import('@/views/command/consequence-simulation.vue'),
        meta: {
            title: '后果模拟',
        },
   },
   
];

// 同级的页面
const topRoutes: RouteRecordRaw[] = [
     
];

export { childRoutes, topRoutes };