import { Edit2Icon, LogOutIcon } from 'lucide-react';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../atoms/item';
import { Section } from '../atoms/section';
import { useAuth } from '@/contexts/auth.context';
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/avatar';
import { getInitial } from '@/utils/string';
import { now } from '@/utils/date';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '../atoms/empty';
import { Button } from '../atoms/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../atoms/card';
import GenerationTabs from '../molecules/generation-tabs';
import type { Generation } from '@/data/options/generations.option';
import MemberClaimDialog from '../organisms/dialogs/member-claim.dialog';
import dialogStore from '@/stores/dialog.store';

const ProfilePage = () => {
  const { openDialog } = dialogStore();
  const { profile, signOut, user } = useAuth();
  const [generation, setGeneration] = useState<Generation>(
    now().format('YYYY') as Generation
  );

  const member = useQuery(
    supabase
      .from('members')
      .select('*')
      .eq('generation', generation)
      .eq('user_id', user?.id ?? '')
      .maybeSingle(),
    { enabled: !!user?.id }
  );

  return (
    <>
      <MemberClaimDialog onSuccess={() => member.refetch()} />

      <Section className="gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h4 className="typo-heading-sm me-auto">Keanggotaan</h4>
          <GenerationTabs value={generation} onValueChange={setGeneration} />
          <Button size="sm" onClick={() => openDialog('member_claim')}>
            Klaim anggota
          </Button>
        </div>

        {member.data ? (
          <Card>
            <CardContent className="flex flex-wrap items-center gap-6">
              <div className="relative size-24">
                <Avatar className="size-full *:rounded-lg">
                  <AvatarImage src={member.data.avatar_url ?? ''} />
                  <AvatarFallback>
                    {getInitial(member.data.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size={'icon-sm'}
                  className="absolute -right-2 -bottom-2"
                >
                  <Edit2Icon />
                </Button>
              </div>
              <div className="grow">
                <h4 className="typo-heading-sm">{member.data.name}</h4>
                <p className="typo-body-md text-muted-foreground">
                  {member.data.role}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Kamu Belum Terdaftar</EmptyTitle>
              <EmptyDescription>
                Data keanggotaan untuk tahun {generation} belum tersedia. Jangan
                sampai ketinggalan, yuk registrasi sekarang!
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
              <Button size="sm" asChild>
                <Link to={'#'}>Daftar</Link>
              </Button>
              <Button size="sm" variant={'outline'} asChild>
                <a href={'#contacts'}>Hubungi Kontak</a>
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </Section>

      <Section className="gap-3">
        <h4 className="typo-heading-sm">Akun</h4>

        <Item variant="outline">
          <ItemMedia>
            <Avatar className="*:rounded-md">
              <AvatarImage src={profile?.avatarUrl} />
              <AvatarFallback>{getInitial(profile?.name)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{profile?.name}</ItemTitle>
            <ItemDescription>{profile?.email}</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" className="text-destructive" asChild>
          <a href="#" onClick={signOut}>
            <ItemMedia>
              <LogOutIcon className="size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Logout</ItemTitle>
            </ItemContent>
          </a>
        </Item>
      </Section>
    </>
  );
};

export default ProfilePage;
