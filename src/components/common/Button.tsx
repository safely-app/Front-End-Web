import React from 'react';
import './index.css';

interface IButtonProps {
    text: string;
    onClick: () => void;
    width?: string;
    styleType?: string;
}

const Button: React.FC<IButtonProps> = ({
    text,
    onClick,
    width,
    styleType
}) => {

    const styles = {
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
                className={styleType !== undefined ? styles[styleType] : "btn"}
                style={{ width: width !== undefined ? width : "60%" }}
                data-testid={`${text}-button-id`}
                onClick={handleClick}
            >
                {text}
            </button>
        </div>
    );

}

export default Button;