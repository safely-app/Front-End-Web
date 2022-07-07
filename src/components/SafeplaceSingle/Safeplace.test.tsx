import { act, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import SafeplaceSingle, { SafeplaceTimetable, SafeplaceTimetableDay, splitValue, TimeInput } from './Safeplace';
import nock from 'nock';

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('render safeplacesingle', async () => {
    const scope = nock(testURL)
        .get('/safeplace/safeplace/undefined')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scopeNotifs = nock(testURL)
        .get('/commercial/notifications')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <SafeplaceSingle />
        </Provider>
    );

    await act(async () => await testDelay(1000));
    scopeNotifs.done();
    scope.done();
});

test('render SafeplaceTimetable', () => {
    const safeplace = {
        id: "1",
        ownerId: "1",
        name: "test",
        city: "test",
        type: "test",
        address: "test",
        description: "test",
        coordinate: [ "1", "1" ],
        dayTimetable: [
            "01:23 à 02:34,03:45 à 04:56",
            "01:23 à 02:34,03:45 à 04:56",
            "01:23 à 02:34,03:45 à 04:56",
            "01:23 à 02:34,03:45 à 04:56",
            "01:23 à 02:34,03:45 à 04:56",
            "01:23 à 02:34,03:45 à 04:56",
            "01:23 à 02:34,03:45 à 04:56"
        ],
    };

    render(
        <SafeplaceTimetable
            safeplace={safeplace}
            setSafeplace={() => {}}
            isReadOnly={true}
        />
    );
});

test('render SafeplaceTimetableDay', () => {
    const day = {
        name: "",
        isChecked: true,
        timetable: [
            "01:23",
            "02:34",
            "03:45",
            "04:56"
        ],
    };

    render(
        <SafeplaceTimetableDay
            day={day}
            setDay={() => {}}
            isReadOnly={true}
        />
    );
});

test('render TimeInput', () => {
    render(
        <TimeInput
            value={"01:23"}
            setValue={() => {}}
            readonly={true}
        />
    );
});

test('test splitValue', () => {
    expect(splitValue("01:23")).toEqual([ "01", "23" ]);
    expect(splitValue("0123")).toEqual([ "", "" ]);
});