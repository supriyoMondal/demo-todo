import { create } from "zustand";

interface HomeTabIndexState {
  homeTabIndex: number;
  setHomeTabIndex: (index: number) => void;
}

const useHomeTabIndex = create<HomeTabIndexState>((set) => ({
  homeTabIndex: 0,
  setHomeTabIndex: (index: number) => set({ homeTabIndex: index }),
}));

export default useHomeTabIndex;
