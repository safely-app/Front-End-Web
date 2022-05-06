import INotification from "../components/interfaces/INotification";
import Notification from "./Notification";
import nock from "nock";

const testURL: string = process.env.REACT_APP_SERVER_URL as string;

test("ensure that getAll occurs without technical errors", async () => {
    const scope = nock(testURL)
        .get('/commercial/notifications')
        .reply(200, [], {'Access-Control-Allow-Origin': '*'});

    const response = await Notification.getAll("");
    expect(response.status).toBe(200);
    scope.done();
});

test("ensure that get occurs without technical errors", async () => {
    const scope = nock(testURL)
        .get('/commercial/notifications/1')
        .reply(200, {}, {'Access-Control-Allow-Origin': '*'});

    const response = await Notification.get("1", "");
    expect(response.status).toBe(200);
    scope.done();
});

test("ensure that create occurs without technical errors", async () => {
    const scope = nock(testURL)
        .post('/commercial/notifications')
        .reply(201, {}, {'Access-Control-Allow-Origin': '*'});

    const data: INotification = {
        id: "1",
        ownerId: "1",
        title: "Title",
        description: ""
    };

    const response = await Notification.create(data, "");
    expect(response.status).toBe(201);
    scope.done();
});

test("ensure that update occurs without technical errors", async () => {
    const scopeOptions = nock(testURL)
        .options('/commercial/notifications/1')
        .reply(200, {}, {'Access-Control-Allow-Origin': '*'});
    const scopeUpdate = nock(testURL)
        .put('/commercial/notifications/1')
        .reply(200, {}, {'Access-Control-Allow-Origin': '*'});

    const data: INotification = {
        id: "1",
        ownerId: "1",
        title: "Title",
        description: ""
    };

    const response = await Notification.update("1", data, "");
    expect(response.status).toBe(200);
    scopeOptions.done();
    scopeUpdate.done();
});

test("ensure that delete occurs without technical errors", async () => {
    const scopeOptions = nock(testURL)
        .options('/commercial/notifications/1')
        .reply(200, {}, {'Access-Control-Allow-Origin': '*'});
    const scopeDelete = nock(testURL)
        .delete('/commercial/notifications/1')
        .reply(200, {}, {'Access-Control-Allow-Origin': '*'});


    const response = await Notification.delete("1", "");
    expect(response.status).toBe(200);
    scopeOptions.done();
    scopeDelete.done();
});
