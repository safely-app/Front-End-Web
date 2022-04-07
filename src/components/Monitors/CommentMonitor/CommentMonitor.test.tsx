import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { store } from '../../../redux';
import CommentMonitor from "./CommentMonitor";

test('render CommentMonitor', () => {
    render(
        <Provider store={store}>
            <CommentMonitor />
        </Provider>
    );
});