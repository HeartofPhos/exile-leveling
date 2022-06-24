import classNames from "classnames";
import { Action, RouteLookup } from "../../../../common/route";
import { Area, Gem } from "../../../../common/types";
import "./Action.css";

interface ActionProps {
  action: Action;
  lookup: RouteLookup;
}

function EnemyComponent(enemy: string) {
  return <span className={classNames("enemy")}>{enemy}</span>;
}

function AreaComponent(area: Area) {
  return <span className={classNames("area")}>{area.name}</span>;
}

function QuestComponent(questName: string) {
  return (
    <>
      <img src="/images/quest.png" className={classNames("icon")} />
      <span className={classNames("quest")}> {questName}</span>
    </>
  );
}

function QuestRewardComponent(gem: Gem) {
  return (
    <>
      <span className={classNames(`gem-${gem.primary_attribute}`)}>⏺ </span>
      <span>Take </span>
      <span className={classNames(`gem`)}>{gem.id}</span>
    </>
  );
}

function QuestTextComponent(text: string) {
  return <span className={classNames("quest_text")}>{text}</span>;
}

function WaypointComponent() {
  return (
    <>
      <img src="/images/waypoint.png" className={classNames("icon")} />
      <span className={classNames("waypoint")}>Waypoint</span>
    </>
  );
}

function VendorRewardComponent(gem: Gem) {
  return (
    <>
      <span className={classNames(`gem-${gem.primary_attribute}`)}>⏺ </span>
      <span>Buy </span>
      <span className={classNames(`gem`)}>{gem.id}</span>
    </>
  );
}

function TrialComponent() {
  return (
    <>
      <img src="/images/trial.png" className={classNames("icon")} />
      <span className={classNames("trial")}>Trial of Ascendancy</span>
    </>
  );
}

function TownComponent() {
  return <span className={classNames("npc")}>Logout</span>;
}

function PortalComponent() {
  return (
    <>
      <img src="/images/portal.png" className={classNames("icon")} />
      <span className={classNames("portal")}>Portal</span>
    </>
  );
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

function DirectionComponent(dirIndex: number) {
  return <span>{directions[dirIndex]}</span>;
}

function NpcComponent(npcName: string) {
  return <span className={classNames("npc")}>{npcName}</span>;
}

function CraftingComponent() {
  return (
    <>
      <img src="/images/crafting.png" className={classNames("icon")} />
      <span className={classNames("crafting")}>Crafting Recipe</span>
    </>
  );
}

function AscendComponent() {
  return (
    <>
      <img src="/images/trial.png" className={classNames("icon")} />
      <span className={classNames("trial")}>Ascend</span>
    </>
  );
}

export function ActionComponent({ action, lookup }: ActionProps) {
  switch (action.type) {
    case "kill":
      return EnemyComponent(action.value);
    case "area":
      return AreaComponent(lookup.areas[action.areaId]);
    case "enter":
      return AreaComponent(lookup.areas[action.areaId]);
    case "quest": {
      const quest = lookup.quests[action.questId];
      return QuestComponent(quest?.name || action.questId);
    }
    case "quest_reward":
      return QuestRewardComponent(lookup.gems[action.gemId]);
    case "quest_item":
      return QuestTextComponent(action.value);
    case "quest_text":
      return QuestTextComponent(action.value);
    case "waypoint": {
      if (action.areaId == null) return WaypointComponent();
      return (
        <>
          {WaypointComponent()}
          <span> ➞ </span>
          {AreaComponent(lookup.areas[action.areaId])}
        </>
      );
    }
    case "get_waypoint":
      return WaypointComponent();
    case "vendor_reward":
      return VendorRewardComponent(lookup.gems[action.gemId]);
    case "trial":
      return TrialComponent();
    case "town":
      return TownComponent();
    case "set_portal":
      return PortalComponent();
    case "use_portal":
      return PortalComponent();
    case "dir":
      return DirectionComponent(action.dirIndex);
    case "npc":
      return NpcComponent(action.value);
    case "crafting":
      return CraftingComponent();
    case "ascend":
      return AscendComponent();
  }

  return <>{`Unmapped: ${JSON.stringify(action)}`}</>;
}
