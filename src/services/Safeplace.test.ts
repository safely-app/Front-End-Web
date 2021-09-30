import IUser from '../components/interfaces/IUser';
import { Safeplaces } from './index';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

it('get all safeplaces', async () => {
    const scope = nock(baseURL)
        .get('/safeplace/safeplace')
        .reply(200, [
            { id: "1", name: "kebab" },
            { id: "2", name: "marché" },
            { id: "3", name: "magasin" },
            { id: "4", name: "caserne" },
        ], {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Safeplaces.getAll("");
    expect(response.status).toEqual(200);
    scope.done();
});

it('get safeplace', async () => {
    const scope = nock(baseURL)
        .get('/safeplace/safeplace/1')
        .reply(200, {
            id: "1", name: "kebab"
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Safeplaces.get("1", "");
    expect(response.status).toEqual(200);
    scope.done();
});

it('update safeplace', async () => {
    const scopeOptions = nock(baseURL)
        .options('/safeplace/safeplace/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const scope = nock(baseURL)
        .put('/safeplace/safeplace/1')
        .reply(200, {
            id: "1", name: "kebab"
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const user: IUser = {
        id: "1",
        username: "",
        email: "",
        role: ""
    };

    const response = await Safeplaces.update("1", user, "");
    expect(response.status).toEqual(200);
    scope.done();
});

it('delete safeplace', async () => {
    const scopeOptions = nock(baseURL)
        .options('/safeplace/safeplace/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const scope = nock(baseURL)
        .delete('/safeplace/safeplace/1')
        .reply(200, {
            id: "1", name: "kebab"
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Safeplaces.delete("1", "");
    expect(response.status).toEqual(200);
    scope.done();
});
