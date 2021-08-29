import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import Profile from './Profile';
import nock from 'nock';

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

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

test('renders profile and delete it', async () => {
    const apiUrl = 'https://api.safely-app.fr';
    const optionScope = nock(apiUrl)
        .options('/user/')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const getScope = nock(apiUrl)
        .get('/user/')
        .reply(200, {
            _id: "1",
            username: "testusername",
            email: "test@email.com",
            password: "testpassword",
            role: "user"
        }, { 'Access-Control-Allow-Origin': '*' });
    const deleteScope = nock(apiUrl)
        .delete('/user/')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <Profile />
        </Provider>
    );

    const deleteButton = screen.getByTestId('Supprimer-button-id');
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
    await act(async () => testDelay(3000));
    deleteScope.done();
    optionScope.done();
    getScope.done();
});