import { RouteData } from "../../../../../common/route-processing/types";
import { borderListStyles } from "../../BorderList";
import styles from "./styles.module.css";
import classNames from "classnames";

interface FileListProps {
  routeFiles: RouteData.RouteFile[];
  selectedIndex: number;
  isDirty: (routeFile: RouteData.RouteFile, index: number) => boolean;
  onSelect: (index: number) => void;
}

export function FileList({
  routeFiles,
  selectedIndex,
  isDirty,
  onSelect,
}: FileListProps) {
  return (
    <div className={classNames(styles.fileList)}>
      {routeFiles.map((workingFile, i) => (
        <div
          key={i}
          className={classNames(
            borderListStyles.itemRound,
            styles.fileListItem,
            {
              [styles.selected]: selectedIndex === i,
            }
          )}
          onClick={() => {
            onSelect(i);
          }}
        >
          {workingFile.name}
          {isDirty(workingFile, i) && "*"}
        </div>
      ))}
    </div>
  );
}
