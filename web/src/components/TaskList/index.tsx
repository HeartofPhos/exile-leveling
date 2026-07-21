import { useAtom } from "jotai";
import { borderListStyles, interactiveStyles } from "../../styles";
import styles from "./styles.module.css";
import classNames from "classnames";
import type { WritableAtom } from "jotai";
import { FaRegCircle, FaRegPlayCircle } from "react-icons/fa";
import { edgeId, nextEdgeAtom } from "../../state/route";

interface TaskItemProps {
  edgeIndex: number | null;
  isCompletedState?: WritableAtom<boolean, [boolean], void>;
  children?: React.ReactNode;
}

function TaskListItem({
  edgeIndex,
  isCompletedState,
  children,
}: TaskItemProps) {
  const [isCompleted, setIsCompleted] = isCompletedState
    ? useAtom(isCompletedState)
    : [undefined, undefined];

  const [nextEdge, setNextEdge] = useAtom(nextEdgeAtom(edgeIndex));

  return (
    <li
      id={edgeIndex !== null ? edgeId(edgeIndex) : undefined}
      tabIndex={0}
      className={classNames(
        styles.listItem,
        borderListStyles.item,
        interactiveStyles.hoverPrimary,
        {
          [styles.completed]: isCompleted,
        },
      )}
      onClick={() => {
        if (setIsCompleted) setIsCompleted(!isCompleted);
      }}
    >
      <div className={classNames(styles.listItemInner)}>
        {
          <span
            aria-hidden
            className={classNames(styles.edgeTag)}
            onClick={(ev) => {
              setNextEdge();
              ev.stopPropagation();
            }}
          >
            <>
              {nextEdge !== null && nextEdge && (
                <FaRegPlayCircle size={"100%"} />
              )}
              {nextEdge !== null && !nextEdge && <FaRegCircle size={"100%"} />}
            </>
          </span>
        }
        {children}
      </div>
    </li>
  );
}

export interface TaskListProps {
  items?: TaskItemProps[];
}

export function TaskList({ items }: TaskListProps) {
  return (
    <ol className={classNames(styles.list)}>
      {items &&
        items.map(({ children, ...rest }, i) => (
          <TaskListItem key={i} {...rest}>
            <span aria-hidden className={classNames(styles.bullet)}>
              {`${i + 1}`.padStart(2, "0")}.
            </span>
            <div className={classNames(styles.task)}>{children}</div>
          </TaskListItem>
        ))}
    </ol>
  );
}
