import IRequestClaimSafeplace from '../components/interfaces/IRequestClaimSafeplace';
import RequestClaimSafeplace from './RequestClaimSafeplace';
import nock from 'nock';

const baseURL = 'https://api.safely-app.fr';

test('ensure that getting all safeplace claim request works', async () => {
    const scope = nock(baseURL)
        .get('/requestClaimSafeplace')
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
        .get('/requestClaimSafeplace/1')
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
        .post('/requestClaimSafeplace')
        .reply(201, {
            message: 'Success'
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    const data: IRequestClaimSafeplace = {
        userId: '1',
        safeplaceId: '1',
        status: 'Pending',
        comment: 'This is great'
    };

    const response = await RequestClaimSafeplace.create(data, "");
    expect(response.status).toBe(201);
    scope.done();
});

test('ensure that updating a request claim safeplace works', async () => {
    const scopeOptions = nock(baseURL)
        .options('/requestClaimSafeplace/1')
        .reply(200, { message: 'Success' }, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(baseURL)
        .put('/requestClaimSafeplace/1')
        .reply(200, {
            message: 'Success'
        }, {
            'Access-Control-Allow-Origin': '*'
        });

        const data: IRequestClaimSafeplace = {
            userId: '1',
            safeplaceId: '1',
            status: 'Pending',
            comment: 'This is great'
        };

        const response = await RequestClaimSafeplace.update("1", data, "");
        expect(response.status).toBe(200);
        scopeOptions.done();
        scope.done();
});

test('ensure that deleting a request claim safeplace works', async () => {
    const scopeOptions = nock(baseURL)
        .options('/requestClaimSafeplace/1')
        .reply(200, { message: 'Success' }, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(baseURL)
        .delete('/requestClaimSafeplace/1')
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