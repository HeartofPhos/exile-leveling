import classNames from "classnames";
import { RouteLookup, Step } from "../../../../common/routes";
import { ExileFragment } from "../ExileFragment";
import { GemReward } from "../GemReward";
import styles from "./ExileStep.module.css";

function mapStep(step: Step, lookup: RouteLookup) {
  switch (step.type) {
    case "fragment_step": {
      return step.parts.map((part, i) =>
        typeof part == "string" ? (
          part
        ) : (
          <ExileFragment key={i} fragment={part} lookup={lookup} />
        )
      );
    }
  }

  throw new Error("unexpected type");
}

interface StepProps {
  step: Step;
  lookup: RouteLookup;
}

export function ExileStep({ step, lookup }: StepProps) {
  return <div className={classNames(styles.step)}>{mapStep(step, lookup)}</div>;
}
