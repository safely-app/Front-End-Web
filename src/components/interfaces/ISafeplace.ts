export default interface ISafeplace {
    id: string;
    name: string;
    description?: string;
    city: string;
    address: string;
    type: string;
    dayTimetable: (string | null)[];
    coordinate: string[];
    ownerId?: string;
}