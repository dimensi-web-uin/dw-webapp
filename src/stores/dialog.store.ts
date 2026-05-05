import type { Generation } from '@/data/options/generations.option';
import { create } from 'zustand';

export const DIALOGS = {
  member_create: { id: 'dialog_member_create' },
  member_update: { id: 'dialog_member_update' },
  member_claim: { id: 'dialog_member_claim' },
  lesson_create: { id: 'dialog_lesson_create' },
  lesson_update: { id: 'dialog_lesson_update' },
  lessonitem_create: { id: 'dialog_lessonitem_create' },
  lessonitem_update: { id: 'dialog_lesson_update' },
} as const;

export type DialogId = keyof typeof DIALOGS;

type DialogMetaMap = {
  member_create: { generation: Generation };
  member_update: { id: string };
  member_claim: undefined;
  lesson_create: undefined;
  lesson_update: { id: string };
  lessonitem_create: { lesson_id: string; order: number };
  lessonitem_update: { id: string };
};

type DialogData<T extends DialogId = DialogId> =
  DialogMetaMap[T] extends undefined
    ? {
        id: T;
        meta?: undefined;
      }
    : {
        id: T;
        meta: DialogMetaMap[T];
      };

type ConfirmDialogData = {
  title: string;
  description: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: 'default' | 'destructive';
};

interface DialogStoreState {
  dialogs: DialogData[];
  confirmDialog?: ConfirmDialogData;
}

interface DialogStoreAction {
  openConfirmDialog: (data: ConfirmDialogData) => void;
  closeConfirmDialog: () => void;
  getDialog: <T extends DialogId>(id: T) => DialogData<T> | undefined;
  openDialog: <T extends DialogId>(
    ...args: DialogMetaMap[T] extends undefined
      ? [id: T]
      : [id: T, meta: DialogMetaMap[T]]
  ) => void;
  closeDialog: (id: DialogId) => void;
  clear: () => void;
}

const dialogStoreInit: DialogStoreState = {
  dialogs: [],
  confirmDialog: undefined,
};

const dialogStore = create<DialogStoreState & DialogStoreAction>(
  (set, get) => ({
    ...dialogStoreInit,
    openConfirmDialog: (data) => {
      set({ confirmDialog: data });
    },
    closeConfirmDialog: () => {
      set({ confirmDialog: undefined });
    },
    getDialog: <T extends DialogId>(id: T): DialogData<T> | undefined => {
      const dialog = get().dialogs.find((item) => item.id === id);
      return dialog as DialogData<T> | undefined;
    },
    openDialog: (...args) => {
      const [id, meta] = args as [DialogId, DialogMetaMap[DialogId]?];

      set({
        dialogs: [{ id, meta } as DialogData, ...get().dialogs],
      });
    },
    closeDialog: (id) => {
      set({ dialogs: [...get().dialogs].filter((m) => m.id != id) });
    },
    clear: () => {
      set({ ...dialogStoreInit });
    },
  })
);

export default dialogStore;
