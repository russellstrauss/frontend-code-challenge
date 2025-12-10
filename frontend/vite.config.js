const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');
const path = require('path');

module.exports = defineConfig({
  plugins: [vue()],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math"; @use "@/assets/sass/main.scss" as *;`,
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'app.js',
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    port: 8080,
    open: true,
  },
  // Use relative base for flexible deployment paths
  // The router will auto-detect the actual base path at runtime
  base: process.env.VITE_BASE_PATH || './',
});

