import { aipRequest } from '../request';
import { ContentTypeEnum } from "@/enums/requestEnum";

/**
 * 综合风险研判维度枚举
 */
export enum RiskAnalysisDimension {
  ALARM = 'alarm',           // 告警数据
  WARNING = 'warning',       // 预警数据
  BEHAVIOR = 'behavior',     // 行为数据
  TRAINING = 'training',     // 培训数据
  EQUIPMENT = 'equipment',   // 设备数据
  OPERATION = 'operation',   // 作业数据
  EMERGENCY = 'emergency'    // 应急数据
}

/**
 * 时间粒度枚举
 */
export enum TimeGranularity {
  YEAR = 'year',
  QUARTER = 'quarter',
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  HOUR = 'hour'
}

/**
 * 获取综合风险研判数据
 * @param params 请求参数
 */
export const getComprehensiveRiskAnalysis = (params?: {
  region_id?: string;                    // 区域ID，支持逗号分隔多个区域
  start_date: string;                    // 开始时间
  end_date: string;                      // 结束时间
  time_granularity?: TimeGranularity;    // 时间粒度
  include_dimensions?: string;            // 包含的研判维度，逗号分隔
  use_cache?: boolean;                   // 是否使用缓存
}) => {
  return aipRequest.request({
    url: `/risk/comprehensive`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'get',
    params
  });
};

/**
 * 获取历史研判报告列表
 * @param params 请求参数
 */
export const getRiskAnalysisReports = (params?: {
  page?: number;          // 页码
  page_size?: number;     // 每页数量
  start_time?: string;    // 开始时间
  end_time?: string;      // 结束时间
  region_id?: string;     // 区域ID
}) => {
  return aipRequest.request({
    url: `/risk/reports`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'get',
    params
  });
};

/**
 * 保存研判报告
 * @param data 报告数据
 */
export const saveRiskAnalysisReport = (data: {
  report_name: string;    // 报告名称
  report_time: string;    // 报告时间
  report_area: string;     // 报告区域
  risk_level: string;      // 风险等级
  risk_score: number;      // 风险评分
  message: string;         // 报告HTML内容
  analysis_data?: any;     // 分析数据(JSON对象)
}) => {
  return aipRequest.request({
    url: `/risk/reports`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'post',
    data
  });
};

/**
 * 删除研判报告
 * @param report_id 报告ID
 */
export const deleteRiskAnalysisReport = (report_id: string) => {
  return aipRequest.request({
    url: `/risk/reports/${report_id}`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'delete'
  });
};

/**
 * 获取区域列表
 * @param params 请求参数
 */
export const getRegionList = (params?: {
  include_hierarchy?: boolean;  // 是否包含层级结构
}) => {
  return aipRequest.request({
    url: `/system/regions`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'get',
    params
  });
};

/**
 * 获取风险分析统计数据（向后兼容）
 * @param params 请求参数
 */
export const riskAnalysisStatistics = (params?: {
  region_id?: string;
  start_date: string;
  end_date: string;
  time_granularity?: string;
}) => {
  return aipRequest.request({
    url: `/detection/report`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'get',
    params
  });
};
