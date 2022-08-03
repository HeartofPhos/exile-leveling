import classNames from "classnames";
import { MdCircle } from "react-icons/md";
import { RequiredGem } from "../../../../common/routes";
import styles from "./GemReward.module.css";
import { gems, gemColours } from "../../../../common/data";
import { InlineFakeBlock } from "../InlineFakeBlock";
import { taskStyle } from "../TaskList";
import { SplitRow } from "../SplitRow";

function getImageUrl(path: string) {
  return new URL(`./images/${path}`, import.meta.url).href;
}

function GemRewardVerb(type: GemRewardProps["type"]) {
  switch (type) {
    case "quest":
      return <span>Take </span>;
    case "vendor":
      return <span>Buy </span>;
    default:
      return <></>;
  }
}

interface GemRewardProps {
  requiredGem: RequiredGem;
  type?: "quest" | "vendor";
}

export function GemReward({ requiredGem, type }: GemRewardProps) {
  const gem = gems[requiredGem.id];

  if (!gem)
    return (
      <div className={classNames(styles.gemError)}>
        This is awkward, <b>{requiredGem.id}</b> doesn't seem to exist
      </div>
    );

  return (
    <SplitRow
      className={classNames(taskStyle)}
      left={
        <>
          <MdCircle
            color={gemColours[gem.primary_attribute]}
            className={classNames("inlineIcon")}
          />
          {GemRewardVerb(type)}
          <span className={classNames(styles.default)}>{gem.name}</span>
          {type === "vendor" && (
            <div className={classNames(styles.noWrap)}>
              <span> for </span>
              <InlineFakeBlock
                child={<img src={getImageUrl(`${gem.cost}.png`)} alt="" />}
              />
            </div>
          )}
        </>
      }
      right={
        <div className={classNames(styles.rewardNote)}>{requiredGem.note}</div>
      }
    />
  );
}
