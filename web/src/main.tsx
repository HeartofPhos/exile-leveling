import { App } from "./containers";
import "./index.css";
import { loadAnalytics } from "./utility/telementry";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

if (import.meta.env.VITE_ANALYTICS_KEY) {
  loadAnalytics(import.meta.env.VITE_ANALYTICS_KEY);
}

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
