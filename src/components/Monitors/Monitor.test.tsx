import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import Monitor from './Monitor';

test('renders monitor', () => {
    render(
        <Provider store={store}>
            <Monitor />
        </Provider>
    );
});

// test('ensure that monitor navbar works fine', () => {
//     render(
//         <Provider store={store}>
//             <Monitor />
//         </Provider>
//     );

//     const userButtonId = 'Créer un nouvel utilisateur-button-id';
//     const userButton = screen.getByTestId('Utilisateurs-navbar-button-id');
//     const safeplaceButton = screen.getByTestId('Safeplaces-navbar-button-id');
//     expect(safeplaceButton).toBeInTheDocument();
//     expect(userButton).toBeInTheDocument();

//     fireEvent.click(safeplaceButton);

//     expect(screen.queryByTestId(userButtonId)).toBeNull();

//     fireEvent.click(userButton);

//     expect(screen.getByTestId(userButtonId)).toBeInTheDocument();
// });
