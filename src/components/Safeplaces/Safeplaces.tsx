import React, { useEffect, useState } from 'react';
import ISafeplace from '../interfaces/ISafeplace';
import { AppHeader } from '../Header/Header';
import {
    Button,
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
import { useAppSelector } from '../../redux';
import shop from '../../assets/image/shop.jpg'
import { canAccess, Role } from '../Header/utils';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet'


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
                <Button key="save-id" text="Publier les modififications" onClick={() => saveSafeplaceModification(safeplace)} />
                <Button key="stop-id" text="Annuler" onClick={() => setSafeplace(undefined)} />
                <Button key="delete-id" text="Dépublier le commerce" onClick={() => deleteSafeplace(safeplace)} type="warning" />
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
    const userInfo = useAppSelector(state => state.user.userInfo);

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
                <div hidden={!canAccess(userInfo.role, Role.TRADER)} className="flex flex-col justify-between space-y-2">
                    <button data-testid={`request-shop-${safeplace.id}`} onClick={handleClickClaim} className="inline-flex w-56 items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Réclamer ce commerce
                        <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                    <button data-testid={`update-shop-${safeplace.id}`} onClick={handleClick} className="inline-flex w-56 items-center py-2 px-3 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Modifier
                        <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

interface IMapProps {
    safeplaces: ISafeplace[];
}

const SafeplacesMap: React.FC<IMapProps> = ({
    safeplaces
}) => {
    return (
        <div className="relative top-2/4 left-2/4 w-2/3 max-w-4xl text-center mt-8" style={{
            transform: 'translate(-50%, 0%)'
        }}>
            <p className="mb-8 text-white text-2xl">
                Les safeplaces
                <b className="block text-3xl">Strasbourgeoises</b>
            </p>
            <MapContainer style={{
                height: '60vh'
            }} center={[48.58193415814247, 7.751016938855309]} zoom={14} scrollWheelZoom={true}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <MarkerClusterGroup showCoverageOnHover={false}>
                    {safeplaces.map((safeplace, index) => (
                        <Marker key={index} position={[
                            Number(safeplace.coordinate[0]),
                            Number(safeplace.coordinate[1])
                        ]}>
                            <Popup>{safeplace.name}</Popup>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
};

interface ISafeplacesListProps {
    safeplaces: ISafeplace[];
    setSafeplace: (safeplace: ISafeplace) => void;
    removeSafeplace: (safeplace: ISafeplace) => void;
    searchBarValue: string;
    setSearchBarValue: (value: string) => void;
};

export const SafeplacesList: React.FC<ISafeplacesListProps> = ({
    safeplaces,
    setSafeplace,
    removeSafeplace,
    searchBarValue,
    setSearchBarValue
}) => {
    const user = useAppSelector(state => state.user);
    const [focusSafeplace, setFocusSafeplace] = useState<ISafeplace | undefined>(undefined);

    const claimSafeplace = async (safeplace: ISafeplace) => {
        try {
            const response = await RequestClaimSafeplace.create({
                id: '',
                userId: user.credentials._id,
                safeplaceId: safeplace.id,
                safeplaceName: safeplace.name,
                status: 'Pending',
                safeplaceDescription: (safeplace?.description !== undefined) ? safeplace?.description : "Vide",
                coordinate: safeplace.coordinate
            }, user.credentials.token);

            log.log(response);
            notifySuccess("Votre requête a été créée");
        } catch (e) {
            log.error(e);
            notifyError(e);
        }
    };

    const saveSafeplaceModification = async (safeplace: ISafeplace) => {
        try {
            await Safeplace.update(safeplace.id, safeplace, user.credentials.token);
            setSafeplace(focusSafeplace as ISafeplace);
            setFocusSafeplace(undefined);
        } catch (e) {
            notifyError(e);
        }
    };

    const deleteSafeplace = async (safeplace: ISafeplace) => {
        try {
            await Safeplace.delete(safeplace.id, user.credentials.token);
            removeSafeplace(safeplace);
            setFocusSafeplace(undefined);
        } catch (e) {
            notifyError(e);
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <div className="flex items-center justify-center">
                <div className="flex border-2 rounded">
                    <div>
                        <input
                            name="searchbox"
                            type="text"
                            role="searchbox"
                            value={searchBarValue}
                            placeholder="Rechercher un commerce"
                            onChange={(event) => setSearchBarValue(event.target.value)}
                            className="px-4 py-2 w-80"
                        />
                    </div>
                    <button className="flex items-center justify-center px-4 border-l">
                        <svg className="w-6 h-6 text-gray-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path
                                d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div>
                {(focusSafeplace !== undefined) &&
                    <SafeplaceInfoForm
                        safeplace={focusSafeplace}
                        shown={focusSafeplace !== undefined}
                        setSafeplace={setFocusSafeplace}
                        saveSafeplaceModification={saveSafeplaceModification}
                        archiveSafeplace={deleteSafeplace}
                        deleteSafeplace={deleteSafeplace}
                    />
                }
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 m-4">
                    {safeplaces.map((safeplace, index) =>
                        <SafeplaceInfoListElement
                            key={index}
                            safeplace={safeplace}
                            onClick={safeplace => setFocusSafeplace(safeplace)}
                            onClickClaim={claimSafeplace}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const Safeplaces: React.FC = () => {
    const user = useAppSelector(state => state.user);
    const [searchBarValue, setSearchBarValue] = useState<string>('');
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);

    const setSafeplace = (safeplace: ISafeplace) => {
        setSafeplaces(safeplaces.map(safeplaceElement => safeplaceElement.id === safeplace.id ? safeplace : safeplaceElement));
    };

    const removeSafeplace = (safeplace: ISafeplace) => {
        setSafeplaces(safeplaces.filter(safeplaceElement => safeplaceElement.id !== safeplace.id));
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

    useEffect(() => {
        Safeplace.getAll(user.credentials.token).then(response => {
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
    }, [user]);

    return (
        <div className="min-h-screen bg-background bg-transparent space-y-2 bg-cover bg-center">
            <AppHeader />
            <div className="w-full h-full">
                {canAccess(user.userInfo.role, Role.TRADER)
                    ? <SafeplacesList
                        safeplaces={filterSafeplaces()}
                        setSafeplace={setSafeplace}
                        removeSafeplace={removeSafeplace}
                        searchBarValue={searchBarValue}
                        setSearchBarValue={setSearchBarValue} />
                    : <SafeplacesMap safeplaces={safeplaces} />}
            </div>
        </div>
    );
};

export default Safeplaces;