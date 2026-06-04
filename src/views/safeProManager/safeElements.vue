<template>
  <div class="safe-elements-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">安全管理体系要素</h1>
      <p class="page-description">点击查看各要素查看详情</p>
    </div>

    <!-- 要素卡片网格 -->
    <div class="elements-grid">
      <Row :gutter="[24, 24]">
        <Col :span="6" v-for="(element, index) in elements" :key="element.id">
          <Card class="element-card" @click="showDetail(element)">
            <div class="card-content">
              <div class="card-number">{{ index + 1 }}</div>
              <div class="card-title">{{ element?.name }}</div>
              <div class="card-description">{{ element.description }}</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>

    <!-- 详情弹窗 -->
    <Modal
      v-model:open="detailVisible"
      :title="selectedElement?.title"
      width="800px"
      @cancel="detailVisible = false"
    >
      <div class="detail-content" v-if="selectedElement">
        <div class="detail-description">{{ selectedElement.description }}</div>
        <div class="detail-points">
          <h3>关键要点：</h3>
          <p class="preserve-text">
            {{selectedElement.key_points}}
          </p>
        </div>
        <div class="detail-points mt-[20px]" v-if="selectedElement?.children && selectedElement.children.length > 0">
          <h3>子要素：</h3>
          <div v-for="child, childIndex in selectedElement.children" :key="child.id">
            <span class="font-bold">{{childIndex + 1}}.{{ child.name }}：</span>
            <span class="preserve-text">{{ child.description }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <Button type="primary" @click="detailVisible = false">关闭</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import {useMainStore} from '@/store'
import { ref,computed,onMounted} from 'vue';
import { 
  Card, 
  Modal, 
  Button,
  Row,
  Col
} from 'ant-design-vue';
import { getSafetyElementList } from '@/api/system/safetyElement';


// 定义要素数据结构
interface SafeElement {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  keyPoints: string[];
}

// 14个要素数据
const elements = ref<SafeElement[]>([]);

// 控制详情弹窗显示
const detailVisible = ref(false);

// 当前选中的要素
const selectedElement = ref<SafeElement | null>(null);

// 显示详情
const showDetail = (element: SafeElement) => {
  selectedElement.value = element;
  detailVisible.value = true;
};

const getInfos = async () => {
  const trees = await getSafetyElementList({
    tree: true
  });
  elements.value = trees?.data || [];
};
onMounted(() => {
  getInfos();
});
</script>

<style scoped>
.safe-elements-container {
  padding: 16px;
  background-color: #f5f5f5;
  height: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.page-description {
  font-size: 16px;
  color: #666;
}

.elements-grid {
  width: 100%;
  margin: 0 auto;
}

.element-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
}

.element-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-number {
  font-size: 14px;
  color: #4362EF;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  flex: 1;
}

.card-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.detail-content {
  padding: 20px;
  max-height: 700px;
  overflow-y: auto;
}

.detail-description {
  font-size: 16px;
  color: #333;
  line-height: 1.7;
  margin-bottom: 20px;
}

.detail-points h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.detail-points ul {
  padding-left: 20px;
}

.detail-points li {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 8px;
}

.preserve-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
}
</style>