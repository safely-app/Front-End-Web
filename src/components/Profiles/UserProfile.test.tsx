import { render } from "@testing-library/react";
import UserProfile from "./UserProfile";
import { Provider } from 'react-redux';
import { store } from '../../redux';

test('renders user profile', () => {
    render(
        <Provider store={store}>
            <UserProfile />
        </Provider>
    );
});