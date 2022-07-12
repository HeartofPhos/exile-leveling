import classNames from "classnames";
import React from "react";
import { RouteLookup, Step } from "../../../../common/routes";
import { ExileAction } from "../ExileAction";
import { GemReward } from "../GemReward";
import styles from "./ExileStep.module.css";

function mapStep(step: Step, lookup: RouteLookup) {
  switch (step.type) {
    case "action_step": {
      return step.parts.map((part, i) =>
        typeof part == "string" ? (
          part
        ) : (
          <ExileAction key={i} action={part} lookup={lookup} />
        )
      );
    }
    case "reward_step": {
      return (
        <GemReward requiredGem={step.requiredGem} type={step.reward_type} />
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
