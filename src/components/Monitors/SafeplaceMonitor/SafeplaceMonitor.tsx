import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { Safeplace } from '../../../services';
import ISafeplace from '../../interfaces/ISafeplace';
import {
    List,
    Button,
    Modal,
    TextInput
} from '../../common';
import log from 'loglevel';
import './SafeplaceMonitor.css';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../../utils';
import {
    displayTimetable,
    splitTimetable,
    displayCoordinates
} from './utils';

interface ISafeplaceInfoProps {
    safeplace: ISafeplace;
    setSafeplace: (safeplace: ISafeplace) => void;
    buttons: JSX.Element[];
    shown?: boolean;
}

const SafeplaceInfoForm: React.FC<ISafeplaceInfoProps> = ({
    safeplace,
    setSafeplace,
    buttons,
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
            <div className="Safeplace-Info">
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
                    <TextInput key={`${safeplace.id}-coordinate1`} type="text" role="latitude" width="98%"
                        label="Latitude" value={safeplace.coordinate[0]} setValue={setLatitude} />
                    <TextInput key={`${safeplace.id}-coordinate2`} type="text" role="longitude" width="98%"
                        label="Longitude" value={safeplace.coordinate[1]} setValue={setLongitude} />
                </div>
                <TextInput key={`${safeplace.id}-ownerId`} type="text" role="ownerId"
                    label="ID du propriétaire" value={safeplace.ownerId as string} setValue={setOwnerId} />
                {buttons}
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
        <li key={safeplace.id} className="Safeplace-list-element">
            <button className="Safeplace-list-element-btn" onClick={handleClick}>
                <ul className="Safeplace-list">
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
        </li>
    );
}

const SafeplaceMonitor: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [focusSafeplace, setFocusSafeplace] = useState<ISafeplace | undefined>(undefined);
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);

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
        <div style={{textAlign: "center"}}>
            <List
                items={safeplaces}
                focusItem={focusSafeplace}
                itemDisplayer={(item) => <SafeplaceInfoListElement safeplace={item} onClick={(safeplace: ISafeplace) => setFocusSafeplace(safeplace)} />}
                itemUpdater={(item) =>
                    <SafeplaceInfoForm
                        shown={focusSafeplace !== undefined}
                        safeplace={item}
                        setSafeplace={setFocusSafeplace}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveSafeplaceModification(item)} />,
                            <Button key="stop-id" text="Annuler" onClick={() => setFocusSafeplace(undefined)} />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteSafeplace(item)} type="warning" />
                        ]}
                    />
                }
            />
            <ToastContainer />
        </div>
    );
}

export default SafeplaceMonitor;