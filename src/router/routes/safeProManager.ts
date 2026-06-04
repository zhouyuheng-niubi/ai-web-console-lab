import type { RouteRecordRaw } from "vue-router";

const childRoutes: RouteRecordRaw[] = [
  {
    path: "/hidden-danger",
    name: "hiddenDanger",
    component: () => import("@/views/safeProManager/invest-hidedanger.vue"),
    meta: {
      title: "隐患排查治理",
    },
  },
  {
    path: "/risk-grading-control",
    name: "riskGradingControl",
    component: () => import("@/views/safeProManager/risk-control.vue"),
    meta: {
      title: "风险分级管控",
    },
  },
  {
    path: "/edu-training/plans",
    name: "trainingPlan",
    component: () =>
      import("@/views/safeProManager/eduTraining/plan-manager.vue"),
    meta: {
      title: "培训计划",
    },
  },
  {
    path: "/edu-training/materials",
    name: "trainingMaterial",
    component: () =>
      import("@/views/safeProManager/eduTraining/course-ware.vue"),
    meta: {
      title: "培训资料",
    },
  },
  {
    path: "/edu-training/courses",
    name: "trainingCourse",
    component: () =>
      import("@/views/safeProManager/eduTraining/course-detail.vue"),
    meta: {
      title: "课程管理",
    },
  },
  {
    path: "/edu-training/questions",
    name: "trainingQuestion",
    component: () =>
      import("@/views/safeProManager/eduTraining/exam-management.vue"),
    meta: {
      title: "题库管理",
    },
  },
  {
    path: "/edu-training/archives",
    name: "trainingArchive",
    component: () =>
      import("@/views/safeProManager/eduTraining/knowledge-base.vue"),
    meta: {
      title: "培训档案",
    },
  },
  {
    path: "/special-operations",
    name: "specialOperations",
    component: () => import("@/views/safeProManager/dowork.vue"),
    meta: {
      title: "特殊作业",
    },
  },
  {
    path: "/certificate-management",
    name: "certificateManagement",
    component: () => import("@/views/safeProManager/certificate.vue"),
    meta: {
      title: "证书管理",
    },
  },
  {
    path: "/responsibility-list",
    name: "responsibilityList",
    component: () => import("@/views/safeProManager/response-list.vue"),
    meta: {
      title: "责任清单",
    },
  },
  {
    path: "/fourteen-elements",
    component: () => import("@/views/safeProManager/safeElements.vue"),
    meta: {
      title: "安全管理体系要素",
    },
    name: "SafeElements",
  },
  {
    path: "/equipment-lifecycle-management",
    component: () => import("@/views/safeProManager/equipmentLifecycle.vue"),
    meta: {
      title: "设备全生命Maintainer期",
    },
    name: "EquipmentLifecycle",
  },
  {
    path: "/shift-meeting",
    component: () => import("@/views/safeProManager/shiftMeeting.vue"),
    meta: {
      title: "班前会系统",
    },
    name: "ShiftMeeting",
  },
    {
    path: "/meeting-management",
    component: () => import("@/views/safeProManager/meetingManagement.vue"),
    meta: {
      title: "会议管理",
    },
    name: "MeetingManagement",
  },
    {
    path: "/person-information",
    component: () => import("@/views/safeProManager/personManager/personnelInfo.vue"),
    meta: {
      title: "人员信息",
    },
    name: "PersonInformation",
  },
  {
    path: "/face-recognition-library",
    component: () => import("@/views/safeProManager/personManager/faceRecognition.vue"),
    meta: {
      title: "人脸识别库",
    },
    name: "FaceRecognitionLibrary",
  },
    {
    path: "/team-management",
    component: () => import("@/views/safeProManager/personManager/teamManagement.vue"),
    meta: {
      title: "班组管理",
    },
    name: "TeamManagement",
  },
    {
    path: "/group-certificate",
    component: () => import("@/views/safeProManager/certificateManagement.vue"),
    meta: {
      title: "证书管理",
    },
    name: "CertificateManagement",
  },
     {
    path: "/training-material",
    component: () => import("@/views/safeProManager/library/trainingMaterial.vue"),
    meta: {
      title: "培训资料",
    },
    name: "TrainingMaterial",
  },
     {
    path: "/accident-case",
    component: () => import("@/views/safeProManager/library/accidentCase.vue"),
    meta: {
      title: "事故案例",
    },
    name: "AccidentCase",
  },
    {
    path: "/ta<REDACTED_CREDENTIAL>",
    component: () => import("@/views/safeProManager/taskMonitoring/taskAssignment.vue"),
    meta: {
      title: "任务分配中心",
    },
    name: "taskAssignment",
  },
    {
    path: "/behavior-monitoring-center",
    component: () => import("@/views/safeProManager/taskMonitoring/behaviorMonitor.vue"),
    meta: {
      title: "行为监控中心",
    },
    name: "BehaviorMonitor",
  },
   {
    path: "/course-management",
    component: () => import("@/views/safeProManager/courseManager/courseManagement.vue"),
    meta: {
      title: "课程管理",
    },
    name: "CourseManagement",
  },
   {
    path: "/exame-management",
    component: () => import("@/views/safeProManager/examManager/index.vue"),
    meta: {
      title: "考试管理",
    },
    name: "ExameManagement",
  },
   {
    path: "/grading-management",
    component: () => import("@/views/safeProManager/examManager/gradingManagement.vue"),
    meta: {
      title: "阅卷管理",
    },
    name: "GradingManagement",
  },
  
     {
    path: "/questionBank-management",
    component: () => import("@/views/safeProManager/questionManage/questionBank.vue"),
    meta: {
      title: "题库管理",
    },
    name: "QuestionBankManagement",
  },
   {
    path: "/question-management",
    component: () => import("@/views/safeProManager/questionManage/questionManagement.vue"),
    meta: {
      title: "试题管理",
    },
    name: "QuestionManagement",
  },
  
   {
    path: "/approval",
    component: () => import("@/views/safeProManager/approval.vue"),
    meta: {
      title: "我的审批",
    },
    name: "Approval",
  },
  
  {
    path: "/integrated-machine",
    component: () => import("@/views/safeProManager/integratedMachine.vue"),
    meta: {
      title: "一体机",
    },
    name: "IntegratedMachine",
  },

  {
    path: "/monitoring-point-analysis",
    name: "monitorPoint",
    component: () => import("@/views/safeProManager/monitor-point/visual.vue"),
    meta: {
      title: "监控点管理",
    },
  },
  {
    path: "/monitoring-point-rules",
    name: "monitorRuleConfig",
    component: () => import("@/views/safeProManager/monitor-point/rule.vue"),
    meta: {
      title: "监测规则配置",
    },
  },
];

// 同级的页面
const topRoutes: RouteRecordRaw[] = [
  {
    path: "/all-in-one",
    component: () => import("@/views/safeProManager/all-in-one/index.vue"),
    meta: {
      title: "一体机显示页",
    },
    name: "All-In-One",
  },
  {
    path: "/all-in-one/scan",
    component: () => import("@/views/safeProManager/all-in-one/scan.vue"),
    meta: {
      title: "一体机识别",
    },
    name: "All-In-OneScan",
  },
  {
    path: "/all-in-one/result",
    component: () => import("@/views/safeProManager/all-in-one/result.vue"),
    meta: {
      title: "一体机识别结果",
    },
    name: "All-In-OneResult",
  },
];

export { childRoutes, topRoutes };
