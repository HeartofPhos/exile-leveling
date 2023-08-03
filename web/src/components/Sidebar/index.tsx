import { buildDataSelector } from "../../state/build-data";
import { gemLinksSelector } from "../../state/gem-links";
import { searchStringsAtom } from "../../state/search-strings";
import { urlTreesSelector } from "../../state/tree/url-tree";
import { interactiveStyles } from "../../styles";
import { GemLinkViewer } from "../GemLinkViewer";
import { PassiveTreeViewer } from "../PassiveTreeViewer";
import { SearchStrings } from "../SearchStrings";
import styles from "./styles.module.css";
import classNames from "classnames";
import { useState } from "react";
import React from "react";
import { FaLink } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { TbHierarchy } from "react-icons/tb";
import { useRecoilValue } from "recoil";

export function Sidebar() {
  const buildData = useRecoilValue(buildDataSelector);
  const searchStrings = useRecoilValue(searchStringsAtom);
  const { urlTrees } = useRecoilValue(urlTreesSelector);
  const gemLinks = useRecoilValue(gemLinksSelector);
  const [expand, setExpand] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);

  const sections: { tab: React.ReactNode; content: React.ReactNode }[] = [];

  if (urlTrees.length > 0) {
    sections.push({
      tab: (
        <>
          <TbHierarchy className={classNames("inlineIcon")} />
          Tree
        </>
      ),
      content: <PassiveTreeViewer urlTrees={urlTrees} />,
    });
  }

  if (buildData.gemLinks && gemLinks.length > 0) {
    sections.push({
      tab: (
        <>
          <FaLink className={classNames("inlineIcon")} />
          Gems
        </>
      ),
      content: <GemLinkViewer gemLinks={gemLinks} />,
    });
  }

  if (searchStrings !== null && searchStrings.length > 0) {
    sections.push({
      tab: (
        <>
          <FiSearch className={classNames("inlineIcon")} />
          Search
        </>
      ),
      content: <SearchStrings values={searchStrings} />,
    });
  }

  if (sections.length === 0) return <></>;

  return (
    <div className={classNames(styles.sidebar)}>
      <div className={classNames(styles.header)}>
        {expand &&
          sections.map((v, i) => (
            <button
              key={i}
              className={classNames(
                styles.tab,
                interactiveStyles.activeSecondary
              )}
              onClick={() => {
                setActiveTab(i);
              }}
            >
              {v.tab}
            </button>
          ))}
        <button
          className={classNames(
            styles.toggle,
            interactiveStyles.activeSecondary
          )}
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {expand ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      {expand && <hr />}
      <div className={classNames(styles.contents, { [styles.expand]: expand })}>
        {React.Children.toArray(
          sections.map((v, i) => (
            <div
              className={classNames(styles.content, {
                [styles.hidden]: activeTab !== i,
              })}
            >
              {v.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
