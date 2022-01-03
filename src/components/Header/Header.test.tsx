import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import {
    Header,
    AppHeader
} from './Header';

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

    expect(screen.getByText("Link 1")).toBeInTheDocument();
    expect(screen.getByText("Link 2")).toBeInTheDocument();
    expect(screen.getByText("Link 3")).toBeInTheDocument();
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
    expect(screen.getByText("Link 3")).toBeInTheDocument();
});

test('renders header links with on admin obligation', () => {
    render(
        <Provider store={store}>
            <Header links={[
                { link: "/link1", name: "Link 1", onAdmin: true },
                { link: "/link2", name: "Link 2", onAdmin: true },
                { link: "/link3", name: "Link 3", onAdmin: false }
            ]} />
        </Provider>
    );

    expect(screen.queryByText("Link 1")).toBeNull();
    expect(screen.queryByText("Link 2")).toBeNull();
    expect(screen.getByText("Link 3")).toBeInTheDocument();
});

// test('renders app header', () => {
//     render(
//         <Provider store={store}>
//             <AppHeader />
//         </Provider>
//     );

//     expect(screen.getByText("Dashboard")).toBeInTheDocument();
//     expect(screen.getByText("Connexion")).toBeInTheDocument();
// });
