export default interface ISafeplace {
    id: string;
    name: string;
    description: string;
    city: string;
    address: string;
    grade: Int16Array;
    type: string;
    dayTimetable: [];
}