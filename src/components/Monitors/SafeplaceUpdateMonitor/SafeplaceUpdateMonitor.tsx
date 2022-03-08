import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { Safeplace, SafeplaceUpdate } from '../../../services';
import ISafeplace from '../../interfaces/ISafeplace';
import ISafeplaceUpdate from '../../interfaces/ISafeplaceUpdate';
import {
    Button,
    Modal,
    TextInput,
    SearchBar
} from '../../common';
import log from 'loglevel';
import { ToastContainer } from 'react-toastify';
import { convertStringToRegex, notifyError } from '../../utils';
import { displayCoordinates, displayTimetable } from '../SafeplaceMonitor/utils';

interface ISafeplaceUpdateInfoProps {
    safeplaceUpdate: ISafeplaceUpdate;
    setSafeplaceUpdate: (safeplaceUpdate: ISafeplaceUpdate | undefined) => void;
    saveSafeplaceUpdateModification: (safeplaceUpdate: ISafeplaceUpdate) => void;
    validateSafeplaceUpdate: (safeplaceUpdate: ISafeplaceUpdate) => void;
    deleteSafeplaceUpdate: (safeplaceUpdate: ISafeplaceUpdate) => void;
    safeplace?: ISafeplace;
    shown?: boolean;
}

const SafeplaceUpdateInfoForm: React.FC<ISafeplaceUpdateInfoProps> = ({
    safeplaceUpdate,
    setSafeplaceUpdate,
    saveSafeplaceUpdateModification,
    validateSafeplaceUpdate,
    deleteSafeplaceUpdate,
    safeplace,
    shown
}) => {
    const checkValue = (value: string | undefined) => {
        return value !== undefined ? value : "";
    };

    const setName = (name: string) => {
        setSafeplaceUpdate({ ...safeplaceUpdate, name: name });
    };

    const setDescription = (description: string) => {
        setSafeplaceUpdate({ ...safeplaceUpdate, description: description });
    };

    const setCity = (city: string) => {
        setSafeplaceUpdate({ ...safeplaceUpdate, city: city });
    };

    const setAddress = (address: string) => {
        setSafeplaceUpdate({ ...safeplaceUpdate, address: address });
    };

    const setType = (type: string) => {
        setSafeplaceUpdate({ ...safeplaceUpdate, type: type });
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="Monitor-Info">
                <TextInput key={`${safeplaceUpdate.id}-id`} type="text" role="id"
                    label="Identifiant de la modification de safeplace" value={safeplaceUpdate.id} setValue={() => {}} readonly={true} />
                <div className='grid grid-cols-2' style={{ marginLeft: "20%", marginRight: "20%" }}>
                    <p className="text-left text-gray-400">{safeplace?.name}</p>
                    <TextInput key={`${safeplaceUpdate.id}-name`} type="text" role="name" className="w-full"
                        label="Modification du nom de la safeplace" value={safeplaceUpdate.name} setValue={setName} />
                </div>
                <div className='grid grid-cols-2' style={{ marginLeft: "20%", marginRight: "20%" }}>
                    <p className="text-left text-gray-400">{safeplace?.description}</p>
                    <TextInput key={`${safeplaceUpdate.id}-description`} type="text" role="description" className="w-full"
                        label="Modification de la description de la safeplace" value={checkValue(safeplaceUpdate.description)} setValue={setDescription} />
                </div>
                <div className='grid grid-cols-2' style={{ marginLeft: "20%", marginRight: "20%" }}>
                    <p className="text-left text-gray-400">{safeplace?.city}</p>
                    <TextInput key={`${safeplaceUpdate.id}-city`} type="text" role="city" className="w-full"
                        label="Modification de la ville de la safeplace" value={safeplaceUpdate.city} setValue={setCity} />
                </div>
                <div className='grid grid-cols-2' style={{ marginLeft: "20%", marginRight: "20%" }}>
                    <p className="text-left text-gray-400">{safeplace?.address}</p>
                    <TextInput key={`${safeplaceUpdate.id}-address`} type="text" role="address" className="w-full"
                        label="Modification de l'adresse de la safeplace" value={safeplaceUpdate.address} setValue={setAddress} />
                </div>
                <div className='grid grid-cols-2' style={{ marginLeft: "20%", marginRight: "20%" }}>
                    <p className="text-left text-gray-400">{safeplace?.type}</p>
                    <TextInput key={`${safeplaceUpdate.id}-type`} type="text" role="type" className="w-full"
                        label="Modification du type de la safeplace" value={safeplaceUpdate.type} setValue={setType} />
                </div>
                <TextInput key={`${safeplaceUpdate.id}-safeplaceId`} type="text" role="id"
                    label="Identifiant de la safeplace" value={safeplaceUpdate.safeplaceId} setValue={() => {}} readonly={true} />
                <Button key="validate-id" text="Valider" onClick={() => validateSafeplaceUpdate(safeplaceUpdate)} />
                <Button key="save-id" text="Sauvegarder" onClick={() => saveSafeplaceUpdateModification(safeplaceUpdate)} />
                <Button key="stop-id" text="Annuler" onClick={() => setSafeplaceUpdate(undefined)} />
                <Button key="delete-id" text="Supprimer" onClick={() => deleteSafeplaceUpdate(safeplaceUpdate)} type="warning" />
            </div>
        }/>
    );
};

interface ISafeplaceUpdateInfoListElementProps {
    safeplaceUpdate: ISafeplaceUpdate;
    onClick: (safeplaceUpdate: ISafeplaceUpdate) => void;
}

const SafeplaceUpdateInfoListElement: React.FC<ISafeplaceUpdateInfoListElementProps> = ({
    safeplaceUpdate,
    onClick
}) => {
    const handleClick = () => {
        onClick(safeplaceUpdate);
    };

    return (
        <div key={safeplaceUpdate.id} className="bg-white p-4 rounded">
            <button className="w-full h-full text-left" onClick={handleClick} data-testid={`safeplaceUpdate-button-${safeplaceUpdate.id}`}>
                <ul>
                    <li key={`${safeplaceUpdate.id}-id`}><b>ID : </b>{safeplaceUpdate.id}</li>
                    <li key={`${safeplaceUpdate.id}-name`}><b>Nom : </b>{safeplaceUpdate.name}</li>
                    <li key={`${safeplaceUpdate.id}-description`}><b>Description : </b>{safeplaceUpdate?.description}</li>
                    <li key={`${safeplaceUpdate.id}-city`}><b>Ville : </b>{safeplaceUpdate.city}</li>
                    <li key={`${safeplaceUpdate.id}-address`}><b>Adresse : </b>{safeplaceUpdate.address}</li>
                    <li key={`${safeplaceUpdate.id}-timetable`}><b>Horaires : </b>{displayTimetable(safeplaceUpdate.dayTimetable)}</li>
                    <li key={`${safeplaceUpdate.id}-type`}><b>Type : </b>{safeplaceUpdate.type}</li>
                    <li key={`${safeplaceUpdate.id}-coordinate`}><b>Coordonnées : </b>{displayCoordinates(safeplaceUpdate.coordinate)}</li>
                    <li key={`${safeplaceUpdate.id}-safeplaceId`} hidden={safeplaceUpdate.safeplaceId === undefined}><b>ID de la safeplace : </b>{safeplaceUpdate.safeplaceId}</li>
                </ul>
            </button>
        </div>
    );
}

interface ISafeplaceUpdateMonitorFilterProps {
    searchBarValue: string;
    setSearchBarValue: (value: string) => void;
}

const SafeplaceUpdateMonitorFilter: React.FC<ISafeplaceUpdateMonitorFilterProps> = ({
    searchBarValue,
    setSearchBarValue
}) => {
    return (
        <SearchBar label="Rechercher une safeplace" value={searchBarValue} setValue={setSearchBarValue} />
    );
};

const SafeplaceUpdateMonitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [focusSafeplaceUpdate, setFocusSafeplaceUpdate] = useState<ISafeplaceUpdate | undefined>(undefined);
    const [safeplaceUpdates, setSafeplaceUpdates] = useState<ISafeplaceUpdate[]>([]);
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);
    const [searchText, setSearchText] = useState('');

    const setSafeplaceUpdate = (safeplaceUpdate: ISafeplaceUpdate) => {
        setSafeplaceUpdates(safeplaceUpdates.map(safeplaceUpdateElement => safeplaceUpdateElement.id === safeplaceUpdate.id ? safeplaceUpdate : safeplaceUpdateElement));
    };

    const removeSafeplaceUpdate = (safeplaceUpdate: ISafeplaceUpdate) => {
        setSafeplaceUpdates(safeplaceUpdates.filter(safeplaceUpdateElement => safeplaceUpdateElement.id !== safeplaceUpdate.id));
    };

    const getSafeplaceById = (id: string): ISafeplace | undefined => {
        return safeplaces.find(safeplace => safeplace.id === id);
    };

    const saveSafeplaceUpdateModification = async (safeplaceUpdate: ISafeplaceUpdate) => {
        try {
            await SafeplaceUpdate.update(safeplaceUpdate.id, safeplaceUpdate, userCredientials.token);
            setSafeplaceUpdate(focusSafeplaceUpdate as ISafeplaceUpdate);
            setFocusSafeplaceUpdate(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const validateSafeplaceUpdate = async (safeplaceUpdate: ISafeplaceUpdate) => {
        const safeplace: ISafeplace = {
            id: safeplaceUpdate.safeplaceId,
            name: safeplaceUpdate.name,
            description: safeplaceUpdate.description,
            city: safeplaceUpdate.city,
            address: safeplaceUpdate.address,
            type: safeplaceUpdate.type,
            dayTimetable: safeplaceUpdate.dayTimetable,
            coordinate: safeplaceUpdate.coordinate,
            ownerId: safeplaceUpdate.ownerId
        };

        try {
            await Safeplace.update(safeplace.id, safeplace, userCredientials.token);
            deleteSafeplaceUpdate(safeplaceUpdate);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const deleteSafeplaceUpdate = async (safeplaceUpdate: ISafeplaceUpdate) => {
        try {
            await SafeplaceUpdate.delete(safeplaceUpdate.id, userCredientials.token);
            removeSafeplaceUpdate(safeplaceUpdate);
            setFocusSafeplaceUpdate(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const filterSafeplaceUpdates = (): ISafeplaceUpdate[] => {
        const lowerSearchText = convertStringToRegex(searchText.toLocaleLowerCase());

        return safeplaceUpdates
            .filter(safeplaceUpdate => searchText !== ''
                ? safeplaceUpdate.id.toLowerCase().match(lowerSearchText) !== null
                || safeplaceUpdate.name.toLowerCase().match(lowerSearchText) !== null
                || safeplaceUpdate.city.toLowerCase().match(lowerSearchText) !== null
                || safeplaceUpdate.address.toLowerCase().match(lowerSearchText) !== null
                || (safeplaceUpdate.description !== undefined && safeplaceUpdate.description?.toLowerCase().match(lowerSearchText) !== null) : true);
    };

    useEffect(() => {
        Safeplace.getAll(userCredientials.token).then(response => {
            const gotSafeplaces = response.data.map(safeplace => ({
                id: safeplace._id,
                name: safeplace.name,
                description: safeplace.description,
                city: safeplace.city,
                address: safeplace.address,
                type: safeplace.type,
                dayTimetable: safeplace.dayTimetable,
                coordinate: safeplace.coordinate,
                ownerId: safeplace.ownerId
            }) as ISafeplace);

            setSafeplaces(gotSafeplaces);
            log.log(gotSafeplaces);
        }).catch(error => {
            log.error(error);
        });

        SafeplaceUpdate.getAll(userCredientials.token).then(response => {
            const gotSafeplaceUpdates = response.data.map(safeplaceUpdate => ({
                id: safeplaceUpdate._id,
                safeplaceId: safeplaceUpdate.safeplaceId,
                name: safeplaceUpdate.name,
                description: safeplaceUpdate.description,
                city: safeplaceUpdate.city,
                address: safeplaceUpdate.address,
                type: safeplaceUpdate.type,
                dayTimetable: safeplaceUpdate.dayTimetable,
                coordinate: safeplaceUpdate.coordinate,
                ownerId: safeplaceUpdate.ownerId
            }) as ISafeplaceUpdate);

            setSafeplaceUpdates(gotSafeplaceUpdates);
            log.log(gotSafeplaceUpdates);
        }).catch(error => {
            log.error(error);
        });
    }, [userCredientials]);

    return (
        <div style={{ textAlign: "center" }}>
            <SafeplaceUpdateMonitorFilter searchBarValue={searchText} setSearchBarValue={setSearchText} />
            <div>
                {(focusSafeplaceUpdate !== undefined) &&
                    <SafeplaceUpdateInfoForm
                        safeplaceUpdate={focusSafeplaceUpdate}
                        shown={focusSafeplaceUpdate !== undefined}
                        setSafeplaceUpdate={setFocusSafeplaceUpdate}
                        safeplace={getSafeplaceById(focusSafeplaceUpdate.safeplaceId)}
                        saveSafeplaceUpdateModification={saveSafeplaceUpdateModification}
                        validateSafeplaceUpdate={validateSafeplaceUpdate}
                        deleteSafeplaceUpdate={deleteSafeplaceUpdate}
                    />
                }
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 m-4">
                    {filterSafeplaceUpdates().map((safeplaceUpdate, index) =>
                        <SafeplaceUpdateInfoListElement
                            key={index}
                            safeplaceUpdate={safeplaceUpdate}
                            onClick={safeplaceUpdate => setFocusSafeplaceUpdate(safeplaceUpdate)}
                        />
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SafeplaceUpdateMonitor;