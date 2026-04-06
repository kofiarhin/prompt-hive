import { defineConfig, mergeConfig } from 'vite'
import baseConfig from './vite.config.base.js'

const performanceConfig = {
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  esbuild: {
    legalComments: 'none',
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('react-router')) {
            return 'vendor-router'
          }

          if (id.includes('@tanstack')) {
            return 'vendor-query'
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'vendor-react'
          }

          return 'vendor'
        },
      },
    },
  },
}

export default defineConfig((env) => {
  const resolvedBaseConfig = typeof baseConfig === 'function' ? baseConfig(env) : baseConfig

  return mergeConfig(resolvedBaseConfig, performanceConfig)
})
