import React, { useEffect, useState } from 'react';
import ISafeplace from '../interfaces/ISafeplace';
import { ToastContainer } from 'react-toastify';
import { AppHeader } from '../Header/Header';
import {
    Button,
    List,
    SearchBar
} from '../common';
import { convertStringToRegex, notifyError, notifySuccess } from '../utils';
import log from 'loglevel';
import './Safeplaces.css';
import { Safeplace, RequestClaimSafeplace } from '../../services';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';

interface ISafeplaceInfoListElementProps {
    safeplace: ISafeplace;
    onClickClaim: (safeplace: ISafeplace) => void;
};

const SafeplaceInfoListElement: React.FC<ISafeplaceInfoListElementProps> = ({
    safeplace,
    onClickClaim
}) => {
    const handleClick = () => {
        onClickClaim(safeplace);
    };

    return (
        <li key={safeplace.id} className="Safeplaces-list-element">
            <ul className="Safeplaces-list">
                <li key={`${safeplace.id}-name`}><b>Nom : </b>{safeplace.name}</li>
                <li key={`${safeplace.id}-city`}><b>Ville : </b>{safeplace.city}</li>
                <li key={`${safeplace.id}-address`}><b>Adresse : </b>{safeplace.address}</li>
                <li key={`${safeplace.id}-buttons`}>
                    <div className="Safeplaces-grid-container">
                        <Button text="Réclamer ce commerce" onClick={handleClick} width="100%" />
                    </div>
                </li>
            </ul>
        </li>
    );
};

const Safeplaces: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [searchBarValue, setSearchBarValue] = useState<string>('');
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);

    const filterSafeplaces = (): ISafeplace[] => {
        const lowerSearchText = convertStringToRegex(searchBarValue.toLowerCase());

        return safeplaces
            .filter(safeplace => searchBarValue !== ''
                ? safeplace.name.toLowerCase().match(lowerSearchText)
                || safeplace.address.toLowerCase().match(lowerSearchText)
                || safeplace.city.toLowerCase().match(lowerSearchText) : true);
    };

    const claimSafeplace = async (safeplace: ISafeplace) => {
        try {
            const response = await RequestClaimSafeplace.create({
                id: '',
                userId: userCredientials._id,
                safeplaceId: safeplace.id,
                safeplaceName: safeplace.name,
                status: 'Pending',
                safeplaceDescription: (safeplace?.description !== undefined) ? safeplace?.description : "Vide",
                coordinate: safeplace.coordinate
            }, userCredientials.token);

            log.log(response);
            notifySuccess("Votre requête a été créée");
        } catch (e) {
            log.error(e);
            notifyError((e as Error).message);
        }
    };

    useEffect(() => {
        Safeplace.getAll(userCredientials.token).then(response => {
            const gotSafeplaces = response.data.map(safeplace => ({
                id: safeplace._id,
                name: safeplace.name,
                city: safeplace.city,
                address: safeplace.address,
                type: safeplace.type,
                dayTimetable: safeplace.dayTimetable,
                coordinate: safeplace.coordinate
            }));

            log.log(response);
            setSafeplaces(gotSafeplaces);
        }).catch(error => {
            log.error(error);
            notifyError(error);
        })
    }, [userCredientials]);

    return (
        <div>
            <AppHeader />
            <div style={{textAlign: "center"}}>
                <SearchBar
                    label="Rechercher un commerce"
                    value={searchBarValue}
                    setValue={setSearchBarValue}
                />
                <List
                    items={filterSafeplaces()}
                    itemDisplayer={(item) =>
                        <SafeplaceInfoListElement
                            safeplace={item}
                            onClickClaim={claimSafeplace}
                        />
                    }
                />
                <ToastContainer />
            </div>
        </div>
    );
};

export default Safeplaces;