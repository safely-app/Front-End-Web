import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import InvoiceMonitor from './InvoiceMonitor';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders InvoiceMonitor', () => {
    render(
        <Provider store={store}>
            <InvoiceMonitor />
        </Provider>
    );
});

test('renders InvoiceMonitor create button', async () => {
    const scopeGet = nock(process.env.REACT_APP_SERVER_URL as string)
        .get('/mock/invoice').reply(200, [], { 'Access-Control-Allow-Origin': '*' });
    const scopeCreate = nock(process.env.REACT_APP_SERVER_URL as string)
        .post('/mock/invoice').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <InvoiceMonitor />
        </Provider>
    );

    const createButton = screen.getByText('Créer une nouvelle facture');

    expect(createButton).toBeInTheDocument();
    fireEvent.click(createButton);

    const userIdField = screen.getByRole('userId');
    const amountField = screen.getByRole('amount');
    const dateField = screen.getByRole('date');
    const validateButton = screen.getByText('Créer une facture');

    expect(userIdField).toBeInTheDocument();
    expect(amountField).toBeInTheDocument();
    expect(dateField).toBeInTheDocument();

    fireEvent.change(userIdField, {
        target: { value: '123' }
    });

    fireEvent.change(amountField, {
        target: { value: '100' }
    });

    fireEvent.change(dateField, {
        target: { value: '13-09-2021' }
    });

    fireEvent.click(validateButton);

    await act(async () => await testDelay(1000));

    scopeCreate.done();
    scopeGet.done();
});

test('ensure that invoice filtering is working', async () => {
    const scope = nock(baseURL)
        .get('/mock/invoice')
        .reply(200, [
            {
                id: '1',
                userId: '132',
                amount: 100,
                date: '13-09-2021'
            },
            {
                id: '2',
                userId: '342',
                amount: 101,
                date: '12-10-2024'
            }
        ], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <InvoiceMonitor />
        </Provider>
    );

    const safeplaceTypeInfoSearchBar = screen.getByRole('search-bar');

    await act(async () => await testDelay(2000));
    expect(safeplaceTypeInfoSearchBar).toBeInTheDocument();

    fireEvent.change(safeplaceTypeInfoSearchBar, {
        target: { value: '101' }
    });

    expect(screen.getByDisplayValue('101')).toBeInTheDocument();

    await act(async () => await testDelay(2000));

    expect(screen.queryByText('132')).toBeNull();

    scope.done();
});

test('ensure that invalid input does not crash the invoice filtering', async () => {
    const scope = nock(baseURL)
        .get('/mock/invoice')
        .reply(200, [], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <InvoiceMonitor />
        </Provider>
    );

    const userInfoSearchBar = screen.getByRole('search-bar');

    await act(async () => await testDelay(2000));
    expect(userInfoSearchBar).toBeInTheDocument();

    fireEvent.change(userInfoSearchBar, {
        target: { value: 'eujffeojwefokfewkpo[' }
    });

    expect(screen.getByDisplayValue('eujffeojwefokfewkpo[')).toBeInTheDocument();

    await act(async () => await testDelay(2000));
    scope.done();
});