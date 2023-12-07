import { useEffect } from "react";

export function withTitle<P>(title: string) {
  const ComponentWithTitle =
    (Component: React.ComponentType<P>) => (props: any) => {
      useEffect(() => {
        const oldTitle = document.title;
        document.title = `${oldTitle} - ${title}`;

        return () => {
          document.title = oldTitle;
        };
      }, [title]);

      return <Component {...props} />;
    };

  return ComponentWithTitle;
}
