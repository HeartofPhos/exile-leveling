import { useEffect, useState } from "react";
import { parseRoute, Route } from "../../../../common/route";
import { RouteComponent } from "../../components/Route";
import "./App.css";
import "/data/route.txt";

function App() {
  const [routeData, setRouteData] = useState<Route | null>(null);
  useEffect(() => {
    fetch("/data/route.txt")
      .then((x) => x.text())
      .then((x) => parseRoute(x))
      .then((x) => setRouteData(x));
  }, []);

  return (
    <div className="App">
      <RouteComponent value={routeData} />
    </div>
  );
}

export default App;
