import React, { useEffect, useState } from "react";
import { Safeplace } from "../../services";
import { Button } from "../common";
import { notifyError, notifySuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import log from "loglevel";

interface VerifyHoursDayProps {
    name: string;
    timetable: string[];
    isChecked: boolean;
}

const VerifyHours: React.FC = () => {
    const [safeplaceId, setSafeplaceId] = useState("");
    const [timetable, setTimetable] = useState<VerifyHoursDayProps[]>([
        { name: "Lundi", timetable: [], isChecked: false },
        { name: "Mardi", timetable: [], isChecked: false },
        { name: "Mercredi", timetable: [], isChecked: false },
        { name: "Jeudi", timetable: [], isChecked: false },
        { name: "Vendredi", timetable: [], isChecked: false },
        { name: "Samedi", timetable: [], isChecked: false },
        { name: "Dimanche", timetable: [], isChecked: false }
    ]);

    const parseUrl = (url: string): string => {
        const regex = new RegExp("/verifyHours/(.*)");
        const found = url.match(regex) || [""];

        return found[1];
    };

    const formatTime = (strTime: string) => {
        if (strTime === undefined)
            return "";
        if (strTime.includes('h')) {
            if (strTime.split('h')[0].length === 1)
                strTime = `0${strTime}`;
            if (strTime.split('h')[1].length === 0)
                return strTime.replace('h', ':00');
            else return strTime.replace('h', ':');
        }
    };

    const isAfternoon = (strTime: string) => {
        if (strTime === undefined) return false;
        return (Number(strTime.split(':')[0]) > 12);
    };

    const splitDayTimetable = (dayTimetable: string | null): string[] => {
        let daySchedule = new Array(4).fill("");

        if (dayTimetable === null)
            return daySchedule;

        dayTimetable.split(',').forEach((element, index) => {
            const hoursSplit = element.split(' à ');
            daySchedule[index * 2] = formatTime(hoursSplit[0]);
            daySchedule[index * 2 + 1] = formatTime(hoursSplit[1]);
        });

        if (daySchedule[2] === "" &&
            daySchedule[3] === "" &&
            isAfternoon(daySchedule[0]) &&
            isAfternoon(daySchedule[1])
        ) {
            daySchedule[2] = daySchedule[0];
            daySchedule[3] = daySchedule[1];
            daySchedule[0] = "";
            daySchedule[1] = "";
        }

        return daySchedule.map(element =>
            element === undefined ? "" : element);
    };

    const joinDayTimetable = (dayTimetable: VerifyHoursDayProps[]): (string | null)[] => {
        return dayTimetable
            .map(element => (!element.isChecked) ? { ...element, timetable: new Array(4).fill("") } : element)
            .map(element => {
                const validTimes = element.timetable.filter(elT => elT !== "");

                if (validTimes.length === 0)
                    return null;

                const firstPart = validTimes.slice(0, 2).map(t => t.replace(':', 'h')).join(' à ');
                const secondPart = validTimes.slice(2, 4).map(t => t.replace(':', 'h')).join(' à ');

                return (validTimes.length > 2)
                    ? `${firstPart},${secondPart}`
                    : firstPart;
            });
    }

    const setDayTimetable = (day: VerifyHoursDayProps) => {
        setTimetable(timetable.map(
            element => (element.name === day.name)
                ? day : element
        ));
    };

    const setDayTimetableValue = (
        day: VerifyHoursDayProps,
        index: number,
        value: string
    ) => {
        console.log(value);
        setDayTimetable({
            ...day,
            timetable: day.timetable.map((element, elIndex) =>
                (elIndex === index) ? value : element)
        });
    };

    const updateTimetable = async () => {
        try {
            const joinedTimetable = joinDayTimetable(timetable);
            const response = await Safeplace.updateTimetable(safeplaceId, joinedTimetable);

            notifySuccess("Horaires mises à jour.");
            log.log(response);
        } catch (e) {
            notifyError((e as Error).message);
            log.error(e);
        }
    };

    const renderDayHours = (day: VerifyHoursDayProps): JSX.Element => {
        return (
            <li key={day.name} style={{ margin: '0.5em' }}>
                <table>
                    <tbody>
                        <tr>
                            <th style={{ width: '15em', fontSize: 18 }}>{day.name}</th>
                            <td style={{ width: '10em' }}>Je suis ouvert ce jour</td>
                            <td style={{ width: '5em' }}>
                                <input type="checkbox" checked={day.isChecked} onChange={() => setDayTimetable({...day, isChecked: !day.isChecked})} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table hidden={!day.isChecked}>
                    <thead>
                        <tr>
                            <th colSpan={3} style={{ fontSize: 14 }}>Matinée</th>
                            <th></th>
                            <th colSpan={3} style={{ fontSize: 14 }}>Après-Midi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="time" value={day.timetable[0]} onChange={(e) => setDayTimetableValue(day, 0, e.target.value)} /></td>
                            <td>-</td>
                            <td><input type="time" value={day.timetable[1]} onChange={(e) => setDayTimetableValue(day, 1, e.target.value)} /></td>
                            <td>,</td>
                            <td><input type="time" value={day.timetable[2]} onChange={(e) => setDayTimetableValue(day, 2, e.target.value)} /></td>
                            <td>-</td>
                            <td><input type="time" value={day.timetable[3]} onChange={(e) => setDayTimetableValue(day, 3, e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>
                {(day.name !== "Dimanche") &&
                    <hr style={{
                        border: 0,
                        backgroundColor: '#a19b96',
                        height: 1
                    }} />
                }
            </li>
        );
    };

    useEffect(() => {
        const days = [
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi",
            "Dimanche"
        ];

        const gotSafeplaceId = parseUrl(window.location.href);

        Safeplace.getTimetable(gotSafeplaceId)
            .then(result => {
                log.log(result);
                const gotSafeplaceTimetable = result.data.dayTimetable
                    .map(element => splitDayTimetable(element))
                    .map((dayTimetable, index) => ({
                        name: days[index],
                        timetable: dayTimetable,
                        isChecked: dayTimetable.filter(element => element !== "").length > 0
                    }));

                setTimetable(gotSafeplaceTimetable);
                setSafeplaceId(gotSafeplaceId);
            }).catch(err => {
                notifyError((err as Error).message);
                log.error(err);
            });
    }, []);

    return (
        <div style={{
            backgroundColor: 'white',
            border: '1px solid #a19b96',
            borderRadius: '8px',
            padding: '1em',
            width: '500px',
            display: 'block',
            marginTop: '5em',
            marginLeft: 'auto',
            marginRight: 'auto',
        }}>
            <ul className="list">
                {timetable.map(element => renderDayHours(element))}
            </ul>
            <Button
                width="100%"
                text="Confirmer mes horaires"
                onClick={updateTimetable}
            />
            <ToastContainer />
        </div>
    );
};

export default VerifyHours;