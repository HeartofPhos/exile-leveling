import { RouteData } from "../../../../common/route-processing/types";
import { SplitRow } from "../SplitRow";
import { Fragment } from "./Fragment";
import styles from "./styles.module.css";
import classNames from "classnames";
import React, { useState } from "react";
import { BiInfoCircle, BiSolidInfoCircle } from "react-icons/bi";

interface StepProps {
  step: RouteData.FragmentStep;
}

export function FragmentStep({ step }: StepProps) {
  const [showSubSteps, setShowSubSteps] = useState(false);

  const headNodes: React.ReactNode[] = [];
  const tailNodes: React.ReactNode[] = [];

  for (let i = 0; i < step.parts.length; i++) {
    const fragment = step.parts[i];
    const [head, tail] = Fragment(fragment);

    if (head) headNodes.push(head);
    if (tail) tailNodes.push(tail);
  }

  if (step.subSteps.length > 0) {
    headNodes.push(
      <>
        {" "}
        <button
          className={classNames(styles.subStepToggle)}
          onClick={(e) => {
            setShowSubSteps(!showSubSteps);
            e.stopPropagation();
          }}
        >
          {showSubSteps ? (
            <BiInfoCircle className={classNames("inlineIcon")} />
          ) : (
            <BiSolidInfoCircle className={classNames("inlineIcon")} />
          )}
        </button>
      </>
    );
  }

  return (
    <>
      {headNodes.length > 0 && tailNodes.length > 0 ? (
        <SplitRow
          left={React.Children.toArray(headNodes)}
          right={React.Children.toArray(tailNodes)}
        />
      ) : (
        React.Children.toArray(headNodes)
      )}
      {showSubSteps && (
        <>
          <hr />
          {React.Children.toArray(
            step.subSteps.map((x) => (
              <>
                <FragmentStep step={x} />
                <br />
              </>
            ))
          )}
        </>
      )}
    </>
  );
}
