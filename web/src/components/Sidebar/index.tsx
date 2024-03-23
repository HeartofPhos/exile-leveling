import { gemLinksSelector } from "../../state/gem-links";
import { searchStringsSelector } from "../../state/search-strings";
import { urlTreesSelector } from "../../state/tree/url-tree";
import { interactiveStyles } from "../../styles";
import { GemLinkViewer } from "../GemLinkViewer";
import { SearchStrings } from "../SearchStrings";
import { SkillTreeViewer } from "../SkillTreeViewer";
import styles from "./styles.module.css";
import classNames from "classnames";
import { useMemo, useState } from "react";
import React from "react";
import { FaLink, FaListUl } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { TbHierarchy } from "react-icons/tb";
import { useRecoilValue } from "recoil";

export function Sidebar() {
  const [expand, setExpand] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(0);

  const sections = useSections();
  if (sections.length === 0) return <></>;

  return (
    <div className={classNames(styles.sidebar)}>
      <Header
        expand={expand}
        sections={sections}
        onActiveTab={setActiveTab}
        onToggleExpand={setExpand}
      />
      {expand && <hr />}
      <div
        className={classNames(styles.contents, {
          [styles.expand]: expand,
        })}
      >
        {React.Children.toArray(
          sections.map((v, i) => (
            <>
              {activeTab === -1 && i > 0 && <hr />}
              <div
                className={classNames(styles.content, {
                  [styles.hidden]: activeTab !== i && activeTab !== -1,
                })}
              >
                {v.content}
              </div>
            </>
          ))
        )}
      </div>
    </div>
  );
}

interface Section {
  tab: React.ReactNode;
  content: React.ReactNode;
}

function useSections() {
  const searchStrings = useRecoilValue(searchStringsSelector);
  const { urlTrees } = useRecoilValue(urlTreesSelector);
  const gemLinks = useRecoilValue(gemLinksSelector);

  return useMemo(() => {
    const sections: { tab: React.ReactNode; content: React.ReactNode }[] = [];

    if (urlTrees.length > 0) {
      sections.push({
        tab: (
          <>
            <TbHierarchy className={classNames("inlineIcon")} />
            Tree
          </>
        ),
        content: <SkillTreeViewer urlTrees={urlTrees} />,
      });
    }

    if (gemLinks.length > 0) {
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

    return sections;
  }, [urlTrees, gemLinks, searchStrings]);
}

interface HeaderProps {
  expand: boolean;
  sections: Section[];
  onToggleExpand: (expand: boolean) => void;
  onActiveTab: (activeTab: number) => void;
}
function Header({
  expand,
  sections,
  onToggleExpand,
  onActiveTab,
}: HeaderProps) {
  return (
    <div className={classNames(styles.header)}>
      {expand && (
        <>
          {sections.map((v, i) => (
            <button
              key={i}
              className={classNames(
                styles.tab,
                interactiveStyles.activeSecondary
              )}
              onClick={() => {
                onActiveTab(i);
              }}
            >
              {v.tab}
            </button>
          ))}
          <button
            className={classNames(
              styles.tab,
              styles.all,
              interactiveStyles.activeSecondary
            )}
            onClick={() => {
              onActiveTab(-1);
            }}
          >
            <FaListUl className={classNames("inlineIcon")} />
            All
          </button>
        </>
      )}
      <button
        className={classNames(styles.toggle, interactiveStyles.activeSecondary)}
        onClick={() => {
          onToggleExpand(!expand);
        }}
      >
        {expand ? <FiChevronRight /> : <FiChevronLeft />}
      </button>
    </div>
  );
}
