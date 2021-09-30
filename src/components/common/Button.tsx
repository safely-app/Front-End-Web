import React from 'react';
import './index.css';

interface IButtonProps {
    text: string;
    onClick: () => void;
    width?: string;
    styleType?: string;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
}

const Button: React.FC<IButtonProps> = ({
    text,
    onClick,
    width,
    styleType,
    onMouseOver,
    onMouseOut
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
        <div>
            <button
                className={styleType !== undefined ? styles[styleType] : "btn"}
                style={{ width: width !== undefined ? width : "60%" }}
                data-testid={`${text}-button-id`}
                onClick={handleClick}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
            >
                {text}
            </button>
        </div>
    );

}

export default Button;