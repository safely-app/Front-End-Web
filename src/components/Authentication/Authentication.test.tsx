import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    Authentication,
    ResetPassword
} from './Authentication';
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
    expect(screen.getAllByRole("button").length).toEqual(3);
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

    const alreadySubscribedButton = screen.getByText(/Déjà inscrit/i);
    expect(alreadySubscribedButton).toBeInTheDocument();

    expect(screen.getByRole("email")).toBeInTheDocument();
    expect(screen.getByRole("username")).toBeInTheDocument();
    expect(screen.getAllByRole("password").length).toEqual(2);
    expect(screen.getAllByRole("button").length).toEqual(2);

    fireEvent.click(alreadySubscribedButton);

    expect(screen.getByRole("email")).toBeInTheDocument();
    expect(screen.getByRole("password")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toEqual(3);
});

test('renders authentication forgotten password component', () => {
    render(
        <Provider store={store}>
            <Authentication />
        </Provider>
    );

    const forgotPasswordLink = screen.getByText(/Mot de passe oublié/i);
    expect(forgotPasswordLink).toBeInTheDocument();

    fireEvent.click(forgotPasswordLink);

    expect(screen.getByRole("email")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
});

test('renders authentication with filled information', () => {
    render(
        <Provider store={store}>
            <Authentication />
        </Provider>
    );

    const email = screen.getByRole("email");
    const password = screen.getByRole("password");
    const buttons = screen.getAllByRole("button");
    const loginButton = buttons[0];

    expect(buttons.length).toEqual(3);
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    fireEvent.change(email, {
        target: { value: "email@test.com" }
    });

    fireEvent.change(password, {
        target: { value: "passwordtest" }
    });

    expect(screen.getByDisplayValue("email@test.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("passwordtest")).toBeInTheDocument();
});

test('renders reset password component', async () => {
    render(
        <Provider store={store}>
            <ResetPassword />
        </Provider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getAllByRole("password").length).toEqual(2);
});