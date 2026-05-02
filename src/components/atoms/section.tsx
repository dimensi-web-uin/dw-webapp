import { cn } from '@/utils/misc';
import { type ComponentProps } from 'react';

const Section = ({
  className,
  children,
  ...props
}: ComponentProps<'section'>) => {
  return (
    <section
      className={cn(
        'mx-auto flex w-full max-w-6xl flex-col items-stretch px-6 py-16 sm:px-12',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};

export { Section };
