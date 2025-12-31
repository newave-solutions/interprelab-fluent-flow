// Force rebuild to reload environment variables
import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { logPerformanceMetrics } from "./utils/performance";

// Initialize performance monitoring in development
if (import.meta.env.DEV) {
  logPerformanceMetrics();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
