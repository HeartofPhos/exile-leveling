import { useEffect, useState } from "react";
import { Action, parseRoute, Route, Step } from "../../../../common/route";
import "./App.css";
import "/data/route.txt";

function mapAction(action: Action) {
  return <>{action.join(" ")}</>;
}

function mapStep(step: Step) {
  const mapped = [];

  for (const subStep of step) {
    if (typeof subStep == "string") {
      mapped.push(subStep);
      continue;
    }
    if (subStep.length == 0) throw new Error(subStep.toString());

    mapped.push(mapAction(subStep));
  }

  return (
    <>
      {mapped}
      <br />
    </>
  );
}

function App() {
  const [routeData, setRouteData] = useState<Route | null>(null);
  useEffect(() => {
    fetch("/data/route.txt")
      .then((x) => x.text())
      .then((x) => parseRoute(x))
      .then((x) => setRouteData(x));
  }, []);

  if (routeData) {
  }

  return <div className="App">{routeData && routeData.map(mapStep)}</div>;
}

export default App;
