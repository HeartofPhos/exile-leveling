import classNames from "classnames";
import { Action, RouteLookup } from "../../../../common/routes";
import { Gem, Quest } from "../../../../common/types";
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

function AreaComponent(areaName: string) {
  return <span className={classNames(styles.area)}>{areaName}</span>;
}

function QuestComponent(quest: Quest) {
  return (
    <div className={classNames(styles.noWrap)}>
      <img src={getImageUrl("quest.png")} className={classNames(styles.icon)} />
      <span className={classNames(styles.quest)}>{quest.name}</span>
    </div>
  );
}

function QuestTextComponent(text: string) {
  return <span className={classNames(styles.questText)}>{text}</span>;
}

function WaypointComponent() {
  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("waypoint.png")}
        className={classNames(styles.icon)}
      />
      <span className={classNames(styles.waypoint)}>Waypoint</span>
    </div>
  );
}

function RewardComponent(gem: Gem, note: string, questReward: boolean) {
  return (
    <div className={classNames(styles.rewardHolder)}>
      <div>
        <MdCircle
          color={gemColours[gem.primary_attribute]}
          className={classNames(styles.icon)}
        />
        <span>{questReward ? "Take" : "Buy"} </span>
        <span className={classNames(styles.default)}>{gem.name}</span>
        {questReward || (
          <div className={classNames(styles.noWrap)}>
            <span> for </span>
            <div className={classNames(styles.iconBlock)}>
              <img src={getImageUrl(`${gem.cost}.png`)} />
            </div>
          </div>
        )}
      </div>
      <div className={classNames(styles.rewardNote)}>{note}</div>
    </div>
  );
}

function TrialComponent() {
  return (
    <div className={classNames(styles.noWrap)}>
      <img src={getImageUrl("trial.png")} className={classNames(styles.icon)} />
      <span className={classNames(styles.trial)}>Trial of Ascendancy</span>
    </div>
  );
}

function TownComponent() {
  return (
    <>
      <span className={classNames(styles.default)}>
        <span>Logout</span>
      </span>
    </>
  );
}

function PortalComponent() {
  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("portal.png")}
        className={classNames(styles.icon)}
      />
      <span className={classNames(styles.portal)}>Portal</span>
    </div>
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
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("crafting.png")}
        className={classNames(styles.icon)}
      />
      <span className={classNames(styles.default)}>Crafting Recipe</span>
    </div>
  );
}

function AscendComponent() {
  return (
    <div className={classNames(styles.noWrap)}>
      <img src={getImageUrl("trial.png")} className={classNames(styles.icon)} />
      <span className={classNames(styles.trial)}>Ascend</span>
    </div>
  );
}

export function ExileAction({ action, lookup }: ActionProps) {
  switch (action.type) {
    case "kill":
      return EnemyComponent(action.value);
    case "arena":
      return AreaComponent(action.value);
    case "area":
      return AreaComponent(lookup.areas[action.areaId].name);
    case "enter":
      return AreaComponent(lookup.areas[action.areaId].name);
    case "quest": {
      return QuestComponent(lookup.quests[action.questId]);
    }
    case "quest_reward":
      return RewardComponent(
        lookup.gems[action.requiredGem.id],
        action.requiredGem.note,
        true
      );
    case "quest_text":
      return QuestTextComponent(action.value);
    case "waypoint": {
      if (action.areaId == null) return WaypointComponent();

      return (
        <>
          {WaypointComponent()}
          <span> ➞ </span>
          {AreaComponent(lookup.areas[action.areaId].name)}
        </>
      );
    }
    case "get_waypoint":
      return WaypointComponent();
    case "vendor_reward":
      return RewardComponent(
        lookup.gems[action.requiredGem.id],
        action.requiredGem.note,
        false
      );
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
