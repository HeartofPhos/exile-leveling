import classNames from "classnames";
import { Action, RouteState } from "../../../../common/route";
import { Area } from "../../../../common/types";
import "./Action.css";

interface ActionProps {
  action: Action;
  state: RouteState;
}

function EnemyComponent(enemy: string) {
  return <span className={classNames("enemy")}>{enemy}</span>;
}

function AreaComponent(area: Area) {
  return <span className={classNames("area")}>{area.name}</span>;
}

function QuestComponent(questName: string) {
  return <span className={classNames("quest")}>{questName}</span>;
}

function QuestTextComponent(text: string) {
  return <span className={classNames("quest_text")}>{text}</span>;
}

function WaypointComponent() {
  return <span className={classNames("waypoint")}>Waypoint</span>;
}

function VendorComponent() {
  return (
    <>
      <span>Purchase </span>
      <span className={classNames("vendor")}>Gems</span>
    </>
  );
}

function TrialComponent() {
  return <span className={classNames("trial")}>Trial of Ascendancy</span>;
}

function TownComponent() {
  return (
    <>
      <span>Return to </span>
      <span className={classNames("area")}>Town</span>
    </>
  );
}

function PortalComponent() {
  return <span className={classNames("portal")}>Portal</span>;
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

function DirectionComponent(angle: number) {
  let dirIndex = Math.floor(angle / 45);
  return <span>{directions[dirIndex]}</span>;
}

function NpcComponent(npcName: string) {
  return <span className={classNames("npc")}>{npcName}</span>;
}

function CraftingComponent() {
  return <span className={classNames("crafting")}>Crafting Recipe</span>;
}

function AscendComponent() {
  return <span className={classNames("trial")}>Ascend</span>;
}

type ActionMapper = (action: Action, state: RouteState) => JSX.Element;
const ACTION_MAPPER_LOOKUP: Record<string, ActionMapper> = {
  kill: (action, state) => EnemyComponent(action[1]),
  area: (action, state) => AreaComponent(state.areas[action[1]]),
  enter: (action, state) => AreaComponent(state.areas[action[1]]),
  quest: (action, state) => {
    const quest = state.quests[action[1]];
    return QuestComponent(quest?.quest || action[1]);
  },
  quest_item: (action, state) => QuestTextComponent(action[1]),
  quest_text: (action, state) => QuestTextComponent(action[1]),
  waypoint: (action, state) => {
    if (action.length == 1) return WaypointComponent();
    return (
      <>
        {WaypointComponent()}
        <span> to </span>
        {AreaComponent(state.areas[action[1]])}
      </>
    );
  },
  get_waypoint: (action, state) => WaypointComponent(),
  vendor: (action, state) => VendorComponent(),
  trial: (action, state) => TrialComponent(),
  town: (action, state) => TownComponent(),
  set_portal: (action, state) => PortalComponent(),
  use_portal: (action, state) => PortalComponent(),
  dir: (action, state) => DirectionComponent(Number.parseFloat(action[1])),
  npc: (action, state) => NpcComponent(action[1]),
  crafting: (action, state) => CraftingComponent(),
  ascend: (action, state) => AscendComponent(),
};

export function ActionComponent({ action, state }: ActionProps) {
  const actionMapper = ACTION_MAPPER_LOOKUP[action[0]];
  if (actionMapper) return actionMapper(action, state);
  else return <>{`Unmapped: ${action.toString()}`}</>;
}
