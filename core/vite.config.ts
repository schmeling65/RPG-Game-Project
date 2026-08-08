import { defineConfig } from 'vite';

export default defineConfig({
  root: process.cwd(),
  base: "/",

  build: {    
    // Output directory
    outDir: 'dist',
    // Assets directory (relative to outDir)
    assetsDir: 'static',
    // Inline assets smaller than this limit
    assetsInlineLimit: 0, // 4kb

    cssCodeSplit: false,
    cssMinify: false,
    minify: false,
    modulePreload: false
  }
})