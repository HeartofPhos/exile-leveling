import { Data } from "../../../../common/data";
import { RouteData } from "../../../../common/route-processing/types";
import { InlineFakeBlock } from "../InlineFakeBlock";
import { SplitRow } from "../SplitRow";
import styles from "./styles.module.css";
import classNames from "classnames";
import { MdCircle } from "react-icons/md";

function getImageUrl(path: string) {
  return new URL(`./images/${path}`, import.meta.url).href;
}

function ItemRewardVerb(type: ItemRewardProps["rewardType"]) {
  switch (type) {
    case "quest":
      return <span>Take </span>;
    case "vendor":
      return <span>Buy </span>;
    default:
      return <></>;
  }
}

interface ItemRewardProps {
  item: string;
  rewardType?: "quest" | "vendor";
  cost?: string;
}

export function ItemReward({ item, cost, rewardType }: ItemRewardProps) {
  return (
    <>
      {ItemRewardVerb(rewardType)}
      <span className={classNames(styles.default)}>{item}</span>
      {rewardType === "vendor" && cost !== undefined && (
        <div className={classNames(styles.noWrap)}>
          <span> for </span>
          <InlineFakeBlock
            child={<img src={getImageUrl(`${cost}.png`)} alt="" />}
          />
        </div>
      )}
    </>
  );
}

interface GemRewardProps {
  requiredGem: RouteData.RequiredGem;
  rewardType?: ItemRewardProps["rewardType"];
}

export function GemReward({ requiredGem, rewardType }: GemRewardProps) {
  const gem = Data.Gems[requiredGem.id];

  if (!gem)
    return (
      <div className={classNames(styles.gemError)}>
        This is awkward, <b>{requiredGem.id}</b> doesn't seem to exist
      </div>
    );

  return (
    <SplitRow
      left={
        <>
          <MdCircle
            color={Data.GemColours[gem.primary_attribute]}
            className={classNames("inlineIcon")}
          />
          <ItemReward item={gem.name} cost={gem.cost} rewardType={rewardType} />
        </>
      }
      right={
        <div className={classNames(styles.rewardNote)}>{requiredGem.note}</div>
      }
    />
  );
}
