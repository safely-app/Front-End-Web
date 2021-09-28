import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import Safeplaces from './Safeplaces';
import nock from 'nock';

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders Safeplaces', async () => {
    const scope = nock(testURL)
        .get('/safeplace/safeplace')
        .reply(200, [], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <Safeplaces />
        </Provider>
    );

    await act(async () => await testDelay(2000));

    scope.done();
});

test('renders Safeplaces search bar', async () => {
    const scope = nock(testURL)
        .get('/safeplace/safeplace')
        .reply(200, [], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <Safeplaces />
        </Provider>
    );

    const searchBar = screen.getByRole('search-bar');
    expect(searchBar).toBeInTheDocument();

    await act(async () => await testDelay(2000));

    scope.done();
});