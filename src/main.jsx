import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CommentProvider } from "../context/CommentProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CommentProvider>
    <App />
  </CommentProvider>
);
