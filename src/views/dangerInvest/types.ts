// 隐患工单相关类型定义
import type {UploadFile} from 'ant-design-vue';
/**
 * 文件项类型 - 扩展ant-design-vue的UploadFile
 */
export interface FileItem extends Partial<UploadFile> {
  url?: string;
  name?: string;
  uid: string | number;
  status: string | 'uploading' | 'done' | 'error' | 'removed';
  type?: string;
  size?: number;
  thumbUrl?: string;
  response?: {
    url?: string;
    name?: string;
  };
}

/**
 * 隐患项类型
 */
export interface HazardItem {
  id?: string | number;
  images: FileItem[];
  videos: FileItem[];
  hazardName: string;
  hazardDesc: string;
  area: string;
  hazardLevel: '一般隐患' | '重大隐患';
  hazardType: string;
  basisRule: string;
  rectifySuggestion: string;
  penaltyStandard: string;
  rectifyDesc?: string;
  rectifyImages?: FileItem[];
  expanded?: boolean;
  referenceContent?: string;
}

/**
 * 工单表单状态
 */
export interface OrderFormState {
  id?: string | number;
  images: FileItem[];
  videos: FileItem[];
  hazardList: HazardItem[];
  orderName: string;
  registerTime: string;
  registerPerson: string;
  registerPersonId: string | number;
  deadline: string;
  status?: string;
  rectifyPerson?: string;
  rectifyPersonId?: string | number;
  rejectReason?: string;
  auditPerson?: string;
  auditPersonId?: string | number;
  fillType: FillMode;
}

/**
 * AI识别结果
 */
export interface RecognizedHazard {
  images: FileItem[];
  videos: FileItem[];
  hazardName: string;
  hazardDesc: string;
  area: string;
  hazardLevel: string;
  hazardType: string;
  basisRule: string;
  rectifySuggestion: string;
  penaltyStandard: string;
  expanded?: boolean;
}

/**
 * 上传文件对象
 */
export interface UploadedFileObject {
  file: File;
  fileData: FileItem;
}

/**
 * 填写模式
 */
export type FillMode = 'manual' | 'ai';

/**
 * 步骤状态
 */
export type StepStatus = 1 | 2 | 3;

/**
 * 工单初始数据
 */
export interface InitialOrderData {
  id?: string | number;
  orderName?: string;
  deadline?: string;
  registerPerson?: string;
  registerPersonId?: string | number;
  images?: FileItem[];
  videos?: FileItem[];
  hazardList?: HazardItem[];
  status?: string;
  rejectReason?: string;
}
