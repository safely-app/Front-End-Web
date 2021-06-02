import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, RootState } from '../../redux';
import { User } from '../../services';
import { TextInput, Button } from '../common';
import { AppHeader } from '../Header/Header';
import IUser from '../interfaces/IUser';
import '../Profile/Profile.css';
import './Monitor.css';
import log from 'loglevel';
import {
    isEmailValid,
    notifyError
} from '../Authentication/utils';

interface IUserInfoProps {
    user: IUser;
    setUser: (user: IUser) => void;
    buttons: JSX.Element[];
}

const UserInfoForm: React.FC<IUserInfoProps> = ({
    user,
    setUser,
    buttons
}) => {
    const setUsername = (value: string) => {
        setUser({
            ...user,
            username: value
        });
    };

    const setEmail = (value: string) => {
        setUser({
            ...user,
            email: value
        });
    };

    const setRole = (value: string) => {
        setUser({
            ...user,
            role: value
        });
    };

    const setPassword = (value: string) => {
        setUser({
            ...user,
            password: value
        });
    };

    const setConfirmedPassword = (value: string) => {
        setUser({
            ...user,
            confirmedPassword: value
        });
    };

    return (
        <div className="Profile">
            <TextInput key={`${user.id}-username`} type="text" role="username" label="Nom d'utilisateur" value={user.username} setValue={setUsername} />
            <TextInput key={`${user.id}-email`} type="email" role="email" label="Email" value={user.email} setValue={setEmail} />
            <TextInput key={`${user.id}-role`} type="text" role="role" label="Role" value={user.role} setValue={setRole} />
            {(user.password !== undefined && user.confirmedPassword !== undefined) &&
            <div>
                <TextInput key={`${user.id}-password`} type="password" role="password" label="Mot de passe" value={user.password} setValue={setPassword} />
                <TextInput key={`${user.id}-confirmedPassword`} type="password" role="password" label="Confirmer mot de passe" value={user.confirmedPassword} setValue={setConfirmedPassword} />
            </div>}
            {buttons.map(button => button)}
        </div>
    );
};

interface IUserInfoListElementProps {
    user: IUser;
    updateIsListView: () => void;
    setUserId: (value: string) => void;
}

const UserInfoListElement: React.FC<IUserInfoListElementProps> = ({ user, updateIsListView, setUserId }) => {
    const handleClick = () => {
        setUserId(user.id);
        updateIsListView();
    };

    return (
        <li key={user.id} className="Monitor-list-element">
            <button className="Monitor-list-element-btn" onClick={handleClick}>
                <ul className="Monitor-list">
                    <li key={`${user.id}-id`}><b>Identifiant : </b>{user.id}</li>
                    <li key={`${user.id}-username`}><b>Nom d'utilisateur : </b>{user.username}</li>
                    <li key={`${user.id}-email`}><b>Adresse email : </b>{user.email}</li>
                    <li key={`${user.id}-role`}><b>Role : </b>{user.role}</li>
                </ul>
            </button>
        </li>
    );
}

enum View {
    LIST,
    CREATE,
    UPDATE
}

const Monitor: React.FC = () => {
    const dispatch = useDispatch();
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [users, setUsers] = useState<IUser[]>([]);
    const [view, setView] = useState(View.LIST);
    const [userId, setUserId] = useState("");
    const [newUser, setNewUser] = useState<IUser>({
        id: "",
        username: "",
        email: "",
        role: "",
        password: "",
        confirmedPassword: ""
    });

    const getUser = (id: string): IUser => {
        return users.find(user => user.id === id) as IUser;
    };

    const setUser = (user: IUser) => {
        setUsers(users.map(userElement => userElement.id === user.id ? user : userElement));
    };

    const createNewUser = (user: IUser) => {
        if (isEmailValid(user.email) && !!user.password && user.password === user.confirmedPassword) {
            User.register({
                email: user.email,
                username: user.username,
                password: user.password
            }).then(response => {
                log.log(response);
                setView(View.LIST);
            }).catch(error => {
                log.error(error);
            });
        } else {
            notifyError(!isEmailValid(user.email)
                ? "Email invalide"
                : "Mot de passe invalide"
            );
        }
    };

    const saveUserModification = (user: IUser) => {
        User.update(user.id, user, userCredientials.token)
            .then(response => {
                log.log(response)
                setView(View.LIST);
            }).catch(error => {
                log.error(error);
            });
    };

    const deleteUser = (user: IUser) => {
        User.delete(user.id, userCredientials.token)
            .then(response => {
                log.log(response);
                setView(View.LIST);
            }).catch(error => {
                log.error(error);
            });
    };

    const getView = () => {
        switch (view) {
            case View.CREATE:
                return (
                    <UserInfoForm
                        user={newUser}
                        setUser={setNewUser}
                        buttons={[
                            <Button text="Créer un nouvel utilisateur" onClick={() => createNewUser(newUser)} />,
                            <Button text="Annuler" onClick={() => {
                                setView(View.LIST);
                                setUser({
                                    id: "",
                                    username: "",
                                    email: "",
                                    role: "",
                                    password: "",
                                    confirmedPassword: ""
                                });
                            }} />
                        ]}
                    />
                );
            case View.UPDATE:
                return (
                    <UserInfoForm
                        user={getUser(userId)}
                        setUser={setUser}
                        buttons={[
                            <Button text="Sauvegarder" onClick={() => saveUserModification(getUser(userId))} />,
                            <Button text="Annuler" onClick={() => setView(View.LIST)} />,
                            <Button text="Supprimer" onClick={() => deleteUser(getUser(userId))} type="warning" />
                        ]}
                    />
                );
            default:
                return (
                    <div style={{textAlign: "center"}}>
                        <Button
                            text="Créer un nouvel utilisateur"
                            onClick={() => setView(View.CREATE)}
                            width="98%"
                        />
                        <ul className="Monitor-list">
                            {users.map(user =>
                                <UserInfoListElement
                                    user={user}
                                    updateIsListView={() => setView(View.UPDATE)}
                                    setUserId={setUserId}
                                    key={user.id}
                                />
                            )}
                        </ul>
                    </div>
                );
        };
    };

    useEffect(() => {
        User.getAll(userCredientials.token).then(response => {
            const gotUsers = response.data.map(user => {
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };
            });

            setUsers(gotUsers);
        }).catch(error => {
            log.error(error);
        });
    }, [userCredientials, view]);

    return (
        <div className="Monitor">
            <AppHeader />
            {getView()}
        </div>
    );
}

export default Monitor;