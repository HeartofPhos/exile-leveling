const PERSISTENT_VERSION: Partial<Record<string, number>> = {
  "build-data": 2,
  "route-progress": 0,
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
