import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { SafeplacesList } from './Safeplaces';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import nock from 'nock';

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders SafeplacesList', () => {
    const safeplaces = [
        {
            id: "1",
            name: "test",
            description: "test",
            city: "test",
            address: "test address",
            type: "test",
            dayTimetable: [ null, null, null, null, null, null, null ],
            coordinate: [ "48", "-56" ],
        }
    ];

    render(
        <Provider store={store}>
            <SafeplacesList
                safeplaces={safeplaces}
                setSafeplace={() => {}}
                removeSafeplace={() => {}}
                searchBarValue=""
                setSearchBarValue={() => {}}
            />
        </Provider>
    );

    expect(screen.getByText("test address")).toBeInTheDocument();
});

test('renders SafeplacesList search bar', () => {
    render(
        <Provider store={store}>
            <SafeplacesList
                safeplaces={[]}
                setSafeplace={() => {}}
                removeSafeplace={() => {}}
                searchBarValue=""
                setSearchBarValue={() => {}}
            />
        </Provider>
    );

    const searchBar = screen.getByRole('searchbox');
    expect(searchBar).toBeInTheDocument();
});

test('act on SafeplacesList', async () => {
    const safeplaces = [
        {
            id: "1",
            name: "test",
            description: "test",
            city: "test",
            address: "test address",
            type: "test",
            dayTimetable: [ null, null, null, null, null, null, null ],
            coordinate: [ "48", "-56" ],
        }
    ];

    const scopeClaim = nock(testURL)
        .post('/safeplace/requestClaimSafeplace')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <SafeplacesList
                safeplaces={safeplaces}
                setSafeplace={() => {}}
                removeSafeplace={() => {}}
                searchBarValue=""
                setSearchBarValue={() => {}}
            />
        </Provider>
    );

    const requestButton = screen.getByTestId('request-shop-1');
    const updateButton = screen.getByTestId('update-shop-1');

    expect(requestButton).toBeInTheDocument();
    expect(updateButton).toBeInTheDocument();

    fireEvent.click(requestButton);
    fireEvent.click(updateButton);

    await act(async () => await testDelay(2000));

    scopeClaim.done();
});