import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import InvoiceMonitor from './InvoiceMonitor';
import nock from 'nock';

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
        .get('/invoice').reply(200, [], { 'Access-Control-Allow-Origin': '*' });
    const scopeCreate = nock(process.env.REACT_APP_SERVER_URL as string)
        .post('/invoice').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

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