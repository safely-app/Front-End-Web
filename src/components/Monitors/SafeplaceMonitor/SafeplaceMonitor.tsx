import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';
import { Safeplaces } from '../../../services';
import ISafeplace from '../../interfaces/ISafeplace';
import { List } from '../../common';
import log from 'loglevel';
import './SafeplaceMonitor.css';

interface ISafeplaceInfoListElementProps {
    safeplace: ISafeplace;
}

const SafeplaceInfoListElement: React.FC<ISafeplaceInfoListElementProps> = ({
    safeplace
}) => {
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
            <button className="Safeplace-list-element-btn">
                <ul className="Safeplace-list">
                    <li key={`${safeplace.id}-id`}><b>ID : </b>{safeplace.id}</li>
                    <li key={`${safeplace.id}-name`}><b>Nom : </b>{safeplace.name}</li>
                    <li key={`${safeplace.id}-name`}><b>Description : </b>{safeplace.description}</li>
                    <li key={`${safeplace.id}-name`}><b>Ville : </b>{safeplace.city}</li>
                    <li key={`${safeplace.id}-name`}><b>Adresse : </b>{safeplace.address}</li>
                    <li key={`${safeplace.id}-name`}><b>Horaires : </b>{displayTimetable(safeplace.dayTimetable)}</li>
                    <li key={`${safeplace.id}-name`}><b>Note : </b>{safeplace.grade}</li>
                    <li key={`${safeplace.id}-name`}><b>Type : </b>{safeplace.type}</li>
                </ul>
            </button>
        </li>
    );
}

const Safeplace: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);

    useEffect(() => {
        Safeplaces.getAll(userCredientials.token).then(response => {
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
    }, [userCredientials]);

    return (
        <div style={{textAlign: "center"}}>
            <List
                items={safeplaces}
                focusItem={undefined}
                itemDisplayer={(item) => <SafeplaceInfoListElement safeplace={item} />}
                itemUpdater={() => <div />}
            />
        </div>
    );
}

export default Safeplace;