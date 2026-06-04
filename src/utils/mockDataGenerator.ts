/**
 * 综合风险研判模拟数据生成器
 * 用于在没有后端接口的情况下生成模拟数据
 */

import dayjs from 'dayjs';

/**
 * 生成指定范围内的随机整数
 */
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 生成指定范围内的随机浮点数
 */
export const randomFloat = (min: number, max: number, decimals = 1) => {
  const num = Math.random() * (max - min) + min;
  return Number(num.toFixed(decimals));
};

/**
 * 从数组中随机选择一个元素
 */
export const randomChoice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * 生成日期范围内的数据点
 */
export const generateDateRange = (startDate: string, endDate: string, format = 'YYYY-MM-DD'): string[] => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const dates: string[] = [];

  let current = start;
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    dates.push(current.format(format));
    current = current.add(1, 'day');
  }

  return dates;
};

/**
 * 模拟数据生成器配置
 */
const MOCK_CONFIG = {
  // 告警类型
  alarmTypes: ['安全帽', '工服', '入侵', '火焰', '烟雾', '离岗', '睡觉', '计数'],
  // 区域名称
  regionNames: ['厂区A区', '厂区B区', '厂区C区', '厂区D区'],
  // 部门名称
  departmentNames: ['生产部', '设备部', '仓储部', '质检部', '安环部'],
  // 人员姓名
  personNames: ['张三', '李四', '王五', '赵六', '钱七', '孙八', 'Maintainer九', '吴十'],
  // 作业类型
  operationTypes: ['动火作业', '受限空间作业', '高处作业', '吊装作业', '临时用电'],
  // 作业风险等级
  operationRiskLevels: ['高', '中', '低'],
  // 预警级别
  warningLevels: ['一级', '二级', '三级'],
  // 预警类别
  warningCategories: ['设备预警', '环境预警', '作业预警'],
  // 违规行为类型
  violationTypes: ['未佩戴安全帽', '未穿工服', '离岗脱岗', '违规操作', '吸烟', '玩手机'],
  // 风险等级
  riskLevels: ['low', 'medium', 'high', 'critical'],
  // 风险等级中文
  riskLevelNames: ['低风险', '中风险', '高风险', '重大风险'],
};

/**
 * 生成告警趋势数据
 */
export const generateAlarmTrend = (dates: string[]) => {
  return dates.map(date => ({
    date,
    count: randomInt(20, 60)
  }));
};

/**
 * 生成按类型分组的统计数据
 */
export const generateByTypeStats = (types: string[], baseCount: number) => {
  const total = types.reduce((sum, type) => {
    const count = randomInt(baseCount * 0.7, baseCount * 1.3);
    return sum + count;
  }, 0);

  return types.map(type => {
    const count = randomInt(baseCount * 0.7, baseCount * 1.3);
    return {
      type,
      count,
      percentage: Number(((count / total) * 100).toFixed(1))
    };
  });
};

/**
 * 生成按区域分组的统计数据
 */
export const generateByRegionStats = (regions: string[], baseCount: number) => {
  const total = regions.length * baseCount;

  return regions.map(region => {
    const count = randomInt(baseCount * 0.5, baseCount * 1.5);
    return {
      region_name: region,
      count,
      percentage: Number(((count / total) * 100).toFixed(1))
    };
  });
};

/**
 * 生成违规人员统计
 */
export const generatePersonViolationStats = () => {
  const count = randomInt(5, 10);
  return Array.from({ length: count }, (_, index) => ({
    person_name: MOCK_CONFIG.personNames[index % MOCK_CONFIG.personNames.length],
    violation_count: randomInt(3, 10),
    department: randomChoice(MOCK_CONFIG.departmentNames)
  }));
};

/**
 * 生成培训效果数据
 */
export const generateTrainingEffectiveness = () => {
  const remaining = 100;
  const excellent = randomInt(25, 40);
  const good = randomInt(30, 45);
  const pass = randomInt(15, 25);
  const fail = 100 - excellent - good - pass;

  return {
    excellent,
    good,
    pass,
    fail
  };
};

/**
 * 生成证书状态统计
 */
export const generateCertificationStatus = () => {
  const total = randomInt(200, 300);
  const valid_count = Math.floor(total * randomFloat(0.85, 0.95));
  const expired_count = Math.floor(total * randomFloat(0.02, 0.08));
  const expiring_soon_count = total - valid_count - expired_count;

  return {
    valid_count,
    expired_count,
    expiring_soon_count,
    total_count: total
  };
};

/**
 * 生成综合风险研判模拟数据
 */
export const generateMockRiskAnalysisData = (params: {
  region_id?: string;
  start_date: string;
  end_date: string;
  time_granularity?: string;
  include_dimensions?: string;
}) => {
  const { start_date, end_date } = params;
  const dates = generateDateRange(start_date, end_date);

  // 生成汇总数据
  const total_alarm_count = dates.length * randomInt(30, 50);
  const total_warning_count = randomInt(50, 100);
  const total_hidden_danger_count = randomInt(30, 60);
  const total_violation_count = randomInt(180, 300);
  const total_operation_count = randomInt(60, 100);
  const risk_score = randomFloat(60, 85);

  // 根据风险评分确定风险等级
  let risk_level = 'low';
  if (risk_score >= 80) risk_level = 'critical';
  else if (risk_score >= 70) risk_level = 'high';
  else if (risk_score >= 60) risk_level = 'medium';

  // 构建响应数据
  const data = {
    // 行为分析
    behavior_analysis: (() => {
      const total_meetings = dates.length * randomInt(4, 6);
      const qualification_rate = randomFloat(90, 98);

      return {
        violation_trend: dates.slice(-7).map(date => ({ // 最近7天违规趋势
          date, // 日期
          count: randomInt(5, 15) // 违规次数
        })),
        violation_by_type: generateByTypeStats(MOCK_CONFIG.violationTypes, 40), // 按类型统计违规情况
        violation_by_person: generatePersonViolationStats(), // 按人员统计违规情况
        shift_meeting_stats: { // 班前会统计
          total_meetings, // 总会议数
          qualified_meetings: Math.floor(total_meetings * (qualification_rate / 100)), // 合格会议数
          qualification_rate, // 合格率（%）
          average_participation: randomFloat(92, 98) // 平均参会率（%）
        }
      };
    })(),

    // 培训分析
    training_analysis: {
      training_coverage: randomFloat(80, 95), // 培训覆盖率（%）
      training_effectiveness: generateTrainingEffectiveness(), // 培训效果评估
      certification_status: generateCertificationStatus(), // 资质证书状态
      training_by_department: MOCK_CONFIG.departmentNames.map(dept => ({ // 各部门培训情况
        department: dept, // 部门名称
        coverage: randomFloat(80, 95), // 培训覆盖率（%）
        avg_score: randomFloat(75, 90) // 平均培训成绩
      }))
    },

    // 设备分析
    equipment_analysis: {
      device_online_rate: randomFloat(92, 98), // 设备在线率（%）
      device_failure_rate: randomFloat(2, 8), // 设备故障率（%）
      equipment_coverage: { // 设备覆盖情况
        camera_coverage: randomFloat(90, 98), // 摄像头覆盖率（%）
        sensor_coverage: randomFloat(85, 92), // 传感器覆盖率（%）
        production_device_coverage: 100 // 生产设备覆盖率（%）
      },
      device_maintenance: (() => {
        const total_maintenance = randomInt(50, 80);
        const overdue_maintenance = randomInt(3, 8);
        const completed_maintenance = randomInt(40, total_maintenance - overdue_maintenance - 2);
        const in_progress_maintenance = total_maintenance - completed_maintenance - overdue_maintenance;
        return {
          total_maintenance, // 总维保数
          completed_maintenance, // 已完成维保数
          overdue_maintenance, // 逾期维保数
          in_progress_maintenance // 进行中维保数
        };
      })()
    },

    // 作业分析
    operation_analysis: {
      operation_by_type: MOCK_CONFIG.operationTypes.map(type => ({ // 按作业类型统计
        type, // 作业类型
        count: randomInt(8, 25), // 作业次数
        risk_level: randomChoice(MOCK_CONFIG.operationRiskLevels) // 风险等级
      })),
      operation_by_region: generateByRegionStats(MOCK_CONFIG.regionNames, 20), // 按区域统计作业情况
      operation_compliance_rate: randomFloat(92, 98) // 作业合规率（%）
    },

    // 应急分析
    emergency_analysis: {
      emergency_drill_count: randomInt(2, 6), // 应急演练次数
      drill_success_rate: randomFloat(90, 100), // 演练成功率（%）
      resource_availability: { // 应急资源可用性
        personnel_availability: randomFloat(90, 98), // 人员可用率（%）
        equipment_availability: randomFloat(88, 96), // 设备可用率（%）
        material_availability: randomFloat(85, 95) // 物资可用率（%）
      }
    },

    // // 风险评估
    // risk_assessment: {
    //   overall_risk_level: risk_level,
    //   risk_score,
    //   main_risk_factors: [
    //     { factor: '人员行为风险', weight: 0.35, score: randomInt(60, 80) },
    //     { factor: '设备设施风险', weight: 0.25, score: randomInt(75, 90) },
    //     { factor: '作业管理风险', weight: 0.20, score: randomInt(70, 85) },
    //     { factor: '环境风险', weight: 0.12, score: randomInt(65, 80) },
    //     { factor: '应急能力风险', weight: 0.08, score: randomInt(80, 95) }
    //   ],
    //   high_risk_regions: (() => {
    //     const allRegions = MOCK_CONFIG.regionNames.map(region => ({
    //       region_name: region,
    //       risk_score: randomFloat(60, 90),
    //       main_risks: randomChoice([
    //         ['告警频发', '作业密度高'],
    //         ['设备老化', '人员违规'],
    //         ['环境复杂', '监控盲区'],
    //         ['培训不足', '操作不当'],
    //         ['监管缺失', '流程漏洞']
    //       ])
    //     }));
    //     return allRegions
    //       .sort((a, b) => b.risk_score - a.risk_score)
    //       .slice(0, 2);
    //   })(),
    //   high_risk_time_periods: (() => {
    //     const timePeriods = [
    //       { period: '06:00-08:00', risk_description: '交接班时段' },
    //       { period: '08:00-10:00', risk_description: '早高峰作业时段' },
    //       { period: '14:00-16:00', risk_description: '下午疲劳时段' },
    //       { period: '20:00-22:00', risk_description: '夜间作业时段' },
    //       { period: '22:00-06:00', risk_description: '凌晨低监控时段' }
    //     ];
    //     return timePeriods
    //       .sort(() => Math.random() - 0.5)
    //       .slice(0, 2);
    //   })()
    // },

    // // 趋势预测
    // trend_prediction: {
    //   next_7_days_prediction: {
    //     predicted_alarm_count: randomInt(280, 360),
    //     trend: randomChoice(['increasing', 'decreasing', 'stable']),
    //     confidence: randomFloat(0.7, 0.85)
    //   },
    //   next_30_days_prediction: {
    //     predicted_risk_level: randomChoice(['low', 'medium', 'high']),
    //     trend: randomChoice(['increasing', 'decreasing', 'stable']),
    //     confidence: randomFloat(0.65, 0.8)
    //   }
    // },

    // // 建议
    // recommendations: (() => {
    //   const recommendations = [];
    //   const region = params.region_id ? MOCK_CONFIG.regionNames.find(r => r.includes(params.region_id || '')) || '目标区域' : '所有区域';

    //   // 根据风险等级生成建议
    //   if (risk_level === 'high' || risk_level === 'critical') {
    //     recommendations.push(`加强${region}的安全巡查频次，重点关注高风险区域和时段`);
    //   }

    //   // 根据违规统计生成建议
    //   if (dates.length > 0) {
    //     recommendations.push('对高频违规人员进行针对性培训和考核，强化安全意识');
    //   }

    //   // 根据培训覆盖率生成建议
    //   if (randomFloat(80, 95) < 85) {
    //     recommendations.push('提高培训覆盖率，确保全员参与安全培训');
    //   }

    //   // 根据设备状态生成建议
    //   if (randomFloat(2, 8) > 5) {
    //     recommendations.push('优化设备维护计划，优先处理高故障率设备，减少停机时间');
    //   }

    //   // 根据应急演练情况生成建议
    //   if (randomInt(2, 6) < 4) {
    //     recommendations.push('增加应急演练频次，提升应急响应能力和处置效率');
    //   }

    //   // 根据证书状态生成建议
    //   if (randomFloat(0.02, 0.08) > 0.05) {
    //     recommendations.push('加快过期证书的更新工作，确保证书资质合规有效');
    //   }

    //   // 根据班前会情况生成建议
    //   if (randomFloat(90, 98) < 95) {
    //     recommendations.push('提升班前会质量，重点关注风险交底和安全提醒环节');
    //   }

    //   // 根据合规率生成建议
    //   if (randomFloat(92, 98) < 95) {
    //     recommendations.push('完善作业流程管理，加强现场监督检查，提升合规率');
    //   }

    //   // 确保至少有3条建议，最多5条
    //   while (recommendations.length < 3) {
    //     recommendations.push('持续改进安全管理体系，强化风险隐患排查治理');
    //   }

    //   return recommendations.slice(0, 5);
    // })(),

    // generated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    // cache_key: `risk_analysis_${start_date}_${end_date}_${params.region_id || 'all'}`
  };

  return {
    code: 200,
    message: 'success',
    data
  };
};

/**
 * 生成历史报告列表模拟数据
 */
export const generateMockReportList = (params: {
  page?: number;
  page_size?: number;
  start_time?: string;
  end_time?: string;
  region_id?: string;
}) => {
  const { page = 1, page_size = 10 } = params;
  const total = 15;
  const reports: any[] = [];

  const riskLevels = ['low', 'medium', 'high', 'critical'];
  const riskLevelNames = ['低风险', '中风险', '高风险', '重大风险'];

  for (let i = 0; i < Math.min(page_size, total - (page - 1) * page_size); i++) {
    const index = (page - 1) * page_size + i;
    const riskIndex = Math.floor(Math.random() * riskLevels.length);

    reports.push({
      report_id: `report_20240115_${String(index + 1).padStart(3, '0')}`,
      report_name: `厂区${String.fromCharCode(65 + (index % 4))}区风险分析报告`,
      report_time: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
      report_area: `厂区${String.fromCharCode(65 + (index % 4))}区`,
      risk_level: riskLevels[riskIndex],
      risk_score: randomInt(60, 90),
      time_range: '2024-01-01 00:00:00 - 2024-01-31 23:59:59',
      created_at: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
      message: `<p>报告${index + 1}的HTML内容...</p>`
    });
  }

  return {
    code: 200,
    message: 'success',
    data: {
      reports,
      total,
      page,
      page_size
    }
  };
};

/**
 * 模拟API请求延迟
 */
export const mockApiDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
