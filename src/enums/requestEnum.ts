/**
 * @description: ContentType
 */
export enum ContentTypeEnum {
  // form-data qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data upload
  FORM_DATA = "multipart/form-data;charset=UTF-8",
  // json
  JSON = "application/json;charset=UTF-8",
  EVENT_STREAM  ="text/event-stream;charset=utf-8",
  OCTET_STREAM  ="application/octet-stream",
  PLAIN = "text/plain; charset=utf-8"
}
 
/**
 * @description: 与后端协定的状态 code
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 1
}
