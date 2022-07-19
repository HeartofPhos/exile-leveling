import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App } from "./containers";
import "./index.css";
import { ExileSyncStore } from "./utility/ExileSyncStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <RecoilRoot>
        <ExileSyncStore>
          <App />
        </ExileSyncStore>
      </RecoilRoot>
    </HashRouter>
  </React.StrictMode>
);
