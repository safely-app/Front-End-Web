import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import SafeplaceUpdateMonitor from './SafeplaceUpdateMonitor';
import nock from 'nock';

const testUrl = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('renders monitor', async () => {
  const scopeGet = nock(testUrl)
    .get('/commercial/modif')
    .reply(200, [
      {
        _id: "su1",
        safeplaceId: "s1",
        name: "Marché de Hoenheim",
        description: "Description",
        city: "Strasbourg",
        address: "1 Rue du Grenier à Grain",
        type: "Market",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "48.6212448082", "7.75567703707" ],
        ownerId: "6152cef3487da44a7de8ceb3",
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceUpdateMonitor />
    </Provider>
  );

  await act(async () => testDelay(1000));

  expect(screen.getByPlaceholderText("Rechercher une modification de safeplace...")).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Rechercher une modification de safeplace..."), { target: { value: "r1" } });

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

  scopeGet.done();
});

test('ensure that invalid input does not crash the safeplace update filtering', async () => {
  const scope = nock(testUrl).get('/commercial/modif')
    .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceUpdateMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByPlaceholderText('Rechercher une modification de safeplace...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher une modification de safeplace...'), { target: { value: 'eujffeojwefokfewkpo[' } });

  expect(screen.getByDisplayValue('eujffeojwefokfewkpo[')).toBeInTheDocument();

  scope.done();
});

test('ensure that new update creation occurs without technical errors', async () => {
  const scopeGet = nock(testUrl).get('/commercial/modif')
    .reply(200, [], { 'Access-Control-Allow-Origin': '*' });
  const scopePost = nock(testUrl).post('/commercial/modif')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceUpdateMonitor />
    </Provider>
  );

  expect(screen.getByText("Créer une nouvelle modification")).toBeInTheDocument();

  fireEvent.change(screen.getAllByPlaceholderText('Nom')[0], { target: { value: 'Modif 1' } });
  fireEvent.change(screen.getAllByPlaceholderText('Ville')[0], { target: { value: 'Strasbourg' } });
  fireEvent.change(screen.getAllByPlaceholderText('Adresse')[0], { target: { value: '1 Rue de la Classe' } });
  fireEvent.change(screen.getAllByPlaceholderText('Description')[0], { target: { value: 'Description' } });
  fireEvent.change(screen.getAllByPlaceholderText('Latitude')[0], { target: { value: '1' } });
  fireEvent.change(screen.getAllByPlaceholderText('Longitude')[0], { target: { value: '1' } });
  fireEvent.change(screen.getAllByPlaceholderText('ID de safeplace')[0], { target: { value: 's1' } });
  fireEvent.change(screen.getAllByPlaceholderText('ID de propriétaire')[0], { target: { value: 'u1' } });
  fireEvent.change(screen.getAllByPlaceholderText('Type')[0], { target: { value: 'shop' } });

  fireEvent.click(screen.getByText("Créer une modification"));

  await act(async () => await testDelay(1000));

  scopePost.done();
  scopeGet.done();
});

test('ensure that update of safeplace modif occurs without technical errors', async () => {
  const scopeUpdate = nock(testUrl).put('/commercial/modif/su1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(testUrl).options('/commercial/modif/su1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(testUrl).get('/commercial/modif')
    .reply(200, [
      {
        _id: "su1",
        safeplaceId: "s1",
        name: "Marché de Hoenheim",
        description: "Description",
        city: "Strasbourg",
        address: "1 Rue du Grenier à Grain",
        type: "Market",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "48.6212448082", "7.75567703707" ],
        ownerId: "6152cef3487da44a7de8ceb3",
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceUpdateMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('usu-btn-19')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('usu-btn-19'));

  expect(screen.getByText("Modifier une modification")).toBeInTheDocument();

  fireEvent.change(screen.getAllByPlaceholderText('Nom')[1], { target: { value: 'Modif 1' } });
  fireEvent.change(screen.getAllByPlaceholderText('Ville')[1], { target: { value: 'Strasbourg' } });
  fireEvent.change(screen.getAllByPlaceholderText('Adresse')[1], { target: { value: '1 Rue de la Classe' } });
  fireEvent.change(screen.getAllByPlaceholderText('Description')[1], { target: { value: 'Description' } });
  fireEvent.change(screen.getAllByPlaceholderText('Latitude')[1], { target: { value: '1' } });
  fireEvent.change(screen.getAllByPlaceholderText('Longitude')[1], { target: { value: '1' } });
  fireEvent.change(screen.getAllByPlaceholderText('ID de safeplace')[1], { target: { value: 's1' } });
  fireEvent.change(screen.getAllByPlaceholderText('ID de propriétaire')[1], { target: { value: 'u1' } });
  fireEvent.change(screen.getAllByPlaceholderText('Type')[1], { target: { value: 'shop' } });

  fireEvent.click(screen.getByText("Modifier la modification"));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeUpdate.done();
  scopeGet.done();
});

test('ensure that delete of safeplace modif occurs without technical errors', async () => {
  const scopeDelete = nock(testUrl).delete('/commercial/modif/su1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(testUrl).options('/commercial/modif/su1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(testUrl).get('/commercial/modif')
    .reply(200, [
      {
        _id: "su1",
        safeplaceId: "s1",
        name: "Marché de Hoenheim",
        description: "Description",
        city: "Strasbourg",
        address: "1 Rue du Grenier à Grain",
        type: "Market",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "48.6212448082", "7.75567703707" ],
        ownerId: "6152cef3487da44a7de8ceb3",
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceUpdateMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('dsu-btn-19')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('dsu-btn-19'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeDelete.done();
  scopeGet.done();
});