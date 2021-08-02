import React from 'react';
import { AppHeader } from "../Header/Header";
import { ToastContainer } from 'react-toastify';

interface IProfileProps {
    elements: JSX.Element[];
}

const Profile: React.FC<IProfileProps> = ({
    elements
}) => {
    return (
        <div className="Profile-container">
            <AppHeader />
            <div className="Profile">
                {elements.map(element => element)}
                <ToastContainer />
            </div>
        </div>
    );
}

export default Profile;