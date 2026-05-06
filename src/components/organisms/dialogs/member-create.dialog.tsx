import { Button } from '@/components/atoms/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/atoms/drawer';
import {
  Field,
  FieldContent,
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
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/atoms/radio-group';
import { Switch } from '@/components/atoms/switch';
import { getOption } from '@/utils/option';
import { Generation } from '@/data/options/generations.option';

const createSchema = y.object({
  name: y.string().max(50).required(),
  role: y.string().max(50).required(),
  is_active: y.bool().required(),
});

export type Create = y.InferType<typeof createSchema>;

const MemberCreateDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { getDialog, closeDialog } = dialogStore(),
    dialog = getDialog('member_create');

  const [isStaff, setIsStaff] = useState(false);

  const create = useInsertMutation(supabase.from('members'), ['id']);

  const form = useFormik<Create>({
    initialValues: {
      name: '',
      role: '',
      is_active: true,
    },
    validationSchema: createSchema,
    onSubmit: async (val, { setSubmitting }) => {
      if (!dialog) return;

      setSubmitting(true);

      const toastId = toast.loading('Menambahkan anggota ...');
      await create.mutateAsync([
        { ...val, generation: dialog?.meta.generation },
      ]);
      toast.dismiss(toastId);
      toast.success('Anggota ditambahkan');

      onSuccess?.();
      _close();
    },
  });

  const _close = () => {
    form.resetForm();
    closeDialog('member_create');
  };

  useEffect(() => {
    form.setFieldValue('role', isStaff ? '' : 'Anggota');
  }, [isStaff]);

  return (
    <Drawer open={!!dialog} onClose={() => _close()}>
      <DrawerContent>
        <form onSubmit={form.handleSubmit} className="mx-auto w-full max-w-xl">
          <DrawerHeader>
            <DrawerTitle>
              Anggota Baru{' '}
              {getOption(Generation, dialog?.meta.generation)?.label}
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-6 p-3">
            <Field>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                value={form.values.name}
                onChange={form.handleChange}
              />
              {form.errors.name && <FieldError>{form.errors.name}</FieldError>}
            </Field>

            <RadioGroup
              value={`${isStaff}`}
              onValueChange={(v) => setIsStaff(v === 'true')}
              className="flex"
            >
              <FieldLabel htmlFor="isstaff-false">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Anggota</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="false" id="isstaff-false" />
                </Field>
              </FieldLabel>
              <FieldLabel htmlFor="isstaff-true">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Pengurus</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value="true" id="isstaff-true" />
                </Field>
              </FieldLabel>
            </RadioGroup>

            {isStaff && (
              <Field>
                <FieldLabel htmlFor="role">Jabatan</FieldLabel>
                <Input
                  id="role"
                  name="role"
                  value={form.values.role}
                  onChange={form.handleChange}
                />
                {form.errors.role && (
                  <FieldError>{form.errors.role}</FieldError>
                )}
              </Field>
            )}

            <Field orientation="horizontal">
              <FieldLabel htmlFor="is_active">Aktif</FieldLabel>
              <Switch
                id="is_active"
                name="is_active"
                checked={form.values.is_active}
                onCheckedChange={(v) => form.setFieldValue('is_active', v)}
              />
              {form.errors.is_active && (
                <FieldError>{form.errors.is_active}</FieldError>
              )}
            </Field>
          </div>

          <DrawerFooter>
            <Button type="submit" disabled={form.isSubmitting}>
              Simpan
            </Button>
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default MemberCreateDialog;
