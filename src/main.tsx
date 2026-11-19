import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import AdminApp from "./AdminApp";

import "./index.css";

const isAdminPage =
  window.location.pathname.startsWith("/admin");

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    {isAdminPage ? <AdminApp /> : <App />}
  </React.StrictMode>
);