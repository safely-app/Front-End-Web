import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import BillingMonitor from './BillingMonitor';
import nock from 'nock';

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders BillingMonitor', async () => {
    const scope = nock(process.env.REACT_APP_SERVER_URL as string)
        .get('/stripe/stripe/billing').reply(200, { data: [] }, { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <BillingMonitor />
        </Provider>
    );

    await act(async () => testDelay(1000));
    scope.done();
});

test('renders BillingMonitor create button', async () => {
    const scopeGet = nock(process.env.REACT_APP_SERVER_URL as string)
        .get('/stripe/stripe/billing').reply(200, { data: [] }, { 'Access-Control-Allow-Origin': '*' });
    const scopeCreate = nock(process.env.REACT_APP_SERVER_URL as string)
        .post('/stripe/stripe/billing').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <BillingMonitor />
        </Provider>
    );

    const createButton = screen.getByText('Créer une nouvelle facture');

    expect(createButton).toBeInTheDocument();
    fireEvent.click(createButton);

    const amountField = screen.getByRole('amount');
    const validateButton = screen.getByText('Créer une facture');

    expect(amountField).toBeInTheDocument();

    fireEvent.change(amountField, {
        target: { value: '100' }
    });

    fireEvent.click(validateButton);

    await act(async () => await testDelay(1000));

    scopeCreate.done();
    scopeGet.done();
});