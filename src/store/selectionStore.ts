import { create } from "zustand";
import type { SelectionInfo, ExplainResponse } from "@/types";

interface SelectionState {
  selection: SelectionInfo | null;
  isPopoverOpen: boolean;
  explanation: ExplainResponse | null;
  isExplaining: boolean;
  setSelection: (selection: SelectionInfo | null) => void;
  setPopoverOpen: (open: boolean) => void;
  setExplanation: (explanation: ExplainResponse | null) => void;
  setIsExplaining: (loading: boolean) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selection: null,
  isPopoverOpen: false,
  explanation: null,
  isExplaining: false,

  setSelection: (selection) => {
    set({ selection, isPopoverOpen: !!selection, explanation: null });
  },

  setPopoverOpen: (open) => {
    set({ isPopoverOpen: open });
    if (!open) {
      set({ selection: null, explanation: null });
    }
  },

  setExplanation: (explanation) => {
    set({ explanation });
  },

  setIsExplaining: (isExplaining) => {
    set({ isExplaining });
  },

  clearSelection: () => {
    set({
      selection: null,
      isPopoverOpen: false,
      explanation: null,
      isExplaining: false,
    });
  },
}));
