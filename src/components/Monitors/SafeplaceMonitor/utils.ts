export const displayTimetable = (timetable: (string | null)[]): string => {
    const days = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche"
    ];

    return timetable.map((time, index) => ({ time: time, index: index }))
        .filter(item => item.time !== null)
        .map(item => days[item.index] + " : " + item.time)
        .join(" | ");
};

export const splitTimetable = (timetable: string): (string | null)[] => {
    const days = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche"
    ];

    const times = timetable.split(" | ");
    const result = times.map(time => {
        for (let index = 0; index < days.length; index++) {
            if (time.includes(days[index]))
                return { day: days[index], value: time.substring((days[index] + " : ").length) };
        }

        return undefined;
    });

    return days.map(day => result.find(item => item?.day === day)?.value)
        .map(time => time !== undefined ? time : null);
};

export const displayCoordinates = (coordinates: string[]): string => {
    return (coordinates !== undefined && coordinates.length === 2)
        ? `${coordinates[0]}, ${coordinates[1]}` : '';
};