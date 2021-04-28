import React, { useState } from 'react';
import { AppHeader } from '../Header/Header';
import { TextInput } from '../common';
import './Authentication.css';

const Authentication: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="Authentication">
            <AppHeader />
            <TextInput label='Username' value={username} setValue={setUsername} />
            <TextInput label='Password' value={password} setValue={setPassword} />
        </div>
    );
}

export default Authentication;