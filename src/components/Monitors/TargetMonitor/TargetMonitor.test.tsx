import { act, render, screen } from '@testing-library/react';
import { Provider } from "react-redux";
import { store } from '../../../redux';
import TargetMonitor from "./TargetMonitor";
import nock from 'nock';

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('render TargetMonitor', async () => {
    const scope = nock(process.env.REACT_APP_SERVER_URL as string)
        .get('/commercial/target').reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <TargetMonitor />
        </Provider>
    );

    await act(async () => testDelay(1000));

    scope.done();
});

test('get CampaignMonitor search bar', async () => {
    const scope= nock(process.env.REACT_APP_SERVER_URL as string)
        .get('/commercial/target').reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <TargetMonitor />
        </Provider>
    );

    expect(screen.getByRole('searchbox')).toBeInTheDocument();

    await act(async () => testDelay(1000));

    scope.done();
});