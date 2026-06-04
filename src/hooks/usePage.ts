import { router } from '@/router'
/**
 * 获取路由上 query 参数
 */

export function getRouteQuery() {
  const { currentRoute } = router
  const { query } = currentRoute.value
  return cloneDeep(query)
}
/**
 * 重定向
 * @param path 路径
 * @param query 携带参数
 */
export function redirectTo(path: string,query = {}) {
  
  const { replace } = router
  console.log(replace);
  
  replace({
    path,
    query 
  })
}
/**
 * 跳转到
 * @param path 路径
 * @param query 携带参数
 */
export function jumpTo(path: string,query = {}) {
  const { push } = router
  
  push({
    path,
    query
  })
}
function cloneDeep(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}