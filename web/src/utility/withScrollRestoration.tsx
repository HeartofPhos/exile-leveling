import React, { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { atomFamily, useRecoilState } from "recoil";

const scrollOffsetState = atomFamily<number, string>({
  key: "scrollOffsetState",
  default: 0,
});

export function withScrollRestoration<P>(Component: React.ComponentType<P>) {
  function ComponentWithScrollPosition(props: any) {
    const location = useLocation();
    const [scrollOffset, setScrollOffset] = useRecoilState(
      scrollOffsetState(location.pathname)
    );

    useLayoutEffect(() => {
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
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }
    }, [location]);

    return <Component {...props} />;
  }

  return ComponentWithScrollPosition;
}
