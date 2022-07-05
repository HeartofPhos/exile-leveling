import classNames from "classnames";
import { useEffect } from "react";
import { useState } from "react";
import { RouteLookup, Step } from "../../../../common/routes";
import { ExileAction } from "../ExileAction";
import styles from "./ExileStep.module.css";

interface StepProps {
  step: Step;
  lookup: RouteLookup;
  initialIsDone: boolean;
  onUpdate?: (isCompleted: boolean) => void;
}

export function ExileStep({
  step,
  lookup,
  initialIsDone,
  onUpdate,
}: StepProps) {
  const [isCompleted, setIsCompleted] = useState<boolean>(initialIsDone);
  useEffect(() => {
    if (onUpdate) onUpdate(isCompleted);
  }, [isCompleted]);

  return (
    <div
      className={classNames(styles.step, { [styles.completed]: isCompleted })}
      onClick={() => {
        setIsCompleted(!isCompleted);
      }}
    >
      {step.map((subStep, i) =>
        typeof subStep == "string" ? (
          subStep
        ) : (
          <ExileAction key={i} action={subStep} lookup={lookup} />
        )
      )}
    </div>
  );
}
