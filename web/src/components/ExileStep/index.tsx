import classNames from "classnames";
import { RouteLookup, Step } from "../../../../common/routes";
import { ExileAction } from "../ExileAction";
import styles from "./ExileStep.module.css";

interface StepProps {
  step: Step;
  lookup: RouteLookup;
}

export function ExileStep({ step, lookup }: StepProps) {
  return (
    <div className={classNames(styles.step)}>
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
