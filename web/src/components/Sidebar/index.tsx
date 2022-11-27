import classNames from "classnames";
import { useState } from "react";
import { FaRegClipboard } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import { vendorStringsAtom } from "../../utility/state/vendor-strings";

import styles from "./Sidebar.module.css";

export function Sidebar() {
  const vendorStrings = useRecoilValue(vendorStringsAtom);
  const [expanded, setExpanded] = useState(true);

  if (vendorStrings == null || vendorStrings.length == 0) return <></>;

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
        <>
          <hr />
          <div className={classNames(styles.sidebarItems)}>
            {vendorStrings.map((x, i) => (
              <VendorString key={i} value={x} />
            ))}
          </div>
        </>
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
      className={classNames("borderListItem", styles.vendorString)}
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
