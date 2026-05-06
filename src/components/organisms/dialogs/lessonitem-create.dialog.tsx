import { Button } from '@/components/atoms/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/atoms/field';
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
import { LogoIcon, LogoIconOpts } from '@/data/options/logo-icons.option';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import { getOption } from '@/utils/option';
import { isURL } from '@/utils/string';

const createSchema = y.object({
  file_url: y.string().url().required(),
  title: y.string().max(50).required(),
  description: y.string().max(500).required(),
  icon: y
    .string()
    .oneOf(LogoIconOpts.map((o) => o.value))
    .nullable()
    .optional(),
  meet_url: y.string().url().optional(),
  quiz_url: y.string().url().optional(),
});

export type Create = y.InferType<typeof createSchema>;

const LessonItemCreateDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { getDialog, closeDialog } = dialogStore(),
    dialog = getDialog('lessonitem_create');

  const create = useInsertMutation(supabase.from('lesson_items'), ['id']);

  const form = useFormik<Create>({
    initialValues: {
      file_url: '',
      title: '',
      description: '',
      icon: null,
      meet_url: '',
      quiz_url: '',
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
            {form.values.file_url && isURL(form.values.file_url) && (
              <div className="bg-secondary aspect-video max-w-md overflow-hidden rounded-xl">
                <iframe src={form.values.file_url} className="size-full" />
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="file_url">File</FieldLabel>
              <Input
                id="file_url"
                name="file_url"
                value={form.values.file_url}
                onChange={form.handleChange}
                aria-invalid={!!form.errors.file_url}
              />
              <FieldDescription>
                Salin tautan /preview file dari Google Drive. Pastikan file
                memiliki akses publik
              </FieldDescription>
              {form.errors.file_url && (
                <FieldError>{form.errors.file_url}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="title">Judul</FieldLabel>
              <Input
                id="title"
                name="title"
                value={form.values.title}
                onChange={form.handleChange}
                aria-invalid={!!form.errors.title}
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
                aria-invalid={!!form.errors.description}
              />
              {form.errors.description && (
                <FieldError>{form.errors.description}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="icon" className="items-end justify-between">
                Ikon
                <small className="text-caption text-muted-foreground">
                  Opsional
                </small>
              </FieldLabel>
              <div className="flex items-center gap-3">
                <Select
                  value={form.values.icon ?? ''}
                  onValueChange={(v) => form.setFieldValue('icon', v)}
                >
                  <SelectTrigger
                    className="grow"
                    aria-invalid={!!form.errors.icon}
                  >
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {LogoIconOpts.map((item, i) => (
                        <SelectItem key={i} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <img
                  src={getOption(LogoIcon, form.values.icon)?.meta?.logo}
                  className="size-6"
                />
              </div>
              {form.errors.icon && <FieldError>{form.errors.icon}</FieldError>}
            </Field>

            <Field>
              <FieldLabel
                htmlFor="meet_url"
                className="items-end justify-between"
              >
                Link online meet
                <small className="text-caption text-muted-foreground">
                  Opsional
                </small>
              </FieldLabel>
              <Input
                id="meet_url"
                name="meet_url"
                value={form.values.meet_url}
                onChange={form.handleChange}
                aria-invalid={!!form.errors.meet_url}
              />
              {form.errors.meet_url && (
                <FieldError>{form.errors.meet_url}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel
                htmlFor="quiz_url"
                className="items-end justify-between"
              >
                Link kuis
                <small className="text-caption text-muted-foreground">
                  Opsional
                </small>
              </FieldLabel>
              <Input
                id="quiz_url"
                name="quiz_url"
                value={form.values.quiz_url}
                onChange={form.handleChange}
                aria-invalid={!!form.errors.quiz_url}
              />
              {form.errors.quiz_url && (
                <FieldError>{form.errors.quiz_url}</FieldError>
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
