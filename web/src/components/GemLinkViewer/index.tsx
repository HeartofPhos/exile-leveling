import { Data } from "../../../../common/data";
import { RouteData } from "../../../../common/route-processing/types";
import { formStyles } from "../../styles";
import styles from "./styles.module.css";
import classNames from "classnames";
import React from "react";
import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { MdCircle } from "react-icons/md";

interface GemLinkViewerProps {
  gemLinks: RouteData.GemLink[];
}

export function GemLinkViewer({ gemLinks }: GemLinkViewerProps) {
  const findUniqueGemTitles = (links: RouteData.GemLink[]): string[] => {
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

  useEffect(() => {
    setCurIndex(0); // Prevent out-of-bounds issues if the gem links change from a new build import
    setGemSections(findUniqueGemTitles(gemLinks));
  }, [gemLinks]);

  const activeGemLinks: RouteData.GemLink[] = gemLinks.filter(
    (link) => link.title === gemSections[curIndex]
  );
  return (
    <div className={classNames(styles.gemLinks)}>
      <label className={classNames(styles.label)}>
        {gemSections.length > 0 && (gemSections[curIndex] || "Default")}
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
            activeGemLinks.map(({ primaryGemIds, secondaryGemIds }, i) => (
              <>
                {i !== 0 && <hr />}
                <div className={classNames(styles.gemLinkRow)}>
                  {React.Children.toArray(
                    primaryGemIds.map((gemId) => {
                      const gemData = Data.Gems[gemId];
                      return (
                        <div className={styles.gemPrimary}>
                          <MdCircle
                            color={Data.GemColours[gemData.primary_attribute]}
                            className={classNames("inlineIcon")}
                          />
                          <span>{gemData.name}</span>
                        </div>
                      );
                    })
                  )}
                  {React.Children.toArray(
                    secondaryGemIds.map((gemId) => {
                      const gemData = Data.Gems[gemId];
                      return (
                        <div className={styles.gemSecondary}>
                          <MdCircle
                            color={Data.GemColours[gemData.primary_attribute]}
                            className={classNames("inlineIcon")}
                          />
                          <span>{gemData.name}</span>
                        </div>
                      );
                    })
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
