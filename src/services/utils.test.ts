import IUser from '../components/interfaces/IUser';
import { isUserValid } from './utils';

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