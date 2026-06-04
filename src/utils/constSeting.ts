import { getModelTypeList } from "@/api/warn/index";
// 动态类型
export const getAllTypeList = async () => {
  const res = await getModelTypeList();
  const Array = [];
  if (!res?.data) return [];
  for (const key in res?.data) {
    const item = res?.data[key];
    Array.push({
      ...item,
      key,
      value: key,
      label: item.name,
      detection_engine: item.detection_engine,
    });
  }
  return Array;
};

export const triggerCategory = [
  { value: "设备因素", label: "设备因素" },
  { value: "环境因素", label: "环境因素" },
  { value: "人为因素", label: "人为因素" },
  { value: "管理因素", label: "管理因素" },
];

export const riskLevel = [
  { value: "1", label: "极低", color: "success" },
  { value: "2", label: "低", color: "default" },
  { value: "3", label: "中", color: "processing" },
  { value: "4", label: "高", color: "warning" },
  { value: "5", label: "极高", color: "error" },
];

export const baseStatus = [
  { value: "1", label: "启用", color: "success" },
  { value: "0", label: "禁用", color: "red" },
];

export const cameraTypes = [
  { value: "固定式摄像头", label: "固定式摄像头" },
  { value: "移动式摄像头", label: "移动式摄像头" },
];

export const modelOrigin = [
  { value: "EDGE_BOX", label: "边缘计算" },
  { value: "YOLO", label: "大模型" },
];

export const modelDes = {
  safety_helmet: [
    "适用于工地、工厂场景下未佩戴安全帽检测",
    "支持红色、黄色、蓝色、白色安全帽检测",
    "画面需可分辨头部及安全帽特征",
    "人员头部及安全帽目标不小于画面大小5%",
    "识别距离小于15m最佳（200万@6mm）",
  ],
  work_clothes: [
    "适用于工地、工厂未穿工服检测",
    "需配置工服底库并载入底库",
    "底库需具备不同距离、姿态、光线多样性",
    "画面可分辨人员及工服特征",
    "人员及工服目标不小于画面大小5%",
    "识别距离小于20m最佳（200万@6mm）",
  ],
  intrusion: [
    "适用于违禁、危险区域人员入侵检测",
    "入侵区域为多边形，可标记多个多边形区域",
    "人员目标不小于画面大小5%",
    "识别距离小于20m最佳（200万@6mm）",
    "人体脚部中心点进入入侵区域告警（默认）（判断点可选人体中心点或人体双脚中心点）",
  ],
  counting: [
    "适用于园区、商场场景下人员计数与流量统计",
    "需标记虚拟直线，并确定人员跨线的方向",
    "人员目标不小于画面大小5%",
    "识别距离小于20m最佳（200万@6mm）",
    "建议检测频率：不低于2次/秒",
  ],
  absenteeism: [
    "需标记岗位区域",
    "岗位区域为多边形，可标记多个区域",
    "可设置人员密度（默认0），小于等于人员密度产生告警",
    "可设置离岗持续时间（默认300秒），超出离岗时间产生告警",
    "画面清晰，可辨别人员特征",
    "人员目标不小于画面大小5%",
    "识别距离小于15m最佳（200万@6mm）",
    "人体检测框中心点（默认）是否离位，并持续特定时间（判断点可选择人体中心点或人体双脚中心点）",
  ],
  duty_detection: [
    "适用于办公室、值班室场景睡觉行为检测",
    "画面清晰，可辨别人员特征",
    "人员目标不小于画面大小5%",
    "识别距离小于15m最佳（200万@6mm）",
    "敏感度值越小，检测越灵敏",
  ],
  fire_detection: [
    "适用于园区、仓库、商场场景下明火检测",
    "支持红色火焰识别",
    "画面清晰，可辨别火焰特征",
    "火焰目标不小于画面大小10%",
    "识别距离小于15m最佳（200万@6mm）",
    "汽车灯光等类火焰目标可能产生误报",
  ],
  smoke_detection: [
    "适用于园区、仓库、商场场景下烟雾检测",
    "支持大面积的白色或黑色浓烟识别",
    "画面清晰，可辨别烟雾特征",
    "烟雾目标不小于画面大小10%",
    "识别距离小于20m最佳（200万@6mm）",
    "白云、团雾等类烟雾目标可能产生误报",
  ],
  loitering_detection: [
    "适用于工厂、园区、银行场景下人员徘徊检测",
    "可设定多边形检测区域",
    "画面清晰，可辨别人员特征",
    "人员目标不小于画面大小5%",
    "识别距离小于20m最佳（200万@6mm）",
    " 敏感度值越大，检测越灵敏",
    " 建议检测频率：不低于2次/秒",
  ],
  vehicle_type_recognition: [
    "适用于停车场所、交通场景下车辆类型识别",
    "支持小轿车、货车、公交车检测",
    "画面清晰，可辨别车型特征",
    "车辆目标不小于画面大小5%",
    "识别距离小于30m最佳（200万@6mm）",
  ],
  car_illegal_parking: [
    //小汽车违停
    "适用于园区、街道场景小汽车违停识别",
    "支持小汽车识别",
    "需标记违停区域，并可设置多个违停区域",
    "画面清晰，可辨别小汽车",
    "小汽车目标不小于画面大小5%",
    "识别距离小于30m最佳（200万@6mm）",
    "敏感度值越小，检测越灵敏",
  ],
  vehicle_illegal_parking: [
    //车辆违停
    "适用于园区、街道场景车辆违停识别",
    "支持轿车、卡车、公交车识别",
    "需标记违停区域，并可设置多个违停区域",
    "画面清晰，可辨别车辆",
    "车辆目标不小于画面大小5%",
    "识别距离小于30m最佳（200万@6mm）",
    "敏感度值越小，检测越灵敏",
  ],
  non_motor_illegal_parking: [
    //非机动车违停
    "适用于园区、街道场景非机动车违停检测",
    "需标记违停区域，并可设置多个违停区域",
    "画面清晰，可辨别非机动车车",
    "非机动车目标不小于画面大小5%",
    "识别距离小于30m最佳（200万@6mm）",
    "敏感度值越小，检测越灵敏",
  ],
  ebike_in_elevator: [
    //电瓶车进电梯检测
    "适用于小区等场景电瓶车闯入电梯检测",
    "电瓶车清晰可见",
    "可标记多个检测区域",
    "电瓶车区域目标不小于画面大小5%",
    "识别距离小于10m最佳（200万@6mm）",
  ],

  license_plate_recognition: [
    "适用于园区、停车场近距离场景车牌识别",
    "支持单层蓝牌、黄牌、绿牌车牌号识别",
    "画面可分辨车牌特征",
    "车牌目标不小于画面大小5%",
    "识别距离小于10m最佳（200万@6mm）",
  ],
  fall_detection: [
    "适用于校园、医院、工厂场景下人员跌倒检测",
    "画面清晰，可辨别人体，支持完全躺地跌倒检测",
    "人员目标不小于画面大小5%",
    "识别距离小于15m最佳（200万@6mm）",
  ],
  fatigue_detection: [
    //疲劳检测
    "适用于驾驶室疲劳检测",
    "画面可分辨人员及眼部特征",
    "人员及眼部目标不小于画面大小5%",
    "识别距离小于2m最佳（200万@6mm）",
  ],
  fight_detection: [
    //打架检测
    "适用于打架检测",
    "画面需可分辨人员特征",
    "人员目标不小于画面大小5%",
    "识别距离小于15m最佳（200万@6mm）",
  ],
  no_gloves: [
    //未戴手套检测
    "适用于工地、工厂未佩戴防护手套检测",
    "需配置PPE底库并载入底库",
    "底库需具备不同距离、姿态、光线多样性",
    "画面可分分辨人员、手部及手套特征",
    "识别距离小于10m最佳（200万@6mm）",
  ],
  no_goggles: [
    //未佩戴护目镜检测
    "适用于工地、工厂未佩戴护目镜检测",
    "需配置PPE底库并载入底库",
    "底库需具备不同距离、姿态、光线多样性",
    "画面可分辨人员及眼部区域特征",
    "护目镜不小于画面大小10%",
    "识别距离小于10m最佳（200万@6mm）",
  ],
  no_head_protection: [
    // 未佩戴头部防护检测
    "适用于工地、工厂人员未佩戴头部防护检测",
    "需配置PPE底库并载入底库",
    "底库需具备不同距离、姿态、光线多样性",
    "画面可分辨人员及头部区域特征",
    "头部不小于画面大小10%",
    "识别距离小于10m最佳（200万@6mm）",
  ],
  no_face_protection: [
    //未佩戴面部防护检测
    "适用于未佩戴面部防护装备的检测",
    "画面可分辨人员及面部特征",
    "人员及面部目标不小于画面大小5%",
    "识别距离小于2m最佳（200万@6mm）",
  ],
  no_life_jacket: [
    // 未穿救生衣检测
    "适用于工地、工厂未穿救生衣检测",
    "需配置PPE底库并载入底库",
    "底库需具备不同距离、姿态、光线多样性",
    "画面可分分辨人员、躯干特征",
    "识别距离小于10m最佳（200万@6mm）",
  ],
  on_duty_detection: [
    // 值岗检测
    "适用于校园、工厂、工地场景人员值岗检测",
    "画面清晰，可辨别人员特征",
    "可设置多边形检测区域",
    "人员目标不小于画面大小5%",
    "识别距离小于20m最佳（200万@6mm）",
  ],
  phone_call: [
    // 使用手机检测
    "适用于加油站、化工厂、违禁区域使用手机检测",
    "画面清晰，可辨别人体、手部以及手机特征",
    "手机目标不小于画面大小5%",
    "识别距离小于10m最佳（200万@6mm）",
  ],
  no_reflective_vest: [
    // 未穿反光衣检测
    "适用于工地场景下未穿反光衣检测",
    "支持橙色、荧光黄反光衣检测",
    "画面需可分辨人员及反光衣特征",
    "反光衣目标不小于画面大小5%",
    "识别距离小于20m最佳（200万@6mm）",
  ],
  no_safety_shoes: [
    // 未穿防护鞋检测
    "适用于工地、工厂未佩戴防护鞋检测",
    "需配置PPE底库并载入底库",
    "底库需具备不同距离、姿态、光线多样性",
    "画面可分分辨人员、鞋子特征",
    "防护鞋不小于画面大小5%",
    "识别距离小于10m最佳（200万@6mm）",
  ],
  smoking_detection: [
    // 抽烟检测
    "适用于加油站、工厂、办公场所抽烟识别",
    "画面清晰，可辨别人体、头部以及烟卷特征",
    "香烟目标不小于画面大小5%",
    "识别距离小于10m最佳（200万@6mm）",
    "手持白色笔杆等情况易造成误报",
  ],
  fire_extinguisher_removed: [
    // 灭火器离位检测
    "适用于加油站场景灭火器离位检测",
    "需配置开放底库并载入底库",
    "底库需具备光线多样性",
    "识别距离小于20m最佳（200万@6mm）",
  ],
  black_screen_detection: [
    // 黑屏检测
    "适用于医院、商场屏幕黑屏异常检测",
    "需标定黑屏检测区域",
    "识别距离小于15m最佳（200万@6mm）",
    "灵敏度值越大，检测越灵敏",
  ],
  camera_blur_detection: [
    // 摄像头模糊检测
    "适用于监控场景摄像头画面模糊检测",
    "支持由于相机振动、对焦不足、镜头污损造成的画面模糊",
    "灵敏度值越大，检测越灵敏",
  ],
  camera_occlusion_detection: [
    // 摄像头遮挡检测
    "适用于监控场景摄像头画面遮挡检测",
    "支持镜头由于异物遮挡造成的异常检测",
    "灵敏度值越大，检测越灵敏",
  ],
  camera_move_detection: [
    // 摄像头挪动角度检测
    "适用于任意场景摄像头挪动角度检测",
    "需配置开放底库并载入底库",
    "底库需具备光线多样性",
    "区域内有运动目标时不检测",
    "识别距离小于20m最佳（200万@6mm）",
  ],
  fire_exit_blocked: [
    // 消防通道占用检测
    "适用于工地、工厂消防通道占用检测",
    "需配置开放底库并载入底库",
    "底库需具备光线多样性",
    "区域内有运动目标时不检测",
    "识别距离小于20m最佳（200万@6mm）",
  ],
  motion_detection: [
    // 移动侦测
    "适用于银行、仓库场景下运动目标检测",
    "识别距离小于15m最佳（200万@6mm）",
    "灵敏度值越小，检测越灵敏",
  ],
  ocr_detection: [
    // 光学字符识别
    "适用于字母、数字、中文、英文字符识别",
    "字符清晰可辨",
    "可标记字符检测区域",
    "字符目标不小于画面大小5%",
  ],
};

export const busyType = [
  { value: "监测监控", label: "监测监控" },
  { value: "特殊作业", label: "特殊作业" },
  { value: "设备状态", label: "设备状态" },
  { value: "工艺流程", label: "工艺流程" },
  { value: "人员计数", label: "人员计数" },
];
export const busyModelTypeSetting = {
  监测监控: null,
  特殊作业: [
    {
      value: "special_assignment_1",
      label: "动火作业",
      models: [
        "fire_detection",
        "smoke_detection",
        "safety_helmet",
        "work_clothes",
      ],
    },
    {
      value: "special_assignment_2",
      label: "受限空间",
      models: ["counting", "loitering_detection", "fall_detection"],
    },
    {
      value: "special_assignment_3",
      label: "吊装作业",
      models: ["intrusion"],
    },
    {
      value: "special_assignment_4",
      label: "临时用电",
      models: ["smoke_detection"],
    },
    {
      value: "special_assignment_5",
      label: "高处作业",
      models: ["intrusion"],
    },
    {
      value: "special_assignment_6",
      label: "动土作业",
      models: ["counting"],
    },
    {
      value: "special_assignment_7",
      label: "断路作业",
      models: [
        "intrusion",
        "vehicle_type_recognition",
        "license_plate_recognition",
      ],
    },
    {
      value: "special_assignment_8",
      label: "盲板抽堵",
      models: ["smoke_detection"],
    },
  ],
  设备状态: {
    models: [
      "smoke_detection",
      "vibration_detection",
      "device_start_stop_detection",
      "temperature_detection",
      "noise_detection",
    ],
  },
  工艺流程: {
    models: ["process_flow_recognition"],
  },
  人员计数: {
    models: [
      "counting",
      "assigned_personnel_alarm",
      "single_person_operation",
      "evacuation_verification",
      "capacity_limit_alarm",
    ],
  },
};

