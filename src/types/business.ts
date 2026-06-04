/**
 * 业务数据类型定义
 * 适配安全生产风险管控智能化平台AI隐患排查系统的数据结构
 */

// 基础分页参数
export interface PaginationParams {
  page?: number;
  page_size?: number;
  pageNum?: number;
  pageSize?: number;
  current?: number;
}

// 告警记录相关类型
export interface WarnRecord {
  id: string;
  alarmTime: string;
  algorithm: string;
  dataSource: string;
  taskName: string;
  cameraInfo: CameraInfo;
  status: WarnStatus;
  imageUrl?: string;
  videoUrl?: string;
  description?: string;
  createTime?: string;
  updateTime?: string;
}

export interface CameraInfo {
  id?: string;
  name: string;
  location: string;
  ip: string;
  stream_url?: string;
  camera_type?: string;
}

export type WarnStatus = 0 | 1 | 2; // 0: 未处理, 1: 已处理, 2: 误报

// 摄像头相关类型
export interface Camera {
  id: string;
  camera_name: string;
  camera_desc?: string;
  region_id: string;
  stream_url: string;
  status: DeviceStatus;
  camera_type: CameraType;
  location: string;
  maxFps?: number;
  algorithms?: string[];
  createTime?: string;
  updateTime?: string;
}

export type DeviceStatus = '0' | '1' | 'online' | 'offline' | 'error';
export type CameraType = '防爆摄像头' | '普通摄像头' | '红外摄像头' | '智能摄像头';

// 区域相关类型
export interface Region {
  id: string;
  region_name: string;
  region_desc?: string;
  parent_id?: string;
  region_type: RegionType;
  status: DeviceStatus;
  camera_count?: number;
  children?: Region[];
  createTime?: string;
  updateTime?: string;
}

export type RegionType = '工厂' | '办公区' | '仓库' | '作业区' | '其他';

// 触发器相关类型
export interface Trigger {
  id: string;
  trigger_name: string;
  trigger_desc?: string;
  algorithm: AlgorithmType;
  camera_id: string;
  region_id: string;
  detection_params: DetectionParams;
  status: DeviceStatus;
  threshold?: number;
  sensitivity?: number;
  createTime?: string;
  updateTime?: string;
}

export type AlgorithmType = '人脸识别' | '行为分析' | '物体检测' | '安全帽检测' | '烟火检测';

export interface DetectionParams {
  confidence_threshold?: number;
  detection_area?: string; // 检测区域坐标
  time_range?: [string, string]; // 检测时间段
  alert_interval?: number; // 告警间隔（秒）
}

// 用户相关类型
export interface User {
  id: string;
  username: string;
  real_name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status: DeviceStatus;
  last_login_time?: string;
  permissions?: string[];
  createTime?: string;
  updateTime?: string;
}

export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';

// 搜索表单相关类型
export interface SearchForm {
  // 通用搜索字段
  keyword?: string;
  searchKeyword?: string;
  status?: string | number;
  
  // 告警搜索字段
  algorithm?: string;
  dataSource?: string;
  taskName?: string;
  timeRange?: [string, string] | [Date, Date];
  
  // 摄像头搜索字段
  cameraType?: string;
  camera_name?: string;
  location?: string;
  regionId?: string;
  
  // 区域搜索字段
  regionName?: string;
  regionType?: string;
  parentId?: string;
  
  // 触发器搜索字段
  triggerName?: string;
  algorithmType?: string;
  
  // 用户搜索字段
  username?: string;
  realName?: string;
  role?: string;
}

// 表格操作相关类型
export interface ActionItem {
  label: string;
  icon?: string;
  props?: any;
  action: string;
  disabled?: (record: any) => boolean;
}

// 编辑配置相关类型
export interface EditConfig {
  type?: 'input' | 'select' | 'number' | 'date' | 'date-range' | 'switch' | 'radio' | 'checkbox';
  props?: any;
  rules?: any[];
  disabled?: (record: any) => boolean;
}

// API响应包装类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  msg?: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page?: number;
  page_size?: number;
  current?: number;
  pageSize?: number;
}

// 业务API响应类型
export interface BusinessApiResponse {
  messages?: WarnRecord[];
  cameras?: Camera[];
  regions?: Region[];
  triggers?: Trigger[];
  users?: User[];
  total?: number;
  pagination?: {
    total_count: number;
    current_page?: number;
    page_size?: number;
    total_pages?: number;
  };
}

// 表格列配置扩展类型
export interface ExtendedColumnItem<T = any> {
  dataIndex: string;
  key?: string;
  title: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  options?: any[];
  // SmartTable扩展属性
  slot?: string;
  type?: 'tag' | 'switch' | 'radio' | 'checkbox' | 'badge' | 'rate' | 'progress' | 'date' | 'date-range' | 'select' | 'image';
  componentProps?: (value: any, record: T) => Record<string, any>;
  edit?: EditConfig;
  formatter?: (value: any, record: T) => string;
  render?: (value: any, record: T, index: number) => string | JSX.Element;
}