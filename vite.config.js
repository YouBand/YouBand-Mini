import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  clearScreen: false,
  server: {
    port: 5201,
    strictPort: true,
    host: '0.0.0.0',
    hmr: true,
    watch: {
      ignored: ['**/src-tauri/**']
    }
  },
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, process.cwd())}/src`
    }
  }
}))
