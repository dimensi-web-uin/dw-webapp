import { cn } from '@/utils/misc';
import { type ComponentProps } from 'react';
import { LoaderIcon } from 'lucide-react';

type LoadingOverlayProps = ComponentProps<'div'> & {
  text?: string;
};

const LoadingOverlay = ({
  text = 'Loading...',
  className,
  ...props
}: LoadingOverlayProps) => {
  return (
    <div
      className={cn(
        'bg-primary/10 absolute top-0 left-0 z-10 flex size-full p-4 backdrop-blur-xs',
        className
      )}
      {...props}
    >
      <div className="text-primary m-auto flex items-center gap-2">
        <LoaderIcon className="animate-spin" />
        <p>{text}</p>
      </div>
    </div>
  );
};

export { LoadingOverlay };
