import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserAdmin from "./context/UserAdmin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserAdmin>
      <App />
    </UserAdmin>
  </React.StrictMode>
);