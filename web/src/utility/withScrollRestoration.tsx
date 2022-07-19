import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { atomFamily, useRecoilState } from "recoil";

const scrollOffsetState = atomFamily<number, string>({
  key: "scrollOffsetState",
  default: 0,
});

export function withScrollRestoration<P>(Component: React.ComponentType<P>) {
  function ComponentWithScrollPosition(props: any) {
    const location = useLocation();
    const [scrollOffset, setScrollLookup] = useRecoilState(
      scrollOffsetState(location.pathname)
    );

    useLayoutEffect(() => {
      window.scrollTo(0, scrollOffset);

      return () => {
        setScrollLookup(window.scrollY);
      };
    }, []);

    return <Component {...props} />;
  }

  return ComponentWithScrollPosition;
}
