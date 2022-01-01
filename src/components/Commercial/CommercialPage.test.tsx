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

const testCampaigns = [
    {
        id: "1",
        ownerId: "1",
        name: "Template",
        budget: "5000",
        status: "template",
        startingDate: "2020-12-28",
        targets: [ "1", "2" ]
    },
    {
        id: "2",
        ownerId: "1",
        name: "Campagne 1",
        budget: "5000",
        status: "active",
        startingDate: "2020-12-28",
        targets: [ "1", "2" ]
    },
    {
        id: "3",
        ownerId: "1",
        name: "Campagne 2",
        budget: "5000",
        status: "pause",
        startingDate: "2020-12-28",
        targets: [ "1", "2" ]
    },
    {
        id: "4",
        ownerId: "1",
        name: "Campagne 3",
        budget: "5000",
        status: "random",
        startingDate: "2020-12-28",
        targets: []
    }
];

const testTargets = [
    {
        id: "1",
        ownerId: "1",
        name: "Target 1",
        csp: "csp--",
        ageRange: "30-40",
        interests: [
            "A", "B", "C"
        ]
    },
    {
        id: "2",
        ownerId: "1",
        name: "Target 2",
        csp: "csp--",
        ageRange: "30-40",
        interests: [
            "A", "B", "C"
        ]
    }
];

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
                campaigns={testCampaigns}
                addCampaign={() => {}}
                setCampaign={() => {}}
                removeCampaign={() => {}}
                targets={testTargets}
            />
        </Provider>
    );
});

test('render CommercialPageTargets', () => {
    render(
        <Provider store={store}>
            <CommercialPageTargets
                targets={testTargets}
                addTarget={() => {}}
                setTarget={() => {}}
                removeTarget={() => {}}
            />
        </Provider>
    );
});

test('render CommercialPageCampaigns create', async () => {
    const addCampaign = jest.fn();
    const scopeCreateCampaign = nock(testURL)
        .post('/commercial/campaign')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <CommercialPageCampaigns
                campaigns={testCampaigns}
                addCampaign={addCampaign}
                setCampaign={() => {}}
                removeCampaign={() => {}}
                targets={testTargets}
            />
        </Provider>
    );

    fireEvent.click(screen.getByText("Créer une nouvelle campagne"));
    fireEvent.change(screen.getByRole("name"), { target: { value: "test name" } });
    fireEvent.change(screen.getByRole("budget"), { target: { value: "6000" } });
    fireEvent.change(screen.getByRole("status"), { target: { value: "test status" } });
    fireEvent.change(screen.getByRole("startingDate"), { target: { value: "test startingDate" } });
    fireEvent.click(screen.getByText("Créer une campagne"));

    await act(async () => await testDelay(1000));
    expect(addCampaign).toHaveBeenCalled();
    scopeCreateCampaign.done();
});

test('render CommercialPageTargets create', async () => {
    const addTarget = jest.fn();
    const scopeCreateTarget = nock(testURL)
        .post('/commercial/target')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <CommercialPageTargets
                targets={testTargets}
                addTarget={addTarget}
                setTarget={() => {}}
                removeTarget={() => {}}
            />
        </Provider>
    );

    fireEvent.click(screen.getByText("Créer une nouvelle cible"));
    fireEvent.change(screen.getByRole("name"), { target: { value: "test name" } });
    fireEvent.change(screen.getByRole("csp"), { target: { value: "6000" } });
    fireEvent.change(screen.getByRole("ageRange"), { target: { value: "test status" } });
    fireEvent.click(screen.getByText("Créer une cible"));

    await act(async () => await testDelay(1000));
    expect(addTarget).toHaveBeenCalled();
    scopeCreateTarget.done();
});

test('render CommercialPageCampaigns pause campaign', () => {
    render(
        <Provider store={store}>
            <CommercialPageCampaigns
                campaigns={testCampaigns}
                addCampaign={() => {}}
                setCampaign={() => {}}
                removeCampaign={() => {}}
                targets={testTargets}
            />
        </Provider>
    );

    fireEvent.click(screen.getByText("⏵"));
    fireEvent.click(screen.getByText("⏸"));
});

test('render CommercialPageCampaigns create from template', async () => {
    const addCampaign = jest.fn();
    const scopeCreateCampaign = nock(testURL)
        .post('/commercial/campaign')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    render(
        <Provider store={store}>
            <CommercialPageCampaigns
                campaigns={testCampaigns}
                addCampaign={addCampaign}
                setCampaign={() => {}}
                removeCampaign={() => {}}
                targets={testTargets}
            />
        </Provider>
    );

    const templateAddButton = screen.getByText("+");

    fireEvent.click(templateAddButton);

    await act(async () => await testDelay(1000));
    expect(addCampaign).toHaveBeenCalled();
    scopeCreateCampaign.done();
});
