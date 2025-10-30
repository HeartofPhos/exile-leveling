import { App } from "./containers";
import "./index.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

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
