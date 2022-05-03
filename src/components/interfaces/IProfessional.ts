export default interface IProfessional {
    userId: string;
    companyName: string;
    companyAddress: string;
    companyAddress2: string;
    billingAddress: string;
    clientNumberTVA: string;
    personalPhone: string;
    companyPhone: string;
    RCS?: string;
    registrationCity?: string;
    SIREN?: string;
    SIRET?: string;
    artisanNumber?: string;
    type: string;
    id: string;
}