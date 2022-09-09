import IReport from '../components/interfaces/IReport';
import BugReport from './BugReport';
import nock from 'nock';

const testURL: string = process.env.REACT_APP_SERVER_URL as string;

test('ensure that create occurs without technical errors', async () => {
  const scope = nock(testURL).post('/support/support')
      .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  const data: IReport = {
    id: "r1",
    userId: "u1",
    title: "Titre",
    comment: "Commentaire",
    type: "Bug"
  };

  const response = await BugReport.send("u1", data, "");
  expect(response.status).toEqual(201);
  scope.done();
});

test('ensure that get all occurs without technical errors', async () => {
  const scope = nock(testURL).get('/support/support')
      .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

  const response = await BugReport.getAll("");
  expect(response.status).toEqual(200);
  scope.done();
});

test('ensure that update occurs without technical errors', async () => {
  const scopeOptions = nock(testURL).options('/support/support/r1')
      .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeUpdate = nock(testURL).put('/support/support/r1')
      .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  const data: IReport = {
    id: "r1",
    userId: "u1",
    title: "Titre",
    comment: "Commentaire",
    type: "Bug"
  };

  const response = await BugReport.update("r1", data, "");
  expect(response.status).toEqual(201);
  scopeOptions.done();
  scopeUpdate.done();
});

test('ensure that delete occurs without technical errors', async () => {
  const scopeOptions = nock(testURL).options('/support/support/r1')
      .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeDelete = nock(testURL).delete('/support/support/r1')
      .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  const response = await BugReport.delete("r1", "");
  expect(response.status).toEqual(201);
  scopeOptions.done();
  scopeDelete.done();
});