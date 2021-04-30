import React, { useState } from 'react';
import { AppHeader } from '../Header/Header';
import { TextInput, Button } from '../common';
import './Authentication.css';

const Authentication: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <AppHeader />
            <div className="Authentication">
                <TextInput type='email' label='Username' value={username} setValue={setUsername} />
                <TextInput type='password' label='Password' value={password} setValue={setPassword} />
                <Button text='Connect' onClick={() => {}} />
            </div>
        </div>
    );
}

export default Authentication;