import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import Profile from './Profile';

test('renders profile', () => {
    render(
        <Provider store={store}>
            <Profile />
        </Provider>
    );

    expect(screen.getByRole('username')).toBeInTheDocument();
    expect(screen.getByRole('email')).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toEqual(2);
});

test('renders profile update view', () => {
    render(
        <Provider store={store}>
            <Profile />
        </Provider>
    );

    const updateButton = screen.getByTestId('Modifier-button-id');
    expect(updateButton).toBeInTheDocument();
    fireEvent.click(updateButton);

    expect(screen.getByRole('username')).toBeInTheDocument();
    expect(screen.getByRole('email')).toBeInTheDocument();
    expect(screen.getByTestId('Sauvegarder-button-id')).toBeInTheDocument();
    expect(screen.getByTestId('Supprimer-button-id')).toBeInTheDocument();

    const cancelButton = screen.getByTestId('Annuler-button-id');
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
});
