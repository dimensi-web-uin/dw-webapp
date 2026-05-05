import { Button } from '@/components/atoms/button';
import { Field, FieldError, FieldLabel } from '@/components/atoms/field';
import { Input } from '@/components/atoms/input';
import dialogStore from '@/stores/dialog.store';
import * as y from 'yup';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import {
  useQuery,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
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
import { useEffect } from 'react';
import { LoadingOverlay } from '@/components/atoms/loading';

const updateSchema = y.object({
  title: y.string().max(50).optional(),
  description: y.string().max(500).optional(),
});

export type Update = y.InferType<typeof updateSchema>;

const LessonUpdateDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { getDialog, closeDialog } = dialogStore(),
    dialog = getDialog('lesson_update');

  const detail = useQuery(
      supabase
        .from('lessons')
        .select('*')
        .eq('id', dialog?.meta.id ?? '')
        .maybeSingle(),
      { enabled: !!dialog?.meta.id }
    ),
    update = useUpdateMutation(supabase.from('lessons'), ['id']);

  const form = useFormik<Update>({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: updateSchema,
    onSubmit: async (val) => {
      if (!dialog?.meta.id) return;

      const toastId = toast.loading('Memperbarui kurikulum...');
      await update.mutateAsync({ id: dialog.meta.id, ...val });
      toast.dismiss(toastId);
      toast.success('Kurikulum diperbarui');

      onSuccess?.();
      _close();
    },
  });

  const _close = () => {
    form.resetForm();
    closeDialog('lesson_update');
  };

  useEffect(() => {
    if (detail.data)
      form.setValues({
        title: detail.data.title,
        description: detail.data.description ?? '',
      });
  }, [detail.data]);

  return (
    <Dialog
      open={!!dialog}
      onOpenChange={(s) => {
        if (!s) _close();
      }}
    >
      <DialogContent>
        {detail.isLoading && <LoadingOverlay />}

        <DialogHeader>
          <DialogTitle>Edit Kurikulum</DialogTitle>
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

export default LessonUpdateDialog;
