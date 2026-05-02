import { Button } from '@/components/atoms/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/atoms/drawer';
import { Field, FieldError, FieldLabel } from '@/components/atoms/field';
import { Input } from '@/components/atoms/input';
import dialogStore from '@/stores/dialog.store';
import * as y from 'yup';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/';
import { useState } from 'react';
import type { Database } from '@/@types/supabase.type';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/atoms/item';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { getInitial } from '@/utils/string';

const claimSchema = y.object({
  claim_code: y.string().max(7).required(),
});

export type Create = y.InferType<typeof claimSchema>;

const MemberClaimDialog = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { getDialog, closeDialog } = dialogStore(),
    dialog = getDialog('member_claim');

  const [member, setMember] = useState<
    Database['public']['Tables']['members']['Row'] | null
  >(null);

  const form = useFormik<Create>({
    initialValues: {
      claim_code: '',
    },
    validationSchema: claimSchema,
    onSubmit: async (val, { setSubmitting }) => {
      setSubmitting(true);

      const { data, error } = await supabase.rpc('claim_member', {
        p_claim_code: val.claim_code,
      });

      if (error) {
        if (error.code == '23505')
          toast.warning('Akunmu sudah terdaftar sebagai anggota');
        else toast.error('Gagal mengklaim anggota');
        return;
      }
      if (data) setMember(data);
      toast.success('Berhasil mengklaim anggota');
      onSuccess?.();
    },
  });

  const _close = () => {
    form.resetForm();
    setMember(null);
    closeDialog('member_claim');
  };

  return (
    <Drawer open={!!dialog} onClose={() => _close()}>
      <DrawerContent>
        <form onSubmit={form.handleSubmit} className="mx-auto w-full max-w-xl">
          <DrawerHeader>
            <DrawerTitle>Klaim Anggota</DrawerTitle>
          </DrawerHeader>

          {member ? (
            <>
              <Item variant={'card'}>
                <ItemMedia>
                  <Avatar className="size-10 *:rounded-lg">
                    <AvatarImage src={member.avatar_url ?? ''} />
                    <AvatarFallback>{getInitial(member.name)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="items-center">{member.name}</ItemTitle>
                  <ItemDescription>{member.role}</ItemDescription>
                </ItemContent>
              </Item>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button type="button" variant="outline">
                    Tutup
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-6 p-3">
                <Field>
                  <FieldLabel htmlFor="claim_code">Kode</FieldLabel>
                  <Input
                    id="claim_code"
                    name="claim_code"
                    value={form.values.claim_code}
                    onChange={form.handleChange}
                  />
                  {form.errors.claim_code && (
                    <FieldError>{form.errors.claim_code}</FieldError>
                  )}
                </Field>
              </div>

              <DrawerFooter>
                <Button type="submit" disabled={form.isSubmitting}>
                  Klaim
                </Button>
                <DrawerClose asChild>
                  <Button type="button" variant="outline">
                    Batal
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default MemberClaimDialog;
