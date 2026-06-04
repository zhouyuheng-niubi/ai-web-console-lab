import { defineStore } from 'pinia'

// 导出主 store
export * from './modules/menu'
export * from './modules/edg_box'
export * from './modules/hidden-danger'
export interface CompanyInfo {
  id?: number;
  name: string;
  shortName: string;
  description: string;
  foundedDate: string;
  location: string;
  industry: string;
  scale: string;
  mission: string;
  vision: string;
  values: string[];
  achievements: string[];
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    website: string;
  };
}

export const useMainStore = defineStore('jaa-main', {
  // 状态
  state: () => ({
    companyInfo: {
      shortName: '银利华研究所',
      name: '银利华化工材料研究所',
      description: '银利华化工材料研究所是一家专注于高端化工材料研发与应用的科研机构，致力于为新能源、电子信息、生物医药等领域提供先进材料解决方案',
      foundedDate: '2005-01-01',
      location: '示例地区省示例地区市金牛区示例地区北路110号',
      industry: '化工材料',
      scale: '中型(100-300人)',
      mission: '通过持续的技术创新，推动化工材料行业发展，为社会创造价值',
      vision: '成为全球领先的化工材料研发机构',
      values: ['创新', '合作', '诚信', '卓越'],
      achievements: ['获得多项国家科技进步奖', '与多家知名企业提供战略合作'],
      contactInfo: {
        phone: '028-87750911',
        email: 'maintainer@example.com',
        address: '示例地区省示例地区市金牛区示例地区北路110号',
        website: 'https://www.yinlihua.cn/PCH5/index.html'
      }
    } as CompanyInfo,
    userInfo: {
      id: 1,
      name: '张三',
      group: '巡检组',
      email: 'maintainer@example.com',
      role: 'admin',
      token='<REDACTED_CREDENTIAL>',
      expires: '2023-12-31T23:59:59Z'
    },
    sysUserInfo: {
      id: 2,
      name: 'admin',
      group: '管理员组',
      email: 'maintainer@example.com',
      role: 'admin',
      token='<REDACTED_CREDENTIAL>',
    },
    userList: [
      {
        id: 1,
        name: '张三',
        group: '巡检组',
        email: 'maintainer@example.com',
        role: 'admin',
        token='<REDACTED_CREDENTIAL>',
        expires: '2023-12-31T23:59:59Z'
      },
      {
        id: 2,
        name: 'admin',
        group: '管理员组',
        email: 'maintainer@example.com',
        role: 'admin',
        token='<REDACTED_CREDENTIAL>',
        expires: '2023-12-31T23:59:59Z'
      },
    ]
  }),
  
  // 计算属性
  getters: {
    
  },
  
  // 修改状态的方法
  actions: {
    setCompanyInfo(companyInfo: CompanyInfo) {
      this.companyInfo = companyInfo
    },
    updateCompanyInfo(partialInfo: Partial<CompanyInfo>) {
      this.companyInfo = { ...this.companyInfo, ...partialInfo };
    },
    resetCompanyInfo() {
      this.companyInfo = {} as CompanyInfo;
    }
  }
})