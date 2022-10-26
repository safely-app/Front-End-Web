import PricingHistory from "./PricingHistory";
import nock from "nock";

const baseURL: string = process.env.REACT_APP_SERVER_URL as string;

test('ensure that get all occurs without technical errors', async () => {
    const scope = nock(baseURL).get('/advertising/cost/history')
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    const response = await PricingHistory.getAll("");
    expect(response.status).toEqual(200);
    scope.done();
});