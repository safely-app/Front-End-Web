import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import RequestClaimSafeplace from './RequestClaimSafeplaceMonitor';
import nock from 'nock';

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders requestclaimsafeplace monitor', () => {
    render(
        <Provider store={store}>
            <RequestClaimSafeplace />
        </Provider>
    );
});

test('ensure that create button is working', () => {
    render(
        <Provider store={store}>
            <RequestClaimSafeplace />
        </Provider>
    );

    const createButton = screen.getByText("Créer une nouvelle requête de safeplace");

    expect(createButton).toBeInTheDocument();
    fireEvent.click(createButton);

    expect(screen.getByText("Créer une requête de safeplace")).toBeInTheDocument();

    const stopButton = screen.getByText("Annuler");

    expect(stopButton).toBeInTheDocument();
    fireEvent.click(stopButton);
});

test('ensure that new request creation occurs without technical errors', async () => {
    const scope = nock(process.env.REACT_APP_SERVER_URL as string)
        .post('/requestClaimSafeplace')
        .reply(201, {
            message: 'Success'
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <RequestClaimSafeplace />
        </Provider>
    );

    const createButton = screen.getByText("Créer une nouvelle requête de safeplace");

    expect(createButton).toBeInTheDocument();
    fireEvent.click(createButton);

    fireEvent.change(screen.getByRole('userId'), {
        target: { value: '1' }
    });

    fireEvent.change(screen.getByRole('safeplaceId'), {
        target: { value: '1' }
    });

    fireEvent.change(screen.getByRole('comment'), {
        target: { value: 'Test comment' }
    });

    fireEvent.click(screen.getByText("Créer une requête de safeplace"));

    await act(async () => await testDelay(2000));

    scope.done();
});
