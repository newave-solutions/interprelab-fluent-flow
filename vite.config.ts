import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// Lovable Cloud credentials (safe to expose - these are publishable/anon keys)
const LOVABLE_CLOUD_PROJECT_ID = "ggyzlvbtkibqnkfhgnbe";
const LOVABLE_CLOUD_URL = `https://${LOVABLE_CLOUD_PROJECT_ID}.supabase.co`;
const LOVABLE_CLOUD_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdneXpsdmJ0a2licW5rZmhnbmJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTQyOTAsImV4cCI6MjA3NDk3MDI5MH0.WKvlxub9oAc0eSn1Nh3wl0xbuedQfzIr6ELfVTpd1pU";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env at config time (may be empty if .env isn't present)
  const env = loadEnv(mode, process.cwd(), "");

  // Use Lovable Cloud credentials as guaranteed fallbacks
  const supabaseProjectId = env.VITE_SUPABASE_PROJECT_ID || LOVABLE_CLOUD_PROJECT_ID;
  const supabaseUrl = env.VITE_SUPABASE_URL || LOVABLE_CLOUD_URL;
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || LOVABLE_CLOUD_ANON_KEY;

  return {
  // Explicitly set to use .env file from project root
  envDir: './',
  // Only load .env file, not .env.local or mode-specific files
  envPrefix: 'VITE_',

  // Inline Lovable Cloud credentials into the bundle (guaranteed to work)
  define: {
    'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify(supabaseProjectId ?? ""),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(supabaseKey),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseKey),
  },

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
  };
});
