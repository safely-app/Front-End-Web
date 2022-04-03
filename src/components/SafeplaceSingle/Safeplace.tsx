import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { AppHeader } from '../Header/Header';
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
import {
    TimetableDay,
    getTimetableFromSafeplace,
    updateSafeplaceWithTimetable
} from '../timetableUtils';

interface ITimeInputProps {
    value: string;
    setValue: (value: string) => void;
    readonly?: boolean;
}

const splitValue = (value: string) => {
    const regex = new RegExp(/^(\d|([01]\d)|(2[0123])):[012345]\d$/g);
    const found = value.match(regex);

    if (found !== null)
        return value.split(":");
    return [ "", "" ];
};

const TimeInput: React.FC<ITimeInputProps> = ({
    value,
    setValue,
    readonly
}) => {
    const [vH, vM] = splitValue(value);
    const [hours, setHours] = useState(vH);
    const [minutes, setMinutes] = useState(vM);

    const setCustomHours = (value: string) => {
        const regex = new RegExp(/^(\d|([01]\d)|(2[0123]))$/g);
        const found = value.match(regex);

        if (value === "" || found !== null)
            setHours(value);
    };

    const setCustomMinutes = (value: string) => {
        const regex = new RegExp(/^([012345]\d{0,1})$/g);
        const found = value.match(regex);

        if (value === "" || found !== null)
            setMinutes(value);
    };

    useEffect(() => {
        setValue(`${hours}:${minutes}`);
    }, [hours, minutes])

    return (
        <span>
            <input
                type="text"
                value={hours}
                placeholder="00"
                className="w-8 text-center"
                onChange={(e) => setCustomHours(e.target.value)}
                readOnly={readonly !== undefined ? readonly : false} />
            <span>:</span>
            <input
                type="text"
                value={minutes}
                placeholder="00"
                className="w-8 text-center"
                onChange={(e) => setCustomMinutes(e.target.value)}
                readOnly={readonly !== undefined ? readonly : false} />
        </span>
    );
};

interface ISafeplaceTimetableDayProps {
    day: TimetableDay;
    setDay: (day: TimetableDay) => void;
    isReadOnly: boolean;
}

const SafeplaceTimetableDay: React.FC<ISafeplaceTimetableDayProps> = ({
    day,
    setDay,
    isReadOnly
}) => {
    const setDayIsChecked = () => {
        setDay({ ...day, isChecked: !day.isChecked });
    };

    const setDayTimetableValue = (
        day: TimetableDay,
        index: number,
        value: string
    ) => {
        setDay({
            ...day,
            timetable: day.timetable.map((element, elIndex) =>
                (elIndex === index) ? value : element)
        });
    };

    return (
        <div className="text-left">
            <div className="grid grid-cols-2 pb-2">
                <p className="font-bold text-base">{day.name}</p>
                <div>
                    <span className="pr-2">Je suis ouvert ce jour</span>
                    <input type="checkbox" checked={day.isChecked} onChange={setDayIsChecked} readOnly={isReadOnly} />
                </div>
            </div>
            <div className={day.isChecked ? "grid grid-cols-2 gap-2" : "hidden"}>
                <div>
                    <p className="font-bold text-sm">Matinée</p>
                    <TimeInput value={day.timetable[0]} setValue={(value) => setDayTimetableValue(day, 0, value)} readonly={isReadOnly} />
                    <span className="mx-2">-</span>
                    <TimeInput value={day.timetable[1]} setValue={(value) => setDayTimetableValue(day, 1, value)} readonly={isReadOnly} />
                </div>
                <div>
                    <p className="font-bold text-sm">Après-Midi</p>
                    <TimeInput value={day.timetable[2]} setValue={(value) => setDayTimetableValue(day, 2, value)} readonly={isReadOnly} />
                    <span className="mx-2">-</span>
                    <TimeInput value={day.timetable[3]} setValue={(value) => setDayTimetableValue(day, 3, value)} readonly={isReadOnly} />
                </div>
            </div>
        </div>
    );
};

interface ISafeplaceTimetableProps {
    safeplace: ISafeplace;
    setSafeplace: (safeplace: ISafeplace) => void;
    isReadOnly?: boolean;
}

const SafeplaceTimetable: React.FC<ISafeplaceTimetableProps> = ({
    safeplace,
    setSafeplace,
    isReadOnly
}) => {
    const definedIsReadOnly = !!isReadOnly ? isReadOnly : false;
    const [timetable, setTimetable] = useState<TimetableDay[]>(
        getTimetableFromSafeplace(safeplace)
    );

    const setTimetableDay = (day: TimetableDay) => {
        setTimetable(timetable.map(element => element.name === day.name ? day : element));
        setSafeplace(updateSafeplaceWithTimetable(safeplace, timetable));
    };

    return (
        <ul className="bg-white rounded-md p-2" style={{ border: "1px solid #a19b96" }}>
            {timetable.map(day => {
                return (
                    <li key={day.name}>
                        <SafeplaceTimetableDay day={day} setDay={setTimetableDay} isReadOnly={definedIsReadOnly} />
                        {(day.name !== "Dimanche") && <hr className="border-none h-px my-2" style={{ backgroundColor: '#a19b96' }} />}
                    </li>
                );
            })}
        </ul>
    );
};

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
        console.log(updateSafeplace);

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
            <TextInput key={`${updateSafeplace.id}-type`} type="text" role="type"
                label="Type" value={updateSafeplace.type} setValue={(value) => updateField("type", value)} readonly={!onUpdate} />
            <div className="grid grid-cols-2 gap-2" style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                <TextInput key={`${updateSafeplace.id}-coordinate1`} type="text" role="latitude" className="w-full"
                    label="Latitude" value={updateSafeplace.coordinate[0]} setValue={() => {}} readonly={!onUpdate} />
                <TextInput key={`${updateSafeplace.id}-coordinate2`} type="text" role="longitude" className="w-full"
                    label="Longitude" value={updateSafeplace.coordinate[1]} setValue={() => {}} readonly={!onUpdate} />
            </div>
            <div className="pt-2" style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                <SafeplaceTimetable safeplace={updateSafeplace} setSafeplace={setUpdateSafeplace} isReadOnly={!onUpdate} />
            </div>
            {(!onUpdate)
                ? <Button text="Modifier" onClick={() => setOnUpdate(true)} />
                : <div>
                    <Button text="Valider" onClick={validateUpdate} />
                    <Button text="Annuler" onClick={cancelUpdate} />
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