import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const Build = lazy(() => import("./Build"));
const RoutesContainer = lazy(() => import("./Routes"));

export function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<RoutesContainer />} />
        <Route path="/build" element={<Build />} />
      </Routes>
    </>
  );
}
