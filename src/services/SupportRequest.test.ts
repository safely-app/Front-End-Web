import SupportRequest from "./SupportRequest";
import nock from "nock";
import ISupportRequest from "../components/interfaces/ISupportRequest";

const testURL = process.env.REACT_APP_SERVER_URL as string;

test('test getAll SupportRequest', async () => {
    const scope = nock(testURL)
        .get("/support/support")
        .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

    const response = await SupportRequest.getAll("");
    expect(response.status).toEqual(200);
    scope.done();
});

test('test update SupportRequest', async () => {
    const scopeOptions = nock(testURL)
        .options("/support/support/1")
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scopeUpdate = nock(testURL)
        .put("/support/support/1")
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const supportRequest: ISupportRequest = {
        id: "1",
        userId: "1",
        type: "Opinion",
        title: "Test",
        comment: "Test"
    };

    const response = await SupportRequest.update("1", supportRequest, "");
    expect(response.status).toEqual(200);
    scopeOptions.done();
    scopeUpdate.done();
});

test('test delete SupportRequest', async () => {
    const scopeOptions = nock(testURL)
        .options("/support/support/1")
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });
    const scopeDelete = nock(testURL)
        .delete("/support/support/1")
        .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

    const response = await SupportRequest.delete("1", "");
    expect(response.status).toEqual(200);
    scopeOptions.done();
    scopeDelete.done();
});