import React, { useEffect, useState } from 'react';
import ISafeplace from '../interfaces/ISafeplace';
import { ToastContainer } from 'react-toastify';
import { AppHeader } from '../Header/Header';
import {
    Button,
    List,
    SearchBar,
    Modal,
    TextInput
} from '../common';
import {
    convertStringToRegex,
    notifyError,
    notifySuccess
} from '../utils';
import log from 'loglevel';
import './Safeplaces.css';
import { Safeplace, RequestClaimSafeplace } from '../../services';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';

interface ISafeplaceInfoProps {
    safeplace: ISafeplace;
    setSafeplace: (safeplace: ISafeplace) => void;
    buttons: JSX.Element[];
    shown?: boolean;
};

const SafeplaceInfoForm: React.FC<ISafeplaceInfoProps> = ({
    safeplace,
    setSafeplace,
    buttons,
    shown
}) => {

    const setName = (name: string) => {
        setSafeplace({ ...safeplace, name: name });
    };

    const setCity = (city: string) => {
        setSafeplace({ ...safeplace, city: city });
    };

    const setAddress = (address: string) => {
        setSafeplace({ ...safeplace, address: address });
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
                {buttons}
            </div>
        } />
    );
};

interface ISafeplaceInfoListElementProps {
    safeplace: ISafeplace;
    onClick: (safeplace: ISafeplace) => void;
    onClickClaim: (safeplace: ISafeplace) => void;
}

const SafeplaceInfoListElement: React.FC<ISafeplaceInfoListElementProps> = ({
    safeplace,
    onClick,
    onClickClaim
}) => {
    const handleClick = () => {
        onClick(safeplace);
    };

    const handleClickClaim = () => {
        onClickClaim(safeplace);
    };

    return (
        <div key={safeplace.id} className="Safeplaces-list-element">
            <ul className="Safeplaces-list">
                <li key={`${safeplace.id}-name`}><b>Nom : </b>{safeplace.name}</li>
                <li key={`${safeplace.id}-city`}><b>Ville : </b>{safeplace.city}</li>
                <li key={`${safeplace.id}-address`}><b>Adresse : </b>{safeplace.address}</li>
                <li key={`${safeplace.id}-buttons`}>
                    <div className="Safeplaces-grid-container">
                        <Button text="Réclamer ce commerce" onClick={handleClickClaim} width="100%" />
                        <Button text="Modifier" onClick={handleClick} width="100%" />
                    </div>
                </li>
            </ul>
        </div>
    );
}

const Safeplaces: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [searchBarValue, setSearchBarValue] = useState<string>('');
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);
    const [focusSafeplace, setFocusSafeplace] = useState<ISafeplace | undefined>(undefined);

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
        const lowerSearchText = convertStringToRegex(searchBarValue.toLocaleLowerCase());

        return safeplaces
            .filter(safeplace => searchBarValue !== ''
                ? safeplace.id.toLowerCase().match(lowerSearchText) !== null
                || safeplace.city.toLowerCase().match(lowerSearchText) !== null
                || safeplace.name.toLowerCase().match(lowerSearchText) !== null
                || safeplace.type.toLowerCase().match(lowerSearchText) !== null
                || safeplace.address.toLowerCase().match(lowerSearchText) !== null : true);
    };


    const archiveSafeplace = async (safeplace: ISafeplace) => {
        try {
            await Safeplace.delete(safeplace.id, userCredientials.token);
            removeSafeplace(safeplace);
            setFocusSafeplace(undefined);
        } catch (e) {
            notifyError((e as Error).message);
        }
    };

    return (
        <div>
            <AppHeader />
            <div style={{ textAlign: "center" }}>
                <SearchBar
                    label="Rechercher un commerce"
                    value={searchBarValue}
                    setValue={setSearchBarValue}
                />
                <List
                    items={filterSafeplaces()}
                    focusItem={focusSafeplace}
                    itemDisplayer={(item) =>
                        <SafeplaceInfoListElement
                            safeplace={item}
                            onClick={safeplace => setFocusSafeplace(safeplace)}
                            onClickClaim={claimSafeplace} />}
                    itemUpdater={(item) =>
                        <SafeplaceInfoForm
                            safeplace={item}
                            shown={focusSafeplace !== undefined}
                            setSafeplace={setFocusSafeplace}
                            buttons={[
                                <Button key="save-id" text="Publier les modififications" onClick={() => saveSafeplaceModification(item)} />,
                                <Button key="stop-id" text="Annuler" onClick={() => setFocusSafeplace(undefined)} />,
                                <Button key="delete-id" text="Dépublier le commerce" onClick={() => deleteSafeplace(item)} type="warning" />,
                                <Button key="archive-id" text="Archiver le commerce" onClick={() => archiveSafeplace(item)} />
                            ]}
                        />
                    }
                />
                <ToastContainer />
            </div>
        </div>
    );
};

export default Safeplaces;