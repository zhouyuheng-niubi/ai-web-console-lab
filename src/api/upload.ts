import { aipRequest } from './request';
import { ContentTypeEnum } from '@/enums/requestEnum';

export interface UploadFileParams {
  file: File;
  description?: string;
  is_public?: boolean;
  wait_for_completion?: boolean;
}

export const uploadFile = (params: UploadFileParams) => {
  const formData = new FormData();
  
  formData.append('file', params.file);
  formData.append('description', params.description || '');
  formData.append('is_public', String(params.is_public !== undefined ? params.is_public : true));
  formData.append('wait_for_completion', String(params.wait_for_completion !== undefined ? params.wait_for_completion : true));

  return aipRequest.request({
    url: `${import.meta.env.VITE_NEWAI_API}/files/upload`,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
    method: 'post',
    data: formData,
    baseURL:''
  });
};

export const uploadFiles = (files: File[], description?: string) => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append('files', file);
  });
  formData.append('description', description || '');
  formData.append('is_public', 'true');
  formData.append('wait_for_completion', 'true');

  return aipRequest.request({
    url: `${import.meta.env.VITE_NEWAI_API}/files/upload`,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
    method: 'post',
    data: formData,
  });
};
