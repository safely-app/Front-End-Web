import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { RequestClaimSafeplace } from '../../../services';
import IRequestClaimSafeplace from '../../interfaces/IRequestClaimSafeplace';
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

    const setSafeplaceName = (safeplaceName: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace as IRequestClaimSafeplace,
            safeplaceName: safeplaceName
        });
    };

    const setSafeplaceDescription = (safeplaceDescription: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace as IRequestClaimSafeplace,
            safeplaceDescription: safeplaceDescription
        });
    };

    const setStatus = (status: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace as IRequestClaimSafeplace,
            status: status
        });
    };

    const setUserComment = (comment: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace as IRequestClaimSafeplace,
            userComment: comment
        });
    };

    const setAdminComment = (comment: string) => {
        setRequestClaimSafeplace({
            ...requestClaimSafeplace as IRequestClaimSafeplace,
            adminComment: comment
        });
    };

    return (
        <Modal shown={shown} content={
            <div className="Monitor-Info">
                <TextInput key={`${requestClaimSafeplace?.id}-userId`} type="text" role="userId"
                    label="Identifiant d'utilisateur" value={requestClaimSafeplace?.userId as string} setValue={setUserId} />
                <TextInput key={`${requestClaimSafeplace?.id}-safeplaceId`} type="text" role="safeplaceId"
                    label="Identifiant de safeplace" value={requestClaimSafeplace?.safeplaceId as string} setValue={setSafeplaceId} />
                <TextInput key={`${requestClaimSafeplace?.id}-safeplaceName`} type="text" role="safeplaceName"
                    label="Nom de la safeplace" value={requestClaimSafeplace?.safeplaceName as string} setValue={setSafeplaceName} />
                <TextInput key={`${requestClaimSafeplace?.id}-safeplaceDescription`} type="text" role="safeplaceDescription"
                    label="Description de la safeplace" value={requestClaimSafeplace?.safeplaceDescription as string} setValue={setSafeplaceDescription} />
                <Dropdown key={`${requestClaimSafeplace?.id}-status`} values={REQUEST_STATUS}
                    setValue={setStatus} defaultValue={requestClaimSafeplace?.status as string} />
                <TextInput key={`${requestClaimSafeplace?.id}-userComment`} type="text" role="userComment"
                    label="Commentaire utilisateur" value={requestClaimSafeplace?.userComment !== undefined ? requestClaimSafeplace?.userComment : ""} setValue={setUserComment} />
                <TextInput key={`${requestClaimSafeplace?.id}-adminComment`} type="text" role="adminComment"
                    label="Commentaire administrateur" value={requestClaimSafeplace?.adminComment !== undefined ? requestClaimSafeplace.adminComment : ""} setValue={setAdminComment} />
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
            const refusedRequest = { ...requestClaimSafeplace, status: REFUSED_REQUEST, adminComment: refusedMessage };
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
        <div key={requestClaimSafeplace.id} className="bg-white p-4 rounded">
            <button className="w-full h-full text-left" onClick={handleClick}>
                <ul>
                    <li key={`${requestClaimSafeplace.id}-id`}><b>Identifiant : </b>{requestClaimSafeplace.id}</li>
                    <li key={`${requestClaimSafeplace.id}-userId`}><b>Identifiant d'utilisateur : </b>{requestClaimSafeplace.userId}</li>
                    <li key={`${requestClaimSafeplace.id}-safeplaceId`}><b>Identifiant de safeplace : </b>{requestClaimSafeplace.safeplaceId}</li>
                    <li key={`${requestClaimSafeplace.id}-status`}><b>Status : </b>{requestClaimSafeplace.status}</li>
                    <li key={`${requestClaimSafeplace.id}-userComment`}><b>Commentaire utilisateur : </b>{requestClaimSafeplace.userComment}</li>
                    <li key={`${requestClaimSafeplace.id}-adminComment`}><b>Commentaire administrateur : </b>{requestClaimSafeplace.adminComment}</li>
                    <li key={`${requestClaimSafeplace.id}-buttons`}>
                        {requestClaimSafeplace.status === PENDING_REQUEST &&
                            <div className="grid grid-cols-4">
                                <Button text="Accepter" onClick={acceptRequest} width="100%"
                                    onMouseOver={onMouseOver} onMouseOut={onMouseOut} />
                                <Button text="Refuser" onClick={openRefuseModal} width="100%" type="warning"
                                    onMouseOver={onMouseOver} onMouseOut={onMouseOut} />
                            </div>
                        }
                    </li>
                </ul>
            </button>
            <Modal shown={refusedMessage !== undefined} content={
                <div className="Monitor-Info">
                    <TextInput type="text" role="comment" label="Commentaire"
                        value={refusedMessage as string} setValue={setRefusedMessage} />
                    <Button text="Valider" onClick={refuseRequest} type="warning" />
                    <Button text="Annuler" onClick={closeRefuseModal} />
                </div>
            }/>
        </div>
    );
};

interface IRequestClaimSafeplaceMonitorFilterProps {
    searchBarValue: string;
    setDropdownValue: (value: string) => void;
    setSearchBarValue: (value: string) => void;
}

const RequestClaimSafeplaceMonitorFilter: React.FC<IRequestClaimSafeplaceMonitorFilterProps> = ({
    searchBarValue,
    setDropdownValue,
    setSearchBarValue
}) => {
    const REQUEST_TYPES = [
        'all',
        PENDING_REQUEST,
        ACCEPTED_REQUEST,
        REFUSED_REQUEST
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 md:grid-rows-1 px-4">
            <Dropdown width='10em' defaultValue='all' values={REQUEST_TYPES} setValue={setDropdownValue} />
            <SearchBar label="Rechercher une requête de safeplace" value={searchBarValue} setValue={setSearchBarValue} />
        </div>
    );
};

const RequestClaimSafeplaceMonitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [focusRequestClaimSafeplace, setFocusRequestClaimSafeplace] = useState<IRequestClaimSafeplace | undefined>(undefined);
    const [newRequestClaimSafeplace, setNewRequestClaimSafeplace] = useState<IRequestClaimSafeplace | undefined>(undefined);
    const [requestClaimSafeplaces, setRequestClaimSafeplaces] = useState<IRequestClaimSafeplace[]>([]);
    const [requestClaimSafeplaceStatus, setRequestClaimSafeplaceStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState('');

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
            const createdRequestClaimSafeplace: IRequestClaimSafeplace = {
                id: response.data._id,
                userId: response.data.userId,
                safeplaceId: response.data.safeplaceId,
                safeplaceName: response.data.safeplaceName,
                status: response.data.status,
                adminComment: response.data.adminComment,
                safeplaceDescription: response.data.safeplaceDescription,
                coordinate: response.data.coordinate,
                adminId: response.data.adminId,
                userComment: response.data.userComment
            };

            log.log(response);
            addRequestClaimSafeplace(createdRequestClaimSafeplace);
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
            setRequestClaimSafeplace(requestClaimSafeplace as IRequestClaimSafeplace);
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
                safeplaceName: "",
                status: PENDING_REQUEST,
                adminComment: "",
                safeplaceDescription: "",
                coordinate: [],
                adminId: userCredientials._id,
                userComment: ""
            });
        }
    };

    const filterRequestClaimSafeplaces = (): IRequestClaimSafeplace[] => {
        const lowerSearchText = convertStringToRegex(searchText.toLocaleLowerCase());

        return requestClaimSafeplaces
            .filter(requestClaimSafeplace => requestClaimSafeplaceStatus !== 'all' ? requestClaimSafeplaceStatus === requestClaimSafeplace.status : true)
            .filter(requestClaimSafeplace => searchText !== ''
                ? requestClaimSafeplace.id.toLowerCase().match(lowerSearchText) !== null
                || requestClaimSafeplace.userId.toLowerCase().match(lowerSearchText) !== null
                || requestClaimSafeplace.safeplaceId.toLowerCase().match(lowerSearchText) !== null
                || requestClaimSafeplace.safeplaceName.toLowerCase().match(lowerSearchText) !== null
                || requestClaimSafeplace.safeplaceDescription.toLowerCase().match(lowerSearchText) !== null
                || (requestClaimSafeplace.adminId !== undefined && requestClaimSafeplace.adminId.toLowerCase().match(lowerSearchText) !== null)
                || (requestClaimSafeplace.userComment !== undefined && requestClaimSafeplace.userComment.toLowerCase().match(lowerSearchText) !== null)
                || (requestClaimSafeplace.adminComment !== undefined && requestClaimSafeplace.adminComment.toLowerCase().match(lowerSearchText) !== null)
                : true);
    };

    useEffect(() => {
        RequestClaimSafeplace.getAll(userCredientials.token).then(response => {
            const gotRequestClaimSafeplaces = response.data.map(requestClaimSafeplace => ({
                id: requestClaimSafeplace._id,
                userId: requestClaimSafeplace.userId,
                safeplaceId: requestClaimSafeplace.safeplaceId,
                safeplaceName: requestClaimSafeplace.safeplaceName,
                status: requestClaimSafeplace.status,
                adminComment: requestClaimSafeplace.adminComment,
                safeplaceDescription: requestClaimSafeplace.safeplaceDescription,
                coordinate: requestClaimSafeplace.coordinate,
                adminId: requestClaimSafeplace.adminId,
                userComment: requestClaimSafeplace.userComment
            }));

            setRequestClaimSafeplaces(gotRequestClaimSafeplaces);
        }).catch(error => {
            log.error(error);
            notifyError(error);
        });
    }, [userCredientials]);

    return (
        <div style={{textAlign: "center"}}>
            <button className="w-50 h-full justify-center py-2 px-4 border border-transparent rounded-3xl shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mb-4" onClick={onCreateButtonClick}>Créer une nouvelle requête de safeplace</button>
            <RequestClaimSafeplaceMonitorFilter searchBarValue={searchText} setDropdownValue={setRequestClaimSafeplaceStatus} setSearchBarValue={setSearchText} />
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
            <div>
                {(focusRequestClaimSafeplace !== undefined) &&
                    <RequestClaimSafeplaceInfoForm
                        shown={focusRequestClaimSafeplace !== undefined}
                        requestClaimSafeplace={focusRequestClaimSafeplace}
                        setRequestClaimSafeplace={setFocusRequestClaimSafeplace}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveRequestClaimSafeplaceModification(focusRequestClaimSafeplace)} />,
                            <Button key="stop-id" text="Annuler" onClick={onListElementStopButtonClick} />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteRequestClaimSafeplace(focusRequestClaimSafeplace)} type="warning" />
                        ]}
                    />
                }
               <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 m-4">
                    {filterRequestClaimSafeplaces().map((requestClaimSafeplace, index) =>
                        <RequestClaimSafeplaceInfoListElement
                            key={index}
                            requestClaimSafeplace={requestClaimSafeplace}
                            showModal={showModal}
                            setShownModal={setShowModal}
                            onClick={onListElementClick}
                            setRequestClaimSafeplace={setRequestClaimSafeplace}
                        />
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default RequestClaimSafeplaceMonitor;