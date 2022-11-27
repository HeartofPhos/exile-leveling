import classNames from "classnames";
import { FaRegClipboard } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { buildDataSelector } from "../../utility/state/build-data-state";

import styles from "./Sidebar.module.css";

export function Sidebar() {
  const buildData = useRecoilValue(buildDataSelector);

  return (
    <div className={classNames(styles.sidebar)}>
      {buildData?.vendorStrings.map((x) => (
        <>
          <span
            onClick={() => {
              navigator.clipboard.writeText(x);
            }}
          >
            <FaRegClipboard className={classNames("inlineIcon")} /> {x}
          </span>
          <hr />
        </>
      ))}
    </div>
  );
}
