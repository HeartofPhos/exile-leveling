import { searchStringsAtom } from "../../state/search-strings";
import { gemLinksSelector } from "../../state/gem-links";
import { urlTreesSelector } from "../../state/tree/url-tree";
import { borderListStyles } from "../BorderList";
import { PassiveTreeViewer } from "../PassiveTreeViewer";
import styles from "./styles.module.css";
import classNames from "classnames";
import { useState } from "react";
import React from "react";
import { FaRegClipboard } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRecoilValue } from "recoil";

export function Sidebar() {
  const searchStrings = useRecoilValue(searchStringsAtom);
  const { urlTrees } = useRecoilValue(urlTreesSelector);
  const gemLinks = useRecoilValue(gemLinksSelector);
  const [expand, setExpand] = useState(true);

  const children = [];
  if (urlTrees.length > 0) {
    children.push(
      <>
        <hr />
        <PassiveTreeViewer urlTrees={urlTrees} gemLinks={gemLinks} />
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

  if (children.length === 0) return <></>;

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

interface SearchStringProps {
  value: string;
}

function SearchString({ value }: SearchStringProps) {
  return (
    <div
      className={classNames(borderListStyles.itemRound, styles.searchString)}
      onClick={() => {
        navigator.clipboard.writeText(value);
      }}
    >
      <div>
        <FaRegClipboard className={classNames("inlineIcon")} />
      </div>
      {value}
    </div>
  );
}
