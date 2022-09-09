import React from 'react';
import './index.css';

export const ModalBtn: React.FC<{
  content: string;
  warning?: boolean;
  onClick: () => void;
}> = ({
  content,
  warning,
  onClick
}) => {
  return (
    <button
      className={`block p-1 text-white text-sm rounded-lg w-48 mx-auto my-2 ${warning === true ? 'bg-red-400' : 'bg-blue-400'}`}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

interface IModalProps {
  shown: boolean;
  content: JSX.Element;
}

// TODO: remove component
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