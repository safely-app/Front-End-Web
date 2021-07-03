import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import Safeplace from './Safeplace';

test('renders monitor', () => {
    render(
        <Provider store={store}>
            <Safeplace />
        </Provider>
    );
});
