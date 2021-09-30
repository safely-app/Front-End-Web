import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import Profile from './Profile';
import nock from 'nock';

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders profile', async () => {
    const scope = nock(testURL)
        .get('/user/')
        .reply(200, {
            _id: "1",
            username: "testusername",
            email: "test@email.com",
            password: "testpassword",
            role: "user"
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <Profile />
        </Provider>
    );

    expect(screen.getByRole('username')).toBeInTheDocument();
    expect(screen.getByRole('email')).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toEqual(2);

    await act(async () => testDelay(2000));
    scope.done();
});

test('renders profile update view', async () => {
    const scope = nock(testURL)
        .get('/user/')
        .reply(200, {
            _id: "1",
            username: "testusername",
            email: "test@email.com",
            password: "testpassword",
            role: "user"
        }, {
            'Access-Control-Allow-Origin': '*'
        });

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

    await act(async () => testDelay(2000));
    scope.done();
});

test('renders profile and delete it', async () => {
    const optionScope = nock(testURL)
        .options('/user/')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const getScope = nock(testURL)
        .get('/user/')
        .reply(200, {
            _id: "1",
            username: "testusername",
            email: "test@email.com",
            password: "testpassword",
            role: "user"
        }, { 'Access-Control-Allow-Origin': '*' });
    const deleteScope = nock(testURL)
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