import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import UserMonitor from './UserMonitor';
import nock from 'nock';

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

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
    const role = screen.getByTestId('user-dropdown-id');
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

it('ensure that user filtering is working', async () => {
    const scope = nock('https://api.safely-app.fr')
        .get('/user')
        .reply(200, [
            {
                _id: "1",
                username: "Billy",
                email: "billy@lesinge",
                password: "billylesinge",
                role: "admin"
            },
            {
                _id: "2",
                username: "Benjamin",
                email: "benjamin@legorille.com",
                password: "benjaminlegorille",
                role: "user"
            }
        ], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <UserMonitor />
        </Provider>
    );

    const userTypeDropdown = screen.getByTestId('all-dropdown-id');
    const userInfoSearchBar = screen.getByRole('search-bar');

    await act(async () => await testDelay(2000));
    expect(userInfoSearchBar).toBeInTheDocument();
    expect(userTypeDropdown).toBeInTheDocument();

    fireEvent.change(userTypeDropdown, {
        target: { value: 'user' }
    });

    fireEvent.change(userInfoSearchBar, {
        target: { value: 'benjamin' }
    });

    expect(screen.getByDisplayValue('benjamin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('user')).toBeInTheDocument();

    await act(async () => await testDelay(2000));

    expect(screen.queryByText('billy@lesinge.com')).toBeNull();

    scope.done();
});

test('ensure that invalid input does not crash the user filtering', async () => {
    const scope = nock('https://api.safely-app.fr')
        .get('/user')
        .reply(200, [
            {
                _id: "1",
                username: "Billy",
                email: "billy@lesinge",
                password: "billylesinge",
                role: "admin"
            }
        ], {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <UserMonitor />
        </Provider>
    );

    const userTypeDropdown = screen.getByTestId('all-dropdown-id');
    const userInfoSearchBar = screen.getByRole('search-bar');

    await act(async () => await testDelay(2000));
    expect(userInfoSearchBar).toBeInTheDocument();
    expect(userTypeDropdown).toBeInTheDocument();

    fireEvent.change(userInfoSearchBar, {
        target: { value: 'eujffeojwefokfewkpo[' }
    });

    expect(screen.getByDisplayValue('eujffeojwefokfewkpo[')).toBeInTheDocument();

    await act(async () => await testDelay(2000));
    scope.done();
});