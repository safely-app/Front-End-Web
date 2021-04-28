import React from 'react';

interface ITextInputProps {
    label: string;
    value: string;
    setValue: (value: string) => void;
}

const TextInput: React.FC<ITextInputProps> = ({ label, value, setValue }) => {

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value);
    };

    return (
        <div>
            <label>{label} :</label>
            <input value={value} onChange={handleInput} />
        </div>
    );
}

export default TextInput;