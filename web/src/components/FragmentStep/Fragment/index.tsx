import { Data } from "../../../../../common/data";
import { Fragments } from "../../../../../common/route-processing/fragment/types";
import { GameData } from "../../../../../common/types";
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
import { FaRegClipboard } from "react-icons/fa";
import { toast } from "react-toastify";

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

function CopyComponent(text: string) {
  return (
    <span
      className={classNames(styles.copy)}
      onClick={(e) => {
        navigator.clipboard.writeText(text);
        toast.success(
          <div>
            Copied to Clipboard
            <br />
            {text}
          </div>
        );
        e.stopPropagation();
      }}
    >
      <FaRegClipboard className={classNames("inlineIcon")} />
    </span>
  );
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

const GUIDE_URL_LOOKUP: Record<string, string> = {
  normal: "https://www.poelab.com/gtgax",
  cruel: "https://www.poelab.com/r8aws",
  merciless: "https://www.poelab.com/riikv",
  eternal: "https://www.poelab.com/wfbra",
};

function AscendComponent(version: string): [React.ReactNode, React.ReactNode] {
  return [
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("trial.png")}
        className={classNames("inlineIcon")}
        alt=""
      />
      <span className={classNames(styles.trial)}>Ascend</span>
    </div>,
    <a
      href={GUIDE_URL_LOOKUP[version]}
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
      return [AreaComponent(fragment.value, false), null];
    case "area": {
      const area = Data.Areas[fragment.areaId];
      return [AreaComponent(area.name, area.is_town_area), null];
    }
    case "enter": {
      const area = Data.Areas[fragment.areaId];
      return [AreaComponent(area.name, area.is_town_area), null];
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
            dstArea.is_town_area
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
      return [CopyComponent(fragment.text), null];
  }

  return [<>{`unmapped: ${JSON.stringify(fragment)}`}</>, null];
}
