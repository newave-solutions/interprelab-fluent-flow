import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Explicitly set to use .env file from project root
  envDir: './',
  // Only load .env file, not .env.local or mode-specific files
  envPrefix: 'VITE_',

  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Gzip compression for all static assets
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files > 1KB
    }),
    // Brotli compression for even better compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
    // Bundle analyzer (only in analyze mode)
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Optimized manual chunks for better caching
        manualChunks: (id) => {
          // React core - rarely changes
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // React Router - separate chunk
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          // Framer Motion - animation library (if installed)
          if (id.includes('node_modules/framer-motion')) {
            return 'animations';
          }
          // Lucide icons - separate chunk
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          // Supabase - separate chunk
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          // TanStack Query - separate chunk
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'query';
          }
        },
        // Optimize chunk file names for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Aggressive minification with esbuild (faster than terser, excellent compression)
    minify: 'esbuild',
    target: 'es2020', // Target modern browsers for smaller bundle
    cssCodeSplit: true, // CSS code splitting
    chunkSizeWarningLimit: 500, // Warn for chunks > 500KB
    sourcemap: false, // Disable source maps in production
    assetsInlineLimit: 4096, // Inline assets < 4KB as base64
  },
  // Tree-shaking optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
  },
}));
