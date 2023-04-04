import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { NodeDataProvider } from "./contexts/NodeDataContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <NodeDataProvider>
      <App />
    </NodeDataProvider>
  </React.StrictMode>
);
