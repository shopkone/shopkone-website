import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import react from '@vitejs/plugin-react'
import svgr from '@svgr/rollup'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({ icon: true }),
    visualizer({
      emitFile: false,
      filename: 'analysis-chart.html', // 分析图生成的文件名
      open: true // 如果存在本地服务端口，将在打包后自动展示
    }),
    importToCDN({
      modules:[
        { name:"ali-oss", var:"OSS", path:"https://gosspublic.alicdn.com/aliyun-oss-sdk-6.18.1.min.js" }
      ]
    })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: {
    proxy: {
      '^/api/*': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
      "http://shopkimi-guigu.us-west-1.aliyuncs.com": {
        target: "http://shopkimi-guigu.us-west-1.aliyuncs.com",
        changeOrigin: true,
      }
    },
    host:"0.0.0.0",
    cors:true
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
  },
})
