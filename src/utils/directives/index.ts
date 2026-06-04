import type { App } from 'vue';
import copyDirective from './copy';
import exportTextDirective from './exportText';
// import { watermarkDirective } from './watermark';
// 指令集合
const directives = {
  copy: copyDirective,
  exportText: exportTextDirective,
  // watermark: watermarkDirective,
  // 可以添加其他指令
  // example: exampleDirective
};

/**
 * 注册全局指令
 * @param app Vue 应用实例
 */
export function setupDirectives(app: App) {
  Object.entries(directives).forEach(([name, directive]) => {
    app.directive(name, directive);
  });
}

// 导出所有指令，方便单独引入
export { copyDirective };
