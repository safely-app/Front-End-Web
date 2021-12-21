import React from 'react';
import {
    render,
    screen,
    fireEvent,
    act
} from '@testing-library/react';
import { store } from '../../redux';
import { Provider } from 'react-redux';
import CommercialPage from './CommercialPage';
import CommercialPageTargets from './CommercialTargets';
import CommercialPageCampaigns from './CommercialCampaigns';
import nock from 'nock';

const testURL: string = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('render CommercialPage', async () => {
    const scopeCampaign = nock(testURL)
        .get('/commercial/campaign')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });
    const scopeTarget = nock(testURL)
        .get('/commercial/target')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <CommercialPage />
        </Provider>
    );

    await act(async () => await testDelay(1000));

    scopeCampaign.done();
    scopeTarget.done();
});

test('render CommercialPageCampaigns', () => {
    render(
        <Provider store={store}>
            <CommercialPageCampaigns
                campaigns={[]}
                addCampaign={() => {}}
                setCampaign={() => {}}
                removeCampaign={() => {}}
                targets={[]}
            />
        </Provider>
    );
});

test('render CommercialPageTargets', () => {
    render(
        <Provider store={store}>
            <CommercialPageTargets
                targets={[]}
                addTarget={() => {}}
                setTarget={() => {}}
                removeTarget={() => {}}
            />
        </Provider>
    );
});
