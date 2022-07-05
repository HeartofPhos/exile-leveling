import classNames from "classnames";
import { Action, RouteLookup } from "../../../../common/routes";
import { Area, Gem, Quest } from "../../../../common/types";
import { MdCircle } from "react-icons/md";
import {
  BsArrowDownSquare,
  BsArrowDownLeftSquare,
  BsArrowDownRightSquare,
  BsArrowLeftSquare,
  BsArrowRightSquare,
  BsArrowUpSquare,
  BsArrowUpLeftSquare,
  BsArrowUpRightSquare,
} from "react-icons/bs";
import styles from "./ExileAction.module.css";

import gemColours from "/data/gem-colours.json";

interface ActionProps {
  action: Action;
  lookup: RouteLookup;
}

function getImageUrl(path: string) {
  return new URL(`./images/${path}`, import.meta.url).href;
}

function EnemyComponent(enemy: string) {
  return <span className={classNames(styles.enemy)}>{enemy}</span>;
}

function ArenaComponent(arenaName: string) {
  return <span className={classNames(styles.area)}>{arenaName}</span>;
}

function AreaComponent(area: Area) {
  return <span className={classNames(styles.area)}>{area.name}</span>;
}

function QuestComponent(quest: Quest) {
  return (
    <>
      <img src={getImageUrl("quest.png")} className={classNames(styles.icon)} />
      <span className={classNames(styles.quest)}> {quest.name}</span>
    </>
  );
}

function QuestRewardComponent(gem: Gem) {
  return (
    <>
      <MdCircle
        color={gemColours[gem.primary_attribute]}
        className={classNames(styles.icon)}
      />
      <span>Take </span>
      <span className={classNames(styles.default)}>{gem.name}</span>
    </>
  );
}

function QuestTextComponent(text: string) {
  return <span className={classNames(styles.questText)}>{text}</span>;
}

function WaypointComponent() {
  return (
    <>
      <img
        src={getImageUrl("waypoint.png")}
        className={classNames(styles.icon)}
      />
      <span className={classNames(styles.waypoint)}>Waypoint</span>
    </>
  );
}

function VendorRewardComponent(gem: Gem) {
  return (
    <>
      <MdCircle
        color={gemColours[gem.primary_attribute]}
        className={classNames(styles.icon)}
      />
      <span>Buy </span>
      <span className={classNames(styles.default)}>{gem.name}</span>
      <span> for </span>
      <div className={classNames(styles.iconBlock)}>
        <img src={getImageUrl(`${gem.cost}.png`)} />
      </div>
    </>
  );
}

function TrialComponent() {
  return (
    <>
      <img src={getImageUrl("trial.png")} className={classNames(styles.icon)} />
      <span className={classNames(styles.trial)}>Trial of Ascendancy</span>
    </>
  );
}

function TownComponent() {
  return (
    <>
      <span className={classNames(styles.default)}>Logout</span>
    </>
  );
}

function PortalComponent() {
  return (
    <>
      <img
        src={getImageUrl("portal.png")}
        className={classNames(styles.icon)}
      />
      <span className={classNames(styles.portal)}>Portal</span>
    </>
  );
}

const directions = [
  <div className={classNames(styles.iconBlock)}>
    <BsArrowUpSquare className={classNames(styles.icon)} />
  </div>,
  <div className={classNames(styles.iconBlock)}>
    <BsArrowUpRightSquare className={classNames(styles.icon)} />
  </div>,
  <div className={classNames(styles.iconBlock)}>
    <BsArrowRightSquare className={classNames(styles.icon)} />
  </div>,
  <div className={classNames(styles.iconBlock)}>
    <BsArrowDownRightSquare className={classNames(styles.icon)} />
  </div>,
  <div className={classNames(styles.iconBlock)}>
    <BsArrowDownSquare className={classNames(styles.icon)} />
  </div>,
  <div className={classNames(styles.iconBlock)}>
    <BsArrowDownLeftSquare className={classNames(styles.icon)} />
  </div>,
  <div className={classNames(styles.iconBlock)}>
    <BsArrowLeftSquare className={classNames(styles.icon)} />
  </div>,
  <div className={classNames(styles.iconBlock)}>
    <BsArrowUpLeftSquare className={classNames(styles.icon)} />
  </div>,
];

function DirectionComponent(dirIndex: number) {
  return <span>{directions[dirIndex]}</span>;
}

function GenericComponent(text: string) {
  return <span className={classNames(styles.default)}>{text}</span>;
}

function CraftingComponent() {
  return (
    <>
      <img
        src={getImageUrl("crafting.png")}
        className={classNames(styles.icon)}
      />
      <span className={classNames(styles.default)}>Crafting Recipe</span>
    </>
  );
}

function AscendComponent() {
  return (
    <>
      <img src={getImageUrl("trial.png")} className={classNames(styles.icon)} />
      <span className={classNames(styles.trial)}>Ascend</span>
    </>
  );
}

export function ExileAction({ action, lookup }: ActionProps) {
  switch (action.type) {
    case "kill":
      return EnemyComponent(action.value);
    case "arena":
      return ArenaComponent(action.value);
    case "area":
      return AreaComponent(lookup.areas[action.areaId]);
    case "enter":
      return AreaComponent(lookup.areas[action.areaId]);
    case "quest": {
      return QuestComponent(lookup.quests[action.questId]);
    }
    case "quest_reward":
      return QuestRewardComponent(lookup.gems[action.gemId]);
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
    case "generic":
      return GenericComponent(action.value);
    case "crafting":
      return CraftingComponent();
    case "ascend":
      return AscendComponent();
  }

  return <>{`Unmapped: ${JSON.stringify(action)}`}</>;
}
