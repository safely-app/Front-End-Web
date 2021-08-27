import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    Authentication,
    ResetPassword,
    SignOut
} from './Authentication';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import nock from 'nock';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

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

test('renders authentication forgotten password component', async () => {
    const scope = nock('https://api.safely-app.fr')
        .post('/user/forgotPassword')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <Authentication />
        </Provider>
    );

    const forgotPasswordLink = screen.getByText(/Mot de passe oublié/i);
    expect(forgotPasswordLink).toBeInTheDocument();

    fireEvent.click(forgotPasswordLink);

    const emailInput = screen.getByRole("email");
    const forgotPasswordButton = screen.getByRole("button");
    expect(emailInput).toBeInTheDocument();
    expect(forgotPasswordButton).toBeInTheDocument();

    fireEvent.change(emailInput, {
        target: { value: 'testemail@test.de' }
    });

    fireEvent.click(forgotPasswordButton);
    await act(async () => testDelay(3000));
    scope.done();

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
    const scope = nock('https://api.safely-app.fr')
        .post('/user/changePassword')
        .reply(200, {}, {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <BrowserRouter>
                <ResetPassword />
            </BrowserRouter>
        </Provider>
    );

    const button = screen.getByRole("button");
    const passwordInputs = screen.getAllByRole("password");

    expect(button).toBeInTheDocument();
    expect(passwordInputs.length).toEqual(2);

    passwordInputs.forEach(passwordInput => {
        fireEvent.change(passwordInput, {
            target: { value: 'testpassword' }
        });
    });

    fireEvent.click(button);
    await act(async () => await testDelay(3000));
    scope.done();
});

test('renders signout component', () => {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <SignOut />
            </BrowserRouter>
        </Provider>
    );
});