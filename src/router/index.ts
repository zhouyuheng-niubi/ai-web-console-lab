import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { routes } from './routes/index';
const router = createRouter({
    history:createWebHashHistory(),
    routes
})
export {
    router
}