import { atom, useAtom } from "jotai";
import { atomFamily } from "jotai-family";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollOffsetState = atomFamily((_param: string) => atom(0));

export function withScrollRestoration<P extends {}>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  function ComponentWithScrollPosition(props: P) {
    const location = useLocation();
    const [scrollOffset, setScrollOffset] = useAtom(
      scrollOffsetState(location.pathname),
    );

    useEffect(() => {
      window.scrollTo(0, scrollOffset);

      function handleScroll() {
        setScrollOffset(window.scrollY);
      }

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    useEffect(() => {
      if (location.hash) {
        const element = document.getElementById(location.hash.replace("#", ""));
        if (element) element.scrollIntoView({ behavior: "auto" });
      }
    }, [location]);

    return <Component {...props} />;
  }

  return ComponentWithScrollPosition;
}
