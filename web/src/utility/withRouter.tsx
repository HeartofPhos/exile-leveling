import React from "react";
import {
  Location,
  NavigateFunction,
  Params,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

export interface WithRouterProps {
  router: {
    location: Location;
    navigate: NavigateFunction;
    params: Readonly<Params<string>>;
  };
}

export function withRouter<P>(Component: React.ComponentType<P>) {
  function ComponentWithRouterProp(props: any) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <Component
        {...props}
        router={{
          location,
          navigate,
          params,
        }}
      />
    );
  }

  return ComponentWithRouterProp;
}
