// 生产设备
// 类型定义
interface Equipment {
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
  equipmentParameter?: EquipmentParameter[];
  factory_number?: string;
  model?: string;
  supplier?: string;
  purchase_date?: string;
  use_date?: string;
  expected_life?: number;
  original_value?: number;
  security_level?: string;
  contact_mediums?: string[];
  related_processes?: string[];
  documents?: string[];
  maintenanceRecords?: MaintenanceRecord[];
  calibrationRecords?: CalibrationRecord[];
  inspectionRecords?: InspectionRecord[];
  alarmHistory?: AlarmRecord[];
  relatedSpares?: SparePart[];
  relatedDocuments?: Document[];
}
interface EquipmentParameter {
  id: string;
  name: string;
  type: string;
  value: string;
  unit: string;
  status: string;
}

interface MaintenanceRecord {
  id: string;
  repair_time: string;
  fault_description: string;
  repair_person: string;
  replaced_parts: string;
  result: string;
  duration: string;
  cost: number;
  operator: string; // 操作员
}

interface CalibrationRecord {
  id: string;
  instrument_id: string;
  last_calibration: string;
  next_calibration: string;
  result: string;
  certificate_id: string;
  operator: string; // 操作员
}

interface InspectionRecord {
  id: string;
  inspection_time: string;
  inspector: string;
  items: string;
  result: string;
  operator: string; // 操作员
}

interface AlarmRecord {
  id: string;
  time: string;
  type: string;
  level: string;
  status: string;
  snapshot: string;
  source: string; // 报警来源: AI, SENSOR, MANUAL
  operator: string; // 操作员
}

interface SparePart {
  id: string;
  name: string;
  code: string;
  inventory: number;
  min_inventory: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  update_time: string;
}
// 生产设备 模拟数据存储
export const equipmentData: Equipment[] = [
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
    factory_number: 'F2025001',
    model: 'GHR-1500',
    supplier: '示例地区九院设备厂',
    purchase_date: '2025-11-15',
    use_date: '2025-11-20',
    expected_life: 15,
    original_value: 120.5,
    security_level: '秘密',
    contact_mediums: ['盐酸', '丙酮', '氢氧化钠'],
    related_processes: ['SOP-001', 'SOP-002'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      {
        id: 'param001',
        name: '最大工作压力',
        type: '安全参数',
        value: '15MPa',
        unit: 'MPa',
        status: '1'
      },
      {
        id: 'param002',
        name: '最高工作温度',
        type: '安全参数',
        value: '200',
        unit: '℃',
        status: '1'
      },
      {
        id: 'param003',
        name: '搅拌转速',
        type: '运行参数',
        value: '50-300',
        unit: 'rpm',
        status: '1'
      }
    ],
    maintenanceRecords: [
      {
        id: 'mr001',
        repair_time: '2025-12-10 14:30:00',
        fault_description: '电机异响',
        repair_person: '李四',
        replaced_parts: '电机轴承',
        result: '已修复',
        duration: '3小时',
        cost: 1500,
        operator: '管理员'
      }
    ],
    calibrationRecords: [
      {
        id: 'cr001',
        instrument_id: 'PT-001',
        last_calibration: '2025-11-20',
        next_calibration: '2026-11-20',
        result: '合格',
        certificate_id: 'CAL-2025-001',
        operator: '校准员'
      }
    ],
    inspectionRecords: [
      {
        id: 'ir001',
        inspection_time: '2025-12-20 09:00:00',
        inspector: '王五',
        items: '压力表、温度计、安全阀',
        result: '正常',
        operator: '巡检员'
      }
    ],
    alarmHistory: [
      {
        id: 'ah001',
        time: '2025-12-20 10:30:00',
        type: '温度异常',
        level: '警告',
        status: '已处理',
        snapshot: 'snapshot_001.jpg',
        source: 'AI',
        operator: 'AI系统'
      },
      {
        id: 'ah002',
        time: '2025-12-19 15:45:00',
        type: '压力超标',
        level: '报警',
        status: '已处理',
        snapshot: 'snapshot_002.jpg',
        source: 'SENSOR',
        operator: '传感器'
      },
      {
        id: 'ah003',
        time: '2025-12-18 11:20:00',
        type: '泄漏检测',
        level: '紧急',
        status: '已处理',
        snapshot: 'snapshot_003.jpg',
        source: 'AI',
        operator: 'AI系统'
      }
    ],
    relatedSpares: [
      {
        id: 'sp001',
        name: '密封圈',
        code: 'SP-001',
        inventory: 15,
        min_inventory: 5
      },
      {
        id: 'sp002',
        name: '电机轴承',
        code: 'SP-002',
        inventory: 3,
        min_inventory: 2
      }
    ],
    relatedDocuments: [
      {
        id: 'doc001',
        name: '高压反应釜操作规程',
        type: 'SOP',
        update_time: '2025-11-10 10:00:00'
      },
      {
        id: 'doc002',
        name: '应急预案-反应釜泄漏',
        type: '预案',
        update_time: '2025-11-15 14:30:00'
      }
    ]
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
    factory_number: 'F2025002',
    model: 'HSC-8000',
    supplier: '中核设备制造有限公司',
    purchase_date: '2025-10-20',
    use_date: '2025-10-25',
    expected_life: 12,
    original_value: 85.2,
    security_level: '内部',
    contact_mediums: ['乙醇', '甲醇'],
    related_processes: ['SOP-003'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      {
        id: 'param004',
        name: '最大转速',
        type: '运行参数',
        value: '15000',
        unit: 'rpm',
        status: '1'
      },
      {
        id: 'param005',
        name: '最大容量',
        type: '运行参数',
        value: '4×1000',
        unit: 'ml',
        status: '1'
      }
    ],
    maintenanceRecords: [
      {
        id: 'mr002',
        repair_time: '2025-12-15 10:00:00',
        fault_description: '转子不平衡',
        repair_person: '赵六',
        replaced_parts: '转子',
        result: '已修复',
        duration: '2小时',
        cost: 3200,
        operator: '维修员'
      }
    ],
    calibrationRecords: [
      {
        id: 'cr002',
        instrument_id: 'TC-002',
        last_calibration: '2025-11-25',
        next_calibration: '2026-11-25',
        result: '合格',
        certificate_id: 'CAL-2025-002',
        operator: '校准员'
      }
    ],
    inspectionRecords: [
      {
        id: 'ir002',
        inspection_time: '2025-12-22 08:30:00',
        inspector: '陈七',
        items: '转速传感器、温度传感器',
        result: '正常',
        operator: '巡检员'
      }
    ],
    alarmHistory: [
      {
        id: 'ah004',
        time: '2025-12-22 14:15:00',
        type: '转速异常',
        level: '警告',
        status: '已处理',
        snapshot: 'snapshot_004.jpg',
        source: 'SENSOR',
        operator: '传感器'
      }
    ],
    relatedSpares: [
      {
        id: 'sp003',
        name: '转子',
        code: 'SP-003',
        inventory: 2,
        min_inventory: 1
      },
      {
        id: 'sp004',
        name: '密封垫',
        code: 'SP-004',
        inventory: 20,
        min_inventory: 10
      }
    ],
    relatedDocuments: [
      {
        id: 'doc003',
        name: '高速离心机操作规程',
        type: 'SOP',
        update_time: '2025-10-10 15:20:00'
      }
    ]
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
    factory_number: 'F2025003',
    model: 'GC-2100',
    supplier: '国机集团设备有限公司',
    purchase_date: '2025-09-10',
    use_date: '2025-09-20',
    expected_life: 10,
    original_value: 45.8,
    security_level: '内部',
    contact_mediums: ['有机溶剂', '载气'],
    related_processes: ['SOP-004', 'SOP-005'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg', '维护记录.pdf'],
    equipmentParameter: [
      {
        id: 'param006',
        name: '柱温范围',
        type: '运行参数',
        value: '室温+4℃-450℃',
        unit: '℃',
        status: '1'
      },
      {
        id: 'param007',
        name: '检测器温度',
        type: '运行参数',
        value: '450',
        unit: '℃',
        status: '1'
      },
      {
        id: 'param008',
        name: '载气流量',
        type: '运行参数',
        value: '1-100',
        unit: 'ml/min',
        status: '1'
      },
      {
        id: 'param009',
        name: '进样口温度',
        type: '运行参数',
        value: '300',
        unit: '℃',
        status: '1'
      }
    ],
    maintenanceRecords: [
      {
        id: 'mr003',
        repair_time: '2025-12-18 11:20:00',
        fault_description: '柱温箱温度控制异常',
        repair_person: '刘工',
        replaced_parts: '加热丝',
        result: '已修复',
        duration: '4小时',
        cost: 800,
        operator: '维修员'
      },
      {
        id: 'mr004',
        repair_time: '2025-11-30 15:40:00',
        fault_description: '检测器信号不稳定',
        repair_person: '赵六',
        replaced_parts: '检测器灯丝',
        result: '已修复',
        duration: '2小时',
        cost: 1200,
        operator: '维修员'
      }
    ],
    calibrationRecords: [
      {
        id: 'cr003',
        instrument_id: 'GC-001',
        last_calibration: '2025-12-01',
        next_calibration: '2026-06-01',
        result: '合格',
        certificate_id: 'CAL-2025-003',
        operator: '校准员'
      },
      {
        id: 'cr004',
        instrument_id: 'GC-002',
        last_calibration: '2025-06-15',
        next_calibration: '2025-12-15',
        result: '合格',
        certificate_id: 'CAL-2025-004',
        operator: '校准员'
      }
    ],
    inspectionRecords: [
      {
        id: 'ir003',
        inspection_time: '2025-12-23 08:00:00',
        inspector: '陈七',
        items: '载气压力、温度传感器、进样系统',
        result: '正常',
        operator: '巡检员'
      },
      {
        id: 'ir004',
        inspection_time: '2025-12-16 08:00:00',
        inspector: '陈七',
        items: '色谱柱连接、气路系统',
        result: '正常',
        operator: '巡检员'
      }
    ],
    alarmHistory: [
      {
        id: 'ah005',
        time: '2025-12-23 09:45:00',
        type: '柱温箱温度异常',
        level: '警告',
        status: '已处理',
        snapshot: 'snapshot_005.jpg',
        source: 'SENSOR',
        operator: '传感器'
      },
      {
        id: 'ah006',
        time: '2025-12-18 11:15:00',
        type: '检测器信号异常',
        level: '警告',
        status: '已处理',
        snapshot: 'snapshot_006.jpg',
        source: 'SENSOR',
        operator: '传感器'
      }
    ],
    relatedSpares: [
      {
        id: 'sp005',
        name: '检测器灯丝',
        code: 'SP-005',
        inventory: 5,
        min_inventory: 2
      },
      {
        id: 'sp006',
        name: '色谱柱',
        code: 'SP-006',
        inventory: 3,
        min_inventory: 1
      },
      {
        id: 'sp007',
        name: '进样垫',
        code: 'SP-007',
        inventory: 25,
        min_inventory: 10
      }
    ],
    relatedDocuments: [
      {
        id: 'doc004',
        name: '气相色谱仪操作规程',
        type: 'SOP',
        update_time: '2025-09-15 10:30:00'
      },
      {
        id: 'doc005',
        name: '色谱柱使用与维护指南',
        type: '技术文档',
        update_time: '2025-09-20 14:15:00'
      }
    ]
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
    factory_number: 'F2025004',
    model: 'ET-2000',
    supplier: '自研',
    purchase_date: '2025-08-05',
    use_date: '2025-08-15',
    expected_life: 12,
    original_value: 68.5,
    security_level: '内部',
    contact_mediums: ['有机废气', '酸性气体', '碱性气体'],
    related_processes: ['SOP-006'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      {
        id: 'param010',
        name: '处理风量',
        type: '运行参数',
        value: '10000',
        unit: 'm³/h',
        status: '1'
      },
      {
        id: 'param011',
        name: '处理效率',
        type: '监测参数',
        value: '98',
        unit: '%',
        status: '1'
      },
      {
        id: 'param012',
        name: '阻力损失',
        type: '运行参数',
        value: '1200',
        unit: 'Pa',
        status: '1'
      },
      {
        id: 'param013',
        name: '催化剂寿命',
        type: '安全参数',
        value: '8760',
        unit: 'h',
        status: '1'
      }
    ],
    maintenanceRecords: [
      {
        id: 'mr005',
        repair_time: '2025-12-10 09:00:00',
        fault_description: '风机振动过大',
        repair_person: '李四',
        replaced_parts: '风机轴承',
        result: '已修复',
        duration: '6小时',
        cost: 2400,
        operator: '维修员'
      },
      {
        id: 'mr006',
        repair_time: '2025-11-05 14:30:00',
        fault_description: '喷淋系统堵塞',
        repair_person: '张三',
        replaced_parts: '喷嘴组件',
        result: '已修复',
        duration: '4小时',
        cost: 1200,
        operator: '维修员'
      }
    ],
    calibrationRecords: [
      {
        id: 'cr005',
        instrument_id: 'FG-001',
        last_calibration: '2025-11-10',
        next_calibration: '2026-05-10',
        result: '合格',
        certificate_id: 'CAL-2025-005',
        operator: '校准员'
      }
    ],
    inspectionRecords: [
      {
        id: 'ir005',
        inspection_time: '2025-12-24 08:30:00',
        inspector: '王五',
        items: '废气浓度、风机运行状态、喷淋系统',
        result: '异常',
        operator: '巡检员'
      },
      {
        id: 'ir006',
        inspection_time: '2025-12-17 08:30:00',
        inspector: '王五',
        items: '废气浓度、风机运行状态、喷淋系统',
        result: '正常',
        operator: '巡检员'
      }
    ],
    alarmHistory: [
      {
        id: 'ah007',
        time: '2025-12-24 16:20:00',
        type: '废气浓度超标',
        level: '报警',
        status: '处理中',
        snapshot: 'snapshot_007.jpg',
        source: 'SENSOR',
        operator: '传感器'
      },
      {
        id: 'ah008',
        time: '2025-12-10 11:30:00',
        type: '风机振动异常',
        level: '警告',
        status: '已处理',
        snapshot: 'snapshot_008.jpg',
        source: 'SENSOR',
        operator: '传感器'
      }
    ],
    relatedSpares: [
      {
        id: 'sp008',
        name: '风机轴承',
        code: 'SP-008',
        inventory: 4,
        min_inventory: 2
      },
      {
        id: 'sp009',
        name: '喷嘴组件',
        code: 'SP-009',
        inventory: 6,
        min_inventory: 3
      },
      {
        id: 'sp010',
        name: '催化剂',
        code: 'SP-010',
        inventory: 2,
        min_inventory: 1
      }
    ],
    relatedDocuments: [
      {
        id: 'doc006',
        name: '废气处理塔操作规程',
        type: 'SOP',
        update_time: '2025-08-10 09:00:00'
      },
      {
        id: 'doc007',
        name: '废气处理应急预案',
        type: '预案',
        update_time: '2025-08-15 14:00:00'
      }
    ]
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
    factory_number: 'F2025005',
    model: 'VF-2000',
    supplier: '示例地区九院设备厂',
    purchase_date: '2025-07-20',
    use_date: '2025-07-25',
    expected_life: 10,
    original_value: 15.6,
    security_level: '公开',
    contact_mediums: ['实验气体', '有机溶剂蒸汽'],
    related_processes: ['SOP-007'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      {
        id: 'param014',
        name: '排风量',
        type: '运行参数',
        value: '800',
        unit: 'm³/h',
        status: '1'
      },
      {
        id: 'param015',
        name: '面风速',
        type: '监测参数',
        value: '0.5',
        unit: 'm/s',
        status: '1'
      },
      {
        id: 'param016',
        name: '噪音',
        type: '安全参数',
        value: '≤65',
        unit: 'dB',
        status: '1'
      }
    ],
    maintenanceRecords: [
      {
        id: 'mr007',
        repair_time: '2025-12-01 10:00:00',
        fault_description: '风机异响',
        repair_person: '刘工',
        replaced_parts: '风机叶片',
        result: '已修复',
        duration: '2小时',
        cost: 600,
        operator: '维修员'
      }
    ],
    calibrationRecords: [
      {
        id: 'cr006',
        instrument_id: 'VF-001',
        last_calibration: '2025-11-05',
        next_calibration: '2026-05-05',
        result: '合格',
        certificate_id: 'CAL-2025-006',
        operator: '校准员'
      }
    ],
    inspectionRecords: [
      {
        id: 'ir007',
        inspection_time: '2025-12-25 09:00:00',
        inspector: '赵六',
        items: '面风速、排风量、电气安全',
        result: '正常',
        operator: '巡检员'
      },
      {
        id: 'ir008',
        inspection_time: '2025-12-18 09:00:00',
        inspector: '赵六',
        items: '面风速、排风量、电气安全',
        result: '正常',
        operator: '巡检员'
      }
    ],
    alarmHistory: [
      {
        id: 'ah009',
        time: '2025-12-15 14:20:00',
        type: '排风量不足',
        level: '警告',
        status: '已处理',
        snapshot: 'snapshot_009.jpg',
        source: 'SENSOR',
        operator: '传感器'
      }
    ],
    relatedSpares: [
      {
        id: 'sp011',
        name: '风机叶片',
        code: 'SP-011',
        inventory: 8,
        min_inventory: 3
      },
      {
        id: 'sp012',
        name: '过滤网',
        code: 'SP-012',
        inventory: 12,
        min_inventory: 5
      }
    ],
    relatedDocuments: [
      {
        id: 'doc008',
        name: '通风柜操作规程',
        type: 'SOP',
        update_time: '2025-07-25 10:00:00'
      }
    ]
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
    factory_number: 'F2025006',
    model: 'DT-5000',
    supplier: '中核设备制造有限公司',
    purchase_date: '2025-10-01',
    use_date: '2025-10-10',
    expected_life: 20,
    original_value: 200.8,
    security_level: '内部',
    contact_mediums: ['乙醇', '甲醇', '丙酮'],
    related_processes: ['SOP-001', 'SOP-003'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      { id: 'param017', name: '塔板数', type: '运行参数', value: '30', unit: '层', status: '1' },
      { id: 'param018', name: '操作压力', type: '运行参数', value: '0.1-0.5', unit: 'MPa', status: '1' },
      { id: 'param019', name: '操作温度', type: '运行参数', value: '50-150', unit: '℃', status: '1' }
    ],
    maintenanceRecords: [
      { id: 'mr008', repair_time: '2025-12-05 09:00:00', fault_description: '塔板堵塞', repair_person: '李四', replaced_parts: '塔板', result: '已修复', duration: '5小时', cost: 3500, operator: '维修员' }
    ],
    calibrationRecords: [
      { id: 'cr007', instrument_id: 'DT-001', last_calibration: '2025-11-15', next_calibration: '2026-11-15', result: '合格', certificate_id: 'CAL-2025-007', operator: '校准员' }
    ],
    inspectionRecords: [
      { id: 'ir009', inspection_time: '2025-12-20 08:00:00', inspector: '王五', items: '温度传感器、压力表、塔板', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [
      { id: 'ah010', time: '2025-12-18 11:00:00', type: '温度波动', level: '警告', status: '已处理', snapshot: 'snapshot_010.jpg', source: 'SENSOR', operator: '传感器' }
    ],
    relatedSpares: [
      { id: 'sp013', name: '塔板', code: 'SP-013', inventory: 10, min_inventory: 5 },
      { id: 'sp014', name: '填料', code: 'SP-014', inventory: 50, min_inventory: 20 }
    ],
    relatedDocuments: [
      { id: 'doc009', name: '蒸馏塔操作规程', type: 'SOP', update_time: '2025-10-05 09:00:00' }
    ]
  },
  {
    id: 'equip007',
    name: '换热器 HE-201',
    equipment_code: 'CHEM-PROC-007',
    equipment_category: '反应设备',
    equipment_type: '换热器',
    equipment_level: '重要设备',
    manufacturer: '国机集团设备有限公司',
    description: '用于化学工艺过程中的热量交换，提高能源利用效率',
    status: 'normal',
    health_index: 85,
    department: '化学合成部',
    location: 'A栋1层104室',
    responsible_person: '李四',
    last_alarm_time: '',
    last_alarm_type: '',
    create_time: '2025-11-15 14:00:00',
    update_time: '2025-11-15 14:00:00',
    factory_number: 'F2025007',
    model: 'HE-3000',
    supplier: '国机集团设备有限公司',
    purchase_date: '2025-09-20',
    use_date: '2025-09-25',
    expected_life: 15,
    original_value: 95.5,
    security_level: '内部',
    contact_mediums: ['水', '蒸汽'],
    related_processes: ['SOP-002'],
    documents: ['设备图纸.pdf', '操作手册.doc'],
    equipmentParameter: [
      { id: 'param020', name: '换热面积', type: '运行参数', value: '50', unit: 'm²', status: '1' },
      { id: 'param021', name: '设计压力', type: '安全参数', value: '1.6', unit: 'MPa', status: '1' }
    ],
    maintenanceRecords: [],
    calibrationRecords: [],
    inspectionRecords: [
      { id: 'ir010', inspection_time: '2025-12-22 08:00:00', inspector: '陈七', items: '压力表、温度计', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [],
    relatedSpares: [
      { id: 'sp015', name: '密封垫', code: 'SP-015', inventory: 30, min_inventory: 10 }
    ],
    relatedDocuments: [
      { id: 'doc010', name: '换热器操作规程', type: 'SOP', update_time: '2025-09-25 10:00:00' }
    ]
  },
  {
    id: 'equip008',
    name: '储罐 TK-301',
    equipment_code: 'CHEM-STOR-008',
    equipment_category: '辅助设备',
    equipment_type: '储罐',
    equipment_level: '重要设备',
    manufacturer: '示例地区九院设备厂',
    description: '用于存储化学原料和产品的储罐，具有防腐和密封功能',
    status: 'normal',
    health_index: 88,
    department: '化学合成部',
    location: 'A栋外储罐区',
    responsible_person: '王五',
    last_alarm_time: '2025-12-10 15:30:00',
    last_alarm_type: '液位异常',
    create_time: '2025-10-20 09:00:00',
    update_time: '2025-10-20 09:00:00',
    factory_number: 'F2025008',
    model: 'TK-10000',
    supplier: '示例地区九院设备厂',
    purchase_date: '2025-08-15',
    use_date: '2025-08-20',
    expected_life: 25,
    original_value: 150.2,
    security_level: '内部',
    contact_mediums: ['盐酸', '丙酮', '乙醇'],
    related_processes: ['SOP-001'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      { id: 'param022', name: '容量', type: '运行参数', value: '10000', unit: 'L', status: '1' },
      { id: 'param023', name: '工作压力', type: '安全参数', value: '0.3', unit: 'MPa', status: '1' }
    ],
    maintenanceRecords: [
      { id: 'mr009', repair_time: '2025-11-25 10:00:00', fault_description: '密封圈老化', repair_person: '赵六', replaced_parts: '密封圈', result: '已修复', duration: '3小时', cost: 800, operator: '维修员' }
    ],
    calibrationRecords: [],
    inspectionRecords: [
      { id: 'ir011', inspection_time: '2025-12-21 08:00:00', inspector: '王五', items: '液位计、压力表、密封性', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [
      { id: 'ah011', time: '2025-12-10 15:30:00', type: '液位异常', level: '警告', status: '已处理', snapshot: 'snapshot_011.jpg', source: 'SENSOR', operator: '传感器' }
    ],
    relatedSpares: [
      { id: 'sp016', name: '密封圈', code: 'SP-016', inventory: 20, min_inventory: 8 }
    ],
    relatedDocuments: [
      { id: 'doc011', name: '储罐操作规程', type: 'SOP', update_time: '2025-08-20 09:00:00' }
    ]
  },
  {
    id: 'equip009',
    name: '离心泵 CP-401',
    equipment_code: 'CHEM-PUMP-009',
    equipment_category: '动力设备',
    equipment_type: '泵',
    equipment_level: '一般设备',
    manufacturer: '中核设备制造有限公司',
    description: '用于输送化学液体的离心泵，具有耐腐蚀性能',
    status: 'running',
    health_index: 82,
    department: '化学合成部',
    location: 'A栋1层105室',
    responsible_person: '陈七',
    last_alarm_time: '2025-12-19 10:15:00',
    last_alarm_type: '流量异常',
    create_time: '2025-10-25 11:00:00',
    update_time: '2025-10-25 11:00:00',
    factory_number: 'F2025009',
    model: 'CP-200',
    supplier: '中核设备制造有限公司',
    purchase_date: '2025-08-10',
    use_date: '2025-08-15',
    expected_life: 10,
    original_value: 25.6,
    security_level: '公开',
    contact_mediums: ['水', '有机溶剂'],
    related_processes: ['SOP-002'],
    documents: ['设备图纸.pdf', '操作手册.doc'],
    equipmentParameter: [
      { id: 'param024', name: '流量', type: '运行参数', value: '50', unit: 'm³/h', status: '1' },
      { id: 'param025', name: '扬程', type: '运行参数', value: '30', unit: 'm', status: '1' }
    ],
    maintenanceRecords: [
      { id: 'mr010', repair_time: '2025-12-08 14:00:00', fault_description: '轴承磨损', repair_person: '刘工', replaced_parts: '轴承', result: '已修复', duration: '2小时', cost: 1200, operator: '维修员' }
    ],
    calibrationRecords: [],
    inspectionRecords: [
      { id: 'ir012', inspection_time: '2025-12-23 08:00:00', inspector: '赵六', items: '流量计、压力表、轴承', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [
      { id: 'ah012', time: '2025-12-19 10:15:00', type: '流量异常', level: '警告', status: '已处理', snapshot: 'snapshot_012.jpg', source: 'SENSOR', operator: '传感器' }
    ],
    relatedSpares: [
      { id: 'sp017', name: '轴承', code: 'SP-017', inventory: 15, min_inventory: 5 },
      { id: 'sp018', name: '机械密封', code: 'SP-018', inventory: 8, min_inventory: 3 }
    ],
    relatedDocuments: [
      { id: 'doc012', name: '离心泵操作规程', type: 'SOP', update_time: '2025-08-15 10:00:00' }
    ]
  },
  {
    id: 'equip010',
    name: '压缩机 COMP-501',
    equipment_code: 'CHEM-COMP-010',
    equipment_category: '动力设备',
    equipment_type: '压缩机',
    equipment_level: '关键设备',
    manufacturer: '国机集团设备有限公司',
    description: '用于压缩气体的压缩机，适用于多种工艺气体',
    status: 'warning',
    health_index: 78,
    department: '化学合成部',
    location: 'A栋1层106室',
    responsible_person: '张三',
    last_alarm_time: '2025-12-22 09:30:00',
    last_alarm_type: '压力异常',
    create_time: '2025-11-05 10:00:00',
    update_time: '2025-11-05 10:00:00',
    factory_number: 'F2025010',
    model: 'COMP-500',
    supplier: '国机集团设备有限公司',
    purchase_date: '2025-09-05',
    use_date: '2025-09-10',
    expected_life: 12,
    original_value: 180.5,
    security_level: '内部',
    contact_mediums: ['实验气体', '载气'],
    related_processes: ['SOP-003'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      { id: 'param026', name: '排气压力', type: '运行参数', value: '0.8', unit: 'MPa', status: '1' },
      { id: 'param027', name: '排气量', type: '运行参数', value: '100', unit: 'm³/min', status: '1' }
    ],
    maintenanceRecords: [
      { id: 'mr011', repair_time: '2025-12-12 11:00:00', fault_description: '活塞环磨损', repair_person: '李四', replaced_parts: '活塞环', result: '已修复', duration: '4小时', cost: 2800, operator: '维修员' }
    ],
    calibrationRecords: [],
    inspectionRecords: [
      { id: 'ir013', inspection_time: '2025-12-24 08:00:00', inspector: '王五', items: '压力表、温度计、振动', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [
      { id: 'ah013', time: '2025-12-22 09:30:00', type: '压力异常', level: '警告', status: '已处理', snapshot: 'snapshot_013.jpg', source: 'SENSOR', operator: '传感器' }
    ],
    relatedSpares: [
      { id: 'sp019', name: '活塞环', code: 'SP-019', inventory: 6, min_inventory: 2 },
      { id: 'sp020', name: '气阀', code: 'SP-020', inventory: 10, min_inventory: 4 }
    ],
    relatedDocuments: [
      { id: 'doc013', name: '压缩机操作规程', type: 'SOP', update_time: '2025-09-10 10:00:00' }
    ]
  },
  {
    id: 'equip011',
    name: '过滤器 FIL-601',
    equipment_code: 'CHEM-FILT-011',
    equipment_category: '分离设备',
    equipment_type: '过滤器',
    equipment_level: '一般设备',
    manufacturer: '自研设备',
    description: '用于过滤化学液体中的杂质，保证产品质量',
    status: 'normal',
    health_index: 92,
    department: '分析检测部',
    location: 'A栋2层202室',
    responsible_person: '李四',
    last_alarm_time: '',
    last_alarm_type: '',
    create_time: '2025-11-20 14:00:00',
    update_time: '2025-11-20 14:00:00',
    factory_number: 'F2025011',
    model: 'FIL-100',
    supplier: '自研',
    purchase_date: '2025-07-15',
    use_date: '2025-07-20',
    expected_life: 8,
    original_value: 18.5,
    security_level: '公开',
    contact_mediums: ['水', '有机溶剂'],
    related_processes: ['SOP-004'],
    documents: ['设备图纸.pdf', '操作手册.doc'],
    equipmentParameter: [
      { id: 'param028', name: '过滤精度', type: '运行参数', value: '0.1', unit: 'μm', status: '1' },
      { id: 'param029', name: '过滤面积', type: '运行参数', value: '2', unit: 'm²', status: '1' }
    ],
    maintenanceRecords: [],
    calibrationRecords: [],
    inspectionRecords: [
      { id: 'ir014', inspection_time: '2025-12-25 08:00:00', inspector: '陈七', items: '过滤膜、压力表', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [],
    relatedSpares: [
      { id: 'sp021', name: '过滤膜', code: 'SP-021', inventory: 25, min_inventory: 10 }
    ],
    relatedDocuments: [
      { id: 'doc014', name: '过滤器操作规程', type: 'SOP', update_time: '2025-07-20 10:00:00' }
    ]
  },
  {
    id: 'equip012',
    name: '干燥器 DRY-701',
    equipment_code: 'CHEM-DRY-012',
    equipment_category: '分离设备',
    equipment_type: '干燥器',
    equipment_level: '重要设备',
    manufacturer: '示例地区九院设备厂',
    description: '用于去除物料中水分的干燥器，适用于多种化学物料',
    status: 'running',
    health_index: 87,
    department: '化学合成部',
    location: 'A栋1层107室',
    responsible_person: '王五',
    last_alarm_time: '2025-12-17 13:20:00',
    last_alarm_type: '温度异常',
    create_time: '2025-10-30 09:00:00',
    update_time: '2025-10-30 09:00:00',
    factory_number: 'F2025012',
    model: 'DRY-2000',
    supplier: '示例地区九院设备厂',
    purchase_date: '2025-08-25',
    use_date: '2025-09-01',
    expected_life: 12,
    original_value: 65.8,
    security_level: '内部',
    contact_mediums: ['有机溶剂'],
    related_processes: ['SOP-002'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      { id: 'param030', name: '工作温度', type: '运行参数', value: '80-120', unit: '℃', status: '1' },
      { id: 'param031', name: '处理能力', type: '运行参数', value: '100', unit: 'kg/h', status: '1' }
    ],
    maintenanceRecords: [
      { id: 'mr012', repair_time: '2025-12-03 10:00:00', fault_description: '加热元件故障', repair_person: '赵六', replaced_parts: '加热丝', result: '已修复', duration: '3小时', cost: 1500, operator: '维修员' }
    ],
    calibrationRecords: [],
    inspectionRecords: [
      { id: 'ir015', inspection_time: '2025-12-22 08:00:00', inspector: '王五', items: '温度传感器、湿度传感器', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [
      { id: 'ah014', time: '2025-12-17 13:20:00', type: '温度异常', level: '警告', status: '已处理', snapshot: 'snapshot_014.jpg', source: 'SENSOR', operator: '传感器' }
    ],
    relatedSpares: [
      { id: 'sp022', name: '加热丝', code: 'SP-022', inventory: 12, min_inventory: 5 }
    ],
    relatedDocuments: [
      { id: 'doc015', name: '干燥器操作规程', type: 'SOP', update_time: '2025-09-01 10:00:00' }
    ]
  },
  {
    id: 'equip013',
    name: '液相色谱仪 LC-310',
    equipment_code: 'CHEM-ANAL-013',
    equipment_category: '分析仪器',
    equipment_type: '高压液相色谱',
    equipment_level: '关键设备',
    manufacturer: '国机集团设备有限公司',
    description: '用于化学成分分析的高压液相色谱仪，具有高精度检测能力',
    status: 'normal',
    health_index: 91,
    department: '分析检测部',
    location: 'B栋3层302室',
    responsible_person: '王五',
    last_alarm_time: '2025-12-16 14:45:00',
    last_alarm_type: '压力异常',
    create_time: '2025-11-12 10:00:00',
    update_time: '2025-11-12 10:00:00',
    factory_number: 'F2025013',
    model: 'LC-3000',
    supplier: '国机集团设备有限公司',
    purchase_date: '2025-09-15',
    use_date: '2025-09-25',
    expected_life: 10,
    original_value: 95.6,
    security_level: '内部',
    contact_mediums: ['有机溶剂', '载气'],
    related_processes: ['SOP-005'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg', '维护记录.pdf'],
    equipmentParameter: [
      { id: 'param032', name: '最大压力', type: '运行参数', value: '40', unit: 'MPa', status: '1' },
      { id: 'param033', name: '流速范围', type: '运行参数', value: '0.1-10', unit: 'ml/min', status: '1' }
    ],
    maintenanceRecords: [
      { id: 'mr013', repair_time: '2025-12-01 09:00:00', fault_description: '泵头密封泄漏', repair_person: '刘工', replaced_parts: '密封圈', result: '已修复', duration: '2小时', cost: 900, operator: '维修员' }
    ],
    calibrationRecords: [
      { id: 'cr008', instrument_id: 'LC-001', last_calibration: '2025-11-20', next_calibration: '2026-05-20', result: '合格', certificate_id: 'CAL-2025-008', operator: '校准员' }
    ],
    inspectionRecords: [
      { id: 'ir016', inspection_time: '2025-12-23 08:00:00', inspector: '陈七', items: '压力传感器、流量计、检测器', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [
      { id: 'ah015', time: '2025-12-16 14:45:00', type: '压力异常', level: '警告', status: '已处理', snapshot: 'snapshot_015.jpg', source: 'SENSOR', operator: '传感器' }
    ],
    relatedSpares: [
      { id: 'sp023', name: '密封圈', code: 'SP-023', inventory: 20, min_inventory: 8 },
      { id: 'sp024', name: '色谱柱', code: 'SP-024', inventory: 5, min_inventory: 2 }
    ],
    relatedDocuments: [
      { id: 'doc016', name: '液相色谱仪操作规程', type: 'SOP', update_time: '2025-09-25 10:00:00' }
    ]
  },
  {
    id: 'equip014',
    name: '质谱仪 MS-410',
    equipment_code: 'CHEM-ANAL-014',
    equipment_category: '分析仪器',
    equipment_type: '质谱仪',
    equipment_level: '关键设备',
    manufacturer: '国机集团设备有限公司',
    description: '用于化学成分分析的质谱仪，具有高精度分子量检测能力',
    status: 'warning',
    health_index: 76,
    department: '分析检测部',
    location: 'B栋3层303室',
    responsible_person: '王五',
    last_alarm_time: '2025-12-21 11:00:00',
    last_alarm_type: '真空度异常',
    create_time: '2025-10-15 14:00:00',
    update_time: '2025-10-15 14:00:00',
    factory_number: 'F2025014',
    model: 'MS-4000',
    supplier: '国机集团设备有限公司',
    purchase_date: '2025-08-20',
    use_date: '2025-09-01',
    expected_life: 12,
    original_value: 280.5,
    security_level: '秘密',
    contact_mediums: ['载气', '实验气体'],
    related_processes: ['SOP-005'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      { id: 'param034', name: '质量范围', type: '运行参数', value: '1-2000', unit: 'Da', status: '1' },
      { id: 'param035', name: '分辨率', type: '运行参数', value: '10000', unit: '', status: '1' }
    ],
    maintenanceRecords: [
      { id: 'mr014', repair_time: '2025-12-06 10:00:00', fault_description: '真空泵故障', repair_person: '李四', replaced_parts: '真空泵', result: '已修复', duration: '6小时', cost: 4500, operator: '维修员' }
    ],
    calibrationRecords: [
      { id: 'cr009', instrument_id: 'MS-001', last_calibration: '2025-11-10', next_calibration: '2026-05-10', result: '合格', certificate_id: 'CAL-2025-009', operator: '校准员' }
    ],
    inspectionRecords: [
      { id: 'ir017', inspection_time: '2025-12-24 08:00:00', inspector: '陈七', items: '真空度、离子源、检测器', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [
      { id: 'ah016', time: '2025-12-21 11:00:00', type: '真空度异常', level: '警告', status: '已处理', snapshot: 'snapshot_016.jpg', source: 'SENSOR', operator: '传感器' }
    ],
    relatedSpares: [
      { id: 'sp025', name: '真空泵', code: 'SP-025', inventory: 2, min_inventory: 1 },
      { id: 'sp026', name: '离子源', code: 'SP-026', inventory: 3, min_inventory: 1 }
    ],
    relatedDocuments: [
      { id: 'doc017', name: '质谱仪操作规程', type: 'SOP', update_time: '2025-09-01 10:00:00' }
    ]
  },
  {
    id: 'equip015',
    name: '核磁共振仪 NMR-510',
    equipment_code: 'CHEM-ANAL-015',
    equipment_category: '分析仪器',
    equipment_type: '核磁共振仪',
    equipment_level: '关键设备',
    manufacturer: '国机集团设备有限公司',
    description: '用于分子结构分析的核磁共振仪，具有高分辨率检测能力',
    status: 'normal',
    health_index: 93,
    department: '分析检测部',
    location: 'B栋3层304室',
    responsible_person: '王五',
    last_alarm_time: '',
    last_alarm_type: '',
    create_time: '2025-09-20 10:00:00',
    update_time: '2025-09-20 10:00:00',
    factory_number: 'F2025015',
    model: 'NMR-500',
    supplier: '国机集团设备有限公司',
    purchase_date: '2025-07-10',
    use_date: '2025-07-20',
    expected_life: 15,
    original_value: 350.8,
    security_level: '秘密',
    contact_mediums: ['载气'],
    related_processes: ['SOP-005'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      { id: 'param036', name: '磁场强度', type: '运行参数', value: '400', unit: 'MHz', status: '1' },
      { id: 'param037', name: '分辨率', type: '运行参数', value: '0.1', unit: 'Hz', status: '1' }
    ],
    maintenanceRecords: [],
    calibrationRecords: [
      { id: 'cr010', instrument_id: 'NMR-001', last_calibration: '2025-11-01', next_calibration: '2026-05-01', result: '合格', certificate_id: 'CAL-2025-010', operator: '校准员' }
    ],
    inspectionRecords: [
      { id: 'ir018', inspection_time: '2025-12-25 08:00:00', inspector: '陈七', items: '磁场稳定性、探头', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [],
    relatedSpares: [
      { id: 'sp027', name: '探头', code: 'SP-027', inventory: 2, min_inventory: 1 }
    ],
    relatedDocuments: [
      { id: 'doc018', name: '核磁共振仪操作规程', type: 'SOP', update_time: '2025-07-20 10:00:00' }
    ]
  },
  {
    id: 'equip016',
    name: '液氨储罐 TK-801',
    equipment_code: 'CHEM-STOR-016',
    equipment_category: '辅助设备',
    equipment_type: '储罐',
    equipment_level: '关键设备',
    manufacturer: '示例地区九院设备厂',
    description: '用于存储液氨的低温储罐，带有紧急切断和泄漏检测系统',
    status: 'normal',
    health_index: 89,
    department: '生产部',
    location: 'C栋外储罐区北侧',
    responsible_person: '张三',
    last_alarm_time: '2025-12-20 16:45:00',
    last_alarm_type: '液位高报警',
    create_time: '2025-10-10 09:00:00',
    update_time: '2025-10-10 09:00:00',
    factory_number: 'F2025016',
    model: 'TK-15000L',
    supplier: '示例地区九院设备厂',
    purchase_date: '2025-06-15',
    use_date: '2025-07-01',
    expected_life: 20,
    original_value: 280.0,
    security_level: '机密',
    contact_mediums: ['液氨', '氨气'],
    related_processes: ['SOP-008'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg', '安全操作规程.pdf'],
    equipmentParameter: [
      { id: 'param038', name: '容积', type: '运行参数', value: '15000', unit: 'L', status: '1' },
      { id: 'param039', name: '工作温度', type: '安全参数', value: '-33.3', unit: '℃', status: '1' },
      { id: 'param040', name: '工作压力', type: '安全参数', value: '1.6', unit: 'MPa', status: '1' },
      { id: 'param041', name: '设计压力', type: '安全参数', value: '2.0', unit: 'MPa', status: '1' }
    ],
    maintenanceRecords: [
      { id: 'mr015', repair_time: '2025-11-15 14:00:00', fault_description: '安全阀泄漏', repair_person: '李四', replaced_parts: '安全阀密封件', result: '已修复', duration: '2小时', cost: 1800, operator: '维修员' }
    ],
    calibrationRecords: [
      { id: 'cr011', instrument_id: 'LT-001', last_calibration: '2025-11-20', next_calibration: '2026-05-20', result: '合格', certificate_id: 'CAL-2025-011', operator: '校准员' },
      { id: 'cr012', instrument_id: 'PT-002', last_calibration: '2025-11-20', next_calibration: '2026-05-20', result: '合格', certificate_id: 'CAL-2025-012', operator: '校准员' }
    ],
    inspectionRecords: [
      { id: 'ir019', inspection_time: '2025-12-26 08:30:00', inspector: '王五', items: '液位计、压力表、安全阀、紧急切断阀', result: '正常', operator: '巡检员' },
      { id: 'ir020', inspection_time: '2025-12-19 08:30:00', inspector: '王五', items: '液位计、压力表、安全阀、紧急切断阀', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [
      { id: 'ah017', time: '2025-12-20 16:45:00', type: '液位高报警', level: '报警', status: '已处理', snapshot: 'snapshot_017.jpg', source: 'SENSOR', operator: '传感器' },
      { id: 'ah018', time: '2025-12-15 10:20:00', type: '压力异常', level: '警告', status: '已处理', snapshot: 'snapshot_018.jpg', source: 'SENSOR', operator: '传感器' }
    ],
    relatedSpares: [
      { id: 'sp028', name: '安全阀', code: 'SP-028', inventory: 3, min_inventory: 1 },
      { id: 'sp029', name: '紧急切断阀', code: 'SP-029', inventory: 2, min_inventory: 1 },
      { id: 'sp030', name: '液位计', code: 'SP-030', inventory: 2, min_inventory: 1 }
    ],
    relatedDocuments: [
      { id: 'doc019', name: '液氨储罐安全操作规程', type: 'SOP', update_time: '2025-06-20 10:00:00' },
      { id: 'doc020', name: '液氨泄漏应急预案', type: '预案', update_time: '2025-07-05 14:00:00' }
    ]
  },
  {
    id: 'equip017',
    name: '高温炉 TF-901',
    equipment_code: 'MATERIAL-PROC-017',
    equipment_category: '反应设备',
    equipment_type: '高温炉',
    equipment_level: '重要设备',
    manufacturer: '国机集团设备有限公司',
    description: '用于材料烧结和热处理的高温炉，最高温度可达1800℃，具有精确温度控制功能',
    status: 'running',
    health_index: 84,
    department: '材料研发部',
    location: 'D栋高温实验室',
    responsible_person: '李四',
    last_alarm_time: '2025-12-25 13:30:00',
    last_alarm_type: '超温报警',
    create_time: '2025-11-25 10:00:00',
    update_time: '2025-11-25 10:00:00',
    factory_number: 'F2025017',
    model: 'TF-1800',
    supplier: '国机集团设备有限公司',
    purchase_date: '2025-08-30',
    use_date: '2025-09-05',
    expected_life: 12,
    original_value: 125.5,
    security_level: '内部',
    contact_mediums: ['高温材料', '保护气体'],
    related_processes: ['SOP-009', 'SOP-010'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg'],
    equipmentParameter: [
      { id: 'param042', name: '最高温度', type: '运行参数', value: '1800', unit: '℃', status: '1' },
      { id: 'param043', name: '工作温度范围', type: '运行参数', value: '室温-1800', unit: '℃', status: '1' },
      { id: 'param044', name: '升温速率', type: '运行参数', value: '1-30', unit: '℃/min', status: '1' },
      { id: 'param045', name: '恒温精度', type: '运行参数', value: '±2', unit: '℃', status: '1' }
    ],
    maintenanceRecords: [
      { id: 'mr016', repair_time: '2025-12-05 09:30:00', fault_description: '加热元件老化', repair_person: '赵六', replaced_parts: '加热元件', result: '已修复', duration: '4小时', cost: 3500, operator: '维修员' }
    ],
    calibrationRecords: [
      { id: 'cr013', instrument_id: 'TC-003', last_calibration: '2025-12-01', next_calibration: '2026-06-01', result: '合格', certificate_id: 'CAL-2025-013', operator: '校准员' }
    ],
    inspectionRecords: [
      { id: 'ir021', inspection_time: '2025-12-26 09:00:00', inspector: '陈七', items: '温度传感器、加热元件、保温层', result: '正常', operator: '巡检员' },
      { id: 'ir022', inspection_time: '2025-12-19 09:00:00', inspector: '陈七', items: '温度传感器、加热元件、保温层', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [
      { id: 'ah019', time: '2025-12-25 13:30:00', type: '超温报警', level: '警告', status: '已处理', snapshot: 'snapshot_019.jpg', source: 'SENSOR', operator: '传感器' },
      { id: 'ah020', time: '2025-12-12 15:45:00', type: '温度偏差', level: '警告', status: '已处理', snapshot: 'snapshot_020.jpg', source: 'SENSOR', operator: '传感器' }
    ],
    relatedSpares: [
      { id: 'sp031', name: '加热元件', code: 'SP-031', inventory: 4, min_inventory: 2 },
      { id: 'sp032', name: '温度传感器', code: 'SP-032', inventory: 6, min_inventory: 2 },
      { id: 'sp033', name: '保温材料', code: 'SP-033', inventory: 10, min_inventory: 3 }
    ],
    relatedDocuments: [
      { id: 'doc021', name: '高温炉操作规程', type: 'SOP', update_time: '2025-09-05 10:00:00' },
      { id: 'doc022', name: '高温作业安全操作规程', type: 'SOP', update_time: '2025-09-05 10:00:00' }
    ]
  },
  {
    id: 'equip018',
    name: '自动化包装线 AP-1001',
    equipment_code: 'PACK-PROC-018',
    equipment_category: '辅助设备',
    equipment_type: '包装设备',
    equipment_level: '重要设备',
    manufacturer: '中核设备制造有限公司',
    description: '自动化产品包装生产线，集成了称重、灌装、封口、贴标等功能',
    status: 'warning',
    health_index: 77,
    department: '生产部',
    location: 'E栋包装车间',
    responsible_person: '陈七',
    last_alarm_time: '2025-12-26 10:15:00',
    last_alarm_type: '传送带卡料',
    create_time: '2025-10-05 14:00:00',
    update_time: '2025-10-05 14:00:00',
    factory_number: 'F2025018',
    model: 'AP-2000',
    supplier: '中核设备制造有限公司',
    purchase_date: '2025-07-20',
    use_date: '2025-08-01',
    expected_life: 15,
    original_value: 420.0,
    security_level: '内部',
    contact_mediums: ['包装材料', '产品物料'],
    related_processes: ['SOP-011', 'SOP-012'],
    documents: ['设备图纸.pdf', '操作手册.doc', '合格证.jpg', '电气原理图.pdf'],
    equipmentParameter: [
      { id: 'param046', name: '生产能力', type: '运行参数', value: '120', unit: '包/分钟', status: '1' },
      { id: 'param047', name: '称重精度', type: '监测参数', value: '±0.1', unit: 'g', status: '1' },
      { id: 'param048', name: '电源功率', type: '运行参数', value: '15', unit: 'kW', status: '1' },
      { id: 'param049', name: '压缩空气压力', type: '运行参数', value: '0.6', unit: 'MPa', status: '1' }
    ],
    maintenanceRecords: [
      { id: 'mr017', repair_time: '2025-12-10 13:00:00', fault_description: '灌装头堵塞', repair_person: '刘工', replaced_parts: '灌装头密封圈', result: '已修复', duration: '3小时', cost: 950, operator: '维修员' },
      { id: 'mr018', repair_time: '2025-11-20 15:30:00', fault_description: '贴标机故障', repair_person: '赵六', replaced_parts: '贴标机轴承', result: '已修复', duration: '2小时', cost: 1200, operator: '维修员' }
    ],
    calibrationRecords: [
      { id: 'cr014', instrument_id: 'WGT-001', last_calibration: '2025-11-25', next_calibration: '2026-05-25', result: '合格', certificate_id: 'CAL-2025-014', operator: '校准员' }
    ],
    inspectionRecords: [
      { id: 'ir023', inspection_time: '2025-12-26 08:00:00', inspector: '王五', items: '称重系统、灌装精度、传送带运行', result: '异常', operator: '巡检员' },
      { id: 'ir024', inspection_time: '2025-12-19 08:00:00', inspector: '王五', items: '称重系统、灌装精度、传送带运行', result: '正常', operator: '巡检员' }
    ],
    alarmHistory: [
      { id: 'ah021', time: '2025-12-26 10:15:00', type: '传送带卡料', level: '警告', status: '处理中', snapshot: 'snapshot_021.jpg', source: 'SENSOR', operator: '传感器' },
      { id: 'ah022', time: '2025-12-20 14:20:00', type: '称重超差', level: '警告', status: '已处理', snapshot: 'snapshot_022.jpg', source: 'SENSOR', operator: '传感器' }
    ],
    relatedSpares: [
      { id: 'sp034', name: '灌装头密封圈', code: 'SP-034', inventory: 15, min_inventory: 5 },
      { id: 'sp035', name: '传送带', code: 'SP-035', inventory: 3, min_inventory: 1 },
      { id: 'sp036', name: '贴标机轴承', code: 'SP-036', inventory: 8, min_inventory: 3 }
    ],
    relatedDocuments: [
      { id: 'doc023', name: '自动化包装线操作规程', type: 'SOP', update_time: '2025-08-01 10:00:00' },
      { id: 'doc024', name: '包装设备维护保养手册', type: '技术文档', update_time: '2025-08-01 10:00:00' }
    ]
  },
];

 