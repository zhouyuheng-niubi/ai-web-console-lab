<template>
  <div class="processing-center flex flex-col w-full h-full pb-[68px] box-border">
    <Header title="处理中心" :showBack="false" />
    <!-- 主要内容区域 -->
    <main class="main-content flex-1 w-full overflow-y-auto box-border">
      <!-- Tab切换 -->
      <div class="tab-container flex flex-col">
        <Tabs v-model:activeKey="activeTab" @change="handleTabChange">
          <TabPane key="new" tab="新建工单">
          </TabPane>
          <TabPane key="pending">
            <template #tab>
              <span class="tab-item">
                <Badge :count="pageInfo.total" :offset="[10, 0]">
                  <span>待办处理</span>
                </Badge>
              </span>
            </template>
          </TabPane>
        </Tabs>
        <div class="tab-content flex-1 overflow-y-auto" v-if="activeTab === 'pending'">
          <InfiniteListContainer
            :list-data="list"
            :has-more="list.length < pageInfo.total"
            :page-size="pageInfo.page_size"
            :is-loading="isLoading"
            @load-more="handleLoadMore"
            @refresh="handleRefresh"
          >
            <PendingList :list="list" @item-click="handleItemClick"></PendingList>
          </InfiniteListContainer>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Badge, Tabs, TabPane, Empty } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import Header from '../components/header.vue';
import Footer from '../components/footer.vue';
import PendingList from '../components/PendingList.vue';
import InfiniteListContainer from '../components/InfiniteListContainer.vue';
import { useHiddenDangerStore } from '@/store/modules/hidden-danger';
import { getHazardList } from '@/api/hazard';
import { computed } from 'vue';
const hiddenDangerStore = useHiddenDangerStore();
const router = useRouter();
const activeTab = ref('pending');
const pageInfo = ref({
  page: 1,
  page_size: 10,
  total: 0
})
const pendingList = computed(() => {
  return hiddenDangerStore.hiddenDangerList.filter(item => item.status === 'pending' || item.status === 'auditing' || item.status === 'rejected')
})

const handleTabChange = (key) => {
  activeTab.value = key;
  if (key === 'new') {
    router.push({
      path:'/mobile/hidden-danger/create'
    });
  }
};

const handleItemClick = (item) => {
  router.push({
    path: `/mobile/hidden-danger/${item.id}`
  });
};
const list = ref([])
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

const getList = async (isRefresh = false) => {
  if (isLoading.value) return;
  isLoading.value = true;
  try{
    const result = await getHazardList({
      status: 'hazard_auditing,hazard_rejected,pending_rectification,rectification_auditing,rectification_rejected,pending_archiving',
      page: pageInfo.value.page,
      page_size: pageInfo.value.page_size,
      
    })
    if(result.code === 200){

      if (isRefresh) {
        list.value = result.data.orders;
      } else {
        list.value = [...list.value, ...result.data.orders];
      }
      
      pageInfo.value.total = result.data.pagination.totalCount;
      pageInfo.value.page += 1;
      hasMore.value = list.value.length < pageInfo.value.total;
    }
  } catch (error) {
    // message.error(error.message || '获取待办处理工单失败');
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  getList(true)
});
</script>

<style lang="scss" scoped>
.processing-center {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.main-content {
  padding: 16px;
  // max-width: 600px;
  margin: 0 auto;
}

.tab-container {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep(.ant-tabs) {
    .ant-tabs-nav {
      margin-bottom: 16px;

      .ant-tabs-tab {
        font-size: 16px;
        font-weight: 500;
        padding: 12px 20px;

        .tab-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }

      .ant-tabs-ink-bar {
        height: 3px;
        border-radius: 2px;
      }
    }

    .ant-tabs-content-holder {
      .ant-tabs-content {
        .ant-tabs-tabpane {
          padding: 0;
        }
      }
    }
  }
}

.tab-content {
  min-height: 400px;
}



.new-order-content {
  .order-type-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 8px 0;

    .order-type-card {
      background: white;
      border-radius: 12px;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid #e8e8e8;

      &:active {
        transform: scale(0.95);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .type-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .type-name {
        font-size: 15px;
        font-weight: 500;
        color: #333;
      }
    }
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 12px;
  }

  .tab-container {
    padding: 12px;

    :deep(.ant-tabs) {
      .ant-tabs-nav {
        .ant-tabs-tab {
          font-size: 14px;
          padding: 10px 16px;
        }
      }
    }
  }



  .new-order-content {
    .order-type-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .order-type-card {
        padding: 20px 12px;

        .type-icon {
          width: 56px;
          height: 56px;
          font-size: 28px;
        }

        .type-name {
          font-size: 14px;
        }
      }
    }
  }
}

@media (min-width: 768px) {
  .main-content {
    padding: 24px;
  }

  .tab-container {
    padding: 20px;
  }

  .new-order-content {
    .order-type-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  }
}
</style>