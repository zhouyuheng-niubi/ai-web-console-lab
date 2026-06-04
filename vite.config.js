import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { loadEnv } from 'vite';
import { resolve } from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx' // 引入插件
// import basicSsl from '@vitejs/plugin-basic-ssl';
export default defineConfig(
  async ({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_');
    return {
      plugins: [
        // basicSsl(), // 添加 SSL 插件
        vue({
          template: {
            compilerOptions: {
              // 启用JSX支持
              isCustomElement: (tag) => tag.includes('-')
            }
          }
        }),
        vueJsx()
      ],
      base: '/',
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src')
        }
      },
      // 静态资源配置
      assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr', '**/*.bin', '**/*.doc', '**/*.docx', '**/*.pdf', '**/*.xls', '**/*.xlsx', '**/*.ppt', '**/*.pptx'],
      build: {
        // 增加资源大小限制，适应大型3D模型
        assetsInlineLimit: 0, // 不内联任何资源，全部作为单独文件
        chunkSizeWarningLimit: 2000, // 增加chunk大小警告限制到2MB
        rollupOptions: {
          output: {
            // 静态资源文件名格式
            assetFileNames: 'assets/[name].[hash].[ext]'
          }
        }
      },
      server: {
        port: 5273,
        host: true,
        // 启用HTTPS
        // https: true,
        // 增加body大小限制，支持大型3D模型文件
        fs: {
          // 允许访问的文件大小上限
          strict: false
        },
        proxy:{
          // http://10.0.0.1:8004
          '/sys-api':{
            target: 'http://10.0.0.1:8004',//http://10.0.0.1:8004
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/sys-api/, '')
          },
          '/label-api':{
            target: 'http://10.0.0.1:12000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/label-api/, '')
          },
          '/train-labelStudio':{
            target: 'http://10.0.0.1:8088',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/train-labelStudio/, '')
          },
          '/yjbx-api':{
            target:'http://10.0.0.1:9092',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/yjbx-api/, '')
          }
        }
      }
    }
  }
)