import * as y from 'yup';
import { useFormik } from 'formik';
import dialogStore from '@/stores/dialog.store';
import {
  useQuery,
  useUpdateMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/atoms/drawer';
import { LoadingOverlay } from '@/components/atoms/loading';
import { Button } from '@/components/atoms/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '@/components/atoms/field';
import { Switch } from '@/components/atoms/switch';
import { Input } from '@/components/atoms/input';
import { RadioGroup, RadioGroupItem } from '@/components/atoms/radio-group';
import { getOption } from '@/utils/option';
import { GenerationOpts } from '@/data/options/generations.option';

const updateSchema = y.object({
  name: y.string().max(50).optional(),
  role: y.string().max(50).optional(),
  is_active: y.bool().optional(),
});

export type Update = y.InferType<typeof updateSchema>;

const MemberUpdateDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { getDialog, closeDialog } = dialogStore(),
    dialog = getDialog('member_update');

  const [isStaff, setIsStaff] = useState(false);

  const detail = useQuery(
      supabase
        .from('members')
        .select('*')
        .eq('id', dialog?.meta.id ?? '')
        .maybeSingle(),
      { enabled: !!dialog?.meta.id }
    ),
    update = useUpdateMutation(supabase.from('members'), ['id']);

  const form = useFormik<Update>({
    initialValues: {
      name: '',
      role: '',
      is_active: true,
    },
    validationSchema: updateSchema,
    onSubmit: async (val) => {
      if (!dialog?.meta?.id) return;

      const toastId = toast.loading('Memperbarui anggota...');
      await update.mutateAsync({
        id: dialog.meta.id,
        ...val,
        role: isStaff ? val.role : 'Anggota',
      });
      toast.dismiss(toastId);
      toast.success('Anggota diperbarui');

      onSuccess?.();
      _close();
    },
  });

  const _close = () => {
    form.resetForm();
    closeDialog('member_update');
  };

  useEffect(() => {
    if (detail.data) {
      form.setValues({
        name: detail.data.name,
        role: detail.data.role,
        is_active: detail.data.is_active,
      });
      setIsStaff(detail.data.role.toLowerCase() !== 'anggota');
    }
  }, [detail.data]);

  return (
    <Drawer open={!!dialog} onClose={() => _close()}>
      <DrawerContent>
        {detail.isLoading && <LoadingOverlay />}

        <form onSubmit={form.handleSubmit} className="mx-auto w-full max-w-xl">
          <DrawerHeader>
            <DrawerTitle>Edit Anggota</DrawerTitle>
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

            <Field>
              <FieldLabel>Generasi</FieldLabel>
              <Input
                disabled
                value={
                  getOption(GenerationOpts, detail.data?.generation)?.label
                }
                onChange={() => {}}
              />
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

export default MemberUpdateDialog;
