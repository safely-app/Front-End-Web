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
        (shown === true) ?
            <div className="modal">
                {content}
            </div> : <div />
    );
};

export default Modal;