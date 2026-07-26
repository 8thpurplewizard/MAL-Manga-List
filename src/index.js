import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./App"; // Renamed App to AppWrapper

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
