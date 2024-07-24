import { Data } from "../../../../common/data";
import { RouteData } from "../../../../common/route-processing/types";
import { GameData } from "../../../../common/types";
import { formStyles } from "../../styles";
import { GemCost } from "../GemCost";
import { InlineFakeBlock } from "../InlineFakeBlock";
import { SidebarTooltip } from "../SidebarTooltip";
import styles from "./styles.module.css";
import classNames from "classnames";
import React from "react";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { MdCircle } from "react-icons/md";

interface GemLinkViewerProps {
  gemLinks: RouteData.GemLinkGroup[];
}

export function GemLinkViewer({ gemLinks }: GemLinkViewerProps) {
  const findUniqueGemTitles = (links: RouteData.GemLinkGroup[]): string[] => {
    const linkTitles = new Set<string>();
    for (const link of links) {
      linkTitles.add(link.title);
    }
    return [...linkTitles];
  };
  const [curIndex, setCurIndex] = useState<number>(0);
  const [gemSections, setGemSections] = useState<string[]>(
    findUniqueGemTitles(gemLinks)
  );
  const [tooltipGemLink, setTooltipGemLink] =
    useState<RouteData.GemLink | null>(null);

  useEffect(() => {
    setCurIndex(0); // Prevent out-of-bounds issues if the gem links change from a new build import
    setGemSections(findUniqueGemTitles(gemLinks));
  }, [gemLinks]);

  const activeGemLinks: RouteData.GemLinkGroup[] = gemLinks.filter(
    (link) => link.title === gemSections[curIndex]
  );
  return (
    <div className={classNames(styles.gemLinks)}>
      {tooltipGemLink && <GemTooltip gemLink={tooltipGemLink} />}
      <label className={classNames(styles.label)}>
        {gemSections.length > 0 && gemSections[curIndex]}
      </label>
      <div className={classNames(styles.buttons)}>
        <button
          className={classNames(formStyles.formButton, styles.button)}
          onClick={() => {
            if (curIndex > 0) setCurIndex(curIndex - 1);
          }}
        >
          <HiChevronLeft />
        </button>
        <button
          className={classNames(formStyles.formButton, styles.button)}
          onClick={() => {
            if (curIndex < gemSections.length - 1) setCurIndex(curIndex + 1);
          }}
        >
          <HiChevronRight />
        </button>
      </div>
      {activeGemLinks.length > 0 && (
        <div className={classNames(styles.gemLinkSection)}>
          {React.Children.toArray(
            activeGemLinks.map(({ primaryGems, secondaryGems }, i) => (
              <>
                {i !== 0 && <hr />}
                <div className={classNames(styles.gemLinkRow)}>
                  {React.Children.toArray(
                    primaryGems.map((gem) => (
                      <GemLink
                        gemLink={gem}
                        isPrimary={true}
                        onTooltip={setTooltipGemLink}
                      />
                    ))
                  )}
                  {React.Children.toArray(
                    secondaryGems.map((gem) => (
                      <GemLink
                        gemLink={gem}
                        isPrimary={false}
                        onTooltip={setTooltipGemLink}
                      />
                    ))
                  )}
                </div>
              </>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface GemLinkProps {
  gemLink: RouteData.GemLink;
  isPrimary: boolean;
  onTooltip: (gemlink: RouteData.GemLink | null) => void;
}

function GemLink({ gemLink, isPrimary, onTooltip }: GemLinkProps) {
  const gem = Data.Gems[gemLink.id];
  return (
    <div
      className={isPrimary ? styles.gemPrimary : styles.gemSecondary}
      onPointerEnter={() => {
        onTooltip(gemLink);
      }}
      onPointerLeave={() => {
        onTooltip(null);
      }}
    >
      <MdCircle
        color={Data.GemColours[gem.primary_attribute]}
        className={classNames("inlineIcon")}
      />
      <span>{gem.name}</span>
    </div>
  );
}

interface GemTooltipProps {
  gemLink: RouteData.GemLink;
}

function GemTooltip({ gemLink }: GemTooltipProps) {
  const gem = Data.Gems[gemLink.id];

  return (
    <SidebarTooltip
      title={
        <div className={classNames(styles.gemLinkTitleInfo)}>
          <span>
            <MdCircle
              color={Data.GemColours[gem.primary_attribute]}
              className={classNames("inlineIcon")}
            />
            {gem.name}
          </span>
          <InlineFakeBlock child={<GemCost gem={gem} />} />
        </div>
      }
    >
      <div className={classNames(styles.gemLinkQuestInfo)}>
        {gemLink.quests.flatMap<JSX.Element>((x, i) => {
          const quest = Data.Quests[x.questId];
          const npc = quest.reward_offers[x.rewardOfferId]?.vendor[gem.id]?.npc;
          const text = (
            <>
              {i !== 0 && <hr className={classNames(styles.questSeperator)} />}
              <span>{quest.name}</span>
              <span>{npc}</span>
              <span>Act {quest.act}</span>
            </>
          );
          return text;
        })}
      </div>
    </SidebarTooltip>
  );
}
