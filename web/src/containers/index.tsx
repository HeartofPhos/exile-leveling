import { lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router-dom";
import { ErrorFallback } from "../components/ErrorFallback";
import { Navbar } from "../components/Navbar";
import CampactViewContainer from "./CompactView";

const Build = lazy(() => import("./Build"));
const RoutesContainer = lazy(() => import("./Routes"));

export function App() {
  return (
    <>
      <Navbar />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route path="/" element={<RoutesContainer />} />
          <Route path="/build" element={<Build />} />
          <Route path="/quick-view" element={<CampactViewContainer />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}
