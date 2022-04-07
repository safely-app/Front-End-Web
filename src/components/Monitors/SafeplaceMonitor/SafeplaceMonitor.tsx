import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { Safeplace } from '../../../services';
import ISafeplace from '../../interfaces/ISafeplace';
import {
    Button,
    Modal,
    TextInput,
    Dropdown,
    SearchBar
} from '../../common';
import log from 'loglevel';
import { ToastContainer } from 'react-toastify';
import { SAFEPLACE_TYPES } from './SafeplaceMonitorVariables';
import {
    notifyError,
    convertStringToRegex
} from '../../utils';
import {
    displayTimetable,
    splitTimetable,
    displayCoordinates
} from './utils';

interface ISafeplaceInfoProps {
    safeplace: ISafeplace;
    setSafeplace: (safeplace: ISafeplace | undefined) => void;
    saveSafeplaceModification: (safeplace: ISafeplace) => void;
    deleteSafeplace: (safeplace: ISafeplace) => void;
    shown?: boolean;
}

const SafeplaceInfoForm: React.FC<ISafeplaceInfoProps> = ({
    safeplace,
    setSafeplace,
    saveSafeplaceModification,
    deleteSafeplace,
    shown
}) => {
    const [displayedTimetable, setDisplayedTimetable] = useState(displayTimetable(safeplace.dayTimetable));

    const setName = (name: string) => {
        setSafeplace({ ...safeplace, name: name });
    };

    const setCity = (city: string) => {
        setSafeplace({ ...safeplace, city: city });
    };

    const setAddress = (address: string) => {
        setSafeplace({ ...safeplace, address: address });
    };

    const setType = (type: string) => {
        setSafeplace({ ...safeplace, type: type });
    };

    const setDayTimetable = (dayTimetable: string) => {
        setDisplayedTimetable(dayTimetable);

        try {
            setSafeplace({ ...safeplace, dayTimetable: splitTimetable(dayTimetable) });
        } catch (e) {
            log.error(e);
        }
    };

    const setLatitude = (latitude: string) => {
        setSafeplace({ ...safeplace, coordinate: [ latitude, safeplace.coordinate[1] ] });
    };

    const setLongitude = (longitude: string) => {
        setSafeplace({ ...safeplace, coordinate: [ safeplace.coordinate[0], longitude ] });
    };

    const setOwnerId = (ownerId: string) => {
        setSafeplace({ ...safeplace, ownerId: ownerId });
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="Monitor-Info text-center">
                <TextInput key={`${safeplace.id}-id`} type="text" role="id"
                    label="Identifiant de la safeplace" value={safeplace.id} setValue={() => {}} readonly={true} />
                <TextInput key={`${safeplace.id}-name`} type="text" role="name"
                    label="Nom de la safeplace" value={safeplace.name} setValue={setName} />
                <TextInput key={`${safeplace.id}-city`} type="text" role="city"
                    label="Ville" value={safeplace.city} setValue={setCity} />
                <TextInput key={`${safeplace.id}-address`} type="text" role="address"
                    label="Adresse" value={safeplace.address} setValue={setAddress} />
                <TextInput key={`${safeplace.id}-timetable`} type="text" role="timetable"
                    label="Horaires" value={displayedTimetable} setValue={setDayTimetable} />
                <TextInput key={`${safeplace.id}-type`} type="text" role="type"
                    label="Type" value={safeplace.type} setValue={setType} />
                <div className="grid-container">
                    <TextInput key={`${safeplace.id}-coordinate1`} type="text" role="latitude" className="w-full"
                        label="Latitude" value={safeplace.coordinate[0]} setValue={setLatitude} />
                    <TextInput key={`${safeplace.id}-coordinate2`} type="text" role="longitude" className="w-full"
                        label="Longitude" value={safeplace.coordinate[1]} setValue={setLongitude} />
                </div>
                <TextInput key={`${safeplace.id}-ownerId`} type="text" role="ownerId"
                    label="ID du propriétaire" value={safeplace.ownerId as string} setValue={setOwnerId} />
                <Button key="save-id" text="Sauvegarder" onClick={() => saveSafeplaceModification(safeplace)} />
                <Button key="stop-id" text="Annuler" onClick={() => setSafeplace(undefined)} />
                <Button key="delete-id" text="Supprimer" onClick={() => deleteSafeplace(safeplace)} type="warning" />
            </div>
        }/>
    );
};

interface ISafeplaceInfoListElementProps {
    safeplace: ISafeplace;
    onClick: (safeplace: ISafeplace) => void;
}

const SafeplaceInfoListElement: React.FC<ISafeplaceInfoListElementProps> = ({
    safeplace,
    onClick
}) => {
    const handleClick = () => {
        onClick(safeplace);
    };

    return (
        <div key={safeplace.id} className="bg-white p-4 rounded">
            <button className="w-full h-full text-left" onClick={handleClick}>
                <ul>
                    <li key={`${safeplace.id}-id`}><b>ID : </b>{safeplace.id}</li>
                    <li key={`${safeplace.id}-name`}><b>Nom : </b>{safeplace.name}</li>
                    <li key={`${safeplace.id}-city`}><b>Ville : </b>{safeplace.city}</li>
                    <li key={`${safeplace.id}-address`}><b>Adresse : </b>{safeplace.address}</li>
                    <li key={`${safeplace.id}-timetable`}><b>Horaires : </b>{displayTimetable(safeplace.dayTimetable)}</li>
                    <li key={`${safeplace.id}-type`}><b>Type : </b>{safeplace.type}</li>
                    <li key={`${safeplace.id}-coordinate`}><b>Coordonnées : </b>{displayCoordinates(safeplace.coordinate)}</li>
                    <li key={`${safeplace.id}-ownerId`} hidden={safeplace.ownerId === undefined}><b>ID du propriétaire : </b>{safeplace.ownerId}</li>
                </ul>
            </button>
        </div>
    );
}

interface ISafeplaceMonitorFilterProps {
    searchBarValue: string;
    setDropdownValue: (value: string) => void;
    setSearchBarValue: (value: string) => void;
}

const SafeplaceMonitorFilter: React.FC<ISafeplaceMonitorFilterProps> = ({
    searchBarValue,
    setDropdownValue,
    setSearchBarValue
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 md:grid-rows-1 px-4">
            <Dropdown width='10em' defaultValue='all' values={SAFEPLACE_TYPES} setValue={setDropdownValue} />
            <SearchBar label="Rechercher une safeplace" value={searchBarValue} setValue={setSearchBarValue} />
        </div>
    );
};

const SafeplaceMonitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [focusSafeplace, setFocusSafeplace] = useState<ISafeplace | undefined>(undefined);
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);
    const [safeplaceType, setSafeplaceType] = useState('all');
    const [searchText, setSearchText] = useState('');

    const setSafeplace = (safeplace: ISafeplace) => {
        setSafeplaces(safeplaces.map(safeplaceElement => safeplaceElement.id === safeplace.id ? safeplace : safeplaceElement));
    };

    const removeSafeplace = (safeplace: ISafeplace) => {
        setSafeplaces(safeplaces.filter(safeplaceElement => safeplaceElement.id !== safeplace.id));
    }

    const saveSafeplaceModification = async (safeplace: ISafeplace) => {
        try {
            await Safeplace.update(safeplace.id, safeplace, userCredientials.token);
            setSafeplace(focusSafeplace as ISafeplace);
            setFocusSafeplace(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const deleteSafeplace = async (safeplace: ISafeplace) => {
        try {
            await Safeplace.delete(safeplace.id, userCredientials.token);
            removeSafeplace(safeplace);
            setFocusSafeplace(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const filterSafeplaces = (): ISafeplace[] => {
        const lowerSearchText = convertStringToRegex(searchText.toLocaleLowerCase());

        if (safeplaceType === 'all' && searchText === '')
            return safeplaces;

        return safeplaces
            .filter(safeplace => safeplaceType !== 'all' ? safeplaceType === safeplace.type.toLowerCase() : true)
            .filter(safeplace => searchText !== ''
                ? safeplace.id.toLowerCase().match(lowerSearchText) !== null
                || safeplace.name.toLowerCase().match(lowerSearchText) !== null
                || safeplace.city.toLowerCase().match(lowerSearchText) !== null
                || safeplace.address.toLowerCase().match(lowerSearchText) !== null
                || (safeplace.description !== undefined && safeplace.description?.toLowerCase().match(lowerSearchText) !== null) : true);
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
        })
    }, [userCredientials]);

    return (
        <div style={{ textAlign: "center" }}>
            <SafeplaceMonitorFilter searchBarValue={searchText} setDropdownValue={setSafeplaceType} setSearchBarValue={setSearchText} />
            <div>
                {(focusSafeplace !== undefined) &&
                    <SafeplaceInfoForm
                        safeplace={focusSafeplace}
                        shown={focusSafeplace !== undefined}
                        setSafeplace={setFocusSafeplace}
                        saveSafeplaceModification={saveSafeplaceModification}
                        deleteSafeplace={deleteSafeplace}
                    />
                }
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 p-4">
                    {filterSafeplaces().map((safeplace, index) =>
                        <SafeplaceInfoListElement
                            key={index}
                            safeplace={safeplace}
                            onClick={safeplace => setFocusSafeplace(safeplace)}
                        />
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SafeplaceMonitor;