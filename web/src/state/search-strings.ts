import { atomWithStorage } from "jotai/utils";
import { versionedStorage } from ".";
import { atom } from "jotai";

const SEARCH_STRINGS_VERSION = 0;

export interface SearchString {
  text: string;
  alias?: string;
}

export const searchStringsAtom = atomWithStorage<string[] | null>(
  "search-strings",
  null,
  versionedStorage(SEARCH_STRINGS_VERSION),
);

export const searchStringsSelector = atom((get) => {
  const rawSearchStrings = get(searchStringsAtom);
  if (!rawSearchStrings) return null;

  let alias: string | undefined = undefined;
  let searchStrings: SearchString[] = [];
  for (let i = 0; i < rawSearchStrings.length; i++) {
    const line = rawSearchStrings[i];
    if (line.startsWith("#")) {
      alias = line.substring(1).trim();
    } else if (/\S/.test(line)) {
      searchStrings.push({
        text: line.trim(),
        alias: alias,
      });

      alias = undefined;
    }
  }

  return searchStrings;
});
