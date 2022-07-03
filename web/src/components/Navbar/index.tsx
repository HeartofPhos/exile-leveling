import classNames from "classnames";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import styles from "./Navbar.module.css";

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const [expand, setExpand] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <div className={classNames(styles.topnav, { [styles.responsive]: expand })}>
      <a onClick={() => navigate("/")} className={classNames(styles.active)}>
        Home
      </a>
      <a onClick={() => navigate("/build")}>Build</a>
      <a className={classNames(styles.icon)} onClick={() => setExpand(!expand)}>
        <FaBars />
      </a>
    </div>
  );
}
