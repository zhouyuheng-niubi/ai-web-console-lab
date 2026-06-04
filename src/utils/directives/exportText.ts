import type { Directive, DirectiveBinding } from 'vue';
import dayjs from 'dayjs';
// 定义自定义事件类型
interface ExportTextDirectiveEvents {
  'export-success': () => void;
  'export-error': (error: Error) => void;
  'export-debug': (message: string) => void;
}

// 扩展元素类型以包含自定义事件
type ExportTextDirectiveElement = HTMLElement & {
  addEventListener: <K extends keyof ExportTextDirectiveEvents>(
    type: K,
    listener: ExportTextDirectiveEvents[K],
  ) => void;
  dispatchEvent: <K extends keyof ExportTextDirectiveEvents>(
    event: K extends keyof ExportTextDirectiveEvents
      ? CustomEvent<Parameters<ExportTextDirectiveEvents[K]>[0]>
      : Event,
  ) => boolean;
};

// 导出选项类型定义
interface ExportTextOptions {
  content: string; // 要导出的文本内容
  fileName?: string; // 导出的文件名，默认为exported-text.txt
  mimeType?: string; // MIME类型，默认为text/plain
}

/**
 * 导出文本指令 - 将绑定的值导出为文本文件
 */
const exportTextDirective: Directive<
  ExportTextDirectiveElement,
  string | ExportTextOptions
> = {
  mounted(
    el: ExportTextDirectiveElement,
    binding: DirectiveBinding<string | ExportTextOptions>,
  ) {
    // 调试信息发送函数
    const sendDebug = (message: string) => {
      el.dispatchEvent(new CustomEvent('export-debug', { detail: message }));
    };

    // 点击事件处理函数
    const handleClick = () => {
      sendDebug('开始处理导出请求');

      // 解析绑定值
      let content: string;
      let fileName = `智能问答文本${dayjs().format('YYYY-MM-DD HH:mm:ss')}.txt`;
      let mimeType = 'text/plain;charset=utf-8';

      try {
        if (typeof binding.value === 'string') {
          content = binding.value;
          sendDebug(`检测到字符串绑定，长度: ${content.length}`);
        } else if (
          typeof binding.value === 'object' &&
          binding.value !== null
        ) {
          content = binding.value.content;
          fileName = binding.value.fileName || fileName;
          mimeType = binding.value.mimeType || mimeType;
          sendDebug(
            `检测到对象绑定，文件名: ${fileName}, MIME类型: ${mimeType}, 内容长度: ${content?.length || 0}`,
          );
        } else {
          throw new Error('绑定值格式不正确，应为字符串或包含content的对象');
        }

        // 验证内容
        if (!content) {
          throw new Error('没有可导出的文本内容');
        }

        // 清理文件名中的无效字符
        fileName = fileName.replace(/[<>:"/\\|?*]/g, '_');

        // 创建Blob对象
        const blob = new Blob([content], { type: mimeType });
        sendDebug(`创建Blob对象，大小: ${blob.size} bytes`);

        const url = URL.createObjectURL(blob);
        sendDebug(`创建对象URL: ${url.substring(0, 50)}...`);

        // 创建并配置下载链接
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        // 简化链接样式，确保它不会影响布局但能正常工作
        link.style.display = 'none';

        // 添加到文档
        document.body.appendChild(link);

        // 直接调用click()方法而不是模拟事件，提高兼容性
        link.click();

        // 触发成功事件
        sendDebug('下载事件已触发');
        el.dispatchEvent(new CustomEvent('export-success'));

        // 清理资源
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          sendDebug('资源已清理');
        }, 100);
      } catch (error) {
        sendDebug(
          `处理失败: ${error instanceof Error ? error.message : String(error)}`,
        );
        el.dispatchEvent(
          new CustomEvent('export-error', {
            detail:
              error instanceof Error
                ? error
                : new Error('导出过程发生未知错误'),
          }),
        );
      }
    };

    // 存储事件处理函数以便解绑时使用
    (el as any)._exportTextHandler = handleClick;
    el.addEventListener('click', handleClick);
    sendDebug('指令已挂载，等待点击事件');
  },

  updated(
    el: ExportTextDirectiveElement,
    binding: DirectiveBinding<string | ExportTextOptions>,
  ) {
    (el as any)._exportTextHandler;
  },

  unmounted(el: ExportTextDirectiveElement) {
    const handler = (el as any)._exportTextHandler;
    if (handler) {
      el.removeEventListener('click', handler);
      delete (el as any)._exportTextHandler;
    }
  },
};

export default exportTextDirective;
