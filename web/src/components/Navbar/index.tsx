import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaGithub,
  FaMap,
  FaRegClipboard,
  FaTools,
  FaUndoAlt,
} from "react-icons/fa";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { buildRouteSelector } from "../../state";
import { routeFilesSelector, useClearRouteProgress } from "../../state/route";
import { useClearGemProgress } from "../../state/gem-progress";

import styles from "./Navbar.module.css";

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
        ["borderListItem"]: expand,
      })}
    >
      {icon}
      {label}
    </div>
  );
}

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const [navExpand, setNavExpand] = useState<boolean>(false);
  const navigate = useNavigate();

  const clipboardRoute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const route = await snapshot.getPromise(buildRouteSelector);
        navigator.clipboard.writeText(JSON.stringify(route));
      },
    []
  );
  const clearRouteProgress = useClearRouteProgress();
  const clearGemProgress = useClearGemProgress();

  const routeFiles = useRecoilValue(routeFilesSelector);

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
        <div
          className={classNames(styles.navMain, {
            [styles.expand]: navExpand,
          })}
        >
          <div
            className={classNames(styles.navItems, {
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
            <NavAccordion label="Sections" navExpand={navExpand}>
              {routeFiles.map((x, i) => (
                <NavbarItem
                  key={i}
                  label={x.name}
                  expand={navExpand}
                  onClick={() => {
                    navigate(`/#section-${x.name.replace(/\s+/g, "_")}`);
                    setNavExpand(false);
                  }}
                />
              ))}
            </NavAccordion>
            <NavbarItem
              label={`Edit Route`}
              expand={navExpand}
              icon={<FaTools className={classNames("inlineIcon")} />}
              onClick={() => {
                navigate(`/edit-route`);
                setNavExpand(false);
              }}
            />
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
              label="Export Route"
              expand={navExpand}
              icon={<FaRegClipboard className={classNames("inlineIcon")} />}
              onClick={() => {
                clipboardRoute();
                setNavExpand(false);
              }}
            />
            <NavbarItem
              label="Project on Github"
              expand={navExpand}
              icon={<FaGithub className={classNames("inlineIcon")} />}
              onClick={() => {
                window
                  .open(
                    "https://github.com/HeartofPhos/exile-leveling",
                    "_blank"
                  )
                  ?.focus();
                setNavExpand(false);
              }}
            />
          </div>
          {navExpand && <hr />}
        </div>
        <FaBars
          className={classNames(styles.navIcon)}
          onClick={() => setNavExpand(!navExpand)}
          display="block"
        />
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
}: React.PropsWithChildren<NavAccordionProps>) {
  const [accordionExpand, setAccordionExpand] = useState<boolean>(false);

  useEffect(() => {
    setAccordionExpand(false);
  }, [navExpand]);
  return (
    <>
      <NavbarItem
        label={label}
        expand={navExpand}
        onClick={() => {
          setAccordionExpand(!accordionExpand);
        }}
      />
      {accordionExpand && <hr />}
      <div
        className={classNames(styles.navAccordion, styles.navItems, {
          [styles.expand]: accordionExpand,
        })}
      >
        {children}
      </div>
      {accordionExpand && <hr />}
    </>
  );
}
