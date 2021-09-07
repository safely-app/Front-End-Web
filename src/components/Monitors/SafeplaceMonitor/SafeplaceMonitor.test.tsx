import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import SafeplaceMonitor from './SafeplaceMonitor';
import {
    displayTimetable,
    splitTimetable,
    displayCoordinates
} from './utils';

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