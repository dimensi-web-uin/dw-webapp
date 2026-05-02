'use client';

import { cn } from '@/utils/misc';
import { type ComponentProps, useEffect, useRef, useState } from 'react';

const HeaderSticky = ({
  children,
  className,
  ...props
}: ComponentProps<'div'>) => {
  const [headerState, setHeaderState] = useState<'top' | 'up' | 'down'>('top');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setHeaderState('top');
      } else if (currentScrollY > lastScrollY.current) {
        setHeaderState('down');
      } else if (currentScrollY < lastScrollY.current) {
        setHeaderState('up');
      }

      lastScrollY.current = currentScrollY;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 *:transition-all *:duration-300',
        headerState === 'top' && '*:shadow-none',
        headerState === 'down' && '*:-translate-y-full',
        headerState === 'up' && '*:translate-y-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { HeaderSticky };
