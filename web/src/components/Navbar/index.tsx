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
    <div className={classNames(styles.navbar)}>
      <div className={classNames(styles.navHolder)}>
        <div
          className={classNames(styles.navItems, {
            [styles.expand]: expand,
          })}
        >
          <div
            onClick={() => navigate("/")}
            className={classNames(styles.navItem)}
          >
            Home
          </div>
          <div
            className={classNames(styles.navItem)}
            onClick={() => navigate("/build")}
          >
            Build
          </div>
        </div>
        <div
          className={classNames(styles.navIcon)}
          onClick={() => setExpand(!expand)}
        >
          <FaBars />
        </div>
      </div>
      <hr />
    </div>
  );
}
