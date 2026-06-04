<template>
  <div class="consequence-simulation-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <Space>
        <Button type="primary" @click="saveConfig">保存配置</Button>
        <Button @click="resetConfig">重置</Button>
      </Space>
    </div>

    <!-- 核心内容区 -->
    <Card class="content-card">
      <Tabs defaultActiveKey="1" type="card" @change="handleTabChange">
        <!-- 1. 基础场景配置 -->
        <Tabs.TabPane tab="基础场景配置" key="1">
          <Form :model="sceneForm" layout="vertical" class="scene-form">
            <Row :gutter="[16, 16]">
              <!-- 事故类型配置 -->
              <Col :span="8">
                <Form.Item label="事故类型" name="accidentType" :rules="[{ required: true, message: '请选择事故类型' }]">
                  <Select v-model:value="sceneForm.accidentType" placeholder="请选择事故类型">
                    <Select.Option value="gasLeak">有毒有害气体泄漏</Select.Option>
                    <Select.Option value="fire">火灾</Select.Option>
                    <Select.Option value="explosion">爆炸</Select.Option>
                    <Select.Option value="collapse">坍塌</Select.Option>
                    <Select.Option value="electricShock">触电</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <!-- 泄漏源强（仅气体泄漏显示） -->
              <Col :span="8" v-if="sceneForm.accidentType === 'gasLeak'">
                <Form.Item label="泄漏速度(kg/h)" name="leakSpeed" :rules="[{ required: true, type: 'number', min: 0, message: '请输入有效泄漏速度' }]">
                  <InputNumber v-model:value="sceneForm.leakSpeed" placeholder="请输入泄漏速度" style="width: 100%" />
                </Form.Item>
              </Col>

              <!-- 爆炸物当量（仅爆炸显示） -->
              <Col :span="8" v-if="sceneForm.accidentType === 'explosion'">
                <Form.Item label="TNT当量(kg)" name="explosionEquivalent" :rules="[{ required: true, type: 'number', min: 0, message: '请输入有效TNT当量' }]">
                  <InputNumber v-model:value="sceneForm.explosionEquivalent" placeholder="请输入TNT当量" style="width: 100%" />
                </Form.Item>
              </Col>

              <!-- 环境参数 - 风速 -->
              <Col :span="8">
                <Form.Item label="风速(m/s)" name="windSpeed" :rules="[{ required: true, type: 'number', min: 0, message: '请输入有效风速' }]">
                  <InputNumber v-model:value="sceneForm.windSpeed" placeholder="请输入风速" style="width: 100%" />
                </Form.Item>
              </Col>

              <!-- 环境参数 - 风向 -->
              <Col :span="8">
                <Form.Item label="风向" name="windDirection" :rules="[{ required: true, message: '请选择风向' }]">
                  <Select v-model:value="sceneForm.windDirection" placeholder="请选择风向">
                    <Select.Option value="north">北</Select.Option>
                    <Select.Option value="south">南</Select.Option>
                    <Select.Option value="east">东</Select.Option>
                    <Select.Option value="west">西</Select.Option>
                    <Select.Option value="northeast">东北</Select.Option>
                    <Select.Option value="southeast">东南</Select.Option>
                    <Select.Option value="northwest">西北</Select.Option>
                    <Select.Option value="southwest">西南</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <!-- 环境参数 - 温度 -->
              <Col :span="8">
                <Form.Item label="环境温度(℃)" name="temperature" :rules="[{ required: true, type: 'number', message: '请输入有效温度' }]">
                  <InputNumber v-model:value="sceneForm.temperature" placeholder="请输入环境温度" style="width: 100%" />
                </Form.Item>
              </Col>

              <!-- 对象参数 - 人员密度 -->
              <Col :span="8">
                <Form.Item label="人员密度(人/㎡)" name="personDensity" :rules="[{ required: true, type: 'number', min: 0, message: '请输入有效人员密度' }]">
                  <InputNumber v-model:value="sceneForm.personDensity" placeholder="请输入人员密度" style="width: 100%" />
                </Form.Item>
              </Col>

              <!-- 对象参数 - 敏感点类型 -->
              <Col :span="8">
                <Form.Item label="Maintainer边敏感点" name="sensitivePoint" :rules="[{ required: true, message: '请选择敏感点类型' }]">
                  <Select v-model:value="sceneForm.sensitivePoint" placeholder="请选择敏感点类型" mode="multiple">
                    <Select.Option value="residential">居民区</Select.Option>
                    <Select.Option value="school">学校</Select.Option>
                    <Select.Option value="waterSource">水源地</Select.Option>
                    <Select.Option value="hospital">医院</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <!-- 厂区地形文件上传 -->
              <Col :span="8">
                <Form.Item label="厂区地形/GIS文件" name="terrainFile">
                  <Upload
                    action="/api/upload/terrain"
                    accept=".dwg,.shp,.json"
                    :file-list="terrainFileList"
                    @change="handleFileChange"
                  >
                    <Button :icon="h(UploadOutlined)">点击上传</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Tabs.TabPane>

        <!-- 2. 模拟运行与演化过程 -->
        <Tabs.TabPane tab="模拟运行与演化" key="2">
          <Space class="simulate-controls" direction="vertical" size="large">
            <div class="control-group">
              <Button type="primary" @click="startSimulation" :disabled="simulateStatus === 'running'">
                {{ simulateStatus === 'idle' ? '启动模拟' : simulateStatus === 'success' ? '重新模拟' : '模拟中...' }}
              </Button>
              <Button danger @click="stopSimulation" :disabled="simulateStatus !== 'running'">停止模拟</Button>
            </div>

            <!-- 模拟进度 -->
            <div v-if="simulateStatus === 'running'" class="simulate-progress">
              <Spin size="large" />
              <div>当前模拟进度：{{ simulateProgress }}%</div>
            </div>

            <!-- 模拟演化过程日志 -->
            <Card title="事故演化过程日志" v-if="simulateStatus === 'success'">
              <div class="evolution-log">
                <div v-for="(log, index) in evolutionLogs" :key="index" class="log-item">
                  <span class="log-time">[{{ log.time }}]</span>
                  <span class="log-content">{{ log.content }}</span>
                </div>
              </div>
            </Card>
          </Space>
        </Tabs.TabPane>

        <!-- 3. 危害后果量化分析 -->
        <Tabs.TabPane tab="后果量化分析" key="3">
          <div v-if="simulateStatus !== 'success'" class="no-data-tip">请先完成模拟运行</div>
          <div v-else>
            <Row :gutter="[16, 16]">
              <!-- 人员伤害后果 -->
              <Col :span="12">
                <Card title="人员伤害后果">
                  <Table :data-source="personHarmData" bordered>
                    <Table.Column title="伤害等级" dataIndex="level" key="level" />
                    <Table.Column title="估算人数" dataIndex="count" key="count" />
                    <Table.Column title="伤害描述" dataIndex="desc" key="desc" />
                  </Table>
                </Card>
              </Col>

              <!-- 财产损失后果 -->
              <Col :span="12">
                <Card title="财产损失后果">
                  <Table :data-source="propertyLossData" bordered>
                    <Table.Column title="损失类型" dataIndex="type" key="type" />
                    <Table.Column title="损失金额(万元)" dataIndex="amount" key="amount" />
                    <Table.Column title="损失描述" dataIndex="desc" key="desc" />
                  </Table>
                </Card>
              </Col>

              <!-- 环境与社会影响 -->
              <Col :span="24">
                <Card title="环境与社会影响">
                  <Table :data-source="envSocialData" bordered>
                    <Table.Column title="影响类型" dataIndex="type" key="type" />
                    <Table.Column title="影响范围/程度" dataIndex="scope" key="scope" />
                    <Table.Column title="修复/补救成本(万元)" dataIndex="cost" key="cost" />
                  </Table>
                </Card>
              </Col>
            </Row>
          </div>
        </Tabs.TabPane>

        <!-- 4. 可视化展示 -->
        <Tabs.TabPane tab="可视化展示" key="4">
          <div v-if="simulateStatus !== 'success'" class="no-data-tip">请先完成模拟运行</div>
          <div v-else class="visualization-container">
            <Row :gutter="[16, 16]">
              <!-- 二维扩散/火势图 -->
              <Col :span="16">
                <Card title="二维模拟效果图">
                  <div class="chart-container" ref="chart2dRef">
                  </div>
                </Card>
              </Col>

              <!-- 关键指标趋势 -->
              <Col :span="8">
                <Card title="关键指标趋势">
                  <div class="chart-container" ref="trendChartRef">
                  </div>
                </Card>
              </Col>

              <!-- 3D 场景模拟 -->
              <Col :span="24">
                <Card title="3D 厂区事故模拟">
                  <div class="3d-container">
                    <!-- Three.js 3D 场景展示区域 -->
                    <div ref="threejsContainerRef" class="threejs-container"></div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Tabs.TabPane>

        <!-- 5. 报告生成与预案优化 -->
        <Tabs.TabPane tab="报告生成与优化" key="5">
          <Space direction="vertical" size="large" class="report-container">
            <div class="report-controls">
              <Button type="primary" @click="generateReport" :disabled="simulateStatus !== 'success'">
                生成模拟报告
              </Button>
              <Button @click="exportReport" :disabled="!reportGenerated" class="ml-2">导出Word</Button>
            </div>

            <!-- 报告预览 -->
            <Card title="模拟报告预览" v-if="reportGenerated">
              <div class="report-preview" v-html="reportContent"></div>
            </Card>

            <!-- 预案优化建议 -->
            <Card title="应急预案优化建议" v-if="reportGenerated">
              <div class="optimize-suggestions">
                <div v-for="(suggestion, index) in optimizeSuggestions" :key="index" class="suggestion-item">
                  {{ index + 1 }}. {{ suggestion }}
                </div>
              </div>
            </Card>
          </Space>
        </Tabs.TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, h, nextTick } from 'vue';
import { ThreeJSSceneManager } from '../../utils/ThreeJSSceneManager.js';
// 按需引入 ant-design-vue 组件
import {
  Button,
  Tabs,
  Form,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Space,
  Table,
  Upload,
  Spin,
  Divider,
  message
} from 'ant-design-vue';
import { asBlob } from 'html-docx-js-typescript';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
// 引入图标
import { UploadOutlined } from '@ant-design/icons-vue';

// 表单数据
const sceneForm = reactive({
  accidentType: null, // 事故类型
  leakSpeed: 0, // 泄漏速度
  explosionEquivalent: 0, // TNT当量
  windSpeed: 2, // 风速
  windDirection: 'north', // 风向
  temperature: 25, // 环境温度
  personDensity: 0.5, // 人员密度
  sensitivePoint: [] // Maintainer边敏感点
});

// 上传文件列表
const terrainFileList = ref([]);
// 模拟状态：idle(未开始)/running(模拟中)/success(完成)/failed(失败)
const simulateStatus = ref('idle');
// 模拟进度
const simulateProgress = ref(0);
// 演化过程日志
const evolutionLogs = ref([]);
// 人员伤害数据
const personHarmData = ref([]);
// 财产损失数据
const propertyLossData = ref([]);
// 环境与社会影响数据
const envSocialData = ref([]);
// 报告生成状态
const reportGenerated = ref(false);
// 报告内容
const reportContent = ref('');
// 优化建议
const optimizeSuggestions = ref([]);
// ECharts 实例
const chart2dRef = ref(null);
const trendChartRef = ref(null);
// Three.js 相关
const threejsContainerRef = ref(null);
let threeJSSceneManager = null;

// 处理文件上传
const handleFileChange = (info) => {
  terrainFileList.value = info.fileList;
  if (info.file.status === 'done') {
    message.success(`${info.file.name} 文件上传成功`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
};

// 保存配置
const saveConfig = () => {
  // 实际项目中调用接口保存配置
  message.success('场景配置保存成功');
};

// 重置配置
const resetConfig = () => {
  Object.assign(sceneForm, {
    accidentType: '',
    leakSpeed: 0,
    explosionEquivalent: 0,
    windSpeed: 2,
    windDirection: 'north',
    temperature: 25,
    personDensity: 0.5,
    sensitivePoint: []
  });
  terrainFileList.value = [];
  message.info('配置已重置');
};

// 启动模拟
const startSimulation = () => {
  simulateStatus.value = 'running';
  simulateProgress.value = 0;
  evolutionLogs.value = [];

  // 模拟进度更新（实际项目中替换为后端算法调用）
  const progressTimer = setInterval(() => {
    simulateProgress.value += 10;
    // 根据事故类型生成不同的日志内容
    if (simulateProgress.value === 20) {
      let logContent = '';
      switch (sceneForm.accidentType) {
        case 'gasLeak':
          logContent = '事故触发：检测到有毒有害气体泄漏发生，泄漏源位于储罐区';
          break;
        case 'fire':
          logContent = '事故触发：生产车间发生火灾事故，火势正在蔓延';
          break;
        case 'explosion':
          logContent = '事故触发：反应釜区域发生爆炸，产生强烈冲击波';
          break;
        case 'collapse':
          logContent = '事故触发：建筑结构发生局部坍塌，影响Maintainer边区域';
          break;
        case 'electricShock':
          logContent = '事故触发：配电室发生触电事故，影响供电系统';
          break;
        default:
          logContent = '事故触发：检测到安全生产事故发生';
      }
      evolutionLogs.value.push({ time: '00:00:10', content: logContent });
    } else if (simulateProgress.value === 40) {
      let logContent = '';
      switch (sceneForm.accidentType) {
        case 'gasLeak':
          logContent = '事故发展：有毒气体扩散至50m范围，浓度超过安全阈值，影响Maintainer边人员';
          break;
        case 'fire':
          logContent = '事故发展：火势蔓延至相邻设备，温度急剧上升，可能引发二次事故';
          break;
        case 'explosion':
          logContent = '事故发展：爆炸冲击波影响范围扩大，Maintainer边建筑物受损，人员疏散中';
          break;
        case 'collapse':
          logContent = '事故发展：坍塌面积扩大，埋压风险增加，救援队伍已到达现场';
          break;
        case 'electricShock':
          logContent = '事故发展：停电范围扩大，影响生产区域照明和通风系统';
          break;
        default:
          logContent = '事故发展：事故影响范围扩大，需要紧急处置';
      }
      evolutionLogs.value.push({ time: '00:00:30', content: logContent });
    } else if (simulateProgress.value === 60) {
      let logContent = '';
      switch (sceneForm.accidentType) {
        case 'gasLeak':
          logContent = '衍生事故：高浓度气体可能引发爆炸风险，紧急疏散Maintainer边人员';
          break;
        case 'fire':
          logContent = '衍生事故：火势威胁危化品储存区，可能引发二次泄漏';
          break;
        case 'explosion':
          logContent = '衍生事故：爆炸引发局部火灾，有毒气体开始扩散';
          break;
        case 'collapse':
          logContent = '衍生事故：坍塌导致管道破裂，发生二次泄漏事故';
          break;
        case 'electricShock':
          logContent = '衍生事故：停电导致通风系统失效，有毒气体聚集风险增加';
          break;
        default:
          logContent = '衍生事故：引发二次连锁反应，需要扩大应急响应';
      }
      evolutionLogs.value.push({ time: '00:01:00', content: logContent });
    } else if (simulateProgress.value === 80) {
      let logContent = '';
      switch (sceneForm.accidentType) {
        case 'gasLeak':
          logContent = '事故受控：泄漏源封堵成功，气体扩散得到控制，环境监测进行中';
          break;
        case 'fire':
          logContent = '事故受控：消防力量控制火势蔓延，危险区域隔离完成';
          break;
        case 'explosion':
          logContent = '事故受控：现场安全评估完成，未发现新的爆炸风险，救援工作有序进行';
          break;
        case 'collapse':
          logContent = '事故受控：结构稳定评估完成，救援工作进入精细阶段';
          break;
        case 'electricShock':
          logContent = '事故受控：备用电源启动，关键系统恢复，触电风险已排除';
          break;
        default:
          logContent = '事故受控：应急措施生效，事故得到有效控制';
      }
      evolutionLogs.value.push({ time: '00:02:00', content: logContent });
    } else if (simulateProgress.value >= 100) {
      clearInterval(progressTimer);
      simulateProgress.value = 100;
      simulateStatus.value = 'success';
      // 生成模拟结果数据
      generateSimulationResult();
      message.success('模拟运行完成');
    }
  },100);
};

// 停止模拟
const stopSimulation = () => {
  simulateStatus.value = 'idle';
  simulateProgress.value = 0;
  evolutionLogs.value = [];
  message.info('模拟已停止');
};

// 生成模拟结果数据
const generateSimulationResult = () => {
  // 根据事故类型生成人员伤害数据
  switch (sceneForm.accidentType) {
    case 'gasLeak':
      personHarmData.value = [
        { level: '轻伤', count: 18, desc: '轻微中毒症状，呼吸道刺激，门诊治疗' },
        { level: '重伤', count: 5, desc: '重度中毒，住院观察治疗' },
        { level: '死亡', count: 1, desc: '高浓度中毒，现场抢救无效死亡' }
      ];
      break;
    case 'fire':
      personHarmData.value = [
        { level: '轻伤', count: 8, desc: '轻微烧伤，皮肤红肿，门诊处理' },
        { level: '重伤', count: 6, desc: '二至三度烧伤，需住院植皮治疗' },
        { level: '死亡', count: 2, desc: '严重烧伤合并烟雾中毒，抢救无效死亡' }
      ];
      break;
    case 'explosion':
      personHarmData.value = [
        { level: '轻伤', count: 10, desc: '冲击波擦伤，轻微震伤' },
        { level: '重伤', count: 8, desc: '冲击波内脏损伤，骨折，需手术治疗' },
        { level: '死亡', count: 4, desc: '冲击波和爆炸物直接冲击，当场死亡' }
      ];
      break;
    case 'collapse':
      personHarmData.value = [
        { level: '轻伤', count: 6, desc: '擦伤扭伤，轻微外伤' },
        { level: '重伤', count: 9, desc: '骨折，挤压伤，内出血，需手术治疗' },
        { level: '死亡', count: 3, desc: '埋压窒息，内脏严重损伤，现场死亡' }
      ];
      break;
    case 'electricShock':
      personHarmData.value = [
        { level: '轻伤', count: 4, desc: '轻微电击伤，皮肤灼伤' },
        { level: '重伤', count: 3, desc: '电击导致心律失常，烧伤，需住院治疗' },
        { level: '死亡', count: 2, desc: '高压电击，心搏骤停，抢救无效' }
      ];
      break;
    default:
      personHarmData.value = [
        { level: '轻伤', count: 12, desc: '一般伤害，无需住院' },
        { level: '重伤', count: 3, desc: '严重伤害，需住院治疗' },
        { level: '死亡', count: 0, desc: '无人员死亡' }
      ];
  }

  // 根据事故类型生成财产损失数据
  switch (sceneForm.accidentType) {
    case 'gasLeak':
      propertyLossData.value = [
        { type: '设备损坏', amount: 25, desc: '储罐泄漏管道损坏，密封件更换' },
        { type: '原材料损失', amount: 45, desc: '危化品泄漏损失' },
        { type: '停产损失', amount: 80, desc: '停产2天进行安全检修' }
      ];
      break;
    case 'fire':
      propertyLossData.value = [
        { type: '设备损坏', amount: 120, desc: '生产设备烧毁，管道熔化' },
        { type: '原材料损失', amount: 35, desc: '原材料燃烧损失' },
        { type: '停产损失', amount: 150, desc: '生产线重建，停产1Maintainer' }
      ];
      break;
    case 'explosion':
      propertyLossData.value = [
        { type: '设备损坏', amount: 200, desc: '设备完全损毁，厂房结构损坏' },
        { type: '原材料损失', amount: 60, desc: '爆炸导致的物料损失' },
        { type: '停产损失', amount: 180, desc: '厂房重建，停产2Maintainer' }
      ];
      break;
    case 'collapse':
      propertyLossData.value = [
        { type: '设备损坏', amount: 90, desc: '设备埋压损坏，结构修复' },
        { type: '原材料损失', amount: 15, desc: '埋压导致的物料损失' },
        { type: '停产损失', amount: 120, desc: '结构加固，停产1Maintainer' }
      ];
      break;
    case 'electricShock':
      propertyLossData.value = [
        { type: '设备损坏', amount: 35, desc: '电气设备烧毁，线路更换' },
        { type: '原材料损失', amount: 5, desc: '停电导致的少量原料变质' },
        { type: '停产损失', amount: 60, desc: '电力系统检修，停产3天' }
      ];
      break;
    default:
      propertyLossData.value = [
        { type: '设备损坏', amount: 58, desc: '设备损坏维修' },
        { type: '原材料损失', amount: 22, desc: '原料损失' },
        { type: '停产损失', amount: 120, desc: '停产损失' }
      ];
  }

  // 根据事故类型生成环境与社会影响数据
  switch (sceneForm.accidentType) {
    case 'gasLeak':
      envSocialData.value = [
        { type: '大气污染', scope: 'Maintainer边2km范围有毒气体影响', cost: 65 },
        { type: '水体污染', scope: '无明显污染', cost: 0 },
        { type: '居民生活影响', scope: 'Maintainer边1km居民紧急疏散3小时', cost: 25 },
        { type: '企业声誉损失', scope: '市级环保舆情影响', cost: 45 }
      ];
      break;
    case 'fire':
      envSocialData.value = [
        { type: '大气污染', scope: 'Maintainer边1.5km范围烟雾影响', cost: 40 },
        { type: '水体污染', scope: '消防废水污染Maintainer边水体', cost: 30 },
        { type: '居民生活影响', scope: 'Maintainer边800m居民临时疏散', cost: 20 },
        { type: '企业声誉损失', scope: '省级安全事故舆情', cost: 80 }
      ];
      break;
    case 'explosion':
      envSocialData.value = [
        { type: '大气污染', scope: '冲击波扬尘影响3km范围', cost: 55 },
        { type: '水体污染', scope: '爆炸碎片污染局部水体', cost: 20 },
        { type: '居民生活影响', scope: 'Maintainer边2km居民紧急疏散，房屋受损', cost: 120 },
        { type: '企业声誉损失', scope: '全国性重大安全事故舆情', cost: 150 }
      ];
      break;
    case 'collapse':
      envSocialData.value = [
        { type: '大气污染', scope: '扬尘影响Maintainer边500m范围', cost: 15 },
        { type: '水体污染', scope: '建筑垃圾污染少量水体', cost: 10 },
        { type: '居民生活影响', scope: 'Maintainer边300m居民临时安置', cost: 35 },
        { type: '企业声誉损失', scope: '市级建筑安全舆情', cost: 40 }
      ];
      break;
    case 'electricShock':
      envSocialData.value = [
        { type: '大气污染', scope: '电气火灾烟雾局部影响', cost: 8 },
        { type: '水体污染', scope: '无明显污染', cost: 0 },
        { type: '居民生活影响', scope: 'Maintainer边200m居民短暂停电', cost: 12 },
        { type: '企业声誉损失', scope: '区域性用电安全舆情', cost: 25 }
      ];
      break;
    default:
      envSocialData.value = [
        { type: '大气污染', scope: 'Maintainer边1km范围', cost: 35 },
        { type: '水体污染', scope: '无明显污染', cost: 0 },
        { type: '居民生活影响', scope: 'Maintainer边500m居民临时疏散', cost: 18 },
        { type: '企业声誉损失', scope: '区域级舆情影响', cost: 50 }
      ];
  }

  // 标记图表已准备好初始化，但不立即初始化
  // 等待用户切换到可视化展示标签页时再初始化
  console.log('模拟数据生成完成，等待切换到可视化展示标签页');
};

// 生成模拟报告
const generateReport = () => {
  // 模拟报告内容（实际项目中可通过后端生成HTML/文档）
  reportContent.value = `
    <div class="report-content">
      <h3>安全生产事故后果模拟报告</h3>
      <p><strong>模拟场景：</strong>${
        sceneForm.accidentType === 'gasLeak' ? '有毒气体泄漏' :
        sceneForm.accidentType === 'fire' ? '火灾' :
        sceneForm.accidentType === 'explosion' ? '爆炸' : '其他事故'
      }</p>
      <p><strong>环境参数：</strong>风速${sceneForm.windSpeed}m/s，风向${sceneForm.windDirection}，温度${sceneForm.temperature}℃</p>
      <h4>一、事故演化过程</h4>
      <ul>
        ${evolutionLogs.value.map(log => `<li>[${log.time}] ${log.content}</li>`).join('')}
      </ul>
      <h4>二、危害后果量化</h4>
      <p><strong>人员伤害：</strong>轻伤${personHarmData.value[0].count}人，重伤${personHarmData.value[1].count}人，死亡${personHarmData.value[2].count}人</p>
      <p><strong>财产损失：</strong>总计${propertyLossData.value.reduce((sum, item) => sum + item.amount, 0)}万元</p>
      <h4>三、应急处置效果</h4>
      <p>应急措施及时生效，有效控制了事故扩大，降低了50%的潜在损失</p>
    </div>
  `;

  // 生成优化建议
  optimizeSuggestions.value = [
    '优化泄漏点封堵应急预案，缩短封堵响应时间至10分钟内',
    '增加厂区东侧应急物资储备点，覆盖敏感点居民区方向',
    '调整人员疏散路线，避开气体扩散主风向',
    '定期开展危化品泄漏应急演练，提升人员处置能力'
  ];

  reportGenerated.value = true;
  message.success('模拟报告生成成功');
};

// 导出报告
const exportReport = () => {
    try {
        if (!reportContent.value) return message.info('暂无报告数据，请生成报告后下载！');
        let suggestions = '';

        optimizeSuggestions.value.forEach(item => {
            suggestions += `<li>${item}</li>`;
        });
        // 构造完整的HTML结构
        const html = `
            ${reportContent.value}
            <h4>四、优化建议</h4>
            <ul>${suggestions}</ul>
        `;

        // 转换为Word文档并下载
        asBlob(html).then((res) => {
        saveAs(
            res,
            `后果模拟报告${dayjs().format('YYYY-MM-DD HH:mm:ss')}.docx`,
        );
        });
    } catch (error) {
        console.error('导出失败:', error);
        message.error({ content: '导出失败', key: 'export' });
    }
};

// 初始化 Three.js 3D 场景
const initThreeJSScene = () => {
  if (!threejsContainerRef.value) {
    console.log('Three.js 容器不存在');
    return;
  }

  // 创建 Three.js 场景管理器实例
  threeJSSceneManager = new ThreeJSSceneManager(threejsContainerRef.value);
  
  // 设置模型加载完成的回调函数
  threeJSSceneManager.setModelLoadedCallback(() => {
    // 根据事故类型模拟相应的事故效果
    const accidentType = sceneForm.accidentType;
    if (accidentType) {
      // 根据不同的事故类型设置事故位置
      let accidentPosition = { x: 0, y: 4, z: 0 };
      
      switch (accidentType) {
        case 'gasLeak':
          accidentPosition = { x:10, y: 0, z: 0 }; // 有毒气体位置
          break;
        case 'fire':
          accidentPosition = { x: 20, y: 0, z:-20 }; // 火灾位置
          break;
        case 'explosion':
          accidentPosition = { x: 15, y: 0, z: 5 }; // 中心区域
          break;
        case 'collapse':
          accidentPosition = { x: 25, y: 12, z: 0 }; // 建筑物位置
          break;
        case 'electricShock':
          accidentPosition = { x: 30, y: 0, z: -18}; // 电气火灾位置
          break;
        default:
          accidentPosition = { x: 0, y: 0, z: 0 };
      }
      
      threeJSSceneManager.simulateAccident(accidentType, accidentPosition);
    }
  });
  
  // 初始化场景（但不立即触发事故）
  threeJSSceneManager.init();
  
  console.log('Three.js 场景初始化完成，等待模型加载...');
};

// 初始化二维扩散/火势图
const init2DChart = () => {
  console.log('初始化2D图表...');
  if (!chart2dRef.value) {
    console.log('chart2d容器不存在');
    return;
  }
  
  // 清除之前的内容
  chart2dRef.value.innerHTML = '';
  
  // 获取容器的实际尺寸
  const containerRect = chart2dRef.value.getBoundingClientRect();
  const width = containerRect.width || 800;
  const height = containerRect.height || 400;
  
  // 创建canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = width;  // 设置实际的像素宽度
  canvas.height = height; // 设置实际的像素高度
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  chart2dRef.value.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  
  // 根据事故类型生成不同的图表数据
  const accidentType = sceneForm.accidentType;
  let chartData, chartTitle, chartType;
  
  if (accidentType === 'gasLeak') {
    chartTitle = '有毒气体扩散浓度分布';
    chartType = 'heatmap';
    chartData = generateGasLeakData();
  } else if (accidentType === 'fire') {
    chartTitle = '火势蔓延热力图';
    chartType = 'fire';
    chartData = generateFireSpreadData();
  } else if (accidentType === 'explosion') {
    chartTitle = '爆炸冲击波影响范围';
    chartType = 'explosion';
    chartData = generateExplosionData();
  } else {
    chartTitle = '事故影响范围';
    chartType = 'default';
    chartData = generateDefaultData();
  }

  // 绘制图表
//   console.log('绘制2D图表:', chartType, chartTitle, '数据点数量:', chartData.length);
  draw2DChart(ctx, chartData, chartType, chartTitle);
};

// 生成气体泄漏数据
const generateGasLeakData = () => {
  const data = [];
  const gridSize = 50;
  const centerX = gridSize / 2;
  const centerY = gridSize / 2;
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const distance = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2));
      const concentration = Math.max(0, 100 - distance * 2);
      if (concentration > 5) {
        data.push([i, j, concentration]);
      }
    }
  }
  return data;
};

// 生成火势蔓延数据
const generateFireSpreadData = () => {
  const data = [];
  const gridSize = 50;
  const centerX = gridSize / 2;
  const centerY = gridSize / 2;
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const distance = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2));
      const intensity = Math.max(0, 100 - distance * 1.5);
      if (intensity > 10) {
        data.push([i, j, intensity]);
      }
    }
  }
  return data;
};

// 生成爆炸冲击波数据
const generateExplosionData = () => {
  const data = [];
  const gridSize = 50;
  const centerX = gridSize / 2;
  const centerY = gridSize / 2;
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const distance = Math.sqrt(Math.pow(i - centerX, 2) + Math.pow(j - centerY, 2));
      const impact = Math.max(0, 100 - distance * 3);
      if (impact > 5) {
        data.push([i, j, impact]);
      }
    }
  }
  return data;
};

// 生成默认数据
const generateDefaultData = () => {
  const data = [];
  const gridSize = 50;
  
  for (let i = 10; i < gridSize - 10; i++) {
    for (let j = 10; j < gridSize - 10; j++) {
      const value = Math.random() * 50 + 20;
      data.push([i, j, value]);
    }
  }
  return data;
};

// 绘制二维图表
const draw2DChart = (ctx, data, type, title) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const gridSize = 50;
  
  // 清空画布
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, width, height);
  
  // 计算缩放比例
  const scaleX = width / gridSize;
  const scaleY = height / gridSize;
  
  // 绘制数据点
  data.forEach(([x, y, value]) => {
    const intensity = value / 100;
    
    // 根据类型设置颜色
    let color;
    if (type === 'heatmap') {
      // 气体泄漏：蓝色到红色
      color = `rgba(255, ${255 - intensity * 200}, ${255 - intensity * 255}, ${0.3 + intensity * 0.7})`;
    } else if (type === 'fire') {
      // 火势：黄色到红色
      color = `rgba(255, ${255 - intensity * 100}, 0, ${0.3 + intensity * 0.7})`;
    } else if (type === 'explosion') {
      // 爆炸：白色到橙色
      color = `rgba(255, ${200 - intensity * 100}, ${100 - intensity * 100}, ${0.3 + intensity * 0.7})`;
    } else {
      // 默认：蓝色到绿色
      color = `rgba(0, ${100 + intensity * 155}, 100, ${0.3 + intensity * 0.7})`;
    }
    
    ctx.fillStyle = color;
    ctx.fillRect(x * scaleX, y * scaleY, scaleX, scaleY);
  });
  
  // 绘制标题
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 30);
  
  // 绘制坐标轴
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, height - 40);
  ctx.lineTo(width - 20, height - 40);
  ctx.moveTo(40, 60);
  ctx.lineTo(40, height - 40);
  ctx.stroke();
  
  // 绘制坐标轴标签
  ctx.font = '12px Arial';
  ctx.fillStyle = '#666';
  ctx.textAlign = 'center';
  ctx.fillText('距离 (m)', width / 2, height - 10);
  
  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('距离 (m)', 0, 0);
  ctx.restore();
};

// 初始化趋势图
const initTrendChart = () => {
//   console.log('初始化趋势图...');
  if (!trendChartRef.value) {
    console.log('trendChart容器不存在');
    return;
  }
  
  // 清除之前的内容
  trendChartRef.value.innerHTML = '';
  
  // 获取容器的实际尺寸
  const containerRect = trendChartRef.value.getBoundingClientRect();
  const width = containerRect.width || 400;
  const height = containerRect.height || 400;
  
  // 创建canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = width;  // 设置实际的像素宽度
  canvas.height = height; // 设置实际的像素高度
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  trendChartRef.value.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  
  // 生成时间序列数据
  const accidentType = sceneForm.accidentType;
  const trendData = generateTrendData(accidentType);
  
  // 绘制趋势图
//   console.log('绘制趋势图:', '数据点数量:', trendData.timePoints.length);
  drawTrendChart(ctx, trendData);
};

// 生成趋势数据
const generateTrendData = (accidentType) => {
  const timePoints = [];
  const concentrationData = [];
  const casualtyData = [];
  
  // 生成0-10分钟的时间点数据
  for (let i = 0; i <= 10; i++) {
    timePoints.push(`${i}分钟`);
    
    if (accidentType === 'gasLeak') {
      // 气体浓度变化
      const concentration = Math.max(0, 100 - i * 8 + Math.sin(i * 0.5) * 10);
      concentrationData.push(concentration);
      // 累计伤亡
      const casualties = Math.min(15, Math.floor(i * 1.2));
      casualtyData.push(casualties);
    } else if (accidentType === 'fire') {
      // 火势强度
      const intensity = Math.min(100, i * 15 + Math.random() * 10);
      concentrationData.push(intensity);
      // 累计伤亡
      const casualties = Math.min(20, Math.floor(i * 1.8));
      casualtyData.push(casualties);
    } else if (accidentType === 'explosion') {
      // 冲击波强度
      const shockwave = Math.max(0, 100 - i * 20);
      concentrationData.push(shockwave);
      // 瞬时伤亡（爆炸）
      const casualties = i === 0 ? 8 : Math.min(8, Math.floor(8 - i * 0.5));
      casualtyData.push(casualties);
    } else {
      // 默认数据
      concentrationData.push(50 + Math.random() * 30);
      casualtyData.push(Math.floor(i * 0.8));
    }
  }
  
  return {
    timePoints,
    concentrationData,
    casualtyData
  };
};

// 绘制趋势图
const drawTrendChart = (ctx, data) => {
  const { timePoints, concentrationData, casualtyData } = data;
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // 清空画布
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  
  // 绘制网格
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  
  // 横向网格线
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  
  // 纵向网格线
  for (let i = 0; i <= 10; i++) {
    const x = padding + (chartWidth / 10) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }
  
  // 绘制坐标轴
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // 计算数据范围
  const maxConcentration = Math.max(...concentrationData);
  const maxCasualty = Math.max(...casualtyData);
  
  // 绘制浓度曲线
  ctx.strokeStyle = '#1890ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  concentrationData.forEach((value, index) => {
    const x = padding + (chartWidth / (timePoints.length - 1)) * index;
    const y = height - padding - (value / maxConcentration) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  
  // 绘制伤亡曲线
  ctx.strokeStyle = '#ff4d4f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  casualtyData.forEach((value, index) => {
    const x = padding + (chartWidth / (timePoints.length - 1)) * index;
    const y = height - padding - (value / maxCasualty) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  
  // 绘制数据点
  concentrationData.forEach((value, index) => {
    const x = padding + (chartWidth / (timePoints.length - 1)) * index;
    const y = height - padding - (value / maxConcentration) * chartHeight;
    
    ctx.fillStyle = '#1890ff';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  
  casualtyData.forEach((value, index) => {
    const x = padding + (chartWidth / (timePoints.length - 1)) * index;
    const y = height - padding - (value / maxCasualty) * chartHeight;
    
    ctx.fillStyle = '#ff4d4f';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // 绘制图例
  ctx.fillStyle = '#1890ff';
  ctx.fillRect(width - 150, 20, 15, 3);
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('浓度/强度', width - 130, 25);
  
  ctx.fillStyle = '#ff4d4f';
  ctx.fillRect(width - 150, 40, 15, 3);
  ctx.fillStyle = '#333';
  ctx.fillText('累计伤亡', width - 130, 45);
  
  // 绘制坐标轴标签
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('时间', width / 2, height - 10);
  
  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('数值', 0, 0);
  ctx.restore();
  
  // 绘制X轴标签
  ctx.font = '10px Arial';
  ctx.fillStyle = '#999';
  for (let i = 0; i < timePoints.length; i += 2) {
    const x = padding + (chartWidth / (timePoints.length - 1)) * i;
    ctx.fillText(timePoints[i], x, height - padding + 20);
  }
};

// 窗口大小改变时重新绘制图表和调整3D场景
const handleResize = () => {
  if (simulateStatus.value === 'success') {
    nextTick(() => {
      init2DChart();
      initTrendChart();
      
      // 更新 Three.js 场景尺寸
      if (threeJSSceneManager && threejsContainerRef.value) {
        const containerRect = threejsContainerRef.value.getBoundingClientRect();
        const width = containerRect.width || 800;
        const height = containerRect.height || 500;
        
        threeJSSceneManager.updateSize(width, height);
      }
    });
  }
};

// 处理标签页切换事件
const handleTabChange = (activeKey) => {
  console.log('切换到标签页:', activeKey);
  
  // 当切换到可视化展示标签页（key="4"）且模拟已完成时，初始化图表
  if (activeKey === "4" && simulateStatus.value === 'success') {
    console.log('切换到可视化展示标签页，初始化图表');
    // 使用nextTick确保DOM更新完成后再初始化
    nextTick(() => {
      setTimeout(() => {
        init2DChart();
        initTrendChart();
        initThreeJSScene();
      }, 100);
    });
  }
};

onMounted(() => {
  // 页面初始化逻辑
  console.log('后果模拟页面初始化完成');
  
  // 监听窗口大小变化
//   window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 组件卸载时清理监听器
  window.removeEventListener('resize', handleResize);
  
  // 清理 Three.js 资源
  if (threeJSSceneManager) {
    threeJSSceneManager.dispose();
    threeJSSceneManager = null;
  }
  
  // 注意：不清理共享模型，让其他组件可以继续使用
  // ThreeJSSceneManager.disposeSharedModel(); // 只在应用真正退出时调用
});
</script>

<style scoped>
.consequence-simulation-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
}

.content-card {
  background-color: #fff;
}

.scene-form {
  padding: 10px 0;
}

.simulate-controls {
  padding: 10px;
}

.control-group {
  display: flex;
  gap: 16px;
}

.simulate-progress {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.evolution-log {
  max-height: 300px;
  overflow-y: auto;
}

.log-item {
  margin: 8px 0;
  line-height: 1.6;
}

.log-time {
  color: #1677ff;
  font-weight: 600;
}

.no-data-tip {
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 16px;
}

.visualization-container {
  padding: 10px 0;
}

.chart-container {
  height: 400px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  display: block;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
}

.chart-container canvas {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.chart-placeholder, .3d-placeholder {
  color: #999;
  font-size: 16px;
  text-align: center;
}

.3d-container {
  height: 500px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.threejs-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.threejs-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.report-container {
  padding: 10px;
}

.report-preview {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background-color: #f9f9f9;
  min-height: 300px;
}

.optimize-suggestions {
  padding: 16px;
}

.suggestion-item {
  margin: 8px 0;
  line-height: 1.6;
}
</style>