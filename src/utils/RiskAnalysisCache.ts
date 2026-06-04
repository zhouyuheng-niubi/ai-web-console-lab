/**
 * 综合风险研判数据缓存服务
 * 提供本地缓存管理功能，支持短期和长期缓存策略
 */

import { generateMockRiskAnalysisData, mockApiDelay } from './mockDataGenerator';
import type { RiskAnalysisDimension, TimeGranularity } from '@/api/risk';

/**
 * 缓存配置
 */
const CACHE_CONFIG = {
  // 短期缓存有效期（1小时）
  SHORT_TTL: 60 * 60 * 1000,
  // 长期缓存有效期（24小时）
  LONG_TTL: 24 * 60 * 60 * 1000,
  // 报告缓存有效期（永久）
  REPORT_TTL: -1,
  // 最大缓存数量
  MAX_CACHE_SIZE: 50
};

/**
 * 缓存项接口
 */
interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // -1 表示永久缓存
  cacheKey: string;
}

/**
 * 风险分析缓存管理类
 */
class RiskAnalysisCacheManager {
  private storageKey = 'risk_analysis_cache';
  private reportStorageKey = 'risk_analysis_reports';

  /**
   * 生成缓存键
   */
  generateCacheKey(params: {
    region_id?: string;
    start_date: string;
    end_date: string;
    time_granularity?: TimeGranularity;
    include_dimensions?: string;
  }): string {
    const parts = [
      params.region_id || 'all',
      params.start_date,
      params.end_date,
      params.time_granularity || 'auto',
      params.include_dimensions || 'all'
    ];

    // 简单的hash生成
    const hash = parts.join('_').replace(/[^a-zA-Z0-9_]/g, '');
    return `risk_analysis_${hash}`;
  }

  /**
   * 获取缓存数据
   */
  get<T = any>(cacheKey: string): T | null {
    try {
      const cacheData = this.getAllCache();
      const item = cacheData[cacheKey];

      if (!item) {
        return null;
      }

      // 检查是否过期
      if (item.ttl !== -1 && Date.now() - item.timestamp > item.ttl) {
        // 删除过期缓存
        delete cacheData[cacheKey];
        this.saveCache(cacheData);
        return null;
      }

      return item.data as T;
    } catch (error) {
      console.error('读取缓存失败:', error);
      return null;
    }
  }

  /**
   * 设置缓存数据
   */
  set<T = any>(
    cacheKey: string,
    data: T,
    ttl: number = CACHE_CONFIG.SHORT_TTL
  ): void {
    try {
      const cacheData = this.getAllCache();

      // 如果缓存数量超过限制，删除最旧的缓存
      const cacheKeys = Object.keys(cacheData);
      if (cacheKeys.length >= CACHE_CONFIG.MAX_CACHE_SIZE && !cacheData[cacheKey]) {
        // 按时间戳排序，删除最旧的
        const oldestKey = cacheKeys.sort((a, b) => cacheData[a].timestamp - cacheData[b].timestamp)[0];
        if (oldestKey) {
          delete cacheData[oldestKey];
        }
      }

      cacheData[cacheKey] = {
        data,
        timestamp: Date.now(),
        ttl,
        cacheKey
      };

      this.saveCache(cacheData);
    } catch (error) {
      console.error('设置缓存失败:', error);
    }
  }

  /**
   * 删除指定缓存
   */
  delete(cacheKey: string): void {
    try {
      const cacheData = this.getAllCache();
      delete cacheData[cacheKey];
      this.saveCache(cacheData);
    } catch (error) {
      console.error('删除缓存失败:', error);
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.reportStorageKey);
    } catch (error) {
      console.error('清空缓存失败:', error);
    }
  }

  /**
   * 清除过期缓存
   */
  clearExpired(): void {
    try {
      const cacheData = this.getAllCache();
      const now = Date.now();
      let hasExpired = false;

      Object.keys(cacheData).forEach(key => {
        const item = cacheData[key];
        if (item.ttl !== -1 && now - item.timestamp > item.ttl) {
          delete cacheData[key];
          hasExpired = true;
        }
      });

      if (hasExpired) {
        this.saveCache(cacheData);
      }
    } catch (error) {
      console.error('清除过期缓存失败:', error);
    }
  }

  /**
   * 获取所有缓存数据
   */
  private getAllCache(): Record<string, CacheItem> {
    try {
      const cached = localStorage.getItem(this.storageKey);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.error('读取缓存数据失败:', error);
      return {};
    }
  }

  /**
   * 保存缓存数据
   */
  private saveCache(cacheData: Record<string, CacheItem>): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('保存缓存数据失败:', error);
      // 如果存储空间不足，尝试删除一半缓存
      try {
        const keys = Object.keys(cacheData);
        const deleteCount = Math.floor(keys.length / 2);
        for (let i = 0; i < deleteCount; i++) {
          delete cacheData[keys[i]];
        }
        localStorage.setItem(this.storageKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('清理缓存后重试失败:', retryError);
      }
    }
  }

  /**
   * 获取缓存大小（估算）
   */
  getCacheSize(): number {
    try {
      const cached = localStorage.getItem(this.storageKey);
      return cached ? cached.length : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * 获取缓存项数量
   */
  getCacheCount(): number {
    try {
      const cacheData = this.getAllCache();
      return Object.keys(cacheData).length;
    } catch (error) {
      return 0;
    }
  }

  // ==================== 报告缓存相关方法 ====================

  /**
   * 获取报告缓存
   */
  getReport(reportId: string): any | null {
    try {
      const reportCache = this.getReportCache();
      return reportCache[reportId] || null;
    } catch (error) {
      console.error('读取报告缓存失败:', error);
      return null;
    }
  }

  /**
   * 设置报告缓存
   */
  setReport(reportId: string, reportData: any): void {
    try {
      const reportCache = this.getReportCache();
      reportCache[reportId] = {
        data: reportData,
        timestamp: Date.now(),
        ttl: CACHE_CONFIG.REPORT_TTL
      };
      this.saveReportCache(reportCache);
    } catch (error) {
      console.error('设置报告缓存失败:', error);
    }
  }

  /**
   * 删除报告缓存
   */
  deleteReport(reportId: string): void {
    try {
      const reportCache = this.getReportCache();
      delete reportCache[reportId];
      this.saveReportCache(reportCache);
    } catch (error) {
      console.error('删除报告缓存失败:', error);
    }
  }

  /**
   * 获取所有报告缓存
   */
  private getReportCache(): Record<string, any> {
    try {
      const cached = localStorage.getItem(this.reportStorageKey);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.error('读取报告缓存失败:', error);
      return {};
    }
  }

  /**
   * 保存报告缓存
   */
  private saveReportCache(reportCache: Record<string, any>): void {
    try {
      localStorage.setItem(this.reportStorageKey, JSON.stringify(reportCache));
    } catch (error) {
      console.error('保存报告缓存失败:', error);
    }
  }

  // ==================== 智能获取方法（带缓存检查） ====================

  /**
   * 智能获取风险分析数据（优先使用缓存）
   */
  async getWithCache<T = any>(
    params: {
      region_id?: string;
      start_date: string;
      end_date: string;
      time_granularity?: TimeGranularity;
      include_dimensions?: string;
      use_cache?: boolean;
    },
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(params);

    // 如果允许使用缓存
    if (params.use_cache !== false) {
      // 尝试从缓存获取
      const cachedData = this.get<T>(cacheKey);
      if (cachedData) {
        console.log('[RiskAnalysisCache] 命中缓存:', cacheKey);
        return cachedData;
      }
    }

    // 缓存未命中或不使用缓存，请求新数据
    console.log('[RiskAnalysisCache] 缓存未命中，请求新数据:', cacheKey);
    const newData = await fetchFn();

    // 保存到缓存（短期缓存1小时）
    this.set(cacheKey, newData, CACHE_CONFIG.SHORT_TTL);

    return newData;
  }

  /**
   * 获取模拟数据（开发/测试用）
   */
  async getMockData(params: {
    region_id?: string;
    start_date: string;
    end_date: string;
    time_granularity?: TimeGranularity;
    include_dimensions?: string;
  }): Promise<any> {
    // 模拟网络延迟
    await mockApiDelay(300);

    // 生成模拟数据
    return generateMockRiskAnalysisData(params);
  }
}

// 导出单例实例
export const RiskAnalysisCache = new RiskAnalysisCacheManager();

// 导出类型
export type { CacheItem };
export { CACHE_CONFIG };
