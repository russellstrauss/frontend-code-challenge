import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
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
    emptyOutDir: true,
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

