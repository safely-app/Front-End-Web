import React from 'react';
import {
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
  return (
    <div className='inline-block flex'>
      <div className='relative'>
        <input
          className='text-sm w-52 border-b-2 border-solid border-blue-400 bg-neutral-100'
          placeholder={placeholder}
          value={textSearch}
          onChange={(event) => setTextSearch(event.target.value)}
        />
        <button className='absolute right-1 top-1'><FaSearch className='text-blue-400' /></button>
      </div>
      <button className='ml-5' onClick={() => openCreateModal()}>
        <FaPlusCircle className='w-6 h-6 text-blue-400' />
      </button>
    </div>
  );
};

export default SearchBar;