import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import TraderProfile from './TraderProfile';

test('renders trader profile', () => {
    render(
        <Provider store={store}>
            <TraderProfile />
        </Provider>
    );
});