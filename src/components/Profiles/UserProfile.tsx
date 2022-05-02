import React, { useEffect, useState } from 'react';
import { User } from '../../services';
import {
    disconnect,
    useAppSelector,
    useAppDispatch
} from '../../redux';
import IUser from '../interfaces/IUser';
import { TextInput, Button } from '../common';
import { AppHeader } from "../Header/Header";
import { Redirect } from 'react-router-dom';
import {
    notifyError
} from '../utils';
import log from 'loglevel';

const UserProfile: React.FC = () => {
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(state => state.user.userInfo);
    const userCredientials = useAppSelector(state => state.user.credentials);
    const [isUserDeleted, setIsUserDeleted] = useState(false);
    const [isUpdateView, setIsUpdateView] = useState(false);
    const [user, setUser] = useState<IUser>({
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        role: userInfo.role
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
        try {
            User.update(userCredientials._id, user, userCredientials.token)
                .then(response => {
                    log.log(response)
                    updateIsUpdateView();
                }).catch(error => {
                    log.error(error);
                });
        } catch (e) {
            notifyError(e);
        }
    };

    const deleteUser = () => {
        User.delete(userCredientials._id, userCredientials.token)
            .then(response => {
                log.log(response);
                setIsUserDeleted(true);
                dispatch(disconnect());
            }).catch(error => {
                log.error(error);
            });
    };

    useEffect(() => {
        User.get(
            userCredientials._id,
            userCredientials.token
        ).then(response => {
            setUser(response.data);
        }).catch(error => {
            log.error(error);
        });
    }, [userCredientials]);

    return (
        <div className="Profile-container">
            <AppHeader />
            <div className="text-center p-4">
                <TextInput type="text" role="username" label="Nom d'utilisateur" value={user.username} setValue={setUsername} readonly={!isUpdateView} />
                <TextInput type="text" role="email" label="Adresse email" value={user.email} setValue={setEmail} readonly={!isUpdateView} />
                {isUpdateView ? <Button text="Sauvegarder" onClick={saveUserModification} /> : <Button text="Modifier" onClick={updateIsUpdateView} />}
                {isUpdateView && <Button text="Annuler" onClick={updateIsUpdateView} />}
                <Button text="Supprimer" onClick={deleteUser} type="warning" />
                {isUserDeleted && <Redirect to="/" />}
            </div>
        </div>
    );
}

export default UserProfile;