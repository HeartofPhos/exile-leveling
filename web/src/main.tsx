import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Gems } from "./containers/Gems";
import RoutesContainer from "./containers/Routes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<RoutesContainer />} />
        <Route path="/gems" element={<Gems />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
