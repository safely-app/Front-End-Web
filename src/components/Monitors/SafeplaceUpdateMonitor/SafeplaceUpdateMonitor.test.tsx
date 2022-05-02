import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import SafeplaceUpdateMonitor from './SafeplaceUpdateMonitor';
import nock from 'nock';

const testUrl = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders monitor', async () => {
    const scopeSafeplace = nock(testUrl)
        .get('/safeplace/safeplace')
        .reply(200, [
            {
                _id: "1",
                name: "Marché de Hoenheim",
                description: "Description",
                city: "Strasbourg",
                address: "1 Rue du Grenier à Grain",
                type: "Market",
                dayTimetable: [ null, null, null, null, null, null, null ],
                coordinate: [ "48.6212448082", "7.75567703707" ],
                ownerId: "6152cef3487da44a7de8ceb3",
              }
        ], { 'Access-Control-Allow-Origin': '*' });

    const scopeSafeplaceUpdate = nock(testUrl)
        .get('/safeplace/safeplaceUpdate')
        .reply(200, [
            {
                _id: "1",
                safeplaceId: "1",
                name: "Marché de Hoenheim",
                description: "Description",
                city: "Strasbourg",
                address: "1 Rue du Grenier à Grain",
                type: "Market",
                dayTimetable: [ null, null, null, null, null, null, null ],
                coordinate: [ "48.6212448082", "7.75567703707" ],
                ownerId: "6152cef3487da44a7de8ceb3",
              }
        ], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <SafeplaceUpdateMonitor />
        </Provider>
    );

    await act(async () => testDelay(2000));

    const element = screen.getByTestId('safeplaceUpdate-button-1');
    expect(element).toBeInTheDocument();

    fireEvent.click(element);

    scopeSafeplaceUpdate.done();
    scopeSafeplace.done();
});