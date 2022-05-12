import IRequestClaimSafeplace from '../components/interfaces/IRequestClaimSafeplace';
import RequestClaimSafeplace from './RequestClaimSafeplace';
import nock from 'nock';

const baseURL = 'https://api.safely-app.fr';

test('ensure that getting all safeplace claim request works', async () => {
    const scope = nock(baseURL)
        .get('/safeplace/requestClaimSafeplace')
        .reply(200, {
            message: 'Success'
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await RequestClaimSafeplace.getAll("");
    expect(response.status).toBe(200);
    scope.done();
});

test('ensure that getting a specific request claim request works', async () => {
    const scope = nock(baseURL)
        .get('/safeplace/requestClaimSafeplace/1')
        .reply(200, {
            message: 'Success'
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await RequestClaimSafeplace.get("1", "");
    expect(response.status).toBe(200);
    scope.done();
});

test('ensure that creating a new request claim safeplace works', async () => {
    const scope = nock(baseURL)
        .post('/safeplace/requestClaimSafeplace')
        .reply(201, {
            message: 'Success'
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const data: IRequestClaimSafeplace = {
        id: '1',
        userId: '1',
        safeplaceId: '1',
        safeplaceName: 'Test',
        safeplaceDescription: '',
        coordinate: ['1', '1'],
        status: 'Pending',
    };

    const response = await RequestClaimSafeplace.create(data, "");
    expect(response.status).toBe(201);
    scope.done();
});

test('ensure that updating a request claim safeplace works', async () => {
    const scopeOptions = nock(baseURL)
        .options('/safeplace/requestClaimSafeplace/1')
        .reply(200, { message: 'Success' }, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(baseURL)
        .put('/safeplace/requestClaimSafeplace/1')
        .reply(200, {
            message: 'Success'
        }, {
            'Access-Control-Allow-Origin': '*'
        });

        const data: IRequestClaimSafeplace = {
            id: '1',
            userId: '1',
            safeplaceId: '1',
            safeplaceName: 'Test',
            safeplaceDescription: '',
            coordinate: ['1', '1'],
            status: 'Pending',
        };

        const response = await RequestClaimSafeplace.update("1", data, "");
        expect(response.status).toBe(200);
        scopeOptions.done();
        scope.done();
});

test('ensure that deleting a request claim safeplace works', async () => {
    const scopeOptions = nock(baseURL)
        .options('/safeplace/requestClaimSafeplace/1')
        .reply(200, { message: 'Success' }, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(baseURL)
        .delete('/safeplace/requestClaimSafeplace/1')
        .reply(200, {
            message: 'Success'
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await RequestClaimSafeplace.delete("1", "");
    expect(response.status).toBe(200);
    scopeOptions.done();
    scope.done();
});