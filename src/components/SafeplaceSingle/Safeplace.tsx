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
import { notifySuccess } from '../utils';

interface ISafeplaceSingleInfoProps {
    safeplace: ISafeplace;
}

const SafeplaceSingleInfo: React.FC<ISafeplaceSingleInfoProps> = ({
    safeplace
}) => {
    const [onUpdate, setOnUpdate] = useState(false);
    const [updateSafeplace, setUpdateSafeplace] = useState(safeplace);

    const updateField = (field: string, value: string) => {
        if (updateSafeplace.hasOwnProperty(field))
            setUpdateSafeplace({ ...updateSafeplace, [field]: value });
    };

    const cancelUpdate = () => {
        setUpdateSafeplace(safeplace);
        setOnUpdate(false);
    };

    const validateUpdate = () => {
        // TODO - replace when backend is ready with call to create update request
        setOnUpdate(false);

        notifySuccess("Votre demande a été reçu et sera vérifié par un administrateur avant validation.")
    };

    return (
        <div className="text-center p-4">
            <TextInput key={`${updateSafeplace.id}-name`} type="text" role="name"
                label="Nom" value={updateSafeplace.name} setValue={(value) => updateField("name", value)} readonly={!onUpdate} />
            <TextInput key={`${updateSafeplace.id}-description`} type="text" role="description"
                label="Description" value={updateSafeplace.description as string} setValue={(value) => updateField("description", value)} readonly={!onUpdate} />
            <TextInput key={`${updateSafeplace.id}-city`} type="text" role="city"
                label="Ville" value={updateSafeplace.city} setValue={(value) => updateField("city", value)} readonly={!onUpdate} />
            <TextInput key={`${updateSafeplace.id}-address`} type="text" role="address"
                label="Adresse" value={updateSafeplace.address} setValue={(value) => updateField("address", value)} readonly={!onUpdate} />
            <TextInput key={`${updateSafeplace.id}-timetable`} type="text" role="timetable"
                label="Horaires" value={displayTimetable(updateSafeplace.dayTimetable)} setValue={() => {}} readonly={!onUpdate} />
            <TextInput key={`${updateSafeplace.id}-type`} type="text" role="type"
                label="Type" value={updateSafeplace.type} setValue={(value) => updateField("type", value)} readonly={!onUpdate} />
            <div className="grid grid-cols-2 gap-2" style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                <TextInput key={`${updateSafeplace.id}-coordinate1`} type="text" role="latitude" className="w-full"
                    label="Latitude" value={updateSafeplace.coordinate[0]} setValue={() => {}} readonly={!onUpdate} />
                <TextInput key={`${updateSafeplace.id}-coordinate2`} type="text" role="longitude" className="w-full"
                    label="Longitude" value={updateSafeplace.coordinate[1]} setValue={() => {}} readonly={!onUpdate} />
            </div>
            {(!onUpdate)
                ? <Button text="Modifier" onClick={() => setOnUpdate(true)} />
                : <div>
                    <Button text="Annuler" onClick={cancelUpdate} />
                    <Button text="Valider" onClick={validateUpdate} />
                </div>
            }
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