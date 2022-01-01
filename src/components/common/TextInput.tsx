import React from 'react';
import './index.css';

interface ITextInputProps {
    type: string;
    role: string;
    label: string;
    value: string;
    setValue: (value: string) => void;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readonly?: boolean;
    width?: string;
}

const TextInput: React.FC<ITextInputProps> = ({
    type,
    role,
    label,
    value,
    setValue,
    onKeyPress,
    readonly,
    width
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
                onKeyPress={onKeyPress}
                readOnly={readonly !== undefined ? readonly : false}
                style={{ width: width !== undefined ? width : "60%" }}
                className="input"
            />
        </div>
    );
}

export default TextInput;