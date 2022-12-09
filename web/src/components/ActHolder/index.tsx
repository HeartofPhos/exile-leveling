import classNames from "classnames";
import { ChangeEvent, useLayoutEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { TaskItemProps, TaskList } from "../TaskList";
import styles from "./ActHolder.module.css";
import { setPersistent } from "../../utility";


interface ActHolderProps {
  act: number;
  items: TaskItemProps[];
}

function getImageUrl(path: string) {
  return new URL(`./images/${path}`, import.meta.url).href;
}

export function ActHolder({ act, items: taskItems }: ActHolderProps) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const [file, setFile] = useState(getImageUrl('../images/Tree.png'));

  const id = `act-${act}`;
  const scrollToAct = () => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "auto", block: "nearest" });
  };

  const actMapImage = getImageUrl(`Waypoint_map_act_${act}.webp`);

  useLayoutEffect(() => {
    // scrollToAct after sticky positioning is applied
    if (!expanded) scrollToAct();
  }, [expanded]);

  const expandIcon = expanded ? <FiChevronUp /> : <FiChevronDown />;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files);
    const customImages: FileList | null = e.target.files ??= null;
    if (!customImages || customImages.length === 0) return;
    const reader = new FileReader();
    setPersistent(`Waypoint_map_act_${act}`, customImages[0].name);
    reader.onload = (e) => {
      setFile(URL.createObjectURL(customImages[0]));
    };
    reader.readAsDataURL(customImages[0]);
  }

  return (
    <div id={id}>
      <div className={classNames(styles.actbar)}>
        <div
          className={classNames("header", styles.actbarHeader)}
          onClick={() => {
            const updatedExpanded = !expanded;
            setExpanded(updatedExpanded);

            // scrollToAct before sticky positioning is applied
            if (updatedExpanded) scrollToAct();
          }}
        >
          {expandIcon}
          <div>{`--== Act ${act} ==--`}</div>
          {expandIcon}
        </div>
        <hr />
      </div>
      {expanded && (
        <div className={classNames(styles.actHolder)} 
        style={{
          display: location.pathname === '/quick-view' ? 'grid' : 'block'
        }}>
          <TaskList items={taskItems} />
          
          <div className={classNames(styles.compactHolder)}>
          {location.pathname === '/quick-view' && (
            <div>
              <img className={classNames(styles.actMapImage)} src={`${actMapImage}`} />
              <div className={classNames(styles.customImageContainer)}>
                <label className={classNames(styles.fileInputLabel)}>
                   Upload an image of your passive tree for Act {act}
                </label> 
                <div className={classNames(styles.fileInput)}>
                  <input type="file" onChange={handleChange}/>
                </div>
                  <img className={classNames(styles.customImage)} src={file} />
              </div>
              </div>
            )}
            </div>
        </div>
      )}
    </div>
  );
}
