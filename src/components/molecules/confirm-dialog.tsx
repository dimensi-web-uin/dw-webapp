import dialogStore from '@/stores/dialog.store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../atoms/alert-dialog';

const ConfirmDialog = () => {
  const { confirmDialog, closeConfirmDialog } = dialogStore();

  return (
    <AlertDialog
      open={!!confirmDialog}
      onOpenChange={(s) => !s && closeConfirmDialog()}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmDialog?.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmDialog?.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={confirmDialog?.onCancel}
            variant="outline"
          >
            {confirmDialog?.cancelText ?? 'Batal'}
          </AlertDialogCancel>
          {!!confirmDialog?.onConfirm && (
            <AlertDialogAction
              onClick={confirmDialog.onConfirm}
              variant={confirmDialog?.confirmVariant ?? 'default'}
            >
              {confirmDialog?.confirmText ?? 'Ya'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
