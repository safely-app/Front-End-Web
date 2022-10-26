import ICampaign from '../components/interfaces/ICampaign';
import ITarget from '../components/interfaces/ITarget';
import Commercial from './Commercial';
import nock from 'nock';

const testURL: string = process.env.REACT_APP_SERVER_URL as string;

test('ensure that getAllCampaign occurs without technical errors', async () => {
    const scope = nock(testURL)
        .get('/commercial/campaign')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    const response = await Commercial.getAllCampaign("");
    expect(response.status).toBe(200);
    scope.done();
});

test('ensure that getAllTarget occurs without technical errors', async () => {
    const scope = nock(testURL)
        .get('/commercial/target')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    const response = await Commercial.getAllTarget("");
    expect(response.status).toBe(200);
    scope.done();
});

test('ensure that getAllCampaignByOwner occurs without technical errors', async () => {
    const scope = nock(testURL)
        .get('/commercial/campaign/owner/1')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    const response = await Commercial.getAllCampaignByOwner("1", "");
    expect(response.status).toBe(200);
    scope.done();
});

test('ensure that getAllTargetByOwner occurs without technical errors', async () => {
    const scope = nock(testURL)
        .get('/commercial/target/owner/1')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    const response = await Commercial.getAllTargetByOwner("1", "");
    expect(response.status).toBe(200);
    scope.done();
});

test('ensure that createCampaign occurs without technical errors', async () => {
    const scope = nock(testURL)
        .post('/commercial/campaign')
        .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

    const data: ICampaign = {
        id: '1',
        ownerId: "",
        name: "test",
        budget: 100,
        budgetSpent: 15,
        status: "active",
        startingDate: "2022-05-26",
        targets: []
    };

    const response = await Commercial.createCampaign(data, "");
    expect(response.status).toBe(201);
    scope.done();
});

test('ensure that createTarget occurs without technical errors', async () => {
    const scope = nock(testURL)
        .post('/commercial/target')
        .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

    const data: ITarget = {
        id: '1',
        ownerId: "",
        name: "test",
        csp: "csp",
        ageRange: "18-23",
        interests: []
    };

    const response = await Commercial.createTarget(data, "");
    expect(response.status).toBe(201);
    scope.done();
});

test('ensure that updateCampaign occurs without technical occurs', async () => {
    const scopeOptions = nock(testURL)
        .options('/commercial/campaign/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(testURL)
        .put('/commercial/campaign/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const data: ICampaign = {
        id: '1',
        ownerId: "",
        name: "test",
        budget: 100,
        budgetSpent: 10,
        status: "active",
        startingDate: "2022-05-26",
        targets: []
    };

    const response = await Commercial.updateCampaign("1", data, "");
    expect(response.status).toBe(200);
    scopeOptions.done();
    scope.done();
});

test('ensure that updateTarget occurs without technical occurs', async () => {
    const scopeOptions = nock(testURL)
        .options('/commercial/target/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(testURL)
        .put('/commercial/target/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const data: ITarget = {
        id: '1',
        ownerId: "",
        name: "test",
        csp: "csp",
        ageRange: "18-23",
        interests: []
    };

    const response = await Commercial.updateTarget("1", data, "");
    expect(response.status).toBe(200);
    scopeOptions.done();
    scope.done();
});

test('ensure that deleteCampaign occurs without technical errors', async () => {
    const scopeOptions = nock(testURL)
        .options('/commercial/campaign/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(testURL)
        .delete('/commercial/campaign/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const response = await Commercial.deleteCampaign("1", "");
    expect(response.status).toBe(200);
    scopeOptions.done();
    scope.done();
});

test('ensure that deleteTarget occurs without technical errors', async () => {
    const scopeOptions = nock(testURL)
        .options('/commercial/target/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scope = nock(testURL)
        .delete('/commercial/target/1')
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const response = await Commercial.deleteTarget("1", "");
    expect(response.status).toBe(200);
    scopeOptions.done();
    scope.done();
});