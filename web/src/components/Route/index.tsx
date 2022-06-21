import classNames from "classnames";
import { Route } from "../../../../common/route";
import { StepComponent } from "../Step";

interface RouteProps {
  value: Route | null;
}

export function RouteComponent({ value }: RouteProps) {
  return (
    <div className={classNames("container", "px-2")}>
      {value && value.map((x, i) => <StepComponent key={i} value={x} />)}
    </div>
  );
}
