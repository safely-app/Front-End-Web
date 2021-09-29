import React from 'react';
import './index.css';

interface IButtonProps {
    text: string;
    onClick: () => void;
    width?: string;
    type?: string;
    disabled?: boolean;
}

const Button: React.FC<IButtonProps> = ({
    text,
    onClick,
    width,
    type,
    disabled
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
                style={{ width: width !== undefined ? width : "60%" }}
                onClick={handleClick}
                disabled={disabled !== undefined ? disabled : false}
            >
                {text}
            </button>
        </div>
    );

}

export default Button;