/**
 * 综合风险研判模拟API
 * 在没有后端接口时提供模拟数据支持
 */

import { RiskAnalysisCache } from '@/utils/RiskAnalysisCache';
import {
  generateMockRiskAnalysisData,
  generateMockReportList,
  mockApiDelay
} from '@/utils/mockDataGenerator';
import type {
  RiskAnalysisDimension,
  TimeGranularity
} from './risk';

/**
 * 是否使用模拟数据
 * 可以通过环境变量或配置文件控制
 */
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * 获取综合风险研判数据（模拟API）
 */
export const mockGetComprehensiveRiskAnalysis = async (params?: {
  region_id?: string;
  start_date: string;
  end_date: string;
  time_granularity?: TimeGranularity;
  include_dimensions?: string;
  use_cache?: boolean;
}) => {
  // 使用缓存优先策略
  return await RiskAnalysisCache.getWithCache(
    params || { start_date: '', end_date: '' },
    async () => {
      // 模拟网络请求延迟
      await mockApiDelay(500);
      // 生成模拟数据
      return generateMockRiskAnalysisData(params || { start_date: '', end_date: '' });
    }
  );
};

/**
 * 获取历史研判报告列表（模拟API）
 */
export const mockGetRiskAnalysisReports = async (params?: {
  page?: number;
  page_size?: number;
  start_time?: string;
  end_time?: string;
  region_id?: string;
}) => {
  // 模拟网络请求延迟
  await mockApiDelay(300);
  // 生成模拟数据
  return generateMockReportList(params || {});
};

/**
 * 保存研判报告（模拟API）
 */
export const mockSaveRiskAnalysisReport = async (data: {
  report_name: string;
  report_time: string;
  report_area: string;
  risk_level: string;
  risk_score: number;
  message: string;
  analysis_data?: any;
}) => {
  // 模拟网络请求延迟
  await mockApiDelay(200);

  const reportId = `report_${Date.now()}`;

  // 保存到缓存
  RiskAnalysisCache.setReport(reportId, {
    report_id: reportId,
    ...data,
    created_at: new Date().toISOString()
  });

  return {
    code: 200,
    message: '保存成功',
    data: {
      report_id: reportId
    }
  };
};

/**
 * 删除研判报告（模拟API）
 */
export const mockDeleteRiskAnalysisReport = async (report_id: string) => {
  // 模拟网络请求延迟
  await mockApiDelay(200);

  // 从缓存中删除
  RiskAnalysisCache.deleteReport(report_id);

  return {
    code: 200,
    message: '删除成功',
    data: null
  };
};

/**
 * 统一的API调用方法
 * 根据配置自动选择真实API或模拟API
 */
export const getComprehensiveRiskAnalysis = async (params?: {
  region_id?: string;
  start_date: string;
  end_date: string;
  time_granularity?: TimeGranularity;
  include_dimensions?: string;
  use_cache?: boolean;
}) => {
  if (USE_MOCK_API) {
    return mockGetComprehensiveRiskAnalysis(params);
  }

  // 真实API调用
  // TODO: 替换为真实的API调用
  // return await import('./risk').then(m => m.getComprehensiveRiskAnalysis(params));

  // 暂时使用模拟API
  return mockGetComprehensiveRiskAnalysis(params);
};

/**
 * 统一的报告列表API调用方法
 */
export const getRiskAnalysisReports = async (params?: {
  page?: number;
  page_size?: number;
  start_time?: string;
  end_time?: string;
  region_id?: string;
}) => {
  if (USE_MOCK_API) {
    return mockGetRiskAnalysisReports(params);
  }

  // 真实API调用
  // TODO: 替换为真实的API调用
  // return await import('./risk').then(m => m.getRiskAnalysisReports(params));

  // 暂时使用模拟API
  return mockGetRiskAnalysisReports(params);
};

/**
 * 统一的保存报告API调用方法
 */
export const saveRiskAnalysisReport = async (data: {
  report_name: string;
  report_time: string;
  report_area: string;
  risk_level: string;
  risk_score: number;
  message: string;
  analysis_data?: any;
}) => {
  if (USE_MOCK_API) {
    return mockSaveRiskAnalysisReport(data);
  }

  // 真实API调用
  // TODO: 替换为真实的API调用
  // return await import('./risk').then(m => m.saveRiskAnalysisReport(data));

  // 暂时使用模拟API
  return mockSaveRiskAnalysisReport(data);
};

/**
 * 统一的删除报告API调用方法
 */
export const deleteRiskAnalysisReport = async (report_id: string) => {
  if (USE_MOCK_API) {
    return mockDeleteRiskAnalysisReport(report_id);
  }

  // 真实API调用
  // TODO: 替换为真实的API调用
  // return await import('./risk').then(m => m.deleteRiskAnalysisReport(report_id));

  // 暂时使用模拟API
  return mockDeleteRiskAnalysisReport(report_id);
};
