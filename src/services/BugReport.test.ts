import IReport from '../components/interfaces/IReport';
import BugReport from './BugReport';
import nock from 'nock';

const testURL: string = process.env.REACT_APP_SERVER_URL as string;

test('ensure that create occurs without technical errors', async () => {
  const scope = nock(testURL).post('/support/support')
      .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  const data: IReport = {
    userId: "u1",
    title: "Titre",
    comment: "Commentaire",
    type: "Bug"
  };

  const response = await BugReport.send("u1", data, "");
  expect(response.status).toEqual(201);
  scope.done();
});