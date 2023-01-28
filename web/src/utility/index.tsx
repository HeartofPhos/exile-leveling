import PLazy from "p-lazy";

const PERSISTENT_VERSION: Partial<Record<string, number>> = {
  "build-data": 1,
  "route-progress": 0,
  "gem-progress": 0,
  "search-strings": 0,
  "route-files": 1,
};

interface PersistentData<T> {
  value: T;
  version: number | undefined;
}

export function getPersistent<T>(key: string) {
  const json = localStorage.getItem(key);
  if (!json) return null;

  const data = JSON.parse(json) as PersistentData<T>;

  const expectedVersion = PERSISTENT_VERSION[key];
  if (expectedVersion !== undefined && expectedVersion != data.version) {
    clearPersistent(key);
    return null;
  }

  return data.value;
}

export function setPersistent<T>(key: string, value: T) {
  const data: PersistentData<T> = {
    value: value,
    version: PERSISTENT_VERSION[key],
  };

  localStorage.setItem(key, JSON.stringify(data));
}

export function clearPersistent(key: string) {
  localStorage.removeItem(key);
}

export function globImportLazy<T>(
  importLookup: Record<string, () => Promise<any>>,
  keyTransform: (key: string) => string,
  valueTransform: (value: any) => T | Promise<T>
) {
  return Object.entries(importLookup).reduce((prev, [key, value]) => {
    prev[keyTransform(key)] = new PLazy((resolve) =>
      value().then((x) => resolve(valueTransform(x)))
    );

    return prev;
  }, {} as Record<string, PromiseLike<T>>);
}
