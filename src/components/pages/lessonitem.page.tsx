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
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { supabase } from '@/lib/supabase';
import { Item, ItemContent, ItemDescription, ItemTitle } from '../atoms/item';
import { formatTime } from '@/utils/date';
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

const LessonItemPage = () => {
  const nav = useNavigate();
  const { lesson_id, id } = useParams<{ lesson_id: string; id: string }>();

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
    );

  return (
    <>
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
