import {aipRequest} from '../request' 
import { ContentTypeEnum } from "@/enums/requestEnum";

// 检查登录状态
export function checkLoginStatus() {
  return aipRequest.request({
    url: '/api/labelstudio/health',
    method: 'get',
    headers: {
        "Content-Type": ContentTypeEnum.JSON,   
    },
    baseURL: import.meta.env.VITE_TRAIN_API
  });
}

export function getAutoLoginStatus() {
  return aipRequest.request({
    url: '/api/labelstudio-auth/auto-login-status',
    method: 'get',
    headers: {
        "Content-Type": ContentTypeEnum.JSON,   
    },
    baseURL: import.meta.env.VITE_TRAIN_API
  });
}


// 启用自动登录
export function enableAutoLogin() {
  return aipRequest.request({
    url: '/api/labelstudio-auth/auto-login-url',
    method: 'get',
    headers: {
        "Content-Type": ContentTypeEnum.JSON,   
    },
    baseURL: import.meta.env.VITE_TRAIN_API
  });
}
