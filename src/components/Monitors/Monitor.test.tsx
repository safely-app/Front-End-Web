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

    const userButtonId = 'create-new-user-button-id';
    const userButton = screen.getByTestId('Utilisateurs-navbar-button-id');
    const safeplaceButton = screen.getByTestId('Safeplaces-navbar-button-id');
    const invoiceButton = screen.getByTestId('Factures-navbar-button-id');
    const campaignButton = screen.getByTestId('Campagnes-navbar-button-id');
    const targetButton = screen.getByTestId('Cibles-navbar-button-id');
    const requestButton = screen.getByTestId('Requêtes de safeplace-navbar-button-id');
    const updateButton = screen.getByTestId('Modifications de safeplace-navbar-button-id');
    const commentButton = screen.getByTestId('Commentaires-navbar-button-id');

    expect(userButton).toBeInTheDocument();
    expect(safeplaceButton).toBeInTheDocument();
    expect(invoiceButton).toBeInTheDocument();
    expect(campaignButton).toBeInTheDocument();
    expect(targetButton).toBeInTheDocument();
    expect(requestButton).toBeInTheDocument();
    expect(updateButton).toBeInTheDocument();
    expect(commentButton).toBeInTheDocument();

    fireEvent.click(safeplaceButton);

    expect(screen.queryByTestId(userButtonId)).toBeNull();

    fireEvent.click(userButton);

    expect(screen.getByTestId(userButtonId)).toBeInTheDocument();

    fireEvent.click(invoiceButton);
    fireEvent.click(campaignButton);
    fireEvent.click(targetButton);
    fireEvent.click(requestButton);
    fireEvent.click(updateButton);
    fireEvent.click(commentButton);
});
