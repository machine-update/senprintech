import { create } from 'zustand';

export interface DesignElement {
  id: string;
  type: 'text' | 'image';
  content: string; // URL ou texte
  x: number;
  y: number;
  fontSize?: number;
  fill?: string;
  width?: number;
  height?: number;
  rotation: number;
}

interface DesignerState {
  elements: DesignElement[];
  selectedElementId: string | null;
  addElement: (el: DesignElement) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
  setElements: (elements: DesignElement[]) => void;
  clear: () => void;
  setSelectedElement: (id: string | null) => void;
}

export const useDesignerStore = create<DesignerState>((set) => ({
  elements: [],
  selectedElementId: null,
  addElement: (el) => set((state) => ({ elements: [...state.elements, el] })),
  updateElement: (id, updates) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? { ...el, ...updates } : el)
  })),
  removeElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id)
  })),
  setElements: (elements) => set({ elements }),
  clear: () => set({ elements: [], selectedElementId: null }),
  setSelectedElement: (id) => set({ selectedElementId: id }),
}));
