import React, { useEffect, useState } from 'react';
import ISafeplace from '../interfaces/ISafeplace';
import { AppHeader } from '../Header/Header';
import { SearchBar } from '../common';
import {
  convertStringToRegex,
  notifyError,
  notifySuccess
} from '../utils';
import log from 'loglevel';
import { Safeplace, RequestClaimSafeplace, SafeplaceUpdate } from '../../services';
import { setReduxSafeplaces, useAppDispatch, useAppSelector } from '../../redux';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet'
import {
  FaEdit,
  FaShoppingBasket,
  FaBreadSlice,
  FaUtensils,
  FaStore,
  FaHandScissors,
  FaMapPin,
  FaStar,
  FaArrowRight,
  FaArrowLeft,
  FaChevronLeft
} from 'react-icons/fa';
import { ModalBtn } from '../common/Modal';
import { SafeplaceModal } from '../Monitors/SafeplaceMonitor/SafeplaceMonitorModal';
import IComment from '../interfaces/IComment';
import './Safeplaces.css';

interface IMapProps {
  safeplaces: { setter: (val: ISafeplace[]) => void, value: ISafeplace[] };
}

const SafeplacesMap: React.FC<IMapProps> = ({
  safeplaces
}) => {
  return (
    <div className='z-0'>
      <MapContainer
        style={{ height: "100vh" }}
        center={[48.58193415814247, 7.751016938855309]}
        scrollWheelZoom={true}
        zoom={14}
      >
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

interface ISafeplacesListProps {
  safeplaces: { setter: (val: ISafeplace[]) => void, value: ISafeplace[] };
  comments: []
}

export const SafeplacesList: React.FC<ISafeplacesListProps> = ({ safeplaces, comments }) => {
  const [focusSafeplace, setFocusSafeplace] = useState<boolean>(false);
  const [getSafeplaceDetail, setGetSafeplaceDetail] = useState<boolean>(false);
  const userCredentials = useAppSelector(state => state.user.credentials);
  const [safeplace, setSafeplace] = useState<ISafeplace>({
    id: "",
    name: "",
    city: "",
    address: "",
    type: "",
    dayTimetable: [null, null, null, null, null, null, null],
    coordinate: ["1", "1"]
  });
  const [currentPage, setCurrentPage] = useState<number>(0)

  const createSafeplaceUpdateRequest = async (safeplace: ISafeplace) => {
    try {
      await SafeplaceUpdate.create({ ...safeplace, safeplaceId: safeplace.id }, userCredentials.token);
      notifySuccess("Votre demande de modification a été enregistrée.");
      setFocusSafeplace(false);
    } catch (error) {
      notifyError(error);
      log.error(error);
    }
  };

  const deleteSafeplace = async (safeplace: ISafeplace) => {
    try {
      await Safeplace.delete(safeplace.id, userCredentials.token);
      safeplaces.setter(safeplaces.value.filter(s => s.id !== safeplace.id));
      notifySuccess("Safeplace supprimée");
      setFocusSafeplace(false);
    } catch (error) {
      notifyError(error);
      log.error(error);
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
      notifySuccess("Votre requête a été enregistrée.");
    } catch (error) {
      log.error(error);
      notifyError(error);
    }
  };

  function paginate(comments: IComment[], pageIndex: number, pageSize: number): IComment[] {
    const endIndex = Math.min((pageIndex + 1) * pageSize, comments.length);

    return comments.slice(Math.max(endIndex - pageSize, 0), endIndex);
  }

  return (
    <div className='px-6 pt-[165px]'>
      {getSafeplaceDetail ? (
        <div className='overflow-y-auto' style={{ height: "80vh" }}>
          <FaChevronLeft onClick={() => setGetSafeplaceDetail(false)} className="w-8 h-8 cursor-pointer mb-4" style={{ color: "black" }} />
          <div className="bg-safeplace-placeholder h-96 rounded-3xl">
            <img className="object-cover" alt="" />
          </div>
          <div className="flex flex-row justify-between">
            <div>
              <p className="font-bold text-2xl mt-2">{safeplace.name}</p>
              <p>{safeplace.type}</p>
              <p className="text-blue-600">{comments.length} commentaires</p>
            </div>
            <button className='border border-solid border-neutral-500 rounded-lg h-12 mt-4 mr-4 px-2 font-bold text-white bg-blue-safely-dark' onClick={() => claimSafeplace(safeplace)}>
              RÉCLAMER CE COMMERCE
            </button>
          </div>
          <div className="border-t-2 border-gray border-b-2 pt-3 pb-3 mt-3">
            <div className="flex flex-row items-center">
              <FaMapPin className="h-8 w-8" />
              <p>{safeplace.address + ', ' + safeplace.city}</p>
            </div>
          </div>
          <div className="h-6 w-full mt-5">
            {Object.keys(paginate(comments, currentPage, 5)).map(index => {
              // TODO: rename variable with understandable name (et const si possible) + paginate is called 2 times
              var tmpValue = paginate(comments, currentPage, 5);
              return (
                <div key={index}>
                  <div className="flex flex-row items-center mb-3">
                    <p>Anonyme</p>
                    {[...Array(tmpValue[index].grade)].map(() => <FaStar className="ml-1 h-6 w-6" style={{ color: '#f7e249' }} />)}
                    {[...Array(5 - tmpValue[index].grade)].map(() => <FaStar className="ml-1 h-6 w-6" style={{ color: 'lightgray' }} />)}
                  </div>
                  <p className="mb-3">{tmpValue[index].comment}</p>
                </div>
              )

            })}
            <div className="flex flex-row items-center mt-10">
              <FaArrowLeft className="mr-2 cursor-pointer" onClick={() => { currentPage > 0 ? setCurrentPage(currentPage => currentPage - 1) : setCurrentPage(currentPage) }} />
              <FaArrowRight className='cursor-pointer' onClick={() => { currentPage >= 0 ? setCurrentPage(currentPage => currentPage + 1) : setCurrentPage(currentPage) }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-10 overflow-y-auto px-30" style={{ height: "80vh" }}>
          {safeplaces.value && safeplaces.value.length > 0 ? safeplaces.value.map(safeplace => (
            <div className='cursor-pointer' key={safeplace.id}>
              <div data-testid={"safeplace-get-detail-" + safeplace.id} className="bg-safeplace-placeholder w-90 h-80 rounded-3xl" onClick={() => {
                setSafeplace(safeplace);
                setGetSafeplaceDetail(true);
              }}>
                <img className="object-cover" alt="" />
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-lg mt-2">{safeplace.name}</p>
                  <p>{safeplace.type}</p>
                </div>
                <FaEdit className='h-6 w-6 mr-4 mt-2' data-testid={"safeplace-update-" + safeplace.id} onClick={() => {
                  setFocusSafeplace(true);
                  setSafeplace(safeplace);
                }} />
              </div>
            </div>
          )) : null}
          <SafeplaceModal
            title={safeplace.name}
            modalOn={focusSafeplace}
            safeplace={safeplace}
            setSafeplace={setSafeplace}
            buttons={[
              <ModalBtn key='sum-btn-0' content="Modifier le commerce" onClick={() => createSafeplaceUpdateRequest(safeplace)} />,
              <ModalBtn key='sum-btn-1' content="Supprimer" onClick={() => deleteSafeplace(safeplace)} warning />,
              <ModalBtn key='sum-btn-2' content="Annuler" onClick={() => setFocusSafeplace(false)} />
            ]}
          />
        </div>
      )}
    </div>
  );
};

const SafeplacesSearchBar: React.FC<{
  safeplaces: ISafeplace[];
  stateFilterType: string;
  setStateFilterType: (value: string) => void;
  searchBarValue: string;
  setSearchBarValue: (value: string) => void;
}> = ({
  safeplaces,
  stateFilterType,
  setStateFilterType,
  searchBarValue,
  setSearchBarValue
}) => {
  return (
    <div className="w-1/2 h-12 mt-8 flex justify-between bg-white">
      <p className="font-bold text-2xl ml-5 mt-3">{safeplaces.length} commerces</p>

      <div className="flex border-b-2 border-white">
        <div onClick={() => setStateFilterType(stateFilterType === "restaurant" ? "" : "restaurant")}
             className={"flex flex-col justify-center items-center cursor-pointer" + (stateFilterType === "restaurant" ? " border-b-2 border-black" : '')}>
          <FaUtensils className="w-10 h-10" />
          <p className="text-xs">Restaurant</p>
        </div>
        <div onClick={() => setStateFilterType(stateFilterType === "Market" ? "" : "Market")}
             className={"ml-6 flex flex-col justify-center items-center cursor-pointer" + (stateFilterType === "Market" ? " border-b-2 border-black" : '')}>
          <FaStore className="w-10 h-10" />
          <p className="text-xs">Marché</p>
        </div>
        <div onClick={() => setStateFilterType(stateFilterType === "bakery" ? "" : "bakery")}
             className={"ml-6 flex flex-col justify-center items-center cursor-pointer" + (stateFilterType === "bakery" ? " border-b-2 border-black" : '')}>
          <FaBreadSlice className="w-10 h-10" />
          <p className="text-xs">Boulangerie</p>
        </div>
        <div onClick={() => setStateFilterType(stateFilterType === "supermarket" ? "" : "supermarket")}
             className={"ml-6 flex flex-col justify-center items-center cursor-pointer" + (stateFilterType === "supermarket" ? " border-b-2 border-black" : '')}>
          <FaShoppingBasket className="w-10 h-10" />
          <p className="text-xs">Supermarché</p>
        </div>
        <div onClick={() => setStateFilterType(stateFilterType === "hairdresser" ? "" : "hairdresser")}
             className={"ml-6 flex flex-col justify-center items-center cursor-pointer" + (stateFilterType === "hairdresser" ? " border-b-2 border-black" : '')}>
          <FaHandScissors className="w-10 h-10" />
          <p className="text-xs">Coiffeur</p>
        </div>
        <div className="pl-8 mt-2 mr-4">
          <SearchBar
            placeholder="Rechercher"
            textSearch={searchBarValue}
            setTextSearch={setSearchBarValue}
            openCreateModal={() => {}}
            noCreate
          />
        </div>
      </div>
    </div>
  );
};

const Safeplaces: React.FC = () => {
  const dispatch = useAppDispatch();
  const userCredentials = useAppSelector(state => state.user.credentials);
  const reduxSafeplace = useAppSelector(state => state.safeplace);

  const [searchBarValue, setSearchBarValue] = useState<string>('');
  const [safeplaces, setSafeplaces] = useState<ISafeplace[]>(reduxSafeplace.safeplaces);
  const [stateFilterType, setStateFilterType] = useState<string>("");
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
    Safeplace.getComments(userCredentials.token)
      .then(res => {
        setAllComments(res.data);
      }).catch(error => {
        log.error(error);
        notifyError(error);
      });

    if (reduxSafeplace.safeplaces === undefined
      || reduxSafeplace.safeplaces.length === 0
      || reduxSafeplace.date + 86400000 < Date.now()
    ) {
      Safeplace.getAll(userCredentials.token).then(response => {
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
        dispatch(setReduxSafeplaces({
          date: Date.now(),
          safeplaces: gotSafeplaces
        }));
      }).catch(error => {
        log.error(error);
        notifyError(error);
      });
    }
  }, [userCredentials, dispatch, reduxSafeplace]);


  return (
    <div className="h-screen">
      <div className='absolute w-full z-30'>
        <AppHeader />
        <SafeplacesSearchBar
          safeplaces={filterSafeplaces()}
          stateFilterType={stateFilterType}
          setStateFilterType={setStateFilterType}
          searchBarValue={searchBarValue}
          setSearchBarValue={setSearchBarValue}
        />
      </div>
      <div className="grid grid-cols-2">
        <SafeplacesList safeplaces={{ setter: setSafeplaces, value: filterSafeplaces() }} comments={allComments} />
        <SafeplacesMap safeplaces={{ setter: setSafeplaces, value: safeplaces }} />
      </div>

    </div>
  );
};

export default Safeplaces;