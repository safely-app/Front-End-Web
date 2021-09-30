import ISafeplace from '../components/interfaces/ISafeplace';
import { Safeplace } from './index';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

test('get all safeplaces', async () => {
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

    const response = await Safeplace.getAll();
    expect(response.status).toEqual(200);
    scope.done();
});

test('get safeplace', async () => {
    const scope = nock(baseURL)
        .get('/safeplace/safeplace/1')
        .reply(200, {
            id: "1", name: "kebab"
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Safeplace.get("1");
    expect(response.status).toEqual(200);
    scope.done();
});

test('update safeplace', async () => {
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

    const data: ISafeplace = {
        id: "1",
        name: "Magasin stylé",
        city: "Paris",
        address: "12 Avenue de la Poiscaille",
        type: "Top",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: []
    };

    const response = await Safeplace.update("1", data, "");
    expect(response.status).toEqual(200);
    scopeOptions.done();
    scope.done();
});

test('delete safeplace', async () => {
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

    const response = await Safeplace.delete("1", "");
    expect(response.status).toEqual(200);
    scopeOptions.done();
    scope.done();
});
