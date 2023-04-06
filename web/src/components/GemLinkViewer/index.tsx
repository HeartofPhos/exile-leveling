import { MdCircle } from "react-icons/md";
import { gemColours, gems } from "../../../../common/data";
import { RouteData } from "../../../../common/route-processing/types";
import { formStyles } from "../Form";
import styles from "./styles.module.css";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface GemLinkViewerProps {
  gemLinks: RouteData.GemLink[];
}

export function GemLinkViewer({ gemLinks }: GemLinkViewerProps) {
  const findUniqueGemTitles = (links: RouteData.GemLink[]): string[] => {
    const linkTitles = new Set<string>();
    links.forEach(link => {
      if (typeof link.title === 'string') {
        linkTitles.add(link.title);
      }
    })
    return [...linkTitles];
  }
  const [curIndex, setCurIndex] = useState<number>(0);
  const [gemSections, setGemSections] = useState<string[]>(findUniqueGemTitles(gemLinks))


  useEffect(() => {
    setCurIndex(0); // Prevent out-of-bounds issues if the gem links change from a new build import
    setGemSections(findUniqueGemTitles(gemLinks));
  }, [gemLinks])

  const activeGemLinks: RouteData.GemLink[] = gemLinks.filter(link => link.title === gemSections[curIndex]);
  return (
    <div className={classNames(styles.gemLinks)}>
      <label className={classNames(styles.label)}>
        {gemSections.length > 0 && (gemSections[curIndex] || "Default")}
      </label>
      {activeGemLinks.length > 0 && (
        <div className={classNames(styles.gemLinkSection)}>
          {activeGemLinks.map(({ gems: activeGems }) => {
            const sortedGems = activeGems.map(gem => ({ ...gem, isSkillGem: gem.id.includes('SkillGem') })).sort((gem1, gem2) => {
              return (gem2.isSkillGem ? 1 : 0) - (gem1.isSkillGem ? 1 : 0);
            })
            return (
              <div className={classNames(styles.gemLinkRow)}>
                {sortedGems.map((gem) => {
                  const gemData = gems[gem.id];
                  return (
                    <div className={gem.isSkillGem ? styles.skillGem : styles.supportGem} key={gem.uid}>
                      <MdCircle
                        color={gemColours[gemData.primary_attribute]}
                        className={classNames("inlineIcon")}
                      />
                      <span>{gemData.name}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
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
    </div>
  );
}
