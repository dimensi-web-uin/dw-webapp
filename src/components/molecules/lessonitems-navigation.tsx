import type { Database } from '@/@types/supabase.type';
import { Button } from '../atoms/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const LessonItemsNavigation = ({
  activeId,
  items,
  onPrev,
  onNext,
}: {
  activeId: string;
  items: Pick<
    Database['public']['Tables']['lesson_items']['Row'],
    'id' | 'title' | 'order' | 'icon'
  >[];
  onPrev: (id: string) => void;
  onNext: (id: string) => void;
}) => {
  const _items = items.sort((a, b) => a.order - b.order),
    _activeItemIdx = _items.findIndex((item) => item.id == activeId);

  if (_activeItemIdx == -1) return;

  return (
    <div className="flex w-full flex-wrap justify-between gap-3">
      <div className="order-2 flex flex-col gap-1 sm:order-1">
        {_activeItemIdx > 0 && (
          <>
            <Button
              size={'sm'}
              onClick={() => {
                if (_items.at(_activeItemIdx - 1))
                  onPrev(_items[_activeItemIdx - 1].id);
              }}
            >
              <ChevronLeftIcon /> Sebelumnya
            </Button>
            <small className="typo-caption text-primary line-clamp-2">
              {_items.at(_activeItemIdx - 1)?.title}
            </small>
          </>
        )}
      </div>
      <div className="order-1 w-full sm:order-2 sm:w-auto">
        <h4 className="typo-heading-sm line-clamp-1 grow">
          {_items.at(_activeItemIdx)?.title ?? ''}
          lorem20
        </h4>
      </div>
      <div className="order-3 flex flex-col gap-1">
        {_activeItemIdx < _items.length - 1 && (
          <>
            <Button
              size={'sm'}
              onClick={() => {
                if (_items.at(_activeItemIdx + 1))
                  onNext(_items[_activeItemIdx + 1].id);
              }}
            >
              Berikutnya
              <ChevronRightIcon />
            </Button>
            <small className="typo-caption text-primary line-clamp-2 text-end">
              {_items.at(_activeItemIdx + 1)?.title}
            </small>
          </>
        )}
      </div>
    </div>
  );
};

export default LessonItemsNavigation;
