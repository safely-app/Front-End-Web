import React from 'react';
import './index.css';

interface IModalProps {
    shown: boolean;
    content: JSX.Element;
}

const Modal: React.FC<IModalProps> = ({
    shown,
    content
}) => {
    return (
        <div hidden={!shown} className="modal">
            {content}
        </div>
    );
};

export default Modal;