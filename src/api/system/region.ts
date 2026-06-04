import {aipRequest} from '../request' 
import { ContentTypeEnum } from "@/enums/requestEnum";

// 区域列表
export const getRegionList = (params?: any) => {
  return aipRequest.request({
    url: `/region/regions`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'get',
    params
  })
}

// 新增区域
export const addRegion = (data: any) => {
  return aipRequest.request({
    url: `/region/regions`,
    headers: {
		  "Content-Type": ContentTypeEnum.JSON,
	  },
    method: 'post',
    data
  })
}

// 编辑区域
export const editRegion = (data: any) => {
  return aipRequest.request({
    url: `/region/regions/${data.id}`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'put',
    data
  })
}

// 删除区域
export const removeRegion = (id: any) => {
  return aipRequest.request({
    url: `/region/regions/${id}`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'delete',
  })
}