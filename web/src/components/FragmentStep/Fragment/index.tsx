import { Data } from "../../../../../common/data";
import { Fragments } from "../../../../../common/route-processing/fragment/types";
import { GameData } from "../../../../../common/types";
import { CopyToClipboard } from "../../CopyToClipboard";
import { InlineFakeBlock } from "../../InlineFakeBlock";
import { ItemReward } from "../../ItemReward";
import styles from "./styles.module.css";
import classNames from "classnames";
import React from "react";
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

function getImageUrl(path: string) {
  return new URL(`./images/${path}`, import.meta.url).href;
}

function minAreaLevel(areaLevel: number) {
  return Math.max(1, areaLevel - (3 + Math.floor(areaLevel / 16)));
}

function MinAreaLevelComponent(areaLevel: number) {
  return (
    <span className={classNames(styles.areaLevel)}>
      {minAreaLevel(areaLevel)}
      {"+"}
    </span>
  );
}

function EnemyComponent(enemy: string) {
  return <span className={classNames(styles.enemy)}>{enemy}</span>;
}

function AreaComponent(
  name: string,
  isTownArea: boolean,
  areaLevel: number | undefined
) {
  return (
    <div className={classNames(styles.noWrap)}>
      <span className={classNames(styles.area)}>{name}</span>
      {!isTownArea && areaLevel !== undefined && (
        <> {MinAreaLevelComponent(areaLevel)}</>
      )}
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

function QuestComponent(fragment: Fragments.QuestFragment) {
  const quest = Data.Quests[fragment.questId];

  const npcs = Array.from(
    new Set(
      fragment.rewardOffers
        .map((x) => quest.reward_offers[x]?.quest_npc)
        .filter((x) => x !== undefined)
    )
  );

  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("quest.png")}
        className={classNames("inlineIcon")}
        alt=""
      />
      <span className={classNames(styles.quest)}>{quest.name}</span>
      {npcs.length > 0 && (
        <> - {GenericComponent(Array.from(npcs).join(", "))}</>
      )}
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
      {GenericComponent("Logout")}
      <span> ➞ </span>
      {AreaComponent(area.name, area.is_town_area, area.level)}
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
          {AreaComponent(area.name, area.is_town_area, area.level)}
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
        {GenericComponent("Crafting: ")}
      </div>
      {GenericComponent(craftingRecipes.join(", "))}
    </span>
  );
}

const ASCEND_LOOKUP: Record<
  Fragments.AscendFragment["version"],
  { url: string; areaId: string }
> = {
  normal: { url: "https://www.poelab.com/gtgax", areaId: "1_Labyrinth_boss_3" },
  cruel: { url: "https://www.poelab.com/r8aws", areaId: "2_Labyrinth_boss_3" },
  merciless: {
    url: "https://www.poelab.com/riikv",
    areaId: "3_Labyrinth_boss_3",
  },
  eternal: {
    url: "https://www.poelab.com/wfbra",
    areaId: "EndGame_Labyrinth_boss_3",
  },
};

function AscendComponent(
  version: Fragments.AscendFragment["version"]
): [React.ReactNode, React.ReactNode] {
  const { url, areaId } = ASCEND_LOOKUP[version];
  const area = Data.Areas[areaId];
  return [
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("trial.png")}
        className={classNames("inlineIcon")}
        alt=""
      />
      <span className={classNames(styles.trial)}>Ascend</span>
      <> {MinAreaLevelComponent(area.level)}</>
    </div>,
    <a
      href={url}
      target="_blank"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      Daily Layout
    </a>,
  ];
}

export function Fragment(
  fragment: Fragments.AnyFragment
): [React.ReactNode, React.ReactNode] {
  if (typeof fragment === "string") return [<>{fragment}</>, null];

  switch (fragment.type) {
    case "kill":
      return [EnemyComponent(fragment.value), null];
    case "arena":
      return [AreaComponent(fragment.value, false, undefined), null];
    case "area": {
      const area = Data.Areas[fragment.areaId];
      return [AreaComponent(area.name, area.is_town_area, area.level), null];
    }
    case "enter": {
      const area = Data.Areas[fragment.areaId];
      return [AreaComponent(area.name, area.is_town_area, area.level), null];
    }
    case "logout":
      return [LogoutComponent(Data.Areas[fragment.areaId]), null];
    case "waypoint":
      return [WaypointComponent(), null];
    case "waypoint_use": {
      const dstArea = Data.Areas[fragment.dstAreaId];
      const srcArea = Data.Areas[fragment.srcAreaId];
      return [
        <>
          {WaypointComponent()}
          <span> ➞ </span>
          {AreaComponent(
            dstArea.map_name || dstArea.name,
            dstArea.is_town_area,
            dstArea.level
          )}
          {dstArea.act !== srcArea.act &&
            dstArea.id !== "Labyrinth_Airlock" && (
              <> - {GenericComponent(`Act ${dstArea.act}`)}</>
            )}
        </>,
        null,
      ];
    }
    case "waypoint_get":
      return [WaypointComponent(), null];
    case "portal_use":
      return [PortalComponent(Data.Areas[fragment.dstAreaId]), null];
    case "portal_set":
      return [PortalComponent(), null];
    case "quest":
      return [QuestComponent(fragment), null];
    case "quest_text":
      return [QuestTextComponent(fragment.value), null];
    case "generic":
      return [GenericComponent(fragment.value), null];
    case "reward_quest":
      return [<ItemReward item={fragment.item} rewardType="quest" />, null];
    case "reward_vendor":
      return [
        <ItemReward
          item={fragment.item}
          cost={fragment.cost}
          rewardType="vendor"
        />,
        null,
      ];
    case "trial":
      return [TrialComponent(), null];
    case "ascend":
      return AscendComponent(fragment.version);
    case "crafting":
      return [CraftingComponent(fragment.crafting_recipes), null];
    case "dir":
      return [DirectionComponent(fragment.dirIndex), null];
    case "copy":
      return [<CopyToClipboard text={fragment.text} />, null];
  }

  return [<>{`unmapped: ${JSON.stringify(fragment)}`}</>, null];
}
