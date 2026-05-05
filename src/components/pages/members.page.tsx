import { useState } from 'react';
import { Section } from '../atoms/section';
import { now } from '@/utils/date';
import GenerationTabs from '../molecules/generation-tabs';
import { supabase } from '@/lib/supabase';
import {
  useDeleteMutation,
  useQuery,
  useUpdateMutation,
  useUpsertMutation,
} from '@supabase-cache-helpers/postgrest-react-query';
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/avatar';
import { getInitial, getRandomString } from '@/utils/string';
import {
  CircleIcon,
  CircleOffIcon,
  CopyIcon,
  Edit2Icon,
  MoreHorizontalIcon,
  TicketMinusIcon,
  Trash2Icon,
  UnlinkIcon,
  UserIcon,
} from 'lucide-react';
import { Button } from '../atoms/button';
import Protected from '../molecules/protected';
import { ButtonGroup } from '../atoms/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../atoms/dropdown-menu';
import dialogStore from '@/stores/dialog.store';
import MemberCreateDialog from '../organisms/dialogs/member-create.dialog';
import MemberUpdateDialog from '../organisms/dialogs/member-update.dialog';
import { toast } from 'sonner';
import type { Generation } from '@/data/options/generations.option';
import { LoadingOverlay } from '../atoms/loading';
import { copyText } from '@/utils/misc';
import { AspectRatio } from '../atoms/aspect-ratio';

const MembersPage = () => {
  const { openDialog, openConfirmDialog } = dialogStore();
  const [generation, setGeneration] = useState<Generation>(
    now().format('YYYY') as Generation
  );

  const query = supabase
    .from('members')
    .select('*, member_claims(code, exp)')
    .eq('generation', generation);

  const members = useQuery(query.order('created_at')),
    deleteMember = useDeleteMutation(supabase.from('members'), ['id'], 'id'),
    updateMember = useUpdateMutation(supabase.from('members'), ['id']),
    createMemberClaim = useUpsertMutation(supabase.from('member_claims'), [
      'member_id',
    ]);

  const _deleteMember = (item: NonNullable<typeof members.data>[number]) => {
    openConfirmDialog({
      title: `Hapus "${item.name}"?`,
      description: '',
      confirmVariant: 'destructive',
      onConfirm() {
        toast.promise(deleteMember.mutateAsync({ id: item.id! }), {
          loading: 'Menghapus anggota...',
          success: 'Anggota dihapus',
        });
      },
    });
  };

  const _createClaimCode = (item: NonNullable<typeof members.data>[number]) => {
    openConfirmDialog({
      title: `Buat Kode Klaim "${item.name}"?`,
      description: 'Kode klaim berlaku hingga 12 jam setelah dibuat',
      onConfirm() {
        toast.promise(
          createMemberClaim.mutateAsync(
            [
              {
                member_id: item.id,
                code: getRandomString(7),
                exp: now().add(12, 'hours').toISOString(),
              },
            ],
            {
              onSuccess() {
                members.refetch();
              },
            }
          ),
          {
            loading: 'Membuat kode klaim...',
            success: 'Kode dibuat',
          }
        );
      },
    });
  };

  const _disconnectUser = (item: NonNullable<typeof members.data>[number]) => {
    openConfirmDialog({
      title: `Hapus akun "${item.name}"?`,
      description: 'Penautan akun akan dilepas dari anggota ini',
      confirmVariant: 'destructive',
      onConfirm() {
        toast.promise(
          updateMember.mutateAsync({
            id: item.id,
            user_id: null,
          }),
          {
            loading: 'Melepas penautan akun...',
            success: 'Akun dilepas',
          }
        );
      },
    });
  };

  const _copyClaimCode = (item: NonNullable<typeof members.data>[number]) => {
    if (item.member_claims?.code)
      copyText(item.member_claims.code, 'Kode disalin');
  };

  return (
    <>
      <MemberCreateDialog />
      <MemberUpdateDialog />

      <Section className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="typo-heading-lg">Anggota</h2>
            <GenerationTabs value={generation} onValueChange={setGeneration} />
          </div>
          <Protected isStaff protect="null">
            <ButtonGroup>
              <Button
                onClick={() =>
                  openDialog('member_create', { generation: generation })
                }
              >
                Tambah
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size={'icon'}>
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      Untuk semua anggota {generation}
                    </DropdownMenuLabel>
                    <DropdownMenuItem>
                      <CircleIcon /> Aktifkan
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive">
                      <CircleOffIcon /> Nonaktifkan
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </Protected>
        </div>

        <div className="relative mt-6 grid min-h-16 grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-12">
          {members.isLoading && <LoadingOverlay />}

          {members.data?.map((item, i) => (
            <div key={i} className="group flex flex-col items-center">
              <div className="mb-3 w-3/4 transition-transform group-hover:scale-110 group-hover:rotate-6 group-hover:drop-shadow-xl">
                <AspectRatio ratio={1 / 1}>
                  <Avatar className="border-primary h-full w-full border-4">
                    <AvatarImage src={item.avatar_url ?? ''} />
                    <AvatarFallback>{getInitial(item.name)}</AvatarFallback>
                  </Avatar>
                </AspectRatio>
              </div>
              <p className="typo-body-lg line-clamp-2 text-center">
                {item.name}
              </p>
              <p className="typo-caption text-muted-foreground mb-1 line-clamp-1 text-center">
                {item.role}
              </p>
              <ButtonGroup>
                <Button size={'sm'} variant={'secondary'}>
                  Lihat
                </Button>
                <Protected isStaff protect="null">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={'icon-sm'} variant={'secondary'}>
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <UserIcon /> Akun
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuLabel>
                                Penautan akun
                              </DropdownMenuLabel>
                              {item.user_id ? (
                                <DropdownMenuItem
                                  variant="destructive"
                                  disabled={!item.user_id}
                                  onClick={() => _disconnectUser(item)}
                                >
                                  <UnlinkIcon /> Lepaskan akun
                                </DropdownMenuItem>
                              ) : (
                                <>
                                  <DropdownMenuItem
                                    disabled={!!item.user_id}
                                    onClick={() => _createClaimCode(item)}
                                  >
                                    <TicketMinusIcon /> Buat kode klaim{' '}
                                    {item.member_claims?.code && 'baru'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    disabled={
                                      !item.member_claims?.code ||
                                      !!item.user_id
                                    }
                                    onClick={() => _copyClaimCode(item)}
                                  >
                                    <CopyIcon /> Copy kode klaim
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem
                          onClick={() =>
                            openDialog('member_update', { id: item.id })
                          }
                        >
                          <Edit2Icon /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => _deleteMember(item)}
                        >
                          <Trash2Icon /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Protected>
              </ButtonGroup>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
};

export default MembersPage;
