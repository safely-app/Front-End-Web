import React from 'react';
import { ToastContainer } from 'react-toastify';
import './index.css';

interface IProfileProps {
    elements: JSX.Element[];
}

const Profile: React.FC<IProfileProps> = ({
    elements
}) => {
    return (
        <div className="Profile">
            {elements.map((element, index) =>
                <li key={index} style={{ listStyleType: "none" }}>
                    {element}
                </li>
            )}
            <ToastContainer />
        </div>
    );
}

export default Profile;