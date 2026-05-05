import { useMemo, useState, type ComponentProps } from 'react';

interface TruncatedTextProps extends ComponentProps<'p'> {
  children: string;
  maxLength?: number;
  showMoreLabel?: string;
  showLessLabel?: string;
  hideButton?: boolean;
}

const TruncatedText = ({
  children,
  maxLength = 140,
  showMoreLabel = 'Tampilkan',
  showLessLabel = 'Sembunyikan',
  hideButton = false,
  ...props
}: TruncatedTextProps) => {
  const [expanded, setExpanded] = useState(false);

  const { isTruncated, displayText } = useMemo(() => {
    if (children.length <= maxLength) {
      return { isTruncated: false, displayText: children };
    }

    return {
      isTruncated: true,
      displayText: `${children.slice(0, maxLength)}...`,
    };
  }, [children, maxLength]);

  if (!isTruncated) {
    return <p {...props}>{children}</p>;
  }

  return (
    <p {...props}>
      {expanded ? children : displayText}{' '}
      {!hideButton && (
        <button
          type="button"
          className="text-primary underline"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </p>
  );
};

export { TruncatedText };
