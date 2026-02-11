import { create } from 'zustand';

interface DeleteModalState {
  isActive: boolean;
  label: string;
  id: string;
  openModal: (id: string, label: string) => void;
  closeModal: () => void;
  reset: () => void;
}

export const useDeleteModalStore = create<DeleteModalState>((set) => ({
  isActive: false,
  label: '',
  id: '',

  openModal: (id: string, label: string) => {
    set({
      isActive: true,
      id,
      label,
    });
  },

  closeModal: () => {
    set({
      isActive: false,
    });
  },

  reset: () => {
    set({
      isActive: false,
      label: '',
      id: '',
    });
  },
}));