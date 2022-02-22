import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import CampaignMonitor from "./CampaignMonitor";
import nock from 'nock';

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('render CampaignMonitor', async () => {
    const scopeTarget = nock(process.env.REACT_APP_SERVER_URL as string)
        .get('/commercial/target').reply(200, [], { 'Access-Control-Allow-Origin': '*' });
    const scopeCampaign = nock(process.env.REACT_APP_SERVER_URL as string)
        .get('/commercial/campaign').reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <CampaignMonitor />
        </Provider>
    );

    await act(async () => testDelay(1000));

    scopeCampaign.done();
    scopeTarget.done();
});

test('get CampaignMonitor search bar', async () => {
    const scopeTarget = nock(process.env.REACT_APP_SERVER_URL as string)
        .get('/commercial/target').reply(200, [], { 'Access-Control-Allow-Origin': '*' });
    const scopeCampaign = nock(process.env.REACT_APP_SERVER_URL as string)
        .get('/commercial/campaign').reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <CampaignMonitor />
        </Provider>
    );

    expect(screen.getByTestId('all-dropdown-id')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();

    await act(async () => testDelay(1000));

    scopeCampaign.done();
    scopeTarget.done();
});