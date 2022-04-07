import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { User } from '../../../services';
import IUser from '../../interfaces/IUser';
import {
    Button,
    Dropdown,
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
import profile from '../../../assets/image/profileano.png'

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
        "user", "trader", "admin"
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
            <div className="Monitor-Info">
                <TextInput key={`${user.id}-id`} type="text" role="id"
                    label="Identifiant" value={user.id} setValue={() => { }} readonly={true} />
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
            </div>
        } />
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
        <div key={user.id} className="bg-white p-4 flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <button className="w-full h-full text-left" onClick={handleClick}>
            <img className="object-center w-full h-60 md:h-auto md:w-48" src={profile} alt=""></img>
            <div className="flex flex-col justify-between p-4 leading-normal space-y-2">
                <p key={`${user.id}-id`}><b>Identifiant : </b>{user.id}</p>
                <p key={`${user.id}-username`}><b>Nom d'utilisateur : </b>{user.username}</p>
                <p key={`${user.id}-email`}><b>Adresse email : </b>{user.email}</p>
                <p key={`${user.id}-role`}><b>Role : </b>{user.role}</p>
            </div>
            </button>
        </div>
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
    const USER_ROLES = [
        'all',
        'user',
        'trader',
        'admin'
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 md:grid-rows-1 px-4">
            <Dropdown width='10em' defaultValue='all' values={USER_ROLES} setValue={setDropdownValue} />
            <SearchBar label="Rechercher un utilisateur" value={searchBarValue} setValue={setSearchBarValue} />
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

    const createNewUser = async (user: IUser) => {
        try {
            const response = await User.register(user);
            const createdUser = {
                ...user,
                id: response.data._id,
                password: undefined,
                confirmedPassword: undefined
            };

            log.log(response);
            addUser(createdUser);
            saveUserModification(createdUser);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const saveUserModification = async (user: IUser) => {
        try {
            const response = await User.update(user.id, user, userCredientials.token);

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
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const deleteUser = async (user: IUser) => {
        try {
            const response = await User.delete(user.id, userCredientials.token);

            log.log(response);
            removeUser(user);
            setFocusUser(undefined);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
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
        <div style={{ textAlign: "center" }}>
            <button data-testid="create-new-user-button-id" className="w-50 h-full justify-center py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mb-4" onClick={() => setShowModal(true)} >Créer un nouvel utilisateur</button>
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
            <div>
                {(focusUser !== undefined) &&
                    <UserInfoForm
                        shown={!showModal}
                        user={focusUser}
                        setUser={setFocusUser}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveUserModification(focusUser)} />,
                            <Button key="stop-id" text="Annuler" onClick={() => setFocusUser(undefined)} />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteUser(focusUser)} type="warning" />
                        ]}
                    />
                }
               <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 p-4">
                    {filterUsers().map((user, index) =>
                        <UserInfoListElement
                            key={index}
                            user={user}
                            onClick={user => setFocusUser(user)}
                        />
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UserMonitor;