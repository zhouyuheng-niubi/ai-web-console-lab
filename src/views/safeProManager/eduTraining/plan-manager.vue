<template>
  <div class="plan-management">
    <!-- 顶部信息卡片 -->
    <Card class="top-card">
      <div class="card-content">
        <div class="left-section">
          <img 
            src="@/assets/action/warning-icon.png" 
            alt="安全知识封面" 
            class="course-cover"
          />
          <!-- <div class="growth-btn bg-[#108ee9]">安全知识</div> -->
        </div>
        
        <div class="right-section">
          <div class="course-number">22</div>
          <div class="course-subtitle">项安全规范</div>
          <div class="stage-info">共 1 个阶段</div>
          <div class="meta-info">
            安全管理员 创建于2025-12-3 上次更新：2025-12-3
          </div>
          
          <Space :size="12" class="action-buttons" @click="handleTips">
            <Button type="primary">发布计划</Button>
            <Button>分享</Button>
            <Button>设置</Button>
            <Button>学习记录</Button>
            <Button>安全管理</Button>
          </Space>
        </div>
      </div>
    </Card>

    <!-- 计划安排 -->
    <div class="plan-section">
      <h2 class="section-title">安全知识安排</h2>
      
      <!-- 阶段显示选项 -->
      <Card class="stage-options">
        <div class="stage-display">
          <span class="label">阶段显示</span>
          <Space :size="16">
            <div class="option-item" :class="{ selected: displayType === 'text' }">
              <Radio :checked="displayType === 'text'" @change="displayType = 'text'">文字命名</Radio>
            </div>
            <div class="option-item" :class="{ selected: displayType === 'letter' }">
              <Radio :checked="displayType === 'letter'" @change="displayType = 'letter'">
                <Tag color="blue" class="letter-tag">S</Tag>
              </Radio>
            </div>
            <div class="option-item" :class="{ selected: displayType === 'icon' }">
              <Radio :checked="displayType === 'icon'" @change="displayType = 'icon'">图标命名</Radio>
            </div>
            <div class="option-item">
              <span class="emoji-icon">⚠️</span>
            </div>
          </Space>
        </div>
      </Card>

      <!-- 阶段列表 -->
      <div class="stage-list">
        <div v-for="stage in stages" :key="stage.id">
          <Card class="stage-item">
            <div class="stage-header">
              <div class="stage-title">
                <span class="stage-label">{{ stage.label }}</span>
              </div>
              
              <div class="stage-controls">
                <Select v-model:value="selectedCount" style="width: 80px">
                  <SelectOption :value="2">2</SelectOption>
                  <SelectOption :value="3">3</SelectOption>
                  <SelectOption :value="4">4</SelectOption>
                </Select>
                <span class="count-display">{{ selectedCount }}</span>
              </div>

              <div class="stage-actions" @click="handleTips">
                <Button type="text" :icon="h(EditOutlined)" />
                <Button type="text" :icon="h(PlusCircleOutlined)" />
                <Button type="text" :icon="h(ShareAltOutlined)" />
                <Button type="text" danger :icon="h(DeleteOutlined)" />
              </div>
            </div>

            <div class="stage-content">
              <div class="content-row">
                <div class="upload-section">
                  <div class="upload-label">添加安全课件</div>
                  <Upload
                    :fileList="stage.courseFiles || []"
                    :beforeUpload="(file) => beforeUpload(file, stage.id, 'course')"
                    :customRequest="(options) => handleUpload(options, stage.id, 'course')"
                    @change="(info) => handleChange(info, stage.id, 'course')"
                    accept="video/*,.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp3,.wav"
                    multiple
                  >
                    <div class="add-box">
                      <PlusCircleOutlined class="add-icon" />
                      <span>选择课件文件</span>
                    </div>
                  </Upload>
                </div>
                
                <div class="upload-section">
                  <div class="upload-label">添加考核试卷</div>
                  <Upload
                    :fileList="stage.examFiles || []"
                    :beforeUpload="(file) => beforeUpload(file, stage.id, 'exam')"
                    :customRequest="(options) => handleUpload(options, stage.id, 'exam')"
                    @change="(info) => handleChange(info, stage.id, 'exam')"
                    accept=".pdf,.doc,.docx"
                    multiple
                  >
                    <div class="add-box">
                      <PlusCircleOutlined class="add-icon" />
                      <span>选择试卷文件</span>
                    </div>
                  </Upload>
                </div>
              </div>

              <div class="stage-footer">
                此阶段安全课件共有 {{ stage.courseCount }} 个，考核试卷 {{ stage.examCount }} 个，学完需要 {{ stage.duration }}
              </div>
            </div>
          </Card>
        </div>

        <!-- 添加阶段按钮 -->
        <Button type="dashed" class="add-stage-btn"  @click="addStage">
          <span>
            <PlusOutlined />
            添加安全阶段
          </span>
        </Button>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { 
  Card, 
  Button, 
  Space, 
  Radio, 
  Tag, 
  Select,
  SelectOption,
  Upload,
  message
} from 'ant-design-vue'
import { 
  PlusCircleOutlined, 
  EditOutlined, 
  ShareAltOutlined, 
  DeleteOutlined,
  PlusOutlined 
} from '@ant-design/icons-vue'

const displayType = ref('letter')
const selectedCount = ref(2)

// 阶段数据
const stages = ref([
  {
    id: 1,
    label: 'S1',
    courseCount: 0,
    examCount: 0,
    duration: '0分0秒',
    courseFiles: [],
    examFiles: []
  }
])

// 上传前检查
const beforeUpload = (file, stageId, type) => {
  const isValidType = (() => {
    if (type === 'course') {
      return file.type.startsWith('video/') || 
             file.type.startsWith('image/') || 
             file.type.startsWith('audio/') ||
             ['application/pdf', 'application/msword', 
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.ms-powerpoint',
              'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(file.type)
    } else {
      return ['application/pdf', 'application/msword', 
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    }
  })()

  if (!isValidType) {
    message.error('文件格式不支持')
    return false
  }

  const isLt100M = file.size / 1024 / 1024 < 100
  if (!isLt100M) {
    message.error('文件大小不能超过100MB')
    return false
  }

  return false // 阻止自动上传，使用自定义上传
}

// 自定义上传处理
const handleUpload = async ({ file, onProgress, onSuccess, onError }, stageId, type) => {
  try {
    // 模拟上传进度
    let progress = 0
    const progressTimer = setInterval(() => {
      progress += Math.random() * 15
      if (progress > 90) progress = 90
      onProgress({ percent: Math.round(progress) })
    }, 200)

    // 这里应该调用真实的上传API
    // const result = await uploadFile(file, type)
    
    // 模拟上传完成
    setTimeout(() => {
      clearInterval(progressTimer)
      onProgress({ percent: 100 })
      
      const result = {
        url: `/mock-uploads/${file.name}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: type
      }
      
      onSuccess(result)
      
      // 更新阶段计数
      const stage = stages.value.find(s => s.id === stageId)
      if (stage) {
        if (type === 'course') {
          stage.courseCount++
          message.success('课件上传成功')
        } else {
          stage.examCount++
          message.success('试卷上传成功')
        }
      }
    }, 1000)
    
  } catch (error) {
    console.error('上传失败:', error)
    onError(error)
    message.error('上传失败，请重试')
  }
}

// 文件状态变化处理
const handleChange = ({ fileList }, stageId, type) => {
  const stage = stages.value.find(s => s.id === stageId)
  if (stage) {
    if (type === 'course') {
      stage.courseFiles = fileList
    } else {
      stage.examFiles = fileList
    }
  }
}

// 添加新阶段
const addStage = () => {
  const newStage = {
    id: stages.value.length + 1,
    label: `S${stages.value.length + 1}`,
    courseCount: 0,
    examCount: 0,
    duration: '0分0秒',
    courseFiles: [],
    examFiles: []
  }
  stages.value.push(newStage)
}


const handleTips = () => {
  message.info('功能开发中，敬请期待')
}

</script>

<style scoped>
.plan-management {
  padding: 16px;
  background: #f5f5f5;
  min-height: 100vh;
}

.top-card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.card-content {
  display: flex;
  gap: 24px;
}

.left-section {
  position: relative;
  flex-shrink: 0;
}

.course-cover {
  width: 360px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.growth-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-number {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.course-subtitle {
  font-size: 16px;
  color: #666;
}

.stage-info {
  font-size: 14px;
  color: #333;
  margin: 8px 0;
}

.meta-info {
  font-size: 13px;
  color: #999;
  margin-bottom: 16px;
}

.action-buttons {
  margin-top: auto;
}

.plan-section {
  background: white;
  padding: 24px;
  border-radius: 8px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.stage-options {
  margin-bottom: 24px;
}

.stage-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.label {
  font-weight: 500;
  color: #333;
}

.option-item {
  display: flex;
  align-items: center;
}

.option-item.selected .letter-tag {
  border: 2px solid #1890ff;
}

.letter-tag {
  font-weight: bold;
  font-size: 16px;
  padding: 4px 12px;
}

.emoji-icon {
  font-size: 24px;
  cursor: pointer;
}

.stage-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stage-item {
  border: 1px solid #e8e8e8;
}

.stage-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.stage-title {
  flex-shrink: 0;
}

.stage-label {
  font-size: 48px;
  font-weight: bold;
  color: #1890ff;
  font-family: Arial, sans-serif;
}

.stage-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.count-display {
  font-size: 16px;
  color: #666;
}

.stage-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.stage-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
:deep(.ant-upload-wrapper .ant-upload-select){
  width: 100%;
}

.add-box {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
  width: 100%;
}

.add-box:hover {
  border-color: #1890ff;
  background: #f0f7ff;
}

.add-box .add-icon {
  font-size: 24px;
  color: #1890ff;
}

.add-box span {
  font-size: 14px;
  color: #666;
}

/* Upload组件样式覆盖 */
:deep(.ant-upload-list) {
  margin-top: 8px;
}

:deep(.ant-upload-list-item) {
  margin-top: 4px;
}

:deep(.ant-upload-list-item-info) {
  font-size: 12px;
}

.stage-footer {
  text-align: right;
  font-size: 13px;
  color: #999;
  padding-top: 8px;
}

.add-stage-btn {
  width: 100%;
  height: 48px;
  font-size: 14px;
  color: #1890ff;
  border-color: #d9d9d9;
}

.add-stage-btn:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}
</style>