import classNames from "classnames";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import styles from "./Navbar.module.css";

interface NavbarItem {
  target: string;
  label: string;
}

const navBarItems: NavbarItem[] = [
  {
    target: "/",
    label: "Route",
  },
  {
    target: "/build",
    label: "Build",
  },
  {
    target: "/build",
    label: "Build",
  },
  {
    target: "/build",
    label: "Build",
  },
  {
    target: "/build",
    label: "Build",
  },
];

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const [expand, setExpand] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <div
      className={classNames(styles.navbar, {
        [styles.expand]: expand,
      })}
    >
      <div
        className={classNames(styles.navIcon)}
        onClick={() => setExpand(!expand)}
      >
        <FaBars />
      </div>
      <hr />
      <div
        className={classNames(styles.navItems, {
          [styles.expand]: expand,
        })}
      >
        {navBarItems.map((x) => (
          <>
            <div
              onClick={() => navigate(x.target)}
              className={classNames(styles.navItem)}
            >
              {x.label}
            </div>
            <hr />
          </>
        ))}
      </div>
    </div>
  );
}
