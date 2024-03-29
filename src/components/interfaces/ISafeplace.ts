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
    adminComment?: string;
    adminGrade?: number;
}

export interface ISafeplaceVariant {
    id: string;
    name: string;
    description?: string;
    city: string;
    address: string;
    type: string;
    dayTimetable: (string | null)[];
    coordinate: number[];
    ownerId?: string;
}