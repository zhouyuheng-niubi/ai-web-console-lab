import {aipRequest} from '../request' 
import { ContentTypeEnum } from "@/enums/requestEnum";

// 安全管理体系要素列表
export const getSafetyElementList = (params?: any) => {
  return aipRequest.request({
    url: `/safety-elements`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'get',
    params
  })
}

// 创建安全管理体系要素
export const addSafetyElement = (data: any) => {
  return aipRequest.request({
    url: `/safety-elements`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'post',
    data
  })
}

// 更新安全管理体系要素
export const editSafetyElement = (data: any) => {
  return aipRequest.request({
    url: `/safety-elements/${data.id}`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'put',
    data
  })
}

// 删除安全管理体系要素
export const removeSafetyElement = (id: any) => {
  return aipRequest.request({
    url: `/safety-elements/${id}`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'delete',
  })
}
