import classNames from "classnames";
import { Action } from "../../../../common/route";
import "./Action.css";

interface ActionProps {
  value: Action;
}

type ActionMapper = (action: Action) => JSX.Element;
const ACTION_MAPPER_LOOKUP: Record<string, ActionMapper> = {
  kill: (action) => (
    <>
      <span className={classNames("action-text")}>Kill </span>
      <span className={classNames("enemy")}>{action[1]}</span>
    </>
  ),
};

export function ActionComponent({ value }: ActionProps) {
  const actionMapper = ACTION_MAPPER_LOOKUP[value[0]];
  if (actionMapper) return actionMapper(value);
  else return <>{value.join(" ")}</>;
}
