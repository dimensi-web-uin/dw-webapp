import { Button } from '@/components/atoms/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
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
import { Separator } from '@/components/atoms/separator';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/atoms/radio-group';
import { SearchSelect } from '@/components/molecules/search-select';

const createSchema = y.object({
  file_url: y.string().url().required(),
  title: y.string().max(50).required(),
  description: y.string().max(500).required(),
  author_id: y.string().nullable().optional(),
  author_name: y.string().nullable().optional(),
  author_role: y.string().nullable().optional(),
  icon: y
    .string()
    .oneOf(LogoIconOpts.map((o) => o.value))
    .nullable()
    .optional(),
  meet_url: y.string().url().nullable().optional(),
  quiz_url: y.string().url().nullable().optional(),
});

export type Create = y.InferType<typeof createSchema>;

const LessonItemCreateDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { getDialog, closeDialog } = dialogStore(),
    dialog = getDialog('lessonitem_create');

  const [isInAuthor, setIsInAuthor] = useState(true);

  const create = useInsertMutation(supabase.from('lesson_items'), ['id']);

  const form = useFormik<Create>({
    initialValues: {
      file_url: '',
      title: '',
      description: '',
      author_id: null,
      author_name: null,
      author_role: null,
      icon: null,
      meet_url: null,
      quiz_url: null,
    },
    validationSchema: createSchema,
    onSubmit: async (val) => {
      if (!dialog?.meta) return;

      const toastId = toast.loading('Menambahkan materi belajar...');
      try {
        await create.mutateAsync([
          {
            ...val,
            lesson_id: dialog.meta.lesson_id,
            order: dialog.meta.order,
          },
        ]);
        onSuccess?.();
        _close();

        toast.success('Materi belajar ditambahkan');
      } finally {
        toast.dismiss(toastId);
      }
    },
  });

  const _close = () => {
    form.resetForm();
    closeDialog('lessonitem_create');
  };

  useEffect(() => {
    form.setFieldValue('author_id', null);
    form.setFieldValue('author_name', null);
    form.setFieldValue('author_role', null);
  }, [isInAuthor]);

  const _getMembers = async (q: string) => {
    try {
      const data = await supabase
        .from('members')
        .select('id, name, role, generation')
        .ilike('name', '%' + q + '%');
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
            <DialogTitle>Materi Belajar Baru</DialogTitle>
          </DialogHeader>
          <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-1.5 py-6">
            <div className="flex flex-col gap-3">
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

              <div className="mt-3 flex items-center justify-between">
                <Separator className="max-w-2/5 grow" />
                <small className="typo-caption text-muted-foreground">
                  Pemateri
                </small>
                <Separator className="max-w-2/5 grow" />
              </div>

              <RadioGroup
                value={`${isInAuthor}`}
                onValueChange={(v) => setIsInAuthor(v === 'true')}
                className="flex"
              >
                <FieldLabel htmlFor="isinauthor-true">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Internal</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="true" id="isinauthor-true" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="isinauthor-false">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Eksternal</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="false" id="isinauthor-false" />
                  </Field>
                </FieldLabel>
              </RadioGroup>

              {isInAuthor ? (
                <>
                  <Field>
                    <FieldLabel htmlFor="author_id">Anggota</FieldLabel>
                    <SearchSelect
                      data={_getMembers}
                      keyValue="id"
                      buildLabel={(o) => `${o.name} - ${o.role}`}
                      onChange={(v) => form.setFieldValue('author_id', v?.id)}
                      prefetch
                    />

                    {form.errors.author_id && (
                      <FieldError>{form.errors.author_id}</FieldError>
                    )}
                  </Field>
                </>
              ) : (
                <>
                  <Field>
                    <FieldLabel htmlFor="author_name">Nama</FieldLabel>
                    <Input
                      id="author_name"
                      name="author_name"
                      value={form.values.author_name ?? ''}
                      onChange={form.handleChange}
                      aria-invalid={!!form.errors.author_name}
                    />
                    {form.errors.author_name && (
                      <FieldError>{form.errors.author_name}</FieldError>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="author_role">Jabatan</FieldLabel>
                    <Input
                      id="author_role"
                      name="author_role"
                      value={form.values.author_role ?? ''}
                      onChange={form.handleChange}
                      aria-invalid={!!form.errors.author_role}
                    />
                    {form.errors.author_role && (
                      <FieldError>{form.errors.author_role}</FieldError>
                    )}
                  </Field>
                </>
              )}

              <div className="mt-3 flex items-center justify-between">
                <Separator className="max-w-2/5 grow" />
                <small className="typo-caption text-muted-foreground">
                  Opsional
                </small>
                <Separator className="max-w-2/5 grow" />
              </div>

              <Field>
                <FieldLabel htmlFor="icon">Ikon</FieldLabel>
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
                {form.errors.icon && (
                  <FieldError>{form.errors.icon}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="meet_url">Link online meet</FieldLabel>
                <Input
                  id="meet_url"
                  name="meet_url"
                  value={form.values.meet_url ?? ''}
                  onChange={form.handleChange}
                  aria-invalid={!!form.errors.meet_url}
                />
                {form.errors.meet_url && (
                  <FieldError>{form.errors.meet_url}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="quiz_url">Link kuis</FieldLabel>
                <Input
                  id="quiz_url"
                  name="quiz_url"
                  value={form.values.quiz_url ?? ''}
                  onChange={form.handleChange}
                  aria-invalid={!!form.errors.quiz_url}
                />
                {form.errors.quiz_url && (
                  <FieldError>{form.errors.quiz_url}</FieldError>
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

export default LessonItemCreateDialog;
