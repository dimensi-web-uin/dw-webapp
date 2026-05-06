import { supabase } from '@/lib/supabase';
import {
  useDeleteMutation,
  useQuery,
} from '@supabase-cache-helpers/postgrest-react-query';
import { Link, useParams } from 'react-router-dom';
import { Section } from '../atoms/section';
import { LoadingOverlay } from '../atoms/loading';
import { TruncatedText } from '../molecules/truncated-text';
import Protected from '../molecules/protected';
import { Button } from '../atoms/button';
import dialogStore from '@/stores/dialog.store';
import LessonItemCreateDialog from '../organisms/dialogs/lessonitem-create.dialog';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from '../atoms/item';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Edit2Icon,
  MoreHorizontalIcon,
  PlayIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import { ButtonGroup } from '../atoms/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../atoms/dropdown-menu';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../atoms/breadcrumb';
import { Badge } from '../atoms/badge';
import { LogoIcon } from '@/data/options/logo-icons.option';
import { getOption } from '@/utils/option';
import LessonItemUpdateDialog from '../organisms/dialogs/lessonitem-update.dialog';

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const { openDialog, openConfirmDialog } = dialogStore();

  const lesson = useQuery(
      supabase.from('lessons').select('*').eq('id', id!).maybeSingle()
    ),
    lessonItems = useQuery(
      supabase
        .from('lesson_items')
        .select('id, icon, title, order')
        .eq('lesson_id', id!)
        .order('order', { ascending: true })
    ),
    deleteLessonItem = useDeleteMutation(
      supabase.from('lesson_items'),
      ['id'],
      'id'
    );

  const _deleteLessonItem = (
    item: NonNullable<typeof lessonItems.data>[number]
  ) => {
    openConfirmDialog({
      title: `Hapus "${item.title}"?`,
      description: '',
      confirmVariant: 'destructive',
      onConfirm() {
        toast.promise(deleteLessonItem.mutateAsync({ id: item.id! }), {
          loading: 'Menghapus materi belajar...',
          success: 'Materi belajar dihapus',
        });
      },
    });
  };

  const _moveTopLessonItem = async (id: string) => {
    const items = lessonItems.data ?? [];
    const idx = items.findIndex((i) => i.id === id);
    if (idx <= 0) return;

    const newItems = [...items];
    const [moved] = newItems.splice(idx, 1);
    newItems.splice(idx - 1, 0, moved);

    const payload = newItems.map((item, i) => ({
      ...item,
      order: i + 1,
    }));

    await _reorder(payload);
  };

  const _moveBelowLessonItem = async (id: string) => {
    const items = lessonItems.data ?? [];
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1 || idx >= items.length - 1) return;

    const newItems = [...items];
    const [moved] = newItems.splice(idx, 1);
    newItems.splice(idx + 1, 0, moved);

    const payload = newItems.map((item, i) => ({
      ...item,
      order: i + 1,
    }));

    await _reorder(payload);
  };

  const _reorder = async (items: NonNullable<typeof lessonItems.data>) => {
    const loadingId = toast.loading('Memindahkan materi belajar');
    try {
      await supabase.rpc('reorder_lesson_items', {
        p_items: items,
      });
      lessonItems.refetch();
      toast.success('Materi belajar dipindahkan');
    } catch {
      toast.error('Gagal memindahkan materi belajar');
    } finally {
      toast.dismiss(loadingId);
    }
  };

  return (
    <>
      <LessonItemUpdateDialog />
      <LessonItemCreateDialog />

      {(lesson.isLoading || lessonItems.isLoading) && <LoadingOverlay />}

      <img
        src={lesson.data?.cover_url ?? 'https://avatar.vercel.sh/shadcn1'}
        className="relative h-40 w-full object-cover"
      />

      <Section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/lessons">Belajar</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{lesson.data?.title ?? ''}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Badge variant="secondary">
            {lessonItems.data?.length ?? 0} materi
          </Badge>
        </div>

        <h2 className="typo-heading-lg mt-3">{lesson.data?.title ?? ''}</h2>
        <TruncatedText
          maxLength={230}
          className="typo-body-md text-muted-foreground"
        >
          {lesson.data?.description ?? ''}
        </TruncatedText>

        <div className="mt-6 flex flex-col gap-3">
          {lessonItems.data?.map((item, i) => (
            <Item key={i} variant={'card'}>
              <ItemMedia>
                <img
                  src={
                    getOption(LogoIcon, item.icon as LogoIcon | undefined)?.meta
                      ?.logo
                  }
                  className="size-6"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <ButtonGroup>
                  <Button size={'sm'} asChild>
                    <Link to={`/lessons/${id}/items/${item.id}`}>
                      <PlayIcon className="fill-primary-foreground" />
                      Buka
                    </Link>
                  </Button>
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
                            onClick={() => _moveTopLessonItem(item.id)}
                          >
                            <ArrowUpIcon /> Pindah ke atas
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => _moveBelowLessonItem(item.id)}
                          >
                            <ArrowDownIcon /> Pindah ke bawah
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              openDialog('lessonitem_update', { id: item.id })
                            }
                          >
                            <Edit2Icon /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => _deleteLessonItem(item)}
                          >
                            <Trash2Icon /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Protected>
                </ButtonGroup>
              </ItemActions>
            </Item>
          ))}

          <Protected isStaff protect="null">
            <div>
              <Button
                variant={'secondary'}
                onClick={() =>
                  openDialog('lessonitem_create', {
                    lesson_id: id!,
                    order: (lessonItems.data?.length ?? 0) + 1,
                  })
                }
              >
                <PlusIcon /> Tambah materi belajar
              </Button>
            </div>
          </Protected>
        </div>
      </Section>
    </>
  );
};

export default LessonPage;
