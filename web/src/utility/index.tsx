import PLazy from "p-lazy";

interface PersistentData<T> {
  value: T;
  version: number | undefined;
}

export function getPersistent<T>(key: string, expectedVersion: number) {
  const json = localStorage.getItem(key);
  if (!json) return null;

  const data = JSON.parse(json) as PersistentData<T>;

  if (expectedVersion !== undefined && expectedVersion != data.version) {
    clearPersistent(key);
    return null;
  }

  return data.value;
}

export function setPersistent<T>(key: string, version: number, value: T) {
  const data: PersistentData<T> = {
    value: value,
    version: version,
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
  return Object.entries(importLookup).reduce((record, [key, value]) => {
    record[keyTransform(key)] = new PLazy((resolve) =>
      value().then((x) => resolve(valueTransform(x)))
    );

    return record;
  }, {} as Record<string, PromiseLike<T>>);
}

const idCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export function randomId(length: number) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += idCharacters.charAt(
      Math.floor(Math.random() * idCharacters.length)
    );
  }

  return result;
}

export function decodeBase64Url(value: string) {
  const unescaped = value.replace(/_/g, "/").replace(/-/g, "+");
  return Uint8Array.from(window.atob(unescaped), (c) => c.charCodeAt(0));
}
