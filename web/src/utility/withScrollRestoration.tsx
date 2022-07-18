import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPersistent, setPersistent } from ".";

type ScrollLookup = Record<string, number>;

export function withScrollRestoration<P>(Component: React.ComponentType<P>) {
  function ComponentWithScrollPosition(props: any) {
    const location = useLocation();

    useLayoutEffect(() => {
      const scrollLookup = getPersistent<ScrollLookup>("scroll-lookup");
      const offset = (scrollLookup && scrollLookup[location.pathname]) || 0;
      window.scrollTo(0, offset);

      return () => {
        const newScrollLookup = {
          ...scrollLookup,
          [location.pathname]: window.scrollY,
        };

        setPersistent<ScrollLookup>("scroll-lookup", newScrollLookup);
      };
    }, []);

    return <Component {...props} />;
  }

  return ComponentWithScrollPosition;
}
