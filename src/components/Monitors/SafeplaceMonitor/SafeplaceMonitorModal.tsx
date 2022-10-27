import { useState, useEffect } from "react";
import ISafeplace from "../../interfaces/ISafeplace";

interface VerifyHoursDayProps {
  name: string;
  timetable: string[];
  isChecked: boolean;
}

const VerifyHours: React.FC<{
  safeplace: ISafeplace;
  setSafeplace: (safeplace: ISafeplace) => void;
}> = ({
  safeplace,
  setSafeplace,
}) => {
  const [timetable, setTimetable] = useState<VerifyHoursDayProps[]>([
    { name: "Lundi", timetable: [], isChecked: false },
    { name: "Mardi", timetable: [], isChecked: false },
    { name: "Mercredi", timetable: [], isChecked: false },
    { name: "Jeudi", timetable: [], isChecked: false },
    { name: "Vendredi", timetable: [], isChecked: false },
    { name: "Samedi", timetable: [], isChecked: false },
    { name: "Dimanche", timetable: [], isChecked: false }
  ]);

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

  const joinDayTimetable = (dayTimetable: VerifyHoursDayProps[]): (string | null)[] => {
    return dayTimetable
      .map(element => (!element.isChecked) ? { ...element, timetable: new Array(4).fill("") } : element)
      .map(element => {
        const validTimes = element.timetable.filter(elT => elT !== "");

        if (validTimes.length === 0)
          return null;

        const firstPart = validTimes.slice(0, 2).map(t => t.replace(':', 'h')).join(' à ');
        const secondPart = validTimes.slice(2, 4).map(t => t.replace(':', 'h')).join(' à ');

        return (validTimes.length > 2) ? `${firstPart},${secondPart}` : firstPart;
      });
  }

  const setDayTimetable = (day: VerifyHoursDayProps) => {
    const newTimetable = timetable.map(element => (element.name === day.name) ? day : element);

    setTimetable(newTimetable);
  };

  const updateSafeplaceTimetable = () => {
    const joinedTimetable = joinDayTimetable(timetable);

    setSafeplace({ ...safeplace, dayTimetable: joinedTimetable });
  };

  const setDayTimetableValue = (
    day: VerifyHoursDayProps,
    index: number,
    value: string
  ) => {
    setDayTimetable({
      ...day,
      timetable: day.timetable.map((element, elIndex) =>
        (elIndex === index) ? value : element)
    });
  };

  useEffect(() => {
    const splitDayTimetable = (dayTimetable: string | null): string[] => {
      let daySchedule = new Array(4).fill("");

      if (dayTimetable === null)
        return daySchedule;

      dayTimetable.split(',').forEach((element, index) => {
        const hoursSplit = element.split(' à ');
        daySchedule[index * 2] = formatTime(hoursSplit[0]);
        daySchedule[index * 2 + 1] = formatTime(hoursSplit[1]);
      });

      if (
        daySchedule[2] === "" &&
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

    const days = [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche"
    ];

    const safeplaceTimetable = safeplace.dayTimetable
      .map(element => splitDayTimetable(element))
      .map((dayTimetable, index) => ({
        name: days[index],
        timetable: dayTimetable,
        isChecked: dayTimetable.filter(element => element !== "").length > 0
      }));

    setTimetable(safeplaceTimetable);
  }, [safeplace]);

  return (
    <div>
      <ul>
        {timetable.map(day => {
          return (
            <li key={day.name} className="m-2">
              <table>
                <tbody>
                  <tr className="text-sm">
                    <th className="w-36">{day.name}</th>
                    <td className="w-48">Je suis ouvert ce jour</td>
                    <td className="w-10 text-center">
                      <input type="checkbox" checked={day.isChecked} onChange={() => setDayTimetable({...day, isChecked: !day.isChecked})} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table hidden={!day.isChecked}>
                <thead>
                  <tr className="text-xs">
                    <th colSpan={3}>Matinée</th>
                    <th></th>
                    <th colSpan={3}>Après-Midi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="time" className="text-xs" value={day.timetable[0] || ''} onChange={(e) => setDayTimetableValue(day, 0, e.target.value)} /></td>
                    <td>-</td>
                    <td><input type="time" className="text-xs" value={day.timetable[1] || ''} onChange={(e) => setDayTimetableValue(day, 1, e.target.value)} /></td>
                    <td>,</td>
                    <td><input type="time" className="text-xs" value={day.timetable[2] || ''} onChange={(e) => setDayTimetableValue(day, 2, e.target.value)} /></td>
                    <td>-</td>
                    <td><input type="time" className="text-xs" value={day.timetable[3] || ''} onChange={(e) => setDayTimetableValue(day, 3, e.target.value)} /></td>
                  </tr>
                </tbody>
              </table>
              {(day.name !== "Dimanche") && <hr className="border-t border-solid border-neutral-400" />}
            </li>
          );
        })}
      </ul>
      <button
        className="block p-1 text-white text-sm rounded-lg w-48 mx-auto my-2 bg-blue-400 mt-4"
        onClick={updateSafeplaceTimetable}
      >
        Sauvegarder les horaires
      </button>
    </div>
  );
};

export const SafeplaceModal: React.FC<{
  title: string;
  modalOn: boolean;
  safeplace: ISafeplace;
  setSafeplace: (safeplace: ISafeplace) => void;
  buttons: JSX.Element[];
}> = ({
  title,
  modalOn,
  safeplace,
  setSafeplace,
  buttons
}) => {
  const setField = (field: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setSafeplace({
      ...safeplace,
      [field]: event.target.value
    });
  };

  const setCoordinate = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    setSafeplace({
      ...safeplace,
      coordinate: [
        (index === 0) ? event.target.value : safeplace.coordinate[0],
        (index === 1) ? event.target.value : safeplace.coordinate[1],
      ]
    });
  };

  return (
    <div className='absolute bg-white z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl p-6' hidden={!modalOn}>
      <p className='font-bold'>{title}</p>
      <input type='text' placeholder='Nom' className='block m-2 w-60 text-sm' value={safeplace.name || ''} onChange={(event) => setField('name', event)} />
      <input type='text' placeholder='Ville' className='block m-2 w-60 text-sm' value={safeplace.city || ''} onChange={(event) => setField('city', event)} />
      <input type='text' placeholder='Adresse' className='block m-2 w-60 text-sm' value={safeplace.address || ''} onChange={(event) => setField('address', event)} />
      <input type='text' placeholder='Description' className='block m-2 w-60 text-sm' value={safeplace.description || ''} onChange={(event) => setField('description', event)} />
      <input type='text' placeholder='Latitude' className='block m-2 w-60 text-sm' value={safeplace.coordinate[0] || ''} onChange={(event) => setCoordinate(0, event)} />
      <input type='text' placeholder='Longitude' className='block m-2 w-60 text-sm' value={safeplace.coordinate[1] || ''} onChange={(event) => setCoordinate(1, event)} />
      <input type='text' placeholder='Type' className='block m-2 w-60 text-sm' value={safeplace.type || ''} onChange={(event) => setField('type', event)} />
      <input type='text' placeholder='Propriétaire' className='block m-2 w-60 text-sm' value={safeplace.ownerId || ''} onChange={(event) => setField('ownerId', event)} />
      <VerifyHours safeplace={safeplace} setSafeplace={setSafeplace} />
      <div className='w-full mt-4'>
        {buttons}
      </div>
    </div>
  );
};