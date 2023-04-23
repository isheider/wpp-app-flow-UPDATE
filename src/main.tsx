import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { NodeDataProvider } from "./contexts/NodeDataContext";
import AuthProvider from "./contexts/AuthContext";
import RoutesWrapper from "./routes";

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
