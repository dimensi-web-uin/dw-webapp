import { useNavigate, useParams } from 'react-router-dom';
import { Section } from '../atoms/section';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../atoms/breadcrumb';
import {
  useDeleteMutation,
  useQuery,
} from '@supabase-cache-helpers/postgrest-react-query';
import { supabase } from '@/lib/supabase';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../atoms/item';
import { formatTime, now } from '@/utils/date';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../atoms/card';
import { getOption } from '@/utils/option';
import { LogoIcon } from '@/data/options/logo-icons.option';
import LessonItemsNavigation from '../molecules/lessonitems-navigation';
import GenerationTabs from '../molecules/generation-tabs';
import type { Generation } from '@/data/options/generations.option';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../atoms/avatar';
import { getInitial } from '@/utils/string';
import Protected from '../molecules/protected';
import { Button } from '../atoms/button';
import {
  Edit2Icon,
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import LessonItemParticipantCreateDialog from '../organisms/dialogs/lessonitemparticipant-create.dialog';
import dialogStore from '@/stores/dialog.store';
import { LoadingOverlay } from '../atoms/loading';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../atoms/dropdown-menu';
import { toast } from 'sonner';

const LessonItemPage = () => {
  const nav = useNavigate();
  const { lesson_id, id } = useParams<{ lesson_id: string; id: string }>();
  const { openDialog, openConfirmDialog } = dialogStore();
  const [generation, setGeneration] = useState<Generation>(
    now().format('YYYY') as Generation
  );

  const lessonItem = useQuery(
      supabase
        .from('lesson_items')
        .select('*, lessons(id, title), members(id, name, role)')
        .eq('id', id!)
        .maybeSingle()
    ),
    lessonItems = useQuery(
      supabase
        .from('lesson_items')
        .select('id, icon, title, order')
        .eq('lesson_id', lesson_id!)
        .order('order', { ascending: true }),
      {
        enabled: !!lesson_id,
      }
    ),
    lessonItemParticipants = useQuery(
      supabase
        .from('lesson_item_participants')
        .select(
          'id, activity_count, feedback, quiz_points, members!inner(id, name, avatar_url, role)'
        )
        .eq('members.generation', generation)
        .eq('lesson_item_id', id!)
    ),
    deleteLessonItemParticipant = useDeleteMutation(
      supabase.from('lesson_item_participants'),
      ['id'],
      'id'
    );

  const _deleteLessonItemParticipant = (
    item: NonNullable<typeof lessonItemParticipants.data>[number]
  ) => {
    openConfirmDialog({
      title: `Hapus "${item.members.name}"?`,
      description: '',
      confirmVariant: 'destructive',
      onConfirm() {
        toast.promise(
          deleteLessonItemParticipant.mutateAsync({ id: item.id! }),
          {
            loading: 'Menghapus partisipan...',
            success: 'Partisipan dihapus',
          }
        );
      },
    });
  };

  return (
    <>
      {(lessonItem.isLoading ||
        lessonItems.isLoading ||
        lessonItemParticipants.isLoading) && <LoadingOverlay />}

      <LessonItemParticipantCreateDialog
        onSuccess={() => lessonItemParticipants.refetch()}
      />

      <Section>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/lessons">Belajar</BreadcrumbLink>
            </BreadcrumbItem>
            {lessonItem.data?.lessons && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/lessons/${lessonItem.data.lessons.id}`}
                  >
                    {lessonItem.data.lessons.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{lessonItem.data?.title ?? ''}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6">
          {!!lesson_id && (
            <LessonItemsNavigation
              activeId={id!}
              items={lessonItems.data ?? []}
              onPrev={(id) => nav(`/lessons/${lesson_id}/items/${id}`)}
              onNext={(id) => nav(`/lessons/${lesson_id}/items/${id}`)}
            />
          )}
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-12">
          <div className="w-full lg:w-2/3">
            {lessonItem.data?.file_url && (
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe src={lessonItem.data.file_url} className="size-full" />
              </div>
            )}
            <Card className="mt-3">
              <CardHeader>
                <CardTitle>{lessonItem.data?.title}</CardTitle>
                <CardDescription>
                  {lessonItem.data?.description ?? ''}
                </CardDescription>
                <CardAction>
                  <img
                    src={
                      getOption(
                        LogoIcon,
                        lessonItem.data?.icon as LogoIcon | undefined
                      )?.meta?.logo
                    }
                    className="size-8"
                  />
                </CardAction>
              </CardHeader>
            </Card>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-1/3">
            <small className="typo-overline">Pemateri</small>
            <Item variant={'card'}>
              <ItemContent>
                <ItemDescription>Nama</ItemDescription>
                <ItemTitle>
                  {lessonItem.data?.author_name ??
                    lessonItem.data?.members?.name ??
                    '-'}
                </ItemTitle>
              </ItemContent>
            </Item>
            <Item variant={'card'}>
              <ItemContent>
                <ItemDescription>Jabatan</ItemDescription>
                <ItemTitle>
                  {lessonItem.data?.author_role ??
                    lessonItem.data?.members?.role ??
                    '-'}
                </ItemTitle>
              </ItemContent>
            </Item>

            <div className="mt-3">
              <small className="typo-overline">Link</small>
            </div>

            <Item variant={'card'}>
              <ItemContent>
                <ItemDescription>Online meet</ItemDescription>
                <ItemTitle className="break-all">
                  {lessonItem.data?.meet_url ?? '-'}
                </ItemTitle>
              </ItemContent>
            </Item>
            <Item variant={'card'}>
              <ItemContent>
                <ItemDescription>Kuis</ItemDescription>
                <ItemTitle className="break-all">
                  {lessonItem.data?.quiz_url ?? '-'}
                </ItemTitle>
              </ItemContent>
            </Item>
            <Item variant={'card'}>
              <ItemContent>
                <ItemDescription>Live streaming</ItemDescription>
                <ItemTitle className="break-all">-</ItemTitle>
              </ItemContent>
            </Item>

            <div className="mt-3">
              <small className="typo-overline">Metadata</small>
            </div>

            <Item variant={'card'}>
              <ItemContent>
                <ItemDescription>Dibuat</ItemDescription>
                <ItemTitle>
                  {formatTime(
                    lessonItem.data?.created_at,
                    'DD MMM YYYY HH:mm A'
                  )}
                </ItemTitle>
              </ItemContent>
            </Item>
            <Item variant={'card'}>
              <ItemContent>
                <ItemDescription>Diperbarui</ItemDescription>
                <ItemTitle>
                  {formatTime(
                    lessonItem.data?.updated_at,
                    'DD MMM YYYY HH:mm A'
                  )}
                </ItemTitle>
              </ItemContent>
            </Item>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="typo-heading-lg">Partisipan</h2>
        <GenerationTabs value={generation} onValueChange={setGeneration} />

        <div className="mt-6 flex flex-col gap-3">
          {lessonItemParticipants.data?.map((item, i) => (
            <Item key={i} variant={'card'}>
              <ItemMedia>
                <Avatar className="size-12">
                  <AvatarImage src={item.members.avatar_url ?? ''} />
                  <AvatarFallback>
                    {getInitial(item.members.name)}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{item.members.name}</ItemTitle>
                <ItemDescription>{item.members.role}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Protected isStaff protect="null">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={'icon-sm'}>
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-40">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() =>
                            openDialog('lessonitemparticipant_update', {
                              id: item.id,
                            })
                          }
                        >
                          <Edit2Icon /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => _deleteLessonItemParticipant(item)}
                        >
                          <Trash2Icon /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Protected>
              </ItemActions>
            </Item>
          ))}

          <Protected isStaff protect="null">
            <div>
              <Button
                variant={'secondary'}
                onClick={() =>
                  openDialog('lessonitemparticipant_create', {
                    lesson_item_id: id!,
                    generation: generation,
                  })
                }
              >
                <PlusIcon /> Tambah partisipan
              </Button>
            </div>
          </Protected>
        </div>
      </Section>

      <Section>
        <div>
          {!!lesson_id && (
            <LessonItemsNavigation
              activeId={id!}
              items={lessonItems.data ?? []}
              onPrev={(id) => nav(`/lessons/${lesson_id}/items/${id}`)}
              onNext={(id) => nav(`/lessons/${lesson_id}/items/${id}`)}
            />
          )}
        </div>
      </Section>
    </>
  );
};

export default LessonItemPage;
