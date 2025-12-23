// vite.config.ts
import { defineConfig } from "file:///C:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/node_modules/lovable-tagger/dist/index.js";
import compression from "file:///C:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/node_modules/vite-plugin-compression/dist/index.mjs";
import { visualizer } from "file:///C:/Users/LSA/Coding-projects/interprelab-fluent-flow/interprelab-fluent-flow/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "C:\\Users\\LSA\\Coding-projects\\interprelab-fluent-flow\\interprelab-fluent-flow";
var vite_config_default = defineConfig(({ mode }) => ({
  // Explicitly set to use .env file from project root
  envDir: "./",
  // Only load .env file, not .env.local or mode-specific files
  envPrefix: "VITE_",
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Gzip compression for all static assets
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 1024
      // Only compress files > 1KB
    }),
    // Brotli compression for even better compression
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024
    }),
    // Bundle analyzer (only in analyze mode)
    mode === "analyze" && visualizer({
      open: true,
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Optimized manual chunks for better caching
        manualChunks: (id) => {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-vendor";
          }
          if (id.includes("node_modules/react-router")) {
            return "router";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "animations";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
          if (id.includes("node_modules/@supabase")) {
            return "supabase";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "query";
          }
        },
        // Optimize chunk file names for caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    },
    // Aggressive minification with esbuild (faster than terser, excellent compression)
    minify: "esbuild",
    target: "es2020",
    // Target modern browsers for smaller bundle
    cssCodeSplit: true,
    // CSS code splitting
    chunkSizeWarningLimit: 500,
    // Warn for chunks > 500KB
    sourcemap: false,
    // Disable source maps in production
    assetsInlineLimit: 4096
    // Inline assets < 4KB as base64
  },
  // Tree-shaking optimization
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "@supabase/supabase-js"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMU0FcXFxcQ29kaW5nLXByb2plY3RzXFxcXGludGVycHJlbGFiLWZsdWVudC1mbG93XFxcXGludGVycHJlbGFiLWZsdWVudC1mbG93XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxMU0FcXFxcQ29kaW5nLXByb2plY3RzXFxcXGludGVycHJlbGFiLWZsdWVudC1mbG93XFxcXGludGVycHJlbGFiLWZsdWVudC1mbG93XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9MU0EvQ29kaW5nLXByb2plY3RzL2ludGVycHJlbGFiLWZsdWVudC1mbG93L2ludGVycHJlbGFiLWZsdWVudC1mbG93L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbic7XHJcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcclxuICAvLyBFeHBsaWNpdGx5IHNldCB0byB1c2UgLmVudiBmaWxlIGZyb20gcHJvamVjdCByb290XHJcbiAgZW52RGlyOiAnLi8nLFxyXG4gIC8vIE9ubHkgbG9hZCAuZW52IGZpbGUsIG5vdCAuZW52LmxvY2FsIG9yIG1vZGUtc3BlY2lmaWMgZmlsZXNcclxuICBlbnZQcmVmaXg6ICdWSVRFXycsXHJcblxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmIGNvbXBvbmVudFRhZ2dlcigpLFxyXG4gICAgLy8gR3ppcCBjb21wcmVzc2lvbiBmb3IgYWxsIHN0YXRpYyBhc3NldHNcclxuICAgIGNvbXByZXNzaW9uKHtcclxuICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsXHJcbiAgICAgIGV4dDogJy5neicsXHJcbiAgICAgIHRocmVzaG9sZDogMTAyNCwgLy8gT25seSBjb21wcmVzcyBmaWxlcyA+IDFLQlxyXG4gICAgfSksXHJcbiAgICAvLyBCcm90bGkgY29tcHJlc3Npb24gZm9yIGV2ZW4gYmV0dGVyIGNvbXByZXNzaW9uXHJcbiAgICBjb21wcmVzc2lvbih7XHJcbiAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcclxuICAgICAgZXh0OiAnLmJyJyxcclxuICAgICAgdGhyZXNob2xkOiAxMDI0LFxyXG4gICAgfSksXHJcbiAgICAvLyBCdW5kbGUgYW5hbHl6ZXIgKG9ubHkgaW4gYW5hbHl6ZSBtb2RlKVxyXG4gICAgbW9kZSA9PT0gJ2FuYWx5emUnICYmIHZpc3VhbGl6ZXIoe1xyXG4gICAgICBvcGVuOiB0cnVlLFxyXG4gICAgICBmaWxlbmFtZTogJ2Rpc3Qvc3RhdHMuaHRtbCcsXHJcbiAgICAgIGd6aXBTaXplOiB0cnVlLFxyXG4gICAgICBicm90bGlTaXplOiB0cnVlLFxyXG4gICAgfSksXHJcbiAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgLy8gT3B0aW1pemVkIG1hbnVhbCBjaHVua3MgZm9yIGJldHRlciBjYWNoaW5nXHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcclxuICAgICAgICAgIC8vIFJlYWN0IGNvcmUgLSByYXJlbHkgY2hhbmdlc1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvcmVhY3QnKSB8fCBpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3JlYWN0LWRvbScpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAncmVhY3QtdmVuZG9yJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIFJlYWN0IFJvdXRlciAtIHNlcGFyYXRlIGNodW5rXHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9yZWFjdC1yb3V0ZXInKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3JvdXRlcic7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBGcmFtZXIgTW90aW9uIC0gYW5pbWF0aW9uIGxpYnJhcnkgKGlmIGluc3RhbGxlZClcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2ZyYW1lci1tb3Rpb24nKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2FuaW1hdGlvbnMnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gTHVjaWRlIGljb25zIC0gc2VwYXJhdGUgY2h1bmtcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2x1Y2lkZS1yZWFjdCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnaWNvbnMnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gU3VwYWJhc2UgLSBzZXBhcmF0ZSBjaHVua1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvQHN1cGFiYXNlJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdzdXBhYmFzZSc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBUYW5TdGFjayBRdWVyeSAtIHNlcGFyYXRlIGNodW5rXHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9AdGFuc3RhY2svcmVhY3QtcXVlcnknKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3F1ZXJ5JztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIE9wdGltaXplIGNodW5rIGZpbGUgbmFtZXMgZm9yIGNhY2hpbmdcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLltleHRdJyxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICAvLyBBZ2dyZXNzaXZlIG1pbmlmaWNhdGlvbiB3aXRoIGVzYnVpbGQgKGZhc3RlciB0aGFuIHRlcnNlciwgZXhjZWxsZW50IGNvbXByZXNzaW9uKVxyXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXHJcbiAgICB0YXJnZXQ6ICdlczIwMjAnLCAvLyBUYXJnZXQgbW9kZXJuIGJyb3dzZXJzIGZvciBzbWFsbGVyIGJ1bmRsZVxyXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLCAvLyBDU1MgY29kZSBzcGxpdHRpbmdcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLCAvLyBXYXJuIGZvciBjaHVua3MgPiA1MDBLQlxyXG4gICAgc291cmNlbWFwOiBmYWxzZSwgLy8gRGlzYWJsZSBzb3VyY2UgbWFwcyBpbiBwcm9kdWN0aW9uXHJcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NiwgLy8gSW5saW5lIGFzc2V0cyA8IDRLQiBhcyBiYXNlNjRcclxuICB9LFxyXG4gIC8vIFRyZWUtc2hha2luZyBvcHRpbWl6YXRpb25cclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nLCAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ10sXHJcbiAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWthLFNBQVMsb0JBQW9CO0FBQy9iLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFDaEMsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxrQkFBa0I7QUFMM0IsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQTtBQUFBLEVBRXpDLFFBQVE7QUFBQTtBQUFBLEVBRVIsV0FBVztBQUFBLEVBRVgsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQWlCLGdCQUFnQjtBQUFBO0FBQUEsSUFFMUMsWUFBWTtBQUFBLE1BQ1YsV0FBVztBQUFBLE1BQ1gsS0FBSztBQUFBLE1BQ0wsV0FBVztBQUFBO0FBQUEsSUFDYixDQUFDO0FBQUE7QUFBQSxJQUVELFlBQVk7QUFBQSxNQUNWLFdBQVc7QUFBQSxNQUNYLEtBQUs7QUFBQSxNQUNMLFdBQVc7QUFBQSxJQUNiLENBQUM7QUFBQTtBQUFBLElBRUQsU0FBUyxhQUFhLFdBQVc7QUFBQSxNQUMvQixNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsSUFDZCxDQUFDO0FBQUEsRUFDSCxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sY0FBYyxDQUFDLE9BQU87QUFFcEIsY0FBSSxHQUFHLFNBQVMsb0JBQW9CLEtBQUssR0FBRyxTQUFTLHdCQUF3QixHQUFHO0FBQzlFLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLDJCQUEyQixHQUFHO0FBQzVDLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLDRCQUE0QixHQUFHO0FBQzdDLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLDJCQUEyQixHQUFHO0FBQzVDLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLHdCQUF3QixHQUFHO0FBQ3pDLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLG9DQUFvQyxHQUFHO0FBQ3JELG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQTtBQUFBLFFBRUEsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQTtBQUFBLElBQ1IsY0FBYztBQUFBO0FBQUEsSUFDZCx1QkFBdUI7QUFBQTtBQUFBLElBQ3ZCLFdBQVc7QUFBQTtBQUFBLElBQ1gsbUJBQW1CO0FBQUE7QUFBQSxFQUNyQjtBQUFBO0FBQUEsRUFFQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLG9CQUFvQix1QkFBdUI7QUFBQSxFQUM3RTtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
