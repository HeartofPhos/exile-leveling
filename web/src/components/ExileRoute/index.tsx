import classNames from "classnames";
import { Route, RouteLookup } from "../../../../common/route";
import { ExileStep } from "../ExileStep";
import "./Route.css";

interface RouteProps {
  header: string;
  route: Route;
  lookup: RouteLookup;
}

export function ExileRoute({ header, route, lookup }: RouteProps) {
  return (
    <>
      <div
        className={classNames(
          "container",
          "has-text-grey-light",
          "is-flex",
          "is-flex-direction-column",
          "px-1"
        )}
      >
        <span
          className={classNames(
            "has-text-white",
            "is-size-4",
            "has-text-weight-bold",
            "has-text-centered"
          )}
        >
          {header}
        </span>
        <ol className={classNames("route", "px-2", "mb-4")}>
          {route.map((step, i) => (
            <li key={i}>
              <ExileStep step={step} lookup={lookup} />
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
