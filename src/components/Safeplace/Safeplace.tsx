import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { Safeplaces } from '../../services';
import { AppHeader } from '../Header/Header';
import ISafeplace from '../interfaces/ISafeplace';
import '../Profile/Profile.css';
import './Safeplace.css';
import log from 'loglevel';

interface ISafeplaceInfoListElementProps {
    safeplace: ISafeplace;
    updateIsListView: () => void;
    setSafeplaceId: (value: string) => void;
}

const SafeplaceInfoListElement: React.FC<ISafeplaceInfoListElementProps> = ({ safeplace, updateIsListView, setSafeplaceId }) => {
    const handleClick = () => {
        setSafeplaceId(safeplace.id);
        updateIsListView();
    };

    return (
        <li key={safeplace.id} className="Safeplace-list-element">
            <button className="Safeplace-list-element-btn" onClick={handleClick}>
                <ul className="Safeplace-list">
                    <li key={`${safeplace.id}-id`}><b>ID : </b>{safeplace.id}</li>
                    <li key={`${safeplace.id}-name`}><b>Nom : </b>{safeplace.name}</li>
                    <li key={`${safeplace.id}-name`}><b>Description : </b>{safeplace.description}</li>
                    <li key={`${safeplace.id}-name`}><b>Ville : </b>{safeplace.city}</li>
                    <li key={`${safeplace.id}-name`}><b>Adresse : </b>{safeplace.address}</li>
                    <li key={`${safeplace.id}-name`}><b>Note : </b>{safeplace.grade}</li>
                    <li key={`${safeplace.id}-name`}><b>Type : </b>{safeplace.type}</li>
                </ul>
            </button>
        </li>
    );
}

const Safeplace: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [isListView, setIsListView] = useState(true);
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);
    const [safeplaceId, setSafeplaceId] = useState("");

    const updateIsListView = () => {
        setIsListView(!isListView);
    };

    const setSafeplace = (safeplace: ISafeplace) => {
        setSafeplaces(safeplaces.map(safeplaceElement => safeplaceElement.id === safeplace.id ? safeplace : safeplaceElement));
    };

    useEffect(() => {
        Safeplaces.getAll(userCredientials.token).then(response => {
            const gotSafeplaces = response.data.map(safeplace => {
                return {
                    id: safeplace.id,
                    name: safeplace.name,
                    description: safeplace.description,
                    city: safeplace.city ,
                    address: safeplace.address ,
                    grade: safeplace.grade ,
                    type: safeplace.type
                };
            });

            setSafeplaces(gotSafeplaces);
            console.log(gotSafeplaces);
        }).catch(error => {
            log.error(error);
        });
    }, [userCredientials, isListView]);

    return (
        <div className="Safeplace">
            <AppHeader />
            <ul className="Safeplace-list">
                {console.log(safeplaces)}
                {safeplaces.map(safeplace =>
                    <SafeplaceInfoListElement
                        safeplace={safeplace}
                        updateIsListView={updateIsListView}
                        setSafeplaceId={setSafeplaceId}
                        key={safeplace.id}
                    />
                )}
            </ul>
        </div>
    );
}

export default Safeplace;