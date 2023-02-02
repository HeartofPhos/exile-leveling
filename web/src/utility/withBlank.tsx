import { useEffect, useState } from "react";

export function withBlank<P>(Component: React.ComponentType<P>) {
  function ComponentWithBlank(props: any) {
    const [blank, setBlank] = useState(true);

    useEffect(() => {
      setBlank(false);
    }, []);

    return blank ? <></> : <Component {...props} />;
  }

  return ComponentWithBlank;
}
