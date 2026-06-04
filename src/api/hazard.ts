import { aipRequest } from './request';
import { ContentTypeEnum } from '@/enums/requestEnum';

export interface HazardDetectParams {
  files: File[];
  description?: string;
}

export interface HazardDetectByUrlParams {
  fileUrls: string[];
  description?: string;
}
export interface compareParams {
  files: File[];
  recognizedHazards?: string;
}

/**
 * AI整改对比响应数据
 */
export interface CompareRectifyResponse {
  rectified: boolean;
  rectificationContent?: string;
  annotatedHazardImages?: string[];
}

export interface HazardInfo {
  fileName: string;
  hazardLevel: string;
  hazardType: string;
  hazardDesc: string;
  basisRule: string;
  rectifySuggestion: string;
  hazardName: string;
  penaltyStandard: string;
  hazardUrl: string;
  timestamp: string | null;
}

/**
 * 一键填写整改响应数据
 */
export interface FillRectifyResponse {
  id: string;
  urls: string[];
  content: string;
}
/**
 * 隐患复审
 */
export interface HazardAuditParams {
  imageUrls: string[];
  hazardDesc: string;
}



export const detectHazard = (params: HazardDetectParams, signal?: AbortSignal) => {
  const formData = new FormData();
  
  params.files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('description', params.description || '');
  formData.append('consolidate', true);

  return aipRequest.request<HazardInfo[]>({
    url: `${import.meta.env.VITE_NEWAI_API}/hazard/inspect`,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
    method: 'post',
    data: formData,
    signal: signal,
    timeout: 60000 * 5,
  });
};

export const detectHazardByUrl = (params: HazardDetectByUrlParams, signal?: AbortSignal) => {
  const formData = new FormData();
  formData.append('description', params.description || '');
  formData.append('consolidate', true);
  formData.append('fileUrls', params.fileUrls.join(','));
  return aipRequest.request<HazardInfo[]>({
    url: `${import.meta.env.VITE_NEWAI_API}/hazard/inspect`,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
    method: 'post',
    data:formData
  });
};

// 整改对比
export const compareRectify = (params: compareParams, signal?: AbortSignal) => {
  const formData = new FormData();
  let fileUrls = []
  params.files.forEach(file => {
    if(file.url) fileUrls.push(file.url);
  });
  formData.append('fileUrls', fileUrls.join(','));
  formData.append('recognizedHazards', params.recognizedHazards || '[{}]');
  return aipRequest.request<{ data: CompareRectifyResponse }>({
    url: `${import.meta.env.VITE_NEWAI_API}/hazard/compare`,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
    method: 'post',
    data: formData,
    signal: signal,
    timeout: 60000 * 5,
  });
};

// 一键填写整改
export const fillRectify = (params: any, signal?: AbortSignal) => {
  const formData = new FormData();
  if(params?.files && params?.files.length > 0){
    params.files.forEach(file => {
      formData.append('files', file?.originFileObj || file?.originFile);
    })
  }
  if(params?.hazards && params?.hazards.length > 0){
    formData.append('hazards', JSON.stringify(params.hazards));
  }
  return aipRequest.request<{ data: FillRectifyResponse[] }>({
    url: `${import.meta.env.VITE_NEWAI_API}/hazard/verify`,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
    method: 'post',
    data: formData,
    signal: signal,
    timeout: 60000 * 5,
  });
};

// 隐患复核
export const hazardAudit = (params: {auditItems:HazardAuditParams[]}, signal?: AbortSignal) => {
   return aipRequest.request({
      url: `${import.meta.env.VITE_NEWAI_API}/hazard/audit`,
      headers: {
        'Content-Type': ContentTypeEnum.JSON,
      },
      method: 'post',
      data: params,
      signal: signal,
   })
}


// 业务接口保存

// 保存工单
export const saveHazard = (params: any, signal?: AbortSignal) => {
  return aipRequest.request({
    url: `/hazard/orders`,
    headers: {
      'Content-Type': ContentTypeEnum.JSON,
    },
    method: 'post',
    data: params,
    signal: signal,
  });
};
// 更新工单
export const updateHazard = (params: any, signal?: AbortSignal) => {
  return aipRequest.request({
    url: `/hazard/orders/${params?.id || ''}`,
    headers: {
      'Content-Type': ContentTypeEnum.JSON,
    },
    method: 'put',
    data: params,
    signal: signal,
  });
};
// end


// 工单列表
export const getHazardList = (params: any, signal?: AbortSignal) => {
  return aipRequest.request({
    url: `/hazard/orders`,
    headers: {
      'Content-Type': ContentTypeEnum.JSON,
    },
    method: 'get',
    params: params,
    signal: signal,
  });
};
// 删除工单
export const deleteHazard = (id: any, signal?: AbortSignal) => {
  console.log('id', id);
  return aipRequest.request({
    url: `/hazard/orders/${id || ''}`,
    headers: {
      'Content-Type': ContentTypeEnum.JSON,
    },
    method: 'delete',
    signal: signal,
  });
};

// 隐患统计
export const hazardStatistics = (params: any, signal?: AbortSignal) => {
  return aipRequest.request({
    url: `/hazard/statistics`,
    headers: {
      'Content-Type': ContentTypeEnum.JSON,
    },
    method: 'get',
    params: params,
    signal: signal,
  });
};
