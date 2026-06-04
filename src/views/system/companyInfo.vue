<template>
  <div class="company-info-container p-6 bg-white">
    <PageHeader
      title="企业信息管理"
    >
      <template #extra>
        <Button key="1" type="primary" @click="onSubmit" :loading="loading">保存</Button>
        <Button key="2" @click="onReset" class="ml-2">重置</Button>
      </template>
    </PageHeader>
    
    <div class="mt-6">
    <Form
      :model="formState"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"
      layout="horizontal"
      autocomplete="off"
      :colon="false"
    >
      <FormItem label="企业名称">
        <Input v-model:value="formState.name" placeholder="请输入企业名称" />
      </FormItem>
      
      <FormItem label="企业简称">
        <Input v-model:value="formState.shortName" placeholder="请输入企业简称" />
      </FormItem>
      
      <FormItem label="企业描述">
        <Input.TextArea 
          v-model:value="formState.description" 
          :rows="4" 
          placeholder="请输入企业描述" 

        />
      </FormItem>
      
      <FormItem label="成立日期">
        <DatePicker 
          v-model:value="formState.foundedDate" 
          placeholder="请选择成立日期" 
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </FormItem>
      
      <FormItem label="总部地址">
        <Input v-model:value="formState.headquartersAddress" placeholder="请输入总部地址" />
      </FormItem>
      
      <FormItem label="联系电话">
        <Input v-model:value="formState.phone" placeholder="请输入联系电话" />
      </FormItem>
      
      <FormItem label="电子邮箱">
        <Input v-model:value="formState.email" placeholder="请输入电子邮箱" />
      </FormItem>
      
      <FormItem label="官方网站">
        <Input v-model:value="formState.website" placeholder="请输入官方网站地址" />
      </FormItem>
      
      <FormItem label="企业规模">
        <Select v-model:value="formState.scale" placeholder="请选择企业规模">
          <SelectOption value="small">小型(1-50人)</SelectOption>
          <SelectOption value="medium">中型(51-200人)</SelectOption>
          <SelectOption value="large">大型(201-500人)</SelectOption>
          <SelectOption value="xlarge">超大型(500人以上)</SelectOption>
        </Select>
      </FormItem>
      
      <FormItem label="所属行业">
        <Select v-model:value="formState.industry" placeholder="请选择所属行业">
          <SelectOption value="chemical">化工材料</SelectOption>
          <SelectOption value="technology">信息技术</SelectOption>
          <SelectOption value="manufacturing">制造业</SelectOption>
          <SelectOption value="energy">能源</SelectOption>
          <SelectOption value="finance">金融</SelectOption>
          <SelectOption value="healthcare">医疗健康</SelectOption>
          <SelectOption value="education">教育</SelectOption>
          <SelectOption value="other">其他</SelectOption>
        </Select>
      </FormItem>
      
      <FormItem label="企业使命">
        <Input.TextArea 
          v-model:value="formState.mission" 
          :rows="3" 
          placeholder="请输入企业使命" 
        />
      </FormItem>
      
      <FormItem label="企业愿景">
        <Input.TextArea 
          v-model:value="formState.vision" 
          :rows="3" 
          placeholder="请输入企业愿景" 
        />
      </FormItem>
      
      <FormItem label="核心价值观">
        <div>
          <div v-for="(value, index) in formState.coreValues" :key="index" class="flex items-center mb-2">
            <Input 
              v-model:value="formState.coreValues[index]" 
              :placeholder="`请输入核心价值观 ${index + 1}`" 
              class="flex-1 mr-2"
            />
            <Button 
              v-if="formState.coreValues.length > 1" 
              type="link" 
              danger 
              @click="removeCoreValue(index)"
            >
              删除
            </Button>
          </div>
          <Button type="dashed" block @click="addCoreValue">
            <PlusOutlined />
            添加核心价值观
          </Button>
        </div>
      </FormItem>
      
      <FormItem label="主要成就">
        <div>
          <div v-for="(achievement, index) in formState.achievements" :key="index" class="flex items-center mb-2">
            <Input 
              v-model:value="formState.achievements[index]" 
              :placeholder="`请输入主要成就 ${index + 1}`" 
              class="flex-1 mr-2"
            />
            <Button 
              v-if="formState.achievements.length > 1" 
              type="link" 
              danger 
              @click="removeAchievement(index)"
            >
              删除
            </Button>
          </div>
          <Button type="dashed" block @click="addAchievement">
            <PlusOutlined />
            添加主要成就
          </Button>
        </div>
      </FormItem>
    </Form>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { 
  Form,
  FormItem,
  Input,
  InputNumber,
  DatePicker,
  Select,
  SelectOption,
  Button,
  message
} from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useMainStore } from '@/store';
import { PageHeader, Tag } from 'ant-design-vue';

const store = useMainStore();
const loading = ref(false);

// 表单状态
const formState = reactive({
  name: '',
  shortName: '',
  description: '',
  foundedDate: '',
  headquartersAddress: '',
  phone: '',
  email: '',
  website: '',
  scale: '',
  industry: '',
  mission: '',
  vision: '',
  coreValues: [''],
  achievements: [''],
});

// 添加核心价值观
const addCoreValue = () => {
  formState.coreValues.push('');
};

// 删除核心价值观
const removeCoreValue = (index: number) => {
  if (formState.coreValues.length > 1) {
    formState.coreValues.splice(index, 1);
  } else {
    message.warning('至少保留一个核心价值观');
  }
};

// 添加主要成就
const addAchievement = () => {
  formState.achievements.push('');
};

// 删除主要成就
const removeAchievement = (index: number) => {
  if (formState.achievements.length > 1) {
    formState.achievements.splice(index, 1);
  } else {
    message.warning('至少保留一个主要成就');
  }
};

// 提交表单
const onSubmit = async () => {
  loading.value = true;
  try {
    // 保存企业信息到store
    store.updateCompanyInfo({
      name: formState.name,
      description: formState.description,
      foundedDate: formState.foundedDate,
      location: formState.headquartersAddress,
      industry: formState.industry,
      scale: formState.scale,
      mission: formState.mission,
      vision: formState.vision,
      values: formState.coreValues.filter(v => v.trim() !== ''),
      achievements: formState.achievements.filter(a => a.trim() !== ''),
      contactInfo: {
        phone: formState.phone,
        email: formState.email,
        address: formState.headquartersAddress,
        website: formState.website
      }
    });
    
    message.success('企业信息保存成功！');
  } catch (error) {
    console.error('保存失败:', error);
    message.error('保存失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 重置表单
const onReset = () => {
  // 从store中恢复初始数据
  const companyInfo = store.companyInfo;
  
  if (Object.keys(companyInfo).length > 0) {
    formState.name = companyInfo.name || '';
    formState.shortName = companyInfo.shortName || '';
    formState.description = companyInfo.description || '';
    formState.foundedDate = companyInfo.foundedDate || '';
    formState.headquartersAddress = companyInfo.location || '';
    formState.phone = companyInfo.contactInfo?.phone || '';
    formState.email = companyInfo.contactInfo?.email || '';
    formState.website = companyInfo.contactInfo?.website || '';
    formState.scale = companyInfo.scale || '';
    formState.industry = companyInfo.industry || '';
    formState.mission = companyInfo.mission || '';
    formState.vision = companyInfo.vision || '';
    formState.coreValues = companyInfo.values && companyInfo.values.length > 0 ? [...companyInfo.values] : [''];
    formState.achievements = companyInfo.achievements && companyInfo.achievements.length > 0 ? [...companyInfo.achievements] : [''];
  } else {
    // 默认值
    formState.name = '银利华化工材料研究所';
    formState.shortName = '银利华研究所';
    formState.description = '专业从事化工材料研究与开发的科研机构';
    formState.foundedDate = '2005-01-01';
    formState.headquartersAddress = '示例地区省示例地区市金牛区示例地区北路110号';
    formState.phone = '028-87750911';
    formState.email = 'maintainer@example.com';
    formState.website = 'https://www.yinlihua.cn/PCH5/index.html';
    formState.scale = 'medium';
    formState.industry = 'chemical';
    formState.mission = '致力于推动化工材料技术创新，服务国家重大战略需求';
    formState.vision = '成为国际一流的化工材料研究机构';
    formState.coreValues = ['创新', '协作', '责任', '卓越'];
    formState.achievements = ['高新技术企业认定', '多项发明专利'];
  }
};

// 组件挂载时初始化数据
onMounted(() => {
  onReset();
});
</script>

<style scoped>
.company-info-container {
  max-width: 1000px;
  margin: 0 auto;
}
</style>