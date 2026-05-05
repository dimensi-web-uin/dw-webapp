import dialogStore from '@/stores/dialog.store';
import { Button } from '../atoms/button';
import { Section } from '../atoms/section';
import Protected from '../molecules/protected';
import LessonCreateDialog from '../organisms/dialogs/lesson-create.dialog';
import { supabase } from '@/lib/supabase';
import {
  useDeleteMutation,
  useQuery,
} from '@supabase-cache-helpers/postgrest-react-query';
import { toast } from 'sonner';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../atoms/card';
import { Badge } from '../atoms/badge';
import { LoadingOverlay } from '../atoms/loading';
import { ButtonGroup } from '../atoms/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../atoms/dropdown-menu';
import { Edit2Icon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import LessonUpdateDialog from '../organisms/dialogs/lesson-update.dialog';
import { TruncatedText } from '../molecules/truncated-text';

const LessonsPage = () => {
  const { openDialog, openConfirmDialog } = dialogStore();

  const query = supabase
    .from('lessons')
    .select('*, count_items:lesson_items(count)');

  const lessons = useQuery(query.order('created_at', { ascending: false })),
    deleteLesson = useDeleteMutation(supabase.from('lessons'), ['id'], 'id');

  const _deleteLesson = (item: NonNullable<typeof lessons.data>[number]) => {
    openConfirmDialog({
      title: `Hapus "${item.title}"?`,
      description: '',
      confirmVariant: 'destructive',
      onConfirm() {
        toast.promise(deleteLesson.mutateAsync({ id: item.id! }), {
          loading: 'Menghapus kurikulum...',
          success: 'Kurikulum dihapus',
        });
      },
    });
  };

  return (
    <>
      <LessonCreateDialog />
      <LessonUpdateDialog />

      <Section className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="typo-heading-lg">Kurikulum Pembelajaran</h2>
            <p className="text-muted-foreground typo-body-md">
              Akses materi belajar yang dikembangkan oleh tim kami.
            </p>
          </div>
          <Protected isStaff protect="null">
            <Button onClick={() => openDialog('lesson_create')}>Tambah</Button>
          </Protected>
        </div>

        <div className="relative mt-6 grid min-h-16 grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
          {lessons.isLoading && <LoadingOverlay />}

          {lessons.data?.map((item, i) => (
            <Card key={i} className="relative w-full">
              <img
                src="https://avatar.vercel.sh/shadcn1"
                className="relative aspect-video w-full object-cover"
              />
              <CardHeader>
                <CardAction>
                  <Badge variant="secondary">
                    {item.count_items.at(0)?.count ?? 0} materi
                  </Badge>
                </CardAction>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  <TruncatedText maxLength={100} hideButton>
                    {item.description ?? ''}
                  </TruncatedText>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <ButtonGroup className="w-full">
                  <Button className="grow" asChild>
                    <Link to={'/lessons/' + item.id}>Buka</Link>
                  </Button>
                  <Protected isStaff protect="null">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={'icon'}>
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() =>
                              openDialog('lesson_update', { id: item.id })
                            }
                          >
                            <Edit2Icon /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => _deleteLesson(item)}
                          >
                            <Trash2Icon /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Protected>
                </ButtonGroup>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
};

export default LessonsPage;
