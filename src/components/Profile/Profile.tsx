import React, { useEffect, useState } from 'react';
import { User } from '../../services';
import { AppHeader } from '../Header/Header';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import IUser from '../interfaces/IUser';
import './Profile.css';
import { TextInput, Button } from '../common';

const Profile: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [isUpdateView, setIsUpdateView] = useState(false);
    const [user, setUser] = useState<IUser>({
        id: "1",
        username: "Billy",
        email: "billy@lesinge.com",
        role: "admin"
    });

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

    const updateIsUpdateView = () => {
        setIsUpdateView(!isUpdateView);
    };

    const saveUserModification = () => {
        User.update(userCredientials._id, user, userCredientials.token)
            .then(response => {
                console.log(response)
                updateIsUpdateView();
            }).catch(error => console.error(error));
    };

    useEffect(() => {
        User.get(
            userCredientials._id,
            userCredientials.token
        ).then(response => {
            setUser(response.data);
        }).catch(error => {
            console.error(error);
        });
    }, [userCredientials]);

    return (
        <div className="Profile-container">
            <AppHeader />
            <div className="Profile">
                <TextInput type="text" role="username" label="Nom d'utilisateur" value={user.username} setValue={setUsername} readonly={!isUpdateView} />
                <TextInput type="text" role="email" label="Adresse email" value={user.email} setValue={setEmail} readonly={!isUpdateView} />
                {isUpdateView
                    ? <Button text="Sauvegarder" onClick={saveUserModification} />
                    : <Button text="Modifier" onClick={updateIsUpdateView} /> }
                {isUpdateView && <Button text="Annuler" onClick={updateIsUpdateView} /> }
            </div>
        </div>
    );
}

export default Profile;