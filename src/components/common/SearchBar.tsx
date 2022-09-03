import React, { useState } from 'react';
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
  openCreateModal: () => void;
}> = ({
  textSearch,
  placeholder,
  setTextSearch,
  openCreateModal
}) => {
  const [isMouseOn, setIsMouseOut] = useState(false);

  return (
    <div className='inline-block flex'>
      <div className='relative'>
        <div className='invisible text-sm h-0 pr-6'>{placeholder}</div>
        <input
          className='text-sm min-w-52 w-full border-b-2 border-solid border-blue-400 bg-neutral-100'
          placeholder={placeholder}
          value={textSearch}
          onChange={(event) => setTextSearch(event.target.value)}
        />
        <button className='absolute right-1 top-1'><FaSearch className='text-blue-400' /></button>
      </div>
      <button className='ml-3' onClick={() => openCreateModal()} onMouseEnter={() => setIsMouseOut(true)} onMouseLeave={() => setIsMouseOut(false)}>
        {isMouseOn ? <FaPlusCircle className='w-6 h-6 text-blue-400' /> : <FaPlus className='ml-1 w-4 h-4 text-blue-400' />}
      </button>
    </div>
  );
};

export default SearchBar;