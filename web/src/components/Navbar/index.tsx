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
        className={classNames(styles.navHolder, {
          [styles.expand]: expand,
        })}
      >
        <FaBars
          className={classNames(styles.navIcon)}
          onClick={() => setExpand(!expand)}
          display="block"
        />
        <hr
          className={classNames(styles.seperator, {
            [styles.expand]: expand,
          })}
        />
        <div
          className={classNames(styles.navItems, {
            [styles.expand]: expand,
          })}
        >
          {navBarItems.map((x) => (
            <>
              <div
                onClick={() => {
                  navigate(x.target);
                  setExpand(false);
                }}
                className={classNames(styles.navItem, {
                  [styles.expand]: expand,
                })}
              >
                {x.label}
              </div>
            </>
          ))}
        </div>
      </div>
      <hr />
    </div>
  );
}
