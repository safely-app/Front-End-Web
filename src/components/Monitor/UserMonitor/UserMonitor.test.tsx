import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import UserMonitor from './UserMonitor';

it('renders user monitor', () => {
    render(
        <Provider store={store}>
            <UserMonitor />
        </Provider>
    );
});

it('ensure that all expected elements are present', () => {
    render(
        <Provider store={store}>
            <UserMonitor />
        </Provider>
    );

    expect(screen.getByText(/Créer un nouvel utilisateur/i)).toBeInTheDocument();
});

it('ensure that create new user is working', () => {
    render(
        <Provider store={store}>
            <UserMonitor />
        </Provider>
    );

    const createNewUser = screen.getByText(/Créer un nouvel utilisateur/i);
    expect(createNewUser).toBeInTheDocument();

    fireEvent.click(createNewUser);

    const username = screen.getByRole('username');
    const email = screen.getByRole('email');
    const role = screen.getByRole('combobox');
    const abortButton = screen.getByText(/Annuler/i);

    expect(username).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(role).toBeInTheDocument();
    expect(screen.getAllByRole('password').length).toEqual(2);
    expect(screen.getByText(/Créer un utilisateur/i)).toBeInTheDocument();
    expect(abortButton).toBeInTheDocument();

    fireEvent.change(username, {
        target: { value: 'test' }
    });

    fireEvent.change(email, {
        target: { value: 'test@test.com' }
    });

    fireEvent.change(role, {
        target: { value: 'user' }
    });

    screen.getAllByRole('password').map(password =>
        fireEvent.change(password, {
            target: { value: 'testpassword' }
        })
    );

    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('user')).toBeInTheDocument();

    fireEvent.click(abortButton);

    expect(screen.queryByDisplayValue('test')).toBeNull();
    expect(screen.queryByDisplayValue('test@test.com')).toBeNull();
    expect(screen.queryByDisplayValue('user')).toBeNull();
});
