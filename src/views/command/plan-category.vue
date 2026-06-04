<template>
  <div class="plan-category-container pt-[30px] pb-[30px] px-[30px] flex flex-col overflow-hidden  box-border" style="font-family: Source Han Sans CN;">
    <!-- 页面标题和操作栏 -->
    <div class="mb-[30px] flex  items-center flex-shrink-0">
      <Button type="primary" class="mr-[10px]"  @click="showAddModal">
        <span class="flex items-center">
            <PlusOutlined />
            <span class="leading-none ml-1">新增分类</span>
        </span>
      </Button>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 flex gap-[20px] overflow-hidden">
      <!-- 分类列表 -->
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
          :defaultExpandAllRows="true"
          childrenColumnName="children"
          rowKey="plan_type_id"
        >
        </SmartTable>
      </div>
    </div>

    <!-- 新增/编辑分类弹窗 -->
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
        formLayout="horizontal"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <template #plan_template_content>
          <div class="editor-container">
            <div ref="editorToolbarRef" class="editor-toolbar"></div>
            <div ref="editorRef" class="editor-content" style="min-height: 300px;max-height: 550px; overflow-y: auto;"></div>
          </div>
        </template>
      </AdvancedForm>
    </Modal>

    <!-- 删除确认弹窗 -->
    <Modal 
      v-model:open="deleteModalVisible" 
      title="确认删除"
      @ok="handleDelete"
      @cancel="deleteModalVisible = false"
    >
      <p>确定要删除分类 "{{ currentCategory?.plan_type_name }}" 吗？此操作不可恢复。</p>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue';
import { 
  Button, 
  message,
  Modal,
} from 'ant-design-vue';
import { 
  PlusOutlined,
} from '@ant-design/icons-vue';

// 定义 SmartTable 组件需要的类型
interface ColumnItem<T = any> {
  dataIndex: string;
  key?: string;
  title: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  options?: any[];
  slot?: string;
  slotName?: string;
  type?: 'tag' | 'switch' | 'radio' | 'checkbox' | 'badge' | 'rate' | 'progress' | 'date' | 'date-range'|'select' | 'slot';
  componentProps?: (value: any, record: T) => Record<string, any>;
  edit?: any;
  formatter?: (value: any, record: T) => string;
  render?: (value: any, record: T, index: number) => string;
}

interface SearchItem {
  field: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'date-range' | 'month' | 'year' | 'week' | 'quarter' | 'checkbox' | 'radio' | 'number' | 'switch';
  props?: any;
  rules?: any[];
  advanced?: boolean;
  labelCol?: any;
  wrapperCol?: any;
  colSpan?: number;
  rowSpan?: number;
  style?: Record<string, any>;
  placeholder?: string;
}
import dayjs from 'dayjs'

// 导入WangEditor相关组件
import { createEditor, createToolbar } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

// 导入静态数据和类型定义
import { PlanType, staticPlanTypes as originalStaticPlanTypes, templatePlans } from './digital-pro'

// 定义分类数据结构
interface PlanCategory {
  plan_type_id: string;
  plan_type_name: string;
  parent_id?: string;
  parent_name?: string;
  plan_template_content?: string;
  create_time?: string;
  update_time?: string;
  children?: PlanCategory[];
}

// 表单状态
const formState = reactive({
  plan_type_id: '',
  plan_type_name: '',
  parent_id: '',
  parent_name: '',
  plan_template_content: ''
});

// 响应式数据
const modalVisible = ref(false);
const modalLoading = ref(false);
const deleteModalVisible = ref(false);
const modalTitle = ref('新增分类');
const currentCategory = ref<PlanCategory>();
const formRef = ref();
const smartTableRef = ref();

// WangEditor 配置
const editorRef = ref();
const editorToolbarRef = ref();
let editor = null;
let toolbar = null;

// 可变的静态数据，用于增删改操作
const dynamicPlanTypes = ref<PlanCategory[]>([]);

// 将原始的staticPlanTypes转换为PlanCategory格式
const convertPlanTypesToCategories = (types: PlanType[], parentName?: string): PlanCategory[] => {
  let result: PlanCategory[] = [];
  
  types.forEach(type => {
    const category: PlanCategory = {
      plan_type_id: type.plan_type_id,
      plan_type_name: type.plan_type_name,
      parent_id: type.parent_id,
      parent_name: parentName,
      plan_template_content: templatePlans[type.plan_type_id] || '',
      create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
    };
    result.push(category);
    
    if (type.children && type.children.length > 0) {
      result = result.concat(convertPlanTypesToCategories(type.children, type.plan_type_name));
    }
  });
  
  return result;
};
// 表格配置
const responseConfig = {
  listKey: '',
  totalKey: '',
};

// 表格列配置
const columns: ColumnItem<PlanCategory>[] = [
//   {
//     title: '分类ID',
//     dataIndex: 'plan_type_id',
//     key: 'plan_type_id',
//     width: '15%'
//   },
  {
    title: '分类名称',
    dataIndex: 'plan_type_name',
    key: 'plan_type_name',
    width: '200px',
    ellipsis: true
  },
  {
    title: '父级分类',
    dataIndex: 'parent_name',
    key: 'parent_name',
    width: '150px',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    width: '160px',
    ellipsis: true,
    formatter: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }
];

// 搜索配置
const searchConfig: SearchItem[] = [
  {
    field: 'plan_type_name',
    label: '分类名称',
    type: 'input',
    placeholder: '请输入分类名称',
    props: {
      allowClear: true
    },
    colSpan: 6
  },
  {
    field: 'parent_name',
    label: '父级分类',
    type: 'input',
    placeholder: '请输入父级分类',
    props: {
      allowClear: true
    },
    colSpan: 6
  }
];

// 操作列配置
const actionColumn = {
  title: '操作',
  width: '150px',
  fixed: 'right',
  actions: [
    {
      label: '编辑',
      icon: 'EditOutlined',
      props: { type: 'link', size: 'small' },
      action: 'edit'
    },
    {
      label: '删除',
      icon: 'DeleteOutlined',
      props: { type: 'link', size: 'small', danger: true },
      action: 'delete'
    }
  ]
};

// 将平面数据转换为树形结构
const convertToTree = (data: PlanCategory[]): PlanCategory[] => {
  const map = {};
  const roots: PlanCategory[] = [];

  // 创建映射
  data.forEach(item => {
    map[item.plan_type_id] = { ...item };
    map[item.plan_type_id].children = [];
  });

  // 构建树形结构
  data.forEach(item => {
    const node = map[item.plan_type_id];
    if (item.parent_id && map[item.parent_id]) {
      // 如果有父节点，添加到父节点的children中
      map[item.parent_id].children.push(node);
    } else {
      // 如果没有父节点，添加到根节点
      roots.push(node);
    }
  });

  return roots;
};

// API 配置（使用动态数据）
const apiConfig = async (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 直接返回树型数据
      resolve(convertToTree(dynamicPlanTypes.value));
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

// 表单配置
const formSchema = computed(() => [
  {
    key: 'plan_type_name',
    type: 'input',
    label: '分类名称',
    placeholder: '请输入分类名称',
    required: true,
    rules: [
      { required: true, message: '请输入分类名称', trigger: 'blur' },
      { min: 2, max: 100, message: '名称长度为2-100个字符', trigger: 'blur' },
    ],
    colSpan: 12
  },
  {
    key: 'parent_id',
    type: 'treeSelect',
    label: '父级分类',
    placeholder: '请选择父级分类',
    props: { 
      treeData: treeSelectList.value,
      allowClear: true,
      showSearch: true,
      fieldNames:{
        children: 'children',
        label: 'plan_type_name',
        value: 'plan_type_id',
      }
    },
    colSpan: 12
  },
  {
    key: 'plan_template_content',
    type: 'input',
    label: '预案模板配置',
    placeholder: '请输入预案模板内容',
    props: {
      type: 'textarea',
      rows: 6,
      maxlength: 5000,
      showCount: true
    },
    rules: [
      { max: 5000, message: '预案模板内容不能超过5000个字符', trigger: 'blur' }
    ],
    colSpan: 24
  }
]);

// 计算树形选择列表
const treeSelectList = computed(() => {
  // 将平面数据转换为树形结构，但为了在treeSelect中使用，需要保留平面结构
  const buildTreeSelectData = (items: PlanCategory[], level: number = 0): PlanCategory[] => {
    return items.map(item => {
      const newItem = { ...item };
      if (newItem.children && newItem.children.length > 0) {
        newItem.children = buildTreeSelectData(newItem.children, level + 1);
      }
      return newItem;
    });
  };
  
  return buildTreeSelectData([...dynamicPlanTypes.value]);
});

// 监听分类名称变化，自动填充模板内容
watch(() => formState.plan_type_name, (newVal) => {
  // 尝试匹配现有的模板键
  const matchingTemplateKey = Object.keys(templatePlans).find(key => 
    key === newVal || 
    templatePlans[key].includes(newVal) ||
    key.includes(newVal.toLowerCase().replace(/\s+/g, '_'))
  );
  
  if (matchingTemplateKey) {
    formState.plan_template_content = templatePlans[matchingTemplateKey] || '';
  }
});

// 方法
const showAddModal = () => {
  modalTitle.value = '新增分类';
  resetForm();
  // 使用 nextTick 确保表单重置完成后再显示弹窗
  nextTick(() => {
    modalVisible.value = true;
  });
};

const editCategory = async (record: PlanCategory) => {
  try {
    modalTitle.value = '编辑分类';
    formState.plan_type_id = record.plan_type_id;
    formState.plan_type_name = record.plan_type_name;
    formState.parent_id = record.parent_id || '';
    formState.parent_name = record.parent_name || '';
    modalVisible.value = true;
    nextTick(() => {
      formState.plan_template_content = record.plan_template_content || '';
    });
  } catch (error) {
    console.error('获取分类详情失败:', error);
    message.error('获取分类详情失败');
  }
};

const confirmDelete = (record: PlanCategory) => {
  currentCategory.value = record;
  deleteModalVisible.value = true;
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const formData = { ...formState };
    
    // 获取父级分类
    const parentCategory = dynamicPlanTypes.value.find(item => item.plan_type_id === formData.parent_id);
    
    if (modalTitle.value === '新增分类') {
      // 检查是否已存在相同名称的分类
      const exists = dynamicPlanTypes.value.some(item => item.plan_type_name === formData.plan_type_name);
      if (exists) {
        message.error('分类名称已存在，请使用不同的名称');
        modalLoading.value = false;
        return;
      }
      
      // 检查是否会产生循环引用
      if (formData.parent_id) {
        const isCircularReference = (categoryId: string, parentId: string): boolean => {
          const checkParent = (items: PlanCategory[], targetId: string): boolean => {
            for (const item of items) {
              if (item.plan_type_id === targetId) {
                if (item.parent_id === categoryId) {
                  return true;
                }
                if (item.parent_id) {
                  return checkParent(dynamicPlanTypes.value, item.parent_id);
                }
              }
            }
            return false;
          };
          return checkParent(dynamicPlanTypes.value, parentId);
        };
        
        if (isCircularReference(formData.plan_type_id, formData.parent_id)) {
          message.error('不能将分类设置为自己的子分类');
          modalLoading.value = false;
          return;
        }
      }
      
      // 新增操作
      const newCategory: PlanCategory = {
        plan_type_id: `cat${Date.now()}`, // 生成唯一ID
        plan_type_name: formData.plan_type_name,
        parent_id: formData.parent_id || '',
        parent_name: parentCategory ? parentCategory.plan_type_name : '',
        plan_template_content: formData.plan_template_content || '',
        create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        children: []
      };
      
      // 添加到父节点或根节点
      if (newCategory.parent_id) {
        const addToParent = (items: PlanCategory[], parentId: string, newChild: PlanCategory): boolean => {
          for (const item of items) {
            if (item.plan_type_id === parentId) {
              if (!item.children) item.children = [];
              item.children.push(newChild);
              // 更新父节点的更新时间
              item.update_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
              return true;
            }
            if (item.children && addToParent(item.children, parentId, newChild)) {
              return true;
            }
          }
          return false;
        };
        
        const success = addToParent(dynamicPlanTypes.value, newCategory.parent_id, newCategory);
        if (!success) {
          message.error('找不到指定的父级分类');
          modalLoading.value = false;
          return;
        }
      } else {
        dynamicPlanTypes.value.push(newCategory);
      }
      
      message.success('新增分类成功');
    } else {
      // 编辑操作
      // 检查修改后的名称是否与其他分类冲突（排除当前分类）
      const exists = dynamicPlanTypes.value.some(
        item => item.plan_type_id !== formData.plan_type_id && item.plan_type_name === formData.plan_type_name
      );
      if (exists) {
        message.error('分类名称已存在，请使用不同的名称');
        modalLoading.value = false;
        return;
      }
      
      // 检查是否会产生循环引用
      if (formData.parent_id && formData.parent_id !== formState.parent_id) {
        const isCircularReference = (categoryId: string, parentId: string): boolean => {
          const checkParent = (items: PlanCategory[], targetId: string): boolean => {
            for (const item of items) {
              if (item.plan_type_id === targetId) {
                if (item.parent_id === categoryId) {
                  return true;
                }
                if (item.parent_id) {
                  return checkParent(dynamicPlanTypes.value, item.parent_id);
                }
              }
            }
            return false;
          };
          return checkParent(dynamicPlanTypes.value, parentId);
        };
        
        if (isCircularReference(formData.plan_type_id, formData.parent_id)) {
          message.error('不能将分类设置为自己的子分类');
          modalLoading.value = false;
          return;
        }
      }
      
      // 先找到并移除原分类
      let originalCategory: PlanCategory | null = null;
      let oldParentId: string | undefined = undefined;
      
      const findAndRemoveCategory = (items: PlanCategory[], targetId: string): boolean => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].plan_type_id === targetId) {
            originalCategory = { ...items[i] };
            oldParentId = items[i].parent_id;
            items.splice(i, 1);
            return true;
          }
          if (items[i].children && findAndRemoveCategory(items[i].children!, targetId)) {
            return true;
          }
        }
        return false;
      };
      
      findAndRemoveCategory(dynamicPlanTypes.value, formData.plan_type_id);
      
      if (!originalCategory) {
        message.error('分类不存在');
        modalLoading.value = false;
        return;
      }
      
      // 更新分类数据
      const updatedCategory: PlanCategory = {
        ...originalCategory,
        plan_type_name: formData.plan_type_name,
        parent_id: formData.parent_id || '',
        parent_name: parentCategory ? parentCategory.plan_type_name : '',
        plan_template_content: formData.plan_template_content || '',
        update_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      
      // 添加到新位置
      if (updatedCategory.parent_id) {
        const addToParent = (items: PlanCategory[], parentId: string, newChild: PlanCategory): boolean => {
          for (const item of items) {
            if (item.plan_type_id === parentId) {
              if (!item.children) item.children = [];
              item.children.push(newChild);
              item.update_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
              return true;
            }
            if (item.children && addToParent(item.children, parentId, newChild)) {
              return true;
            }
          }
          return false;
        };
        
        const success = addToParent(dynamicPlanTypes.value, updatedCategory.parent_id, updatedCategory);
        if (!success) {
          message.error('找不到指定的父级分类');
          modalLoading.value = false;
          return;
        }
      } else {
        dynamicPlanTypes.value.push(updatedCategory);
      }
      
      message.success('编辑分类成功');
    }
    
    modalVisible.value = false;
    resetForm();
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('操作失败:', error);
    message.error(modalTitle.value === '新增分类' ? '新增分类失败' : '编辑分类失败');
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  resetForm();
};

const handleDelete = async () => {
  try {
    if (!currentCategory.value) return;
    
    // 检查是否有子分类
    const hasChildren = dynamicPlanTypes.value.some(item => item.parent_id === currentCategory.value?.plan_type_id);
    
    // 如果有子分类，询问是否强制删除
    if (hasChildren) {
      // 强制删除，先删除所有子分类
      const deleteChildren = (items: PlanCategory[], parentId: string): PlanCategory[] => {
        const remainingItems: PlanCategory[] = [];
        for (const item of items) {
          if (item.parent_id === parentId) {
            // 删除当前子项
            // 不添加到剩余项中，相当于删除
            // 继续检查子项的子项
            if (item.children && item.children.length > 0) {
              remainingItems.push(...deleteChildren(item.children, item.plan_type_id));
            }
          } else {
            // 保留非直接子项，但递归检查其子项
            const newItem = { ...item };
            if (newItem.children && newItem.children.length > 0) {
              newItem.children = deleteChildren(newItem.children, parentId);
            }
            remainingItems.push(newItem);
          }
        }
        return remainingItems;
      };
      
      // 删除所有子分类
      const deleteChildrenRecursive = (items: PlanCategory[], targetId: string) => {
        for (let i = items.length - 1; i >= 0; i--) {
          if (items[i].parent_id === targetId) {
            // 递归删除子项的子项
            deleteChildrenRecursive(items, items[i].plan_type_id);
            // 删除当前项
            items.splice(i, 1);
          }
        }
      };
      
      deleteChildrenRecursive(dynamicPlanTypes.value, currentCategory.value.plan_type_id);
    }
    
    // 删除主分类
    const deleteCategory = (items: PlanCategory[], targetId: string): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].plan_type_id === targetId) {
          items.splice(i, 1);
          return true;
        }
        if (items[i].children && deleteCategory(items[i].children!, targetId)) {
          return true;
        }
      }
      return false;
    };
    
    const success = deleteCategory(dynamicPlanTypes.value, currentCategory.value.plan_type_id);
    
    if (success) {
      message.success(hasChildren ? '删除分类及其子分类成功' : '删除分类成功');
    } else {
      message.error('未找到要删除的分类');
    }
    
    deleteModalVisible.value = false;
    currentCategory.value = undefined;
    // 重新加载数据
    smartTableRef.value?.refresh();
  } catch (error) {
    console.error('删除分类失败:', error);
    message.error('删除分类失败');
  }
};

const resetForm = () => {
  formState.plan_type_id = '';
  formState.plan_type_name = '';
  formState.parent_id = '';
  formState.parent_name = '';
  formState.plan_template_content = '';
};

// WangEditor 初始化
const initEditor = () => {
  if (editorRef.value && editorToolbarRef.value) {
    // 销毁之前的编辑器实例（如果存在）
    if (editor) {
      editor.destroy();
    }
    if (toolbar) {
      toolbar.destroy();
    }
    
    editor = createEditor({
      selector: editorRef.value,
      html: formState.plan_template_content || '',
      config: {
        placeholder: '请输入模板内容',
        onChange(editor) {
          formState.plan_template_content = editor.getHtml();
        }
      }
    });

    toolbar = createToolbar({
      editor,
      selector: editorToolbarRef.value,
      config: {
        toolbarKeys: [
          'headerSelect',
          'bold',
          'italic',
          'underline',
          'through',
          'color',
          'bgColor',
          'fontSize',
          'fontFamily',
          'lineHeight',
          'bulletedList',
          'numberedList',
          'todo',
          'emotion',
          'insertLink',
          'uploadVideo',
          'insertTable',
          'codeBlock',
          'divider',
          '|',
          'undo',
          'redo',
          'fullScreen'
        ]
      }
    });
  }
};

// WangEditor 销毁
const destroyEditor = () => {
  if (editor) {
    editor.destroy();
    editor = null;
  }
  if (toolbar) {
    toolbar.destroy();
    toolbar = null;
  }
};

// 监听模态框显示状态，初始化或销毁编辑器
watch(modalVisible, (newVal) => {
  if (newVal) {
    // 模态框显示时初始化编辑器
    setTimeout(() => {
      initEditor();
    }, 100);
  } else {
    // 模态框隐藏时销毁编辑器
    destroyEditor();
  }
});

// 监听分类类型变化，更新编辑器内容
watch(() => formState.plan_template_content, (newContent) => {
  if (editor && newContent !== editor.getHtml()) {
    editor.setHtml(newContent || '');
  }
});

// 事件处理
const handleLoadSuccess = (data: any[]) => {
  console.log('数据加载成功:', data);
};

const handleLoadError = (error: any) => {
  console.error('数据加载失败:', error);
  message.error('数据加载失败');
};

// 操作列事件处理
const handleAction = (action: string, record: PlanCategory, index: number) => {
  switch (action) {
    case 'edit':
      editCategory(record);
      break;
    case 'delete':
      confirmDelete(record);
      break;
    default:
      console.warn('未知的操作:', action);
  }
};





onMounted(() => {
  // 初始化数据
  dynamicPlanTypes.value = convertPlanTypesToCategories(originalStaticPlanTypes);
});

// 暴露方法给父组件
defineExpose({
  refresh: () => smartTableRef.value?.refresh()
});
</script>

<style scoped>
.plan-category-container {
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

.editor-container {
  border: 1px solid #ccc;
}

.editor-toolbar {
  border-bottom: 1px solid #ccc;
}

.editor-content {
  overflow-y: auto;
}
</style>