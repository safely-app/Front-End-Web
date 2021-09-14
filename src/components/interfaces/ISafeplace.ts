export default interface ISafeplace {
    id: string;
    name: string;
    city: string;
    address: string;
    type: string;
    dayTimetable: (string | null)[];
    coordinate: string[];
}