import { useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../atoms/input-group';
import { SearchIcon } from 'lucide-react';

const SearchInput = ({
  placeholder = 'Cari...',
  onEnter,
}: {
  placeholder?: string;
  onEnter: (v: string) => void;
}) => {
  const [value, setValue] = useState('');

  return (
    <form
      className="grow"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEnter) onEnter(value);
      }}
    >
      <InputGroup>
        <InputGroupInput
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};

export default SearchInput;
