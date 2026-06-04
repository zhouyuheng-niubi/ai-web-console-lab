import {aipRequest} from '../request' 
import CryptoJS from 'crypto-js';
import { ContentTypeEnum } from "@/enums/requestEnum";
// 生成signature
export const generateSignature = () => {
    let ak = '69156104eb712e27f7d43591';
    let sk = '4fd5a37e-5527-46ad-a34d-0709d72102bc';
    let timestamp =  Math.floor(Date.now() / 1000);
    let nonce =  Math.random().toString(36).substring(2, 18); 
    let message =`${ak}:${timestamp}:${nonce}`;
    let hash = CryptoJS.HmacSHA256(message, sk);
    let signature = CryptoJS.enc.Hex.stringify(hash);
    return {signature, ak, nonce,timestamp};
};
// 获取边缘盒子系统时间戳
export function getEdgeBoxTimestamp() {
  return aipRequest.request({
    url: '/ks/system/time',
    method: 'get',
    headers: {
        "Content-Type": ContentTypeEnum.JSON,   
    },
    baseURL: import.meta.env.VITE_YJBX_API
  });
}

// 获取token信息
export function getTokenInfo(params: any) {
    return aipRequest.request({
      url: '/ks/system/user/token',
      method: 'get',
      headers: {
          "Content-Type": ContentTypeEnum.JSON,   
      },
      baseURL: import.meta.env.VITE_YJBX_API,
      params,
    });
}
