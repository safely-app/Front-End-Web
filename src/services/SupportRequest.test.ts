import SupportRequest from "./SupportRequest";
import nock from "nock";

const testURL = process.env.REACT_APP_SERVER_URL as string;

test('test getAll SupportRequest', async () => {
    const scope = nock(testURL)
        .get("/support/support")
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    const response = await SupportRequest.getAll("");
    expect(response.status).toEqual(200);
    scope.done();
});