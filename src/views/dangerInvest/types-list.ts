// 隐患列表相关类型定义

import { object } from "zod";

/**
 * 工单状态
 */
export type OrderStatus =
  | 'pending_rectification'
  | 'rectification_rejected'
  | 'rectification_auditing'
  | 'hazard_auditing'
  | 'hazard_rejected'
  | 'pending_archiving'
  | 'completed'
  | 'defer_auditing'
  | 'defer_rejected';

/**
 * 工单详情数据
 */
export interface OrderDetailData {
  id: string | number;
  orderName: string;
  registerPerson: string;
  registerPersonId?: string | number;
  registerTime: string;
  deadline: string;
  rectifyPerson?: string;
  rectifyPersonId?: string | number;
  status: OrderStatus;
  images: any[];
  video?: any[];
  hazardList: HazardListItem[];
  rejectReason?: string;
  auditPerson?: string;
  auditPersonId?: string | number;
  fillType?: 'ai' | 'manual';
}

/**
 * 隐患列表项
 */
export interface HazardListItem {
  id?: string | number;
  hazardName: string;
  hazardDesc: string;
  hazardFile: any[];
  rectifyImages: any[];
  rectifyDesc: string;
  area: string;
  hazardLevel: '一般隐患' | '重大隐患';
  hazardType: string;
  basisRule: string;
  rectifySuggestion: string;
  penaltyStandard: string;
  images: any[];
  videos?: any[];
  video?: any[];
  referenceContent?: any;
}

/**
 * 整改对比结果
 */
export interface CompareResultItem {
  fileName: string;
  hazardName: string;
  hazardDesc: string;
  images: any[];
  rectifyImages: any[];
  rectifyDesc: string;
  rectified: boolean;
  rectificationContent?: string;
  annotatedHazardImages?: string[];
  error?: string; // 错误信息
}

/**
 * 用户选择数据
 */
export interface UserSelectData {
  id: string;
  name: string;
}

/**
 * AI分析状态
 */
export interface AIAnalysisState {
  isAnalyzing: boolean;
  currentIndex: number;
  controller: AbortController | null;
}
