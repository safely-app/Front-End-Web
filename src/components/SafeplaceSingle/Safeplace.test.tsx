import { act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import SafeplaceSingle from './Safeplace';
import nock from 'nock';

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('render safeplacesingle', async () => {
    const scope = nock(testURL)
        .get('/safeplace/safeplace/undefined')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <SafeplaceSingle />
        </Provider>
    );

    await act(async () => await testDelay(1000));
    scope.done();
});