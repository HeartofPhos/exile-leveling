import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { App } from "./containers";
import "./index.css";

const ExileSyncStore = lazy(() => import("./utility/ExileSyncStore"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <RecoilRoot>
        <Suspense>
          <ExileSyncStore>
            <App />
          </ExileSyncStore>
        </Suspense>
      </RecoilRoot>
    </HashRouter>
  </React.StrictMode>
);
