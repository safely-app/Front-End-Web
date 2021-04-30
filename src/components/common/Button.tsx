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
        <div>
            <button onClick={handleClick}>
                {text}
            </button>
        </div>
    );

}

export default Button;