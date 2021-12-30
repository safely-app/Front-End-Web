import ISafeplace from "../components/interfaces/ISafeplace";
import IInvoice from "../components/interfaces/IInvoice";
import IProfessional from "../components/interfaces/IProfessional";
import IUser from "../components/interfaces/IUser";

export const isEmailValid = (email: string): boolean => {
    return email !== "" && email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g) !== null;
};

export const isUsernameValid = (username: string): boolean => {
    return !!username && username.length > 1 && username.length < 50;
};

export const isPasswordValid = (password: string): boolean => {
    return !!password && password.length >= 3;
};

export const isTimetableValid = (timetable: (string | null)[]): boolean => {
    if (timetable.length !== 7) {
        return false;
    }

    for (let index = 0; index < 7; index++) {
        if (timetable[index] === null || timetable[index] === "") continue;
        if (timetable[index]?.match(/\d{1,2}h\d{0,2} à \d{1,2}h\d{0,2}/g) === null)
            return false;
    }

    return true;
};

export const isDateValid = (date: string): boolean => {
    return date !== "" && date.match(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g) !== null;
};

export const isClientNumberTVA = (clientNumberTVA: string): boolean => {
    return !!clientNumberTVA && clientNumberTVA.length === 13;
};

export const isPhoneNumberValid = (phoneNumber: string): boolean => {
    return !!phoneNumber && phoneNumber.split('').filter(c => c !== ' ').join('').match(/(^\d{10}$)|(^\+\d{11}$)/g) !== null;
};

export const isSirenValid = (siren: string | undefined): boolean => {
    return siren === undefined || siren === '' || (!!siren && siren.match(/^\d{9}$/g) !== null);
};

export const isSiretValid = (siret: string | undefined): boolean => {
    return siret === undefined || siret === '' || (!!siret && siret.match(/^\d{14}$/g) !== null);
};

interface IError {
    isValid: boolean;
    error?: string;
}

export const isUserValid = (user: IUser): IError => {
    if (!isEmailValid(user.email))
        return { isValid: false, error: "Email invalide" };
    if (!isUsernameValid(user.username))
        return { isValid: false, error: "Nom d'utilisateur invalide" };
    if (user.password !== undefined && !isPasswordValid(user.password))
        return { isValid: false, error: "Mot de passe invalide" };
    return { isValid: true };
};

export const isSafeplaceValid = (safeplace: ISafeplace): IError => {
    if (!isTimetableValid(safeplace.dayTimetable))
        return { isValid: false, error: "Horaires invalides" };
    return { isValid: true };
};

export const isInvoiceValid = (invoice: IInvoice): IError => {
    if (!isDateValid(invoice.date))
        return { isValid: false, error: "Date invalide" };
    return { isValid: true };
};

export const isProfessionalValid = (professional: IProfessional): IError => {
    if (!isClientNumberTVA(professional.clientNumberTVA))
        return { isValid: false, error: "Numéro d'identification à la TVA invalide" };
    if (!isPhoneNumberValid(professional.personalPhone))
        return { isValid: false, error: "Numéro de téléphone personnel invalide" };
    if (!isPhoneNumberValid(professional.companyPhone))
        return { isValid: false, error: "Numéro de téléphone d'entreprise invalide" };
    if (!isSirenValid(professional.SIREN))
        return { isValid: false, error: "Numéro SIREN invalide" };
    if (!isSiretValid(professional.SIRET))
        return { isValid: false, error: "Numéro SIRET invalide" };
    return { isValid: true };
};
