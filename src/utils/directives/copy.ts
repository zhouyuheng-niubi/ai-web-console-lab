import type { Directive, DirectiveBinding } from 'vue';

// 定义自定义事件类型
interface CopyDirectiveEvents {
  'copy-success': () => void;
  'copy-error': (error: Error) => void;
}

// 扩展元素类型以包含自定义事件
type CopyDirectiveElement = HTMLElement & {
  addEventListener: <K extends keyof CopyDirectiveEvents>(
    type: K,
    listener: CopyDirectiveEvents[K],
  ) => void;
  dispatchEvent: <K extends keyof CopyDirectiveEvents>(
    event: K extends keyof CopyDirectiveEvents
      ? CustomEvent<Parameters<CopyDirectiveEvents[K]>[0]>
      : Event,
  ) => boolean;
};

/**
 * 复制指令 - 将绑定的值复制到剪贴板
 * @example
 * <button v-copy="text" @copy-success="handleSuccess" @copy-error="handleError">复制</button>
 */
const copyDirective: Directive<CopyDirectiveElement, string> = {
  mounted(el: CopyDirectiveElement, binding: DirectiveBinding<string>) {
    // 点击事件处理函数
    const handleClick = async () => {
      const textToCopy = binding.value;

      if (!textToCopy) {
        el.dispatchEvent(
          new CustomEvent('copy-error', {
            detail: new Error('没有可复制的内容'),
          }),
        );
        return;
      }

      try {
        // 现代浏览器 Clipboard API
        await navigator.clipboard.writeText(textToCopy);
        el.dispatchEvent(new CustomEvent('copy-success'));
      } catch (error) {
        // 降级处理：使用传统方法
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';

        document.body.appendChild(textarea);
        textarea.select();

        try {
          const successful = document.execCommand('copy');
          if (successful) {
            el.dispatchEvent(new CustomEvent('copy-success'));
          } else {
            el.dispatchEvent(
              new CustomEvent('copy-error', {
                detail: new Error('复制失败，无法执行 copy 命令'),
              }),
            );
          }
        } catch (err) {
          el.dispatchEvent(
            new CustomEvent('copy-error', {
              detail:
                err instanceof Error ? err : new Error('复制过程发生未知错误'),
            }),
          );
        } finally {
          document.body.removeChild(textarea);
        }
      }
    };

    // 存储事件处理函数以便解绑时使用
    (el as any)._copyHandler = handleClick;
    el.addEventListener('click', handleClick);
  },

  // 当绑定值更新时
  updated(el: CopyDirectiveElement, binding: DirectiveBinding<string>) {
    // 如果值发生变化，可以在这里做相应处理
  },

  // 指令与元素解绑时
  unmounted(el: CopyDirectiveElement) {
    // 移除事件监听
    const handler = (el as any)._copyHandler;
    if (handler) {
      el.removeEventListener('click', handler);
      delete (el as any)._copyHandler;
    }
  },
};

export default copyDirective;
