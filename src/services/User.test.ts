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
