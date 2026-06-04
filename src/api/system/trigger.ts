import {aipRequest} from '../request' 
import { ContentTypeEnum } from "@/enums/requestEnum";
// 风险隐患列表
export const getDangerList = (params?: any) => {
  return aipRequest.request({
    url: `/region/risk-factors`,
    headers: {
			"Content-Type": ContentTypeEnum.JSON,
	},
    method: 'get',
    params
  })
}
// 新增危险隐患
export const addDanger = (data: any) => {
  return aipRequest.request({
    url: `/region/risk-factors`,
    headers: {
			"Content-Type": ContentTypeEnum.JSON,
		},
    method: 'post',
    data
  })
}

// 编辑危险隐患
export const editDanger = (data: any) => {
  return aipRequest.request({
    url: `/region/risk-factors/${data.factor_id}`,
    headers: {
			"Content-Type": ContentTypeEnum.JSON,
		},
    method: 'put',
    data
  })
}

// 删除危险隐患
export const removeDanger = (factor_id: any) => {
  return aipRequest.request({
    url: `/region/risk-factors/${factor_id}`,
    headers: {
			"Content-Type": ContentTypeEnum.JSON,
		},
    method: 'delete',
  })
}