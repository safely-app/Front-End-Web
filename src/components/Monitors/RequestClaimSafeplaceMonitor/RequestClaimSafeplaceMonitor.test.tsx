import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import RequestClaimSafeplace from './RequestClaimSafeplaceMonitor';
import nock from 'nock';

const baseURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('renders requestclaimsafeplace monitor', async () => {
  const scope = nock(baseURL).get('/safeplace/requestClaimSafeplace')
    .reply(200, [
      {
        _id: "r1",
        userId: "u1",
        safeplaceId: "s1",
        safeplaceName: "Safeplace 1",
        status: "pending",
        safeplaceDescription: "Description",
        coordinate: [ "1", "1" ],
        userComment: "Commentaire utilisateur",
        adminComment: "Commentaire admin",
        adminId: "a1",
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <RequestClaimSafeplace />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByPlaceholderText("Rechercher une requête de safeplace...")).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Rechercher une requête de safeplace..."), { target: { value: "r1" } });

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

  scope.done();
});

test('ensure that invalid input does not crash the request claim safeplace filtering', async () => {
  const scope = nock(baseURL).get('/safeplace/requestClaimSafeplace')
    .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <RequestClaimSafeplace />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByPlaceholderText('Rechercher une requête de safeplace...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher une requête de safeplace...'), { target: { value: 'eujffeojwefokfewkpo[' } });

  expect(screen.getByDisplayValue('eujffeojwefokfewkpo[')).toBeInTheDocument();

  scope.done();
});

test('ensure that new request creation occurs without technical errors', async () => {
  const scopeGet = nock(baseURL).get('/safeplace/requestClaimSafeplace')
    .reply(200, [], { 'Access-Control-Allow-Origin': '*' });
  const scopePost = nock(baseURL).post('/safeplace/requestClaimSafeplace')
    .reply(201, { message: 'Success' }, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <RequestClaimSafeplace />
    </Provider>
  );

  expect(screen.getByText("Créer une nouvelle requête")).toBeInTheDocument();

  fireEvent.change(screen.getAllByPlaceholderText('Nom')[0], { target: { value: 'Requête 1' } });
  fireEvent.change(screen.getAllByPlaceholderText('Statut')[0], { target: { value: 'pending' } });
  fireEvent.change(screen.getAllByPlaceholderText('Description')[0], { target: { value: 'Description' } });
  fireEvent.change(screen.getAllByPlaceholderText('Latitude')[0], { target: { value: '1' } });
  fireEvent.change(screen.getAllByPlaceholderText('Longitude')[0], { target: { value: '1' } });
  fireEvent.change(screen.getAllByPlaceholderText('ID de safeplace')[0], { target: { value: 's1' } });
  fireEvent.change(screen.getAllByPlaceholderText('ID de propriétaire')[0], { target: { value: 'u1' } });

  fireEvent.click(screen.getByText("Créer une requête"));

  await act(async () => await testDelay(2000));

  scopePost.done();
  scopeGet.done();
});

test('ensure that request update occurs without technical errors', async () => {
  const scopeUpdate = nock(baseURL).put('/safeplace/requestClaimSafeplace/r1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(baseURL).options('/safeplace/requestClaimSafeplace/r1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(baseURL).get('/safeplace/requestClaimSafeplace')
    .reply(200, [
      {
        _id: "r1",
        userId: "u1",
        safeplaceId: "s1",
        safeplaceName: "Safeplace 1",
        status: "pending",
        safeplaceDescription: "Description",
        coordinate: [ "1", "1" ],
        userComment: "Commentaire utilisateur",
        adminComment: "Commentaire admin",
        adminId: "a1",
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <RequestClaimSafeplace />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('usr-btn-15')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('usr-btn-15'));

  expect(screen.getByText('Modifier une requête')).toBeInTheDocument();

  fireEvent.change(screen.getAllByPlaceholderText('Nom')[1], { target: { value: 'Requête 1' } });
  fireEvent.change(screen.getAllByPlaceholderText('Statut')[1], { target: { value: 'pending' } });
  fireEvent.change(screen.getAllByPlaceholderText('Description')[1], { target: { value: 'Description' } });
  fireEvent.change(screen.getAllByPlaceholderText('Latitude')[1], { target: { value: '1' } });
  fireEvent.change(screen.getAllByPlaceholderText('Longitude')[1], { target: { value: '1' } });
  fireEvent.change(screen.getAllByPlaceholderText('ID de safeplace')[1], { target: { value: 's1' } });
  fireEvent.change(screen.getAllByPlaceholderText('ID de propriétaire')[1], { target: { value: 'u1' } });

  fireEvent.click(screen.getByText("Modifier la requête"));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeUpdate.done();
  scopeGet.done();
});

test('ensure that request delete occurs without technical errors', async () => {
  const scopeUpdate = nock(baseURL).delete('/safeplace/requestClaimSafeplace/r1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(baseURL).options('/safeplace/requestClaimSafeplace/r1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(baseURL).get('/safeplace/requestClaimSafeplace')
    .reply(200, [
      {
        _id: "r1",
        userId: "u1",
        safeplaceId: "s1",
        safeplaceName: "Safeplace 1",
        status: "pending",
        safeplaceDescription: "Description",
        coordinate: [ "1", "1" ],
        userComment: "Commentaire utilisateur",
        adminComment: "Commentaire admin",
        adminId: "a1",
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <RequestClaimSafeplace />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('dsr-btn-15')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('dsr-btn-15'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeUpdate.done();
  scopeGet.done();
});