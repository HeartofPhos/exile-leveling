import { useEffect, useState } from "react";

export function withBlank<P extends {}>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  function ComponentWithBlank(props: P) {
    const [blank, setBlank] = useState(true);

    useEffect(() => {
      setBlank(false);
    }, []);

    return blank ? <></> : <Component {...props} />;
  }

  return ComponentWithBlank;
}
