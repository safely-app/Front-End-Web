import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { RequestClaimSafeplace } from '../../../services';
import IRequestClaimSafeplace from '../../interfaces/IRequestClaimSafeplace';
import {
    Button,
    Dropdown,
    List,
    TextInput,
    Modal
} from '../../common';
import log from 'loglevel';
import {
    notifyError
} from '../../utils';
import { ToastContainer } from 'react-toastify';

interface IRequestClaimSafeplaceInfoProps {
    requestClaimSafeplace: IRequestClaimSafeplace;
    setRequestClaimSafeplace: (requestClaimSafeplace: IRequestClaimSafeplace) => void;
    buttons: JSX.Element[];
    shown?: boolean;
}

const RequestClaimSafeplaceInfoForm: React.FC<IRequestClaimSafeplaceInfoProps> = ({
    requestClaimSafeplace,
    setRequestClaimSafeplace,
    buttons,
    shown
}) => {
    const REQUEST_STATUS = [
        "Pending",
        "Accepted",
        "Refused"
    ];

    const setUserId = (userId: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace,
            userId: userId
        });
    };

    const setSafeplaceId = (safeplaceId: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace,
            safeplaceId: safeplaceId
        });
    };

    const setStatus = (status: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace,
            status: status
        });
    };

    const setComment = (comment: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace,
            comment: comment
        });
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="RequestClaimSafeplace-Info">
                <TextInput key={`${requestClaimSafeplace.id}-userId`} type="text" role="userId"
                    label="Identifiant d'utilisateur" value={requestClaimSafeplace.userId} setValue={setUserId} />
                <TextInput key={`${requestClaimSafeplace.id}-safeplaceId`} type="text" role="safeplaceId"
                    label="Identifiant de safeplace" value={requestClaimSafeplace.safeplaceId} setValue={setSafeplaceId} />
                <Dropdown key={`${requestClaimSafeplace.id}-status`} values={REQUEST_STATUS}
                    setValue={setStatus} defaultValue={requestClaimSafeplace.status} />
                <TextInput key={`${requestClaimSafeplace.id}-comment`} type="text" role="comment"
                    label="Commentaire" value={requestClaimSafeplace.comment !== undefined ? requestClaimSafeplace.comment : ""} setValue={setComment} />
                {buttons.map(button => button)}
                <ToastContainer />
            </div>
        }/>
    );
};

interface IRequestClaimSafeplaceInfoListElementProps {
    requestClaimSafeplace: IRequestClaimSafeplace;
    onClick: (requestClaimSafeplace: IRequestClaimSafeplace) => void;
}

const RequestClaimSafeplaceInfoListElement: React.FC<IRequestClaimSafeplaceInfoListElementProps> = ({
    requestClaimSafeplace,
    onClick
}) => {
    const handleClick = () => {
        onClick(requestClaimSafeplace);
    };

    return (
        <li key={requestClaimSafeplace.id} className="Monitor-list-element">
            <button className="Monitor-list-element-btn" onClick={handleClick}>
                <ul className="Monitor-list">
                    <li key={`${requestClaimSafeplace.id}-id`}><b>Identifiant : </b>{requestClaimSafeplace.id}</li>
                    <li key={`${requestClaimSafeplace.id}-userId`}><b>Identifiant d'utilisateur : </b>{requestClaimSafeplace.userId}</li>
                    <li key={`${requestClaimSafeplace.id}-safeplaceId`}><b>Identifiant de safeplace : </b>{requestClaimSafeplace.safeplaceId}</li>
                    <li key={`${requestClaimSafeplace.id}-status`}><b>Status : </b>{requestClaimSafeplace.status}</li>
                    <li key={`${requestClaimSafeplace.id}-comment`}><b>Commentaire : </b>{requestClaimSafeplace.comment}</li>
                </ul>
            </button>
        </li>
    );
};

const RequestClaimSafeplaceMonitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [focusRequestClaimSafeplace, setFocusRequestClaimSafeplace] = useState<IRequestClaimSafeplace | undefined>(undefined);
    const [showModal, setShowModal] = useState(false);
    const [requestClaimSafeplaces, setRequestClaimSafeplaces] = useState<IRequestClaimSafeplace[]>([]);
    const [newRequestClaimSafeplace, setNewRequestClaimSafeplace] = useState<IRequestClaimSafeplace>({
        id: "",
        userId: "",
        safeplaceId: "",
        status: "Pending",
        comment: ""
    });

    const addRequestClaimSafeplace = (requestClaimSafeplace: IRequestClaimSafeplace) => {
        setRequestClaimSafeplaces([
            ...requestClaimSafeplaces,
            requestClaimSafeplace
        ]);
    };

    const setRequestClaimSafeplace = (requestClaimSafeplace: IRequestClaimSafeplace) => {
        setRequestClaimSafeplaces(
            requestClaimSafeplaces.map(requestClaimSafeplaceElement =>
                requestClaimSafeplaceElement.id === requestClaimSafeplace.id ? requestClaimSafeplace : requestClaimSafeplaceElement));
    };

    const removeRequestClaimSafeplace = (requestClaimSafeplace: IRequestClaimSafeplace) => {
        setRequestClaimSafeplaces(
            requestClaimSafeplaces.filter(requestClaimSafeplaceElement => requestClaimSafeplaceElement.id !== requestClaimSafeplace.id));
    };

    const createNewRequestClaimSafeplace = async (requestClaimSafeplace: IRequestClaimSafeplace) => {
        try {
            const response = await RequestClaimSafeplace.create(requestClaimSafeplace, userCredientials.token);

            log.log(response);
            addRequestClaimSafeplace(requestClaimSafeplace);
            saveRequestClaimSafeplaceModification(requestClaimSafeplace);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const saveRequestClaimSafeplaceModification = async (requestClaimSafeplace: IRequestClaimSafeplace) => {
        try {
            const response = await RequestClaimSafeplace.update(
                requestClaimSafeplace.id,
                requestClaimSafeplace,
                userCredientials.token
            );

            log.log(response);
            setRequestClaimSafeplace(focusRequestClaimSafeplace as IRequestClaimSafeplace);
            setFocusRequestClaimSafeplace(undefined);
            setNewRequestClaimSafeplace({
                id: "",
                userId: "",
                safeplaceId: "",
                status: "",
                comment: ""
            });
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const deleteRequestClaimSafeplace = async (requestClaimSafeplace: IRequestClaimSafeplace) => {
        try {
            const response = await RequestClaimSafeplace.delete(requestClaimSafeplace.id, userCredientials.token);

            log.log(response);
            removeRequestClaimSafeplace(requestClaimSafeplace);
            setFocusRequestClaimSafeplace(undefined);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    useEffect(() => {
        RequestClaimSafeplace.getAll(userCredientials.token).then(response => {
            const gotRequestClaimSafeplaces = response.data.map(requestClaimSafeplace => {
                return {
                    id: requestClaimSafeplace.id,
                    userId: requestClaimSafeplace.userId,
                    safeplaceId: requestClaimSafeplace.safeplaceId,
                    status: requestClaimSafeplace.status,
                    comment: requestClaimSafeplace.comment
                };
            });

            setRequestClaimSafeplaces(gotRequestClaimSafeplaces);
        }).catch(error => {
            log.error(error);
            notifyError(error);
        });
    }, [userCredientials]);

    return (
        <div style={{textAlign: "center"}}>
            <Button text="Créer une nouvelle requête de safeplace"
                width="98%" onClick={() => setShowModal(true)} />
            <RequestClaimSafeplaceInfoForm
                shown={showModal}
                requestClaimSafeplace={newRequestClaimSafeplace}
                setRequestClaimSafeplace={setNewRequestClaimSafeplace}
                buttons={[
                    <Button key="create-id" text="Créer une requête de safeplace" onClick={() => {
                        createNewRequestClaimSafeplace(newRequestClaimSafeplace);
                        setShowModal(false);
                        setNewRequestClaimSafeplace({
                            id: "",
                            userId: "",
                            safeplaceId: "",
                            status: "Pending",
                            comment: ""
                        })
                    }} />,
                    <Button key="stop-id" text="Annuler" onClick={() => setShowModal(false)} />
                ]}
            />
            <List
                items={requestClaimSafeplaces}
                focusItem={focusRequestClaimSafeplace}
                itemDisplayer={(item) => <RequestClaimSafeplaceInfoListElement requestClaimSafeplace={item} onClick={(requestClaimSafeplace: IRequestClaimSafeplace) => setFocusRequestClaimSafeplace(requestClaimSafeplace)} />}
                itemUpdater={(item) =>
                    <RequestClaimSafeplaceInfoForm
                        shown={!showModal}
                        requestClaimSafeplace={item}
                        setRequestClaimSafeplace={setFocusRequestClaimSafeplace}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveRequestClaimSafeplaceModification(item)} />,
                            <Button key="stop-id" text="Annuler" onClick={() => setFocusRequestClaimSafeplace(undefined)} />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteRequestClaimSafeplace(item)} styleType="warning" />
                        ]}
                    />
                }
            />
            <ToastContainer />
        </div>
    );
};

export default RequestClaimSafeplaceMonitor;