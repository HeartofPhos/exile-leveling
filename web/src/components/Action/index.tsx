import classNames from "classnames";
import { Action, RouteState, validateAction } from "../../../../common/route";
import "./Action.css";

interface ActionProps {
  action: Action;
  state: RouteState;
}

const directions = [
  "North",
  "North-East",
  "East",
  "South-East",
  "South",
  "South-West",
  "West",
  "North-West",
];

type ActionMapper = (action: Action, state: RouteState) => JSX.Element;
const ACTION_MAPPER_LOOKUP: Record<string, ActionMapper> = {
  kill: (action, state) => (
    <span className={classNames("enemy")}>{action[1]}</span>
  ),
  area: (action, state) => (
    <span className={classNames("area")}>{state.areas[action[1]].name}</span>
  ),
  enter: (action, state) => (
    <span className={classNames("area")}>{state.areas[action[1]].name}</span>
  ),
  quest: (action, state) => {
    const quest = state.quests[action[1]];
    return (
      <span className={classNames("quest")}>{quest?.quest || action[1]}</span>
    );
  },
  quest_item: (action, state) => {
    return <span className={classNames("quest_item")}>{action[1]}</span>;
  },
  quest_text: (action, state) => {
    return <span className={classNames("quest_text")}>{action[1]}</span>;
  },
  waypoint: (action, state) => {
    if (action.length == 1)
      return <span className={classNames("waypoint")}>Waypoint</span>;

    return (
      <>
        <span className={classNames("waypoint")}>Waypoint</span>
        <span> to </span>
        <span className={classNames("area")}>
          {state.areas[action[1]].name}
        </span>
      </>
    );
  },
  get_waypoint: (action, state) => {
    return <span className={classNames("waypoint")}>Waypoint</span>;
  },
  vendor: (action, state) => {
    return (
      <>
        <span>Purchase </span>
        <span className={classNames("vendor")}>Gems</span>
      </>
    );
  },
  trial: (action, state) => {
    return <span className={classNames("trial")}>Trial of Ascendancy</span>;
  },
  town: (action, state) => {
    return (
      <>
        <span>Return to </span>
        <span className={classNames("area")}>Town</span>
      </>
    );
  },
  set_portal: (action, state) => {
    return <span className={classNames("portal")}>Portal</span>;
  },
  use_portal: (action, state) => {
    return <span className={classNames("portal")}>Portal</span>;
  },
  dir: (action, state) => {
    let dirIndex = Math.floor(Number.parseFloat(action[1]) / 45);
    return <span>{directions[dirIndex]}</span>;
  },
  npc: (action, state) => {
    return <span className={classNames("npc")}>{action[1]}</span>;
  },
  crafting: (action, state) => {
    return <span className={classNames("crafting")}>Crafting Recipe</span>;
  },
};

export function ActionComponent({ action, state }: ActionProps) {
  const actionMapper = ACTION_MAPPER_LOOKUP[action[0]];
  if (actionMapper) return actionMapper(action, state);
  else return <>{action.join(" ")}</>;
}
