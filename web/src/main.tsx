import classNames from "classnames";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Gems } from "./containers/Build";
import RoutesContainer from "./containers/Routes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className={classNames("container")}>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<RoutesContainer />} />
          <Route path="/gems" element={<Gems />} />
        </Routes>
      </HashRouter>
    </div>
  </React.StrictMode>
);
