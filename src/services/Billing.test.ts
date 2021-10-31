import IBilling from '../components/interfaces/IBilling';
import Billing from './Billing';
import nock from 'nock';

const testURL: string = process.env.REACT_APP_SERVER_URL as string;

test('ensure that getAll occurs without technical errors', async () => {
    const scope = nock(testURL)
        .get('/stripe/stripe/billing')
        .reply(200, [], {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Billing.getAll("");
    expect(response.status).toBe(200);
    scope.done();
});

test('ensure that get occurs without technical errors', async () => {
    const scope = nock(testURL)
        .get('/stripe/stripe/billing/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Billing.get("1", "");
    expect(response.status).toBe(200);
    scope.done();
});

test('ensure that create occurs without technical errors', async () => {
    const scope = nock(testURL)
        .post('/stripe/stripe/billing')
        .reply(201, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const data: IBilling = {
        id: '1',
        amount: 100,
        date: 1635439510
    };

    const response = await Billing.create(data, "");
    expect(response.status).toBe(201);
    scope.done();
});

test('ensure thata update occurs without technical occurs', async () => {
    const scopeOptions = nock(testURL)
        .options('/stripe/stripe/billing/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(testURL)
        .put('/stripe/stripe/billing/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

        const data: IBilling = {
            id: '1',
            amount: 100,
            date: 1635439510
        };

        const response = await Billing.update("1", data, "");
        expect(response.status).toBe(200);
        scopeOptions.done();
        scope.done();
});

test('ensure that delete occurs without technical errors', async () => {
    const scopeOptions = nock(testURL)
        .options('/stripe/stripe/billing/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(testURL)
        .delete('/stripe/stripe/billing/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

        const response = await Billing.delete("1", "");
        expect(response.status).toBe(200);
        scopeOptions.done();
        scope.done();
});