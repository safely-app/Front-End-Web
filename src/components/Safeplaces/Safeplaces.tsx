import React, { useEffect, useState } from 'react';
import ISafeplace from '../interfaces/ISafeplace';
import { AppHeader } from '../Header/Header';
import {
    Button,
    Modal,
    SearchBar,
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
    Popup,
} from 'react-leaflet'
import { FaEdit, FaShoppingBasket, FaBreadSlice, FaUtensils, FaStore, FaHandScissors, FaMapPin, FaStar, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { ModalBtn } from '../common/Modal';
import { SafeplaceModal } from '../Monitors/SafeplaceMonitor/SafeplaceMonitorModal';
import safeplaceImg from '../../assets/image/safeplace.jpeg';

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
                    <button data-testId={`request-shop-${safeplace.id}`} onClick={handleClickClaim} className="inline-flex w-56 items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Réclamer ce commerce
                        <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                    <button data-testId={`update-shop-${safeplace.id}`} onClick={handleClick} className="inline-flex w-56 items-center py-2 px-3 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Modifier
                        <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

interface IMapProps {
    safeplaces: {setter: (val: ISafeplace[]) => void, value: ISafeplace[]};
}

const SafeplacesMap: React.FC<IMapProps> = ({
    safeplaces
}) => {
    // const [safeplaceWithinBound, setSafeplaceWithinBound] = useState<ISafeplaceVariant[]>([])

    // const UpdateSafeplace = () => {
    //     const map = useMap()
    //     const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds())

        
    //     map.on('moveend', function(e) {
    //         setBounds(map.getBounds())
    //         const tmpArray: ISafeplaceVariant[] = []

    //         for (var index = 0; index < safeplaces.value.length; index++) {
    //             const point: LatLngExpression = new LatLng(parseFloat(safeplaces.value[index].coordinate[0]), parseFloat(safeplaces.value[index].coordinate[1]))

    //             if (bounds.contains(point)) {
    //                 tmpArray.push(safeplaces.value[index])
    //             }
    //         }
    //         setSafeplaceWithinBound(tmpArray)
    //         safeplaces.setter(tmpArray)
    //     });

    //     return (
    //         <Rectangle bounds={bounds} pathOptions={{color: 'red'}}/>
    //     )
    // }

    return (
        <div className="relative w-full h-full max-w-4xl text-center z-0">
            <MapContainer style={{
                height: "100vh",
                width: "100vh",
            }} center={[48.58193415814247, 7.751016938855309]} zoom={14} scrollWheelZoom={true}>
                {/* <UpdateSafeplace /> */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <MarkerClusterGroup showCoverageOnHover={false}>
                    {safeplaces.value.map((safeplace, index) => (
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

interface ISafeplaceListProps {
    safeplaces: {setter: (val: ISafeplace[]) => void, value: ISafeplace[]};
    comments: []
}

const SafeplaceList: React.FC<ISafeplaceListProps> = ({safeplaces, comments}) => {
    const [focusSafeplace, setFocusSafeplace] = useState<boolean>(false);
    const [getSafeplaceDetail, setGetSafeplaceDetail] = useState<boolean>(false);
    const userCredentials = useAppSelector(state => state.user.credentials);
    const [safeplace, setSafeplace] = useState<ISafeplace>({
        id: "",
        name: "",
        city: "",
        address: "",
        type: "",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "1", "1" ]
    });
    const [currentPage, setCurrentPage] = useState<number>(0)

    const updateSafeplace = async (safeplace: ISafeplace) => {
        try {
          await Safeplace.update(safeplace.id, safeplace, userCredentials.token);
          safeplaces.setter(safeplaces.value.map(s => (s.id === safeplace.id) ? safeplace : s));
          notifySuccess("Modifications enregistrées");
          setFocusSafeplace(false);
        } catch (err) {
          notifyError(err);
          log.error(err);
        }
      };
    
    const deleteSafeplace = async (safeplace: ISafeplace) => {
        try {
            await Safeplace.delete(safeplace.id, userCredentials.token);
            safeplaces.setter(safeplaces.value.filter(s => s.id !== safeplace.id));
            notifySuccess("Safeplace supprimée");
            setFocusSafeplace(false);
        } catch (err) {
            notifyError(err);
            log.error(err);
        }
    };

    const claimSafeplace = async (safeplace: ISafeplace) => {
        try {
            const response = await RequestClaimSafeplace.create({
                id: '',
                userId: userCredentials._id,
                safeplaceId: safeplace.id,
                safeplaceName: safeplace.name,
                status: 'Pending',
                safeplaceDescription: (safeplace?.description !== undefined) ? safeplace?.description : "Vide",
                coordinate: safeplace.coordinate
            }, userCredentials.token);

            log.log(response);
            notifySuccess("Votre requête a été créée");
        } catch (e) {
            log.error(e);
            notifyError(e);
        }
    };

    function paginate(a, pageIndex, pageSize) {
        var endIndex = Math.min((pageIndex + 1) * pageSize, a.length);
        return a.slice(Math.max(endIndex - pageSize, 0), endIndex);
    }

    return (
        <div>
            {getSafeplaceDetail ? (
                <div className="h-screen">
                    <div className="bg-safeplace-placeholder h-96 rounded-3xl">
                        <img className="object-cover" src={safeplaceImg} alt="" />
                        <FaArrowLeft onClick={() => { setGetSafeplaceDetail(false) }} className="w-10 h-10" style={{ color: "white" }}/>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div>
                            <p className="font-bold text-2xl mt-2">{safeplace.name}</p>
                            <p>{safeplace.type}</p>
                            <p className="text-blue-600">{comments.length} commentaires</p>
                        </div>
                        <Button text="Réclamer ce commerce" onClick={() => {claimSafeplace(safeplace)}} width="100"/>
                    </div>
                    <div className="border-t-2 border-gray border-b-2 pt-3 pb-3 mt-3">
                        <div className="flex flex-row items-center">
                            <FaMapPin className="h-8 w-8"/>
                            <p>{safeplace.address + ', ' + safeplace.city}</p>
                        </div>
                    </div>
                    <div className="h-6 w-full mt-5">
                        {Object.keys(paginate(comments, currentPage, 5)).map(index => {
                            var tmpValue = paginate(comments, currentPage, 5);
                                return (
                                    <div>
                                        <div className="flex flex-row items-center mb-3">
                                            <p>Anonyme</p>
                                            {[...Array(tmpValue[index].grade)].map(() => <FaStar className="ml-1 h-6 w-6" style={{ color: '#f7e249' }}/>)}
                                            {[...Array(5 - tmpValue[index].grade)].map(() => <FaStar className="ml-1 h-6 w-6"  style={{ color: 'lightgray' }}/>)}
                                        </div>
                                        <p className="mb-3">{tmpValue[index].comment}</p>
                                    </div>
                                )

                        })}
                        <div className="flex flex-row items-center mt-10">
                            <FaArrowLeft className="mr-2" onClick={() => {currentPage > 0 ? setCurrentPage(currentPage => currentPage - 1) : setCurrentPage(currentPage)}}/>
                            <FaArrowRight onClick={() => {currentPage >= 0 ? setCurrentPage(currentPage => currentPage + 1) : setCurrentPage(currentPage)}} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-screen grid grid-cols-2 gap-10 overflow-y-auto px-30">
                    {safeplaces.value && safeplaces.value.length > 0 ? safeplaces.value.map(sp => (
                        <div>
                            <div className="bg-safeplace-placeholder w-90 h-80 rounded-3xl" onClick={() => {setSafeplace(sp); setGetSafeplaceDetail(true)}}>
                                <img className="object-cover" src={safeplaceImg} alt=""  />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold text-lg mt-2">{sp.name}</p>
                                    <p>{sp.type}</p>
                                </div>
                                <FaEdit className="mt-2" onClick={() => {setFocusSafeplace(true); setSafeplace(sp)}}/>
                            </div>
                        </div>
                    )) : null}
                    <SafeplaceModal 
                        title={safeplace.name}
                        modalOn={focusSafeplace}
                        safeplace={safeplace}
                        setSafeplace={setSafeplace}
                        buttons={[
                            <ModalBtn key='sum-btn-0' content="Modifier la safeplace" onClick={() => updateSafeplace(safeplace)} />,
                            <ModalBtn key='sum-btn-1' content="Supprimer" onClick={() => deleteSafeplace(safeplace)} warning />,
                            <ModalBtn key='sum-btn-2' content="Annuler" onClick={() => setFocusSafeplace(false)} />
                        ]}
                    />
                </div>
            )}
        </div>


    )
}

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

// interface ISafeplaceDetail {
//     safeplace: ISafeplace;
// }


// const SafeplaceDetail: React.FC<ISafeplaceDetail> = ({safeplace}: ISafeplaceDetail) => {
//     return (
//         <p>{safeplace.name}</p>
//     )
// }

const Safeplaces: React.FC = () => {
    const user = useAppSelector(state => state.user);
    const [searchBarValue, setSearchBarValue] = useState<string>('');
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);
    const [stateFilterType, setStateFilterType] = useState<String>("");
    const [allComments, setAllComments] = useState<[]>([]);

    useEffect(() => {
        console.log(stateFilterType)
    }, [stateFilterType]);

    const filterSafeplaces = (): ISafeplace[] => {
        const lowerSearchText = convertStringToRegex(searchBarValue.toLocaleLowerCase());

        return safeplaces
            .filter(safeplace => searchBarValue !== ''
                ? safeplace.id.toLowerCase().match(lowerSearchText) !== null
                || safeplace.city.toLowerCase().match(lowerSearchText) !== null
                || safeplace.name.toLowerCase().match(lowerSearchText) !== null
                || safeplace.type.toLowerCase().match(lowerSearchText) !== null
                || safeplace.address.toLowerCase().match(lowerSearchText) !== null
                || safeplace.type.toLowerCase().match(stateFilterType.length > 0 ? stateFilterType.toLowerCase() : lowerSearchText) !== null : safeplace.type.toLowerCase().match(stateFilterType.toLocaleLowerCase()) !== null);
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
            Safeplace.getComments(user.credentials.token).then(res => {
                setAllComments(res.data);
            })

            log.log(response);
            setSafeplaces(gotSafeplaces);
        }).catch(error => {
            log.error(error);
            notifyError(error);
        })
    }, [user]);


    return (
        <div className="h-screen">
            <AppHeader />
            <div className="w-3/6 h-12 ml-10 mt-10 flex justify-between">
                <p className="font-bold text-2xl ml-5 mt-3">{filterSafeplaces().length} marchés</p>
                <div className="flex border-b-2">
                    <div onClick={() => {setStateFilterType(stateFilterType === "restaurant" ? "" : "restaurant")}} className={"flex flex-col justify-center items-center" + (stateFilterType === "restaurant" ? " border-b-2 border-black" : '')}>
                        <FaUtensils className="w-10 h-10" />
                        <p className="text-xs">Restaurant</p>
                    </div>
                    <div onClick={() => {setStateFilterType(stateFilterType === "Market" ? "" : "Market")}} className={"ml-6 flex flex-col justify-center items-center" + (stateFilterType === "Market" ? " border-b-2 border-black" : '')}>
                        <FaStore className="w-10 h-10" />
                        <p className="text-xs">Marché</p>
                    </div>
                    <div onClick={() => {setStateFilterType(stateFilterType === "bakery" ? "" : "bakery")}} className={"ml-6 flex flex-col justify-center items-center" + (stateFilterType === "bakery" ? " border-b-2 border-black" : '')}>
                        <FaBreadSlice className="w-10 h-10" />
                        <p className="text-xs">Boulangerie</p>
                    </div>
                    <div onClick={() => {setStateFilterType(stateFilterType === "supermarket" ? "" : "supermarket")}} className={"ml-6 flex flex-col justify-center items-center" + (stateFilterType === "supermarket" ? " border-b-2 border-black" : '')}>
                        <FaShoppingBasket className="w-10 h-10" />
                        <p className="text-xs">Supermarché</p>
                    </div>
                    <div onClick={() => {setStateFilterType(stateFilterType === "hairdresser" ? "" : "hairdresser")}} className={"ml-6 flex flex-col justify-center items-center" + (stateFilterType === "hairdresser" ? " border-b-2 border-black" : '')}>
                        <FaHandScissors className="w-10 h-10" />
                        <p className="text-xs">Coiffeur</p>
                    </div>
                    <div className="pl-10 mt-2">
                        <SearchBar placeholder="Rechercher" textSearch={searchBarValue} setTextSearch={setSearchBarValue} openCreateModal={() => {}} noCreate />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 p-10 gap-5">
                <SafeplaceList safeplaces={{setter: setSafeplaces, value: filterSafeplaces()}} comments={allComments} />                    
                <div className="h-full">
                    <SafeplacesMap safeplaces={{setter: setSafeplaces, value: safeplaces}} />
                </div>
            </div>

        </div>
    );
};

export default Safeplaces;