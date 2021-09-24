import IUser from '../components/interfaces/IUser';
import { Safeplaces } from './index';
import nock from 'nock';
import ISafeplace from '../components/interfaces/ISafeplace';

const baseURL = 'https://api.safely-app.fr';

test('get all safeplaces', async () => {
    const scope = nock(baseURL)
        .get('/safeplace')
        .reply(200, [
            { id: "1", name: "kebab" },
            { id: "2", name: "marché" },
            { id: "3", name: "magasin" },
            { id: "4", name: "caserne" },
        ], {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Safeplaces.getAll();
    expect(response.status).toEqual(200);
    scope.done();
});

test('get safeplace', async () => {
    const scope = nock(baseURL)
        .get('/safeplace/1')
        .reply(200, {
            id: "1", name: "kebab"
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Safeplaces.get("1");
    expect(response.status).toEqual(200);
    scope.done();
});

test('update safeplace', async () => {
    const scopeOptions = nock(baseURL)
        .options('/safeplace/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const scope = nock(baseURL)
        .put('/safeplace/1')
        .reply(200, {
            id: "1", name: "kebab"
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const safeplace: ISafeplace = {
        id: "1",
        name: "",
        city: "",
        address: "",
        type: "",
        dayTimetable: [],
        coordinate: []
    };

    const response = await Safeplaces.update("1", safeplace, "");
    expect(response.status).toEqual(200);
    scopeOptions.done();
    scope.done();
});

test('delete safeplace', async () => {
    const scopeOptions = nock(baseURL)
        .options('/safeplace/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const scope = nock(baseURL)
        .delete('/safeplace/1')
        .reply(200, {
            id: "1", name: "kebab"
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Safeplaces.delete("1", "");
    expect(response.status).toEqual(200);
    scopeOptions.done();
    scope.done();
});
