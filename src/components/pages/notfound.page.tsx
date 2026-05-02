import { IlusNotfound } from '@/assets/images';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../atoms/empty';
import { Button } from '../atoms/button';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex size-full min-h-svh flex-col pb-24">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="default">
            <img src={IlusNotfound} className="w-full" />
          </EmptyMedia>
          <EmptyTitle>Tidak Ditemukan</EmptyTitle>
          <EmptyDescription>
            Halaman yang kamu coba cari tidak ada.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" asChild>
            <Link to={'/'}>
              <HomeIcon />
              Kembali
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default NotFoundPage;
