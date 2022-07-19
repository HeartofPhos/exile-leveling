import { lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const Build = lazy(() => import("./Build"));
const RoutesContainer = lazy(() => import("./Routes"));

export function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace("#", ""));
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

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
