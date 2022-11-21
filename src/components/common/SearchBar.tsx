import React, { useRef, useState } from 'react';
import {
  FaPlus,
  FaPlusCircle,
  FaSearch
} from 'react-icons/fa';
import './index.css';

const SearchBar: React.FC<{
  textSearch: string;
  placeholder: string;
  setTextSearch: (value: string) => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>, ref: React.MutableRefObject<any>) => void;
  openCreateModal: () => void;
  noCreate?: boolean;
}> = ({
  textSearch,
  placeholder,
  setTextSearch,
  onInputFocus,
  onInputBlur,
  onKeyDown,
  openCreateModal,
  noCreate
}) => {
  const searchBarInput = useRef(null);
  const [isMouseOn, setIsMouseOut] = useState(false);

  return (
    <div className='inline-block flex'>
      <div className='relative'>
        <div className='invisible text-sm h-0 pr-6'>{placeholder}</div>
        <input
          ref={searchBarInput}
          className='text-sm min-w-52 w-full border-b-2 border-solid border-blue-400 bg-neutral-100'
          placeholder={placeholder}
          value={textSearch}
          onKeyDown={(event) => onKeyDown !== undefined ? onKeyDown(event, searchBarInput) : {}}
          onChange={(event) => setTextSearch(event.target.value)}
          onFocus={() => onInputFocus !== undefined ? onInputFocus() : {}}
          onBlur={() => onInputBlur !== undefined ? onInputBlur() : {}}
        />
        <button className='absolute right-1 top-1'><FaSearch className='text-blue-400' /></button>
      </div>
      <button hidden={noCreate} className='ml-3' onClick={() => openCreateModal()} onMouseEnter={() => setIsMouseOut(true)} onMouseLeave={() => setIsMouseOut(false)}>
        {isMouseOn ? <FaPlusCircle className='w-6 h-6 text-blue-400' /> : <FaPlus className='ml-1 w-4 h-4 text-blue-400' />}
      </button>
    </div>
  );
};

export default SearchBar;