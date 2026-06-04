<template>
  <div class="search-record w-full h-full flex flex-col pb-[68px] box-border">
    <Header title="查询中心" :showBack="false" />
    <main class="main-content flex-1 overflow-y-auto flex flex-col">
      <div class="filter-section">
        <div class="filter-bar">
          <Button v-for="filter in statusOptions" :key="filter.value"
            :class="[{ active: selectedFilter === filter.value }]" @click="selectFilter(filter.value)"
            :type="filter.value === selectedFilter ? 'primary' : 'default'">
            {{ filter.label }} {{ filter.value === selectedFilter && pageInfo.total ? '(' + pageInfo.total + ')' : '' }}
          </Button>
        </div>
        <Input v-model:value="searchKeyword" placeholder="搜索工单标题..." 
          @pressEnter="handleSearch" @blur="handleSearch"
          size="large"
          class="search-input mt-[10px]" allow-clear>
          <template #prefix>
            <SearchOutlined />
          </template>
        </Input>
      </div>
      <div class="search-section">
      </div>
      <div class="list-section flex-1 overflow-y-auto bg-[#fff] p-[10px] rounded-[10px]">
        <InfiniteListContainer :list-data="list" :has-more="list.length < pageInfo.total"
          :page-size="pageInfo.page_size" :is-loading="isLoading" @load-more="handleLoadMore" @refresh="handleRefresh">
          <PendingList :list="list" EmptyText="当前筛选条件下暂无工单信息" @item-click="handleItemClick" />
        </InfiniteListContainer>

      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';
import PendingList from '../components/PendingList.vue';
import InfiniteListContainer from '../components/InfiniteListContainer.vue';
import { ref, onMounted } from 'vue';
import {SearchOutlined } from '@ant-design/icons-vue';
// 按需引入 ant-design-vue 组件
import { Input, Button,message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useHiddenDangerStore } from '@/store';
import { getHazardList } from '@/api/hazard';
const hiddenDangerStore = useHiddenDangerStore();
const statusOptions = [...hiddenDangerStore.getStatusOptions(),{
  value: '',
  label: '全部',
  color: 'gray'
}]
const router = useRouter();


interface ListItem {
  id: string;
  title: string;
  description: string;
  time: string;
  priority: string;
  status: string;
  statusClass: string;
  priorityClass: string;
  timelimit: string;
}

const selectedFilter = ref<string>('hazard_auditing');
const searchKeyword = ref<string>('');

// 示例数据 - 在实际应用中应从API获取

const selectFilter = (value: string) => {
  selectedFilter.value = selectedFilter.value === value ? '' : value;
  pageInfo.value.page = 1;
  hasMore.value = true;
  getList(true);
};


const handleSearch = () => {
  pageInfo.value.page = 1;
  hasMore.value = true;
  getList(true);
};

const handleItemClick = (item: ListItem) => {
  router.push({
    path: `/mobile/hidden-danger/${item.id}`
  });
};

// 列表数据
const list = ref([])
const pageInfo = ref({
  page: 1,
  page_size: 10,
  total: 0
})
const isLoading = ref(false);
const hasMore = ref(true);
const handleLoadMore = () => {
  if (!hasMore.value || isLoading.value) return;
  getList(false);
};

const handleRefresh = () => {
  pageInfo.value.page = 1;
  hasMore.value = true;
  getList(true);
};
// 获取列表数据
const getList = async (isRefresh = false) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const result = await getHazardList({
      status: selectedFilter.value,
      page: pageInfo.value.page,
      page_size: pageInfo.value.page_size,
      order_name:searchKeyword.value
    })
    if (result.code === 200) {
      if (isRefresh) {
        list.value = result.data.orders;
      } else {
        list.value = [...list.value, ...result.data.orders];
      }

      pageInfo.value.total = result.data.pagination.totalCount;
      pageInfo.value.page += 1;
      hasMore.value = list.value.length < pageInfo.value.total;
    }
  }
  catch (err) {
    message.error('获取数据失败')
  }
  finally {
    isLoading.value = false;
  }
}
onMounted(() => {
  getList(true)
})
</script>
<style lang="scss" scoped>
.search-record {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  .main-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    .filter-section {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

      .filter-bar {
        display: flex;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
      }

      .more-filters-dropdown {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #eee;

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .filter-option {
            display: flex;
            align-items: center;
            justify-content: space-between;

            label {
              font-size: 14px;
              color: #333;
              font-weight: 500;
            }

            select {
              padding: 6px 12px;
              border: 1px solid #e8e8e8;
              border-radius: 4px;
              background: white;
              font-size: 14px;
              color: #333;
              outline: none;
              cursor: pointer;
            }
          }
        }
      }
    }

    .search-section {
      position: relative;
      margin-bottom: 10px;

      .search-input {
        width: 100%;
        font-size: 14px;
        outline: none;
        transition: border-color 0.3s;
      }
    }

    .list-section {
      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #999;

        .empty-icon {
          font-size: 64px;
          margin-bottom: 10px;
          opacity: 0.5;
        }

        .empty-text {
          font-size: 16px;
        }
      }
    }
  }
}
</style>