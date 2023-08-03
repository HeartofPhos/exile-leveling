import { buildDataSelector } from "../../state/build-data";
import { gemLinksSelector } from "../../state/gem-links";
import { searchStringsAtom } from "../../state/search-strings";
import { urlTreesSelector } from "../../state/tree/url-tree";
import { GemLinkViewer } from "../GemLinkViewer";
import { PassiveTreeViewer } from "../PassiveTreeViewer";
import { SearchString } from "../SearchStrings";
import styles from "./styles.module.css";
import classNames from "classnames";
import { useState } from "react";
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRecoilValue } from "recoil";

export function Sidebar() {
  const buildData = useRecoilValue(buildDataSelector);
  const searchStrings = useRecoilValue(searchStringsAtom);
  const { urlTrees } = useRecoilValue(urlTreesSelector);
  const gemLinks = useRecoilValue(gemLinksSelector);
  const [expand, setExpand] = useState(true);

  const children = [];
  if (urlTrees.length > 0) {
    children.push(
      <>
        <hr />
        <PassiveTreeViewer urlTrees={urlTrees} />
      </>
    );
  }

  if (searchStrings !== null && searchStrings.length > 0) {
    children.push(
      <>
        <hr />
        <div className={classNames(styles.searchStrings)}>
          {searchStrings.map((x, i) => (
            <SearchString key={i} value={x} />
          ))}
        </div>
      </>
    );
  }

  if (buildData.gemLinks && gemLinks.length > 0) {
    children.push(
      <>
        <hr />
        <GemLinkViewer gemLinks={gemLinks} />
      </>
    );
  }

  if (children.length === 0) return <></>;

  // tab selector
  // if tab == tree { tree }
  // if tab == search { search-strings }
  // if tab == links { links }

  return (
    <div className={classNames(styles.sidebar)}>
      <div>
        <button
          className={classNames(styles.sidebarToggle)}
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {expand && <span>Sidebar</span>}
          {expand ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      <div
        className={classNames(styles.sidebarContents, {
          [styles.expand]: expand,
        })}
      >
        {React.Children.toArray(children)}
      </div>
    </div>
  );
}
