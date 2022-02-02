import React, { useEffect, useState } from 'react';
import ISafeplace from '../interfaces/ISafeplace';
import { ToastContainer } from 'react-toastify';
import { AppHeader } from '../Header/Header';
import {
    Button,
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
import { Safeplace, RequestClaimSafeplace } from '../../services';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import shop from '../../assets/image/shop.jpg'

interface ISafeplaceInfoProps {
    safeplace: ISafeplace;
    setSafeplace: (safeplace: ISafeplace | undefined) => void;
    saveSafeplaceModification: (safeplace: ISafeplace) => void;
    archiveSafeplace: (safeplace: ISafeplace) => void;
    deleteSafeplace: (safeplace: ISafeplace) => void;
    shown?: boolean;
};

const SafeplaceInfoForm: React.FC<ISafeplaceInfoProps> = ({
    safeplace,
    setSafeplace,
    saveSafeplaceModification,
    archiveSafeplace,
    deleteSafeplace,
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
                <Button key="save-id" text="Publier les modififications" onClick={() => saveSafeplaceModification(safeplace)} />,
                <Button key="stop-id" text="Annuler" onClick={() => setSafeplace(undefined)} />,
                <Button key="delete-id" text="Dépublier le commerce" onClick={() => deleteSafeplace(safeplace)} type="warning" />,
                <Button key="archive-id" text="Archiver le commerce" onClick={() => archiveSafeplace(safeplace)} />
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
        <div key={safeplace.id} className="p-4 flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row w-full hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img className="object-cover w-full h-96 rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={shop} alt=""></img>
            <div className="flex flex-col justify-between p-4 leading-normal space-y-2">
                <div className="text-left">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{safeplace.name}</h5>
                    <p key={`${safeplace.id}-city`}><b>Ville : </b>{safeplace.city}</p>
                    <p key={`${safeplace.id}-address`}><b>Adresse : </b>{safeplace.address}</p>
                </div>
                <button onClick={handleClickClaim} className="inline-flex w-56 items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Réclamer ce commerce
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
                <button onClick={handleClick} className="inline-flex w-56 items-center py-2 px-3 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Modifier
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
            </div>
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
        <div className="min-h-screen bg-background bg-transparent space-y-2 bg-cover bg-center">
            <AppHeader />
            <div style={{ textAlign: "center" }}>
                <SearchBar label="Rechercher un commerce" value={searchBarValue} setValue={setSearchBarValue} />
                <div>
                    {(focusSafeplace !== undefined) &&
                        <SafeplaceInfoForm
                            safeplace={focusSafeplace}
                            shown={focusSafeplace !== undefined}
                            setSafeplace={setFocusSafeplace}
                            saveSafeplaceModification={saveSafeplaceModification}
                            archiveSafeplace={archiveSafeplace}
                            deleteSafeplace={deleteSafeplace}
                        />
                    }
                    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 m-4">
                        {filterSafeplaces().map((safeplace, index) =>
                            <SafeplaceInfoListElement
                                key={index}
                                safeplace={safeplace}
                                onClick={safeplace => setFocusSafeplace(safeplace)}
                                onClickClaim={claimSafeplace}
                            />
                        )}
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Safeplaces;