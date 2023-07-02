import { useClearGemProgress } from "../../state/gem-progress";
import { routeSelector } from "../../state/route";
import { routeFilesSelector } from "../../state/route-files";
import { useClearRouteProgress } from "../../state/route-progress";
import { borderListStyles, interactiveStyles } from "../../styles";
import styles from "./styles.module.css";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaGithub,
  FaMap,
  FaRegClipboard,
  FaTools,
  FaUndoAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilCallback, useRecoilValue } from "recoil";

interface NavbarItemProps {
  label: string;
  icon?: React.ReactNode;
  expand: boolean;
  onClick: () => void;
}

function NavbarItem({ label, expand, icon, onClick }: NavbarItemProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(styles.navItem, styles.navElement, {
        [styles.expand]: expand,
        [borderListStyles.item]: expand,
        [interactiveStyles.activeSecondary]: !expand,
        [interactiveStyles.hoverPrimary]: expand,
      })}
    >
      {icon}
      {label}
    </button>
  );
}

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const [navExpand, setNavExpand] = useState<boolean>(false);
  const navigate = useNavigate();

  const clipboardRoute = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const route = await snapshot.getPromise(routeSelector);
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
        <button onClick={() => setNavExpand(!navExpand)}>
          <FaBars
            aria-label="Menu"
            className={classNames(
              styles.navIcon,
              interactiveStyles.activePrimary
            )}
            display="block"
          />
        </button>
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
              label="3rd-Party Export"
              expand={navExpand}
              icon={<FaRegClipboard className={classNames("inlineIcon")} />}
              onClick={() => {
                clipboardRoute();
                toast.success("Exported to Clipboard");
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
