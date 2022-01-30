import { render } from "@testing-library/react";
import UserProfile from "./UserProfile";
import { Provider } from 'react-redux';
import { store } from '../../redux';
import nock from 'nock';
import { act } from "react-dom/test-utils";

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders user profile', async () => {
    const scope = nock(testURL)
        .get('/user/')
        .reply(200, {
            id: "123",
            username: "john",
            email: "doe",
            role: "user"
        }, {
            'Access-Control-Allow-Origin': '*'
        });

    render(
        <Provider store={store}>
            <UserProfile />
        </Provider>
    );

    await act(async () => await testDelay(1000));
    scope.done();
});