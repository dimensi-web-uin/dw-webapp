import { ChevronDownIcon, CheckIcon, Loader2, XIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/utils/misc';
import { Button } from '@/components/atoms/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/atoms/command';

export type SearchSelectProps<T> = {
  placeholder?: string;
  value?: T;
  keyValue: keyof T;
  keyLabel?: keyof T;
  prefetch?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  buildLabel?: (item: T) => string;
  data: (query: string) => Promise<T[]>;
  onChange: (item?: T) => void;
};

const SearchSelect = <T,>({
  placeholder = 'Pilih',
  value,
  keyValue,
  keyLabel,
  prefetch,
  isLoading,
  disabled,
  buildLabel,
  data,
  onChange,
}: SearchSelectProps<T>) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<T[]>([]);
  const [localValue, setLocalValue] = useState(value);
  const [loading, setLoading] = useState(false);

  const renderLabel = useMemo(() => {
    if (buildLabel) return buildLabel;
    if (keyLabel) return (item: T) => String(item[keyLabel]);
    return () => '';
  }, [buildLabel, keyLabel]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getResults = async () => {
    if (disabled) return;

    setLoading(true);

    try {
      const results = await data(input);
      setOptions(results);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!input) {
      setOptions([]);
      return;
    }

    const delay = setTimeout(getResults, 400);
    return () => clearTimeout(delay);
  }, [input]);

  useEffect(() => {
    if (open && prefetch) getResults();
  }, [open]);

  const handleChange = (item?: T) => {
    setLocalValue(item);
    onChange(item);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          {localValue ? (
            <span className="flex w-full items-center justify-between gap-2">
              <span className="truncate">{renderLabel(localValue)}</span>

              <XIcon
                className="h-4 w-4 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange(undefined);
                }}
              />
            </span>
          ) : (
            <>
              <span className="text-muted-foreground">{placeholder}</span>
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cari..."
            value={input}
            onValueChange={setInput}
          />

          <CommandList>
            {(loading || isLoading) && (
              <div className="flex items-center gap-2 px-3 py-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            )}

            {!loading && !options.length && input && (
              <CommandEmpty>Hasil tidak ditemukan.</CommandEmpty>
            )}

            <CommandGroup>
              {!loading &&
                !isLoading &&
                options.map((item) => {
                  const selected = localValue?.[keyValue] === item[keyValue];

                  return (
                    <CommandItem
                      key={String(item[keyValue])}
                      value={String(item[keyValue])}
                      onSelect={() => {
                        handleChange(item);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          selected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {renderLabel(item)}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { SearchSelect };
