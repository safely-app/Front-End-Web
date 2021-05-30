import React, { useEffect, useState } from 'react';
import { TextInput, Button } from '../common';
import { Redirect } from 'react-router-dom';
import { disconnectUser, loginUser, registerUser, RootState } from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { isEmailValid, notifyError } from './utils';
import { User } from '../../services';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Authentication.css';
import log from 'loglevel';

enum View {
    SIGNIN,
    SIGNUP,
    FORGOT
}

interface IAuthProps {
    setView: (value: View) => void;
    notifyError: (msg: string) => void;
}

const SignInView: React.FC<IAuthProps> = ({
    setView,
    notifyError
}) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleClick = () => {
        if (isEmailValid(email) && !!password) {
            dispatch(loginUser(email, "", password));
        } else {
            notifyError(!isEmailValid(email)
                ? "Email invalide"
                : "Mot de passe invalide"
            );
        }
    };

    return (
        <div className="Authentication">
            <h1>Se connecter</h1>
            <TextInput type="email" role="email" label="Email" value={email} setValue={setEmail} />
            <TextInput type="password" role="password" label="Mot de passe" value={password} setValue={setPassword} />
            <Button text="Se connecter" onClick={handleClick} />
            <Button text="Pas encore inscrit ?" onClick={() => setView(View.SIGNUP)} />
            <Button text="Mot de passe oublié ?" onClick={() => setView(View.FORGOT)} type="link" />
            <ToastContainer />
        </div>
    );
}

const SignUpView: React.FC<IAuthProps> = ({
    setView,
    notifyError
}) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const handleClick = () => {
        if (isEmailValid(email) && !!password && password === confirmedPassword) {
            dispatch(registerUser(email, username, password));
        } else {
            notifyError(!isEmailValid(email)
                ? "Email invalide"
                : "Mot de passe invalide"
            );
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
            <Button text="Déjà inscrit ?" onClick={() => setView(View.SIGNIN)} />
            <ToastContainer />
        </div>
    );
}

const ForgottenPassword: React.FC = () => {
    const [email, setEmail] = useState("");

    const handleClick = () => {
        if (isEmailValid(email)) {
            User.forgotPassword({
                email: email,
                username: "",
                password: ""
            }).then(response => {
                log.log(response);
            }).catch(error => {
                log.error(error);
            });
        }
    };

    return (
        <div className="Authentication-container">
            <div className="Authentication">
                <h1>Mot de passe oublié ?</h1>
                <TextInput type="email" role="email" label="Email" value={email} setValue={setEmail} />
                <Button text="Réinitialiser le mot de passe" onClick={handleClick} />
            </div>
        </div>
    );
}

export const Authentication: React.FC = () => {
    const userCredientialsId = useSelector((state: RootState) => state.user.credentials._id);
    const [view, setView] = useState(View.SIGNIN);

    const selectView = (): JSX.Element => {
        switch (view) {
            case View.SIGNUP:
                return <SignUpView notifyError={notifyError} setView={setView} />;

            case View.FORGOT:
                return <ForgottenPassword />
            default:
                return <SignInView notifyError={notifyError} setView={setView} />;
        }
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