import React, { useEffect, useState } from 'react';
import { TextInput, Button } from '../common';
import { Redirect } from 'react-router-dom';
import './Authentication.css';
import { disconnectUser, loginUser, registerUser, RootState } from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { isEmailValid } from './utils';

interface IAuthProps {
    updateIsOnSignUp: () => void;
}

const SignInView: React.FC<IAuthProps> = ({
    updateIsOnSignUp
}) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleClick = () => {
        if (isEmailValid(email) && !!password) {
            dispatch(loginUser(email, "", password));
        }
    };

    return (
        <div className="Authentication">
            <h1>Se connecter</h1>
            <TextInput type="email" role="email" label="Email" value={email} setValue={setEmail} />
            <TextInput type="password" role="password" label="Mot de passe" value={password} setValue={setPassword} />
            <Button text="Se connecter" onClick={handleClick} />
            <Button text="Pas encore inscrit ?" onClick={updateIsOnSignUp} />
        </div>
    );
}

const SignUpView: React.FC<IAuthProps> = ({
    updateIsOnSignUp
}) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const handleClick = () => {
        if (isEmailValid(email) && !!password && password === confirmedPassword) {
            dispatch(registerUser(email, username, password));
        }
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

export const Authentication: React.FC = () => {
    const userCredientialsId = useSelector((state: RootState) => state.user.credentials._id);
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
        <div className="Authentication-container">
            {selectView()}
            {!!userCredientialsId && <Redirect to="/" />}
        </div>
    );
}

export const SignOut: React.FC = () => {
    const dispatch = useDispatch();
    const userCredientialsId = useSelector((state: RootState) => state.user.credentials._id);

    useEffect(() => {
        dispatch(disconnectUser());
    });

    return <div>{!userCredientialsId && <Redirect to="/login" />}</div>;
}