// 生产设备状态感知数据
// 用于通过视频图像分析，识别并分析摄像机视场内重点监控设备的实时工作状态

import img1 from '@/assets/proEquipment/高压反应釜R-201.png'
import img2  from '@/assets/proEquipment/高速离心机C-301.png'
import img3  from '@/assets/proEquipment/气相色谱仪GC-210.png'
import img4  from '@/assets/proEquipment/废气处理塔ET-401.png'
import img5  from '@/assets/proEquipment/防爆通风柜VF-501.png'
import img6  from '@/assets/proEquipment/蒸馏塔DT-101.png'

interface EquipmentStatus {
  id: string;
  name: string;
  equipment_code: string;
  equipment_category: string;
  equipment_type: string;
  equipment_level: string;
  manufacturer: string;
  description: string;
  status: string;
  health_index: number;
  department: string;
  location: string;
  responsible_person: string;
  last_alarm_time?: string;
  last_alarm_type?: string;
  create_time?: string;
  update_time?: string;
  // 视频图像分析相关数据
  monitoring_projects: MonitoringProject[]; // 监测项目列表
  latest_alarm_snapshot?: string; // 最新报警快照
  current_video_feed: string; // 当前视频流地址
  camera_position: string; // 摄像头位置
  video_analysis_status: VideoAnalysisStatus; // 视频分析状态
  ai_detection_enabled: boolean; // 是否启用AI检测
  detection_sensitivity: number; // 检测敏感度 (1-10)
  // 实时状态数据
  real_time_data: RealTimeData;
  // 监控点位信息
  monitoring_points: MonitoringPoint[];
  // 子设备列表
  sub_equipment_list: SubEquipment[];
  // 设备图片路径
  image_path?: string; // 设备图片路径
}

interface SubEquipment {
  id: string;
  name: string; // 设备名称
  equipment_code: string; // 设备编号
  alarm_status: 'normal' | 'warning' | 'alert' | 'emergency'; // 报警状态
  online_status: 'online' | 'offline' | 'maintenance'; // 在线状态
  detection_value: number | string; // 检测值
  detection_unit?: string; // 检测值单位
  trend: 'stable' | 'rising' | 'falling' | 'fluctuating'; // 趋势
  detection_time: string; // 检测时间
  operation?: string; // 操作（如查看、编辑等）
}

interface MonitoringPoint {
  id: string;
  name: string; // 监控点名称
  code: string; // 监控点编号
  description: string; // 监控点描述
  type: 'temperature' | 'pressure' | 'vibration' | 'smoke' | 'fire' | 'sound' | 'video' | 'flow' | 'level' | 'other'; // 监控点类型
  location: string; // 监控点具体位置
  status: 'normal' | 'warning' | 'alert' | 'emergency' | 'offline'; // 监控点状态
  last_update: string; // 最后更新时间
  installation_date: string; // 安装日期
}

interface MonitoringProject {
  id: string;
  name: string; // 监测项目名称，如"冒烟检测"、"震动检测"等
  status: 'normal' | 'warning' | 'alert' | 'emergency'; // 状态
  status_text: string; // 状态文本描述
  last_update: string; // 最后更新时间
  confidence?: number; // AI识别置信度
  threshold?: string; // 阈值
  unit?: string; // 单位
  running_status?: 'start' | 'stop'; // 设备启停状态
  camera_id?: string; // 所属监控摄像头ID
  camera_name?: string; // 所属监控摄像头名称
}

interface VideoAnalysisStatus {
  is_online: boolean; // 是否在线
  analysis_mode: 'realtime' | 'scheduled' | 'paused'; // 分析模式
  last_analyzed: string; // 最后分析时间
  processing_delay: number; // 处理延迟（毫秒）
  detection_accuracy: number; // 检测准确率
}

interface RealTimeData {
  temperature: number; // 温度
  vibration: number; // 震动
  pressure: number; // 压力
  smoke_detected: boolean; // 是否检测到冒烟
  fire_detected: boolean; // 是否检测到火焰
  abnormal_sound: boolean; // 是否检测到异常声音
  equipment_running: boolean; // 设备是否运行
  last_update: string; // 最后更新时间
}

// 模拟数据存储
export const perceivedStateData: EquipmentStatus[] = [
  {
    id: 'equip001',
    name: '高压反应釜 R-201',
    equipment_code: 'CHEM-REACT-001',
    equipment_category: '反应设备',
    equipment_type: '反应釜',
    equipment_level: '关键设备',
    manufacturer: '示例地区九院设备厂',
    description: '用于化学合成反应的高压反应釜，工作压力可达15MPa，温度范围-20℃至200℃',
    status: 'normal',
    health_index: 95,
    department: '化学合成部',
    location: 'A栋1层101室西侧',
    responsible_person: '张三',
    last_alarm_time: '2025-12-20 10:30:00',
    last_alarm_type: '温度异常',
    create_time: '2025-12-01 09:30:00',
    update_time: '2025-12-01 09:30:00',
    // 视频图像分析相关数据
    monitoring_projects: [
      {
        id: 'mp001',
        name: '温度监测',
        status: 'normal',
        status_text: '78.5°C (正常范围: -20°C to 200°C)',
        last_update: '2025-12-29 11:50:00',
        confidence: 98,
        threshold: '180°C',
        unit: '°C',
        running_status: 'start',
        camera_id: 'cam001',
        camera_name: '反应釜顶部摄像头'
      },
      {
        id: 'mp002',
        name: '冒烟检测',
        status: 'normal',
        status_text: '未检测到异常烟雾',
        last_update: '2025-12-29 11:55:00',
        confidence: 99,
        running_status: 'start',
        camera_id: 'cam002',
        camera_name: '反应釜四Maintainer摄像头'
      },
      {
        id: 'mp003',
        name: '震动检测',
        status: 'warning',
        status_text: '轻微震动异常 (持续15s)',
        last_update: '2025-12-29 11:45:00',
        confidence: 92,
        threshold: '7.1mm/s',
        unit: 'mm/s',
        running_status: 'start',
        camera_id: 'cam001',
        camera_name: '反应釜顶部摄像头'
      },
      {
        id: 'mp004',
        name: '压力监测',
        status: 'normal',
        status_text: '0.8MPa (正常范围: 0.5-1.0MPa)',
        last_update: '2025-12-29 11:52:00',
        confidence: 97,
        threshold: '1.2MPa',
        unit: 'MPa',
        running_status: 'start',
        camera_id: 'cam001',
        camera_name: '反应釜顶部摄像头'
      },
      {
        id: 'mp005',
        name: '设备启停状态',
        status: 'normal',
        status_text: '设备运行中',
        last_update: '2025-12-29 11:52:00',
        confidence: 99,
        running_status: 'start',
        camera_id: 'cam001',
        camera_name: '反应釜顶部摄像头'
      }
    ],
    latest_alarm_snapshot: 'snapshot_001.jpg',
    current_video_feed: 'rtsp://10.0.0.1:554/reactor_201',
    camera_position: '反应釜顶部及四Maintainer',
    video_analysis_status: {
      is_online: true,
      analysis_mode: 'realtime',
      last_analyzed: '2025-12-29 11:58:00',
      processing_delay: 200,
      detection_accuracy: 96.5
    },
    ai_detection_enabled: true,
    detection_sensitivity: 8,
    // 实时状态数据
    real_time_data: {
      temperature: 78.5,
      vibration: 2.1,
      pressure: 0.8,
      smoke_detected: false,
      fire_detected: false,
      abnormal_sound: false,
      equipment_running: true,
      last_update: '2025-12-29 11:58:00'
    },
    // 监控点位信息
    monitoring_points: [
      {
        id: 'mpoint001',
        name: '反应釜顶部温度监控点',
        code: 'TEMP-001',
        description: '监测反应釜顶部温度，确保在安全范围内运行',
        type: 'temperature',
        location: '反应釜顶部',
        status: 'normal',
        last_update: '2025-12-29 11:58:00',
        installation_date: '2025-11-15'
      },
      {
        id: 'mpoint002',
        name: '反应釜压力监控点',
        code: 'PRESS-001',
        description: '监测反应釜内部压力，防止超压运行',
        type: 'pressure',
        location: '反应釜侧面',
        status: 'normal',
        last_update: '2025-12-29 11:58:00',
        installation_date: '2025-11-15'
      },
      {
        id: 'mpoint003',
        name: '反应釜震动监控点',
        code: 'VIB-001',
        description: '监测反应釜运行震动情况，预防机械故障',
        type: 'vibration',
        location: '反应釜底部',
        status: 'warning',
        last_update: '2025-12-29 11:58:00',
        installation_date: '2025-11-15'
      },
      {
        id: 'mpoint004',
        name: '反应釜烟雾监控点',
        code: 'SMOKE-001',
        description: '监测反应釜Maintainer围烟雾情况，预防火灾',
        type: 'smoke',
        location: '反应釜Maintainer围',
        status: 'normal',
        last_update: '2025-12-29 11:58:00',
        installation_date: '2025-11-15'
      }
    ],
    // 子设备列表
    sub_equipment_list: [
      {
        id: 'sub001',
        name: '反应釜温度传感器',
        equipment_code: 'TEMP-SEN-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 78.5,
        detection_unit: '°C',
        trend: 'stable',
        detection_time: '2025-12-29 11:58:00'
      },
      {
        id: 'sub002',
        name: '反应釜压力传感器',
        equipment_code: 'PRESS-SEN-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 0.8,
        detection_unit: 'MPa',
        trend: 'stable',
        detection_time: '2025-12-29 11:58:00'
      },
      {
        id: 'sub003',
        name: '反应釜震动传感器',
        equipment_code: 'VIB-SEN-001',
        alarm_status: 'warning',
        online_status: 'online',
        detection_value: 2.1,
        detection_unit: 'mm/s',
        trend: 'rising',
        detection_time: '2025-12-29 11:58:00'
      },
      {
        id: 'sub004',
        name: '反应釜电机',
        equipment_code: 'MOTOR-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 1450,
        detection_unit: 'rpm',
        trend: 'stable',
        detection_time: '2025-12-29 11:58:00'
      }
    ],
    // 设备图片路径
    image_path: img1
  },
  {
    id: 'equip002',
    name: '高速离心机 C-301',
    equipment_code: 'CHEM-SEPAR-002',
    equipment_category: '分离设备',
    equipment_type: '离心机',
    equipment_level: '重要设备',
    manufacturer: '中核设备制造有限公司',
    description: '用于化学物质分离的高速离心机，最高转速可达15000rpm，可处理多种化学物质',
    status: 'running',
    health_index: 88,
    department: '分析检测部',
    location: 'A栋2层201室',
    responsible_person: '李四',
    last_alarm_time: '2025-12-22 14:15:00',
    last_alarm_type: '转速异常',
    create_time: '2025-12-01 14:15:00',
    update_time: '2025-12-01 14:15:00',
    // 视频图像分析相关数据
    monitoring_projects: [
      {
        id: 'mp006',
        name: '转速监测',
        status: 'normal',
        status_text: '12500rpm (正常范围: 0-15000rpm)',
        last_update: '2025-12-29 11:53:00',
        confidence: 95,
        threshold: '14500rpm',
        unit: 'rpm',
        running_status: 'start',
        camera_id: 'cam003',
        camera_name: '离心机正面摄像头'
      },
      {
        id: 'mp007',
        name: '震动检测',
        status: 'alert',
        status_text: '震动幅度偏大 (7.8mm/s)',
        last_update: '2025-12-29 11:48:00',
        confidence: 90,
        threshold: '7.1mm/s',
        unit: 'mm/s',
        running_status: 'start',
        camera_id: 'cam004',
        camera_name: '离心机底座摄像头'
      },
      {
        id: 'mp008',
        name: '异常声音检测',
        status: 'normal',
        status_text: '未检测到异常声音',
        last_update: '2025-12-29 11:50:00',
        confidence: 94,
        running_status: 'start',
        camera_id: 'cam003',
        camera_name: '离心机正面摄像头'
      },
      {
        id: 'mp009',
        name: '设备启停状态',
        status: 'normal',
        status_text: '设备运行中',
        last_update: '2025-12-29 11:52:00',
        confidence: 99,
        running_status: 'start',
        camera_id: 'cam003',
        camera_name: '离心机正面摄像头'
      }
    ],
    latest_alarm_snapshot: 'snapshot_004.jpg',
    current_video_feed: 'rtsp://10.0.0.1:554/centrifuge_301',
    camera_position: '离心机正面及侧面',
    video_analysis_status: {
      is_online: true,
      analysis_mode: 'realtime',
      last_analyzed: '2025-12-29 11:57:00',
      processing_delay: 180,
      detection_accuracy: 94.2
    },
    ai_detection_enabled: true,
    detection_sensitivity: 7,
    // 实时状态数据
    real_time_data: {
      temperature: 42.3,
      vibration: 7.8,
      pressure: 0.2,
      smoke_detected: false,
      fire_detected: false,
      abnormal_sound: false,
      equipment_running: true,
      last_update: '2025-12-29 11:57:00'
    },
    // 监控点位信息
    monitoring_points: [
      {
        id: 'mpoint005',
        name: '离心机转速监控点',
        code: 'SPEED-001',
        description: '监测离心机转速，确保在安全范围内运行',
        type: 'flow',
        location: '离心机控制系统',
        status: 'normal',
        last_update: '2025-12-29 11:57:00',
        installation_date: '2025-10-20'
      },
      {
        id: 'mpoint006',
        name: '离心机震动监控点',
        code: 'VIB-002',
        description: '监测离心机运行震动情况，预防机械故障',
        type: 'vibration',
        location: '离心机底座',
        status: 'alert',
        last_update: '2025-12-29 11:57:00',
        installation_date: '2025-10-20'
      },
      {
        id: 'mpoint007',
        name: '离心机声音监控点',
        code: 'SOUND-001',
        description: '监测离心机运行声音，检测异常情况',
        type: 'sound',
        location: '离心机Maintainer围',
        status: 'normal',
        last_update: '2025-12-29 11:57:00',
        installation_date: '2025-10-20'
      }
    ],
    // 子设备列表
    sub_equipment_list: [
      {
        id: 'sub005',
        name: '离心机转速传感器',
        equipment_code: 'SPEED-SEN-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 12500,
        detection_unit: 'rpm',
        trend: 'stable',
        detection_time: '2025-12-29 11:57:00'
      },
      {
        id: 'sub006',
        name: '离心机震动传感器',
        equipment_code: 'VIB-SEN-002',
        alarm_status: 'alert',
        online_status: 'online',
        detection_value: 7.8,
        detection_unit: 'mm/s',
        trend: 'rising',
        detection_time: '2025-12-29 11:57:00'
      },
      {
        id: 'sub007',
        name: '离心机温度传感器',
        equipment_code: 'TEMP-SEN-002',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 42.3,
        detection_unit: '°C',
        trend: 'stable',
        detection_time: '2025-12-29 11:57:00'
      },
      {
        id: 'sub008',
        name: '离心机电机',
        equipment_code: 'MOTOR-002',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 3.2,
        detection_unit: 'kW',
        trend: 'stable',
        detection_time: '2025-12-29 11:57:00'
      }
    ],
    // 设备图片路径
    image_path: img2
  },
  {
    id: 'equip003',
    name: '气相色谱仪 GC-210',
    equipment_code: 'CHEM-ANAL-003',
    equipment_category: '分析仪器',
    equipment_type: '色谱仪',
    equipment_level: '关键设备',
    manufacturer: '国机集团设备有限公司',
    description: '用于化学成分分析的气相色谱仪，具有高精度检测能力，可分析多种有机化合物',
    status: 'warning',
    health_index: 75,
    department: '分析检测部',
    location: 'B栋3层301室东侧',
    responsible_person: '王五',
    last_alarm_time: '2025-12-23 09:45:00',
    last_alarm_type: '柱温箱温度异常',
    create_time: '2025-11-28 16:20:00',
    update_time: '2025-11-28 16:20:00',
    // 视频图像分析相关数据
    monitoring_projects: [
      {
        id: 'mp010',
        name: '柱温箱温度',
        status: 'warning',
        status_text: '448°C (接近上限450°C)',
        last_update: '2025-12-29 11:52:00',
        confidence: 96,
        threshold: '450°C',
        unit: '°C',
        running_status: 'start',
        camera_id: 'cam005',
        camera_name: '色谱仪正面摄像头'
      },
      {
        id: 'mp011',
        name: '检测器温度',
        status: 'normal',
        status_text: '450°C (正常范围: 0-450°C)',
        last_update: '2025-12-29 11:54:00',
        confidence: 97,
        threshold: '450°C',
        unit: '°C',
        running_status: 'start',
        camera_id: 'cam005',
        camera_name: '色谱仪正面摄像头'
      },
      {
        id: 'mp012',
        name: '载气流量',
        status: 'normal',
        status_text: '45ml/min (正常范围: 1-100ml/min)',
        last_update: '2025-12-29 11:51:00',
        confidence: 95,
        threshold: '100ml/min',
        unit: 'ml/min',
        running_status: 'start',
        camera_id: 'cam005',
        camera_name: '色谱仪正面摄像头'
      },
      {
        id: 'mp013',
        name: '设备启停状态',
        status: 'normal',
        status_text: '设备运行中',
        last_update: '2025-12-29 11:52:00',
        confidence: 99,
        running_status: 'start',
        camera_id: 'cam005',
        camera_name: '色谱仪正面摄像头'
      }
    ],
    latest_alarm_snapshot: 'snapshot_005.jpg',
    current_video_feed: 'rtsp://10.0.0.1:554/gc_210',
    camera_position: '色谱仪正面及柱温箱',
    video_analysis_status: {
      is_online: true,
      analysis_mode: 'realtime',
      last_analyzed: '2025-12-29 11:56:00',
      processing_delay: 220,
      detection_accuracy: 95.8
    },
    ai_detection_enabled: true,
    detection_sensitivity: 6,
    // 实时状态数据
    real_time_data: {
      temperature: 448.0,
      vibration: 1.2,
      pressure: 0.4,
      smoke_detected: false,
      fire_detected: false,
      abnormal_sound: false,
      equipment_running: true,
      last_update: '2025-12-29 11:56:00'
    },
    // 监控点位信息
    monitoring_points: [
      {
        id: 'mpoint008',
        name: '柱温箱温度监控点',
        code: 'TEMP-002',
        description: '监测色谱柱温箱温度，确保分析精度',
        type: 'temperature',
        location: '柱温箱内部',
        status: 'warning',
        last_update: '2025-12-29 11:56:00',
        installation_date: '2025-09-10'
      },
      {
        id: 'mpoint009',
        name: '检测器温度监控点',
        code: 'TEMP-003',
        description: '监测检测器温度，确保检测精度',
        type: 'temperature',
        location: '检测器内部',
        status: 'normal',
        last_update: '2025-12-29 11:56:00',
        installation_date: '2025-09-10'
      },
      {
        id: 'mpoint010',
        name: '载气流量监控点',
        code: 'FLOW-001',
        description: '监测载气流量，确保分析准确性',
        type: 'flow',
        location: '载气管路',
        status: 'normal',
        last_update: '2025-12-29 11:56:00',
        installation_date: '2025-09-10'
      },
      {
        id: 'mpoint011',
        name: '色谱仪震动监控点',
        code: 'VIB-003',
        description: '监测色谱仪震动，确保分析精度',
        type: 'vibration',
        location: '色谱仪底座',
        status: 'normal',
        last_update: '2025-12-29 11:56:00',
        installation_date: '2025-09-10'
      }
    ],
    // 子设备列表
    sub_equipment_list: [
      {
        id: 'sub009',
        name: '柱温箱温度控制器',
        equipment_code: 'TEMP-CTL-001',
        alarm_status: 'warning',
        online_status: 'online',
        detection_value: 448,
        detection_unit: '°C',
        trend: 'rising',
        detection_time: '2025-12-29 11:56:00'
      },
      {
        id: 'sub010',
        name: '检测器温度控制器',
        equipment_code: 'DET-TEMP-CTL-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 450,
        detection_unit: '°C',
        trend: 'stable',
        detection_time: '2025-12-29 11:56:00'
      },
      {
        id: 'sub011',
        name: '载气流量控制器',
        equipment_code: 'FLOW-CTL-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 45,
        detection_unit: 'ml/min',
        trend: 'stable',
        detection_time: '2025-12-29 11:56:00'
      },
      {
        id: 'sub012',
        name: '色谱仪泵系统',
        equipment_code: 'PUMP-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 3.2,
        detection_unit: 'ml/min',
        trend: 'stable',
        detection_time: '2025-12-29 11:56:00'
      }
    ],
    // 设备图片路径
    image_path: img3
  },
  {
    id: 'equip004',
    name: '废气处理塔 ET-401',
    equipment_code: 'ENV-PROC-004',
    equipment_category: '辅助设备',
    equipment_type: '废气处理设备',
    equipment_level: '重要设备',
    manufacturer: '自研设备',
    description: '用于处理实验过程中产生的有害废气，通过化学吸收和催化燃烧处理多种有害气体',
    status: 'alert',
    health_index: 65,
    department: '安全环保部',
    location: 'C栋外废气处理区',
    responsible_person: '赵六',
    last_alarm_time: '2025-12-24 16:20:00',
    last_alarm_type: '废气浓度超标',
    create_time: '2025-12-02 10:00:00',
    update_time: '2025-12-02 10:00:00',
    // 视频图像分析相关数据
    monitoring_projects: [
      {
        id: 'mp014',
        name: '废气浓度监测',
        status: 'alert',
        status_text: 'SO2浓度: 180mg/m³ (超标: >120mg/m³)',
        last_update: '2025-12-29 11:45:00',
        confidence: 93,
        threshold: '120mg/m³',
        unit: 'mg/m³',
        running_status: 'start',
        camera_id: 'cam006',
        camera_name: '处理塔进出口摄像头'
      },
      {
        id: 'mp015',
        name: '风机运行状态',
        status: 'normal',
        status_text: '运行正常，转速: 1450rpm',
        last_update: '2025-12-29 11:53:00',
        confidence: 94,
        threshold: '1500rpm',
        unit: 'rpm',
        running_status: 'start',
        camera_id: 'cam006',
        camera_name: '处理塔进出口摄像头'
      },
      {
        id: 'mp016',
        name: '喷淋系统状态',
        status: 'normal',
        status_text: '喷淋正常，流量: 12m³/h',
        last_update: '2025-12-29 11:50:00',
        confidence: 92,
        threshold: '15m³/h',
        unit: 'm³/h',
        running_status: 'start',
        camera_id: 'cam006',
        camera_name: '处理塔进出口摄像头'
      },
      {
        id: 'mp017',
        name: '设备启停状态',
        status: 'normal',
        status_text: '设备运行中',
        last_update: '2025-12-29 11:52:00',
        confidence: 99,
        running_status: 'start',
        camera_id: 'cam006',
        camera_name: '处理塔进出口摄像头'
      }
    ],
    latest_alarm_snapshot: 'snapshot_007.jpg',
    current_video_feed: 'rtsp://10.0.0.1:554/scrubber_401',
    camera_position: '处理塔进出口及喷淋区',
    video_analysis_status: {
      is_online: true,
      analysis_mode: 'realtime',
      last_analyzed: '2025-12-29 11:55:00',
      processing_delay: 250,
      detection_accuracy: 92.5
    },
    ai_detection_enabled: true,
    detection_sensitivity: 7,
    // 实时状态数据
    real_time_data: {
      temperature: 35.6,
      vibration: 3.2,
      pressure: 1.2,
      smoke_detected: false,
      fire_detected: false,
      abnormal_sound: true,
      equipment_running: true,
      last_update: '2025-12-29 11:55:00'
    },
    // 监控点位信息
    monitoring_points: [
      {
        id: 'mpoint012',
        name: '废气进口浓度监控点',
        code: 'CONC-001',
        description: '监测废气处理塔进口废气浓度',
        type: 'flow',
        location: '废气处理塔进口',
        status: 'normal',
        last_update: '2025-12-29 11:55:00',
        installation_date: '2025-08-05'
      },
      {
        id: 'mpoint013',
        name: '废气出口浓度监控点',
        code: 'CONC-002',
        description: '监测废气处理塔出口废气浓度，确保达标排放',
        type: 'flow',
        location: '废气处理塔出口',
        status: 'alert',
        last_update: '2025-12-29 11:55:00',
        installation_date: '2025-08-05'
      },
      {
        id: 'mpoint014',
        name: '风机震动监控点',
        code: 'VIB-004',
        description: '监测风机运行震动情况',
        type: 'vibration',
        location: '风机底座',
        status: 'normal',
        last_update: '2025-12-29 11:55:00',
        installation_date: '2025-08-05'
      },
      {
        id: 'mpoint015',
        name: '喷淋液位监控点',
        code: 'LEVEL-001',
        description: '监测喷淋系统液位',
        type: 'level',
        location: '喷淋液储罐',
        status: 'normal',
        last_update: '2025-12-29 11:55:00',
        installation_date: '2025-08-05'
      }
    ],
    // 子设备列表
    sub_equipment_list: [
      {
        id: 'sub013',
        name: '进口SO2浓度传感器',
        equipment_code: 'SO2-SEN-001',
        alarm_status: 'alert',
        online_status: 'online',
        detection_value: 180,
        detection_unit: 'mg/m³',
        trend: 'rising',
        detection_time: '2025-12-29 11:55:00'
      },
      {
        id: 'sub014',
        name: '出口SO2浓度传感器',
        equipment_code: 'SO2-SEN-002',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 85,
        detection_unit: 'mg/m³',
        trend: 'stable',
        detection_time: '2025-12-29 11:55:00'
      },
      {
        id: 'sub015',
        name: '处理塔风机',
        equipment_code: 'FAN-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 1450,
        detection_unit: 'rpm',
        trend: 'stable',
        detection_time: '2025-12-29 11:55:00'
      },
      {
        id: 'sub016',
        name: '喷淋泵',
        equipment_code: 'PUMP-002',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 12,
        detection_unit: 'm³/h',
        trend: 'stable',
        detection_time: '2025-12-29 11:55:00'
      },
      {
        id: 'sub017',
        name: '液位传感器',
        equipment_code: 'LEVEL-SEN-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 65,
        detection_unit: '%',
        trend: 'stable',
        detection_time: '2025-12-29 11:55:00'
      }
    ],
    // 设备图片路径
    image_path: img4
  },
  {
    id: 'equip005',
    name: '防爆通风柜 VF-501',
    equipment_code: 'SAFETY-005',
    equipment_category: '辅助设备',
    equipment_type: '通风系统',
    equipment_level: '一般设备',
    manufacturer: '示例地区九院设备厂',
    description: '用于实验室通风和有害气体排放的防爆通风柜，保障实验人员安全',
    status: 'normal',
    health_index: 92,
    department: '化学合成部',
    location: 'A栋1层102室',
    responsible_person: '陈七',
    last_alarm_time: '2025-12-15 14:20:00',
    last_alarm_type: '排风量不足',
    create_time: '2025-12-05 11:00:00',
    update_time: '2025-12-05 11:00:00',
    // 视频图像分析相关数据
    monitoring_projects: [
      {
        id: 'mp018',
        name: '面风速监测',
        status: 'normal',
        status_text: '0.52m/s (正常范围: 0.4-0.6m/s)',
        last_update: '2025-12-29 11:54:00',
        confidence: 96,
        threshold: '0.6m/s',
        unit: 'm/s',
        running_status: 'start',
        camera_id: 'cam007',
        camera_name: '通风柜正面摄像头'
      },
      {
        id: 'mp019',
        name: '排风量监测',
        status: 'normal',
        status_text: '820m³/h (正常范围: 600-1000m³/h)',
        last_update: '2025-12-29 11:51:00',
        confidence: 95,
        threshold: '1000m³/h',
        unit: 'm³/h',
        running_status: 'start',
        camera_id: 'cam007',
        camera_name: '通风柜正面摄像头'
      },
      {
        id: 'mp020',
        name: '风机振动',
        status: 'normal',
        status_text: '1.8mm/s (正常范围: <7.1mm/s)',
        last_update: '2025-12-29 11:49:00',
        confidence: 94,
        threshold: '7.1mm/s',
        unit: 'mm/s',
        running_status: 'start',
        camera_id: 'cam008',
        camera_name: '风机底座摄像头'
      },
      {
        id: 'mp021',
        name: '设备启停状态',
        status: 'normal',
        status_text: '设备运行中',
        last_update: '2025-12-29 11:52:00',
        confidence: 99,
        running_status: 'start',
        camera_id: 'cam007',
        camera_name: '通风柜正面摄像头'
      }
    ],
    latest_alarm_snapshot: 'snapshot_009.jpg',
    current_video_feed: 'rtsp://10.0.0.1:554/vent_cabinet_501',
    camera_position: '通风柜正面及内部',
    video_analysis_status: {
      is_online: true,
      analysis_mode: 'realtime',
      last_analyzed: '2025-12-29 11:54:00',
      processing_delay: 190,
      detection_accuracy: 95.3
    },
    ai_detection_enabled: true,
    detection_sensitivity: 6,
    // 实时状态数据
    real_time_data: {
      temperature: 28.5,
      vibration: 1.8,
      pressure: 0.1,
      smoke_detected: false,
      fire_detected: false,
      abnormal_sound: false,
      equipment_running: true,
      last_update: '2025-12-29 11:54:00'
    },
    // 监控点位信息
    monitoring_points: [
      {
        id: 'mpoint016',
        name: '通风柜面风速监控点',
        code: 'FLOW-002',
        description: '监测通风柜面风速，确保有效排风',
        type: 'flow',
        location: '通风柜操作面',
        status: 'normal',
        last_update: '2025-12-29 11:54:00',
        installation_date: '2025-07-20'
      },
      {
        id: 'mpoint017',
        name: '排风量监控点',
        code: 'FLOW-003',
        description: '监测通风柜排风量，确保有害气体有效排除',
        type: 'flow',
        location: '排风管道',
        status: 'normal',
        last_update: '2025-12-29 11:54:00',
        installation_date: '2025-07-20'
      },
      {
        id: 'mpoint018',
        name: '风机震动监控点',
        code: 'VIB-005',
        description: '监测风机运行震动情况',
        type: 'vibration',
        location: '风机底座',
        status: 'normal',
        last_update: '2025-12-29 11:54:00',
        installation_date: '2025-07-20'
      },
      {
        id: 'mpoint019',
        name: '通风柜内部视频监控点',
        code: 'VIDEO-001',
        description: '监控通风柜内部操作情况',
        type: 'video',
        location: '通风柜内部',
        status: 'normal',
        last_update: '2025-12-29 11:54:00',
        installation_date: '2025-07-20'
      }
    ],
    // 子设备列表
    sub_equipment_list: [
      {
        id: 'sub018',
        name: '面风速传感器',
        equipment_code: 'FLOW-SEN-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 0.52,
        detection_unit: 'm/s',
        trend: 'stable',
        detection_time: '2025-12-29 11:54:00'
      },
      {
        id: 'sub019',
        name: '排风量传感器',
        equipment_code: 'AIR-SEN-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 820,
        detection_unit: 'm³/h',
        trend: 'stable',
        detection_time: '2025-12-29 11:54:00'
      },
      {
        id: 'sub020',
        name: '通风柜风机',
        equipment_code: 'FAN-002',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 1.8,
        detection_unit: 'mm/s',
        trend: 'stable',
        detection_time: '2025-12-29 11:54:00'
      }
    ],
    // 设备图片路径
    image_path: img5
  },
  {
    id: 'equip006',
    name: '蒸馏塔 DT-101',
    equipment_code: 'CHEM-SEPAR-006',
    equipment_category: '分离设备',
    equipment_type: '蒸馏塔',
    equipment_level: '关键设备',
    manufacturer: '中核设备制造有限公司',
    description: '用于化学物质精馏分离的蒸馏塔，具有高效分离能力，适用于多种有机化合物的提纯',
    status: 'running',
    health_index: 90,
    department: '化学合成部',
    location: 'A栋1层103室',
    responsible_person: '张三',
    last_alarm_time: '2025-12-18 11:00:00',
    last_alarm_type: '温度波动',
    create_time: '2025-11-10 10:00:00',
    update_time: '2025-11-10 10:00:00',
    // 视频图像分析相关数据
    monitoring_projects: [
      {
        id: 'mp022',
        name: '塔顶温度',
        status: 'normal',
        status_text: '85°C (正常范围: 50-150°C)',
        last_update: '2025-12-29 11:52:00',
        confidence: 97,
        threshold: '150°C',
        unit: '°C',
        running_status: 'start',
        camera_id: 'cam009',
        camera_name: '蒸馏塔塔身摄像头'
      },
      {
        id: 'mp023',
        name: '塔底温度',
        status: 'normal',
        status_text: '125°C (正常范围: 50-150°C)',
        last_update: '2025-12-29 11:53:00',
        confidence: 96,
        threshold: '150°C',
        unit: '°C',
        running_status: 'start',
        camera_id: 'cam009',
        camera_name: '蒸馏塔塔身摄像头'
      },
      {
        id: 'mp024',
        name: '塔压监测',
        status: 'normal',
        status_text: '0.3MPa (正常范围: 0.1-0.5MPa)',
        last_update: '2025-12-29 11:50:00',
        confidence: 95,
        threshold: '0.5MPa',
        unit: 'MPa',
        running_status: 'start',
        camera_id: 'cam009',
        camera_name: '蒸馏塔塔身摄像头'
      },
      {
        id: 'mp025',
        name: '液位监测',
        status: 'normal',
        status_text: '65% (正常范围: 30-80%)',
        last_update: '2025-12-29 11:51:00',
        confidence: 94,
        threshold: '80%',
        unit: '%',
        running_status: 'start',
        camera_id: 'cam009',
        camera_name: '蒸馏塔塔身摄像头'
      },
      {
        id: 'mp026',
        name: '设备启停状态',
        status: 'normal',
        status_text: '设备运行中',
        last_update: '2025-12-29 11:52:00',
        confidence: 99,
        running_status: 'start',
        camera_id: 'cam009',
        camera_name: '蒸馏塔塔身摄像头'
      }
    ],
    latest_alarm_snapshot: 'snapshot_010.jpg',
    current_video_feed: 'rtsp://10.0.0.1:554/distillation_101',
    camera_position: '蒸馏塔塔身及塔顶',
    video_analysis_status: {
      is_online: true,
      analysis_mode: 'realtime',
      last_analyzed: '2025-12-29 11:53:00',
      processing_delay: 210,
      detection_accuracy: 96.1
    },
    ai_detection_enabled: true,
    detection_sensitivity: 7,
    // 实时状态数据
    real_time_data: {
      temperature: 125.0,
      vibration: 2.5,
      pressure: 0.3,
      smoke_detected: false,
      fire_detected: false,
      abnormal_sound: false,
      equipment_running: true,
      last_update: '2025-12-29 11:53:00'
    },
    // 监控点位信息
    monitoring_points: [
      {
        id: 'mpoint020',
        name: '塔顶温度监控点',
        code: 'TEMP-004',
        description: '监测蒸馏塔塔顶温度',
        type: 'temperature',
        location: '塔顶',
        status: 'normal',
        last_update: '2025-12-29 11:53:00',
        installation_date: '2025-10-01'
      },
      {
        id: 'mpoint021',
        name: '塔底温度监控点',
        code: 'TEMP-005',
        description: '监测蒸馏塔塔底温度',
        type: 'temperature',
        location: '塔底',
        status: 'normal',
        last_update: '2025-12-29 11:53:00',
        installation_date: '2025-10-01'
      },
      {
        id: 'mpoint022',
        name: '塔压监控点',
        code: 'PRESS-002',
        description: '监测蒸馏塔内部压力',
        type: 'pressure',
        location: '塔身中段',
        status: 'normal',
        last_update: '2025-12-29 11:53:00',
        installation_date: '2025-10-01'
      },
      {
        id: 'mpoint023',
        name: '塔内液位监控点',
        code: 'LEVEL-002',
        description: '监测蒸馏塔内液位',
        type: 'level',
        location: '塔身中下段',
        status: 'normal',
        last_update: '2025-12-29 11:53:00',
        installation_date: '2025-10-01'
      },
      {
        id: 'mpoint024',
        name: '塔体震动监控点',
        code: 'VIB-006',
        description: '监测蒸馏塔整体震动情况',
        type: 'vibration',
        location: '塔底支撑',
        status: 'normal',
        last_update: '2025-12-29 11:53:00',
        installation_date: '2025-10-01'
      }
    ],
    // 子设备列表
    sub_equipment_list: [
      {
        id: 'sub021',
        name: '塔顶温度传感器',
        equipment_code: 'TEMP-SEN-003',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 85,
        detection_unit: '°C',
        trend: 'stable',
        detection_time: '2025-12-29 11:53:00'
      },
      {
        id: 'sub022',
        name: '塔底温度传感器',
        equipment_code: 'TEMP-SEN-004',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 125,
        detection_unit: '°C',
        trend: 'stable',
        detection_time: '2025-12-29 11:53:00'
      },
      {
        id: 'sub023',
        name: '塔压传感器',
        equipment_code: 'PRESS-SEN-001',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 0.3,
        detection_unit: 'MPa',
        trend: 'stable',
        detection_time: '2025-12-29 11:53:00'
      },
      {
        id: 'sub024',
        name: '液位传感器',
        equipment_code: 'LEVEL-SEN-002',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 65,
        detection_unit: '%',
        trend: 'stable',
        detection_time: '2025-12-29 11:53:00'
      },
      {
        id: 'sub025',
        name: '塔底泵',
        equipment_code: 'PUMP-003',
        alarm_status: 'normal',
        online_status: 'online',
        detection_value: 3.2,
        detection_unit: 'm³/h',
        trend: 'stable',
        detection_time: '2025-12-29 11:53:00'
      }
    ],
    // 设备图片路径
    image_path: img6
  }
];