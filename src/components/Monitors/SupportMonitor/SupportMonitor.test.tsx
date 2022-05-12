import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../redux";
import SupportMonitor from "./SupportMonitor";

test('render SupportMonitor', () => {
    render(
        <Provider store={store}>
            <SupportMonitor />
        </Provider>
    );
});