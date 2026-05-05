import { Button } from '@/components/atoms/button';
import { Field, FieldError, FieldLabel } from '@/components/atoms/field';
import { Input } from '@/components/atoms/input';
import dialogStore from '@/stores/dialog.store';
import * as y from 'yup';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useInsertMutation } from '@supabase-cache-helpers/postgrest-react-query';
import { supabase } from '@/lib/supabase/';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import { Textarea } from '@/components/atoms/textarea';

const createSchema = y.object({
  title: y.string().max(50).required(),
  description: y.string().max(500).required(),
});

export type Create = y.InferType<typeof createSchema>;

const LessonItemCreateDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { getDialog, closeDialog } = dialogStore(),
    dialog = getDialog('lessonitem_create');

  const create = useInsertMutation(supabase.from('lesson_items'), ['id']);

  const form = useFormik<Create>({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: createSchema,
    onSubmit: async (val) => {
      if (!dialog?.meta) return;

      const toastId = toast.loading('Menambahkan materi belajar...');
      await create.mutateAsync([
        { ...val, lesson_id: dialog.meta.lesson_id, order: dialog.meta.order },
      ]);
      toast.dismiss(toastId);
      toast.success('Materi belajar ditambahkan');

      onSuccess?.();
      _close();
    },
  });

  const _close = () => {
    form.resetForm();
    closeDialog('lessonitem_create');
  };

  return (
    <Dialog
      open={!!dialog}
      onOpenChange={(s) => {
        if (!s) _close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Materi Belajar Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit}>
          <div className="mb-6 flex flex-col gap-3">
            <Field>
              <FieldLabel htmlFor="title">Judul</FieldLabel>
              <Input
                id="title"
                name="title"
                value={form.values.title}
                onChange={form.handleChange}
              />
              {form.errors.title && (
                <FieldError>{form.errors.title}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
              <Textarea
                id="description"
                name="description"
                value={form.values.description}
                onChange={form.handleChange}
              />
              {form.errors.description && (
                <FieldError>{form.errors.description}</FieldError>
              )}
            </Field>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={form.isSubmitting}>
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonItemCreateDialog;
