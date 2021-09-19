import React from 'react';
import { act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import App, { Map } from './App';
import ISafeplace from '../interfaces/ISafeplace';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders app', async () => {
    const scopeUser = nock(baseURL)
        .get('/user/')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scopeSafeplace = nock(baseURL)
        .get('/safeplace')
        .reply(200, [], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <App />
        </Provider>
    );

    await act(async () => testDelay(1000));

    scopeSafeplace.done();
    scopeUser.done();
});

test('renders map', () => {
    const safeplaces: ISafeplace[] = [
        {
            id: "1",
            name: "Magasin stylé",
            city: "Paris",
            address: "12 Avenue de la Poiscaille",
            type: "Top",
            dayTimetable: [],
            coordinate: [ "48.92", "35.61" ]
        }
    ];

    render(
        <Map safeplaces={safeplaces} />
    );
});