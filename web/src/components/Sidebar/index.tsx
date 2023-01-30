import classNames from "classnames";
import { useState } from "react";
import { FaRegClipboard } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import { searchStringsAtom } from "../../state/search-strings";
import { PassiveTreeViewer } from "../PassiveTreeViewer";
import styles from "./styles.module.css";

export function Sidebar() {
  const searchStrings = useRecoilValue(searchStringsAtom);
  const [expand, setExpand] = useState(true);

  const expandIcon = expand ? <FiChevronRight /> : <FiChevronLeft />;

  return (
    <div
      className={classNames(styles.sidebar, {
        [styles.expand]: expand,
      })}
    >
      <div
        className={classNames(styles.sidebarToggle)}
        onClick={() => {
          setExpand(!expand);
        }}
      >
        {expand && <span>Sidebar</span>}
        {expandIcon}
      </div>
      <div
        className={classNames(styles.sidebarContents, {
          [styles.expand]: expand,
        })}
      >
        <hr />
        <PassiveTreeViewer />
        {searchStrings !== null && searchStrings.length > 0 && (
          <>
            <span>Search Strings</span>
            <hr />
            <div className={classNames(styles.sidebarItems)}>
              {searchStrings.map((x, i) => (
                <SearchString key={i} value={x} />
              ))}
            </div>
          </>
        )}
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
      className={classNames("borderListItem", styles.searchString)}
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
