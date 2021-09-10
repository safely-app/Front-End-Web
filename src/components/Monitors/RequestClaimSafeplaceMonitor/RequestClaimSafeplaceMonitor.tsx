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
import './RequestClaimSafeplaceMonitor.css';

const ACCEPTED_REQUEST = "Accepted";
const REFUSED_REQUEST = "Refused";
const PENDING_REQUEST = "Pending";

interface IRequestClaimSafeplaceInfoProps {
    requestClaimSafeplace: IRequestClaimSafeplace | undefined;
    setRequestClaimSafeplace: (requestClaimSafeplace: IRequestClaimSafeplace) => void;
    buttons: JSX.Element[];
    shown: boolean;
}

const RequestClaimSafeplaceInfoForm: React.FC<IRequestClaimSafeplaceInfoProps> = ({
    requestClaimSafeplace,
    setRequestClaimSafeplace,
    buttons,
    shown
}) => {
    const REQUEST_STATUS = [
        PENDING_REQUEST,
        ACCEPTED_REQUEST,
        REFUSED_REQUEST
    ];

    const setUserId = (userId: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace as IRequestClaimSafeplace,
            userId: userId
        });
    };

    const setSafeplaceId = (safeplaceId: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace as IRequestClaimSafeplace,
            safeplaceId: safeplaceId
        });
    };

    const setStatus = (status: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace as IRequestClaimSafeplace,
            status: status
        });
    };

    const setComment = (comment: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace as IRequestClaimSafeplace,
            comment: comment
        });
    };

    return (
        <Modal shown={shown} content={
            <div className="RequestClaimSafeplace-Info">
                <TextInput key={`${requestClaimSafeplace?.id}-userId`} type="text" role="userId"
                    label="Identifiant d'utilisateur" value={requestClaimSafeplace?.userId as string} setValue={setUserId} />
                <TextInput key={`${requestClaimSafeplace?.id}-safeplaceId`} type="text" role="safeplaceId"
                    label="Identifiant de safeplace" value={requestClaimSafeplace?.safeplaceId as string} setValue={setSafeplaceId} />
                <Dropdown key={`${requestClaimSafeplace?.id}-status`} values={REQUEST_STATUS}
                    setValue={setStatus} defaultValue={requestClaimSafeplace?.status as string} />
                <TextInput key={`${requestClaimSafeplace?.id}-comment`} type="text" role="comment"
                    label="Commentaire" value={requestClaimSafeplace?.comment !== undefined ? requestClaimSafeplace.comment : ""} setValue={setComment} />
                {buttons.map(button => button)}
                <ToastContainer />
            </div>
        }/>
    );
};

interface IRequestClaimSafeplaceInfoListElementProps {
    requestClaimSafeplace: IRequestClaimSafeplace;
    showModal: boolean;
    setShownModal: (value: boolean) => void;
    onClick: (requestClaimSafeplace: IRequestClaimSafeplace) => void;
    setRequestClaimSafeplace: (requestClaimSafeplace: IRequestClaimSafeplace) => void;
}

const RequestClaimSafeplaceInfoListElement: React.FC<IRequestClaimSafeplaceInfoListElementProps> = ({
    requestClaimSafeplace,
    showModal,
    setShownModal,
    onClick,
    setRequestClaimSafeplace
}) => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [refusedMessage, setRefusedMessage] = useState<string | undefined>(undefined);
    const [isMouseOverButton, setIsMouseOverButton] = useState(false);

    const handleClick = () => {
        if (!isMouseOverButton) onClick(requestClaimSafeplace);
    };

    const onMouseOver = () => {
        setIsMouseOverButton(true);
    };

    const onMouseOut = () => {
        setIsMouseOverButton(false);
    };

    const openRefuseModal = () => {
        if (!showModal) {
            setShownModal(true);
            setRefusedMessage("");
        }
    };

    const closeRefuseModal = () => {
        setRefusedMessage(undefined);
        setShownModal(false);
    };

    const acceptRequest = async () => {
        try {
            const acceptedRequest = { ...requestClaimSafeplace, status: ACCEPTED_REQUEST };
            const response = await RequestClaimSafeplace.update(
                requestClaimSafeplace.id,
                acceptedRequest,
                userCredientials.token
            );

            log.log(response);
            setRequestClaimSafeplace(acceptedRequest);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const refuseRequest = async () => {
        try {
            const refusedRequest = { ...requestClaimSafeplace, status: REFUSED_REQUEST, comment: refusedMessage };
            const response = await RequestClaimSafeplace.update(
                requestClaimSafeplace.id,
                refusedRequest,
                userCredientials.token
            );

            log.log(response);
            setRequestClaimSafeplace(refusedRequest);
            setRefusedMessage(undefined);
            setShownModal(false);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
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
                    <li key={`${requestClaimSafeplace.id}-buttons`}>
                        <div className="RequestClaimSafeplace-grid-container">
                            <Button text="Accepter" onClick={acceptRequest} width="100%"
                                onMouseOver={onMouseOver} onMouseOut={onMouseOut} />
                            <Button text="Refuser" onClick={openRefuseModal} width="100%" styleType="warning"
                                onMouseOver={onMouseOver} onMouseOut={onMouseOut} />
                        </div>
                    </li>
                </ul>
            </button>
            <Modal shown={refusedMessage !== undefined} content={
                <div className="RequestClaimSafeplace-Info">
                    <TextInput type="text" role="comment" label="Commentaire"
                        value={refusedMessage as string} setValue={setRefusedMessage} />
                    <Button text="Valider" onClick={refuseRequest} styleType="warning" />
                    <Button text="Annuler" onClick={closeRefuseModal} />
                </div>
            }/>
        </li>
    );
};

const RequestClaimSafeplaceMonitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [focusRequestClaimSafeplace, setFocusRequestClaimSafeplace] = useState<IRequestClaimSafeplace | undefined>(undefined);
    const [newRequestClaimSafeplace, setNewRequestClaimSafeplace] = useState<IRequestClaimSafeplace | undefined>(undefined);
    const [requestClaimSafeplaces, setRequestClaimSafeplaces] = useState<IRequestClaimSafeplace[]>([]);
    const [showModal, setShowModal] = useState(false);

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
            setShowModal(false);
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
            setNewRequestClaimSafeplace(undefined);
            setShowModal(false);
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
            setShowModal(false);
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    const onListElementClick = (requestClaimSafeplace: IRequestClaimSafeplace) => {
        if (!showModal) {
            setShowModal(true);
            setFocusRequestClaimSafeplace(requestClaimSafeplace);
        }
    };

    const onListElementStopButtonClick = () => {
        setFocusRequestClaimSafeplace(undefined);
        setShowModal(false);
    };

    const onCreateButtonClick = () => {
        if (!showModal) {
            setShowModal(true);
            setNewRequestClaimSafeplace({
                id: "",
                userId: "",
                safeplaceId: "",
                status: "Pending",
                comment: ""
            });
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
                width="98%" onClick={onCreateButtonClick} />
            <RequestClaimSafeplaceInfoForm
                shown={newRequestClaimSafeplace !== undefined}
                requestClaimSafeplace={newRequestClaimSafeplace as IRequestClaimSafeplace}
                setRequestClaimSafeplace={setNewRequestClaimSafeplace}
                buttons={[
                    <Button key="create-id" text="Créer une requête de safeplace" onClick={() => {
                        createNewRequestClaimSafeplace(newRequestClaimSafeplace as IRequestClaimSafeplace);
                        setNewRequestClaimSafeplace(undefined);
                        setShowModal(false);
                    }} />,
                    <Button key="stop-id" text="Annuler" onClick={() => {
                        setNewRequestClaimSafeplace(undefined);
                        setShowModal(false);
                    }} />
                ]}
            />
            <List
                items={requestClaimSafeplaces}
                focusItem={focusRequestClaimSafeplace}
                itemDisplayer={(item) =>
                    <RequestClaimSafeplaceInfoListElement
                        requestClaimSafeplace={item}
                        showModal={showModal}
                        setShownModal={setShowModal}
                        onClick={onListElementClick}
                        setRequestClaimSafeplace={setRequestClaimSafeplace}
                    />
                }
                itemUpdater={(item) =>
                    <RequestClaimSafeplaceInfoForm
                        shown={focusRequestClaimSafeplace !== undefined}
                        requestClaimSafeplace={item}
                        setRequestClaimSafeplace={setFocusRequestClaimSafeplace}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveRequestClaimSafeplaceModification(item)} />,
                            <Button key="stop-id" text="Annuler" onClick={onListElementStopButtonClick} />,
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