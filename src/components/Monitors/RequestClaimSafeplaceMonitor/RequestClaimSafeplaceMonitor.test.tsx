import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import RequestClaimSafeplace from './RequestClaimSafeplaceMonitor';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders requestclaimsafeplace monitor', async () => {
    const scope = nock(baseURL)
        .get('/requestClaimSafeplace')
        .reply(200, [], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <RequestClaimSafeplace />
        </Provider>
    );

    await act(async () => testDelay(1000));
    scope.done();
});

test('ensure that create button is working', async () => {
    const scope = nock(baseURL)
        .get('/requestClaimSafeplace')
        .reply(200, [], {
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

    expect(screen.getByText("Créer une requête de safeplace")).toBeInTheDocument();

    const stopButton = screen.getByText("Annuler");

    expect(stopButton).toBeInTheDocument();
    fireEvent.click(stopButton);

    await act(async () => testDelay(1000));
    scope.done();
});

test('ensure that new request creation occurs without technical errors', async () => {
    const scopeOptions = nock(baseURL)
        .options('/requestClaimSafeplace')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });
    const scopeGet = nock(baseURL)
        .get('/requestClaimSafeplace')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });
    const scopePost = nock(process.env.REACT_APP_SERVER_URL as string)
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

    scopeOptions.done();
    scopePost.done();
    scopeGet.done();
});
