import React from 'react';
import './index.css';

interface ITextInputProps {
    type: string;
    role: string;
    label: string;
    value: string;
    setValue: (value: string) => void;
    readonly?: boolean;
}

const TextInput: React.FC<ITextInputProps> = ({
    type,
    role,
    label,
    value,
    setValue,
    readonly
}) => {

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value);
    };

    return (
        <div>
            <input
                type={type}
                role={role}
                value={value}
                placeholder={label}
                onChange={handleInput}
                readOnly={readonly !== undefined ? readonly : false}
            />
        </div>
    );
}

export default TextInput;