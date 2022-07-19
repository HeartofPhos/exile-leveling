import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import styles from "./Navbar.module.css";
import {
  clearGemProgressCallback,
  clearRouteProgressCallback,
} from "../../utility/ExileSyncStore";

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
];

const acts = [
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
  const [navExpand, setExpand] = useState<boolean>(false);
  const navigate = useNavigate();

  const clearRouteProgress = clearRouteProgressCallback();
  const clearGemProgress = clearGemProgressCallback();
  return (
    <div
      className={classNames(styles.navbar, {
        [styles.expand]: navExpand,
      })}
    >
      <div
        className={classNames(styles.navHolder, {
          [styles.expand]: navExpand,
        })}
      >
        <FaBars
          className={classNames(styles.navIcon)}
          onClick={() => setExpand(!navExpand)}
          display="block"
        />
        <hr
          className={classNames(styles.seperator, {
            [styles.expand]: navExpand,
          })}
        />
        <div
          className={classNames(styles.navMain, styles.navItems, {
            [styles.expand]: navExpand,
          })}
        >
          {navBarItems.map((x, i) => (
            <div
              key={i}
              onClick={() => {
                navigate(x.target);
                setExpand(false);
              }}
              className={classNames(styles.navItem, styles.navElement, {
                [styles.expand]: navExpand,
              })}
            >
              {x.label}
            </div>
          ))}
          <div
            onClick={() => {
              clearRouteProgress();
              clearGemProgress();
              setExpand(false);
            }}
            className={classNames(styles.navItem, styles.navElement, {
              [styles.expand]: navExpand,
            })}
          >
            Reset Progress
          </div>
          <NavAccordion
            label="Acts"
            navExpand={navExpand}
            className={classNames(styles.navItem, {
              [styles.expand]: navExpand,
            })}
          >
            {acts.map((x, i) => (
              <div
                key={i}
                onClick={() => {
                  navigate(x.target);
                  setExpand(false);
                }}
                className={classNames(styles.navItem, styles.navElement, {
                  [styles.expand]: navExpand,
                })}
              >
                {x.label}
              </div>
            ))}
          </NavAccordion>
        </div>
      </div>
      <hr />
    </div>
  );
}

interface NavAccordionProps {
  label: string;
  navExpand: boolean;
}

function NavAccordion({
  label,
  navExpand,
  children,
  onClick,
  ...rest
}: NavAccordionProps & React.HTMLProps<HTMLDivElement>) {
  const [accordionExpand, setAccordionExpand] = useState<boolean>(false);

  useEffect(() => {
    setAccordionExpand(false);
  }, [navExpand]);

  return (
    <div
      onClick={(e) => {
        setAccordionExpand(!accordionExpand);
        if (onClick) onClick(e);
      }}
      {...rest}
    >
      <div className={classNames(styles.navElement)}>{label}</div>
      <hr
        className={classNames(styles.seperator, {
          [styles.expand]: accordionExpand,
        })}
      />
      <div
        className={classNames(styles.navAccordion, styles.navItems, {
          [styles.expand]: accordionExpand,
        })}
      >
        {children}
      </div>
    </div>
  );
}
