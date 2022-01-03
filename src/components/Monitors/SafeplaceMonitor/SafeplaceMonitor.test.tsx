import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import SafeplaceMonitor from './SafeplaceMonitor';
import {
    displayTimetable,
    splitTimetable,
    displayCoordinates
} from './utils';
import nock from 'nock';

const testUrl = 'https://api.safely-app.fr';

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders monitor', () => {
    render(
        <Provider store={store}>
            <SafeplaceMonitor />
        </Provider>
    );
});

test('ensure that displayTimetable returns valid information', () => {
    const timetable = [
        null,
        "7h à 13h",
        null,
        null,
        null,
        "7h à 13h",
        null
    ];

    const result = displayTimetable(timetable);
    expect(result).toEqual("Mardi : 7h à 13h | Samedi : 7h à 13h");
});

test('ensure that splitTimetable returns valid information', () => {
    const result = splitTimetable("Mardi : 7h à 13h | Samedi : 7h à 13h");
    expect(result).toEqual([
        null,
        "7h à 13h",
        null,
        null,
        null,
        "7h à 13h",
        null
    ]);
});

test('ensure that displayCoordinate returns valid information', () => {
    const result = displayCoordinates([ "1", "2" ]);
    expect(result).toEqual("1, 2");
});

test('ensure that failing displayCoordinate returns valid information', () => {
    const result = displayCoordinates([]);
    expect(result).toEqual("");
});

test('ensure that safeplace filtering is working', async () => {
    const scope = nock(testUrl)
        .get('/safeplace/safeplace')
        .reply(200, [
            {
                _id: "1",
                name: "Magasin du cookie stylé",
                city: "Paris",
                address: "12 Avenue de la Poiscaille",
                type: "Top",
                dayTimetable: [ null, null, null, null, null, null, null ],
                coordinate: []
            },
            {
                _id: "2",
                name: "Magasin du flan stylé",
                city: "Tourcoin",
                address: "13 Avenue de la Poiscaille",
                type: "market",
                dayTimetable: [ null, null, null, null, null, null, null ],
                coordinate: []
            }
        ], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <SafeplaceMonitor />
        </Provider>
    );

    const safeplaceTypeDropdown = screen.getByTestId('all-dropdown-id');
    const safeplaceTypeInfoSearchBar = screen.getByRole('searchbox');

    await act(async () => await testDelay(1000));
    expect(safeplaceTypeDropdown).toBeInTheDocument();
    expect(safeplaceTypeInfoSearchBar).toBeInTheDocument();

    fireEvent.change(safeplaceTypeDropdown, {
        target: { value: 'market' }
    });

    fireEvent.change(safeplaceTypeInfoSearchBar, {
        target: { value: 'flan' }
    });

    expect(screen.getByDisplayValue('flan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('market')).toBeInTheDocument();

    await act(async () => await testDelay(1000));

    expect(screen.queryByText('cookie')).toBeNull();

    scope.done();
});

test('ensure that invalid input does not crash the safeplace filtering', async () => {
    const scope = nock(testUrl)
        .get('/safeplace/safeplace')
        .reply(200, [], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <SafeplaceMonitor />
        </Provider>
    );

    const userTypeDropdown = screen.getByTestId('all-dropdown-id');
    const userInfoSearchBar = screen.getByRole('searchbox');

    await act(async () => await testDelay(1000));
    expect(userInfoSearchBar).toBeInTheDocument();
    expect(userTypeDropdown).toBeInTheDocument();

    fireEvent.change(userInfoSearchBar, {
        target: { value: 'eujffeojwefokfewkpo[' }
    });

    expect(screen.getByDisplayValue('eujffeojwefokfewkpo[')).toBeInTheDocument();

    await act(async () => await testDelay(1000));
    scope.done();
});