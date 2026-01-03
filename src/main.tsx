// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App"; // ✅ import App, not AppRouter


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App /> {/* ✅ App contains ErrorBoundary + Toaster + AppRouter */}
    </QueryClientProvider>
  </React.StrictMode>
);
