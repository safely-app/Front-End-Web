import IInvoice from '../components/interfaces/IInvoice';
import Invoice from './Invoice';
import nock from 'nock';

const testURL: string = process.env.REACT_APP_SERVER_URL as string;

test('ensure that getAll occurs without technical errors', async () => {
    const scope = nock(testURL)
        .get('/mock/invoice')
        .reply(200, [], {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Invoice.getAll("");
    expect(response.status).toBe(200);
    scope.done();
});

test('ensure that get occurs without technical errors', async () => {
    const scope = nock(testURL)
        .get('/mock/invoice/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const response = await Invoice.get("1", "");
    expect(response.status).toBe(200);
    scope.done();
});

test('ensure that create occurs without technical errors', async () => {
    const scope = nock(testURL)
        .post('/mock/invoice')
        .reply(201, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    const data: IInvoice = {
        id: '1',
        userId: '132',
        amount: 100,
        date: '13-09-2021'
    };

    const response = await Invoice.create(data, "");
    expect(response.status).toBe(201);
    scope.done();
});

test('ensure thata update occurs without technical occurs', async () => {
    const scopeOptions = nock(testURL)
        .options('/mock/invoice/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(testURL)
        .put('/mock/invoice/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

        const data: IInvoice = {
            id: '1',
            userId: '132',
            amount: 100,
            date: '13-09-2021'
        };

        const response = await Invoice.update("1", data, "");
        expect(response.status).toBe(200);
        scopeOptions.done();
        scope.done();
});

test('ensure that delete occurs without technical errors', async () => {
    const scopeOptions = nock(testURL)
        .options('/mock/invoice/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(testURL)
        .delete('/mock/invoice/1')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

        const response = await Invoice.delete("1", "");
        expect(response.status).toBe(200);
        scopeOptions.done();
        scope.done();
});