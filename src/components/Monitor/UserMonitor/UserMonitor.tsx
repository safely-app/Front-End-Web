import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { User } from '../../../services';
import IUser from '../../interfaces/IUser';
import {
    Button,
    Dropdown,
    List,
    TextInput,
    Modal,
    SearchBar
} from '../../common';
import log from 'loglevel';
import {
    notifyError,
    convertStringToRegex
} from '../../utils';
import { ToastContainer } from 'react-toastify';
import './UserMonitor.css';

interface IUserInfoProps {
    user: IUser;
    setUser: (user: IUser) => void;
    buttons: JSX.Element[];
    shown?: boolean;
}

const UserInfoForm: React.FC<IUserInfoProps> = ({
    user,
    setUser,
    buttons,
    shown
}) => {
    const USER_ROLES = [
        "user", "admin"
    ];

    const setUsername = (value: string) => {
        setUser({ ...user, username: value });
    };

    const setEmail = (value: string) => {
        setUser({ ...user, email: value });
    };

    const setRole = (value: string) => {
        setUser({ ...user, role: value });
    };

    const setPassword = (value: string) => {
        setUser({ ...user, password: value });
    };

    const setConfirmedPassword = (value: string) => {
        setUser({ ...user, confirmedPassword: value });
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="User-Info">
                <TextInput key={`${user.id}-username`} type="text" role="username"
                    label="Nom d'utilisateur" value={user.username} setValue={setUsername} />
                <TextInput key={`${user.id}-email`} type="email" role="email"
                    label="Email" value={user.email} setValue={setEmail} />
                <Dropdown key={`${user.id}-role`} values={USER_ROLES}
                    setValue={setRole} defaultValue={user.role} />
                {(user.password !== undefined && user.confirmedPassword !== undefined) &&
                    <div>
                        <TextInput key={`${user.id}-password`} type="password" role="password"
                            label="Mot de passe" value={user.password} setValue={setPassword} />
                        <TextInput key={`${user.id}-confirmedPassword`} type="password" role="password"
                            label="Confirmer mot de passe" value={user.confirmedPassword} setValue={setConfirmedPassword} />
                    </div>
                }
                {buttons.map(button => button)}
                <ToastContainer />
            </div>
        }/>
    );
};

interface IUserInfoListElementProps {
    user: IUser;
    onClick: (user: IUser) => void;
}

const UserInfoListElement: React.FC<IUserInfoListElementProps> = ({
    user,
    onClick
}) => {
    const handleClick = () => {
        onClick(user);
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

interface IUserMonitorFilterProps {
    searchBarValue: string;
    setDropdownValue: (value: string) => void;
    setSearchBarValue: (value: string) => void;
}

const UserMonitorFilter: React.FC<IUserMonitorFilterProps> = ({
    searchBarValue,
    setDropdownValue,
    setSearchBarValue
}) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(100, 1fr)', paddingLeft: '1%', paddingRight: '1%' }}>
            <div style={{ gridColumn: '2 / 10', gridRow: '1' }}>
                <Dropdown width='100%' defaultValue='all' values={[ 'all', 'user', 'admin' ]} setValue={setDropdownValue} />
            </div>
            <div style={{ gridColumn: '11 / 100', gridRow: '1' }}>
                <SearchBar label="Rechercher un utilisateur" value={searchBarValue} setValue={setSearchBarValue} />
            </div>
        </div>
    );
};

const UserMonitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [focusUser, setFocusUser] = useState<IUser | undefined>(undefined);
    const [userRole, setUserRole] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [newUser, setNewUser] = useState<IUser>({
        id: "",
        username: "",
        email: "",
        role: "user",
        password: "",
        confirmedPassword: ""
    });

    const addUser = (user: IUser) => {
        setUsers([
            ...users,
            user
        ]);
    };

    const setUser = (user: IUser) => {
        setUsers(users.map(userElement => userElement.id === user.id ? user : userElement));
    };

    const removeUser = (user: IUser) => {
        setUsers(users.filter(userElement => userElement.id !== user.id));
    };

    const createNewUser = (user: IUser) => {
        try {
            User.register(user).then(response => {
                const createdUser = {
                    ...user,
                    id: response.data._id,
                    password: undefined,
                    confirmedPassword: undefined
                };

                log.log(response);
                addUser(createdUser);
                saveUserModification(createdUser);
            }).catch(error => {
                log.error(error);
                notifyError(error);
            });
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const saveUserModification = (user: IUser) => {
        try {
            User.update(user.id, user, userCredientials.token)
                .then(response => {
                    log.log(response);
                    setUser(focusUser as IUser);
                    setFocusUser(undefined);
                    setNewUser({
                        id: "",
                        username: "",
                        email: "",
                        role: "user",
                        password: "",
                        confirmedPassword: ""
                    });
                }).catch(error => {
                    log.error(error);
                    notifyError(error);
                });
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const deleteUser = (user: IUser) => {
        User.delete(user.id, userCredientials.token)
            .then(response => {
                log.log(response);
                removeUser(user);
                setFocusUser(undefined);
            }).catch(error => {
                log.error(error);
            });
    };

    const filterUsers = (): IUser[] => {
        const lowerSearchText = convertStringToRegex(searchText.toLocaleLowerCase());

        return users
            .filter(user => userRole !== 'all' ? userRole === user.role : true)
            .filter(user => searchText !== ''
                ? user.id.toLowerCase().match(lowerSearchText) !== null
                || user.email.toLowerCase().match(lowerSearchText) !== null
                || user.username.toLowerCase().match(lowerSearchText) !== null : true);
    };

    useEffect(() => {
        User.getAll(userCredientials.token).then(response => {
            const gotUsers = response.data.map(user => {
                return {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };
            });

            setUsers(gotUsers);
        }).catch(error => {
            log.error(error);
            notifyError(error);
        });
    }, [userCredientials]);

    return (
        <div style={{textAlign: "center"}}>
            <Button text="Créer un nouvel utilisateur" width="98%" onClick={() => setShowModal(true)} />
            <UserMonitorFilter searchBarValue={searchText} setDropdownValue={setUserRole} setSearchBarValue={setSearchText} />
            <UserInfoForm
                shown={showModal}
                user={newUser}
                setUser={setNewUser}
                buttons={[
                    <Button key="create-id" text="Créer un utilisateur" onClick={() => {
                        createNewUser(newUser);
                        setShowModal(false);
                        setNewUser({
                            id: "",
                            username: "",
                            email: "",
                            role: "user"
                        })
                    }} />,
                    <Button key="stop-id" text="Annuler" onClick={() => setShowModal(false)} />
                ]}
            />
            <List
                items={filterUsers()}
                focusItem={focusUser}
                itemDisplayer={(item) => <UserInfoListElement user={item} onClick={(user: IUser) => setFocusUser(user)} />}
                itemUpdater={(item) =>
                    <UserInfoForm
                        shown={!showModal}
                        user={item}
                        setUser={setFocusUser}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveUserModification(item)} />,
                            <Button key="stop-id" text="Annuler" onClick={() => setFocusUser(undefined)} />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteUser(item)} styleType="warning" />
                        ]}
                    />
                }
            />
            <ToastContainer />
        </div>
    );
};

export default UserMonitor;