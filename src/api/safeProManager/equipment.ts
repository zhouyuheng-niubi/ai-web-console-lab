import { aipRequest } from '@/api/request'
import { ContentTypeEnum } from '@/enums/requestEnum'

// 设备验收相关接口
export const equipmentAcceptanceApi = {
  // 获取设备验收列表
  getList: (params?: any) => {
    return aipRequest.request({
      url: '/equipment/acceptance/list',
      method: 'get',
      params
    })
  },

  // 新增设备验收
  add: (data: any) => {
    return aipRequest.request({
      url: '/equipment/acceptance',
      method: 'post',
      headers: {
        'Content-Type': ContentTypeEnum.JSON
      },
      data
    })
  },

  // 编辑设备验收
  update: (data: any) => {
    return aipRequest.request({
      url: `/equipment/acceptance/${data.id}`,
      method: 'put',
      headers: {
        'Content-Type': ContentTypeEnum.JSON
      },
      data
    })
  },

  // 删除设备验收
  delete: (id: string) => {
    return aipRequest.request({
      url: `/equipment/acceptance/${id}`,
      method: 'delete'
    })
  }
}

// 设备盘点任务相关接口
export const equipmentInventoryApi = {
  // 获取盘点任务列表
  getList: (params?: any) => {
    return aipRequest.request({
      url: '/equipment/inventory/list',
      method: 'get',
      params
    })
  },

  // 新增盘点任务
  add: (data: any) => {
    return aipRequest.request({
      url: '/equipment/inventory',
      method: 'post',
      headers: {
        'Content-Type': ContentTypeEnum.JSON
      },
      data
    })
  },

  // 编辑盘点任务
  update: (data: any) => {
    return aipRequest.request({
      url: `/equipment/inventory/${data.id}`,
      method: 'put',
      headers: {
        'Content-Type': ContentTypeEnum.JSON
      },
      data
    })
  },

  // 删除盘点任务
  delete: (id: string) => {
    return aipRequest.request({
      url: `/equipment/inventory/${id}`,
      method: 'delete'
    })
  }
}