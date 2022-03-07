import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import SafeplaceUpdateMonitor from './SafeplaceUpdateMonitor';

test('renders monitor', async () => {
    render(
        <Provider store={store}>
            <SafeplaceUpdateMonitor />
        </Provider>
    );
});