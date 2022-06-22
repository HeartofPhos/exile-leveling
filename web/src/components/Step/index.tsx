import classNames from "classnames";
import { useState } from "react";
import { RouteState, Step } from "../../../../common/route";
import { ActionComponent } from "../Action";
import "./Step.css";

interface StepProps {
  step: Step;
  state: RouteState;
}

export function StepComponent({ step, state }: StepProps) {
  const [isDone, setIsDone] = useState<boolean>(false);
  const mapped = [];
  for (const subStep of step) {
    if (typeof subStep == "string") {
      mapped.push(subStep);
      continue;
    }
    if (subStep.length == 0) throw new Error(subStep.toString());

    mapped.push(
      <ActionComponent key={mapped.length} action={subStep} state={state} />
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
