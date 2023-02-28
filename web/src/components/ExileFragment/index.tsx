import { areas, quests } from "../../../../common/data";
import {
  Fragment,
  QuestFragment,
} from "../../../../common/route-processing/fragment/types";
import { FragmentStep } from "../../../../common/route-processing/types";
import { GameData } from "../../../../common/types";
import { InlineFakeBlock } from "../InlineFakeBlock";
import { ItemReward } from "../ItemReward";
import { SplitRow } from "../SplitRow";
import { taskStyle } from "../TaskList";
import styles from "./styles.module.css";
import classNames from "classnames";
import {
  BsArrowDownLeftSquare,
  BsArrowDownRightSquare,
  BsArrowDownSquare,
  BsArrowLeftSquare,
  BsArrowRightSquare,
  BsArrowUpLeftSquare,
  BsArrowUpRightSquare,
  BsArrowUpSquare,
} from "react-icons/bs";

interface FragmentProps {
  fragment: Fragment;
}

function getImageUrl(path: string) {
  return new URL(`./images/${path}`, import.meta.url).href;
}

function EnemyComponent(enemy: string) {
  return <span className={classNames(styles.enemy)}>{enemy}</span>;
}

function AreaComponent(name: string, isTownArea: boolean) {
  return (
    <div className={classNames(styles.noWrap)}>
      <span className={classNames(styles.area)}>{name}</span>
      {isTownArea && (
        <img
          src={getImageUrl("town.png")}
          className={classNames("inlineIcon")}
          alt=""
        />
      )}
    </div>
  );
}

function QuestComponent(fragment: QuestFragment) {
  const quest = quests[fragment.questId];

  let partPostfix;
  if (fragment.rewardOffers.length != quest.reward_offers.length)
    partPostfix = (
      <> Part {fragment.rewardOffers.map((x) => x + 1).join(", ")}</>
    );
  else partPostfix = <></>;

  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("quest.png")}
        className={classNames("inlineIcon")}
        alt=""
      />
      <span className={classNames(styles.quest)}>
        {quest.name}
        {partPostfix}
      </span>
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
        alt=""
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
        alt=""
      />
      <span className={classNames(styles.trial)}>Trial of Ascendancy</span>
    </div>
  );
}

function LogoutComponent(area: GameData.Area) {
  return (
    <>
      <span className={classNames(styles.default)}>Logout</span>
      <span> ➞ </span>
      {AreaComponent(area.name, area.is_town_area)}
    </>
  );
}

function PortalComponent(area?: GameData.Area) {
  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("portal.png")}
        className={classNames("inlineIcon")}
        alt=""
      />
      <span className={classNames(styles.portal)}>Portal</span>
      {area && (
        <>
          <span> ➞ </span>
          {AreaComponent(area.name, area.is_town_area)}
        </>
      )}
    </div>
  );
}

const directions = [
  <InlineFakeBlock child={<BsArrowUpSquare />} />,
  <InlineFakeBlock child={<BsArrowUpRightSquare />} />,
  <InlineFakeBlock child={<BsArrowRightSquare />} />,
  <InlineFakeBlock child={<BsArrowDownRightSquare />} />,
  <InlineFakeBlock child={<BsArrowDownSquare />} />,
  <InlineFakeBlock child={<BsArrowDownLeftSquare />} />,
  <InlineFakeBlock child={<BsArrowLeftSquare />} />,
  <InlineFakeBlock child={<BsArrowUpLeftSquare />} />,
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
          alt=""
        />
        <span className={classNames(styles.default)}>Crafting: </span>
      </div>
      <span className={classNames(styles.default)}>
        {craftingRecipes.join(", ")}
      </span>
    </span>
  );
}

const GUIDE_URL_LOOKUP: Record<string, string> = {
  normal: "https://www.poelab.com/gtgax",
  cruel: "https://www.poelab.com/r8aws",
  merciless: "https://www.poelab.com/riikv",
  eternal: "https://www.poelab.com/wfbra",
};

function AscendComponent(version: string) {
  return (
    <SplitRow
      left={
        <div className={classNames(styles.noWrap)}>
          <img
            src={getImageUrl("trial.png")}
            className={classNames("inlineIcon")}
            alt=""
          />
          <span className={classNames(styles.trial)}>Ascend</span>
        </div>
      }
      right={
        <a
          href={GUIDE_URL_LOOKUP[version]}
          target="_blank"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Daily Layout
        </a>
      }
    />
  );
}

export function ExileFragment({ fragment }: FragmentProps) {
  switch (fragment.type) {
    case "kill":
      return EnemyComponent(fragment.value);
    case "arena":
      return AreaComponent(fragment.value, false);
    case "area": {
      const area = areas[fragment.areaId];
      return AreaComponent(area.name, area.is_town_area);
    }
    case "enter": {
      const area = areas[fragment.areaId];
      return AreaComponent(area.name, area.is_town_area);
    }
    case "quest": {
      return QuestComponent(fragment);
    }
    case "quest_text":
      return QuestTextComponent(fragment.value);
    case "waypoint":
      return WaypointComponent();
    case "waypoint_use": {
      const dstArea = areas[fragment.dstAreaId];
      const srcArea = areas[fragment.srcAreaId];
      return (
        <>
          {WaypointComponent()}
          <span> ➞ </span>
          {AreaComponent(
            dstArea.map_name || dstArea.name,
            dstArea.is_town_area
          )}
          {dstArea.act !== srcArea.act &&
            dstArea.id !== "Labyrinth_Airlock" && (
              <> - {GenericComponent(`Act ${dstArea.act}`)}</>
            )}
        </>
      );
    }
    case "waypoint_get":
      return WaypointComponent();
    case "trial":
      return TrialComponent();
    case "logout":
      return LogoutComponent(areas[fragment.areaId]);
    case "portal":
      return PortalComponent(
        fragment.dstAreaId ? areas[fragment.dstAreaId] : undefined
      );
    case "dir":
      return DirectionComponent(fragment.dirIndex);
    case "generic":
      return GenericComponent(fragment.value);
    case "reward_quest":
      return <ItemReward item={fragment.item} rewardType="quest" />;
    case "reward_vendor":
      return (
        <ItemReward
          item={fragment.item}
          cost={fragment.cost}
          rewardType="vendor"
        />
      );
    case "crafting":
      return CraftingComponent(fragment.crafting_recipes);
    case "ascend":
      return AscendComponent(fragment.version);
  }

  return <>{`unmapped: ${JSON.stringify(fragment)}`}</>;
}

interface StepProps {
  step: FragmentStep;
}

export function ExileFragmentStep({ step }: StepProps) {
  return (
    <div className={classNames(styles.fragmentStep, taskStyle)}>
      {step.parts.map((part, i) =>
        typeof part == "string" ? (
          part
        ) : (
          <ExileFragment key={i} fragment={part} />
        )
      )}
    </div>
  );
}
