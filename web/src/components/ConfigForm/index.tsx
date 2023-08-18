import { RouteData } from "../../../../common/route-processing/types";
import { Config } from "../../state/config";
import { gemProgressSelectorFamily } from "../../state/gem-progress";
import { GemOrder } from "../GemOrder";
import { SplitRow } from "../SplitRow";
import { TaskList, TaskListProps } from "../TaskList";
import styles from "./styles.module.css";
import classNames from "classnames";

interface ConfigFormProps {
  config: Config;
  onSubmit: (config: Config) => void;
}

export function ConfigForm({ config, onSubmit }: ConfigFormProps) {
  return (
    <div className={classNames(styles.form)}>
      <SplitRow
        left={<div className={classNames(styles.label)}>Gems Only</div>}
        right={
          <div className={classNames(styles.value)}>
            <input
              type="checkbox"
              checked={config.gemsOnly}
              onChange={(evt) => {
                onSubmit({
                  ...config,
                  gemsOnly: evt.target.checked,
                });
              }}
              aria-label="Gems Only"
            />
          </div>
        }
      />
      <SplitRow
        left={<div className={classNames(styles.label)}>Show All Hints</div>}
        right={
          <div className={classNames(styles.value)}>
            <input
              type="checkbox"
              checked={config.showSubsteps}
              onChange={(evt) => {
                onSubmit({
                  ...config,
                  showSubsteps: evt.target.checked,
                });
              }}
              aria-label="Show Hints"
            />
          </div>
        }
      />
    </div>
  );
}
