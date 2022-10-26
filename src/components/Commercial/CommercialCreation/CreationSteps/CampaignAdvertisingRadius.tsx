import React, {useMemo, useState} from "react";
import ISafeplace from "../../../interfaces/ISafeplace";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {MapContainer, Marker, Popup, TileLayer, Circle} from "react-leaflet";

interface ICoordinate {
  latitude: number;
  longitude: number;
}

const MapCircleZone: React.FC<{
  coordinate: ICoordinate;
  radius: number;
}> = ({
  coordinate,
  radius,
}) => {
  if (isNaN(radius) || radius <= 0)
    return <></>;

  return (
    <Circle
      center={[ coordinate.latitude, coordinate.longitude ]}
      pathOptions={{ color: 'red' }}
      radius={radius}
    />
  );
};

export const Map: React.FC<{
  safeplaces: ISafeplace[];
  coordinate: ICoordinate;
  radius: number;
}> = ({
  safeplaces,
  coordinate,
  radius,
}) => {
  return (
    <div className='z-0'>
      <MapContainer
        style={{ height: "30vh" }}
        center={[ coordinate.latitude, coordinate.longitude ]}
        scrollWheelZoom={true}
        zoom={14}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapCircleZone coordinate={coordinate} radius={radius} />

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

const CampaignAdvertisingRadius: React.FC<{
  prevStepClick: () => void;
  nextStepClick: () => void;
  safeplace: ISafeplace;
}> = ({
  prevStepClick,
  nextStepClick,
  safeplace,
}) => {
  const minRadius = useMemo(() => 100, []);
  const maxRadius = useMemo(() => 1000, []);

  const [radius, setRadius] = useState(minRadius);

  const handleClick = () => {
    nextStepClick();
  };

  const setRadiusFromInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(event.target.value);

    if (parsedValue > maxRadius) {
      setRadius(maxRadius);
    } else {
      setRadius(parsedValue);
    }
  };

  return (
    <div className="flex-auto bg-white rounded-lg shadow-xl border border-solid border-neutral-100">
      <div className="mx-auto w-1/2 my-12" style={{ minWidth: "38rem" }}>
        <div className="relative">
          <div className="absolute grid grid-cols-6 bg-neutral-200 rounded-lg h-3 w-1/3 left-1/2 -translate-x-1/2">
            <div className="col-span-5 bg-blue-500 rounded-lg"></div>
          </div>
          <p className="text-center font-bold text-3xl pt-6">Choisissez la zone de votre publicité</p>
          <div className="grid grid-cols-9 gap-4 text-neutral-500 my-10">
            <div className="col-span-4">
              <p className="py-2 w-full text-lg">{safeplace.address}</p>

              <div>
                <div className="relative text-center">
                  <span className="absolute bottom-0 left-0 text-neutral-400">{minRadius}m</span>
                  <div className="relative inline-block">
                    <input
                      type="number"
                      className="text-lg w-20 h-full pl-0.5 pr-6 text-right rounded-lg"
                      value={radius}
                      onChange={setRadiusFromInput}
                    />
                    <span className="absolute text-lg top-1/2 right-1 -translate-y-1/2">m</span>
                  </div>
                  <span className="absolute bottom-0 right-0 text-neutral-400">{maxRadius}m</span>
                </div>
                <input
                  type="range"
                  min={minRadius}
                  max={maxRadius}
                  className="w-full mt-0.5"
                  value={radius}
                  onChange={(event) => setRadius(parseInt(event.target.value))}
                />
              </div>
            </div>

            <div className="col-span-5 rounded-lg overflow-hidden">
              <Map
                radius={radius}
                safeplaces={[ safeplace ]}
                coordinate={{
                  latitude: Number(safeplace.coordinate[0]),
                  longitude: Number(safeplace.coordinate[1]),
                }}
              />
            </div>
          </div>

          <div>
            <hr className="my-6" />
            <button className="text-lg font-bold text-blue-500 bg-white hover:text-blue-400 px-6 py-2 rounded-lg float-left" onClick={prevStepClick}>
              RETOUR
            </button>
            <button className="text-lg font-bold text-white bg-blue-500 hover:bg-blue-400 px-6 py-2 rounded-lg float-right" onClick={handleClick}>
              CONTINUER
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CampaignAdvertisingRadius;