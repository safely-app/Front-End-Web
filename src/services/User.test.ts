import IUser from '../components/interfaces/IUser';
import { User } from './index';
import nock from 'nock';

const baseURL = 'https://api.safely-app.fr';

test('register new user', async () => {
    const scopeRegister = nock(baseURL)
        .post('/register')
        .reply(200, {
            message: 'Success'
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const user: IUser = {
        id: "",
        email: "test@test.com",
        username: "test",
        password: "test",
        confirmedPassword: "test",
        role: ""
    };

    const response = await User.register(user);
    expect(response.status).toEqual(200);
    scopeRegister.done();
});

test('register new user throw password and confirmed password not the same', () => {
    const user: IUser = {
        id: "",
        email: "test@test.com",
        username: "test",
        password: "test",
        confirmedPassword: "tst",
        role: ""
    };

    expect(() => {
        User.register(user);
    }).toThrowError("Mot de passe invalide");
});

test('login throw invalid password', () => {
    expect(() => {
        User.login("test@test.com", "ts");
    }).toThrowError("Mot de passe invalide");
});

test('forgot password throw invalid email', () => {
    expect(() => {
        User.forgotPassword("ts");
    }).toThrowError("Email invalide");
});

test('change password throw invalid password', () => {
    expect(() => {
        User.changePassword("", "", "s", "");
    }).toThrowError("Mot de passe invalide");
});

test('register new user with no informations', async () => {
    const user: IUser = {
        id: "",
        email: "",
        username: "",
        password: "",
        confirmedPassword: "",
        role: ""
    };

    expect(() => {
        User.register(user);
    }).toThrowError("Email invalide");
});

test('login user', async () => {
    const scopeRegister = nock(baseURL)
        .post('/login')
        .reply(200, {
            message: 'Success'
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const email = 'test@test.com';
    const password = 'test';

    const response = await User.login(email, password);
    expect(response.status).toEqual(200);
    scopeRegister.done();
});

test('login user with no informations', async () => {
    const email = '';
    const password = '';

    expect(() => {
        User.login(email, password);
    }).toThrowError("Email invalide");
});

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
        User.update("", user, "");
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
        User.update("", user, "");
    }).toThrowError("Nom d'utilisateur invalide");
});

test('isUserValid invalid email', async () => {

    const user: IUser = {
        id: "",
        email: "te",
        username: "test",
        password: "test",
        confirmedPassword: "test",
        role: ""
    };

    expect(() => {
        User.update("", user, "");
    }).toThrowError("Email invalide");
});

test('update user', async () => {
    const scopeOptions = nock(baseURL)
        .options('/user/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scopeUpdate = nock(baseURL)
        .put('/user/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const user: IUser = {
        id: "1",
        email: "test@test.com",
        username: "Test",
        role: "user"
    };

    const response = await User.update("1", user, "");
    expect(response.status).toEqual(200);

    scopeOptions.done();
    scopeUpdate.done();
});

test('dekete user', async () => {
    const scopeOptions = nock(baseURL)
        .options('/user/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scopeDelete = nock(baseURL)
        .delete('/user/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const response = await User.delete("1", "");
    expect(response.status).toEqual(200);

    scopeOptions.done();
    scopeDelete.done();
});