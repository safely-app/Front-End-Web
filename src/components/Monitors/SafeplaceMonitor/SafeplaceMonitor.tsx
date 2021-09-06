import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { Safeplaces } from '../../../services';
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
import { time } from 'console';

export const displayTimetable = (timetable: (string | null)[]): string => {
    const days = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche"
    ];

    return timetable.map((time, index) => ({ time: time, index: index }))
        .filter(item => item.time !== null)
        .map(item => days[item.index] + " : " + item.time)
        .join(" | ");
};

export const splitTimetable = (timetable: string): (string | null)[] => {
    const days = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche"
    ];

    const times = timetable.split(" | ");
    const result = times.map(time => {
        for (let index = 0; index < days.length; index++) {
            if (time.includes(days[index]))
                return { day: days[index], value: time.substring((days[index] + " : ").length) };
        }
    });

    return days.map(day => result.find(item => item?.day === day)?.value)
        .map(time => time !== undefined ? time : null);
};

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

    const setName = (name: string) => {
        setSafeplace({ ...safeplace, name: name });
    };

    const setDescription = (description: string) => {
        setSafeplace({ ...safeplace, description: description });
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
        setSafeplace({ ...safeplace, dayTimetable: splitTimetable(dayTimetable) });
    };

    return (
        <Modal shown={(shown !== undefined) ? shown : true} content={
            <div className="Safeplace-Info">
                <TextInput key={`${safeplace.id}-name`} type="text" role="name"
                    label="Nom de la safeplace" value={safeplace.name} setValue={setName} />
                <TextInput key={`${safeplace.id}-description`} type="text" role="description"
                    label="Description" value={safeplace.description} setValue={setDescription} />
                <TextInput key={`${safeplace.id}-city`} type="text" role="city"
                    label="Ville" value={safeplace.city} setValue={setCity} />
                <TextInput key={`${safeplace.id}-address`} type="text" role="address"
                    label="Adresse" value={safeplace.address} setValue={setAddress} />
                <TextInput key={`${safeplace.id}-timetable`} type="text" role="timetable"
                    label="Horaires" value={displayTimetable(safeplace.dayTimetable)} setValue={setDayTimetable} />
                <TextInput key={`${safeplace.id}-type`} type="text" role="type"
                    label="Type" value={safeplace.type} setValue={setType} />
                {buttons.map(button => button)}
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
    }

    return (
        <li key={safeplace.id} className="Safeplace-list-element">
            <button className="Safeplace-list-element-btn" onClick={handleClick}>
                <ul className="Safeplace-list">
                    <li key={`${safeplace.id}-id`}><b>ID : </b>{safeplace.id}</li>
                    <li key={`${safeplace.id}-name`}><b>Nom : </b>{safeplace.name}</li>
                    <li key={`${safeplace.id}-description`}><b>Description : </b>{safeplace.description}</li>
                    <li key={`${safeplace.id}-city`}><b>Ville : </b>{safeplace.city}</li>
                    <li key={`${safeplace.id}-address`}><b>Adresse : </b>{safeplace.address}</li>
                    <li key={`${safeplace.id}-timetable`}><b>Horaires : </b>{displayTimetable(safeplace.dayTimetable)}</li>
                    <li key={`${safeplace.id}-type`}><b>Type : </b>{safeplace.type}</li>
                </ul>
            </button>
        </li>
    );
}

const SafeplaceMonitor: React.FC = () => {
    const safeplaceCredientials = useSelector((state: RootState) => state.user.credentials);
    const [focusSafeplace, setFocusSafeplace] = useState<ISafeplace | undefined>(undefined);
    const [showModal, setShowModal] = useState(false);
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);

    const setSafeplace = (safeplace: ISafeplace) => {
        setSafeplaces(safeplaces.map(safeplaceElement => safeplaceElement.id === safeplace.id ? safeplace : safeplaceElement));
    };

    const removeSafeplace = (safeplace: ISafeplace) => {
        setSafeplaces(safeplaces.filter(safeplaceElement => safeplaceElement.id !== safeplace.id));
    }

    const saveSafeplaceModification = async (safeplace: ISafeplace) => {
        try {
            await Safeplaces.update(safeplace.id, safeplace, safeplaceCredientials.token);
            setSafeplace(focusSafeplace as ISafeplace);
            setFocusSafeplace(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    const deleteSafeplace = async (safeplace: ISafeplace) => {
        try {
            await Safeplaces.delete(safeplace.id, safeplaceCredientials.token);
            removeSafeplace(safeplace);
            setFocusSafeplace(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    useEffect(() => {
        Safeplaces.getAll(safeplaceCredientials.token).then(response => {
            const gotSafeplaces = response.data.map(safeplace => {
                return {
                    id: safeplace._id,
                    name: safeplace.name,
                    description: safeplace.description,
                    city: safeplace.city,
                    address: safeplace.address,
                    grade: safeplace.grade,
                    type: safeplace.type,
                    dayTimetable: safeplace.dayTimetable
                };
            });

            setSafeplaces(gotSafeplaces);
            log.log(gotSafeplaces);
        }).catch(error => {
            log.error(error);
        });
    }, [safeplaceCredientials]);

    return (
        <div style={{textAlign: "center"}}>
            <List
                items={safeplaces}
                focusItem={focusSafeplace}
                itemDisplayer={(item) => <SafeplaceInfoListElement safeplace={item} onClick={(safeplace: ISafeplace) => setFocusSafeplace(safeplace)} />}
                itemUpdater={(item) =>
                    <SafeplaceInfoForm
                        shown={!showModal}
                        safeplace={item}
                        setSafeplace={setFocusSafeplace}
                        buttons={[
                            <Button key="save-id" text="Sauvegarder" onClick={() => saveSafeplaceModification(item)} />,
                            <Button key="stop-id" text="Annuler" onClick={() => setFocusSafeplace(undefined)} />,
                            <Button key="delete-id" text="Supprimer" onClick={() => deleteSafeplace(item)} styleType="warning" />
                        ]}
                    />
                }
            />
            <ToastContainer />
        </div>
    );
}

export default SafeplaceMonitor;