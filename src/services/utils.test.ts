import IUser from '../components/interfaces/IUser';
import { isUserValid } from './utils';
import { User } from './index';

test('isUserValid invalid password', async () => {

    const user: IUser = {
        id: "",
        email: "test@test.com",
        username: "test",
        password: "ts",
        confirmedPassword: "ts",
        role: ""
    };

    expect(() => {
        isUserValid(user);
    }).toThrowError("Mot de passe invalide");
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

    expect(() => {
        isUserValid(user);
    }).toThrowError("Nom d'utilisateur invalide");
});

test('isUserValid invalid password', async () => {

    const user: IUser = {
        id: "",
        email: "te",
        username: "test",
        password: "test",
        confirmedPassword: "test",
        role: ""
    };

    expect(() => {
        isUserValid(user);
    }).toThrowError("Email invalide");
});