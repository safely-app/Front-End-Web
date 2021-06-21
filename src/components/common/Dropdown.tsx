import React from 'react';
import './index.css';

interface IDropdownProps {
    values: string[];
    setValue: (value: string) => void;
}

const Dropdown: React.FC<IDropdownProps> = ({
    values,
    setValue
}) => {
    const handleInput = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setValue(e.target.value);
    };

    return (
        <div>
            <select onChange={handleInput}>
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