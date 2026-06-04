import { generateWatermark } from '../tool';
import { debounce } from 'lodash-es';
export const watermarkDirective = {
  async mounted(el, binding) {
    // 解析指令值，支持布尔值或配置对象
    const config =
      typeof binding.value === 'boolean'
        ? { enable: binding.value }
        : { ...binding.value };

    // 存储初始配置
    el._watermarkConfig = config;

    // 根据enable字段决定是否创建水印
    if (config.enable !== false) {
      // 默认为true
      await createWatermark(el, config);
    }
  },

  async updated(el, binding) {
    const newConfig =
      typeof binding.value === 'boolean'
        ? { enable: binding.value }
        : { ...binding.value };

    const oldConfig = el._watermarkConfig;

    // 检查配置或开关状态是否变化
    const configChanged =
      JSON.stringify(newConfig) !== JSON.stringify(oldConfig);
    const enableStateChanged = newConfig.enable !== oldConfig.enable;

    if (configChanged) {
      el._watermarkConfig = newConfig;

      if (enableStateChanged) {
        // 开关状态变化
        if (newConfig.enable) {
          await createWatermark(el, newConfig);
        } else {
          removeWatermark(el);
        }
      } else if (newConfig.enable !== false) {
        // 配置变化但开关仍开启，更新水印
        await updateWatermark(el, newConfig);
      }
    }
  },

  unmounted(el) {
    removeWatermark(el);
  },
};

// 创建水印
async function createWatermark(el, config) {
  // 先移除可能存在的旧水印
  removeWatermark(el);

  try {
    const watermarkUrl = await generateWatermark(config);
    const watermarkDiv = document.createElement('div');
    watermarkDiv.className = 'vue-watermark';

    Object.assign(watermarkDiv.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '9999',
      pointerEvents: 'none',
      backgroundImage: `url('${watermarkUrl}')`,
      backgroundRepeat: 'repeat',
      opacity: config.opacity || '0.12',
    });

    el.style.position = 'relative';
    el.appendChild(watermarkDiv);

    // 存储引用
    el._watermarkElement = watermarkDiv;

    // 设置防删除监听
    setupMutationObserver(el, watermarkDiv);

    // 设置resize监听
    setupResizeListener(el, config);
  } catch (error) {
    console.error('v-watermark: 创建水印失败', error);
  }
}

// 更新水印
async function updateWatermark(el, config) {
  if (el._watermarkElement) {
    try {
      const newWatermarkUrl = await generateWatermark(config);
      el._watermarkElement.style.backgroundImage = `url('${newWatermarkUrl}')`;
    } catch (error) {
      console.error('v-watermark: 更新水印失败', error);
    }
  }
}

// 移除水印
function removeWatermark(el) {
  if (el._watermarkElement) {
    el._watermarkElement.remove();
    el._watermarkElement = null;
  }

  if (el._observer) {
    el._observer.disconnect();
    el._observer = null;
  }

  if (el._resizeHandler) {
    window.removeEventListener('resize', el._resizeHandler);
    el._resizeHandler = null;
  }
}

// 设置MutationObserver防删除
function setupMutationObserver(el, watermarkDiv) {
  el._observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const removedNodes = Array.from(mutation.removedNodes);
      if (
        removedNodes.includes(watermarkDiv) &&
        el._watermarkConfig.enable !== false
      ) {
        el.appendChild(watermarkDiv); // 重新添加被移除的水印
      }
    });
  });

  el._observer.observe(el, { childList: true, subtree: true });
}

// 设置resize监听
function setupResizeListener(el, config) {
  el._resizeHandler = debounce(async () => {
    if (el._watermarkElement && el._watermarkConfig.enable !== false) {
      try {
        const newUrl = await generateWatermark(config);
        el._watermarkElement.style.backgroundImage = `url('${newUrl}')`;
      } catch (error) {
        console.error('v-watermark: 调整窗口大小时重新生成水印失败', error);
      }
    }
  }, 250);

  window.addEventListener('resize', el._resizeHandler);
}
