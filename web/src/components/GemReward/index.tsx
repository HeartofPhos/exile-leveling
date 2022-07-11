import classNames from "classnames";
import { MdCircle } from "react-icons/md";
import { RequiredGem } from "../../../../common/routes";
import styles from "./GemReward.module.css";

import { gems, gemColours } from "../../../../common/data";
import { InlineFakeBlock } from "../InlineFakeBlock";

function getImageUrl(path: string) {
  return new URL(`./images/${path}`, import.meta.url).href;
}

type GemRewardType = "gem" | "vendor" | "quest";

function GemRewardVerb(type: GemRewardType) {
  switch (type) {
    case "gem":
      return <></>;
    case "quest":
      return <span>Take </span>;
    case "vendor":
      return <span>Buy </span>;
  }
}

interface GemRewardProps {
  requiredGem: RequiredGem;
  type: GemRewardType;
}

export function GemReward({ requiredGem, type }: GemRewardProps) {
  const gem = gems[requiredGem.id];
  return (
    <div className={classNames(styles.rewardHolder)}>
      <div className={classNames(styles.rewardMain)}>
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
              child={<img src={getImageUrl(`${gem.cost}.png`)} />}
            />
          </div>
        )}
      </div>
      <div className={classNames(styles.rewardNote)}>{requiredGem.note}</div>
    </div>
  );
}
