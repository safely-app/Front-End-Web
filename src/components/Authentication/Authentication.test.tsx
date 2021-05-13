import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Authentication, ForgottenPassword } from './Authentication';
import { Provider } from 'react-redux';
import { store } from '../../redux';

test('renders authentication sign up component', () => {
    render(
        <Provider store={store}>
            <Authentication />
        </Provider>
    );

    expect(screen.getByText(/Pas encore inscrit/i)).toBeInTheDocument();
    expect(screen.getByRole("email")).toBeInTheDocument();
    expect(screen.getByRole("password")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toEqual(2);
});

test('renders authentication sign in component', () => {
    render(
        <Provider store={store}>
            <Authentication />
        </Provider>
    );

    const switchViewButton = screen.getByText(/Pas encore inscrit/i);
    expect(switchViewButton).toBeInTheDocument();

    fireEvent.click(switchViewButton);

    expect(screen.getByText(/Déjà inscrit/i)).toBeInTheDocument();
    expect(screen.getByRole("email")).toBeInTheDocument();
    expect(screen.getByRole("username")).toBeInTheDocument();
    expect(screen.getAllByRole("password").length).toEqual(2);
    expect(screen.getAllByRole("button").length).toEqual(2);
});

test('renders authentication forgotten password component', () => {
    render(
        <Provider store={store}>
            <ForgottenPassword />
        </Provider>
    );

    expect(screen.getByRole("email")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
});
