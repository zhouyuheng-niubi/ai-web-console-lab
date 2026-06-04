import type { RouteRecordRaw } from "vue-router";
const childRoutes: RouteRecordRaw[] = [
  {
    path: "/log-management",
    name: "logManagement",
    component: () => import("@/views/system/log.vue"),
    meta: {
      title: "日志管理",
    },
  },
  {
    path: "/role-management",
    name: "roleManagement",
    component: () => import("@/views/system/role.vue"),
    meta: {
      title: "角色管理",
    },
  },
  {
    path: "/menu-management",
    name: "menuManagement",
    component: () => import("@/views/system/menu.vue"),
    meta: {
      title: "菜单管理",
    },
  },
  {
    path: "/account-management",
    name: "accountManagement",
    component: () => import("@/views/system/account.vue"),
    meta: {
      title: "账户管理",
    },
  },
  {
    path: "/device-management/sensing",
    name: "sensingDeviceManagement",
    component: () => import("@/views/system/perdevice.vue"),
    meta: {
      title: "感知设备",
    },
  },
  {
    path: "/system/proEquipment",
    name: "systemProEquipment",
    component: () => import("@/views/system/proEquipment/index.vue"),
    meta: {
      title: "生产设备",
    },
  },
  {
    path: "/system/proEquipment/perceivedState",
    name: "systemProEquipmentPerceivedState",
    component: () => import("@/views/system/proEquipment/perceivedState.vue"),
    meta: {
      title: "状态感知",
    },
  },
  {
    path: "/system-message",
    name: "systemMessage",
    component: () => import("@/views/system/message.vue"),
    meta: {
      title: "系统消息",
    },
  },
  {
    path: "/system-alertConfig",
    name: "systemAlertConfig",
    component: () => import("@/views/system/alertConfig.vue"),
    meta: {
      title: "告警配置",
    },
  },
  {
    path: "/system-warningRecord",
    name: "systemWarningRecord",
    component: () => import("@/views/system/warningRecord.vue"),
    meta: {
      title: "预警记录",
    },
  },
  {
    path: "/system/model",
    name: "systemModel",
    component: () => import("@/views/system/modelSetting/index.vue"),
    meta: {
      title: "模型管理",
    },
  },
  {
    path: "/system/orgPers",
    name: "systemOrgPers",
    component: () => import("@/views/system/orgPers/index.vue"),
    meta: {
      title: "组织架构",
    },
  },
  {
    path: "/system/orgPers/position",
    name: "systemOrgPersPosition",
    component: () => import("@/views/system/orgPers/position.vue"),
    meta: {
      title: "岗位管理",
    },
  },
  {
    path: "/system/orgPers/job",
    name: "systemOrgPersJob",
    component: () => import("@/views/system/orgPers/job.vue"),
    meta: {
      title: "职位管理",
    },
  },
  {
    path: "/system/factory-map",
    name: "systemFactoryMap",
    component: () => import("@/views/system/factoryAreamap.vue"),
    meta: {
      title: "厂区图管理",
    },
  },
  // 系统企业信息
  {
      path:'/system/company-info',
      component:() => import('@/views/system/companyInfo.vue'),
      meta: {
          title: '系统企业信息',
      },
      name:'SystemCompanyInfo',
  },
  // 安全要素管理
  {
    path: "/system/safety-element",
    name: "SystemSafetyElement",
    component: () => import("@/views/system/safetyElement.vue"),
    meta: {
      title: "安全要素管理",
    },
  },


];
const topRoutes: RouteRecordRaw[] = [];
export { childRoutes, topRoutes };
