import { aipRequest } from './request';
import { ContentTypeEnum } from '@/enums/requestEnum';
// 创建会话
export const createConversation = (params,signal?: AbortSignal) => {
    return aipRequest.request({
        url: `${import.meta.env.VITE_NEWAI_API}/conversations`,
        headers: {
            'Content-Type': ContentTypeEnum.JSON,
            'Authorization': `Bearer ${import.meta.env.VITE_CHAT_USER_TOKEN}`,
        },
        method: 'post',
        data: params,
        signal: signal,
        timeout: 60000 * 1,
    })
}
// 编辑会话
export const editConversation = (params,signal?: AbortSignal) => {
    return aipRequest.request({
        url: `${import.meta.env.VITE_NEWAI_API}/conversations/${params.conversation_id}`,
        headers: {
            'Content-Type': ContentTypeEnum.JSON,
            'Authorization': `Bearer ${import.meta.env.VITE_CHAT_USER_TOKEN}`,
        },
        method: 'put',
        data: params,
        signal: signal,
        timeout: 60000 * 1,
    })
}

// 删除会话
export const deleteConversation = (params,signal?: AbortSignal) => {
    return aipRequest.request({
        url: `${import.meta.env.VITE_NEWAI_API}/conversations/${params.conversationId}`,
        headers: {
            'Content-Type': ContentTypeEnum.JSON,
            'Authorization': `Bearer ${import.meta.env.VITE_CHAT_USER_TOKEN}`,
        },
        method: 'delete',
        params: {
            conversation_id: params.conversationId,
        },
        signal: signal,
        timeout: 60000 * 1,
    })
}

// 保存消息
export const saveMessage = (params,signal?: AbortSignal) => {
    return aipRequest.request({
        url: `${import.meta.env.VITE_NEWAI_API}/conversations/messages`,
        headers: {
            'Content-Type': ContentTypeEnum.JSON,
            'Authorization': `Bearer ${import.meta.env.VITE_CHAT_USER_TOKEN}`,
        },
        method: 'post',
        data: params,
        signal: signal,
        timeout: 60000 * 1,
    })
}

// 查询会话历史消息
export const conversationMessages = (params,signal?: AbortSignal) => {
    return aipRequest.request({
        url: `${import.meta.env.VITE_NEWAI_API}/conversations/${params.conversation_id}/messages`,
        headers: {
            'Content-Type': ContentTypeEnum.JSON,
            'Authorization': `Bearer ${import.meta.env.VITE_CHAT_USER_TOKEN}`,
        },
        method: 'get',
        params: params,
        signal: signal,
        timeout: 60000 * 1,
    })
}

// 查询会话列表 
export const conversationList = (params,signal?: AbortSignal) => {
    return aipRequest.request({
        url: `${import.meta.env.VITE_NEWAI_API}/conversations`,
        headers: {
            'Content-Type': ContentTypeEnum.JSON,
            'Authorization': `Bearer ${import.meta.env.VITE_CHAT_USER_TOKEN}`,
        },
        method: 'get',
        params: params,
        signal: signal,
        timeout: 60000 * 1,
    })
}

// 附件识别
export const attachmentRecognition = (params, signal?: AbortSignal) => {
    const formData = new FormData();
    if(params.files && params.files.length > 0){
        params.files.forEach((file: File) => {
            formData.append('files', file);
        })
    }
    return aipRequest.request({
        url: `${import.meta.env.VITE_NEWAI_API}/ai/file/recognize`,
        headers: {
            'Content-Type': ContentTypeEnum.FORM_DATA,
            'Authorization': `Bearer ${import.meta.env.VITE_CHAT_USER_TOKEN}`,
        },
        method: 'post',
        data: formData,
        signal: signal,
        timeout: 60000 * 1,
    })
}

// 语音转文字
export const speechToText = (audioBlob: Blob, signal?: AbortSignal) => {
    const formData = new FormData();
    // 将 Blob 转换为 File 对象
    const audioFile = new File([audioBlob], `audio_${Date.now()}.wav`, { type: 'audio/wav' });
    formData.append('ars_file', audioFile);
    
    return aipRequest.request({
        url: `${import.meta.env.VITE_NEWAI_API}/ai/asr`,
        headers: {
            'Content-Type': ContentTypeEnum.FORM_DATA,
            'Authorization': `Bearer ${import.meta.env.VITE_CHAT_USER_TOKEN}`,
        },
        method: 'post',
        data: formData,
        signal: signal,
        timeout: 60000 * 1,
    })
}