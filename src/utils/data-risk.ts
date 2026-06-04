import { ref } from "vue";

// 风险处置动态数据
export const leftTotalArr = [
  {
    name: "已闭环",
    num: 120,
  },
  {
    name: "整改中",
    num: 30,
  },
  {
    name: "待指派",
    num: 2,
  },
  {
    name: "已超时",
    num: 10,
  },
  {
    name: "未开始",
    num: 2,
  },
];

// 报警数量统计数据
export const alarmArr = [
  {
    name: "告警误报率",
    value: 3,
    unit: "%",
    icon: "",
    color: "#FF4757",
  },
  {
    name: "处置及时率",
    value: 80,
    unit: "%",
    icon: "",
    color: "#08BC8F",
  },
  {
    name: "告警闭环率",
    value: 70,
    unit: "%",
    icon: "",
    color: "#08BC8F",
  },
  {
    name: "系统响应率",
    value: 99,
    unit: "%",
    icon: "",
    color: "#08BC8F",
  },
  {
    name: "高风险占比",
    value: 20,
    unit: "%",
    icon: "",
    color: "#FF4757",
  },
  {
    name: "班前会召开率",
    value: 80,
    unit: "%",
    icon: "",
    color: "#08BC8F",
  },
  {
    name: "平均处置期",
    value: 1,
    unit: "天",
    icon: "",
    color: "#08BC8F",
  },
];

// 实验室相关数据
export const cardsData = [
  {
    title: "实验室1",
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: "96.89%",
  },
  {
    title: "实验室2",
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: "96.89%",
  },
  {
    title: "实验室3",
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: "96.89%",
  },
  {
    title: "实验室4",
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: "96.89%",
  },
  {
    title: "实验室5",
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: "96.89%",
  },
  {
    title: "实验室6",
    annualConsumption: 436,
    annualSupply: 450,
    completionRate: "96.89%",
  },
];

// 特殊作业票数据
export const workPlanList = [
  {
    jobNumber: "DH-15548",
    jobType: "动火",
    jobArea: "会锅炉车间",
    jobStatus: "作业中",
    jobDuration: "5.3(小时)",
    riskLevel: "一级动火",
  },
  {
    jobNumber: "DH-15549",
    jobType: "受限空间",
    jobArea: "锅炉车间",
    jobStatus: "待开始",
    jobDuration: "3.2(小时)",
    riskLevel: "二级受限空间",
  },
  {
    jobNumber: "DH-15550",
    jobType: "高处作业",
    jobArea: "锅炉车间",
    jobStatus: "作业中",
    jobDuration: "4.5(小时)",
    riskLevel: "一级高处作业",
  },
  {
    jobNumber: "DH-15551",
    jobType: "动火",
    jobArea: "会锅炉车间",
    jobStatus: "作业中",
    jobDuration: "5.3(小时)",
    riskLevel: "一级动火",
  },
];

// 班前会记录数据
export const meettingRecord = [
  {
    createTime: "12-15",
    workType: "早班",
    openTxt: "已召开",
    finished: "完整",
    comfirmed: "已确认",
    feedback: "3条",
  },
  {
    createTime: "11-22",
    workType: "中班",
    openTxt: "已召开",
    finished: "部分缺失",
    comfirmed: "已确认",
    feedback: "1条",
  },
  {
    createTime: "11-18",
    workType: "晚班",
    openTxt: "延迟召开",
    finished: "完整",
    comfirmed: "未确认",
    feedback: "2条",
  },
  {
    createTime: "11-16",
    workType: "早班",
    openTxt: "已召开",
    finished: "完整",
    comfirmed: "已确认",
    feedback: "无",
  },
  {
    createTime: "11-14",
    workType: "中班",
    openTxt: "未召开",
    finished: "-",
    comfirmed: "-",
    feedback: "-",
  },
];

// 告警通知列表数据
export const alarmNotifications = [
  {
    text: "你有一条动火作业票待办，票号:DH202510190000001请尽快登录系统进行处理。",
    time: "2025-12-05 14:30",
    type: "紧急",
  },
  {
    text: "xx 的隐患信息已经逾期,整改期限时间为: 2025-08-07 19:52:58,请先进行延期申请再进行隐患排查整改!",
    time: "2025-12-05 14:25",
    type: "紧急",
  },
  {
    text: "你有一条动火作业票待办，票号:DH202510190000001请尽快登录系统进行处理。",
    time: "2025-12-05 14:20",
    type: "一般",
  },
  {
    text: "xx 的隐患信息已经逾期,整改期限时间为: 2025-08-07 19:52:58,请先进行延期申请再进行隐患排查整改!",
    time: "2025-12-05 14:15",
    type: "一般",
  },
  {
    text: "高处作业许可证即将到期，请及时续签以确保作业安全。",
    time: "2025-12-05 14:10",
    type: "紧急",
  },
  {
    text: "电气设备巡检发现异常，请立即安排专业人员进行检修。",
    time: "2025-12-05 14:05",
    type: "紧急",
  },
  {
    text: "危险化学品存储区域温湿度超出安全范围，请及时调整环境参数。",
    time: "2025-12-05 14:00",
    type: "一般",
  },
  {
    text: "新员工安全培训已完成，请为其分配相应岗位权限。",
    time: "2025-12-05 13:55",
    type: "一般",
  },
  {
    text: "应急演练计划已发布，请各部门按时组织参与。",
    time: "2025-12-05 13:50",
    type: "一般",
  },
  {
    text: "安全防护用品库存不足，请及时采购补充。",
    time: "2025-12-05 13:45",
    type: "紧急",
  },
  {
    text: "特种设备年检日期临近，请提前准备相关资料。",
    time: "2025-12-05 13:40",
    type: "一般",
  },
  {
    text: "职业健康体检报告已出，请关注员工健康状况。",
    time: "2025-12-05 13:35",
    type: "一般",
  },
  {
    text: "生产车间可燃气体浓度超标报警，请立即启动应急预案。",
    time: "2025-12-05 13:30",
    type: "紧急",
  },
  {
    text: "压力容器温度异常升高，已触发安全联锁保护机制。",
    time: "2025-12-05 13:25",
    type: "紧急",
  },
  {
    text: "消防水泵故障报警，主泵无法正常启动，请立即检查。",
    time: "2025-12-05 13:20",
    type: "紧急",
  },
  {
    text: "配电室烟雾探测器报警，请派人现场确认情况。",
    time: "2025-12-05 13:15",
    type: "紧急",
  },
  {
    text: "危险作业视频监控中断，可能影响安全监管。",
    time: "2025-12-05 13:10",
    type: "一般",
  },
  {
    text: "安全门禁系统异常开启，请核查是否有未授权人员进入。",
    time: "2025-12-05 13:05",
    type: "紧急",
  },
  {
    text: "有毒气体泄漏监测报警，请相关区域人员立即撤离。",
    time: "2025-12-05 13:00",
    type: "紧急",
  },
  {
    text: "重大危险源监测数据异常，已超出预设安全阈值。",
    time: "2025-12-05 12:55",
    type: "紧急",
  },
];

// 阈值规则数据
export const thresholdRules = [
  {
    rule_id: "rule001",
    rule_name: "温度异常监控",
    threshold_value: 80,
    threshold_range: "0-100°C",
    alert_level: "high",
    description: "当设备温度超过80度时触发告警，防止设备过热损坏",
    unit: "°C",
  },
  {
    rule_id: "rule002",
    rule_name: "压力异常监控",
    threshold_value: 150,
    threshold_range: "0-200psi",
    alert_level: "critical",
    description: "当管道压力超过150psi时触发紧急告警，防止安全事故",
    unit: "psi",
  },
  {
    rule_id: "rule003",
    rule_name: "流量监控规则",
    threshold_value: 1000,
    threshold_range: "0-5000L/min",
    alert_level: "medium",
    description: "当流量超过1000L/min时触发告警，监控生产流程异常",
    unit: "L/min",
  },
  {
    rule_id: "rule004",
    rule_name: "振动频率监控",
    threshold_value: 50,
    threshold_range: "0-100Hz",
    alert_level: "low",
    description: "当设备振动频率超过50Hz时提醒维护，预防设备故障",
    unit: "Hz",
  },
  {
    rule_id: "rule005",
    rule_name: "电流异常监控",
    threshold_value: 100,
    threshold_range: "0-200A",
    alert_level: "high",
    description: "当电流超过100A时触发告警，防止电路过载",
    unit: "A",
  },
  {
    rule_id: "rule006",
    rule_name: "氧气浓度监控",
    threshold_value: 19.5,
    threshold_range: "0-21%",
    alert_level: "critical",
    description: "当氧气浓度低于19.5%时触发紧急告警，防止缺氧事故",
    unit: "%",
  },
  {
    rule_id: "rule007",
    rule_name: "氢气浓度监控",
    threshold_value: 4.0,
    threshold_range: "0-4%",
    alert_level: "critical",
    description: "当氢气浓度超过4.0%时触发紧急告警，防止爆炸事故",
    unit: "%",
  },
  {
    rule_id: "rule008",
    rule_name: "氨气浓度监控",
    threshold_value: 25,
    threshold_range: "0-50ppm",
    alert_level: "high",
    description: "当氨气浓度超过25ppm时触发告警，防止中毒事故",
    unit: "ppm",
  },
  {
    rule_id: "rule009",
    rule_name: "甲烷浓度监控",
    threshold_value: 5.0,
    threshold_range: "0-5%",
    alert_level: "critical",
    description: "当甲烷浓度超过5.0%时触发紧急告警，防止爆炸事故",
    unit: "%",
  },
  {
    rule_id: "rule010",
    rule_name: "二氧化碳浓度监控",
    threshold_value: 5000,
    threshold_range: "0-10000ppm",
    alert_level: "medium",
    description: "当二氧化碳浓度超过5000ppm时触发告警，防止健康危害",
    unit: "ppm",
  },
];

// 区域选项数据
export const regionOptions = [
  { label: "全部区域", value: "" },
  { label: "生产车间", value: "生产车间" },
  { label: "仓储区域", value: "仓储区域" },
  { label: "办公区域", value: "办公区域" },
];

// 风险来源总体占比数据
export const totalData = {
  categories: ["人的不安全行为", "物的不安全状态", "管理因素"],
  values: [55, 35, 10],
  colors: ["#1688EA", "#37CEEA", "#877AEB"], // 匹配柱状图渐变主色
};

// 人/物/管理不安全因素TOP5数据
export const topData = {
  xAxisData: ["top1", "top2", "top3", "top4", "top5"],
  // 人的不安全行为TOP5数值
  humanValues: [128, 118, 40, 26, 13],
  // 物的不安全状态TOP5数值
  objectValues: [42, 28, 17, 13, 3],
  // 管理因素TOP5数值
  managementValues: [10, 20, 30, 40, 50],
};

// 风险来源详细数据
export const riskSourceDetails = {
  human: ["未戴安全帽", "未穿工作服", "闯入禁区", "吸烟", "滞留"],
  object: ["设备未关闭", "消防缺失", "管道泄漏", "防护缺失", "物品遗留"],
  management: ["管理不善", "制度缺失", "培训不足", "监督不到位", "沟通不畅"],
};

// 区域风险对比数据
export const regionComparisonData = ref([
  {
    region: "研发管理区",
    alarmTotal: Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 100) + 50
    ),
    riskLevel: "高风险",
    processTime: Array.from({ length: 12 }, () =>
      parseFloat((Math.random() * 5).toFixed(1))
    ),
  },
  {
    region: "生产试验区",
    alarmTotal: Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 100) + 30
    ),
    riskLevel: "中风险",
    processTime: Array.from({ length: 12 }, () =>
      parseFloat((Math.random() * 4).toFixed(1))
    ),
  },
  {
    region: "物资仓库管理区",
    alarmTotal: Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 100) + 20
    ),
    riskLevel: "低风险",
    processTime: Array.from({ length: 12 }, () =>
      parseFloat((Math.random() * 3).toFixed(1))
    ),
  },
  {
    region: "科研实验区",
    alarmTotal: Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 100) + 40
    ),
    riskLevel: "中风险",
    processTime: Array.from({ length: 12 }, () =>
      parseFloat((Math.random() * 4).toFixed(1))
    ),
  },
  {
    region: "行政管理区",
    alarmTotal: Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 100) + 10
    ),
    riskLevel: "低风险",
    processTime: Array.from({ length: 12 }, () =>
      parseFloat((Math.random() * 2).toFixed(1))
    ),
  },
  {
    region: "分析检测区",
    alarmTotal: Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 100) + 60
    ),
    riskLevel: "中风险",
    processTime: Array.from({ length: 12 }, () =>
      parseFloat((Math.random() * 3.5).toFixed(1))
    ),
  },
]);
// 格式化数值函数
export const formatToFixed = (val) => {
  if (val === "--" || val === null || val === undefined) return "--";
  return parseInt(val);
};

// 获取风险等级样式类
export const getRiskLevelClass = (level) => {
  switch (level) {
    case "高风险":
      return "text-red-500";
    case "中风险":
      return "text-orange-400";
    case "低风险":
      return "text-green-500";
    default:
      return "text-cyan-400";
  }
};

// 区域报警数
export const regionAlarmCount = [
  {
    name: "行政管理区",
    value: 200,
  },
  {
    name: "研发管理区",
    value: 100,
  },
  {
    name: "物资仓库管理区",
    value: 500,
  },
  {
    name: "分析检测区",
    value: 150,
  },
  {
    name: "科研实验区",
    value: 800,
  },
  {
    name: "生产试验区",
    value: 400,
  },
];

export const regionNames = ['研发管理区', '生产试验区', '科研实验区', '物资仓库管理区', '分析检测区', '行政管理区'];


export const warnRuleSetting = [
    {
      rule_id: 'rule001',
      rule_name: '温度异常',
      threshold_value: 80,
      threshold_range: '0-100°C',
      alert_level: 'high',
      description: '当设备温度超过80度时触发告警，防止设备过热损坏',
      unit: '°C'
    },
    {
      rule_id: 'rule002',
      rule_name: '压力异常',
      threshold_value: 150,
      threshold_range: '0-200psi',
      alert_level: 'critical',
      description: '当管道压力超过150psi时触发紧急告警，防止安全事故',
      unit: 'psi'
    },
    {
      rule_id: 'rule003',
      rule_name: '流量监控规则',
      threshold_value: 1000,
      threshold_range: '0-5000L/min',
      alert_level: 'medium',
      description: '当流量超过1000L/min时触发告警，监控生产流程异常',
      unit: 'L/min'
    },
    {
      rule_id: 'rule004',
      rule_name: '振动频率',
      threshold_value: 50,
      threshold_range: '0-100Hz',
      alert_level: 'low',
      description: '当设备振动频率超过50Hz时提醒维护，预防设备故障',
      unit: 'Hz'
    },
    {
      rule_id: 'rule005',
      rule_name: '电流异常',
      threshold_value: 100,
      threshold_range: '0-200A',
      alert_level: 'high',
      description: '当电流超过100A时触发告警，防止电路过载',
      unit: 'A'
    },
    {
      rule_id: 'rule006',
      rule_name: '氧气浓度',
      threshold_value: 19.5,
      threshold_range: '0-21%',
      alert_level: 'critical',
      description: '当氧气浓度低于19.5%时触发紧急告警，防止缺氧事故',
      unit: '%'
    },
    {
      rule_id: 'rule007',
      rule_name: '氢气浓度',
      threshold_value: 4.0,
      threshold_range: '0-4%',
      alert_level: 'critical',
      description: '当氢气浓度超过4.0%时触发紧急告警，防止爆炸事故',
      unit: '%'
    },
    {
      rule_id: 'rule008',
      rule_name: '氨气浓度',
      threshold_value: 25,
      threshold_range: '0-50ppm',
      alert_level: 'high',
      description: '当氨气浓度超过25ppm时触发告警，防止中毒事故',
      unit: 'ppm'
    },
    {
      rule_id: 'rule009',
      rule_name: '甲烷浓度',
      threshold_value: 5.0,
      threshold_range: '0-5%',
      alert_level: 'critical',
      description: '当甲烷浓度超过5.0%时触发紧急告警，防止爆炸事故',
      unit: '%'
    },
    {
      rule_id: 'rule010',
      rule_name: '二氧化碳浓度',
      threshold_value: 5000,
      threshold_range: '0-10000ppm',
      alert_level: 'medium',
      description: '当二氧化碳浓度超过5000ppm时触发告警，防止健康危害',
      unit: 'ppm'
    }
  ]