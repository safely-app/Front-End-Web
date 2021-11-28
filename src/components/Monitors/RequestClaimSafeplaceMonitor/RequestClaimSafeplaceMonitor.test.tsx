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
        .get('/safeplace/requestClaimSafeplace')
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
        .get('/safeplace/requestClaimSafeplace')
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
    const scopeGet = nock(baseURL)
        .get('/safeplace/requestClaimSafeplace')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });
    const scopePost = nock(process.env.REACT_APP_SERVER_URL as string)
        .post('/safeplace/requestClaimSafeplace')
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

    fireEvent.change(screen.getByRole('userComment'), {
        target: { value: 'Test comment' }
    });

    fireEvent.change(screen.getByRole('adminComment'), {
        target: { value: 'Test comment' }
    });

    fireEvent.click(screen.getByText("Créer une requête de safeplace"));

    await act(async () => await testDelay(2000));

    scopePost.done();
    scopeGet.done();
});

test('ensure that request claim safeplace filtering is working', async () => {
    const scope = nock(baseURL)
        .get('/safeplace/requestClaimSafeplace')
        .reply(200, [
            {
                _id: '1',
                userId: '1',
                safeplaceId: '1',
                safeplaceName: 'oui',
                safeplaceDescription: 'oui',
                status: 'Pending',
                userComment: 'This is great'
            },
            {
                _id: '2',
                userId: '1',
                safeplaceId: '3',
                safeplaceName: 'non',
                safeplaceDescription: 'non',
                status: 'Refused',
                comment: 'This is not great'
            }
        ], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <RequestClaimSafeplace />
        </Provider>
    );

    const safeplaceTypeDropdown = screen.getByTestId('all-dropdown-id');
    const safeplaceTypeInfoSearchBar = screen.getByRole('search-bar');

    await act(async () => await testDelay(2000));
    expect(safeplaceTypeDropdown).toBeInTheDocument();
    expect(safeplaceTypeInfoSearchBar).toBeInTheDocument();

    fireEvent.change(safeplaceTypeDropdown, {
        target: { value: 'Pending' }
    });

    fireEvent.change(safeplaceTypeInfoSearchBar, {
        target: { value: 'is great' }
    });

    expect(screen.getByDisplayValue('is great')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pending')).toBeInTheDocument();

    await act(async () => await testDelay(2000));

    expect(screen.queryByText('not great')).toBeNull();

    scope.done();
});

test('ensure that invalid input does not crash the request claim safeplace filtering', async () => {
    const scope = nock(baseURL)
        .get('/safeplace/requestClaimSafeplace')
        .reply(200, [], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <RequestClaimSafeplace />
        </Provider>
    );

    const userTypeDropdown = screen.getByTestId('all-dropdown-id');
    const userInfoSearchBar = screen.getByRole('search-bar');

    await act(async () => await testDelay(2000));
    expect(userInfoSearchBar).toBeInTheDocument();
    expect(userTypeDropdown).toBeInTheDocument();

    fireEvent.change(userInfoSearchBar, {
        target: { value: 'eujffeojwefokfewkpo[' }
    });

    expect(screen.getByDisplayValue('eujffeojwefokfewkpo[')).toBeInTheDocument();

    await act(async () => await testDelay(2000));
    scope.done();
});