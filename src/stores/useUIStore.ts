import { create } from "zustand";

interface UIState {
  isLeftSidebarCollapsed: boolean;
  editingMissionId: string | null;
}

interface UIActions {
  toggleLeftSidebar: () => void;
  startEditingMission: (id: string) => void;
  stopEditingMission: () => void;
}

const useUIStoreBase = create<UIState & UIActions>((set) => ({
  // State
  isLeftSidebarCollapsed: false,
  editingMissionId: null,

  // Actions
  toggleLeftSidebar: () =>
    set((state) => ({
      isLeftSidebarCollapsed: !state.isLeftSidebarCollapsed,
    })),
  startEditingMission: (id: string) => set({ editingMissionId: id }),
  stopEditingMission: () => set({ editingMissionId: null }),
}));

// Atomic selectors - only export these
export const useIsLeftSidebarCollapsed = () =>
  useUIStoreBase((state) => state.isLeftSidebarCollapsed);
export const useToggleLeftSidebar = () =>
  useUIStoreBase((state) => state.toggleLeftSidebar);
export const useEditingMissionId = () =>
  useUIStoreBase((state) => state.editingMissionId);
export const useStartEditingMission = () =>
  useUIStoreBase((state) => state.startEditingMission);
export const useStopEditingMission = () =>
  useUIStoreBase((state) => state.stopEditingMission);
