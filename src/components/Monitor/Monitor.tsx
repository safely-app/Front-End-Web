import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { User } from '../../services';
import { AppHeader } from '../Header/Header';
import './Monitor.css';

interface IUser {
    id: string;
    username: string;
    email: string;
    role: string;
}

const UserInfo: React.FC<IUser> = (user) => {
    return (
        <li key={user.id} className="Monitor-list-element">
            <ul className="Monitor-list">
                <li key={`${user.id}-id`}><b>ID : </b>{user.id}</li>
                <li key={`${user.id}-username`}><b>Username : </b>{user.username}</li>
                <li key={`${user.id}-email`}><b>Email : </b>{user.email}</li>
                <li key={`${user.id}-role`}><b>Role : </b>{user.role}</li>
            </ul>
        </li>
    );
}

const Monitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [users, setUsers] = useState<IUser[]>([]);

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
             <ul className="Monitor-list">
                {users.map(user =>
                    <UserInfo
                        id={user.id}
                        username={user.username}
                        email={user.email}
                        role={user.role}
                    />
                )}
            </ul>
        </div>
    );
}

export default Monitor;