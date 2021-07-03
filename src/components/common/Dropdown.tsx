import React from 'react';
import './index.css';

interface IDropdownProps {
    values: string[];
    setValue: (value: string) => void;
    defaultValue?: string;
}

const Dropdown: React.FC<IDropdownProps> = ({
    values,
    setValue,
    defaultValue
}) => {
    const handleInput = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setValue(e.target.value);
    };

    return (
        <div>
            <select onChange={handleInput} defaultValue={defaultValue}>
                {values.map((value, index) => {
                    return (
                        <option key={index} value={value}>
                            {value}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default Dropdown;