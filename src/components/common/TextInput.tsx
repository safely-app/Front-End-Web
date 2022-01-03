import React from 'react';
import './index.css';

interface ITextInputProps {
    name?: string
    type: string;
    role?: string;
    label?: string;
    value: string;
    setValue: (value: string) => void;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readonly?: boolean;
    required?: boolean;
    className?: string;
    width?: string;
    autoComplete?: string;
}

const TextInput: React.FC<ITextInputProps> = ({
    name,
    type,
    role,
    label,
    value,
    setValue,
    onKeyPress,
    readonly,
    required,
    className,
    autoComplete
}) => {

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value);
    };

    return (
        <div>
            <input
                name={name}
                type={type}
                role={role}
                value={value}
                placeholder={label}
                onChange={handleInput}
                onKeyPress={onKeyPress}
                readOnly={readonly !== undefined ? readonly : false}
                className={"mt-1 pt-1 pb-1 border-solid rounded font-l indent-2 w-3/5 " + className}
                autoComplete={autoComplete}
                required={required}
            />
        </div>
    );
}

export default TextInput;