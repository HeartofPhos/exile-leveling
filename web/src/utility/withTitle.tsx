import { useEffect } from "react";

export function withTitle<P>(title: string, Component: React.ComponentType<P>) {
  function ComponentWithTitle(props: any) {
    useEffect(() => {
      const oldTitle = document.title;
      document.title = `${oldTitle} - ${title}`;

      return () => {
        document.title = oldTitle;
      };
    }, [title]);

    return <Component {...props} />;
  }

  return ComponentWithTitle;
}
