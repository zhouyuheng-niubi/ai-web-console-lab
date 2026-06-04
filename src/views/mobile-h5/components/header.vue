<template>
    <!-- 顶部标题 -->
    <header class="page-header">
      <div class="header-content flex items-center">
        <div v-if="showBack" class="back-btn" @click="handleBack">
          <LeftOutlined class="back-icon" />
        </div>
        <h1 class="flex-1 whitespace-nowrap overflow-ellipsis overflow-hidden pl-[10px]">{{title}}</h1>
      </div>
    </header>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LeftOutlined } from '@ant-design/icons-vue'
const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: '处理中心'
  },
  showBack: {
    type: Boolean,
    default: true
  }
})

const handleBack = () => {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(90deg, #1890ff 0%, #096dd9 100%);
  color: white;
  padding: 16px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  h1 {
    margin: 0;
    font-size: 18px;
    flex: 1;
  }
  
  .back-btn {
    position: absolute;
    left: 10px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  .back-icon {
    font-size: 18px;
    font-weight: bold;
  }
}


</style>
