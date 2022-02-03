import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { AppHeader } from '../Header/Header';
import { displayTimetable } from '../Monitors/SafeplaceMonitor/utils';
import ISafeplace from '../interfaces/ISafeplace';
import { Safeplace } from '../../services';
import {
    Button,
    TextInput,
    CommonLoader
} from '../common';
import { Redirect } from 'react-router';
import log from 'loglevel';

interface ISafeplaceSingleInfoProps {
    safeplace: ISafeplace;
}

const SafeplaceSingleInfo: React.FC<ISafeplaceSingleInfoProps> = ({
    safeplace
}) => {
    return (
        <div className="text-center p-4">
            <TextInput key={`${safeplace.id}-name`} type="text" role="name"
                label="Nom" value={safeplace.name} setValue={() => {}} readonly={true} />
            <TextInput key={`${safeplace.id}-description`} type="text" role="description"
                label="Description" value={safeplace.description as string} setValue={() => {}} readonly={true} />
            <TextInput key={`${safeplace.id}-city`} type="text" role="city"
                label="Ville" value={safeplace.city} setValue={() => {}} readonly={true} />
            <TextInput key={`${safeplace.id}-address`} type="text" role="address"
                label="Adresse" value={safeplace.address} setValue={() => {}} readonly={true} />
            <TextInput key={`${safeplace.id}-timetable`} type="text" role="timetable"
                label="Horaires" value={displayTimetable(safeplace.dayTimetable)} setValue={() => {}} readonly={true} />
            <TextInput key={`${safeplace.id}-type`} type="text" role="type"
                label="Type" value={safeplace.type} setValue={() => {}} readonly={true} />
            <div className="grid grid-cols-2 gap-2" style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                <TextInput key={`${safeplace.id}-coordinate1`} type="text" role="latitude" className="w-full"
                    label="Latitude" value={safeplace.coordinate[0]} setValue={() => {}} readonly={true} />
                <TextInput key={`${safeplace.id}-coordinate2`} type="text" role="longitude" className="w-full"
                    label="Longitude" value={safeplace.coordinate[1]} setValue={() => {}} readonly={true} />
            </div>
        </div>
    );
};

const SafeplaceSingle: React.FC = () => {
    const userCredientials = useSelector((state: RootState) => state.user.credentials);
    const [safeplace, setSafeplace] = useState<ISafeplace | undefined>(undefined);
    const [redirectClicked, setRedirectClicked] = useState(false);
    const [requestFinished, setRequestFinished] = useState(false);

    const isSafeplaceValid = () => {
        const interfaceFields = [
            "_id",
            "name",
            "city",
            "address",
            "type",
            "dayTimetable",
            "coordinate"
        ] as const;

        if (safeplace === undefined)
            return false;

        for (const field of interfaceFields)
            if (safeplace[field] === undefined)
                return false;

        return true;
    };

    const parseUrl = (url: string): string => {
        const regex = new RegExp("/safeplace-page/(.*)");
        const found = url.match(regex) || [""];

        return found[1];
    };

    const getView = () => {
        if (!requestFinished)
            return <CommonLoader height={80} width={80} color='#a19b96' />;
        if (safeplace !== undefined && isSafeplaceValid())
            return <SafeplaceSingleInfo safeplace={safeplace} />;
        return (
            <div className="text-center p-4 pt-20">
                <p className="text-2xl text-lg font-semibold">Cette safeplace n'existe pas</p>
                <Button text="Retourner à l'accueil" onClick={() => setRedirectClicked(true)} width="20em" />
                {redirectClicked && <Redirect to="/" />}
            </div>
        );
    };

    useEffect(() => {
        Safeplace.get(parseUrl(window.location.href), userCredientials.token)
            .then(response => setSafeplace(response.data as ISafeplace))
            .catch(err => log.error(err))
            .finally(() => setRequestFinished(true));
    }, [userCredientials]);

    return (
        <div>
            <AppHeader />
            {getView()}
        </div>
    );
};

export default SafeplaceSingle;