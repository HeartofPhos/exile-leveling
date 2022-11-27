import classNames from "classnames";
import { useState } from "react";
import { FaRegClipboard } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import { buildDataSelector } from "../../utility/state/build-data-state";

import styles from "./Sidebar.module.css";

export function Sidebar() {
  const buildData = useRecoilValue(buildDataSelector);
  const [expanded, setExpanded] = useState(true);

  if (buildData == null || buildData.vendorStrings.length == 0) return <></>;

  const expandIcon = expanded ? <FiChevronRight /> : <FiChevronLeft />;

  return (
    <div
      className={classNames(styles.sidebar, {
        [styles.expand]: expanded,
      })}
    >
      <div
        className={classNames(styles.sidebarToggle)}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {expanded && <span>Vendor Strings</span>}
        {expandIcon}
      </div>
      {expanded && (
        <div className={classNames(styles.sidebarItems)}>
          {buildData.vendorStrings.map((x) => (
            <VendorString value={x} />
          ))}
        </div>
      )}
    </div>
  );
}

interface VendorStringProps {
  value: string;
}
function VendorString({ value }: VendorStringProps) {
  return (
    <div
      className={classNames(styles.vendorString)}
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
