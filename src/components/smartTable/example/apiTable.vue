<smart-table
  :columns="columns"
  :search-config="searchConfig"
  :api="{
    url: '/api/user/list',
    method: 'post',
    // 自定义参数格式化
    paramsFormatter: (params, pagination) => ({
      ...params,
      page: pagination.current,
      size: pagination.pageSize
    }),
    // 自定义响应处理
    responseHandler: (res) => ({
      list: res.result.items,
      total: res.result.totalCount
    })
  }"
  @action="handleAction"
></smart-table>