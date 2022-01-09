import React, {
    useEffect
} from 'react';
import {
    setInfo,
    useAppSelector,
    useAppDispatch
} from '../../redux';
import ISafeplace from '../interfaces/ISafeplace';
import { AppHeader } from '../Header/Header';
import { User } from '../../services';
import { notifyError } from '../utils';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet'

interface IMapProps {
    safeplaces: ISafeplace[];
}

export const Map: React.FC<IMapProps> = ({
    safeplaces
}) => {
    return (
        <div style={{
            marginTop: "2em",
            marginLeft: "4%",
            marginRight: "4%",
            width: "92%",
            border: '#fff',
            borderStyle: "solid",
        }}>
            <MapContainer center={[48.58193415814247, 7.751016938855309]} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {safeplaces.map((safeplace, index) => (
                    <Marker key={index} position={[
                        Number(safeplace.coordinate[0]),
                        Number(safeplace.coordinate[1])
                    ]}>
                        <Popup>{safeplace.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const userCredientials = useAppSelector(state => state.user.credentials);

    useEffect(() => {
        User.get(userCredientials._id, userCredientials.token)
            .then(response => dispatch(setInfo(response.data)))
            .catch(error => notifyError(error.message));
    }, [userCredientials, dispatch]);

    return (
        <div className="text-center min-h-screen bg-background bg-transparent bg-cover bg-center">
            <AppHeader />
            {/* <Map safeplaces={safeplaces} /> */}
            <div className="fixed top-2/4 left-2/4 text-2xl text-white">
                <p className="-m-2/4" style={{
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    Bienvenue sur
                    <b className="block text-5xl">Safely</b>
                </p>
            </div>
        </div>
    );
}

export default App;
