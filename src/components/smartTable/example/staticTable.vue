<smart-table
  :columns="columns"
  :data-source="tableData"
  :search-config="searchConfig"
  @search="handleSearch"
  @tableChange="handleTableChange"
></smart-table>

<script setup>
const tableData = ref([
  { id: 1, name: '张三', age: 28 },
  { id: 2, name: '李四', age: 32 }
]);

const handleSearch = (params, pagination) => {
  // 手动处理搜索逻辑
  console.log('搜索参数:', params, '分页:', pagination);
};
</script>