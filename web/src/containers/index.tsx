import { lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router-dom";
import { ErrorFallback } from "../components/ErrorFallback";
import { Navbar } from "../components/Navbar";

const BuildContainer = lazy(() => import("./Build"));
const RoutesContainer = lazy(() => import("./Routes"));
const EditRouteContainer = lazy(() => import("./EditRoute"));

export function App() {
  return (
    <>
      <Navbar />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Routes>
          <Route path="/" element={<RoutesContainer />} />
          <Route path="/build" element={<BuildContainer />} />
          <Route path="/edit-route" element={<EditRouteContainer />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}
