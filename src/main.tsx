import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { NodeDataProvider } from "./contexts/NodeDataContext";
import { AuthProvider } from "./contexts/AuthContext";
import RoutesWrapper from "./routes";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";
import "react-tooltip/dist/react-tooltip.css";
import "draft-js/dist/Draft.css";
import "react-confirm-alert/src/react-confirm-alert.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AuthProvider>
    <ToastContainer />
    <App />
  </AuthProvider>
);
