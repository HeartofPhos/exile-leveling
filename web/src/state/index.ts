import { AtomEffect } from "recoil";
import { clearPersistent, setPersistent } from "../utility";

export function persistentStorageEffect<T>(key: string): AtomEffect<T | null> {
  return ({ onSet }) => {
    onSet((newValue, _, isReset) => {
      if (isReset || newValue == null) clearPersistent(key);
      else setPersistent(key, newValue);
    });
  };
}
