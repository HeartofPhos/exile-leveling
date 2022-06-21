import classNames from "classnames";
import { Step } from "../../../../common/route";
import { ActionComponent } from "../Action";
import "./Step.css";

interface StepProps {
  value: Step;
}

export function StepComponent({ value }: StepProps) {
  const mapped = [];
  for (const subStep of value) {
    if (typeof subStep == "string") {
      mapped.push(subStep);
      continue;
    }
    if (subStep.length == 0) throw new Error(subStep.toString());

    mapped.push(<ActionComponent key={mapped.length} value={subStep} />);
  }

  return (
    <label
      className={classNames(
        "step",
        "checkbox",
        "box",
        "has-background-black",
        "has-text-light",
        "mb-1"
      )}
    >
      <input type="checkbox" className={classNames("mr-1")} />
      {mapped}
    </label>
  );
}
