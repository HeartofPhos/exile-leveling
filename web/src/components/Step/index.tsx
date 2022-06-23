import classNames from "classnames";
import { useState } from "react";
import { RouteLookup, RouteState, Step } from "../../../../common/route";
import { ActionComponent } from "../Action";
import "./Step.css";

interface StepProps {
  step: Step;
  lookup: RouteLookup;
}

export function StepComponent({ step, lookup }: StepProps) {
  const [isDone, setIsDone] = useState<boolean>(false);
  const mapped = [];
  for (const subStep of step) {
    if (typeof subStep == "string") {
      mapped.push(subStep);
      continue;
    }

    mapped.push(
      <ActionComponent key={mapped.length} action={subStep} lookup={lookup} />
    );
  }

  return (
    <label
      className={classNames(
        "step",
        { done: isDone },
        "checkbox",
        "box",
        "has-background-black",
        "has-text-grey-light",
        "mb-1"
      )}
      onClick={() => {
        setIsDone(!isDone);
      }}
    >
      {mapped}
    </label>
  );
}
