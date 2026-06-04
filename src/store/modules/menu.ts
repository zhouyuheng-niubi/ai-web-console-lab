import { defineStore } from 'pinia'
import {menuSetting} from '../../layout/menu'
import { v4 as uuidv4 } from 'uuid'

// 类型定义
interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  activeIcon?: string;
  type: 'menu' | 'system';
  parentKey?: string;
  sort: number;
  status: string;
  finished?: boolean;
  children?: MenuItem[];
  createTime: string;
  updateTime: string;
}

// 查找第一个叶子节点
const findFirstLeaf = (nodes) => {
      if (!nodes || nodes.length === 0) return null
      for (const node of nodes) {
          // 如果节点本身有path，直接返回（优先级更高）
          if (node.path) {
              return node;
          }
          // 否则继续查找子节点
          if (node.children && node.children.length > 0) {
              const leaf = findFirstLeaf(node.children)
              if (leaf) return leaf
          }
      }
      return null
}


// 将menuSetting转换为扁平数组
const flattenMenuData = (menus: MenuItem[], parentKey?: string, type: 'menu' | 'system' = 'system'): MenuItem[] => {
  const result: MenuItem[] = [];
  
  menus.forEach((menu, index) => {
    const uniqueId = uuidv4();
    const flatItem: MenuItem = {
      id: menu.id || `${type}_${menu.label}_${uniqueId}`,
      label: menu.label,
      path: menu.path,
      icon: menu.icon,
      activeIcon: menu.activeIcon,
      type,
      parentKey,
      sort: menu.sort || index,
      status: '1',
      finished: menu.finished,
      createTime: '2025-12-01 09:00:00',
      updateTime: '2025-12-01 09:00:00'
    };
    
    result.push(flatItem);
    
    if (menu.children && menu.children.length > 0) {
      const childItems = flattenMenuData(menu.children, flatItem.id, 'menu');
      result.push(...childItems);
    }
  });
  
  return result;
};

// 创建父级分类
const createParentCategory = (label: string, icon?: string, activeIcon?: string) => ({
  id: uuidv4(),
  label,
  path: undefined,
  icon: icon || '',
  activeIcon: activeIcon || '',
  type: 'system' as const,
  parentKey: undefined,
  sort: 0,
  status: '1',
  finished: false,
  createTime: '2025-12-01 09:00:00',
  updateTime: '2025-12-01 09:00:00'
});

// 将扁平数据转换为树型结构
const buildTreeData = (flatData: MenuItem[]): MenuItem[] => {
  const treeData: MenuItem[] = [];
  const map = new Map<string, MenuItem>();
  
  // 创建映射
  flatData.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });
  
  // 构建树
  flatData.forEach(item => {
    const node = map.get(item.id)!;
    if (item.parentKey && map.has(item.parentKey)) {
      const parent = map.get(item.parentKey)!;
      parent.children!.push(node);
    } else {
      treeData.push(node);
    }
  });
  
  // 排序
  const sortTree = (nodes: MenuItem[]) => {
    nodes.sort((a, b) => a.sort - b.sort);
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortTree(node.children);
      }
    });
  };
  
  sortTree(treeData);
  return treeData;
};

// 生成树型菜单数据
const generateTreeMenu = (): MenuItem[] => {
  const aiParent = createParentCategory('人工智能服务能力');
  const safetyParent = createParentCategory('安全生产管理业务');
  const emergencyParent = createParentCategory('应急指挥服务中心');
  const riskParent = createParentCategory('综合风险管控中心');
  const systemParent = createParentCategory('系统配置管理');
  
  const result: MenuItem[] = [
    aiParent,
    safetyParent,
    emergencyParent,
    riskParent,
    systemParent
  ];
  
  // 为各菜单组设置父级
  const aiMenus = flattenMenuData([...menuSetting.aiMenu], aiParent.id, 'menu');
  const safetyMenus = flattenMenuData([...menuSetting.safetyProMenu], safetyParent.id, 'menu');
  const emergencyMenus = flattenMenuData([...menuSetting.emergencyMenu], emergencyParent.id, 'menu');
  const riskMenus = flattenMenuData([...menuSetting.comprehensiveRiskMenu], riskParent.id, 'menu');
  const systemMenus = flattenMenuData([...menuSetting.systemConfigMenu], systemParent.id, 'menu');
  
  result.push(...aiMenus, ...safetyMenus, ...emergencyMenus, ...riskMenus, ...systemMenus);
  
  // 转换为树型结构
  return buildTreeData(result);
};

export const useMenuStore = defineStore('jaa-menu', {
  // 状态
  state: () => ({
    currentMenu: [],
    currentKey: '',
    preKey: '',
    formatMenu: []
  }),
  
  // 计算属性
  getters: {
    
  },
  
  // 修改状态的方法
  actions: {
    setCurrentMenu(menu) {
      this.currentMenu = menu
    },
    setCurrentKey(key) {
      this.currentKey = key
      this.currentMenu =[]
    },
    toSystem(key?: string) {
      if(key) this.currentKey = key
      if(menuSetting[this.currentKey]){
        this.currentMenu = menuSetting[this.currentKey]
        const firstLeaf = findFirstLeaf(menuSetting[this.currentKey])        
        // 返回第一个叶子节点的路径，让调用者处理路由跳转
        if(firstLeaf && firstLeaf.path) {
          return firstLeaf.path;
        }
      }else{
        this.currentMenu = []
      }
      
      // 如果没有找到路径，返回undefined
      return undefined;
    },
    setPreKey(key: string) {
      this.preKey = key
    },
    setFormatMenu(menu: any[]) {
      this.formatMenu = menu
    },
    initFormatMenu() {
      const treeMenu = generateTreeMenu();
      this.setFormatMenu(treeMenu);
      return treeMenu;
    }
  }
})