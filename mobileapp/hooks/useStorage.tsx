import React from "react";
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const USER_SPACE_ID_KEY = "userSpaceId";
export const DEFAULTS_STORAGE_KEYS = {
  userSpaceId: "default",
} as const;

export function useStorage(
  key: keyof typeof DEFAULTS_STORAGE_KEYS,
  defaultValue?: string
) {
  const [value, setValue] = React.useState(
    storage.getString(key) || defaultValue || DEFAULTS_STORAGE_KEYS[key]!
  );

  const setStorageValue = React.useCallback(
    (value: string) => {
      storage.set(key, value);
      setValue(value);
    },
    [key]
  );

  return [value, setStorageValue] as const;
}
