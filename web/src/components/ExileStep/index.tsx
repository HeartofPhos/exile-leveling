import classNames from "classnames";
import { useState } from "react";
import { RouteLookup, Step } from "../../../../common/routes";
import { ExileAction } from "../ExileAction";
import "./ExileStep.css";

interface StepProps {
  step: Step;
  lookup: RouteLookup;
}

export function ExileStep({ step, lookup }: StepProps) {
  const [isDone, setIsDone] = useState<boolean>(false);
  const mapped = [];
  for (const subStep of step) {
    if (typeof subStep == "string") {
      mapped.push(subStep);
      continue;
    }

    mapped.push(
      <ExileAction key={mapped.length} action={subStep} lookup={lookup} />
    );
  }

  return (
    <div
      className={classNames("step", { done: isDone })}
      onClick={() => {
        setIsDone(!isDone);
      }}
    >
      {mapped}
    </div>
  );
}
