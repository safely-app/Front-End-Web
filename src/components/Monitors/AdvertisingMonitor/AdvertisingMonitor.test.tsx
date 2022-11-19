import { render, screen, act, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { store } from '../../../redux';
import { AdvertisingModal } from "./AdvertisingMonitorModal";
import AdvertisingMonitor from "./AdvertisingMonitor";
import IAdvertising from "../../interfaces/IAdvertising";
import ITarget from "../../interfaces/ITarget";
import nock from "nock";

const testUrl = process.env.REACT_APP_SERVER_URL as string;

const testDelay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

test('render AdvertisingMonitor', async () => {
  const scopeTargets = nock(testUrl).get('/commercial/target')
    .reply(200, [
      {
        id: "t1",
        _id: "t1",
        csp: "csp",
        name: "Target 1",
        ageRange: "10-20",
        interests: [ 'shoes' ],
        ownerId: "u1"
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  const scopeAdvertising = nock(testUrl)
    .get('/commercial/advertising')
    .reply(200, [
      {
        id: "a1",
        _id: "a1",
        ownerId: "u1",
        title: "Titre",
        description: "Description",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg",
        targetType: [ 't1' ],
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <AdvertisingMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByPlaceholderText("Rechercher une publicité...")).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Rechercher une publicité..."), { target: { value: "a1" } });

  screen.getAllByText('Annuler').forEach(button => {
    fireEvent.click(button);
  });

  scopeAdvertising.done();
  scopeTargets.done();
});

test('render AdvertisingMonitor create modal', async () => {
  const scopeTargets = nock(testUrl).get('/commercial/target')
    .reply(200, [], { 'Access-Control-Allow-Origin': '*' });
  const scopeGet = nock(testUrl).get('/commercial/advertising')
    .reply(200, [], { 'Access-Control-Allow-Origin': '*' });
  const scopeCreate = nock(testUrl).post('/commercial/advertising')
    .reply(201, {}, { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <AdvertisingMonitor />
    </Provider>
  );

  expect(screen.getByText('Créer une nouvelle publicité')).toBeInTheDocument();

  fireEvent.change(screen.getAllByPlaceholderText("Titre")[0], { target: { value: "Titre" } });
  fireEvent.change(screen.getAllByPlaceholderText("Description")[0], { target: { value: "Description" } });
  fireEvent.change(screen.getAllByPlaceholderText("URL de l'image")[0], { target: { value: "https://image.jpg" } });
  fireEvent.change(screen.getAllByPlaceholderText("ID de propriétaire")[0], { target: { value: "u2" } });
  fireEvent.change(screen.getAllByPlaceholderText('Rechercher une cible...')[1], { target: { value: "Target 1" } });

  fireEvent.click(screen.getByText('Créer une publicité'));

  await act(async () => await testDelay(1000));

  scopeTargets.done();
  scopeCreate.done();
  scopeGet.done();
});

test('render AdvertisingMonitor update modal', async () => {
  const advertisings: IAdvertising[] = [
    {
      id: "a1",
      ownerId: "u1",
      title: "Titre",
      description: "Description",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg",
      targets: [ 't1' ],
      radius: 0,
    }
  ];

  const finalAdvertisings = advertisings.map(advertising => ({
    ...advertising,
    _id: advertising.id,
    targetType: advertising.targets
  }));

  const scopeGet = nock(testUrl).get('/commercial/advertising')
    .reply(200, finalAdvertisings, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(testUrl).options('/commercial/advertising/a1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeUpdate = nock(testUrl).put('/commercial/advertising/a1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeTargets = nock(testUrl).get('/commercial/target')
    .reply(200, [
      {
        id: "t1",
        _id: "t1",
        csp: "csp",
        name: "Target 1",
        ageRange: "10-20",
        interests: [ 'shoes' ],
        ownerId: "u1"
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <AdvertisingMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('ua-btn-9')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('ua-btn-9'));

  expect(screen.getByText('Modifier une publicité')).toBeInTheDocument();

  fireEvent.change(screen.getAllByPlaceholderText("Titre")[0], { target: { value: "Title" } });
  fireEvent.change(screen.getAllByPlaceholderText("Description")[0], { target: { value: "C'est bien" } });
  fireEvent.change(screen.getAllByPlaceholderText("URL de l'image")[0], { target: { value: "https://image.jpg" } });
  fireEvent.change(screen.getAllByPlaceholderText("ID de propriétaire")[0], { target: { value: "u2" } });
  fireEvent.change(screen.getAllByPlaceholderText('Rechercher une cible...')[1], { target: { value: "Target 1" } });

  fireEvent.click(screen.getByText('Modifier la publicité'));

  await act(async () => await testDelay(1000));

  scopeTargets.done();
  scopeOptions.done();
  scopeUpdate.done();
  scopeGet.done();
});

test('render AdvertisingMonitor delete advertising', async () => {
  const advertisings: IAdvertising[] = [
    {
      id: "a1",
      ownerId: "u1",
      title: "Titre",
      description: "Description",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg",
      targets: [ 't1' ],
      radius: 0,
    }
  ];

  const finalAdvertisings = advertisings.map(advertising => ({
    ...advertising,
    _id: advertising.id,
    targetType: advertising.targets
  }));

  const scopeGet = nock(testUrl).get('/commercial/advertising')
    .reply(200, finalAdvertisings, { 'Access-Control-Allow-Origin': '*' });
  const scopeOptions = nock(testUrl).options('/commercial/advertising/a1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeDelete = nock(testUrl).delete('/commercial/advertising/a1')
    .reply(204, {}, { 'Access-Control-Allow-Origin': '*' });
  const scopeTargets = nock(testUrl).get('/commercial/target')
    .reply(200, [
      {
        id: "t1",
        _id: "t1",
        csp: "csp",
        name: "Target 1",
        ageRange: "10-20",
        interests: [ 'shoes' ],
        ownerId: "u1"
      }
    ], { 'Access-Control-Allow-Origin': '*' });

  render(
    <Provider store={store}>
      <AdvertisingMonitor />
    </Provider>
  );

  await act(async () => await testDelay(1000));

  expect(screen.getByTestId('da-btn-9')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('da-btn-9'));

  await act(async () => await testDelay(1000));

  scopeTargets.done();
  scopeOptions.done();
  scopeDelete.done();
  scopeGet.done();
});

test('render AdvertisingMonitorModal', () => {
  const setAdvertising = jest.fn();

  const advertising: IAdvertising = {
    id: "a1",
    title: "Ad 1",
    description: "Nice",
    imageUrl: "https://image.url",
    targets: [ 't1' ],
    ownerId: "u1",
    radius: 0,
  };

  const targets: ITarget[] = [
    {
      id: "t1",
      csp: "csp",
      name: "Target 1",
      ageRange: "10-20",
      interests: [ 'shoes' ],
      ownerId: "u1"
    }
  ];

  render(
    <Provider store={store}>
      <AdvertisingModal
        title=''
        modalOn={true}
        targets={targets}
        advertising={advertising}
        setAdvertising={setAdvertising}
        buttons={[]}
      />
    </Provider>
  );

  expect(screen.getByTestId("dat-btn-0")).toBeInTheDocument();
  fireEvent.click(screen.getByTestId("dat-btn-0"));

  expect(screen.getByPlaceholderText('Rechercher une cible...')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Rechercher une cible...'), { target: { value: "Target 1" } });
  expect(screen.getByTestId('fat-0')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('fat-0'));

  expect(setAdvertising).toBeCalledTimes(2);
});