import classNames from "classnames";
import { Action, RouteLookup } from "../../../../common/routes";
import { Quest } from "../../../../common/types";
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
import { GemReward } from "../GemReward";

import { quests, areas, gems } from "../../../../common/data";
import { InlineFakeBlock } from "../InlineFakeBlock";

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
      <img
        src={getImageUrl("quest.png")}
        className={classNames("inlineIcon")}
      />
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
        className={classNames("inlineIcon")}
      />
      <span className={classNames(styles.waypoint)}>Waypoint</span>
    </div>
  );
}

function TrialComponent() {
  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("trial.png")}
        className={classNames("inlineIcon")}
      />
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
        className={classNames("inlineIcon")}
      />
      <span className={classNames(styles.portal)}>Portal</span>
    </div>
  );
}

const directions = [
  <InlineFakeBlock
    child={<BsArrowUpSquare className={classNames("inlineIcon")} />}
  />,
  <InlineFakeBlock
    child={<BsArrowUpRightSquare className={classNames("inlineIcon")} />}
  />,
  <InlineFakeBlock
    child={<BsArrowRightSquare className={classNames("inlineIcon")} />}
  />,
  <InlineFakeBlock
    child={<BsArrowDownRightSquare className={classNames("inlineIcon")} />}
  />,
  <InlineFakeBlock
    child={<BsArrowDownSquare className={classNames("inlineIcon")} />}
  />,
  <InlineFakeBlock
    child={<BsArrowDownLeftSquare className={classNames("inlineIcon")} />}
  />,
  <InlineFakeBlock
    child={<BsArrowLeftSquare className={classNames("inlineIcon")} />}
  />,
  <InlineFakeBlock
    child={<BsArrowUpLeftSquare className={classNames("inlineIcon")} />}
  />,
];

function DirectionComponent(dirIndex: number) {
  return <span>{directions[dirIndex]}</span>;
}

function GenericComponent(text: string) {
  return <span className={classNames(styles.default)}>{text}</span>;
}

function CraftingComponent(craftingRecipes: string[]) {
  return (
    <span>
      <div className={classNames(styles.noWrap)}>
        <img
          src={getImageUrl("crafting.png")}
          className={classNames("inlineIcon")}
        />
        <span className={classNames(styles.default)}>Crafting: </span>
      </div>
      <span className={classNames(styles.default)}>
        {craftingRecipes.join(", ")}
      </span>
    </span>
  );
}

function AscendComponent() {
  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("trial.png")}
        className={classNames("inlineIcon")}
      />
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
      return AreaComponent(areas[action.areaId].name);
    case "enter":
      return AreaComponent(areas[action.areaId].name);
    case "quest": {
      return QuestComponent(quests[action.questId]);
    }
    case "quest_reward":
      return GemReward(action.requiredGem, "quest");
    case "quest_text":
      return QuestTextComponent(action.value);
    case "waypoint": {
      if (action.areaId == null) return WaypointComponent();

      return (
        <>
          {WaypointComponent()}
          <span> ➞ </span>
          {AreaComponent(areas[action.areaId].name)}
        </>
      );
    }
    case "get_waypoint":
      return WaypointComponent();
    case "vendor_reward":
      return GemReward(action.requiredGem, "vendor");
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
      return CraftingComponent(action.crafting_recipes);
    case "ascend":
      return AscendComponent();
  }

  return <>{`Unmapped: ${JSON.stringify(action)}`}</>;
}
