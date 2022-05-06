import ISafeplaceUpdate from '../components/interfaces/ISafeplaceUpdate';
import { SafeplaceUpdate } from './index';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

test('get all safeplaces', async () => {
    const scope = nock(baseURL)
        .get('/commercial/modif')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    const response = await SafeplaceUpdate.getAll("");
    expect(response.status).toEqual(200);
    scope.done();
});

test('get safeplace', async () => {
    const scope = nock(baseURL)
        .get('/commercial/modif/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const response = await SafeplaceUpdate.get("1", "");
    expect(response.status).toEqual(200);
    scope.done();
});

test('create safeplace', async () => {
    const scope = nock(baseURL)
        .post('/commercial/modif')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const data: ISafeplaceUpdate = {
        id: "1",
        safeplaceId: "1",
        name: "Name",
        city: "City",
        address: "Address",
        type: "Type",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "48.0", "7.0" ]
    };

    const response = await SafeplaceUpdate.create(data, "");
    expect(response.status).toEqual(200);
    scope.done();
});

test('update safeplace', async () => {
    const scopeOptions = nock(baseURL)
        .options('/commercial/modif/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scopeUpdate = nock(baseURL)
        .put('/commercial/modif/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const data: ISafeplaceUpdate = {
        id: "1",
        safeplaceId: "1",
        name: "Name",
        city: "City",
        address: "Address",
        type: "Type",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "48.0", "7.0" ]
    };

    const response = await SafeplaceUpdate.update("1", data, "");
    expect(response.status).toEqual(200);
    scopeOptions.done();
    scopeUpdate.done();
});

test('delete safeplace', async () => {
    const scopeOptions = nock(baseURL)
        .options('/commercial/modif/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scopeUpdate = nock(baseURL)
        .delete('/commercial/modif/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const response = await SafeplaceUpdate.delete("1", "");
    expect(response.status).toEqual(200);
    scopeOptions.done();
    scopeUpdate.done();
});