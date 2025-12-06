import { create } from "zustand";

interface MapState {
  isDrawingMode: boolean;
}

interface MapActions {
  startDrawing: () => void;
  stopDrawing: () => void;
}

const useMapStoreBase = create<MapState & MapActions>((set) => ({
  // State
  isDrawingMode: false,

  // Actions
  startDrawing: () => set({ isDrawingMode: true }),
  stopDrawing: () => set({ isDrawingMode: false }),
}));

// Atomic selectors - only export these
export const useIsDrawingMode = () =>
  useMapStoreBase((state) => state.isDrawingMode);
export const useStartDrawing = () =>
  useMapStoreBase((state) => state.startDrawing);
export const useStopDrawing = () =>
  useMapStoreBase((state) => state.stopDrawing);
