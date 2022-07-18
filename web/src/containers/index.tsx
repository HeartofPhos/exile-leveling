import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Build } from "./Build";
import RoutesContainer from "./Routes";

export function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace("#", ""));
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="container">
      <Navbar />
      <Routes>
        <Route path="/" element={<RoutesContainer />} />
        <Route path="/build" element={<Build />} />
      </Routes>
    </div>
  );
}
