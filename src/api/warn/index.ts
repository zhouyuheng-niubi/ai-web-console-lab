import {aipRequest} from '../request'
import { ContentTypeEnum } from "@/enums/requestEnum";
// 获取所有模型类型
export const getModelTypeList = (params?: any) => {
    return aipRequest.request({
        url: `/scenes/types`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
            
        },
        method: 'get',
        params
    })
}
// 获取可以视频列表
export const getAvailVideoList = (params?: any) => {
    return aipRequest.request({
        url: `/streams/available`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
            
        },
        method: 'get',
        params
    })
}

// 报警/捕获记录
export const getAlarmList = (params?: any) => {
    return aipRequest.request({
        url: `/sse/messages`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
            
        },
        method: 'get',
        params
    })
}

// 更新视频流
export const updateVideoStream = (data?: any) => {
    return aipRequest.request({
        url: `/streams/url-manager/force-update`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
            
        },
        method: 'post',
        data
    })
}

// 开始分析
export const startAnalysisApi = (data?: any) => {
    return aipRequest.request({
        url: `/streams/start-with-scenes`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
        },
        method: 'post',
        data
    })
}

// 停止分析
export const stopAnalysisApi = (data?: any) => {
    return aipRequest.request({
        url: `/streams/stop`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
        },
        method: 'post',
        data
    })
}

// 风险分析统计接口
export const riskAnalysisStatistics = (params?: any) => {
    return aipRequest.request({
        url: `/detection/report`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
        },
        method: 'get',
        params
    })
}
// 保存风险研判报告
export const saveRiskAnalysisReport = (data?: any) => {
    return aipRequest.request({
        url: `/risk-reports/save`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
        },
        method: 'post',
        data
    })
}
// 查询风险研判报告
export const getRiskAnalysisReport = (params?: any) => {
    return aipRequest.request({
        url: `/risk-reports/query`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
        },
        method: 'get',
        params
    })
}
// 删除风险研判报告
export const deleteRiskAnalysisReport = (report_id?: any) => {
    return aipRequest.request({
        url: `/risk-reports/delete/${report_id}`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
        },
        method: 'delete',
    })
}

// 获取准确率和召回率
export const getRiskRateData = (params?: any) => {
    return aipRequest.request({
        url: `/metrics/accuracy-recall`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
        },
        method: 'get',
        params
    })
}
// 边缘盒子对应模型
export const getEdgeBoxModel = (params?: any) => {
    return aipRequest.request({
        url: `/scene/edge-box-mapping`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
        },
        method: 'get',
        params
    })
}

// 截取当前帧图
export const captureCurrentFrame = (stream_url?: any) => {
    return aipRequest.request({
        url: `/stream/snapshot`,
        headers: {
            "Content-Type": ContentTypeEnum.JSON,
        },
        method: 'get',
        params:{
            stream_url
        }
    })
}
