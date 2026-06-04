<template>
  <div class="not-found-container">
    <div class="not-found-content">
       <img src="@/assets/empty.png" class="w-[200px]" />
       <p>抱歉，正在开发对接中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from 'ant-design-vue'
const router = useRouter()

const goHome = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5f5f5;
}

.not-found-content {
  text-align: center;
  padding: 20px;
}

.not-found-content h1 {
  font-size: 72px;
  color: #4362EF;
  margin-bottom: 20px;
}

.not-found-content p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

/* .not-found-content button {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
} */

/* .not-found-content button:hover {
  background-color: #66b1ff;
} */
</style>