import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import Profile from './Profile';
import nock from 'nock';
import Router from '../../Router';

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders profile', async () => {
    render(
        <Provider store={store}>
            <Router routes={[]}>
                <Profile />
            </Router>
        </Provider>
    );

    await act(async () => await testDelay(1000));
});