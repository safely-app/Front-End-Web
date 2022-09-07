import { act, fireEvent, render, screen } from '@testing-library/react';
import Safeplaces, { SafeplacesList } from './Safeplaces';
import { Provider } from 'react-redux';
import { store } from '../../redux';
import nock from 'nock';

const testURL = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

test('renders SafeplacesList', () => {
  const safeplaces = [
    {
      id: "1",
      name: "test",
      description: "test",
      city: "test",
      address: "test address",
      type: "test",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "48", "-56" ],
    }
  ];

  render(
    <Provider store={store}>
      <SafeplacesList
        safeplaces={safeplaces}
        setSafeplace={() => {}}
        removeSafeplace={() => {}}
        searchBarValue=""
        setSearchBarValue={() => {}}
      />
    </Provider>
  );

  expect(screen.getByText("test address")).toBeInTheDocument();
});

test('renders SafeplacesList search bar', () => {
  const setSearchBarValue = jest.fn();
  const safeplaces = [
    {
      id: "s1",
      name: "test",
      description: "test",
      city: "test",
      address: "test address",
      type: "test",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "48", "-56" ],
    }
  ];

  render(
    <Provider store={store}>
      <SafeplacesList
        safeplaces={safeplaces}
        setSafeplace={() => {}}
        removeSafeplace={() => {}}
        searchBarValue=""
        setSearchBarValue={setSearchBarValue}
      />
    </Provider>
  );

  expect(screen.getByRole('searchbox')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: "s1" } });

  expect(setSearchBarValue).toBeCalled();
});

test('SafeplacesList claim safeplace', async () => {
  const safeplaces = [
    {
      id: "1",
      name: "test",
      description: "test",
      city: "test",
      address: "test address",
      type: "test",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "48", "-56" ],
    }
  ];

  const scopeClaim = nock(testURL)
    .post('/safeplace/requestClaimSafeplace')
    .reply(200, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplacesList
        safeplaces={safeplaces}
        setSafeplace={() => {}}
        removeSafeplace={() => {}}
        searchBarValue=""
        setSearchBarValue={() => {}}
      />
    </Provider>
  );

  expect(screen.getByTestId('request-shop-1')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('request-shop-1'));

  await act(async () => await testDelay(1000));

  scopeClaim.done();
});

test('SafeplacesList update info', async () => {
  const safeplaces = [
    {
      id: "s1",
      name: "test",
      description: "test",
      city: "test",
      address: "test address",
      type: "test",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "48", "-56" ],
    }
  ];

  const scopeOptions = nock(testURL).options('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeUpdate = nock(testURL).put('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplacesList
        safeplaces={safeplaces}
        setSafeplace={() => {}}
        removeSafeplace={() => {}}
        searchBarValue=""
        setSearchBarValue={() => {}}
      />
    </Provider>
  );

  expect(screen.getByText("Modifier")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Modifier"));

  expect(screen.getByPlaceholderText("Nom de la safeplace")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Ville")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Adresse")).toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Nom de la safeplace"), { target: { value: "Safeplace 1" } });
  fireEvent.change(screen.getByPlaceholderText("Ville"), { target: { value: "Ville 1" } });
  fireEvent.change(screen.getByPlaceholderText("Adresse"), { target: { value: "Adresse 1" } });

  expect(screen.getByText('Publier les modififications')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Publier les modififications'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeUpdate.done();
});

test('SafeplacesList remove safeplace', async () => {
  const safeplaces = [
    {
      id: "s1",
      name: "test",
      description: "test",
      city: "test",
      address: "test address",
      type: "test",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "48", "-56" ],
    }
  ];

  const scopeOptions = nock(testURL).options('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeDelete = nock(testURL).delete('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplacesList
        safeplaces={safeplaces}
        setSafeplace={() => {}}
        removeSafeplace={() => {}}
        searchBarValue=""
        setSearchBarValue={() => {}}
      />
    </Provider>
  );

  expect(screen.getByText("Modifier")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Modifier"));

  expect(screen.getByText('Dépublier le commerce')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Dépublier le commerce'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeDelete.done();
});

test('SafeplacesList archive safeplace', async () => {
  const safeplaces = [
    {
      id: "s1",
      name: "test",
      description: "test",
      city: "test",
      address: "test address",
      type: "test",
      dayTimetable: [ null, null, null, null, null, null, null ],
      coordinate: [ "48", "-56" ],
    }
  ];

  const scopeOptions = nock(testURL).options('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeDelete = nock(testURL).delete('/safeplace/safeplace/s1')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <SafeplacesList
        safeplaces={safeplaces}
        setSafeplace={() => {}}
        removeSafeplace={() => {}}
        searchBarValue=""
        setSearchBarValue={() => {}}
      />
    </Provider>
  );

  expect(screen.getByText("Modifier")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Modifier"));

  expect(screen.getByText('Archiver le commerce')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Archiver le commerce'));

  await act(async () => await testDelay(1000));

  scopeOptions.done();
  scopeDelete.done();
});

test('render Safeplaces', async () => {
  const scopeGet = nock(testURL).get('/safeplace/safeplace')
    .reply(200, [
      {
        _id: "s1",
        name: "test",
        description: "test",
        city: "test",
        address: "test address",
        type: "test",
        dayTimetable: [ null, null, null, null, null, null, null ],
        coordinate: [ "48", "-56" ],
      }
    ], { 'Access-Control-Allow-Origin': '*' });


  render(
    <Provider store={store}>
      <Safeplaces />
    </Provider>
  );

  await act(async () => testDelay(1000));

  scopeGet.done();
});