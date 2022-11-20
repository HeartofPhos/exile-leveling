import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App } from "./containers";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <RecoilRoot>
        <Suspense>
            <App />
        </Suspense>
      </RecoilRoot>
    </HashRouter>
  </React.StrictMode>
);
