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
import { SearchSelect } from '@/components/molecules/search-select';
import { Switch } from '@/components/atoms/switch';

const createSchema = y.object({
  member_id: y.string().required(),
  activity_count: y.number().nullable().optional(),
  feedback: y.boolean().nullable().optional(),
  quiz_points: y.number().nullable().optional(),
});

export type Create = y.InferType<typeof createSchema>;

const LessonItemParticipantCreateDialog = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const { getDialog, closeDialog } = dialogStore(),
    dialog = getDialog('lessonitemparticipant_create');

  const create = useInsertMutation(supabase.from('lesson_item_participants'), [
    'id',
  ]);

  const form = useFormik<Create>({
    initialValues: {
      member_id: '',
      activity_count: null,
      feedback: null,
      quiz_points: null,
    },
    validationSchema: createSchema,
    onSubmit: async (val) => {
      if (!dialog?.meta) return;

      const toastId = toast.loading('Menambahkan partisipan...');
      try {
        await create.mutateAsync([
          { lesson_item_id: dialog.meta.lesson_item_id, ...val },
        ]);
        onSuccess?.();
        _close();

        toast.success('Partisipan ditambahkan');
      } finally {
        toast.dismiss(toastId);
      }
    },
  });

  const _close = () => {
    form.resetForm();
    closeDialog('lessonitemparticipant_create');
  };

  const _getMembers = async (v: string) => {
    try {
      const q = supabase
        .from('members')
        .select('id, name, role, generation')
        .ilike('name', '%' + v + '%');
      if (dialog?.meta.generation) q.eq('generation', dialog?.meta.generation);

      const data = await q;
      return data.data ?? [];
    } catch {
      return [];
    }
  };

  return (
    <Dialog
      open={!!dialog}
      onOpenChange={(s) => {
        if (!s) _close();
      }}
    >
      <DialogContent>
        <form onSubmit={form.handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Partisipan Baru ({dialog?.meta.generation ?? ''})
            </DialogTitle>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-1.5 py-6">
            <div className="flex flex-col gap-6">
              <Field>
                <FieldLabel htmlFor="member_id">Anggota</FieldLabel>
                <SearchSelect
                  data={_getMembers}
                  keyValue="id"
                  buildLabel={(o) => `${o.name} - ${o.role}`}
                  onChange={(v) => form.setFieldValue('member_id', v?.id)}
                  prefetch
                />

                {form.errors.member_id && (
                  <FieldError>{form.errors.member_id}</FieldError>
                )}
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

export default LessonItemParticipantCreateDialog;
