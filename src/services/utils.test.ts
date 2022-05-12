import IProfessional from '../components/interfaces/IProfessional';
import IUser from '../components/interfaces/IUser';
import { isProfessionalValid, isTimetableValid, isUserValid } from './utils';
import {
    isEmailValid,
    isUsernameValid,
    isPasswordValid,
    isClientNumberTVA,
    isPhoneNumberValid,
    isSirenValid,
    isSiretValid
} from './utils';

test('isUserValid invalid password', async () => {

    const user: IUser = {
        id: "",
        email: "test@test.com",
        username: "test",
        password: "ts",
        confirmedPassword: "ts",
        role: ""
    };

    const result = isUserValid(user);
    expect(result).toEqual({
        isValid: false,
        error: "Mot de passe invalide"
    });
});

test('isUserValid invalid username', async () => {

    const user: IUser = {
        id: "",
        email: "test@test.com",
        username: "",
        password: "test",
        confirmedPassword: "test",
        role: ""
    };

    const result = isUserValid(user);
    expect(result).toEqual({
        isValid: false,
        error: "Nom d'utilisateur invalide"
    });
});

test('isUserValid invalid email', async () => {

    const user: IUser = {
        id: "",
        email: "te",
        username: "test",
        password: "test",
        confirmedPassword: "tes",
        role: ""
    };

    const result = isUserValid(user);
    expect(result).toEqual({
        isValid: false,
        error: "Email invalide"
    });
});

test('ensure that complete email is valid', () => {
    expect(isEmailValid('billy@lesinge.com')).toBeTruthy();
});

test('ensure that email without @ is invalid', () => {
    expect(isEmailValid('billylesinge.com')).toBeFalsy();
});

test('ensure that email without . is invalid', () => {
    expect(isEmailValid('billy@lesingecom')).toBeFalsy();
});

test('ensure that normal username is valid', () => {
    expect('Billy').toBeTruthy();
});

test('ensure that too long username is invalid', () => {
    const invalidUsername = 'this should not be a valid username because it is too long';
    expect(isUsernameValid(invalidUsername)).toBeFalsy();
});

test('ensure that too short username is invalid', () => {
    expect(isUsernameValid('A')).toBeFalsy();
});

test('ensure that normal password is valid', () => {
    expect(isPasswordValid('lemotdepasse')).toBeTruthy();
});

test('ensure that too short password is invalid', () => {
    expect(isPasswordValid('AZ')).toBeFalsy();
});

test('ensure that normal TVA client number is valid', () => {
    expect(isClientNumberTVA('FR75123456789')).toBeTruthy();
});

test('ensure that too short TVA client number is invalid', () => {
    expect(isClientNumberTVA('FR751234')).toBeFalsy();
});

test('ensure that too long TVA client number is invalid', () => {
    expect(isClientNumberTVA('FR751234567890')).toBeFalsy();
});

test('ensure that normal phone number is valid', () => {
    expect(isPhoneNumberValid('03 6478 12 09')).toBeTruthy();
});

test('ensure that trash string is an invalid phone number', () => {
    expect(isPhoneNumberValid('random trash')).toBeFalsy();
});

test('ensure that normal siren number is valid', () => {
    expect(isSirenValid('123456789')).toBeTruthy();
});

test('ensure that trash siren number is invalid', () => {
    expect(isSirenValid('random trash')).toBeFalsy();
});

test('ensure that normal siret number is valid', () => {
    expect(isSiretValid('12345678900012')).toBeTruthy();
});

test('ensure that trash siret number is invalid', () => {
    expect(isSiretValid('random trash')).toBeFalsy();
});

test('ensure that isTimetableValid occurs as expected', () => {
    expect(isTimetableValid([ null, null, null, null, null, null, null ])).toBeTruthy();
    expect(isTimetableValid([ "", "", "", "", "", "", "" ])).toBeTruthy();
    expect(isTimetableValid([ "1h à 2h", "1h à 2h", "1h à 2h", "1h à 2h", "1h à 2h", "1h à 2h", "1h à 2h" ])).toBeTruthy();

    expect(isTimetableValid([])).toBeFalsy();
    expect(isTimetableValid([ "12", "12", "12", "12", "12", "12", "12" ])).toBeFalsy();
});

test('ensure that isProfessionalValid occurs as expected', () => {
    const data: IProfessional = {
        id: "1",
        userId: "",
        companyName: "",
        companyAddress: "",
        companyAddress2: "",
        billingAddress: "",
        clientNumberTVA: "1234567890123",
        personalPhone: "0666666666",
        companyPhone: "0366666666",
        type: "",
        SIREN: "123456789",
        SIRET: "12345678901234"
    };

    expect(isProfessionalValid(data)).toEqual({ isValid: true });
    expect(isProfessionalValid({ ...data, clientNumberTVA: "" }).isValid).toBeFalsy();
    expect(isProfessionalValid({ ...data, personalPhone: "" }).isValid).toBeFalsy();
    expect(isProfessionalValid({ ...data, companyPhone: "" }).isValid).toBeFalsy();
    expect(isProfessionalValid({ ...data, SIREN: "aeaoeoa" }).isValid).toBeFalsy();
    expect(isProfessionalValid({ ...data, SIRET: "auieaiu" }).isValid).toBeFalsy();
});