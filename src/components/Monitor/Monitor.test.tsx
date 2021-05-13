import React from 'react';
import { render } from '@testing-library/react';
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
