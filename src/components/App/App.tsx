import React, {
  useEffect, useState
} from 'react';
import {
  setInfo,
  useAppSelector,
  useAppDispatch,
  setReduxSafeplaces,
  setProfessionalInfo
} from '../../redux';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import ISafeplace from '../interfaces/ISafeplace';
import { AppHeader } from '../Header/Header';
import { ProfessionalInfo, Safeplace, User } from '../../services';
import { MdOutlinePlace } from 'react-icons/md';
import { BsMegaphone } from 'react-icons/bs';
import { FiPieChart } from 'react-icons/fi';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet'
import log from "loglevel";
import Onboarding from '../Onboarding/Onboarding';

const Map: React.FC<{
  safeplaces: ISafeplace[];
}> = ({
  safeplaces
}) => {
  return (
    <div className='z-0'>
      <MapContainer
        style={{ height: "92vh", zIndex: 0 }}
        center={[48.58193415814247, 7.751016938855309]}
        scrollWheelZoom={true}
        zoom={14}
      >
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

const AppWelcomePage: React.FC = () => {
  return (
    <div className='w-full px-12'>
      <p className='font-extrabold text-3xl mt-20 mb-16 w-1/2 mx-auto'>Bienvenue sur Safely !</p>

      <div className='space-y-12'>

        <div className='w-1/2 mx-auto'>
          <p className='font-bold text-xl'>Réclamez votre commerce</p>
          <p className='mt-2'>
            Réclamez votre commerce pour lancer votre première campagne publicitaire
          </p>

          <div className='space-y-4 mt-4'>
            <a className='border border-solid border-neutral-400 rounded-lg p-3 flex cursor-pointer select-none' href='/shops'>
              <div className='ml-2 mr-5 my-auto'>
                <MdOutlinePlace className='h-10 w-10 text-green-600' />
              </div>
              <div className='my-auto'>
                <p className='font-bold'>Trouvez votre commerce</p>
                <p className='text-sm'>Trouvez votre commerce parmis les enseignes enregistrées sur notre plateforme</p>
              </div>
            </a>
          </div>
        </div>

        <div className='w-1/2 mx-auto'>
          <p className='font-bold text-xl'>Gérez votre campagne publicitare</p>
          <p className='mt-2'>
            Lancez votre première campagne publicitaire et suivez son impact depuis votre tableau de bord
          </p>

          <div className='space-y-4 mt-4'>
            <a className='border border-solid border-neutral-400 rounded-lg p-3 flex cursor-pointer select-none' href='/commercial?state=campaigns'>
              <div className='ml-2 mr-5 my-auto'>
                <BsMegaphone className='h-10 w-10 text-orange-600 -rotate-12' />
              </div>
              <div className='my-auto'>
                <p className='font-bold'>Campagne publicitaire</p>
                <p className='text-sm'>Créez une campagne publicitaire pour promouvoir votre commerce sur l'application mobile</p>
              </div>
            </a>
            <a className='border border-solid border-neutral-400 rounded-lg p-3 flex cursor-pointer select-none' href='/commercial?state=statistics'>
              <div className='ml-2 mr-4 my-auto'>
                <FiPieChart className='h-12 w-12 text-blue-600' />
              </div>
              <div className='my-auto'>
                <p className='font-bold'>Informations sur votre campagne</p>
                <p className='text-sm'>Suivez l'état de votre campagne à travers le temps depuis votre tableau de bord</p>
              </div>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

// const AppWelcomePage: React.FC = () => {
//   return (
//     <div className='w-full px-14'>
//       <p className='font-extrabold text-3xl mt-24 mb-16'>Bienvenue sur Safely !</p>

//       <div className='space-y-12'>

//         <div>
//           <p className='font-bold text-xl'>Réclamez votre commerce</p>
//           <p className='w-1/2 mt-2'>
//             Réclamez votre commerce pour lancer votre première campagne publicitaire
//           </p>

//           <div className='grid grid-cols-2 gap-8 mt-4'>
//             <div className='border border-solid border-neutral-400 rounded-lg p-3 flex cursor-pointer select-none'>
//               <div className='ml-2 mr-5 my-auto'>
//                 <MdOutlinePlace className='h-10 w-10 text-green-600' />
//               </div>
//               <div className='my-auto'>
//                 <p className='font-bold'>Trouvez votre commerce</p>
//                 <p className='text-sm'>Trouvez votre commerce parmis les enseignes enregistrées sur notre plateforme</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div>
//           <p className='font-bold text-xl'>Gérez votre campagne publicitare</p>
//           <p className='w-1/2 mt-2'>
//             Lancez votre première campagne publicitaire et suivez son impact depuis votre tableau de bord
//           </p>

//           <div className='grid grid-cols-2 gap-8 mt-4'>
//             <div className='border border-solid border-neutral-400 rounded-lg p-3 flex cursor-pointer select-none'>
//               <div className='ml-2 mr-5 my-auto'>
//                 <BsMegaphone className='h-10 w-10 text-orange-600 -rotate-12' />
//               </div>
//               <div className='my-auto'>
//                 <p className='font-bold'>Campagne publicitaire</p>
//                 <p className='text-sm'>Créez une campagne publicitaire pour promouvoir votre commerce sur l'application mobile</p>
//               </div>
//             </div>
//             <div className='border border-solid border-neutral-400 rounded-lg p-3 flex cursor-pointer select-none'>
//               <div className='ml-2 mr-4 my-auto'>
//                 <FiPieChart className='h-12 w-12 text-blue-600' />
//               </div>
//               <div className='my-auto'>
//                 <p className='font-bold'>Informations sur votre campagne</p>
//                 <p className='text-sm'>Suivez l'état de votre campagne à travers le temps depuis votre tableau de bord</p>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const userCredentials = useAppSelector(state => state.user.credentials);
  const reduxSafeplace = useAppSelector(state => state.safeplace);

  const parseUrl = (url: string): string => {
    try {
      const regex = new RegExp(/\?onboarding=(.*)/);
      const found = url.match(regex) || ["", ""];

      return found[1];
    } catch (err) {
      log.error(err);
      return "";
    }
  };

  const [safeplaces, setSafeplaces] = useState<ISafeplace[]>(reduxSafeplace.safeplaces);
  const [isOnboarding, setIsOnboarding] = useState(parseUrl(window.location.search) === "true");

  useEffect(() => {
    User.get(userCredentials._id, userCredentials.token)
      .then(response => dispatch(setInfo(response.data)))
      .catch(error => log.error(error));

    ProfessionalInfo.getOwner(userCredentials._id, userCredentials.token)
      .then(response => {
        setIsOnboarding(false);
        dispatch(setProfessionalInfo({
          ...response.data,
          id: response.data._id
        }));
      }).catch(error => {
        log.error(error);
        if (error.response !== undefined && error.response.status === 404) {
          setIsOnboarding(true);
        }
      });

    if (reduxSafeplace.safeplaces === undefined
      || reduxSafeplace.safeplaces.length === 0
      || reduxSafeplace.date + 86400000 < Date.now()
    ) {
      Safeplace.getAll(userCredentials.token)
        .then(response => {
          const gotSafeplaces = response.data.map(safeplace => ({
            id: safeplace._id,
            name: safeplace.name,
            description: safeplace.description,
            city: safeplace.city,
            address: safeplace.address,
            type: safeplace.type,
            dayTimetable: safeplace.dayTimetable,
            coordinate: safeplace.coordinate,
            ownerId: safeplace.ownerId,
          }) as ISafeplace);

          setSafeplaces(gotSafeplaces);
          dispatch(setReduxSafeplaces({
            date: Date.now(),
            safeplaces: gotSafeplaces
          }));
        }).catch(error => log.error(error));;
    }
  }, [userCredentials, dispatch, reduxSafeplace]);

  return (
    isOnboarding ? (
      <Onboarding />
    ) : (
      <div className='h-screen'>
        <AppHeader />
        <div className='grid grid-cols-2'>
          <AppWelcomePage />
          <Map safeplaces={safeplaces} />
        </div>
      </div>
    )
  );
};

export default App;
