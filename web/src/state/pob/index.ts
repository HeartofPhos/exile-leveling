import type { RouteData } from "common";
import { persistentAtom } from "..";
import { atom } from "jotai";
import { RESET } from "jotai/utils";
import { buildDataSelector } from "../build-data";
import { requiredGemsSelector } from "../gem";
import { gemProgressFamily } from "../gem-progress";
import { buildTreesSelector } from "../tree/build-tree";
import { gemLinksSelector } from "../gem-links";
import { processPob } from "./process";
import { routeProgressFamily } from "../route-progress";
import { sectionCollapseFamily } from "../section-collapse";
import { toast } from "react-toastify";
import { activeEdgeAtom } from "../route";

const POB_CODE_VERSION = 0;

const pobCodeAtom = persistentAtom<string | null>(
  "pob-code",
  null,
  POB_CODE_VERSION,
);

export interface PobData {
  buildData: RouteData.BuildData;
  requiredGems: RouteData.RequiredGem[];
  buildTrees: RouteData.BuildTree[];
  gemLinks: RouteData.GemLinkGroup[];
}

export const pobAtom = atom(
  (get) => get(pobCodeAtom),
  (_get, set, value: string | typeof RESET) => {
    if (value === RESET) {
      toast.success("Reset");
      set(buildDataSelector, RESET);
      set(requiredGemsSelector, RESET);
      set(buildTreesSelector, RESET);
      set(gemLinksSelector, RESET);
      set(pobCodeAtom, RESET);
      set(activeEdgeAtom, RESET);

      set(routeProgressFamily.clear);
      set(gemProgressFamily.clear);
      set(sectionCollapseFamily.clear);
    } else {
      const pob = processPob(value);
      if (pob !== null) {
        set(buildDataSelector, pob.buildData);
        set(requiredGemsSelector, pob.requiredGems);
        set(buildTreesSelector, pob.buildTrees);
        set(gemLinksSelector, pob.gemLinks);
        set(pobCodeAtom, value);
        set(activeEdgeAtom, RESET);

        set(routeProgressFamily.clear);
        set(gemProgressFamily.clear);
        set(sectionCollapseFamily.clear);
      } else {
        set(pobAtom, RESET);
      }
    }
  },
);
