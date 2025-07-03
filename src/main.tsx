// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "antd/dist/reset.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
     <QueryClientProvider client={queryClient}>
      <App />
        </QueryClientProvider>

    </BrowserRouter>
  </React.StrictMode>
);
