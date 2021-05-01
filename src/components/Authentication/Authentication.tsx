import React, { useState } from 'react';
import { AppHeader } from '../Header/Header';
import { TextInput, Button } from '../common';
import { Redirect } from 'react-router-dom';
import User from '../../services/User';
import './Authentication.css';

interface IAuthProps {
    setConnected: (value: boolean) => void;
    updateIsOnSignUp: () => void;
}

const SignInView: React.FC<IAuthProps> = ({
    setConnected,
    updateIsOnSignUp
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleClick = () => {
        User.login({
            email: email,
            username: "",
            password: password
        }).then(response => {
            console.log(response);
            setConnected(true);
        }).catch(err => console.error(err));
    };

    return (
        <div className="Authentication">
            <h1>Se connecter</h1>
            <TextInput type="text" role="email" label="Email" value={email} setValue={setEmail} />
            <TextInput type="text" role="password" label="Mot de passe" value={password} setValue={setPassword} />
            <Button text="Se connecter" onClick={handleClick} />
            <Button text="Pas encore inscrit ?" onClick={updateIsOnSignUp} />
        </div>
    );
}

const SignUpView: React.FC<IAuthProps> = ({
    setConnected,
    updateIsOnSignUp
}) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const handleClick = () => {
        User.register({
            email: email,
            username: username,
            password: password
        }).then(response => {
            console.log(response);
            setConnected(true);
        }).catch(err => console.error(err));
    };

    return (
        <div className="Authentication">
            <h1>S'inscrire</h1>
            <TextInput type="text" role="username" label="Pseudo" value={username} setValue={setUsername} />
            <TextInput type="email" role="email" label="Email" value={email} setValue={setEmail} />
            <TextInput type="password" role="password" label="Mot de passe" value={password} setValue={setPassword} />
            <TextInput type="password" role="password" label="Confirmer mot de passe" value={confirmedPassword} setValue={setConfirmedPassword} />
            <Button text="S'inscrire" onClick={handleClick} />
            <Button text="Déjà inscrit ?" onClick={updateIsOnSignUp} />
        </div>
    );
}

const Authentication: React.FC = () => {
    const [connected, setConnected] = useState(false);
    const [isOnSignUp, setIsOnSignUp] = useState(true);

    const updateIsOnSignUp = () => {
        setIsOnSignUp(!isOnSignUp);
    };

    const selectView = (): JSX.Element => {
        return (isOnSignUp)
            ? <SignUpView setConnected={setConnected} updateIsOnSignUp={updateIsOnSignUp} />
            : <SignInView setConnected={setConnected} updateIsOnSignUp={updateIsOnSignUp} />;
    };

    return (
        <div className="Authentication-container">
            <AppHeader />
            {selectView()}
            {connected && <Redirect to="/" />}
        </div>
    );
}

export default Authentication;