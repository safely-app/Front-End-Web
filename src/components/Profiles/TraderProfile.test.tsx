import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import TraderProfile from './TraderProfile';
import nock from 'nock';

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders trader profile', () => {
    render(
        <Provider store={store}>
            <TraderProfile />
        </Provider>
    );
});

test('renders trader profile not found', async () => {
    const scope = nock(testURL)
        .get('/professionalinfo')
        .reply(200, [], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <TraderProfile />
        </Provider>
    );

    await act(async () => await testDelay(1000));
    scope.done();
});