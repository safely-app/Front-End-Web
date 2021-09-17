import React, { useEffect, useState } from 'react';
import { Safeplace } from '../../services';
import { AppHeader } from '../Header/Header';
import ISafeplace from '../interfaces/ISafeplace';
import '../Profile/Profile.css';
import './Safeplace.css';
import log from 'loglevel';

interface ISafeplaceInfoListElementProps {
    safeplace: ISafeplace;
    updateIsListView: () => void;
}

const SafeplaceInfoListElement: React.FC<ISafeplaceInfoListElementProps> = ({
    safeplace,
    updateIsListView
}) => {
    const handleClick = () => {
        updateIsListView();
    };

    const displayTimetable = (timetable): (string | null)[] => {
        const days = ["Lundi", "Mardi","Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
        return days.map((day, index) => {
            if (timetable[index])
                return " " + day + ": " + timetable[index] + " |";
            return null;
        });
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
                </ul>
            </button>
        </li>
    );
}

const SafeplaceMonitor: React.FC = () => {
    const [isListView, setIsListView] = useState(true);
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);

    const updateIsListView = () => {
        setIsListView(!isListView);
    };

    useEffect(() => {
        Safeplace.getAll().then(response => {
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
    }, [isListView]);

    return (
        <div className="Safeplace">
            <AppHeader />
            <ul className="Safeplace-list">
                {log.log(safeplaces)}
                {safeplaces.map(safeplace =>
                    <SafeplaceInfoListElement
                        safeplace={safeplace}
                        updateIsListView={updateIsListView}
                        key={safeplace.id}
                    />
                )}
            </ul>
        </div>
    );
}

export default SafeplaceMonitor;