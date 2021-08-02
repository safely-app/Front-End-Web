import React from 'react';
import './index.css';
import TextInput from './TextInput';

interface ISearchBarProps {
    label: string;
    value: string;
    setValue: (value: string) => void;
}

const SearchBar: React.FC<ISearchBarProps> = ({
    label,
    value,
    setValue
}) => {

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value);
    };

    return <TextInput
        type="text"
        role="search-bar"
        label={label}
        value={value}
        setValue={setValue}
        width="98%"
    />;
}

export default SearchBar;