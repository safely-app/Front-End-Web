import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { User } from '../../services';
import { TextInput, Button } from '../common';
import { AppHeader } from '../Header/Header';
import IUser from '../interfaces/IUser';
import '../Profile/Profile.css';
import './Monitor.css';

interface IUserInfoViewProps {
    user: IUser;
    updateIsListView: () => void;
    setUser: (user: IUser) => void;
}

const UserInfoView: React.FC<IUserInfoViewProps> = ({ user, updateIsListView, setUser }) => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);

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
    }

    const saveUserModification = () => {
        User.update(user.id, user, userCredientials.token)
            .then(response => {
                console.log(response)
                updateIsListView();
            }).catch(error => console.error(error));
    };

    return (
        <div className="Profile">
            <TextInput key={`${user.id}-username`} type="text" role="username" label="Nom d'utilisateur" value={user.username} setValue={setUsername} />
            <TextInput key={`${user.id}-email`} type="text" role="email" label="Email" value={user.email} setValue={setEmail} />
            <TextInput key={`${user.id}-role`} type="text" role="role" label="Role" value={user.role} setValue={setRole} />
            <Button text="Sauvegarder" onClick={saveUserModification} />
            <Button text="Annuler" onClick={updateIsListView} />
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

const Monitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [isListView, setIsListView] = useState(true);
    const [users, setUsers] = useState<IUser[]>([]);
    const [userId, setUserId] = useState("");

    const updateIsListView = () => {
        setIsListView(!isListView);
    };

    const setUser = (user: IUser) => {
        setUsers(users.map(userElement => userElement.id === user.id ? user : userElement));
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
            console.error(error);
        });
    }, [userCredientials]);

    return (
        <div className="Monitor">
            <AppHeader />
            {(isListView)
                ? <ul className="Monitor-list">
                    {users.map(user =>
                        <UserInfoListElement
                            user={user}
                            updateIsListView={updateIsListView}
                            setUserId={setUserId}
                            key={user.id}
                        />
                    )}
                </ul>
                : <UserInfoView
                    user={users.find(user => user.id === userId) as IUser}
                    updateIsListView={updateIsListView}
                    setUser={setUser}
                />
            }
        </div>
    );
}

export default Monitor;