import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { AppHeader } from '../Header/Header';
import { displayTimetable } from '../Monitors/SafeplaceMonitor/utils';
import ISafeplace from '../interfaces/ISafeplace';
import { Safeplace } from '../../services';
import log from 'loglevel';
import {
    Profile,
    TextInput
} from '../common';

const SafeplaceSingle: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [safeplace, setSafeplace] = useState<ISafeplace | undefined>(undefined);

    const parseUrl = (url: string): string => {
        const regex = new RegExp("/safeplace-page/(.*)");
        const found = url.match(regex) || [""];

        return found[1];
    };

    useEffect(() => {
        Safeplace.get(parseUrl(window.location.href), userCredientials.token)
            .then(response => setSafeplace(response.data as ISafeplace))
            .catch(err => log.error(err));
    }, []);

    return (
        <div className="Profile-container">
            <AppHeader />
            {(safeplace !== undefined) ?
                <Profile elements={[
                    <TextInput key={`${safeplace.id}-name`} type="text" role="name"
                        label="Nom" value={safeplace.name} setValue={() => {}} readonly={true} />,
                    <TextInput key={`${safeplace.id}-description`} type="text" role="description"
                        label="Description" value={safeplace.description as string} setValue={() => {}} readonly={true} />,
                    <TextInput key={`${safeplace.id}-city`} type="text" role="city"
                        label="Ville" value={safeplace.city} setValue={() => {}} readonly={true} />,
                    <TextInput key={`${safeplace.id}-address`} type="text" role="address"
                        label="Adresse" value={safeplace.address} setValue={() => {}} readonly={true} />,
                    <TextInput key={`${safeplace.id}-timetable`} type="text" role="timetable"
                        label="Horaires" value={displayTimetable(safeplace.dayTimetable)} setValue={() => {}} readonly={true} />,
                    <TextInput key={`${safeplace.id}-type`} type="text" role="type"
                        label="Type" value={safeplace.type} setValue={() => {}} readonly={true} />,
                    <div className="grid-container">
                        <TextInput key={`${safeplace.id}-coordinate1`} type="text" role="latitude" width="98%"
                            label="Latitude" value={safeplace.coordinate[0]} setValue={() => {}} readonly={true} />
                        <TextInput key={`${safeplace.id}-coordinate2`} type="text" role="longitude" width="98%"
                            label="Longitude" value={safeplace.coordinate[1]} setValue={() => {}} readonly={true} />
                    </div>
                ]} />
            : <div />}
        </div>
    );
};

export default SafeplaceSingle;