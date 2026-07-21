import { atom, type WritableAtom } from "jotai";
import { atomFamily, type AtomFamily } from "jotai-family";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";

export function transientAtomFamily<
  Param,
  AtomType extends WritableAtom<any, any[], any>,
>(
  initializeAtom: (param: Param) => AtomType,
  areEqual?: (a: Param, b: Param) => boolean,
): AtomFamily<Param, AtomType> {
  const family = atomFamily((param: Param) => {
    const atom = initializeAtom(param);
    // TODO handle cleanup
    // atom.onMount = () => {
    //   return () => family.remove(param);
    // };

    return atom;
  }, areEqual);

  return family;
}

export function persistentAtom<T>(
  key: string,
  initialValue: T,
  version: number,
) {
  return atomWithStorage(key, initialValue, versionedStorage(version), {
    getOnInit: true,
  });
}

function versionedStorage<T>(version: number): SyncStorage<T> {
  interface Entry {
    version: number;
    value: T;
  }

  function toEntry(initialValue: T): Entry {
    return { version, value: initialValue };
  }

  function fromEntry(entry: Entry, fallback: T): T {
    if (entry.version !== version) {
      return fallback;
    }

    return entry.value;
  }
  const baseStorage = createJSONStorage<Entry>(() => localStorage);

  let subscribe: SyncStorage<T>["subscribe"];
  if (baseStorage.subscribe !== undefined) {
    subscribe = (key, callback, initialValue) => {
      baseStorage.subscribe!(
        key,
        (entry) => {
          callback(fromEntry(entry, initialValue));
        },
        toEntry(initialValue),
      );
    };
  }

  return {
    getItem: function (key: string, initialValue: T): T {
      const storedValue = baseStorage.getItem(key, toEntry(initialValue));

      if (storedValue.version !== version) {
        return initialValue;
      }

      return storedValue.value;
    },
    setItem: (key, newValue) => {
      baseStorage.setItem(key, toEntry(newValue));
    },
    removeItem: baseStorage.removeItem,
    subscribe,
  };
}
