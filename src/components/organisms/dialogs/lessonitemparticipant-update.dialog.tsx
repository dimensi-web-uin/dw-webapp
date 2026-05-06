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
import { useEffect } from 'react';

import { LoadingOverlay } from '@/components/atoms/loading';
import { Switch } from '@/components/atoms/switch';

const updateSchema = y.object({
  activity_count: y.number().nullable().optional(),
  feedback: y.boolean().nullable().optional(),
  quiz_points: y.number().nullable().optional(),
});

export type Update = y.InferType<typeof updateSchema>;

const LessonItemParticipantUpdateDialog = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const { getDialog, closeDialog } = dialogStore(),
    dialog = getDialog('lessonitemparticipant_update');

  const detail = useQuery(
      supabase
        .from('lesson_item_participants')
        .select('*, members(id, name, role)')
        .eq('id', dialog?.meta.id ?? '')
        .maybeSingle(),
      { enabled: !!dialog?.meta.id }
    ),
    update = useUpdateMutation(supabase.from('lesson_item_participants'), [
      'id',
    ]);

  const form = useFormik<Update>({
    initialValues: {
      activity_count: null,
      feedback: null,
      quiz_points: null,
    },
    validationSchema: updateSchema,
    onSubmit: async (val) => {
      if (!dialog?.meta.id) return;

      const toastId = toast.loading('Memperbarui partisipan...');
      try {
        await update.mutateAsync({
          id: dialog.meta.id,
          ...val,
        });
        onSuccess?.();
        _close();

        toast.success('Partisipan diperbarui');
      } finally {
        toast.dismiss(toastId);
      }
    },
  });

  const _close = () => {
    form.resetForm();
    closeDialog('lessonitemparticipant_update');
  };

  useEffect(() => {
    if (detail.data) {
      form.setValues({
        activity_count: detail.data.activity_count,
        feedback: detail.data.feedback,
        quiz_points: detail.data.quiz_points,
      });
    }
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

        <form onSubmit={form.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Partisipan</DialogTitle>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-1.5 py-6">
            <div className="flex flex-col gap-6">
              <Field>
                <FieldLabel>Anggota</FieldLabel>
                <Input
                  value={`${detail.data?.members.name} - ${detail.data?.members.role}`}
                  disabled
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="activity_count">Poin keaktifan</FieldLabel>
                <Input
                  id="activity_count"
                  name="activity_count"
                  type="number"
                  value={form.values.activity_count ?? ''}
                  onChange={form.handleChange}
                  aria-invalid={!!form.errors.activity_count}
                />
                {form.errors.activity_count && (
                  <FieldError>{form.errors.activity_count}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="quiz_points">Poin kuis</FieldLabel>
                <Input
                  id="quiz_points"
                  name="quiz_points"
                  type="number"
                  value={form.values.quiz_points ?? ''}
                  onChange={form.handleChange}
                  aria-invalid={!!form.errors.quiz_points}
                />
                {form.errors.quiz_points && (
                  <FieldError>{form.errors.quiz_points}</FieldError>
                )}
              </Field>

              <Field orientation="horizontal">
                <FieldLabel htmlFor="feedback">Memberi feedback</FieldLabel>
                <Switch
                  id="feedback"
                  name="feedback"
                  checked={form.values.feedback ?? false}
                  onCheckedChange={(v) => form.setFieldValue('feedback', v)}
                />
                {form.errors.feedback && (
                  <FieldError>{form.errors.feedback}</FieldError>
                )}
              </Field>
            </div>
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

export default LessonItemParticipantUpdateDialog;
