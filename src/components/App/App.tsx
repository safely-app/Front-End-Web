import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, RootState } from '../../redux';
import ISafeplace from '../interfaces/ISafeplace';
import { AppHeader } from '../Header/Header';
import { Safeplace } from '../../services';
import log from 'loglevel';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet'
import './App.css';


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
    const dispatch = useDispatch();
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [safeplaces, setSafeplaces] = useState<ISafeplace[]>([]);

    useEffect(() => {
        dispatch(getUserInfo(userCredientials._id, userCredientials.token));
        Safeplace.getAll(userCredientials.token).then(response => {
            const gotSafeplaces = response.data.map(safeplace => ({
                id: safeplace.id,
                name: safeplace.name,
                city: safeplace.city,
                address: safeplace.address,
                type: safeplace.type,
                dayTimetable: safeplace.dayTimetable,
                coordinate: safeplace.coordinate
            }));

            setSafeplaces(gotSafeplaces);
        }).catch(error => {
            log.error(error);
        });
    }, [userCredientials, dispatch]);

    return (
        <div className="App">
            <AppHeader />
            <Map safeplaces={safeplaces} />
        </div>
    );
}

export default App;
