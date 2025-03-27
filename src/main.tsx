import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import React from "react";
import { CoreProvider } from "./CoreProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CoreProvider>
      <App />
    </CoreProvider>
  </React.StrictMode>
);
