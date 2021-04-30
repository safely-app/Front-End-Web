import React, { useState } from 'react';
import { AppHeader } from '../Header/Header';
import { TextInput, Button } from '../common';
import './Authentication.css';

interface IAuthProps {
    updateIsOnSignUp: () => void;
}

const SignInView: React.FC<IAuthProps> = ({
    updateIsOnSignUp
}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="Authentication">
            <h1>Se connecter</h1>
            <TextInput type="text" role="email" label="Email" value={username} setValue={setUsername} />
            <TextInput type="text" role="password" label="Mot de passe" value={password} setValue={setPassword} />
            <Button text="Se connecter" onClick={() => {}} />
            <Button text="Pas encore inscrit ?" onClick={updateIsOnSignUp} />
        </div>
    );
}

const SignUpView: React.FC<IAuthProps> = ({
    updateIsOnSignUp
}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    return (
        <div className="Authentication">
            <h1>S'inscrire</h1>
            <TextInput type="text" role="email" label="Email" value={username} setValue={setUsername} />
            <TextInput type="text" role="password" label="Mot de passe" value={password} setValue={setPassword} />
            <TextInput type="text" role="password" label="Confirmer mot de passe" value={confirmedPassword} setValue={setConfirmedPassword} />
            <Button text="S'inscrire" onClick={() => {}} />
            <Button text="Déjà inscrit ?" onClick={updateIsOnSignUp} />
        </div>
    );
}

const Authentication: React.FC = () => {
    const [isOnSignUp, setIsOnSignUp] = useState(true);

    const updateIsOnSignUp = () => {
        setIsOnSignUp(!isOnSignUp);
    };

    const selectView = (): JSX.Element => {
        return (isOnSignUp)
            ? <SignUpView updateIsOnSignUp={updateIsOnSignUp} />
            : <SignInView updateIsOnSignUp={updateIsOnSignUp} />;
    };

    return (
        <div>
            <AppHeader />
            {selectView()}
        </div>
    );
}

export default Authentication;