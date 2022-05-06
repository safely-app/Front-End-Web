import { render } from "@testing-library/react"
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux"
import { store } from '../../../redux';
import CommentMonitor from "./CommentMonitor";
import nock from "nock";

const testUrl = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('render CommentMonitor', async () => {
    const scopeComment = nock(testUrl)
        .get('/safeplace/comment')
        .reply(200, [
            {
                id: "",
                userId: "",
                safeplaceId: "",
                comment: "",
                grade: 1,
                hasBeenValidated: false,
            }
        ], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <CommentMonitor />
        </Provider>
    );

    await act(async () => await testDelay(2000));

    scopeComment.done();
});