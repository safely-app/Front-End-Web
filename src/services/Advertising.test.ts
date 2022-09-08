import IAdvertising from '../components/interfaces/IAdvertising';
import Advertising from './Advertising';
import nock from 'nock';

const baseURL: string = process.env.REACT_APP_SERVER_URL as string;

test('ensure that get all occurs without technical errors', async () => {
  const scope = nock(baseURL).get('/commercial/advertising')
    .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

  const response = await Advertising.getAll("");
  expect(response.status).toEqual(200);
  scope.done();
});

test('ensure that get occurs without technical errors', async () => {
  const scope = nock(baseURL).get('/commercial/advertising/a1')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

  const response = await Advertising.get("a1", "");
  expect(response.status).toEqual(200);
  scope.done();
});

test('ensure that get by owner occurs without technical errors', async () => {
  const scope = nock(baseURL).get('/commercial/advertising/owner/u1')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

  const response = await Advertising.getByOwner("u1", "");
  expect(response.status).toEqual(200);
  scope.done();
});

test('ensure that create occurs without technical errors', async () => {
  const scope = nock(baseURL).post('/commercial/advertising')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  const data: IAdvertising = {
    id: "a1",
    ownerId: "u1",
    title: "Titre",
    imageUrl: "",
    description: "Description",
    targets: [ "t1", "t2", "t3" ]
  };

  const response = await Advertising.create(data, "");
  expect(response.status).toEqual(201);
  scope.done();
});

test('ensure that update occurs without technical errors', async () => {
  const scopeUpdate = nock(baseURL).put('/commercial/advertising/a1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(baseURL).options('/commercial/advertising/a1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  const data: IAdvertising = {
    id: "a1",
    ownerId: "u1",
    title: "Titre",
    imageUrl: "",
    description: "Description",
    targets: [ "t1", "t2", "t3" ]
  };

  const response = await Advertising.update("a1", data, "");
  expect(response.status).toEqual(201);
  scopeOptions.done();
  scopeUpdate.done();
});

test('ensure that delete occurs without technical errors', async () => {
  const scopeDelete = nock(baseURL).delete('/commercial/advertising/a1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(baseURL).options('/commercial/advertising/a1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  const response = await Advertising.delete("a1", "");
  expect(response.status).toEqual(201);
  scopeOptions.done();
  scopeDelete.done();
});