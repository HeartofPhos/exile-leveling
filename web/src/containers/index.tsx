import { lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router-dom";
import { ErrorFallback } from "../components/ErrorFallback";
import { Navbar } from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RoutesContainer = lazy(() => import("./Routes"));
const BuildContainer = lazy(() => import("./Build"));
const EditRouteContainer = lazy(() => import("./EditRoute"));

export function App() {
  return (
    <>
      <Navbar />
      <ToastContainer
        autoClose={1000}
        theme={"dark"}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
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
