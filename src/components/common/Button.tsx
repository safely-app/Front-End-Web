import React from 'react';
import './index.css';

interface IButtonProps {
    text: string;
    onClick: () => void;
    width?: string;
    type?: string;
    className?: string
    onMouseOver?: () => void;
    onMouseOut?: () => void;
    disabled?: boolean;
    hidden?: boolean;
}

const Button: React.FC<IButtonProps> = ({
    text,
    onClick,
    width,
    type,
    onMouseOver,
    onMouseOut,
    disabled,
    hidden
}) => {

    const styles = {
        "default": "btn",
        "link": "btn-link",
        "warning": "btn-warning"
    };

    const handleClick = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        onClick();
    };

    const handleMouseOver = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (onMouseOver !== undefined) onMouseOver();
    };

    const handleMouseOut = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (onMouseOut !== undefined) onMouseOut();
    };

    return (
        <div hidden={hidden !== undefined ? hidden : false}>
            <button
                className={type !== undefined ? styles[type] : "btn"}
                style={{ width: width !== undefined ? width : "60%" }}
                data-testid={`${text}-button-id`}
                onClick={handleClick}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                disabled={disabled !== undefined ? disabled : false}
            >
                {text}
            </button>
        </div>
    );

}

export default Button;