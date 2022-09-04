import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import Monitor from './Monitor';

test('renders monitor', () => {
  render(
    <Provider store={store}>
      <Monitor />
    </Provider>
  );
});

test('ensure that monitor navbar works fine', () => {
  render(
    <Provider store={store}>
      <Monitor />
    </Provider>
  );

  const userButton = screen.getByTestId('Utilisateurs-btn-id');
  const safeplaceButton = screen.getByTestId('Safeplaces-btn-id');
  const invoiceButton = screen.getByTestId('Factures-btn-id');
  const campaignButton = screen.getByTestId('Campagnes-btn-id');
  const targetButton = screen.getByTestId('Cibles-btn-id');
  const requestButton = screen.getByTestId('Requêtes de safeplace-btn-id');
  const updateButton = screen.getByTestId('Modifications de safeplace-btn-id');
  const commentButton = screen.getByTestId('Commentaires-btn-id');

  expect(userButton).toBeInTheDocument();
  expect(safeplaceButton).toBeInTheDocument();
  expect(invoiceButton).toBeInTheDocument();
  expect(campaignButton).toBeInTheDocument();
  expect(targetButton).toBeInTheDocument();
  expect(requestButton).toBeInTheDocument();
  expect(updateButton).toBeInTheDocument();
  expect(commentButton).toBeInTheDocument();

  fireEvent.click(safeplaceButton);
  fireEvent.click(invoiceButton);
  fireEvent.click(campaignButton);
  fireEvent.click(targetButton);
  fireEvent.click(requestButton);
  fireEvent.click(updateButton);
  fireEvent.click(commentButton);
  fireEvent.click(userButton);
});
