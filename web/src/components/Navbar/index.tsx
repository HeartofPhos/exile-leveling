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
    target: "/#act-1",
    label: "Act 1",
  },
  {
    target: "/#act-2",
    label: "Act 2",
  },
  {
    target: "/#act-3",
    label: "Act 3",
  },
  {
    target: "/#act-4",
    label: "Act 4",
  },
  {
    target: "/#act-5",
    label: "Act 5",
  },
  {
    target: "/#act-6",
    label: "Act 6",
  },
  {
    target: "/#act-7",
    label: "Act 7",
  },
  {
    target: "/#act-8",
    label: "Act 8",
  },
  {
    target: "/#act-9",
    label: "Act 9",
  },
  {
    target: "/#act-10",
    label: "Act 10",
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
