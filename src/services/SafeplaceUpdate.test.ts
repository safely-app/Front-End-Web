import ISafeplaceUpdate from '../components/interfaces/ISafeplaceUpdate';
import { SafeplaceUpdate } from './index';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

test('get all safeplaces', async () => {
    const scope = nock(baseURL)
        .get('/safeplace/safeplaceUpdate')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    const response = await SafeplaceUpdate.getAll("");
    expect(response.status).toEqual(200);
    scope.done();
});