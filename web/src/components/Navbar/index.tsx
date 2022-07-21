import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaGithub, FaMap, FaTools, FaUndoAlt } from "react-icons/fa";
import styles from "./Navbar.module.css";
import {
  useClearGemProgress,
  useClearRouteProgress,
} from "../../utility/ExileSyncStore";

interface NavbarItemProps {
  label: string;
  icon?: React.ReactNode;
  expand: boolean;
  onClick: () => void;
}

function NavbarItem({ label, expand, icon, onClick }: NavbarItemProps) {
  return (
    <div
      onClick={onClick}
      className={classNames(styles.navItem, styles.navElement, {
        [styles.expand]: expand,
      })}
    >
      {icon} {label}
    </div>
  );
}

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const [navExpand, setNavExpand] = useState<boolean>(false);
  const navigate = useNavigate();

  const clearRouteProgress = useClearRouteProgress();
  const clearGemProgress = useClearGemProgress();

  const acts = [];
  for (let i = 1; i <= 10; i++) {
    acts.push(
      <NavbarItem
        key={i}
        label={`Act ${i}`}
        expand={navExpand}
        onClick={() => {
          navigate(`/#act-${i}`);
          setNavExpand(false);
        }}
      />
    );
  }

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
          onClick={() => setNavExpand(!navExpand)}
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
          <NavbarItem
            label="Route"
            expand={navExpand}
            icon={<FaMap className={classNames("inlineIcon")} />}
            onClick={() => {
              navigate("/");
              setNavExpand(false);
            }}
          />
          <NavbarItem
            label="Build"
            expand={navExpand}
            icon={<FaTools className={classNames("inlineIcon")} />}
            onClick={() => {
              navigate("/build");
              setNavExpand(false);
            }}
          />
          <NavAccordion
            label="Acts"
            navExpand={navExpand}
            className={classNames(styles.navItem, {
              [styles.expand]: navExpand,
            })}
          >
            {acts}
          </NavAccordion>
          <NavbarItem
            label="Reset Progress"
            expand={navExpand}
            icon={<FaUndoAlt className={classNames("inlineIcon")} />}
            onClick={() => {
              clearRouteProgress();
              clearGemProgress();
              setNavExpand(false);
            }}
          />
          <NavbarItem
            label="Project on Github"
            expand={navExpand}
            icon={<FaGithub className={classNames("inlineIcon")} />}
            onClick={() => {
              window
                .open("https://github.com/HeartofPhos/exile-leveling", "_blank")
                ?.focus();
              setNavExpand(false);
            }}
          />
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
