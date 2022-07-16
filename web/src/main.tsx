import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Build } from "./containers/Build";
import RoutesContainer from "./containers/Routes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<RoutesContainer />} />
          <Route path="/build" element={<Build />} />
        </Routes>
      </div>
    </HashRouter>
  </React.StrictMode>
);
