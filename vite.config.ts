import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ:
      // Вместо пакета 'three', мы направляем запрос на наш файл-заглушку.
      // Теперь импорт { WebGPURenderer } пройдет успешно.
      'three/webgpu': resolve(__dirname, 'three-webgpu.js')
    },
    // Оставляем дедупликацию для решения проблемы с текстом
    dedupe: ['three']
  },
  optimizeDeps: {
    include: ['three', 'react-force-graph-3d', 'three-spritetext']
  }
})
