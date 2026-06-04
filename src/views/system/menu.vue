<template>
  <div class="menu-container p-[16px] box-border flex flex-col overflow-hidden">
    <!-- 页面标题和操作栏 - 固定不滚动 -->
    <div class="pb-[30px] flex justify-between items-center flex-shrink-0">
      <Button type="primary" style="background-color: #4362EF;" @click="showAddModal">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增菜单</span>
        </span>
      </Button>
    </div>

    <!-- 菜单列表 -->
    <div class="bg-white rounded-[12px] px-[30px] py-[20px] shadow-sm flex-1 flex flex-col box-border overflow-auto">
      <SmartTable
        ref="smartTableRef"
        :api="apiConfig"
        :columns="columns"
        :search-config="searchConfig"
        :responseConfig="responseConfig"
        :showPagination="false"
        :paramsFormatter="paramsFormatter"
        searchLayout="horizontal"
        @loadSuccess="handleLoadSuccess"
        @loadError="handleLoadError"
        @action="handleAction"
        :searchButtonWrapperSpan="6"
        :immediateSearch="true"
        :actionColumn="actionColumn"
        :defaultExpandAllRows="false"
        childrenColumnName="children"
      >
      </SmartTable>
    </div>

    <!-- 新增/编辑菜单弹窗 -->
    <Modal 
      v-model:open="modalVisible" 
      :title="modalTitle" 
      width="800px"
      :confirm-loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <AdvancedForm 
        ref="formRef"
        :schema="formSchema" 
        :model="formState"
        mode="form"
      />
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除菜单 "{{ currentMenu?.label }}" 吗？此操作不可恢复。</p>
      <p class="text-orange-500 mt-2" v-if="hasChildren">
        该菜单下存在子菜单，删除将同时删除所有子菜单！
      </p>
      <p class="text-gray-600 mt-2">
        删除后，该菜单将不再可用。
      </p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid'
import { ref, reactive, nextTick, computed } from 'vue';
import { 
  Button, 
  Modal, 
  message
} from 'ant-design-vue';
import { 
  PlusOutlined, 
} from '@ant-design/icons-vue';
import AdvancedForm from '@/components/advancedForm/index.vue';
// 引入 smartTable 组件需要的类型
import type { ColumnItem, SearchItem } from '@/types/business';
import { baseStatus } from '@/utils/constSeting';
import dayjs from 'dayjs';
import {useMenuStore} from '@/store/index'
// 类型定义
interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  activeIcon?: string;
  type: 'menu' | 'system'; // menu: 菜单项, system: 系统分类
  parentKey?: string;
  sort: number;
  status: string; // 1启用，0禁用
  finished?: boolean;
  children?: MenuItem[];
  createTime: string;
  updateTime: string;
}
const menuStore = useMenuStore()

// 初始化菜单数据
const initializeMenu = () => {
  menuStore.initFormatMenu();
};

// 在组件挂载时初始化
initializeMenu();

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增菜单');
const currentMenu = ref<MenuItem>();
const formRef = ref();
const smartTableRef = ref();

const formState = reactive({
  id: undefined,
  label: '',
  path: '',
  icon: '',
  activeIcon: '',
  type: 'menu',
  parentKey: undefined,
  sort: 0,
  status: '1', // 默认启用
  finished: false
});

// 获取菜单类型选项
const getMenuTypeOptions = () => {
  return [
    { label: '系统分类', value: 'system' },
    { label: '菜单项', value: 'menu' }
  ];
};


// 表格配置
const responseConfig = {
  listKey: '',
  totalKey: '',
};

// 表格列配置
const columns: ColumnItem<MenuItem>[] = [
  {
    title: '菜单名称',
    dataIndex: 'label',
    key: 'label',
    width: '20%'
  },
  {
    title: '路径',
    dataIndex: 'path',
    key: 'path',
    width: '20%',
    ellipsis: true
  },
  {
    title: '类型',
    key: 'type',
    dataIndex: 'type',
    width: '10%',
    type: 'tag',
    options: [
      { label: '系统分类', value: 'system', color: 'blue' },
      { label: '菜单项', value: 'menu', color: 'green' }
    ]
  },
  {
    title: '上级菜单',
    dataIndex: 'parentKey',
    key: 'parentKey',
    width: '15%',
    formatter: (value: string, record: MenuItem) => {
      if (!value) return '顶级菜单';
      const flatData = getFlatMenuData();
      const parent = flatData.find(item => item.id === value);
      return parent ? parent.label : '-';
    }
  },
  {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    width: 50
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 100,
    type: 'tag',
    options: baseStatus
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'label',
    label: '菜单名称',
    type: 'input',
    placeholder: '请输入菜单名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'type',
    label: '菜单类型',
    type: 'select',
    props: {
      allowClear: true,
      placeholder: '请选择菜单类型',
      options: getMenuTypeOptions()
    },
    colSpan: 6
  },
  {
    field: 'status',
    label: '状态',
    type: 'select',
    props: {
      allowClear: true,
      placeholder: '请选择状态',
      options: baseStatus
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: 260,
  actions: [
    {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '启用',
      props: { type: 'link', size: 'small' },
      action: 'toggleStatus',
      visible: (record) => {
        return record.status === '0';
      }
    },
    {
      label: '禁用',
      props: { type: 'link', size: 'small', danger: true },
      action: 'toggleStatus',
      visible: (record) => {
        return record.status === '1';
      }
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete',
    }
  ]
};

// 获取扁平数据（用于API操作）
const getFlatMenuData = (): MenuItem[] => {
  const flattenData = (menus: MenuItem[]): MenuItem[] => {
    const result: MenuItem[] = [];
    menus.forEach(menu => {
      result.push(menu);
      if (menu.children && menu.children.length > 0) {
        result.push(...flattenData(menu.children));
      }
    });
    return result;
  };
  return flattenData(menuStore.formatMenu);
};

let nextId = 1000; // 用于新增菜单的ID计数
// API 配置 - 模拟数据，返回树型结构
const treeSelectList = computed(() => menuStore.formatMenu)
const apiConfig = async (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 直接返回树型数据
      resolve(menuStore.formatMenu);
    }, 100);
  });
};

// 参数格式化函数（无分页）
const paramsFormatter = (params: any, pagination: any) => {
  const formattedParams: any = {
    ...params
  };

  return formattedParams;
};

// AdvancedForm schema配置
const formSchema = computed(() => [
  {
    key: 'label',
    label: '菜单名称',
    type: 'input',
    required: true,
    props: {
      maxlength: 50,
      placeholder: '请输入菜单名称'
    },
    rules: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
      { min: 2, max: 50, message: '名称长度为2-50个字符', trigger: 'blur' }
    ]
  },
  {
    key: 'path',
    label: '菜单路径',
    type: 'input',
    props: {
      maxlength: 100,
      placeholder: '请输入菜单路径（如：/dashboard）'
    },
    rules: [
      { max: 100, message: '路径长度不超过100个字符', trigger: 'blur' }
    ]
  },
  {
    key: 'type',
    label: '菜单类型',
    type: 'select',
    required: true,
    props: {
      placeholder: '请选择菜单类型',
      options: getMenuTypeOptions()
    },
    rules: [
      { required: true, message: '请选择菜单类型', trigger: 'change' }
    ]
  },
  {
    key: 'parentKey',
    label: '上级菜单',
    type: 'treeSelect',
    placeholder: '请选择上级菜单',
    props: { 
      treeData: treeSelectList.value,
      allowClear: true,
      showSearch: true,
      fieldNames:{
        children: 'children',
        label: 'label',
        value: 'id',
      }
    }
  },
  {
    key: 'icon',
    label: '图标',
    type: 'input',
    props: {
      placeholder: '请输入图标类名或路径'
    }
  },
  {
    key: 'activeIcon',
    label: '激活图标',
    type: 'input',
    props: {
      placeholder: '请输入激活状态图标类名或路径'
    }
  },
  {
    key: 'sort',
    label: '排序',
    type: 'inputNumber',
    props: {
      min: 0,
      placeholder: '请输入排序值'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'radioGroup',
    required: true,
    props: {
      options: [
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' }
      ]
    },
    rules: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ]
  },
  {
    key: 'finished',
    label: '是否完成开发',
    type: 'radioGroup',
    props: {
      options: [
        { label: '已完成', value: true },
        { label: '未完成', value: false }
      ]
    }
  }
])

// 方法
const showAddModal = () => {
  modalTitle.value = '新增菜单';
  resetForm();
  modalVisible.value = true;
};

const editMenu = (record: MenuItem) => {
  modalTitle.value = '编辑菜单';
  resetForm();
  modalVisible.value = true;
  
  // 使用 nextTick 确保表单组件已经完全渲染
  nextTick(() => {
    formState.id = record.id;
    formState.label = record.label;
    formState.path = record.path;
    formState.icon = record.icon;
    formState.activeIcon = record.activeIcon;
    formState.type = record.type;
    formState.parentKey = record.parentKey;
    formState.sort = record.sort;
    formState.status = record.status;
    formState.finished = record.finished || false;
  });
};

// 切换菜单状态API
const toggleMenuStatus = async (id: string, status: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const flatData = getFlatMenuData();
        const index = flatData.findIndex(item => item.id === id);
        if (index === -1) {
          reject(new Error('菜单不存在'));
          return;
        }
        
        // 更新状态
        const updateMenuItem = (menus: MenuItem[], targetId: string, newStatus: string): boolean => {
          for (const menu of menus) {
            if (menu.id === targetId) {
              menu.status = newStatus;
              menu.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
              return true;
            }
            if (menu.children && updateMenuItem(menu.children, targetId, newStatus)) {
              return true;
            }
          }
          return false;
        };
        
        updateMenuItem(menuStore.formatMenu, id, status);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

const toggleStatus = async (record: MenuItem) => {
  try {
    const newStatus = record.status === '1' ? '0' : '1';
    
    // 调用状态切换API
    await toggleMenuStatus(record.id, newStatus);
    
    message.success(`已${newStatus === '0' ? '禁用' : '启用'}菜单`);
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error: any) {
    console.error('状态切换失败:', error);
    message.error(error.message || '状态切换失败');
  }
};

const confirmDelete = (record: MenuItem) => {
  currentMenu.value = record;
  deleteModalVisible.value = true;
};

// 检查菜单是否有子菜单
const hasChildren = computed(() => {
  if (!currentMenu.value) return false;
  const flatData = getFlatMenuData();
  return flatData.some(item => item.parentKey === currentMenu.value?.id);
});

// 新增菜单API
const addMenu = async (formData: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 检查菜单名称是否重复
        const flatData = getFlatMenuData();
        if (flatData.some(item => item.label === formData.label)) {
          reject(new Error('菜单名称已存在'));
          return;
        }
        
        const newMenu: MenuItem = {
          id: `menu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          label: formData.label,
          path: formData.path,
          icon: formData.icon,
          activeIcon: formData.activeIcon,
          type: formData.type,
          parentKey: formData.parentKey,
          sort: formData.sort || 0,
          status: formData.status,
          finished: formData.finished || false,
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          children: []
        };
        
        // 添加到父节点或根节点
        if (newMenu.parentKey) {
          const addToParent = (menus: MenuItem[], parentId: string, newChild: MenuItem): boolean => {
            for (const menu of menus) {
              if (menu.id === parentId) {
                if (!menu.children) menu.children = [];
                menu.children.push(newChild);
                // 更新父节点的更新时间
                menu.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
                return true;
              }
              if (menu.children && addToParent(menu.children, parentId, newChild)) {
                return true;
              }
            }
            return false;
          };
          
          const success = addToParent(menuStore.formatMenu, newMenu.parentKey, newMenu);
          if (!success) {
            reject(new Error('找不到指定的父级菜单'));
            return;
          }
        } else {
          menuStore.formatMenu.push(newMenu);
        }
        
        resolve(newMenu);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// 更新菜单API
const updateMenu = async (id: string, formData: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const flatData = getFlatMenuData();
        const index = flatData.findIndex(item => item.id === id);
        if (index === -1) {
          reject(new Error('菜单不存在'));
          return;
        }
        
        // 检查菜单名称是否重复（排除自己）
        if (flatData.some(item => item.id !== id && item.label === formData.label)) {
          reject(new Error('菜单名称已存在'));
          return;
        }
        
        // 检查是否会产生循环引用
        if (formData.parentKey) {
          const isCircularReference = (menuId: string, parentId: string): boolean => {
            const checkParent = (menus: MenuItem[], targetId: string): boolean => {
              for (const menu of menus) {
                if (menu.id === targetId) {
                  if (menu.parentKey === menuId) {
                    return true;
                  }
                  if (menu.parentKey) {
                    return checkParent(flatData, menu.parentKey);
                  }
                }
              }
              return false;
            };
            return checkParent(flatData, parentId);
          };
          
          if (isCircularReference(id, formData.parentKey)) {
            reject(new Error('不能将菜单设置为自己的子菜单'));
            return;
          }
        }
        
        // 先找到并移除原菜单
        let originalMenu: MenuItem | null = null;
        let oldParentKey: string | undefined = undefined;
        
        const findAndRemoveMenu = (menus: MenuItem[], targetId: string): boolean => {
          for (let i = 0; i < menus.length; i++) {
            if (menus[i].id === targetId) {
              originalMenu = { ...menus[i] };
              oldParentKey = menus[i].parentKey;
              menus.splice(i, 1);
              return true;
            }
            if (menus[i].children && findAndRemoveMenu(menus[i].children!, targetId)) {
              return true;
            }
          }
          return false;
        };
        
        findAndRemoveMenu(menuStore.formatMenu, id);
        
        if (!originalMenu) {
          reject(new Error('菜单不存在'));
          return;
        }
        
        // 更新菜单数据
        const updatedMenu: MenuItem = {
          ...originalMenu,
          label: formData.label,
          path: formData.path,
          icon: formData.icon,
          activeIcon: formData.activeIcon,
          type: formData.type,
          parentKey: formData.parentKey,
          sort: formData.sort || originalMenu.sort,
          status: formData.status,
          finished: formData.finished || false,
          updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          children: originalMenu.children || []
        };
        
        // 添加到新位置
        if (updatedMenu.parentKey) {
          const addToParent = (menus: MenuItem[], parentId: string, newChild: MenuItem): boolean => {
            for (const menu of menus) {
              if (menu.id === parentId) {
                if (!menu.children) menu.children = [];
                menu.children.push(newChild);
                menu.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
                return true;
              }
              if (menu.children && addToParent(menu.children, parentId, newChild)) {
                return true;
              }
            }
            return false;
          };
          
          const success = addToParent(menuStore.formatMenu, updatedMenu.parentKey, updatedMenu);
          if (!success) {
            reject(new Error('找不到指定的父级菜单'));
            return;
          }
        } else {
          menuStore.formatMenu.push(updatedMenu);
        }
        
        resolve(updatedMenu);
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

const handleModalOk = async () => {
  try {
    modalLoading.value = true;
    
    // 表单验证
    await formRef.value?.validate();
    
    if (modalTitle.value === '新增菜单') {
      // 新增菜单
      await addMenu({
        label: formState.label,
        path: formState.path,
        icon: formState.icon,
        activeIcon: formState.activeIcon,
        type: formState.type,
        parentKey: formState.parentKey,
        sort: formState.sort,
        status: formState.status,
        finished: formState.finished
      });
      message.success('新增菜单成功');
    } else {
      // 编辑菜单
      await updateMenu(formState.id!, {
        label: formState.label,
        path: formState.path,
        icon: formState.icon,
        activeIcon: formState.activeIcon,
        type: formState.type,
        parentKey: formState.parentKey,
        sort: formState.sort,
        status: formState.status,
        finished: formState.finished
      });
      message.success('编辑菜单成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error: any) {
    console.error('操作失败:', error);
    message.error(error.message || (modalTitle.value === '新增菜单' ? '新增菜单失败' : '编辑菜单失败'));
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

// 删除菜单API
const deleteMenu = async (id: string, forceDelete: boolean = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const flatData = getFlatMenuData();
        const targetMenu = flatData.find(item => item.id === id);
        
        if (!targetMenu) {
          reject(new Error('菜单不存在'));
          return;
        }
        
        // 检查是否有子菜单
        const hasChildren = flatData.some(item => item.parentKey === id);
        
        if (hasChildren && !forceDelete) {
          reject(new Error('该菜单下存在子菜单，请先删除子菜单'));
          return;
        }
        
        // 如果是强制删除，先删除所有子菜单
        if (hasChildren && forceDelete) {
          const getAllChildIds = (menuId: string): string[] => {
            const childIds: string[] = [];
            const collectChildren = (parentId: string) => {
              flatData.forEach(item => {
                if (item.parentKey === parentId) {
                  childIds.push(item.id);
                  collectChildren(item.id);
                }
              });
            };
            collectChildren(menuId);
            return childIds;
          };
          
          const childIds = getAllChildIds(id);
          childIds.forEach(childId => {
            deleteMenuItem(menuStore.formatMenu, childId);
          });
        }
        
        // 删除主菜单
        const deleteMenuItem = (menus: MenuItem[], targetId: string): boolean => {
          for (let i = 0; i < menus.length; i++) {
            if (menus[i].id === targetId) {
              menus.splice(i, 1);
              return true;
            }
            if (menus[i].children && deleteMenuItem(menus[i].children!, targetId)) {
              return true;
            }
          }
          return false;
        };
        
        const success = deleteMenuItem(menuStore.formatMenu, id);
        if (success) {
          resolve({
            success: true,
            deletedCount: forceDelete ? (flatData.filter(item => item.parentKey === id).length + 1) : 1,
            message: forceDelete ? `已删除菜单及其${flatData.filter(item => item.parentKey === id).length}个子菜单` : '删除成功'
          });
        } else {
          reject(new Error('菜单不存在'));
        }
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

const handleDelete = async () => {
  try {
    if (!currentMenu.value) return;
    
    // 调用删除API
    const result = await deleteMenu(currentMenu.value.id, hasChildren.value);
    
    if (result && typeof result === 'object') {
      message.success(result.message || '删除菜单成功');
    } else {
      message.success('删除菜单成功');
    }
    
    deleteModalVisible.value = false;
    currentMenu.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error: any) {
    console.error('删除失败:', error);
    message.error(error.message || '删除菜单失败');
  }
};

const resetForm = () => {
  formState.id = undefined;
  formState.label = '';
  formState.path = '';
  formState.icon = '';
  formState.activeIcon = '';
  formState.type = 'menu';
  formState.parentKey = undefined;
  formState.sort = 0;
  formState.status = '1';
  formState.finished = false;
};

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('树型数据加载成功:', data);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

// 操作列事件处理
const handleAction = (action: string, record: MenuItem, index: number) => {
  switch (action) {
    case 'edit':
      editMenu(record);
      break;
    case 'toggleStatus':
      toggleStatus(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};


// 暴露方法给父组件
defineExpose({
  refresh: () => smartTableRef.value?.refresh()
});
</script>

<style scoped>
.menu-container {
  height: 100%;
  overflow: hidden;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.ant-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.ant-table-container) {
  border-radius: 8px;
}
</style>