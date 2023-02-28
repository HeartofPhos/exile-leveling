import { ErrorFallback } from "../components/ErrorFallback";
import { Loading } from "../components/Loading";
import { Navbar } from "../components/Navbar";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RoutesContainer = lazy(() => import("./Routes"));
const BuildContainer = lazy(() => import("./Build"));
const EditRouteContainer = lazy(() => import("./EditRoute"));

export function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/" element={<RoutesContainer />} />
            <Route path="/build" element={<BuildContainer />} />
            <Route path="/edit-route" element={<EditRouteContainer />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        closeOnClick={true}
        theme={"dark"}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </>
  );
}
