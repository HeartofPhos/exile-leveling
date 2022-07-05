import classNames from "classnames";
import { useState } from "react";
import { RouteLookup, Step } from "../../../../common/routes";
import { ExileAction } from "../ExileAction";
import styles from "./ExileStep.module.css";

interface StepProps {
  step: Step;
  lookup: RouteLookup;
  initialIsDone: boolean;
  onUpdate?: (isDone: boolean) => void;
}

export function ExileStep({
  step,
  lookup,
  initialIsDone,
  onUpdate,
}: StepProps) {
  const [isDone, setIsDone] = useState<boolean>(initialIsDone);
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
      className={classNames(styles.step, { [styles.done]: isDone })}
      onClick={() => {
        setIsDone(!isDone);
        if (onUpdate) onUpdate(!isDone);
      }}
    >
      {mapped}
    </div>
  );
}
