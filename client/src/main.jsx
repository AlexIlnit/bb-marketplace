import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";

import SocketProvider from "./providers/SocketProvider";


ReactDOM.createRoot(
  document.getElementById("root")
).render(
    <HelmetProvider>
      <BrowserRouter>
      <SocketProvider>
        <App />
        </SocketProvider>
      </BrowserRouter>
    </HelmetProvider>
);