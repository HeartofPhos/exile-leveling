import { Action } from "../../../../common/route";

interface ActionProps {
  value: Action;
}

export function ActionComponent({ value }: ActionProps) {
  return <>{value.join(" ")}</>;
}
