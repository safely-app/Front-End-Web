import { render, screen, act, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../redux';
import SafeplaceMonitor from './SafeplaceMonitor';
import {
    displayTimetable,
    splitTimetable,
    displayCoordinates
} from './utils';
import { SafeplaceModal } from './SafeplaceMonitorModal';
import nock from 'nock';
import ISafeplace from '../../interfaces/ISafeplace';

const testUrl = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// SafeplaceMonitor.tsx tests

test('renders monitor', async () => {
  const scope = nock(testUrl).get('/safeplace/safeplace')
    .reply(200, [
      {
        _id: "s1",
        name: "Magasin du cookie stylé",
        city: "Paris",
        address: "12 Avenue de la Poiscaille",
        type: "Top",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "1", "1" ]
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByPlaceholderText("Rechercher une safeplace...")).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Rechercher une safeplace..."), { target: { value: "Top" } });

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

  scope.done();
});

test('ensure that invalid input does not crash the safeplace filtering', async () => {
  const scope = nock(testUrl).get('/safeplace/safeplace')
    .reply(200, [], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByPlaceholderText('Rechercher une safeplace...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher une safeplace...'), { target: { value: 'eujffeojwefokfewkpo[' } });

  expect(screen.getByDisplayValue('eujffeojwefokfewkpo[')).toBeInTheDocument();

  scope.done();
});

test('ensure that safeplace update occurs without technical errors', async () => {
  const scopeUpdate = nock(testUrl).put('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(testUrl).options('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(testUrl).get('/safeplace/safeplace')
    .reply(200, [
      {
        _id: "s1",
        name: "Magasin du cookie stylé",
        city: "Paris",
        address: "12 Avenue de la Poiscaille",
        type: "Top",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "1", "1" ]
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('us-btn-17')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('us-btn-17'));

  expect(screen.getByText('Modifier une safeplace')).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText('Nom'), { target: { value: 'Safeplace 1' } });
  fireEvent.change(screen.getByPlaceholderText('Ville'), { target: { value: 'Strasbourg' } });
  fireEvent.change(screen.getByPlaceholderText('Adresse'), { target: { value: '1 Rue de la Classe' } });
  fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Description' } });
  fireEvent.change(screen.getByPlaceholderText('Latitude'), { target: { value: '42.679' } });
  fireEvent.change(screen.getByPlaceholderText('Longitude'), { target: { value: '87.261' } });

  fireEvent.click(screen.getByText("Modifier la safeplace"));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeUpdate.done();
  scopeGet.done();
});

test('ensure that safeplace delete occurs without technical errors', async () => {
  const scopeDelete = nock(testUrl).delete('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(testUrl).options('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(testUrl).get('/safeplace/safeplace')
    .reply(200, [
      {
        _id: "s1",
        name: "Magasin du cookie stylé",
        city: "Paris",
        address: "12 Avenue de la Poiscaille",
        type: "Top",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "1", "1" ]
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplaceMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('ds-btn-17')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('ds-btn-17'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeDelete.done();
  scopeGet.done();
});



// SafeplaceMonitorModal.tsx test

test('render SafeplaceMonitorModal', () => {
  const setSafeplace = jest.fn();
  const safeplace: ISafeplace = {
    id: "1",
    city: "Strasbourg",
    name: "Safeplace 1",
    description: "Description",
    address: "1 Rue de la Classe",
    dayTimetable: [ null, null, null, null, null, null, null ],
    coordinate: [ "1", "1" ],
    type: "restaurant"
  };

  render(
    <SafeplaceModal
      title=""
      modalOn={true}
      safeplace={safeplace}
      setSafeplace={setSafeplace}
      buttons={[]}
    />
  );
});

test('SafeplaceMonitorModal update coordinates', () => {
  const setSafeplace = jest.fn();
  const safeplace: ISafeplace = {
    id: "1",
    city: "Strasbourg",
    name: "Safeplace 1",
    description: "Description",
    address: "1 Rue de la Classe",
    dayTimetable: [ null, null, null, null, null, null, null ],
    coordinate: [ "1", "1" ],
    type: "restaurant"
  };

  render(
    <SafeplaceModal
      title=""
      modalOn={true}
      safeplace={safeplace}
      setSafeplace={setSafeplace}
      buttons={[]}
    />
  );

  fireEvent.change(screen.getByPlaceholderText('Latitude'), { target: { value: '44.021' } });
  fireEvent.change(screen.getByPlaceholderText('Longitude'), { target: { value: '32.895' } });

  expect(setSafeplace).toBeCalledTimes(2);
});



// utils.ts tests

test('ensure that displayTimetable returns valid information', () => {
  const timetable = [
    null,
    "7h à 13h",
    null,
    null,
    null,
    "7h à 13h",
    null
  ];

  const result = displayTimetable(timetable);
  expect(result).toEqual("Mardi : 7h à 13h | Samedi : 7h à 13h");
});

test('ensure that splitTimetable returns valid information', () => {
  const result = splitTimetable("Mardi : 7h à 13h | Samedi : 7h à 13h");
  expect(result).toEqual([
    null,
    "7h à 13h",
    null,
    null,
    null,
    "7h à 13h",
    null
  ]);
});

test('ensure that displayCoordinate returns valid information', () => {
  const result = displayCoordinates([ "1", "2" ]);
  expect(result).toEqual("1, 2");
});

test('ensure that failing displayCoordinate returns valid information', () => {
  const result = displayCoordinates([]);
  expect(result).toEqual("");
});