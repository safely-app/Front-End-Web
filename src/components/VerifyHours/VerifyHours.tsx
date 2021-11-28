import React, { useEffect, useState } from "react";

interface VerifyHoursDayProps {
    name: string;
    timetable: string[];
    isChecked: boolean;
}

const VerifyHours: React.FC = () => {
    const [safeplaceId, setSafeplaceId] = useState("");
    const [timetable, setTimetable] = useState<VerifyHoursDayProps[]>([]);

    const days = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche"
    ];

    const parseUrl = (url: string): string => {
        const regex = new RegExp("/verifyHours/(.*)");
        const found = url.match(regex) || [""];

        return found[1];
    };

    const splitDayTimetable = (dayTimetable: string | null): string[] => {
        let daySchedule = new Array(4).fill("");

        if (dayTimetable === null)
            return daySchedule;

        dayTimetable.split(',').forEach((element, index) => {
            const hoursSplit = element.split('-');
            daySchedule[index * 2] = hoursSplit[0];
            daySchedule[index * 2 + 1] = hoursSplit[1];
        });

        return daySchedule.map(element =>
            element === undefined ? "" : element);
    };

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

    const renderDayHours = (day: VerifyHoursDayProps): JSX.Element => {
        return (
            <li key={day.name} style={{ margin: '0.5em' }}>
                <table>
                    <tr>
                        <th style={{ width: '10em', fontSize: 18 }}>{day.name}</th>
                        <td style={{ width: '4em' }}>Ouvert ?</td>
                        <td style={{ width: '5em' }}><input type="checkbox" checked={day.isChecked} onChange={() => setDayTimetable({...day, isChecked: !day.isChecked})} /></td>
                    </tr>
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
        const gotSafeplaceTimetable = [
            "10:00-13:00,14:00-18:00",
            "10:00-13:00,14:00-18:00",
            "10:00-13:00,14:00-18:00",
            "10:00-13:00,14:00-18:00",
            "10:00-13:00,14:00-18:00",
            "",
            ""
        ];

        setSafeplaceId(parseUrl(window.location.href));
        setTimetable(gotSafeplaceTimetable
            .map(element => splitDayTimetable(element))
            .map((dayTimetable, index) => ({
                name: days[index],
                timetable: dayTimetable,
                isChecked: dayTimetable.filter(element => element !== "").length > 0
            }))
        );
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
        </div>
    );
};

export default VerifyHours;