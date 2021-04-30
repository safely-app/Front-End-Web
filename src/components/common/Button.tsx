import React from 'react';
import './index.css';

interface IButtonProps {
    text: string;
    onClick: () => void;
}

const Button: React.FC<IButtonProps> = ({ text, onClick }) => {

    const handleClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onClick();
    };

    return (
        <button onClick={handleClick}>
            {text}
        </button>
    );

}

export default Button;