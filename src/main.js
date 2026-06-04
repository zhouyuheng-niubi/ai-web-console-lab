import { createApp } from 'vue';
import '@opentiny/tiny-robot/dist/style.css';
import { setupDirectives } from './utils/directives';
import './components/chat/tiny-robot/style.css';
import './index.css'
import App from './App.vue';
import { router } from './router/index';
import SmartTable from '@/components/smartTable/index.vue'
import AdvancedForm from '@/components/advancedForm/index.vue';
import pinia from './store/pinia';
// if (import.meta.env.DEV) {
//   import('vconsole').then(({ default: VConsole }) => {
//     new VConsole()  // 初始化，页面会出现vConsole按钮
//   })
// }
const app = createApp(App);
app.use(pinia);
app.component('SmartTable', SmartTable)
app.component('AdvancedForm', AdvancedForm)

app.use(router);
// 注册全局指令
setupDirectives(app);
app.mount('#app');