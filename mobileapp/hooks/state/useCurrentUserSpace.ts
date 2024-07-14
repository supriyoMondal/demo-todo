import { create } from "zustand";
import { DEFAULTS_STORAGE_KEYS, storage } from "../useStorage";

interface CurrentUserSpaceState {
  spaceId: string;
  setSpaceId: (index: string) => void;
}

const useCurrentUserSpace = create<CurrentUserSpaceState>((set) => ({
  spaceId: storage.getString(DEFAULTS_STORAGE_KEYS.userSpaceId) || "default",
  setSpaceId: (id) => {
    storage.set(DEFAULTS_STORAGE_KEYS.userSpaceId, id);
    return set({ spaceId: id });
  },
}));

export default useCurrentUserSpace;
