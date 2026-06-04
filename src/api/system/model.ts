import {aipRequest} from '../request' 
import { ContentTypeEnum } from "@/enums/requestEnum";

// 查询算法场景列表
export const getModelList = (params?: any) => {
  return aipRequest.request({
    url: `/model-management/detection-types`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'get',
    params
  })
}

// 创建算法场景
export const addModel = (data: any) => {
  return aipRequest.request({
    url: `/model-management/detection-types`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'post',
    data
  })
}

// 更新算法场景
export const editModel = (data: any) => {
  return aipRequest.request({
    url: `/model-management/detection-types/update?_id=${data._id}`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'put',
    data
  })
}

// 删除算法场景
export const removeModel = (id: any) => {
  return aipRequest.request({
    url: `/model-management/detection-types/delete?_id=${id}`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'delete'
  })
}

// 算法参数配置
export const getModelConfig = () => {
  return aipRequest.request({
    url: `/scene/requirements`,
    headers: {
      "Content-Type": ContentTypeEnum.JSON,
    },
    method: 'get'
  })
}
