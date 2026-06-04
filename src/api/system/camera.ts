import {aipRequest} from '../request' 
import { ContentTypeEnum } from "@/enums/requestEnum";

// 摄像头列表
export const getCameraList = (params?: any) => {
  return aipRequest.request({
    url: `/region/cameras`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'get',
    params
  })
}

// 新增摄像头
export const addCamera = (data: any) => {
  return aipRequest.request({
    url: `/region/cameras`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'post',
    data
  })
}

// 编辑摄像头
export const editCamera = (data: any) => {
  return aipRequest.request({
    url: `/region/cameras/${data.camera_id}`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'put',
    data
  })
}

// 删除摄像头
export const removeCamera = (id: any) => {
  return aipRequest.request({
    url: `/region/cameras/${id}`,
    headers: {
		"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'delete',
  })
}