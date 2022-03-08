import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import {
    Header,
    AppHeader
} from './Header';
import { canAccess, Role } from './utils';

test('renders header', () => {
    render(
        <Provider store={store}>
            <Header links={[]} />
        </Provider>
    );
});

test('renders header links', () => {
    render(
        <Provider store={store}>
            <Header links={[
                { link: "/link1", name: "Link 1", onAuth: false },
                { link: "/link2", name: "Link 2", onAuth: false },
                { link: "/link3", name: "Link 3", onAuth: false }
            ]} />
        </Provider>
    );

    expect(screen.getAllByText("Link 1").length).toEqual(2);
    expect(screen.getAllByText("Link 2").length).toEqual(2);
    expect(screen.getAllByText("Link 3").length).toEqual(2);
});

test('renders header links with on auth obligation', () => {
    render(
        <Provider store={store}>
            <Header links={[
                { link: "/link1", name: "Link 1", onAuth: true },
                { link: "/link2", name: "Link 2", onAuth: true },
                { link: "/link3", name: "Link 3", onAuth: false }
            ]} />
        </Provider>
    );

    expect(screen.queryByText("Link 1")).toBeNull();
    expect(screen.queryByText("Link 2")).toBeNull();
    expect(screen.getAllByText("Link 3").length).toEqual(2);
});

test('renders header links with on admin obligation', () => {
    render(
        <Provider store={store}>
            <Header links={[
                { link: "/link1", name: "Link 1", role: Role.ADMIN },
                { link: "/link2", name: "Link 2", role: Role.ADMIN },
                { link: "/link3", name: "Link 3", role: Role.NONE }
            ]} />
        </Provider>
    );

    expect(screen.queryByText("Link 1")).toBeNull();
    expect(screen.queryByText("Link 2")).toBeNull();
    expect(screen.getAllByText("Link 3").length).toEqual(2);
});

test('renders app header', () => {
    render(
        <Provider store={store}>
            <AppHeader />
        </Provider>
    );

    expect(screen.getAllByText("Connexion").length).toEqual(2);
});

test('ensure that canAccess returns true value', () => {
    expect(canAccess("user", Role.USER)).toEqual(true);
    expect(canAccess("user", Role.TRADER)).toEqual(false);
    expect(canAccess("user", Role.ADMIN)).toEqual(false);

    expect(canAccess("trader", Role.USER)).toEqual(true);
    expect(canAccess("trader", Role.TRADER)).toEqual(true);
    expect(canAccess("trader", Role.ADMIN)).toEqual(false);

    expect(canAccess("admin", Role.USER)).toEqual(true);
    expect(canAccess("admin", Role.TRADER)).toEqual(true);
    expect(canAccess("admin", Role.ADMIN)).toEqual(true);

    expect(canAccess("", Role.USER)).toEqual(false);
    expect(canAccess("", Role.TRADER)).toEqual(false);
    expect(canAccess("", Role.ADMIN)).toEqual(false);
});
