import PLazy from "p-lazy";

interface Versioned {
  version: number;
}

interface PersistentData<T> extends Versioned {
  value: T;
}

type Migrator = (old: any) => any;

type MigratorMap = Map<
  Versioned["version"],
  Map<Versioned["version"], Migrator>
>;

export const NO_MIGRATORS = new Map();

export function BuildMigratorMap(
  migrators: [Versioned["version"], Versioned["version"], Migrator][]
) {
  const migratorMap: MigratorMap = new Map();
  for (const [src, dst, migrator] of migrators) {
    let inner = migratorMap.get(src);
    if (!inner) {
      inner = new Map();
      migratorMap.set(src, inner);
    }

    inner.set(dst, migrator);
  }

  return migratorMap;
}

function FindMigratorChain(
  currentVersion: Versioned["version"],
  expectedVersion: Versioned["version"],
  migratorMap: MigratorMap,
  visited: Set<Versioned["version"]>
): Migrator[] | null {
  const migrators = migratorMap.get(currentVersion);
  if (migrators === undefined) return null;

  visited.add(currentVersion);

  for (const [version, migrator] of migrators.entries()) {
    if (visited.has(version)) continue;

    if (version === expectedVersion) return [migrator!];

    const migratorChain = FindMigratorChain(
      version,
      expectedVersion,
      migratorMap,
      visited
    );
    if (migratorChain !== null) return [migrator, ...migratorChain];
  }

  return null;
}

export function ApplyMigratorChain<T>(migratorChain: Migrator[], data: any): T {
  for (const migrator of migratorChain) {
    data = migrator(data);
  }

  return data;
}

export function getPersistent<T>(
  key: string,
  expectedVersion: number,
  migratorMap: MigratorMap
) {
  const json = localStorage.getItem(key);
  if (!json) return null;

  const data = JSON.parse(json) as PersistentData<T>;

  if (expectedVersion !== data.version) {
    const migratorChain = FindMigratorChain(
      data.version,
      expectedVersion,
      migratorMap,
      new Set()
    );

    if (migratorChain !== null) {
      const migratedValue = ApplyMigratorChain<T>(migratorChain, data.value);
      setPersistent(key, expectedVersion, migratedValue);
      return migratedValue;
    }

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

export type UrlRewriter = (url: string) => string | null;
export function getRewriteUrl(
  stringOrUrl: string,
  urlRewriters: UrlRewriter[]
) {
  for (const urlRewriter of urlRewriters) {
    const url = urlRewriter(stringOrUrl);
    if (url) return url;
  }

  return null;
}

const CORS_PROXY_URL = "https://cors-proxy-weld-sigma.vercel.app";

export async function fetchStringOrUrl(
  stringOrUrl: string,
  urlRewriters: UrlRewriter[]
) {
  let value: string = stringOrUrl;
  const url = getRewriteUrl(stringOrUrl, urlRewriters);
  if (url) {
    value = await fetch(`${CORS_PROXY_URL}/${url}`).then((x) => {
      if (x.status >= 200 && x.status <= 299) return x.text();
      return Promise.reject("download failed");
    });
  }

  return value;
}

type PipeFunction<T> = (arg: T) => T;
export function pipe<T>(...fns: PipeFunction<T>[]) {
  return (initialVal: T) => fns.reduceRight((val, fn) => fn(val), initialVal);
}
