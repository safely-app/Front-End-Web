import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { Notification, Safeplace, SafeplaceUpdate } from '../../../services';
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
import {
    displayCoordinates,
    displayTimetable,
    splitTimetable
} from '../SafeplaceMonitor/utils';

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
    const displayedTimetable = (safeplace !== undefined) ? displayTimetable(safeplace?.dayTimetable) : "";
    const [dayTimetable, setDayTimetable] = useState(displayTimetable(safeplaceUpdate.dayTimetable));

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

    const setTimetable = (timetable: string) => {
        setDayTimetable(timetable);
        setSafeplaceUpdate({
            ...safeplaceUpdate,
            dayTimetable: splitTimetable(timetable)
        });
    };

    const setCoordinate = (index: number, value: string) => {
        let newCoordinate = safeplaceUpdate.coordinate;

        newCoordinate[index] = value;
        setSafeplaceUpdate({
            ...safeplaceUpdate,
            coordinate: newCoordinate
        });
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="Monitor-Info text-left" style={{ paddingLeft: "20%", paddingRight: "20%" }}>
                <div className='grid grid-cols-2 items-center'>
                    <p className="font-bold">ID de la modification de safeplace</p>
                    <TextInput key={`${safeplaceUpdate.id}-id`} type="text" role="id" className="w-full"
                        label="Identifiant de la modification de safeplace" value={safeplaceUpdate.id} setValue={() => {}} readonly={true} />
                </div>
                <div className='grid grid-cols-2 items-center'>
                    <p className="font-bold">ID de la safeplace</p>
                    <TextInput key={`${safeplaceUpdate.id}-safeplaceId`} type="text" role="id" className="w-full"
                        label="Identifiant de la safeplace" value={safeplaceUpdate.safeplaceId} setValue={() => {}} readonly={true} />
                </div>
                <hr className="my-2" />
                <div className='grid grid-cols-2 items-center'>
                    <p className="text-gray-400">{safeplace?.name}</p>
                    <TextInput key={`${safeplaceUpdate.id}-name`} type="text" role="name" className="w-full"
                        label="Modification du nom de la safeplace" value={safeplaceUpdate.name} setValue={setName} />
                </div>
                <div className='grid grid-cols-2 items-center'>
                    <p className="text-gray-400">{safeplace?.description}</p>
                    <TextInput key={`${safeplaceUpdate.id}-description`} type="text" role="description" className="w-full"
                        label="Modification de la description de la safeplace" value={checkValue(safeplaceUpdate.description)} setValue={setDescription} />
                </div>
                <div className='grid grid-cols-2 items-center'>
                    <p className="text-gray-400">{safeplace?.city}</p>
                    <TextInput key={`${safeplaceUpdate.id}-city`} type="text" role="city" className="w-full"
                        label="Modification de la ville de la safeplace" value={safeplaceUpdate.city} setValue={setCity} />
                </div>
                <div className='grid grid-cols-2 items-center'>
                    <p className="text-gray-400">{safeplace?.address}</p>
                    <TextInput key={`${safeplaceUpdate.id}-address`} type="text" role="address" className="w-full"
                        label="Modification de l'adresse de la safeplace" value={safeplaceUpdate.address} setValue={setAddress} />
                </div>
                <div className='grid grid-cols-2 items-center'>
                    <p className="text-gray-400">{displayedTimetable !== "" ? displayedTimetable : "Horaires de la safeplace"}</p>
                    <TextInput key={`${safeplaceUpdate.id}-type`} type="text" role="type" className="w-full"
                        label="Modification des horaires de la safeplace" value={dayTimetable} setValue={setTimetable} />
                </div>
                <div className='grid grid-cols-2 items-center'>
                    <p className="text-gray-400">{safeplace?.type}</p>
                    <TextInput key={`${safeplaceUpdate.id}-type`} type="text" role="type" className="w-full"
                        label="Modification du type de la safeplace" value={safeplaceUpdate.type} setValue={setType} />
                </div>
                <hr className="my-2" />
                <div className='grid grid-cols-2 items-center'>
                    <p className="text-gray-400">{safeplace?.coordinate[0]}</p>
                    <p className="text-gray-400">{safeplace?.coordinate[1]}</p>
                </div>
                <div className='grid grid-cols-2 items-center'>
                    <TextInput key={`${safeplaceUpdate.id}-coordinate1`} type="text" role="latitude" className='w-full'
                        label="Latitude" value={safeplaceUpdate.coordinate[0]} setValue={(value) => setCoordinate(0, value)} />
                    <TextInput key={`${safeplaceUpdate.id}-coordinate2`} type="text" role="longitude" className='w-full'
                        label="Longitude" value={safeplaceUpdate.coordinate[1]} setValue={(value) => setCoordinate(1, value)} />
                </div>
                <Button key="validate-id" text="Valider" onClick={() => validateSafeplaceUpdate(safeplaceUpdate)} width="100%" />
                <Button key="save-id" text="Sauvegarder" onClick={() => saveSafeplaceUpdateModification(safeplaceUpdate)} width="100%" />
                <Button key="stop-id" text="Annuler" onClick={() => setSafeplaceUpdate(undefined)} width="100%" />
                <Button key="delete-id" text="Supprimer" onClick={() => deleteSafeplaceUpdate(safeplaceUpdate)} type="warning" width="100%" />
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
            notifyError(e);
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
            await deleteSafeplaceUpdate(safeplaceUpdate);
        } catch (e) {
            notifyError(e);
        }
    };

    const deleteSafeplaceUpdate = async (safeplaceUpdate: ISafeplaceUpdate) => {
        try {
            await SafeplaceUpdate.delete(safeplaceUpdate.id, userCredientials.token);
            removeSafeplaceUpdate(safeplaceUpdate);
            setFocusSafeplaceUpdate(undefined);
        } catch (e) {
            notifyError(e);
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
            notifyError(error);
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
            notifyError(error);
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