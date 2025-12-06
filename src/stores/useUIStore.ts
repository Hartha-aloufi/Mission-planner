import { create } from "zustand";

interface UIState {
  isLeftSidebarCollapsed: boolean;
}

interface UIActions {
  toggleLeftSidebar: () => void;
}

const useUIStoreBase = create<UIState & UIActions>((set) => ({
  // State
  isLeftSidebarCollapsed: false,

  // Actions
  toggleLeftSidebar: () =>
    set((state) => ({
      isLeftSidebarCollapsed: !state.isLeftSidebarCollapsed,
    })),
}));

// Atomic selectors - only export these
export const useIsLeftSidebarCollapsed = () =>
  useUIStoreBase((state) => state.isLeftSidebarCollapsed);
export const useToggleLeftSidebar = () =>
  useUIStoreBase((state) => state.toggleLeftSidebar);
