import { Viewport } from "../Viewport";

// @ts-expect-error
const TreeLookup: Record<string, string> = import.meta.glob(
  "./templates/*.svg",
  { as: "raw" }
);

export function PassiveTreeViewer() {
  const temp = document.createRange().createContextualFragment("template");

  return (
    <Viewport>
      <img
        src={`data:image/svg+xml;base64,${window.btoa(
          TreeLookup["./templates/tree.svg"]
        )}`}
        alt=""
      />
    </Viewport>
  );
}
