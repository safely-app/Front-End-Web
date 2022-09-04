import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import BillingMonitor from './BillingMonitor';
import nock from 'nock';
import IBilling from '../../interfaces/IBilling';

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

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

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

  const amountField = screen.getByPlaceholderText('Montant');
  const validateButton = screen.getByText('Créer la facture');

  expect(amountField).toBeInTheDocument();

  fireEvent.change(amountField, { target: { value: '100' } });

  fireEvent.click(validateButton);

  await act(async () => await testDelay(1000));

  scopeCreate.done();
  scopeGet.done();
});

test('renders BillingMonitor update button', async () => {
  const billings: IBilling[] = [
    {
      id: "1",
      amount: 10,
      status: "",
      currency: "eur",
      paymentMethod: "",
      receiptEmail: "",
      description: ""
    }
  ];

  const scopeGet = nock(process.env.REACT_APP_SERVER_URL as string)
    .get('/stripe/stripe/billing').reply(200, { data: billings }, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(process.env.REACT_APP_SERVER_URL as string)
    .options('/stripe/stripe/billing/1').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeUpdate = nock(process.env.REACT_APP_SERVER_URL as string)
    .put('/stripe/stripe/billing/1').reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <BillingMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('bu-btn-id-13')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('bu-btn-id-13'));

  expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: "description" } });

  expect(screen.getByPlaceholderText('Adresse e-mail')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Adresse e-mail'), { target: { value: "a@b.fr" } });

  expect(screen.getByText('Modifier la facture')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Modifier la facture'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeUpdate.done();
  scopeGet.done();
});