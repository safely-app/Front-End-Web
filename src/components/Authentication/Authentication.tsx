import React, { useEffect, useState } from 'react';
import { TextInput, Button } from '../common';
import { Redirect } from 'react-router-dom';
import { disconnectUser, loginUser, registerUser, RootState } from '../../redux';
import { useDispatch, useSelector } from 'react-redux';
import { notifyError } from '../utils';
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
        dispatch(loginUser(email, "", password));
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
        dispatch(registerUser(email, username, password, confirmedPassword));
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
        try {
            User.forgotPassword(email)
                .then(response => {
                    log.log(response);
                }).catch(error => {
                    log.error(error);
                });
        } catch (e) {
            notifyError((e as Error).message);
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

interface ResetProps {
    id: string;
    token: string;
}

export const ResetPassword: React.FC = () => {
    const [redirect, setRedirect] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [resetProps, setResetProps] = useState<ResetProps>({
        id: "",
        token: ""
    });

    const parseUrl = (url: string): ResetProps => {
        const regex = new RegExp("/reset/(.*)/token/(.*)");
        const found = url.match(regex) || ["", ""];

        return {
            id: found[1],
            token: found[2]
        };
    };

    const handleClick = () => {
        try {
            User.changePassword(
                resetProps.id,
                resetProps.token,
                password,
                confirmedPassword
            ).then(response => {
                log.log(response);
                setRedirect(true);
            }).catch(error => {
                log.error(error);
            });
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    useEffect(() => {
        setResetProps(parseUrl(window.location.href));
    }, []);

    return (
        <div className="Authentication">
            <h1>Réinitialiser le mot de passe</h1>
            <TextInput type="password" role="password" label="Mot de passe" value={password} setValue={setPassword} />
            <TextInput type="password" role="password" label="Confirmer mot de passe" value={confirmedPassword} setValue={setConfirmedPassword} />
            <Button text="Réinitialiser" onClick={handleClick} />
            <ToastContainer />
            {redirect && <Redirect to="/login" />}
        </div>
    );
}
