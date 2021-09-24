import React from 'react';
import './index.css';

interface IDropdownProps {
    values: string[];
    setValue: (value: string) => void;
    defaultValue?: string;
    width?: string;
}

const Dropdown: React.FC<IDropdownProps> = ({
    values,
    setValue,
    defaultValue,
    width
}) => {
    const handleInput = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setValue(e.target.value);
    };

    return (
        <span className="dropdown-container" style={{ width: width !== undefined ? width : '60%' }}>
            <select data-testid={`${values[0]}-dropdown-id`} onChange={handleInput} defaultValue={defaultValue}>
                {values.map((value, index) => {
                    return (
                        <option key={index} value={value}>
                            {value}
                        </option>
                    );
                })}
            </select>
        </span>
    );
};

export default Dropdown;