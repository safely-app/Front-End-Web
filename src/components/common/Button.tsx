import React from 'react';
import './index.css';

interface IButtonProps {
    text: string;
    onClick: () => void;
    type?: string;
}

const Button: React.FC<IButtonProps> = ({
    text,
    onClick,
    type
}) => {

    const types = {
        "default": "btn",
        "link": "btn-link",
        "warning": "btn-warning"
    };

    const handleClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onClick();
    };

    return (
        <div>
            <button
                className={type !== undefined ? types[type] : "btn"}
                onClick={handleClick}
            >
                {text}
            </button>
        </div>
    );

}

export default Button;