import ISafeplace from "../components/interfaces/ISafeplace";
import IProfessional from "../components/interfaces/IProfessional";
import IBilling from "../components/interfaces/IBilling";
import IUser from "../components/interfaces/IUser";
import ISafeplaceUpdate from "../components/interfaces/ISafeplaceUpdate";
import ICampaign from "../components/interfaces/ICampaign";
import ITarget from "../components/interfaces/ITarget";

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

export const isAmountValid = (amount: number): boolean => {
    return amount > 0;
};

export const isCampaignNameValid = (name: string): boolean => {
    return name.length > 0;
};

export const isCampaignBudgetValid = (budget: number): boolean => {
    return budget > 0;
};

export const isCampaignStatusValid = (status: string): boolean => {
    return [ "active", "pause", "template" ].includes(status);
};

export const isCampaignStartingDateValid = (startingDate: string) => {
    return !isNaN(Date.parse(startingDate));
};

export const isTargetNameValid = (name: string): boolean => {
    return name.length > 0;
};

export const isTargetCSPValid = (csp: string): boolean => {
    return csp.length >= 3 && csp.length <= 5;
};

export const isTargetAgeRangeValid = (ageRange: string): boolean => {
    return ageRange.match(/^\d+-\d+$/g) !== null;
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

export const isBillingValid = (invoice: IBilling): IError => {
    if (!isAmountValid(invoice.amount))
        return { isValid: false, error: "Montant invalide" };
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

export const isSafeplaceUpdateValid = (safeplaceUpdate: ISafeplaceUpdate): IError => {
    return isSafeplaceValid(safeplaceUpdate);
};

export const isCampaignValid = (campaign: ICampaign): IError => {
    if (!isCampaignNameValid(campaign.name))
        return { isValid: false, error: "Nom invalide" };
    if (!isCampaignBudgetValid(Number(campaign.budget)))
        return { isValid: false, error: "Budget invalide" };
    if (!isCampaignStatusValid(campaign.status))
        return { isValid: false, error: "Status invalide" };
    if (!isCampaignStartingDateValid(campaign.startingDate))
        return { isValid: false, error: "Date de départ invalide" };
    return { isValid: true };
};

export const isTargetValid = (target: ITarget): IError => {
    if (!isTargetNameValid(target.name))
        return { isValid: false, error: "Nom invalide" };
    if (!isTargetCSPValid(target.csp))
        return { isValid: false, error: "CSP invalide" };
    if (!isTargetAgeRangeValid(target.ageRange))
        return { isValid: false, error: "Fourchette d'âge invalide" };
    return { isValid: true };
};
